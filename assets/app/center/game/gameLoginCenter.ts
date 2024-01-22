import { GS_GAME_MSGID, sint64, slong, stchar, uchar, ulong } from "../../config/NetConfig";
import { GameServerMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";
import proto from "../common";


let D_GameVersion = 11
export class GameLoginCenter extends GameServerMainInetMsg {
    // cmd = proto.game_login.GS_GAME_LOGIN_MSG;
    initEvents() {
        // this.initMainID(GS_GAME_MSGID.GS_GAME_MSGID_LOGIN);
    }

    // initRegister() {
    //     // let GameLogin =
    //     //     [
    //     //         [sint64, "nActorDBID"],
    //     //         [stchar, "szKey", 32],
    //     //         [ulong, "uVersion"],
    //     //     ]
    //     // this.registerStruct("GameLogin", GameLogin)

    //     this.bindMsgStructPB(this.cmd.GAME_LOGIN_CLIENTLOGIN, proto.game_login.game_login_c);
    // }

    sendLoginGameServer(GameVersion?: number) {
        let loginData = proto.game_login.game_login_c.create();
        loginData.user_id = center.login.getUserDBID();
        loginData.login_key = center.login.getszKey();
        loginData.game_version = GameVersion || D_GameVersion;
        loginData.plaza_server_id = center.user.getActorPlazaID();

        this.sendData(this.cmd.GAME_LOGIN_CLIENTLOGIN, loginData);
    }
}