import { UITransform } from 'cc';
import { Label } from 'cc';
import { _decorator } from 'cc';
import { ACTOR } from '../../../app/config/cmd/ActorCMD';
import { DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { httpConfig } from '../../../app/config/HttpConfig';
const { ccclass } = _decorator;

let jsonDataT = {
	data: {
		[1]: { inviter: "10762", db: "0.05", ib: "0", nickname: "noname", tb: "0.05", htb: "0.0", },
		[2]: { inviter: "10663", db: "33.17", ib: "0.00", nickname: "noname", tb: "33.17", htb: "0.14", },
		[3]: { inviter: "10663", db: "4.131", ib: "3.02", nickname: "noname", tb: "3.1", htb: "3.151", },
		[4]: { inviter: "10663", db: "0.131", ib: "3.02", nickname: "noname", tb: "3.151", htb: "3.115", },
		[5]: { inviter: "10663", db: "0.131", ib: "3.02", nickname: "noname", tb: "3.151", htb: "3.151", },
		[6]: { inviter: "10663", db: "0.131", ib: "3.02", nickname: "noname", tb: "3.151", htb: "3.151", },
		[7]: { inviter: "10663", db: "0.131", ib: "3.02", nickname: "noname", tb: "3.151", htb: "3.151", },
	},
}

@ccclass('ReferralsDetail')
export class ReferralsDetail extends (fw.FWComponent) {
	initData() {

	}
	protected initEvents(): boolean | void {

	}
	protected initView(): boolean | void {
		this.Items.listView_referrals.Items.Layout.removeAllChildren(true)
		this.Items.Node_null.active = false
		this.Items.bonus_referrals.active = false
		this.setData(null)
		this.setData(jsonDataT.data)
		this.getReferralsInfo(1)
	}
	protected initBtns(): boolean | void {
		this.Items.text_direct.onClickAndScale(() => { this.FuncClick_direct() });
		this.Items.text_indirect.onClickAndScale(() => { this.FuncClick_indirect() });
		this.Items.text_todays.onClickAndScale(() => { this.FuncClick_todays() });
		this.Items.text_total.onClickAndScale(() => { this.FuncClick_total() });
	}
	FuncClick_direct() {
		this.getReferralsInfo(1)
	}

	FuncClick_indirect() {
		this.getReferralsInfo(2)
	}

	FuncClick_todays() {
		this.getReferralsInfo(3)
	}

	FuncClick_total() {
		this.getReferralsInfo(4)
	}
	setData(data) {
		if (data && data.length > 0) {
			this.Items.Node_null.active = false
			this.Items.listView_referrals.Items.Layout.removeAllChildren(true)
			let contentHeight = 0

			for (const i in data) {
				let v = data[i]
				let item = this.Items.bonus_referrals.clone();
				item.active = true
				this.updataList(item, v)
				let size = item.getComponent(UITransform)
				contentHeight = contentHeight + size.height
				this.Items.listView_referrals.Items.Layout.addChild(item)
				item.setPosition(0, item.getPosition().y)
			}
			let scrollSize = this.Items.listView_referrals.Items.content.obtainComponent(UITransform)
			if (contentHeight > scrollSize.height) {
				scrollSize.height = contentHeight
			}
		} else {
			this.Items.Node_null.active = true
		}
	}
	updataList(item, data) {
		item.Items.id.getComponent(Label).string = data.inviter || ""
		item.Items.name.getComponent(Label).string = data.nickname || ""
		item.Items.driect.getComponent(Label).string = DF_SYMBOL + data.db || 0
		item.Items.indirect.getComponent(Label).string = DF_SYMBOL + data.ib || 0
		item.Items.today.getComponent(Label).string = DF_SYMBOL + data.tb || 0
		item.Items.total.getComponent(Label).string = DF_SYMBOL + data.htb || 0
	}
	getReferralsInfo(sortType) {
		let params: any = {
			user_id: center.user.getActorProp(ACTOR.ACTOR_PROP_DBID),
			otype: sortType || 1,
			timestamp: app.func.time()
		}
		params.sign = app.http.getSign(params)
		try {
			app.http.post({
				url: httpConfig.path_pay + "User/getReferrals",
				params: params,
				callback: (bSuccess, response) => {
					if (bSuccess) {
						if (!fw.isNull(response)) {
							if (1 == response.status) {
								// 缓存活动数据
								if (!fw.isNull(response.data) && !fw.isNull(this.Items.Node_null)) {
									this.setData(response.data)
								}
							}
						}
					} else {
						fw.print("get getReferralsInfo failed!");
					}
				}
			});
		} catch (e) {

		}
	}
}
