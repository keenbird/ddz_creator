import { _decorator,Node, RichText, tween,Tween, UIOpacity, UITransform, v3 } from 'cc';
import { EVENT_ID } from '../../../../app/config/EventConfig';
import { EventParam } from '../../../../app/framework/manager/FWEventManager';
import { HornData, HornParams, MSG_TYPE } from '../../../../app/center/plaza/chatCenter';
import { type } from '../../../../../engine/cocos/core/data/class-decorator';
const { ccclass,property } = _decorator;
@ccclass('Laba')
export class Laba extends (fw.FWComponent) {
	/**滚动区域的parant */
	@property({ type: Node, displayName: "content" })
	content:Node;

	/**广播队列 */
	_hornQueue:HornData[];

	_factory:Map<MSG_TYPE,(data:HornParams)=>Node>;
	_delayAction: Tween<Node>;
	_moveAnimCount:number;
	_colorpart1 = "#199b28";
	_colorpart2 = "#ffffff";
	_colorpart3 = "#ff3705";

	initData() {
		this._hornQueue = [];
		this._factory = new Map();
		this._delayAction = null;
		this._moveAnimCount = 0;
		
		this._factory.set(MSG_TYPE.CHAT_SYSTEM,this.creatorChatSystem.bind(this))
		this._factory.set(MSG_TYPE.CHAT_GETPOOL,this.creatorChatSystem.bind(this))
		this._factory.set(MSG_TYPE.CHAT_GETMONEY,this.creatorChatSystem.bind(this))
		this._factory.set(MSG_TYPE.CHAT_WITHDRAW,this.creatorChatSystem.bind(this))
		this._factory.set(MSG_TYPE.CHAT_RECHARGE,this.creatorChatSystem.bind(this))
		this._factory.set(MSG_TYPE.CHAT_FISH,this.creatorChatSystem.bind(this))
	}
	protected initEvents(): boolean | void {
		this.bindEvent(EventParam.FWBindEventParam(EVENT_ID.EVENT_PLAZA_CHAT_SYSTEM, (data)=>{
			this.pushHornMsg(MSG_TYPE.CHAT_SYSTEM,data.data)
		}))
	}
	protected initView(): boolean | void {
		this.node.obtainComponent(UIOpacity).opacity = 0
	}
	protected initBtns(): boolean | void {
	
	}

	pushHornMsg(msg_type:MSG_TYPE,data:HornParams) {

		if(this._hornQueue.length > 50) this._hornQueue.shift();

		this._hornQueue.push({
			msg_type:msg_type,
			data:data,
		})

		this.autoPlayHornAnim();
	}

	autoPlayHornAnim() {
		if(this._delayAction) return ;
		if(!this.content) return ;
		if (this._hornQueue.length > 0) {
			let data:HornData = this._hornQueue.shift();
			let factory = this.getFactory(data.data.type)
			let moveTime = 0;
			if(factory) {
				let node = factory(data.data)
				node.parent = this.content
				moveTime = this.addMoveAnim(node)
			}
			let delayTime = Math.max(0,moveTime - 2)

			this._delayAction = tween(this.node).delay(delayTime).call(()=>{
				this._delayAction.stop()
				this._delayAction = null;
				this.autoPlayHornAnim();
			}).start();
		}
	}

	getFactory(msg_type:MSG_TYPE){
		if(this._factory.has(msg_type)) return this._factory.get(msg_type);
		return null;
	}

	creatorChatSystem(data:HornParams) {
		let node = new Node()
		node.obtainComponent(UITransform).anchorX = 0
		let richtext = node.addComponent(RichText);
		richtext.fontSize = 30;
		richtext.lineHeight = 30;
		richtext.verticalAlign = RichText.VerticalAlign.CENTER;
		if (data.type == MSG_TYPE.CHAT_WITHDRAW) {
			data.szChat = data.szChat.replace('[3]',this._colorpart1)
			data.szChat = data.szChat.replace('[4]',this._colorpart3)
		}
		richtext.string = `<color=${this._colorpart2}>${data.szChat}</color>`
		return node;
	}

	addMoveAnim(node:Node) {
		let moveLen = this.content.getComponent(UITransform).width;
		let labelLen = node.obtainComponent(UITransform).width
		let moveTime = (moveLen+labelLen) / 140
		node.position = fw.v3(moveLen/2,node.position.y,node.position.z)
		++this._moveAnimCount;
		tween(node)
			.by(moveTime,{position:v3(-moveLen-labelLen,0,0)})
			.call(()=>{
				node.removeFromParent(true);
				if(--this._moveAnimCount==0) {
					this.setRootNodeVisable(false)
				}
			})
			.start();
		this.setRootNodeVisable(true);
		return moveTime
	}

	setRootNodeVisable(visible:boolean) {
		this.node.obtainComponent(UIOpacity).opacity = visible ? 255 : 0
	}
}
