import { Asset, Node as ccNode, _decorator } from 'cc';
const { ccclass } = _decorator;

import { EVENT_ID } from '../../app/config/EventConfig';
import { main_GameBase } from './ui/main/script/main_GameBase';
import { FWSceneBase } from '../../app/framework/view/FWSceneBase';

@ccclass('game_GameBase')
export class game_GameBase extends FWSceneBase {
    /**自定义扩展 */
    [key: AnyKeyType]: any
    /**预加载文件夹列表 子类使用“=”赋值 */
    public preloadList: string[]
    /**聊天配置 */
    public chatConfig: ChatBaseParam
    /**获取gamemain对象 -> 主界面 */
    public main: main_GameBase
    /**获取internet对象 */
    public get internet(): any {
        return (<any>this).__comInternet ??= this.obtainComponent(this.getCom(`internet`));
    }
    /**获取func对象 */
    public get func(): any {
        return (<any>this).__comFunc ??= this.obtainComponent(this.getCom(`func`));
    }
    /**获取config对象 */
    public get config() {
        return (<any>this).__comConfig ??= this.obtainComponent(this.getCom(`config`));
    }
    /**获取language对象 */
    public get language() {
        return (<any>this).__comLanguage ??= this.obtainComponent(this.getCom(`language`));
    }
    /**获取gamemain对象 -> 主界面 */
    public get bundle(): BundleConfigType {
        return app.gameManager.gameConfig.bundleConfig;
    }
    onLoad() {
        this.init_GameBase();
        //初始化多语言
        this.language;
        //父类
        super.onLoad();
    }
    private init_GameBase() {
        //设置引用
        app.gameManager.game = this;
        //聊天配置
        this.chatConfig ??= {
            text: [
                {
                    content: ({
                        [fw.LanguageType.en]: `abc`,
                        [fw.LanguageType.brasil]: `abc`,
                    })[fw.language.languageType],
                },
            ],
            emoji: [
                { res: app.game.getRes(`ui/chat/img/atlas/img_c_surprise/spriteFrame`), },
                { res: app.game.getRes(`ui/chat/img/atlas/img_c_cry/spriteFrame`), },
                { res: app.game.getRes(`ui/chat/img/atlas/img_c_laugh/spriteFrame`), },
                { res: app.game.getRes(`ui/chat/img/atlas/img_c_hi/spriteFrame`), },
                { res: app.game.getRes(`ui/chat/img/atlas/img_c_pleased/spriteFrame`), },
                { res: app.game.getRes(`ui/chat/img/atlas/img_c_slient/spriteFrame`), },
                { res: app.game.getRes(`ui/chat/img/atlas/img_c_embarassed/spriteFrame`), },
                { res: app.game.getRes(`ui/chat/img/atlas/img_c_angry/spriteFrame`), },
                { res: app.game.getRes(`ui/chat/img/atlas/img_c_smile/spriteFrame`), },
            ],
        }
        //获取一次，目的是为了没加组件的立即加上
        this.internet;
        //显示主界面
        app.game.showMain();
        //断线重连
        this.bindEvent({
            eventName: EVENT_ID.EVENT_PLAZA_ACTOR_PRIVATE,
            callback: this.onReconnect.bind(this)
        });
    }
    /**初始化主界面资源 */
    public initMain(): BundleResConfig {
        return this.getRes(`ui/main/main`);
    }
    /**显示背景界面 */
    public showBg(): void {
        //调整背景
        let viewConfig = this.getRes(`ui/bg/bg`);
        if (viewConfig) {
            app.popup.showBg({ viewConfig: viewConfig });
        }
    }
    /**获取预加载参数 */
    protected getPreloadParam(): PreloadParam {
        return {
            list: [{
                bundleConfig: app.gameManager.gameConfig.bundleConfig,
                preloadList: this.preloadList,
            }],
        };
    }
    /**显示主界面 */
    public showMain(): void {
        //预加载资源
        this.preloadRes(
            Object.assign(this.getPreloadParam(), {
                callback: this.onPreloadResEnd.bind(this)
            })
        );
    }
    /**展示游戏界面 */
    onShowGameView() {
        this.showBg();
        app.popup.showMain({
            prefab: app.assetManager.loadBundleResSync(this.initMain()),
            callback: this.initMainCom.bind(this),
        });
    }
    /**资源加载完成 */
    onPreloadResEnd() {
        if (app.gameManager.isTest) {
            this.onShowGameView();
        } else {
            //添加自己坐下监听事件
            this.bindEvent({
                once: true,
                eventName: EVENT_ID.EVENT_PLAY_ACTOR_SELFONTABLE,
                callback: this.onShowGameView.bind(this),
            });
            //请求进入房间
            center.gateway.connectRoom(app.gameManager.gameData.nServerID);
            gameCenter.login.sendLoginGameServer();
        }
    }
    /**初始化主脚本 */
    protected initMainCom(view: ccNode) {
        //注意，如果子类没有定义main_xxx脚本，那么这里会去查找父类的main_xxx脚本
        this._gameMainView = view;
        let component = this.getCom(`main`);
        if (component) {
            //这里初始化app.game.main
            app.game.main = view.obtainComponent(component);
        } else {
            //注意，子类自行初始化app.game.main
        }
    }
    /**预加载资源 */
    protected preloadRes(data: PreloadParam) {
        //显示预加载界面
        app.popup.showDialog({
            viewConfig: fw.BundleConfig.resources.res[`ui/load/load`],
            data: data,
        });
    }
    /**获取类（子类找不到，默认会去父类查找对应路径的资源） */
    public getCom(name: string, data: GetComponentExtendParam = {}): any {
        return app.gameManager.getCom(name, data);
    }
    /**获取资源（子类找不到，默认会去父类查找对应路径的资源） */
    public getRes(path: string, data: GetResExtendParam = {}): BundleResConfig {
        return app.gameManager.getRes(path, data);
    }
    /**加载子包中的资源 */
    loadRes<T extends Asset>(path: string, callback?: AssetLoadCallbackParam<T>, data?: AssetLoadExtendParam): void;
    loadRes<T extends Asset>(path: string, type: AssetLoadTypeParam<T>, callback?: AssetLoadCallbackParam<T>, data?: AssetLoadExtendParam): void;
    loadRes(path: string, type?: any, callback?: any, data?: AssetLoadExtendParam) {
        this.loadBundleRes(this.getRes(path), type, callback, data);
    }
    /**同步加载子包中的资源 */
    loadResSync<T extends Asset>(path: string, type?: AssetLoadTypeParam<T>): T {
        return this.loadBundleResSync(this.getRes(path), type)
    }
    /** 断线重连 */
    onReconnect() {
        //房间断线重连
        //防止断线重连房间发生更新走热更新检查
        app.gameManager.gotoGame(app.gameManager.gameConfig, app.gameManager.gameData)
    }
    /**菜单界面 */
    onClickMenu() {
        app.popup.showDialog({
            viewConfig: app.game.getRes(`ui/menu/menu`),
        });
    }
    /**设置界面 */
    onClickSetting() {
        app.popup.showDialog({
            viewConfig: app.game.getRes(`ui/setting/setting`),
        });
    }
    /**设置帮助 */
    onClickHelp() {
        app.popup.showToast({ text: `TODO help` });
    }
    /**聊天界面 */
    onClickChat(_btn: ccNode) {
        app.popup.showDialog({
            viewConfig: app.game.getRes(`ui/chat/chat`),
            data: Object.assign({ btn: _btn }, app.game.chatConfig),
        });
    }
}

/**类型声明调整 */
declare global {
    namespace globalThis {
        type type_game_GameBase = game_GameBase
        /**showMain参数 */
        type GameBaseShowMainParam = {
            /**回调 */
            callback: (view: ccNode) => void
        }
    }
}
