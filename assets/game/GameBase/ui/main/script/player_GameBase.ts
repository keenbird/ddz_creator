import { _decorator, Node as ccNode } from 'cc';
const { ccclass } = _decorator;

import { EVENT_ID } from '../../../../../app/config/EventConfig';
import { emoji_GameBase } from '../../emoji/script/emoji_GameBase';
import { chatBubble_GameBase } from '../../chat/script/chatBubble_GameBase';

@ccclass('player_GameBase')
export class player_GameBase extends (fw.FWComponent) {
	onLoad() {
		//事件
		this.initEvents_player_GameBase();
		//父类
		super.onLoad();
	}
	initEvents_player_GameBase() {
		//表情
		this.bindEvent({
			bOne: true,
			eventName: EVENT_ID.EVENT_PLAY_CHAT_MAGICFACE,
			callback: (arg1, arg2) => {
				this.playEmojiAnim(arg1.data);
			},
		});
		//聊天
		this.bindEvent({
			bOne: true,
			eventName: `GAME_CHAT_GAMEPHRASES`,
			callback: (arg1, arg2) => {
				this.doChat(arg1.data);
			},
		});
	}
	/**显示对玩家魔法表情互动界面 */
	showEmojiView(data: ShowEmojiViewParam) {
		let playerNode = data.playerNode ?? this.getPlayerNode(data);
		if (!fw.isValid(playerNode)) {
			return;
		}
		let updateEmojiView = (view: ccNode, bNew?: boolean) => {
			if (!fw.isValid(playerNode)) {
				return;
			}
			app.game.main.emojiView = view;
			let emoji = view.getComponent(emoji_GameBase);
			emoji.setData(data);
			view.active = true;
			//添加节点
			if (bNew) {
				//添加到chat层
				app.game.main.viewZOrderNode[app.game.main.viewZOrder.Chat].addChild(view);
				//添加触摸隐藏
				app.func.addTouchHide(view);
			}
			//调整坐标
			view.setWorldPosition(playerNode.getWorldPosition());
			//刷新朝向
			emoji.updateOrientation();
		}
		//新建气泡
		if (!fw.isValid(app.game.main.emojiView)) {
			emoji_GameBase.newEmojiBubble(<EmojiParam>{
				bManual: true,
				callback: (view, dataEx) => {
					updateEmojiView(view, true);
				}
			});
		} else {
			updateEmojiView(app.game.main.emojiView);
		}
	}
	/**播放魔法表情
	 * @param data 协议数据
	 */
	playEmojiAnim(data: type_Iuse_magic_cs) {
		let sendPlayerNode = this.getPlayerNode({ nUserID: data.send_user_id });
		if (!sendPlayerNode) {
			return;
		}
		let recvPlayerNode = this.getPlayerNode({ nUserID: data.recv_user_id });
		if (!recvPlayerNode) {
			return;
		}
		emoji_GameBase.playEmojiAnim(<PlayEmojiParam>{
			parent: app.game.main.viewZOrderNode[app.game.main.viewZOrder.Chat],
			sPos: sendPlayerNode.getWorldPosition(),
			ePos: recvPlayerNode.getWorldPosition(),
			index: data.magic_id,
		});
	}
	/**播放“普通表情”或“普通文本”聊天消息 */
	doChat(data: ChatParam) {
		//新建气泡
		chatBubble_GameBase.newChatBubble(Object.assign(data, <ChatBubbleParam>{
			callback: (view, dataEx) => {
				let playerNode = this.getPlayerNode({ nUserID: data.user_id });
				if (!playerNode) {
					return;
				}
				//添加节点
				app.game.main.viewZOrderNode[app.game.main.viewZOrder.Chat].addChild(view);
				//调整坐标
				view.setWorldPosition(playerNode.getWorldPosition());
			}
		}));
	}
	/**获取玩家节点（需要子类重写） */
	getPlayerNode(data: GetPlayerNodeParam): ccNode | null {
		return null;
	}
}

declare global {
	namespace globalThis {
		type GetPlayerNodeParam = {
			/**玩家UserID */
			nUserID?: number,
			/**玩家服务器椅子号 */
			nChairID?: number,
			/**默认节点 */
			defaultNode?: ccNode
			/**只在桌子上找 */
			bOnlyTable?: boolean
		}
		type ShowEmojiViewParam = {
			/**玩家UserID */
			nUserID: number,
			/**玩家服务器椅子号 */
			nChairID?: number
			/**玩家节点 */
			playerNode?: ccNode
			/**玩家信息 */
			playerInfo?: any
		}
	}
}
