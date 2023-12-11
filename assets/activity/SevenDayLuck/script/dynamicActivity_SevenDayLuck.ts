import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { dynamicActivity } from '../../../plaza/activity/script/dynamicActivity';

@ccclass('dynamicActivity_SevenDayLuck')
export class dynamicActivity_SevenDayLuck extends dynamicActivity {
	/**活动名称 */
	activityName: string = `SevenDayLuck`
	/**活动显隐控制 */
	public updateVisible() {
		let visible = false;
		let nBuffNum = center.user.getBuffNum();
		if (nBuffNum > 1) {
			visible = center.taskActive.isMultiopenSevenRewardOpen();
		}
		return visible;
	}
	/**点击活动回调 */
	public onClickActivity() {
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`siginboradLuck/siginboradLuck`]
		});
	}
}
