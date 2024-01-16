import { _decorator, tween, UIOpacityComponent, v3, Vec3, view } from 'cc';
const { ccclass } = _decorator;

import { FWPopupViewBase } from './FWPopupViewBase';
import { ScreenOrientationType } from '../../../config/ConstantConfig';

@ccclass('FWToastViewBase')
export class FWToastViewBase extends FWPopupViewBase {
    /**调整类型 */
    popupData: FWPopupToastParam = <any>{}
    onLoad() {
        //扩展调用
        //附加界面初始化
        this._initView_FWToastViewBase();
        //调用父类
        super.onLoad();
    }
    //初始化界面
    protected _initView_FWToastViewBase() {
        //使用默认方式
        this.updateScreenOrientation(true);
        //播放动画
        this.showHideAnim();
    }
    /**播放动画 */
    showHideAnim() {
        let drSize = view.getDesignResolutionSize();
        this.node.worldPosition = new Vec3(drSize.width / 2, drSize.height * 0.8, 0);
        
        //刷新
        if (!fw.isNull(this.popupData.nUpdateDelayTime)) {
            if (this.popupData.updateCallback) {
                this.scheduleOnce(() => {
                    let str = this.popupData.updateCallback(this);
                    if (!fw.isValid(this)) {
                        return;
                    }
                    this.updatePopupView(str);
                }, this.popupData.nUpdateDelayTime);
            }
        }
        if (!fw.isNull(this.popupData.nUpdateIntervalTime)) {
                this.setInterval(() => {
                    let str = this.popupData.text;
                    this.popupData.nUpdateIntervalTime --;
                    str = str + this.popupData.nUpdateIntervalTime
                    if (!fw.isValid(this)) {
                        return;
                    }
                    if(this.popupData.nUpdateIntervalTime <= 0){
                        this.onClickClose()
                        this.popupData.updateCallback?.()
                    }else{
                        this.updatePopupView(str);
                    }
                }, 1);
        }else{
            switch (app.runtime.nCurScreenOrientation) {
                case ScreenOrientationType.Vertical_false:
                case ScreenOrientationType.Horizontal_false:
                    tween(this.node)
                        .delay(this.popupData.time ?? 1.0)
                        .by(2.0, { position: v3(-drSize.height * 0.2, 0, 0) })
                        .start();
                    break;
                case ScreenOrientationType.Vertical_true:
                case ScreenOrientationType.Horizontal_true:
                default:
                    tween(this.node)
                        .delay(this.popupData.time ?? 1.0)
                        .by(2.0, { position: v3(0, drSize.height * 0.2, 0) })
                        .start();
                    break;
            }
            tween(this.obtainComponent(UIOpacityComponent))
                .delay((this.popupData.time ?? 1.0) + 1.0)
                .to(1.0, { opacity: 0 })
                .call(() => {
                    this.onClickClose();
                })
                .start();
        }
    }
    /**横竖屏 */
    updateScreenOrientation(bInit?: boolean) {
        if (bInit) {
            //使用默认方式
            this.updateScreenOrientationDefault();
        }
    }
    /**刷新界面 */
    updatePopupView(str?: string) {
        //TODO
    }
    /**关闭界面 */
    onClickClose(): boolean | void {
        app.popup.closeToast(this.node);
    }
}
