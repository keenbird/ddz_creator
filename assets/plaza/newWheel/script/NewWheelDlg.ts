import { RichText, Vec3 } from 'cc';
import { v3 } from 'cc';
import { tween } from 'cc';
import { SpriteFrame } from 'cc';
import { Sprite } from 'cc';
import { macro } from 'cc';
import { math } from 'cc';
import { UITransform } from 'cc';
import { Animation, Label, Node as ccNode, _decorator } from 'cc';
import { DF_RATE, DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { EVENT_ID } from '../../../app/config/EventConfig';
const { ccclass } = _decorator;

import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
import { js } from 'cc';
import { Tween } from 'cc';
import proto from '../../../app/center/common';

let MAX_COUNT = 3
let nAnimationTime = 3

@ccclass('NewWheelDlg')
export class NewWheelDlg extends FWDialogViewBase {
	mIsDrawingAnim: boolean;
	mTimeCount: number;
	m_nShowCount: number;
	m_data: any[];
	isMove: boolean;
	updateFinishTime: () => void;
	m_nDelAngle: number;
	m_bDraw: boolean;
	tnodeup: ccNode;
	tnodedown: ccNode;
	moveCount: number;
	curWheel: ccNode;
	initData() {
		this.mIsDrawingAnim = false
		this.mTimeCount = 0
		this.moveCount = 0
		this.updateDatas()
	}
	protected initEvents(): boolean | void {
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_NEW_WHEEL_REWARD,
			],
			callback: (arg1, arg2) => {
				this.getRewardAndUpdateview(arg1.dict);
			}
		});
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_NEW_WHEEL_USERDATA,
				EVENT_ID.EVENT_NEW_WHEEL_CONFIG,
			],
			callback: () => {
				if (this.mIsDrawingAnim) {
					return
				}
				this.checkAndUpdate();
			}
		});
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_GETREWARDTIPS,
			],
			callback: (arg1, arg2) => {
				let userData = center.jeckpotdraw.getUserData()
				if (userData.draw_times == 3) {
					center.jeckpotdraw.setWheelTimeOver(true)
				}
			}
		});
	}
	protected initView(): boolean | void {
		this.setFinishTime()
		this.updateView()
		this.initPlayerInfo()
		this.tnodeup = this.Items.Panel_luckyPlayerNew
		this.tnodedown = this.Items.Panel_luckyPlayer
		this.schedule(this.updateMsgJackpot, 1, macro.REPEAT_FOREVER)
		this.schedule(this.updateMsgRecords, 0.01, macro.REPEAT_FOREVER)

		this.Items.Label_recharge.string = fw.language.get("Add Cash");
		this.Items.Label_spine.string = fw.language.get("SPIN");

	}
	protected initBtns(): boolean | void {
		this.Items.btnClose.onClickAndScale(() => {
			this.onClickClose()
		});
		this.Items.btnGo.onClickAndScale(() => {
			this.onClickGo()
		});
		this.Items.btnSpin.onClickAndScale(() => {
			this.onClickSpin()
		});
	}

	onClickGo() {
		this.onClickSpin()
	}

	onClickSpin() {
		let userData = center.jeckpotdraw.getUserData()
		if (center.jeckpotdraw.getWheelTimeOver()) {
			if (center.jeckpotdraw.isCanDraw()) {
				this.m_bDraw = true
				center.jeckpotdraw.sendJoin()
			} else {
				app.popup.showToast("The event has ended, thanks")
			}
		} else {
			if (center.jeckpotdraw.isCanDraw()) {
				this.m_bDraw = true
				center.jeckpotdraw.sendJoin()
			} else {
				let rewardCfg = center.jeckpotdraw.getCfg()
				let nTotal = rewardCfg.length - 1
				let rechargeCfg = center.jeckpotdraw.getRechargeInfo()
				let nNeedIndex = userData.draw_times + 1
				app.popup.showDialog({
					viewConfig: fw.BundleConfig.plaza.res[`shop/shop_main`],
					data: {
						minPay: rechargeCfg[nNeedIndex],
					},
				});
			}
		}
	}
	onClickClose() {
		super.onClickClose();
		if (this.updateMsgJackpot) {
			this.unschedule(this.updateMsgJackpot);
			return
		}

		if (this.updateMsgRecords) {
			this.unschedule(this.updateMsgRecords);
		}
	}
	setFinishTime() {
		let registerTime = center.user.getRegisterTime()
		let overTime = app.func.time() - registerTime
		let restTime = center.jeckpotdraw.getValidTimeInfo() - overTime
		if (restTime < 0) {
			this.Items.Finishtime.getComponent(Label).string = js.formatStr("%s:%s:%s", this.formatNum(0), this.formatNum(0), this.formatNum(0))
		} else {
			this.updateFinishTime = function () {
				let restTime = center.jeckpotdraw.getFinishTime() - app.func.time()
				if (restTime <= 0) {
					this.Items.Finishtime.getComponent(Label).string = js.formatStr("%s:%s:%s", this.formatNum(0), this.formatNum(0), this.formatNum(0))
					center.jeckpotdraw.setWheelTimeOver(true)
					return
				}
				let hour = Math.floor(restTime / 3600)
				let second = restTime % 60
				let min = Math.floor(restTime % 3600 / 60)
				this.Items.Finishtime.getComponent(Label).string = js.formatStr("%s:%s:%s", this.formatNum(hour), this.formatNum(min), this.formatNum(second))
			}
			this.schedule(this.updateFinishTime, 1, macro.REPEAT_FOREVER)
		}
	}

	formatNum(num) {
		return app.func.formatNumberForZore(num)
	}

	getRewardAndUpdateview(varTB: proto.plaza_jackpotdraw.Ijackpot_draw_join_res) {
		let { nAngle, nReward, nType } = this.getAngle(varTB.res_index)
		let scale = 1.58
		let sGoodsID = 0
		if (nType == center.jeckpotdraw.GoodsType.GOLD) {
			scale = 1
			sGoodsID = center.goods.gold_id.cash
		} else if (nType == center.jeckpotdraw.GoodsType.BONUS) {
			scale = 1
			sGoodsID = center.goods.gold_id.bonus
		} else if (nType == center.jeckpotdraw.GoodsType.JACKPOT) {
		}
		this.playRewardAni(nAngle)

		tween(this.Items.btnGo)
			.delay(nAnimationTime + 1)
			.call(() => {
				this.mIsDrawingAnim = false
				let neward = []
				neward.push({
					nGoodsID: sGoodsID,
					nGoodsNum: nReward,
				})
				let extData = { bDontShowTitle: true }
				app.popup.showDialog({
					viewConfig: fw.BundleConfig.resources.res[`ui/reward/reward`],
					data: { reward: neward, extend: extData },
				});
				this.checkAndUpdate()
			})
			.start();
	}
	checkAndUpdate() {
		let userData = center.jeckpotdraw.getUserData()
		// --抽完所有奖励 关闭抽奖弹窗
		if (userData.draw_times >= MAX_COUNT) {
			center.jeckpotdraw.m_threeTime = true
			this.onClickClose()
		} else {
			if (center.jeckpotdraw.nItemCount == 0) {
				this.onClickClose()
			} else {
				this.updateDatas()
				this.updateView()
			}
		}
	}
	getAngle(nIndex: any) {
		let nAngle: number
		let nReward: number
		let nType: number
		for (const i in this.m_data) {
			let v = this.m_data[i];
			if (v.nIdx == nIndex) {
				nAngle = v.nAngle
				nReward = v.nReward
				nType = v.nGoldType
				break
			}
		}
		return { nAngle, nReward, nType }
	}
	playRewardAni(nDelAngle) {
		this.mIsDrawingAnim = true
		let nTotalAngle = 360 * 8 + nDelAngle
		tween(this.curWheel)
			.to(nAnimationTime, { eulerAngles: v3(0, 0, -nTotalAngle) }, { easing: 'cubicInOut' })
			.call(() => {
				// this.Items.wheelBg4.angle = 0
			})
			.start();
	}
	updateDatas() {
		let rewardCfg = center.jeckpotdraw.getCfg()
		let nTotal = rewardCfg.length - 1
		let userData = center.jeckpotdraw.getUserData()
		// --this.m_nShowCount = ((nTotal - userData.nDrawTimes) >= 2) && (nTotal - userData.nDrawTimes) or 2
		this.m_nShowCount = nTotal
		this.m_nDelAngle = 360 / this.m_nShowCount
		this.m_bDraw = false
	}
	updateView() {
		let cfg = []
		let i: any
		for (i = 1; i <= this.m_nShowCount; i++) {
			cfg[i] = { nIdx: i, nAngle: 360 - (i - 1) * this.m_nDelAngle }
		}
		this.m_data = []
		let userData = center.jeckpotdraw.getUserData()
		let rewardCfg = center.jeckpotdraw.getCfg()
		let rechargeCfg = center.jeckpotdraw.getRechargeInfo()
		let nJackpotGold = center.jeckpotdraw.getJackpotGold()
		let nTotal = rewardCfg.length - 1
		let l = rewardCfg.length - 1
		for (const i in rewardCfg) {
			this.m_data.push({
				nIdx: rewardCfg[i].index,
				nReward: rewardCfg[i].gold_num,
				nGoldType: rewardCfg[i].gold_type,
				//--nRankIndex : cfg[nIndex].nIdx,
				nRankIndex: rewardCfg[i].index,
				nAngle: cfg[i].nAngle
			})
		}
		if (userData.draw_times == 0) {
			this.Items.wheelBg4.active = false
			this.Items.wheelBg6.active = true
			this.curWheel = this.Items.wheelBg6
		} else {
			this.Items.wheelBg4.active = true
			this.Items.wheelBg6.active = false
			this.curWheel = this.Items.wheelBg4
		}
		this.curWheel.angle = 0
		for (const k in this.m_data) {
			let v = this.m_data[k]
			let nNum = ""
			let sacle = 1
			let fileName = ""
			let bonusLabel = this.Items[js.formatStr("label%d", this.m_nShowCount)].Items[js.formatStr("bonus_%d", v.nRankIndex)]
			if (v.nGoldType == center.jeckpotdraw.GoodsType.GOLD) {
				fileName = "Rs_jinbi"
				nNum = `${v.nReward / DF_RATE}`;
				bonusLabel.active = true
				bonusLabel.getComponent(Label).string = "cash"
				sacle = 0.7
			} else if (v.nGoldType == center.jeckpotdraw.GoodsType.BONUS) {
				fileName = "Rs_bonus"
				nNum = `${v.nReward / DF_RATE}`;
				bonusLabel.active = true
				bonusLabel.getComponent(Label).string = "bonus"
				sacle = 0.7
			} else if (v.nGoldType == center.jeckpotdraw.GoodsType.JACKPOT) {
				fileName = "ZP_icon_jackpot"
				nNum = v.nReward + "%"
				bonusLabel.active = false
			}
			bonusLabel.active = false //--不显示名字，图片带了
			this.Items[js.formatStr("label%d", this.m_nShowCount)].Items[js.formatStr("label_%d", v.nRankIndex)].getComponent(Label).string = nNum
			let strGoodsPath = fw.BundleConfig.plaza.res[js.formatStr("shop/img/get/%s/spriteFrame", fileName)]
			let iconNode = this.Items[js.formatStr("label%d", this.m_nShowCount)].Items[js.formatStr("icon_%d", v.nRankIndex)]
			this.getGoodsIcon(strGoodsPath, iconNode, sacle)


		}

		let nNeedIndex = userData.draw_times + 1
		if (userData.draw_status == 1) {
			this.Items.bottom.active = false
		} else {
			this.Items.bottom.active = nNeedIndex <= nTotal
		}

		this.Items.RichText_tips.getComponent(RichText).string = fw.language.getString("<color=#ffffff>Add Cash </color><color=#FDFF2F>${DF_SYMBOL}${num} get 1 spin</color>", {
			DF_SYMBOL: DF_SYMBOL,
			num: rechargeCfg[nNeedIndex],
		})

		let bDraw = center.jeckpotdraw.isCanDraw()
		this.Items.Label_spine.active = bDraw
		this.Items.Label_recharge.active = !bDraw
		this.Items.Label_price.active = !bDraw
		this.Items.Label_price.getComponent(Label).string = DF_SYMBOL + rechargeCfg[nNeedIndex]
		this.Items.btnAni.active = bDraw
		this.Items.jacpot.getComponent(Label).string = DF_SYMBOL + nJackpotGold[nNeedIndex]
	}

	getGoodsIcon(nPacketPicID, spriteNode, scale) {
		spriteNode.removeAllChildren(true)
		let node1 = new ccNode();
		let sprite = node1.addComponent(Sprite);
		spriteNode.addChild(node1);
		sprite.sizeMode = Sprite.SizeMode.RAW;
		sprite.trim = false;
		node1.scale = fw.v3(scale, scale, scale)
		sprite.loadBundleRes(nPacketPicID,(res: SpriteFrame) => {
			sprite.spriteFrame = res;
		});
	}
	initPlayerInfo() {
		// --初始化幸运玩家
		let name = "player_" + this.getRandString()
		this.Items.LuckyPlayerID.getComponent(Label).string = name
		let nRand = app.func.getRandomNum(1, 30)
		let nReward = "jackpot " + nRand + "%"
		this.Items.jackPotText.getComponent(Label).string = nReward
		// --初始化列表玩家
		let tlistData = this.getRecordsCfg()
		let tnode, name1, nReward1
		for (let i = 1; i <= 7; i++) {
			tnode = this.Items["Panel_Item" + i]
			name1 = "player_" + this.getRandString()
			tnode.Items["playerinfo"].getComponent(Label).string = name1
			nReward1 = DF_SYMBOL + (tlistData[app.func.getRandomNum(1, tlistData.length - 1)].gold_num / DF_RATE)
			tnode.Items["jackPotText_0"].getComponent(Label).string = nReward1
			tnode.position.y = (308 - (i - 1) * 44)
		}
	}
	getRecordsCfg() {
		let rewardCfg = app.func.clone(center.jeckpotdraw.getCfg())
		let count = rewardCfg.length - 1
		for (let i = count; i >= 1; i--) {
			// --如果是分奖池移除
			if (center.jeckpotdraw.GoodsType.JACKPOT == rewardCfg[i].gold_type) {
				rewardCfg.splice(i, 1)
			}
		}
		return rewardCfg ?? []
	}
	updateMsgJackpot() {
		let rewardCfg = center.jeckpotdraw.getCfg()
		let length = rewardCfg.length
		if (rewardCfg.length > 1) {
			length = rewardCfg.length - 1
		}
		if (length == 0 && this.updateMsgJackpot) {
			this.unschedule(this.updateMsgJackpot);
			return
		}
		this.mTimeCount + 1
		if (0 == this.mTimeCount % 4) {
			this.mTimeCount = 0
			if (null == this.isMove || false == this.isMove) {
				Tween.stopAllByTarget(this.Items.Panel_jackpot)
				Tween.stopAllByTarget(this.Items.Panel_luckyPlayer)
				Tween.stopAllByTarget(this.Items.Panel_luckyPlayerNew)

				let tnodeup = this.Items.Panel_luckyPlayerNew
				let tnodedown = this.Items.Panel_luckyPlayer
				if (this.moveCount % 2 == 1) {
					tnodeup = this.Items.Panel_luckyPlayer
					tnodedown = this.Items.Panel_luckyPlayerNew
				}

				// --幸运玩家
				let tcurPlayer = tnodeup
				let name = "player_" + this.getRandString()
				tcurPlayer.Items.LuckyPlayerID.getComponent(Label).string = name
				let nRand = app.func.getRandomNum(1, 30)
				let nReward = "jacpot " + nRand + "%"
				tcurPlayer.Items.jackPotText.getComponent(Label).string = nReward

				this.isMove = true
				tween(tnodedown).to(1, { position: new Vec3(0, -70, 0) })
					.call(() => {
						tnodedown.setPosition(tnodedown.position.x, 32, 0);
						tnodeup.setPosition(tnodeup.position.x, 0, 0);
						this.isMove = false
					}
					).start();
				tween(tnodeup).to(1, { position: new Vec3(0, 0, 0) }).start();

				this.moveCount = this.moveCount + 1
			}
		}
	}
	updateMsgRecords() {
		let rewardCfg = center.jeckpotdraw.getCfg()
		if (rewardCfg.length - 1 == 0 && this.updateMsgRecords) {
			this.unschedule(this.updateMsgRecords);
			return
		}
		let tlistData = this.getRecordsCfg()
		if (tlistData.length > 0) {
			let tnode, name1, nReward1
			for (let i = 1; i <= 7; i++) {
				tnode = this.Items["Panel_Item" + i]
				tnode.position.y = tnode.position.y - 1
				tnode.setPosition(v3(tnode.position.x, tnode.position.y, 0));
				if (0 >= tnode.position.y) {
					tnode.position.y = 308
					name1 = "player_" + this.getRandString()
					tnode.Items["playerinfo"].getComponent(Label).string = name1
					nReward1 = DF_SYMBOL + (tlistData[app.func.getRandomNum(1, tlistData.length - 1)].gold_num / DF_RATE)
					tnode.Items["jackPotText_0"].getComponent(Label).string = nReward1
				}
			}
		}
	}

	getRandString() {
		let strRand = ""
		for (let i = 1; i <= 5; i++) {
			let nRand = app.func.getRandomNum(1, 3)
			if (nRand == 1) {
				// --A~Z
				strRand = strRand + String.fromCharCode(app.func.getRandomNum(65, 90))
			} else if (nRand == 2) {
				// --a~z
				strRand = strRand + String.fromCharCode(app.func.getRandomNum(97, 122))
			} else {
				// --0~9
				strRand = strRand + String.fromCharCode(app.func.getRandomNum(48, 57))
			}
		}
		return strRand
	}
}

