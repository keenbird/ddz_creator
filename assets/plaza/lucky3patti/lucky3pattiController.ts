import { ACTOR } from "../../app/config/cmd/ActorCMD";
import { DF_RATE } from "../../app/config/ConstantConfig";
import { EVENT_ID } from "../../app/config/EventConfig";
import { LUCKY3PT_GAME_STATE, LUCKY3PT_TIPS_ID } from "./const";
import { lucky3pt } from "./lucky3patti/script/model/desk";

export class lucky3pattiController {
	private m_desk: lucky3pt.DeskBean;
	private m_hostPlayer: lucky3pt.GamePlayer;
	constructor() {
		this.initData();
		this.initEvents();
	}
	initData() {
		this.m_desk = new lucky3pt.DeskBean();
		this.m_hostPlayer = this.m_desk.getHostPlayer()
	}
	protected initEvents(): boolean | void {
		var teventsData = [
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_DATA, callback: this.onGameData.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_SYNCDATA, callback: this.onSyncData.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_TIPS, callback: this.onGameTips.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_START, callback: this.onGameStart.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_END, callback: this.onGameEnd.bind(this) },

			{ event: EVENT_ID.EVENT_LUCKY3PATTI_JETTON, callback: this.onGameJetton.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_JETTON_RET, callback: this.onGameJettonRet.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_REBET, callback: this.onRev_callback.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_JACKPOT, callback: this.onRev_callback.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_HISTORY, callback: this.onRev_callback.bind(this) },

			{ event: EVENT_ID.EVENT_LUCKY3PATTI_RECORDS, callback: this.onRev_callback.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_QUESTION, callback: this.onRev_callback.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_CHANGE_BET_CHIP, callback: this.onRev_callback.bind(this) },
			{ event: EVENT_ID.EVENT_LOGIN_SOCKETERROR, callback: this.onRev_callback.bind(this) },

		];

		teventsData.forEach(element => {
			app.event.bindEvent(
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

	private onGameData<T, U>(cmd_: T, param_: U): void {
		// 初始化数据
		this.m_desk.resetData();
		this.m_desk.setData(param_);
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res["lucky3patti/lucky3patti/lucky3patti_main"],
			data: this.m_desk,
			callback: (view) => {
				app.event.dispatchEvent({
					eventName: EVENT_ID.EVENT_LUCKY3PATTI_INIT,
					dict: {
						deskBean: this.m_desk
					}
				})
			}
		});
	}
	private onSyncData<T, U>(cmd_: T, param_: U): void {
		this.m_desk.setPrizeGold(param_["nPrizePoolGold"]);
		var tdata: number[] = this.m_desk.setAllJettonScore(param_["nAllJettonScore"]);
		app.event.dispatchEvent({
			eventName: EVENT_ID.EVENT_LUCKY3PATTI_COINS_FLY,
			dict: tdata
		})
	}
	private onGameTips<T, U>(cmd_: T, param_: U): void {
		// 如果用户在小游戏界面 收到了TipsID_Close TipsID_Nobet TipsID_Maintenance 服务器会同时踢出玩家 如果界面打开了  注意要关闭界面 走登出流程
		var terrLan = {
			lucky3patti_error_0: "The game is about to stop updating.",
			lucky3patti_error_1: "There are too many players in the room, please try again later.",
			lucky3patti_error_7: "You haven't played for a long time and left the game.",
			lucky3patti_error_8: "The game is about to stop updating.",
			lucky3patti_error_9: "You have left the table, please reopen the game.",
			lucky3patti_error_10: "Betting limit reached here.",
			lucky3patti_error_11: "This bet cannot exceed.",
			lucky3patti_error_12: "Lock in game.",
		}
		switch (param_["nTipsID"]) {
			case LUCKY3PT_TIPS_ID.close:
			case LUCKY3PT_TIPS_ID.maintenance:
			case LUCKY3PT_TIPS_ID.invalidChair:
			case LUCKY3PT_TIPS_ID.areaScoreLimit:
			case LUCKY3PT_TIPS_ID.totalScoreLimit:
			case LUCKY3PT_TIPS_ID.nobet: {
				// tipsFunc.newHintTip( Lucky3PattiLanguage:getInstance():getTextShow("lucky3patti_error_"..tdata.nTipsID) )
				app.popup.showToast({ text: terrLan["lucky3patti_error_" + param_["nTipsID"]] });
				break;
			}
			case LUCKY3PT_TIPS_ID.notEnoughGold:
			case LUCKY3PT_TIPS_ID.notEnoughReatin: {
				app.popup.showDialog(fw.BundleConfig.plaza.res[`shop/quickRecharge`]);
				break;
			}
			case LUCKY3PT_TIPS_ID.rechargeLimit: {
				app.popup.showDialog({
					viewConfig: fw.BundleConfig.plaza.res[`premium/premium`],
					data: {
						languageTips1: `Only premium players can use this chips.`,
					},
				});
				break;
			}
			case LUCKY3PT_TIPS_ID.lockGame: {
				app.popup.showToast({ text: terrLan["lucky3patti_error_" + param_["nTipsID"]] });
				break;
			}
		}
	}
	private onGameStart<T, U>(cmd_: T, param_: U): void {
		// 重置数据
		this.m_desk.resetData();
		this.m_desk.setGameState(LUCKY3PT_GAME_STATE.playing);
		this.m_desk.setLeaveTime(param_["nLeaveTime"]);
		this.m_desk.setChipScore(param_["nChipScore"]);
		this.m_desk.setUserMaxJettonScore(param_["nUserMaxJettonScore"]);
		this.m_desk.setJettonRechargeLimit(param_["nJettonRechargeLimit"]);
	}
	private onGameEnd<T, U>(cmd_: T, param_: U): void {
		this.m_desk.setGameState(LUCKY3PT_GAME_STATE.free);
		this.m_desk.setResultData(param_);
		this.m_desk.setLeaveTime(param_["nLeaveTime"]);
		this.m_desk.setHeapcard(param_["nCardData"]);
		this.m_desk.setCardType(param_["nCardType"]);
		this.m_desk.addTrend(param_);
		if (this.m_desk.setWinner(param_["bigWinner"])) {
			app.event.dispatchEvent({
				eventName: EVENT_ID.EVENT_LUCKY3PATTI_UPDATE_BIGWINNER,
			})
		}
	}
	private onGameJetton<T, U>(cmd_: T, param_: U): void {
		if (LUCKY3PT_GAME_STATE.free == this.m_desk.getGameState()) {
			return;
		}
		// 保存上一次下注的下标
		let tindex = param_["index"];
		let tbetChips = this.m_desk.getBaseChip();
		let tjettonScore = this.m_desk.getJettonScore();
		let tuserMaxJettonScore = this.m_desk.getUserMaxJettonScore();
		let tjettonRechargeLimit = this.m_desk.getJettonRechargeLimit();
		let tcharge = center.user.getActorProp(ACTOR.ACTOR_PROP_RECHARGE_AMOUNT);
		if (0 != tjettonRechargeLimit && tcharge < tjettonRechargeLimit) {
			app.popup.showDialog(fw.BundleConfig.plaza.res[`premium/premium`],{
				nPriceNum : tjettonRechargeLimit,
				tips_1 : fw.language.get("You can only bet once ,unless you are an premium player.")
			});
			return;
		}
		if (0 != tuserMaxJettonScore && tuserMaxJettonScore < tjettonScore[tindex] + tbetChips) {
			return;
		}
		if (tbetChips > center.user.getActorProp(ACTOR.ACTOR_PROP_GOLD)) {
			center.giftBag.showGiftBagDialog(()=>{
				app.popup.showDialog(fw.BundleConfig.plaza.res[`shop/quickRecharge`], {
					nRechargeNumMin: (tbetChips - gameCenter.user.getGold()) / DF_RATE
				});
			})
			return;
		}
		// 下注
		center.lucky3pt.sendGameJetton(tindex, tbetChips);
	}

	private onGameJettonRet<T, U>(cmd_: T, param_: U): void {
		// 游戏下注
		if (this.m_hostPlayer.nChairID == param_["nChairID"]) {
			this.m_desk.addJettonScore(param_["nJettonArea"], param_["nJettonScore"]);
		}
		this.m_desk.addAllJettonScore(param_["nJettonArea"], param_["nJettonScore"]);
	}
	private onRev_callback<T, U>(cmd_: T, param_: U): void {

	}

	public onViewDestroy(): void {
		this.m_desk = null;
		//注销所有事件
		var teventsData = [
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_DATA, callback: this.onGameData.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_SYNCDATA, callback: this.onSyncData.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_TIPS, callback: this.onGameTips.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_START, callback: this.onGameStart.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_END, callback: this.onGameEnd.bind(this) },

			{ event: EVENT_ID.EVENT_LUCKY3PATTI_JETTON, callback: this.onGameJetton.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_JETTON_RET, callback: this.onGameJettonRet.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_REBET, callback: this.onRev_callback.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_JACKPOT, callback: this.onRev_callback.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_HISTORY, callback: this.onRev_callback.bind(this) },

			{ event: EVENT_ID.EVENT_LUCKY3PATTI_RECORDS, callback: this.onRev_callback.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_QUESTION, callback: this.onRev_callback.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_CHANGE_BET_CHIP, callback: this.onRev_callback.bind(this) },
			{ event: EVENT_ID.EVENT_LOGIN_SOCKETERROR, callback: this.onRev_callback.bind(this) },

		];

		teventsData.forEach(element => {
			app.event.removeEvent(
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
}
