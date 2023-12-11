import { tween, Tween, v3, _decorator,Animation } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('guide_hand_2')
export class guide_hand_2 extends (fw.FWComponent) {
	/**从初始化 */
	/**自动播放 */
	@property
	bAutoPlay: boolean = false
	protected initView(): boolean | void {
		this.bAutoPlay && this.playAnim();
	}
	playAnim() {
		let pAni = this.obtainComponent(Animation);
		pAni.play("guide_hand_2");
	}
}
