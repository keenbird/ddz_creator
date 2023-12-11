import { js } from 'cc';
import { Label, RichText } from 'cc';
import { _decorator } from 'cc';
import { DF_RATE, DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { EVENT_ID } from '../../../app/config/EventConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
const { ccclass } = _decorator;

@ccclass('FreeCashShareLayer')
export class FreeCashShareLayer extends FWDialogViewBase {
	initData() {

	}
	protected initEvents(): boolean | void {
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_PLAZA_SHARE_FREECASH_CHANGE,
			],
			callback: (arg1, arg2) => {
				let inviteData = center.share.getInviteData()
				if (!fw.isNull(this.Items.free_num)) {
					this.Items.free_num.getComponent(Label).string = String(inviteData.nCash / DF_RATE)
				}
			}
		});
	}
	protected initView(): boolean | void {
		this.Items.Text_title.string = fw.language.getString("SHARE TO FRIENDS")
		this.Items.now_need_to.string = fw.language.getString("share to friends help get bonus")
		this.Items.share_more_Text.string = fw.language.getString("Others")
		this.Items.share_copy_Text.string = fw.language.getString("Copy link")
		this.updateView()
	}
	protected initBtns(): boolean | void {
		this.Items.Panel_close.onClickAndScale(() => {
			this.onClickClose()
		});
		this.Items.share_FB.onClickAndScale(() => {
			this.facebookShareLink()
		});
		this.Items.share_whatsapp.onClickAndScale(() => {
			this.whatsappShareLink()
		});
		this.Items.share_more.onClickAndScale(() => {
			this.facebookShareMore()
		});
		this.Items.share_copy.onClickAndScale(() => {
			this.copyLink()
		});
	}
	updateView() {
		let isOpen = center.share.isOpen()
		if (isOpen) {
			let maxCash = center.share.getMaxCash()
			let inviteData = center.share.getInviteData()
			let offset = (maxCash - inviteData.nCash) / DF_RATE
			this.Items.Node_last.getComponent(RichText).string = fw.language.getString("<color=#2781a0>Only need </color><color=#ED675A>${DF_SYMBOL1}${num1}</color><color=#2781a0> to withdraw </color><color=#ED675A>${DF_SYMBOL2}${num2}</color>",{
				DF_SYMBOL1:DF_SYMBOL,num1:offset,DF_SYMBOL2:DF_SYMBOL,num2:maxCash/DF_RATE,
			})
		}
	}
	facebookShareLink() {
		let dec = center.share.getShareDescribe()
		let url = center.share.getShareLinkUrl(center.share.shareScene.freeCash)
		fw.print("facebookShareLink getShareDescribe", dec)
		fw.print("facebookShareLink getShareLinkUrl", url)
		if (url == "") {
			app.popup.showToast(fw.language.get("Sharing configuration error!"))
		} else {
			app.native.facebook.shareLink(url, dec)
		}
	}
	facebookShareMore() {
		let url = center.share.getShareLinkUrl(center.share.shareScene.freeCash)
		if (url == "") {
			app.popup.showToast(fw.language.get("Sharing configuration error!"))
		} else {
			app.native.facebook.shareMore(url, "share to")
		}
	}
	whatsappShareLink() {
		let dec = center.share.getShareDescribe()
		let url = center.share.getShareLinkUrl(center.share.shareScene.freeCash)
		fw.print("whatsappShareLink getShareDescribe", dec)
		fw.print("whatsappShareLink getShareLinkUrl", url)
		if (url == "") {
			app.popup.showToast(fw.language.get("Sharing configuration error!"))
		} else {
			app.native.device.shareTextToWhatsApp(dec+'\n'+url)
		}
	}
	copyLink() {
		let dec = center.share.getShareDescribe()
		let url = center.share.getShareLinkUrl(center.share.shareScene.freeCash)
		if (url == "") {
			app.popup.showToast(fw.language.get("Sharing configuration error!"))
		} else {
			app.native.device.setClipBoard(dec+"\n"+url)
		}
	}

}
