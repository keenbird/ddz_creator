import { instantiate } from 'cc';
import { _decorator } from 'cc';
import { httpConfig } from '../../../app/config/HttpConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
import { ReferDetail } from './ReferDetail';
const { ccclass } = _decorator;

@ccclass('MyRefer')
export class MyRefer extends FWDialogViewBase {
	initData() {

	}
	protected initEvents(): boolean | void {

	}
	protected initView(): boolean | void {
		this.Items.Node_menu_item.active = false;
		this.getRulesConfig()
		let Refer = this.Items.Panel_refer.obtainComponent(ReferDetail)
		Refer.setShareLinkCallback(() => { this.facebookShareLink() })
		Refer.setShareMoreCallback(() => { this.facebookShareMore() })
		Refer.setCopyLinkCallback(() => { this.copyLink() })
		Refer.setWhatsappCallback(() => { this.whatsappShareLink() })
	}
	protected initBtns(): boolean | void {
		// --菜单
		let btns = []
		let menuList = [
			{ text: "My Refer", viewNode: this.Items.Panel_refer, },
			{ text: "Rules", viewNode: this.Items.Panel_rules, },
			{ text: "Bonus", viewNode: this.Items.Panel_bonus, },
			{ text: "Referrals", viewNode: this.Items.Panel_referrals, },
			{ text: "Rank", viewNode: this.Items.Panel_rank, }
		]
		for (let index = 0; index < menuList.length; index++) {
			let element = menuList[index]
			let btn = {
				node: instantiate(this.Items.Node_menu_item),
				text: element.text,
				data: element,
				callback: () => {
					for (let i = 0; i < menuList.length; i++) {
						const v = menuList[i].viewNode;
						v.active = i == index;
					}
				},
			}
			this.Items.content.addChild(btn.node);
			btn.node.active = true;
			btns.push(btn);
		}

		//创建菜单
		app.func.createMenu({
			mountObject: this,
			btns: btns,
		});

		this.Items.share_FB_0.onClickAndScale(() => {
			this.facebookShareLink()
		});
		this.Items.share_more_0.onClickAndScale(() => {
			this.facebookShareMore()
		});
		this.Items.share_copy_0.onClickAndScale(() => {
			this.copyLink()
		});
		this.Items.share_whatsapp_0.onClickAndScale(() => {
			this.whatsappShareLink()
		});
	}
	facebookShareLink() {
		// fw.print("facebookShareLink getShareDescribe", center.share.getShareDescribe())
		// fw.print("facebookShareLink getShareLinkUrl", center.share.getShareLinkUrl())
		let PreLink = center.share.getShareLinkUrlValid()
		if (PreLink == "") {
			app.popup.showToast({ text: "Sharing configuration error!" })
		} else {
			app.sdk.facebookShareLink(center.share.getShareLinkUrl(), center.share.getShareDescribe())
		}
	}
	facebookShareMore() {
		let PreLink = center.share.getShareLinkUrlValid()
		if (PreLink == "") {
			app.popup.showToast({ text: "Sharing configuration error!" })
		} else {
			app.sdk.shareMore(center.share.getShareLinkUrl(),"share to")
		}
	}
	copyLink() {
		app.native.device.setClipBoard(center.share.getShareDescribe() + '\n' + center.share.getShareLinkUrl())
	}

	whatsappShareLink() {
		// fw.print("facebookShareLink getShareDescribe", center.share.getShareDescribe())
		// fw.print("facebookShareLink getShareLinkUrl", center.share.getShareLinkUrl())
		let PreLink = center.share.getShareLinkUrlValid()
		if (PreLink == "") {
			app.popup.showToast({ text: "Sharing configuration error!" })
		} else {
			app.native.device.shareTextToWhatsApp(center.share.getShareDescribe() + '\n' + center.share.getShareLinkUrl())
		}
	}

	getRulesConfig() {
		let params: any = {}
		params.sign = app.http.getSign(params)
		try {
			app.http.post({
				url: httpConfig.path_pay + "common/Info",
				params: params,
				callback: (bSuccess, response) => {
					if (bSuccess) {
						if (!fw.isNull(response)) {
							if (1 == response.status) {
								// 缓存活动数据
								if (!fw.isNull(response.data)) {
								}
							}
						}
					} else {
						fw.print("get getRulesConfig failed!");
					}
				}
			});
		} catch (e) {

		}
	}
}
