import { UITransform, Vec3, _decorator, view,Node, Tween, tween, v3 } from 'cc';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
import { ACTOR } from '../../../app/config/cmd/ActorCMD';
import { DF_RATE, DF_SYMBOL } from '../../../app/config/ConstantConfig';
const { ccclass } = _decorator;
 
@ccclass('withdraw_plaza_guide')
export class withdraw_plaza_guide extends FWDialogViewBase {
	popupData:withdraw_plaza_guide_data = <any>{};
	private _sprite_withdraw:Node
	initData() {
		this._sprite_withdraw = app.popup.getMain()?.Items.Sprite_withdraw
	}
	protected initEvents(): boolean | void {
		//标记变更刷新提现列表
		this.bindEvent(
			{
				eventName: ACTOR[ACTOR.ACTOR_PROP_DAY_OVERFLOWBAG_FLAG],
				callback: (data) => {
					this.updateWithDrawList();
				}
			}
		);
	}

	protected initView(): boolean | void {
		this.updateWithDrawList();
		this.Items.Sprite_content.active = !this.popupData.withdrawGuideGame;
		if (this.popupData.withdrawGuideGame) {
			Tween.stopAllByTarget(this.Items.SC_icon_shouzi);
			tween(this.Items.SC_icon_shouzi)
				.to(1.0, { scale: v3( 0.75, 0.75, 1 ) })
				.to(1.0, { scale: v3( 0.6, 0.6, 1 ) })
				.union()
				.repeatForever()
				.start();
		}
	}
	protected initBtns(): boolean | void {
		this.Items.Sprite_mask.onClick(this.onCancelClickClose.bind(this))
		this.Items.Node_withdraw_btn.onClick(()=>{
			// if (this.popupData.callback) {
			// 	this.popupData.callback();
			// }
			app.event.dispatchEvent({ eventName: "clickWithdrawBtn", })
			this.onCancelClickClose();
		})
	}

	updateWithDrawList() {
		let showPrice = center.exchange.getShowPrice().showPrice;
		if(showPrice[0]) {
			this.Items.RichText_content.obtainComponent(fw.FWLanguage).bindParamsLabel(
				"<color=#ffffff>Click here to withdraw real game winnings to the <color=#ffff46> PIX</color>. You can withdraw money when you earn <color=#ffff46>${DF_SYMBOL}${showPrice}</color></color>",
				{
					DF_SYMBOL:DF_SYMBOL,
					showPrice:showPrice[0] / DF_RATE,
				}
			)
		}
	}

	onTransformChanged(type) {
		if (type & Node.TransformBit.POSITION) {
			this.updateGuidePos();
		}
	}

	updateGuidePos() {
		if(fw.isValid(this._sprite_withdraw)) {
			let pos = this._sprite_withdraw.getWorldPosition()
			this.Items.Node_withdraw.setWorldPosition(fw.v3(pos.x+20,pos.y,pos.z));
			this.Items.Node_withdraw_btn.setWorldPosition(fw.v3(pos.x+20,pos.y,pos.z));
			this.Items.Sprite_content.setWorldPosition(fw.v3(pos.x,pos.y-162,pos.z));
			this.Items.SC_icon_shouzi.setWorldPosition(fw.v3(pos.x+80,pos.y-20,pos.z));
		}
		let size = view.getVisibleSize()
		this.Items.Sprite_mask.getComponent(UITransform).contentSize = size;
		this.Items.Sprite_mask.setWorldPosition(size.width/2,size.height/2,0);
	}

	public onViewEnter(): void {
		this.updateGuidePos();
		if(fw.isValid(this._sprite_withdraw)) {
			this._sprite_withdraw.on(Node.EventType.TRANSFORM_CHANGED, this.onTransformChanged, this);
		}
	}

	public onViewExit(): void {
		if(fw.isValid(this._sprite_withdraw)) {
			this._sprite_withdraw.off(Node.EventType.TRANSFORM_CHANGED, this.onTransformChanged, this)
		}
	}

	showMask(): boolean {
        return false;
    }
}

declare global {
	namespace globalThis {
		type withdraw_plaza_guide_data = {
			withdrawGuideGame?: boolean;
			callback?: Function;
		}
	}
}
