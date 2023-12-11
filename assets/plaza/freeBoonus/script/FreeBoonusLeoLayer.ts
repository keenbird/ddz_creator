import { _decorator } from 'cc';
const { ccclass } = _decorator;
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('FreeBoonusLeoLayer')
export class FreeBoonusLeoLayer extends FWDialogViewBase {
	initData() {

	}
	protected initEvents(): boolean | void {

	}
	protected initView(): boolean | void {

	}
	protected initBtns(): boolean | void {
		this.Items.close_btn.onClickAndScale(() => {
			this.onClickClose()
		});
		this.Items.Image_share.onClickAndScale(() => {
			this.onClickShare()
		});
	}
	onClickShare() {
		// manager.sdk.startWebViewPageShare()
	}
}
