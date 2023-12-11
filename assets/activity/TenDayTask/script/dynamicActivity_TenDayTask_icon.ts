import { js, Label, _decorator } from 'cc';
import { string } from '../../../../engine/cocos/core/data/class-decorator';
import { ENCONTAINER_PACKET } from '../../../app/center/userCenter';
import { DF_RATE, DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { EVENT_ID } from '../../../app/config/EventConfig';
const { ccclass } = _decorator;

@ccclass('dynamicActivity_TenDayTask_icon')
export class dynamicActivity_TenDayTask_icon extends (fw.FWComponent) {
	clockTimer: number;
	loginCashTimer: number;
	progress: string = "";
	timeText: string = "";
	showTipsTimer: number;
	public initView(): boolean | void {
		let update = () => {
			if (!center.task.isShowTenDayTask(true)) {
				app.event.dispatchEvent({
					eventName: "UpdateActivityBtn",
					data: "TenDayTask"
				})
			}
			let tfonfig = center.task.getTenDayTaskConfig()
			let tgoldsNum = center.userContainer.getGoodNum(ENCONTAINER_PACKET, tfonfig.tenday_taskgoodsid)
			this.Items.text_tips_time.getComponent(Label).string = js.formatStr("%s%", Math.floor(tgoldsNum / tfonfig.max_value*100))
		}
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_TEN_DAY_TASK_ACTIVITY_DATA,
			],
			callback: (arg1, arg2) => {
				update()
			}
		});
		update()

		let tremainTime = center.task.getTenDayTaskRemainTime()
		let tday = tremainTime / (24 * 3600)
		if (tremainTime <= 24 * 3600) {
			this.clearIntervalTimer(this.loginCashTimer)
			let updateRemainTime = () => {
				let ttime = center.task.getTenDayTaskRemainTime()
				if (ttime <= 0) {
					this.clearIntervalTimer(this.loginCashTimer)
					app.event.dispatchEvent({
						eventName: "UpdateActivityBtn",
						data: "TenDayTask"
					})
				}
				let hour = Math.floor(ttime / 3600)
				let second = ttime % 60
				let min = Math.floor(ttime % 3600 / 60)
				this.Items.text_tips_day.getComponent(Label).string = js.formatStr("%s:%s:%s", app.func.formatNumberForZore(hour), app.func.formatNumberForZore(min), app.func.formatNumberForZore(second))
			}
			updateRemainTime()
			this.loginCashTimer = this.setInterval(() => {
				updateRemainTime()
			}, 1);
		} else {
			this.Items.text_tips_day.getComponent(Label).string = js.formatStr("%s days", Math.floor(tday))
		}

		let showIndex = 0
		let updateShowTips = () => {
			showIndex = showIndex + 1
			this.Items.text_tips_time.active = (showIndex % 3) == 0
			this.Items.text_tips_day.active = (showIndex % 3) == 1
			this.Items.Image_txt.active = (showIndex % 3) == 2
			this.Items.Sprite_bg.active = (showIndex % 3) != 2
		}

		this.showTipsTimer = this.setInterval(() => {
			updateShowTips()
		}, 3);
		updateShowTips()
	}
}
