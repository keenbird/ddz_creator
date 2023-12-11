import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { dynamicActivity } from '../../../plaza/activity/script/dynamicActivity';

@ccclass('dynamicActivity_Christmas')
export class dynamicActivity_Christmas extends dynamicActivity {
	/**活动名称 */
	activityName = `Christmas`
	/**点击活动回调 */
	public onClickActivity() {
		fw.print(`onClickActivity new ${this.activityName}`);
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`christmas/christmasLayer`]
		});
	}
}
