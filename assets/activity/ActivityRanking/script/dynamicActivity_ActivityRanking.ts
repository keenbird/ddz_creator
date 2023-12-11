import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { dynamicActivity } from '../../../plaza/activity/script/dynamicActivity';

@ccclass('dynamicActivity_ActivityRanking')
export class dynamicActivity_ActivityRanking extends dynamicActivity {
    /**活动名称 */
    activityName = `ActivityRanking`
    /**点击活动回调 */
    public onClickActivity() {
        //显示预加载界面
        app.popup.showDialog({
            viewConfig: fw.BundleConfig.ActivityRanking.res[`ui/main/main`],
        });
    }
}
