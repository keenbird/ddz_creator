import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { dynamicActivity } from '../../../plaza/activity/script/dynamicActivity';

@ccclass('dynamicActivity_SuperCashBack')
export class dynamicActivity_SuperCashBack extends dynamicActivity {
	/**活动名称 */
	activityName: string = `SuperCashBack`
	/**活动显隐控制 */
	public updateVisible() {
		let visible = false
		let nBuffNum = center.user.getBuffNum()
		if(nBuffNum == 3 && center.luckdraw.isOpen()){

		}else if(nBuffNum == 2 && app.sdk.isSdkOpen("paytask")){
			if(center.task.isTaskCashBackOpen()){
				visible = true
			}
		}else if(nBuffNum == 1){
			
		}
		return visible
	}
	/**点击活动回调 */
	public onClickActivity() {
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`superCashBack/superCashBack`],
		});
	}
}
