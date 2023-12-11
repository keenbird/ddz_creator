import { Label, tween, _decorator } from 'cc';
import { DF_RATE } from '../../../../app/config/ConstantConfig';
import { EVENT_ID } from '../../../../app/config/EventConfig';
import { httpConfig } from '../../../../app/config/HttpConfig';
import { Md5 } from '../../../../app/framework/external/ts-md5/md5';
import { MINIGAME_ROOMID } from '../../const';
import { lucky3pt } from './model/desk';
const { ccclass } = _decorator;

@ccclass('lucky3patti_jackpot')
export class lucky3patti_jackpot extends (fw.FWComponent) {
	private m_desk: lucky3pt.DeskBean;
	initData() {

	}
	protected initEvents(): boolean | void {
		var teventsData = [
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_SYNCDATA, callback: this.onSyncData.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_BALANCE, callback: this.onGameBalance.bind(this) },
			// {event:EVENT_ID.EVENT_LUCKY3PATTI_END , callback: this.onGameEnd.bind(this)},
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
		this.Items.label_jackpot.obtainComponent(Label).string = (this.m_desk.getPrizeGold() / DF_RATE).toString();
	}
	protected initBtns(): boolean | void {
		this.Items.sprite_bg.onClickAndScale(() => {
			this.getJackpotList();

		});
		this.Items.sprite_icon.onClickAndScale(() => {
			this.getJackpotList();
		});
	}
	private getJackpotList(): void {
		let tparam: any = {};
		tparam.room_id = MINIGAME_ROOMID.lucky3patti;
		tparam.timestamp = app.func.time();
		app.http.post({
			url: httpConfig.path_pay + "Hall/minigamePrize",
			params: tparam,
			callback: (bSuccess, response) => {
				if (bSuccess) {
					if (!fw.isNull(response)) {
						if (1 == response.status) {
							app.popup.showDialog({
								viewConfig: fw.BundleConfig.plaza.res["lucky3patti/lucky3patti/lucky3patti_rewards"],
								data: {
									desk: this.m_desk,
									list: app.func.deepCopy(response.data)
								},

							});
						}
					}

				} else {
					fw.print("get getJackpotList failed!");
				}
			}
		});
	}
	public setData<T>(data_: T): void {
		this.m_desk = data_["deskBean"];
	}
	/**
	 * 同步下注数据
	*/
	private onSyncData<T, U>(cmd_: T, param_: U): void {
		this.Items.label_jackpot.obtainComponent(Label).string = `R$${this.m_desk.getPrizeGold() / DF_RATE}`;
	}
	private onGameBalance<T, U>(cmd_: T, param_: U): void {
		var tresultData: lucky3pt.GameResultData = this.m_desk.getResultData();
		if (!fw.isNull(tresultData) && 0 == tresultData.nWinArea) {
			tween(this).delay(1).call(() => {
				this.playJackpot(tresultData.nBlowPrizeGold || 0);
				this.Items.label_jackpot.obtainComponent(Label).string = `R$${this.m_desk.getPrizeGold() / DF_RATE}`;
			})
		}
	}
	/**
	 * 奖池动画
	 * @param num_ 变动的金币
	 */
	private playJackpot(jackNum: number): void {

	}

}
