import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { dynamicActivity } from '../../../plaza/activity/script/dynamicActivity';

@ccclass('dynamicActivity_Wheel')
export class dynamicActivity_Wheel extends dynamicActivity {
	/**活动名称 */
	activityName: string = `Wheel`
	/**活动显隐控制 */
	public updateVisible() {
		let visible = false
		let nBuffNum = center.user.getBuffNum()
		if(nBuffNum == 3 && center.luckdraw.isOpen()){
			let userData = center.luckdraw.getUserData()
			if (!(userData.nDrawTimes >= 6 || ! app.sdk.isSdkOpen("luckyspin"))) {
				visible = true
			}
		}else if(nBuffNum == 2 && app.sdk.isSdkOpen("paytask")){

		}else if(nBuffNum == 1){
			
		}
		return visible
	}
	/**点击活动回调 */
	public onClickActivity() {
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`wheel/wheelDlg`]
		})
	}
}
