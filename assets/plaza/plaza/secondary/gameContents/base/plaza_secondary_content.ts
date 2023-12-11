import { _decorator, Node as ccNode, Color, ScrollView } from 'cc';
const { ccclass } = _decorator;

import { ACTOR } from '../../../../../app/config/cmd/ActorCMD';
import { EVENT_ID } from '../../../../../app/config/EventConfig';
import { ROOMGROUP_GOLD } from '../../../../../app/center/plaza/roomListCenter';

/**内容基础 */
@ccclass('plaza_secondary_content')
export class plaza_secondary_content extends (fw.FWComponent) {
	/**??? */
	RoomRuleEnter = {
		//金币
		ROOM_RULE_ENTER_GOLD: 0,
		//积分
		ROOM_RULE_ENTER_SCORE: 1,
		//VIP经验值
		ROOM_RULE_ENTER_VIPEXP: 2,
	}
	/**是否为初始化 */
	bInit: boolean = false
	/**菜单 */
	menu: FWMenuParam<any>
	/**菜单列表 */
	menuList: SecondaryMenuParam[]
	/**当前菜单选项 */
	menuData: SecondaryMenuParam
	/**当前best */
	bestRoom: any
	/**金币满足颜色 */
	enough_color: Color
	/**金币不满足颜色 */
	enough_color_not: Color
	start() {
		//初始化数据
		this.initData_plaza_secondary_content();
		//父类
		super.start();
		//调整状态
		this.bInit = true;
	}
	initData_plaza_secondary_content() {
		this.enough_color = app.func.color(`#B05C19`);
		this.enough_color_not = app.func.color(`#B05C19`);
	}
	protected initEvents(): boolean | void {
		//房间在线人数返回
		this.bindEvent({
			eventName: EVENT_ID.EVENT_ROOM_ONLINECOUNT_RETURN,
			callback: () => {
				this.updateItems();
			}
		});
	}
	/**初始化菜单 */
	updateMenu(menuList?: SecondaryMenuParam[]) {
		menuList = this.menuList = menuList ?? this.menuList;
		let index = 0;
		let btns: FWOneMenuBtnParam<unknown>[] = [];
		let childs = this.Items.content_menu.children;
		menuList.forEach(element => {
			let btn = childs[index];
			if (!btn) {
				btn = this.Items.Node_menu_btn.clone();
				this.Items.content_menu.addChild(btn);
			}
			btn.active = true;
			btns.push({
				node: btn,
				text: element.text,
				callback: () => {
					//刷新显示
					this.updateContent(element);
					//使节点在视图中
					this.Items.Node_top.Items.ScrollView.getComponent(ScrollView).setNodeInView({
						node: btn
					});
				}
			});
			++index;
		});
		app.func.createMenu({
			btns: btns,
			mountObject: this,
		});
	}
	/**设置菜单选中 */
	setMenuDefault(data?: OnePlazaGameConfigParam) {
		if (!this.menu || !data) {
			return;
		}
		app.func.positiveTraversal(this.menuList, (element, index: number) => {
			app.func.traversalObject(element.combines, (elementEx, combine: number) => {
				if (combine == data.combine) {
					this.menu.setDefault(index);
					return true;
				}
			});
		});
	}
	/**加入回调 */
	onClickGame(menuData: SecondaryMenuParam, roomInfo: any) {
		let func = (bBest: boolean) => {
			this.enterRoom(this.bestRoom && bBest ? this.bestRoom.kindId : roomInfo.roomData.kindId);
		}
		if (menuData.bPractice) {
			let nTimes = app.file.getIntegerForKey(`PRACTICE_TIMES_${roomInfo.combine}`, 20);
			if (nTimes <= 0) {
				app.popup.showTip({
					text: fw.language.get(`You have no experience today.\nDo you want to play the cash game?`),
					btnList: [
						{
							styleId: 1,
							callback: () => { func(false); }
						},
					]
				});
				return;
			} else {
				func(false);
			}
		} else {
			// let nRechargeAmount = center.user.getActorProp(ACTOR.ACTOR_PROP_RECHARGE_AMOUNT);
			// if (nRechargeAmount <= 0) {
			// 	app.popup.showDialog({
			// 		viewConfig: fw.BundleConfig.plaza.res[`premium/premium`],
			// 		callback: (view, data) => {
			// 			this.enterRoom(center.roomList.KIND_ID.ddz_abPratice);
			// 		},
			// 	});
			// 	return;
			// }
			if (this.bestRoom && this.bestRoom.baselevel - roomInfo.roomData.baselevel >= 2 && !app.runtime.abtips) {
				app.runtime.abtips = true;
				app.popup.showTip({
					text: fw.language.get(`You have enough money to go to a higher table and win more money.`),
					btnList: [
						{
							styleId: 2,
							text: fw.language.get(`Cancel`),
							callback: () => { func(false); }
						},
						{
							styleId: 1,
							text: fw.language.get(`Ok`),
							callback: () => { func(true); }
						},
					]
				});
			} else {
				func(false);
			}
		}
	}
	/**请求进入房间 */
	enterRoom(kindId: number) {
		center.roomList.sendGetRoomServerId(kindId);
	}
	/**更新内容 */
	updateContent(menuData?: SecondaryMenuParam) {
		this.menuData = menuData ?? this.menuData;
	}
	/**获取房间列表 */
	getRoomInfoList() {
		let list = [];
		if (this.menuData) {
			app.func.traversalObject(this.menuData.combines, (element, combine: number) => {
				center.roomList.getRoomCombineByCombineIDAndPlayerNum(combine).forEach(elementEx => {
					list.push({
						combine: combine,
						roomData: elementEx,
					});
				});
			});
		}
		return list;
	}
	/**排序房间列表 */
	sortRoomInfoList(list: any[]) {
		list.sort((a, b) => {
			if (a.roomData.nBaseScore != b.roomData.nBaseScore) {
				return a.roomData.nBaseScore - b.roomData.nBaseScore;
			} else {
				return a.roomData.btMaxTablePlayers - b.roomData.btMaxTablePlayers;
			}
		});
	}
	/**检测最佳房间 */
	checkBestRoom(list: any[]) {
		let nMinValue = 0;
		this.bestRoom = null;
		let nSelfMoney = center.user.getActorProp(ACTOR.ACTOR_PROP_GOLD);
		list.forEach(element => {
			let tempMinValue = Number(element.roomData.LimitRule[this.RoomRuleEnter.ROOM_RULE_ENTER_GOLD].nMinValue) || 0;
			if (nSelfMoney > tempMinValue && tempMinValue > nMinValue) {
				nMinValue = tempMinValue;
				this.bestRoom = element;
			}
		});
	}
	/**刷新节点（由子类自行实现） */
	updateItems() {
		//TODO
	}
}

/**类型声明调整 */
declare global {
	namespace globalThis {
		type SecondaryMenuParam = {
			/**按钮文本 */
			text: string
			/**是否为练习场 */
			bPractice?: boolean
			/**指定内容 */
			combines: { [combine: number]: { bOpen: boolean, } }
			/**按钮回调 */
			callback?: (menuData: SecondaryMenuParam, roomInfo: any) => void
		}
	}
}
