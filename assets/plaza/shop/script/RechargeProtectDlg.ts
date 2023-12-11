import { js } from 'cc';
import { Label, UITransform, _decorator } from 'cc';
import { ACTOR } from '../../../app/config/cmd/ActorCMD';
import { EVENT_ID } from '../../../app/config/EventConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
const { ccclass } = _decorator;

@ccclass('RechargeProtectDlg')
export class RechargeProtectDlg extends FWDialogViewBase {
	action: any;
	initData() {

	}
	protected initEvents(): boolean | void {
		this.bindEvent({
            eventName: EVENT_ID.EVENT_RECHARGE_PROTECT_REWARD,
            callback: () => {
                this.onClickClose()
            }
        });
	}
	protected initView(): boolean | void {
		let nReward = center.user.getActorProp(ACTOR.ACTOR_PROP_RECHARGE_PROTECT_PRIZE)
		nReward = nReward / 100
		this.Items.bmpPrize.getComponent(Label).string = nReward
		this.Items.bmpPrize.getComponent(Label).updateRenderData(true);

		let iconWidth = this.Items.prizeIcon.getComponent(UITransform).contentSize.width
		let fontWidth = this.Items.bmpPrize.getComponent(UITransform).contentSize.width
		let totalWidth = fontWidth + iconWidth
		let bgnX = totalWidth * -0.5
		this.Items.prizeIcon.setPosition(bgnX + iconWidth * 0.5, this.Items.prizeIcon.getPosition().y)
		this.Items.bmpPrize.setPosition(bgnX + iconWidth + fontWidth * 0.5 + 5, this.Items.bmpPrize.getPosition().y)

		let ptime = center.mall.getRechargeProtectTime()
		let nHour = ptime.nHour
		let nMin = ptime.nMin
		let nSecond = ptime.nSecond
		let nDelTime = ptime.nDelTime
		if (nDelTime > 0) {
			this.Items.rewardTime.getComponent(Label).string = js.formatStr("%s:%s:%s", app.func.formatNumberForZore(nHour), app.func.formatNumberForZore(nMin), app.func.formatNumberForZore(nSecond))

			let iconWidth = this.Items.rewardIcon.getComponent(UITransform).contentSize.width
			let fontWidth = this.Items.rewardTime.getComponent(UITransform).contentSize.width
			let totalWidth = fontWidth + iconWidth
			let bgnX = (288 - totalWidth) * 0.5
			this.Items.rewardIcon.setPosition(bgnX + iconWidth * 0.5, this.Items.prizeIcon.getPosition().y)
			this.Items.rewardTime.setPosition(bgnX + iconWidth + fontWidth * 0.5 + 5, this.Items.bmpPrize.getPosition().y)

			this.stopTime()
			this.action = this.setInterval(this.updateTime, 1)
		} else {
			this.Items.rewardIcon.active = false
			this.Items.rewardTime.active = false
			this.Items.rewardTitle.setPosition(this.Items.rewardTitle.getPosition().x, 0)
		}

	}
	protected initBtns(): boolean | void {
		this.Items.close_btn.onClickAndScale(() => {
			this.onClickClose();
		})
		this.Items.rewardBtn.onClickAndScale(() => {
			this.onClickReward();
		})
	}
	onClickReward() {
		let ptime = center.mall.getRechargeProtectTime()
		let nDelTime = ptime.nDelTime
		if (nDelTime <= 0) {
			let bOpen = center.mall.isRechargeProtectOpen()
			if (bOpen) {
				center.mall.sendGetProtectReward()
			} else {
				app.popup.showToast("After the time is over you can get")
			}
		} else {
			app.popup.showToast("After the time is over you can get")
		}
	}
	updateTime() {
		let ptime = center.mall.getRechargeProtectTime()
		let nHour = ptime.nHour
		let nMin = ptime.nMin
		let nSecond = ptime.nSecond
		let nDelTime = ptime.nDelTime

		this.Items.rewardTime.getComponent(Label).string = js.formatStr("%s:%s:%s", app.func.formatNumberForZore(nHour), app.func.formatNumberForZore(nMin), app.func.formatNumberForZore(nSecond))
		let iconWidth = this.Items.rewardIcon.getComponent(UITransform).contentSize.width
		let fontWidth = this.Items.rewardTime.getComponent(UITransform).contentSize.width
		let totalWidth = fontWidth + iconWidth
		let bgnX = (288 - totalWidth) * 0.5
		this.Items.rewardIcon.setPosition(bgnX + iconWidth * 0.5, this.Items.prizeIcon.getPosition().y)
		this.Items.rewardTime.setPosition(bgnX + iconWidth + fontWidth * 0.5 + 5, this.Items.bmpPrize.getPosition().y)
		if (nDelTime <= 0) {
			this.stopTime()
			this.Items.rewardIcon.active = false
			this.Items.rewardTime.active = false
			this.Items.rewardTitle.setPosition(this.Items.prizeIcon.getPosition().x, 56)
		}
	}
	stopTime() {
		if (this.action) {
			this.clearIntervalTimer(this.action)
			this.action = null
		}
	}
}
