
import { _decorator, Node as ccNode } from 'cc';
import { EDITOR } from 'cc/env';
const { ccclass } = _decorator;

import { randomInt } from '../app/framework/manager/FWFunctionCommon';

@ccclass('plaza')
export class plaza extends fw.FWComponent {
	protected initView(): boolean | void {
		app.popup.showBg({
			viewConfig: fw.BundleConfig.plaza.res["plaza_bg"]
		});
		if (fw.isValid(app.runtime.plaza)) {
			app.popup.showMain({
				node: app.runtime.plaza
			});
		} else {
			app.popup.showMain({
				viewConfig: fw.BundleConfig.plaza.res["plaza_main"]
			});
		}
	}
	onViewEnter() {
		//播放背景音效
		app.audio.setDefMusic(fw.BundleConfig.plaza.res[`audio/BGM`]);
		app.audio.playMusic();
	}
	onViewExit() {
		app.audio.stopMusic();
	}
}