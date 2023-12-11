import { instantiate, Label, ScrollView, Sprite, SpriteFrame, _decorator } from 'cc';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
const { ccclass } = _decorator;

@ccclass('RummyHowToPlay')
export class RummyHowToPlay extends (FWDialogViewBase) {
	/**传入参数 */
	data: any;

	initData() {

	}
	protected initEvents(): boolean | void {

	}
	protected initView(): boolean | void {
		let data = this.data;
		//游戏中返回键更换样式
		if (data && data.bIngGame) {
			this.Items.Node_close.loadBundleRes(fw.BundleConfig.resources.res["ui/dialog/img/dialog_btn_close/spriteFrame"],(res: SpriteFrame) => {
				this.Items.Node_close.obtainComponent(Sprite).spriteFrame = res;
			});
		}

		let handleData = ["Rummy Basics", "Sequences", "Sets", "How to Group?", "How to Add?",
			"How to Discard?", "Score", "How to Declare?", "10 Card"];
		let btns = [];

		//复用型scrollview
		let scr_list = this.Items.ListView_left.obtainComponent(ScrollView);
		let c = scr_list.content.children;
		let item0 = scr_list.content.getChildByName("Panel_item_balance");

		for (let index = 0; index < handleData.length; index++) {
			let data = handleData[index];
			let item = c[index] ? c[index] : instantiate(item0);
			item.parent = scr_list.content;
			let btn = {
				node: item,
				text: data,
				callback: () => {
					for (let i = 0; i < handleData.length; i++) {
						let content_ = this.Items.node_content.Items[`content_` + (i + 1)];
						content_.active = i == index;
					}
				}
			}
			btns.push(<FWOneMenuBtnParam<typeof btn>>btn);
		}

		for (let i = 0; i < c.length; i++) {
			let item = c[i];
			if (i < handleData.length) {
				item.active = true;
			} else {
				item.active = false;
			}
		}

		//创建菜单
		app.func.createMenu({
			defaultIndex: 0,
			mountObject: this,
			btns: btns,
		});
	}
	protected initBtns(): boolean | void {

	}
}

declare global {
	namespace globalThis {
		type plaza_RummyHowToPlay = RummyHowToPlay
	}
}