import { _decorator, v3 } from 'cc';
import { lucky3pt } from './model/desk';
const { ccclass } = _decorator;

@ccclass('lucky3patti_records_item')
export class lucky3patti_records_item extends (fw.FWComponent) {
	private m_startY: number;
	initData() {

	}
	protected initEvents(): boolean | void {

	}
	protected initView(): boolean | void {
		this.Items.image_trend_bg.active = false;
		this.m_startY = this.Items.image_trend_bg.position.y;
	}
	protected initBtns(): boolean | void {

	}
	public setTrendData(data_: lucky3pt.GameTrend): void {
		this.Items.image_trend_bg.active = true;
		this.Items.image_trend_bg.setPosition(v3(this.Items.image_trend_bg.position.x, this.m_startY + data_.nCardType * 34));
	}
}
