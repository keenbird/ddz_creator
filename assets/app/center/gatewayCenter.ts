import { ERRID_MSG } from '../config/ConstantConfig';
import { EVENT_ID } from '../config/EventConfig';
import {  GS_PLAZA_MSGID, sint64, slong, stchar, uchar } from '../config/NetConfig';
import { GatewayMainInetMsg } from '../framework/network/awBuf/MainInetMsg';
import proto from './common';

enum CONNPROXY {
    /**登录 */
    LOGIN = 0,
    /**大厅 */
    PLAZA = 1,
    /**游戏 */
    GAME = 2,
}
export class GatewayCenter extends GatewayMainInetMsg {
    /**命令ID */
    cmd = proto.client_proto.HEARTBEAT_SUB_MSG_ID
    /**网络延迟 发收一次的时间*/
    mServerDelayTime: number = 0
    initEvents() {
        this.initMainID(GS_PLAZA_MSGID.GS_GATEWAY_MSGID_COMMAND);
    }
    initRegister() {
    //     this.bindMessage({
    //         struct: proto.gateway_command.gatewaytips_s,
    //         cmd: this.cmd.GATEWAY_COMMAND_TIPS,
    //         callback: this.OnRecv_GatewayTips.bind(this)
    //     });
    //     this.bindMessage({
    //         struct: proto.gateway_command.gatewaysocketerror_s,
    //         cmd: this.cmd.GATEWAY_COMMAND_SOCKETERROR,
    //         callback: this.OnRecv_GatewaySocketError.bind(this)
    //     });
        this.bindMessage({
            printLog: false,
            struct: proto.client_proto.HeartbeatResp,
            cmd: this.cmd.HSMI_HEARTBEAT_RESP,
            callback: this.OnRecv_GatewayKeepActive.bind(this)
        });

        this.bindMsgStructPB(this.cmd.HSMI_HEARTBEAT_REQ, proto.client_proto.HeartbeatReq)
    //     this.bindMessage({
    //         struct: proto.gateway_command.gatewayconnect_c,
    //         cmd: this.cmd.GATEWAY_COMMAND_CONNECTROOM,
    //     });
    }
    /**连接房间 */
    connectRoom(nServerID: number) {
        // let data = proto.gateway_command.gatewayconnect_c.create()
        // data.server_id = nServerID
        // this.sendMessage({
        //     cmd: this.cmd.GATEWAY_COMMAND_CONNECTROOM,
        //     data: data
        // });
    }
    /**获取心跳包数据 */
    getHearbeat() {
        let data = proto.client_proto.HeartbeatReq.create()
        data.timestamp = app.func.time(true) * 1000
        return this.getSendData(this.cmd.HSMI_HEARTBEAT_REQ, data);
    }

  
    /**接受的心跳包 */
    OnRecv_GatewayKeepActive(data: proto.client_proto.HeartbeatResp) {
        this.mServerDelayTime = app.func.time(true) * 1000 - data.svrTimestamp;
        // fw.print(`上一次时间戳`, data.timer, data.timer + this.mServerDelayTime);
    }
    /**
     * 获得网络延迟时间
     * @returns 1001毫秒
     */
    getServerDelayTime() {
        return this.mServerDelayTime
    }
}