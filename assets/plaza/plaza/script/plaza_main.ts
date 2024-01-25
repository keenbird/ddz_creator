import { instantiate, Prefab, ScrollView, Node as ccNode, UITransform, _decorator, v3, sp, size, Layout, Label, js, SpriteFrame, Sprite, Widget } from 'cc';
const { ccclass, property } = _decorator;

import proto from '../../../app/center/common';
import { PlazaGameConfig } from './plaza_game_config';
import { ACTOR, PROTO_ACTOR } from '../../../app/config/cmd/ActorCMD';
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
		// this.Items.Button_test_001.onClickAndScale(() => {
		// 	fw.scene.changeScene(fw.SceneConfigs.login);
		// });
		var intentData: IntentParam = {}
		this.Items.Button_test_002.onClickAndScale(() => {
			// app.gameManager.gotoGame(`Landlord`, 1);
			
			center.game.room.sendBEFORE_MATCH_REQ(10101)
			// intentData.bCleanAllView = true
			// intentData.callback = (err, scene) => {
			// 	app.popup.showMain({
			// 		viewConfig: fw.BundleConfig.Landlord.res[`ui/main/main`],
			// 	});
			// }
			// fw.scene.changeScene(fw.SceneConfigs.Landlord,intentData);
		});
		//正常逻辑
		super.doLifeFunc();
	}
	initData() {
		
	}
	protected initView(): boolean | void {
		//缓存大厅，不清理
		app.runtime.permanentView.set(this.node, true);
		app.runtime.plaza = this.node;
		
		//适配
		this.fitSceneNode();
		//更新玩家信息
		this.updatePlayerInfo();
		//运营活动
		// this.updateActivitys();
		//刷新游戏
		// this.updateGames();
		//刷新特殊游戏
		// this.updateSpecialGame();
		
	}
	protected fitSceneNode(){
		if(app.isIphoneX){
			this.scheduleOnce(()=>{
				this.Items.Node_activitys.setPosition(v3(this.Items.Node_activitys.getPosition().x+66,this.Items.Node_activitys.getPosition().y,1))
		
			},0)
			}
	}
	protected initBtns(): boolean | void {
		//AddCash
		this.initBtnShop();
		//分享
		this.initBtnShare();
		//任务
		this.initBtnTask();
		//福利
		this.initBtnFree();
		//背包
		this.initBtnBackpack();
		//客服
		this.initBtnService();
		//邮件
		this.initBtnEmail();
		//活动
		this.initBtnActivity();
		//更多
		this.initBtnMore();
		//转盘
		this.initBtnPrizeWheel();
		//月卡
		this.initBtnMoonCard();
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
					title: `Tip`,
					text: `Do you really want to quit the game?`,
					btnList: [
						{
							styleId: 1,
							text: `Ok`,
							callback: () => {
								//断开连接
								center.login.closeConnect();
								//切换到登录
								cc.game.end();
							}
						},
						{
							styleId: 2,
							text: `Earn money`,
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
					// let lastEnterRoomData: proto.plaza_room.Igs_room_get_serverid_c;
					// lastEnterRoomData = JSON.safeParse(app.file.getStringForKey("LastEnterRoomData", ``, { all: true }));
					// if (lastEnterRoomData) {
					// 	center.roomList.sendGetRoomServerId(lastEnterRoomData.kind_id);
					// }
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
		if (app.runtime.lastSceneType == fw.SceneConfigs.app.sceneName) {
			this.mIsFromLogin = true;
		}

		this.mCheckRegLogin = center.login.checkRegLogin();

		if (app.runtime.lastSceneType != fw.SceneConfigs.plaza.sceneName) {
			// this.onEnterProcess()
		}
		if(app.func.isWeChat() && center.user.getActorProp(PROTO_ACTOR.UAT_FACE_TYPE) == 1){
			app.native.device.getWechatUserInfo(this.Items.Node_head,()=>{
				this.Items.Node_head.onClickAndScale(() => {
					app.popup.showDialog({
						viewConfig: fw.BundleConfig.plaza.res[`userInfo/userInfo_dialog`]
					});
				});
			})
		}
		//刷新特殊游戏 新手引导没了不需要了
		// this.updateSpecialGame();
		//请求历史单笔最大充值金额
		// center.giftBag.getMaxPaymentHis();
	}

	/**更多 */
	initBtnMore() {
		this.Items.Node_more.onClickAndScale(() => {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.resources.res[`ui/setting/setting`],
			});
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
		
		this.Items.Sprite_head.bindEvent({
			eventName: `ACTOR_EVENT_${PROTO_ACTOR.UAT_FACE_URL}`,
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
			eventName: `ACTOR_EVENT_${PROTO_ACTOR.UAT_NICKNAME}`,
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
		let node_coin = this.Items.node_coin;
		let pos = node_coin.getComponent(UITransform).convertToWorldSpaceAR(v3(0, 0, 0));
		center.plaza.setPlazaGoldPos(pos);
		//钻石
		this.updateDiamond();
		center.user.event.bindEvent({
			valideTarget: this.node,
			eventName: ACTOR.ACTOR_PROP_DIAMONDS,
			callback: this.updateDiamond.bind(this)
		});
		let updateVipLevel = () => {
			// this.Items.Sprite_vip.active = false;
			// let vipLevel = center.user.getActorVipLevel();
			// let bgPath = fw.BundleConfig.plaza.res[js.formatStr("userInfo/img_new/vipNum/%s/spriteFrame", vipLevel)];
			// if (bgPath) {
			// 	this.Items.Sprite_vip.loadBundleRes(bgPath, (res: SpriteFrame) => {
			// 		this.Items.Sprite_vip.active = true;
			// 		this.Items.Sprite_vip.obtainComponent(Sprite).spriteFrame = res;
			// 	});
			// }
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
		this.Items.coin_label.getComponent(Label).string = `${center.user.getActorGold() }`;
	}
	/**刷新玩家钻石 */
	updateDiamond() {
		this.Items.diamond_label.getComponent(Label).string = `${center.user.getActorDiamond() }`;
	}
	initBtnEmail() {
		this.Items.Node_email.onClickAndScale(() => {
			// app.popup.showDialog({
			// 	viewConfig: fw.BundleConfig.plaza.res[`email/email`]
			// });
		});
		// let node = this.Items.Node_email.Items.Node_bubble;
		// node.active = false;
		// let updateEmail = () => {
		// 	let num = center.email.getEmailNoCloseNum();
		// 	let newActive = num > 0;
		// 	let oldActive = node.active;
		// 	if (oldActive != newActive) {
		// 		node.active = newActive;
		// 		let tempBubble = node.getComponent(bubble);
		// 		tempBubble.stopAnim();
		// 		newActive && tempBubble.playAnim();
		// 	}
		// }
		// this.bindEvent({
		// 	eventName: [
		// 		EVENT_ID.EVENT_EMAIL_EMAIL_ADD,
		// 		EVENT_ID.EVENT_EMAIL_VIEW_STATE,
		// 		EVENT_ID.EVENT_EMAIL_VIEW_RETURN,
		// 		EVENT_ID.EVENT_EMAIL_TEXT_RETURN,
		// 		EVENT_ID.EVENT_EMAIL_PICK_RETURN,
		// 	],
		// 	callback: updateEmail
		// });
		// updateEmail();
	}
	initBtnShare() {
		let bShareShow = true// center.user.isSwitchOpen(`btShareSwitch`);
		let shareNode = this.Items.Node_yaoqing;
		shareNode.active = bShareShow;
		let shareData = (<any>shareNode).shareData ??= {};
		this.Items.Node_yaoqing.onClickAndScale(() => {
			// app.popup.showDialog({
			// 	viewConfig: fw.BundleConfig.plaza.res[`vipGift/vipGift_dlg`]
			// });
		});
	}

	
	initBtnFree() {
		this.Items.Node_fuli.onClickAndScale(() => {
			// app.popup.showDialog({
			// 	viewConfig: fw.BundleConfig.plaza.res[`freeCash/freeCash`]
			// });
		});
	}

	initBtnTask() {
		this.Items.Node_task.onClickAndScale(() => {
			// app.popup.showDialog({
			// 	viewConfig: fw.BundleConfig.plaza.res[`freeCash/freeCash`]
			// });
		});
	}
	initBtnBackpack() {
		this.Items.Node_beibao.onClickAndScale(() => {
			// app.popup.showDialog({
			// 	viewConfig: fw.BundleConfig.plaza.res[`service/service_main`]
			// });
		});
	}
	initBtnService() {
		this.Items.Node_kefu.onClickAndScale(() => {
			// app.popup.showDialog({
			// 	viewConfig: fw.BundleConfig.plaza.res[`service/service_main`]
			// });
		});
	}
	initBtnShop() {
		let goMall = () => {
			// app.popup.showDialog({
			// 	viewConfig: fw.BundleConfig.plaza.res[`shop/shop_main`]
			// });
			// center.user.popGift(false, false, true)
		}
		this.Items.coin_add.onClickAndScale(() => {
			goMall()
		});
		this.Items.diamond_add.onClickAndScale(() => {
			goMall()
		});
		this.Items.Node_shop.onClickAndScale(() => {
			goMall()
		});

		
	}
	initBtnActivity() {
		this.Items.Node_activity.onClickAndScale(() => {
			// app.popup.showDialog({
			// 	viewConfig: fw.BundleConfig.plaza.res[`activity/activity`]
			// });
		});
	}
	initBtnMoonCard() {
		this.Items.Node_mooncard.onClickAndScale(() => {
			// app.popup.showDialog({
			// 	viewConfig: fw.BundleConfig.plaza.res[`activity/activity`]
			// });
		});
	}
	
	initBtnPrizeWheel() {
		this.Items.Node_wheel.onClickAndScale(() => {
			// app.popup.showDialog({
			// 	viewConfig: fw.BundleConfig.plaza.res[`activity/activity`]
			// });
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
			app.popup.showToast({ text: "The game is under development, please wait" })
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
