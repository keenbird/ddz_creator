import { _decorator, Label } from 'cc';
import { DF_RATE } from '../../../app/config/ConstantConfig';
import { EVENT_ID } from '../../../app/config/EventConfig';
const { ccclass } = _decorator;

import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
import { btn_common } from '../../../resources/ui/btn/script/btn_common';

@ccclass('bankruptcy')
export class bankruptcy extends FWDialogViewBase {
	mBankruptcy: any;
	initData() {
		this.mBankruptcy = center.task.getSubsydyInfo()
	}
	protected initEvents(): boolean | void {
		var teventsData = [
			{ event: EVENT_ID.EVENT_TASK_SUBSIDY_REWARD, callback: this.onClickClose.bind(this) },
		];

		teventsData.forEach(element => {
			this.bindEvent(
				{
					eventName: element.event,
					callback: <T>(data: T) => {
						if (element.callback) {
							element.callback(element.event, data["dict"]);
						}
					}
				}
			);
		});
	}
	protected initView(): boolean | void {
		this.Items.Text_dec.string = fw.language.get("WEALTH BLESSINHG,PLAY TO WIN MORE")

		let gold = this.mBankruptcy.nAddGold / DF_RATE
		this.Items.money_1.getComponent(Label).string = gold + 'RS'
		this.Items.money_2.getComponent(Label).string = 'R$' + gold
	}
	protected initBtns(): boolean | void {
		this.Items.btn_common.getComponent(btn_common).initStyle({
			styleId: 1,
			text: `OK`,
			callback: () => {
				this.onGetBankryptcy();
			}
		});
	}
	onGetBankryptcy() {
		center.task.GetSubsidy()
	}
}
