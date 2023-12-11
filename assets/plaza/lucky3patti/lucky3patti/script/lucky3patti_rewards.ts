import { Label, sp, UITransform, _decorator } from 'cc';
import { math } from '../../../../../engine/cocos/core';
import { DF_RATE } from '../../../../app/config/ConstantConfig';
import { FWDialogViewBase } from '../../../../app/framework/view/popup/FWDialogViewBase';
import { lucky3patti_poker } from './lucky3patti_poker';
import { lucky3pt } from './model/desk';
const { ccclass } = _decorator;

@ccclass('lucky3patti_rewards')
export class lucky3patti_rewards extends FWDialogViewBase {
	private m_desk: lucky3pt.DeskBean;
	private m_list: lucky3pt.JackpotData[];
	initData() {
		this.m_desk = this.data.desk;
		this.m_list = this.data.list as lucky3pt.JackpotData[];
	}
	protected initEvents(): boolean | void {

	}

	protected initView(): boolean | void {
		this.Items.panel_rewards_item.active = false;
		this.Items.lb_jackpot_1.obtainComponent(Label).string = Math.floor(this.m_desk.getPrizeGold() / DF_RATE).toString();
		this.setRewards(this.m_list);
	}
	protected initBtns(): boolean | void {
		this.Items.image_close.onClickAndScale(() => {
			this.onClickClose();
		});
	}

	private setRewards(data_: lucky3pt.JackpotData[]): void {
		let tcards = [];
		for (var i = 0; i < data_.length; ++i) {
			var titem = this.Items.panel_rewards_item.clone();
			titem.active = true;
			this.Items.list_rewards.Items.Layout.addChild(titem);
			// 时间
			titem.Items.text_time.obtainComponent(Label).string = data_[i].time.toString();
			// 奖励
			titem.Items.text_total_bonus.obtainComponent(Label).string = `R$${parseInt(data_[i].total_win_score, 10) / DF_RATE}`;

			tcards = data_[i].card_data.split(",");
			for (var j = 0; j < tcards.length; ++j) {
				titem.Items[`card_${j}`].obtainComponent(lucky3patti_poker).updateData(parseInt(tcards[j], 10));
				titem.Items[`card_${j}`].obtainComponent(lucky3patti_poker).showFont(true);
			}
			// 头像
			app.file.updateHead({
				node: titem.Items.image_head,
				serverPicID: data_[i].user_face,
			})
			// 名字
			titem.Items.text_name.obtainComponent(Label).string = data_[i].user_name;
			titem.Items.text_coins.obtainComponent(Label).string = `BET:R$${parseInt(data_[i].jetton_score, 10) / DF_RATE} GET:R$${parseInt(data_[i].win_score, 10) / DF_RATE}`;
			titem.Items.text_winners_num.obtainComponent(Label).string = data_[i].user_count.toString();
		}
		this.Items.list_rewards.Items.content.obtainComponent(UITransform).height = this.Items.panel_rewards_item.obtainComponent(UITransform).contentSize.height * data_.length;
	}
}
