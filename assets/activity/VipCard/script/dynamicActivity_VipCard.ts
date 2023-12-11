import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { dynamicActivity } from '../../../plaza/activity/script/dynamicActivity';

@ccclass('dynamicActivity_VipCard')
export class dynamicActivity_VipCard extends dynamicActivity {
	/**活动名称 */
	activityName: string = `VipCard`
	/**活动显隐控制 */
	public updateVisible() {
		return center.luckyCard.isLuckCardOpen().isopen
	}
	/**点击活动回调 */
	public onClickActivity() {
		fw.print(`onClickActivity new ${this.activityName}`);
		center.luckyCard.showVipCardView()
	}
}
