import { SpriteFrame } from 'cc';
import { Color } from 'cc';
import { Label } from 'cc';
import { UITransform } from 'cc';
import { Sprite } from 'cc';
import { _decorator } from 'cc';
import { ACTOR } from '../../../app/config/cmd/ActorCMD';
import { DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { httpConfig } from '../../../app/config/HttpConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
const { ccclass } = _decorator;

@ccclass('ReferRank')
export class ReferRank extends FWDialogViewBase {
	nCurIndex: number;
	rank_select_color: any;
	rank_selected_color: Color;
	rankInfo: any;
	initData() {
		this.rank_select_color = new Color(0xE3, 0x9E, 0x4F)
		this.rank_selected_color = new Color(0x7C, 0x51, 0x23)
		this.getReferRankInfo()
	}
	protected initEvents(): boolean | void {

	}
	protected initView(): boolean | void {
		this.changeTitle({ title: `Invitation List` });
		this.Items.task_item.active = false
		this.Items.ListView_rank.Items.Layout.removeAllChildren(true)
		this.updataBtnState()
	}
	protected initBtns(): boolean | void {
		this.Items.yesterday_earn.onClickAndScale(() => { this.clickYesterdayEarn() });
		this.Items.total_earn.onClickAndScale(() => { this.clickTotalEarn() });
	}
	updataBtnState() {
		let path_an1 = fw.BundleConfig.plaza.res["myRefer/img/TC_ph_an1/spriteFrame"]
		let path_an2 = fw.BundleConfig.plaza.res["myRefer/img/TC_ph_an2/spriteFrame"]

		if (this.nCurIndex == 1) {
			this.Items.yesterday_earn.loadBundleRes(path_an1,(res: SpriteFrame) => {
				this.Items.yesterday_earn.obtainComponent(Sprite).spriteFrame = res;
			});
			this.Items.total_earn.loadBundleRes(path_an2,(res: SpriteFrame) => {
				this.Items.total_earn.obtainComponent(Sprite).spriteFrame = res;
			});
			this.Items.yesterdayEarn.obtainComponent(Label).color = this.rank_selected_color
			this.Items.TotalEarn.obtainComponent(Label).color = this.rank_select_color
		} else {
			this.Items.yesterday_earn.loadBundleRes(path_an2,(res: SpriteFrame) => {
				this.Items.yesterday_earn.obtainComponent(Sprite).spriteFrame = res;
			});
			this.Items.total_earn.loadBundleRes(path_an1,(res: SpriteFrame) => {
				this.Items.total_earn.obtainComponent(Sprite).spriteFrame = res;
			});
			this.Items.yesterdayEarn.obtainComponent(Label).color = this.rank_select_color
			this.Items.TotalEarn.obtainComponent(Label).color = this.rank_selected_color
		}
	}
	updateData() {
		let rankList = null
		if (this.nCurIndex == 1) {
			rankList = this.rankInfo.yes || {}
		} else {
			rankList = this.rankInfo.all || {}
		}
		this.Items.ListView_rank.Items.Layout.removeAllChildren(true)
		let contentHeight = 0

		for (const i in rankList) {
			let v = rankList[i]
			let item = this.Items.task_item.clone();
			item.active = true
			this.updataList(item, v)
			let size = item.getComponent(UITransform)
			contentHeight = contentHeight + size.height
			this.Items.ListView_rank.Items.Layout.addChild(item)
			item.setPosition(-size.width / 2, item.getPosition().y)
		}
		let scrollSize = this.Items.ListView_rank.Items.content.obtainComponent(UITransform)
		if (contentHeight > scrollSize.height) {
			scrollSize.height = contentHeight
		}
	}
	updataList(item, data) {
		item.Items.Image_rankicon.active = false
		if (data.rank > 3) {
			item.Items.Image_rankicon.active = false
			item.Items.rank.active = true
		} else {
			item.Items.Image_rankicon.active = true
			item.Items.rank.active = false
			let path = "myRefer/img/TC_ph_1/spriteFrame"
			if (data.rank == 1) {
				path = "myRefer/img/TC_ph_1/spriteFrame"
			} else if (data.rank == 2) {
				path = "myRefer/img/TC_ph_2/spriteFrame"
			} else if (data.rank == 3) {
				path = "myRefer/img/TC_ph_3/spriteFrame"
			}
			item.Items.Image_rankicon.loadBundleRes(fw.BundleConfig.plaza.res[path],(res: SpriteFrame) => {
				item.Items.Image_rankicon.obtainComponent(Sprite).spriteFrame = res;
			});
		}
		item.Items.rank.getComponent(Label).string = data.rank
		item.Items.rewards.getComponent(Label).string = DF_SYMBOL + data.profit
		if (data.nickname) {
			item.Items.Text_nick.getComponent(Label).string = data.nickname
		} else {
			item.Items.Text_nick.getComponent(Label).string = data.uid
		}
		if (data.face_md5) {
			this.setUserInfo(item.Items.Image_icon, data.face_md5)
			item.Items.Image_head.active = true
		} else {
			item.Items.Image_head.active = false
		}
	}
	setUserInfo(ImageIcon, iconPath) {
		//头像
		app.file.updateHead({
			node: ImageIcon,
			serverPicID: iconPath,
		});
	}
	getReferRankInfo() {
		let params: any = {
			user_id: center.user.getActorProp(ACTOR.ACTOR_PROP_DBID),
			timestamp: app.func.time()
		}
		params.sign = app.http.getSign(params)
		try {
			app.http.post({
				url: httpConfig.path_pay + "User/getShareRank",
				params: params,
				callback: (bSuccess, response) => {
					if (bSuccess) {
						if (!fw.isNull(response)) {
							if (1 == response.status) {
								// 缓存活动数据
								if (!fw.isNull(response.data) && !fw.isNull(this.Items.ListView_rank)) {
									this.rankInfo = response.data
									this.updateData()
								}
							}
						}
					} else {
						fw.print("get getReferRankInfo failed!");
					}
				}
			});
		} catch (e) {

		}
	}
	clickYesterdayEarn() {
		this.nCurIndex = 1
		this.Items.ListView_rank.Items.Layout.removeAllChildren(true)
		this.updataBtnState()
		this.updateData()
	}
	clickTotalEarn() {
		this.nCurIndex = 2
		this.Items.ListView_rank.Items.Layout.removeAllChildren(true)
		this.updataBtnState()
		this.updateData()
	}
}
