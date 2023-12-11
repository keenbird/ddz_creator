import { Button, instantiate, Label, Prefab, tween, _decorator } from 'cc';
import { LUCKY3PT_AREA_COUNT } from '../../../../app/center/plaza/lucky3PattiCenter';
import { DF_RATE } from '../../../../app/config/ConstantConfig';
import { EVENT_ID } from '../../../../app/config/EventConfig';
import { FWButton } from '../../../../app/framework/extensions/FWButton';
import { LUCKY3PT_AREA_ID, LUCKY3PT_GAME_STATE } from '../../const';

import { lucky3patti_flycoins } from './lucky3patti_flycoins';
import { lucky3pt } from './model/desk';
const { ccclass, property } = _decorator;

@ccclass('lucky3patti_betarea')
export class lucky3patti_betarea extends (fw.FWComponent) {
	private m_desk: lucky3pt.DeskBean;
	@property(Prefab)
	private m_coins: Prefab = null;
	initData() {

	}
	protected initEvents(): boolean | void {
		var teventsData = [
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_SYNCDATA, callback: this.onSyncData.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_START, callback: this.onGameStart.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_JETTON_RET, callback: this.onGameJettonRet.bind(this) },
			// { event: EVENT_ID.EVENT_LUCKY3PATTI_END, callback: this.onGameEnd.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_COINS_FLY, callback: this.onGameCoinsFly.bind(this) },

			{ event: EVENT_ID.EVENT_LUCKY3PATTI_BALANCE, callback: this.onGameBalance.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_BALANCE_PRE, callback: this.onGameBalancePre.bind(this) },

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
		this.reset();
		this.setAreaSeleced();

		// this.runCoinsFly([1000, 2000, 0, 0, 0, 0])
	}
	protected initBtns(): boolean | void {
		let tnode;
		for (var i = 0; i < LUCKY3PT_AREA_COUNT; ++i) {
			tnode = this.Items["node_bet" + i];
			tnode.Items.node_comm.index = i;
			tnode.Items.node_comm.onClickAndScale((pSender_) => {
				app.event.dispatchEvent({
					eventName: EVENT_ID.EVENT_LUCKY3PATTI_JETTON,
					dict: { index: tnode.Items.node_comm.index },
				})
			});
			tnode.Items.node_bet.index = i;
			tnode.Items.node_bet.onClickAndScale((pSender_) => {
				app.event.dispatchEvent({
					eventName: EVENT_ID.EVENT_LUCKY3PATTI_JETTON,
					dict: { index: tnode.Items.node_bet.index },
				})
			});
		}
		// 初始化下注按钮状态
		this.setBtnBetState(this.m_desk.getGameState());
	}
	public setData<T>(data_: T): void {
		this.m_desk = data_["deskBean"];
	}
	private reset(): void {
		// var tdata = this.m_desk.setAllJettonScore
		var ttotalBetdata: number[] = this.m_desk.getAllJettonScore();
		var tmyBetData: number[] = this.m_desk.getJettonScore();
		for (var i = 0; i < LUCKY3PT_AREA_COUNT; ++i) {
			this.Items["node_bet" + i].Items.label_total.obtainComponent(Label).string = (ttotalBetdata[i] / DF_RATE).toString();
			this.Items["node_bet" + i].Items.label_own.obtainComponent(Label).string = (tmyBetData[i] / DF_RATE).toString();
		}
	}
	/**
	 * 下注数据变化时，金币飞的动画
	 * @param data_ 数据同步时,下注区域的变化值
	 */
	private runCoinsFly(area_: LUCKY3PT_AREA_ID, num_: number, flag_: boolean = true): void {
		var view = instantiate(this.m_coins);
		var viewBase = view.obtainComponent(lucky3patti_flycoins);
		this.Items["node_bet" + area_].addChild(view);
		viewBase.runCoinsFly({
			area: area_,
			num: num_ / DF_RATE,
			flag: flag_,
			callback: () => {
				view.removeFromParent(true);
			}
		});
	}

	/**
	 * 设置选中的区域
	 * @param index_ 选中的区域
	 */
	private setAreaSeleced(index_: LUCKY3PT_AREA_ID = null): void {
		for (var i = 0; i < LUCKY3PT_AREA_COUNT; ++i) {
			if (null == index_) {
				this.Items["node_bet" + i].Items.node_focus.active = false;
			} else {
				if (i === index_) {
					this.Items["node_bet" + i].Items.node_focus.active = true;
					if (0 < this.m_desk.getResultData().nUserWinScore) {
						this.runCoinsFly(i, this.m_desk.getResultData().nUserWinScore, false);
					}

				} else {
					this.Items["node_bet" + i].Items.node_focus.active = false;
				}
			}
		}
	}
	private setBtnBetState(state_: LUCKY3PT_GAME_STATE): void {
		let tnode;
		for (var i = 0; i < LUCKY3PT_AREA_COUNT; ++i) {
			tnode = this.Items["node_bet" + i];
			if (LUCKY3PT_GAME_STATE.free == state_) {
				tnode.Items.node_comm.obtainComponent(FWButton).interactable = false;
				tnode = tnode.Items.node_bet;
				tnode.obtainComponent(FWButton).interactable = false;
				tnode.Items.node_comm.active = true;
				tnode.Items.node_focus.active = false;
			} else if (LUCKY3PT_GAME_STATE.playing == state_) {
				tnode.Items.node_comm.obtainComponent(FWButton).interactable = true;
				tnode = tnode.Items.node_bet;
				tnode.obtainComponent(FWButton).interactable = true;
				tnode.Items.node_comm.active = false;
				tnode.Items.node_focus.active = true;
			}
		}
	}

	private onGameCoinsFly<T, U>(cmd_: T, param_: U): void {
		for (var i = 0; i < param_["length"]; ++i) {
			if (0 < param_[i]) {
				this.runCoinsFly(i, param_[i]);
			}
		}
	}
	/**
	 * 同步下注数据
	*/
	private onSyncData<T, U>(cmd_: T, param_: U): void {
		var ttotalBetdata: number[] = this.m_desk.getAllJettonScore();
		// var tmyBetData: number[] = this.m_desk.getJettonScore() ;
		for (var i = 0; i < LUCKY3PT_AREA_COUNT; ++i) {
			this.Items["node_bet" + i].Items.label_total.obtainComponent(Label).string = (ttotalBetdata[i] / DF_RATE).toString();
		}
	}
	private onGameStart<T, U>(cmd_: T, param_: U): void {
		this.setBtnBetState(LUCKY3PT_GAME_STATE.playing);
		this.setAreaSeleced();
		var ttotalBetdata: number[] = this.m_desk.getAllJettonScore();
		var tmyBetData: number[] = this.m_desk.getJettonScore();
		for (var i = 0; i < LUCKY3PT_AREA_COUNT; ++i) {
			this.Items["node_bet" + i].Items.label_total.obtainComponent(Label).string = (ttotalBetdata[i] / DF_RATE).toString();
			this.Items["node_bet" + i].Items.label_own.obtainComponent(Label).string = (tmyBetData[i] / DF_RATE).toString();
		}
	}
	private onGameJettonRet<T, U>(cmd_: T, param_: U): void {
		var ttotalBetdata: number[] = this.m_desk.getAllJettonScore();
		var tmyBetData: number[] = this.m_desk.getJettonScore();
		for (var i = 0; i < LUCKY3PT_AREA_COUNT; ++i) {
			this.Items["node_bet" + i].Items.label_total.obtainComponent(Label).string = (ttotalBetdata[i] / DF_RATE).toString();
			this.Items["node_bet" + i].Items.label_own.obtainComponent(Label).string = (tmyBetData[i] / DF_RATE).toString();
		}
		this.runCoinsFly(param_["nJettonArea"], param_["nJettonScore"], false);
	}
	// private onGameEnd<T, U>(cmd_: T, param_: U): void {

	// }
	private onGameBalancePre<T, U>(cmd_: T, param_: U): void {
		this.setBtnBetState(LUCKY3PT_GAME_STATE.free);
		// 服务器最后同步一次总下注数据显示
		var ttotalBetdata: number[] = this.m_desk.getAllJettonScore();
		for (var i = 0; i < LUCKY3PT_AREA_COUNT; ++i) {
			this.Items["node_bet" + i].Items.label_total.obtainComponent(Label).string = (ttotalBetdata[i] / DF_RATE).toString();
		}
		var tresultData: lucky3pt.GameResultData = this.m_desk.getResultData();
		if (0 < tresultData.nUserWinScore) {
			this.runCoinsFly(tresultData.nWinArea, tresultData.nUserWinScore, false);
		}
	}
	private onGameBalance<T, U>(cmd_: T, param_: U): void {
		this.setAreaSeleced(this.m_desk.getResultData().nWinArea);
	}

}