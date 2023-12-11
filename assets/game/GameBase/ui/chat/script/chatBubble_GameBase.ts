import { instantiate, Label, Node as ccNode, Overflow, Prefab, Sprite, SpriteFrame, tween, UIOpacity, UITransform, v3, _decorator } from 'cc';
const { ccclass } = _decorator;

import { ChatType } from './chat_GameBase';

@ccclass('chatBubble_GameBase')
export class chatBubble_GameBase extends (fw.FWComponent) {
	/**新建一个聊天气泡 */
	public static newChatBubble(data: ChatBubbleParam): void {
		app.game.loadBundleRes(data.res ?? app.game.getRes(`ui/chat/chatBubble`), (res: Prefab) => {
			//实例
			let view = instantiate(res);
			let chatBubble = view.getComponent(chatBubble_GameBase);
			//调整参数
			chatBubble.setPopupData(data);
			//执行回调
			data.callback && data.callback(view, data);
			//检测位置（屏幕左边正常显示，屏幕右边翻转）
			if (!data.bManual) {
				chatBubble.updateOrientation();
			}
		});
	}
	/**配置参数 */
	popupData: ChatBubbleParam
	setPopupData(data: ChatBubbleParam) {
		this.popupData = data;
	}
	protected initView(): boolean | void {
		let data = this.popupData;
		if (!data || !(data.type in ChatType)) {
			fw.printError(`chat bubble error`);
			return;
		}
		//配置信息
		data.config = data.config || app.game.chatConfig;
		//隐藏有效节点
		this.Items.Node_content.children.forEach(element => {
			element.active = false;
		});
		switch (data.type) {
			case ChatType.Text:
				//当前设计尺寸
				let oldSize = this.Items.Label_text.getComponent(UITransform).contentSize;
				//刷新显示
				this.Items.Label_text.active = true;
				data.index -= 1;
				// 这里原先是区分男女的，这里临时处理一下
				if (data.index >= 100) {
					data.index -= 100
				}
				let content = data.config.text[data.index].content;
				this.Items.Label_text.getComponent(Label).string = content;
				//调整尺寸
				//新建一个Label用于计算实际大小
				let node = this.Items.Label_text.clone();
				let label = node.obtainComponent(Label);
				label.overflow = Overflow.NONE;
				label.string = content;
				label.updateRenderData(true);
				let newSize = node.getComponent(UITransform).contentSize;
				if (newSize.width < oldSize.width) {
					this.Items.Label_text.getComponent(UITransform).width -= oldSize.width - newSize.width - 1;
				}
				node.destroy();
				tween(this.node)
					.delay(1.0)
					.by(0.25, { position: v3(0, 10, 0) })
					.call(() => {
						tween(this.node)
							.by(0.25, { position: v3(0, 10, 0) })
							.start()
						tween(this.node.obtainComponent(UIOpacity))
							.to(0.25, { opacity: 0 })
							.start()
					})
					.delay(0.25)
					.call(() => {
						this.node.removeFromParent(true);
					})
					.start();
				break;
			case ChatType.Emoji:
				this.node.active = false;
				data.index -= 1;
				this.loadBundleRes(data.config.emoji[data.index].res, (res: SpriteFrame) => {
					this.Items.Sprite_emoji.getComponent(Sprite).spriteFrame = res;
					this.Items.Sprite_emoji.active = true;
					this.node.active = true;
				});
				tween(this.node)
					.delay(2.75)
					.call(() => {
						tween(this.node.obtainComponent(UIOpacity))
							.to(0.25, { opacity: 0 })
							.start()
					})
					.delay(0.25)
					.call(() => {
						this.node.removeFromParent(true);
					})
					.start();
				break;
			default:
				break;
		}
	}
	updateOrientation() {
		let wPos = fw._v3;
		this.node.getWorldPosition(wPos);
		let bMirror = wPos.x > app.winSize.width / 2;
		this.node.mirror({ x: true }, bMirror);
		this.Items.Node_content.mirror({ x: true }, bMirror);
	}
}

/**类型声明调整 */
declare global {
	namespace globalThis {
		type ChatBubbleParam = {
			/**聊天类型 */
			type: ChatType
			/**索引 */
			index: number
			/**配置信息 */
			config?: ChatBaseParam
			/**自定义ui */
			res?: BundleResConfig
			/**手动翻转 */
			bManual?: boolean
			/**回调 */
			callback?: (view: ccNode, data: ChatBubbleParam) => void
		}
	}
}
