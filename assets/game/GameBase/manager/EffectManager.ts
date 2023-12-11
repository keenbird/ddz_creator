import { Tween, find, isValid, tween } from "cc";
import { instantiate, Prefab, Node as ccNode } from "cc"
import { NodePool, NodePoolBase } from "./NodePool";


export interface IEffectConfig {
    strPath: string;//预设路径
    class: typeof EffectBase,// 控制类
    parentPath?: string;// 父节点路径
    parentNode?: ccNode;// 父节点缓存
    preCacheEffect?: number;//预缓存个数
}
export interface IEffectData {
    [index: string]: any;
    callback?: Function;
}

interface IEffectManager {
    stopEffect: (ctrl: EffectBase) => void,
}
export class EffectManager<T = any> extends (fw.FWComponent) implements IEffectManager {
    id: T
    config: Map<number, IEffectConfig>
    //特效缓存
    m_tblCacheEffect = new Map<number, NodePool>();
    //特效自增id
    m_nEffectNumber = 0;
    //删除特效自增id
    m_nEffectDelNumber = 0;
    //特效映射表
    m_mapEffect = new Map<number, EffectBase>();
    //缓动动画自增id
    m_nTweenNumber = 0;
    //缓动动画映射表
    m_mapTween = new Map<number, Tween<any>>();
    initCacheEffectByFrame: Generator<any, void, number>;

    init(effectID: T, config: Map<number, IEffectConfig>) {
        this.id = effectID
        this.config = config
        for (let key in this.id) {
            let eEffectID = this.id[key]
            if (typeof eEffectID == 'number') {
                // 初始化配置
                let config = this.config.get(eEffectID);
                if (config) {
                    this.m_tblCacheEffect.set(eEffectID, new NodePool());
                    config.preCacheEffect = config.preCacheEffect || 0;
                    config.parentPath = config.parentPath || "effect";
                    config.parentNode = null;
                }
            }
        }
        this.initCacheEffectByFrame = this.preCacheEffect(app.func.millisecond());
        return this
    }

    * preCacheEffect(startTimes:number) {
        for (let [eEffectID, pool] of this.m_tblCacheEffect) {
            let config = this.config.get(eEffectID);
            if (config) {
                let preCacheEffect = config.preCacheEffect;
                for (let index = 0; index < preCacheEffect; index++) {
                    try {
                        pool.put(this.newEffect(eEffectID));
                        if(app.func.millisecond() - startTimes > 2) startTimes = yield;
                    } catch (error) {
                        fw.printError(error)
                    }
                }
            }
        }
    }

    protected lateUpdate(dt: number): void {
        if(this.initCacheEffectByFrame && this.initCacheEffectByFrame.next(app.func.millisecond()).done) {
            this.initCacheEffectByFrame = null;
        }
    }

    newEffect(eEffectID: number) {
        let config = this.config.get(eEffectID);
        if (config) {
            let res = this.loadBundleResSync(app.gameManager.getRes(config.strPath),Prefab)
            //实例化对象
            let node = instantiate(res);
            let ctrl = node.obtainComponent(config.class);
            ctrl.bindManager(this, eEffectID)
            return node;
        } else {
            throw("config is null")
        }
    }

    private _playEffect(node: ccNode, effectNumber: number, actionData: IEffectData) {
        let ctrl = node.getComponent(EffectBase);
        let config = this.config.get(ctrl.effectID);
        // 设置特效标记
        ctrl.effectNumber = effectNumber;
        this.m_mapEffect.set(effectNumber, ctrl);
        // 添加父节点
        let parent = this.node;
        if (config.parentPath) {
            if(!config.parentNode) {
                config.parentNode = find(config.parentPath, this.node)
            }
            if (config.parentNode) {
                parent = config.parentNode;
            }
        }
        parent.addChild(node);
        // 开始播放
        ctrl.startPlay(actionData);
    }

    playEffect(eEffectID: number, actionData: IEffectData = {}) {
        let pool = this.m_tblCacheEffect.get(eEffectID);
        let node = pool.get()
        let effectNumber = ++this.m_nEffectNumber
        if (node) {
            this._playEffect(node, effectNumber, actionData)
        } else {
            try {
                this._playEffect(this.newEffect(eEffectID), effectNumber, actionData);
            } catch (error) {
                fw.printError(error)
            }
        }
        return effectNumber;
    }

    getCacheEffect(eEffectID: number) {
        let pool = this.m_tblCacheEffect.get(eEffectID);
        return pool.size();
    }

    stopEffect(ctrl: EffectBase) {
        this.stopEffectNumber(ctrl.effectNumber);
    }

    stopEffectID(effectID: number) {
        let deleteKeys: EffectBase[] = []
        for (let ctrl of this.m_mapEffect.values()) {
            if(ctrl.effectID == effectID) {
                deleteKeys.push(ctrl);
            }
        }
        deleteKeys.forEach(ctrl => {
            this.stopEffect(ctrl);
        });
    }

    stopEffectNumber(nEffectNumber) {
        let ctrl = this.m_mapEffect.get(nEffectNumber);

        if (ctrl == null) {
            return;
        }

        this.m_nEffectDelNumber++;

        this.m_mapEffect.delete(nEffectNumber);

        ctrl.stopPlay();

        let pool = this.m_tblCacheEffect.get(ctrl.effectID);
        let config = this.config.get(ctrl.effectID);
        if (config) {
            pool.put(ctrl.node);
        }
    }

    stopAllEffect() {
        for (let ctrl of this.m_mapEffect.values()) {
            this.m_nEffectDelNumber++;

            ctrl.stopPlay();

            let pool = this.m_tblCacheEffect.get(ctrl.effectID);
            let config = this.config.get(ctrl.effectID);
            if (config) {
                pool.put(ctrl.node);
            }
        }
        this.m_mapEffect.clear();
    }

    playTween<T>(target?:T) {
        let anim = tween(target);
        let tweenNumber = ++this.m_nTweenNumber;
        this.m_mapTween.set(tweenNumber,anim);
        return anim;
    }

    stopTween<T>(anim:Tween<T>) {
        anim.stop();
    }

    stopAllTween() {
        this.m_mapTween.forEach(v=>{
            v.stop();
        })
        this.m_mapTween.clear();
    }

    onViewDestroy() {
        // 未回收的节点会被自动释放
        // this.stopAllEffect();
        for (let pool of this.m_tblCacheEffect.values()) {
            pool.clear();
        }
        fw.print("EffectManager", this.m_nEffectNumber, this.m_nEffectDelNumber);
        super.onViewDestroy();
    }
}

export class EffectBase extends NodePoolBase {
    static nIndex: number = 0
    private _effectID: number;//特效ID
    effectNumber: number;//特效编号
    animCallback: Function;
    private mgr: IEffectManager

    bindManager(mgr: IEffectManager, effectID: number) {
        this.mgr = mgr
        this._effectID = effectID
    }

    get effectID() {
        return this._effectID
    }

    onLoad() {
        super.onLoad();
    }

    startPlay(iniData:IEffectBaseData) {
        this.animCallback = iniData.callback;
        this.onStartPlay(iniData);
    }

    stopPlay() {
        this.onStopPlay();
    }

    onStartPlay(iniData) {

    }

    onStopPlay() {

    }

    callPlayFinish() {
        if (this.animCallback) {
            this.animCallback();
        }
        this.mgr.stopEffect(this);
    }
}

export interface IEffectBaseData {
    callback?:Function
}