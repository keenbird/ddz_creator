import { ACTOR, PROTO_ACTOR } from "../../config/cmd/ActorCMD";
import { EVENT_ID } from "../../config/EventConfig";
import { GS_PLAZA_MSGID } from "../../config/NetConfig";
import { PlazeMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";
import { ROOMGROUP_GOLD } from "./roomListCenter";
import proto from "../common";

let MAX_TEN_TASK_PRO_COUNT = 16

export enum eTpLvType {
    Game = 1,
    Win = 2
}

export class TaskCenter extends PlazeMainInetMsg {
    /**命令ID */
    // cmd = proto.plaza_task.GS_PLAZA_TASK_MSG
    m_TaskPayCashBackCfg: proto.plaza_task.Igs_paybonus_cfg_s;
    m_TaskPayCashBackInfo: proto.plaza_task.Igs_paybonus_actor_data_s;
    m_TaskViewList: { [key: number]: proto.plaza_task.ITaskViewNew[] };
    m_TaskItemList: proto.plaza_task.ITaskData[];
    m_SubsydyInfo: any;
    m_SubsydyData: any;
    m_SubsydyDataRefreshDay: number;
    m_TriggerFucMap: proto.plaza_task.ITriggerFuncItem[];
    freeBonusCfg: FreeBonusCfg;
    nDownDay: number;
    m_tpLvUserData: proto.plaza_task.Igs_tp_guanka_data_s;
    m_tpLvCfg: proto.plaza_task.Igs_tp_guanka_cfg;
    mXXLGuankaData: proto.plaza_task.Igs_xxlguankadata_s;
    mTotalCount: number;
    mXXLGuanKaConfigs: { [key: number]: proto.plaza_task.IXxlGuanKaCfgData };
    m_TenDayTaskConfig: proto.plaza_task.Igs_tenday_task_act_cfg_s;
    splitTenDayTaskData: {};
    m_TenDayTurnTableRewards: any[];
    nZhuanPanRewardCount: any;
    m_TenDayTaskData: proto.plaza_task.Igs_tenday_task_act_data_s;
    /**由于任务模块数据较多，且都为临时的任务数据，所以尽量不要定义任务数据属性，可以使用: (<any>this).xxx 保存，利于代码删除 */
    /**由于任务模块数据较多，且都为临时的任务数据，所以尽量不要定义任务数据属性，可以使用: (<any>this).xxx 保存，利于代码删除 */
    /**由于任务模块数据较多，且都为临时的任务数据，所以尽量不要定义任务数据属性，可以使用: (<any>this).xxx 保存，利于代码删除 */
    initData() {
        this.initMainID(GS_PLAZA_MSGID.GS_PLAZA_MSGID_TASK);
        this.cleanUserData();
    }

    cleanUserData() {
        this.m_TaskViewList = {}
        this.m_TaskItemList = []
        this.m_SubsydyInfo = {
            nTotalCount: 0,
            nSubsidyCount: 0,
            nCriticalGold: 0,
            nAddGold: 0,
        }
        this.m_SubsydyData = {
            nTotalReciveCount: 0,
            nDayReciveCount: 0,
        }
        this.mTotalCount = 0
        this.mXXLGuanKaConfigs = {}

    }

    // initRegister() {
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_task_info_s,
    //         cmd: this.cmd.PLAZA_TASK_INFO,
    //         callback: this.OnRecv_TaskInfo.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_task_change_s,
    //         cmd: this.cmd.PLAZA_TASK_CHANGE,
    //         callback: this.OnRecv_TaskChange.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_task_finish_c,
    //         cmd: this.cmd.PLAZA_TASK_FINISH,
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_task_reward_s,
    //         cmd: this.cmd.PLAZA_TASK_REWARD,
    //         callback: this.OnRecv_TaskReward.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_task_trigger_fuc_s,
    //         cmd: this.cmd.PLAZA_TASK_TRIGGERFUNC,
    //         callback: this.OnRecv_TaskTriggerFuc.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_task_view_new_s,
    //         cmd: this.cmd.PLAZA_TASK_VIEWNEW,
    //         callback: this.OnRecv_TaskViewNew.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_task_add_new_s,
    //         cmd: this.cmd.PLAZA_TASK_ADDNEW,
    //         callback: this.OnRecv_TaskAddNew.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_task_tips_s,
    //         cmd: this.cmd.PLAZA_TASK_TIPS,
    //         callback: this.OnRecv_Tips.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_freebouns_end_reward_req_c,
    //         cmd: this.cmd.PLAZA_TASK_FREEBONUS_END_REWARD_REQUEST,
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_freebouns_end_reward_ret_s,
    //         cmd: this.cmd.PLAZA_TASK_FREEBONUS_END_REWARD_RET,
    //         callback: this.onRecv_GetFreeBonusRet.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_freebonus_cfg_s,
    //         cmd: this.cmd.PLAZA_TASK_FREEBONUS_CONFIG,
    //         callback: this.onRecv_FreeBonusCfg.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_freebonus_data_s,
    //         cmd: this.cmd.CONFIGTYPE_FREEBONUS_INFO,
    //         callback: this.onRecv_FreeBonusInfo.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_new_seventask_info_s,
    //         cmd: this.cmd.CONFIGTYPE_NEW_SEVENTASK_INFO,
    //         callback: this.onRecv_TaskSevenInfo.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_paybonus_cfg_s,
    //         cmd: this.cmd.PLAZA_TASK_PAYBONUS_CONFIG,
    //         callback: this.onRecv_TaskPayCashBackCfg.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_paybonus_actor_data_s,
    //         cmd: this.cmd.PLAZA_TASK_PAYBONUS_USERDATA,
    //         callback: this.onRecv_TaskPayCashBackInfo.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.buy_pay_bonus_success_s,
    //         cmd: this.cmd.PLAZA_TASK_BUY_PAYBONUS_SUCCESS,
    //         callback: this.onRecv_TaskPayResult.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_sgj_guanka_request_c,
    //         cmd: this.cmd.PLAZA_TASK_SGJ_GUANKA_REWARD,
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_sgj_guanka_req_ret_s,
    //         cmd: this.cmd.PLAZA_TASK_SGJ_GUANKA_REWARD_RET,
    //         callback: this.PLAZA_TASK_SGJ_GUANKA_REWARD_RET.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_sgj_guanka_data_s,
    //         cmd: this.cmd.PLAZA_TASK_SGJ_GUANKA_DATA,
    //         callback: this.PLAZA_TASK_SGJ_GUANKA_DATA.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_sgj_guanka_cfg_s,
    //         cmd: this.cmd.PLAZA_TASK_SGJ_GUANKA_CONFIG,
    //         callback: this.PLAZA_TASK_SGJ_GUANKA_CONFIG.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_guanggao_req_c,
    //         cmd: this.cmd.PLAZA_TASK_GUGANG_GAO_REQUEST,
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_tp_guanka_req_c,
    //         cmd: this.cmd.PLAZA_TASK_TEENPATTI_GUANKA_REWARD,
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_tp_guanka_req_ret_s,
    //         cmd: this.cmd.PLAZA_TASK_TEENPATTI_GUANKA_REWARD_RET,
    //         callback: this.PLAZA_TASK_TEENPATTI_GUANKA_REWARD_RET.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_tp_guanka_data_s,
    //         cmd: this.cmd.PLAZA_TASK_TEENPATTI_GUANKA_DATA,
    //         callback: this.PLAZA_TASK_TEENPATTI_GUANKA_DATA.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_tp_guanka_cfg,
    //         cmd: this.cmd.PLAZA_TASK_TEENPATTI_GUANKA_CONFIG,
    //         callback: this.PLAZA_TASK_TEENPATTI_GUANKA_CONFIG.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_tenday_task_act_cfg_s,
    //         cmd: this.cmd.PLAZA_TASK_TEN_DAY_TASK_ACTIVITY_CONFIG,
    //         callback: this.PLAZA_TASK_TEN_DAY_TASK_ACTIVITY_CONFIG.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_tenday_task_act_data_s,
    //         cmd: this.cmd.PLAZA_TASK_TEN_DAY_TASK_ACTIVITY_DATA,
    //         callback: this.PLAZA_TASK_TEN_DAY_TASK_ACTIVITY_DATA.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_tenday_task_act_req_c,
    //         cmd: this.cmd.PLAZA_TASK_TEN_DAY_TASK_ACTIVITY_REQ,
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_tenday_task_ret_s,
    //         cmd: this.cmd.PLAZA_TASK_TEN_DAY_TASK_ACTIVITY_RET,
    //         callback: this.PLAZA_TASK_TEN_DAY_TASK_ACTIVITY_RET.bind(this),
    //     });

    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_xxlguankarequest_c,
    //         cmd: this.cmd.PLAZA_TASK_XXL_GUANKA_REWARD,
    //     });

    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_xxlguankarequestret_s,
    //         cmd: this.cmd.PLAZA_TASK_XXL_GUANKA_REWARD_RET,
    //         callback: this.OnRecv_TaskXXLGuankaRewardRet.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_xxlguankadata_s,
    //         cmd: this.cmd.PLAZA_TASK_XXL_GUANKA_DATA,
    //         callback: this.OnRecv_TaskXXLGuankaData.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_xxlguankaconfig_s,
    //         cmd: this.cmd.PLAZA_TASK_XXL_GUANKA_CONFIG,
    //         callback: this.OnRecv_TaskXXLGuankaConfig.bind(this),
    //     });

    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_taskcreateorder_c,
    //         cmd: this.cmd.PLAZA_TASK_CRETEORDER_NUM,
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_taskcreateorderres_s,
    //         cmd: this.cmd.PLAZA_TASK_CRETEORDER_NUM_RES,
    //         callback: this.OnRecv_PayTaskOrderRes.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_task_subsidy_info,
    //         cmd: this.cmd.PLAZA_TASK_SUBSIDYINFO,
    //         callback: this.OnRecv_TaskSubsydyInfo.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_task_subsidy_data,
    //         cmd: this.cmd.PLAZA_TASK_SUBSIDYDATA,
    //         callback: this.OnRecv_TaskSubsydyData.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_task_get_subsidy,
    //         cmd: this.cmd.PLAZA_TASK_GETSUBSIDY,
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_task.gs_task_get_subsidy_ret,
    //         cmd: this.cmd.PLAZA_TASK_GETSUBSIDY_RET,
    //         callback: this.OnRecv_TaskSubsydyReward.bind(this),
    //     });
    // }

    PLAZA_TASK_TEN_DAY_TASK_ACTIVITY_CONFIG(data: proto.plaza_task.gs_tenday_task_act_cfg_s) {
        this.m_TenDayTaskConfig = data
        this.splitTenDayTaskData = this.m_TenDayTaskConfig.task_id
        this.m_TenDayTurnTableRewards = []
        if (data.zhuan_pan_reward_count) {
            for (let i = 0; i < MAX_TEN_TASK_PRO_COUNT; i++) {
                if (0 < data.zhuan_pan_reward_count.list[i]) {
                    this.m_TenDayTurnTableRewards.push(data.zhuan_pan_reward_count.list[i])
                }
            }
        }
    }
    PLAZA_TASK_TEN_DAY_TASK_ACTIVITY_DATA(data: proto.plaza_task.gs_tenday_task_act_data_s) {
        this.m_TenDayTaskData = data
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_TEN_DAY_TASK_ACTIVITY_DATA,
            dict: data,
        });
    }
    PLAZA_TASK_TEN_DAY_TASK_ACTIVITY_REQ(nType: number) {
        let data = proto.plaza_task.gs_tenday_task_act_req_c.create()
        data.req_type = nType
        let bsuccess = this.sendData(this.cmd.PLAZA_TASK_TEN_DAY_TASK_ACTIVITY_REQ, data)
    }
    PLAZA_TASK_TEN_DAY_TASK_ACTIVITY_RET(data: proto.plaza_task.Igs_tenday_task_ret_s) {
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_TEN_DAY_TASK_ACTIVITY_RET,
            dict: data,
        });
    }
    //发送完成任务请求
    sendFinishTask(lTaskListID: number) {
        let data = proto.plaza_task.gs_task_finish_c.create()
        data.task_list_id = lTaskListID
        let bsuccess = this.sendData(this.cmd.PLAZA_TASK_FINISH, data)
    }

    getTaskViewListByBtType(btType) {
        return this.m_TaskViewList[btType] || []
    }

    //通过任务sTaskID获取对应视图
    getTaskView(sTaskID) {
        for (const k in this.m_TaskViewList) {
            let TB = this.m_TaskViewList[k]
            for (const i in TB) {
                if (sTaskID == TB[i].stask_id) {
                    return TB[i]
                }
            }
        }
    }

    //通过任务链id获得任务视图
    getTaskViewByListID(taskListId) {
        for (const k in this.m_TaskViewList) {
            let TB = this.m_TaskViewList[k]
            for (const i in TB) {
                if (taskListId == TB[i].task_list_id) {
                    return TB[i]
                }
            }
        }
    }

    //通过lTaskListID获得任务元素
    getTaskItem(lTaskListID:number) {
        if (this.m_TaskItemList && this.m_TaskItemList.length > 0) {
            for (const TB of this.m_TaskItemList) {
                if (lTaskListID == TB.task_list_id) {
                    return TB
                }
            }
        }
    }

    //判断任务是否启用
    isTaskOpen(taskType) {
        
            return false
        
    }

    //通过任务id跳转   
    jumpByTaskListId(taskListId){
        let curScene = fw.scene.getScene()
        if (curScene.name == fw.SceneConfigs.plaza.sceneName) {
            let taskTriggerFuncInfo = center.task.getTaskTriggerFuncInfoByTaskListID(taskListId)
            if (taskTriggerFuncInfo) {
                let taskTriggerFunc = center.task.getTaskTriggerFuncByFuncType(taskTriggerFuncInfo.func_type, taskTriggerFuncInfo.func_param0, taskTriggerFuncInfo.func_param1)
                if (taskTriggerFunc) {
                    taskTriggerFunc()
                }
            }
        } else {
            app.popup.showToast({ text: "You are not in the lobby" })
        }
    }

    //获取可领取奖励的任务个数(taskType 为nil是可领取奖励的任务总数，不为nil 则为该类型的任务可领取奖励数)
    getCanAwardTaskCount(taskType) {
        if (!taskType) {
            let count = 0
            for (const k in this.m_TaskViewList) {
                let TB = this.m_TaskViewList[k]
                for (const i in TB) {
                    let M = TB[i]
                    let taskItem = this.getTaskItem(M.task_list_id)
                    if (M) {
                        if (taskItem.now_finish >= M.finish_times &&
                            taskItem.receive_finish < M.finish_times) {
                            count = count + 1
                        }
                    }
                }
            }
            return count
        } else if (this.m_TaskViewList[taskType] && this.isTaskOpen(taskType)) {
            let count = 0
            for (const i in this.m_TaskViewList[taskType]) {
                let M = this.m_TaskViewList[taskType][i]
                let taskItem = this.getTaskItem(M.task_list_id)
                if (taskItem) {
                    if (taskItem.now_finish >= M.finish_times &&
                        taskItem.receive_finish < M.finish_times) {
                        count = count + 1
                    }
                }
            }
            //print("获取可领取奖励的任务个数"..count)
            return count
        }
        return 0
    }

    getSubsydyInfo() {
        return this.m_SubsydyInfo
    }

    getSubsydyData() {
        return this.m_SubsydyData
    }

    checkRefreshSubsydyData() {
        let day = center.user.getDayIndex()
        if (day == this.m_SubsydyDataRefreshDay) {
            return
        }
        this.m_SubsydyData.nDayReciveCount = 0
        this.m_SubsydyDataRefreshDay = day
    }

    isCanGetSubsydy() {
        this.checkRefreshSubsydyData()
        if (this.m_SubsydyData.nDayReciveCount < this.m_SubsydyInfo.nSubsidyCount &&
            this.m_SubsydyData.nTotalReciveCount < this.m_SubsydyInfo.nTotalCount &&
            center.user.getActorProp(PROTO_ACTOR.UAT_GOLD) < this.m_SubsydyInfo.nCriticalGold) {
            return true
        }
        return false
    }

    OnRecv_TaskInfo(dict: proto.plaza_task.gs_task_info_s) {
        //任务进度信息
        this.m_TaskItemList = dict.task_item;
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAZA_TASK_INFO,
            dict: dict,
        });
    }

    OnRecv_Tips(dict: proto.plaza_task.Igs_task_tips_s) {
        fw.print("taskManager:OnRecv_Tips")
        fw.print(dict, "OnRecv_Tips")

        if (typeof (dict.msg) == "string" && dict.msg != "") {
            app.popup.showToast(dict.msg)
        }

        //破产错误消息
        if (dict.tips_id >= 1 && dict.tips_id <= 6) {
            app.popup.showDialog({
                viewConfig: fw.BundleConfig.plaza.res[`bankruptcy/bankruptcy`],
            });
        }
    }

    OnRecv_TaskChange(dict: proto.plaza_task.gs_task_change_s) {
        let isNew = true
        if (this.m_TaskItemList && this.m_TaskItemList.length > 0) {
            for (const v of this.m_TaskItemList) {
                if (v.task_list_id == dict.task_list_id) {
                    v.now_finish = dict.now_finish;
                    v.receive_finish = dict.receive_finish;
                    isNew = false;
                    break;
                }
            }
        }
        isNew && this.m_TaskItemList.push(dict);
        let taskInfo = center.task.getTaskViewByListID(dict.task_list_id);
        if (taskInfo && TaskType.TASK_TYPE_BREAKTHROUG == taskInfo.type && taskInfo.task_list_id == dict.task_list_id) {
            if (dict.now_finish >= taskInfo.finish_times) {
                fw.print("恭喜完成突破任务，你等级已突破");
            }
        }
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAZA_TASK_CHANGE,
            dict: dict,
        });
    }

    //返回任务视图 s -> c
    OnRecv_TaskViewNew(dict: proto.plaza_task.Igs_task_view_new_s) {
        fw.print("taskManager:OnRecv_TaskViewNew")
        fw.print(dict, "OnRecv_TaskViewNew")
        //任务视图信息
        //0 起始 1中间包 2结束包-- 特殊情况只有1个包
        let nFlag = dict.flag
        if (nFlag == 0) {
            this.m_TaskViewList = {}
        }

        let TaskViewNew = dict.data
        for (const v of TaskViewNew) {
            if (!this.m_TaskViewList[v.type]) {
                this.m_TaskViewList[v.type] = []
            }
            this.m_TaskViewList[v.type].push(v)

        }
        if (nFlag == 0 || nFlag == 2) {
            app.event.dispatchEvent({
                eventName: EVENT_ID.EVENT_PLAZA_TASK_VIEW,
                dict: this.m_TaskViewList,
            })
        }
    }


    //新增任务
    OnRecv_TaskAddNew(dict: proto.plaza_task.Igs_task_add_new_s) {
        fw.print("taskManager:OnRecv_TaskAddNew")
        //fw.print(dict, "OnRecv_TaskAddNew")
        if (this.getTaskView(dict.data.stask_id)) {
            fw.print("已经存在该任务Id")
            fw.print("Error,CTaskManager----TaskId is Exit:%d", dict.data.stask_id)
            return
        }

        if (!this.m_TaskViewList[dict.data.type]) {
            this.m_TaskViewList[dict.data.type] = []
        }
        this.m_TaskViewList[dict.data.type].push(dict.data)

        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAZA_TASK_ADD,
            dict: dict,
        })
    }

    //获得任务奖励 s -> c
    OnRecv_TaskReward(dict: proto.plaza_task.gs_task_reward_s) {
        fw.print("taskManager:OnRecv_TaskReward")
        //fw.print(dict, "奖励数据")
        let lGold = dict.gold ?? 0
        // let lGoodsId = dict.goodsId

        let rewardTBs: RewardItem[] = []
        if (lGold > 0) {
            rewardTBs.push({
                nGoodsID: center.goods.gold_id.cash,
                nGoodsNum: lGold
            })
        }

        if (rewardTBs.length > 0) {
            center.mall.payReward(rewardTBs, true)
            app.event.dispatchEvent({
                eventName: EVENT_ID.EVENT_TASK_REWARD_GET
            })
        }
        fw.print("(已处理)此处要弹出任务奖励界面,金币..=", lGold)
        fw.print("(已处理)lGoodsID和lGoodsNum,nil为只奖励金币")

    }

    //任务点击前往信息
    OnRecv_TaskTriggerFuc(dict: proto.plaza_task.Igs_task_trigger_fuc_s) {
        fw.print("taskManager:OnRecv_TaskTriggerFuc")
        fw.print(dict, "OnRecv_TaskTriggerFuc")
        //任务点击前往信息
        this.m_TriggerFucMap = dict.data
    }

    sendXXLGuankaReward(guankaID) {
        let data = proto.plaza_task.gs_xxlguankarequest_c.create()
        data.guanka_id = guankaID
        return this.sendData(this.cmd.PLAZA_TASK_XXL_GUANKA_REWARD, data)
    }





    getXXLGuankaData() {
        return this.mXXLGuankaData
    }

    getXXLGuankaConfig() {
        return this.mXXLGuanKaConfigs
    }

    getXXLGuankaConfigByID(nGuanKaID) {
        return this.mXXLGuanKaConfigs[nGuanKaID]
    }

    isXXLGuankaOver() {
        let mDatas = center.task.getXXLGuankaData()
        let nGuanKaID = mDatas ? mDatas.guanka_id : 0;
        let maxGuanKaID = this.mTotalCount
        return nGuanKaID > maxGuanKaID
    }

    getXXLGuankaRemoveNumByType(type: number) {
        let nElement = this.mXXLGuankaData.element
        return nElement[type]
    }

    getTaskTriggerFuncInfoByTaskListID(taskListID: number) {
        // fw.print("getTaskTriggerFuncInfoByTaskListID:", taskListID)
        for (const triggerFuc of this.m_TriggerFucMap) {
            if (triggerFuc.task_list_id == taskListID) {
                return triggerFuc
            }
        }
    }

    //TASKTRIGGERFUNC_TYPE_UNKNOWN = "0"--,	//未知								TriggerFuncItem::uFuncParam0:NULL						TriggerFuncItem::uFuncParam1:NULL
    //TASKTRIGGERFUNC_TYPE_SETFACE = "1"--,	//前往个人信息							TriggerFuncItem::uFuncParam0:NULL						TriggerFuncItem::uFuncParam1:NULL
    //TASKTRIGGERFUNC_TYPE_PLAYGAME = "3"--,	//前往房间							TriggerFuncItem::uFuncParam0:NULL						TriggerFuncItem::uFuncParam1:NULL
    //TASKTRIGGERFUNC_TYPE_OPENMALL = "4"--,	//打开商城							TriggerFuncItem::uFuncParam0:参考MallTag的sID			TriggerFuncItem::uFuncParam1:NULL
    //TASKTRIGGERFUNC_TYPE_SHARE = "5"--,	//分享								TriggerFuncItem::uFuncParam0:参考GS_TaskShare消息定义	TriggerFuncItem::uFuncParam1:NULL
    //TASKTRIGGERFUNC_TYPE_BINDPHONE = "6"--,	//绑定手机							TriggerFuncItem::uFuncParam0:NULL						TriggerFuncItem::uFuncParam1:NULL
    //TASKTRIGGERFUNC_TYPE_WELFARE = "7"--,	//兑换商城						TriggerFuncItem::uFuncParam0:NULL						TriggerFuncItem::uFuncParam1:NULL
    //TASKTRIGGERFUNC_TYPE_PLAZAS = "8"--,	//大厅						TriggerFuncItem::uFuncParam0:NULL		TriggerFuncItem::uFuncParam1:NULL
    //TASKTRIGGERFUNC_TYPE_QUICKSTART = "9"--,	//快速开始						TriggerFuncItem::uFuncParam0:NULL		TriggerFuncItem::uFuncParam1:NULL
    //TASKTRIGGERFUNC_TYPE_JUMPAPPSTROE = "10"--,	//跳转appstroe或桌面						TriggerFuncItem::uFuncParam0:NULL		TriggerFuncItem::uFuncParam1:NULL
    //TASKTRIGGERFUNC_TYPE_INVITEFRIEND            ="11" -- 跳转邀请好友界面-- 跳转到好友界面 v2.0
    //TASKTRIGGERFUNC_TYPE_TIME_TASK               ="12" -- 定时任务提示
    //TASKTRIGGERFUNC_TYPE_MATCH_SIGN_VIEW = "14"--,   //比赛报名列表
    //TASKTRIGGERFUNC_TYPE_GOTO_ZHANCHE = "15"--,  //战车房间
    //TASKTRIGGERFUNC_TYPE_GOTO_SHIMING = "16"--,   //实名认证
    //TASKTRIGGERFUNC_TYPE_GOTO_ERJI = "17"--,   //前往二级娱乐
    //TASKTRIGGERFUNC_TYPE_GOTO_LEVELGAME = "18"--,   //前往关卡模式
    //TASKTRIGGERFUNC_TYPE_GOTO_EARN = "19"--,   //前往上次的游戏或二级界面(前往赢金)
    //TASKTRIGGERFUNC_TYPE_GOTO_RUMMY = "20"--,   //前往Rummy二级界面
    //TASKTRIGGERFUNC_TYPE_GOTO_TEENPATTI = "21"--,   //前往teenpatti二级界面
    //TASKTRIGGERFUNC_TYPE_GOTO_HHWAR = "22"--,   //前往红黑
    //TASKTRIGGERFUNC_TYPE_GOTO_WINGO = "23"--,   //前往wingo
    //TASKTRIGGERFUNC_TYPE_GOTO_SGJ = "24"--,   //前往水果机二级界面
    getTaskTriggerFuncByFuncType(funcType, uFuncParam0, uFuncParam1) {
        // fw.print("getTaskTriggerFuncByFuncType", funcType)
        funcType = String(funcType)
        if (funcType == TaskTriggerFuncType.TASKTRIGGERFUNC_TYPE_SETFACE) {
            return () => {
                app.popup.showDialog({
                    viewConfig: fw.BundleConfig.plaza.res[`userInfo/userInfo_dialog`],
                });
            }
        } else if (funcType == TaskTriggerFuncType.TASKTRIGGERFUNC_TYPE_PLAYGAME) {
            center.roomList.sendGetRoomServerId(uFuncParam1);
        } else if (funcType == TaskTriggerFuncType.TASKTRIGGERFUNC_TYPE_OPENMALL) {
            return () => {
                app.popup.showDialog({
                    viewConfig: fw.BundleConfig.plaza.res[`shop/shop_main`],
                });
            }
        } else if (funcType == TaskTriggerFuncType.TASKTRIGGERFUNC_TYPE_SHARE) {
            return () => {
                if (center.user.isSwitchOpen("btShareSwitch")) {
                    if (center.user.isSwitchOpen("btLEOShare") && app.sdk.isSdkOpen("leoshare")) {
                        app.popup.showDialog({
                            viewConfig: fw.BundleConfig.plaza.res[`myRefer/myShare`]
                        });
                    } else {
                        app.popup.showDialog({
                            viewConfig: fw.BundleConfig.plaza.res[`myRefer/myRefer`]
                        });
                    }
                }
            }
        } else if (funcType == TaskTriggerFuncType.TASKTRIGGERFUNC_TYPE_PLAZAS) {
            return () => {
                fw.scene.changeScene(fw.SceneConfigs.plaza);
            }
        } else if (funcType == TaskTriggerFuncType.TASKTRIGGERFUNC_TYPE_GOTO_EARN) {
            return () => {
                this.gotoEarnMoney()
            }
        } else if (funcType == TaskTriggerFuncType.TASKTRIGGERFUNC_TYPE_GOTO_RUMMY) {
            return () => {
                app.popup.showToast("need to do");
                // manager.scene: getScene(): changeState("roomView", "rummyNew")
            }
        } else if (funcType == TaskTriggerFuncType.TASKTRIGGERFUNC_TYPE_GOTO_HHWAR) {
            return () => {
                center.roomList.sendGetRoomServerId(center.roomList.KIND_ID.ddz_HHWar)
            }
        } else if (funcType == TaskTriggerFuncType.TASKTRIGGERFUNC_TYPE_GOTO_WINGO) {
            return () => {
                center.roomList.sendGetRoomServerId(center.roomList.KIND_ID.BRWinGo)
            }
        } else if (funcType == TaskTriggerFuncType.TASKTRIGGERFUNC_TYPE_GOTO_SGJ) {
            return () => {
                app.popup.showToast("need to do");
                // let info = { "roomView", "sgj", "水果二级", visible = false, iconindex = 5, combine_id = { center.roomList.COMBINE_ID.sgj } }
                // manager.scene: getScene(): changeState(info[1], info[2], info)
            }
        } else if (funcType == TaskTriggerFuncType.TASKTRIGGERFUNC_TYPE_GOTO_BINDPHONE) {
            return () => {
                app.popup.showDialog({
                    viewConfig: fw.BundleConfig.plaza.res[`userInfo/bind_phone`]
                });
            }
        } else if (funcType == TaskTriggerFuncType.TASKTRIGGERFUNC_TYPE_GOTO_LHD) {
            return () => {
                center.roomList.sendGetRoomServerId(center.roomList.KIND_ID.ddz_lhd)
            }
        }
    }
    gotoEarnMoney() {
        let lastLevelTwolayer = app.file.getIntegerForKey("lastLevelTwolayer", 0, { all: true })
        let vaildRoomList = center.roomList.getVaildRoomList()
        if (vaildRoomList) {
            for (const v of vaildRoomList) {
                if (lastLevelTwolayer == 0) {
                    if (v.showListLen > 1) {
                        // manager.scene: getScene(): changeState(v.status, v.roomtype)
                        app.popup.showToast("need to do");
                        break
                    }
                } else if (lastLevelTwolayer == v.iconindex) {
                    if (v.showListLen == 1) {
                        // center.roomList: sendGetRoomServerId(v.showList[1].kindId)
                        app.popup.showToast("need to do");
                    } else {
                        app.popup.showToast("need to do");
                        // manager.scene: getScene(): changeState(v.status, v.roomtype)
                    }
                }
            }
        }
    }

    //合并任务链
    mergeTaskList(tasks) {
        let hashMag = {}
        let ret = []
        for (const i in tasks) {
            if (!hashMag[tasks[i].taskListId]) {
                hashMag[tasks[i].taskListId] = tasks[i]
            } else if (Number(hashMag[tasks[i].taskListId].finishTimes) < Number(tasks[i].finishTimes)) {
                hashMag[tasks[i].taskListId] = tasks[i]
            }
        }
        for (const i in hashMag) {
            ret.push(hashMag[i])
        }
        return ret
    }

    onRecv_GetFreeBonusRet(dict: proto.plaza_task.Igs_freebouns_end_reward_ret_s) {
        fw.print(dict, "onRecv_GetFreeBonusRet", 10)
        let nerror = dict.error

        if (nerror == 0) {
            app.popup.showToast("please try again later")
        } else if (nerror == 1) {
            let RewardTB = {
                nGoodsID: dict.goods_id || 0,
                nGoodsNum: dict.goods_num || 0,
            }

            let RewardTBs = {
                reward : []
            }
            RewardTBs.reward.push(RewardTB)
            if (this.freeBonusCfg) {
                this.freeBonusCfg.flag = 1
            }
            app.event.dispatchEvent({
                eventName: EVENT_ID.EVENT_GETFREEBONUSTIPS,
                dict: RewardTBs
            })
            app.event.dispatchEvent({
                eventName: "UpdateActivityBtn",
                data: "FreeBonus"
            })
        }
    }

    onRecv_FreeBonusCfg(dict: proto.plaza_task.Igs_freebonus_cfg_s) {
        fw.print(dict, "onRecv_FreeBonusCfg", 10)
        if (!this.freeBonusCfg) {
            this.freeBonusCfg = {}
        }
        this.freeBonusCfg.status = dict.item.status //1有效
        this.freeBonusCfg.task = dict.item.task_id.list || []
        this.freeBonusCfg.taskCount = dict.item.task_count || 0
        this.freeBonusCfg.goodsID = dict.item.goods_id || 0
        this.freeBonusCfg.goodsNum = dict.item.goods_num || 0

        fw.print(this.freeBonusCfg, "onRecv_FreeBonusCfg234", 10)
    }

    getFreeBonusCfg() {
        return this.freeBonusCfg
    }

    onRecv_FreeBonusInfo(dict: proto.plaza_task.Igs_freebonus_data_s) {
        fw.print(dict, "onRecv_FreeBonusInfo", 10)
        if (!this.freeBonusCfg) {
            this.freeBonusCfg = {}
        }
        this.freeBonusCfg.flag = dict.flag //1已经领取
        this.freeBonusCfg.finishCount = dict.finish_count
    }

    isFreeBonusOpen() {
        let isvaild = false
        if (this.freeBonusCfg) {
            if (this.freeBonusCfg.status != null && this.freeBonusCfg.flag != null && this.freeBonusCfg.status == 1 && this.freeBonusCfg.flag == 0) {
                isvaild = true
            }
        }
        return isvaild
    }

    sendFreeBonusReq() {
        let data = proto.plaza_task.gs_freebouns_end_reward_req_c.create()
        this.sendData(this.cmd.PLAZA_TASK_FREEBONUS_END_REWARD_REQUEST, data)
    }

    onRecv_TaskSevenInfo(dict: proto.plaza_task.Igs_new_seventask_info_s) {
        fw.print(dict, "onRecv_TaskSevenInfo")
        this.nDownDay = dict.down_day
    }

    getTaskSevenCurDay() {
        return this.nDownDay ?? 0
    }

    onRecv_TaskPayCashBackCfg(dict: proto.plaza_task.Igs_paybonus_cfg_s) {
        fw.print(dict, "onRecv_TaskPayCashBackCfg")
        this.m_TaskPayCashBackCfg = dict
    }

    onRecv_TaskPayCashBackInfo(dict: proto.plaza_task.Igs_paybonus_actor_data_s) {
        fw.print(dict, "onRecv_TaskPayCashBackInfo")
        this.m_TaskPayCashBackInfo = dict
        app.event.dispatchEvent({
            eventName: "UpdateActivityBtn",
            data: "SuperCashBack"
        })
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PAYTASK_INFO_CHANGE
        })
    }

    onRecv_TaskPayResult(dict: proto.plaza_task.Ibuy_pay_bonus_success_s) {
        if (dict.rid) {
            let quickInfo = center.roomList.getQuickRecharge(dict.rid)
            if (quickInfo.nQuickGoodsNum) {
                center.mall.payReward([{
                    nGoodsID: center.goods.gold_id.cash,
                    nGoodsNum: quickInfo.nQuickGoodsNum
                }],false)
            }
        }
    }

    getTaskPayCashBackCfg() {
        return this.m_TaskPayCashBackCfg
    }

    getTaskPayCashBackInfo() {
        return this.m_TaskPayCashBackInfo
    }

    isTaskCashBackOpen() {
        let flag = false
        if (!this.m_TaskPayCashBackCfg) {
            flag = false
        }
        if (this.m_TaskPayCashBackCfg.status == 1 && this.m_TaskPayCashBackInfo.task_state != 1) {
            flag = true
        }
        return flag
    }

    taskCreateOrder(rid, orderType) {
        let data = proto.plaza_task.gs_taskcreateorder_c.create()
        data.order_type = orderType
        data.rid = rid
        this.sendData(this.cmd.PLAZA_TASK_CRETEORDER_NUM, data)
    }

    OnRecv_PayTaskOrderRes(dict: proto.plaza_task.Igs_taskcreateorderres_s) {
        fw.print(dict, "OnRecv_PayTaskOrderRes")
        let OrderId = dict.szorder
        let nRID = dict.rid

        let paySDK = app.sdk
        paySDK.setOrderNum(OrderId)
        paySDK.setRID(nRID)

        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PAYTASK_BUY_RESULT
        })
    }
    OnRecv_TaskSubsydyInfo(dict: proto.plaza_task.gs_task_subsidy_info){
        // fw.print(dict, "OnRecv_TaskSubsydyInfo")
        this.m_SubsydyInfo.nTotalCount  = dict.total_count
        this.m_SubsydyInfo.nSubsidyCount  = dict.subsidy_count
        this.m_SubsydyInfo.nCriticalGold  = dict.critical_gold
        this.m_SubsydyInfo.nAddGold  = dict.add_gold
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAZA_TASK_SUBSYDIY,
            data: this.m_SubsydyInfo
        })
    }
    OnRecv_TaskSubsydyData(dict: proto.plaza_task.gs_task_subsidy_data){
        // fw.print(dict, "OnRecv_TaskSubsydyData")
        this.m_SubsydyData.nTotalReciveCount = dict.total_recive_count
        this.m_SubsydyData.nDayReciveCount = dict.day_recive_count
        this.m_SubsydyDataRefreshDay = center.user.getDayIndex()
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAZA_TASK_SUBSYDIY_DATA,
            data: this.m_SubsydyData
        })
    }
    GetSubsidy(){
        let data = proto.plaza_task.gs_task_get_subsidy.create()
        this.sendData(this.cmd.PLAZA_TASK_GETSUBSIDY, data)
    }
    OnRecv_TaskSubsydyReward(dict: proto.plaza_task.gs_task_get_subsidy_ret){
        let data: any = {}
        data.reward = [{nGoodsID:center.goods.gold_id.cash, nGoodsNum:dict.gold}]
        data.extend =  {bDontShowTitle:true}
        app.popup.showDialog({
            viewConfig: fw.BundleConfig.resources.res[`ui/reward/reward`],
            data: data,
        });
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_TASK_SUBSIDY_REWARD,
        })
    }
    /**设置水果机数据刷新状态 */
    setSlotTaskRefreshState(bSlotTaskRefresh: boolean) {
        (<any>this).bSlotTaskRefresh = bSlotTaskRefresh;
    }
    /**获取水果机数据刷新状态 */
    getSlotTaskRefreshState() {
        return (<any>this).bSlotTaskRefresh;
    }
    /**请求水果机关卡奖励 */
    send_PLAZA_TASK_SGJ_GUANKA_REWARD() {
        let data = proto.plaza_task.gs_sgj_guanka_request_c.create()
        let taskData = this.getSlotTaskData()
        data.guanka_id = taskData.guanka_id
        data.room_id = taskData.room_id
        this.sendData(this.cmd.PLAZA_TASK_SGJ_GUANKA_REWARD, this.getSlotTaskData());
    }
    /**响应水果机关卡奖励 */
    PLAZA_TASK_SGJ_GUANKA_REWARD_RET(data: proto.plaza_task.Igs_sgj_guanka_req_ret_s) {
        //显示奖励
        let config = this.getSlotTaskConfig();
        if (config) {
            let guanKaConfig = config[data.guanka_id];
            if (guanKaConfig) {
                let rewards = [];
                guanKaConfig.reward_item.forEach((element) => {
                    if (element.good_id > 0) {
                        rewards.push({
                            nGoodsID: element.good_id,
                            nGoodsNum: element.good_num,
                        });
                    }
                });
                let extendData =  {bDontShowTitle:true}
                app.popup.showDialog({
                    viewConfig: fw.BundleConfig.resources.res[`ui/reward/reward`],
                    data: { reward: rewards ,extend: extendData},
                });
            }
        }
        app.event.dispatchEvent({
            eventName: `PLAZA_TASK_SGJ_GUANKA_REWARD_RET`,
            data: data,
        });
    }
    /**水果机关卡数据 */
    getSlotTaskData(): proto.plaza_task.Igs_sgj_guanka_data_s {
        return (<any>this).slotTaskData;
    }
    PLAZA_TASK_SGJ_GUANKA_DATA(data: proto.plaza_task.Igs_sgj_guanka_data_s) {
        let slotTaskData = this.getSlotTaskData();
        //关卡不同时才推送消息（游戏刷新自行调整时机）
        let bRefresh = !slotTaskData || slotTaskData.guanka_id != data.guanka_id;
        //标记数据已经刷新
        this.setSlotTaskRefreshState(true);
        //缓存新数据
        (<any>this).slotTaskData = data;
        //事件通知
        if (bRefresh) {
            app.event.dispatchEvent({
                eventName: `PLAZA_TASK_SGJ_GUANKA_DATA`,
                data: data,
            });
        }
    }
    /**水果机关卡配置数据 */
    getSlotTaskConfig(): { [nGuanKaID: number]: proto.common.ISGJGuanKaConfig } {
        return (<any>this).slotTaskConfig;
    }
    PLAZA_TASK_SGJ_GUANKA_CONFIG(data: proto.plaza_task.Igs_sgj_guanka_cfg_s) {
        //标记数据已经刷新
        this.setSlotTaskRefreshState(true);
        //缓存新数据
        (<any>this).slotTaskConfig = {};
        for (const v of data.sgj_item) {
            (<any>this).slotTaskConfig[v.guanka_id] = v;
        }
        //事件通知
        app.event.dispatchEvent({
            eventName: `PLAZA_TASK_SGJ_GUANKA_CONFIG`,
            data: data,
        });
    }

    //请求TP关卡奖励
    send_PLAZA_TASK_TEENPATTI_GUANKA_REWARD(nGuanKaID) {
        let data = proto.plaza_task.gs_tp_guanka_req_c.create()
        data.guanka_id = nGuanKaID
        this.sendData(this.cmd.PLAZA_TASK_TEENPATTI_GUANKA_REWARD, data)
    }






    getTpLvUserData() {
        return this.m_tpLvUserData
    }

    getTpLvCfg() {
        return this.m_tpLvCfg
    }

    getTenDayTaskData() {
        return this.m_TenDayTaskData
    }

    getTenDayTaskConfig() {
        return this.m_TenDayTaskConfig
    }

    getSplitTenDayTaskData() {
        return this.splitTenDayTaskData
    }

    getTenDayTaskDay(taskId, index) {
        if (null == this.m_TenDayTaskConfig || 0 >= this.m_TenDayTaskConfig.task_id.one_arr.length) {
            return -1
        }
        for (let i = 0; i < this.m_TenDayTaskConfig.task_id.one_arr.length; i++) {
            if (this.m_TenDayTaskConfig.task_id.one_arr[i].list[index] == taskId) {
                return i
            }
        }
        return -1
    }
    getPreTenDayTaskData(day_, index_) {
        if (null == day_ || 0 >= day_) {
            return null
        }
        return this.m_TenDayTaskConfig.task_id.one_arr[day_ - 1].list[index_]
    }
    setTenDayTaskLastTime(time_) {
        app.file.setIntegerForKey("ShowTenDayTaskLastTime", time_)
    }
    isShowTenDayTask(flag_) {
        if (this.m_TenDayTaskConfig == null) {
            return false
        }
        if ((this.m_TenDayTaskConfig && 0 >= this.m_TenDayTaskConfig.status) || (this.m_TenDayTaskData && 0 >= this.m_TenDayTaskData.end_flag)) {
            return false
        }

        if (0 >= this.getTenDayTaskRemainTime()) {
            return false
        }
        //这里判断是否显示按钮
        if (flag_) {
            return true
        }
        // 下面是弹窗判断
        // 有抽奖次数未抽就弹
		let tdata = center.task.getTenDayTaskData()
		if (3 <= tdata.finish_tentask_count) {
            return true
        }
        // --判断当天是否已经显示过了
        let ttime = app.file.getIntegerForKey("ShowTenDayTaskLastTime", 0)
        if (ttime == 0) {
            this.setTenDayTaskLastTime(app.func.time())
            return true
        }
        let tdate1 = app.func.time_YMD(ttime)
        let tdate2 = app.func.time_YMD(app.func.time())
        if (tdate1 == tdate2) {
            return false
        }
        this.setTenDayTaskLastTime(app.func.time())
        return true
    }
    getTenDayTurnTableRewards() {
        return this.m_TenDayTurnTableRewards
    }
    getTenDayTaskRemainTime() {
        // --客户端自己判断是否超过注册时间20天
        let tfonfig = this.m_TenDayTaskConfig
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
}

export enum TaskType {
    /**每日日常任务 */
    TASK_TYPE_DAY = 0,
    /**周任务 */
    TASK_TYPE_WEEK = 1,
    /**活动任务 */
    TASK_TYPE_ACTIVE = 2,
    /**成就任务 */
    TASK_TYPE_ACHIEVEMENT = 3,
    /**新手任务 */
    TASK_TYPE_NOVICE = 4,
    /**定时任务 */
    TASK_TYPE_TIME = 5,
    /**复活任务 */
    TASK_TYPE_REVIVE = 7,
    /**新手任务 七天任务 */
    TASK_TYPE_DAILY_SEVEN = 9,
    /**捕鱼任务 */
    TASK_TYPE_BUYU = 11,
    /**突破任务 */
    TASK_TYPE_BREAKTHROUG = 13,
    /**飞行棋新手任务 */
    TASK_TYPE_LUDO = 16,
    /**10天任务 */
    TASK_TYPE_TENDAYTASK = 17,
}

enum VideoType {
    /**普通看视频 */
    VIDEO_TYPE_NORMAL = 1,
    /**破产看视频 */
    VIDEO_TYPE_BROKE = 2,
    /**看视频解锁车位 */
    VIDEO_TYPE_UNLOCK_STATION = 3,
    /**签到 */
    VIDEO_TYPE_SIGN = 4,
    /**获得闯关体力 */
    VIDEO_TYPE_SPIRIT = 5,
    /**看视频闯关额外奖励 */
    VIDEO_TYPE_LEVEL = 6,
    /**解锁战车 */
    VIDEO_TYPE_UNLOCK_CHARIOT = 7,
}

enum ShareType {
    /**qq好友 */
    SHARE_QQFRIEND = 0,
    /**qq空间 */
    SHARE_QQROOM = 1,
    /**微信好友 */
    SHARE_WEIXINFRIEND = 2,
    /**微信朋友圈 */
    SHARE_WEIXINFRIENDCIRCLE = 3,
}

enum TaskTriggerFuncType {
    /**未知 */
    TASKTRIGGERFUNC_TYPE_UNKNOWN = "0",
    /**前往个人信息 */
    TASKTRIGGERFUNC_TYPE_SETFACE = "1",
    /**设置昵称 */
    TASKTRIGGERFUNC_TYPE_SETNICKNAME = "2",
    /**进入游戏房间 */
    TASKTRIGGERFUNC_TYPE_PLAYGAME = "3",
    /**打开商城 */
    TASKTRIGGERFUNC_TYPE_OPENMALL = "4",
    /**分享 */
    TASKTRIGGERFUNC_TYPE_SHARE = "5",
    /**绑定手机 */
    TASKTRIGGERFUNC_TYPE_BINDPHONE = "6",
    /**兑换商城 */
    TASKTRIGGERFUNC_TYPE_WELFARE = "7",
    /**大厅 */
    TASKTRIGGERFUNC_TYPE_PLAZAS = "8",
    /**快速开始 */
    TASKTRIGGERFUNC_TYPE_QUICKSTART = "9",
    /**跳转appstroe或桌面 */
    TASKTRIGGERFUNC_TYPE_JUMPAPPSTROE = "10",
    /**邀请好友 */
    TASKTRIGGERFUNC_TYPE_INVITEFRIEND = "11",
    /**定时任务提示 */
    TASKTRIGGERFUNC_TYPE_TIME_TASK = "12",
    /**分享赚钱 */
    TASKTRIGGERFUNC_TYPE_SHARE_MONEY = "13",
    /**比赛报名列表 */
    TASKTRIGGERFUNC_TYPE_MATCH_SIGN_VIEW = "14",
    /**比赛报名列表 */
    TASKTRIGGERFUNC_TYPE_GOTO_ZHANCHE = "15",
    /**实名认证 */
    TASKTRIGGERFUNC_TYPE_GOTO_SHIMING = "16",
    /**前往二级娱乐 */
    TASKTRIGGERFUNC_TYPE_GOTO_ERJI = "17",
    /**前往关卡模式 */
    TASKTRIGGERFUNC_TYPE_GOTO_LEVELGAME = "18",
    /**前往上次的游戏或二级界面 */
    TASKTRIGGERFUNC_TYPE_GOTO_EARN = "19",
    /**前往Rummy二级界面 */
    TASKTRIGGERFUNC_TYPE_GOTO_RUMMY = "20",
    /**前往teenpatti二级界面 */
    TASKTRIGGERFUNC_TYPE_GOTO_TEENPATTI = "21",
    /**前往红黑 */
    TASKTRIGGERFUNC_TYPE_GOTO_HHWAR = "22",
    /**前往wingo */
    TASKTRIGGERFUNC_TYPE_GOTO_WINGO = "23",
    /**前往水果机二级界面 */
    TASKTRIGGERFUNC_TYPE_GOTO_SGJ = "24",
    /**前往手机绑定 */
    TASKTRIGGERFUNC_TYPE_GOTO_BINDPHONE = "25",
    /**前往手机绑定 */
    TASKTRIGGERFUNC_TYPE_GOTO_LHD = "26",
}

interface FreeBonusCfg {
    status?: number,
    task?: number[],
    taskCount?: number,
    goodsID?: number,
    goodsNum?: number,
    flag?: number,
    finishCount?: number,
}
