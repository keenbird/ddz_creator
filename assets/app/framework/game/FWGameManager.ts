
import { js, _decorator, Node as ccNode } from 'cc';
const { ccclass } = _decorator;

import { httpConfig } from '../../config/HttpConfig';
import { GameData } from '../../../_init/config/_FWGameConfigs';
import { _FWHotUpdateManager, _UpdateGame } from '../../../_init/hotupdate/_FWHotUpdateManager';
// import { IEndUpdateCallbackData } from '../../../update/update';

@ccclass('FWGameManager')
export class FWGameManager extends (fw.FWComponent) {
    private secret: string = `aiwan2019`
    //获取游戏实例
    public gameConfig: OneGameConfig
    //进游戏附加参数
    public gameData: GameData = {
        nServerID : 0
    }
    //要进的房间ID
    public room_id: number
    //获取游戏实例
    public game: type_game_GameBase
    //是否重连
    public isComeback: boolean
    //getRes缓存
    private searchResCache: Map<string, BundleResConfig> = new Map();
    /**是否处于测试状态 */
    _isTest: boolean = false
    /**是否是测试状态 */
    get isTest() {
        return app.func.isWin32() && this._isTest;
    }
    set isTest(isTest: boolean) {
        this._isTest = isTest ?? false;
    }
    /**检测更新 */
    async checkGameUpdate(data: CheckGameUpdateParam) {
        if (!fw.DEBUG.bGameUpdate || app.func.isWin32()) {
            //不需要更新
            !!data.callback && data.callback(false);
            return
        }
        let needCheckGameQueue = this.getRelyGameConfigs(data.gameConfig);
        //获取服务器版本号
        let serverVersion: { [key: number | string]: number | string } = await this.getServerGameVersion();
        let needUpdateHotUpdateManagerQueue: _FWHotUpdateManager[] = [];
        for (const oneGameConfig of needCheckGameQueue) {
            const nVersion = serverVersion[oneGameConfig.gameId];
            if (!fw.isNull(nVersion)) {
                let manager = fw.FWHotUpdateManager.getOnce(<HotUpdateConfigs>{
                    bundleConfig: oneGameConfig.bundleConfig,
                    newVersion: nVersion.toString(),
                });
                let { nLocalVersion } = await manager.getLocalVersion();
                if (manager.compareVersion(nLocalVersion)) {
                    fw.print("not update");
                    manager.destroy();
                } else {
                    fw.print("update");
                    needUpdateHotUpdateManagerQueue.push(manager);
                }
            } else {
                fw.printError("serverVersion not exist", oneGameConfig);
            }
        }
        fw.print("needUpdateHotUpdateManagerQueue length", needUpdateHotUpdateManagerQueue.length);
        if (needUpdateHotUpdateManagerQueue.length > 0) {
            //关闭进房间加载中
            app.popup.closeLoading();
            fw.scene.changeGameUpdate({
                callback: () => {
                    //检测更新
                    app.popup.showLoading();
                    needCheckGameQueue.forEach(v => {
                        let bundleName = v.bundleConfig.bundleName;
                        //卸载此前加载的子包
                        app.assetManager.unloadBundle(bundleName);
                    });
                    //删除路径缓存
                    app.file.purgeCachedEntries();
                    if (data.callback) {
                        //恢复关闭的loading
                        app.popup.showLoading();
                        data.callback(true);
                    } else {
                        fw.scene.changeScene(fw.SceneConfigs.plaza);
                    }
                }
            });
        } else {
            //不需要更新
            !!data.callback && data.callback(false);
        }
    }
    /**获得游戏所需全部依赖配置 */
    getRelyGameConfigs(config: OneGameConfig) {
        let relyGameConfigs: OneGameConfig[] = [];
        while (config.relyGame) {
            relyGameConfigs.push(config);
            config = fw.GameConfigs[config.relyGame];
        }
        relyGameConfigs.push(config);
        return relyGameConfigs;
    }
    /**检测依赖bundle是否加载 */
    checkAndLoadGameBundles(data: CheckGameLoadParam) {
        let func = () => {
            app.assetManager.loadBundle(data.gameConfig.bundleConfig, () => {
                //加载完成
                data.callback?.();
            });
        }
        //是否依赖子游戏
        if (data.gameConfig.relyGame) {
            //加载依赖子游戏
            this.checkAndLoadGameBundles({
                gameConfig: fw.GameConfigs[data.gameConfig.relyGame],
                callback: func
            });
        } else {
            func();
        }
    }
    /**获取服务器子游戏版本号 */
    getServerGameVersion() {
        return new Promise<{ [key: number | string]: number | string }>((resolve, reject) => {
            let channel = app.native.device.getOperatorsID();
            app.http.get({
                url: httpConfig.path_pay + `update/getVersion`,
                params: {
                    channel: channel,
                    sign: app.md5.hashStr(channel + this.secret),
                    os: app.func.isAndroid() ? `android` : `ios`,
                },
                callback: (bSuccess, response) => {
                    if (bSuccess) {
                        resolve(response.games);
                    } else {
                        reject("version download fail");
                    }
                }
            });
        });
    }
    /**前往游戏 */
    gotoGame(gameConfig: number | string | OneGameConfig, room_id: number,isComeback:boolean) {
        //转换为游戏配置
        gameConfig = this.getGameConfig(gameConfig);
        this.isComeback = isComeback
        //判断是否需要切换场景
        let isSameGame = this.gameConfig && this.gameConfig.gameName == gameConfig.gameName;
        //卸载子包资源
        if (this.gameConfig && this.gameConfig.gameName != gameConfig.gameName) {
            //清理不用的子包
            let needCheckGameQueue = this.getRelyGameConfigs(gameConfig);
            let needFlag = {}
            needCheckGameQueue.forEach(v => {
                needFlag[v.gameName] = true;
            })
            let oldCheckGameQueue = this.getRelyGameConfigs(this.gameConfig);
            oldCheckGameQueue.filter(v => {
                return needFlag[v.gameName] != true
            }).forEach(v => {
                //卸载子包
                app.assetManager.unloadBundle(v.gameName);
            })
            //清理搜索路径缓存
            this.clearSearchResCache();
        }
        //保存配置
        this.gameConfig = gameConfig;
        // this.gameData = { nServerID : 0};
        this.room_id = room_id
        //配置不存在
        if (fw.isNull(this.gameConfig)) {
            fw.printError(`gameConfig is Null`);
            return;
        }
        //显示加载中
        app.popup.showLoading();
        //先检测游戏版本
        // this.checkGameUpdate({
        //     gameConfig: this.gameConfig,
        //     callback: (isUpdate: boolean) => {
                this.checkAndLoadGameBundles({
                    gameConfig: this.gameConfig,
                    callback: () => {
                        //关闭加载中
                        app.popup.closeLoading();
                        //是否是游戏场景
                        let isInRoomScene = fw.scene.isGameScene();
                        //非热更新情况下
                        //进入游戏的配置是一致的则不需要重新showMain和加载资源
                        //直接进入房间并登录
                        if ( isInRoomScene && isSameGame) {
                            // //连接房间id
                            // center.gateway.connectRoom(app.gameManager.gameData.nServerID);
                            // //登录游戏服
                            // gameCenter.login.sendLoginGameServer();
                        } else {
                            this.changeScene(this.gameConfig,()=>{
                                if(isComeback){
                                    gameCenter.room.sendEnterRoomREQ(room_id)
                                }else{
                                    gameCenter.room.sendEnterMatchREQ(room_id)
                                }
                            });
                        }
                    }
                });
    //         }
    //     }).catch((error) => {
    //         //关闭加载中
    //         app.popup.closeLoading();
    //         app.popup.showTip({
    //             text: fw.getErroMessage(error)
    //         });
    //     });
    }
    /**设置服务器ID */
    public setServerId(data:GameData) {
        this.gameData = data;
    }

    /**设置RoomId */
    public setRoomId(room_id:number) {
        this.room_id = room_id;
    }
    
    /**清理资源缓存 */
    clearSearchResCache() {
        //清理搜索路径缓存
        this.searchResCache.clear();
    }
    /**获取类（子类找不到，默认会去父类查找对应路径的资源） */
    public getCom(name: string, data: GetComponentExtendParam = {}): any {
        let bundle = data.bundle ?? this.gameConfig.bundleConfig;
        let tempClass = js.getClassByName(`${name}_${bundle.bundleName}`);
        if (fw.isNull(tempClass)) {
            let parentGameConfig = !data.bNotParent && this.getParentGameConfig(data.gameConfig ?? this.gameConfig);
            if (parentGameConfig) {
                return this.getCom(
                    name,
                    Object.assign(app.func.clone(data),
                        {
                            bundle: parentGameConfig.bundleConfig,
                            gameConfig: parentGameConfig,
                        }
                    )
                );
            }
        }
        return tempClass;
    }
    /**获取资源（子类找不到，默认会去父类查找对应路径的资源） */
    getRes(path: string, data: GetResExtendParam = {}): BundleResConfig {
        let obj = null;
        let tempPath = data.path ?? path;
        let bundle = data.bundle ?? this.gameConfig.bundleConfig;
        let hashKey = `${bundle.bundleName}://${tempPath}`;
        if (this.searchResCache.has(hashKey)) {
            return this.searchResCache.get(hashKey);
        } else if (app.file.isBundleResExist(bundle.res[tempPath])) {
            obj = bundle.res[tempPath];
        } else {
            let parentGameConfig = !data.bNotParent && this.getParentGameConfig(data.gameConfig ?? this.gameConfig);
            if (parentGameConfig) {
                obj = this.getRes(
                    path,
                    Object.assign(app.func.clone(data),
                        {
                            bundle: parentGameConfig.bundleConfig,
                            gameConfig: parentGameConfig,
                        }
                    )
                );
            } else {
                if (!fw.isNull(data.defaultRes)) {
                    obj = data.defaultRes;
                } else {
                    fw.printError(`getRes error: ${path}`);
                }
            }
        }
        this.searchResCache.set(hashKey, obj);
        return obj;
    }
    /**获取基类游戏配置 */
    getParentGameConfig(gameConfig: number | string | OneGameConfig, bFirst: boolean = true): OneGameConfig {
        let tempConfig: OneGameConfig;
        //传入的是游戏Id 游戏名称
        if (typeof (gameConfig) == `number` || typeof (gameConfig) == `string`) {
            tempConfig = fw.GameConfigs[gameConfig];
        } else {
            tempConfig = gameConfig;
        }
        return bFirst ? this.getParentGameConfig(tempConfig.relyGame, false) : tempConfig;
    }
    /**获取游戏配置 */
    getGameConfig(gameConfig: number | string | OneGameConfig): OneGameConfig {
        //传入的是游戏Id 游戏名称
        if (typeof (gameConfig) == `number` || typeof (gameConfig) == `string`) {
            gameConfig = fw.GameConfigs[gameConfig];
        }
        return <OneGameConfig>gameConfig;
    }
    /**切换到游戏场景 */
    changeScene(gameConfig: OneGameConfig,callback?:Function): void {
        //切换场景
        fw.scene.changeScene(gameConfig.sceneConfig, { bCleanAllView: true ,callback:(err: any, scene: Scene)=>{
            callback?.();
        }});
    }
    /**退出游戏 */
    exitGame(isServerKick: boolean = false, intentData?: IntentParam): void {
        
        var exitFun = ()=>{
            if (fw.scene.isGameScene()) {
                //关闭背景音乐
                app.audio.stopMusic();
                //移除主界面
                app.popup.removeMain();
                //清理游戏数据
                this.clean()
                //返回大厅
                fw.scene.changeScene(fw.SceneConfigs.plaza, intentData);
            }
        }
        if (!isServerKick) {
            //请求离开房间
            gameCenter.room.sendOutRoom(this.room_id ,exitFun);
        }else{
            exitFun()
        }
    }
    /**
     * 清理游戏数据
     */
    clean() {
        gameCenter.room.clean();
        gameCenter.user.clean();
        gameCenter.robot.clean();
    }
}

/**声明全局调用 */
declare global {
    namespace globalThis {
        type CheckGameUpdateParam = {
            //游戏id
            gameConfig: OneGameConfig
            //回调
            callback?: (isUpdate: boolean) => void;
        }
        type CheckGameLoadParam = {
            //游戏id
            gameConfig: OneGameConfig
            //回调
            callback?: () => void;
        }
        /**getCom参数 */
        type GetComponentExtendParam = {
            /**指定路径 */
            path?: string
            /**指定子包 */
            bundle?: BundleConfigType
            /**指定当前查询游戏配置 */
            gameConfig?: OneGameConfig
            /**默认资源 */
            defaultRes?: BundleResConfig
            /**不查找父类 */
            bNotParent?: boolean
        }
        /**getRes参数 */
        type GetResExtendParam = {
            /**指定路径 */
            path?: string
            /**指定子包 */
            bundle?: BundleConfigType
            /**指定当前查询游戏配置 */
            gameConfig?: OneGameConfig
            /**默认资源 */
            defaultRes?: BundleResConfig
            /**不查找父类 */
            bNotParent?: boolean
        }
    }
}
