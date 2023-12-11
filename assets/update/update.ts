
import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { FWSceneBase } from '../app/framework/view/FWSceneBase';
import { IHotUpdateLister, _FWHotUpdateManager } from '../_init/hotupdate/_FWHotUpdateManager';

@ccclass('update')
export class update extends FWSceneBase {
    initView() {
        //背景界面
        app.popup.showBg({
            viewConfig: fw.BundleConfig.update.res["bg/update_bg"]
        });
    }
}

export interface IEndUpdateCallbackData {
    isCancelUpdate:boolean
}

export class HotUpdateQueue {
    private needUpdateHotUpdateManagerQueue: _FWHotUpdateManager[]
    private needUpdateHotUpdateManagerQueueUpdateFlag: boolean[]
    private runIndex: number
    private endUpdateCallback: (value: IEndUpdateCallbackData) => void
    initUpdateCount: number
    /**开始更新 */
    startUpdate(needUpdateHotUpdateManagerQueue: _FWHotUpdateManager[]) {
        return new Promise<IEndUpdateCallbackData>((resolve) => {
            this.endUpdateCallback = resolve;
            this.needUpdateHotUpdateManagerQueue = needUpdateHotUpdateManagerQueue;
            this.needUpdateHotUpdateManagerQueueUpdateFlag = []
            this.prepareUpdate();
        });
    }
    /**
     * 准备更新内容
     */
    private prepareUpdate() {
        this.initUpdateCount = 0;
        this.needUpdateHotUpdateManagerQueue.forEach((am, index) => {
            let lister: IHotUpdateLister = {
                updateFail: (am: _FWHotUpdateManager, error: string) => {
                    app.popup.showTip({
                        /**文本 */
                        text: error,
                        /**按钮预设 */
                        btnList: [{
                            styleId: 1,
                            //回调函数
                            callback: () => {
                                am.retry();
                            },
                            //文本类容
                            text: "retry"
                        }],
                        /**界面关闭时回调 */
                        closeCallback: () => {
                            this.cancelUpdate();
                        },
                    })
                },
                //无需更新
                notUpdate: (am: _FWHotUpdateManager) => {
                    this.initUpdateCount++;
                    this.needUpdateHotUpdateManagerQueueUpdateFlag[index] = true;
                    this.startHotUpdate();
                },
                //更新成功
                updateSuccess: (am: _FWHotUpdateManager) => {
                    this.needUpdateHotUpdateManagerQueueUpdateFlag[index] = true;
                    this.updateSuccess();
                },
                //开始更新
                startUpdate: (am: _FWHotUpdateManager) => {
                    this.initUpdateCount++;
                    this.needUpdateHotUpdateManagerQueueUpdateFlag[index] = false;
                    this.startHotUpdate();
                },
                //开始配置文件下载
                downloadUpdateConfig: (am: _FWHotUpdateManager) => {
                    //TODO
                },
                //下载配置文件失败
                downloadUpdateConfigFail: (am: _FWHotUpdateManager, error: string) => {
                    app.popup.showTip({
                        /**文本 */
                        text: error,
                        /**按钮预设 */
                        btnList: [{
                            styleId: 1,
                            //回调函数
                            callback: () => {
                                am.checkUpdate();
                            },
                            //文本类容
                            text: "retry"
                        }],
                        /**界面关闭时回调 */
                        closeCallback: () => {
                            this.cancelUpdate();
                        },
                    })
                },
            }
            am.setHotUpdateLister(lister);
            am.checkUpdate();
        });
    }
    /**检测下一个包 */
    private checkNextUpdate() {
        if (this.runIndex >= this.needUpdateHotUpdateManagerQueue.length) {
            this.endUpdate();
            return;
        }
        if (this.needUpdateHotUpdateManagerQueueUpdateFlag[this.runIndex]) {
            this.updateSuccess();
        }else {
            this.needUpdateHotUpdateManagerQueue[this.runIndex].hotUpdate();
        }
    }
    /**更新结束 */
    private endUpdate() {
        this.needUpdateHotUpdateManagerQueue.forEach(v => {
            v.destroy();
        });
        this.endUpdateCallback({
            isCancelUpdate:false
        });
    }
    /**更新成功 */
    private updateSuccess() {
        this.runIndex++;
        this.checkNextUpdate();
    }
    /**获取总字节数 */
    public getTotalBytes() {
        let ret = 0;
        this.needUpdateHotUpdateManagerQueue.forEach((am, index) => {
            ret += am.ctrl.getTotalBytes();
        });
        return ret;
    }
    /**获取已下载的字节数 */
    public getDownloadedBytes() {
        let ret = 0;
        this.needUpdateHotUpdateManagerQueue.forEach((am, index) => {
            ret += am.ctrl.getDownloadedBytes();
        });
        return ret;
    }
    /**执行更新 */
    private startHotUpdate() {
        if (this.initUpdateCount == this.needUpdateHotUpdateManagerQueue.length) {
            this.runIndex = 0;
            this.checkNextUpdate();
        }
    }
    /** 取消更新 */
    private cancelUpdate() {
        this.needUpdateHotUpdateManagerQueue.forEach(v => {
            v.destroy()
        })
        this.endUpdateCallback({
            isCancelUpdate:true
        });
    }
}