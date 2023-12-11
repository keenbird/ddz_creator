import { instantiate, Label, Node as ccNode, Prefab, ScrollView, Sprite, SpriteFrame, UITransform, _decorator } from 'cc';
const { ccclass } = _decorator;

import { FWDialogViewBase } from '../../../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('menu_GameBase')
export class menu_GameBase extends FWDialogViewBase {
	//默认菜单样式
	defaultMenu: OneMenuButtonParam[];
	protected initData(): boolean | void {
		//默认菜单样式
		this.defaultMenu = [
			{
				text: { content: fw.language.get(`Menu`) },
				file: { path: fw.BundleConfig.GameBase.res["ui/menu/img/atlas/m_menu/spriteFrame"] },
				callback: this.onClickClose.bind(this)
			},
			{
				text: { content: fw.language.get(`Exit to lobby`) },
				file: { path: fw.BundleConfig.GameBase.res["ui/menu/img/atlas/m_exit/spriteFrame"] },
				callback: this.onClickExit.bind(this)
			},
			{
				text: { content: fw.language.get(`Switch table`) },
				file: { path: fw.BundleConfig.GameBase.res["ui/menu/img/atlas/m_switch/spriteFrame"] },
				callback: this.onClickSwitch.bind(this)
			},
			{
				text: { content: fw.language.get(`How to play`) },
				file: { path: fw.BundleConfig.GameBase.res["ui/menu/img/atlas/m_how/spriteFrame"] },
				callback: this.onClickHelp.bind(this)
			},
			{
				text: { content: fw.language.get(`Setting`) },
				file: { path: fw.BundleConfig.GameBase.res["ui/menu/img/atlas/m_setting/spriteFrame"] },
				callback: this.onClickSetting.bind(this)
			},
		];
	}
	protected initEvents(): boolean | void {
		//返回键
		this.bindEvent({
			eventName: app.event.CommonEvent.Keyback,
			callback: this.onClickExit.bind(this)
		});
	}
	protected initBtns(): boolean | void {
		//点击背景关闭
		this.onClick(this.onClickClose.bind(this));
	}
	protected initView(): boolean | void {
		//隐藏部分界面
		this.Items.Node_item.active = false;
		//刷新显示
		this.updateList();
	}
	//刷新菜单
	updateList(data?: OneMenuButtonParam[]) {
		this.Items.content.removeAllChildren(true);
		let menu = data || this.defaultMenu;
		menu.forEach(element => {
			let item = this.Items.Node_item.clone();
			this.Items.content.addChild(item);
			item.active = true;
			//调整显示
			this.updateBtnContent(item, element);
			//回调
			item.onClickAndScale(element.callback);
		});
		//是否可滑动
		let cHeight = this.Items.content.getComponent(UITransform).height;
		let sHeight = this.Items.ScrollView.getComponent(UITransform).height;
		this.Items.ScrollView.getComponent(ScrollView).enabled = cHeight > sHeight;
	}
	//更新按钮显示
	updateBtnContent(btnNode: ccNode, data: OneMenuButtonParam) {
		//图片
		if (data.file) {
			btnNode.Items.Sprite.updateSprite(data.file.path, { bAutoShowHide: true });
		}
		//文本
		if (data.text) {
			btnNode.Items.Label.string = data.text.content;
		}
	}
	/**退出游戏 */
	onClickExit() {
		//关闭当前界面
		this.onClickClose();
		//退出游戏
		app.gameManager.exitGame();
	}
	/**换房 */
	onClickSwitch() {
		//关闭当前界面
		this.onClickClose();
		//请求换房
		gameCenter.room.sendChangeTable();
	}
	/**帮助 */
	onClickHelp() {
		//关闭当前界面
		this.onClickClose();
		//显示帮助
		app.game.main.onClickHelp();
	}
	/**设置 */
	onClickSetting() {
		//关闭当前界面
		this.onClickClose();
		//显示设置
		app.game.main.onClickSetting();
	}
}

/**类型声明调整 */
declare global {
	namespace globalThis {
		//一个菜单按钮样式
		type OneMenuButtonParam = {
			/**按钮内容图 */
			file?: OneImageMenuButtonParam
			/**按钮内容文本 */
			text?: OneTextMenuButtonParam
			/**按钮内容视图 */
			view?: OneViewMenuButtonParam
			/**按钮回调 */
			callback: (data: OneMenuButtonParam) => void
		}
		type OneImageMenuButtonParam = {
			/**图片路径 */
			path?: BundleResConfig
			/**自定义显示回调 */
			callback?: (data: ccNode) => void
		}
		type OneTextMenuButtonParam = {
			/**图片路径 */
			content?: string
			/**自定义显示回调 */
			callback?: (data: ccNode) => void
		}
		type OneViewMenuButtonParam = {
			/**图片路径 */
			ui?: BundleResConfig | ccNode
			/**自定义显示回调 */
			callback?: (data: ccNode) => void
		}
	}
}