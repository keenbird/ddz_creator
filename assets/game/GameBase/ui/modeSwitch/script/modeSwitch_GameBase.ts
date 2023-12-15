import { _decorator } from 'cc';
const { ccclass } = _decorator;

import proto from '../../../../../app/center/common';
import { FWDialogViewBase } from '../../../../../app/framework/view/popup/FWDialogViewBase';
import { DF_RATE } from '../../../../../app/config/ConstantConfig';

@ccclass('modeSwitch_GameBase')
export class modeSwitch_GameBase extends FWDialogViewBase {
	/**第一个充值 */
	first: proto.common.IMegaGiftItem
	/**必要参数 */
	popupData: ModeSwitchData = <any>{}
	/**设置数据 */
	setPopupData(data: ModeSwitchData) {
		this.popupData = data;
	}
	protected initView(): boolean | void {

		//是否还有存在首充
		let buffNum = center.user.getBuffNum()
		let config = center.luckyCard.getMegaGiftCfg();
		// 只有一套才显示mega礼包
		let bFirstPay = buffNum == 1 && config && config.megaGifPrice.length > 0 && center.luckyCard.checkShowMegaGift() && app.sdk.isSdkOpen("firstpay");
		//调整显示
		this.Items.Node_real.active = !bFirstPay;
		this.Items.Node_first.active = bFirstPay;
		//存在有效首充
		if (bFirstPay) {
			let gifPrice = this.first = config.megaGifPrice[0];
			let nPrice = parseInt(gifPrice.price) / 10;
			this.Items.Label_add.string = `R$${nPrice}`;
			this.Items.Label_cash.string = `R$${(gifPrice.prop_num) / DF_RATE}`;
			this.Items.Label_bonus.string = `R$${(gifPrice.bonus_num) / DF_RATE}`;
			this.Items.Label_total.string = `R$${(gifPrice.bonus_num + gifPrice.prop_num) / DF_RATE}`;
		}
	}
	protected initBtns(): boolean | void {
		//左侧
		this.Items.Node_first.Items.Sprite_btn_go.onClick(() => {
			//执行回调
			if (this.popupData.doFirstPayCallback) {
				this.popupData.doFirstPayCallback(this.popupData);
			} else {
				let first = this.first;
				center.mall.payChooseType({
					isAutoSelect: true,
					megaGiftData: first,
					lRMB: first.price / 10,
					orderCallback: () => {
						center.luckyCard.sendMegaBuy(first.gift_rid);
					},
				});
			}
			//关闭
			this.onClickClose();
		});
		this.Items.Node_real.Items.Sprite_btn_go.onClick(() => {
			//执行回调
			this.popupData.doRealCallback?.(this.popupData);
			//关闭
			this.onClickClose();
		});
		//右侧
		this.Items.Sprite_right.Items.Sprite_btn_go.onClick(() => {
			//执行回调
			this.popupData.doPracticeCallback?.(this.popupData);
			//关闭
			this.onClickClose();
		});
	}
}

declare global {
	namespace globalThis {
		type type_modeSwitch_GameBase = modeSwitch_GameBase
		/**换场参数 */
		type ModeSwitchData = {
			/**练习场回调 */
			doPracticeCallback?: (data: ModeSwitchData) => void
			/**真金场回调 */
			doRealCallback?: (data: ModeSwitchData) => void
			/**首充回调 */
			doFirstPayCallback?: (data: ModeSwitchData) => void
			/**窗口关闭时回调 */
			closeListener?: Function
			/**右上角按钮关闭界面 */
			cancelClickListener?: Function
		}
	}
}
