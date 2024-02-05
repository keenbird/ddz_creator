import { ACTOR, INVAL_CHAIRID, INVAL_TABLEID, INVAL_USERID, TABLESTATE_FREE, TABLESTATE_PLAY ,PROTO_ACTOR} from "../../config/cmd/ActorCMD";
import { EVENT_ID } from "../../config/EventConfig";
import { httpConfig } from "../../config/HttpConfig";
import { BYTE, GS_GAME_MSGID, GS_PLAZA_MSGID, sint, sint64, slong, stchar, uchar, uint, uint64, ulong, ushort } from "../../config/NetConfig";
import { GameServerMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";
import proto from "../common";

let ROOMGROUP_GOLD = "0"	//金币场
let ROOMGROUP_MATCH = "1"	//比赛场
let ROOMGROUP_PRIVATE = "2"	//私人场
let ROOMGROUP_DIAMOND = "3"	//钻石场
let ROOMGROUP_TWO_DDZ = "4"    //二人斗地主
let ROOMGROUP_BIGAWARD_MATCH = "5"    //大奖赛

let D_GameVersion = 11
export class GameRoomCenter extends GameServerMainInetMsg {
    cmd = proto.client_proto.ROOM_LIST_SUB_MSG_ID;
    declare m_RoomInfo: GameRoomInfo;
    declare m_RoomQuickRecharge: RoomQuickRecharge;
    // declare m_MagicFaceVec: proto.game_room.IMagicInfo[];
    declare nJackpotNum: number;
    declare m_ActorTableID: Map<number, number>;
    /**roomInfo的EnterRule类型 */
    RoomRuleEnter = RoomRuleEnter
    // 桌子信息
    declare table: GameRoomTable[];
    declare tableRobot: GameRoomRobotTable;
    m_jackpotDataConfig: Map<number, { time: number, data: JackpotData[] }>;
    bOnline: boolean;
    exitFun:Function; //退出回调
    dataFun:Function; //请求数据回调
    gameType: number = 0; //游戏类型
    roomType: number = 0; //房间类型

    initData() {
        this.m_RoomInfo = new GameRoomInfo();
        this.m_RoomQuickRecharge = new RoomQuickRecharge();
        this.m_ActorTableID = new Map();
        this.m_MagicFaceVec = []
        //最近一次彩池获取星系
        this.nJackpotNum = 0

        this.table = [];
        this.tableRobot = null;

        this.bOnline = false;

        this.m_jackpotDataConfig = new Map();
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
        // app.event.bindEvent({
        //     eventName: EVENT_ID.EVENT_PLAY_ACTOR_DESTORY,
        //     callback: (data) => {
        //         this.OnUserDestory(data.dict)
        //     }
        // });
        // app.event.bindEvent({
        //     eventName: EVENT_ID.EVENT_PLAY_ACTOR_VARIABLE,
        //     callback: (data) => {
        //         let varTB = data.dict
        //         this.OnUserPropVariable(varTB.actor, varTB.btPropID, varTB.nOldValue, varTB.nNewValue)
        //     }
        // });
        // app.event.bindEvent({
        //     eventName: EVENT_ID.EVENT_PLAY_ROBOT_ACTOR_PUBLIC,
        //     callback: (data) => {
        //         this.OnUserRobotCreate(data.dict);
        //     }
        // });
        // app.event.bindEvent({
        //     eventName: EVENT_ID.EVENT_PLAY_ROBOT_ACTOR_DESTORY,
        //     callback: (data) => {
        //         this.OnUserRobotDestory(data.dict);
        //     }
        // });
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
    //桌子状态变化
    OnRecv_RoomTableState(dict: proto.game_room.Itable_state_s) {
        // dump(dict, "OnRecv_RoomTableState")
        let uTableID = dict.table_id;
        let btState = dict.state;
        if (uTableID < this.m_RoomInfo.nMaxTableCount) {
            this.table[uTableID].tableState = btState;
            if (this.getMyTableID() == uTableID) {
                // 游戏中
                if (btState == TABLESTATE_PLAY) {
                    // 空闲
                    // this.m_pGameSink.OnGameStart()
                } else if (btState == TABLESTATE_FREE) {
                    // this.m_pGameSink.OnGameEnd()
                }
            }
        }
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAYROOM_CHANGESTATE,
            dict: uTableID
        })
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

    //奖池变动
    OnRecv_LotteryData(data: proto.game_room.Ilottery_data_s) {
        this.nJackpotNum = data.gold;
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_GLOBALLATTERY_UPDATE,
            data: data,
        });
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

    //提示降场
    OnRecv_TipsDownRoom(data: proto.game_room.Itips_down_room_s) {

    }

    //比赛不充值结算
    OnRecv_MatchSettle(data: proto.game_room.Iquit_match_ret_s) {

    }

    /**服务器强制解散桌子 */
    OnRecv_TableDisband(data: proto.game_room.Itable_disband_s) {

    }

    //房间太拥挤，请稍后再试
    OnRecv_TableDFull(data: proto.game_room.Itable_full_s) {
        app.popup.showToast({ text: "The current number of players is full, please try again later" })
        app.popup.closeLoading()
    }

    //百人排行榜返回
    OnRecv_GAME_ROOM_C_BAIREN_RANK_RET(data: proto.game_room.Ibairen_rank_s) {
        data.info.forEach((v: any) => {
            v.actor = gameCenter.user.getPlayerInfoByChairID(v.chair_id);
        });

        let useData: any = {};
        useData.playerInfo = data.info;
        useData.nPageNum = data.page_num;
        app.event.dispatchEvent({
            eventName: "GAME_ROOM_C_BAIREN_RANK_RET",
            data: useData
        });
    }

    //请求搓桌回复
    OnRecv_JoinQueueRet(dict: proto.game_room.Ijoin_queue_s) {
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_GAME_ROOM_C_JOIN_QUEUE_RET,
            data: dict
        });
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

    /**上桌 */
    sendOnTable() {
        let sData = proto.game_room.on_table_c.create();
        sData.table_id = -1;
        sData.chair_id = -1;
        return this.sendData(this.cmd.GAME_ROOM_C_ONTABLE, sData);
    }

    /**请求比赛结算 */
    sendRequestMatchSettle() {
        let sData = proto.game_room.quit_match_c.create();
        return this.sendData(this.cmd.GAME_ROOM_S_QUITDDZMATCH, sData);
    }

    /**玩家处于游戏状态 */
    bPlaying(nUserID?: number) {
        let actor = nUserID ? gameCenter.user.getActorByDBIDEx(nUserID) : gameCenter.user.getActor();
        return actor && actor.tableID != -1;
    }

    // /**退出房间（非游戏状态下发两次退出房间，可能导致Socket被断开） */
    // sendOutRoom() {
    //     if (this.bOnline) {
    //         let sData = proto.game_room.out_room_c.create();
    //         return this.sendData(this.cmd.GAME_ROOM_C_OUTROOM, sData);
    //     }
    //     return true;
    // }

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
    //百人排行榜，大厅功能开关调整
    send_GAME_ROOM_C_BAIREN_RANK_REQ(data: any) {
        let sData = proto.game_room.bairen_rank_c.create();
        sData.page_num = data.nPageNum;
        sData.count = data.nCount ?? 14;
        return this.sendData(this.cmd.GAME_ROOM_C_BAIREN_RANK_REQ, sData);
    }
    //玩家需要回来状态，暂时用于 teenpatti
    sendBackGame() {
        let sData = proto.game_room.actor_im_back_c.create();
        this.sendData(this.cmd.GAME_ROOM_C_ACTOR_IM_BACK, sData);
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
    /**
     * 机器人创建
     * @param pActor 
     */
    OnUserRobotCreate(pActor) {
        let nChairID = pActor.chairID
        if (nChairID != INVAL_CHAIRID) {
            let nActorDBID = pActor[PROTO_ACTOR.UAT_UID]
            this.tableRobot.sitdown(nChairID, nActorDBID);
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
                    if (pActor[ACTOR.ACTOR_PROP_GAME_STATE] == ACTOR.ACTOR_STATE_HAND) {
                        app.event.dispatchEvent({
                            eventName: EVENT_ID.EVENT_PLAY_ACTOR_RAISEHANDS,
                            dict: {
                                pActor: pActor,
                                nChairID: nChairID,
                            }
                        })
                    }
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

    // 玩家被销毁
    OnUserDestory(pActor) {
        let nTableID = pActor.tableID
        let nChairID = pActor.chairID
        if (nTableID != INVAL_TABLEID) {
            let numnTableID = (nTableID)
            let numnChairID = (nChairID)

            if (numnTableID >= 0 && numnTableID < (this.m_RoomInfo.nMaxTableCount) && numnChairID >= 0 && numnChairID < (this.m_RoomInfo.nMaxChairCount)) {
                let nActorDBID = pActor[PROTO_ACTOR.UAT_UID]
                this.m_ActorTableID.delete(nActorDBID)
                if (this.table[nTableID].getActorDbid(nChairID) == nActorDBID) {
                    this.table[nTableID].standup(nChairID);
                    if (nTableID == this.getMyTableID()) {
                        app.event.dispatchEvent({
                            eventName: EVENT_ID.EVENT_PLAY_ACTOR_OUTTABLE,
                            dict: {
                                nTableID: pActor,
                                nChairID: nChairID,
                            }
                        })
                    }
                    app.event.dispatchEvent({
                        eventName: EVENT_ID.EVENT_PLAY_TALBEREF,
                        dict: {
                            nTableID: nTableID,
                        }
                    })
                }
            }
        }
    }

    OnUserRobotDestory(pActor) {
        let nChairID = pActor.chairID
        let nActorDBID = pActor[PROTO_ACTOR.UAT_UID]
        if (this.tableRobot.getActorDbid(nChairID) == nActorDBID) {
            this.tableRobot.standup(nChairID);
        }
    }

    //玩家属性改变
    OnUserPropVariable(pActor, propid, nOldValue, nValue) {
        //位置变化
        if (propid == ACTOR.ACTOR_PROP_GAME_CHAIR) {
            //游戏状态变化
            this.OutOldTable(pActor);
            if (gameCenter.user.isMe(pActor)) {
                this.OnMeCreate(pActor);
            } else {
                this.OnUserCreate(pActor);
            }
        } else if (propid == ACTOR.ACTOR_PROP_GAME_STATE) {
            let nTableID = pActor.tableID;
            let nChairID = pActor.chairID;
            if (nValue == ACTOR.ACTOR_STATE_HAND) {
                if (nTableID == this.getMyTableID() && nChairID != INVAL_CHAIRID) {
                    app.event.dispatchEvent({
                        eventName: EVENT_ID.EVENT_PLAY_ACTOR_RAISEHANDS,
                        dict: {
                            pActor: pActor,
                            nChairID: nChairID,
                        }
                    });
                }
            } else if (nValue == ACTOR.ACTOR_STATE_DROP) {
                if (nTableID == this.getMyTableID() && nChairID != INVAL_CHAIRID) {
                    app.event.dispatchEvent({
                        eventName: EVENT_ID.EVENT_PLAY_ACTOR_DROP,
                        dict: {
                            pActor: pActor,
                            nChairID: nChairID,
                        }
                    });
                }
            } else if (nOldValue == ACTOR.ACTOR_STATE_DROP && nValue == ACTOR.ACTOR_STATE_GAME) {
                if (nTableID == this.getMyTableID() && nChairID != INVAL_CHAIRID) {
                    app.event.dispatchEvent({
                        eventName: EVENT_ID.EVENT_PLAY_ACTOR_DROPEND,
                        dict: {
                            pActor: pActor,
                            nChairID: nChairID,
                        }
                    });
                }
            }
        }
    }

    //从老的位置弹起
    OutOldTable(pActor) {
        let tableid = -1
        let nActorDBID = pActor[PROTO_ACTOR.UAT_UID]

        if (gameCenter.user.isMe(pActor)) {
            if (this.m_ActorTableID.has(nActorDBID)) {
                tableid = this.m_ActorTableID.get(nActorDBID)
                this.m_ActorTableID.delete(nActorDBID)
                let OldChairID = INVAL_CHAIRID
                this.table[tableid].getActorDbids().forEach((v, nChairID) => {
                    if (v != nActorDBID) {
                        let pOtherActor = gameCenter.user.getActorByDBIDEx(nActorDBID)
                        if (pOtherActor) {
                            app.event.dispatchEvent({
                                eventName: EVENT_ID.EVENT_PLAY_ACTOR_OUTTABLE,
                                dict: {
                                    pActor: pOtherActor,
                                    nChairID: nChairID,
                                }
                            })
                        }
                    } else {
                        OldChairID = nChairID
                    }
                })

                if (OldChairID != INVAL_CHAIRID) {
                    app.event.dispatchEvent({
                        eventName: EVENT_ID.EVENT_PLAY_ACTOR_OUTTABLE,
                        dict: {
                            pActor: pActor,
                            nChairID: OldChairID,
                        }
                    })
                    this.table[tableid].standup(OldChairID);
                }
            }
            else
                if (this.m_ActorTableID.has(nActorDBID)) {
                    tableid = this.m_ActorTableID.get(nActorDBID);
                    this.m_ActorTableID.delete(nActorDBID);
                    let charid = 0
                    for (let charid = 0; charid < this.m_RoomInfo.nMaxChairCount; charid++) {
                        if (this.table[tableid].getActorDbid(charid) == nActorDBID) {
                            //如果跟自己同桌则退出这个用户
                            if (this.getMyTableID() == tableid) {
                                app.event.dispatchEvent({
                                    eventName: EVENT_ID.EVENT_PLAY_ACTOR_OUTTABLE,
                                    dict: {
                                        pActor: pActor,
                                        nChairID: charid,
                                    }
                                })
                            }
                            this.table[tableid].standup(charid);
                            break
                        }
                    }
                }
        }

        if (tableid != -1) {
            app.event.dispatchEvent({
                eventName: EVENT_ID.EVENT_PLAY_TALBEREF,
                dict: {
                    nTableID: tableid,
                }
            })
        }
    }

    getRoomInfo() {
        return this.m_RoomInfo
    }

    getRoomKindID() {
        return this.m_RoomInfo.kindId;
    }

    getActorCount(uTableID) {
        if (uTableID < this.m_RoomInfo.nMaxTableCount) {
            return this.table[uTableID].count + this.tableRobot.count;
        }
        return 0;
    }
    /**
     * 获取桌子数据
     */
    getTable(tableID) {
        return this.table[tableID]
    }

    getRobotTable() {
        return this.tableRobot
    }
    /**
     * 获得桌子用户
     * @param tableID 
     * @returns 
     */
    getTableDbids(tableID) {
        return [...this.table[tableID].getActorDbids(),...this.tableRobot.getActorDbids()]
    }


    /**刷新奖池 */
    refreshJackpot(ikindId?:number) {
        let kindId = ikindId ?? this.getRoomKindID();
        let time = app.func.time();
        if (!this.m_jackpotDataConfig.has(kindId)) {
            this.m_jackpotDataConfig.set(kindId, {
                time: 0,
                data: null,
            });
        }
        let jackpotData = this.m_jackpotDataConfig.get(kindId);
        //存储时间 不超过20分钟 不在去服务器拉取新数据 因为服务器20秒刷新一次
        if (jackpotData.time + 20 >= time) {
            return false;
        }
        jackpotData.time = time;
        app.http.post({
            url: httpConfig.path_pay + "Hall/minigamePrize",
            params: {
                room_id: kindId,
                timestamp: time,
            },
            callback: (bSuccess: boolean, response: any) => {
                if (bSuccess) {
                    if (response.status == 1 && response.data) {
                        jackpotData.data = response.data;
                        app.event.dispatchEvent({
                            eventName: EVENT_ID.EVENT_JACKPOT_REFRESH
                        });
                    } else {
                        jackpotData.time = 0;
                    }
                } else {
                    jackpotData.time = 0;
                }
            }
        });
        return true;
    }
    /**获得奖池数据 */
    getJackpotData(ikindId?:number): JackpotData[] {
        return this.m_jackpotDataConfig.get(ikindId ?? this.getRoomKindID())?.data;
    }

    /**请求记录 */
    requsetRoomWinGoldLog(kind_id?: number) {
        let time = Date.parse(new Date().toString());
        let url = httpConfig.path_pay + "OtherApi/bairenlog";
        let params = {
            room_id: kind_id ?? this.getRoomKindID(),
            timestamp: time,
        };
        app.http.post({
            url: url,
            params: params,
            callback: (successed, result) => {
                fw.print(result);
                if (successed && result && result.status == 1 && result.data) {
                    (<any>this).bigWinnerData = result.data;
                    app.event.dispatchEvent({
                        eventName: EVENT_ID.EVENT_ROOM_WIN_GOLD_LOG,
                        dict: result.data,
                    });
                }
            }
        });
    }
    /**获取记录 */
    getRoomWinGoldLog(): BigWinnerData[] | null {
        return (<any>this).bigWinnerData;
    }
    /**获得房间详细信息 */
    getRoomInfoDetailed() {
        return center.roomList.getRoomInfo(this.getRoomKindID());
    }
    /**获得继续玩牌限制 */
    getContinuePlayLimit() {
        return center.roomList.getEnterRoomLimit(this.getRoomKindID());
    }
}

/**roomInfo的EnterRule类型 */
enum RoomRuleEnter {
    /**金币 */
    ROOM_RULE_ENTER_GOLD = 1,
    /**积分 */
    ROOM_RULE_ENTER_SCORE = 2,
    /**VIP经验值 */
    ROOM_RULE_ENTER_VIPEXP = 3,
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

class GameRoomRobotTable extends GameRoomTable{
    offsetChairId: number;
    constructor(offsetChairId,maxChairCount) {
        super(maxChairCount);
        this.offsetChairId = offsetChairId;
    }

    sitdown(chair_id, actor_dbid) {
        super.sitdown(chair_id-this.offsetChairId, actor_dbid);
    }

    standup(chair_id) {
        super.standup(chair_id-this.offsetChairId);
    }

    getActorDbid(chair_id){
        return super.getActorDbid(chair_id-this.offsetChairId);
    }

    allocateChairID() {
        if(this.count == this._chair.length) return -1;
        let ret = this._chair.indexOf(INVAL_USERID);
        if( ret != -1 ) {
            ret += this.offsetChairId;
        }
        return ret
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
        /**奖池 */
        interface SlotPlayOtherJackpotAnimParam {
            /**玩家ID */
            user_id: number
            /**玩家头像 */
            face: string
            /**玩家名称 */
            name: string
            /**奖池分数 */
            gold: number
            /**奖池icon等级 */
            count: number
        }
        interface BigWinnerData {
            /**名称 */
            nickname: string
            /**玩家头像 */
            facemd5: string
            /**分数 */
            jscore: string
            /**赢金 */
            wscore: string
            /**时间 */
            ctime: string
        }
        interface JackpotData {
            /**玩家ID */
            user_id: string
            /**玩家名称 */
            user_name: string
            /**玩家头像 */
            user_face: string
            /**爆奖时间戳 */
            time: string
            /**下注 */
            jetton_score: string
            /**玩家总下注（游戏分多区域和单区域下注） */
            total_jetton_score: string
            /**赢金 */
            win_score: string
            /**总赢金（爆奖 + 其它赢金） */
            total_win_score: string
            /**爆奖牌型（每个游戏的含义不一样，需要找服务器确定） */
            card_type: string
            /**爆奖时的数据（每个游戏的含义不一样，需要找服务器确定） */
            card_data: string
            /**同时有多少人一起瓜分奖池（每个游戏的含义不一样，需要找服务器确定） */
            user_count: string
            /**服务器数据库自增id（前端不用管） */
            id: string
            /**房间id */
            room_id: string
            /**服务器牌局唯一id（前端不用管） */
            game_inning_id: string
        }
    }
}
