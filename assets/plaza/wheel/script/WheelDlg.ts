import { v3 } from 'cc';
import { tween } from 'cc';
import { js } from 'cc';
import { Animation, Label, Node, _decorator } from 'cc';
import { UITransform } from 'cc';
import { Vec3 } from 'cc';
import { Sprite } from 'cc';
import { SpriteFrame } from 'cc';
import { macro } from 'cc';
import { DF_RATE, DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { EVENT_ID } from '../../../app/config/EventConfig';
const { ccclass } = _decorator;

import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

let MAX_COUNT = 6
let nAnimationTime = 3

@ccclass('WheelDlg')
export class WheelDlg extends FWDialogViewBase {
	m_nShowCount: any;
	m_nDelAngle: number;
	m_bDraw: boolean;
	m_data: any[];
	initData() {
		this.updateDatas()
	}
	protected initEvents(): boolean | void {
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_WHEEL_REWARD,
			],
			callback: (arg1, arg2) => {
				this.getRewardAndUpdateview(arg1.dict);
			}
		});
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_WHEEL_USERDATA,
			],
			callback: (arg1, arg2) => {
				this.updateUserDataView(arg1.dict);
			}
		});
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_GETREWARDTIPS,
			],
			callback: (arg1, arg2) => {
			}
		});
	}
	protected initView(): boolean | void {
		this.Items.txtRightTips.string = fw.language.getString("recharge")
		this.Items.txtBtnRecharge.string = fw.language.getString("Add Cash")
		this.Items.txtBtnSpine.string = fw.language.getString("SPIN")

		this.updateView()
		this.schedule(this.updateMsg, 10, macro.REPEAT_FOREVER)
	}
	protected initBtns(): boolean | void {
		this.Items.btnClose.onClickAndScale(() => {
			this.onClickClose()
		});
		this.Items.btnGo.onClickAndScale(() => {
			this.onClickSpin()
		});
		this.Items.btnSpin.onClickAndScale(() => {
			this.onClickSpin()
		});
	}
	onClickClose() {
		super.onClickClose();
		if (this.updateMsg) {
			this.unschedule(this.updateMsg);
			return
		}
	}
	onClickSpin() {
		if (center.luckdraw.isCanDraw()) {
			this.m_bDraw = true
			center.luckdraw.sendJoin()
		} else {
			let rewardCfg = center.luckdraw.getCfg()
			let nTotal = rewardCfg.length - 1
			let userData = center.luckdraw.getUserData()
			let nNeedIndex = (userData.nDrawTimes + 1) < nTotal && (userData.nDrawTimes + 1) || nTotal
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`shop/shop_main`],
				data: {
					minPay: rewardCfg[nNeedIndex].recharge
				},
			});
		}
	}
	getRewardAndUpdateview(varTB) {
		let { nAngle, nReward, nType } = this.getAngle(varTB.nIndex)
		let sGoodsID = 0
		if (nType == center.jeckpotdraw.GoodsType.GOLD) {
			sGoodsID = center.goods.gold_id.cash
		} else if (nType == center.jeckpotdraw.GoodsType.BONUS) {
			sGoodsID = center.goods.gold_id.bonus
		} else if (nType == center.jeckpotdraw.GoodsType.JACKPOT) {
		}
		this.playRewardAni(nAngle)

		tween(this.Items.btnGo)
			.delay(nAnimationTime + 0.2)
			.call(() => {
				let neward = []
				neward.push({
					nGoodsID: sGoodsID,
					nGoodsNum: nReward,
				})
				let extenddata = { bDontShowTitle: true }
				app.popup.showDialog({
					viewConfig: fw.BundleConfig.resources.res[`ui/reward/reward`],
					data: { reward: neward, extend: extenddata },
				});
			})
			.start();
	}
	updateUserDataView(varTB) {
		if (this.m_bDraw) {
			tween(this.Items.btnGo)
				.delay(nAnimationTime + 1)
				.call(() => {
					let userData = center.luckdraw.getUserData()
					if (userData.nDrawTimes >= MAX_COUNT) {
						this.onClickClose()
					} else {
						this.updateDatas()
						this.updateView()
					}
				})
				.start();
		} else {
			this.updateDatas()
			this.updateView()
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
		fw.print(" =============== nReward: ", nReward, " nAngle: ", nAngle)
		return { nAngle, nReward, nType }
	}
	playRewardAni(nDelAngle) {
		let nTotalAngle = 360 * 8 + nDelAngle
		tween(this.Items.wheelBg)
			.to(nAnimationTime, { eulerAngles: v3(0, 0, -nTotalAngle) }, { easing: 'cubicInOut' })
			.start();
		tween(this.Items.nodeLabel)
			.to(nAnimationTime, { eulerAngles: v3(0, 0, -nTotalAngle) }, { easing: 'cubicInOut' })
			.start();
	}
	updateDatas() {
		let rewardCfg = center.luckdraw.getCfg()
		let nTotal = rewardCfg.length - 1
		let userData = center.luckdraw.getUserData()
		this.m_nShowCount = ((nTotal - userData.nDrawTimes) >= 2) && (nTotal - userData.nDrawTimes) || 2
		this.m_nDelAngle = 360 / this.m_nShowCount
		this.m_bDraw = false
		fw.print(" =================== this.m_nShowCount: ", this.m_nShowCount)
		fw.print(" =================== this.m_nDelAngle: ", this.m_nDelAngle)
	}
	updateView() {
		for (let i = MAX_COUNT; i >= 2; i--) {
			this.Items[js.formatStr("line%d", i)].active = (i == this.m_nShowCount)
			this.Items[js.formatStr("label%d", i)].active = (i == this.m_nShowCount)
		}

		let cfg = []
		let i: any
		for (i = 1; i <= this.m_nShowCount; i++) {
			cfg[i] = { nIdx: i, nAngle: (360 - (i - 1) * this.m_nDelAngle) }
		}

		fw.print(cfg, " ================ cfg: ")

		this.m_data = []
		let userData = center.luckdraw.getUserData()
		let rewardCfg = center.luckdraw.getCfg()
		let nTotal = rewardCfg.length - 1
		let nMinIndex = nTotal - this.m_nShowCount + 1
		for (let i = rewardCfg.length - 1; i >= nMinIndex; i--) {
			fw.print("sadasd i=", i)
			let nIndex = app.func.getRandomNum(1, cfg.length - 1)
			this.m_data.push({
				nIdx: rewardCfg[i].index,
				nReward: rewardCfg[i].gold,
				nGoldType: rewardCfg[i].gold_type,
				nRankIndex: cfg[nIndex].nIdx,
				nAngle: cfg[nIndex].nAngle
			})
			cfg.splice(nIndex, 1)
		}

		fw.print(this.m_data, " ================= this.m_data: ")

		if (userData.nDrawTimes == nTotal - 1) {
			let lastItem = rewardCfg[nTotal - 1]
			for (i = 1; i <= 2; i++) {
				let nNum = (lastItem.gold / DF_RATE)
				this.Items[js.formatStr("label%d", this.m_nShowCount)].Items[js.formatStr("label_%d", i)].getComponent(Label).string = `${nNum}`
				let bonusLabel = this.Items[js.formatStr("label%d", this.m_nShowCount)].Items[js.formatStr("bonus_%d", i)]
				if (lastItem.gold_type == center.luckdraw.GoodsType.BONUS) {
					bonusLabel.getComponent(Label).string = "bonus"
				} else {
					bonusLabel.getComponent(Label).string = "cash"
				}
				bonusLabel.active = false //--不显示名字，图片带了

				let fileName = (lastItem.gold_type == center.luckdraw.GoodsType.GOLD) && "Rs_jinbi" || "Rs_bonus"
				let strGoodsPath = fw.BundleConfig.plaza.res[js.formatStr("shop/img/get/%s/spriteFrame", fileName)]
				let iconNode = this.Items[js.formatStr("label%d", this.m_nShowCount)].Items[js.formatStr("icon_%d", i)]
				this.getGoodsIcon(strGoodsPath, iconNode)
			}

			this.Items.txtLeftTips.getComponent(Label).string = fw.language.getString("Spin to get rewards")
		} else {
			for (const k in this.m_data) {
				let v = this.m_data[k]
				let nNum = (v.nReward / DF_RATE)
				this.Items[js.formatStr("label%d", this.m_nShowCount)].Items[js.formatStr("label_%d", v.nRankIndex)].getComponent(Label).string = `${nNum}`
				let bonusLabel = this.Items[js.formatStr("label%d", this.m_nShowCount)].Items[js.formatStr("bonus_%d", v.nRankIndex)]
				if (v.nGoldType == center.luckdraw.GoodsType.BONUS) {
					bonusLabel.getComponent(Label).string = "bonus"
				} else {
					bonusLabel.getComponent(Label).string = "cash"
				}
				bonusLabel.active = false //--不显示名字，图片带了

				let fileName = (v.nGoldType == center.luckdraw.GoodsType.GOLD) && "Rs_jinbi" || "Rs_bonus"
				let strGoodsPath = fw.BundleConfig.plaza.res[js.formatStr("shop/img/get/%s/spriteFrame", fileName)]
				let iconNode = this.Items[js.formatStr("label%d", this.m_nShowCount)].Items[js.formatStr("icon_%d", v.nRankIndex)]
				this.getGoodsIcon(strGoodsPath, iconNode)
			}

			this.Items.txtLeftTips.getComponent(Label).string = fw.language.getString("Spin ${num} times to get all rewards", { num: this.m_nShowCount })
		}


		let nNeedIndex = (userData.nDrawTimes + 1) < nTotal && (userData.nDrawTimes + 1) || nTotal
		this.Items.txtRechargeTips.active = nNeedIndex <= nTotal
		this.Items.txtRightTips.active = nNeedIndex <= nTotal
		this.Items.txtRechargeTips.getComponent(Label).string = fw.language.getString("${DF_SYMBOL}${num} get 1 spin", { DF_SYMBOL: DF_SYMBOL, num: rewardCfg[nNeedIndex].recharge })

		let bDraw = center.luckdraw.isCanDraw()
		this.Items.txtBtnSpine.active = bDraw
		this.Items.txtBtnRecharge.active = !bDraw
		this.Items.txtBtnPrice.active = !bDraw
		this.Items.txtBtnPrice.getComponent(Label).string = DF_SYMBOL + rewardCfg[nNeedIndex].recharge
		this.Items.btnAni.active = bDraw

		this.Items.wheelBg.angle = 0
		this.Items.nodeLabel.angle = 0
	}
	getGoodsIcon(nPacketPicID, spriteNode) {
		spriteNode.removeAllChildren(true)
		let node1 = new Node();
		let sprite = node1.addComponent(Sprite);
		spriteNode.addChild(node1);
		sprite.obtainComponent(UITransform).setAnchorPoint(0.5, 0);
		node1.scale = fw.v3(0.8, 0.8, 0.8)
		sprite.loadBundleRes(nPacketPicID,(res: SpriteFrame) => {
			sprite.spriteFrame = res;
		});
	}
	updateMsg() {
		let name = js.formatStr("player_%s", this.getRandString())
		let rewardCfg = center.luckdraw.getCfg()
		let nReward = DF_SYMBOL + (rewardCfg[app.func.getRandomNum(1, 6)].gold / DF_RATE)
		let nPosY = app.func.getRandomNum(app.winSize.height * 0.25, app.winSize.height * 0.5 - 80)
		let node_msg = this.Items.node_msg.clone()
		node_msg.active = true
		this.node.addChild(node_msg);
		node_msg.setPosition(v3(1280 * 0.7, nPosY, 0));

		node_msg.Items.txtName.getComponent(Label).string = name
		node_msg.Items.txtGold.getComponent(Label).string = nReward
		tween(node_msg)
			.show()
			.to(20, { position: new Vec3(1280 * -0.7, nPosY, 0) })
			.call(() => {
				node_msg.destroy();
			})
			.start();
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
