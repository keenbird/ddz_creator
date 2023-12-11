import { Label, RichText, Node, UITransform, js, _decorator } from 'cc';
import { DF_RATE, DF_SYMBOL } from '../../../app/config/ConstantConfig';
import proto from '../../../app/center/common';
const { ccclass } = _decorator;

import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('FreeBoonusLayer')
export class FreeBoonusLayer extends FWDialogViewBase {
	freebonus: Node;
	freebonus2: Node;
	m_FreeTaskList: FreeBonusTaskList[];
	protected initView(): boolean | void {
		//--多语言处理--began------------------------------------------
		//文本
		this.Items.Label_tips.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
			this.Items.Label_tips.string = {
				[fw.LanguageType.en]: `Get a free bonus if you complete all the tasks`,
				[fw.LanguageType.brasil]: `Ganhe um bônus gratuito se você completar todas as tarefas`,
			}[fw.language.languageType];
		});
		this.Items.Label_tips_done.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
			this.Items.Label_tips_done.string = {
				[fw.LanguageType.en]: `Congratulations, you get a free bonus`,
				[fw.LanguageType.brasil]: `Parabéns, você ganha um bônus grátis`,
			}[fw.language.languageType];
		});
		this.Items.Label_get.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
			this.Items.Label_get.string = {
				[fw.LanguageType.en]: `GET IT NOW`,
				[fw.LanguageType.brasil]: `Obter agora`,
			}[fw.language.languageType];
		});
		this.Items.Label_go.obtainComponent(fw.FWLanguage).bindLabel(`GO`);
		this.Items.Label_com.obtainComponent(fw.FWLanguage).bindLabel(`Completed`);
		//精灵
		this.Items.Sprite_title.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
			app.file.updateImage({
				node: this.Items.Sprite_title,
				bundleResConfig: ({
					[fw.LanguageType.en]: () => { return fw.BundleConfig.plaza.res[`freeBoonus/img/atlas/freeBoonus_bt/spriteFrame`]; },
					[fw.LanguageType.brasil]: () => { return fw.BundleConfig.plaza.res[`freeBoonus/img/atlas/freeBoonus_bt_brasil/spriteFrame`]; },
				})[fw.language.languageType](),
			});
		});
		//--多语言处理--end--------------------------------------------

		this.Items.Panel_done.active = false
		this.Items.task_item.active = false
		this.freebonus = this.Items.Panel_todo.Items.freebonus
		this.freebonus.getComponent(Label).string = "a" + 0
		this.freebonus2 = this.Items.Panel_done.Items.freebonus
		this.freebonus2.getComponent(Label).string = "a" + 0
		this.showTaskList()
		this.setPanelVisible()
	}
	protected initBtns(): boolean | void {
		this.Items.get_bonus.onClickAndScale(() => {
			this.getFreeBonus()
		});
	}
	setPanelVisible() {
		let freeBonusCfg = center.task.getFreeBonusCfg()
		if (freeBonusCfg && freeBonusCfg.taskCount && freeBonusCfg.finishCount) {
			let getBonus = freeBonusCfg.taskCount <= freeBonusCfg.finishCount
			this.Items.Panel_todo.active = !getBonus
			this.Items.Panel_done.active = getBonus
		}
	}
	showTaskList() {
		this.m_FreeTaskList = []

		let freeBonusCfg = center.task.getFreeBonusCfg()
		if (freeBonusCfg && freeBonusCfg.taskCount && freeBonusCfg.taskCount > 0) {
			this.freebonus.getComponent(Label).string = `${DF_SYMBOL}${Number(freeBonusCfg.goodsNum) / DF_RATE}`
			this.freebonus2.getComponent(Label).string = `${DF_SYMBOL}${Number(freeBonusCfg.goodsNum) / DF_RATE}`

			freeBonusCfg.task.forEach((id, index) => {
				let src = center.task.getTaskViewByListID(id) as FreeBonusTaskList
				if (src) {
					this.m_FreeTaskList.push(src)
				}
			})

			// --状态排序
			let temptaskList: FreeBonusTaskList[] = [] //1 未完成
			let unFinishtaskList: FreeBonusTaskList[] = [] //2 已完成未领取
			let gotRewardtaskList: FreeBonusTaskList[] = [] //3 已领取

			this.m_FreeTaskList.forEach((v, index) => {
				let taskItem = center.task.getTaskItem(v.task_list_id)
				if (!taskItem) {
					v.now_finish = 0
					v.boxState = 1
					temptaskList.push(v)
				} else {
					v.now_finish = taskItem.now_finish
					v.boxState = 1
					if (taskItem.receive_finish == v.finish_times) {
						v.boxState = 3
						gotRewardtaskList.push(v)
					} else if ((taskItem.now_finish / v.finish_times) >= 1) {
						v.boxState = 2
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

			this.updateData(unFinishtaskList)
		}
	}

	updateData(taskList: FreeBonusTaskList[]) {
		this.Items.content.removeAllChildren(true);
		if (taskList && taskList.length > 0) {
			taskList.forEach((v, index) => {
				let node = new Node();
				this.Items.content.addChild(node);
				node.obtainComponent(UITransform).setContentSize(this.Items.task_item.size);
				node.scheduleOnce(() => {
					var task = this.Items.task_item.clone();
					task.setPosition(fw.v3());
					task.parent = node;
					task.active = true;
					this.updataList(task, v);
				}, 0.1 * index);
			});
		}
	}

	updataList(item, data: FreeBonusTaskList) {
		let operation_go = item.Items.Image_go
		operation_go.active = false
		let operation_com = item.Items.Image_com
		operation_com.active = false

		let taskProgress = center.task.getTaskItem(data.task_list_id)
		let mul = Number(data.show_mul) == 0 && 1 || DF_RATE
		let now = (taskProgress && taskProgress.now_finish || 0) / mul
		let max = data.finish_times / mul
		item.Items.task_desc.getComponent(RichText).string = js.formatStr("<color=#00ff00>%s</color><color=#0fffff>%s</color>", data.name, now + "/" + max)
		if (data.boxState == 1) {
			operation_go.active = true
			operation_go.onClickAndScale(() => {
				center.task.jumpByTaskListId(data.task_list_id)
				this.onClickClose()
			});
		} else {
			operation_com.active = true
		}
	}

	getFreeBonus() {
		center.task.sendFreeBonusReq()
		this.onClickClose()
	}
}

interface FreeBonusTaskList extends proto.plaza_task.ITaskViewNew, proto.plaza_task.ITaskData {
	boxState: number
}