import { _decorator, Tween, tween, v3 } from 'cc';
const { ccclass } = _decorator;

@ccclass('bubble')
export class bubble extends (fw.FWComponent) {
	stopAnim() {
		Tween.stopAllByTarget(this.node);
	}
	playAnim() {
		tween(this.node)
			.to(0.2, { eulerAngles: v3(0, 0, 2) })
			.to(0.2, { eulerAngles: v3(0, 0, -2) })
			.union()
			.repeatForever()
			.start();
	}
}
