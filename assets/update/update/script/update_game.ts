import { ProgressBar, UITransform, macro } from 'cc';
import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { IHotUpdateLister, _FWHotUpdateManager, _UpdateGame } from '../../../_init/hotupdate/_FWHotUpdateManager';
import { HotUpdateQueue } from '../../update';

@ccclass('update_game')
class update_game extends _UpdateGame {
    /**进度条 */
    private progressBar: ProgressBar;
    private hotUpdateQueue: HotUpdateQueue = new HotUpdateQueue();
    /**初始化界面 */
    initView() {
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
    /**检测网络 */
    checkInternet(callback: Function) {
        //检测网络是否连接（待完善）
        if (false) {
            //android 和 ios
        } else {
            callback();
        }
    }
    /**开始更新 */
    startUpdate(needUpdateHotUpdateManagerQueue: _FWHotUpdateManager[]) {
        return this.hotUpdateQueue.startUpdate(needUpdateHotUpdateManagerQueue)
    }
}