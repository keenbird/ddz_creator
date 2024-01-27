import { Node as ccNode, UITransform, _decorator, v3,  } from 'cc';
import { plaza_main } from '../../plaza/script/plaza_main';
const { ccclass, property } = _decorator;



/**二级界面类型 */
export enum SecondaryType {
	/**游戏二级界面 */
	Game
}

@ccclass('plaza_secondary')
export class plaza_secondary extends (fw.FWComponent) {

	protected doLifeFunc(): void {
	
		this.Items.btn_close.onClickAndScale(() => {
			this.onClickClose()
		});
		//正常逻辑
		super.doLifeFunc();
	}
	initData() {
		
	}
	onClickClose() {
		this.node.removeFromParent(true)
		app.popup.getMain().getComponent("plaza_main").setPlazaNodeShowup(true)
	}
	protected initView(): boolean | void {

		
		//适配
		this.fitSceneNode();
		
	}
	protected fitSceneNode(){
		if(app.isIphoneX){
			this.scheduleOnce(()=>{
				// this.Items.Node_activitys.setPosition(v3(this.Items.Node_activitys.getPosition().x+66,this.Items.Node_activitys.getPosition().y,1))
		
			},0)
			}
	}
	protected initBtns(): boolean | void {
		
	}
	protected initEvents(): boolean | void {
		//返回键事件
		this.bindEvent({
			eventName: app.event.CommonEvent.Keyback,
			callback: () => {
				//未显示时，不处理
				if (!this.node.activeInHierarchy) {
					return true;
				}
				
			}
		});
		
	}
	onViewEnter() {
		
	}

	
	/**处理进大厅弹框逻辑 */
	async onEnterProcess() {
		let view = app.popup.showLoading({ nAutoOutTime: 10 });
		while (true) {
			let nBuffNum = center.user.getBuffNum()
			//ios 审核不走登录弹窗
			if (app.sdk.isIosDev()) {
				if (nBuffNum == 1 && center.taskActive.isCanPopupSignSevenActiveFromLogin()) {
					center.taskActive.savePopupSignSevenActiveFromLogin()
					//ios签到
				}
				break
			}
			// 检测是否跨天
			center.scratchCard.checkRefreshScratchCard()
			if (this.mIsFromLogin) {
				center.roomList.sendGetBaiRenWinMaxInfo()
			}
			// 注册登录流程
			if (this.mIsFromLogin && this.mCheckRegLogin) {

				// if (app.sdk.isSdkOpen("sharepopup")) {
				// 	app.popup.showDialog({
				// 		viewConfig: fw.BundleConfig.plaza.res[`freeBoonus/freeBoonusLeoNewLayer`]
				// 	});
				// } else {
				// 	if (center.task.isFreeBonusOpen()) {
				// 		app.popup.showDialog({
				// 			viewConfig: fw.BundleConfig.plaza.res[`freeBoonus/freeBoonusLayer`],
				// 		});
				// 	}
				// }


				//  弹一次10日任务 
				// if (center.task.isShowTenDayTask(false)) {
				// 	app.popup.showDialog({
				// 		viewConfig: fw.BundleConfig.plaza.res[`tenDayTask/TenDayTask`],
				// 	});
				// }


				// let nBuffNum = center.user.getBuffNum()
				// if (nBuffNum > 1) {
				// 	if (center.taskActive.isMultiopenSevenRewardActiveFromLogin()) {
				// 		app.popup.showDialog({
				// 			viewConfig: fw.BundleConfig.plaza.res[`siginboradLuck/siginboradLuck`],
				// 		});
				// 	}
				// } else {
				// 	if (center.taskActive.isCanPopupSignSevenActiveFromLogin()) {
				// 		center.taskActive.savePopupSignSevenActiveFromLogin()
				// 		if (await app.dynamicActivity.showStandardActivity(`Siginborad`)) {
				// 			app.popup.showDialog({
				// 				viewConfig: fw.BundleConfig.Siginborad.res[`ui/siginborad/siginborad_panel`],
				// 			});
				// 		}
				// 	}
				// }

				// // 提现引导
				// app.popup.showDialog({
				// 	viewConfig: fw.BundleConfig.plaza.res[`withdraw/withdraw_plaza_guide`],
				// });

			} else if (this.mIsFromLogin) {
				// 正常登录流程
				// center.user.popGift(false, true, false)

				// let runningNotice = center.activity.getRunningNoticeList()
				// if (this.mIsFromLogin && runningNotice.length > 0) {
				// 	let entity = runningNotice[0]
				// 	if (entity.content != "") {
				// 		if (center.activity.getNoticeMessagePopNum(entity.nrid) < 5) {
				// 			center.activity.addNoticeMessagePopNum(entity.nrid)
				// 			center.activity.setOneInfoItemHaveRead(entity.nrid)
				// 			center.activity.notifyUnReadNum()
				// 			let content = entity.content
				// 			app.popup.showDialog({
				// 				viewConfig: fw.BundleConfig.plaza.res[`notice/notice_dialog`],
				// 				callback: (view, dataEx) => {
				// 					(<plaza_noticeDialog>(view.getComponent(`NoticeDialog`))).data = content
				// 				}
				// 			});
				// 		}
				// 	}
				// }

				// if (app.sdk.isSdkOpen("sharepopup")) {
				// 	app.popup.showDialog({
				// 		viewConfig: fw.BundleConfig.plaza.res[`freeBoonus/freeBoonusLeoNewLayer`]
				// 	});
				// } else {
				// 	if (center.task.isFreeBonusOpen()) {
				// 		let lastLoginTime = app.file.getIntegerForKey("lastLoginTime", 0)
				// 		let nowTiem = app.func.time()
				// 		let cDateCurrectTime = new Date()
				// 		let cDateTodayTime = new Date(js.formatStr("%s-%s-%s", cDateCurrectTime.getFullYear(), cDateCurrectTime.getMonth(), cDateCurrectTime.getDate())).getTime()
				// 		let isTodayFirstLogin = false
				// 		if (cDateTodayTime >= lastLoginTime) {
				// 			isTodayFirstLogin = true
				// 		}
				// 		app.file.setIntegerForKey("lastLoginTime", nowTiem)
				// 		if (isTodayFirstLogin && !this.mCheckRegLogin) {
				// 			app.popup.showDialog({
				// 				viewConfig: fw.BundleConfig.plaza.res[`freeBoonus/freeBoonusLayer`],
				// 			});
				// 		} else if (center.share.isFreeCashOpen()) {
				// 			this.showFreeCashPop()
				// 		}

				// 	} else if (center.share.isFreeCashOpen()) {
				// 		this.showFreeCashPop()
				// 	}
				// }

				// await center.luckyCard.showVipCardView() //周卡 月卡功能

				// // 激活且可领取
				// if (center.scratchCard.isActive() && center.scratchCard.canGetScratchcardReward()) {
				// 	await this.showScratchCardPop()
				// }


				// //  弹一次10日任务 
				// if (center.task.isShowTenDayTask(false)) {
				// 	app.popup.showDialog({
				// 		viewConfig: fw.BundleConfig.plaza.res[`tenDayTask/TenDayTask`],
				// 	});
				// }


				// let nBuffNum = center.user.getBuffNum()
				// if (nBuffNum > 1) {
				// 	if (center.taskActive.isMultiopenSevenRewardActiveFromLogin()) {
				// 		app.popup.showDialog({
				// 			viewConfig: fw.BundleConfig.plaza.res[`siginboradLuck/siginboradLuck`],
				// 		});
				// 	}
				// } else {
				// 	if (center.taskActive.isCanPopupSignSevenActiveFromLogin()) {
				// 		center.taskActive.savePopupSignSevenActiveFromLogin()
				// 		if (await app.dynamicActivity.showStandardActivity(`Siginborad`)) {
				// 			app.popup.showDialog({
				// 				viewConfig: fw.BundleConfig.Siginborad.res[`ui/siginborad/siginborad_panel`],
				// 			});
				// 		}
				// 	}
				// }

			} else {
				// let withdrawGuideGame = center.user.checkWithdrawGuide()
				// if (withdrawGuideGame) {
				// 	// 提现引导
				// 	app.popup.showDialog({
				// 		viewConfig: fw.BundleConfig.plaza.res[`withdraw/withdraw_plaza_guide`],
				// 		data: {
				// 			withdrawGuideGame: true,
				// 		}
				// 	});
				// } else {
				// 	center.user.popGift(true, false, false);

				// 	// 破产弹窗
				// 	if (center.task.isCanGetSubsydy()) {
				// 		app.popup.showDialog({
				// 			viewConfig: fw.BundleConfig.plaza.res[`bankruptcy/bankruptcy`],
				// 		});
				// 	}

				// 	//  弹一次10日任务 
				// 	if (center.task.isShowTenDayTask(false)) {
				// 		app.popup.showDialog({
				// 			viewConfig: fw.BundleConfig.plaza.res[`tenDayTask/TenDayTask`],
				// 		});
				// 	}
				// }
			}
			this.mIsFromLogin = false
			break
		}
		app.popup.closeLoading(view);
	}

	onViewDestroy() {
		super.onViewDestroy();
		
	}
}

