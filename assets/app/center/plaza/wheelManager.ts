import { ACTOR } from "../../config/cmd/ActorCMD";
import { EVENT_ID } from "../../config/EventConfig";
import { GS_PLAZA_MSGID, sint, sint64, slong, stchar, stcharend, uchar, ushort, ushortlen } from "../../config/NetConfig";
import { PlazeMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";
import proto from "../common";

let PLAZA_JACKPOTDRAW_INFO = 0              //抽奖配置					s -> c
let PLAZA_JACKPOTDRAW_DATA = 1              //用户数据					s -> c
let PLAZA_JACKPOTDRAW_JOIN = 2              //参与抽奖					c -> s
let PLAZA_JACKPOTDRAW_JOIN_RES = 3          //抽奖结果					s -> c
let PLAZA_JACKPOTDRAW_TIPS = 4              //提示信息					s -> c

let strTips = [
    /**lang*/"Activity closed",//活动关闭
    /**lang*/"No more attempts",//3次抽完
    /**lang*/"Insufficient recharge for lucky draw",//充值不够，不可抽奖
    /**lang*/"Configuration error",//配置异常
    /**lang*/"Activity expired"//活动过期
]

let GoodsTyp = {
    GOLD: 0,
    BONUS: 1,
    JACKPOT: 2,
}

export class wheelManager extends PlazeMainInetMsg {
    // m_cfg: proto.common.IJackpotDrawItem[];
    // m_userData: proto.plaza_jackpotdraw.Ijackpot_draw_data;
    m_bOpen: boolean;
    m_bDraw: boolean;
    m_threeTime: boolean;
    m_nMinGold: number;
    nJackpotGold: number[];
    m_nRecharge: number[];
    m_nValidTime: number;
    nItemCount: any;
    m_timeOver: any;
    m_isBuy: any;
    GoodsType = GoodsTyp;

    initData() {
        this.initMainID(GS_PLAZA_MSGID.GS_PLAZA_MSGID_JACKPOTDRAW);
        this.cleanUserData()
    }

    cleanUserData() {
        this.m_cfg = null
        this.m_userData = null
        this.m_bOpen = false
        this.m_bDraw = false
        this.m_threeTime = false
        this.m_nMinGold = 0
    }

    // initRegister() {
    //     this.bindMessage({
    //         struct: proto.plaza_jackpotdraw.jackpot_draw_info,
    //         cmd: PLAZA_JACKPOTDRAW_INFO,
    //         callback: this.OnRecv_Info.bind(this)
    //     });

    //     this.bindMessage({
    //         struct: proto.plaza_jackpotdraw.jackpot_draw_data,
    //         cmd: PLAZA_JACKPOTDRAW_DATA,
    //         callback: this.OnRecv_Data.bind(this)
    //     });

    //     this.bindMessage({
    //         struct: proto.plaza_jackpotdraw.jackpot_draw_join,
    //         cmd: PLAZA_JACKPOTDRAW_JOIN,
    //     });

    //     this.bindMessage({
    //         struct: proto.plaza_jackpotdraw.jackpot_draw_join_res,
    //         cmd: PLAZA_JACKPOTDRAW_JOIN_RES,
    //         callback: this.OnRecv_JoinResult.bind(this)
    //     });

    //     this.bindMessage({
    //         struct: proto.plaza_jackpotdraw.jackpot_draw_tips,
    //         cmd: PLAZA_JACKPOTDRAW_TIPS,
    //         callback: this.OnRecv_Tips.bind(this)
    //     });
    // }


    OnRecv_Info(dictTB: proto.plaza_jackpotdraw.Ijackpot_draw_info) {
        fw.print(dictTB, " =======OnRecv_转盘Info======== ")
        this.m_bOpen = (dictTB.common_cfg.state == 1)

        this.m_cfg = []
        dictTB.jackpot_item.forEach((v,i) => {
            let item = {
                gold_num: v.gold_num,
                index: v.index,
                gold_type: v.gold_type || 0,
            }
            this.m_cfg[i+1] = item
        })

        this.nJackpotGold = []
        dictTB.common_cfg.jackpot_gold.list.forEach((v,i)=>{
            this.nJackpotGold[i+1] = v
        })
        
        this.m_nRecharge = []
        dictTB.common_cfg.recharge.list.forEach((v,i)=>{
            this.m_nRecharge[i+1] = v
        })

        this.m_nValidTime = dictTB.common_cfg.valid_time
        this.m_nMinGold = dictTB.common_cfg.min_gold

        let registerTime = center.user.getRegisterTime()
        let overTime = app.func.time() - registerTime
        this.nItemCount = dictTB.jackpot_item.length
        if (this.nItemCount == 0) {
            this.m_bDraw = false
        }
        let restTime = center.jeckpotdraw.getValidTimeInfo() - overTime
        if (restTime > 0) {
            this.setWheelTimeOver(false)
        } else {
            this.setWheelTimeOver(true)
        }

        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_NEW_WHEEL_CONFIG,
        })
        app.event.dispatchEvent({
            eventName: "UpdateActivityBtn",
            data: "NewWheel"
        })
    }

    OnRecv_Data(dictTB: proto.plaza_jackpotdraw.Ijackpot_draw_data) {
        fw.print(dictTB, " =======OnRecv_转盘Data======== ")
        this.m_bDraw = (dictTB.draw_status == 1)
        this.m_threeTime = (dictTB.draw_times == 3)
        this.m_userData = dictTB
        if (dictTB.draw_status == 1 || dictTB.draw_times >= 1) {
            this.setBuyWheelState(true)
        } else {
            this.setBuyWheelState(false)
        }
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_NEW_WHEEL_USERDATA,
            dict: dictTB
        })
    }

    OnRecv_JoinResult(dictTB: proto.plaza_jackpotdraw.Ijackpot_draw_join_res) {
        fw.print(dictTB, " =======OnRecv_转盘JoinResult======== ")

        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_NEW_WHEEL_REWARD,
            dict: dictTB
        })
    }

    OnRecv_Tips(dictTB: proto.plaza_jackpotdraw.jackpot_draw_tips) {
        fw.print(dictTB, " =======OnRecv_转盘Tips======== ")
        app.popup.showToast(strTips[dictTB.tips_id] ?? "")
    }

    // --请求抽奖－此时只拿结果，不得到物品。
    sendJoin() {
        fw.print("sendChouJiang ")
        let data = proto.plaza_jackpotdraw.jackpot_draw_join.create()
        this.sendData(PLAZA_JACKPOTDRAW_JOIN, data)
    }

    setBuyWheelState(isBuy) {
        this.m_isBuy = isBuy
    }

    getBuyWheelState() {
        return this.m_isBuy
    }


    setWheelTimeOver(state) {
        this.m_timeOver = state
    }

    getWheelTimeOver() {
        return this.m_timeOver
    }

    getFinishTime() {
        let ovetime = center.jeckpotdraw.getValidTimeInfo()
        let registerTime = center.user.getRegisterTime()
        let finishTime = registerTime + ovetime
        return finishTime
    }

    isOpen() {
        return this.m_bOpen && app.sdk.isSdkOpen("firstlucky")
    }

    isCanDraw() {
        return this.m_bDraw
    }

    isEnoughTimes() {
        return this.m_userData.draw_times < 6
    }

    getCfg() {
        return this.m_cfg
    }

    getRechargeInfo() {
        return this.m_nRecharge
    }

    getValidTimeInfo() {
        return this.m_nValidTime
    }

    getJackpotGold() {
        return this.nJackpotGold
    }

    getUserData() {
        return this.m_userData
    }

    getRewardByIndex(nIndex) {
        let result: proto.common.IJackpotDrawItem
        for (const v of this.m_cfg) {
            if (v.index == nIndex) {
                result = v
                break
            }
        }
        return result
    }

    checkShowLimit() {
        let nMinGold = this.m_nMinGold
        let myGold = center.user.getActorProp(ACTOR.ACTOR_PROP_GOLD)
        fw.print("wheelManager:checkShowLimit", myGold, nMinGold)
        return myGold < nMinGold
    }

}