import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { dynamicActivity } from '../../../plaza/activity/script/dynamicActivity';

@ccclass('dynamicActivity_FreeBonus')
export class dynamicActivity_FreeBonus extends dynamicActivity {
	/**活动名称 */
	activityName: string = `FreeBonus`
	/**活动显隐控制 */
	public updateVisible() {
		return center.task.isFreeBonusOpen()
	}
	/**点击活动回调 */
	public onClickActivity() {
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`freeBoonus/freeBoonusLayer`]
		})
	}
}
