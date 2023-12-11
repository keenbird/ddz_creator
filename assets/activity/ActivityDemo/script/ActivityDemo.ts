import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { dynamicActivityBase } from '../../../plaza/activity/script/dynamicActivityBase';

@ccclass('ActivityDemo')
export class ActivityDemo extends dynamicActivityBase {
	onClickActivity() {
		fw.print(`ActivityDemo`)
	}
}
