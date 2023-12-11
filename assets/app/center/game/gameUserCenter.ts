import { ACTOR, INVAL_USERID } from "../../config/cmd/ActorCMD";
import { EVENT_ID } from "../../config/EventConfig";
import { GS_GAME_MSGID, sint64, slong, stchar, uchar, ulong } from "../../config/NetConfig";
import { EventHelp } from "../../framework/manager/FWEventManager";
import { GameServerMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";
import proto from "../common";


export class GameUserCenter extends GameServerMainInetMsg {
    event = new EventHelp()
    cmd = proto.game_actor.GS_GAME_ACTORINFO_MSG;
    m_ActorMap:Map<number,any> = new Map();
    initData() {
        this.m_ActorMap.clear();
    }

    initEvents() {
        this.initMainID(GS_GAME_MSGID.GS_GAME_MSGID_ACTOR);
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
        this.bindMsgStructPB(this.cmd.GAME_ACTOR_PRIVATE, proto.game_actor.private_info_s);
        this.bindRecvFunc(this.cmd.GAME_ACTOR_PRIVATE, this.OnRecv_ActorPrivateInfo.bind(this));
        this.bindMsgStructPB(this.cmd.GAME_ACTOR_PUBLIC, proto.game_actor.public_info_s);
        this.bindRecvFunc(this.cmd.GAME_ACTOR_PUBLIC, { callback: this.OnRecv_ActorPublicInfo.bind(this), printLog: false });
        this.bindMsgStructPB(this.cmd.GAME_ACTOR_VARIABLE, proto.game_actor.variable_s);
        this.bindRecvFunc(this.cmd.GAME_ACTOR_VARIABLE, { callback: this.OnRecv_ActorVariableInfo.bind(this), printLog: false });
        this.bindMsgStructPB(this.cmd.GAME_ACTOR_DESTORY, proto.game_actor.destory_s);
        this.bindRecvFunc(this.cmd.GAME_ACTOR_DESTORY, { callback: this.OnRecv_ActorDestory.bind(this), printLog: false });
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
        return actor ? actor[ACTOR.ACTOR_PROP_GAME_TABLEINDEX] : null;
    }
    /**得到自己的椅子号 */
    getSelfChairID(): number | null {
        let actor = this.getActor();
        return actor ? actor[ACTOR.ACTOR_PROP_GAME_CHAIR] : null;
    }

    isPlayActor(pActor) {
        let nGameState = pActor[ACTOR.ACTOR_PROP_GAME_STATE]
        return nGameState == ACTOR.ACTOR_STATE_FREE || nGameState == ACTOR.ACTOR_STATE_HAND || nGameState == ACTOR.ACTOR_STATE_GAME || nGameState == ACTOR.ACTOR_STATE_DROP || nGameState == ACTOR.ACTOR_STATE_WAITSETPLAY ||
            nGameState == ACTOR.ACTOR_STATE_WAITNEXT
    }

    isMe(pActor) {
        return pActor[ACTOR.ACTOR_PROP_DBID] == center.login.getUserDBID()
    }
    // 玩家共有属性
    initPlayPublicInfo(dict: proto.game_actor.Ipublic_info_s) {
        // dump(dict, " =======initPlayPublicInfo======== ")
        let nActorDBID = dict.user_id;
        let actor = this.m_ActorMap.get(nActorDBID);
        actor.szName = dict.name;
        actor.szMD5FaceFile = dict.face;
        actor[ACTOR.ACTOR_PROP_DBID] = dict.user_id; // 玩家的数据库DBID
        actor[ACTOR.ACTOR_PROP_UID] = dict.id; // 用户的全局UID
        actor[ACTOR.ACTOR_PROP_SEX] = dict.sex; // 用户性别
        actor[ACTOR.ACTOR_PROP_GOLD] = dict.gold; // 携带金币
        actor[ACTOR.ACTOR_PROP_DIAMONDS] = dict.diamonds; // 携带钻石
        actor[ACTOR.ACTOR_PROP_WINCOUNT] = dict.win_count; // 赢次数
        actor[ACTOR.ACTOR_PROP_LOSTCOUNT] = dict.lost_count; // 输次数
        actor[ACTOR.ACTOR_PROP_DRAWCOUNT] = dict.draw_count; // 平次数
        actor[ACTOR.ACTOR_PROP_DROPCOUNT] = dict.drop_count; // 逃跑次数
        actor[ACTOR.ACTOR_PROP_SCORE] = dict.score; // 用户的积分值
        actor[ACTOR.ACTOR_PROP_VIPLEVEL] = dict.vip_level; // vip等级
        actor[ACTOR.ACTOR_PROP_GAME_TABLEINDEX] = dict.table_id; // 桌号
        actor[ACTOR.ACTOR_PROP_GAME_CHAIR] = dict.chair_id; // 椅子
        actor[ACTOR.ACTOR_PROP_GAME_STATE] = dict.state; // 状态
        actor[ACTOR.ACTOR_PROP_ISGUEST] = dict.guest; //是否游客登录
        actor[ACTOR.ACTOR_PROP_PRACTISE_SCORE] = dict.practise_score; // 练习场积分

        return actor
    }


    // 玩家私有属性
    initPlayPrivateInfo(dict: proto.game_actor.Iprivate_info_s) {
        // dump(dict, " =======initPlayPrivateInfo======== ")
        let nActorDBID = dict.user_id;
        let actor = this.m_ActorMap.get(nActorDBID);
        actor.szName = dict.name;
        actor.szPhone = dict.phone;
        actor.szMD5FaceFile = dict.face;
        actor[ACTOR.ACTOR_PROP_DBID] = dict.user_id; // 玩家的数据库DBID
        actor[ACTOR.ACTOR_PROP_UID] = dict.id; // 用户的全局UID
        actor[ACTOR.ACTOR_PROP_SEX] = dict.sex; // 用户性别
        actor[ACTOR.ACTOR_PROP_GOLD] = dict.gold; // 携带金币
        actor[ACTOR.ACTOR_PROP_DIAMONDS] = dict.diamonds; // 携带钻石
        actor[ACTOR.ACTOR_PROP_WINCOUNT] = dict.win_count; // 赢次数
        actor[ACTOR.ACTOR_PROP_LOSTCOUNT] = dict.lost_count; // 输次数
        actor[ACTOR.ACTOR_PROP_DRAWCOUNT] = dict.draw_count; // 平次数
        actor[ACTOR.ACTOR_PROP_DROPCOUNT] = dict.drop_count; // 逃跑次数
        actor[ACTOR.ACTOR_PROP_SCORE] = dict.score; // 用户的积分值
        actor[ACTOR.ACTOR_PROP_VIPEXP] = dict.vip_exp; // vip经验值
        actor[ACTOR.ACTOR_PROP_VIPLEVEL] = dict.vip_level; // vip等级
        actor[ACTOR.ACTOR_PROP_NEXTVIPLEVELEXP] = dict.next_vip_level_exp; // vip达到下一级需要的经验值
        actor[ACTOR.ACTOR_PROP_GAME_TABLEINDEX] = dict.table_id; // 桌号
        actor[ACTOR.ACTOR_PROP_GAME_CHAIR] = dict.chair_id; // 椅子
        actor[ACTOR.ACTOR_PROP_GAME_STATE] = dict.state; // 状态
        actor[ACTOR.ACTOR_PROP_GM] = dict.gm_flag; // 管理员权值
        actor[ACTOR.ACTOR_PROP_OPENFLAG] = dict.open_flag; // 功能开启标示(参考OPENFLAG定义)
        actor[ACTOR.ACTOR_PROP_BEHAVIORCTRL] = dict.behavior_ctrl_flag; // 用户行为权值(参考ACTOR_BEHAVIORCTRL定义)
        actor[ACTOR.ACTOR_PROP_ISGUEST] = dict.guest; // 是否是游客
        actor[ACTOR.ACTOR_PROP_PRACTISE_SCORE] = dict.practise_score; // 练习场积分
        return actor
    }

    setActorProp(nActorDBID, Prop, value) {
        let actor = this.m_ActorMap.get(nActorDBID);
        actor && (actor[Prop] = value);
    }

    OnRecv_ActorPublicInfo(dict: proto.game_actor.Ipublic_info_s) {
        // fw.print(dict, " =======OnRecv_ActorPublicInfo======== ")
        let nActorDBID = dict.user_id;
        let actor = this.createActor(nActorDBID);
        this.initPlayPublicInfo(dict)
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAY_ACTOR_PUBLIC,
            dict: actor
        })
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

    OnRecv_ActorPrivateInfo(dict: proto.game_actor.Iprivate_info_s) {
        // fw.print(dict, " =======OnRecv_ActorPrivateInfo======== ")
        let nActorDBID = dict.user_id;
        let actor = this.createActor(nActorDBID);
        this.initPlayPrivateInfo(dict)
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAY_ACTOR_PRIVATE,
            dict: actor
        })
    }

    OnRecv_ActorVariableInfo(dict: proto.game_actor.Ivariable_s) {
        // fw.print(dict, " ========OnRecv_ActorVariableInfo====== ")
        let nActorDBID = dict.user_id;
        let actor = this.getActorByDBIDEx(nActorDBID)
        if (actor) {
            let Variable = dict.info;
            for (const k in Variable) {
                const v = Variable[k];
                let btPropID = v.prop_id;
                let nOldValue = actor[btPropID];
                let eventTB = {
                    actor: actor,
                    nOldValue: nOldValue,
                    btPropID: btPropID,
                    nNewValue: v.value,
                }
                this.setActorProp(nActorDBID, btPropID, v.value);
                this.event.dispatchEvent({
                    eventName: v.prop_id,
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

    getActors() {
        return [...this.m_ActorMap.values()];
    }
}