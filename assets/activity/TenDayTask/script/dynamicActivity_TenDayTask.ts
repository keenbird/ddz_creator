import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { dynamicActivity } from '../../../plaza/activity/script/dynamicActivity';

@ccclass('dynamicActivity_TenDayTask')
export class dynamicActivity_TenDayTask extends dynamicActivity {
	/**活动名称 */
	activityName: string = `TenDayTask`
	/**活动显隐控制 */
	public updateVisible() {
		let visible = center.task.isShowTenDayTask(true)
		return visible
	}
	/**点击活动回调 */
	public onClickActivity() {
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`tenDayTask/TenDayTask`],
		})
	}
}
