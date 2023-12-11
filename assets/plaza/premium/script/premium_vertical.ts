import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { premium } from './premium';
import { premium_viewBase } from './premium_viewBase';

@ccclass('premium_vertical')
export class premium_vertical extends (fw.FWComponent) {
	popupData: PremiumDataParam_base = <any>{}
	premiumViewCtrl: premium_viewBase;
	isShowMallNext: boolean = false;
	protected initView(): boolean | void {
		this.premiumViewCtrl = this.obtainComponent(premium_viewBase);
		this.premiumViewCtrl.setPopupData(this.popupData)
		this.Items.Node_other.active = false
	}
	protected initEvents(): boolean | void {
        //返回键
        this.bindEvent({
            eventName: app.event.CommonEvent.Keyback,
            callback: () => {
                this.onCancelClickClose();
            }
        });
    }
	protected initBtns(): boolean | void {
		//Other
		this.Items.Node_other.onClickAndScale(() => {
			this.showMall();
			this.onClickClose();
		});
		//Sprite_addCash
		this.Items.Sprite_addCash.onClickAndScale(() => {
			this.isShowMallNext = true;
			this.showChoose(this.popupData.nGoldNum);
			this.onClickClose();
		});
		//Node_close
		this.Items.Node_close.onClickAndScale(() => {
			this.onCancelClickClose();
		});
	}
	showMall(minPay?) {
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`shop/shop_main`],
			data: {
				minPay: minPay
			},
		});
	}
	showChoose(minPay?) {
		if (center.user.canShowMegaGift()) {
			this.showMegaGiftV();
		} else {
			this.showMall(minPay);
		}
	}
	onClickClose() {
		if (this.node.active) {
			this.node.active = false;
			app.event.dispatchEvent({
				eventName: "hidePremiumVeritcal",
			})
		}
	}
	showMegaGiftV(isShowMallNext?) {
		if (center.user.canShowMegaGift()) {
			app.event.dispatchEvent({
				eventName: "showMegaGiftVeritcal",
				data: {
					minPay : this.popupData.nGoldNum,
					isShowMallNext: this.isShowMallNext,
				}
			})
		}
	}
	onCancelClickClose() {
		this.onClickClose()
		this.showMegaGiftV()
	}
}

