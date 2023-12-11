import { _decorator } from 'cc';
import { MAX_RECORDS_NUM } from '../../../../app/center/plaza/lucky3PattiCenter';
import { FWDialogViewBase } from '../../../../app/framework/view/popup/FWDialogViewBase';
import { lucky3patti_records_item } from './lucky3patti_records_item';
import { lucky3pt } from './model/desk';
const { ccclass } = _decorator;

@ccclass('lucky3patti_records')
export class lucky3patti_records extends FWDialogViewBase {
	private m_desk: lucky3pt.DeskBean;
	initData() {
		this.m_desk = this.data;
	}
	protected initEvents(): boolean | void {

	}
	protected initView(): boolean | void {
		this.Items.list_trends_item.active = false;
		let tdata = this.m_desk.getTrends(MAX_RECORDS_NUM);
		for (var i = 0; i < MAX_RECORDS_NUM; ++i) {
			var view = this.Items.list_trends_item.clone();
			view.active = true;
			var viewBase = view.obtainComponent(lucky3patti_records_item);
			this.Items.list_trends.addChild(view);
			if (!fw.isNull(tdata) && 0 < tdata.length && i < tdata.length) {
				viewBase.setTrendData(tdata[i]);
			}
		}
	}
	protected initBtns(): boolean | void {
		this.Items.image_close.onClickAndScale(() => {
			this.onClickClose();
		});
		this.Items.image_title.onClickAndScale(() => {
			this.addTrend({ nCardType: 1 } as lucky3pt.GameTrend);
		});
	}
	public addTrend(data: lucky3pt.GameTrend): void {

	}
}
