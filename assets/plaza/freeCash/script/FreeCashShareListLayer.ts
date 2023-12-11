import { tween } from 'cc';
import { UITransform } from 'cc';
import { Label } from 'cc';
import { _decorator } from 'cc';
import { DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { httpConfig } from '../../../app/config/HttpConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
const { ccclass } = _decorator;

@ccclass('FreeCashShareListLayer')
export class FreeCashShareListLayer extends FWDialogViewBase {
	initData() {

	}
	protected initEvents(): boolean | void {

	}
	protected initView(): boolean | void {
		this.Items.Label_title.string = fw.language.getString("Invitation List")
		this.Items.txt_name.string = fw.language.getString("number")
		this.Items.txt_time.string = fw.language.getString("time")
		this.Items.txt_state.string = fw.language.getString("state")
		this.Items.txt_bonus.string = fw.language.getString("bonus")
		this.Items.list_item.active = false
		this.getShareList()
	}
	protected initBtns(): boolean | void {
		this.Items.Node_close.onClickAndScale(() => {
			this.onClickClose()
		});
	}
	updateView(data) {
		//fw.dump(data)
		this.Items.ListView_share.Items.content.removeAllChildren(true)
		if (data && data.length > 0) {
			data.forEach((v, index) => {
				// tween(this.Items.ListView_share)
				// 	.delay(0.1 * index)
				// 	.call(() => {
						var task = this.Items.list_item.clone();
						task.active = true;
						this.Items.ListView_share.Items.content.addChild(task);
						this.updataList(task, v)
					// })
					// .start();
			})
		}

	}
	updataList(item, data) {
		item.Items.number.getComponent(Label).string = data.phone
		item.Items.time.getComponent(Label).string = data.ctime
		//item.Items.state.getComponent(Label).string = data.bstatus//只会返回一种状态 valid
		item.Items.bonus.getComponent(Label).string = DF_SYMBOL + data.bonus
	}
	getShareList() {
		let params: any = {
			user_id: center.user.getUserID(),
			timestamp: app.func.time(),
		}
		params.sign = app.http.getSign(params)
		try {
			app.http.post({
				url: httpConfig.path_pay + "User/getUserInviteLog",
				params: params,
				callback: (bSuccess, response) => {
					if (bSuccess) {
						if (!fw.isNull(response)) {
							if (1 == response.status) {
								this.updateView(response.data)
							}
						}
					} else {
						fw.print("getShareList failed to pull PHP configuration!");
					}
				}
			});
		} catch (e) {

		}
	}
}
