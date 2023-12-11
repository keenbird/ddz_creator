import { _decorator, instantiate, Node, Sprite, Prefab, SpriteFrame, Label, RichText } from 'cc';
const { ccclass } = _decorator;

import { DF_RATE, DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { guide_hand_1 } from '../../../resources/ui/guide/script/guide_hand_1';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

let df = {
	rollH: 328
}

let randomGold = [
	1.00, 100, 500, 300, 200, 7.21, 5.91, 2.31, 1.20, 1.49, 3.40, 2.92, 2.97, 1.02, 8.28, 3.82, 4.16, 30.93, 11.82, 48.33, 16.16, 15.04, 49.77, 23.63, 3.24, 8.56, 14.13, 14.66, 2.13, 33.23, 29.34, 5.79, 19.45, 15.75, 13.22, 33.38, 20.65,
]

let randomMult = [
	1, 20, 5, 70, 8, 10, 20, 500, 1, 1000, 2, 3, 600, 6, 7, 8,
]

@ccclass('SiginboradLuck')
export class SiginboradLuck extends FWDialogViewBase {
	mMultiopenSevenRewardData: any;
	mSpining: boolean;
	mRollTab: {};
	mCountDownTime: Node;
	mRewardData: any;
	mCountDownAction: number;
	MultiopenSevenRewardType: any;
	mHandAnim: boolean;
	initData() {
		this.mMultiopenSevenRewardData = center.taskActive.getMultiopenSevenRewardData()
		this.MultiopenSevenRewardType = center.taskActive.getMultiopenSevenRewardType()
		this.mSpining = false
	}
	protected initEvents(): boolean | void {
		this.bindEvent({
			eventName: [
				"OnRecv_MultiopenSevenRewradRet",
			],
			callback: (arg1, arg2) => {
				this.onSpin(arg1.dict)
			}
		});
		this.bindEvent({
			eventName: [
				"OnRecv_MultiopenSevenRewradData",
			],
			callback: (arg1, arg2) => {
				this.mMultiopenSevenRewardData = center.taskActive.getMultiopenSevenRewardData()
				this.updateView()
			}
		});
	}
	protected initView(): boolean | void {
		//--多语言处理--began------------------------------------------
    	//文本
		this.Items.Label_next_time.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
			this.Items.Label_next_time.string = {
				[fw.LanguageType.en]: `Get next time`,
				[fw.LanguageType.brasil]: `Obter da próxima vez`,
			}[fw.language.languageType];
		});
		this.Items.Label_gift.obtainComponent(fw.FWLanguage).bindLabel(`Get`);
    	//精灵
		this.Items.Sprite_title.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
			app.file.updateImage({
				node: this.Items.Sprite_title,
				bundleResConfig: ({
					[fw.LanguageType.en]: () => { return fw.BundleConfig.plaza.res[`siginboradLuck/img/atlas/7D_biaoti/spriteFrame`]; },
					[fw.LanguageType.brasil]: () => { return fw.BundleConfig.plaza.res[`siginboradLuck/img/atlas/7D_biaoti_brasil/spriteFrame`]; },
				})[fw.language.languageType](),
			});
		});
		this.Items.Sprite_spin.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
			app.file.updateImage({
				node: this.Items.Sprite_spin,
				bundleResConfig: ({
					[fw.LanguageType.en]: () => { return fw.BundleConfig.plaza.res[`siginboradLuck/img/atlas/7D_spin/spriteFrame`]; },
					[fw.LanguageType.brasil]: () => { return fw.BundleConfig.plaza.res[`siginboradLuck/img/atlas/7D_spin_brasil/spriteFrame`]; },
				})[fw.language.languageType](),
			});
		});
		//--多语言处理--end--------------------------------------------

		this.Items.Panel_reward_item.active = false
		this.Items.Panel_default_item.active = false
		this.Items.Panel_gold_item.active = false
		this.Items.Panel_mult_item.active = false
		this.Items.Panel_gift.active = false
		this.Items.Panel_next_time.active = false
		this.Items.Panel_spin.active = false
		this.Items.gift_tips.active = false

		this.mRollTab = [
			this.createRollPanel(this.Items.Panel_1, {
				offsetCount: 0,
				createItem: this.createRewardItem.bind(this),
				updateItem: this.updateRewardItem.bind(this),
			}),
			this.createRollPanel(this.Items.Panel_2, {
				offsetCount: 2,
				createItem: this.createGoldItem.bind(this),
				updateItem: this.updateGoldItem.bind(this),
			}),
			this.createRollPanel(this.Items.Panel_3, {
				offsetCount: 4,
				createItem: this.createMultItem.bind(this),
				updateItem: this.updateMultItem.bind(this),
				endCallback: this.onSpinEnd.bind(this),
			}),
		]

		this.updateView()

	}
	protected initBtns(): boolean | void {
		this.Items.Image_close.onClickAndScale(() => {
			this.onClickClose();
		})
		this.Items.Panel_spin.onClickAndScale(() => {
			this.onSpinClick();
		})
		this.Items.Panel_gift.onClickAndScale(() => {
			this.onGiftClick();
		})
	}
	updateView() {
		if (this.mSpining) {
			return
		}

		let data = this.mMultiopenSevenRewardData
		if (data.nextGetTime <= app.func.time()) {
			this.Items.Panel_spin.active = true
			this.Items.Panel_gift.active = false
			this.Items.Panel_next_time.active = false
			this.Items.gift_tips.active = false
			this.stopCountDown()
			if (0 == app.file.getIntegerForKey("siginboradLuckClick", 0)) {
				this.Items.Panel_spin.loadBundleRes(fw.BundleConfig.resources.res[`ui/guide/guide_hand_1`],(res: Prefab) => {
					let node = instantiate(res);
					node.active = true;
					this.Items.Panel_spin.addChild(node);
					this.mHandAnim = true
					node.getComponent(guide_hand_1).playAnim();
				});
			}
		} else if (data.rewardData.rewardType == this.MultiopenSevenRewardType.gift && data.giftRewardCanBuy) {
			this.Items.Panel_spin.active = false
			this.Items.Panel_gift.active = true
			this.Items.Panel_next_time.active = false
			this.Items.gift_tips.active = true
			this.mCountDownTime = this.Items.Panel_gift.Items.Text_time
			this.startCountDown()
			let quickRecharge = center.roomList.getQuickRecharge(data.rewardData.nID)
			let cash = quickRecharge.nQuickGoodsNum
			let bonus = quickRecharge.nQuickGiveGoodsNum[0]

			this.Items.gift_tips.getComponent(RichText).string = fw.language.getString("<color=#ffffff>Only </color><color=#FDFF2F>${DF_SYMBOL1}${num} </color><color=#ffffff>to get cash </color><color=#FDFF2F>${DF_SYMBOL2}${cash} </color><color=#ffffff>+bonus </color><color=#FDFF2F>${DF_SYMBOL3}${bonus} </color>",{
				DF_SYMBOL1:DF_SYMBOL,num:quickRecharge.nQuickNeedRMB,DF_SYMBOL2:DF_SYMBOL,cash:cash/DF_RATE,DF_SYMBOL3:DF_SYMBOL,bonus:bonus/DF_RATE,
			})

			this.updateReward(0, data.rewardData.rewardType)
			this.updateReward(1, cash + bonus)
			this.updateReward(2, 1)
		} else {
			this.Items.Panel_spin.active = false
			this.Items.Panel_gift.active = false
			this.Items.Panel_next_time.active = true
			this.Items.gift_tips.active = false
			this.mCountDownTime = this.Items.Panel_next_time.Items.Text_time
			this.startCountDown()
		}
	}
	createRewardItem() {
		let item = this.Items.Panel_reward_item.clone();
		item.active = true
		this.updateRewardItem(item)
		return item
	}
	updateRewardItem(item, nType?) {
		nType = nType || app.func.getRandomNum(1, 3)
		let path = fw.BundleConfig.plaza.res["siginboradLuck/img/atlas/7D_icon4/spriteFrame"]
		if (this.MultiopenSevenRewardType.cash == nType) {
			path = fw.BundleConfig.plaza.res["siginboradLuck/img/atlas/7D_icon4/spriteFrame"]
			item.Items.Text_name.getComponent(Label).string = 'CASH'
		} else if (this.MultiopenSevenRewardType.bouns == nType) {
			path = fw.BundleConfig.plaza.res["siginboradLuck/img/atlas/7D_icon3/spriteFrame"]
			item.Items.Text_name.getComponent(Label).string = 'BOUNS'
		} else if (this.MultiopenSevenRewardType.gift == nType) {
			path = fw.BundleConfig.plaza.res["siginboradLuck/img/atlas/7D_icon5/spriteFrame"]
			item.Items.Text_name.getComponent(Label).string = 'GIFT'
		}
		item.Items.Image_reward_icon.loadBundleRes(path,(res: SpriteFrame) => {
			item.Items.Image_reward_icon.obtainComponent(Sprite).spriteFrame = res;
		});
	}

	createGoldItem() {
		let item = this.Items.Panel_gold_item.clone();
		item.active = true
		this.updateGoldItem(item)
		return item
	}
	updateGoldItem(item, gold?) {
		if (gold) {
			item.Items.gold_num.getComponent(Label).string = DF_SYMBOL + gold / DF_RATE
		} else {
			let index = app.func.getRandomNum(0, randomGold.length - 1)
			item.Items.gold_num.getComponent(Label).string = DF_SYMBOL + randomGold[index]
		}
	}
	createMultItem() {
		let item = this.Items.Panel_mult_item.clone();
		item.active = true
		this.updateMultItem(item)
		return item
	}
	updateMultItem(item, mult?) {
		mult = mult || randomMult[app.func.getRandomNum(0, randomMult.length - 1)]
		item.Items.mult_num.getComponent(Label).string = 'x' + mult
	}
	onGiftClick() {
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`siginboradLuck/siginboradLuckGift`],
			data: { rewardData: this.mMultiopenSevenRewardData.rewardData },
		});
	}
	onSpinClick() {
		center.taskActive.sendMultiopenSevenRewradReq()
		if (this.mHandAnim) {
			this.mHandAnim = false
			this.Items.Panel_spin.Items.background.removeAllChildren(true)
		}
		app.file.setIntegerForKey("siginboradLuckClick", 1)
	}
	onSpin(data) {
		this.mSpining = true
		this.Items.Panel_spin.active = (false)
		this.Items.Panel_gift.active = (false)
		this.Items.Panel_next_time.active = (false)
		if (data.rewardType == this.MultiopenSevenRewardType.gift) {
			let quickRecharge = center.roomList.getQuickRecharge(data.nID)
			let cash = quickRecharge.nQuickGoodsNum
			let bonus = quickRecharge.nQuickGiveGoodsNum[0]
			this.startRoll(0, data.rewardType)
			this.startRoll(1, cash + bonus)
			this.startRoll(2, 1)
		} else {
			this.startRoll(0, data.rewardType)
			this.startRoll(1, data.rewardNum)
			this.startRoll(2, data.rewardMult)
		}
		this.mRewardData = data
	}
	onSpinEnd() {
		this.setTimeout(() => {
			this.mSpining = false
			this.updateView()

			// --签到完后检测刮刮卡是否展示
			if (center.scratchCard.canGetScratchcardReward()) {
				app.popup.showDialog({
					viewConfig: fw.BundleConfig.plaza.res[`scratchCard/scratchCard`],
				});
			}
			let nType = this.mRewardData.rewardType
			if (this.MultiopenSevenRewardType.cash == nType) {
				let data: any = {}
				data.reward = [{ nGoodsID: this.mRewardData.nID, nGoodsNum: this.mRewardData.rewardNum * this.mRewardData.rewardMult }]
				data.extend = { bDontShowTitle: true }
				app.popup.showDialog({
					viewConfig: fw.BundleConfig.resources.res[`ui/reward/reward`],
					data: data,
				});
			} else if (this.MultiopenSevenRewardType.bouns == nType) {
				let data: any = {}
				data.reward = [{ nGoodsID: this.mRewardData.nID, nGoodsNum: this.mRewardData.rewardNum * this.mRewardData.rewardMult }]
				data.extend = { bDontShowTitle: true }
				app.popup.showDialog({
					viewConfig: fw.BundleConfig.resources.res[`ui/reward/reward`],
					data: data,
				});
			} else if (this.MultiopenSevenRewardType.gift == nType) {
				app.popup.showDialog({
					viewConfig: fw.BundleConfig.plaza.res[`siginboradLuck/siginboradLuckGift`],
					data: { rewardData: this.mRewardData },
				});
			}
			if (!center.taskActive.isMultiopenSevenRewardOpen()) {
				this.onClickClose()
			}
		}, 1);
	}
	startRoll(index, data) {
		this.mRollTab[index].startRoll(data)
	}
	stopRoll(index) {
		this.mRollTab[index].stopRoll()
	}
	updateReward(index, data) {
		this.mRollTab[index].updateReward(data)
	}
	createRollPanel(panel: Node, data: { offsetCount: any; createItem: any; updateItem: any; endCallback?: () => void; }) {
		let rollPanel = {
			startRoll: (params) => { },
			stopRoll: () => { },
			updateRoll: () => { },
			updateReward: (params) => { },
		}
		let rollItem = {}
		let rollAction = null
		let speed = 0 // 当前速度
		let maxSpeed = 80 // 最大速度//因为高度是328
		let a = 8 // 加速度
		let av = -1 // 加速度方向
		let runTime = 0 // 运行时间
		let fpsTime = 1 / 30 // 每帧时间
		let count = 0 // 旋转圈数
		let offsetCount = data.offsetCount// 相差圈数
		let posYRange = [- df.rollH, df.rollH]
		let defautItem = this.Items.Panel_default_item.clone()
		defautItem.active = (true)
		panel.addChild(defautItem)
		defautItem.setPosition(0, 0)
		for (let i = 1; i <= 2; i++) {
			rollItem[i] = data.createItem()
			rollItem[i].setPosition(0, (i - 1) * df.rollH)
			panel.addChild(rollItem[i])
		}
		rollItem[1].active = false

		let callbackData = null
		let startRoll = (params) => {
			callbackData = params
			rollPanel.stopRoll()
			speed = 0
			a = 8
			av = -1
			runTime = 1.0
			count = 0
			offsetCount = data.offsetCount

			defautItem.setPosition(0, 0)
			for (let i = 1; i <= 2; i++) {
				rollItem[i].setPosition(0, (i - 1) * df.rollH)
			}

			rollAction = this.setInterval(rollPanel.updateRoll, fpsTime)
		}

		let stopRoll = () => {
			if (rollAction) {
				this.clearIntervalTimer(rollAction)
				rollAction = null
			}
		}

		let updateRoll = () => {
			runTime = runTime - fpsTime
			if (runTime <= 0) {
				runTime = 0
			}
			let x = defautItem.getPosition().x
			let y = defautItem.getPosition().y
			if (y > posYRange[0]) {
				y = y + speed
				if (y <= posYRange[0]) {
					defautItem.active = false
					rollItem[1].active = true
				}
				defautItem.setPosition(x, y)
			}
			for (let i = 1; i <= 2; i++) {
				let item = rollItem[i]
				let x = item.getPosition().x
				let y = item.getPosition().y
				y = y + speed
				if (y <= posYRange[0]) {
					y = y + 2 * df.rollH
					if (i == 1) {
						if (runTime == 0 && av < 0) {
							if (offsetCount == 0) {
								av = -av
							} else {
								offsetCount = offsetCount - 1
							}
						}
						if (offsetCount == 0 && av > 0) {
							count = count + 1
						}
					}
					if (count == 2 && i == 1) {
						data.updateItem(item, callbackData)
					} else {
						data.updateItem(item)
					}
				}
				item.setPosition(0, y)
			}

			if (speed == -16 && av > 0 && rollItem[1].getPosition().y == 0) {
				rollPanel.stopRoll()
				if (data.endCallback) {
					data.endCallback()
				}
			} else {
				speed = speed + a * av
				if (speed > -16) {
					speed = -16
				} else if (speed < -maxSpeed) {
					speed = -maxSpeed
				}
			}
		}

		let updateReward = (params) => {
			defautItem.active = false
			rollItem[1].active = true
			data.updateItem(rollItem[1], params)
		}

		rollPanel.startRoll = startRoll
		rollPanel.stopRoll = stopRoll
		rollPanel.updateRoll = updateRoll
		rollPanel.updateReward = updateReward

		return rollPanel
	}

	startCountDown() {
		this.stopCountDown()
		this.updateTime()
		this.mCountDownAction = this.setInterval(() => {
			this.updateTime();
		}, 1);
	}
	stopCountDown() {
		this.clearIntervalTimer(this.mCountDownAction);
	}
	updateTime() {
		let time = this.mMultiopenSevenRewardData.nextGetTime - app.func.time()
		if (time <= 0) {
			this.updateView()
		}

		dayjs.extend(utc)
		this.mCountDownTime.getComponent(Label).string = dayjs.unix(time).utc().format("HH:mm:ss")
	}
}
