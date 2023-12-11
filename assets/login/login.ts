
import { _decorator } from 'cc';
import { FWSceneBase } from '../app/framework/view/FWSceneBase';
const { ccclass } = _decorator;

@ccclass('login')
export class login extends FWSceneBase {
	initData() {
	}
	protected initEvents(): boolean | void {

	}
	protected initView(): boolean | void {
		app.popup.showMain({
			viewConfig: fw.BundleConfig.login.res["login/login_main"],
		});
	}
	protected initBtns(): boolean | void {

	}
}
