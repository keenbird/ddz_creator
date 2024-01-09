
export const LUCKY3PT_MAX_USER_COUNT = 1000
export const LUCKY3PT_CARD_COUNT = 3
export const LUCKY3PT_TREND_COUNT = 50
export const LUCKY3PT_CARD_TYPE_COUNT = 6
export const LUCKY3PT_CARD_CHIP_COUNT = 5
export const LUCKY3PT_AREA_COUNT = 6
export const MD5_LEN = 33
export const DES_LEN = 128
export const NAME_LEN_DB_32 = 32
export const MINIGAME_CHIP_COUNT = 5
export const MAX_RECORDS_NUM = 27

import { EVENT_ID } from "../../config/EventConfig"
import { GS_PLAZA_MSGID, sfloat, sint, sint64, slong, stchar, uchar, uint64, ulong, ushort } from "../../config/NetConfig";
import { PlazeMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";
import proto from "../common"
export class lucky3PattiCenter extends PlazeMainInetMsg {
    // cmd = proto.plaza_luckypattigame.GS_PLAZA_LUCKYPATTIGAME_MSG
    declare private m_isShow: boolean;
    initData() {
        this.initMainID(GS_PLAZA_MSGID.GS_PLAZA_MSGID_LUCKYPATTIGAME);
        this.cleanUserData();
    }

    cleanUserData() {
        this.m_isShow = true;
    }

    initRegisterTest() {

        this.bindMessage({
            struct: proto.plaza_luckypattigame.lucky_pattigame_info_s,
            cmd: this.cmd.PLAZA_LUCKYPATTIGAME_INFO,
            callback: this.OnRecv_GameInfo.bind(this)
        });
        this.bindMessage({
            struct: proto.plaza_luckypattigame.lucky_pattigame_login_c,
            cmd: this.cmd.PLAZA_LUCKYPATTIGAME_LOGIN,
        });
        this.bindMessage({
            struct: proto.plaza_luckypattigame.lucky_pattigame_login_out_c,
            cmd: this.cmd.PLAZA_LUCKYPATTIGAME_LOGIN_OUT,
        });
        this.bindMessage({
            struct: proto.plaza_luckypattigame.lucky_pattigame_data_s,
            cmd: this.cmd.PLAZA_LUCKYPATTIGAME_DATA,
            callback: this.OnRecv_GameData.bind(this)
        });
        this.bindMessage({
            struct: proto.plaza_luckypattigame.lucky_pattigame_tips_s,
            cmd: this.cmd.PLAZA_LUCKYPATTIGAME_TIPS,
            callback: this.OnRecv_GameTips.bind(this)
        });
        this.bindMessage({
            struct: proto.plaza_luckypattigame.lucky_pattigame_start_s,
            cmd: this.cmd.PLAZA_LUCKYPATTIGAME_START,
            callback: this.OnRecv_GameStart.bind(this)
        });
        this.bindMessage({
            struct: proto.plaza_luckypattigame.lucky_pattigame_end_s,
            cmd: this.cmd.PLAZA_LUCKYPATTIGAME_END,
            callback: this.OnRecv_GameEnd.bind(this)
        });
        this.bindMessage({
            struct: proto.plaza_luckypattigame.lucky_pattigame_place_jetton_c,
            cmd: this.cmd.PLAZA_LUCKYPATTIGAME_PLACE_JETTON,
        });
        this.bindMessage({
            struct: proto.plaza_luckypattigame.lucky_pattigame_place_jetton_ret_s,
            cmd: this.cmd.PLAZA_LUCKYPATTIGAME_PLACE_JETTON_RET,
            callback: this.OnRecv_GameJettonRet.bind(this)
        });
        this.bindMessage({
            struct: proto.plaza_luckypattigame.lucky_pattigame_sync_data_s,
            cmd: this.cmd.PLAZA_LUCKYPATTIGAME_SYNCDATA,
            callback: this.OnRecv_GameSyncData.bind(this)
        });
        this.bindMessage({
            struct: proto.plaza_luckypattigame.lucky_pattigame_rebet_c,
            cmd: this.cmd.PLAZA_LUCKYPATTIGAME_REBET,
        });
        this.bindMessage({
            struct: proto.plaza_luckypattigame.lucky_pattigame_rebet_ret_s,
            cmd: this.cmd.PLAZA_LUCKYPATTIGAME_REBET_RET,
            callback: this.OnRecv_GameRebetRet.bind(this)
        });
    }


    OnRecv_ServerRet(dict): void {
        //TODO
    }

    // 配置s=>c
    OnRecv_GameInfo(dict: proto.plaza_luckypattigame.Ilucky_pattigame_info_s): void {
        this.m_isShow = (dict.state == 1);
    }
    // 数据s=>c
    OnRecv_GameData(dict: proto.plaza_luckypattigame.Ilucky_pattigame_data_s): void {
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_LUCKY3PATTI_DATA,
            dict: dict
        })
    }
    // 提示信息s=>c
    OnRecv_GameTips(dict: proto.plaza_luckypattigame.Ilucky_pattigame_tips_s): void {
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_LUCKY3PATTI_TIPS,
            dict: dict
        })
    }
    // 游戏开始s=>c
    OnRecv_GameStart(dict: proto.plaza_luckypattigame.Ilucky_pattigame_start_s): void {
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_LUCKY3PATTI_START,
            dict: dict
        })
    }
    // 游戏结束s=>c
    OnRecv_GameEnd(dict: proto.plaza_luckypattigame.Ilucky_pattigame_end_s): void {
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_LUCKY3PATTI_END,
            dict: dict
        })
    }
    // 下注返回s=>c
    OnRecv_GameJettonRet(dict: proto.plaza_luckypattigame.Ilucky_pattigame_place_jetton_ret_s): void {
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_LUCKY3PATTI_JETTON_RET,
            dict: dict
        })
    }
    // 批量下注返回s=>c	
    OnRecv_GameRebetRet(dict: proto.plaza_luckypattigame.Ilucky_pattigame_rebet_ret_s): void {
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_LUCKY3PATTI_REBET,
            dict: dict
        })
    }
    // 定时同步数据s=>c
    OnRecv_GameSyncData(dict: proto.plaza_luckypattigame.Ilucky_pattigame_sync_data_s): void {
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_LUCKY3PATTI_SYNCDATA,
            dict: dict
        })
    }


    //PLAZA_LUCKYPATTIGAME_LOGIN 发送登录 c->s 
    sendGameLogin() {
        let data = proto.plaza_luckypattigame.lucky_pattigame_login_c.create();
        let bsuccess = this.sendData(this.cmd.PLAZA_LUCKYPATTIGAME_LOGIN, data)
    }
    //PLAZA_LUCKYPATTIGAME_LOGIN_OUT 发送登出 c->s 
    sendGameLoginOut() {
        let data = proto.plaza_luckypattigame.lucky_pattigame_login_out_c.create();
        let bsuccess = this.sendData(this.cmd.PLAZA_LUCKYPATTIGAME_LOGIN_OUT, data)
    }
    //PLAZA_LUCKYPATTIGAME_PLACE_JETTON 发送下注 c->s 
    sendGameJetton(area_, score_) {
        let data = proto.plaza_luckypattigame.lucky_pattigame_place_jetton_c.create()
        data.jetton_area = area_
        data.jetton_score = score_
        let bsuccess = this.sendData(this.cmd.PLAZA_LUCKYPATTIGAME_PLACE_JETTON, data)
    }
    //PLAZA_LUCKYPATTIGAME_REBET 批量下注 c->s 
    sendGameRebet(score_) {
        let data = proto.plaza_luckypattigame.lucky_pattigame_rebet_c.create()
        data.jetton_score = score_
        let bsuccess = this.sendData(this.cmd.PLAZA_LUCKYPATTIGAME_REBET, data)
    }

    getIsShow() {
        return this.m_isShow;
    }

}