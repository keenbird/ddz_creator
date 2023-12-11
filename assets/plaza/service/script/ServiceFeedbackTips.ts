import { _decorator } from 'cc';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
const { ccclass } = _decorator;

@ccclass('ServiceFeedbackTips')
export class ServiceFeedbackTips extends FWDialogViewBase {
	initData() {

	}
	protected initEvents(): boolean | void {

	}
	protected initView(): boolean | void {
		
		this.Items.Text_tips_t.string = fw.language.get("* You will receive our reply in the [Email ] in the lobby.\n\n* Dear Sir, Thank you very much for your feedback, we will reply you within 24 hours.")
		this.Items.Text_title.string = fw.language.get("Feedback successful")
		this.Items.Text_ok.string = fw.language.get("Okey")
	}
	protected initBtns(): boolean | void {
		this.Items.Image_ok.onClickAndScale(() => {
			app.event.dispatchEvent({
				eventName: "CloseAllServiceDialog",
			});
			this.onClickClose()
		});
	}
}
