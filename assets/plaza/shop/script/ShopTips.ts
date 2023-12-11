import { view } from 'cc';
import { instantiate, Label, math, ScrollView, Node as ccNode, UITransform, _decorator, color } from 'cc';
const { ccclass } = _decorator;

import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('ShopTips')
export class ShopTips extends FWDialogViewBase {


    initData() {

    }

    initView() {
        //标题
        this.Items.Text_title.obtainComponent(Label).string = "About Recharge";
    }

    initBtns() {
        this.Items.Panel_okey.onClickAndScale(this.onClickClose.bind(this));
    }

    initEvents() {

    }
}
