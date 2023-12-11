import { _decorator, Node as ccNode, Label, ScrollView, Toggle } from 'cc';
const { ccclass } = _decorator;

import { ACTOR } from '../../../../../../app/config/cmd/ActorCMD';
import { DF_RATE, DF_SYMBOL, trucoRoomType } from '../../../../../../app/config/ConstantConfig';
import { plaza_secondary_content } from '../../base/plaza_secondary_content';
import { COMBINE_ID, ROOMGROUP_GOLD } from '../../../../../../app/center/plaza/roomListCenter';

@ccclass('plaza_secondary_truco')
export class plaza_secondary_truco extends plaza_secondary_content {
	curSelectMenuData: SecondaryMenuParam = null;
	protected initView(): boolean | void {
		//隐藏部分界面
		this.Items.Node_item.active = false;
		let func = () => {
			//标题
			let titles = [fw.language.get(`Game`), fw.language.get(`Amount`), fw.language.get(`Min Entry`), fw.language.get(`Online Players`), fw.language.get(`Join`)];
			titles.forEach((element, index) => {
				let item = this.Items[`Label_title_${index + 1}`];
				if (item) {
					item.string = element;
				}
			});
			this.Items.Node_pokerType1.Items.Label_p.string = fw.language.get(`Clean`);
			this.Items.Node_pokerType2.Items.Label_p.string = fw.language.get(`Dirty`);
		}
		func();
		this.bindEvent({
			eventName: `UpdateLanguage`,
			callback: func,
		});
	}
	protected initBtns(): boolean | void {
		//菜单（写死：金币场，练习场）
		this.updateMenu([
			{
				text: `Paulista`,
				combines: {
					[COMBINE_ID.truco_Paulista]: { bOpen: true, },
				},
			},
		]);
		[
			this.Items.Node_pokerType1,
			this.Items.Node_pokerType2,
			this.Items.Node_people1,
			this.Items.Node_people2
		].forEach((element, i: number) => {
			element.onClick(() => {
				let tog = element.Items.Toggle_p;
				let curS = tog.obtainComponent(Toggle).isChecked;
				tog.obtainComponent(Toggle).isChecked = !curS;
				this.updateContent(this.curSelectMenuData);
			});
		});
	}
	protected initEvents(): boolean | void {
		this.bindEvent({
			eventName: ACTOR[ACTOR.ACTOR_PROP_GOLD],
			callback: () => {
				this.curSelectMenuData && this.updateContent(this.curSelectMenuData);
			}
		});
	}

	//筛选出
	screenList(list: any[]) {
		let tog1 = this.Items.Node_pokerType1.Items.Toggle_p.obtainComponent(Toggle).isChecked;
		let tog2 = this.Items.Node_pokerType2.Items.Toggle_p.obtainComponent(Toggle).isChecked;
		let tog3 = this.Items.Node_people1.Items.Toggle_p.obtainComponent(Toggle).isChecked;
		let tog4 = this.Items.Node_people2.Items.Toggle_p.obtainComponent(Toggle).isChecked;

		let pokerType = [];
		tog1 && pokerType.push(trucoRoomType.Clean);
		tog2 && pokerType.push(trucoRoomType.Dirty);

		let playerCount = [];
		tog3 && playerCount.push(2);
		tog4 && playerCount.push(4);

		let result = [];
		for (let i = 0; i < list.length; i++) {
			const v = list[i];
			if (pokerType.indexOf(v.roomData.roomType) != -1 && playerCount.indexOf(v.roomData.btMaxTablePlayers) != -1) {
				result.push(v);
			}
		}

		return result;
	}

	updateContent(menuData?: SecondaryMenuParam) {
		super.updateContent(menuData);
		this.curSelectMenuData = menuData;
		//房间列表
		let list = this.getRoomInfoList();
		//筛选数据
		list = this.screenList(list);
		//排序
		this.sortRoomInfoList(list);
		//最佳房间
		this.checkBestRoom(list);
		//刷新列表
		let index = 0;
		let childs = this.Items.content_item.children;
		list.forEach((element, i: number) => {
			let item = childs[index];
			if (!item) {
				item = this.Items.Node_item.clone();
				this.Items.content_item.addChild(item);
			}
			//调整数据
			element.baselevel = i;
			//按钮
			item.Items.Node_btn.onClickAndScale(() => {
				if (center.roomList.checkCanEnterRoom(element.roomData.kindId)) {
					menuData.callback ? menuData.callback(menuData, element) : this.onClickGame(menuData, element);
				} else {
					let enterLimit = center.roomList.getEnterRoomLimit(element.roomData.kindId);
					app.popup.showDialog({
						viewConfig: fw.BundleConfig.plaza.res[`shop/shop_main`],
						data: {
							minPay: enterLimit.offset / DF_RATE
						}
					});
				}
			});
			let enterLimit = center.roomList.getEnterRoomLimit(element.roomData.kindId);
			if (enterLimit.offset > 0) {
				item.Items.Node_btn.Items.Label_content.obtainComponent(fw.FWLanguage).bindLabel(`Add Cash`);
				item.Items.Node_btn.Items.Sprite_bg.updateSprite(fw.BundleConfig.plaza.res[`plaza/secondary/gameContents/base/img/btn_add/spriteFrame`]);
				item.Items.Sprite_bg.updateSprite(fw.BundleConfig.plaza.res[`plaza/secondary/gameContents/base/img/plaza_secondary_item_gray_bg/spriteFrame`]);
			} else {
				item.Items.Node_btn.Items.Label_content.obtainComponent(fw.FWLanguage).bindLabel(`Join`);
				item.Items.Node_btn.Items.Sprite_bg.updateSprite(fw.BundleConfig.plaza.res[`plaza/secondary/gameContents/base/img/EJ_btn_huangse/spriteFrame`]);
				item.Items.Sprite_bg.updateSprite(fw.BundleConfig.plaza.res[`plaza/secondary/gameContents/base/img/plaza_secondary_item_bg/spriteFrame`]);
			}
			item.data = element;
			//显隐
			item.active = true;
			this.updateItems(item, element);
			++index;
		});
		for (let j = childs.length; index < j; ++index) {
			childs[index].active = false;
		}
	}
	updateItems(item?: ccNode, data1?: any) {
		let items = !!item ? [item] : this.Items.content_item.children;
		items.forEach(element => {
			if (element.active) {
				let data = element.data;
				let nMinValue = Number(data.roomData.LimitRule[this.RoomRuleEnter.ROOM_RULE_ENTER_GOLD].nMinValue) || 0;
				//房间类型
				item.Items.Label_roomType.obtainComponent(fw.FWLanguage).bindLabel(data.roomData.roomType == trucoRoomType.Clean ? `Clean` : `Dirty`);
				//第1个数据
				item.Items.Label_count.string = `${DF_SYMBOL}${data.roomData.btMaxTablePlayers}`;
				item.Items.vs2v2.active = false
				if (Number(data.roomData.btMaxTablePlayers) == 4) {
					item.Items.vs2v2.active = true
				}
				//第2个数据
				item.Items.Label_win.string = `${DF_SYMBOL}${data.roomData.nBaseScore / DF_RATE}`;
				//第3个数据
				item.Items.Label_min_entry.string = nMinValue > 0 ? `${nMinValue / DF_RATE}` : fw.language.get(`Free`);
				//第4个数据
				let bBest = this.bestRoom == element.data;
				item.Items.Sprite_best.active = bBest;
				if (bBest) {
					//使节点在视图中
					this.Items.Node_bottom.Items.ScrollView.getComponent(ScrollView).setNodeInView({ node: item, bImmediately: this.bInit });
				}
				//第5个数据
				item.Items.Label_player_num.string = `${data.roomData.nActorCount ? Math.ceil(data.roomData.nActorCount) : 0}`;
			}
		});
	}
}
