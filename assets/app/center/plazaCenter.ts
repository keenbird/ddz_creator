import { GS_PLAZA_MSGID, sint64, slong, stchar, uchar } from "../config/NetConfig";
import { PlazeMainInetMsg } from "../framework/network/awBuf/MainInetMsg";
import proto from "./common";

export class PlazaCenter extends PlazeMainInetMsg {
    PlazaGoldPos: any;
    // cmd = proto.plaza_login.GS_PLAZA_LOGIN_MSG

    cleanUserData(): void {
        
    }

    initEvents() {
        // this.initMainID(GS_PLAZA_MSGID.GS_PLAZA_MSGID_LOGIN);
    }

    initRegister() {
        // this.bindMsgStructPB(this.cmd.PLAZA_LOGIN_NEWCLIENTLOGIN, proto.plaza_login.newlogin_c)
    }

    connectServer(loginType, UserDBID, strLoginEndKey) {
        // let loginData = proto.plaza_login.newlogin_c.create()
        // loginData.user_id = UserDBID;
        // loginData.login_key = strLoginEndKey;
        // loginData.login_type = loginType;
        // loginData.buffbios = app.native.device.getBiosID();
        // loginData.buffcpu = app.native.device.getCpuID();
        // loginData.buffhd = app.native.device.getHDID();
        // loginData.game_version = 1;
        // loginData.mac = app.native.device.getMacAddress();
        // loginData.system_type = app.native.device.getSystemType();
        // this.sendData(this.cmd.PLAZA_LOGIN_NEWCLIENTLOGIN, loginData)
    }

    setPlazaGoldPos(pos) {
        this.PlazaGoldPos = pos
    }

    getPlazaGoldPos() {
        return this.PlazaGoldPos
    }
}