import { _decorator } from 'cc';
import { FWDialogViewBase } from '../../../../app/framework/view/popup/FWDialogViewBase';
import { lucky3pt } from './model/desk';
const { ccclass } = _decorator;

@ccclass('lucky3patti_rule')
export class lucky3patti_rule extends FWDialogViewBase {
	private m_desk: lucky3pt.DeskBean;
	initData() {
		this.m_desk = this.data;
	}
	protected initEvents(): boolean | void {

	}
	protected initView(): boolean | void {

	}
	protected initBtns(): boolean | void {
		this.Items.image_close.onClickAndScale(() => {
			this.onClickClose();
		});
	}
}
