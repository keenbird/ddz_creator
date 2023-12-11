import { EditBox, Label, Layout, Sprite, _decorator } from 'cc';
const { ccclass } = _decorator;

import { EVENT_ID } from '../../../app/config/EventConfig';
import { httpConfig } from '../../../app/config/HttpConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('bindMobile')
export class bindMobile extends FWDialogViewBase {
	protected initEvents(): boolean | void {
		//绑定成功
		this.bindEvent({
			eventName: EVENT_ID.EVENT_ACTOR_BINDING_PHONE,
			callback: () => {
				this.onClickClose();
			}
		});
	}
	protected initView(): boolean | void {
		//标题
		this.changeTitle({
			title: {
				[fw.LanguageType.en]: `Bind Number`,
				[fw.LanguageType.brasil]: `Vincular Telefone`,
			}[fw.language.languageType],
		});
		//多语言
		this.Items.Sprite_phone.Items.Text_title.string = {
			[fw.LanguageType.en]: `Mobile Number`,
			[fw.LanguageType.brasil]: `Nº de Celular`,
		}[fw.language.languageType];
		this.Items.Sprite_code.Items.Text_title.string = {
			[fw.LanguageType.en]: `Verification Code`,
			[fw.LanguageType.brasil]: `Código de verificação`,
		}[fw.language.languageType];
		this.Items.Label_otp.string = fw.language.get(`Get OTP`);
		this.Items.Text_tips.string = {
			[fw.LanguageType.en]: `Note: You could login via Phone&OTP later.`,
			[fw.LanguageType.brasil]: `Atenção: você pode logar com o nº de celular e código de verificação posteriormente.`,
		}[fw.language.languageType];
		this.Items.Node_ok.Items.Label_content.string = {
			[fw.LanguageType.en]: `Submit`,
			[fw.LanguageType.brasil]: `OK`,
		}[fw.language.languageType];
		this.Items.EditBox_phone.getComponent(EditBox).placeholder = {
			[fw.LanguageType.en]: `Enter your mobile number`,
			[fw.LanguageType.brasil]: `Insira o nº de celular `,
		}[fw.language.languageType];
		this.Items.EditBox_code.getComponent(EditBox).placeholder = {
			[fw.LanguageType.en]: `Enter your OTP`,
			[fw.LanguageType.brasil]: `Insira o código de verificação`,
		}[fw.language.languageType];
	}
	protected initBtns(): boolean | void {
		//OTP
		this.Items.Sprite_otp.onClick(() => {
			if ((<any>this).otpFunc) {
				return;
			}
			this.doGetOTP();
		});
		//提交
		this.Items.Node_ok.onClickAndScale(() => {
			this.doSubmit();
		});
	}
	/**OTP */
	doGetOTP() {
		let phone = this.Items.EditBox_phone.getComponent(EditBox).string;
		if (!app.func.isCorrectPhoneNumber(phone)) {
			app.popup.showToast({
				[fw.LanguageType.en]: `Please enter a valid mobile number`,
				[fw.LanguageType.brasil]: `Por favor, insira um número de celular válido`,
			}[fw.language.languageType]);
			return;
		}
		//获取验证码
		center.user.getVerification({
			phone: phone,
			type: 2,
		}, (bSuccess) => {
			//成功后进行倒计时
			if (!bSuccess) {
				return;
			}
			let nTime = 60;
			let nTimeEx = app.func.time();
			let func = (<any>this).otpFunc;
			this.unschedule(func);
			func = (<any>this).otpFunc = () => {
				let nTimeDiff = app.func.time() - nTimeEx;
				let nTimeLeft = nTime - nTimeDiff;
				if (nTimeLeft <= 0) {
					this.unschedule(func);
					(<any>this).otpFunc = null;
					this.Items.Label_otp.string = fw.language.get(`Get OTP`);
					this.Items.Sprite_otp.getComponent(Sprite).grayscale = false;
				} else {
					this.Items.Label_otp.string = `${nTimeLeft}s`;
				}
			}
			this.schedule(func, 0.5);
			this.Items.Sprite_otp.getComponent(Sprite).grayscale = true;
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
		let code = this.Items.EditBox_code.getComponent(EditBox).string;
		if (!code) {
			app.popup.showToast({
				[fw.LanguageType.en]: `Please enter the verification code.`,
				[fw.LanguageType.brasil]: `Por favor, insira o código de verificação.`,
			}[fw.language.languageType]);
			return;
		}
		//绑定手机
		center.user.doBindPhone(phone, code);
	}
}
