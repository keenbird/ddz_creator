import { _decorator } from 'cc';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
const { ccclass } = _decorator;

@ccclass('MyShare')
export class MyShare extends FWDialogViewBase {
	initData() {

	}
	protected initEvents(): boolean | void {

	}
	protected initView(): boolean | void {

	}
	protected initBtns(): boolean | void {
		this.Items.share_FB.onClickAndScale(() => { this.facebookShareLink() });
		this.Items.share_whatsapp.onClickAndScale(() => { this.whatsappShareLink() });
		this.Items.share_more.onClickAndScale(() => { this.facebookShareMore() });
		this.Items.share_copy.onClickAndScale(() => { this.copyLink() });
	}
	facebookShareLink() {
		let dec = center.share.getShareDescribe()
		let url = center.share.getShareLinkUrl(center.share.shareScene.freeBoonus)
		if (url == "") {
			app.popup.showToast(fw.language.get("Sharing configuration error!"))
		} else {
			app.native.facebook.shareLink(url, dec)
		}
	}
	facebookShareMore() {
		let url = center.share.getShareLinkUrl(center.share.shareScene.freeBoonus)
		if (url == "") {
			app.popup.showToast(fw.language.get("Sharing configuration error!"))
		} else {
			app.native.facebook.shareMore(url, "share to")
		}
	}
	whatsappShareLink() {
		let dec = center.share.getShareDescribe()
		let url = center.share.getShareLinkUrl(center.share.shareScene.freeBoonus)
		if (url == "") {
			app.popup.showToast(fw.language.get("Sharing configuration error!"))
		} else {
			app.native.device.shareTextToWhatsApp(dec + "\n" + url)
		}
	}
	copyLink() {
		let dec = center.share.getShareDescribe()
		let url = center.share.getShareLinkUrl(center.share.shareScene.freeBoonus)
		if (url == "") {
			app.popup.showToast(fw.language.get("Sharing configuration error!"))
		} else {
			app.native.device.setClipBoard(dec + "\n" + url)
		}
	}
}
