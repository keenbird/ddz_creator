import { ACTOR } from "../../config/cmd/ActorCMD";
import { EVENT_ID } from "../../config/EventConfig";
import { GS_PLAZA_MSGID, sint, sint64, slong, stchar, stcharend, uchar, ushort, ushortlen } from "../../config/NetConfig";
import { PlazeMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";
import proto from "../common";

enum TipsID {
    TipsID_UserErr = 0,//用户状态异常
    TipsID_close = 1, //后台活动关闭
    TipsID_ConfigErr = 2, //配置异常
    TipsID_CountLimit = 3, //次数限制
    TipsID_DayCountLimit = 4, //每日次数限制
    TipsID_StateErr = 5, //抽奖状态异赏
    TipsID_LevelLimit = 6, //等级不够
    TipsID_RechargeLimit = 7, //充值不够
}

let TipsMsg = [
    /**lang*/"User status abnormal",//用户状态异常
    /**lang*/"Activity closed", //后台活动关闭
    /**lang*/"Configuration abnormal", //配置异常
    /**lang*/"Frequency restriction", //次数限制
    /**lang*/"Daily frequency restriction", //每日次数限制
    /**lang*/"Lottery status abnormal", //抽奖状态异赏
    /**lang*/"Not enough level", //等级不够
    /**lang*/"Not enough top-up", //充值不够
]

let RewardType = {
    cash: 0,
    bonus: 1,
    cattle: 2, // 牛
}

let MAX_SCRATCHCARD_LEVEL_COUNT = 10
let MAX_SCRATCHCARD_ITEM_COUNT = 3

interface rewardBaseList {
    rewardType: number,
    rewardIndex: number,
    range: number[],
}

export class scratchCardCenter extends PlazeMainInetMsg {
    /**命令ID */
    // cmd = proto.plaza_scratchcard.GS_PLAZA_SCRATCHCARD_MSG
    mScratchcardDataRefreshDay: number;
    mScratchcardOpen: boolean;
    mScratchcardData: { nLevel: number; nRecharge: number; nDrawStatus: number; nTotalCount: number; nDayCount: number; nAwardLevel: number; awardItem: proto.plaza_scratchcard.IScratchCardAwardItem[]; nActiveRecharge: number; nRoundCount: number; };
    mScratchcardInfo: {rewardBaseList: rewardBaseList[]; rewardRange: number[][]; nTotalCount: number; levelItem: proto.common.IScratchCardLevel[];};

    initData() {
        this.initMainID(GS_PLAZA_MSGID.GS_PLAZA_MSGID_SCRATCHCARD);
        this.cleanUserData();

        this.bindEvent({
            eventName: [EVENT_ID.EVENT_PLAZA_ACTOR_VARIABLE,],
            callback: (arg1, arg2) => {
                this.onActorVariable(arg1.dict)
            }
        });
    }

    cleanUserData() {
        this.mScratchcardInfo = {
            rewardBaseList: [],
            rewardRange: [],
            nTotalCount: 0,
            levelItem: [],
        }
        this.mScratchcardData = {
            nLevel: 0,//等级
            nRecharge: 0,//充值金额
            nDrawStatus: 0,//抽奖状态(0未开奖1已开奖未刮奖)
            nTotalCount: 0,//已经抽奖次数
            nDayCount: 0,//每日户抽奖次数
            nAwardLevel: 0,//开奖时vip等级
            awardItem: [],//未开奖就是上次的奖励已开奖就是本次的奖励
            nActiveRecharge: 0,//激活充值金额
            nRoundCount: 0,//轮次
        }
    }

    // initRegister() {
    //     this.bindMsgStructPB(this.cmd.PLAZA_SCRATCHCARD_INFO, proto.plaza_scratchcard.gs_scratch_card_info_s)
    //     this.bindRecvFunc(this.cmd.PLAZA_SCRATCHCARD_INFO, this.PLAZA_SCRATCHCARD_INFO.bind(this))

    //     this.bindMsgStructPB(this.cmd.PLAZA_SCRATCHCARD_DATA, proto.plaza_scratchcard.gs_scratch_card_data_s)
    //     this.bindRecvFunc(this.cmd.PLAZA_SCRATCHCARD_DATA, this.PLAZA_SCRATCHCARD_DATA.bind(this))

    //     this.bindMsgStructPB(this.cmd.PLAZA_SCRATCHCARD_OPEN_RES, proto.plaza_scratchcard.gs_scratch_card_open_res_s)
    //     this.bindRecvFunc(this.cmd.PLAZA_SCRATCHCARD_OPEN_RES, this.PLAZA_SCRATCHCARD_OPEN_RES.bind(this))

    //     this.bindMsgStructPB(this.cmd.PLAZA_SCRATCHCARD_AWARD_RES, proto.plaza_scratchcard.gs_scratch_card_award_res_s)
    //     this.bindRecvFunc(this.cmd.PLAZA_SCRATCHCARD_AWARD_RES, this.PLAZA_SCRATCHCARD_AWARD_RES.bind(this))

    //     this.bindMsgStructPB(this.cmd.PLAZA_SCRATCHCARD_TIPS, proto.plaza_scratchcard.gs_scratch_card_tips_s)
    //     this.bindRecvFunc(this.cmd.PLAZA_SCRATCHCARD_TIPS, this.PLAZA_SCRATCHCARD_TIPS.bind(this))

    //     this.bindMsgStructPB(this.cmd.PLAZA_SCRATCHCARD_OPEN, proto.plaza_scratchcard.gs_scratch_card_open_c);
    //     this.bindMsgStructPB(this.cmd.PLAZA_SCRATCHCARD_AWARD, proto.plaza_scratchcard.gs_scratch_card_award_c);
    // }
    onActorVariable(variable: proto.plaza_actorprop.IActVariable[]) {
        variable.forEach((v) => {
            if (v.prop_id == ACTOR.ACOTR_PROP_SCRATCHCARD_RECHARGE) {
                let active = this.isActive()
                this.mScratchcardData.nRecharge = v.new_value
                app.event.dispatchEvent({ eventName: "ScratchcardRechargeChange", dict: v.new_value })
                if (!active && this.isActive()) {
                    app.event.dispatchEvent({ eventName: "ScratchcardActive", })
                }
                this.updateScratchcardLevel()
            }
        })
    }
    sendScratchcardOpen() {
        fw.print("sendScratchcardOpen ")
        let data = proto.plaza_scratchcard.gs_scratch_card_open_c.create()
        this.sendMessage({
            cmd: this.cmd.PLAZA_SCRATCHCARD_OPEN,
            data: data
        });
    }
    sendScratchcardAward() {
        fw.print("sendScratchcardAward ")
        let data = proto.plaza_scratchcard.gs_scratch_card_award_c.create()
        this.sendMessage({
            cmd: this.cmd.PLAZA_SCRATCHCARD_AWARD,
            data: data
        });
    }
    PLAZA_SCRATCHCARD_INFO(dict: proto.plaza_scratchcard.gs_scratch_card_info_s) {
        fw.print("ScratchCardManager:OnRecv_ScratchcardInfo")
        fw.print(dict)
        //基础奖励配置表
        this.mScratchcardInfo.rewardRange = [
            dict.scratch_card.small_reward.list,
            dict.scratch_card.medium_reward.list,
            dict.scratch_card.large_reward.list,
        ]

        for (let j = 1; j <= 3; j++) {
            for (let i = 0; i <= 1; i++) {
                this.mScratchcardInfo.rewardBaseList.push({
                    rewardType: i,
                    rewardIndex: j,
                    range: this.mScratchcardInfo.rewardRange[j - 1],
                })
            }
        }

        this.mScratchcardInfo.rewardBaseList.push({
            rewardType: RewardType.cattle,
            rewardIndex: 1,
            range: [1000000, 1000000],
        })

        this.mScratchcardInfo.nTotalCount = dict.scratch_card.total_count
        this.mScratchcardInfo.levelItem = dict.scratch_card.level_item

        this.updateScratchcardLevel()
    }
    PLAZA_SCRATCHCARD_DATA(dict: proto.plaza_scratchcard.gs_scratch_card_data_s) {
        fw.print("ScratchCardManager:OnRecv_ScratchcardData")
        fw.print(dict)
        this.mScratchcardData.nLevel = dict.level
        this.mScratchcardData.nRecharge = dict.recharge// vip经验值
        this.mScratchcardData.nDrawStatus = dict.draws_tatus
        this.mScratchcardData.nTotalCount = dict.total_count
        this.mScratchcardData.nDayCount = dict.day_count
        this.mScratchcardData.nAwardLevel = dict.award_level
        this.mScratchcardData.awardItem = dict.award_item
        this.mScratchcardData.nActiveRecharge = dict.active_recharge
        this.mScratchcardData.nRoundCount = dict.round_count
        this.mScratchcardDataRefreshDay = center.user.getDayIndex()
        this.mScratchcardOpen = true
        this.updateScratchcardLevel()
    }
    PLAZA_SCRATCHCARD_OPEN_RES(dict: proto.plaza_scratchcard.gs_scratch_card_open_res_s) {
        fw.print("ScratchCardManager:OnRecv_ScratchcardOpenRes")
        fw.print(dict)
        this.mScratchcardData.nDrawStatus = 1
        this.mScratchcardData.nDayCount = this.mScratchcardData.nDayCount + 1
        this.mScratchcardData.nTotalCount = this.mScratchcardData.nTotalCount + 1
        this.mScratchcardData.nAwardLevel = dict.award_level
        this.mScratchcardData.awardItem = dict.award_item
        app.event.dispatchEvent({ eventName: "ScratchcardOpen", })
    }
    PLAZA_SCRATCHCARD_AWARD_RES(dict: proto.plaza_scratchcard.gs_scratch_card_award_res_s) {
        fw.print("ScratchCardManager:OnRecv_ScratchcardAwardRes")
        fw.print(dict)
        this.mScratchcardData.nDrawStatus = 0
        app.event.dispatchEvent({ eventName: "ScratchcardAward", })
    }
    PLAZA_SCRATCHCARD_TIPS(dict: proto.plaza_scratchcard.gs_scratch_card_tips_s) {
        fw.print("ScratchCardManager:OnRecv_ScratchcardTips")
        fw.print(dict)
        let msg = TipsMsg[dict.tips_id + 1]
        if (msg) {
            app.popup.showToast(msg);
        }
    }
    getScratchCardRewardIndexByAmount(level, amount) {
        let rewardRange = this.mScratchcardInfo.rewardRange
        let index = 1
        for (const i in rewardRange) {
            let v = rewardRange[i]
            if (v[1] * level <= amount && amount <= v[2] * level) {
                index = Number(i)
                break
            }
        }
        return index
    }
    getScratchcardLevelByRecharge(recharge) {
        let levelItem = this.mScratchcardInfo.levelItem
        let level = 0
        for (const i in levelItem) {
            let v = levelItem[i]
            if (recharge >= v.recharge) {
                level = v.level
            } else {
                break
            }
        }
        return level
    }
    getScratchcardNextLevelRechargeByRecharge(recharge) {
        let levelItem = this.mScratchcardInfo.levelItem
        let nextRecharge = 0
        for (const i in levelItem) {
            let v = levelItem[i]
            nextRecharge = v.recharge
            if (recharge < v.recharge) {
                break
            }
        }
        return nextRecharge
    }
    checkRefreshScratchCard() {
        let day = center.user.getDayIndex()
        if (day == this.mScratchcardDataRefreshDay) {
            return
        }
        this.mScratchcardData.nDayCount = 0
        this.mScratchcardDataRefreshDay = day
    }
    updateScratchcardLevel() {
        let recharge = this.mScratchcardData.nRecharge
        let level = this.getScratchcardLevelByRecharge(recharge)
        if (level != this.mScratchcardData.nLevel) {
            this.mScratchcardData.nLevel = level
            app.event.dispatchEvent({
                eventName: "ScratchcardLevelChange",
                dict: level,
            })
        }
    }

    // 激活且有奖励
    canGetScratchcardReward() {
        if (this.isScratchcardOpen() && this.isActive()) {
            if (this.mScratchcardData.nDayCount == 0) {
                return true
            }
            if (this.mScratchcardData.nDrawStatus == 1) {
                return true
            }
        }
        return false
    }
    isScratchcardOpen() {
        return this.mScratchcardOpen
    }
    isActive() {
        return this.mScratchcardData.nRecharge >= this.mScratchcardData.nActiveRecharge
    }
    isFirstRound() {
        return this.mScratchcardData.nRoundCount == 0
    }
    getScratchcardData() {
        return this.mScratchcardData
    }
    getScratchcardInfo() {
        return this.mScratchcardInfo
    }

}