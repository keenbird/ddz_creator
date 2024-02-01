import { ACTOR, INVAL_USERID, PROTO_ACTOR } from "../../config/cmd/ActorCMD";
import { EVENT_ID } from "../../config/EventConfig";
import { GS_GAME_MSGID, sint64, slong, stchar, uchar, ulong } from "../../config/NetConfig";
import { EventHelp } from "../../framework/manager/FWEventManager";
import { GameServerMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";
import proto from "../common";


export class GameUserCenter extends GameServerMainInetMsg {
    event = new EventHelp()
    cmd = proto.client_proto.GAME_COMMON_SUB_ID;
    m_ActorMap:Map<number,any> = new Map();
    initData() {
        this.m_ActorMap.clear();
    }

    initEvents() {
        this.initMainID(GS_GAME_MSGID.GS_GAME_MSGID_ACTOR);

        app.event.bindEvent({
            eventName: EVENT_ID.EVENT_PLAY_ACTOR_MATCH,
            callback: (data) => {
                this.OnRecv_ActorPrivateInfo(data.data)
            }
        });
    }

    clean() {
        let nActorDBID = center.login.getUserDBID();
        let myActor = this.getActorByDBIDEx(nActorDBID);
        this.initData()
        //未登录出现socket断开 会为空报错
        if (nActorDBID) {
            this.m_ActorMap.set(nActorDBID,myActor)
        }
    }

    initRegister() {
        this.bindMsgStructPB(this.cmd.GCSI_GAME_SCENE_PUSH, proto.client_proto.CommonGameScenePush);
        this.bindRecvFunc(this.cmd.GCSI_GAME_SCENE_PUSH, this.OnRecv_ActorPublicInfo.bind(this));
    //     this.bindMsgStructPB(this.cmd.GAME_ACTOR_PUBLIC, proto.game_actor.public_info_s);
    //     this.bindRecvFunc(this.cmd.GAME_ACTOR_PUBLIC, { callback: this.OnRecv_ActorPublicInfo.bind(this), printLog: false });
        this.bindMsgStructPB(this.cmd.GCSI_USER_ATTRI_CHANGE_PUSH, proto.client_proto.GameUserAttriChangePush);
        this.bindRecvFunc(this.cmd.GCSI_USER_ATTRI_CHANGE_PUSH, { callback: this.OnRecv_ActorVariableInfo.bind(this), printLog: false });
    //     this.bindMsgStructPB(this.cmd.GAME_ACTOR_DESTORY, proto.game_actor.destory_s);
    //     this.bindRecvFunc(this.cmd.GAME_ACTOR_DESTORY, { callback: this.OnRecv_ActorDestory.bind(this), printLog: false });
    }

    /**获得某桌人数 */
    getActorCount() {
        let nTableID = this.getSelfTableID();
        return gameCenter.room.getActorCount(nTableID);
    }

    /**通过ChairID获得用户 */
    getPlayerInfoByChairID(nChairID: number) {
        if (fw.isNull(nChairID)) {
            return;
        }
        return this.getActorByChairId(nChairID)
        let nTableID = this.getSelfTableID();
        let table = gameCenter.room.getTable(nTableID);
        if(table) {
            let userID = table.getActorDbid(nChairID)
            if(userID != INVAL_USERID) {
                return this.getActorByDBIDEx(userID)
            }
        }
        let robotTable = gameCenter.room.getRobotTable();
        if(robotTable) {
            let userID = robotTable.getActorDbid(nChairID);
            if(userID != INVAL_USERID) {
                return this.getActorByDBIDEx(userID)
            }
        }
    }
    /**通过DBID获得用户 */
    getActorByDBIDEx(nActorDBID: number | string) {
        nActorDBID = parseInt(nActorDBID);
        let actor = this.m_ActorMap.get(nActorDBID);
        if (actor) {
            return actor;
        }
        return null;
    }
    /**通过ChairId获得用户 */
    getActorByChairId(ChairId: number | string) {
        let Actor = null
        this.m_ActorMap.forEach(v => {
            if (v.chairID == ChairId) {
                Actor = v
                return;
            }
        });
        return Actor;
    }
    /**获取玩家金币 */
    getGold(): number {
        let actor = this.getActor();
        return actor ? actor[ACTOR.ACTOR_PROP_GOLD] : 0;
    }
    /**获取玩家练习币 */
    getPracticeGold(): number {
        let actor = this.getActor();
        return actor ? actor[ACTOR.ACTOR_PROP_PRACTISE_SCORE] : 0;
    }
    /**自己的信息 */
    getActor() {
        return this.getActorByDBIDEx(center.login.getUserDBID());
    }
    /**得到自己的桌子号 */
    getSelfTableID(): number | null {
        let actor = this.getActor();
        return actor ? actor.tableID : null;
    }
    /**得到自己的椅子号 */
    getSelfChairID(): number | null {
        let actor = this.getActor();
        return actor ? actor.chairID : null;
    }

    isPlayActor(pActor) {
        let nGameState = pActor[ACTOR.ACTOR_PROP_GAME_STATE]
        return nGameState == ACTOR.ACTOR_STATE_FREE || nGameState == ACTOR.ACTOR_STATE_HAND || nGameState == ACTOR.ACTOR_STATE_GAME || nGameState == ACTOR.ACTOR_STATE_DROP || nGameState == ACTOR.ACTOR_STATE_WAITSETPLAY ||
            nGameState == ACTOR.ACTOR_STATE_WAITNEXT
    }

    isMe(pActor) {
        return pActor[PROTO_ACTOR.UAT_UID] == center.login.getUserDBID()
    }
    // 玩家共有属性
    initPlayPublicInfo(dict: proto.client_proto.ICommonGamePlayerInfo,tableID:number) {
        // dump(dict, " =======initPlayPublicInfo======== ")
        let nActorDBID = dict.userId;
        let actor = this.m_ActorMap.get(nActorDBID);
        actor.szName = dict.nickname;
        actor[PROTO_ACTOR.UAT_NICKNAME] = dict.nickname;
        actor[PROTO_ACTOR.UAT_FACE_URL] = dict.faceUrl;
        actor[PROTO_ACTOR.UAT_FACE_TYPE] = dict.faceType;
        actor[PROTO_ACTOR.UAT_FACE_ID] = dict.faceId;
        actor[PROTO_ACTOR.UAT_UID] = dict.userId; // 玩家的数据库DBID
        actor[PROTO_ACTOR.UAT_SEX] = dict.sex; // 用户性别
        actor[PROTO_ACTOR.UAT_GOLD] = dict.goldNum; // 携带金币
        actor[PROTO_ACTOR.UAT_DIAMOND] = dict.diamondNum; // 携带钻石
        actor.tableID = tableID; // 桌号
        actor.chairID = dict.chairId; // 椅子
        return actor
    }


    // 玩家私有属性
    initPlayPrivateInfo(pActor) {
        // dump(dict, " =======initPlayPrivateInfo======== ")
        let nActorDBID = pActor[PROTO_ACTOR.UAT_UID];
        let actor = this.m_ActorMap.get(nActorDBID);
        actor.szName = pActor[PROTO_ACTOR.UAT_NICKNAME];
        actor[PROTO_ACTOR.UAT_NICKNAME] = pActor[PROTO_ACTOR.UAT_NICKNAME];
        actor[PROTO_ACTOR.UAT_FACE_URL] = pActor[PROTO_ACTOR.UAT_FACE_URL];
        actor[PROTO_ACTOR.UAT_FACE_TYPE] = pActor[PROTO_ACTOR.UAT_FACE_TYPE];
        actor[PROTO_ACTOR.UAT_FACE_ID] = pActor[PROTO_ACTOR.UAT_FACE_ID];
        actor[PROTO_ACTOR.UAT_UID] = pActor[PROTO_ACTOR.UAT_UID];
        actor[PROTO_ACTOR.UAT_SEX] = pActor[PROTO_ACTOR.UAT_SEX];
        actor[PROTO_ACTOR.UAT_GOLD] = pActor[PROTO_ACTOR.UAT_GOLD];
        actor[PROTO_ACTOR.UAT_DIAMOND] = pActor[PROTO_ACTOR.UAT_DIAMOND];
        actor.tableID = pActor.tableID; // 桌号
        actor.chairID = pActor.chairID; // 椅子

        return actor
    }

    setActorProp(nActorDBID, Prop, value) {
        let actor = this.m_ActorMap.get(nActorDBID);
        actor && (actor[Prop] = value);
    }

    OnRecv_ActorPublicInfo(dict: proto.client_proto.ICommonGameScenePush) {
        // fw.print(dict, " =======OnRecv_ActorPublicInfo======== ")
        for(var i=0;i<dict.useList.length;i++){
            let nActorDBID = dict.useList[i].userId;
            let actor = this.createActor(nActorDBID);
            this.initPlayPublicInfo(dict.useList[i],dict.tableId)

            if(this.isMe(actor)){
                app.event.dispatchEvent({
                    eventName: EVENT_ID.EVENT_PLAY_ACTOR_PRIVATE,
                    dict: actor
                })
            }
        }

        for(var i=0;i<dict.useList.length;i++){
            let nActorDBID = dict.useList[i].userId;
            let actor = this.m_ActorMap.get(nActorDBID);
            app.event.dispatchEvent({
                eventName: EVENT_ID.EVENT_PLAY_ACTOR_PUBLIC,
                dict: actor
            })
        }
        
        app.popup.closeAllToast()
        
        let data= {
            roomName : dict.roomName,
            roomBase : dict.roomBase,
        }
        console.log("LHtableinfo2",data)
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_TABLE_BASE_INFO,
            data: data
        });
    }
    /**
     * 单机游戏机器人创建
     * @param dict 
     */
    OnRecv_RobotActorPublicInfo(dict: proto.game_actor.Ipublic_info_s) {
        // fw.print(dict, " =======OnRecv_ActorPublicInfo======== ")
        let nActorDBID = dict.user_id;
        let actor = this.createActor(nActorDBID);
        this.initPlayPublicInfo(dict)
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAY_ROBOT_ACTOR_PUBLIC,
            dict: actor
        })
    }

    OnRecv_ActorPrivateInfo(pActor) {
        // fw.print(dict, " =======OnRecv_ActorPrivateInfo======== ")
        let nActorDBID = pActor[PROTO_ACTOR.UAT_UID];
        let actor = this.createActor(nActorDBID);
        this.initPlayPrivateInfo(pActor)
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAY_ACTOR_PRIVATE,
            dict: actor
        })
    }

    OnRecv_ActorVariableInfo(dict: proto.client_proto.IGameUserAttriChangePush) {
        // fw.print(dict, " ========OnRecv_ActorVariableInfo====== ")
        let chairId = dict.chairId;
        let actor = this.getActorByChairId(chairId)
        if (actor) {
            let Variable = dict.attriList;
            let nActorDBID = actor[PROTO_ACTOR.UAT_UID]
            for (const k in Variable) {
                const v = Variable[k];
                let btPropID = v.key;
                let nOldValue = actor[btPropID];
                let eventTB = {
                    actor: actor,
                    nOldValue: nOldValue,
                    btPropID: btPropID,
                    nNewValue: v.valueType == 1 ?  app.func.toNumber(v.value) : v.value,
                }
                this.setActorProp(nActorDBID, btPropID, v.value);
                this.event.dispatchEvent({
                    eventName: v.key,
                    dict: eventTB,
                })
                app.event.dispatchEvent({
                    eventName: EVENT_ID.EVENT_PLAY_ACTOR_VARIABLE,
                    dict: eventTB
                })
            }
        }
    }

    OnRecv_ActorDestory(dict: proto.game_actor.Idestory_s) {
        // dump(dict, " ========OnRecv_ActorDestory====== ")
        let nActorDBID = dict.user_id;
        let actor = this.getActorByDBIDEx(nActorDBID);
        if (actor) {
            //先发送再删除
            app.event.dispatchEvent({
                eventName: EVENT_ID.EVENT_PLAY_ACTOR_DESTORY,
                dict: actor
            });
            this.m_ActorMap.delete(nActorDBID);
        }
    }
    /**
     * 单机游戏机器人销毁
     * @param dict 
     */
    OnRecv_RobotActorDestory(dict: proto.game_actor.Idestory_s) {
        // dump(dict, " ========OnRecv_ActorDestory====== ")
        let nActorDBID = dict.user_id;
        let actor = this.getActorByDBIDEx(nActorDBID);
        if (actor) {
            //先发送再删除
            app.event.dispatchEvent({
                eventName: EVENT_ID.EVENT_PLAY_ROBOT_ACTOR_DESTORY,
                dict: actor
            });
            this.m_ActorMap.delete(nActorDBID);
        }
    }

    /**创建属性结构 */
    createActor(nActorDBID: number) {
        let actor = this.m_ActorMap.get(nActorDBID);
        if (!actor) {
            actor = nActorDBID != center.user.getUserID() ? {} : new Proxy(<any>{}, {
                set(target: object, p: string, newValue: any, receiver: any): boolean {
                    /**旧值 */
                    let oldValue = Reflect.get(target, p);
                    /**刷新数值 */
                    Reflect.set(target, p, newValue, receiver);
                    /**事件通知 */
                    app.event.dispatchEvent({
                        //事件名为枚举类型键值
                        eventName: center.user.getActorEventName(p),
                        data: {
                            oldValue: oldValue,
                            newValue: newValue,
                        }
                    });
                    return true;
                }
            });
            this.m_ActorMap.set(nActorDBID, actor);
        }
        return actor;
    }
    //禁用，微信小游戏获取到的map值和其他平台不一样
    getActors() {
        return [...this.m_ActorMap.values()];
    }
}