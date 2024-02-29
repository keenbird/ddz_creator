import { ERRID, ERRID_MSG } from '../../config/ConstantConfig';
import { EVENT_ID } from '../../config/EventConfig';
import { GS_PLAZA_MSGID, sint, slong, stchar, uchar, ulong } from '../../config/NetConfig';
import { PlazeMainInetMsg } from '../../framework/network/awBuf/MainInetMsg';
import proto from '../common';
export class tipsCenter extends PlazeMainInetMsg {
    /**命令ID */
    // cmd = proto.plaza_tips.GS_PLAZA_TIPS_MSG
    mOrderCallback: Map<string, Function>

    initData() {
        this.initMainID(GS_PLAZA_MSGID.GS_PLAZA_MSGID_TIPS);
        this.mOrderCallback = new Map();
    }

    cleanUserData() {

    }
    
    // initRegister() {
    //     this.bindMessage({
    //         struct: proto.plaza_tips.tips_s,
    //         cmd: this.cmd.PLAZA_TIPS_MSG,
    //         callback: this.OnRecv_PLAZA_TIPS_MSG.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_tips.rewardtips_s,
    //         cmd: this.cmd.PLAZA_TIPS_REWARD,
    //         callback: this.OnRecv_PLAZA_TIPS_REWARD.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_tips.rechargeret_s,
    //         cmd: this.cmd.PLAZA_TIPS_RECHARGE_RET,
    //         callback: this.OnRecv_PLAZA_TIPS_RECHARGE.bind(this),
    //     });
    // }

}