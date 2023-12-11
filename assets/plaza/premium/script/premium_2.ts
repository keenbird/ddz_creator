import { RichText, _decorator } from 'cc';
const { ccclass } = _decorator;

import { EVENT_ID } from '../../../app/config/EventConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('premium_2')
export class premium_2 extends FWDialogViewBase {
	/**界面数据 */
	popupData: PremiumDataParam_base = <any>{}
	protected initEvents(): boolean | void {
		//广场中心商城订单
		this.bindEvent({
			eventName: EVENT_ID.EVENT_PLAZA_MALL_RMBORDER,
			callback: () => {
				app.sdk.pay();
			}
		});
		//获取奖励返回
		this.bindEvent({
			eventName: EVENT_ID.EVENT_GETREWARDTIPS,
			callback: (data) => {
				this.close();
			}
		});
	}
	protected initView(): boolean | void {
		//--多语言处理--began------------------------------------------
		//文本
		this.changeTitle({ title: fw.language.get(`Oops!`) });
		//精灵
		//--多语言处理--end--------------------------------------------
		//UserID
		this.Items.Label_id.string = `ID: ${center.user.getUserID()}`;
		//刷新界面
		this.updatePopupView();
	}
	protected initBtns(): boolean | void {
		//Other
		this.Items.Node_other.onClick(() => {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`shop/shop_main`],
			});
			this.close();
		});
		//Node_addCash
		(<type_btn_common>(this.Items.Node_addCash.getComponent(`btn_common`))).setData({
			text: fw.language.get(`Add Cash`),
			styleId: 1,
			callback: () => {
				center.user.showChoose();
				this.close();
			}
		});
	}

	onCancelClickClose() {
		super.onCancelClickClose();
		if (center.user.canShowMegaGift()) {
			center.user.showMegaGift();
		}
	}

	/**刷新界面 */
	updatePopupView() {
		//RichText_1
		if (this.popupData.tips1) {
			this.Items.RichText_1.obtainComponent(RichText).string = this.popupData.tips1;
		} else {
			this.Items.RichText_1.obtainComponent(fw.FWLanguage).bindLabel(this.popupData.languageTips1 ?? `VIP_RECHARGE_TIPS_1`);
		}
		//RichText_2
		if (this.popupData.tips2) {
			this.Items.RichText_2.obtainComponent(RichText).string = this.popupData.tips2;
		} else {
			let nGoldNum = this.popupData.nGoldNum;
			if (!fw.isNull(nGoldNum)) {
				this.Items.RichText_2.obtainComponent(fw.FWLanguage).bindCustom(this.popupData.languageTips2 ?? `premium_tips_num`, (str) => {
					this.Items.RichText_2.obtainComponent(RichText).string = String.format(str, nGoldNum);
				});
			} else {
				this.Items.RichText_2.obtainComponent(fw.FWLanguage).bindCustom(this.popupData.languageTips2 ?? `premium_tips`, (str) => {
					this.Items.RichText_2.obtainComponent(RichText).string = str;
				});
			}
		}
	}
}
