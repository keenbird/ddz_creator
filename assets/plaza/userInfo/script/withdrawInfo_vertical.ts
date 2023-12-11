import { _decorator } from 'cc';
import { ScreenOrientationType } from '../../../app/config/ConstantConfig';
import { EVENT_ID } from '../../../app/config/EventConfig';
const { ccclass } = _decorator;

import { withdrawInfo } from './withdrawInfo';

@ccclass('withdrawInfoVertical')
export class withdrawInfoVertical extends withdrawInfo {
	/**是否具有横竖屏切换功能（意思是当前界面会调整 “横竖屏” 状态），如果界面设计没有适配横竖屏，那么应该设置该属性为true，并调整_nScreenOrientation值为当前界面设计方向 */
	bHaveScreenOrientation: boolean = true
	/**调整屏幕方向 */
	_nScreenOrientation: ScreenOrientationType = ScreenOrientationType.Vertical_true

	/**界面数据 */
	popupData: withdrawInfoDataParam = <any>{}

	protected initEvents(): boolean | void {
		this.bindEvent({
			eventName: EVENT_ID.EVENT_ACTOR_PERFECT_PAYINFORMATION,
			callback: () => {
				this.close();
				this.popupData.callback?.();
			}
		});
	}
}

