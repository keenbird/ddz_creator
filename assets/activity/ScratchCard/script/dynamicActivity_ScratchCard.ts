import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { dynamicActivity } from '../../../plaza/activity/script/dynamicActivity';

@ccclass('dynamicActivity_ScratchCard')
export class dynamicActivity_ScratchCard extends dynamicActivity {
	/**活动名称 */
	activityName: string = `ScratchCard`
	/**活动显隐控制 */
	public updateVisible() {
		return center.scratchCard.isScratchcardOpen()
	}
	/**点击活动回调 */
	public onClickActivity() {
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`scratchCard/scratchCard`],
		});
	}
}
