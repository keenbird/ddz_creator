import { _decorator } from 'cc';
import { megaGift } from './megaGift';
import { megaGift_viewBase } from './megaGift_viewBase';
const { ccclass } = _decorator;

@ccclass('megaGift_vertical')
export class megaGift_vertical extends (fw.FWComponent) {
	isVertical: boolean = true;
	popupData: megaGiftDataParam_base = <any>{};
	premiumViewCtrl: megaGift_viewBase;
	initData() {
		this.premiumViewCtrl = this.obtainComponent(megaGift_viewBase);
		this.premiumViewCtrl.onClickCancelBuy = this.onClickCancelBuy.bind(this);
		this.premiumViewCtrl.isVertical = this.isVertical;
		this.premiumViewCtrl.close = this.onClickClose.bind(this);
	}
	protected initView(): boolean | void {
		this.Items.Text_time_once.active = false;
	}
	protected initEvents(): boolean | void {
        //返回键
        this.bindEvent({
            eventName: app.event.CommonEvent.Keyback,
            callback: () => {
                this.onClickCancelBuy();
            }
        });
    }
	onClickCancelBuy() {
		if (this.popupData.cancelBuyCallback) {
			this.popupData.cancelBuyCallback()
		}
		this.onCancelClickClose()
	}
	onClickClose() {
		if (this.node.active) {
			this.node.active = false;
			app.event.dispatchEvent({
				eventName: "hideMegaGiftVeritcal",
			})
		}
	}
	onCancelClickClose() {
		this.onClickClose()
	}
	onClickOtherAmount() {
		this.onClickClose()
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`shop/shop_main`]
		});
	}
	toShowPayChannel(data) {
		center.mall.payChooseType(data)
	}
}

