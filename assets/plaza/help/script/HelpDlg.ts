import { ScrollView } from 'cc';
import { instantiate, Label, math, Node as ccNode, Overflow, UITransform, _decorator } from 'cc';
import { COMBINE_ID, ROOMGROUP_GOLD } from '../../../app/center/plaza/roomListCenter';
const { ccclass } = _decorator;

import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('HelpDlg')
export class HelpDlg extends FWDialogViewBase {
	
	initData() {

	}
	protected initView(): boolean | void {
		//调整标题
		this.changeTitle({ title: `How to play` });
		//隐藏部分界面
		this.Items.Node_menu_item.active = false;
		// this.Items.Node_item_reward.active = false;
		// this.Items.Sprite_reward_bg.active = false;


		let cfg = [
			{ title: "Rummy", panel: this.Items.FileNode_rummy },
		];

		let bLudoOpen = this.isLudoOpen();
		if (app.sdk.isIosDev()) {
			cfg = [
				{ title: "Rummy", panel: this.Items.FileNode_rummy },
			]
		} else if (bLudoOpen) {
			cfg = [
				{ title: "Rummy", panel: this.Items.FileNode_rummy },
			];
		}

		let btns = [];
		let viewType = 0;
		for (let index = 0; index < cfg.length; index++) {
			const element = cfg[index];
			let item = this.Items.Node_menu_item.clone();
			this.Items.content.addChild(item);
			item.active = true;
			//添加一个选项
			let btn = {
				node: item,
				text: element.title,
				callback: () => {
					for (let i = 0; i < cfg.length; i++) {
						const v = cfg[i].panel;
						v.active = i == index;
					}
					this.Items.ScrollView.obtainComponent(ScrollView).scrollToTop(0.01, true)
				}
			}
			btns.push(<FWOneMenuBtnParam<typeof btn>>btn);
		}

		//创建菜单
		app.func.createMenu({
			defaultIndex: viewType,
			mountObject: this,
			btns: btns,
		});
	}
	protected initBtns(): boolean | void {
		this.Items.learn_rules.onClickAndScale(this.onClickBtnLearnRules.bind(this));
		this.Items.rummy_guide.onClickAndScale(this.onClickBtnrummyGuide.bind(this));
		if (app.sdk.isIosDev()) {
			this.Items.rummy_guide.active = false
			this.Items.learn_rules_0.active = false
		}
	}

	protected initEvents(): boolean | void {

	}

	onClickBtnLearnRules() {
		
	}

	onClickBtnrummyGuide() {
		
	}

	isLudoOpen() {
		let bLudoOpen = false
		let tbData = center.roomList.getRoomCombineByCombineID(COMBINE_ID.ludo_quick)
		for (let i in tbData) {
			if (center.roomList.isKindIDOpen(tbData[i])) {
				bLudoOpen = true
				break
			}
		}
		if (!bLudoOpen) {
			tbData = center.roomList.getRoomCombineByCombineID(COMBINE_ID.ludo)
			for (let i in tbData) {
				if (center.roomList.isKindIDOpen(tbData[i])) {
					bLudoOpen = true
					break
				}
			}
		}
		return bLudoOpen
	}
}
