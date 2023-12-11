
import { ACTOR } from "../../config/cmd/ActorCMD";
import { EVENT_ID } from "../../config/EventConfig";
import { GS_PLAZA_MSGID, sint64, slong, uchar } from "../../config/NetConfig";
import { PlazeMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";
import proto from "../common";

let GoodsTyp = {
    GOLD: 0,
    BONUS: 1,
    JACKPOT: 2,
}

let strTips = [
    /**lang*/"activity close",
    /**lang*/"activity finish",
    /**lang*/"recharge not enough",
    /**lang*/"config error"
]

export class choujiangManager extends PlazeMainInetMsg {
    cmd = proto.plaza_luckydraw.GS_PLAZA_LUCKYDRAW_MSG
    m_cfg: proto.plaza_luckydraw.ILuckyDrawItem[];
    m_userData: any;
    m_bOpen: boolean;
    m_bDraw: boolean;
    m_nMinGold: number;
    GoodsType = GoodsTyp;
    initData() {
        this.initMainID(GS_PLAZA_MSGID.GS_PLAZA_MSGID_LUCKYDRAW);
        this.cleanUserData();
    }

    cleanUserData() {
        this.m_cfg = null
        this.m_userData = null
        this.m_bOpen = false
        this.m_bDraw = false
        this.m_nMinGold = 0
    }

    initRegister() {
        this.bindMessage({
            struct: proto.plaza_luckydraw.lucky_draw_info,
            cmd: this.cmd.PLAZA_LUCKYDRAW_INFO,
            callback: this.OnRecv_Info.bind(this)
        });

        this.bindMessage({
            struct: proto.plaza_luckydraw.lucky_draw_data,
            cmd: this.cmd.PLAZA_LUCKYDRAW_DATA,
            callback: this.OnRecv_Data.bind(this)
        });

        this.bindMessage({
            struct: proto.plaza_luckydraw.lucky_draw_join,
            cmd: this.cmd.PLAZA_LUCKYDRAW_JOIN,
        });

        this.bindMessage({
            struct: proto.plaza_luckydraw.lucky_draw_join_res,
            cmd: this.cmd.PLAZA_LUCKYDRAW_JOIN_RES,
            callback: this.OnRecv_JoinResult.bind(this)
        });

        this.bindMessage({
            struct: proto.plaza_luckydraw.lucky_draw_tips,
            cmd: this.cmd.PLAZA_LUCKYDRAW_TIPS,
            callback: this.OnRecv_Tips.bind(this)
        });

    }
    OnRecv_Info(dictTB: proto.plaza_luckydraw.lucky_draw_info) {
        fw.print(dictTB, " =======OnRecv_Info======== ")

        this.m_bOpen = (dictTB.state == 1)
        this.m_cfg = []
        dictTB.lucky_item.forEach((v,i) => {
            let item = {
                index: v.index,
                recharge: v.recharge,
                gold_type: v.gold_type,
                gold: v.gold,
            }
            this.m_cfg[i+1] = item
        })
        this.m_nMinGold = Number(dictTB.min_gold)
    }
    OnRecv_Data(dictTB: proto.plaza_luckydraw.lucky_draw_data) {
        fw.print(dictTB, " =======OnRecv_Data======== ")

        this.m_bDraw = (dictTB.draw_status == 1)
        this.m_userData = {
            nDrawTimes: dictTB.draw_times,
            nDrawStatus: dictTB.draw_status,
        }
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_WHEEL_USERDATA,
            dict: this.m_userData
        })
        app.event.dispatchEvent({
            eventName: "UpdateActivityBtn",
            data: "Wheel"
        })
    }
    OnRecv_JoinResult(dictTB: proto.plaza_luckydraw.lucky_draw_join_res) {
        fw.print(dictTB, " =======OnRecv_JoinResult======== ")

        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_WHEEL_REWARD,
            dict: {
                nIndex: dictTB.index,
            }
        })
    }

    OnRecv_Tips(dictTB: proto.plaza_luckydraw.lucky_draw_tips) {
        fw.print(dictTB, " =======OnRecv_Tips======== ")
        app.popup.showToast(fw.language.get(strTips[dictTB.tips_id] ?? ""))
    }

    sendJoin() {
        fw.print("sendChouJiang ")
        let data = proto.plaza_luckydraw.lucky_draw_join.create()
        this.sendData(this.cmd.PLAZA_LUCKYDRAW_JOIN, data)
    }

    isOpen() {
        return this.m_bOpen && app.sdk.isSdkOpen("luckyspin")
    }

    isCanDraw() {
        return this.m_bDraw
    }
    isEnoughTimes() {
        return this.m_userData.nDrawTimes < 6
    }
    getCfg() {
        return this.m_cfg
    }
    getUserData() {
        return this.m_userData
    }
    getRewardByIndex(nIndex) {
        let result: any
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
        return myGold < nMinGold
    }

}