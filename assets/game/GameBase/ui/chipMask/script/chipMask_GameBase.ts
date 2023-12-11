import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { ACTOR } from '../../../../../app/config/cmd/ActorCMD';

@ccclass('chipMask_GameBase')
export class chipMask_GameBase extends (fw.FWComponent) {
	/**是否是VIP */
	bVip: boolean = false
	protected initData(): boolean | void {
		//刷新标记
		this.updateState();
	}
	protected initEvents(): boolean | void {
		if (!this.bVip) {
			//充值金额发送变化
			this.bindEvent({
				eventName: [
					`UpdateChipMask`,
					ACTOR[ACTOR.ACTOR_PROP_RECHARGE_AMOUNT]
				],
				callback: () => {
					//刷新界面
					this.updateView();
				}
			});
		}
	}
	protected initView(): boolean | void {
		//--多语言处理--began------------------------------------------
		//文本
		this.Items.RichText.obtainComponent(fw.FWLanguage).bindLabel(`ChipMaskRich`);
		//精灵
		//--多语言处理--end--------------------------------------------
		this.updateView();
	}
	protected initBtns(): boolean | void {
		//前往
		this.Items.Sprite_bg.onClick(() => {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`premium/premium`],
				data: {
					languageTips1: `VIP_RECHARGE_TIPS_1`,
				},
			});
		});
	}
	/**刷新界面 */
	updateView() {
		//刷新标记
		this.updateState();
		//是否充值过
		this.node.active = !this.bVip;
		//充值成功后移除该节点
		if (this.bVip) {
			//延迟一帧的原因是（此时引擎可能还在遍历节点树，删除的话会导致遍历顺序错乱，会奔溃）
			this.scheduleOnce(() => {
				this.node.removeFromParent(true);
			});
		}
	}
	/**显隐逻辑，游戏中可自行调整 */
	updateState() {
		this.bVip = app.game.main.getRechargeState ? app.game.main.getRechargeState() : !center.user.isNotRecharged();
	}
}
