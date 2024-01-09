import { js } from 'cc';
import { _decorator } from 'cc';
import { ACTOR } from '../../config/cmd/ActorCMD';
import { DF_RATE, DF_SYMBOL } from '../../config/ConstantConfig';
import { EVENT_ID } from "../../config/EventConfig";
import { bool, GS_PLAZA_MSGID, sint, sint64, slong, stchar, uchar, uint, ulong, ushort } from '../../config/NetConfig';
import { PlazeMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";
const { ccclass } = _decorator;
import proto from "../common";
import { PAY_MODE } from '../../config/ModuleConfig';

let PLAZA_TASKACTIVE_MSG_TIPS = 0 				// tips提示
let PLAZA_TASKACTIVE_STOP_SERVER_TIPS = 1                  //停服提示
let PLAZA_TASKACTIVE_SEVENACTIVE_REQ = 2                  	//请求7天活动奖励

let PLAZA_TASKACTIVE_SEVENACTIVE_RET = 3                  	//请求7天活动奖励返回
let PLAZA_TASKACTIVE_SEVENACTIVE_DATA = 4                  //请求7天活动数据信息
let PLAZA_TASKACTIVE_SEVENACTIVE_CONFIG = 5                //7天活动配置
let PLAZA_TASKACTIVE_MULTIOPEN_SEVEN_REWRAD_REQ = 6                //7天抽奖请求奖励
let PLAZA_TASKACTIVE_MULTIOPEN_SEVEN_REWRAD_RET = 7                //7天抽奖请求奖励返回

let PLAZA_TASKACTIVE_MULTIOPEN_SEVEN_REWRAD_DATA = 8               //7天抽奖用户数据
let PLAZA_TASKACTIVE_MULTIOPEN_SEVEN_REWRAD_CONFIG = 9             //7天抽奖控制开关


export enum MultiopenSevenRewardType {
	cash = 1,
	bouns,
	gift
}

export interface RewardData {
	rewardType: number;
	nID: number;
	rewardNum: number;
	rewardMult: number;
}
export interface MultiopenSevenRewardData {
	nextGetTime: number;
	signDay: number;
	giftRewardCanBuy: boolean;
	rewardData: RewardData;
}

@ccclass('taskActiveCenter')
export class taskActiveCenter extends PlazeMainInetMsg {
	// cmd = proto.plaza_taskactive.GS_PLAZA_TASKACTIVE_MSG

	private mSevenActiveOpen: boolean;

	private mSevenSignBuyGift: boolean;
	private mSevenSignDay: number;
	private nEndTime: number;

	private mSevenActiveGiftID: number;
	private mSevenActiveSignReward;
	private mMultiopenSevenRewardOpen: boolean;
	private mMultiopenSevenRewardData: MultiopenSevenRewardData;

	private m_timer: number;  // 计时器移除
	private m_timer1: number; // 
	mSevenActiveChargeLimit: number;

	/**玩家数据，进入登录界面时会初始化数据（初始化为value），需要的请将简直插入该Map中 */
	private userDatas: Map<string, any> = new Map()
	initData() {
		this.initMainID(GS_PLAZA_MSGID.GS_PLAZA_MSGID_TASKACTIVE);
		this.cleanUserData();
	}

	cleanUserData() {
		this.mSevenActiveOpen = false;  //7天签到开关
		this.mSevenSignBuyGift = false; //7天签到充值标记
		this.mSevenSignDay = 0; //7天签到天数(已经签到的天数 从0开始)
		this.nEndTime = 0; //7天签到下一次时间戳
		this.mSevenActiveChargeLimit = 0; //7天签到充值限制
		this.mSevenActiveGiftID = 0; //7天签到充值礼拜id
		this.mSevenActiveSignReward = [];
		//7天抽奖
		this.mMultiopenSevenRewardOpen = false;
		this.mMultiopenSevenRewardData = {
			nextGetTime: 0,
			signDay: 0,
			giftRewardCanBuy: false,
			rewardData: {
				rewardType: 0,
				nID: 0,
				rewardNum: 0,
				rewardMult: 0,
			}
		};
		//清理用户数据
		for (let [key, value] of this.userDatas) {
			this[key] = value;
		}
	}

	// initRegister() {
	// 	this.bindMsgStructPB(PLAZA_TASKACTIVE_MSG_TIPS, proto.plaza_taskactive.gs_task_active_tips_s)
	// 	this.bindRecvFunc(PLAZA_TASKACTIVE_MSG_TIPS, this.OnRecv_Tips.bind(this))

	// 	this.bindMsgStructPB(PLAZA_TASKACTIVE_STOP_SERVER_TIPS, proto.plaza_taskactive.gs_stop_server_tips_s)
	// 	this.bindRecvFunc(PLAZA_TASKACTIVE_STOP_SERVER_TIPS, this.OnRecv_stopServerTips.bind(this))

	// 	this.bindMsgStructPB(PLAZA_TASKACTIVE_SEVENACTIVE_REQ, proto.plaza_taskactive.gs_seven_active_req_c)

	// 	this.bindMsgStructPB(PLAZA_TASKACTIVE_SEVENACTIVE_RET, proto.plaza_taskactive.gs_seven_active_ret_s)
	// 	this.bindRecvFunc(PLAZA_TASKACTIVE_SEVENACTIVE_RET, this.OnRecv_SevenactiveRet.bind(this))

	// 	this.bindMsgStructPB(PLAZA_TASKACTIVE_SEVENACTIVE_DATA, proto.plaza_taskactive.gs_seven_active_data_s)
	// 	this.bindRecvFunc(PLAZA_TASKACTIVE_SEVENACTIVE_DATA, this.OnRecv_SevenactiveData.bind(this))

	// 	this.bindMsgStructPB(PLAZA_TASKACTIVE_SEVENACTIVE_CONFIG, proto.plaza_taskactive.gs_seven_active_cfg_s)
	// 	this.bindRecvFunc(PLAZA_TASKACTIVE_SEVENACTIVE_CONFIG, this.OnRecv_SevenactiveConfig.bind(this))

	// 	this.bindMsgStructPB(PLAZA_TASKACTIVE_MULTIOPEN_SEVEN_REWRAD_REQ, proto.plaza_taskactive.gs_reques_seven_reward_req_c)

	// 	this.bindMsgStructPB(PLAZA_TASKACTIVE_MULTIOPEN_SEVEN_REWRAD_RET, proto.plaza_taskactive.gs_multi_open_seven_reward_ret_s)
	// 	this.bindRecvFunc(PLAZA_TASKACTIVE_MULTIOPEN_SEVEN_REWRAD_RET, this.OnRecv_MultiopenSevenRewradRet.bind(this))

	// 	this.bindMsgStructPB(PLAZA_TASKACTIVE_MULTIOPEN_SEVEN_REWRAD_DATA, proto.plaza_taskactive.gs_multi_open_seven_reward_data_s)
	// 	this.bindRecvFunc(PLAZA_TASKACTIVE_MULTIOPEN_SEVEN_REWRAD_DATA, this.OnRecv_MultiopenSevenRewradData.bind(this))

	// 	this.bindMsgStructPB(PLAZA_TASKACTIVE_MULTIOPEN_SEVEN_REWRAD_CONFIG, proto.plaza_taskactive.gs_multi_open_seven_reward_cfg_s)
	// 	this.bindRecvFunc(PLAZA_TASKACTIVE_MULTIOPEN_SEVEN_REWRAD_CONFIG, this.OnRecv_MultiopenSevenRewradConfig.bind(this))

	// 	/**水果机财务天降--began------------------------------------- */
	// 	//财务天降配置
	// 	this.bindMessage({
	// 		cmd: this.cmd.PLAZA_TASKACTIVE_SLOTBAG_TASK_CFG,
	// 		struct: proto.plaza_taskactive.slot_bag_task,
	// 		callback: this.PLAZA_TASKACTIVE_SLOTBAG_TASK_CFG.bind(this),
	// 	});
	// 	//财务天降购买
	// 	this.bindMessage({
	// 		cmd: this.cmd.PLAZA_TASKACTIVE_SLOTBAG_TASK_BUY,
	// 		struct: proto.plaza_taskactive.slot_bag_task_buy,
	// 	});
	// 	//财务天降进度信息
	// 	this.bindMessage({
	// 		cmd: this.cmd.PLAZA_TASKACTIVE_SLOTBAG_TASK_CHANGE,
	// 		struct: proto.plaza_taskactive.slot_bag_task_change,
	// 		callback: this.PLAZA_TASKACTIVE_SLOTBAG_TASK_CHANGE.bind(this),
	// 	});
	// 	//请求财务天降任务领奖
	// 	this.bindMessage({
	// 		cmd: this.cmd.PLAZA_TASKACTIVE_SLOTBAG_TASK_GETPRIZE,
	// 		struct: proto.plaza_taskactive.slot_bag_task_get_prize,
	// 	});
	// 	//财务天降任务领奖返回
	// 	this.bindMessage({
	// 		cmd: this.cmd.PLAZA_TASKACTIVE_SLOTBAG_TASK_PRIZERET,
	// 		struct: proto.plaza_taskactive.slot_bag_task_prize_ret,
	// 		callback: this.PLAZA_TASKACTIVE_SLOTBAG_TASK_PRIZERET.bind(this),
	// 	});
	// 	//订单信息返回
	// 	this.bindMessage({
	// 		cmd: this.cmd.PLAZA_TASKACTIVE_ORDER_INFO_RET,
	// 		struct: proto.plaza_taskactive.order_info_ret,
	// 		callback: this.PLAZA_TASKACTIVE_ORDER_INFO_RET.bind(this),
	// 	});
	// 	/**水果机财务天降--end------------------------------------- */

	// 	/**水果机财务天降之普通礼包，在水果机财务天降前触发--began------------------------------------- */
	// 	//财务天降配置
	// 	this.bindMessage({
	// 		cmd: this.cmd.PLAZA_TASKACTIVE_SLOTBAG_TASK_CFG_EX,
	// 		struct: proto.plaza_taskactive.slot_bag_task_ex,
	// 		callback: this.PLAZA_TASKACTIVE_SLOTBAG_TASK_CFG_EX.bind(this),
	// 	});
	// 	//财务天降购买
	// 	this.bindMessage({
	// 		cmd: this.cmd.PLAZA_TASKACTIVE_SLOTBAG_TASK_BUY_EX,
	// 		struct: proto.plaza_taskactive.slot_bag_task_buy_ex,
	// 	});
	// 	/**水果机财务天降之普通礼包，在水果机财务天降前触发--end------------------------------------- */
	// }
	private OnRecv_Tips(dict: proto.plaza_taskactive.gs_task_active_tips_s): void {
		if ("string" == typeof (dict.msg) && "" != dict.msg) {
			app.popup.showToast({ text: dict.msg });
		}
	}
	// ================================= 等级系统=============================================
	private OnRecv_stopServerTips(dict: proto.plaza_taskactive.gs_stop_server_tips_s): void {
		app.popup.showToast({ text: dict.text });
	}
	private OnRecv_SevenactiveRet(dict: proto.plaza_taskactive.gs_seven_active_ret_s): void {
		if (1 == dict.sucess) {
			let toShowScratchcard = () => {
				// ios 审核 不检测刮刮卡
				if (!app.sdk.isIosDev()) {
					// 签到完后检测刮刮卡是否展示
					if (center.scratchCard.canGetScratchcardReward()) {
						app.popup.showDialog({
							viewConfig: fw.BundleConfig.plaza.res[`scratchCard/scratchCard`]
						});
					}
				}
			}
			if ((<any>this).isReqDrawReward) {
				(<any>this).isReqDrawReward = false;
				app.event.dispatchEvent({
					eventName: "UpdateSiginboradFanpai",
					data: {
						rewardNum: dict.reward_num,
						callback: toShowScratchcard,
					}
				})
			} else {
				toShowScratchcard();
				let data: any = {}
				data.reward = [{ nGoodsID: dict.reward_id, nGoodsNum: dict.reward_num }]
				data.extend = { bDontShowTitle: true }
				app.popup.showDialog({
					viewConfig: fw.BundleConfig.resources.res[`ui/reward/reward`],
					data: data,
				});
			}
		} else {
			app.popup.showToast({ text: "fail" });
		}
		app.event.dispatchEvent({ eventName: EVENT_ID.EVENT_PLAZA_SEVEN_ACTIVE_REWARD_RET, });
	}
	private OnRecv_SevenactiveData(dict: proto.plaza_taskactive.gs_seven_active_data_s): void {
		this.mSevenSignBuyGift = dict.sign_flag > 0;
		this.mSevenSignDay = dict.sign_day;
		this.nEndTime = dict.end_time - dict.server_times + app.func.time();
		app.event.dispatchEvent({ eventName: EVENT_ID.EVENT_PLAZA_SEVEN_ACTIVE_DATA, });
		app.event.dispatchEvent({
			eventName: "UpdateActivityBtn",
			data: "Siginborad"
		})
	}
	private OnRecv_SevenactiveConfig(dict: proto.plaza_taskactive.gs_seven_active_cfg_s): void {
		this.mSevenActiveOpen = dict.state == 1;
		this.mSevenActiveChargeLimit = dict.charge_limit;
		this.mSevenActiveGiftID = dict.gift_id;
		this.mSevenActiveSignReward = dict.continue_sign_reward.seven_continue_goods;
		(<any>this).mSevenActiveDrawDay = dict.draw_day || 0;
		(<any>this).mSevenActiveDrawMax = dict.draw_max || 0;
		app.event.dispatchEvent({ eventName: EVENT_ID.EVENT_PLAZA_SEVEN_ACTIVE_DATA, });
		app.event.dispatchEvent({
			eventName: "UpdateActivityBtn",
			data: "Siginborad"
		})
	}
	private OnRecv_MultiopenSevenRewradRet(dict: proto.plaza_taskactive.gs_multi_open_seven_reward_ret_s): void {
		if (1 == dict.sucess) {
			let rewardData = {
				rewardType: dict.reward_type,
				nID: dict.goods_id,
				rewardNum: dict.reward_num,
				rewardMult: dict.reward_mul,
			}
			app.event.dispatchEvent({ eventName: "OnRecv_MultiopenSevenRewradRet", dict: rewardData });
		}
	}
	private OnRecv_MultiopenSevenRewradData(dict: proto.plaza_taskactive.gs_multi_open_seven_reward_data_s): void {
		this.mMultiopenSevenRewardData.nextGetTime = dict.end_time - dict.server_times + app.func.time();
		this.mMultiopenSevenRewardData.signDay = dict.sign_day;
		this.mMultiopenSevenRewardData.giftRewardCanBuy = dict.gift_reward_flag == 0;
		this.mMultiopenSevenRewardData.rewardData.rewardType = dict.reward_type;
		this.mMultiopenSevenRewardData.rewardData.nID = dict.gift_packet_id;
		this.mMultiopenSevenRewardData.rewardData.rewardNum = dict.reward_num;
		this.mMultiopenSevenRewardData.rewardData.rewardMult = dict.reward_mul;
		app.event.dispatchEvent({ eventName: "OnRecv_MultiopenSevenRewradData", });
		app.event.dispatchEvent({
			eventName: "UpdateActivityBtn",
			data: "SevenDayLuck"
		})
	}
	private OnRecv_MultiopenSevenRewradConfig(dict: proto.plaza_taskactive.gs_multi_open_seven_reward_cfg_s): void {
		this.mMultiopenSevenRewardOpen = dict.state == 1;
	}

	public sendMultiopenSevenRewradReq(): void {
		let data = proto.plaza_taskactive.gs_reques_seven_reward_req_c.create()
		this.sendMessage({
			cmd: PLAZA_TASKACTIVE_MULTIOPEN_SEVEN_REWRAD_REQ,
			data: data
		});
	}
	// 请求7天活动奖励
	public sendSevenactive(isDrawReward: boolean = false): void {
		(<any>this).isReqDrawReward = isDrawReward
		let data = proto.plaza_taskactive.gs_seven_active_req_c.create()
		this.sendMessage({
			cmd: PLAZA_TASKACTIVE_SEVENACTIVE_REQ,
			data: data
		});
	}
	public getSevenActiveDrawData() {
		let drawData = {
			drawDay: (<any>this).mSevenActiveDrawDay || 0,
			drawMax: (<any>this).mSevenActiveDrawMax || 0,
		}
		return drawData
	}
	public isSevenActiveOpen(): boolean {
		return this.mSevenActiveOpen && !(7 <= this.mSevenSignDay);
	}
	public isCanSignSevenActive(): boolean {
		return this.nEndTime <= app.func.time();
	}
	public isCanPopupSignSevenActiveFromLogin(): boolean {
		if (this.isSevenActiveOpen() && this.isCanSignSevenActive()) {
			if (6 == this.mSevenSignDay) {
				let lastPopupDay = app.file.getIntegerForKey("PopupSignSevenActiveFromLogin", 0);
				return lastPopupDay != this.mSevenSignDay;
			} else {
				return true;
			}
		}
		return false;
	}
	public savePopupSignSevenActiveFromLogin(): void {
		app.file.setIntegerForKey("PopupSignSevenActiveFromLogin", this.mSevenSignDay);
	}
	public getNextSignTime(): number {
		return this.nEndTime;
	}
	public getSevenActiveSignReward(): proto.plaza_taskactive.ISevenContinueSignGoods[] {
		return this.mSevenActiveSignReward;
	}
	public getSevenActiveGiftInfo(): number {
		return this.mSevenActiveGiftID;
	}
	public isBuyGiftSevenActive(): boolean {
		return this.mSevenSignBuyGift;
	}
	public getSevenActiveSignDay(): number {
		return this.mSevenSignDay;
	}
	public isMultiopenSevenRewardOpen(): boolean {
		return this.mMultiopenSevenRewardOpen && this.mMultiopenSevenRewardData.signDay < 7;
	}
	public getMultiopenSevenRewardData(): MultiopenSevenRewardData {
		return this.mMultiopenSevenRewardData;
	}
	public isMultiopenSevenRewardSign(): boolean {
		if (this.isMultiopenSevenRewardOpen()) {
			if (this.mMultiopenSevenRewardData.nextGetTime <= app.func.time()) {
				return true;
			}
		}
		return false;
	}
	public isMultiopenSevenRewardActiveFromLogin(): boolean {
		if (this.isMultiopenSevenRewardOpen()) {
			if (this.mMultiopenSevenRewardData.nextGetTime <= app.func.time()) {
				return true;
			} else {
				return this.isMultiopenSevenRewardGiftCanBuy();
			}
		}
		return false;
	}
	public isMultiopenSevenRewardGiftCanBuy(): boolean {
		if (this.isMultiopenSevenRewardOpen()
			&& MultiopenSevenRewardType.gift == this.mMultiopenSevenRewardData.rewardData.rewardType
			&& this.mMultiopenSevenRewardData.giftRewardCanBuy) {
			return true;
		}
		return false;
	}
	public getMultiopenSevenRewardType() {
		return MultiopenSevenRewardType
	}


	/**水果机财务天降--began------------------------------------- */
	/**水果机财务天降状态 */
	SlotBagState = {
		/**还未开始 */
		None: 0,
		/**活动已关闭，或者无配置 */
		Close: 1,
		/**等待购买阶段 */
		Buy: 2,
		/**任务阶段 */
		Task: 3,
	}
	getSlotBagTaskState() {
		const slotBagConfig: proto.plaza_taskactive.Islot_bag_task = (<any>this).slotBagConfig;
		if (slotBagConfig) {
			if (slotBagConfig.is_open) {
				const nKindID = gameCenter.room.getRoomKindID();
				//游戏是否勾选
				if (slotBagConfig.room_id.indexOf(nKindID) != -1) {
					const nTime = app.func.time();
					if (slotBagConfig.left_finish_time <= 0) {
						if (nTime < slotBagConfig.left_show_time) {
							return this.SlotBagState.Buy;
						}
					} else {
						if (nTime < slotBagConfig.left_finish_time) {
							let nFinishCount = 0;
							const slotBagTaskList = this.getSlotBagTaskList();
							app.func.positiveTraversal(slotBagTaskList.task_list, (element) => {
								if (element.is_prized) {
									++nFinishCount;
								}
							});
							if (nFinishCount == slotBagTaskList.task_list.length) {
								return this.SlotBagState.Close;
							}
							return this.SlotBagState.Task;
						}
					}
				}
			}
			return this.SlotBagState.Close;
		}
		return this.SlotBagState.None;
	}
	getSlotBagTaskConfig(): proto.plaza_taskactive.Islot_bag_task | null {
		return (<any>this).slotBagConfig;
	}
	getSlotBagTaskList(): proto.plaza_taskactive.Islot_bag_task_change | null {
		return (<any>this).slotBagTaskList;
	}
	send_PLAZA_TASKACTIVE_SLOTBAG_TASK_BUY(data: proto.plaza_taskactive.Islot_bag_task_buy) {
		const slotBagTaskState = this.getSlotBagTaskState();
		if (slotBagTaskState == this.SlotBagState.Close) {
			app.event.dispatchEvent({
				eventName: `SlotBagTaskState`,
				data: slotBagTaskState,
			});
			return;
		}
		const quickRecharge = center.roomList.getQuickRecharge(data.recharge_rid);
		if (quickRecharge) {
			app.sdk.setPrice(quickRecharge.nQuickNeedRMB);
			app.sdk.setGoodsName(`${DF_SYMBOL}${quickRecharge.nQuickNeedRMB}`);
			app.sdk.setRID(quickRecharge.nRID);
			app.sdk.setPayMode(PAY_MODE.PAY_MODE_NOR);
			let cash = quickRecharge.nQuickGoodsNum;
			let bonus = quickRecharge.nQuickGiveGoodsNum[0];
			let dataEx: PayChannelData = {
				cashBonusInfo: {
					cash: cash / DF_RATE,
					bonus: bonus / DF_RATE,
					payCash: quickRecharge.nQuickNeedRMB,
				},
				orderCallback: () => {
					this.sendMessage({
						cmd: this.cmd.PLAZA_TASKACTIVE_SLOTBAG_TASK_BUY,
						data: data,
					});
				},
				isAutoSelect: true,
				extend: {
					recharge_rid: data.recharge_rid,
				}
			}
			center.mall.payChooseType(dataEx);
		} else {
			app.popup.showToast(`Slot gift failed: ${data.recharge_rid}`);
		}
	}
	send_PLAZA_TASKACTIVE_SLOTBAG_TASK_GETPRIZE(data: proto.plaza_taskactive.Islot_bag_task_get_prize) {
		const slotBagTaskState = this.getSlotBagTaskState();
		if (slotBagTaskState == this.SlotBagState.Close) {
			app.event.dispatchEvent({
				eventName: `SlotBagTaskState`,
				data: slotBagTaskState,
			});
			return;
		}
		this.sendMessage({
			cmd: this.cmd.PLAZA_TASKACTIVE_SLOTBAG_TASK_GETPRIZE,
			data: data,
		});
	}
	PLAZA_TASKACTIVE_SLOTBAG_TASK_CFG(data: proto.plaza_taskactive.slot_bag_task) {
		//任务配置
		(<any>this).slotBagConfig = data;
		!this.userDatas.has(`slotBagConfig`) && this.userDatas.set(`slotBagConfig`, undefined);
		app.event.dispatchEvent({
			eventName: this.cmd[this.cmd.PLAZA_TASKACTIVE_SLOTBAG_TASK_CFG],
		});
	}
	PLAZA_TASKACTIVE_SLOTBAG_TASK_CHANGE(data: proto.plaza_taskactive.slot_bag_task_change) {
		//任务列表
		const slotBagTaskList = this.getSlotBagTaskList();
		!this.userDatas.has(`slotBagTaskList`) && this.userDatas.set(`slotBagTaskList`, undefined);
		if (slotBagTaskList) {
			data.task_list.forEach((element1, index1) => {
				app.func.positiveTraversal(slotBagTaskList.task_list, (element2, index2) => {
					if (element1.task_id == element2.task_id) {
						slotBagTaskList.task_list[index2] = element1;
						app.event.dispatchEvent({
							eventName: this.cmd[this.cmd.PLAZA_TASKACTIVE_SLOTBAG_TASK_CHANGE],
							data: element1,
						});
						return true;
					}
				});
			});
		} else {
			(<any>this).slotBagTaskList = data;
		}
	}
	PLAZA_TASKACTIVE_SLOTBAG_TASK_PRIZERET(data: proto.plaza_taskactive.slot_bag_task_prize_ret) {
		//任务列表
		const slotBagTaskList: proto.plaza_taskactive.Islot_bag_task_change = (<any>this).slotBagTaskList;
		if (slotBagTaskList) {
			app.func.positiveTraversal(slotBagTaskList.task_list, (element) => {
				if (element.task_id == data.task_id) {
					//标记完成
					element.is_prized = true;
					return true;
				}
			});
		}
		//显示奖励
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.resources.res[`ui/reward/reward`],
			data: <RewardDataParam>{
				reward: [{
					nGoodsID: data.prop_id,
					nGoodsNum: data.prop_num,
				}]
			},
		});
	}
	PLAZA_TASKACTIVE_ORDER_INFO_RET(data: proto.plaza_taskactive.order_info_ret) {
		app.sdk.setOrderNum(data.order);
		app.sdk.pay();
	}
	/**水果机财务天降--end------------------------------------- */


	/**水果机财务天降之普通礼包，在水果机财务天降前触发--began------------------------------------- */
	/**水果机财务天降状态 */
	SlotBagBefState = {
		/**还未开始 */
		None: 0,
		/**活动已关闭，或者无配置 */
		Close: 1,
		/**等待购买阶段 */
		Buy: 2,
	}
	getSlotBagBefState() {
		const slotBagBefConfig: proto.plaza_taskactive.slot_bag_task_ex = (<any>this).slotBagBefConfig;
		if (slotBagBefConfig) {
			if (slotBagBefConfig.is_open) {
				const nKindID = gameCenter.room.getRoomKindID();
				//游戏是否勾选
				if (slotBagBefConfig.room_id.indexOf(nKindID) != -1) {
					const nTime = app.func.time();
					if (nTime <= slotBagBefConfig.left_show_time) {
						return this.SlotBagBefState.Buy;
					}
				}
			}
			return this.SlotBagBefState.Close;
		}
		return this.SlotBagBefState.None;
	}
	getSlotBagBefConfig(): proto.plaza_taskactive.slot_bag_task_ex | null {
		return (<any>this).slotBagBefConfig;
	}
	send_PLAZA_TASKACTIVE_SLOTBAG_TASK_BUY_EX(data: proto.plaza_taskactive.Islot_bag_task_buy_ex) {
		const slotBagBefState = this.getSlotBagBefState();
		if (slotBagBefState == this.SlotBagBefState.Close) {
			app.event.dispatchEvent({
				eventName: `SlotBagBefState`,
				data: slotBagBefState,
			});
			return;
		}
		const quickRecharge = center.roomList.getQuickRecharge(data.recharge_rid);
		if (quickRecharge) {
			app.sdk.setPrice(quickRecharge.nQuickNeedRMB);
			app.sdk.setGoodsName(`${DF_SYMBOL}${quickRecharge.nQuickNeedRMB}`);
			app.sdk.setRID(quickRecharge.nRID);
			app.sdk.setPayMode(PAY_MODE.PAY_MODE_NOR);
			let cash = quickRecharge.nQuickGoodsNum;
			let bonus = quickRecharge.nQuickGiveGoodsNum[0];   //说是只会送一个,  多个也只读取第一个
			let giftText = "BONUS";
			if (quickRecharge.nQuickGiveGoodsID[0] == center.goods.gold_id.withdraw_gold) {
				giftText = "WITHDRAW";
			} else if (quickRecharge.nQuickGiveGoodsID[0] == center.goods.gold_id.cash) {
				giftText = "CASH";
			}
			let dataEx: PayChannelData = {
				cashBonusInfo: {
					cash: cash / DF_RATE,
					bonus: bonus / DF_RATE,
					payCash: quickRecharge.nQuickNeedRMB,
				},
				orderCallback: () => {
					this.sendMessage({
						cmd: this.cmd.PLAZA_TASKACTIVE_SLOTBAG_TASK_BUY_EX,
						data: data,
					});
				},
				giftText: giftText,
				isAutoSelect: true,
				extend: {
					recharge_rid: data.recharge_rid,
				}
			}
			center.mall.payChooseType(dataEx);
		} else {
			app.popup.showToast(`Slot gift bef failed: ${data.recharge_rid}`);
		}
	}
	PLAZA_TASKACTIVE_SLOTBAG_TASK_CFG_EX(data: proto.plaza_taskactive.slot_bag_task_ex) {
		//任务配置
		(<any>this).slotBagBefConfig = data;
		!this.userDatas.has(`slotBagBefConfig`) && this.userDatas.set(`slotBagBefConfig`, undefined);
		app.event.dispatchEvent({
			eventName: this.cmd[this.cmd.PLAZA_TASKACTIVE_SLOTBAG_TASK_CFG_EX],
		});
	}
	/**水果机财务天降之普通礼包，在水果机财务天降前触发--end------------------------------------- */

	onViewDestroy() {
		if (null == this.m_timer) {
			clearInterval(this.m_timer);
			this.m_timer = null;
		}
		if (null == this.m_timer1) {
			clearInterval(this.m_timer1);
			this.m_timer1 = null;
		}
		super.onViewDestroy();
	}
}

