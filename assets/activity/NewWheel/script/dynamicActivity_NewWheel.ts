import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { dynamicActivity } from '../../../plaza/activity/script/dynamicActivity';

@ccclass('dynamicActivity_NewWheel')
export class dynamicActivity_NewWheel extends dynamicActivity {
	/**活动名称 */
	activityName: string = `NewWheel`
	/**活动显隐控制 */
	public updateVisible() {
		let visible = false
		let nBuffNum = center.user.getBuffNum()
		if (nBuffNum == 3 && center.luckdraw.isOpen()) {
			//TODO
		} else if (nBuffNum == 2 && app.sdk.isSdkOpen("paytask")) {
			//TODO
		} else if (nBuffNum == 1) {
			if (center.jeckpotdraw.isOpen() && app.sdk.isSdkOpen("firstlucky")) {
				visible = true
				let restTime = center.jeckpotdraw.getFinishTime() - app.func.time()
				if (restTime <= 0) {
					//TODO
				} else {
					if (center.jeckpotdraw.m_threeTime == true) {
						center.jeckpotdraw.setWheelTimeOver(true)
						visible = false
					}
				}
			}
		}
		return visible
	}
	/**点击活动回调 */
	public onClickActivity() {
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`newWheel/wheelDlg_new`]
		})
	}
}
