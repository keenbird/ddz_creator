import { sys } from 'cc';
import { Label, _decorator } from 'cc';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
const { ccclass } = _decorator;

@ccclass('ServiceEmergency')
export class ServiceEmergency extends FWDialogViewBase {
	data: any;
	initData() {
	}
	protected initEvents(): boolean | void {

	}
	protected initView(): boolean | void {
		if (this.data.emergency_context) {
			this.Items.Text_content.getComponent(Label).string = this.data.emergency_context
		}
	}
	protected initBtns(): boolean | void {
		this.Items.Node_close.onClickAndScale(() => {
			this.onClickClose()
		})
		this.Items.btn_sure.onClickAndScale(() => {
			if (this.data.custom_url && this.data.custom_url != "") {
				sys.openURL(this.data.custom_url)
			}
			this.onClickClose()
		})
	}
}

declare global {
	namespace globalThis {
		type plaza_ServiceEmergency = ServiceEmergency
	}
}