import { _decorator,ccNode } from 'cc';
const { ccclass } = _decorator;

import { yx } from '../yx_Landlord';
import proto from './../protobuf/Landlord_format';
import { internet_GameBase } from '../../GameBase/internet/internet_GameBase';
import { EVENT_ID } from '../../../app/config/EventConfig';

@ccclass('internet_Landlord')
export class internet_Landlord extends internet_GameBase {
    /**协议相关字段--began------------------------------------ */
    proto = proto.game_Landlord
    /**命令ID */
    cmd = this.proto.CMD
    /**房间规则 */
    gameConfig: proto.game_Landlord.IGameConfig
    /**协议相关字段--end------------------------------------ */
    INVALID_CHAIRID: number = -1
    /**自己在服务器上的位置 */
    nSelfChairID: number = this.INVALID_CHAIRID
    /**最大人数 */
    nMaxPlayerCount: number = 3
    /**游戏状态 */
    nGameState: number = yx.config.GameState.FREE
    /**当前状态下的倒计时 */
    nLeftTime: number = 0
    /**玩家状态 */
    playerState: { [nChairID: number]: number } = {}
    /**玩家当局下注金额 */
    nJettonScore: number = 0
    
    protected initEvents(): boolean | void {
        //自己进入桌子
        this.bindEvent({
            eventName: [
                EVENT_ID.EVENT_PLAY_ACTOR_SELFONTABLE,
            ],
            callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam): boolean | void => {
                //刷新自己的座位号
                this.nSelfChairID = gameCenter.user.getSelfChairID();
            },
        });
    }
    protected initRegister(): void {
        this.bindMessage({
            name: `GameConfig`,
            struct: this.proto.GameConfig,
        });
        this.bindMessage({
            name: `GameRule`,
            struct: this.proto.GameRule,
        });
        this.bindMessage({
            name: `GameReconnectRoom`,
            struct: this.proto.GameReconnectRoom,
        });
        this.bindMessage({
            cmd: this.cmd.MSG_BET_C,
            struct: this.proto.MSG_BET_C,
        });
        this.bindMessage({
            cmd: this.cmd.MSG_BACK_C,
            struct: this.proto.MSG_BACK_C,
        });
        this.bindMessage({
            cmd: this.cmd.MSG_SYNCDATA_C,
            struct: this.proto.MSG_SYNCDATA_C,
        });
        this.bindMessage({
            cmd: this.cmd.MSG_GAMESCENE_S,
            struct: this.proto.MSG_GAMESCENE_S,
            callback: this.MSG_GAMESCENE_S.bind(this),
            bQueue: true,
        });
        this.bindMessage({
            cmd: this.cmd.MSG_FREE_S,
            struct: this.proto.MSG_FREE_S,
            callback: this.MSG_FREE_S.bind(this),
            bQueue: true,
        });
        this.bindMessage({
            cmd: this.cmd.MSG_START_S,
            struct: this.proto.MSG_START_S,
            callback: this.MSG_START_S.bind(this),
            bQueue: true,
        });
        this.bindMessage({
            cmd: this.cmd.MSG_BET_PART2_S,
            struct: this.proto.MSG_BET_PART2_S,
            callback: this.MSG_BET_PART2_S.bind(this),
            bQueue: true,
        });
        this.bindMessage({
            cmd: this.cmd.MSG_BET_S,
            struct: this.proto.MSG_BET_S,
            callback: this.MSG_BET_S.bind(this),
            bQueue: true,
        });
        this.bindMessage({
            cmd: this.cmd.MSG_END_S,
            struct: this.proto.MSG_END_S,
            callback: this.MSG_END_S.bind(this),
            bQueue: true,
        });
        this.bindMessage({
            cmd: this.cmd.MSG_TIPS_S,
            struct: this.proto.MSG_TIPS_S,
            callback: this.MSG_TIPS_S.bind(this),
        });
        this.bindMessage({
            cmd: this.cmd.MSG_RECONNECT_S,
            struct: this.proto.MSG_RECONNECT_S,
            callback: this.MSG_RECONNECT_S.bind(this),
        });
        this.bindMessage({
            cmd: this.cmd.MSG_PLAYER_STATUS_S,
            struct: this.proto.MSG_PLAYER_STATUS_S,
            callback: this.MSG_PLAYER_STATUS_S.bind(this),
        });
        //大厅游戏消息
        this.setGameRuleData(this.proto.GameRule, this.GameRule.bind(this));
        this.setDropEndData(this.proto.GameReconnectRoom, this.GameReconnectRoom.bind(this));
        this.setHalfWayJoinData(this.proto.GameReconnectRoom, this.GameReconnectRoom.bind(this));
        this.setReplace(this.proto.GameReconnectRoom, this.GameReconnectRoom.bind(this));
    }
    /**玩家是否已经进入 */
    isUserCenter() {
        return !fw.isNull(this.nSelfChairID) && this.nSelfChairID != this.INVALID_CHAIRID;
    }
    MSG_BET_C(data: proto.game_Landlord.IMSG_BET_C) {
        this.sendMessage({
            cmd: this.cmd.MSG_BET_C,
            data: data,
        });
    }
    MSG_BACK_C(data: proto.game_Landlord.IMSG_BACK_C) {
        this.sendMessage({
            cmd: this.cmd.MSG_BACK_C,
            data: data,
        });
    }
    MSG_SYNCDATA_C(data: proto.game_Landlord.IMSG_SYNCDATA_C) {
        this.sendMessage({
            cmd: this.cmd.MSG_SYNCDATA_C,
            data: data,
        });
    }
    MSG_GAMESCENE_S(data: proto.game_Landlord.IMSG_GAMESCENE_S) {
        //剩余时间
        this.nLeftTime = data.nLeaveTime;
    }
    MSG_FREE_S(data: proto.game_Landlord.IMSG_FREE_S) {
        //调整游戏状态
        this.nGameState = yx.config.GameState.FREE;
        //刷新房间配置
        this.gameConfig = data.gameConfig;
        //剩余时间
        this.nLeftTime = data.nLeaveTime;
    }
    MSG_START_S(data: proto.game_Landlord.IMSG_START_S) {
        //调整游戏状态
        this.nGameState = yx.config.GameState.BET1;
        //剩余时间
        this.nLeftTime = data.nLeaveTime;
        //重置玩家状态
        for (let k in this.playerState) {
            this.playerState[k] = yx.config.PlayerStates.Free;
        }
        //当局下注金额
        this.nJettonScore = 0;
    }
    MSG_BET_PART2_S(data: proto.game_Landlord.IMSG_BET_PART2_S) {
        //调整游戏状态
        this.nGameState = yx.config.GameState.BET2;
        //剩余时间
        this.nLeftTime = data.nLeaveTime;
    }
    MSG_BET_S(data: proto.game_Landlord.IMSG_BET_S) {
        if (data.nChairID == yx.internet.nSelfChairID) {
            this.nJettonScore += data.nJettonScore;
        }
    }
    MSG_END_S(data: proto.game_Landlord.IMSG_END_S) {
        //调整游戏状态
        this.nGameState = yx.config.GameState.END;
        //剩余时间
        this.nLeftTime = data.nLeaveTime;
        //当前玩家下注
        this.nJettonScore = 0;
    }
    MSG_TIPS_S(data: proto.game_Landlord.IMSG_TIPS_S) {
        //TODO
    }
    MSG_RECONNECT_S(data: proto.game_Landlord.IMSG_RECONNECT_S) {
        return this.doReconnect(data);
    }
    MSG_PLAYER_STATUS_S(data: proto.game_Landlord.IMSG_PLAYER_STATUS_S) {
        if (this.playerState[data.nChairID] != yx.config.PlayerStates.TimeOut) {
            this.playerState[data.nChairID] = data.ucCurState;
        }
    }
    GameRule(data: proto.game_Landlord.IGameRule) {
        //刷新房间配置
        this.gameConfig = data;
        //事件通知
        app.event.dispatchEvent({
            eventName: `GameRule`,
            data: data,
        });
        return true;
    }
    GameReconnectRoom(data: proto.game_Landlord.IGameReconnectRoom) {
        return this.doReconnect(data);
    }
    doReconnect(data: proto.game_Landlord.IMSG_RECONNECT_S) {
        //清理消息列表
        this.clearMessageList();
        //剩余时间
        this.nLeftTime = data.nLeaveTime;
        //刷新游戏状态
        this.nGameState = data.nGameState;
        //刷新自己的座位号
        this.nSelfChairID = gameCenter.user.getSelfChairID();
        //玩家状态
        data.btSitUserState.forEach((nState: number, nChairID: number) => {
            this.playerState[nChairID] = nState;
        });
        //当前玩家下注
        this.nJettonScore = 0;
        for (let i = 0; i < 2; ++i) {
            this.nJettonScore += data.nSitUserJettonScore[yx.internet.nSelfChairID * 2 + i];
        }
        //事件通知
        app.event.dispatchEvent({
            eventName: `GameReconnectRoom`,
            data: data,
        });
        return true;
    }
}

declare global {
    namespace globalThis {
        type type_internet_Landlord = internet_Landlord
    }
}
