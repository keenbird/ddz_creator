import { EditBox, _decorator, NodeEventType } from 'cc';
const { ccclass } = _decorator;

import proto from '../../../app/center/common';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
import { DF_RATE, DF_SYMBOL, ScreenOrientationType } from '../../../app/config/ConstantConfig';

@ccclass('withdraw_account')
export class withdraw_account extends FWDialogViewBase {
	/**只在销毁时调整横竖屏状态，隐藏时不调整横竖屏状态 */
	bUpdateOnlyDestroy: boolean = true
	/**是否具有横竖屏切换功能（意思是当前界面会调整 “横竖屏” 状态），如果界面设计没有适配横竖屏，那么应该设置该属性为true，并调整_nScreenOrientation值为当前界面设计方向 */
	bHaveScreenOrientation: boolean = true
	/**调整屏幕方向 */
	_nScreenOrientation: ScreenOrientationType = ScreenOrientationType.Vertical_true
	/**数据 */
	popupData: any = {}
	/**是否是手机输入 */
	bPhone: boolean = false
	/**提现类型 */
	nWithDrawType: number
	initData() {
		//提现类型
		this.nWithDrawType = app.file.getIntegerForKey(`WithdrawType`, center.exchange.WithdrawType.CPF);
	}
	initEvents() {
		this.bindEvent({
			eventName: ["closeDialogAfterWithdraw"],
			callback: () => {
				this.onClickClose();
			}
		});
	}
	protected initView(): boolean | void {
		//调整标题
		this.changeTitle({ title: fw.language.get(`Withdraw`) });
		//多语言
		this.Items.Label_withdraw_account.string = fw.language.get(`Withdraw Amount`);
		this.Items.Node_select.Items.Label_name.string = {
			[fw.LanguageType.en]: `PIX Keys Type `,
			[fw.LanguageType.brasil]: `Tipo de chaves PIX`,
		}[fw.language.languageType];
		this.Items.Label_tips.string = {
			[fw.LanguageType.en]: `Fill in the payee's PIX account`,
			[fw.LanguageType.brasil]: `Preencha a conta PIX do beneficiário.`,
		}[fw.language.languageType];
		this.Items.Label_select.string = {
			[fw.LanguageType.en]: `Select`,
			[fw.LanguageType.brasil]: `Selecionar`,
		}[fw.language.languageType];
		this.Items.Node_name.Items.EditBox.getComponent(EditBox).placeholder = {
			[fw.LanguageType.en]: `Enter payee name`,
			[fw.LanguageType.brasil]: `Digite o nome do beneficiário`,
		}[fw.language.languageType];
		this.Items.Node_name.Items.Label_name.string = fw.language.get(`Name`);
		this.Items.Node_key.Items.EditBox.getComponent(EditBox).placeholder = {
			[fw.LanguageType.en]: `Enter the beneficiary's account`,
			[fw.LanguageType.brasil]: `Digite a conta do beneficiário`,
		}[fw.language.languageType];
		this.Items.Node_key.Items.Label_name.string = fw.language.get(`PIX key`);
		this.Items.Node_cpf.Items.EditBox.getComponent(EditBox).placeholder = {
			[fw.LanguageType.en]: `Enter your CPF`,
			[fw.LanguageType.brasil]: `Digite seu CPF`,
		}[fw.language.languageType];
		this.Items.Node_phone.Items.EditBox.getComponent(EditBox).placeholder = {
			[fw.LanguageType.en]: `Please enter.......`,
			[fw.LanguageType.brasil]: `Por favor, digite...`,
		}[fw.language.languageType];
		this.Items.Node_phone.Items.Label_name.string = {
			[fw.LanguageType.en]: `Phone `,
			[fw.LanguageType.brasil]: `Telefone`,
		}[fw.language.languageType];
		this.Items.Label_tips_okey.string = {
			[fw.LanguageType.en]: `Please confirm your information is correct`,
			[fw.LanguageType.brasil]: `Por favor, confirme que suas informações estão corretas.`,
		}[fw.language.languageType];
		//调整显示
		this.Items.Label_num.string = `${DF_SYMBOL}${(this.popupData.nWithDrawNum ?? 0) / DF_RATE}`;
		//隐藏部分界面
		this.Items.Node_touch.active = false;
	}
	protected initBtns(): boolean | void {
		this.Items.Node_touch.onClick(() => {
			this.Items.Sprite_open.angle = 0;
			this.Items.Node_touch.active = false;
		});
		this.Items.Node_open.onClick(() => {
			this.Items.Sprite_open.angle = 180;
			this.Items.Node_touch.active = true;
			//刷新位置
			this.updateViewPos();
		});
		this.Items.Node_okey.onClickAndScale(() => {
			//校验号码
			let key: string;
			if (this.bPhone) {
				key = this.Items.Node_phone.Items.TEXT_LABEL.string;
				key = app.func.stringRemoveSpace(key);
				if (!key) {
					app.popup.showToast({
						[fw.LanguageType.en]: `Phone number cannot be empty`,
						[fw.LanguageType.brasil]: `O campo Número de telefone não pode estar vazio`,
					}[fw.language.languageType]);
					return;
				}
			} else {
				key = this.Items.Node_key.Items.TEXT_LABEL.string;
				key = app.func.stringRemoveSpace(key);
				if (!key) {
					app.popup.showToast({
						[fw.LanguageType.en]: `PIX cannot be empty`,
						[fw.LanguageType.brasil]: `O campo PIX não pode estar vazio`,
					}[fw.language.languageType]);
					return;
				}
			}
			if (this.nWithDrawType == center.exchange.WithdrawType.EMAIL) {
				key = app.func.stringRemoveSpace(key);
				if (!app.func.isCorrectEmail(key)) {
					app.popup.showToast({
						[fw.LanguageType.en]: `Please enter a valid email`,
						[fw.LanguageType.brasil]: `Por favor, insira um e-mail válido`,
					}[fw.language.languageType]);
					return;
				}
			} else if (this.nWithDrawType == center.exchange.WithdrawType.PHONE) {
				if (!key.match(/^\d+$/)) {
					app.popup.showToast({
						[fw.LanguageType.en]: `Please enter a valid phone number`,
						[fw.LanguageType.brasil]: `Por favor, insira um número de telefone válido`,
					}[fw.language.languageType]);
					return;
				}
			}
			//校验名称
			let name = this.Items.Node_name.Items.TEXT_LABEL.string;
			if (!name) {
				app.popup.showToast({
					[fw.LanguageType.en]: `Name cannot be empty`,
					[fw.LanguageType.brasil]: `O campo Nome não pode estar vazio`,
				}[fw.language.languageType]);
				return;
			}
			//CPF
			let cpf = this.Items.Node_cpf.Items.TEXT_LABEL.string;
			cpf = app.func.stringRemoveSpace(cpf);
			if (this.nWithDrawType != center.exchange.WithdrawType.CPF) {
				if (!cpf) {
					app.popup.showToast({
						[fw.LanguageType.en]: `CPF cannot be empty`,
						[fw.LanguageType.brasil]: `O campo CPF não pode estar vazio`,
					}[fw.language.languageType]);
					return;
				}
			} else {
				cpf = key;
			}
			if (this.popupData.bShareWithDraw) {
				center.share.send_PLAZA_SHARE_MSG_WITHDRAW(
					this.nWithDrawType,
					this.popupData.nWithDrawNum,
					``,
					key,
					cpf,
					center.user.getActorPhone(),
					name,
				)
			} else {
				//请求
				center.exchange.sendExchangeCashOut(
					this.nWithDrawType,
					this.popupData.nWithDrawNum,
					``,
					key,
					cpf,
					center.user.getActorPhone(),
					name,
				);
			}
			//关闭界面
			this.onClickClose();
		});
		let index = 0;
		let bDefault = false;
		let switchInfo = center.user.getSwitchInfo();
		let btWithdrawType = switchInfo.btWithdrawType;
		let childs = this.Items.Node_select_view.children;
		app.func.traversalObject(center.exchange.WithdrawType, (value: number, key: string) => {
			if ((btWithdrawType & value) == 0) {
				return;
			}
			let item = childs[index];
			if (!item) {
				item = this.Items.Node_select_item.clone();
				item.parent = this.Items.Node_select_view;
			}
			item.active = true;
			//名称
			item.Items.Label.string = `${key}`;
			//回调
			if (!item.__callback) {
				item.onClick(() => {
					this.nWithDrawType = value;
					this.Items.Label_selected.string = `${key}`;
					//调整显隐
					this.bPhone = value == center.exchange.WithdrawType.PHONE;
					this.Items.Node_phone.active = this.bPhone;
					this.Items.Node_key.active = !this.bPhone;
					//缓存
					let cacheInfo: proto.plaza_exchange.Icash_out_c = JSON.safeParse(app.file.getStringForKey(`LastWithdrawInfo${this.nWithDrawType}`, `{}`)) ?? {};
					//提现名称
					this.Items.Node_name.Items.EditBox.getComponent(EditBox).string = cacheInfo.user_name ?? ``;
					if (this.bPhone) {
						//Phone
						this.Items.Node_phone.Items.EditBox.getComponent(EditBox).string = cacheInfo.account_number ?? ``;
					} else {
						//PIX
						this.Items.Node_key.Items.EditBox.getComponent(EditBox).string = cacheInfo.account_number ?? ``;
					}
					//CPF
					this.Items.Node_cpf.active = this.nWithDrawType != center.exchange.WithdrawType.CPF;
					this.Items.Node_cpf.Items.EditBox.getComponent(EditBox).string = cacheInfo.ifsc_code ?? ``;
					//关闭界面
					this.Items.Node_touch.__callback();
				});
			}
			//默认
			if (this.nWithDrawType == value) {
				item.__callback();
				bDefault = true;
			}
			++index;
		});
		//隐藏最后一条线
		if (index > 0) {
			//默认
			if (!bDefault) {
				childs[index - 1].__callback();
			}
			childs[index - 1].Items.Sprite_line.active = false;
		}
		for (; index < childs.length; ++index) {
			childs[index].active = false;
		}
		//刷新位置
		this.updateViewPos();
		this.node.on(NodeEventType.SIZE_CHANGED, () => {
			this.updateViewPos();
		});
		this.node.on(NodeEventType.TRANSFORM_CHANGED, () => {
			this.updateViewPos();
		});
	}
	updateViewPos() {
		this.scheduleOnce(() => {
			this.Items.Node_select_view.setWorldPosition(this.Items.Node_pos.worldPosition);
		});
	}
}
