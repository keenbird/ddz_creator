import { js, Animation } from 'cc';
import { AnimationClip } from 'cc';
import { Label, v3 } from 'cc';
import { _decorator } from 'cc';
import { EVENT_ID } from '../../../app/config/EventConfig';
const { ccclass } = _decorator;

@ccclass('RechargeProtect')
export class RechargeProtect extends (fw.FWComponent) {
	action: any;
	initData() {

	}
	protected initEvents(): boolean | void {
		fw.print("RechargeProtect =================== 22222")
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_RECHARGE_PROTECT_CFG,
			],
			callback: (arg1, arg2) => {
				if (arg1.data.isClose == 0) {
					this.node.removeFromParent(true)
				}
			}
		});
	}
	protected initView(): boolean | void {
		let bInGame = fw.scene.getSceneName() == fw.SceneConfigs.plaza.sceneName

		let scale = bInGame && 0.75 || 1
		let ptime = center.mall.getRechargeProtectTime()
		let nHour = ptime.nHour
		let nMin = ptime.nMin
		let nSecond = ptime.nSecond
		let nDelTime = ptime.nDelTime

		this.Items.timeBgPlaza.active = !bInGame
		this.Items.timeBgGame.active = bInGame
		this.Items.bg.scale = v3(scale, scale, scale)

		if (nDelTime > 0) {
			this.Items.txtTime.getComponent(Label).string = js.formatStr("%s:%s:%s", app.func.formatNumberForZore(nHour), app.func.formatNumberForZore(nMin), app.func.formatNumberForZore(nSecond))
			this.Items.bg.active = true
			this.stopTime()
			this.action = this.setInterval(this.updateTime.bind(this), 1)
		} else {
			this.Items.timeBgPlaza.active = false
			this.Items.timeBgGame.active = false
			this.Items.txtTime.active = false
			this.Items.bg.active = false
		}

		let pAni = this.Items.anim.getComponent(Animation);
		this.scheduleOnce(() => {
			pAni.play();
		}, 0)
	}
	protected initBtns(): boolean | void {
		this.Items.imgTouch.onClickAndScale(() => {
			this.onClickBtn();
		})
	}
	onClickBtn() {
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`shop/rechargeProtectDlg`]
		});
	}
	updateTime() {
		let ptime = center.mall.getRechargeProtectTime()
		let nHour = ptime.nHour
		let nMin = ptime.nMin
		let nSecond = ptime.nSecond
		let nDelTime = ptime.nDelTime

		this.Items.txtTime.getComponent(Label).string = js.formatStr("%s:%s:%s", app.func.formatNumberForZore(nHour), app.func.formatNumberForZore(nMin), app.func.formatNumberForZore(nSecond))
		if (nDelTime <= 0) {
			this.stopTime()
			this.Items.timeBgPlaza.active = false
			this.Items.timeBgGame.active = false
			this.Items.txtTime.active = false
			this.Items.bg.active = false
		}
	}
	stopTime() {
		if (this.action) {
			this.clearIntervalTimer(this.action)
			this.action = null
		}
	}
}
