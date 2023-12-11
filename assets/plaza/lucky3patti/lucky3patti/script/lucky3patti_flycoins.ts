import { Label, math, tween, UITransform, v2, v3, _decorator } from 'cc';
import { isNull } from '../../const';
import { lucky3pt } from './model/desk';
const { ccclass } = _decorator;

@ccclass('lucky3patti_flycoins')
export class lucky3patti_flycoins extends (fw.FWComponent) {
	initData() {

	}
	protected initEvents(): boolean | void {

	}
	protected initView(): boolean | void {

	}
	protected initBtns(): boolean | void {

	}
	// public setData<T>(data_: T): void {
	// 	this.m_desk = data_["deskBean"];
	// }
	/**
	 * 动画时间不能超过2秒
	 * @param data_ 金币数据
	 */
	public runCoinsFly<T>(data_: T): void {
		var tnum: string = data_["num"].toString();
		if (0 < data_["num"]) {
			tnum = "+" + tnum;
		}
		var tdelayTime: number = 0;
		var tflyTime: number = 0.3;
		if (data_["flag"] && null != data_["area"]) {
			tdelayTime = math.randomRange(0, 5) / 10;
			tflyTime = 0.2;
		}
		this.node.active = false;
		this.node.setPosition(this.node.position.x, 0);
		tween(this.node)
			.delay(tdelayTime)
			.call(() => {
				this.node.active = true;
				this.Items.label_coins.obtainComponent(Label).string = tnum;
				if (data_["changeNum"]) {
					data_["changeNum"]()
				}
			})
			.to(tflyTime, { position: v3(0, 50) })
			.delay(0.4)
			.call(() => {
				// 下注结束动画
				if (data_["callback"]) {
					data_["callback"]();
				}
			})
			.start();
	}
}
