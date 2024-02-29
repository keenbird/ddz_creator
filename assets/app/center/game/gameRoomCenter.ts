import { ACTOR, INVAL_CHAIRID, INVAL_TABLEID, INVAL_USERID, TABLESTATE_FREE, TABLESTATE_PLAY ,PROTO_ACTOR} from "../../config/cmd/ActorCMD";
import { EVENT_ID } from "../../config/EventConfig";
import { httpConfig } from "../../config/HttpConfig";
import {  GS_PLAZA_MSGID } from "../../config/NetConfig";
import { GameServerMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";
import proto from "../common";

export class GameRoomCenter extends GameServerMainInetMsg {
    cmd = proto.client_proto.ROOM_LIST_SUB_MSG_ID;
    declare m_RoomInfo: GameRoomInfo;
    declare m_RoomQuickRecharge: RoomQuickRecharge;
    // declare m_MagicFaceVec: proto.game_room.IMagicInfo[];
    declare nJackpotNum: number;
    declare m_ActorTableID: Map<number, number>;
    // 桌子信息
    declare table: GameRoomTable[];
    bOnline: boolean;
    exitFun:Function; //退出回调
    dataFun:Function; //请求数据回调
    gameType: number = 0; //游戏类型
    roomType: number = 0; //房间类型
    m_MagicFaceVec: any[];

    initData() {
        this.m_RoomInfo = new GameRoomInfo();
        this.m_RoomQuickRecharge = new RoomQuickRecharge();
        this.m_ActorTableID = new Map();
        this.m_MagicFaceVec = []
        //最近一次彩池获取星系
        this.nJackpotNum = 0

        this.table = [];

        this.bOnline = false;

    }

    setRoomOnline(bflag: boolean) {
        this.bOnline = bflag
    }

    clean() {
        this.initData();
    }

    initEvents() {
        this.initMainID(GS_PLAZA_MSGID.GS_GAME_MSGID_ROOM);
        app.event.bindEvent({
            eventName: EVENT_ID.EVENT_PLAY_ACTOR_PUBLIC,
            callback: (data) => {
                this.OnUserCreate(data.dict)
            }
        });
        app.event.bindEvent({
            eventName: EVENT_ID.EVENT_PLAY_ACTOR_PRIVATE,
            callback: (data) => {
                this.OnMeCreate(data.dict)
            }
        });
       
    }

    initRegister() {
        // this.bindMsgStructPB(this.cmd.RLSMI_FIRST_LAYOUT_RESP, proto.client_proto.room_info_s);
        // this.bindRecvFunc(this.cmd.RLSMI_FIRST_LAYOUT_RESP, this.OnRecv_RoomInfo.bind(this));
        this.bindMsgStructPB(this.cmd.RLSMI_SECOND_LIST_RESP, proto.client_proto.SecondRoomListResp);
        this.bindRecvFunc(this.cmd.RLSMI_SECOND_LIST_RESP, this.OnRecv_RoomInfo.bind(this));
        this.bindMsgStructPB(this.cmd.RLSMI_BEFORE_MATCH_RESP, proto.client_proto.BeforeMatchTableResp);
        this.bindRecvFunc(this.cmd.RLSMI_BEFORE_MATCH_RESP, this.OnRecv_BEFORE_MATCH_RESP.bind(this));
        this.bindMsgStructPB(this.cmd.RLSMI_ENTER_MATCH_RESP, proto.client_proto.EnterMatchTableResp);
        this.bindRecvFunc(this.cmd.RLSMI_ENTER_MATCH_RESP, this.OnRecv_ENTER_MATCH_RESP.bind(this));
        this.bindMsgStructPB(this.cmd.RLSMI_EXIT_MATCH_RESP, proto.client_proto.ExitMatchTableResp);
        this.bindRecvFunc(this.cmd.RLSMI_EXIT_MATCH_RESP, this.OnRecv_EXIT_MATCH_RESP.bind(this));
        this.bindMsgStructPB(this.cmd.RLSMI_ENTER_ROOM_RESP, proto.client_proto.EnterRoomResp);
        this.bindRecvFunc(this.cmd.RLSMI_ENTER_ROOM_RESP, this.OnRecv_ENTER_ROOM_RESP.bind(this));
        this.bindMsgStructPB(this.cmd.RLSMI_MATCH_INFO_PUSH, proto.client_proto.MatchedTableInfoPush);
        this.bindRecvFunc(this.cmd.RLSMI_MATCH_INFO_PUSH, this.OnRecv_MATCH_INFO_PUSH.bind(this));
        this.bindMsgStructPB(this.cmd.RLSMI_COMEBACK_INFO_PUSH, proto.client_proto.ComebackRoomInfoPush);
        this.bindRecvFunc(this.cmd.RLSMI_COMEBACK_INFO_PUSH, this.OnRecv_COMEBACK_INFO_PUSH.bind(this));
       

        // ////////-send struct//////////
        this.bindMsgStructPB(this.cmd.RLSMI_FIRST_LAYOUT_REQ, proto.client_proto.LoginReq);
        this.bindMsgStructPB(this.cmd.RLSMI_SECOND_LIST_REQ, proto.client_proto.SecondRoomListReq);
        this.bindMsgStructPB(this.cmd.RLSMI_BEFORE_MATCH_REQ, proto.client_proto.BeforeMatchTableReq);
        this.bindMsgStructPB(this.cmd.RLSMI_ENTER_MATCH_REQ, proto.client_proto.EnterMatchTableReq);
        this.bindMsgStructPB(this.cmd.RLSMI_EXIT_MATCH_REQ, proto.client_proto.ExitMatchTableReq);
        this.bindMsgStructPB(this.cmd.RLSMI_ENTER_ROOM_REQ, proto.client_proto.EnterRoomReq);
        // ////////-send struct//////////    
    }

    //获得自己的桌子ID
    getMyTableID() {
        // 待处理，等 roomUserCenter
        let actor = gameCenter.user.getActor()
        if (actor) {
            return actor.tableID
        }
        return INVAL_TABLEID
    }

    OnRecv_RoomInfo(dict: proto.client_proto.ISecondRoomListResp) {
        // dump(dict, " ======= OnRecv_RoomInfo ======= ")
        this.m_RoomInfo.update(dict);
        // 房间快冲
        // this.m_RoomQuickRecharge.update(dict)
        if(dict.typeList.length == 0){
            this.dataFun = null
            app.popup.showToast("网络有误，请联系客服")
            return
        }
        app.event.dispatchEvent({
            eventName: `ReceiveRoomInfo`,
        });
        if(this.dataFun){
            this.dataFun()
            this.dataFun = null
        }
    }
   
    // 返回配桌之前的判断
    OnRecv_BEFORE_MATCH_RESP(dict: proto.client_proto.IBeforeMatchTableResp) {
        fw.print("roomManager:OnRecv_BEFORE_MATCH_RESP")
        if(dict.result == 1){
            this.gameType = dict.gameType
            this.roomType = dict.roomType
            app.gameManager.gotoGame(`Landlord`, dict.roomId);
        }else{
            app.popup.showToast("进入房间失败");
        }
    }

    // 获取游戏类型(斗地主/麻将)
    getGameType() {
        return this.gameType
    }

    // 获取房间类型(经典/连炸/比赛/好友)
    getRoomType() {
        return this.roomType
    }

    //返回配桌
    OnRecv_ENTER_MATCH_RESP(dict: proto.client_proto.IEnterMatchTableResp) {
        
        app.popup.showToast({
            nUpdateIntervalTime:dict.waitSec,
            text:"正在匹配牌友...",
            updateCallback:()=>{
                this.sendEnterMatchREQ(dict.roomId)
            }
        })

        gameCenter.user.clean();

        let pActor = center.user.getActor()
        pActor.tableID = 1
        pActor.chairID = 0
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAY_ACTOR_MATCH,
            data: pActor
        });

        let data= {
            roomName : dict.roomName,
            roomBase : dict.roomBase,
        }
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_TABLE_BASE_INFO,
            data: data
        });
    }

    /**退出配桌 */
    OnRecv_EXIT_MATCH_RESP(dict: proto.client_proto.IExitMatchTableResp) {
        if(dict.result > 0){
            if(dict.result == 1 ){
                app.gameManager.setServerId(0)
                app.gameManager.setRoomId(0)
                this.exitFun ?.()
            }else if(dict.result == 2){
                //服务器让我们继续申请匹配，但是不在这里响应
            }
        }else{
            app.popup.showTip({
                text: "正在游戏中,请不要退出",
                btnList: [
                    {
                        styleId: 3,
                        callback: null,
                    },
                ],
                closeCallback: null,
            });
        }
    }

    /**返回进入房间(仅失败或异常时返回) */ 
    OnRecv_ENTER_ROOM_RESP(data: proto.client_proto.IEnterRoomResp) {
        // app.event.dispatchEvent({
        //     eventName: EVENT_ID.EVENT_PLAY_CHAT_MAGICFACE,
        //     data: data
        // });
        if(data.result != 1){
            app.gameManager.setServerId(0)
            this.sendEnterMatchREQ(data.roomId)
        }
    }

  
    //推送重回房间信息
    OnRecv_COMEBACK_INFO_PUSH(data: proto.client_proto.IComebackRoomInfoPush) {
        // app.event.dispatchEvent({
        //     eventName: `GAME_ROOM_S_LOTTERYPLAY`,
        //     data: data,
        // });
        app.gameManager.setServerId(data.svrId)
        this.gameType = data.gameType
        this.roomType = data.roomType
        app.gameManager.gotoGame(`Landlord`, data.roomId,true);
    }

    /**推送配桌消息 */
    OnRecv_MATCH_INFO_PUSH(data: proto.client_proto.IMatchedTableInfoPush) {
        app.gameManager.setServerId(data.svrId)
        app.popup.closeAllToast()
        this.sendEnterRoomREQ(data.roomId)
    }

    

    //请求房间二级列表配置
    sendRLSMI_SECOND_LIST_REQ(gameType: number,callback:Function) {
        this.dataFun = callback
        let sData = proto.client_proto.SecondRoomListReq.create();
        sData.gameType = gameType;
        return this.sendData(this.cmd.RLSMI_SECOND_LIST_REQ, sData);
    }

    //请求判断配桌，成功则加载资源
    sendBEFORE_MATCH_REQ(room_id: number) {
        let sData = proto.client_proto.BeforeMatchTableReq.create();
        sData.roomId = room_id;
        return this.sendData(this.cmd.RLSMI_BEFORE_MATCH_REQ, sData);
    }

    //请求配桌
    sendEnterMatchREQ(room_id: number) {
        // this.OnRecv_ENTER_MATCH_RESP({
        //     waitSec : 15,
        //     roomId : 1
        // })
        let sData = proto.client_proto.EnterMatchTableReq.create();
        sData.roomId = room_id;
        return this.sendData(this.cmd.RLSMI_ENTER_MATCH_REQ, sData);
    }

    /**退出桌 */
    sendOutRoom(room_id: number,exitFun:Function) {
        this.exitFun = exitFun
        let sData = proto.client_proto.ExitMatchTableReq.create();
        sData.roomId = room_id;
        return this.sendData(this.cmd.RLSMI_EXIT_MATCH_REQ, sData);
    }

    /**请求进桌 */
    sendEnterRoomREQ(room_id: number) {
        let sData = proto.client_proto.EnterRoomReq.create();
        sData.roomId = room_id;
        return this.sendData(this.cmd.RLSMI_ENTER_ROOM_REQ, sData);
    }

   
    /**玩家处于游戏状态 */
    bPlaying(nUserID?: number) {
        let actor = nUserID ? gameCenter.user.getActorByDBIDEx(nUserID) : gameCenter.user.getActor();
        return actor && actor.tableID != -1;
    }

   

    /**使用魔法表情 */
    sendUseMagic(nActorDBID: number, nMagicID: number, nCount?: number) {
        if (gameCenter.user.getActor() && this.getMyTableID() != INVAL_TABLEID) {
            if (this.getMagicFace(nMagicID)) {
                let sData = proto.game_room.use_magic_cs.create();
                sData.send_user_id = center.user.getUserID();
                sData.recv_user_id = nActorDBID;
                sData.magic_id = nMagicID;
                sData.combo = nCount ?? 1;
                return this.sendData(this.cmd.GAME_ROOM_CS_USEMAGICFACE, sData);
            }
        }
        return false
    }
   

    /**获得魔法表情配置 */
    getMagicFace(nMagicID: number) {
        let value: proto.game_room.IMagicInfo;
        app.func.positiveTraversal(this.m_MagicFaceVec, (element) => {
            if (element.id == nMagicID) {
                value = element;
                return true;
            }
        });
        return value;
    }

    //进房，记录房间数据
    OnUserCreate(pActor) {
        let nChairID = pActor.chairID
        let nTableID = pActor.tableID
        if (nTableID != INVAL_TABLEID && nChairID != INVAL_CHAIRID) {
            let numnTableID = nTableID
            let numnChairID = nChairID
            // if (numnTableID >= 0 && numnTableID < (this.m_RoomInfo.nMaxTableCount) && numnChairID >= 0 && numnChairID < (this.m_RoomInfo.nMaxChairCount)) {
                let nActorDBID = pActor[PROTO_ACTOR.UAT_UID] 
                this.m_ActorTableID.set(nActorDBID, nTableID)
                // 非旁观者和GM才能上桌
                // if (pActor[ACTOR.ACTOR_PROP_GAME_STATE] != ACTOR.ACTOR_STATE_WATCH && pActor[ACTOR.ACTOR_PROP_GAME_STATE] != ACTOR.ACTOR_STATE_GMLOOK) {
                    // this.table[nTableID].sitdown(nChairID, nActorDBID);
                    // 和玩家同个桌子 才推送消息
                    if (nTableID == this.getMyTableID()) {
                        app.event.dispatchEvent({
                            eventName: EVENT_ID.EVENT_PLAY_ACTOR_ONTABLE,
                            dict: {
                                pActor: pActor,
                                nChairID: nChairID,
                            }
                        })
                        // if (pActor[ACTOR.ACTOR_PROP_GAME_STATE] == ACTOR.ACTOR_STATE_HAND) {
                        //     app.event.dispatchEvent({
                        //         eventName: EVENT_ID.EVENT_PLAY_ACTOR_RAISEHANDS,
                        //         dict: {
                        //             pActor: pActor,
                        //             nChairID: nChairID,
                        //         }
                        //     })
                        // }
                    }
                // }
                // app.event.dispatchEvent({
                //     eventName: EVENT_ID.EVENT_PLAY_TALBEREF,
                //     dict: {
                //         nTableID: nTableID,
                //     }
                // })
            // }
        }
    }

    

    //自己被创建
    OnMeCreate(pActor) {
        let nTableID = pActor.tableID
        let nChairID = pActor.chairID
        if (nTableID != INVAL_TABLEID && nChairID != INVAL_CHAIRID) {
            let numnTableID = (nTableID)
            let numnChairID = (nChairID)
            // if (numnTableID >= 0 && numnTableID < (this.m_RoomInfo.nMaxTableCount) && numnChairID >= 0 && numnChairID < (this.m_RoomInfo.nMaxChairCount)) {
                let nActorDBID = pActor[PROTO_ACTOR.UAT_UID]
                this.m_ActorTableID.set(nActorDBID, nTableID)
                // 非旁观者和GM才能上桌
                // if (pActor[ACTOR.ACTOR_PROP_GAME_STATE] != ACTOR.ACTOR_STATE_WATCH && pActor[ACTOR.ACTOR_PROP_GAME_STATE] != ACTOR.ACTOR_STATE_GMLOOK) {
                    // this.table[nTableID].sitdown(nChairID, nActorDBID);
                    app.event.dispatchEvent({
                        eventName: EVENT_ID.EVENT_PLAY_ACTOR_SELFONTABLE,
                        dict: {
                            pActor: pActor,
                            nChairID: nChairID,
                        }
                    })
                    
                    gameCenter.user.isMe(pActor)
                // }
                app.event.dispatchEvent({
                    eventName: EVENT_ID.EVENT_PLAY_TALBEREF,
                    dict: {
                        nTableID: nTableID,
                    }
                })
            // }
        }
    }



    getRoomInfo() {
        return this.m_RoomInfo
    }

   

}


enum table_state {
    idle = -1,// 未初始化
    TABLESTATE_FREE = 0, //空闲
    TABLESTATE_PLAY = 1, //游戏中
}
class GameRoomTable {
    // 桌子状态
    tableState: table_state;
    // 椅子数组 存的是用户id
    protected _chair: number[];
    count: number;

    constructor(maxChairCount) {
        this._chair = new Array(maxChairCount).fill(INVAL_USERID);
        this.tableState = table_state.idle;
        this.count = 0;
    }

    sitdown(chair_id, actor_dbid) {
        if (chair_id >= 0 && chair_id < this._chair.length) {
            this._chair[chair_id] = actor_dbid;
            this.count++;
        }
    }

    standup(chair_id) {
        if (chair_id >= 0 && chair_id < this._chair.length) {
            this._chair[chair_id] = INVAL_USERID;
            this.count--;
        }
    }

    getActorDbid(chair_id) {
        return this._chair[chair_id] ?? INVAL_USERID;
    }

    getActorDbids() {
        return this._chair;
    }
}


class GameRoomInfo {
    defaultGroupType: number;
    gameType: number;
    typeList: proto.client_proto.IOneRoomTypeInfo[]

    update(dict: proto.client_proto.ISecondRoomListResp) {

        this.gameType = dict.gameType;
        this.defaultGroupType = dict.defaultRoomType;
        this.typeList = dict.typeList
    }
}
//快充配置
class RoomQuickRecharge {
    nRID: number;
    nQuickGoodsID: number;
    nQuickGoodsNum: number;
    nQuickNeedRMB: number;
    szQuickTitle: string;
    nQuickGiveGoodsNum: number[];
    nQuickGiveGoodsID: number[];
    kindId: number;
    groupType: number;
    gameType: number;
    update(dict: proto.game_room.Iroom_info_s) {
        this.nRID = dict.quick_rid;
        let config = center.roomList.getQuickRecharge(this.nRID);
        if (config) {
            this.nQuickGoodsID = config.nQuickGoodsID;
            this.nQuickGoodsNum = config.nQuickGoodsNum;
            this.nQuickNeedRMB = config.nQuickNeedRMB;
            this.szQuickTitle = config.szQuickTitle;
            this.nQuickGiveGoodsID = config.nQuickGiveGoodsID;
            this.nQuickGiveGoodsNum = config.nQuickGiveGoodsNum;
        } else {
            this.nQuickGoodsID = 0;
            this.nQuickGoodsNum = 0;
            this.nQuickNeedRMB = 0;
            this.szQuickTitle = "";
            this.nQuickGiveGoodsID = [];
            this.nQuickGiveGoodsNum = [];
        }
        this.kindId = dict.kind_id;
        this.groupType = dict.group_type;
        this.gameType = dict.game_type;
    }
}


/**类型声明调整 */
declare global {
    namespace globalThis {
        /**魔法表情 */
        type type_Iuse_magic_cs = proto.game_room.Iuse_magic_cs  
    }
}
