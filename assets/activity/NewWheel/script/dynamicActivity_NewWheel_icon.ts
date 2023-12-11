import { js, Label, _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('dynamicActivity_NewWheel_icon')
export class dynamicActivity_NewWheel_icon extends (fw.FWComponent) {
	clockTimer: number;
	public initView(): boolean | void {
		let nBuffNum = center.user.getBuffNum();
		if (nBuffNum == 3 && center.luckdraw.isOpen()) {
			//TODO
		} else if (nBuffNum == 2 && app.sdk.isSdkOpen("paytask")) {
			//TODO
		} else if (nBuffNum == 1) {
			if (center.jeckpotdraw.isOpen() && app.sdk.isSdkOpen("firstlucky")) {
				this.clearIntervalTimer(this.clockTimer);
				let setTime = () => {
					let restTime = center.jeckpotdraw.getFinishTime() - app.func.time()
					if (restTime <= 0) {
						if (!center.jeckpotdraw.isCanDraw()) {
							center.jeckpotdraw.m_bOpen = false
							app.event.dispatchEvent({
								eventName: "UpdateActivityBtn",
								data: "NewWheel"
							});
						}
						this.clearIntervalTimer(this.clockTimer);
						this.Items.Text_time.getComponent(Label).string = "00:00:00";
						center.jeckpotdraw.setWheelTimeOver(true);
					} else {
						if (center.jeckpotdraw.m_threeTime == true) {
							center.jeckpotdraw.setWheelTimeOver(true);
							this.clearIntervalTimer(this.clockTimer);
							app.event.dispatchEvent({
								eventName: "UpdateActivityBtn",
								data: "NewWheel"
							});
						} else {
							center.jeckpotdraw.setWheelTimeOver(false);
						}
						let hour = Math.floor(restTime / 3600);
						let second = restTime % 60;
						let min = Math.floor(restTime % 3600 / 60);
						this.Items.Text_time.getComponent(Label).string = js.formatStr("%s:%s:%s", app.func.formatNumberForZore(hour), app.func.formatNumberForZore(min), app.func.formatNumberForZore(second));
						//时间小于24小时再显示
						this.Items.Image.active = hour < 24;
					}
				}
				setTime();
				this.clockTimer = this.setInterval(() => {
					setTime();
				}, 1);
			}
		}
	}
}
