import { EditBox, _decorator } from 'cc';
const { ccclass } = _decorator;

import { EVENT_ID } from '../../../app/config/EventConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('withdrawInfo')
export class withdrawInfo extends FWDialogViewBase {
	protected initEvents(): boolean | void {
		this.bindEvent({
			eventName: EVENT_ID.EVENT_ACTOR_PERFECT_PAYINFORMATION,
			callback: () => {
				this.close();
				if (this.popupData?.callback) {
					this.popupData.callback();
				}else {
					//提现
					app.popup.showDialog({
						viewConfig: fw.BundleConfig.plaza.res[`withdraw/withdraw_main`],
					});
				}
			}
		});
	}
	protected initView(): boolean | void {
		//标题
		this.changeTitle({ title: fw.language.get(`Perfect Information`) });
		//多语言
		this.Items.Sprite_name.Items.Text_title.string = fw.language.get(`Name`);
		this.Items.Sprite_email.Items.Text_title.string = {
			[fw.LanguageType.en]: `Email`,
			[fw.LanguageType.brasil]: `E-mail`,
		}[fw.language.languageType];
		this.Items.Sprite_phone.Items.Text_title.string = {
			[fw.LanguageType.en]: `Mobile Number`,
			[fw.LanguageType.brasil]: `Nº de Celular`,
		}[fw.language.languageType];
		this.Items.Node_ok.Items.Label_content.string = {
			[fw.LanguageType.en]: `Submit`,
			[fw.LanguageType.brasil]: `OK`,
		}[fw.language.languageType];
		this.Items.EditBox_name.getComponent(EditBox).placeholder = {
			[fw.LanguageType.en]: `Enter your name`,
			[fw.LanguageType.brasil]: `Insira seu nome`,
		}[fw.language.languageType];
		this.Items.EditBox_email.getComponent(EditBox).placeholder = {
			[fw.LanguageType.en]: `Enter your email`,
			[fw.LanguageType.brasil]: `Insira seu email`,
		}[fw.language.languageType];
		this.Items.EditBox_phone.getComponent(EditBox).placeholder = {
			[fw.LanguageType.en]: `Enter your mobile number`,
			[fw.LanguageType.brasil]: `Insira o nº de celular `,
		}[fw.language.languageType];
		//默认值
		let phone = center.user.getWithdrawPhone() || center.user.getActorPhone();
		if (phone) {
			this.Items.EditBox_phone.getComponent(EditBox).string = phone;
		}
		let name = center.user.getRealName();
		if (name) {
			this.Items.EditBox_name.getComponent(EditBox).string = name;
		}
		let email = center.user.getEmail();
		if (email) {
			this.Items.EditBox_email.getComponent(EditBox).string = email;
		}
	}
	protected initBtns(): boolean | void {
		//提交
		this.Items.Node_ok.onClickAndScale(() => {
			this.doSubmit();
		});
	}
	/**提交 */
	doSubmit() {
		let phone = this.Items.EditBox_phone.getComponent(EditBox).string;
		if (!app.func.isCorrectPhoneNumber(phone)) {
			app.popup.showToast({
				[fw.LanguageType.en]: `Please enter a valid mobile number`,
				[fw.LanguageType.brasil]: `Por favor, insira um número de celular válido`,
			}[fw.language.languageType]);
			return;
		}
		let name = this.Items.EditBox_name.getComponent(EditBox).string;
		if (!name) {
			app.popup.showToast({
				[fw.LanguageType.en]: `Please enter a valid name`,
				[fw.LanguageType.brasil]: `Por favor, insira um nome válido`,
			}[fw.language.languageType]);
			return;
		}
		let email = app.func.stringRemoveSpace(this.Items.EditBox_email.getComponent(EditBox).string);
		if (!app.func.isCorrectEmail(email)) {
			app.popup.showToast({
				[fw.LanguageType.en]: `Please enter a valid email`,
				[fw.LanguageType.brasil]: `Por favor, insira um e-mail válido`,
			}[fw.language.languageType]);
			return;
		}
		//消息请求
		center.user.setPayInfo(phone, name, email);
	}
}

declare global {
	namespace globalThis {
		type withdrawInfoDataParam = {
			callback?: () => void
		}
	}
}