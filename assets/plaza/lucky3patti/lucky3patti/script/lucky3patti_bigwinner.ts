import { Label, _decorator } from 'cc';
import { DF_RATE } from '../../../../app/config/ConstantConfig';
import { EVENT_ID } from '../../../../app/config/EventConfig';
import { httpConfig } from '../../../../app/config/HttpConfig';
import { MINIGAME_ROOMID } from '../../const';
import { lucky3pt } from './model/desk';
const { ccclass } = _decorator;

@ccclass('lucky3patti_bigwinner')
export class lucky3patti_bigwinner extends (fw.FWComponent) {
	private m_desk: lucky3pt.DeskBean;
	initData() {

	}
	protected initEvents(): boolean | void {
		var teventsData = [
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_UPDATE_BIGWINNER, callback: this.onGameUpateBigWinner.bind(this) },
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
		var twinner: lucky3pt.GameWinnerData = this.m_desk.getWinner();
		if (!fw.isNull(twinner) && 0 < twinner.nActorDBID) {
			this.Items.node_userinfo.active = true;
			this.Items.label_name.obtainComponent(Label).string = twinner.szUserName;
			this.Items.label_coins.obtainComponent(Label).string = (twinner.nWinScore / DF_RATE).toString();
			app.file.updateHead({
				node: this.Items.sprite_head,
				serverPicID: twinner.szMD5FaceFile,
			});
		} else {
			this.Items.node_userinfo.active = false;
		}

	}
	protected initBtns(): boolean | void {
		this.Items.sprite_bg.onClickAndScale(() => {
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
	private onGameUpateBigWinner<T, U>(cmd_: T, param_: U): void {
		var twinner: lucky3pt.GameWinnerData = this.m_desk.getWinner();
		this.Items.label_name.obtainComponent(Label).string = twinner.szUserName;
		this.Items.label_coins.obtainComponent(Label).string = (twinner.nWinScore / DF_RATE).toString();
		app.file.updateHead({
			node: this.Items.sprite_head,
			serverPicID: twinner.szMD5FaceFile,
		})
	}

}
