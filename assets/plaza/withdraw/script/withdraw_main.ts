import { view, js, Label, Sprite, color, Node as ccNode, UITransform, _decorator, size, UIOpacity, Prefab, instantiate } from 'cc';
const { ccclass } = _decorator;

import { ACTOR } from '../../../app/config/cmd/ActorCMD';
import { EVENT_ID } from '../../../app/config/EventConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
import { DF_RATE, DF_SYMBOL, ScreenOrientationType } from '../../../app/config/ConstantConfig';
import proto from '../../../app/center/common';
import { EmailType } from '../../../app/center/plaza/emailCenter';
import { megaGift_vertical } from '../../megaGift/script/megaGift_vertical';
import { premium_vertical } from '../../premium/script/premium_vertical';
import { PayChannel_vertical } from '../../shop/script/PayChannel_vertical';

let Color_btn_sel = color(0x00, 0xc2, 0x4d);
let Color_btn_nor = color(0xf3, 0xf7, 0xf8);

let Color_btn_t_sel = color(0xff, 0xff, 0xff);
let Color_btn_t_nor = color(0x8b, 0xa6, 0xc1);

@ccclass('withdraw_main')
export class withdraw_main extends FWDialogViewBase {
	/**是否具有横竖屏切换功能（意思是当前界面会调整 “横竖屏” 状态），如果界面设计没有适配横竖屏，那么应该设置该属性为true，并调整_nScreenOrientation值为当前界面设计方向 */
	bHaveScreenOrientation: boolean = true
	/**调整屏幕方向 */
	_nScreenOrientation: ScreenOrientationType = ScreenOrientationType.Vertical_false
	/**数量菜单 */
	nWithdrawNum: number
	premium_vertical: ccNode;
	hidePremiumVeritcal: ccNode;
	hideMegaGiftVeritcal: ccNode;
	hidePayChannelVeritcal: ccNode;
	protected initView(): boolean | void {
		//调整标题
		this.changeTitle({ title: fw.language.get("WITHDRAW") });
		this.Items.total_Balance_Text.string = fw.language.get("Total Balance")
		this.Items.withdrawal_history_t.string = fw.language.get("History")
		this.Items.winnings_cash_t.string = fw.language.get("Winnings Cash")
		this.Items.deposit_cash_t.string = fw.language.get("Deposit Cash")
		this.Items.withdrawable_balance_t.string = fw.language.get("Withdrawable Balance")
		this.Items.withdrawable_amount_t.string = fw.language.get("Withdraw Amount")
		this.Items.Image_ok_t.string = fw.language.get("Withdraw")
		this.Items.Text_ok_ex.string = fw.language.get("Withdraw") + "2>"
		this.Items.Text_tips_t.string = fw.language.get("Tip")
		this.Items.Tips_depsrit.string = fw.language.get("Deposit Cash is the Cash that you've added to yourWallet.")
		this.Items.Tips_withdrawable.string = fw.language.get("Winnings Cash is the Cash that you have won in cash games.You can use Winnings Cash and Deposit Cash to play for cash games.\nNote: You can withdraw your Winnings Cash")
		this.Items.Text_content_rulr.string = fw.language.get("1. Withdrawable balance is the money you win in cash games.\n\n2. When you apply for a withdrawal, the money will usually arrive in your account within 5 minutes.\n\n3. If you have any questions, please practice us in time.")
		this.Items.Tips_total.string = fw.language.get("The 'Total Balance' is equal to the 'Withdrawable Balance' plus the 'Deposit Cash'.")
		this.Items.tips_sure_text.string = fw.language.get("Ok")
		this.Items.Text_select.string = fw.language.get("Select Amount")


		this.Items.Text_content_rulr.getComponent(Label).updateRenderData(true);
		let labelsize = this.Items.Text_content_rulr.obtainComponent(UITransform);
		let labelsize2 = this.Items.Node_liucheng.obtainComponent(UITransform);
		let scrollSize = this.Items.Panel_tips_rule.Items.content.obtainComponent(UITransform);
		if ((labelsize.height+labelsize2.height) > scrollSize.height) {
			scrollSize.height = labelsize.height+labelsize2.height;
		}

		//假竖屏处理
		this.updateOrientationLayout();

		//隐藏部分界面
		this.Items.Panel_Tips.active = false;
		this.Items.Node_premium.active = false;
		this.Items.Amount.obtainComponent(Label).string = DF_SYMBOL + `0`;
		this.setWithDrawInfo();
		this.setWithDrawList();
		this.autoShowWithdraw();
	}

	protected initBtns(): boolean | void {
		this.Items.Image_ok.onClickAndScale(() => {
			this.FuncClick_Ok(false);
		});
		this.Items.Image_ok_ex.onClickAndScale(() => {
			this.FuncClick_Ok(true);
		});
		this.Items.record_btnnew.onClickAndScale(this.FuncClick_record.bind(this));
		this.Items.rule_btn.onClickAndScale(this.FuncClick_rul.bind(this));
		this.Items.depsrit_tips.onClickAndScale(this.FuncClick_depsritTips.bind(this));
		this.Items.withdrawable_tips.onClickAndScale(this.FuncClick_withdrawableTips.bind(this));
		this.Items.total_tips.onClickAndScale(this.FuncClick_totalTips.bind(this));
		this.Items.Tips_close.onClickAndScale(this.FuncClick_TipsCloseBtn.bind(this));
		this.Items.Tips_sure.onClickAndScale(this.FuncClick_TipsCloseBtn.bind(this));
	}

	protected initEvents(): boolean | void {
		//奖励提示
		this.bindEvent(
			{
				eventName: EVENT_ID.EVENT_WITHDRAW_ACCOUNT,
				callback: (data) => {
					this.autoShowWithdraw();
				}
			}
		);
		//标记变更刷新提现列表
		this.bindEvent(
			{
				eventName: ACTOR[ACTOR.ACTOR_PROP_DAY_OVERFLOWBAG_FLAG],
				callback: (data) => {
					this.setWithDrawList();
				}
			}
		);
		this.bindEvent({
			eventName: `ChangeScreenOrientation`,
			callback: () => {
				this.updateOrientationLayout();
			}
		});
		this.bindEvent({
			eventName: `showMegaGiftVeritcal`,
			callback: (dict) => {
				this.loadBundleRes(fw.BundleConfig.plaza.res[`megaGift/MegaGift_vertical`],(prefab: Prefab) => {
					//添加新界面
					let view = instantiate(prefab);
					//设置父节点
					this.hideMegaGiftVeritcal = view
					this.Items.Node_premium.active = true;
					this.Items.premium_node.removeAllChildren(true);
					view.parent = this.Items.premium_node;
					if (dict.data.isShowMallNext) {
						view.getComponent(megaGift_vertical).popupData.cancelBuyCallback = ()=>{
							app.popup.showDialog({
								viewConfig: fw.BundleConfig.plaza.res[`shop/shop_main`],
								data: {
									minPay: dict.data.minPay
								},
							});
						}
					}
				});
			}
		});
		this.bindEvent({
			eventName: `showPayChannelVeritcal`,
			callback: (dict) => {
				this.loadBundleRes(fw.BundleConfig.plaza.res[`shop/payChannel_dlg_vertical`],(prefab: Prefab) => {
					//添加新界面
					let view = instantiate(prefab);
					let _premium = view.getComponent(PayChannel_vertical)
					_premium.popupData = dict.data;
					//设置父节点
					this.hidePayChannelVeritcal = view
					this.Items.Node_premium.active = true;
					this.Items.premium_node.removeAllChildren(true);
					view.parent = this.Items.premium_node;
				});
			}
		});
		this.bindEvent({
			eventName: `hidePayChannelVeritcal`,
			callback: () => {
				this.hidePayChannelVeritcal.removeFromParent(true)
				this.hidePayChannelVeritcal = null
				this.Items.Node_premium.active = false;
			}
		});
		this.bindEvent({
			eventName: `hidePremiumVeritcal`,
			callback: () => {
				this.hidePremiumVeritcal.removeFromParent(true)
				this.hidePremiumVeritcal = null
				this.Items.Node_premium.active = false;
			}
		});
		this.bindEvent({
			eventName: `hideMegaGiftVeritcal`,
			callback: () => {
				this.hideMegaGiftVeritcal.removeFromParent(true)
				this.hideMegaGiftVeritcal = null
				this.Items.Node_premium.active = false;
			}
		});
	}

	autoShowWithdraw() {
		let nWithdrawNum = center.email.getEmailWithdrawNotCloseNum();
		if (nWithdrawNum > 0) {
			this.scheduleOnce(() => {
				app.popup.showDialog({
					viewConfig: fw.BundleConfig.plaza.res[`email/email`],
					data: {
						targetJump: EmailType.EMAILSTATE_WITHDRAW
					},
				});
			}, 0.3);
		}
	}

	setWithDrawInfo() {
		let cfg = center.exchange.getCashOutCfg();
		if (!cfg.open) {
			return;
		}

		let numtotal = parseInt(center.user.getActorProp(ACTOR.ACTOR_PROP_GOLD));
		let numwithdrawable = parseInt(center.user.getActorProp(ACTOR.ACTOR_PROP_WITHDRAW_GOLD));
		if (fw.isValid(this.Items.Balance)) {
			this.Items.Balance.obtainComponent(Label).string = DF_SYMBOL + center.exchange.getCanCashOutGold() / DF_RATE;
		}
		if (fw.isValid(this.Items.withdrawable)) {
			this.Items.withdrawable.obtainComponent(Label).string = DF_SYMBOL + numwithdrawable / DF_RATE;
		}
		if (fw.isValid(this.Items.total)) {
			this.Items.total.obtainComponent(Label).string = `${DF_SYMBOL}${numtotal / DF_RATE}`;
		}
		if (fw.isValid(this.Items.depsrit)) {
			this.Items.depsrit.obtainComponent(Label).string = DF_SYMBOL + (numtotal - numwithdrawable) / DF_RATE;
		}
		let curDayLimit = center.exchange.getCurDayCashOutLimit();
		let Text_limit = this.Items.Text_limit;
		Text_limit.active = false;
		if (curDayLimit) {
			Text_limit.active = true;  
			Text_limit.obtainComponent(Label).string = fw.language.getString("VIP${vipLevel}: You can withdraw ${cashoutCountMax} times a day, and you can withdraw ${cashoutNumMax} per day.", {
				vipLevel: center.user.getActorProp(ACTOR.ACTOR_PROP_VIPLEVEL),
				cashoutCountMax: curDayLimit.cashout_count_max,
				cashoutNumMax: curDayLimit.cashout_num_max / DF_RATE
			})
		}
	}

	setWithDrawList() {
		let cfg = center.exchange.getCashOutCfg();
		if (!cfg.open) {
			return;
		}
		
		let data = center.exchange.getShowPrice();
		let showPrice = data.showPrice
		let oneTime = data.oneTime
		let itemC = this.Items.money_item
		itemC.active = false;
		let itemP = this.Items.Node_money
		itemP.removeAllChildren(true)
		let oldItem: any = {};
		// oldItem.money_bg = null
		// oldItem.money_text = null
		showPrice.forEach((v, i) => {
			let money_btn = itemC.clone();
			money_btn.parent = itemP;
			money_btn.active = true;
			money_btn.Items.mark_item.active = (i == 0) && oneTime
			let money_text = money_btn.Items.money;
			let money_bg = money_btn.Items.money_bg;
			money_text.obtainComponent(Label).string = DF_SYMBOL + parseInt(v) / DF_RATE;
			let setWithDrawNum = function () {
				if (fw.isValid(oldItem.money_bg)) {
					oldItem.money_text.obtainComponent(Label).color = Color_btn_t_nor;
					oldItem.money_bg.obtainComponent(Sprite).color = Color_btn_nor;
				}
				oldItem.money_bg = money_bg;
				oldItem.money_text = money_text;
				money_text.obtainComponent(Label).color = Color_btn_t_sel;
				money_bg.obtainComponent(Sprite).color = Color_btn_sel;
				this.nWithdrawNum = parseInt(v);
				// let fee = this.getFee(this.nWithdrawNum);
				this.Items.Amount.obtainComponent(Label).string = DF_SYMBOL + (this.nWithdrawNum / DF_RATE);
			}.bind(this);
			money_text.obtainComponent(Label).color = Color_btn_t_nor;
			money_bg.obtainComponent(Sprite).color = Color_btn_nor;
			if (i == 0) {
				setWithDrawNum();
			}
			money_btn.onClick(setWithDrawNum);
		})
	}

	getFee(nWithdrawNum: number) {
		let cfg = center.exchange.getCashOutCfg();
		let fee = 0;
		let count = parseInt(center.user.getActorProp(ACTOR.ACTOR_PROP_USE_WITHDRAW_COUNT))
		let maxCount = cfg.timer
		let freeCount = cfg.freeTimer
		if (count != null) {
			if (freeCount == 0) {
				for (let i = 0; i < cfg.chargeCfg.length; i++) {
					const charge = cfg.chargeCfg[i];
					let withDrawNum_ = nWithdrawNum;
					if (withDrawNum_ >= charge.charge_min && withDrawNum_ < charge.charge_max) {
						fee = charge.charge_value / DF_RATE
					}
				}

			} else if (freeCount > 0) {
				if (count <= freeCount) {
					fee = 0
				} else {
					for (let i = 0; i < cfg.chargeCfg.length; i++) {
						const charge = cfg.chargeCfg[i];
						let withDrawNum_ = nWithdrawNum;
						if (withDrawNum_ >= charge.charge_min && withDrawNum_ < charge.charge_max) {
							fee = charge.charge_value / DF_RATE;
						}
					}
				}
			}
		}
		return fee;
	}

	FuncClick_Ok(bEx: boolean) {
		if (this.nWithdrawNum <= 0) {
			app.popup.showToast({ text: "withdrawal amount cannot be 0" });
			return;
		}
		if (!center.user.isSwitchOpen("btWithdrawSwitch")) {
			if (this.nWithdrawNum > parseInt(center.user.getActorProp(ACTOR.ACTOR_PROP_WITHDRAW_GOLD))) {
				app.popup.showToast({ text: fw.language.get("Not enough withdrawal balance") });
				return;
			}
		} else {
			if (this.nWithdrawNum > parseInt(center.user.getActorProp(ACTOR.ACTOR_PROP_GOLD))) {
				app.popup.showToast({ text: fw.language.get("Not enough withdrawal balance") });
				return;
			}
		}
		let nWithdrawNum = parseInt(this.nWithdrawNum);
		let curDayLimit = center.exchange.getCurDayCashOutLimit();
		let curDayGold = parseInt(center.user.getActorProp(ACTOR.ACTOR_PROP_OUT_WITHDRAW_NUM_BYDAY));
		let curDayCount = parseInt(center.user.getActorProp(ACTOR.ACTOR_PROP_OUT_WITHDRAW_COUNT_BYDAY));
		let showDialog = () => {
			//VIP
			let cfg = center.exchange.getCashOutCfg();
			let payLimit = cfg.payRechargeLimit
			let rechageCount = center.user.getActorProp(ACTOR.ACTOR_PROP_RECHARGE_AMOUNT)
			if (center.user.isSwitchOpen("btWithdrawCharge") && rechageCount < payLimit ) {
				this.node.loadBundleRes(fw.BundleConfig.plaza.res[`premium/premium_vertical`],(prefab: Prefab) => {
					//添加新界面
					let view = instantiate(prefab);
					let _premium = view.getComponent(premium_vertical)
					_premium.popupData.nGoldNum = payLimit;
					_premium.popupData.languageTips1 = fw.language.get("VIP_RECHARGE_TIPS_4"),
					_premium.popupData.languageTips2 = fw.language.get("premium_tips_num_3"),
					_premium.popupData.vipNum = 1,
					//设置父节点
					this.hidePremiumVeritcal = view
					this.Items.Node_premium.active = true;
					this.Items.premium_node.removeAllChildren(true);
					view.parent = this.Items.premium_node;
				});
				return;
			}

			let toAccount = () => {
				if (bEx) {
					app.popup.showDialog({
						viewConfig: fw.BundleConfig.plaza.res[`withdraw/withdraw_account_ex`],
						data: {
							nWithDrawNum: nWithdrawNum,
						},
					});
				} else {
					app.popup.showDialog({
						viewConfig: fw.BundleConfig.plaza.res[`withdraw/withdraw_account`],
						data: {
							nWithDrawNum: nWithdrawNum,
						},
					});
				}
			}

			//是否已经绑定了手机和实名认证
			if (!center.user.isFillAllPayInfo()) {
				//填充信息弹窗
				app.popup.showDialog({
					viewConfig: fw.BundleConfig.plaza.res[`userInfo/withdraw_info_vertical`],
					data: {
						callback: toAccount,
					}
				});
				return;
			}

			toAccount()
			this.close();
		}
		if (curDayLimit) {
			if (curDayCount < curDayLimit.cashout_count_max && (curDayGold + this.nWithdrawNum) <= curDayLimit.cashout_num_max) {
				showDialog();
			} else {
				app.popup.showTip({
					text: {
						[fw.LanguageType.en]: `The withdrawal limit on the day has been reached,please continue with the withdrawal tomorrow.`,
						[fw.LanguageType.brasil]: `O limite de saque diário foi atingido. Por favor, tente novamente amanhã.`,
					}[fw.language.languageType]
				});
			}
		} else {
			showDialog();
		}
	}

	FuncClick_record() {
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`withdraw/withdraw_record`],
		});
	}

	FuncClick_rul() {
		this.Items.Panel_Tips.active = true;
		this.Items.Panel_tips_rule.active = true;
		this.Items.Tips_depsrit.active = false;
		this.Items.Tips_withdrawable.active = false;
		this.Items.Tips_total.active = false;
	}

	FuncClick_totalTips() {
		this.Items.Panel_Tips.active = true;
		this.Items.Panel_tips_rule.active = false;
		this.Items.Tips_depsrit.active = false;
		this.Items.Tips_withdrawable.active = false;
		this.Items.Tips_total.active = true;
	}

	FuncClick_depsritTips() {
		this.Items.Panel_Tips.active = true;
		this.Items.Panel_tips_rule.active = false;
		this.Items.Tips_depsrit.active = true;
		this.Items.Tips_withdrawable.active = false;
		this.Items.Tips_total.active = false;
	}

	FuncClick_withdrawableTips() {
		this.Items.Panel_Tips.active = true;
		this.Items.Panel_tips_rule.active = false;
		this.Items.Tips_depsrit.active = false;
		this.Items.Tips_withdrawable.active = true;
		this.Items.Tips_total.active = false;
	}

	FuncClick_TipsCloseBtn() {
		this.Items.Panel_Tips.active = false;
	}

	updateOrientationLayout() {
		//调整角度
		this.node.angle = 90;
		this.node.size = size(app.initWinSize.height, app.initWinSize.width);
	}
}
