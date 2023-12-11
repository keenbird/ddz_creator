import { js, RichText, Sprite, SpriteFrame, _decorator } from 'cc';
const { ccclass } = _decorator;

import { EVENT_ID } from '../../../app/config/EventConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('premium_viewBase')
export class premium_viewBase extends (fw.FWComponent) {
	/**界面数据 */
	popupData: PremiumDataParam_base = <any>{};
	setPopupData(popupData: PremiumDataParam_base) {
		this.popupData = popupData;
		//刷新界面
		this.updatePopupView();
	}
	protected initView(): boolean | void {
		//--多语言处理--began------------------------------------------
		//文本
		//精灵
		this.Items.Sprite_addCash_txt.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
			app.file.updateImage({
				node: this.Items.Sprite_addCash_txt,
				bundleResConfig: ({
					[fw.LanguageType.en]: () => { return fw.BundleConfig.plaza.res[`premium/img/atlas/vip_txt_addcash/spriteFrame`]; },
					[fw.LanguageType.brasil]: () => { return fw.BundleConfig.plaza.res[`premium/img/atlas/vip_txt_addcash_brasil/spriteFrame`]; },
				})[fw.language.languageType](),
			});
		});
		//--多语言处理--end--------------------------------------------
		//UserID
		this.Items.Label_id.string = `ID: ${center.user.getUserID()}`;
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
		this.Items.vip_num1.active = this.popupData.vipNum && this.popupData.vipNum == 1;
		this.Items.vip_num2.active = this.popupData.vipNum && this.popupData.vipNum == 2;
	}
}

declare global {
	namespace globalThis {
		type type_premium_viewBase = premium_viewBase
		type PremiumDataParam_base = {
			/**上面的提示，使用了languageTips后tips可以不用传入，富文本 */
			tips1?: string
			languageTips1?: string
			/**下面的提示，使用了languageTips后tips可以不用传入，富文本 */
			tips2?: string
			languageTips2?: string
			/**指定金额 */
			nGoldNum?: number
			/**vipNum显示控制  */
			vipNum?: number
		}
	}
}