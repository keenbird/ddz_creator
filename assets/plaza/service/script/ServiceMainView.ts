import { UITransform } from 'cc';
import { color, Label } from 'cc';
import { _decorator } from 'cc';
import { ACTOR } from '../../../app/config/cmd/ActorCMD';
import { httpConfig } from '../../../app/config/HttpConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
const { ccclass } = _decorator;

@ccclass('ServiceMainView')
export class ServiceMainView extends FWDialogViewBase {
	titleColor: any;
	contentColor: any;
	initData() {
		this.titleColor = color(0xe3, 0x9e, 0x4f);
		this.contentColor = color(0xf8, 0xc3, 0x8f);
		this.getData()
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
		this.Items.Panel_item.active = false

		this.Items.Text_title_.string = fw.language.get("Help&Support")
		this.Items.Text_tips.string = fw.language.get("Quick links")
	}
	protected initBtns(): boolean | void {
		this.Items.Panel_close_all.onClickAndScale(() => {
			app.event.dispatchEvent({
				eventName: "CloseAllServiceDialog",
			});
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
			item.Items.Image_item_bg.onClickAndScale(() => {
				app.popup.showDialog({
					viewConfig: fw.BundleConfig.plaza.res[`service/service_question`],
					callback: (view, data) => {
						(<plaza_ServiceQuestion>(view.getComponent(`ServiceQuestion`))).data = v;
					},
				});
			})
		})
		let scrollSize = this.Items.ScrollView.Items.content.obtainComponent(UITransform)
		if (336 > scrollSize.height) {
			scrollSize.height = 336
		}
	}
	getData() {
		let params: any = {
			uid: center.user.getActorProp(ACTOR.ACTOR_PROP_DBID),
		}
		params.sign = app.http.getSign(params)
		try {
			app.http.post({
				url: httpConfig.path_pay + "hall/quizCategory",
				params: params,
				callback: (bSuccess, response) => {
					if (bSuccess) {
						if (!fw.isNull(response) && !fw.isNull(this.Items.Panel_item)) {
							if (1 == response.status) {
								this.updateView(response.data)
							}
						}
					} else {
						fw.print("ServiceMain failed to pull PHP configuration!");
					}
				}
			});
		} catch (e) {

		}
	}
}
