
import { _decorator, Node as ccNode } from 'cc';
import { EDITOR } from 'cc/env';
const { ccclass } = _decorator;

import { randomInt } from '../app/framework/manager/FWFunctionCommon';

@ccclass('login')
export class login extends fw.FWComponent {
	protected initView(): boolean | void {
		app.popup.showBg({
			viewConfig: fw.BundleConfig.resources.res["ui/bg/bg_common"]
		});
		// if (fw.isValid(app.runtime.login)) {
		// 	app.popup.showMain({
		// 		node: app.runtime.login
		// 	});
		// } else {
		// 	app.popup.showMain({
		// 		viewConfig: fw.BundleConfig.login.res["login/login_main"]
		// 	});
		// }
	}
	onViewEnter() {
		//播放背景音效
		// app.audio.setDefMusic(fw.BundleConfig.login.res[`audio/BGM`]);
		// app.audio.playMusic();
	}
	onViewExit() {
		app.audio.stopMusic();
	}
}