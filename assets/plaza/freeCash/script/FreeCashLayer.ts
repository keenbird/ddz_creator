import { Label, RichText, tween, Tween } from 'cc';
import { Vec3 } from 'cc';
import { js } from 'cc';
import { _decorator } from 'cc';
import { DF_RATE, DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { EVENT_ID } from '../../../app/config/EventConfig';
const { ccclass } = _decorator;
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('FreeCashLayer')
export class FreeCashLayer extends FWDialogViewBase {
	schedule_updateTime: any;
	initData() {

	}
	protected initEvents(): boolean | void {
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_PLAZA_SHARE_OPEN,
				EVENT_ID.EVENT_PLAZA_SHARE_FREECASH_CHANGE,
			],
			callback: (arg1, arg2) => {
				let isOpen = center.share.isFreeCashOpen()
				if (isOpen) {
					this.updateView(false)
				} else {
					this.onClickClose()
				}
			}
		});
		this.bindEvent({
            eventName: ["closeDialogAfterWithdraw"],
            callback: () => {
                this.onClickClose()
            }
        });
	}
	protected initView(): boolean | void {
		this.Items.Text_withdraw.string = fw.language.get("Withdraw")
		this.Items.Text_invitation.string = fw.language.get("Invitation List")
		this.Items.Text_desc1.getComponent(RichText).string = fw.language.getString("<color=#8beef6>1.You can withdraw when your Activated cash reaches </color><color=#ffe84b>${DF_SYMBOL1}100</color>",{
			DF_SYMBOL1:DF_SYMBOL,
		})
		this.Items.Text_desc2.getComponent(RichText).string = fw.language.getString("<color=#8beef6>2.After your friends play game ,you will randomly get </color><color=#ffe84b>${DF_SYMBOL1}0.01-${DF_SYMBOL2}10</color>",{
			DF_SYMBOL1:DF_SYMBOL,DF_SYMBOL2:DF_SYMBOL,
		})
		this.Items.Text_desc3.getComponent(RichText).string = fw.language.getString("<color=#8beef6>3.When your friend recharges, you will get </color><color=#ffe84b>${DF_SYMBOL1}0.1-${DF_SYMBOL2}10</color><color=#0fffff>. (only once)</color>",{
			DF_SYMBOL1:DF_SYMBOL,DF_SYMBOL2:DF_SYMBOL,
		})
		this.Items.Text_desc4.getComponent(RichText).string = fw.language.get("<color=#8beef6>Notice:Only inviting new device users is valid</color>")

		Tween.stopAllByTarget(this.Items.Image_share)
		tween(this.Items.Image_share)
			.to(1, { scale: new Vec3(1.1, 1.1, 1) })
			.to(1, { scale: new Vec3(1, 1, 1) })
			.union()
			.repeatForever()
			.start();
		this.updateView(true)
	}
	protected initBtns(): boolean | void {
		this.Items.Image_close.onClickAndScale(() => {
			this.onClickClose()
		});
		this.Items.Image_withdraw.onClickAndScale(() => {
			this.onClickWithdraw()
		});
		this.Items.Image_invitation.onClickAndScale(() => {
			this.onClickinvitation()
		});
		this.Items.Image_share.onClickAndScale(() => {
			this.onClickShare()
		});
	}
	updateView(isIn) {
		let isOpen = center.share.isOpen()
		if (isOpen) {
			let maxCash = center.share.getMaxCash()
			let inviteData = center.share.getInviteData()
			let offset = (maxCash - inviteData.nCash) / DF_RATE
			this.Items.Node_last.getComponent(RichText).string = fw.language.getString("<color=#2781a0>Only need </color><color=#ED675A>${DF_SYMBOL1}${num1}</color><color=#2781a0> to withdraw </color><color=#ED675A>${DF_SYMBOL2}${num2}</color>",{
				DF_SYMBOL1:DF_SYMBOL,num1:offset,DF_SYMBOL2:DF_SYMBOL,num2:maxCash/ DF_RATE,
			})

			let start_num = 0
			let end_num = inviteData.nCash
			this.Items.free_num.getComponent(Label).string = DF_SYMBOL + String(inviteData.nCash / DF_RATE)

			let updateLastTime = () => {
				start_num = start_num + 1551
				if (start_num >= end_num) {
					start_num = end_num
					stop()
				}
				this.Items.free_num.getComponent(Label).string = DF_SYMBOL + String(start_num / DF_RATE)
			}
			let stop = ()=>{
				if (this.schedule_updateTime) {
					this.clearIntervalTimer(this.schedule_updateTime)
					this.schedule_updateTime = null
				}
			}
			stop()
			if (isIn) {
				updateLastTime()
				this.schedule_updateTime = this.setInterval(updateLastTime, 0.05)
			}
  
			if (inviteData.nCash >= maxCash) {
				this.Items.Node_last.getComponent(RichText).string = fw.language.get("<color=#2781a0>You can withdraw!</color>")
				Tween.stopAllByTarget(this.Items.Image_share)
				this.Items.Image_share.active = false
			}
		}
	}
	onClickWithdraw() {
		let maxCash = center.share.getMaxCash()
		let inviteData = center.share.getInviteData()
		if (inviteData.nCash >= maxCash) {
			if (!center.user.isFillAllPayInfo()) {
				//填充信息弹窗
				app.popup.showDialog({
					viewConfig: fw.BundleConfig.plaza.res[`userInfo/withdraw_info`],
					data:{
						callback :()=>{
							app.popup.showDialog({
								viewConfig: fw.BundleConfig.plaza.res[`withdraw/withdraw_account`],
								data: {
									nWithDrawNum: maxCash,
									bShareWithDraw: true
								},
							});
						}
					}
				});
			} else {
				app.popup.showDialog({
					viewConfig: fw.BundleConfig.plaza.res[`withdraw/withdraw_account`],
					data: {
						nWithDrawNum: maxCash,
						bShareWithDraw: true
					},
				});
			}
		} else {
			this.onClickShare()
		}
	}
	onClickinvitation() {
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`freeCash/freeCash_sharelist`]
		});
	}
	onClickShare() {
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`freeCash/freeCash_share`]
		});
	}


}
