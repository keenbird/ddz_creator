import { Node as ccNode, UITransform, _decorator, view, WebView, size } from 'cc';
const { ccclass } = _decorator;

import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('ShopWebLayer')
export class ShopWebLayer extends FWDialogViewBase {
    m_webUrl: string;
    data: string[];

    initData() {
        this.m_webUrl = this.data[0];
    }

    initView() {
        // //标题
        // this.Items.Text_title.obtainComponent(Label).string = "About Recharge";

        this.updateOrientationLayout();

        if (this.m_webUrl) {
            this.Items.Panel_web.obtainComponent(WebView).url = this.m_webUrl;
        }

    }

    initBtns() {
        // this.Items.Panel_okey.onClickAndScale(this.onClickClose.bind(this));
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

declare global {
    namespace globalThis {
        type plaza_ShopWebLayer = ShopWebLayer
    }
}
