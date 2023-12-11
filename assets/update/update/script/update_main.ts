import { ProgressBar, UITransform, game, macro } from 'cc';
import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { httpConfig } from '../../../app/config/HttpConfig';
import { IHotUpdateLister, _FWHotUpdateManager } from '../../../_init/hotupdate/_FWHotUpdateManager';
import { HotUpdateQueue, IEndUpdateCallbackData } from '../../update';
import { FWSceneBase } from '../../../app/framework/view/FWSceneBase';

interface IPlazaVersion {
    apkVersion: string,
    newFlist: string,
    activitys: { [key: string]: string }
}

@ccclass('update_main')
class update_main extends (fw.FWComponent) {
    /**自定义字符串 */
    private secret: string = `aiwan2019`
    /**进度条 */
    private progressBar: ProgressBar
    hotUpdateQueue: HotUpdateQueue;
    /**初始化数据 */
    initData() {
        //先拉取停服公告
        this.checkInternet(this.checkUpdateBefore.bind(this));
        this.hotUpdateQueue = new HotUpdateQueue()
    }
    /**初始化界面 */
    initView() {
        //清理大厅节点缓存
        if (fw.isValid(app.runtime.plaza)) {
            app.runtime.permanentView.delete(app.runtime.plaza);
            app.runtime.plaza.destroy();
            app.runtime.plaza = null;
        }
        //进度条
        this.progressBar = this.Items.ProgressBar.getComponent(ProgressBar);
        this.progressBar.progress = 0;
        this.Items.Label_progress.string = ``;
        this.progressBar.totalLength = this.Items.ProgressBar.getComponent(UITransform).contentSize.width;
        //隐藏进度
        this.Items.ProgressBar.active = false;
    }
    /**初始化事件 */
    initEvents() {
        (<any>this).nLastProgress = 0;
        //监听更新进度
        this.bindEvent({
            eventName: fw.HotUpdateEvent.Progress,
            callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam) => {
                let progress = this.hotUpdateQueue.getDownloadedBytes() / this.hotUpdateQueue.getTotalBytes();
                this.Items.ProgressBar.active = true;
                let nOldProgress = (<any>this).nLastProgress;
                progress = fw.isNull(progress) ? 0 : progress;
                progress = Math.max(progress, nOldProgress);
                progress = Math.min(progress, 1);
                let nDiff = progress - nOldProgress;
                //这里是为了进来的时候一定有一个进度在跑
                let nFirstProgress = 0.05;
                if (nOldProgress == 0 && nDiff < nFirstProgress) {
                    progress = nFirstProgress;
                    nDiff = nFirstProgress;
                }
                if (nDiff > 0.01 || nOldProgress == 0 || progress >= 1) {
                    this.unscheduleAllCallbacks();
                    if (progress >= 1) {
                        (<any>this).nLastProgress = progress;
                        this.progressBar.progress = progress;
                        this.Items.Label_progress.string = `${(progress * 100).toFixed(2)}%`;
                    } else {
                        let nTime = 30;
                        let nTempTime = 0;
                        this.schedule((dt: number) => {
                            nTempTime += dt;
                            let tempProgress = nOldProgress + nDiff * Math.min(nTempTime, nTime) / nTime;
                            if (nTempTime >= nTime) {
                                this.unscheduleAllCallbacks();
                            }
                            this.progressBar.progress = tempProgress;
                            this.Items.Label_progress.string = `${(tempProgress * 100).toFixed(2)}%`;
                        }, 0, macro.REPEAT_FOREVER, 0);
                        (<any>this).nLastProgress = progress;
                    }
                }
            }
        });
        //更新完成
        this.bindEvent({
            eventName: fw.HotUpdateEvent.Complete,
            callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam) => {
                let progress = Math.max(this.hotUpdateQueue.getDownloadedBytes() / this.hotUpdateQueue.getTotalBytes(), (<any>this).nLastProgress);
                this.unscheduleAllCallbacks();
                (<any>this).nLastProgress = progress;
                this.progressBar.progress = progress;
                this.Items.Label_progress.string = `${(progress * 100).toFixed(2)}%`;
            }
        });
    }
    /**检查更新前开关 */
    checkUpdateBefore() {
        app.sdk.checkUpdateBefore((isSuccess) => {
            if (isSuccess) {
                this.getServiceSuspensionNotice()
            }
        })
    }
    /**获取停服公告 */
    getServiceSuspensionNotice() {
        let channel = app.native.device.getOperatorsID();
        app.http.get({
            url: httpConfig.path_pay + `update/getStopServers`,
            params: {
                channel: channel,
                sign: app.md5.hashStr(channel + this.secret),
            },
            callback: (bSuccess, response) => {
                if (bSuccess) {
                    let content = response;
                    //显示停服公告
                    if (content.status == 1 && content.data.type == 0) {
                        app.popup.showDialog({
                            viewConfig: fw.BundleConfig.login.res[`update/Layer_close_server`],
                            data: content.data,
                        });
                    }
                    //拉取更新
                    else {
                        let checkUpdate = () => {
                            try {
                                this.checkUpdate().catch(error => {
                                    fw.printError(error)
                                })
                            } catch (error) {
                                app.popup.showTip({
                                    text: error.toString(),
                                    btnList: [
                                        {
                                            styleId: 1,
                                            callback: checkUpdate
                                        }
                                    ],
                                    closeCallback: checkUpdate
                                });
                            }
                        }
                        this.checkInternet(checkUpdate);
                    }
                } else {
                    app.popup.showTip({
                        text: `Notice download fail`,
                        btnList: [
                            {
                                styleId: 1,
                                callback: this.getServiceSuspensionNotice.bind(this)
                            }
                        ],
                        closeCallback: this.getServiceSuspensionNotice.bind(this)
                    });
                }
            }
        });
    }
    /**获取版本信息 */
    getVersion() {
        return new Promise<IPlazaVersion>((resolve, reject) => {
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
                        resolve(response);
                    } else {
                        reject(fw.language.get("version download fail"));
                    }
                }
            })
        })
    }
    /**检测网络 */
    checkInternet(callback: Function) {
        //检测网络是否连接（待完善）
        if (false) {
            //android 和 ios
        } else {
            callback();
        }
    }
    /**检测更新 */
    async checkUpdate() {
        //获取服务器版本号
        let serverVersion = await this.getVersion();
        let activityVersion = serverVersion.activitys;
        let apkVersion = serverVersion.apkVersion;
        let mainVersion = serverVersion.newFlist;
        let needUpdateHotUpdateManagerQueue: _FWHotUpdateManager[] = [];
        //服务器版本配置
        fw.print(`getVersion:`, serverVersion);
        //浏览器下不测试热更
        if (app.func.isBrowser() || !fw.DEBUG.bGameUpdate) {
            //跳转登录
            app.file.setPlazaVersion(100000);
            this.gotoLogin()
        } else {
            app.runtime.newApkVersion = apkVersion;
            let oldVersion = app.native.device.getAppVersion();
            if (app.interface.contrastApkVersion(oldVersion, apkVersion)) {
                app.popup.showDialog({
                    viewConfig: fw.BundleConfig.update.res[`checkUpdate/checkUpdate`],
                });
            } else {
                // 大厅
                {
                    let am = fw.FWHotUpdateManager.getOnce(<HotUpdateConfigs>{
                        newVersion: mainVersion,
                        bundleConfig: fw.BundleConfig.resources,
                    });
                    let { nLocalVersion } = await am.getLocalVersion();
                    //设置版本号
                    app.file.setPlazaVersion(nLocalVersion);
                    if (am.compareVersion(nLocalVersion)) {
                        fw.print("not update");
                        am.destroy();
                    } else {
                        fw.print("update");
                        needUpdateHotUpdateManagerQueue.push(am);
                    }
                }
                // 活动
                for (const activityName in activityVersion) {
                    const version = activityVersion[activityName];
                    let am = fw.FWHotUpdateManager.getOnce(<HotUpdateConfigs>{
                        newVersion: version,
                        bundleConfig: fw.BundleConfig[activityName],
                    });
                    let { nLocalVersion } = await am.getLocalVersion();
                    if (am.compareVersion(nLocalVersion)) {
                        fw.print("not update");
                        am.destroy();
                    } else {
                        fw.print("update");
                        needUpdateHotUpdateManagerQueue.push(am);
                    }
                }

                if (needUpdateHotUpdateManagerQueue.length > 0) {
                    this.hotUpdateQueue.startUpdate(needUpdateHotUpdateManagerQueue)
                        .then((callbackData: IEndUpdateCallbackData) => {
                            if (callbackData.isCancelUpdate) {
                                game.end();
                            } else {
                                game.restart();
                            }
                        }).catch(() => {
                            game.end();
                        });
                } else {
                    //前往登录
                    this.gotoLogin()
                }
            }
        }
    }
    /**
     * 前往登录
     */
    gotoLogin() {
        fw.scene.changeScene(fw.SceneConfigs.login, { bAutoLogin: true } as any);
    }
}
