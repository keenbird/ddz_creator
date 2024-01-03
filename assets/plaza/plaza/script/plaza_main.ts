import { instantiate, Prefab, ScrollView, Node as ccNode, UITransform, _decorator, v3, sp, size, Layout, Label, js, SpriteFrame, Sprite, Widget } from 'cc';
const { ccclass, property } = _decorator;

import proto from '../../../app/center/common';
import { PlazaGameConfig } from './plaza_game_config';
import { ACTOR } from '../../../app/config/cmd/ActorCMD';
import { EVENT_ID } from '../../../app/config/EventConfig';
import { DF_RATE } from '../../../app/config/ConstantConfig';
import { bubble } from '../../../resources/ui/bubble/script/bubble';

/**二级界面类型 */
export enum SecondaryType {
	/**游戏二级界面 */
	Game
}

@ccclass('plaza_main')
export class plaza_main extends (fw.FWComponent) {
	/**二级界面 */
	secondaryView: ccNode
	rechargeProtect_anim_uuid: string
	mIsFromLogin: any;
	loginCashTimer: number;

	@property(Prefab)
	gameItemsBase: Prefab;
	@property(Prefab)
	gameSpecialItemsBase: Prefab;
	mCheckRegLogin: boolean; // 是否是注册登录
	guideNode: ccNode;//新手引导节点

	protected doLifeFunc(): void {
		//缓存大厅，不清理
		app.runtime.permanentView.set(this.node, true);
		app.runtime.plaza = this.node;
		//测试
		this.Items.Button_test_001.onClickAndScale(() => {
			fw.scene.changeScene(fw.SceneConfigs.login);
		});
		var intentData: IntentParam = {}
		this.Items.Button_test_002.onClickAndScale(() => {
			app.gameManager.gotoGame(`Landlord`, {
                nServerID: 0,
            });
			intentData.bCleanAllView = true
			intentData.callback = (err, scene) => {
				app.popup.showMain({
					viewConfig: fw.BundleConfig.Landlord.res[`ui/main/main`],
				});
			}
			fw.scene.changeScene(fw.SceneConfigs.Landlord,intentData);
			center.login.loginWeChat(false)
		});
		//正常逻辑
		// super.doLifeFunc();
	}
	initData() {
		
	}
	protected initView(): boolean | void {
		//缓存大厅，不清理
		app.runtime.permanentView.set(this.node, true);
		app.runtime.plaza = this.node;
		//多语言
		this.initLanguage();
		//更新玩家信息
		this.updatePlayerInfo();
		//运营活动
		this.updateActivitys();
		//刷新游戏
		this.updateGames();
		//刷新特殊游戏
		this.updateSpecialGame();
	}
	protected initBtns(): boolean | void {
		//AddCash
		this.initBtnAddCash();
		//分享
		this.initBtnShare();
		//vipGift
		this.initBtnVipGift();
		//freeCash
		this.initBtnFreeCash();
		//充值保护
		this.initBtnRechargeProtect();
		//客服
		this.initBtnService();
		//邮件
		this.initBtnEmail();
		//活动
		this.initBtnActivity();
		//更多（箭头）
		this.initArrowBtn();
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
				app.popup.showTip({
					title: fw.language.get(`Tip`),
					text: fw.language.get(`Do you really want to quit the game?`),
					btnList: [
						{
							styleId: 1,
							text: fw.language.get(`Ok`),
							callback: () => {
								//断开连接
								center.login.closeConnect();
								//切换到登录
								fw.scene.changeScene(fw.SceneConfigs.login);
							}
						},
						{
							styleId: 2,
							text: fw.language.get(`Earn money`),
						},
					]
				});
			}
		});
		//键事件
		this.bindEvent({
			eventName: app.event.CommonEvent.Keyboard,
			callback: (data) => {
				//未显示时，不处理
				if (!this.node.activeInHierarchy) {
					return true;
				}
				if (data.eventData.keyCode == app.event.CommonKey.Space) {
					let lastEnterRoomData: proto.plaza_room.Igs_room_get_serverid_c;
					lastEnterRoomData = JSON.safeParse(app.file.getStringForKey("LastEnterRoomData", ``, { all: true }));
					if (lastEnterRoomData) {
						center.roomList.sendGetRoomServerId(lastEnterRoomData.kind_id);
					}
				} else {
					return true;
				}
			}
		});
		this.bindEvent({
			eventName: EVENT_ID.EVENT_GETFREEBONUSTIPS,
			callback: (data) => {
				//未显示时，不处理
				if (!this.node.activeInHierarchy) {
					return;
				}
				data.dict.extend = { bDontShowTitle: true }
				app.popup.showDialog({
					viewConfig: fw.BundleConfig.resources.res[`ui/reward/reward`],
					data: data.dict,
				});
			}
		});

		this.bindEvent({
			eventName: EVENT_ID.EVENT_ROOM_KIND_ID_CHANGE,
			callback: (data) => {
				//未显示时，不处理
				if (!this.node.activeInHierarchy) {
					return;
				}
				//刷新游戏
				this.updateGames();
				//刷新特殊游戏
				this.updateSpecialGame();
			}
		});
	}
	onViewEnter() {
		this.mIsFromLogin = false
		if (app.runtime.lastSceneType == fw.SceneConfigs.login.sceneName) {
			this.mIsFromLogin = true;
		}

		this.mCheckRegLogin = center.login.checkRegLogin();

		if (app.runtime.lastSceneType != fw.SceneConfigs.plaza.sceneName) {
			// this.onEnterProcess()
		}
		//刷新特殊游戏 新手引导没了不需要了
		// this.updateSpecialGame();
		//请求历史单笔最大充值金额
		center.giftBag.getMaxPaymentHis();
	}
	initLanguage() {
		
	}
	/**更多（箭头） */
	initArrowBtn() {
		let content = this.Items.content;
		let scrollView = this.Items.ScrollView;
		let scrollCom = scrollView.obtainComponent(ScrollView);
		scrollView.on(ScrollView.EventType.SCROLLING, () => {
			this.Items.Node_arrow.active = content.position.x > 50 - (content.size.width - scrollView.size.width);
		});
		this.Items.Node_arrow_touch.onClick(() => {
			scrollCom.scrollToOffset(fw.v2(Math.abs(content.position.x) + 200, Math.abs(content.position.y)), 0.5);
		});
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
	showFreeCashPop() {
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`freeCash/freeCash`],
		});
	}

	showScratchCardPop() {
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`scratchCard/scratchCard`],
		});
	}

	isPlazaRoomOpen(data: OnePlazaGameConfigParam) {
		let isKindIDOpen = v => {
			return center.roomList.isKindIDOpen(v)
		}
		if (data.combine) {
			let kindIDArray = center.roomList.getKindsByCombineID(data.combine)
			if (kindIDArray.some(isKindIDOpen))
				return true;
		}
		if (data.kindIdName) {
			return center.roomList.isKindIDOpen(center.roomList.KIND_ID[data.kindIdName])
		}
		return false;
	}

	/**刷新大厅特殊游戏入口 */
	updateSpecialGame(data?: OnePlazaGameConfigParam, prefab?: Prefab) {
		data ??= PlazaGameConfig.FruitMachineBig;
		prefab ??= this.gameSpecialItemsBase;
		this.Items.Node_special.removeAllChildren(true);
		if (!this.isPlazaRoomOpen(data)) {
			this.Items.ScrollView.getComponent(Widget).left = 150
			return
		}
		this.Items.ScrollView.getComponent(Widget).left = 400;
		let item = instantiate(prefab);
		//保存数据

		// 新注册用户去掉大厅中slot的引导手指
		// if (this.mCheckRegLogin && !fw.isValid(this.guideNode)) {
		// 	this.node.loadBundleRes(fw.BundleConfig.resources.res[`ui/guide/guide_hand_2`],(res: Prefab) => {
		// 		// 异步原因可能存在多次回调
		// 		if (!fw.isValid(this.guideNode)) {
		// 			let node = instantiate(res);
		// 			this.guideNode = node
		// 			this.Items.Node_guide_main.addChild(node);
		// 			node.setWorldPosition(this.Items.Node_special.getWorldPosition().add3f(120, -200, 0));
		// 		}
		// 	});
		// }
		//按钮回调
		item.onClickAndScale(() => {
			if (fw.isValid(this.guideNode)) {
				this.guideNode.removeFromParent(true)
				this.guideNode = null;
			}
			this.onClickGame(data);
		});
	}
	/**刷新大厅游戏入口 */
	updateGames() {
		let { smallGame, bigGame } = this.normalGames();
		// 大入口
		if (this.gameSpecialItemsBase) {
			let showData = bigGame.filter(this.isPlazaRoomOpen.bind(this))
			let index = 0;
			let childs = this.Items.content_big.children;
			showData.forEach(element => {
				let item = childs[index];
				if (!item) {
					item = instantiate(this.gameSpecialItemsBase);
					this.Items.content_big.addChild(item);
				}
				item.active = true;
	
				item.onClickAndScale(() => {
					this.onClickGame(element);
				});
				++index;
			});
			// 隐藏多余的入口
			for (let index = showData.length; index < childs.length; index++) {
				childs[index].active = false;
			}
		}


		this.Items.ScrollView.getComponent(ScrollView).scrollToLeft();
	}
	/**二级界面 */
	updateSecondary(nType: SecondaryType, extend?: UpdateSecondaryExtendParam) {
		let data: UpdateSecondaryParam;
		//初始化数据
		switch (nType) {
			case SecondaryType.Game:
			default:
				data = {
					active: true,
					res: fw.BundleConfig.plaza.res[`plaza/secondary/plaza_secondary`],
					visible: (view: ccNode, bActive?: boolean) => {
						//调整二级界面显隐
						view.active = bActive ??= !view.active;
					},
				}
		}
		//扩展数据
		data.extend = extend;
		//调整界面显隐
		this.addView({
			viewConfig: data.res,
			parent: this.Items.Node_secondary,
			callback: (view, dataEx) => {
				//调整数据
				//调整显示
				data.visible && data.visible(view, data.active);
				//执行回调
				data.callback && data.callback(view, data);
			}
		});
	}
	/**刷新运营按钮排序 */
	updateActivityBtnSort(area: number) {
		let list: ActivityBtnParam[] = [];
		let activityInfoByName = (<any>this).activityInfoByName;
		app.func.traversalObject(activityInfoByName[area], (element: ActivityBtnParam) => {
			if (element.data.activityName != `MoreActivity`) {
				element.btn.active = element.data.bLastActive;
				list.push(element);
			}
		});
		list.sort((a, b) => {
			return a.data.sortIndex - b.data.sortIndex;
		});
		(<any>this).activityShowCur = 0;
		app.func.positiveTraversal(list, (element, index) => {
			//计数可显示的按钮
			element.btn.active && ++(<any>this).activityShowCur;
			//调整显隐
			element.btn.active &&= (area == 1 || (<any>this).activityShowCur <= (<any>this).activityShowMax);
			//调整顺序
			element.btn.setSiblingIndex(index);
		});
		this.updateOneActivityVisible(activityInfoByName[0][`MoreActivity`].data);
		//强制刷新布局
		if (area == 0) {
			this.Items.Node_activitys.Items.Node_content.getComponent(Layout).updateLayout(true);
		} else if (area == 1) {
			this.Items.Node_activitys_all.Items.content.getComponent(Layout).updateLayout(true);
			this.Items.Node_activitys_all.Items.Node_content.getComponent(Layout).updateLayout(true);
		} else {
			//TODO
		}
	}
	/**刷新运营活动按钮显示 */
	updateOneActivityVisible(data: OneActivityParam) {
		//通过类型查找
		let activity: ActivityBtnParam = (<any>this).activityInfoByName[data.area][data.activityName];
		let newShow = data.visible(activity.btn, data);
		if (newShow == data.bLastActive) {
			return;
		}
		//刷新状态
		data.bLastActive = newShow;
		//是否更多
		if (data.activityName == `MoreActivity`) {
			activity.btn.active = newShow;
			return;
		}
		this.updateActivityBtnSort(data.area);
	}
	/**刷新所有运营活动按钮 */
	updateActivitys() {
		//监听刷新活动按钮事件
		if (!(<any>this)._bindUpdateActivityBtnEvent) {
			(<any>this)._bindUpdateActivityBtnEvent = true;
			this.bindEvent({
				eventName: `UpdateActivityBtn`,
				callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam) => {
					let activityName = arg1.data;
					if (activityName) {
						let activity: ActivityBtnParam;
						for (let i = 0; i <= 1; ++i) {
							activity = (<any>this).activityInfoByName[i][activityName];
							activity && this.updateOneActivityVisible(activity.data);
						}
					} else {
						this.updateActivitys();
					}
				},
			});
		}
		//通过活动名称获取活动
		let activity: ActivityInfoByName = (<any>this).activityInfoByName ??= { [0]: {}, [1]: {} };
		//收起父节点
		let parent1 = this.Items.Node_activitys.Items.Node_content;
		//展开父节点
		let parent2 = this.Items.Node_activitys_all.Items.content;
		//清理之前的活动节点
		parent1.removeAllChildren(true);
		parent2.removeAllChildren(true);
		//最大显示活动按钮数量
		(<any>this).activityShowMax ??= 4;
		//当前显示活动按钮数量，包括候选按钮
		(<any>this).activityShowCur ??= 0;
		//新建一个活动按钮
		let nCount = 0;
		let newBtn = (parent: ccNode, element: OneActivityParam) => {
			parent.loadBundleRes(element.icon, (res: Prefab) => {
				let panel = app.func.createPanel({ blank: true });
				panel.size = size(100, 100);
				panel.parent = parent;
				panel.scheduleOnce(() => {
					instantiate(res).parent = panel;
				}, 0.1 * ++nCount);
				//先置为false
				panel.active = false;
				//保存引用
				activity[element.area][element.activityName] = {
					data: element,
					btn: panel,
				};
				//回调
				panel.onClickAndScale(() => {
					element.clickCallback && element.clickCallback(element);
				});
				//初始化回调
				element.callback && element.callback(panel, element);
				//调整显示
				this.updateOneActivityVisible(element);
			});
		}
		//更多回调
		let moreCallback = () => {
			this.Items.Node_activitys.active = !this.Items.Node_activitys.active;
			this.Items.Node_activitys_all.active = !this.Items.Node_activitys.active;
		};
		//根据动态活动数据添加活动入口
		app.dynamicActivity.getDynamicActivityConfigs().forEach(element => {
			app.dynamicActivity.checkUpdate(element, (bSuccess) => {
				if(!this.isValid) return;
				if (bSuccess) {
					//解析数据
					let activityUrlConfig = center.activity.getActivityUrlConfig(element);
					this.loadBundle(fw.BundleConfig[activityUrlConfig.activityName], () => {
						let com = app.dynamicActivity.getDynamicActivityCom(activityUrlConfig.activityName).instance();
						let activityInfo: OneActivityParam = {
							icon: com.getIcon(),
							visible: com.updateVisible.bind(com),
							clickCallback: com.onClickActivity.bind(com),
							activityName: activityUrlConfig.activityName,
							sortIndex: element.sorts ?? 0,
							bLastActive: false,
						};
						newBtn(parent1, Object.assign({ area: 0 }, activityInfo));
						newBtn(parent2, Object.assign({ area: 1 }, activityInfo));
					});
				} else {
					fw.printWarn(`activity update error: ${element.title}`);
				}
			});
		});
		//默认添加一个更多
		newBtn(parent1, Object.assign({ area: 0 }, {
			icon: fw.BundleConfig.plaza.res[`activity/icon/MoreActivity/MoreActivity`],
			visible: () => {
				return (<any>this).activityShowCur > (<any>this).activityShowMax;
			},
			clickCallback: moreCallback,
			activityName: `MoreActivity`,
			sortIndex: ((-1 >>> 0) + 1) / 2,
			bLastActive: false,
		}));
		//触摸隐藏
		app.func.addTouchHide(this.Items.Node_activitys_all, {
			callback: moreCallback
		});
		//固定的MoreActivity
		this.Items.Node_activitys_all.active = false;
		this.Items.Node_moreActivity.onClickAndScale(moreCallback);
	}
	/**刷新玩家信息 */
	updatePlayerInfo() {
		//头像
		app.file.updateHead({
			bAutoShowHide: true,
			node: this.Items.Sprite_head,
			serverPicID: center.user.getActorMD5Face(),
		});
		this.Items.Node_head.onClickAndScale(() => {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`userInfo/userInfo_dialog`]
			});
		});
		this.Items.Sprite_head.bindEvent({
			eventName: `ACTOR_EVENT_${`szMD5FaceFile`}`,
			callback: () => {
				app.file.updateHead({
					node: this.Items.Sprite_head,
					serverPicID: center.user.getActorMD5Face(),
				});
			}
		});
		//id
		this.Items.Label_id.string = `ID: ${center.user.getUserID()}`;
		//名称
		this.Items.Label_name.string = center.user.getActorName();
		this.Items.Label_name.bindEvent({
			eventName: `ACTOR_EVENT_${`szName`}`,
			callback: () => {
				this.Items.Label_name.string = center.user.getActorName();
			}
		});
		//金额
		this.updateGold();
		center.user.event.bindEvent({
			valideTarget: this.node,
			eventName: ACTOR.ACTOR_PROP_GOLD,
			callback: this.updateGold.bind(this)
		});
		let Node_gold = this.Items.Node_gold;
		let pos = Node_gold.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
		center.plaza.setPlazaGoldPos(pos);
		let updateVipLevel = () => {
			this.Items.Sprite_vip.active = false;
			let vipLevel = center.user.getActorVipLevel();
			let bgPath = fw.BundleConfig.plaza.res[js.formatStr("userInfo/img_new/vipNum/%s/spriteFrame", vipLevel)];
			if (bgPath) {
				this.Items.Sprite_vip.loadBundleRes(bgPath, (res: SpriteFrame) => {
					this.Items.Sprite_vip.active = true;
					this.Items.Sprite_vip.obtainComponent(Sprite).spriteFrame = res;
				});
			}
		}
		this.Items.Sprite_vip.bindEvent({
			eventName: [
				EVENT_ID.EVENT_PLAZA_ACTOR_PRIVATE,
				EVENT_ID.EVENT_PLAZA_ACTOR_VARIABLE,
			],
			callback: () => {
				updateVipLevel();
			}
		});
		updateVipLevel();
	}
	/**刷新玩家金币 */
	updateGold() {
		this.Items.Label_gold.getComponent(Label).string = `${center.user.getActorGold() / DF_RATE}`;
	}
	initBtnEmail() {
		this.Items.Node_email.onClickAndScale(() => {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`email/email`]
			});
		});
		let node = this.Items.Node_email.Items.Node_bubble;
		node.active = false;
		let updateEmail = () => {
			let num = center.email.getEmailNoCloseNum();
			let newActive = num > 0;
			let oldActive = node.active;
			if (oldActive != newActive) {
				node.active = newActive;
				let tempBubble = node.getComponent(bubble);
				tempBubble.stopAnim();
				newActive && tempBubble.playAnim();
			}
		}
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_EMAIL_EMAIL_ADD,
				EVENT_ID.EVENT_EMAIL_VIEW_STATE,
				EVENT_ID.EVENT_EMAIL_VIEW_RETURN,
				EVENT_ID.EVENT_EMAIL_TEXT_RETURN,
				EVENT_ID.EVENT_EMAIL_PICK_RETURN,
			],
			callback: updateEmail
		});
		updateEmail();
	}
	initBtnShare() {
		let bShareShow = center.user.isSwitchOpen(`btShareSwitch`);
		let shareNode = this.Items.Sprite_share;
		shareNode.active = bShareShow;
		let shareData = (<any>shareNode).shareData ??= {};
	
	}
	initBtnVipGift() {
		this.Items.vipGift_anim.obtainComponent(sp.Skeleton).setAnimation(0, "animation", true);
		this.Items.Node_vipGift.onClickAndScale(() => {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`vipGift/vipGift_dlg`]
			});
		});
		let updateClaimTips = () => {
			let claim_tips = this.Items.Node_vipGift.Items.claim_tips
			if (!fw.isNull(claim_tips)) {
				let tempBubble = claim_tips.getComponent(bubble);
				let rewardStatus = center.user.getRewardStatus()
				claim_tips.active = rewardStatus
				if (rewardStatus) {
					tempBubble.stopAnim();
					tempBubble.playAnim();
				} else {
					tempBubble.stopAnim();
				}
			}
		}
		updateClaimTips()
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_PLAZA_VIPGIFT_INFO,
			],
			callback: updateClaimTips
		});
	}
	initBtnFreeCash() {
		this.Items.Node_freeCash.onClickAndScale(() => {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`freeCash/freeCash`]
			});
		});
	}
	initBtnRechargeProtect() {
		this.Items.Node_rechargeProtect.active = false
		this.rechargeProtect_anim_uuid = ""

		let initRechargeProtectNode = () => {
			let bOpen = center.mall.isRechargeProtectOpen()
			let child = this.Items.Node_rechargeProtect.getChildByUuid(this.rechargeProtect_anim_uuid)
			if (bOpen && !child) {
				this.Items.Node_rechargeProtect.loadBundleRes(fw.BundleConfig.plaza.res[`shop/rechargeProtectBtn`], (res: Prefab) => {
					let btn = instantiate(res);
					this.Items.Node_rechargeProtect.addChild(btn);
					btn.active = true;
					btn.setPosition(0, 6)
					this.rechargeProtect_anim_uuid = btn.uuid
				});
				this.Items.Node_rechargeProtect.active = true
			}
		}
		let updateFreeCashBtnVisible = () => {
			if (!fw.isNull(this.Items.Node_freeCash)) {
				let child = this.Items.Node_rechargeProtect.getChildByUuid(this.rechargeProtect_anim_uuid)
				if (!child) {
					if (center.share.isFreeCashOpen()) {
						this.Items.Node_freeCash.active = true
					} else {
						this.Items.Node_freeCash.active = false
					}
				}
			}
		}
		let updateRechargeProtect = () => {
			let bOpen = center.mall.isRechargeProtectOpen()
			if (!bOpen) {
				this.Items.Node_rechargeProtect.removeAllChildren(true)
				this.Items.Node_rechargeProtect.active = false
			} else {
				initRechargeProtectNode()
			}
			updateFreeCashBtnVisible()
		}
		let rechargeProtectVisible = (arg1) => {
			let data: proto.plaza_actorprop.IActVariable[] = arg1.dict
			if (data[0].prop_id == ACTOR.ACTOR_PROP_RECHARGE_PROTECT_END_TIME || data[0].prop_id == ACTOR.ACTOR_PROP_RECHARGE_PROTECT_PRIZE) {
				updateRechargeProtect()
			}
		}
		let rechargeProtectReward = (arg1) => {
			if (arg1.data.result == 0) {
				this.Items.Node_rechargeProtect.removeAllChildren(true)
				this.Items.Node_rechargeProtect.active = false
				updateFreeCashBtnVisible()
			}
		}

		initRechargeProtectNode()
		updateFreeCashBtnVisible()

		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_RECHARGE_PROTECT_CFG,
			],
			callback: (arg1, arg2) => { updateRechargeProtect() }
		});
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_PLAZA_ACTOR_VARIABLE,
			],
			callback: (arg1, arg2) => { rechargeProtectVisible(arg1) }
		});
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_RECHARGE_PROTECT_REWARD,
			],
			callback: (arg1, arg2) => { rechargeProtectReward(arg1) }
		});
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_PLAZA_SHARE_OPEN,
				EVENT_ID.EVENT_PLAZA_SHARE_FREECASH_CHANGE,
			],
			callback: (arg1, arg2) => { updateFreeCashBtnVisible() }
		});
	}
	initBtnService() {
		this.Items.Node_service.onClickAndScale(() => {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`service/service_main`]
			});
		});
	}
	initBtnAddCash() {
		let goMall = () => {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`shop/shop_main`]
			});
			center.user.popGift(false, false, true)
		}
		this.Items.Sprite_addCash.onClickAndScale(() => {
			goMall()
		});

		let upDateRate = () => {
			let mallLimitConfig = center.mall.mallLimitConfig;
			let nCashList = mallLimitConfig.num.list;
			let mMShopRate = 0
			for (let k = 0; k < nCashList.length; k++) {
				let v = nCashList[k];
				let nRate = center.luckyCard.getFirstRechrgeRatio(v)
				let notShowBonusReward = center.luckyCard.getShowBonusRewardStatus()
				if (nRate.index > -1 && center.user.isFirstCashVaild(nRate.index) && nRate.ratio > mMShopRate && !notShowBonusReward) {
					mMShopRate = app.func.numberAccuracy(nRate.ratio)
				}
			}

			let mMMegaGiftRate = 0
			if (center.user.canShowMegaGift()) {
				mMMegaGiftRate = app.func.numberAccuracy(center.luckyCard.getMegaGiftRate() * 100)
			}

			let rate = mMMegaGiftRate > mMShopRate ? mMMegaGiftRate : mMShopRate
			this.Items.Label_add_rate.string = `+\n${rate}%`
			this.Items.Sprite_add_rate.active = rate > 0
		}
		upDateRate()

		this.Items.Sprite_addCash.bindEvent({
			eventName: [
				EVENT_ID.EVENT_PLAZA_ACTOR_VARIABLE,
				EVENT_ID.EVENT_MEGAGIFT_BUY_RESULT,
				EVENT_ID.EVENT_PLAZA_FIRSTRECHRGE_LASTTIME,
			],
			callback: () => {
				upDateRate();
			}
		});
	}
	initBtnActivity() {
		this.Items.Node_activity.onClickAndScale(() => {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`activity/activity`]
			});
		});
	}
	onClickGame(data: OnePlazaGameConfigParam) {
		if (data.kindIdName) {
			if(data.kindIdName == "Crash") {
				center.roomList.sendGetCrashRoomServerId()
			} else {
				center.roomList.sendGetRoomServerId(center.roomList.KIND_ID[data.kindIdName]);
			}
		} else if (data.iconName == "MoreGame") {
			app.popup.showToast({ text: fw.language.get("The game is under development, please wait") })
		} else {
			this.updateSecondary(SecondaryType.Game, { plazaGameConfig: data });
		}
	}
	normalGames(): { smallGame: OnePlazaGameConfigParam[], bigGame: OnePlazaGameConfigParam[] } {
		return {
			smallGame: [
				// PlazaGameConfig.ExplorerSlots,
				// PlazaGameConfig.FruitMachine,
			],
			bigGame: [
			]
		};
	}
	onViewDestroy() {
		super.onViewDestroy();
		
	}
}

/**声明全局调用 */
declare global {
	namespace globalThis {
		type ActivityBtnParam = {
			btn: ccNode,
			data: OneActivityParam
		}
		type ActivityInfoByName = {
			[area: number]: {
				[activityName: string]: ActivityBtnParam
			}
		}
		type OneActivityParam = {
			/**显示位置（0左侧收起，1左侧展开） */
			area?: number
			/**活动名称 */
			activityName: string
			/**图标预制资源 */
			icon: BundleResConfig
			/**上次显示状态 */
			bLastActive?: boolean
			/**显隐条件 */
			visible: (btn: ccNode, data: OneActivityParam) => boolean
			/**初始化 */
			callback?: (btn: ccNode, data: OneActivityParam) => void
			/**点击回调 */
			clickCallback: (data: OneActivityParam) => void
			/**排序值 */
			sortIndex?: number
		}
		type UpdateSecondaryParam = {
			/**显隐 */
			active?: boolean
			/**二级界面 */
			res: BundleResConfig
			/**显隐回调 */
			visible: (view: ccNode, bActive?: boolean) => void
			/**初始化回调 */
			callback?: (view: ccNode, data: UpdateSecondaryParam) => void
			/**扩展数据 */
			extend?: UpdateSecondaryExtendParam
		}
		/**扩展数据（由二级界面类型决定） */
		type UpdateSecondaryExtendParam = {
			/**大厅游戏配置 */
			plazaGameConfig?: OnePlazaGameConfigParam
		}
	}
}
