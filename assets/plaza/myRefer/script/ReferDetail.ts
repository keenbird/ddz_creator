import { instantiate } from 'cc';
import { Prefab } from 'cc';
import { Label } from 'cc';
import { js } from 'cc';
import { _decorator } from 'cc';
import { ACTOR } from '../../../app/config/cmd/ActorCMD';
import { DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { httpConfig } from '../../../app/config/HttpConfig';
import { guide_hand_1 } from '../../../resources/ui/guide/script/guide_hand_1';
const { ccclass } = _decorator;

@ccclass('ReferDetail')
export class ReferDetail extends (fw.FWComponent) {
	shareLinkCb: any;
	shareMoreCb: any;
	copyLinkCb: any;
	whatsappCb: any;
	initData() {
		this.checkGuide()
	}
	protected initEvents(): boolean | void {

	}
	protected initView(): boolean | void {
		this.getReferInfo()
	}
	protected initBtns(): boolean | void {
		this.Items.share_FB.onClickAndScale(() => {
			this.removeGuideTips()
			if (this.shareLinkCb) { this.shareLinkCb() }
		});
		this.Items.share_more.onClickAndScale(() => {
			this.removeGuideTips()
			if (this.shareMoreCb) { this.shareMoreCb() }
		});
		this.Items.share_copy.onClickAndScale(() => {
			this.removeGuideTips()
			if (this.copyLinkCb) { this.copyLinkCb() }
		});
		this.Items.share_whatsapp.onClickAndScale(() => {
			this.removeGuideTips()
			if (this.whatsappCb) { this.whatsappCb() }
		});
	}
	setShareLinkCallback(fun) {
		this.shareLinkCb = fun
	}
	setShareMoreCallback(fun) {
		this.shareMoreCb = fun
	}
	setCopyLinkCallback(fun) {
		this.copyLinkCb = fun
	}
	setWhatsappCallback(fun) {
		this.whatsappCb = fun
	}
	getReferInfo() {
		let params: any = {
			user_id: center.user.getActorProp(ACTOR.ACTOR_PROP_DBID),
			timestamp: app.func.time()
		}
		params.sign = app.http.getSign(params)
		try {
			app.http.post({
				url: httpConfig.path_pay + "User/getRefer",
				params: params,
				callback: (bSuccess, response) => {
					if (bSuccess) {
						if (!fw.isNull(response)) {
							if (1 == response.status) {
								// 缓存活动数据
								if (!fw.isNull(response.data) && !fw.isNull(this.Items.direct_bonus)) {
									this.setData(response.data)
									this.initUserAndProfit(response.data.yesuser)
								}
							}
						}
					} else {
						fw.print("get getEmergencyInfo failed!");
					}
				}
			});
		} catch (e) {

		}
	}
	setData(data) {
		if (data && !fw.isNull(this.Items.direct_bonus)) {
			this.Items.direct_bonus_num.getComponent(Label).string = DF_SYMBOL + data.dirbonus
			this.Items.indirect_bonus_num.getComponent(Label).string = DF_SYMBOL + data.indirbonus

			this.Items.increase_num1.getComponent(Label).string = data.dirincr
			this.Items.increase_num2.getComponent(Label).string = data.indirincr

			this.Items.increase_num1_total.getComponent(Label).string = data.dirfriends
			this.Items.increase_num2_total.getComponent(Label).string = data.indirfriends
		}
	}
	initUserAndProfit(info) {
		let nick_name = ""
		let face_md5 = ""
		let user_id = 0
		let profit = 0
		if (typeof (info) == `object`) {
			face_md5 = String(info.face_md5)
			nick_name = String(info.nickname)
			user_id = Number(info.user_id)
			profit = Number(info.profit)
		}
		if (user_id == 0) {
			face_md5 = "e136374dfa5293236b41303de25689c7"
			nick_name = "--------"
		}
		this.Items.Text_name.getComponent(Label).string = nick_name
		this.Items.Text_earn.getComponent(Label).string = DF_SYMBOL + profit
		//头像
		app.file.updateHead({
			node: this.Items.head_icon,
			serverPicID: face_md5,
		});
	}
	checkGuide() {
		let regstTime = new Date(center.user.getRegisterTime() * 1000)
		let regsDay = new Date(js.formatStr("%s-%s-%s", regstTime.getFullYear(), regstTime.getMonth(), regstTime.getDate())).getTime()
		let alredyRegisterDay = Math.ceil((app.func.time() - regsDay / 1000) / 3600 / 24)
		// let alredyRegisterDay = 0
		// fw.print("jhaksdhakshdjdhsjkdhfks", center.user.getRegisterTime())
		// fw.print(regstTime.getMonth(), regstTime.getDate(), alredyRegisterDay)

		if (alredyRegisterDay <= 3) {
			let items = [this.Items.share_FB, this.Items.share_more, this.Items.share_copy, this.Items.share_whatsapp,]
			for (let index = 0; index < items.length; index++) {
				items[index].loadBundleRes(fw.BundleConfig.resources.res[`ui/guide/guide_hand_1`],(res: Prefab) => {
					let node = instantiate(res);
					let items_node = items[index]
					items_node.addChild(node);
					let items_data = (<any>items_node).data ??= {}
					items_data.guide = node;
					node.getComponent(guide_hand_1).playAnim();
				});
			}
		}
	}
	removeGuideTips() {
		let items = [this.Items.share_FB, this.Items.share_more, this.Items.share_copy, this.Items.share_whatsapp,]
		for (let index = 0; index < items.length; index++) {
			let items_node = items[index]
			let items_data = (<any>items_node).data ??= {}
			if (items_data && items_data.guide) {
				items_data.guide.removeFromParent(true)
				items_data.guide = null;
			}
		}
	}
}
