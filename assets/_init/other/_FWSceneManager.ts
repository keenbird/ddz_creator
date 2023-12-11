import { _decorator, Node as ccNode, director, dynamicAtlasManager, EventTouch, game, Scene, SceneAsset, UITransform } from 'cc';
const { ccclass } = _decorator;
import './../config/_FWSceneConfigs'
import './../config/_FWBundleConfig'
import './../base/_FWClass'
import './../__init'
import { servers_default } from '../../app/config/HttpConfig';

@ccclass('_FWSceneManager')
class _FWSceneManager extends (fw.FWClass) {
    /**切到该场景时传入的参数 */
    private intentData: IntentParam
    /**扩展节点 */
    _extensionsNode: { [key: string]: ccNode } = {}
    /**扩展节点列表 */
    SceneExtensionNode = {
        bg: { name: `bg`, zOrder: 1 },
        main: { name: `main`, zOrder: 2 },
        dialog: { name: `dialog`, zOrder: 3 },
        tip: { name: `tip`, zOrder: 4 },
        loading: { name: `loading`, zOrder: 5 },
        toast: { name: `toast`, zOrder: 6 },
        system: { name: `system`, zOrder: 7 },
        error: { name: `error`, zOrder: 8 },
        touch: { name: `touch`, zOrder: 9 },
    }
    /**基础节点 */
    private _baseNode: ccNode
    /**当前场景配置 */
    public sceneConfig: OneSceneConfig
    /**切到该场景时传入的参数 */
    getIntentData(): IntentParam {
        return this.intentData;
    }
    /**获取当前场景配置*/
    getSceneConfig() {
        return this.sceneConfig;
    }
    /**当前场景的名称 */
    getSceneName(): string {
        return !!this.sceneConfig ? this.sceneConfig.sceneName : ``;
    }
    /**是否处于游戏场景 */
    isGameScene() {
        return !!this.sceneConfig ? this.sceneConfig.bGame == true : false;
    }
    /**获取当前场景 */
    getScene(): Scene | null {
        return director.getScene();
    }
    /**切换场景，默认会清理原先的弹框等界面 */
    changeScene(sceneConfig: OneSceneConfig, intentData: IntentParam = {}): void {
        //保存上一个场景的名字
        app.runtime.lastSceneType = this.sceneConfig ? this.sceneConfig.sceneName : "";
        //当前场景不重复切换
        if (this.sceneConfig == sceneConfig) {
            this.intentData = this.intentData ?? {};
            if (this.sceneConfig.sceneName == this.getScene().name) {
                let scene = this.getScene();
                Promise.resolve().then(() => {
                    this.intentData.callback?.(null as any, scene);
                });
            }
            return;
        }
        //扩展参数
        this.intentData = intentData;
        //如果前面的场景是游戏场景则检测是否需要退出房间
        if (this.sceneConfig && this.sceneConfig.bGame) {
            //TODO
        }
        //记录当前场景的配置
        this.sceneConfig = sceneConfig;
        //是否清理所有的弹框界面（dialog, toast, loading, system, error等），默认清理
        if (this.intentData.bCleanAllView ?? true) {
            app.popup.closeAllDialog();
            app.popup.closeAllToast();
            app.popup.closeAllTip();
        }
        //是否是子包
        if (sceneConfig.bSubPackage) {
            app.assetManager.loadBundle(sceneConfig.bundleConfig,bundle => {
                bundle.loadScene(sceneConfig.sceneName, (errEx, resEx) => {
                    if (errEx) {
                        fw.printError(errEx);
                    } else {
                        this.runScene(resEx, sceneConfig, this.intentData.callback);
                    }
                });
            })
        } else {
            director.loadScene(sceneConfig.sceneName, (err, res) => {
                if (err) {
                    fw.printError(err);
                } else {
                    this.runScene(res, sceneConfig, this.intentData.callback);
                }
            });
        }
    }
    /**设置常驻节点（基础节点，用于显示各种界面） */
    setBaseNode(node: ccNode): void {
        //节点是否有效
        if (!fw.isValid(node)) {
            fw.printError(`_FWSceneManager setBaseNode error`);
            return;
        }
        //是否更换基础节点
        if (this._baseNode != node) {
            this._baseNode = node;
            this.initExtensionsNode();
        }
        //默认添加一个背景界面
        app.popup.showBg({ viewConfig: fw.BundleConfig.resources.res[`ui/bg/bg_common`] });
    }
    /**添加扩展节点 */
    initExtensionsNode(): void {
        //遍历添加
        let list = [];
        app.func.traversalObject(this.SceneExtensionNode, element => {
            list.push(element);
        });
        list.sort((a, b) => {
            return a.zOrder - b.zOrder;
        });
        list.forEach(element => {
            let oldNode = this._baseNode.getChildByName(element.name);
            if (fw.isValid(oldNode)) {
                oldNode.removeFromParent(true);
            }
            this.addOneExtensionNode(element);
        });
    }
    /**获取扩展节点 */
    getExtensionNode(name: string | OneSceneExtensionNode): ccNode {
        let tempName = ``;
        if (typeof (name) == `string`) {
            tempName = name;
        } else {
            tempName = name.name;
        }
        let node = null;
        //配置是否存在
        let nodeConfig = this.SceneExtensionNode[tempName];
        if (!nodeConfig) {
            fw.printError(`_FWSceneManager getExtensionNode error`, name);
            return node;
        }
        //基础节点是否有效
        if (!fw.isValid(this._baseNode)) {
            fw.printError(`_FWSceneManager getExtensionNode error _baseNode is inValid`);
            return node;
        }
        //节点是否已经添加
        node = this._extensionsNode[nodeConfig.name];
        if (!fw.isValid(node)) {
            node = this.addOneExtensionNode(nodeConfig);
        }
        return node;
    }
    /**返回键回调 */
    onKeyboardForKeyback(): boolean {
        //弹框
        if (app.popup.closeError() != false
            || app.popup.closeSystem() != false
            || app.popup.closeLoading(app.popup.getCurLoading()) != false
            || app.popup.closeTip(app.popup.getCurTip()) != false
            || app.popup.closeDialog(app.popup.getCurDialog()) != false
        ) {
            return true;
        }
        return false;
    }
    //添加一个扩展节点
    private addOneExtensionNode(config: OneSceneExtensionNode): void {
        let node = new ccNode(config.name);
        app.func.setWidget({ node: node });
        this._extensionsNode[config.name] = node;
        this._baseNode.insertChild(node, config.zOrder);
        //是否存在touch层
        if (config.name == `touch`) {
            this.addTouchEvent(node);
        }
    }
    /**运行场景 */
    private runScene(scene: Scene | SceneAsset, sceneConfig: OneSceneConfig, callback?: Function): void {
        //场景异常不处理
        if (this.sceneConfig != sceneConfig) {
            return;
        }
        let toDo = () => {
            //获取老场景
            let oldScene = this.getScene();
            //加载新场景
            director.runScene(scene, null, (err, scene) => {
                if (err) {
                    fw.printError(err);
                } else {
                    //调整帧率
                    game.frameRate = this.sceneConfig.frameRate ?? 59;
                    //清理动态图集
                    dynamicAtlasManager.reset();
                    //释放老场景
                    fw.isValid(oldScene) && oldScene.destroy();
                }
                //回调
                callback?.(err, scene);
            });
        }
        if (this.sceneConfig.preloadList) {
            //显示预加载界面
            app.popup.showDialog({
                viewConfig: fw.BundleConfig.resources.res[`ui/load/load`],
                data: {
                    list: {
                        bundleConfig: this.sceneConfig.bundleConfig,
                        preloadList: this.sceneConfig.preloadList,
                    },
                    callback: toDo,
                }
            });
        } else {
            toDo();
        }
    }
    /**切换大厅热更新界面 */
    changePlazaUpdate(intentData: IntentParam = {}) {
        //断开连接
        center.login.closeConnect();
        let callback = intentData.callback;
        intentData.callback = (err, scene) => {
            //调整主界面
            if (fw.DEBUG.bSelectServer) {
                app.popup.showMain({
                    viewConfig: fw.BundleConfig.update.res["selectServer/selectServer"]
                });
            } else {
                center.login.selectServer(servers_default);
            }
            callback?.(err, scene);
        }
        fw.scene.changeScene(fw.SceneConfigs.update, intentData);
    }
    /**切换游戏热更新界面 */
    changeGameUpdate(intentData: IntentParam = {}) {
        fw.scene.changeScene(fw.SceneConfigs.update, intentData);
    }
    /**监听最上层TOUCH_START事件 */
    addTouchEvent(node: ccNode) {
        //EventTouch对象
        //preventSwallow: 设置是否阻止事件被节点吞噬, 默认为 false 。如果设置为 true，则事件允许派发给渲染在下一层级的节点。注意：设置为 true 会降低事件派发的效率。
        [
            {
                eventName: ccNode.EventType.TOUCH_START, callback: (event: EventTouch) => {
                    app.event.dispatchEvent({
                        eventName: `Touch`,
                    });
                }
            },
            {
                eventName: ccNode.EventType.TOUCH_MOVE, callback: (event: EventTouch) => { }
            },
            {
                eventName: ccNode.EventType.TOUCH_END, callback: (event: EventTouch) => { }
            },
            {
                eventName: ccNode.EventType.TOUCH_CANCEL, callback: (event: EventTouch) => { }
            },
            {
                eventName: ccNode.EventType.MOUSE_DOWN, callback: (event: EventTouch) => { }
            },
            {
                eventName: ccNode.EventType.MOUSE_MOVE, callback: (event: EventTouch) => { }
            },
            {
                eventName: ccNode.EventType.MOUSE_UP, callback: (event: EventTouch) => { }
            },
            {
                eventName: ccNode.EventType.MOUSE_ENTER, callback: (event: EventTouch) => { }
            },
            {
                eventName: ccNode.EventType.MOUSE_LEAVE, callback: (event: EventTouch) => { }
            },
            {
                eventName: ccNode.EventType.MOUSE_WHEEL, callback: (event: EventTouch) => { }
            }
        ].forEach(element => {
            node.on(element.eventName, (event: EventTouch) => {
                event.preventSwallow = true;
                element.callback?.(event);
            });
        });
    }
}

/**类型声明调整 */
declare global {
    namespace globalThis {
        /**单个场景扩展节点配置 */
        type OneSceneExtensionNode = {
            /**节点名称 */
            name: string
            /**节点深度 */
            zOrder: number
        }
        /**切场景附加参数 */
        type IntentParam = {
            /**是否清理所有界面 */
            bCleanAllView?: boolean
            /**回调函数 */
            callback?: (err: any, scene: Scene) => void
        }
    }
}

declare global {
    namespace globalThis {
        interface _fw {
            scene: _FWSceneManager
        }
    }
}
fw.scene = new _FWSceneManager();
