
import { _decorator, Prefab, instantiate, Node as ccNode, Vec3, Sprite, SpriteFrame, tween, sp } from 'cc';
const { ccclass } = _decorator;

import { ACTOR } from '../../../../../app/config/cmd/ActorCMD';
import { DF_RATE } from '../../../../../app/config/ConstantConfig';

// 给 emojiNode 添加 data
export type EmojiNode = ccNode & {
	data?:any;
}

@ccclass('emoji_GameBase')
export class emoji_GameBase extends (fw.FWComponent) {
	/**复用spine动画 */
	protected static spines: ccNode[] = []
	/**新建一个聊天气泡 */
	public static newEmojiBubble(data: EmojiParam): void {
		app.game.loadBundleRes(data.res ?? app.game.getRes(`ui/emoji/emoji`), (res: Prefab) => {
			//实例
			let view = instantiate(res);
			//调整参数
			let emoji = view.getComponent(emoji_GameBase);
			emoji.setData(data);
			//执行回调
			data.callback && data.callback(view, data);
			//更新界面价格
			let magicFaceOne = gameCenter.room.getMagicFace(1);
			view.Items.Label_tip.string = `Each use costs ${magicFaceOne.gold / DF_RATE}`;
			//检测位置（屏幕左边正常显示，屏幕右边翻转）
			if (!data.bManual) {
				emoji.updateOrientation();
			}
		});
	}
	/**播放魔法表情 */
	public static playEmojiAnim(data: PlayEmojiParam): void {
		let item: EmojiItemParam;
		let list = data.list
		if (!list) {
			list = emoji_GameBase.list ?? emoji_GameBase.getEmojiDefList();
		}
		app.func.positiveTraversal(list, element => {
			if (element.index == data.index) {
				item = element;
				return true;
			}
		});
		if (item) {
			app.assetManager.loadBundleRes(item.anim, (res: Prefab) => {
				//父节点已经释放
				if (!fw.isValid(data.parent)) {
					return;
				}
				//移动动画
				let node = new ccNode();
				node.obtainComponent(Sprite);
				app.file.updateImage({
					node: node,
					bundleResConfig: item.res,
				});
				data.parent.addChild(node);
				node.setWorldPosition(data.sPos);
				tween(node)
					.to(Vec3.distance(data.sPos, data.ePos) / 2000, { worldPosition: data.ePos })
					.call(() => {
						node.removeFromParent(true);
						//实例
						let anim = emoji_GameBase.spines[0];
						if (!fw.isValid(anim)) {
							//删除第一个元素
							emoji_GameBase.spines.splice(0, 1);
							//新建
							anim = instantiate(res);
							data.parent.addChild(anim);
							//播放完整回调
							anim.getComponent(sp.Skeleton).setCompleteListener(() => {
								emoji_GameBase.spines.push(anim);
								anim.active = false;
							});
						}
						anim.active = true;
						anim.setWorldPosition(data.ePos);
						//加特林特殊处理（翻转的问题）
						if (item.index == 1 && data.ePos.x < app.winSize.width / 2) {
							anim.mirror({ x: true }, true);
						} else {
							anim.mirror({ x: true }, false);
						}
						//音效
						if (item.audio) {
							anim.scheduleOnce(() => {
								app.audio.playEffect(item.audio);
							}, item.nAudioDelayTime ?? 0);
						}
						//播放动画
						anim.getComponent(sp.Skeleton).setAnimation(0, item.animName, false);
						//执行回调
						data.callback && data.callback(anim, data);
					})
					.start();
			});
		}
	}
	public static getEmojiDefList(): EmojiItemParam[] {
		return emoji_GameBase.list ??= [
			{
				index: 1,
				animName: `jiatelin`,
				audio: app.game.getRes(`ui/emoji/audio/gun`),
				anim: app.game.getRes(`ui/emoji/anim/emojiSpine`),
				res: app.game.getRes(`ui/emoji/img/atlas/emoji_icon_1/spriteFrame`),
			},
			{
				index: 2,
				animName: `pijiu`,
				audio: app.game.getRes(`ui/emoji/audio/cheers`),
				anim: app.game.getRes(`ui/emoji/anim/emojiSpine`),
				res: app.game.getRes(`ui/emoji/img/atlas/emoji_icon_2/spriteFrame`),
			},
			{
				index: 3,
				animName: `zhuaji`,
				nAudioDelayTime: 1.4,
				audio: app.game.getRes(`ui/emoji/audio/chicken`),
				anim: app.game.getRes(`ui/emoji/anim/emojiSpine`),
				res: app.game.getRes(`ui/emoji/img/atlas/emoji_icon_3/spriteFrame`),
			},
			{
				index: 4,
				animName: `hua`,
				nAudioDelayTime: 0.2,
				audio: app.game.getRes(`ui/emoji/audio/flower`),
				anim: app.game.getRes(`ui/emoji/anim/emojiSpine`),
				res: app.game.getRes(`ui/emoji/img/atlas/emoji_icon_4/spriteFrame`),
			},
			{
				index: 5,
				animName: `tuoxie`,
				audio: app.game.getRes(`ui/emoji/audio/shoes`),
				anim: app.game.getRes(`ui/emoji/anim/emojiSpine`),
				res: app.game.getRes(`ui/emoji/img/atlas/emoji_icon_5/spriteFrame`),
			},
			{
				index: 6,
				animName: `rengjidan`,
				audio: app.game.getRes(`ui/emoji/audio/egg`),
				anim: app.game.getRes(`ui/emoji/anim/emojiSpine`),
				res: app.game.getRes(`ui/emoji/img/atlas/emoji_icon_6/spriteFrame`),
			},
		]
	}
	/**魔法表情配置 */
	protected static list: EmojiItemParam[]
	/**聊天配置 */
	data: EmojiParam;
	setData(data: EmojiParam) {
		this.data = data ?? {};
	}
	initData() {
		emoji_GameBase.getEmojiDefList();
	}
	protected initView(): boolean | void {
		this.updateView();
	}
	updateView() {
		let index = 0;
		let list = this.data.list ?? emoji_GameBase.list;
		let childs = this.Items.Node_content.children;
		list.forEach((element: EmojiItemParam) => {
			let item = childs[index];
			if (!item) {
				item = childs[0].clone();
				this.Items.Node_content.addChild(item);
			}
			item.active = true;
			//调整样式
			app.file.updateImage({
				node: item.Items.Sprite_icon,
				bundleResConfig: element.res
			});
			//点击
			item.onClickAndScale(() => {
				//隐藏界面
				this.node.active = false;
				//发送消息
				if (this.data.playerInfo) {
					gameCenter.room.sendUseMagic(this.data.playerInfo[ACTOR.ACTOR_PROP_DBID], element.index, 1);
				} else if (this.data.nUserID) {
					gameCenter.room.sendUseMagic(this.data.nUserID, element.index, 1);
				} else {
					//TODO
				}
			});
			//索引自增
			++index;
		});
		for (let j = childs.length; index < j; ++index) {
			childs[index].active = false;
		}
	}
	updateOrientation() {
		let wPos = fw._v3;
		this.node.getWorldPosition(wPos);
		let bMirror = wPos.x > app.winSize.width / 2;
		this.node.mirror({ x: true }, bMirror);
		this.Items.Label_tip.mirror({ x: true }, bMirror);
	}
}

/**类型声明调整 */
declare global {
	namespace globalThis {
		type EmojiItemParam = {
			/**表情值（服务器） */
			index: number,
			/**表情图片 */
			res?: BundleResConfig
			/**语音资源 */
			audio?: BundleResConfig
			/**音频延迟播放时间 */
			nAudioDelayTime?: number
			/**表情动画名称 */
			animName?: string
			/**动画资源 */
			anim?: BundleResConfig
		}
		type PlayEmojiParam = {
			/**表情索引 */
			index: number
			/**表情父节点 */
			parent: ccNode
			/**开启位置（世界坐标） */
			sPos: Vec3
			/**结束位置（世界坐标） */
			ePos: Vec3
			/**自定义表情配置 */
			list?: EmojiItemParam[]
			/**回调 */
			callback?: (view: ccNode, data: PlayEmojiParam) => void
		}
		type EmojiParam = {
			/**UserID */
			nUserID?: any
			/**玩家信息 */
			playerInfo?: any
			/**自定义表情界面 */
			res?: BundleResConfig
			/**自定义表情配置 */
			list?: EmojiItemParam[]
			/**手动翻转 */
			bManual?: boolean
			/**回调 */
			callback?: (view: ccNode, data: EmojiParam) => void
		}
	}
}