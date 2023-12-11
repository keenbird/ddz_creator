import { Button, ProgressBar, RichText } from 'cc';
import { Sprite } from 'cc';
import { js } from 'cc';
import { Label, _decorator } from 'cc';
import { ACTOR } from '../../../app/config/cmd/ActorCMD';
import { DF_RATE, DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { EVENT_ID } from '../../../app/config/EventConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
const { ccclass } = _decorator;

@ccclass('vipGiftDlg')
export class vipGiftDlg extends FWDialogViewBase {
	curyear: number;
	curmonth: number;
	curday: any;
	cruweek: any;
	curTime: number;
	timeZero: number;
	mCurLevel: number;
	mShowLevel: number;
	mVipListInfo: any;
	mMaxLevel: number;
	mVipRewardInfo: any;
	mVipInfo: any;
	action: any;
	initData() {
		let data = new Date()
		this.curyear = data.getFullYear()//当前年份
		this.curmonth = data.getMonth()//当前月份 0-11,0代表1月
		this.curday = data.getDate()
		this.cruweek = data.getDay()//当前星期 0-6,0代表星期天

		this.curTime = app.func.time()
		let nDelServerTime = center.user.getServerDelTime()
		this.curTime = this.curTime + nDelServerTime

		let todayEndTime: Date = new Date(data.getFullYear(), data.getMonth(), data.getDate(), 0, 0, 0, 0);
		this.timeZero = todayEndTime.getTime() / 1000

		this.mCurLevel = center.user.getActorProp(ACTOR.ACTOR_PROP_VIPLEVEL)
		this.mShowLevel = this.mCurLevel
		this.mVipListInfo = center.user.getVIPLevelInfoArray()
		this.mMaxLevel = center.user.getMaxLevel()

		// --this.mCurLevel = 2
		// --this.mShowLevel = 8
		// --this.mMaxLevel = 10

		this.mVipRewardInfo = center.user.getVipRewardInfo()
		this.setViewStatus()
	}
	protected initEvents(): boolean | void {
		// fw.print("vipGiftDlg =================== 22222")
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_PLAZA_VIPGIFT_INFO,
				EVENT_ID.EVENT_PLAZA_ACTOR_PRIVATE,
				EVENT_ID.EVENT_PLAZA_ACTOR_VARIABLE,
			],
			callback: (arg1, arg2) => {
				this.mCurLevel = center.user.getActorProp(ACTOR.ACTOR_PROP_VIPLEVEL)
				this.mShowLevel = this.mCurLevel
				this.mVipRewardInfo = center.user.getVipRewardInfo()

				this.setViewStatus()
			}
		});
	}
	protected initView(): boolean | void {
		this.setViewStatus()
		
		this.Items.node_cur.Items.RichText_tips.getComponent(RichText).string = fw.language.get("<color=#ffffff>1% </color><color=#22936F>of the money you lose will become bonus for you</color>")
		this.Items.node_next.Items.Text_desc.string = fw.language.getString("1 point for every ${DF_SYMBOL}1 recharge",{
			DF_SYMBOL:DF_SYMBOL
		});
		
		
		let panels = [
			this.Items.node_cur.Items.Panel_d,
			this.Items.node_cur.Items.Panel_w,
			this.Items.node_cur.Items.Panel_m,
		];
		let panelsNext = [
			this.Items.node_next.Items.Panel_d,
			this.Items.node_next.Items.Panel_w,
			this.Items.node_next.Items.Panel_m,
		];

		let titleStr = [
			fw.language.get("Daily Bonus"),
			fw.language.get("Weekly Bonus"),
			fw.language.get("Monthly Bonus"),
		]
		let tipsStr = fw.language.get("Have Bonus");
		let timeStr = fw.language.get("Get time");
		let uptoStr = fw.language.get("UP to");
		panels.forEach((v,i)=>{
			v.Items.Label_reward_title.string = titleStr[i];
			v.Items.Label_reward_tips.string = tipsStr;
			v.Items.Label_time.string = timeStr;
			v.Items.Lable_upto.string = uptoStr;
		})
		panelsNext.forEach((v,i)=>{
			v.Items.Label_reward_title.string = titleStr[i];
		})
	}
	protected initBtns(): boolean | void {
		this.Items.Image_close.onClickAndScale(() => {
			this.onClickClose();
		})
		this.Items.Image_next.onClickAndScale(() => {
			this.onNextLeveBtnClick();
		})
		this.Items.Image_pre.onClickAndScale(() => {
			this.onPreLeveBtnClick();
		})
	}
	initNodeCur() {
		let updatePanelView = (panel, curData) => {
			panel.Items.Text_upto_num.getComponent(Label).string = (DF_SYMBOL + curData.curLimit / DF_RATE)
			let canGet = curData.validBonus > 0
			let textReward = 0
			if (canGet) {
				textReward = curData.validBonus
			} else {
				textReward = curData.bonus
			}
			panel.Items.text_reward.getComponent(Label).string = (DF_SYMBOL + textReward / DF_RATE)
			panel.Items.Image_get.active = canGet

			panel.Items.Image_get.onClickAndScale(() => {
				center.user.sendGetVipReward(curData.rewardType)
				this.setBtnSleep(panel.Items.Image_get)
			})
			panel.Items.Image_time.active = !canGet
			panel.Items.bonus_progress.getComponent(ProgressBar).progress = textReward / curData.curLimit
			if (canGet) {
				panel.Items.bonus_progress.getComponent(ProgressBar).progress = 1
			}
		}

		let cur_root = this.Items.node_cur

		let data = {
			curLimit: parseInt(this.mVipInfo.nDayBonusLimit),
			bonus: parseInt(this.mVipRewardInfo.nDayCurBonus),
			validBonus: parseInt(this.mVipRewardInfo.nDayValidBonus),
			rewardType: 0,
		}
		updatePanelView(cur_root.Items.Panel_d, data)
		data = {
			curLimit: parseInt(this.mVipInfo.nWeekBonusLimit),
			bonus: parseInt(this.mVipRewardInfo.nWeekCurBonus),
			validBonus: parseInt(this.mVipRewardInfo.nWeekValidBonus),
			rewardType: 1,
		}
		updatePanelView(cur_root.Items.Panel_w, data)
		data = {
			curLimit: parseInt(this.mVipInfo.nMonthBonusLimit),
			bonus: parseInt(this.mVipRewardInfo.nMonthCurBonus),
			validBonus: parseInt(this.mVipRewardInfo.nMonthValidBonus),
			rewardType: 2,
		}
		updatePanelView(cur_root.Items.Panel_m, data)

		this.getLastDayTime()
		this.getLastWeekTime()
		this.getMonthDayTime()

	}
	initNodeNext() {
		let cur_root = this.Items.node_next
		cur_root.Items.cur_level.getComponent(Label).string = "VIP" + String(this.mCurLevel)

		let nextLevel = this.mShowLevel >= this.mMaxLevel && this.mMaxLevel || this.mShowLevel + 1
		cur_root.Items.next_level.getComponent(Label).string = "VIP" + String(this.mShowLevel)

		let curExp = center.user.getActorProp(ACTOR.ACTOR_PROP_VIPEXP)
		let curLevelInfo = center.user.getVipLevelInfo(this.mCurLevel)

		let showPreLevelInfo = center.user.getVipLevelInfo(this.mShowLevel - 1)
		let diffInfo = { nNeedExp: 0 }
		if (this.mCurLevel >= 1) {
			diffInfo = center.user.getVipLevelInfo(this.mCurLevel - 1)
		}
		let showLevelInfo = center.user.getVipLevelInfo(this.mShowLevel)
		let cur = parseInt(curExp) - parseInt(diffInfo.nNeedExp)
		let need = parseInt(showPreLevelInfo.nNeedExp) - parseInt(diffInfo.nNeedExp)
		cur_root.Items.bonus_progress.getComponent(ProgressBar).progress = cur / need
		cur_root.Items.Text_progress.getComponent(Label).string = (js.formatStr("%s/%s", cur, need))
		cur_root.Items.Panel_d.Items.Text_upto_num.getComponent(Label).string = (DF_SYMBOL + showLevelInfo.nDayBonusLimit / DF_RATE)
		cur_root.Items.Panel_w.Items.Text_upto_num.getComponent(Label).string = (DF_SYMBOL + showLevelInfo.nWeekBonusLimit / DF_RATE)
		cur_root.Items.Panel_m.Items.Text_upto_num.getComponent(Label).string = (DF_SYMBOL + showLevelInfo.nMonthBonusLimit / DF_RATE)

		cur_root.Items.Image_addcash.onClickAndScale(() => {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`shop/shop_main`]
			});
		})

		cur_root.Items.Label_become.getComponent(Label).string = fw.language.getString("Add Cash to become VIP${lv}",{
			lv:this.mShowLevel
		})
	}
	onNextLeveBtnClick() {
		if (this.mShowLevel < this.mMaxLevel) {
			this.mShowLevel = this.mShowLevel + 1
		}
		this.setViewStatus()
	}
	onPreLeveBtnClick() {
		if (this.mShowLevel > 0) {
			this.mShowLevel = this.mShowLevel - 1
		}
		this.setViewStatus()
	}
	setViewStatus() {
		this.Items.node_cur.active = this.mCurLevel == this.mShowLevel
		this.Items.node_next.active = this.mCurLevel < this.mShowLevel
		this.Items.Image_next.active = this.mShowLevel < this.mMaxLevel
		this.Items.Image_pre.active = this.mShowLevel > this.mCurLevel

		this.mVipInfo = center.user.getVipLevelInfo(this.mCurLevel)

		this.updateTitle()
		this.initNodeCur()
		this.initNodeNext()
	}
	updateTitle() {
		this.Items.vip_level.getComponent(Label).string = fw.language.getString("VIP${lv} GIFT",{lv:this.mShowLevel})
	}
	setBtnSleep(btnNode) {
		btnNode.obtainComponent(Button).interactable = false
		btnNode.getComponent(Sprite).grayscale = true

		let countdownTime = 5
		let updateLastTime = () => {
			if (countdownTime == 0 && !fw.isNull(btnNode)) {
				btnNode.obtainComponent(Button).interactable = true
				btnNode.getComponent(Sprite).grayscale = false
				stop()
			}
			countdownTime = countdownTime - 1
		}
		let stop = () => {
			if (btnNode.action) {
				this.clearIntervalTimer(btnNode.action)
				btnNode.action = null
			}
		}

		stop()
		updateLastTime()
		btnNode.action = this.setInterval(updateLastTime, 1)
	}
	getLastDayTime() {
		let data = new Date()
		let curTime = this.curTime
		let todayEndTime: Date = new Date(this.curyear, this.curmonth, this.curday, 23, 59, 59, 0);
		let endTime = todayEndTime.getTime() / 1000
		this.startTimeDownload(this.Items.node_cur.Items.Panel_d.Items.time, endTime - curTime, endTime)
	}
	getLastWeekTime() {
		let curTime = this.curTime
		let timeZero = this.timeZero
		let endTime = 0
		if (this.cruweek == 0) {//0-6,0代表星期天
			endTime = timeZero + 24 * 3600
		} else {
			endTime = timeZero + (7 - this.cruweek + 1) * 24 * 3600
		}
		this.startTimeDownload(this.Items.node_cur.Items.Panel_w.Items.time, endTime - curTime, endTime)
	}
	getMonthDayTime() {
		let curTime = this.curTime
		let timeZero = this.timeZero
		let Mdays = app.func.getDays(this.curyear, this.curmonth + 1)
		let endTime = timeZero + (Mdays - this.curday + 1) * 24 * 3600
		this.startTimeDownload(this.Items.node_cur.Items.Panel_m.Items.time, endTime - curTime, endTime)
	}
	startTimeDownload(node, time, endTime) {
		let updateLastTime = () => {
			if (!fw.isNull(node)) {
				let hour = Math.floor(time / 3600)
				let second = time % 60
				let min = Math.floor(time % 3600 / 60)
				fw.print("vipGiftDlgupdateLastTime ", hour, min, second)
				let str = ""
				let tempTime = new Date(endTime * 1000)
				if (time >= 24 * 3600) {
					str = js.formatStr("%s-%s-%s", app.func.formatNumberForZore(tempTime.getDate()), app.func.formatNumberForZore(tempTime.getMonth() + 1), app.func.formatNumberForZore(tempTime.getFullYear()))
				} else {
					str = js.formatStr("%s:%s:%s", app.func.formatNumberForZore(hour), app.func.formatNumberForZore(min), app.func.formatNumberForZore(second))
				}
				node.getComponent(Label).string = str
				if (time == 0) {
					stop()
				}
				time = time - 1
			}
		}
		let stop = () => {
			if (node.action) {
				this.clearIntervalTimer(node.action)
				node.action = null
			}
		}

		stop()
		updateLastTime()
		node.action = this.setInterval(updateLastTime, 1)
	}
}

