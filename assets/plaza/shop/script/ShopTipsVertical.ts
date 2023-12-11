import { size, view } from 'cc';
import { instantiate, Label, math, ScrollView, Node as ccNode, UITransform, _decorator, color } from 'cc';
const { ccclass } = _decorator;

import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('ShopTipsVertical')
export class ShopTipsVertical extends FWDialogViewBase {


    initData() {

    }

    initView() {
        //标题
        this.Items.Text_title.obtainComponent(Label).string = "About Recharge";

        //假竖屏处理
        this.updateOrientationLayout();
    }

    initBtns() {
        this.Items.Panel_okey.onClickAndScale(this.onClickClose.bind(this));
    }

    initEvents() {
        this.bindEvent({
			eventName: `ChangeScreenOrientation`,
			callback: () => {
				this.updateOrientationLayout();
			}
		});
    }

    updateOrientationLayout() {
        //调整角度
        this.node.angle = 90;
		this.node.size = size(app.initWinSize.height, app.initWinSize.width);
    }
}
