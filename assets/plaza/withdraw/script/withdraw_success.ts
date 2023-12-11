import { _decorator, RichText, size } from 'cc';
const { ccclass } = _decorator;

import proto from '../../../app/center/common';
import { withdraw_record } from './withdraw_record';
import { ScreenOrientationType } from '../../../app/config/ConstantConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('withdraw_success')
export class withdraw_success extends FWDialogViewBase {
	popupData: {
		nOrderId: number
	}
	protected initView(): boolean | void {
		//调整标题
		this.changeTitle({ title: fw.language.get(`Withdraw`) });
		//多语言
		this.Items.Label_tips.string = {
			[fw.LanguageType.en]: `Successful application`,
			[fw.LanguageType.brasil]: `Submissão bem sucedida`,
		}[fw.language.languageType];
		this.Items.Label_status.string = {
			[fw.LanguageType.en]: `processing`,
			[fw.LanguageType.brasil]: `processando`,
		}[fw.language.languageType];
		this.Items.RichText.getComponent(RichText).string = {
			[fw.LanguageType.en]: `<color=#75797C>1.Your application will usually be reviewed within<color=#ff0000> 24 hours</>.<br/>2.If your<color=#ff0000> withdrawal request failed</color>, the money withdrawed will be refunded to you via in-app<color=#ff0000> [Message]</></>`,
			[fw.LanguageType.brasil]: `<color=#75797C>1.Sua solicitação geralmente será revisada dentro de<color=#ff0000> 24 horas</>.<br/>2.Se o seu pedido de saque falhar, o dinheiro sacado será reembolsado para você via<color=#ff0000> [E-mail]</> no aplicativo</>`,
		}[fw.language.languageType];
		//假竖屏处理
		this.updateOrientationLayout();
		//上次的缓存数据
		let lastWithdrawInfo: proto.plaza_exchange.Icash_out_c = JSON.safeParse(app.file.getStringForKey(`LastWithdrawInfo`, `{}`)) ?? {};
		withdraw_record.updateOne(this.Items.withdraw_info_item, Object.assign(<WithdrawRecordData>{
			/**??? */
			apply_ctime: ``,
			/**时间 */
			ctime: `${app.func.time()}`,
			/**状态 */
			ex_flag: 0,
			/**名称 */
			name: lastWithdrawInfo.user_name,
			/**订单号 */
			show_id: `${this.popupData.nOrderId}`,
		}, lastWithdrawInfo));
	}
	protected initBtns(): boolean | void {
		this.Items.Node_ok.onClickAndScale(this.onClickClose.bind(this));
	}
	protected initEvents(): boolean | void {
		this.bindEvent({
			eventName: `ChangeScreenOrientation`,
			callback: () => {
				this.updateOrientationLayout();
			}
		});
	}
	updateOrientationLayout() {
		//调整角度
		switch (app.runtime.nCurScreenOrientation) {
			case ScreenOrientationType.Vertical_true:
			case ScreenOrientationType.Horizontal_false:
				this.node.angle = 0;
				break;
			case ScreenOrientationType.Vertical_false:
			case ScreenOrientationType.Horizontal_true:
			default:
				this.node.angle = 90;
				break;
		}
		this.node.size = size(app.initWinSize.height, app.initWinSize.width);
	}
}
