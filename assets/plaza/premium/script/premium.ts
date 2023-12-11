import { RichText, _decorator } from 'cc';
const { ccclass } = _decorator;

import { premium_viewBase } from './premium_viewBase';
import { EVENT_ID } from '../../../app/config/EventConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('premium')
export class premium extends FWDialogViewBase {
	/**界面数据 */
	popupData: PremiumDataParam_base = <any>{};
	premiumViewCtrl: premium_viewBase;
	initData() {
		this.premiumViewCtrl = this.obtainComponent(premium_viewBase);
		this.premiumViewCtrl.setPopupData(this.popupData)
	}
	protected initBtns(): boolean | void {
		//Other
		this.Items.Node_other.onClickAndScale(() => {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`shop/shop_main`],
			});
			this.close();
		});
		//Sprite_addCash
		this.Items.Sprite_addCash.onClickAndScale(() => {
			center.user.showChoose(this.popupData.nGoldNum);
			this.close();
		});
	}

	onCancelClickClose() {
		super.onCancelClickClose();
		if (center.user.canShowMegaGift()) {
			center.user.showMegaGift();
		}
	}
}
