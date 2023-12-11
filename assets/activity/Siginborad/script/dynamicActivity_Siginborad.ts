import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { dynamicActivity } from '../../../plaza/activity/script/dynamicActivity';

@ccclass('dynamicActivity_Siginborad')
export class dynamicActivity_Siginborad extends dynamicActivity {
	/**活动名称 */
	activityName: string = `Siginborad`
	/**活动显隐控制 */
	public updateVisible() {
		let visible = false
		let nBuffNum = center.user.getBuffNum()
		if(nBuffNum == 1){
			visible = center.taskActive.isSevenActiveOpen()
		}
		return visible
	}
	/**点击活动回调 */
	public onClickActivity() {
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.Siginborad.res[`ui/siginborad/siginborad_panel`],
		})
	}
}
