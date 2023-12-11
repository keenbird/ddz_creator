import { Label, Sprite, SpriteFrame, _decorator, instantiate,Node, Prefab } from 'cc';
import { ACTOR } from '../../../../app/config/cmd/ActorCMD';
import { DF_RATE, DF_SYMBOL } from '../../../../app/config/ConstantConfig';
import { EVENT_ID } from '../../../../app/config/EventConfig';
import { plaza_main } from '../../script/plaza_main';
import { guide_hand_1 } from '../../../../resources/ui/guide/script/guide_hand_1';
const { ccclass,property } = _decorator;
 
@ccclass('Node_bonus')
export class Node_bonus extends (fw.FWComponent) {
	@property(plaza_main)
	plaza_main_ctrl: plaza_main;
	guide: Node;
	initData() {
	}
	protected initEvents(): boolean | void {
		center.user.event.bindEvent({
			eventName: [
				ACTOR.ACTOR_PROP_RECHARGE_CASHBACK,
				ACTOR.ACTOR_PROP_RECHARGE_SAVED_BONUS,
			],
			callback: this.updateBonusNum.bind(this),
			valideTarget: this
		});
		center.user.event.bindEvent({
			eventName: [
				ACTOR.ACTOR_PROP_RECHARGE_CASHBACK,
			],
			callback: this.updateBonusRed.bind(this),
			valideTarget: this
		});
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_PLAZA_BONUSGET_SUCCEED,
			],
			callback: this.updateBonusRed.bind(this),
			valideTarget: this
		});
	
	}
	protected initView(): boolean | void {
		//引导
		if (center.luckyCard.isNeedBonusTips()) {
			this.Items.Node_bonus.loadBundleRes(fw.BundleConfig.resources.res[`ui/guide/guide_hand_1`],(res: Prefab) => {
				if(this.plaza_main_ctrl) {
					let node = instantiate(res);
					this.plaza_main_ctrl.Items.Node_guide_main.addChild(node);
					this.guide = node;
					node.getComponent(guide_hand_1).playAnim(1.6);
					node.active = false;
					this.scheduleOnce(() => {
						node.active = true;
						node.setWorldPosition(this.node.getWorldPosition());
					})
				}
			});
		}
	
	}
	protected initBtns(): boolean | void {
		this.onClickAndScale(() => {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`boonus/boonus_dlg`]
			});
			//移除引导
			if (fw.isValid(this.guide)) {
				this.guide.removeFromParent(true);
				this.guide = null;
			}
		});
	}

	public onViewEnter(): void {
		super.onViewEnter();
		this.updateBonusNum();
		this.updateBonusRed();
	}


	updateBonusNum() {
		let nCash = center.user.getActorProp(ACTOR.ACTOR_PROP_RECHARGE_CASHBACK) ?? 0;
		let nBonus = center.user.getActorProp(ACTOR.ACTOR_PROP_RECHARGE_SAVED_BONUS) ?? 0;

		this.Items.Label_value.string = `${DF_SYMBOL}${nBonus / DF_RATE}`;
		this.Items.Node_Cash_value.active = nCash > 0;
		this.Items.Label_Cash_value.string = `${DF_SYMBOL}${nCash / DF_RATE}`;
	}

	updateBonusRed() {
		let nCash = center.user.getActorProp(ACTOR.ACTOR_PROP_RECHARGE_CASHBACK) ?? 0;
		this.Items.Sprite_red.active = center.luckyCard.isNeedBonusTips() && nCash > 0;
	}
}
