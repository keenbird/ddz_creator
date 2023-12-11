import { Label, Node, Prefab, Vec3, _decorator, instantiate, js, math } from 'cc';
import { EVENT_ID } from '../../../app/config/EventConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
import { guide_hand_1 } from '../../../resources/ui/guide/script/guide_hand_1';
import proto from '../../../app/center/common';
import { DF_RATE, DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { megaGift_viewBase } from './megaGift_viewBase';

const { ccclass } = _decorator;

@ccclass('megaGift')
export class megaGift extends FWDialogViewBase {
	popupData: megaGiftDataParam_base = <any>{};
	isVertical: boolean = false;
	premiumViewCtrl: megaGift_viewBase;
	initData() {
		this.premiumViewCtrl = this.obtainComponent(megaGift_viewBase);
		this.premiumViewCtrl.onClickCancelBuy = this.onClickCancelBuy.bind(this)
		this.premiumViewCtrl.isVertical = this.isVertical;
		this.premiumViewCtrl.close = this.close.bind(this)
	}
	
	onClickCancelBuy() {
		if (this.popupData.cancelBuyCallback) {
			this.popupData.cancelBuyCallback()
		}
		this.onCancelClickClose()
	}

}

