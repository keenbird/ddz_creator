import { Label } from 'cc';
import { _decorator } from 'cc';
import { ACTOR } from '../../../app/config/cmd/ActorCMD';
import { httpConfig } from '../../../app/config/HttpConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
const { ccclass } = _decorator;

@ccclass('ServiceQuestion')
export class ServiceQuestion extends FWDialogViewBase {
	data: any;
	initData() {
		this.getData(this.data)
	}
	protected initEvents(): boolean | void {
		fw.print("ServiceQuestion =================== 22222")
		this.bindEvent({
			eventName: ["CloseAllServiceDialog",],
			callback: (arg1, arg2) => {
				this.onClickClose()
			}
		});
	}
	protected initView(): boolean | void {
		this.Items.Text_title_.string = fw.language.get("Help&Support")
		this.Items.Text_tips.string = fw.language.get("Select Question")
		this.Items.Text_other.string = fw.language.get("<< Others Support")

		this.Items.Panel_item.active = false
	}
	protected initBtns(): boolean | void {
		this.Items.Panel_close_all.onClickAndScale(() => {
			app.event.dispatchEvent({
				eventName: "CloseAllServiceDialog",
			});
		});
		this.Items.Text_other.onClickAndScale(() => {
			this.onClickClose()
		});
	}
	updateView(data) {
		var compare = function (x, y) {//比较函数
			if (x.sorts < y.sorts) {
				return -1;
			} else if (x.sorts > y.sorts) {
				return 1;
			} else {
				return 0;
			}
		}
		data.sort(compare)
		this.Items.ScrollView.Items.Layout.removeAllChildren(true)
		data.forEach((v) => {
			var item = this.Items.Panel_item.clone();
			item.active = true;
			this.Items.ScrollView.Items.Layout.addChild(item);
			item.Items.Text_content.getComponent(Label).string = v.title
			item.Items.Image_item_bg.onClick(() => {
				app.popup.showDialog({
					viewConfig: fw.BundleConfig.plaza.res[`service/service_details`],
					callback: (view, data) => {
						(<plaza_ServiceDetails>(view.getComponent(`ServiceDetails`))).data = v;
					},
				});
			})
		})
	}
	getData(data) {
		let params: any = {
			pid: data.id,
			uid: center.user.getActorProp(ACTOR.ACTOR_PROP_DBID),
		}
		params.sign = app.http.getSign(params)
		try {
			app.http.post({
				url: httpConfig.path_pay + "hall/quiz",
				params: params,
				callback: (bSuccess, response) => {
					if (bSuccess) {
						if (!fw.isNull(response) && !fw.isNull(this.Items.Panel_item)) {
							if (1 == response.status) {
								this.updateView(response.data)
							}
						}
					} else {
						fw.print("ServiceQuestion failed to pull PHP configuration!");
					}
				}
			});
		} catch (e) {

		}
	}
}

declare global {
	namespace globalThis {
		type plaza_ServiceQuestion = ServiceQuestion
	}
}