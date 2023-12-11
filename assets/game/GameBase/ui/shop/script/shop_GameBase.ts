import { _decorator } from 'cc';
const { ccclass } = _decorator;
 
@ccclass('shop_GameBase')
export class shop_GameBase extends (fw.FWComponent) {
	protected initBtns(): boolean | void {
		this.node.onClickAndScale(() => {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`shop/shop_main`]
			});
		});
	}
}
