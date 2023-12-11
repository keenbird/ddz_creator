import { Label, _decorator } from 'cc';
const { ccclass } = _decorator;

import { EVENT_ID } from '../../../app/config/EventConfig';
import { PAY_MODE } from '../../../app/config/ModuleConfig';
import { DF_RATE, DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('SiginboradLuckGift')
export class SiginboradLuckGift extends FWDialogViewBase {
	mQuickRecharge: QuickRecharge;
	popupData: any;
	initData() {
		this.mQuickRecharge = center.roomList.getQuickRecharge(this.popupData.rewardData.nID);
		if (!this.mQuickRecharge) {
			this.onClickClose();
		}
	}
	protected initEvents(): boolean | void {
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_GETREWARDTIPS,
			],
			callback: (arg1, arg2) => {
				this.onClickClose();
			}
		});
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_PLAZA_QUICKCHARGE,
			],
			callback: (arg1, arg2) => {
				app.sdk.setOrderNum(arg1.dict.order);
				app.sdk.pay();
			}
		});
	}
	protected initView(): boolean | void {
		//--多语言处理--began------------------------------------------
		//文本
		this.Items.Label_title_cash.obtainComponent(fw.FWLanguage).bindLabel(`Cash`);
		this.Items.Label_title_bonus.obtainComponent(fw.FWLanguage).bindLabel(`Bonus`);
		this.Items.Label_title_total_get.obtainComponent(fw.FWLanguage).bindLabel(`TOTAL GET`);
		this.Items.Label_title_add_cash.obtainComponent(fw.FWLanguage).bindLabel(`Add Cash`);
		this.Items.Label_chance.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
			this.Items.Label_chance.string = {
				[fw.LanguageType.en]: `Only one chance`,
				[fw.LanguageType.brasil]: `Apenas uma chance`,
			}[fw.language.languageType];
		});
		//精灵
		this.Items.Sprite_title.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
		    app.file.updateImage({
		        node: this.Items.Sprite_title,
		        bundleResConfig: ({
		            [fw.LanguageType.en]: () => { return fw.BundleConfig.plaza.res[`siginboradLuck/img/atlas/7D_TC_biaoti/spriteFrame`]; },
		            [fw.LanguageType.brasil]: () => { return fw.BundleConfig.plaza.res[`siginboradLuck/img/atlas/7D_TC_biaoti_brasil/spriteFrame`]; },
		        })[fw.language.languageType](),
		    });
		});
		//--多语言处理--end--------------------------------------------
		if (!this.mQuickRecharge) {
			this.onClickClose();
			return;
		}
		let cash = this.mQuickRecharge.nQuickGoodsNum;
		let bonus = this.mQuickRecharge.nQuickGiveGoodsNum[0];
		this.Items.Label_cash_num.getComponent(Label).string = DF_SYMBOL + this.mQuickRecharge.nQuickNeedRMB;
		this.Items.Label_cash.getComponent(Label).string = DF_SYMBOL + cash / DF_RATE;
		this.Items.Label_bonus.getComponent(Label).string = DF_SYMBOL + bonus / DF_RATE;
		this.Items.Label_total_get.getComponent(Label).string = DF_SYMBOL + (cash + bonus) / DF_RATE;
	}
	protected initBtns(): boolean | void {
		this.Items.Panel_add_cash.onClickAndScale(() => {
			this.onAddCashClick();
		});
	} 
	onAddCashClick() {
		app.sdk.setPrice(this.mQuickRecharge.nQuickNeedRMB);
		app.sdk.setGoodsName(DF_SYMBOL + this.mQuickRecharge.nQuickNeedRMB);
		app.sdk.setRID(this.mQuickRecharge.nRID);
		app.sdk.setPayMode(PAY_MODE.PAY_MODE_NOR);
		let cash = this.mQuickRecharge.nQuickGoodsNum;
		let bonus = this.mQuickRecharge.nQuickGiveGoodsNum[0];
		let data: PayChannelData = {
			cashBonusInfo: {
				cash: cash / DF_RATE,
				bonus: bonus / DF_RATE,
				payCash: this.mQuickRecharge.nQuickNeedRMB,
			},
			orderCallback: () => {
				center.roomList.sendQuickRecharge(this.mQuickRecharge.nRID);
			},
			isAutoSelect: true,
		}
		center.mall.payChooseType(data);
	}
}
