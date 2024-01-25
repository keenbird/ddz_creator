import { _decorator, Size, Node as ccNode, view, profiler, director, native, assetManager, game, sys } from 'cc';
const { ccclass } = _decorator;

import { Md5 } from './external/ts-md5/md5';
import { CenterManager } from '../center/center';
import { JumpManager } from './manager/JumpManager';
import { SockManager } from './manager/SockManager';
import { FWGameManager } from './game/FWGameManager';
import { FWFunctionUI } from './manager/FWFunctionUI';
import { FWHttpManager } from './manager/FWHttpManager';
import { FWFileManager } from './manager/FWFileManager';
import { FWEventManager } from './manager/FWEventManager';
import { FWAssetManager } from './manager/FWAssetManager';
import { FWAudioManager } from './manager/FWAudioManager';
import { FWPopupManager } from './manager/FWPopupManager';
import { RuntimeManager } from './manager/RuntimeManager';
import { FWDownloader } from './manager/FWDownloader';
import { FWFunctionCommon } from './manager/FWFunctionCommon';
import { FWCommonInterface } from './manager/FWCommonInterface';
import { FWLoadByFrameManager } from './manager/FWLoadByFrameManager';
import { DynamicActivityManager } from './manager/DynamicActivityManager';
import { SDKManager } from './manager/SDKManager';
import { SDKBase } from './sdk/SDKBase';
import { NativeIOS } from './native/NativeIOS';
import { NativeBase } from './native/NativeBase';
import { NativeAndroid } from './native/NativeAndroid';
import { NativeWindows } from './native/NativeWindows';
import { NativeWechat } from './native/NativeWechat';
import { FWSceneBase } from './view/FWSceneBase';
import { servers_default } from '../../app/config/HttpConfig';

@ccclass('Application')
export class Application extends FWSceneBase {
    /**界面大小（只会在游戏初始化时赋值一次，后续不覆盖（旋转屏幕不会刷新）） */
    private _initWinSize: Size
    get initWinSize(): Size {
        return this._initWinSize ??= view.getVisibleSize();
    }
    /**当前界面大小（实时，旋转屏幕后width和height颠倒） */
    get winSize(): Size {
        return view.getVisibleSize();
    }
    /**是否为刘海屏 */
    get isIphoneX(): boolean {
        return view.getVisibleSize().width / view.getVisibleSize().height > 2
    }
    /**原生 */
    nativeBase: any
    /**初始化 */
    constructor(...args: any[]) {
        super(...args);
        //全局调用初始化
        globalThis.app = this;
    }
    initView() {
        if (app.func.isAndroid()) {
            fw.print("isAndroid");
        } else if (app.func.isIOS()) {
            fw.print("isIOS");
        } else if (app.func.isWeChat()) {
            fw.print("isWeChat");
        } else {
            fw.print("isWindows");
        }
        jsb?.device.setKeepScreenOn(true);
        //是否显示FPS等相关数据
        if (!fw.isNull(profiler)) {
            fw.DEBUG.bDisplayStats ? profiler.showStats() : profiler.hideStats();
        }
        //调整缓存路径
        app.file.setAllHotUpdatePath();
        //场景首次初始化
        fw.scene.setBaseNode(this.node);
        //设置常驻节点
        director.addPersistRootNode(this.node);
        //部分独立组件--------began-----------
        // if (sys.isNative) {
        //     this.nativeBase = sys.isNative && app.func.isAndroid() ? NativeAndroid : app.func.isIOS() ? NativeIOS : NativeWindows;
        if (app.func.isWeChat()) {
            this.nativeBase = NativeWechat;
        } else {
            this.nativeBase = NativeWindows;
        }
        this.native;
        //数据管理组件 负责网络通信 和 数据保存
        this.obtainComponent(CenterManager);
        //点击事件和事件分发
        this.event;
        //部分独立组件--------end-------------
        //预加载部分资源
        this.preloadRes();
    }
    public get native() {
        return this.obtainComponent<NativeBase>(this.nativeBase);
    }
    public get downloader() {
        return this.obtainComponent(FWDownloader);
    }
    public get gameManager() {
        return this.obtainComponent(FWGameManager);
    }
    public get game() {
        return this.gameManager.game;
    }
    public get dynamicActivity() {
        return this.obtainComponent(DynamicActivityManager);
    }
    public get socket() {
        return this.obtainComponent(SockManager);
    }
    public get loadByFrame() {
        return this.obtainComponent(FWLoadByFrameManager);
    }
    public get jump() {
        return this.obtainComponent(JumpManager);
    }
    /**运行时数据 */
    public get runtime() {
        return this.obtainComponent(RuntimeManager);
    }
    public get sdk(): SDKBase {
        return this.obtainComponent(SDKManager.getSdkClass());
    }
    public get func() {
        let f: FWFunctionCommon & FWFunctionUI = (<any>this)._func;
        if (!f) {
            f = (<any>this)._func = new Proxy(<any>{
                _data: [
                    this.obtainComponent(FWFunctionUI),
                    this.obtainComponent(FWFunctionCommon),
                ],
                _cache: {},
            }, {
                get: (target, p, receiver) => {
                    if (!target._cache[p]) {
                        let value: any;
                        for (let i = 0, j = target._data.length; i < j; ++i) {
                            value = target._data[i][p];
                            if (value != null) {
                                if (typeof (value) == `function`) {
                                    target._cache[p] = value.bind(target._data[i]);
                                } else {
                                    target._cache[p] = value;
                                }
                                break;
                            }
                        }
                    }
                    return target._cache[p];
                },
            });
        }
        return f;
    }
    public get interface() {
        return this.obtainComponent(FWCommonInterface);
    }
    public get http() {
        return this.obtainComponent(FWHttpManager);
    }
    public get audio() {
        return this.obtainComponent(FWAudioManager);
    }
    public get event() {
        return this.obtainComponent(FWEventManager);
    }
    public get popup() {
        return this.obtainComponent(FWPopupManager);
    }
    /**md5库（用于字符串md5） */
    public get md5() {
        return Md5;
    }
    public get file(): FWFileManager & typeof native.fileUtils {
        let file = (<any>this).__file;
        if (!file) {
            file = new Proxy(this.obtainComponent(FWFileManager), {
                get(target: FWFileManager, p: AnyKeyType, receiver: any) {
                    let value = Reflect.get(target, p, receiver);
                    //自定义file工具找不到时，尝试在native.fileUtils中查找
                    if (fw.isNull(value) && app.func.isNative()) {
                        //native.fileUtils
                        value = native.fileUtils[p];
                        //值是否是function
                        if (!fw.isNull(value)) {
                            if (typeof (value) == `function`) {
                                value = value.bind(native.fileUtils);
                            }
                        }
                    }
                    return value;
                },
            });
            (<any>this).__file = file;
        }
        return file;
    }
    public get assetManager(): FWAssetManager & typeof assetManager {
        let am = (<any>this).__assetManager;
        if (!am) {
            am = new Proxy(this.obtainComponent(FWAssetManager), {
                get(target: FWAssetManager, p: AnyKeyType, receiver: any) {
                    let value = Reflect.get(target, p, receiver);
                    //自定义FWAssetManager工具找不到时，尝试在assetManager中查找
                    if (fw.isNull(value)) {
                        //assetManager
                        value = assetManager[p];
                        //值是否是function
                        if (!fw.isNull(value)) {
                            if (typeof (value) == `function`) {
                                value = value.bind(assetManager);
                            }
                        }
                    }
                    return value;
                },
            });
            (<any>this).__assetManager = am;
        }
        return am;
    }
    /**去往更新场景 */
    gotoUpdateScene() { 
   
        fw.scene.changeScene(fw.SceneConfigs.login, {
            callback : (err, scene)=>{
                //调整主界面
                if (fw.DEBUG.bSelectServer || app.func.isBrowser()) {
                    app.popup.showDialog({
                        viewConfig: fw.BundleConfig.login.res["selectServer/selectServer"]
                    });
                } else {
                    center.login.selectServer(servers_default);
                }
            }
        });
        //关闭闪屏界面
        // this.native.device.hideSplashView();
    }
    
    /**预加载部分资源 */
    preloadRes() {
        let nNowCount = 0;
        let list = app.func.isWin32() ? [
            fw.BundleConfig.resources.res[`shader`],
            fw.BundleConfig.resources.res[`ui/loading/loading_common`],
            fw.BundleConfig.resources.res[`ui/toast/toast_common`],
        ] : [
            fw.BundleConfig.resources.res[`shader`],
            fw.BundleConfig.resources.res[`ui`],
        ];
        if(list.length == 0){
            this.gotoUpdateScene()
        }else{
            /**添加预加载参数，由于使用的是bundle.loadDir，所以资源加载后可通过bundle.get同步获取 */
            list.forEach(preloadParam => {
                //先加在子包
                this.loadBundle(preloadParam,(bundle) => {
                    bundle.loadDir(
                        preloadParam.path,
                        (err, res) => {
                            if (err) {
                                fw.printError(err);
                            } else {
                                ++nNowCount >= list.length && this.gotoUpdateScene();
                            }
                        }
                    );
                });
            });
        }
        
    }
    /**重启游戏 */
    restart() {
        game.restart();
    }
}

declare global {
    namespace globalThis {
        var app: Application
    }
}
