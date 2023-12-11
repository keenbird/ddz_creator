import { find } from "cc"
import { instantiate, Prefab, Node as ccNode } from "cc"

export interface UIInfo {
    strPath: string
    class: typeof UIBase
    parentPath?: string
}

export class UIManager<T = any> extends (fw.FWComponent) implements UIManagerBase {
    id: T
    config: Map<number, UIInfo>
    //已经初始化后的UI
    m_mapInitializedUI = new Map<number,UIBase>;
    //正在显示的UI
    m_mapShowUIID = {};
    /**
     * ui 的自增id
     * @param UIID 
     */
    init(UIID: T, config: Map<number, UIInfo>) {
        this.id = UIID
        this.config = config
        for (let key in this.id) {
            let id = this.id[key]
            if (typeof id == 'number') {
                // 初始化配置
                let config = this.config.get(id);
                if (config) {
                    config.parentPath = config.parentPath || "ui";
                }
            }
        }
        return this
    }
    /**
     * 检测并初始化ui
     * @param UIID 
     * @returns 
     */
    checkInit(UIID: number) {
        if (this.m_mapInitializedUI.has(UIID))
            return this.m_mapInitializedUI.get(UIID);

        let uiInfo = this.config.get(UIID);
        let res: Prefab = this.loadBundleResSync(app.gameManager.getRes(uiInfo.strPath))
        //实例化对象
        let node = instantiate(res);
        let parent = this.node;
        if (uiInfo.parentPath) {
            let specialParent = find(uiInfo.parentPath, this.node)
            if (specialParent) {
                parent = specialParent;
            }
        }

        parent.addChild(node);
        //初始化ui ctr
        let uibase = node.obtainComponent(uiInfo.class);
        this.m_mapInitializedUI.set(UIID,uibase);
        uibase.bindManager(this, UIID);
        return uibase;
    }

    //显示UI
    showUI(UIID: number, pData = {}) {

        if (this.isShow(UIID)) {
            return;
        }

        this.m_mapShowUIID[UIID] = true;

        let pUIUnit: UIBase = this.checkInit(UIID)
        pUIUnit.node.active = true;
        pUIUnit.onShow(pData);
    }

    getUI(UIID: number) {
        return this.m_mapInitializedUI.get(UIID);
    }
    //是否正在显示
    isShow(UIID: number) {
        return this.m_mapShowUIID[UIID] == true;
    }

    hideUI(UIID: number, bClear: boolean = true) {
        if (!this.isShow(UIID)) {
            return;
        }
        this.m_mapShowUIID[UIID] = false;

        let pUIUnit = <UIBase>this.m_mapInitializedUI.get(UIID)
        pUIUnit.onHide();
        pUIUnit.node.active = false;

        if (bClear) {
            this.removeUI(UIID)
            pUIUnit.node.removeFromParent(true);
        }
    }
    /**
     * 删除ui
     * @param UIID 
     */
    removeUI(UIID: number) {
        if (!this.m_mapInitializedUI.has(UIID)) {
            return;
        }
        this.m_mapInitializedUI.delete(UIID);
        delete this.m_mapShowUIID[UIID];
    }

    onViewDestroy(): void {
        this.m_mapInitializedUI.forEach(v=>{
            if(fw.isValid(v))
                v.destroy()
        })
    }
}

interface UIManagerBase {
    removeUI: (UIID: number) => void,
    hideUI: (UIID: number, bClear?: boolean) => void,
}
export class UIBase extends (fw.FWComponent) {
    private id: number;
    private mgr: UIManagerBase
    private _bClear: boolean = false;
    bindManager(mgr: UIManagerBase, id: number) {
        this.mgr = mgr;
        this.id = id
    }

    onShow(...params) {

    }

    onHide(...params) {

    }

    onClickHide() {
        this.hide();
    }

    hide(bClear = true) {
        this.mgr.hideUI(this.id, bClear);
    }

    hideAnim(bClear = true) {
        this._bClear = bClear;
        this.onHideAnimStart();
    }

    onHideAnimStart() {
        this.onHideAnimEnd();
    }

    onHideAnimEnd() {
        this.mgr.hideUI(this.id, this._bClear);
    }
}