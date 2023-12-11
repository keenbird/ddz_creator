import { Label, UITransform, _decorator } from 'cc';
import { ACTOR } from '../../../app/config/cmd/ActorCMD';
import { DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { httpConfig } from '../../../app/config/HttpConfig';
const { ccclass } = _decorator;
let jsonDataT = {
	status: 1,
	data: {
		total: {
			db: "0.13",
			ib: "3.02",
			tb: "3.15",
		},
		list: [
			{ db: "0.131", ib: "3.02", ctime: "2020-08-05", tb: "3.151", },
			{ db: "0.132", ib: "3.02", ctime: "2020-08-05", tb: "3.152", },
			{ db: "0.133", ib: "3.02", ctime: "2020-08-05", tb: "3.153", },
			{ db: "0.134", ib: "3.02", ctime: "2020-08-05", tb: "3.154", },
			{ db: "0.135", ib: "3.02", ctime: "2020-08-05", tb: "3.155", },
			{ db: "0.136", ib: "3.02", ctime: "2020-08-05", tb: "3.156", },
		],
	},
}
@ccclass('BoonusDetail')
export class BoonusDetail extends (fw.FWComponent) {
	last_type: number;
	initData() {
		this.last_type = 1
	}
	protected initEvents(): boolean | void {

	}
	protected initView(): boolean | void {
		this.Items.total_bonus.getComponent(Label).string = ""
		this.Items.direct_bonus.getComponent(Label).string = ""
		this.Items.indirect_bonus.getComponent(Label).string = ""

		this.Items.Panel_time.active = false
		this.Items.bonus_item.active = false

		// this.setData(jsonDataT.data)
	}
	protected initBtns(): boolean | void {
		this.Items.down_btn.onClickAndScale(this.FuncClick_down.bind(this));
		this.Items.last_7_days.onClickAndScale(this.FuncClick_last7Days.bind(this));
		this.Items.last_month.onClickAndScale(this.FuncClick_lastMonth.bind(this));
		this.Items.Past_3_months.onClickAndScale(this.FuncClick_past3Month.bind(this));
	}
	FuncClick_down() {
		this.Items.Panel_time.active = !this.Items.Panel_time.active
		if (this.Items.Panel_time.active) {
			this.Items.Image_arrow_down.angle = 180
		} else {
			this.Items.Image_arrow_down.angle = 360
		}
	}
	FuncClick_last7Days() {
		this.getBonus(1)
		this.FuncClick_down()
	}
	FuncClick_lastMonth() {
		this.getBonus(2)
		this.FuncClick_down()
	}
	FuncClick_past3Month() {
		this.getBonus(3)
		this.FuncClick_down()
	}
	setData(data) {
		if (data) {
			if (data.total) {
				this.Items.total_bonus.getComponent(Label).string = DF_SYMBOL + data.total.tb
				this.Items.direct_bonus.getComponent(Label).string = DF_SYMBOL + data.total.db
				this.Items.indirect_bonus.getComponent(Label).string = DF_SYMBOL + data.total.ib
			}
			this.Items.listView_bonus2.Items.Layout.removeAllChildren(true)
			let contentHeight = 0
			data.list.forEach(v => {
				let item = this.Items.bonus_item.clone();
				item.active = true
				this.updataList(item, v)
				let size = item.getComponent(UITransform)
				contentHeight = contentHeight + size.height
				this.Items.listView_bonus2.Items.Layout.addChild(item)
				item.setPosition(0, item.getPosition().y)
			})
			let scrollSize = this.Items.listView_bonus2.Items.content.obtainComponent(UITransform)
			if (contentHeight > scrollSize.height) {
				scrollSize.height = contentHeight
			}
		}
	}
	updataList(item, data) {
		item.Items.time.getComponent(Label).string = data.ctime
		item.Items.total_bonus.getComponent(Label).string = DF_SYMBOL + data.tb
		item.Items.direct_bonus.getComponent(Label).string = DF_SYMBOL + data.db
		item.Items.indirect_bonus.getComponent(Label).string = DF_SYMBOL + data.ib
	}
	getBonus(gettype) {
		this.last_type = gettype || 1
		this.getBonusInfo(this.last_type)

		// let str_past7 = getText({ key = "text_refer_bonus_Panel_time_t3" })
		// let str_last = getText({ key = "text_refer_bonus_Panel_time_t2" })
		// let str_past3 = getText({ key = "text_refer_bonus_Panel_time_t1" })
		// let str_map = { str_past7, str_last, str_past3 }
		// this.Items.now_time.getComponent(Label).string = (str_map[this.last_type])
	}
	getBonusInfo(stype) {
		let params: any = {
			user_id: center.user.getActorProp(ACTOR.ACTOR_PROP_DBID),
			stype: stype || 1,
			timestamp: app.func.time()
		}
		params.sign = app.http.getSign(params)
		try {
			app.http.post({
				url: httpConfig.path_pay + "User/getBonus",
				params: params,
				callback: (bSuccess, response) => {
					if (bSuccess) {
						if (!fw.isNull(response)) {
							if (1 == response.status) {
								// 缓存活动数据
								if (!fw.isNull(response.data) && !fw.isNull(this.Items.total_bonus)) {
									this.setData(response.data)
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
}
