import { Label, _decorator, Animation, tween, Vec3, ScrollView, SpriteFrame, Sprite, v3, view,Node } from 'cc';
import { ACTOR } from '../../../app/config/cmd/ActorCMD';
import { DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { EVENT_ID } from '../../../app/config/EventConfig';
import { httpConfig } from '../../../app/config/HttpConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
const { ccclass, property } = _decorator;

@ccclass('christmasLayer')
export class christmasLayer extends FWDialogViewBase {
	page: number;
	isGetAllData: boolean;
	isRecharge: boolean;
	curShakeIndex: number;
	noOperator: boolean;
	canRequest: boolean;
	bClick: boolean;
	schedule_palyer: any;
	mInitChristmasView: any;
	isOpen: any;
	schedule_p: any;
	schedule_btn: any;
	christmasData: any;
	ureward: any;
	christmasRewardData: any;
	broadIdx: number;
	broadInfo: any;
	rankList: any;
	drSize: import("cc").math.Size;
	@property(ScrollView)
	scrollview: ScrollView | null = null;
	onLoad() {
		super.onLoad();
		this.scrollview = this.Items.ListView_rank.getComponent(ScrollView)
		this.scrollview.node.on('scroll-to-bottom', this.flowListScroll, this);
		this.scrollview.node.on('scroll-ended', this.scrollEnd, this);
	}
	initData() {
		this.page = 1
		this.isGetAllData = false
		this.isRecharge = false
		this.curShakeIndex = 0
		this.noOperator = true
		this.canRequest = true

		this.bClick = false
		this.getChristmasData()
		this.drSize = view.getDesignResolutionSize();
	}
	protected initEvents(): boolean | void {
		fw.print("christmasLayer =================== 22222")
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_GETREWARDTIPS,
			],
			callback: (arg1, arg2) => {
				this.isRecharge = true

				if (this.schedule_palyer) {
					this.unschedule(this.schedule_palyer);
					this.schedule_palyer = null;
				}

				this.getChristmasData()
				this.Items.treeAni2.obtainComponent(Animation).play("animation0")
				this.Items.treeAni3.obtainComponent(Animation).play("animation0")
			}
		});
	}
	protected initView(): boolean | void {
		this.Items.Panel_rule.active = false
		this.Items.Panel_reward.active = false
		this.Items.Panel_reward.Items.Panel_item.active = false

		this.Items.rank_top.active = false
		this.Items.rank_bottom.active = false
		this.Items.task_item.active = false

		this.Items.fresh_tips.getComponent(Label).string = "*Refresh every 5 mins*"

		this.schedule_p = this.updateBtnStatus.bind(this);
		this.schedule(this.schedule_p, 5);

		for (let i; i <= 3; i++) {
			let btnShake = this.node.getChildByName("btnShake" + i);
			let redBg = btnShake.getChildByName("redPointBg");
			redBg.active = false
		}
	}
	protected initBtns(): boolean | void {
		this.Items.btnClose.onClickAndScale(() => { this.onClickClose(); });
		this.Items.btnRule.onClickAndScale(() => { this.FuncClick_rul(); });
		this.Items.Panel_rule.Items.Image_rule_close.onClickAndScale(() => { this.FuncClick_close_rul(); });
		this.Items.Panel_reward.Items.Image_ok.onClickAndScale(() => { this.FuncClick_close_reward(); });
		this.Items.openBtn.onClickAndScale(() => { this.FuncClick_open(); });
		this.Items.rank_top.onClickAndScale(() => { this.FuncClick_top(); });
		this.Items.rank_bottom.onClickAndScale(() => { this.FuncClick_bottom(); });
	}
	initChristmasView() {
		if (this.mInitChristmasView) {
			return
		}
		this.mInitChristmasView = true
		for (let i; i <= 3; i++) {
			let btnShake = this.node.getChildByName("btnShake" + i);
			btnShake.onClickAndScale(() => { this.shakeTreeClick(i); });
		}
	}
	updateBtnStatus() {
		this.Items.rank_top.active = false
		this.Items.rank_bottom.active = false
		if (this.schedule_p) {
			this.unschedule(this.schedule_p);
			this.schedule_p = null;
		}
	}
	FuncClick_open() {
		if (!this.isOpen) {
			this.isOpen = true
			tween(this.Items.Panel_jackpot)
				.to(0.3, { position: new Vec3(this.drSize.width + 5, 302, 0) })
				.call(() => {
					this.Items.Panel_jackpot.Items.openBtn.scale = new Vec3(-1, 1, 1)
				})
				.start();
			tween(this.Items.jackpotInfo)
				.to(0.25, { position: new Vec3(this.drSize.width - 130, 552, 0) })
				.start();
		} else {
			this.isOpen = false
			tween(this.Items.Panel_jackpot)
				.to(0.3, { position: new Vec3(this.drSize.width + 205, 302, 0) })
				.call(() => {
					this.Items.Panel_jackpot.Items.openBtn.scale = new Vec3(1, 1, 1)
				})
				.start();
			tween(this.Items.jackpotInfo)
				.to(0.25, { position: new Vec3(this.drSize.width - 14, 552, 0) })
				.start();
		}
	}
	FuncClick_top() {
		this.Items.ListView_rank.obtainComponent(ScrollView).scrollToTop(0.01, true)
	}
	FuncClick_bottom() {
		this.Items.ListView_rank.obtainComponent(ScrollView).scrollToBottom(0.01, true)
	}
	FuncClick_rul() {
		this.Items.Panel_rule.active = true
	}
	FuncClick_close_rul() {
		this.Items.Panel_rule.active = false
	}
	FuncClick_close_reward() {
		this.Items.Panel_reward.Items.ListView.removeAllChildren(true)
		this.Items.Panel_reward.active = false
	}
	updateBtnClickStatus() {
		this.bClick = false
		if (!this.bClick) {
			if (this.schedule_btn) {
				this.unschedule(this.schedule_btn);
				this.schedule_btn = null;
			}
		}
	}
	shakeTreeClick(index) {
		if (!this.schedule_btn) {
			this.schedule_btn = this.updateBtnClickStatus.bind(this);
			this.schedule(this.schedule_btn, 3);
		}
		if (!this.bClick) {
			this.bClick = true
			let canShake = false
			this.curShakeIndex = index
			let m = this.christmasData.basic_info.amount[index]
			for (const k in this.ureward) {
				if (m == Number(k) && Number(this.ureward[k]) != 0) {
					canShake = true
					break
				} else {
					canShake = false
				}
			}
			if (canShake) {
				this.shakeReward(m)
				this.showTreeAmni()
			} else {
				let data:PayChannelData = {
					lRMB: m,
					orderCallback: () => {
						let goodsData = center.mall.getBatchMallGoodsInfo()
						if (goodsData) {
							center.mall.sendRmbBatchBuy(goodsData.rid, m)
						}
					}
				}
				center.mall.payChooseType(data)
			}
		}
	}
	showTreeAmni() {
		if (this.curShakeIndex == 1) {
			this.Items.treeAni1.obtainComponent(Animation).play("animation0");
		} else if (this.curShakeIndex == 2) {
			this.Items.treeAni2.obtainComponent(Animation).play("animation1");
		} else if (this.curShakeIndex == 3) {
			this.Items.treeAni3.obtainComponent(Animation).play("animation1");
		}
	}
	shakeReward(money) {
		let params: any = {
			user_id: center.user.getActorProp(ACTOR.ACTOR_PROP_DBID),
			timestamp: app.func.time(),
			amount: money
		}
		params.sign = app.http.getSign(params)
		try {
			app.http.post({
				url: httpConfig.path_pay + "ActivityApi/ChristmasReward",
				params: params,
				callback: (bSuccess, response) => {
					if (bSuccess) {
						if (!fw.isNull(response)) {
							if (1 == response.status) {
								// 缓存活动数据
								if (!fw.isNull(response.data)) {
									this.isRecharge = false
									this.christmasRewardData = response.data
									this.ureward = response.data.uinfo
									this.freshRedPoint(this.ureward)
									center.christmas.requstChristmasRed()
									this.showRewardView(response.data)
								}
							}
						}
					} else {
						fw.print("Failed to pull PHP configuration!");
					}
				}
			});
		} catch (e) {

		}
	}
	addItem(data) {
		data = data || {}
		let item = this.Items.Panel_reward.Items.Panel_item.clone()
		item.active = true
		this.Items.Panel_reward.Items.Layout.addChild(item)
		//动画
		tween(item.Items.Image_yuan)
			.by(0.5, { eulerAngles: new Vec3(0, 0, 30) })
			.repeatForever()
			.start();
		item.Items.Image_icon.loadBundleRes(data.filePath,(res: SpriteFrame) => {
			item.Items.Image_icon.obtainComponent(Sprite).spriteFrame = res
		})
		item.Items.Label_count.getComponent(Label).string = "x" + data.sGoodsNum

		//回调
		if (data.callback) {
			data.callback(item, data)
		}
		//返回引用
		return item
	}
	updateView(data) {
		this.Items.Panel_reward.Items.Layout.removeAllChildren(true)
		data[1].forEach((v) => {
			this.addItem(v)
		});
		let y = this.Items.Panel_reward.Items.ListView.getPosition().y
		if (data[1].length >= 2) {
			this.Items.Panel_reward.Items.ListView.setPosition(new Vec3(this.drSize.width / 2 - 150, y, 0))
		} else {
			this.Items.Panel_reward.Items.ListView.setPosition(new Vec3(this.drSize.width / 2, y, 0))
		}
	}
	setCustomReward2(rewardList) {
		this.Items.Panel_reward.active = true
		let list = []
		rewardList.forEach((v) => {
			let sGoodsNum = 0
			if (v.rewardType == 2) {
				sGoodsNum = v.nReward
			} else {
				sGoodsNum = v.nReward / 100
			}
			list.push({
				sGoodsNum: sGoodsNum,
				filePath: v.texturePath,
				callback: (itemNode, dataEx) => {
					itemNode.Items.Image_icon.scale = v3(v.scale, v.scale, v.scale);
				}
			})
		})
		this.updateView({ list })
	}
	setCustomReward(filePath, sGoodsNum, scale) {
		this.Items.Panel_reward.active = true
		let list = [
			{
				sGoodsNum: sGoodsNum,
				filePath: filePath,
				callback: (itemNode, dataEx) => {
					itemNode.Items.Image_icon.scale = v3(scale, scale, scale);
				}
			}
		]
		this.updateView({ list })
	}
	showRewardView(rewardData) {
		let curTreeNode = this.Items.Panel_content.getChildByName("treeAni" + this.curShakeIndex)
		let callback = () => {
			if (rewardData.goodslist.length > 1) {
				let rewardList = []
				rewardData.goodslist.forEach((v, k) => {
					let fileName = ""
					let rewardType = 0
					if ("cash" == rewardData.goodslist[k].goods_name) {
						fileName = "icon_cash"
						rewardType = 0
					} else if ("bonus" == rewardData.goodslist[k].goods_name) {
						fileName = "icon_bonus"
						rewardType = 1
					} else if ("bells" == rewardData.goodslist[k].goods_name) {
						fileName = "icon_lingdang"
						rewardType = 2
					}
					let texturePath = fw.BundleConfig.plaza.res["christmas/img/SC_icon_" + fileName + "/spriteFrame"]
					let nReward = rewardData.goodslist[k].goods_num
					let temp = {
						texturePath: texturePath,
						nReward: nReward,
						rewardType: rewardType,
						scale: 1.58
					}
					rewardList.push(temp)
				});
				this.setCustomReward2(rewardList)
			} else {
				let fileName = ""
				let nReward = 0
				if ("cash" == rewardData.goodslist[1].goods_name) {
					fileName = "icon_cash"
					nReward = Number(rewardData.goodslist[1].goods_num) / 100
				} else if ("bonus" == rewardData.goodslist[1].goods_name) {
					fileName = "icon_bonus"
					nReward = Number(rewardData.goodslist[1].goods_num) / 100
				} else if ("bells" == rewardData.goodslist[1].goods_name) {
					fileName = "icon_lingdang"
					nReward = Number(rewardData.goodslist[1].goods_num)
				}
				let texturePath = fw.BundleConfig.plaza.res["christmas/img/SC_icon_" + fileName + "/spriteFrame"]
				let scale = 1.58
				this.setCustomReward(texturePath, nReward, scale)
			}
			this.updateDataMyRankAndBells(rewardData.rank, rewardData.bells)
			this.Items.treeAni2.obtainComponent(Animation).play("animation0")
			this.Items.treeAni3.obtainComponent(Animation).play("animation0")
		}

		tween(curTreeNode)
			.delay(2)
			.call(() => {
				callback()
			})
			.start();
	}
	updateRankList2(RankList) {
		let rankList = RankList
		if (rankList) {
			if (rankList.length > 0) {
				rankList.forEach((v, i) => {
					let loadItem = () => {
						var task = this.Items.task_item.clone();
						task.active = true;
						this.Items.ListView_rank.Items.Layout.addChild(task);
						this.updataList(task, v)
						if (rankList.length == i) {
							let p = (this.page - 1) * 30 / ((this.page - 1) * 30 + (rankList.length)) * 100
							this.scrollview.scrollToPercentVertical(p)
						}
					}
					tween(this.Items.ListView_rank)
						.delay(0.01 * i)
						.call(() => {
							loadItem()
						})
						.start();
				});
			}
		}
	}
	updateRankList(RankList) {
		let rankList = RankList
		this.Items.ListView_rank.Items.Layout.removeAllChildren(true)
		if (rankList) {
			if (rankList.length > 0) {
				rankList.forEach((v, i) => {
					let loadItem = () => {
						var task = this.Items.task_item.clone();
						task.active = true;
						this.Items.ListView_rank.Items.Layout.addChild(task);
						this.updataList(task, v)
					}
					tween(this.Items.ListView_rank)
						.delay(0.01 * i)
						.call(() => {
							loadItem()
						})
						.start();
				});
			}
		}
	}
	updataList(item, data) {
		let rankicon = item.Items.Image_rankicon
		let itemBg = item.Items.itemBg
		let rank = item.Items.rank

		let loadTexture = (path, node:Node) => {
			node.loadBundleRes(path,(res: SpriteFrame) => {
				node.obtainComponent(Sprite).spriteFrame = res
			})
		}

		let bgpath: any = ""
		let rankpath: any = ""
		if (data.rank > 3) {
			rankicon.active = false
			rank.active = true
			bgpath = fw.BundleConfig.plaza.res["christmas/img/SDJ_paiming_lv/spriteFrame"]
		} else {
			rankicon.active = true
			rank.active = false
			bgpath = fw.BundleConfig.plaza.res["christmas/img/SDJ_paiming_hong/spriteFrame"]
			if (data.rank == 1) {
				rankpath = fw.BundleConfig.plaza.res["christmas/img/SDJ_paiming1/spriteFrame"]
			} else if (data.rank == 2) {
				rankpath = fw.BundleConfig.plaza.res["christmas/img/SDJ_paiming2/spriteFrame"]
			} else if (data.rank == 3) {
				rankpath = fw.BundleConfig.plaza.res["christmas/img/SDJ_paiming3/spriteFrame"]
			}
		}

		loadTexture(bgpath, itemBg)
		if (rankpath != "") {
			loadTexture(rankpath, rankicon)
		}

		item.Items.rank.getComponent(Label).string = data.rank
		item.Items.bells.getComponent(Label).string = data.bells
		item.Items.rewards.getComponent(Label).string = DF_SYMBOL + app.func.formatNumberForComma(data.jkpot)
		item.Items.ratio.getComponent(Label).string = data.jkrate + "%"
		item.Items.nick.getComponent(Label).string = data.nickname || ""
	}
	updateDataMyRankAndBells(rank, bell) {
		let rankicon = this.Items.Panel_jackpot.Items.my_item.Items.Image_rankicon
		let myRank = this.Items.Panel_jackpot.Items.my_item.Items.rank
		this.Items.Panel_jackpot.Items.my_item.Items.rankNo.active = false

		let loadTexture = (path, node) => {
			this.loadBundleRes(path,(res: SpriteFrame) => {
				if (fw.isValid(node)) {
					node.obtainComponent(Sprite).spriteFrame = res
				}
			})
		}
		let rankpath: any = ""
		if (rank != "#") {
			if (rank >= 1 && rank <= 3) {
				if (rank == 1) {
					rankpath = fw.BundleConfig.plaza.res["christmas/img/SDJ_paiming1/spriteFrame"]
				} else if (rank == 2) {
					rankpath = fw.BundleConfig.plaza.res["christmas/img/SDJ_paiming2/spriteFrame"]
				} else if (rank == 3) {
					rankpath = fw.BundleConfig.plaza.res["christmas/img/SDJ_paiming3/spriteFrame"]
				}
				rankicon.active = true
				myRank.active = false
				if (rankpath != "") {
					loadTexture(rankpath, rankicon)
				}
			} else {
				myRank.active = true
			}
		} else {
			this.Items.Panel_jackpot.Items.my_item.Items.rankNo.active = true
		}
		this.Items.Panel_jackpot.Items.my_item.Items.bells.getComponent(Label).string = bell
	}
	updateData(christmasData) {
		this.Items.jackpotInfo.Items.jackpot.getComponent(Label).string = ":" + app.func.formatNumberForComma(christmasData.basic_info.jackpot)
		if (christmasData.basic_info.urank) {
			let rankicon = this.Items.Panel_jackpot.Items.my_item.Items.Image_rankicon
			rankicon.active = false
			let rankNo = this.Items.Panel_jackpot.Items.my_item.Items.rankNo
			let rank = this.Items.Panel_jackpot.Items.my_item.Items.rank
			let bells = this.Items.Panel_jackpot.Items.my_item.Items.bells
			let rewards = this.Items.Panel_jackpot.Items.my_item.Items.rewards
			let ratio = this.Items.Panel_jackpot.Items.my_item.Items.ratio
			let nick = this.Items.Panel_jackpot.Items.my_item.Items.nick
			bells.getComponent(Label).string = christmasData.basic_info.urank.bells
			rewards.getComponent(Label).string = DF_SYMBOL + app.func.formatNumberForComma(christmasData.basic_info.urank.jkpot)
			ratio.getComponent(Label).string = christmasData.basic_info.urank.jkrate + "%"
			nick.getComponent(Label).string = "You"
			if (christmasData.basic_info.urank.rank == "#") {
				rankNo.active = true
				rank.active = false
			} else {

				let loadTexture = (path, node:Node) => {
					node.loadBundleRes(path,(res: SpriteFrame) => {
						node.obtainComponent(Sprite).spriteFrame = res
					})
				}
				let rankpath: any = ""
				rankNo.active = false
				if (christmasData.basic_info.urank.rank >= 1 && christmasData.basic_info.urank.rank <= 3) {
					if (christmasData.basic_info.urank.rank == 1) {
						rankpath = fw.BundleConfig.plaza.res["christmas/img/SDJ_paiming1/spriteFrame"]
					} else if (christmasData.basic_info.urank.rank == 2) {
						rankpath = fw.BundleConfig.plaza.res["christmas/img/SDJ_paiming2/spriteFrame"]
					} else if (christmasData.basic_info.urank.rank == 3) {
						rankpath = fw.BundleConfig.plaza.res["christmas/img/SDJ_paiming3/spriteFrame"]
					}
					rankicon.active = true
					rank.active = false
					if (rankpath != "") {
						loadTexture(rankpath, rankicon)
					}
				} else {
					rank.getComponent(Label).string = christmasData.basic_info.urank.rank
					rankicon.active = false
					rank.active = true
				}
			}
		}
		this.broadIdx = 0
		this.broadInfo = christmasData.basic_info.broad

		if (this.schedule_palyer) {
			this.unschedule(this.schedule_palyer);
			this.schedule_palyer = null;
		}
		if (!this.schedule_palyer) {
			this.schedule_palyer = this.updateMsg.bind(this);
			this.schedule(this.schedule_palyer, 5);
		}
	}
	updateMsg() {
		this.broadIdx = this.broadIdx + 1
		if (this.broadIdx > this.broadInfo.length) {
			this.broadIdx = 0
		} else {
			let name = this.broadInfo[this.broadIdx].nickname
			let gettips = this.broadInfo[this.broadIdx].gettips

			this.Items.nodeMsgRoot.Items.txtName.getComponent(Label).string = name
			this.Items.nodeMsgRoot.Items.txtGold.getComponent(Label).string = gettips
			tween(this.Items.nodeMsgRoot)
				.to(9, { position: new Vec3(-800, -3, 0) })
				.start();
		}
	}
	freshRedPoint(rinfo) {
		let shakeInfoPanel = this.Items.shakeInfoPanel
		this.christmasData.basic_info.amount.forEach((value, i) => {
			let info = shakeInfoPanel.getChildByName("shakeInfo" + i);
			let btnShake = this.node.getChildByName("btnShake" + i);
			let redPpint = btnShake.getChildByName("redPointBg");
			let Text_count = btnShake.getChildByName("Text_count");
			redPpint.active = false
			Text_count.getComponent(Label).string = DF_SYMBOL + app.func.formatNumberForComma(value)
			if (rinfo.length > 0) {
				rinfo.array.forEach((v, k) => {
					if (Number(k) == value && v != 0) {
						redPpint.active = true
						Text_count.getComponent(Label).string = rinfo[k]
					}
				});
			}
		});
	}
	flowListScroll() {
		// if (!this.isGetAllData && this.Items.ListView_rank.getChildrenCount() > 0) {
		if (!this.isGetAllData) {
			this.getChristmasRankData()
		}
	}
	scrollEnd() {
		this.Items.rank_top.active = true
		this.Items.rank_bottom.active = true

		if (this.schedule_p) {
			this.unschedule(this.schedule_p);
			this.schedule_p = null;
		}
		if (!this.schedule_p) {
			this.schedule_p = this.updateBtnStatus.bind(this);
			this.schedule(this.schedule_p, 5);
		}
	}
	getChristmasRankData() {
		if (!this.canRequest) {
			return
		}
		this.canRequest = false
		let requestPage = this.page + 1
		let params: any = {
			user_id: center.user.getActorProp(ACTOR.ACTOR_PROP_DBID),
			timestamp: app.func.time(),
			page: requestPage
		}
		params.sign = app.http.getSign(params)
		try {
			app.http.post({
				url: httpConfig.path_pay + "ActivityApi/ChristmasRank",
				params: params,
				callback: (bSuccess, response) => {
					if (bSuccess) {
						if (!fw.isNull(response)) {
							if (requestPage != this.page + 1) {
								return
							}
							if (1 == response.status) {
								// 缓存活动数据
								if (!fw.isNull(response.data)) {
									this.page = this.page + 1
									if (response.data.length < 30) {
										this.isGetAllData = true
									}
									this.updateRankList2(response.data)
								}
							}
						}
					} else {
						fw.print("Failed to pull PHP configuration!");
					}
				}
			});
		} catch (e) {

		}
	}
	getChristmasData() {
		if (!this.canRequest) {
			return
		}
		this.canRequest = false
		let params: any = {
			user_id: center.user.getActorProp(ACTOR.ACTOR_PROP_DBID),
			timestamp: app.func.time(),
		}
		params.sign = app.http.getSign(params)
		try {
			app.http.post({
				url: httpConfig.path_pay + "ActivityApi/ChristmasInit",
				params: params,
				callback: (bSuccess, response) => {
					if (bSuccess) {
						if (!fw.isNull(response)) {
							if (1 == response.status) {
								// 缓存活动数据
								if (!fw.isNull(response.data)) {
									this.christmasData = response.data
									this.ureward = response.data.basic_info.ureward
									this.page = 1
									this.initChristmasView()
									this.freshRedPoint(this.ureward)
									this.updateData(response.data)
									this.rankList = response.data.basic_info.ranklist
									this.updateRankList(response.data.basic_info.ranklist)
								}
							}
						}
					} else {
						fw.print("Failed to pull PHP configuration!");
					}
				}
			});
		} catch (e) {

		}
	}
}
