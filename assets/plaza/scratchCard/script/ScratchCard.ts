import { Button, Camera, Canvas, EventTouch, IVec2Like, ImageAsset, RenderTexture, Texture2D, Vec3, director } from 'cc';
import { Graphics } from 'cc';
import { Label } from 'cc';
import { Color } from 'cc';
import { v3 } from 'cc';
import { Sprite } from 'cc';
import { SpriteFrame } from 'cc';
import { tween } from 'cc';
import { ProgressBar } from 'cc';
import { Vec2 } from 'cc';
import { Rect } from 'cc';
import { Mask } from 'cc';
import { UITransform, _decorator, Node as ccNode, Animation } from 'cc';
import { DF_RATE } from '../../../app/config/ConstantConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
import { EventParam } from '../../../app/framework/manager/FWEventManager';
import { PolyBoolComponent } from './PolyBool';
const { ccclass, property } = _decorator;

const ScratchCardDataKey = "scratchCardData"
const OPEN_RELOAD = true // 是否开启存储功能 检验不要开启
@ccclass('ScratchCard')
export class ScratchCard extends FWDialogViewBase {
	mScratchcardData: any;
	mScratchcardInfo: any;
	mScratchPosTab: IVec2Like[];
	mSendScratchcardAwarding: boolean;
	mRewardList: {};
	mOpenRewardList: {};
	mOpenRewardBgList: {};
	mEndTime: any;
	mCountDownAction;
	mScratchCanvaDraw: PolyBoolComponent;
	mScratchPosTabLen: number;
	maskRenderTexture: RenderTexture;
	prePos: Vec3;

	initData() {
		this.mScratchcardData = center.scratchCard.getScratchcardData()
		this.mScratchcardInfo = center.scratchCard.getScratchcardInfo()
		this.mScratchPosTab = []
		this.mScratchPosTabLen = 0
		this.mSendScratchcardAwarding = false //// 是否正在领奖
	}
	protected initView(): boolean | void {
		//初始化奖励列表
		this.mRewardList = []
		// let dfItem = this.Items.Panel_reward_item
		// this.Items.Panel_reward_item.active = false
		let dfW = 156
		for (let i = 1; i <= 7; i++) {
			// let item = dfItem.clone()
			// this.Items.Panel_reward_list.addChild(item)
			// item.setPosition((i - 1) * dfW + dfW / 2, 65)
			this.mRewardList[i] = this.Items["Panel_reward_item_"+i]
		}
		//初始化开奖列表
		this.mOpenRewardList = {}
		this.mOpenRewardBgList = {}
		let dfItem = this.Items.Panel_open_reward_item
		this.Items.Panel_open_reward_item.active = false
		let dfItemBg = this.Items.Panel_open_reward_item_bg
		this.Items.Panel_open_reward_item_bg.active = false
		dfW = 133.5
		for (let i = 1; i <= 3; i++) {
			let itemBg = dfItemBg.clone()
			this.Items.Panel_open_reward.addChild(itemBg)
			itemBg.setPosition((i - 1) * dfW + -133.5, 0)
			this.mOpenRewardBgList[i] = itemBg
		}
		for (let i = 1; i <= 3; i++) {
			let item = dfItem.clone()
			this.Items.Panel_open_reward.addChild(item)
			item.setPosition((i - 1) * dfW + -133.5, 0)
			item.Items.Text_empty.string = fw.language.get("Empty")
			this.mOpenRewardList[i] = item
		}

		this.Items.OpenScratchCard.active = false
		this.Items.GuideScratch.active = false
		this.Items.GuideOpen.active = false
		this.Items.marknodelayout.active = false
		this.mScratchCanvaDraw = this.Items.drawnode.getComponent(PolyBoolComponent);
		//监听触摸事件
		this.Items.marknodelayout.on(ccNode.EventType.TOUCH_START, this.onTouchStart, this);
		this.Items.marknodelayout.on(ccNode.EventType.TOUCH_MOVE, this.onTouchMove, this);
		this.Items.marknodelayout.on(ccNode.EventType.TOUCH_END, this.onTouchEnd, this);
		this.Items.marknodelayout.on(ccNode.EventType.TOUCH_CANCEL, this.onTouchEnd, this);

		this.Items.Text_tips.string = fw.language.get("Login every day can get rewards")
		this.Items.Text_recharge_dec.string = fw.language.get("Recharge to activate 30 cards")
	}
	protected initBtns(): boolean | void {
		this.Items.Image_close.onClickAndScale((this.onClickClose.bind(this)));
		this.Items.Image_card_box.onClickAndScale((this.onOpenScratchcardClick.bind(this)));
		this.Items.Image_boost_reward_btn.onClickAndScale((this.onBoostRewardClick.bind(this)));
		this.Items.Image_add_btn.onClickAndScale((this.onAddCashClick.bind(this)));

		this.updateScratchcardStatus()
		this.updateScratchcardNum()
	}

	protected initEvents(): boolean | void {
		this.bindEvent(EventParam.FWBindEventParam("ScratchcardOpen", this.openScratchCard.bind(this)));
		this.bindEvent(EventParam.FWBindEventParam("ScratchcardAward", this.onScratchcardAward.bind(this)));
		this.bindEvent(EventParam.FWBindEventParam("ScratchcardLevelChange", this.onScratchcardLevelChange.bind(this)));
		this.bindEvent(EventParam.FWBindEventParam("ScratchcardRechargeChange", this.onScratchcardRechargeChange.bind(this)));
		this.bindEvent(EventParam.FWBindEventParam("ScratchcardActive", this.updateScratchcardStatus.bind(this)));
	}

	onScratchcardOpen() {
		this.clearCacheFile();
		this.Items.Image_card_box.obtainComponent(Button).enabled = false;
		this.Items.Panel_open_reward.obtainComponent(Button).enabled = true;
		this.Items.Text_tips.active = false;
		this.stopCountDown();
		this.Items.marknodelayout.active = true;
		this.updateScratchcardNum();
		this.updateRewardList(this.mScratchcardData.nAwardLevel);
		this.updateOpenRewardList(this.mScratchcardData.nAwardLevel, this.mScratchcardData.awardItem);
		this.resetCheckScratchPosTab();
		this.reloadScratchcard();
		this.addScratchCardGuide();
	}


	playScratchcardAwardAnim() {
		for (let i = 1; i <= 3; i++) {
			let item = this.mOpenRewardList[i]
			tween(item)
				.repeat(2,
					tween(item)
						.to(0.2, { scale: v3(1.1, 1.1, 1) })
						.to(0.2, { scale: v3(1, 1, 1) })
				)
				.start();
		}
	}
	onScratchcardAward() {
		this.Items.Panel_open_reward.obtainComponent(Button).enabled = false
		this.Items.marknodelayout.active = false
		tween(this.Items.Panel_open_reward)
			.call(this.playScratchcardAwardAnim.bind(this))
			.delay(1.5)
			.call(this.__onScratchcardAward.bind(this))
			.start();
	}
	__onScratchcardAward() {
		this.mSendScratchcardAwarding = false
		this.clearCacheFile()
		this.updateScratchcardStatus()
		let goodData = []
		for (let i = 1; i <= 3; i++) {
			let data = this.mScratchcardData.awardItem[i - 1]
			if (data) {
				let rewardType = data.type
				let amount = data.amount
				let rewardIndex = center.scratchCard.getScratchCardRewardIndexByAmount(this.mScratchcardData.nAwardLevel, amount)
				if (amount > 0) {
					let path = fw.BundleConfig.plaza.res["scratchCard/img/SC_icon_" + rewardType + "_" + rewardIndex + "/spriteFrame"]
					goodData.push({
						bundleResConfig: path,
						nGoodsNum: amount / DF_RATE,
					})
				}
			}
		}
		let extData = {bDontShowTitle:true}
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.resources.res[`ui/reward/reward`],
			data: { reward: goodData, extend: extData},
		});

		this.updateScratchcardNum()
	}
	onScratchcardLevelChange() {
		if (this.mScratchcardData.nDayCount == 0) {
			this.updateRewardList(this.mScratchcardData.nLevel)
		} else if (this.mScratchcardData.nDrawStatus == 1) {
		} else {
			this.updateRewardList(this.mScratchcardData.nLevel)
		}
	}
	onScratchcardRechargeChange() {
		this.updateRecharge()
	}
	updateRecharge() {
		this.Items.LoadingBar_recharge.getComponent(ProgressBar).progress = this.mScratchcardData.nRecharge / this.mScratchcardData.nActiveRecharge
		this.Items.Text_recharge.getComponent(Label).string = this.mScratchcardData.nRecharge + '/' + this.mScratchcardData.nActiveRecharge
	}

	clearCacheFile() {
		app.file.setStringForKey(ScratchCardDataKey,"{}")
	}

	updateScratchcardStatus() {
		if (this.mScratchcardData.nRecharge < this.mScratchcardData.nActiveRecharge) {
			this.clearCacheFile()
			this.Items.Image_card_box.obtainComponent(Button).enabled = false
			this.Items.Panel_open_reward.obtainComponent(Button).enabled = false
			this.Items.Text_tips.active = false
			this.Items.Image_recharge_limit.active = true
			this.stopCountDown()
			this.Items.marknodelayout.active = false
			this.updateRewardList(this.mScratchcardData.nLevel)
			this.updateOpenRewardList(this.mScratchcardData.nAwardLevel, this.mScratchcardData.awardItem)
			this.updateRecharge()
		} else if (this.mScratchcardData.nDrawStatus == 1) {
			this.Items.Image_card_box.obtainComponent(Button).enabled = false
			this.Items.Panel_open_reward.obtainComponent(Button).enabled = true
			this.Items.Text_tips.active = false
			this.Items.Image_recharge_limit.active = false
			this.stopCountDown()
			this.Items.marknodelayout.active = true
			this.updateRewardList(this.mScratchcardData.nAwardLevel)
			this.updateOpenRewardList(this.mScratchcardData.nAwardLevel, this.mScratchcardData.awardItem)

			let content = app.file.getStringForKey(ScratchCardDataKey,"{}");
			let data:ScratchcardData = JSON.safeParse(content);
			if( OPEN_RELOAD && data && data.posTab && data.regions ) {
				this.resetCheckScratchPosTab(data.posTab)
				this.reloadScratchcard(data.regions)
				this.checkScratchProgress()
			}else {
				this.addScratchCardGuide()
				this.resetCheckScratchPosTab()
				this.reloadScratchcard()
			}

		} else if (this.mScratchcardData.nDayCount == 0) {
			this.clearCacheFile()
			this.Items.Image_card_box.obtainComponent(Button).enabled = true
			this.Items.Panel_open_reward.obtainComponent(Button).enabled = false
			this.Items.Text_tips.active = false
			this.Items.Image_recharge_limit.active = false
			this.stopCountDown()
			this.Items.marknodelayout.active = false
			this.updateRewardList(this.mScratchcardData.nLevel)
			this.updateOpenRewardList(this.mScratchcardData.nAwardLevel, this.mScratchcardData.awardItem)
			this.addOpenGuide()
		} else {
			this.clearCacheFile()
			this.Items.Image_card_box.obtainComponent(Button).enabled = false
			this.Items.Panel_open_reward.obtainComponent(Button).enabled = false
			this.Items.Text_tips.active = true
			this.Items.Image_recharge_limit.active = false
			this.startCountDown()
			this.Items.marknodelayout.active = false
			this.updateRewardList(this.mScratchcardData.nLevel)
			this.updateOpenRewardList(this.mScratchcardData.nAwardLevel, this.mScratchcardData.awardItem)
		}

	}
	updateRewardList(level) {
		let typeName = []
		typeName[0] = fw.language.get("CASH")
		typeName[1] = fw.language.get("BONUS")
		typeName[2] = fw.language.get("CASH")

		if (level == 0) { level = 1 }
		let rewardBaseList = this.mScratchcardInfo.rewardBaseList
		for (let i = 0; i < 7; i++) {
			let item = this.mRewardList[i + 1]
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
					item.Items.Text_reward_num.getComponent(Label).string = range[0] / DF_RATE * level
				} else {
					item.Items.Text_reward_num.getComponent(Label).string = (range[0] / DF_RATE * level) + "~" + (range[1] / DF_RATE * level)
				}
			}
		}
	}
	updateOpenRewardList(level, awardItem) {
		for (let i = 1; i <= 3; i++) {
			let item = this.mOpenRewardList[i]
			let itemBg = this.mOpenRewardBgList[i]
			let data = awardItem[i - 1]
			if (!data) {
				item.active = false
				itemBg.active = false
			} else {
				item.active = true
				itemBg.active = true
				let rewardType = data.type
				let amount = data.amount
				let rewardIndex = center.scratchCard.getScratchCardRewardIndexByAmount(level, amount)
				if (amount > 0) {
					item.Items.Text_open_reward_num.active = true
					item.Items.Image_open_reward_icon.active = true
					item.Items.Text_empty.active = false
					let path = fw.BundleConfig.plaza.res["scratchCard/img/SC_icon_" + rewardType + "_" + rewardIndex + "/spriteFrame"]
					item.Items.Image_open_reward_icon.loadBundleRes(path,(res: SpriteFrame) => {
						item.Items.Image_open_reward_icon.obtainComponent(Sprite).spriteFrame = res
					})
					item.Items.Text_open_reward_num.getComponent(Label).string = 'x' + (amount / DF_RATE)
				} else {
					item.Items.Text_open_reward_num.active = false
					item.Items.Image_open_reward_icon.active = false
					item.Items.Text_empty.active = true
				}
			}
		}
	}

	updateScratchcardNum() {
		let num = this.mScratchcardInfo.nTotalCount - this.mScratchcardData.nTotalCount
		this.Items.card_num.getComponent(Label).string = String(num)
	}

	onOpenScratchcardClick() {
		this.removeOpenGuide()
		if (this.mScratchcardData.nDayCount == 0) {
			center.scratchCard.sendScratchcardOpen()
		} else {
			app.popup.showToast({ text: "You can claim the reward once a day, up to a maximum of 30" })
		}
	}

	onSendScratchcardAward() {
		fw.print("onSendScratchcardAward")
		if (this.mSendScratchcardAwarding) { return }
		this.mSendScratchcardAwarding = true
		center.scratchCard.sendScratchcardAward()
	}

	onBoostRewardClick() {
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`scratchCard/scratchCardBoostReward`]
		});
	}

	onAddCashClick() {
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`shop/shop_main`]
		});
	}

	resetCheckScratchPosTab(data?:IVec2Like[]) {
		if(data) {
			this.mScratchPosTab = data
			this.mScratchPosTabLen = 70;
		} else {
			// 优化划开区域的探测点位置
			let w = 430;
			let h = 174;
			this.mScratchPosTab = [];
			let step = 30;
			for (let x = 40; x < w; x+=step) {
				for (let y = 25; y < h; y+=step) {
					this.mScratchPosTab.push({x:x,y:y})
				}
			}
			this.mScratchPosTabLen = 70;
		}
	}

	reloadScratchcard(regions?:number[][][]) {
		if(this.maskRenderTexture) {
			this.Items.marknode.getComponent(Sprite).spriteFrame = null;
			this.Items.drawnode_Camera.getComponent(Camera).targetTexture = null
			this.maskRenderTexture.destroy()
		}
		this.maskRenderTexture = new RenderTexture()
		this.maskRenderTexture.reset(this.Items.drawnode.getComponent(UITransform).contentSize);
		this.Items.drawnode_Camera.getComponent(Camera).targetTexture = this.maskRenderTexture
		const sp = new SpriteFrame();
		sp.texture = this.maskRenderTexture;
		this.Items.marknode.getComponent(Sprite).spriteFrame = sp;
		// 修复莫名其妙渲染颠倒问题
		this.Items.marknode.active = false;
		this.Items.marknode.active = true;

		if(OPEN_RELOAD && regions) {
			this.mScratchCanvaDraw.setRegions(regions)
		}else {
			this.mScratchCanvaDraw.reset()
		}
	}

	// 点到线段距离
	pointToSegDist(p: IVec2Like, ps: IVec2Like, pe: IVec2Like) {
		let x = p.x;
		let y = p.y;
		let x1 = ps.x;
		let y1 = ps.y;
		let x2 = pe.x;
		let y2 = pe.y;
		let cross = (x2 - x1) * (x - x1) + (y2 - y1) * (y - y1)
		if (cross <= 0) return Math.sqrt((x - x1) * (x - x1) + (y - y1) * (y - y1))

		let d2 = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)
		if (cross >= d2) return Math.sqrt((x - x2) * (x - x2) + (y - y2) * (y - y2))

		let r = cross / d2
		let px = x1 + (x2 - x1) * r
		let py = y1 + (y2 - y1) * r
		return Math.sqrt((x - px) * (x - px) + (py - y) * (py - y))
	}

	scratchCardMove(posS: IVec2Like, posE: IVec2Like) {
		this.mScratchCanvaDraw._touchMove(posS,posE);
		this.mScratchPosTab = this.mScratchPosTab.filter(v => {
			return this.pointToSegDist({x:v.x - 232.5,y:v.y - 118}, posS, posE) > 30;
		})
	}

	onTouchStart(Event: EventTouch) {
		fw.print("onTouchStart")
        let {touch} = Event
        let slocation = touch.getUIPreviousLocation()
        let elocation = touch.getUILocation()
        const spos = this.Items.drawnode.getComponent(UITransform).convertToNodeSpaceAR(fw.v3(slocation.x,slocation.y));
        const epos = this.Items.drawnode.getComponent(UITransform).convertToNodeSpaceAR(fw.v3(elocation.x,elocation.y));
		this.prePos = epos;
		this.scratchCardMove(spos, epos);
		this.removeScratchCardGuide()
	}

    @fw.Decorator.IntervalExecution(0.060)
	onTouchMove(Event: EventTouch) {
		fw.print("onTouchMove")
        let {touch} = Event
        // let slocation = touch.getUIPreviousLocation()
        let elocation = touch.getUILocation()
        const spos = this.prePos//this.Items.drawnode.getComponent(UITransform).convertToNodeSpaceAR(fw.v3(slocation.x,slocation.y));
        const epos = this.Items.drawnode.getComponent(UITransform).convertToNodeSpaceAR(fw.v3(elocation.x,elocation.y));
		this.prePos = epos;
		this.scratchCardMove(spos, epos);
	}

	onTouchEnd(Event) {
		fw.print("onTouchEnd")
		if(OPEN_RELOAD) {
			let data:ScratchcardData = {
				regions:this.mScratchCanvaDraw.getRegions(),
				posTab:this.mScratchPosTab
			}
			app.file.setStringForKey(ScratchCardDataKey,JSON.stringify(data))
		}
		this.checkScratchProgress()
	}

	checkScratchProgress() {
		let length = this.mScratchPosTab.length
		if (length / this.mScratchPosTabLen <= 0.3) {
			this.onSendScratchcardAward()
		}
	}
	removeOpenGuide() {
		this.Items.GuideOpen.active = false
		let pAni = this.Items.GuideOpen.obtainComponent(Animation);
		pAni.stop();
	}
	removeScratchCardGuide() {
		this.Items.GuideScratch.active = false
		let pAni = this.Items.GuideScratch.obtainComponent(Animation);
		pAni.stop();
	}
	addOpenGuide() {
		this.Items.GuideOpen.active = true
		let pAni = this.Items.GuideOpen.obtainComponent(Animation);
		pAni.play("GuideOpen");
	}
	addScratchCardGuide() {
		this.Items.GuideScratch.active = true
		let pAni = this.Items.GuideScratch.obtainComponent(Animation);
		pAni.play("GuideScratch");
	}
	openScratchCard() {
		this.Items.OpenScratchCard.active = true
		let pAni = this.Items.OpenScratchCard.obtainComponent(Animation);
		pAni.on(Animation.EventType.FINISHED, () => {
			this.Items.OpenScratchCard.active = false
			this.onScratchcardOpen()
		});
		pAni.play("OpenScratchCard");
	}

	startCountDown() {
		let date = new Date()
		let hour = 24 - date.getHours()
		let min = hour * 60 - date.getMinutes()
		let sec = min * 60 - date.getSeconds()
		this.mEndTime = app.func.time() + sec
		this.stopCountDown()
		this.updateTime()
		this.mCountDownAction = this.updateTime.bind(this)
		this.schedule(this.mCountDownAction, 1)
	}
	stopCountDown() {
		if (this.mCountDownAction) {
			this.unschedule(this.mCountDownAction);
			this.mCountDownAction = null;
		}
	}
	updateTime() {
		let time = this.mEndTime - app.func.time()
		if (time <= 0) {
			this.stopCountDown()
			center.scratchCard.checkRefreshScratchCard()
			this.updateScratchcardStatus()
			return
		}
		let nHour = Math.floor(time / 3600);
		let nMin = Math.floor((time - nHour * 3600) / 60);
		let nSecond = time - nHour * 3600 - nMin * 60;
		this.Items.Text_countdown.obtainComponent(Label).string = app.func.formatNumberForZore(nHour) + ":" + app.func.formatNumberForZore(nMin) + ":" + app.func.formatNumberForZore(nSecond)
	}
}

export interface ProgressRectData {
	rect: Rect;
	isHit: boolean;
}


interface ScratchcardData {
	regions:number[][][],
	posTab:IVec2Like[]
}