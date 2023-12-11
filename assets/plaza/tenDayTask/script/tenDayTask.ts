import { instantiate, Prefab, sp, Node, Sprite, SpriteFrame, _decorator, Label, Tween, tween, Vec3, js, ProgressBar, v3, UITransform, Font } from 'cc';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
import { DF_RATE, DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { guide_hand_1 } from '../../../resources/ui/guide/script/guide_hand_1';
import { EVENT_ID } from '../../../app/config/EventConfig';
import { ENCONTAINER_PACKET } from '../../../app/center/userCenter';
import { TaskType } from '../../../app/center/plaza/taskCenter';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import proto from '../../../app/center/common';
const { ccclass } = _decorator;

let TASKPROCESS_TYPE_PLAY = 0                    // 游戏总局数
let TASKPROCESS_TYPE_SETTLEMENTTOTALGOLD = 7     // 结算赢取金币总量
let TASKPROCESS_TYPE_ALLRECHARGE = 16            // 累计充值
let TASKPROCESS_TYPE_LOGIN = 48                  // 登录任务

@ccclass('tenDayTask')
export class tenDayTask extends (FWDialogViewBase) {
	m_turnTableView: Node;
	clockTimer: number;
	titems: any
	totalGetTime: any;
	contentHeight: number;
	initData() {

	}
	protected initEvents(): boolean | void {
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_TEN_DAY_TASK_ACTIVITY_DATA,
			],
			callback: (arg1, arg2) => {
			}
		});
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_PLAZA_TASK_CHANGE,
			],
			callback: (arg1, arg2) => {
				let dict:proto.plaza_task.gs_task_change_s = arg1.dict
				let taskInfo = center.task.getTaskViewByListID(dict.task_list_id)
				if (taskInfo && TaskType.TASK_TYPE_TENDAYTASK == Number(taskInfo.type)) {
					if (Number(dict.now_finish) >= Number(taskInfo.finish_times)) {
						this.onFlyCoins(dict.task_list_id, taskInfo.reward_count)
					}
				}
			}
		});
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_TEN_DAY_TASK_ACTIVITY_RET,
			],
			callback: (arg1, arg2) => {
				let dict:proto.plaza_task.Igs_tenday_task_ret_s = arg1.dict
				if (1 == dict.req_type) {
					let trewards = center.task.getTenDayTurnTableRewards()
					if (trewards && 0 < trewards.length) {
						if (0 < dict.good_count) {
							this.onFlyTurnTable(dict.good_count)
						}
					}
				} else if (1 == dict.success_flag) {
					this.onClickClose()
					let data: any = {}
					data.reward = [{nGoodsID:dict.good_id, nGoodsNum:dict.good_count}]
					data.extend =  {bDontShowTitle:true}
					app.popup.showDialog({
						viewConfig: fw.BundleConfig.resources.res[`ui/reward/reward`],
                        data: data,
					});
				}
			}
		});
	}
	protected initView(): boolean | void {
		this.Items.Image_none.active = false
		this.Items.ListView_task.active = false
		this.Items.Panel_task_item.active = false
		this.Items.Panel_remain_tips.active = false
		this.Items.Panel_coins.active = false

		this.showRemainTime()
		this.updateView()

		this.m_turnTableView = this.Items.Node_turntable.Items.NodeTurntable;
		this.m_turnTableView.active = false;

		let tfonfig = center.task.getTenDayTaskConfig()
		let tgoldsNum = center.userContainer.getGoodNum(ENCONTAINER_PACKET, tfonfig.tenday_taskgoodsid)
		if (tgoldsNum >= tfonfig.max_value) {
			this.Items.btn_com_anim.obtainComponent(sp.Skeleton).setAnimation(0, "da", true);
		}

		this.Items.Text_complete.string = fw.language.get("Collect");
		this.Items.Text_turntable.string = fw.language.get("Get 1 spin for every 3 tasks completed");

		this.checkShowTrunTableView()
	}
	protected initBtns(): boolean | void {
		this.Items.Button_close.onClickAndScale(this.onClickClose.bind(this))
		this.Items.Image_turntable.onClickAndScale(this.onClickTurntable.bind(this))
		this.Items.Button_complete.onClickAndScale(this.onClickComplete.bind(this))
	}
	updateView() {
		let tdata = center.task.getTenDayTaskData()
		let tfonfig = center.task.getTenDayTaskConfig()
		let ttask = center.task.getSplitTenDayTaskData()
		let ttodayTaskgoldsNum = 0
		let tgoldsNum = center.userContainer.getGoodNum(ENCONTAINER_PACKET, tfonfig.tenday_taskgoodsid)
		if (tfonfig.max_value <= tgoldsNum) {
			this.Items.Image_none.active = true
			this.Items.ListView_task.active = false
		} else {
			this.Items.Image_none.active = false
			this.Items.ListView_task.active = true
		}

		// --获取当前在做的三个任务的数据和对应的天数
		// --如果有就显示
		this.Items.ListView_task.Items.content.removeAllChildren(true)

		this.titems = []
		if (tdata) {
			if (tdata.task_id && 0 < tdata.task_id.list.length) {
				tdata.task_id.list.forEach((v, k) => {
					let ttaskData: TenDayTask
					let ttaskItem: TenDayTask
					let tflag = true
					if (0 < v) {
						tflag = true
						ttaskData = center.task.getTaskViewByListID(v) as TenDayTask
						if (TASKPROCESS_TYPE_LOGIN == ttaskData.process_type) {
							// --获取任务进度
							ttaskItem = center.task.getTaskItem(ttaskData.task_list_id) as TenDayTask
							// --沒找到任务进度信息
							if (!ttaskItem) {
								ttaskData.now_finish = 0
								ttaskData.boxState = 1
							} else {
								ttaskData.now_finish = ttaskItem.now_finish
								ttaskData.boxState = 1
								if (ttaskItem.receive_finish == ttaskData.finish_times) {
									// --已领取
									ttaskData.boxState = 3
								} else if ((ttaskItem.now_finish / ttaskData.finish_times) >= 1) {
									// --已完成未领取
									ttaskData.boxState = 2
								} else {
									// --未完成
									ttaskData.boxState = 1
								}
							}
							if (1 == ttaskData.boxState) {
								tflag = false
							}
						}
					}
					if (0 < v && true == tflag) {
						ttaskData = center.task.getTaskViewByListID(v) as TenDayTask
						let titem: any = this.Items.Panel_task_item.clone();
						titem.active = true
						titem.Items.Button_collect.onClickAndScale(()=>{
							center.task.sendFinishTask(ttaskData.task_list_id)
						})
						titem.Items.Button_go.onClickAndScale(()=>{
							this.onClickClose()
							center.task.jumpByTaskListId(ttaskData.task_list_id)
						})
						if (TASKPROCESS_TYPE_LOGIN == ttaskData.process_type) {
							if (1 == tdata.login_day) {
								titem.Items.Button_collect.loadBundleRes(fw.BundleConfig.resources.res[`ui/guide/guide_hand_1`],(res: Prefab) => {
									let node = instantiate(res);
									titem.Items.Button_collect.addChild(node);
									node.getComponent(guide_hand_1).playAnim();
									node.active = false;
									this.scheduleOnce(() => {
										node.active = true;
									});
								});
							}
							// --登录背景不一样
							this.changeItemRes(titem.Items.Image_reward_bg,fw.BundleConfig.plaza.res["tenDayTask/img/LC_event_kuang/spriteFrame"])
							this.changeItemRes(titem.Items.Image_day_bg,fw.BundleConfig.plaza.res["tenDayTask/img/LC_DAY_bg/spriteFrame"])
							this.changeItemFontRes(titem.Items.Text_coins,fw.BundleConfig.plaza.res["tenDayTask/img/font_red"])
						} else {
							this.changeItemRes(titem.Items.Image_reward_bg,fw.BundleConfig.plaza.res["tenDayTask/img/LC_event_kuang1/spriteFrame"])
							this.changeItemRes(titem.Items.Image_day_bg,fw.BundleConfig.plaza.res["tenDayTask/img/LC_DAY_bg1/spriteFrame"])
							this.changeItemFontRes(titem.Items.Text_coins,fw.BundleConfig.plaza.res["tenDayTask/img/font_green"])
						}

						// --第几天
						let tday = center.task.getTenDayTaskDay(v, k)
						if (0 <= tday) {
							ttodayTaskgoldsNum = ttodayTaskgoldsNum + ttaskData.reward_count
							titem.Items.Text_day.getComponent(Label).string = fw.language.getString("Day${day}", {
								day:(tday + 1)
							})
							titem.Items.Text_coins.getComponent(Label).string = DF_SYMBOL + (ttaskData.reward_count / DF_RATE)
							titem.Items.Text_des.getComponent(Label).string = fw.language.get(ttaskData.tips);
							titem.Items.Text_go.getComponent(Label).string = fw.language.get("Go")
							titem.Items.Text_collect.getComponent(Label).string = fw.language.get("Collect")
							titem.Items.Text_unlock.getComponent(Label).string = fw.language.get("Unlock tomorrow")
							// --获取任务进度
							ttaskItem = center.task.getTaskItem(ttaskData.task_list_id) as TenDayTask

							// --沒找到任务进度信息
							if (!ttaskItem) {
								ttaskData.now_finish = 0
								ttaskData.boxState = 1
								titem.Items.Button_collect.active = false
								titem.Items.Button_go.active = true
							} else {
								ttaskData.now_finish = ttaskItem.now_finish
								ttaskData.boxState = 1
								if (ttaskItem.receive_finish == ttaskData.finish_times) {
									// --已领取
									ttaskData.boxState = 3
									titem.Items.Button_collect.active = false
									titem.Items.Button_go.active = false
								} else if ((ttaskItem.now_finish / ttaskData.finish_times) >= 1) {
									// --已完成未领取
									ttaskData.boxState = 2
									titem.Items.Button_collect.active = true
									titem.Items.Button_go.active = false
									titem.Items.btn_com_anim.obtainComponent(sp.Skeleton).setAnimation(0, "xiao", true);
									tween(titem.Items.Button_collect)
										.to(1, { scale: new Vec3(1.1, 1.1, 1) })
										.to(1, { scale: new Vec3(1, 1, 1) })
										.union()
										.repeatForever()
										// .start();
								} else {
									titem.Items.Button_collect.active = false
									titem.Items.Button_go.active = true
									ttaskData.boxState = 1
								}
							}
							titem.data = ttaskData
							titem.Items.Image_lock.active = false

							// --充值任务单独做处理，因为是累计的
							let tnum1 = ttaskData.now_finish
							let tnum2 = ttaskData.finish_times
							let tpreDayTaskId = center.task.getPreTenDayTaskData(tday, 1)//1是因为：索引从0开始，每天第二个任务是充值任务
							if (TASKPROCESS_TYPE_ALLRECHARGE == ttaskData.process_type && null != tpreDayTaskId) {
								let tpreDayTaskData = center.task.getTaskViewByListID(tpreDayTaskId) as TenDayTask
								let tpreDayTaskItem = center.task.getTaskItem(tpreDayTaskData.task_list_id)
								if (!tpreDayTaskItem) {
									tpreDayTaskData.now_finish = 0
								} else {
									tpreDayTaskData.now_finish = tpreDayTaskItem.now_finish
								}
								tnum1 = ttaskData.now_finish - tpreDayTaskData.now_finish
								tnum2 = ttaskData.finish_times - tpreDayTaskData.finish_times
								tnum1 = tnum1
								tnum2 = tnum2
							}

							if (TASKPROCESS_TYPE_SETTLEMENTTOTALGOLD == ttaskData.process_type) {
								tnum1 = tnum1 / DF_RATE
								tnum2 = tnum2 / DF_RATE
							}

							titem.Items.text_reward.getComponent(Label).string = js.formatStr("%d/%d", tnum1, tnum2)
							titem.Items.bonus_progress.getComponent(ProgressBar).progress = tnum1 / tnum2
						}
						this.titems.push(titem)
						this.Items.ListView_task.Items.content.addChild(titem)
					}
				});
			}
			// --添加后面的总和
			if (tgoldsNum < tfonfig.max_value) {
				let titem = this.Items.Panel_task_item.clone();
				titem.active = true
				titem.Items.Text_day.active = false
				titem.Items.Image_day_bg.active = false

				titem.Items.Text_day.getComponent(Label).string = fw.language.getString("Day${day}", {
					day:(tdata.login_day + 1)
				})
				// --第二天剩余的值
				let tremainGoldsNum = tfonfig.max_value - ttodayTaskgoldsNum - tgoldsNum + tdata.zhuanpan_goodsnum
				this.changeItemRes(titem.Items.Image_gold,fw.BundleConfig.plaza.res["tenDayTask/img/lc_icon_JB2/spriteFrame"])
				titem.Items.Text_coins.getComponent(Label).string = DF_SYMBOL + (tremainGoldsNum / DF_RATE)
				this.changeItemFontRes(titem.Items.Text_coins,fw.BundleConfig.plaza.res["tenDayTask/img/font_red"])
				
				titem.Items.Text_des.getComponent(Label).string = fw.language.get("log into the game");
				titem.Items.text_reward.getComponent(Label).string = js.formatStr("%d/%d", 0, 1)
				titem.Items.bonus_progress.getComponent(ProgressBar).progress = 0
				titem.Items.Button_collect.active = false
				titem.Items.Button_go.active = false
				titem.Items.Image_lock.active = true
				titem.Items.Text_go.getComponent(Label).string = fw.language.get("Go")
				titem.Items.Text_collect.getComponent(Label).string = fw.language.get("Collect")
				titem.Items.Text_unlock.getComponent(Label).string = fw.language.get("Unlock tomorrow")
				this.Items.ListView_task.Items.content.addChild(titem)
				this.titems.push(titem)
				this.Items.Text_need_des.getComponent(Label).string = fw.language.getString("Also need ${DF_SYMBOL}${value} to collect",{
					DF_SYMBOL:DF_SYMBOL,
					value:((tfonfig.max_value - tgoldsNum) / DF_RATE).toFixed(0)
				});
			}
			this.Items.LdBar_total_progress.getComponent(ProgressBar).progress = tgoldsNum / tfonfig.max_value
			this.Items.LdBar_total_txt.getComponent(Label).string = js.formatStr("%d/%d", tgoldsNum / DF_RATE, tfonfig.max_value / DF_RATE)
			this.Items.Text_total_get.getComponent(Label).string = DF_SYMBOL + (tgoldsNum / DF_RATE)
		}
	}

	changeItemRes(node, resPath) {
		node.loadBundleRes(resPath,(res: SpriteFrame) => {
			node.obtainComponent(Sprite).spriteFrame = res;
		});
	}

	changeItemFontRes(node, resPath) {
		node.loadBundleRes(resPath, Font,(res) => {
			node.getComponent(Label).font = res;
		});
	}

	showRemainTime() {
		let getRemainTime = () => {
			let tfonfig = center.task.getTenDayTaskConfig()
			let registerTime = center.user.getRegisterTime() || 0
			let finishTime = registerTime + tfonfig.keep_day * 3600 * 24

			let nDelServerTime = center.user.getServerDelTime()
			let nCurTime = app.func.time()
			let nDelTime = finishTime - nCurTime
			if (nDelServerTime >= 0) {
				nDelTime = nDelTime - Math.abs(nDelServerTime)
			} else {
				nDelTime = nDelTime + Math.abs(nDelServerTime)
			}
			nDelTime = nDelTime > 0 && nDelTime || 0
			return nDelTime
		}

		this.Items.Panel_remain_time.active = false
		let tremainTime = getRemainTime()
		let tday = tremainTime / (24 * 3600)
		let ttimeDown = 5 * 24 * 3600
		if (tremainTime <= ttimeDown) {
			this.Items.Panel_remain_time.active = true
			this.Items.Text_remain_day.getComponent(Label).string = fw.language.get("The event is about to end")
			if (tremainTime <= 24 * 3600) {
				let stop = () => {
					if (this.clockTimer) {
						this.clearIntervalTimer(this.clockTimer)
						this.clockTimer = null
					}
				}
				let updateRemainTime = () => {
					let ttime = getRemainTime()
					if (0 >= ttime) {
						this.Items.Text_remain_day.getComponent(Label).string = fw.language.get("Has ended")
						stop()
					}
					dayjs.extend(utc)
					this.Items.Text_remain_day.getComponent(Label).string = js.formatStr("%s:%s", fw.language.get("time remaining"), dayjs.unix(ttime).utc().format("HH:mm:ss"))
				}
				stop()
				updateRemainTime()
				this.clockTimer = this.setInterval(updateRemainTime, 1)
			}
		}
	}
	refreshTotalGet() {
		// --刷新总收集
		let tfonfig = center.task.getTenDayTaskConfig()
		let tgoldsNum = center.userContainer.getGoodNum(ENCONTAINER_PACKET, tfonfig.tenday_taskgoodsid)
		this.Items.LdBar_total_progress.getComponent(ProgressBar).progress = tgoldsNum / tfonfig.max_value
		this.Items.LdBar_total_txt.getComponent(Label).string = js.formatStr("%d/%d", tgoldsNum / DF_RATE, tfonfig.max_value / DF_RATE)
		this.Items.Text_total_get.getComponent(Label).string = DF_SYMBOL + (tgoldsNum / DF_RATE)
	}
	onFlyCoins(taskId_, num_) {
		let tfonfig = center.task.getTenDayTaskConfig()
		let titems = this.titems
		let tgoldsNum = center.userContainer.getGoodNum(ENCONTAINER_PACKET, tfonfig.tenday_taskgoodsid)
		if (titems) {
			titems.forEach((tnode, i) => {
				if (tnode.data && tnode.data.task_list_id == taskId_) {
					let worldPos = tnode.Items.Image_gold.getWorldPosition()
					this.Items.Panel_coins.active = true
					this.Items.Panel_coins.Items.fly_coins.worldPosition = worldPos
					let worldPos1 = this.Items.Text_total_get.getWorldPosition();
					this.loadBundleRes(fw.BundleConfig.plaza.res["tenDayTask/img/lc_icon_JB1/spriteFrame"], (res: SpriteFrame) => {
						if (fw.isValid(this.Items.Image_reward_bg)) {
							this.Items.Panel_coins.Items.fly_coins.obtainComponent(Sprite).spriteFrame = res;
							tween(this.Items.Panel_coins.Items.fly_coins)
								.to(0.5, { worldPosition: new Vec3(worldPos1.x, worldPos1.y, 0) }, { easing: 'quadOut' })
								.call(() => {
									this.Items.Panel_coins.Items.fly_coins.setPosition(0, 0)
									this.Items.Panel_coins.active = false
									let tgoldsNum1 = center.userContainer.getGoodNum(ENCONTAINER_PACKET, tfonfig.tenday_taskgoodsid)
									this.fntTxtGoldChanged(this.Items.Text_total_get, tgoldsNum1, 0.1, DF_RATE, DF_SYMBOL, "", () => {
										this.updateView()
									})
								})
								.delay(1.5)
								.call(this.checkShowTrunTableView.bind(this))
								.start();
						}
					});


				}
			});
		}
	}

	checkShowTrunTableView() {
		let tdata = center.task.getTenDayTaskData()
		if (3 <= tdata.finish_tentask_count) {
			this.m_turnTableView.active = true;
			app.event.dispatchEvent({
				eventName: EVENT_ID.EVENT_TEN_DAY_TASK_SHOW_TURNTABLE,
				dict: {
					coins: 0,
					callback: (num_) => {
						this.refreshTotalGet()
					},
				}
			})
		}
	}

	onFlyTurnTable(coins_) {
		if (this.m_turnTableView.active) {
			app.event.dispatchEvent({
				eventName: EVENT_ID.EVENT_TEN_DAY_TASK_RUN_TURNTABLE,
				dict: {
					coins: coins_,
					callback: () => {
						this.refreshTotalGet()
					},
				}
			})
			return
		}
		this.Items.Image_reward_bg.loadBundleRes(fw.BundleConfig.plaza.res["tenDayTask/img/lc_icon_SP/spriteFrame"],(res: SpriteFrame) => {
			this.Items.Panel_coins.active = true
			this.Items.Panel_coins.Items.fly_coins.obtainComponent(Sprite).spriteFrame = res;
			let worldPos = this.Items.Image_turntable.getWorldPosition()
			worldPos = this.Items.Panel_coins.Items.fly_coins.getComponent(UITransform).convertToNodeSpaceAR(worldPos);
			let worldPos1 = this.Items.Node_turntable.getWorldPosition()
			worldPos1 = this.Items.Panel_coins.Items.fly_coins.getComponent(UITransform).convertToNodeSpaceAR(worldPos1);
			this.Items.Panel_coins.Items.fly_coins.setPosition(worldPos.x, worldPos.y)

			tween(this.Items.Panel_coins.Items.fly_coins)
				.to(0.5, { position: new Vec3(worldPos1.x, worldPos1.y, 0) }, { easing: 'quadOut' })
				.call(() => {
					this.Items.Panel_coins.active = false
					app.event.dispatchEvent({
						eventName: EVENT_ID.EVENT_TEN_DAY_TASK_RUN_TURNTABLE,
						dict: {
							coins: coins_,
							callback: () => {
								this.Items.Panel_coins.Items.fly_coins.setPosition(0, 0)
								this.refreshTotalGet()
							},
						}
					})
				})
				.start();
				}
		);
		
	}
	fntTxtGoldChanged(node_, coins_, time_, rate_, prefix_, suffix_, callback_) {
		rate_ = rate_ || 1
		time_ = time_ || 0.1
		prefix_ = prefix_ || ""
		suffix_ = suffix_ || ""
		let tstr = node_.obtainComponent(Label).string
		let tstrLen = tstr.length
		let tprefixLen = prefix_.length
		let tsuffixLen = suffix_.length
		let start_num = Number(tstr.substr(tprefixLen, tstrLen - tsuffixLen)) * rate_
		let end_num = coins_
		let diff = end_num - start_num
		let each = diff / 5
		let change_num = 100
		if (each < 100) {
			change_num = 100
		} else {
			change_num = Math.ceil(each / 100) * 100
		}

		let stop = () => {
			if (this.totalGetTime) {
				this.clearIntervalTimer(this.totalGetTime)
				this.totalGetTime = null
			}
		}
		let updateLastTime = () => {
			start_num = start_num + change_num
			if (start_num >= end_num) {
				start_num = end_num
				if (callback_) {
					callback_()
				}
				stop()
			}
			node_.obtainComponent(Label).string = js.formatStr("%s%s%s", prefix_, start_num / rate_, suffix_)
		}
		stop()
		updateLastTime()
		this.totalGetTime = this.setInterval(updateLastTime, time_)
	}
	onClickTurntable() {
		this.m_turnTableView.active = true;
		app.event.dispatchEvent({
			eventName: EVENT_ID.EVENT_TEN_DAY_TASK_SHOW_TURNTABLE,
			dict: {
				coins: 0,
				callback: () => {
					this.refreshTotalGet()
				},
			}
		})
	}
	onClickComplete() {
		let tfonfig = center.task.getTenDayTaskConfig()
		let tgoldsNum = center.userContainer.getGoodNum(ENCONTAINER_PACKET, tfonfig.tenday_taskgoodsid)
		if (tgoldsNum < tfonfig.max_value) {
			this.Items.Text_need_des.getComponent(Label).string = fw.language.getString("Also need ${DF_SYMBOL}${value} to collect",{
				DF_SYMBOL:DF_SYMBOL,
				value:((tfonfig.max_value - tgoldsNum) / DF_RATE).toFixed(0)
			});
			this.Items.Panel_remain_tips.active = true
			tween(this.Items.Panel_remain_tips)
				.show()//hide的active设置不生效，必须show
				.repeat(5, tween(this.Items.Panel_remain_tips).to(0.1, { scale: v3(1.1, 1.1, 1) }).to(0.1, { scale: v3(0.9, 0.9, 1) }))
				.delay(2)
				.hide()
				.start();
			return
		}
		center.task.PLAZA_TASK_TEN_DAY_TASK_ACTIVITY_REQ(2)
	}
	onClickClose(){
		if (this.clockTimer) {
			this.clearIntervalTimer(this.clockTimer)
			this.clockTimer = null
		}
		super.onClickClose();
	}
}

interface TenDayTask extends proto.plaza_task.ITaskViewNew, proto.plaza_task.ITaskData {
	boxState: number
}