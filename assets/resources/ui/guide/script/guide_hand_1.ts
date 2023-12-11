import { tween, Tween, v3, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('guide_hand_1')
export class guide_hand_1 extends (fw.FWComponent) {
	/**从初始化 */
	/**自动播放 */
	@property
	bAutoPlay: boolean = false
	protected initView(): boolean | void {
		this.bAutoPlay && this.playAnim();
	}
	playAnim(nScale: number = 1) {
		let s = (<any>this).__initScale ??= this.node.getScale().clone();
		Tween.stopAllByTarget(this.node);
		this.node.scale = fw.v3(s.x * 0.9 * nScale, s.y * 0.9 * nScale, s.z * 1 * nScale);
		tween(this.node)
			.to(1.0, { scale: v3(s.x * 1.1 * nScale, s.y * 1.1 * nScale, s.z * 1 * nScale) })
			.to(1.0, { scale: v3(s.x * 0.9 * nScale, s.y * 0.9 * nScale, s.z * 1 * nScale) })
			.union()
			.repeatForever()
			.start();
	}
}
