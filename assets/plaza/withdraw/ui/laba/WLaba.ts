import { _decorator } from 'cc';
import { MSG_TYPE } from '../../../../app/center/plaza/chatCenter';
import { Laba } from '../../../plaza/ui/laba/Laba';
const { ccclass,property } = _decorator;

@ccclass('WLaba')
export class WLaba extends Laba {
	// _colorpart1 = "#199b28";
	_colorpart2 = "#412727";
	// _colorpart3 = "#ff3705";

	protected initView(): boolean | void {
		super.initView()
		this.pushHornMsg()
	}

	pushHornMsg() {
		this._hornQueue = center.chat.getWLabaData()
		this.autoPlayHornAnim();
	}
}
