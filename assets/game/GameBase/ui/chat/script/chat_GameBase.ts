import { instantiate, Label, Widget, _decorator, Node as ccNode, view } from 'cc';
const { ccclass } = _decorator;

import { FWDialogViewBase } from '../../../../../app/framework/view/popup/FWDialogViewBase';

/**聊天类型 */
export enum ChatType {
	/**文本聊天 */
	Text,
	/**表情聊天 */
	Emoji,
}

@ccclass('chat_GameBase')
export class chat_GameBase extends FWDialogViewBase {
	/**配置参数 */
	popupData: ChatBaseParam = <any>{}
	setPopupData(data: ChatBaseParam) {
		this.popupData = data ?? app.game.chatConfig;
	}
	protected initView(): boolean | void {
		//隐藏部分界面
		this.Items.Node_item_text.active = false;
		this.Items.Node_item_emoji.active = false;
	}
	protected initBtns(): boolean | void {
		//菜单
		let defaultValue = ChatType.Text;
		let defaultType: ChatType = app.file.getIntegerForKey(`LastChatType`, defaultValue);
		defaultType = ChatType[defaultType] ? defaultType : defaultValue;
		app.func.createMenu(<FWCreateMenuParam>{
			btns: [
				{
					data: {
						type: ChatType.Text
					},
					node: this.Items.Node_btn_text,
					callback: this.updateText.bind(this)
				},
				{
					data: {
						type: ChatType.Emoji
					},
					node: this.Items.Node_btn_emoji,
					callback: this.updateEmoji.bind(this)
				},
			],
			defaultCallback: (btnData) => {
				return defaultType == btnData.data.type;
			}
		});
		//关闭
		this.node.onClick(this.onClickClose.bind(this));
	}
	updateText() {
		app.file.setIntegerForKey(`LastChatType`, ChatType.Text);
		//为了更好的提示，这里调整一下类型
		let data: ChatBaseParam = this.popupData ?? app.game.chatConfig;
		if (!data || !data.text) {
			fw.printError(`chat text config error`, data);
			return;
		}
		let text = data.text;
		//隐藏所有界面
		this.Items.content.children.forEach(element => {
			element.active = false;
		});
		let layout = this.Items[`Layout_text`];
		if (!layout) {
			layout = this.Items.Layout_item.clone();
			this.Items.content.addChild(layout);
			this.Items[`Layout_text`] = layout;
			//文本
			text.forEach((element, index) => {
				let item = this.Items.Node_item_text.clone();
				item.Items.Label_text.getComponent(Label).string = element.content;
				layout.addChild(item);
				item.active = true;
				//点击事件
				item.onClickAndScale(() => {
					if (element.callback) {
						element.callback(ChatType.Text, index);
					} else {
						this.onClickChat(ChatType.Text, index);
					}
					this.onClickClose();
				});
			});
		}
		layout.active = true;
	}
	updateEmoji() {
		app.file.setIntegerForKey(`LastChatType`, ChatType.Emoji);
		//为了更好的提示，这里调整一下类型
		let data: ChatBaseParam = this.popupData ?? app.game.chatConfig;
		if (!data || !data.emoji) {
			fw.printError(`chat emoji config error`, data);
			return;
		}
		let emoji = data.emoji;
		//隐藏所有界面
		this.Items.content.children.forEach(element => {
			element.active = false;
		});
		let layout = this.Items[`Layout_emoji`];
		if (!layout) {
			layout = this.Items.Layout_item.clone();
			this.Items.content.addChild(layout);
			this.Items[`Layout_emoji`] = layout;
			//图片
			emoji.forEach((element, index) => {
				let item = this.Items.Node_item_emoji.clone();
				app.file.updateImage({
					bAutoShowHide: true,
					bundleResConfig: element.res,
					node: item.Items.Sprite_emoji,
				})
				layout.addChild(item);
				item.active = true;
				//点击事件
				item.onClickAndScale(() => {
					if (element.callback) {
						element.callback(ChatType.Text, index);
					} else {
						this.onClickChat(ChatType.Emoji, index);
					}
					this.onClickClose();
				});
			});
		}
		layout.active = true;
	}
	/**示范处理 */
	onClickChat(type: ChatType, index: number) {
		//为了更好的提示，这里调整一下类型
		let data: ChatBaseParam = this.popupData ?? app.game.chatConfig;
		if (!data) {
			fw.printError(`chat onClickChat config error`, data);
			return;
		}
		fw.print(`click chat type: ${type} -> index: ${index}`);
		//发送消息
		gameCenter.chat.send_GAME_CHAT_GAMEPHRASES({
			user_id: center.user.getUserID(),
			index: index + 1,
			type: type,
		});
	}
	start() {
		super.start();
		//根据chatbtn在世界位置的x坐标，来自动适配
		if (this.popupData.btn) {
			let pX = this.popupData.btn.getWorldPosition().x
			this.Items.Sprite_bg.obtainComponent(Widget).isAlignLeft = pX <= view.getVisibleSize().width / 2;
			this.Items.Sprite_bg.obtainComponent(Widget).isAlignRight = pX > view.getVisibleSize().width / 2;
		}
	}
}

/**类型声明调整 */
declare global {
	namespace globalThis {
		type ChatTextParam = {
			//文本内容
			content: string
			//回调
			callback?: (type: ChatType, index: number) => void
		}
		type ChatEmojiParam = {
			//表情内容
			res: BundleResConfig
			//回调
			callback?: (type: ChatType, index: number) => void
		}
		//聊天界面配置
		type ChatBaseParam = {
			//文本内容
			text?: ChatTextParam[]
			//表情内容
			emoji?: ChatEmojiParam[]
			//触发按钮本身，用于重置位置
			btn?: ccNode
		}
	}
}
