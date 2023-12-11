import { _decorator, Label, SpriteFrame, Sprite, Tween, tween, Vec3 } from 'cc';
import proto from '../../../app/center/common';
import { ACTOR } from '../../../app/config/cmd/ActorCMD';
import { DF_RATE, DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { EVENT_ID } from '../../../app/config/EventConfig';
import { PAY_MODE } from '../../../app/config/ModuleConfig';
const { ccclass } = _decorator;

import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

interface bankruptcyGiftData {
	quickRecharge?: QuickRecharge,
	/**取消购买回调 */
	cancelBuyCallback?: () => void
}

@ccclass('bankruptcyGift')
export class bankruptcyGift extends FWDialogViewBase {
	/**弹框参数 */
    popupData: bankruptcyGiftData = {}
	mQuickRecharge: QuickRecharge;
	mNum1: number;
	mNum2: number;
	giftText = fw.language.get("BONUS")
	initData() {
	}
	protected initEvents(): boolean | void {
		
	}
	protected initView(): boolean | void {
		if (!this.popupData || Object.keys(this.popupData).length == 0) {
			this.Items.text_cash.string = ""
			this.Items.text_bonus.string = ""
			this.Items.text_total.string = ""
			this.Items.money_nor.string = ""
			this.Items.money_now.string = ""
		}
		Tween.stopAllByTarget(this.Items.buy_btn)
		tween(this.Items.buy_btn)
			.to(1, { scale: new Vec3(1.1, 1.1, 1) })
			.to(1, { scale: new Vec3(1, 1, 1) })
			.union()
			.repeatForever()
			.start();
	}
	protected initBtns(): boolean | void {
		this.Items.buy_btn.onClickAndScale(() => {
            this.toBuy();
        });

		this.Items.Node_close.onClickAndScale(this.onClickCancelBuy.bind(this));
	}

	updatePopupView(): void {
		this.mQuickRecharge = this.popupData.quickRecharge;
		
		let bundleResConfig1 = fw.BundleConfig.plaza.res[`bankruptcyGift/img/coin_ico/spriteFrame`]
		let bundleResConfig2 = fw.BundleConfig.plaza.res[`bankruptcyGift/img/bonus_ico/spriteFrame`]
		if (this.mQuickRecharge) {
			let gold = this.mQuickRecharge.nQuickGoodsNum
			let num1 = gold
			let num2 = 0

			let hasWithdraw = 1
			let hasBonus = 2
			let count = 0
			this.mQuickRecharge.nQuickGiveGoodsID.forEach((id, index)=>{
				if (id == center.goods.gold_id.bonus) {
					count = count + hasBonus
				}
				if (id == center.goods.gold_id.withdraw_gold) {
					count = count + hasWithdraw
				}
			})
			if (count == 3 || count == 2) {// 上边金币和提现 下边bonus
				this.mQuickRecharge.nQuickGiveGoodsID.forEach((id, index)=>{
					if (id == center.goods.gold_id.cash ||id == center.goods.gold_id.withdraw_gold) {
						num1 = num1 + this.mQuickRecharge.nQuickGiveGoodsNum[index]
					}
					if (id == center.goods.gold_id.bonus) {
						num2 = this.mQuickRecharge.nQuickGiveGoodsNum[index]
					}
				})
			} else if (count == 1) {// 上边金币 下边提现
				bundleResConfig2 = fw.BundleConfig.plaza.res[`bankruptcyGift/img/coin_ico/spriteFrame`]
				this.mQuickRecharge.nQuickGiveGoodsID.forEach((id, index)=>{
					if (id == center.goods.gold_id.cash) {
						num1 = num1 + this.mQuickRecharge.nQuickGiveGoodsNum[index]
					}
					if (id == center.goods.gold_id.withdraw_gold) {
						num2 = this.mQuickRecharge.nQuickGiveGoodsNum[index]
					}
				})
				this.giftText = fw.language.get("WITHDRAW")
			} else { //只有金币
				bundleResConfig2 = fw.BundleConfig.plaza.res[`bankruptcyGift/img/coin_ico/spriteFrame`]
				this.mQuickRecharge.nQuickGiveGoodsID.forEach((id, index)=>{
					if (id == center.goods.gold_id.cash) {
						num2 = num2 + this.mQuickRecharge.nQuickGiveGoodsNum[index]
					}
				})
				this.giftText = fw.language.get("CASH")
			}

			this.Items.icon_1.loadBundleRes(bundleResConfig1,(res: SpriteFrame) => {
				this.Items.icon_1.getComponent(Sprite).spriteFrame = res;
				this.Items.icon_1.active = true;
			});
			this.Items.icon_2.loadBundleRes(bundleResConfig2,(res: SpriteFrame) => {
				this.Items.icon_2.getComponent(Sprite).spriteFrame = res;
				this.Items.icon_2.active = true;
			});

			let total = num1 + num2
			this.mNum1 = num1
			this.mNum2 = num2
			let payNum = this.mQuickRecharge.nQuickNeedRMB
			this.Items.text_reward.string = this.giftText
			this.Items.text_rate.string = "+" + String((total/DF_RATE-payNum)/payNum*100) + "%"
			this.Items.text_cash.string = "R" + num1/DF_RATE;
			this.Items.text_bonus.string = "R" + num2/DF_RATE;
			this.Items.text_total.string = "R" + total/DF_RATE;
			this.Items.money_now.string = `${"R"}${payNum}`;
			this.Items.money_nor.string = `${"R"}${total/DF_RATE}`;
		}
	}

	onClickCancelBuy() {
        this.popupData.cancelBuyCallback?.();
        this.onCancelClickClose();
    }

	setCancelBuyCallback(callback: () => void) {
        this.popupData.cancelBuyCallback = callback;
    }

	toBuy() {
		if (this.mQuickRecharge) { 
			app.sdk.setPrice(this.mQuickRecharge.nQuickNeedRMB)
			app.sdk.setGoodsName(DF_SYMBOL+this.mQuickRecharge.nQuickNeedRMB)
			app.sdk.setRID(this.mQuickRecharge.nRID)
			app.sdk.setPayMode(PAY_MODE.PAY_MODE_NOR)
			let dataEx: PayChannelData = {
				cashBonusInfo: {
					cash: this.mNum1 / DF_RATE,
					bonus: this.mNum2 / DF_RATE,
					payCash: this.mQuickRecharge.nQuickNeedRMB,
				},
				orderCallback: () => {
					center.giftBag.send_PLAZA_GIFTBAG_BUSTBAG_BUY(this.mQuickRecharge.nRID, proto.plaza_giftbag.GIFTTYPE.BustGiftBag);
					this.onClickClose()
				},
				giftText: this.giftText,
				isAutoSelect: true,
			}
			center.mall.payChooseType(dataEx);
		}
	}
}
