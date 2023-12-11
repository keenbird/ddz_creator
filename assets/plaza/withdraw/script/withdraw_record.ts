import { Label, color, Sprite, Node as ccNode, _decorator, js, Color, UITransform } from 'cc';
const { ccclass } = _decorator;

import { ACTOR } from '../../../app/config/cmd/ActorCMD';
import { httpConfig } from '../../../app/config/HttpConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
import { DF_RATE, GrayColor, ScreenOrientationType } from '../../../app/config/ConstantConfig';
import { FWReuseItemScrollView } from '../../../app/framework/extensions/FWReuseItemScrollView';

@ccclass('withdraw_record')
export class withdraw_record extends FWDialogViewBase {
	/**是否具有横竖屏切换功能（意思是当前界面会调整 “横竖屏” 状态），如果界面设计没有适配横竖屏，那么应该设置该属性为true，并调整_nScreenOrientation值为当前界面设计方向 */
	bHaveScreenOrientation: boolean = true
	/**调整屏幕方向 */
	_nScreenOrientation: ScreenOrientationType = ScreenOrientationType.Vertical_false
	/**状态信息 */
	static Status: { name: string, color: Color }[]
	/**ok按钮回调 */
	okCallback: Function
	/**初始化静态数据 */
	static initStaticData() {
		withdraw_record.Status = [
			//0, 发起提现 Applying
			{
				name: fw.language.get(`Processing`),
				color: color(0xff, 0x9e, 0x47)
			},
			//1, 审核通过，第三方平台处理中
			{
				name: fw.language.get(`Processing`),
				color: color(0xff, 0x9e, 0x47)
			},
			//2, 提现成功
			{
				name: fw.language.get(`Successed`),
				color: color(0x2f, 0xd4, 0x5a)
			},
			//3, 审核拒绝
			{
				name: fw.language.get(`Refuse`),
				color: color(0xff, 0x64, 0x6c)
			},
			//4, 提现失败
			{
				name: fw.language.get(`Failed`),
				color: color(0xff, 0x64, 0x6c)
			},
			//5, 已结束
			{
				name: fw.language.get(`Failed`),
				color: color(0xff, 0x64, 0x6c)
			},
			//6, 取消删除
			{
				name: fw.language.get(`Please select the record to delete`),
				color: color(0xff, 0x64, 0x6c)
			},
			//7, Opps
			{
				name: fw.language.get(`Oops!`),
				color: color(0xff, 0x64, 0x6c)
			},
			//8, 确定删除tips
			{
				name: fw.language.get(`The deleted record cannot be recovered. Are you sure you want to delete it?`),
				color: color(0xff, 0x64, 0x6c)
			},
			//9, 取消删除
			{
				name: fw.language.get(`Cancel`),
				color: color(0xff, 0x64, 0x6c)
			},
			//10, 确定删除
			{
				name: fw.language.get(`Ok`),
				color: color(0xff, 0x64, 0x6c)
			},
		];
	}
	protected initData(): boolean | void {
		withdraw_record.initStaticData();
		this.getWithdrawRecord();
	}
	protected initView(): boolean | void {
		//调整标题
		this.changeTitle({
			title: {
				[fw.LanguageType.en]: `WITHDRAW RECORD`,
				[fw.LanguageType.brasil]: `Histórico de saques`,
			}[fw.language.languageType]
		});
		this.Items.Label_reward_tips.string = {
			[fw.LanguageType.en]: `Order processing in 1-7 working days,please be patient.`,
			[fw.LanguageType.brasil]: `Processamento do pedido em 1-7 dias úteis, por favor, tenha paciência.`,
		}[fw.language.languageType];
		this.Items.Label_reward_tips.active = false
		this.Items.Label_depsrit.string = {
			[fw.LanguageType.en]: ` 1. Usually your withdrawal will be processed immediately, generally within 24 hours. But sometimes it takes 1-7 days to process.\n\n2. After the withdrawal status is successful, the account may be delayed.\n\n3. If you have any questions about the withdrawal order, please contact us.`,
			[fw.LanguageType.brasil]: `1.Normalmente, o seu saque será processado imediatamente, geralmente dentro de 24 horas. Mas às vezes pode levar de 1 a 7 dias para ser processado.\n\n2.Após o status do saque ser bem sucedido, a conta pode sofrer atrasos.\n\n3.Se você tiver alguma dúvida sobre o pedido de saque, entre em contato conosco.`,
		}[fw.language.languageType];
		//玩家id
		this.Items.Label_userId.obtainComponent(Label).string = js.formatStr(`(ID %s)`, center.user.getActorProp(ACTOR.ACTOR_PROP_DBID));
		//隐藏
		this.Items.Node_item.active = false;
		this.Items.Node_item_real.active = false;
	}
	protected initBtns(): boolean | void {
		this.showView();
		this.Items.Node_touch.onClick(() => {
			this.showView();
		});
		this.Items.Sprite_tips.onClickAndScale(() => {
			this.Items.Label_depsrit.string = `1.Usually your withdrawal will be processed immediately, normally it will not exceed 24 hours. But sometimes the bank takes 1-7 days to process.\n\n2.There may be a delay in disbursement to your bank account after the order state being successful. And delay days depend on the withdrawal way you choose.\n\n3.If you have problems with the order, please contact us.`;
			this.showView(true, this.Items.Node_tips, this.Items.Node_tips_content);
		});
		this.Items.Node_tips.Items.Node_sure.onClickAndScale(() => {
			this.okCallback?.();
			this.okCallback = null;
			this.showView();
		});
		this.Items.Node_tips.Items.Node_close.onClickAndScale(() => {
			this.showView();
		});
	}
	/**显示界面 */
	showView(bVisible?: boolean, view?: ccNode, child?: ccNode) {
		if (view) {
			if ((<any>this).exView) {
				(<any>this).exView.active = false;
				(<any>this).exView = null;
			}
			(<any>this).exView = view;
			bVisible = bVisible ?? !view.active;
			if (child) {
				child.active = bVisible;
			}
			(<any>this).exView.active = bVisible;
			this.Items.Node_touch.active = bVisible;
		} else {
			if ((<any>this).exView) {
				(<any>this).exView.active = false;
				(<any>this).exView = null;
			}
			this.Items.Node_contents.children.forEach(element => {
				element.active = false;
			});
			this.Items.Node_touch.active = false;
		}
	}
	/**刷新单个 */
	static updateOne(item: ccNode, recordData: WithdrawRecordData) {
		withdraw_record.initStaticData();
		//标题
		item.Items.Label_title_1.string = fw.language.get(`Name`);
		item.Items.Label_title_2.string = fw.language.get(`PIX key`);
		item.Items.Label_title_3.string = fw.language.get(`Withdraw ID`);
		item.Items.Label_title_amount.string = fw.language.get(`Withdraw Amount`);
		//金额
		item.Items.Label_amount.string = `${app.func.toNumber(recordData.money) / DF_RATE}`;
		//状态
		let statusInfo = withdraw_record.Status[recordData.ex_flag];
		item.Items.Label_status.string = statusInfo.name;
		item.Items.Sprite_status.getComponent(Sprite).color = statusInfo.color;
		//订单号
		item.Items.Label_orderId.string = recordData.show_id;
		//名称
		item.Items.Label_value_1.string = recordData.name;
		//帐号
		item.Items.Label_value_2.string = recordData.account_number;
		//时间
		item.Items.Label_value_3.string = app.func.time_HM_DMY(recordData.ctime).replace(/\s+/, `\n`);
	}
	/**刷新单个 */
	updateOneItem(item: ccNode, recordData: WithdrawRecordData) {
		let statusInfo = withdraw_record.Status[recordData.ex_flag];
		withdraw_record.updateOne(item, recordData);
		if (item.Items.Label_value_4) {
			if (statusInfo.name == fw.language.get(`Failed`)) {
				item.Items.Label_value_4.string = ({
					[fw.LanguageType.en]: `Why failed?`,
					[fw.LanguageType.brasil]: `Por que falhou?`,
				})[fw.language.languageType];
				item.Items.Label_value_4.onClick(() => {
					this.Items.Label_depsrit.string = ({
						[fw.LanguageType.en]: `1. Please select the correct PIX keys type when withdrawing money.\n\n2. If you have successfully withdrawn before, you do not need to modify the withdrawal information, please initiate the withdrawal again later.\n\n3. If you have any questions, please contact us in time.`,
						[fw.LanguageType.brasil]: `1.Por favor, selecione o tipo correto de chave PIX ao efetuar o saque.\n\n2.Se você já fez um saque com sucesso antes, não é necessário modificar as informações de saque. Por favor, inicie o saque novamente mais tarde.\n\n3.Se tiver alguma dúvida, entre em contato conosco o mais breve possível.`,
					})[fw.language.languageType];
					this.showView(true, this.Items.Node_tips, this.Items.Node_tips_content);
				});
			}
			else if (statusInfo.name == fw.language.get(`Successed`)) {
				let str = app.file.getStringFromUserFile({
					filePath: `feedback/order${recordData.show_id}`,
				});
				if (str) {
					item.Items.Label_value_4.string = `Already feedback`;
					item.Items.Label_value_4.getComponent(Label).color = GrayColor;
				} else {
					item.Items.Label_value_4.string = `Not Received`;
					item.Items.Label_value_4.getComponent(Label).color = app.func.color(`#000000`);
				}
				item.Items.Label_value_4.onClick(() => {
					this.Items.Node_tips.Items.Label_title.string = ({
						[fw.LanguageType.en]: `Not receive money?`,
						[fw.LanguageType.brasil]: `Não recebi o dinheiro?`,
					})[fw.language.languageType];
					this.Items.Label_no_money.string = ({
						[fw.LanguageType.en]: `1. If you do have any questions about the withdrawal, please feedback to us and we will verify it.\n\n2. Dishonest behavior will not be dealt with.`,
						[fw.LanguageType.brasil]: `1.Se você tiver alguma dúvida sobre o saque, por favor, nos informe e iremos verificar.\n\n2.Comportamento desonesto não será tolerado.`,
					})[fw.language.languageType];
					withdraw_record.updateOne(this.Items.Node_no_money, recordData);
					this.okCallback = () => {
						app.popup.showDialog({
							viewConfig: fw.BundleConfig.plaza.res[`withdraw/withdraw_feedback`],
							data: {
								recordData: recordData,
							},
						});
					}
					this.showView(true, this.Items.Node_tips, this.Items.Node_no_money);
				});
			}
			else if (statusInfo.name == fw.language.get(`Processing`)) {
				let nDiffTime = 24 * 60 * 60 - (app.func.time() - app.func.toNumber(recordData.ctime));
				let func = () => {
					let str = app.file.getStringFromUserFile({
						filePath: `feedback/order${recordData.show_id}`,
					});
					if (str) {
						item.Items.Label_value_4.string = `Help again`;
						item.Items.Label_value_4.getComponent(Label).color = GrayColor;
					} else {
						item.Items.Label_value_4.string = `Help`;
						item.Items.Label_value_4.getComponent(Label).color = app.func.color(`#000000`);
					}
					this.Items.Node_tips.Items.Label_title.string = ({
						[fw.LanguageType.en]: `Why is it in progress?`,
						[fw.LanguageType.brasil]: `Por que está em andamento?`,
					})[fw.language.languageType];
					item.Items.Label_value_4.onClick(() => {
						this.Items.Label_depsrit.string = ({
							[fw.LanguageType.en]: `1. Withdrawals will usually arrive within 5 minutes.\n\n2. Occasionally, system upgrades will take longer to process, but generally within 24 hours.\n\n3. Please be patient and contact us in time if you have any questions.`,
							[fw.LanguageType.brasil]: `1.Os saques geralmente chegam em até 5 minutos.\n\n2.Ocasionalmente, atualizações do sistema podem levar mais tempo para serem processadas, mas geralmente dentro de 24 horas.\n\n3.Por favor, tenha paciência e entre em contato conosco caso tenha alguma dúvida.`,
						})[fw.language.languageType];
						this.okCallback = () => {
							app.popup.showDialog({
								viewConfig: fw.BundleConfig.plaza.res[`withdraw/withdraw_feedback`],
								data: {
									recordData: recordData,
								},
							});
						}
						this.showView(true, this.Items.Node_tips, this.Items.Node_tips_content);
					});
				}
				if (nDiffTime <= 0) {
					func();
				} else {
					let label = item.Items.Label_value_4.getComponent(Label);
					let update = (dt: number) => {
						nDiffTime -= dt;
						const h = Math.max(Math.floor(nDiffTime / 60 / 60), 0);
						const m = Math.max(Math.floor((nDiffTime - h * 60 * 60) / 60), 0);
						const s = Math.max(Math.floor(nDiffTime % 60), 0);
						label.string = `${app.func.formatNumberForZore(h)}:${app.func.formatNumberForZore(m)}:${app.func.formatNumberForZore(s)}`;
						if (nDiffTime < -0.2) {
							label.unscheduleAllCallbacks();
							func();
						}
					}
					label.unscheduleAllCallbacks();
					label.schedule(update);
				}
			}
			else {
				item.Items.Label_value_4.string = ``;
			}
		}
		if (!(<any>item).bBindWithdrawFeedbackSuccessed) {
			(<any>item).bBindWithdrawFeedbackSuccessed = true;
			item.bindEvent({
				eventName: `WithdrawFeedbackSuccessed`,
				callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam) => {
					const data: WithdrawRecordData = arg1.data;
					if (data && data.show_id == recordData.show_id) {
						this.updateOneItem(item, recordData);
					}
				}
			});
		}
	}
	/**刷新列表 */
	updateView(recordList: WithdrawRecordData[]) {
		if (recordList && recordList.length > 0) {
			const data: ReuseItemScrollViewData<WithdrawRecordData> = {
				item: this.Items.ScrollView.Items.Node_item_real,
				datas: recordList,
				update: (item, data) => {
					this.updateOneItem(item, data);
				},
			}
			this.Items.ScrollView.getComponent(FWReuseItemScrollView).setItemsData(data);
		}
	}
	/**获取提现记录 */
	getWithdrawRecord() {
		let params: any = {
			user_id: center.user.getActorProp(ACTOR.ACTOR_PROP_DBID),
			timestamp: app.func.time(),
		}
		params.sign = app.http.getSign(params);
		app.http.post({
			url: `${httpConfig.path_pay}User/getUserWithdrawLog`,
			valideTarget: this,
			params: params,
			callback: (bSuccess, response) => {
				if (bSuccess) {
					if (!fw.isNull(response)) {
						if (1 == response.status) {
							if (!fw.isNull(response.data)) {
								this.updateView(response.data);
							}
						}
					} else {
						app.popup.showTip({ text: "please try again later" });
					}
				} else {
					app.popup.showTip({ text: "please try again later" });
				}
			}
		});
	}
}

declare global {
	namespace globalThis {
		interface WithdrawRecordData {
			/**帐号 */
			account_number?: string
			/**??? */
			apply_ctime?: string
			/**时间 */
			ctime?: string
			/**状态 */
			ex_flag?: number
			/**??? */
			id?: string
			/**ifsc */
			ifsc_code?: string
			/**金额 */
			money?: string
			/**名称 */
			name?: string
			/**订单号 */
			show_id?: string
			/**提现类型 */
			withdraw_type?: number
		}
	}
}
