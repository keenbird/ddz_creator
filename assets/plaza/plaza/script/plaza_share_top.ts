import { instantiate, js, Label, Prefab, sp, Sprite, SpriteFrame, UITransform, view, _decorator } from 'cc';
import { ENCONTAINER_PACKET } from '../../../app/center/userCenter';
import { ACTOR } from '../../../app/config/cmd/ActorCMD';
import { DF_RATE, DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { EVENT_ID } from '../../../app/config/EventConfig';
import { guide_hand_1 } from '../../../resources/ui/guide/script/guide_hand_1';
import { plaza_main } from './plaza_main';
import { Node_bonus } from '../ui/bonus/Node_bonus';
const { ccclass } = _decorator;

@ccclass('plaza_share_top')
export class plaza_share_top extends (fw.FWComponent) {
	loginCashTimer: number;
	megaGiftClockTimer: number;
	private _bonusCtrl: Node_bonus;
	initData() {
	}
	protected initEvents(): boolean | void {
		this.bindEvent({
			eventName: "clickWithdrawBtn",
			callback: (data) => {
				this.clickBtnWithdraw();
			}
		});
	}
	protected initView(): boolean | void {
	

		//金额
		this.updateGold();
		center.user.event.bindEvent({
			valideTarget: this.node,
			eventName: ACTOR.ACTOR_PROP_GOLD,
			callback: this.updateGold.bind(this)
		});
	}
	protected initBtns(): boolean | void {
		//bonus
		this._bonusCtrl = this.Items.Node_bonus.getComponent(Node_bonus);
		//more
		this.initBtnMore();
		//提现
		this.initBtnWithdraw();
		//AddCash
		this.initBtnAddCash();
		//MegaGift
		this.initBtnMegaGift();
	}
	updateGold() {
		this.Items.Label_gold.getComponent(Label).string = `${center.user.getActorGold() / DF_RATE}`;
	}
	initBtnMore() {
		this.Items.Node_more.onClickAndScale(() => {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`more/more`]
			});
		});
	}
	initBtnWithdraw() {
		this.Items.Sprite_withdraw.onClickAndScale(() => {
			this.clickBtnWithdraw()
		});
	}
	clickBtnWithdraw() {
		let cfg = center.exchange.getCashOutCfg();
		if (cfg.open) {
			//提现
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`withdraw/withdraw_main`]
			});
		} else {
			app.popup.showTip({
				text: fw.language.get("Can't open, please log in the game again. Still can't open, please contact us.")
			});
		}
	}
	initBtnAddCash() {
		let goMall = () => {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`shop/shop_main`]
			});
			center.user.popGift(false, false, true)
		}
		this.Items.Sprite_gold_bg.onClick(() => {
			goMall()
		});
	}
	initBtnMegaGift() {
		let pos = this.Items.Node_megaGift.getPosition()
		let withdraw_rX = this.Items.Sprite_withdraw.getPosition().x + this.Items.Sprite_withdraw.getComponent(UITransform).width/2
		let more_lX = this.Items.Node_more.getPosition().x - 40
		this.Items.Node_megaGift.setPosition(withdraw_rX+(more_lX-withdraw_rX)/2, pos.y)

		this.Items.Node_megaGift.active = false
		let nBuffNum = center.user.getBuffNum()
		if(nBuffNum == 1){
			if(center.luckyCard.checkShowMegaGift() && app.sdk.isSdkOpen("firstpay")){
				this.Items.Node_megaGift.active = true
				this.clearIntervalTimer(this.megaGiftClockTimer);
				let setTime = () => {
					let overTime = center.luckyCard.getMegaFinishTime() - app.func.time();
					if (overTime <= 0) {
						this.clearIntervalTimer(this.megaGiftClockTimer);
						this.Items.Node_megaGift.active = false
						return;
					}
					let hour = Math.floor(overTime / 3600);
					let second = overTime % 60;
					let min = Math.floor(overTime % 3600 / 60);
					this.Items.Node_megaGift.Items.Text_time.getComponent(Label).string = js.formatStr("%s:%s:%s", app.func.formatNumberForZore(hour), app.func.formatNumberForZore(min), app.func.formatNumberForZore(second));
					//时间小于24小时再显示
					this.Items.Node_megaGift.Items.Image.active = hour < 24;
				}
				setTime();
				this.megaGiftClockTimer = this.setInterval(() => {
					setTime();
				}, 1);

				this.Items.Node_megaGift.Items.Rate_gift.string = `${app.func.numberAccuracy(center.luckyCard.getMegaGiftRate() * 100)}%`
			}
		}

		this.Items.Node_megaGift.onClickAndScale(() => {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`megaGift/MegaGift`]
			})
		});
	}
}
