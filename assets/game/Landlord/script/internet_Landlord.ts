import { _decorator,Node as ccNode } from 'cc';
const { ccclass } = _decorator;

import { yx } from '../yx_Landlord';
import proto from './../protobuf/Landlord_format';
import { EVENT_ID } from '../../../app/config/EventConfig';
import { GameServerMainInetMsg, MainInetMsg } from '../../../app/framework/network/awBuf/MainInetMsg';
import { GS_GAME_MSGID } from '../../../app/config/NetConfig';

@ccclass('internet_Landlord')
export class internet_Landlord extends GameServerMainInetMsg {
    /**协议相关字段--began------------------------------------ */
    proto = proto.client_proto_ddz
    /**命令ID */
    cmd = this.proto.DDZ_SUB_S_MSG_ID
    ctscmd = this.proto.DDZ_SUB_C_MSG_ID
    mainID = GS_GAME_MSGID.GS_GAME_MSGID_DDZ
    /**房间规则 */
    // gameConfig: proto.game_Landlord.IGameConfig
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
    /**房间基础信息 */
    ddzBaseInfo: proto.client_proto_ddz.IDDZInfo
    /**记牌器数据 */
    cardRecordData: proto.client_proto_ddz.IDDZ_S_UseMemory.recordindex = []
    /**叫分最高值 */
    toppoint: number = 0
    /**是否明牌 */
    bMingpai: boolean[] = [false,false,false]
    /**当局地主座位号 */
    landlordSeat: number = -1
    /**房间名字 */
    roomName: string = ""
    /**房间底分 */
    roomBase: number = -1
    /**上个人出的牌 */
    m_MaxCardInfo={
        cardData : [],
        cardCount : -1,
        cbChairID : -1,
        nType : -1
    }
    
    protected initEvents(): boolean | void {
        this.initMainID( this.mainID);
        // this.initRegister()
        //自己进入桌子
        this.bindEvent({
            eventName: [
                EVENT_ID.EVENT_PLAY_ACTOR_SELFONTABLE,
            ],
            callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam): boolean | void => {
                //刷新自己的座位号
                this.nSelfChairID = gameCenter.user.getSelfChairID();
                console.log("nSelfChairID",this.nSelfChairID)
            },
        });
        this.bindEvent({
            eventName: EVENT_ID.EVENT_TABLE_BASE_INFO,
            callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam): boolean | void => {
                this.roomName = arg1.data.roomName
                this.roomBase = arg1.data.roomBase
            }
        });
    }
     initRegister(): void {
        
        this.bindMessage({
            name: `RepeatedInt32`,
            struct: this.proto.RepeatedInt32,
        });
        this.bindMessage({
            name: `DDZSettle`,
            struct: this.proto.DDZSettle,
        });
        this.bindMessage({
            name: `DDZInfo`,
            struct: this.proto.DDZInfo,
        });
        this.bindMessage({
            cmd: this.ctscmd.DDZ_C_SHOW_CARDS,
            struct: this.proto.DDZ_C_ShowCards,
        });
        this.bindMessage({
            cmd: this.ctscmd.DDZ_C_CALL_POINT,
            struct: this.proto.DDZ_C_CallPoint,
        });
        this.bindMessage({
            cmd: this.ctscmd.DDZ_C_DOUBLE,
            struct: this.proto.DDZ_C_Double,
        });
        this.bindMessage({
            cmd: this.ctscmd.DDZ_C_OUT_CARD,
            struct: this.proto.DDZ_C_OutCard,
        });
        this.bindMessage({
            cmd: this.ctscmd.DDZ_C_PASS_CARD,
            struct: this.proto.DDZ_C_PassCard,
        });
        this.bindMessage({
            cmd: this.ctscmd.DDZ_C_TRUSTEESHIP,
            struct: this.proto.DDZ_C_Trusteeship,
        });
        this.bindMessage({
            cmd: this.ctscmd.DDZ_C_USE_MEMORY,
            struct: this.proto.DDZ_C_UseMomory,
        });
        this.bindMessage({
            cmd: this.ctscmd.DDZ_C_DISMISS,
            struct: this.proto.DDZ_C_Dismiss,
        });
        this.bindMessage({
            cmd: this.cmd.DDZ_S_MSG_USER_ENTER,
            struct: this.proto.DDZ_S_UserEnter,
            callback: this.DDZ_S_MSG_USER_ENTER.bind(this),
            
        });
        this.bindMessage({
            cmd: this.cmd.DDZ_S_MSG_TIPS,
            struct: this.proto.DDZ_S_Tips,
            callback: this.DDZ_S_MSG_TIPS.bind(this),
            
        });
        this.bindMessage({
            cmd: this.cmd.DDZ_S_MSG_SEND_CARD,
            struct: this.proto.DDZ_S_SendCard,
            callback: this.DDZ_S_MSG_SEND_CARD.bind(this),
            
        });
        this.bindMessage({
            cmd: this.cmd.DDZ_S_MSG_SHOW_CARD,
            struct: this.proto.DDZ_S_ShowCard,
            callback: this.DDZ_S_MSG_SHOW_CARD.bind(this),
            
        });
        this.bindMessage({
            cmd: this.cmd.DDZ_S_MSG_CALL_POINT,
            struct: this.proto.DDZ_S_CallPoint,
            callback: this.DDZ_S_MSG_CALL_POINT.bind(this),
            
        });
        this.bindMessage({
            cmd: this.cmd.DDZ_S_MSG_CALL_END,
            struct: this.proto.DDZ_S_CallEnd,
            callback: this.DDZ_S_MSG_CALL_END.bind(this),
            
        });
        this.bindMessage({
            cmd: this.cmd.DDZ_S_MSG_DOUBLE,
            struct: this.proto.DDZ_S_Double,
            callback: this.DDZ_S_MSG_DOUBLE.bind(this),
            
        });
        this.bindMessage({
            cmd: this.cmd.DDZ_S_MSG_OUT_CARD,
            struct: this.proto.DDZ_S_OutCard,
            callback: this.DDZ_S_MSG_OUT_CARD.bind(this),
            
        });
        this.bindMessage({
            cmd: this.cmd.DDZ_S_MSG_PASS_CARD,
            struct: this.proto.DDZ_S_PassCard,
            callback: this.DDZ_S_MSG_PASS_CARD.bind(this),
        });
        this.bindMessage({
            cmd: this.cmd.DDZ_S_MSG_USE_MEMORY,
            struct: this.proto.DDZ_S_UseMemory,
            callback: this.DDZ_S_MSG_USE_MEMORY.bind(this),
        });
        this.bindMessage({
            cmd: this.cmd.DDZ_S_MSG_TRUSTEESHIP,
            struct: this.proto.DDZ_S_Trusteeship,
            callback: this.DDZ_S_MSG_TRUSTEESHIP.bind(this),
        });
        this.bindMessage({
            cmd: this.cmd.DDZ_S_MSG_RECONNECT,
            struct: this.proto.DDZ_S_Reconnect,
            callback: this.DDZ_S_MSG_RECONNECT.bind(this),
        });
        this.bindMessage({
            cmd: this.cmd.DDZ_S_MSG_GAMEEND,
            struct: this.proto.DDZ_S_GameEnd,
            callback: this.DDZ_S_MSG_GAMEEND.bind(this),
        });
        //大厅游戏消息
        // this.setGameRuleData(this.proto.GameRule, this.GameRule.bind(this));
        // this.setDropEndData(this.proto.GameReconnectRoom, this.GameReconnectRoom.bind(this));
        // this.setHalfWayJoinData(this.proto.GameReconnectRoom, this.GameReconnectRoom.bind(this));
        // this.setReplace(this.proto.GameReconnectRoom, this.GameReconnectRoom.bind(this));
    }
    //销毁注册事件
    unBindMsg(){
        this.unbindMsgListener(this.mainID)
    }
    /**玩家是否已经进入 */
    isUserCenter() {
        return !fw.isNull(this.nSelfChairID) && this.nSelfChairID != this.INVALID_CHAIRID;
    }
    DDZ_C_SHOW_CARDS(data: proto.client_proto_ddz.IDDZ_C_ShowCards) {
        this.sendMessage({
            cmd: this.ctscmd.DDZ_C_SHOW_CARDS,
            data: data,
        });
    }
    DDZ_C_CALL_POINT(data: proto.client_proto_ddz.IDDZ_C_CallPoint) {
        this.sendMessage({
            cmd: this.ctscmd.DDZ_C_CALL_POINT,
            data: data,
        });
    }
    DDZ_C_DOUBLE(data: proto.client_proto_ddz.IDDZ_C_Double) {
        this.sendMessage({
            cmd: this.ctscmd.DDZ_C_DOUBLE,
            data: data,
        });
    }
    DDZ_C_OUT_CARD(data: proto.client_proto_ddz.IDDZ_C_OutCard) {
        //判断飞机和三带一互转
        if(data.cardtype == yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards){
            data.cardtype = yx.config.OutCardType.Triplet_Attached_Card
        }
        if(data.cardtype == yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Pairs){
            data.cardtype = yx.config.OutCardType.Triplet_Attached_Pair
        }

        this.sendMessage({
            cmd: this.ctscmd.DDZ_C_OUT_CARD,
            data: data,
        });
    }
    DDZ_C_PASS_CARD(data: proto.client_proto_ddz.IDDZ_C_PassCard) {
        this.sendMessage({
            cmd: this.ctscmd.DDZ_C_PASS_CARD,
            data: data,
        });
    }
    DDZ_C_TRUSTEESHIP(data: proto.client_proto_ddz.IDDZ_C_Trusteeship) {
        this.sendMessage({
            cmd: this.ctscmd.DDZ_C_TRUSTEESHIP,
            data: data,
        });
    }
    DDZ_C_USE_MEMORY(data: proto.client_proto_ddz.IDDZ_C_UseMomory) {
        this.sendMessage({
            cmd: this.ctscmd.DDZ_C_USE_MEMORY,
            data: data,
        });
    }
    DDZ_C_DISMISS(data: proto.client_proto_ddz.IDDZ_C_Dismiss) {
        this.sendMessage({
            cmd: this.ctscmd.DDZ_C_DISMISS,
            data: data,
        });
    }

    DDZ_S_MSG_USER_ENTER(data: proto.client_proto_ddz.IDDZ_S_UserEnter) {
        this.ddzBaseInfo = data.gameInfo
    }
    DDZ_S_MSG_TIPS(data: proto.client_proto_ddz.IDDZ_S_Tips) {
        switch (data.type) {
            case proto.client_proto_ddz.DDZ_TIPS.DDZ_TIPS_START: {
                    this.cleanLocalData()
                    break;
                }
            case proto.client_proto_ddz.DDZ_TIPS.DDZ_TIPS_SHOW_START: {
                    this.nGameState = yx.config.GameState.SHOW;
                    break;
                }
            case proto.client_proto_ddz.DDZ_TIPS.DDZ_TIPS_CALL_START: {
                    this.nGameState = yx.config.GameState.CALLPOINT;
                    break;
                }
            case proto.client_proto_ddz.DDZ_TIPS.DDZ_TIPS_RESTART: {
                    this.nGameState = yx.config.GameState.SENDCARD;
                    break;
                }
            case proto.client_proto_ddz.DDZ_TIPS.DDZ_TIPS_DOUBLE_START: {
                    this.nGameState = yx.config.GameState.DOUBLE;
                    break;
                }
            case proto.client_proto_ddz.DDZ_TIPS.DDZ_TIPS_OUT_START: {
                    this.nGameState = yx.config.GameState.PLAY;
                    if(data.bFirst){
                        this.m_MaxCardInfo.cardData = []
                        this.m_MaxCardInfo.cardCount = -1
                        this.m_MaxCardInfo.cbChairID = -1
                        this.m_MaxCardInfo.nType = -1
                    }
                    break;
                }
            
            default:
               
                break;
        }
        
    }
    DDZ_S_MSG_SEND_CARD(data: proto.client_proto_ddz.IDDZ_S_SendCard) {
        //调整游戏状态
        this.nGameState = yx.config.GameState.SENDCARD;

        //自动打开记牌器
        if(app.file.getBooleanForKey(`Use_cardRecorder`, false, { all: false })){
            this.DDZ_C_USE_MEMORY({
                buse:true
            })
        } 
    }
    DDZ_S_MSG_SHOW_CARD(data: proto.client_proto_ddz.IDDZ_S_ShowCard) {
        this.nGameState = yx.config.GameState.SHOW;
        this.bMingpai[data.showchair] = true
    }
    DDZ_S_MSG_CALL_POINT(data: proto.client_proto_ddz.IDDZ_S_CallPoint) {
        this.nGameState = yx.config.GameState.CALLPOINT;
        this.toppoint = data.toppoint
    }
    DDZ_S_MSG_CALL_END(data: proto.client_proto_ddz.IDDZ_S_CallEnd) {
        this.nGameState = yx.config.GameState.CALLPOINT;
        this.landlordSeat = data.bankerchair
    }
    DDZ_S_MSG_DOUBLE(data: proto.client_proto_ddz.IDDZ_S_Double) {
        this.nGameState = yx.config.GameState.DOUBLE;
    }
    DDZ_S_MSG_OUT_CARD(data: proto.client_proto_ddz.IDDZ_S_OutCard) {
        //判断飞机和三带一互转
        data = yx.func.turnSequenceByCardNum(data)

        this.nGameState = yx.config.GameState.PLAY;
        this.m_MaxCardInfo.cardData = data.outcards
        this.m_MaxCardInfo.cardCount = data.outcards.length
        this.m_MaxCardInfo.cbChairID = data.outchair
        this.m_MaxCardInfo.nType = data.cardtype
    }
    DDZ_S_MSG_PASS_CARD(data: proto.client_proto_ddz.IDDZ_S_PassCard) {
        this.nGameState = yx.config.GameState.PLAY;
    }
    DDZ_S_MSG_USE_MEMORY(data: proto.client_proto_ddz.IDDZ_S_UseMemory) {
        this.cardRecordData = data.recordindex
    }
    DDZ_S_MSG_TRUSTEESHIP(data: proto.client_proto_ddz.IDDZ_S_Trusteeship) {
        
    }
    DDZ_S_MSG_RECONNECT(data: proto.client_proto_ddz.IDDZ_S_Reconnect) {
        this.nGameState = data.gamestate;
        this.cleanLocalData()
        this.ddzBaseInfo = data.gameInfo
        app.event.dispatchEvent({
            eventName: `GameReconnectRoom`,
            data: data,
        });
        if(this.nGameState == yx.config.GameState.FREE){
            return
        }
        if(this.nGameState == yx.config.GameState.SENDCARD){
            return
        }

        if(this.nGameState >= yx.config.GameState.SHOW){
            this.bMingpai = data.bshow
        }

        if(this.nGameState >= yx.config.GameState.DOUBLE){
            this.landlordSeat = data.bankerchair
        }

        if(data.usememory == 1){
            this.cardRecordData = data.recordindex
        }
        
        if(this.nGameState == yx.config.GameState.DOUBLE){
            this.toppoint = data.toppoint
        }
        if(this.nGameState == yx.config.GameState.PLAY){
            if(data.turncards.length > 0){
                this.m_MaxCardInfo.cardData = data.turncards[data.turnwinner].data
                this.m_MaxCardInfo.cardCount = data.turncards[data.turnwinner].data.length
                this.m_MaxCardInfo.cbChairID = data.turnwinner
                this.m_MaxCardInfo.nType = yx.main.logic.GetCardType(data.turncards[data.turnwinner].data,data.turncards[data.turnwinner].data.length)
            }
        }
    }
    DDZ_S_MSG_GAMEEND(data: proto.client_proto_ddz.IDDZ_S_GameEnd) {
        this.nGameState = yx.config.GameState.SETTLEMENT;
        
    }

    isSelfLandlord():boolean {
        let isLandlord = false
        if(this.landlordSeat != -1){
            isLandlord = this.landlordSeat == this.nSelfChairID
        }
        return isLandlord
    }

    //初始化游戏数据
    cleanLocalData() {
        this.m_MaxCardInfo.cardData = []
        this.m_MaxCardInfo.cardCount = -1
        this.m_MaxCardInfo.cbChairID = -1
        this.m_MaxCardInfo.nType = -1
        this.cardRecordData = []
        this.toppoint = 0
        this.bMingpai= [false,false,false]
        this.landlordSeat = -1
    }
    
    /**销毁 */
    onViewDestroy() {
        
        this.unBindMsg()
        super.onViewDestroy();
    }

    //---------------OLD CODE ----------------//
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
