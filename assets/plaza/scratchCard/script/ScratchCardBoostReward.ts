import { SpriteFrame } from 'cc';
import { Sprite } from 'cc';
import { ProgressBar } from 'cc';
import { Label, _decorator } from 'cc';
import { DF_RATE } from '../../../app/config/ConstantConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
const { ccclass } = _decorator;

@ccclass('ScratchCardBoostReward')
export class ScratchCardBoostReward extends FWDialogViewBase {
	mScratchcardData: any
	mScratchcardInfo: any
	mRewardList: {};
	mNextRewardList: {};
	initData() {
		this.mScratchcardData = center.scratchCard.getScratchcardData()
		this.mScratchcardInfo = center.scratchCard.getScratchcardInfo()
	}
	protected initEvents(): boolean | void {
		// fw.print("ScratchCardBoostReward =================== 22222")
		this.bindEvent({
			eventName: ["ScratchcardLevelChange",],
			callback: (arg1, arg2) => {
				this.updateLevel()
			}
		});
		this.bindEvent({
			eventName: ["ScratchcardRechargeChange",],
			callback: (arg1, arg2) => {
				this.updateRecharge()
			}
		});
	}
	protected initView(): boolean | void {
		this.Items.Text_upgrade_tip.string = fw.language.get("You can claim the reward once a day, up to 30 times")
		//初始化奖励列表
		this.mRewardList = {}
		let dfItem = this.Items.Panel_reward_item
		this.Items.Panel_reward_item.active = false
		let dfW = 130

		for (let i = 1; i <= 7; i++) {
			let item = dfItem.clone()
			this.Items.Panel_reward.Items.Panel_list.addChild(item)
			item.setPosition((i - 1) * dfW + dfW / 2, 65)
			this.mRewardList[i] = item
		}

		this.mNextRewardList = {}
		dfW = 130
		for (let i = 1; i <= 7; i++) {
			let item = dfItem.clone()
			this.Items.Panel_next_reward.Items.Panel_list.addChild(item)
			item.setPosition((i - 1) * dfW + dfW / 2, 65)
			this.mNextRewardList[i] = item
		}
		this.updateLevel()
		this.updateRecharge()
	}
	protected initBtns(): boolean | void {
		this.Items.Panel_close.onClickAndScale(() => {
			this.onClickClose()
		});
		this.Items.Image_add_btn.onClickAndScale(() => {
			this.onAddCashClick()
		});
	}
	updateRecharge() {
		let nextRecharge = center.scratchCard.getScratchcardNextLevelRechargeByRecharge(this.mScratchcardData.nRecharge)
		let percent = this.mScratchcardData.nRecharge / nextRecharge
		if (percent > 1) { percent = 1 }
		this.Items.LoadingBar_vip_exp.getComponent(ProgressBar).progress = percent
		this.Items.Text_vip_exp.getComponent(Label).string = (this.mScratchcardData.nRecharge + "/" + nextRecharge)
	}
	updateLevel() {
		let level = this.mScratchcardData.nLevel
		if (level == 10) {
			level = 9
		}
		if (level == 0) {
			level = 1
		}
		this.Items.Panel_reward.Items.BitmapFontLabel_lv.getComponent(Label).string = ("lv." + level)
		this.Items.Panel_next_reward.Items.BitmapFontLabel_lv.getComponent(Label).string = ("lv." + (level + 1))
		this.updateRewardList(this.mRewardList, level)
		this.updateRewardList(this.mNextRewardList, level + 1)
		this.Items.Image_vip.Items.BitmapFontLabel_lv.getComponent(Label).string = ("lv." + level)
		this.Items.Image_vip.Items.BitmapFontLabel_next_lv.getComponent(Label).string = ("lv." + (level + 1))
	}
	updateRewardList(list, level) {
		let typeName = []
		typeName[0] = fw.language.get("CASH")
		typeName[1] = fw.language.get("BONUS")
		typeName[2] = fw.language.get("CASH")

		let rewardBaseList = this.mScratchcardInfo.rewardBaseList
		for (let i = 0; i < 7; i++) {
			let item = list[i + 1]
			let data = rewardBaseList[i]
			if (!data) {
				item.active = false
			} else {
				item.active = true
				let rewardType = data.rewardType
				let rewardIndex = data.rewardIndex
				let range = data.range
				let path = fw.BundleConfig.plaza.res["scratchCard/img/SC_icon_" + rewardType + "_" + rewardIndex + "/spriteFrame"]
				item.Items.Text_reward_type.string = typeName[rewardType] ? typeName[rewardType] : ""
				item.Items.Image_reward_icon.loadBundleRes(path,(res: SpriteFrame) => {
					item.Items.Image_reward_icon.obtainComponent(Sprite).spriteFrame = res
				})
				if (range[0] == range[1]) {
					item.Items.Text_reward_num.getComponent(Label).string = (range[0] / DF_RATE * level)
				} else {
					item.Items.Text_reward_num.getComponent(Label).string = (range[0] / DF_RATE * level + "~" + range[1] / DF_RATE * level)
				}
			}
		}
	}
	onAddCashClick() {
		if (this.mScratchcardData.nRecharge < this.mScratchcardData.nActiveRecharge) {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`shop/shop_main`],
				data: {
					minPay: this.mScratchcardData.nActiveRecharge - this.mScratchcardData.nRecharge
				},
			});
		} else {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`shop/shop_main`]
			});
		}
	}
}
