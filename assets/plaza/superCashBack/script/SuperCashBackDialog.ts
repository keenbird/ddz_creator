import { js } from 'cc';
import { UITransform, Node as ccNode } from 'cc';
import { ProgressBar } from 'cc';
import { Label, _decorator } from 'cc';
import { DF_RATE, DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { EVENT_ID } from '../../../app/config/EventConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
import proto from '../../../app/center/common';
const { ccclass } = _decorator;

@ccclass('SuperCashBackDialog')
export class SuperCashBackDialog extends FWDialogViewBase {
	taskPayCashBackInfo: proto.plaza_task.Igs_paybonus_actor_data_s;
	goodsInfo: QuickRecharge;
	initData() {
		this.taskPayCashBackInfo = center.task.getTaskPayCashBackInfo()
		if (!this.taskPayCashBackInfo) {
			this.onClickClose()
			return
		}
	}
	protected initEvents(): boolean | void {
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_PAYTASK_BUY_RESULT,
			],
			callback: (arg1, arg2) => {
				if (this.goodsInfo) {
					app.sdk.setPrice(parseInt(this.goodsInfo.nQuickNeedRMB))
					app.sdk.setGoodsName(this.goodsInfo.szQuickTitle)
					app.sdk.pay()
				}
			}
		});
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_TASK_REWARD_GET,
				EVENT_ID.EVENT_PAYTASK_INFO_CHANGE,
				EVENT_ID.EVENT_PLAZA_ACTOR_PRIVATE,
				EVENT_ID.EVENT_PLAZA_ACTOR_VARIABLE,
			],
			callback: (arg1, arg2) => {
				this.updateView()
			}
		});
	}
	protected initView(): boolean | void {
		this.Items.Image_get_rate.string = fw.language.get("Get")
		this.Items.Text_cash_tt.string = fw.language.get("Cash")
		this.Items.Text_bonus_tt.string = fw.language.get("Task\nCashback")
		this.Items.Text_total_tt.string = fw.language.get("Total Get") 
		this.Items.other_amount_t.string = fw.language.get("Other Amount>>") 
		this.Items.Text_cash_add.string = fw.language.get("Add Cash")
		this.Items.Image_title_task_p.active = {
			[fw.LanguageType.en]: false,
			[fw.LanguageType.brasil]: true,
		}[fw.language.languageType];
		this.Items.Image_title_task_en.active = {
			[fw.LanguageType.en]: true,
			[fw.LanguageType.brasil]: false,
		}[fw.language.languageType];

		this.Items.Image_go_t.string = fw.language.get("Play\nNow")
		this.Items.Image_get_t.string = fw.language.get("Get")
		this.Items.Image_com_t.string = fw.language.get("Complete")

		this.Items.Text_r_next_t.string = fw.language.get("complete the previous mission ot unlock")


		
		this.Items.task_item.active = false
		this.Items.ScrollView.Items.content.removeAllChildren(true)
		this.updateView()
	}
	protected initBtns(): boolean | void {
		this.Items.Image_close.onClickAndScale(() => {
			this.onClickClose();
		})
		this.Items.Image_close_0.onClickAndScale(() => {
			this.onClickClose();
		})
		this.Items.other_amount.onClickAndScale(() => {
			this.onClickOtherAmount();
		})
		this.Items.Image_buy.onClickAndScale(() => {
			this.onBuy();
		})
	}
	updateView() {
		this.taskPayCashBackInfo = center.task.getTaskPayCashBackInfo()
		if (this.taskPayCashBackInfo && this.taskPayCashBackInfo.task_state == 1) {
			this.onClickClose()
			return
		}
		this.taskPayCashBackInfo = center.task.getTaskPayCashBackInfo()
		if (this.taskPayCashBackInfo) {
			this.Items.Panel_cash.active = !(this.taskPayCashBackInfo.pay_task_tag == 1)
			this.Items.Panel_task.active = this.taskPayCashBackInfo.pay_task_tag == 1
			this.initCashView()
			this.initTaskView()
		}
	}
	initCashView() {
		let taskPayCashBackCfg = center.task.getTaskPayCashBackCfg()
		let quickInfo = center.roomList.getQuickRecharge(taskPayCashBackCfg.quick_rid)
		if (quickInfo) {
			let rate = Number(taskPayCashBackCfg.task_bonus) / Number(quickInfo.nQuickNeedRMB) * 100

			this.Items.Text_rate.getComponent(Label).string = Math.floor(rate) + "%"
			this.Items.Text_price.getComponent(Label).string = DF_SYMBOL + js.formatStr("%s", quickInfo.nQuickNeedRMB)

			this.Items.Text_cash.getComponent(Label).string = DF_SYMBOL + js.formatStr("%s", quickInfo.nQuickNeedRMB)
			this.Items.Text_bonus.getComponent(Label).string = DF_SYMBOL + js.formatStr("%s", taskPayCashBackCfg.task_bonus)
			this.Items.Text_total.getComponent(Label).string = DF_SYMBOL + js.formatStr("%s", Number(taskPayCashBackCfg.task_bonus) + Number(quickInfo.nQuickNeedRMB))
		}
	}
	initTaskView() {
		let taskPayCashBackCfg = center.task.getTaskPayCashBackCfg()

		let taskPayCashBackInfo = center.task.getTaskPayCashBackInfo()
		let curTaskIndex = taskPayCashBackInfo.task_index + 1

		let m_CashBackTaskList: CashBackTaskList[] = []
		if (taskPayCashBackCfg && taskPayCashBackCfg.task_count && taskPayCashBackCfg.task_count > 0) {
			taskPayCashBackCfg.list_id.forEach((id, index) => {
				let src = center.task.getTaskViewByListID(id) as CashBackTaskList
				if (src) {
					src.stepIndex = index + 1
					m_CashBackTaskList.push(src)
				}
			})

			this.Items.bonus.string = `${taskPayCashBackCfg.task_bonus}`;
			this.Items.bonus_p.string = `${taskPayCashBackCfg.task_bonus}`;

			//--状态排序
			let temptaskList: CashBackTaskList[] = []; //1 未完成
			let unFinishtaskList: CashBackTaskList[] = []; //2 已完成未领取
			let gotRewardtaskList: CashBackTaskList[] = []; //3 已领取

			m_CashBackTaskList.forEach((v, index) => {
				let taskItem = center.task.getTaskItem(v.task_list_id);
				if (!taskItem) {
					v.now_finish = 0;
					v.boxState = 1;
					temptaskList.push(v)
				} else {
					v.now_finish = taskItem.now_finish;
					v.boxState = 1;
					if (taskItem.receive_finish == v.finish_times) {
						v.boxState = 3;
						gotRewardtaskList.push(v)
					} else if ((taskItem.now_finish / v.finish_times) >= 1) {
						v.boxState = 2;
						unFinishtaskList.push(v)
					} else {
						temptaskList.push(v)
					}
				}
			})

			temptaskList.forEach((v, index) => {
				unFinishtaskList.push(v)
			})

			gotRewardtaskList.forEach((v, index) => {
				unFinishtaskList.push(v)
			})

			this.updateData(unFinishtaskList, curTaskIndex)
		}
	}
	updateData(taskList: CashBackTaskList[], curTaskIndex: number) {
		this.Items.ScrollView.Items.content.removeAllChildren(true);
		taskList.forEach((v, index) => {
			let node = new ccNode();
			node.size = this.Items.task_item.size;
			this.Items.ScrollView.Items.content.addChild(node);
			node.scheduleOnce(() => {
				let item = this.Items.task_item.clone();
				item.parent = node;
				item.active = true;
				this.updataList(item, v, curTaskIndex);
			}, 0.1 * index);
		});
	}
	updataList(item, data: CashBackTaskList, curIndex) {
		item.Items.Image_go.active = false
		item.Items.Image_com.active = false
		item.Items.Image_get.active = false
		item.Items.LoadingBar_bg.active = false
		item.Items.Image_next.active = false
		item.Items.Image_mask.active = false
		item.Items.Text_reward.getComponent(Label).string = DF_SYMBOL + js.formatStr("%s", parseInt(data.reward) / DF_RATE)

		let taskProgress = center.task.getTaskItem(data.task_list_id)
		let now = taskProgress && taskProgress.now_finish || 0

		item.Items.Text_process.getComponent(Label).string = js.formatStr("%d/%d", parseInt(now) / DF_RATE, parseInt(data.finish_times) / DF_RATE)
		if (curIndex == data.stepIndex) {
			this.Items.Text_task_dec.getComponent(Label).string = data.name
		}

		if (parseInt(now) >= parseInt(data.finish_times)) {
			item.Items.LoadingBar_bg.getComponent(ProgressBar).progress = 1
		} else {
			item.Items.LoadingBar_bg.getComponent(ProgressBar).progress = parseInt(now) / parseInt(data.finish_times)
		}

		item.Items.LoadingBar_bg.active = curIndex >= data.stepIndex
		item.Items.Image_next.active = curIndex < data.stepIndex
		item.Items.Image_mask.active = curIndex < data.stepIndex

		if (data.boxState == 1) {
			item.Items.Image_go.active = true
			item.Items.Image_go.onClickAndScale(() => {
				center.task.jumpByTaskListId(data.task_list_id)
				this.onClickClose()
			})
		} else if (data.boxState == 2) {
			item.Items.Image_get.active = true
			item.Items.Image_get.onClickAndScale(() => {
				center.task.sendFinishTask(data.task_list_id)
			})
		} else {
			item.Items.Image_com.active = true
		}
	}
	onClickOtherAmount() {
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`shop/shop_main`],
		});
	}
	onBuy() {
		let taskPayCashBackCfg = center.task.getTaskPayCashBackCfg()
		let config = center.roomList.getQuickRecharge(taskPayCashBackCfg.quick_rid)
		if (config) {
			this.goodsInfo = config
			let data: PayChannelData = {
				lRMB: Number(config.nQuickNeedRMB),
				orderCallback: () => {
					center.task.taskCreateOrder(config.nRID, center.mall.ORDER_TYPE.ORDER_TYPE_PAYBONUS_TASK)
				}
			}
			center.mall.payChooseType(data)
		}
	}
}

interface CashBackTaskList extends proto.plaza_task.ITaskViewNew, proto.plaza_task.ITaskData {
	stepIndex: number
	boxState: number
}
