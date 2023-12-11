import { UITransform } from 'cc';
import { Label, _decorator } from 'cc';
import { httpConfig } from '../../../app/config/HttpConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
const { ccclass } = _decorator;

@ccclass('ServiceDetails')
export class ServiceDetails extends FWDialogViewBase {
	bIsRechargeQuestion: boolean;
	data: any;
	initData() {
		this.bIsRechargeQuestion = this.data.is_payment == 1
	}
	protected initEvents(): boolean | void {
		this.bindEvent({
			eventName: ["CloseAllServiceDialog",],
			callback: (arg1, arg2) => {
				this.onClickClose()
			}
		});
	}
	protected initView(): boolean | void {
		this.Items.Text_title_.string = fw.language.get("Help&Support")
		this.Items.Text_select.string = "<< " + fw.language.get("Select Question")
		this.Items.Text_go.string = fw.language.get("I still need help >>")
		

		this.Items.Text_tips.getComponent(Label).string = this.data.title
		this.Items.Text_content.getComponent(Label).string = this.data.content
		this.Items.Text_content.getComponent(Label).updateRenderData(true);
		let labelsize = this.Items.Text_content.obtainComponent(UITransform)
		let scrollSize = this.Items.ScrollView.Items.content.obtainComponent(UITransform)
		if (labelsize.height > scrollSize.height) {
			scrollSize.height = labelsize.height
		}
	}
	protected initBtns(): boolean | void {
		this.Items.Panel_close_all.onClickAndScale(() => {
			app.event.dispatchEvent({
				eventName: "CloseAllServiceDialog",
			});
		});
		this.Items.Image_go.onClickAndScale(() => {
			this.onClickGo()
		});
		this.Items.Text_select.onClickAndScale(() => {
			this.onClickClose()
		});
	}
	onClickGo() {
		if (this.bIsRechargeQuestion) {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`shop/shop_record`],
			});
		} else {
			let serviceEmergencyInfo = center.user.getServiceEmergencyInfo()
			if (serviceEmergencyInfo) {
				if (serviceEmergencyInfo.show_emergency == 2) {
					app.sdk.emergency()
				} else {
					app.popup.showDialog({
						viewConfig: fw.BundleConfig.plaza.res[`service/service_feedback`],
						callback: (view, data) => {
							(<plaza_ServiceFeedback>(view.getComponent(`ServiceFeedback`))).data = this.data;
						},
					});
				}
			} else {
				this.getServiceEmergencyInfo()
			}
		}
	}
	getServiceEmergencyInfo() {
		let params: any = {
			channel: app.native.device.getOperatorsID(),
			timestamp: app.func.time(),
		}
		params.sign = app.http.getSign(params)
		try {
			app.http.post({
				url: httpConfig.path_pay + "hall/emergencyService",
				params: params,
				callback: (bSuccess, response) => {
					if (bSuccess) {
						if (!fw.isNull(response)) {
							if (1 == response.status) {
								center.user.setServiceEmergencyInfo(response.data)
								if (!fw.isNull(this.Items.Image_go)) {
									this.onClickGo()
								}
							}
						}
					} else {
						fw.print("ServiceDetails failed to pull PHP configuration!");
					}
				}
			});
		} catch (e) {

		}
	}
}

declare global {
	namespace globalThis {
		type plaza_ServiceDetails = ServiceDetails
	}
}