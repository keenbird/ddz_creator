import { Label, _decorator } from 'cc';
import { LUCKY3PT_GAME_STATE } from '../../const';
import { lucky3pt } from './model/desk';
const { ccclass } = _decorator;

@ccclass('lucky3patti_waiting')
export class lucky3patti_waiting extends (fw.FWComponent) {
	private m_desk: lucky3pt.DeskBean;
	private m_clock: number;
	private m_timestamp: number;

	initData() {
		this.m_clock = 0;
		this.m_timestamp = 0;
	}
	protected initEvents(): boolean | void {
		var teventsData = [


		];
		teventsData.forEach(element => {
			this.bindEvent(
				{
					eventName: element.event,
					callback: <T>(data: T) => {
						if (element.callback) {
							element.callback(element.event, data["dict"]);
						}
					}
				}
			);
		});
	}
	protected initView(): boolean | void {
		if (LUCKY3PT_GAME_STATE.free == this.m_desk.getGameState()) {
			this.node.active = true;
			this.playClock(this.m_desk.getLeaveTime() - 1);
			// 跑宝马灯
		} else {
			this.node.active = false;
		}
	}
	protected initBtns(): boolean | void {

	}
	public setData<T>(data_: T): void {
		this.m_desk = data_["deskBean"];
	}
	update(dt): void {
		this.updateClock();
	}
	private updateClock(): void {
		let ttime: number = this.m_clock - (app.func.time() - this.m_timestamp);
		if (LUCKY3PT_GAME_STATE.free == this.m_desk.getGameState()) {
			if (0 < ttime) {
				this.Items.label_timer.obtainComponent(Label).string = `Betting: ${app.func.formatNumberForZore(ttime)}s`;
			}
		}
		this.node.active = ttime > 0;
	}

	private playClock(clock_: number): void {
		this.m_timestamp = app.func.time();
		this.m_clock = Math.max(0, clock_);
		this.updateClock();
	}

}
