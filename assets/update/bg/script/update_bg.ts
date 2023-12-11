import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('update_bg')
export class update_bg extends (fw.FWComponent) {
	protected initBtns(): boolean | void {
		this.Items.Sprite_kefu.onClickAndScale(() => {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.update.res[`service/service`]
			});
		});
	}
}
