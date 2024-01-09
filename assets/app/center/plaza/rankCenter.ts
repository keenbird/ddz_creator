import { PlazeMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";
import { GS_PLAZA_MSGID } from "../../config/NetConfig";
import proto from "../common";
import { EVENT_ID } from "../../config/EventConfig";
import { ACTOR } from "../../config/cmd/ActorCMD";

export enum RankType {
    xxl_guanka,
};

export interface MyRankingData {
    value :number,
    valueEx :number,
    rank :number,
}
export interface RankingData {
    myRankData:MyRankingData, 
    rankData:proto.plaza_rank.IRanking[],
}

export class rankCenter extends PlazeMainInetMsg {
    rankType = RankType;
    /**命令ID */
    // cmd = proto.plaza_rank.GS_PLAZA_RANKING_MSG

    rankingArray: RankingData[] = [];
    lastSendTime: number = 0;

    initData() {
        this.initMainID(GS_PLAZA_MSGID.GS_PLAZA_MSGID_RANKING);
    }

    cleanUserData() {
        
    }
    
    // initRegister() {
    //     this.bindMessage({
    //         struct: proto.plaza_rank.gs_rankinghead_c,
    //         cmd: this.cmd.PLAZA_RANKING_REQ,
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_rank.gs_rankingdata_s,
    //         cmd: this.cmd.PLAZA_RANKING_DATA,
    //         callback: this.OnRecv_RankingData.bind(this),
    //     });
    // }

    OnRecv_RankingData(data: proto.plaza_rank.gs_rankingdata_s) {
        this.rankingArray[data.ranking_type] = {
            myRankData : {
                value:data.value1,
                valueEx:data.value2,
                rank:data.my_rank,
            },
            rankData:data.data,
        };
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAZABAG_GETRANKDATA
        })
    }

    sendRankingConfigReq() {
        let sendData = proto.plaza_rank.gs_rankinghead_c.create();
        let now = new Date();
        let curTime = now.getMilliseconds();
        if (curTime - this.lastSendTime > 10) {
            this.lastSendTime = curTime;
            this.sendMessage({
                cmd: this.cmd.PLAZA_RANKING_REQ,
                data: sendData
            });
        }
    }

    getRankTypeList(rankType):RankingData {
        return this.rankingArray[rankType];
    }
    
    getRankingList() {
        return this.rankingArray;
    }

    
    getMyRankData(rankType) {
        if (!this.rankingArray[rankType] || this.rankingArray[rankType].rankData.length <= 0) {
            return { data: null, nRanking: 0 };
        }

        let result = { data: null, nRanking: 0 };
        let myActor = center.user.getActor();
        for (let k = 0; k < this.rankingArray[rankType].rankData.length; k++) {
            let v = this.rankingArray[rankType][k];
            let a1 = v.actor_dbid
            let a2 = myActor[ACTOR.ACTOR_PROP_DBID];

            if (a1 == a2) {
                result = { data: v, nRanking: k }
                break;
            }
        }
        return result;
    }
}
