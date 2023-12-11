import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { FWPopupViewBase } from './FWPopupViewBase';

@ccclass('FWTipViewBase')
export class FWTipViewBase extends FWPopupViewBase {
    /**弹框数据 */
    popupData: FWPopupTipParam = <any>{}
    onLoad() {
        //扩展调用
        //附加界面初始化
        this._initView_FWToastViewBase();
        //附加按钮初始化
        this._initBtns_FWTipViewBase();
        //调用父类
        super.onLoad();
    }
    /**附加界面初始化 */
    private _initView_FWToastViewBase() {
        //使用默认方式
        this.updateScreenOrientation();
    }
    /**附加按钮初始化 */
    private _initBtns_FWTipViewBase() {
        //关闭按钮
        let btn_close = this.Items.Node_close || this.Items.Sprite_close;
        if (fw.isValid(btn_close)) {
            btn_close.onClickAndScale(this.onCancelClickClose.bind(this));
        }
    }
    /**横竖屏 */
    updateScreenOrientation() {
        //使用默认方式
        this.updateScreenOrientationDefault();
    }
    /**手动关闭界面触发 */
    onClickClose(): boolean | void {
        app.popup.closeTip(this.node);
    }
    /**点击关闭按钮或者keyback触发 */
    onCancelClickClose() {
        //关闭回调
        this.popupData.cancelCallback?.();
        //关闭回调
        this.onClickClose();
    }
}
