import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { FWPopupViewBase } from './FWPopupViewBase';

@ccclass('FWLoadingViewBase')
export class FWLoadingViewBase extends FWPopupViewBase {
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
        this.updateScreenOrientation();
    }
    //删除界面
    onClickClose() {
        app.popup.closeLoading(this.node);
    }
    /**横竖屏 */
    updateScreenOrientation() {
        //使用默认方式
        this.updateScreenOrientationDefault();
    }
}
