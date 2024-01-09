import { PlazeMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";
import { GS_PLAZA_MSGID } from "../../config/NetConfig";
import proto from "../common";
import { EVENT_ID } from "../../config/EventConfig";
import { ACTOR } from "../../config/cmd/ActorCMD";

export enum RankType {
    xxl_guanka,
};

export class userContainerCenter extends PlazeMainInetMsg {
    /**命令ID */
    // cmd = proto.plaza_container.GS_PLAZA_CONTAINER_MSG
    m_ActorPacketMap = {}
    mUserDBID = 0

    initData() {
        this.initMainID(GS_PLAZA_MSGID.GS_PLAZA_MSGID_CONTAINER);
        this.cleanUserData()
    }

    cleanUserData() {
        this.m_ActorPacketMap = {}
        this.mUserDBID = 0
    }

    // initRegister() {
    //     this.bindMessage({
    //         struct: proto.plaza_container.container_info,
    //         cmd: this.cmd.PLAZA_CONTAINER_INFO,
    //         callback: this.OnRecv_ContainerInfo.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_container.container_change,
    //         cmd: this.cmd.PLAZA_CONTAINER_CHANGE,
    //         callback: this.OnRecv_ContainerChange.bind(this),
    //     });
    // }
    getContainer(ucContainerID) {
        if (this.m_ActorPacketMap[ucContainerID]) {
            return this.m_ActorPacketMap[ucContainerID]
        }
        return {}
    }
    getGoodNum(ucContainerID, lGoodId) {
        if (this.m_ActorPacketMap[ucContainerID] && this.m_ActorPacketMap[ucContainerID][lGoodId]) {
            return Number(this.m_ActorPacketMap[ucContainerID][lGoodId])
        }
        return 0
    }
    getGoodNumByType(ucContainerID, nType) {
        let packet = this.m_ActorPacketMap[ucContainerID]
        let ncount = 0
        if (packet) {
            packet.forEach((v, k) => {
                let goods = center.goods.getGoodsInfo(k)
                if (goods && goods.goods_type && Number(goods.goods_type) == nType) {
                    ncount = ncount + Number(v)
                }
            })
        }
        return ncount
    }
    OnRecv_ContainerInfo(dict: proto.plaza_container.container_info) {
        let nUserDBID = dict.user_id
        let btContainerID = dict.container_id
        let ActorPacket = dict.List

        if (this.mUserDBID != nUserDBID) {
            this.m_ActorPacketMap = {}
        }
        this.mUserDBID = nUserDBID
        if (ActorPacket) {
            ActorPacket.forEach((v, k) => {
                if (!this.m_ActorPacketMap[btContainerID]) {
                    this.m_ActorPacketMap[btContainerID] = {}
                }
                this.m_ActorPacketMap[btContainerID][v.good_id] = v.good_num
            });
        }
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAZA_CONTAINER_INFO,
            dict: {
                nUserDBID: nUserDBID,
                btContainerID: btContainerID,
            }
        })
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAZA_RECYCLE_RED_POINT_TIPS,
        })
    }
    OnRecv_ContainerChange(dict: proto.plaza_container.container_change) {
        let nUserDBID = dict.user_id
        let btContainerID = dict.container_id
        let goodID = dict.good_id
        let nNums = dict.good_num
        let tb = {
            nUserDBID: nUserDBID,
            btContainerID: btContainerID,
            nGoodsID: goodID,
            nNums: nNums,
        }
        if (this.mUserDBID == nUserDBID) {
            if (!this.m_ActorPacketMap[btContainerID]) {
                this.m_ActorPacketMap[btContainerID] = {}
            }
            this.m_ActorPacketMap[btContainerID][goodID] = nNums
            if (this.m_ActorPacketMap[btContainerID][goodID] == 0) {
                this.m_ActorPacketMap[btContainerID][goodID] = null
            }
        }
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAZA_CONTAINER_CHANGE,
            dict: tb
        })
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAZA_RECYCLE_RED_POINT_TIPS,
        })
    }
}

declare global {
    namespace globalThis {
        //TODO
    }
}
