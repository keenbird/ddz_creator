import { EVENT_ID } from "../../../config/EventConfig";
import { Root_cmd } from "../../../config/NetConfig";
import { ByteStream } from "../lib/NetInterface";
import { BindInetMsg } from "./BindInetMsg";

export class MainInetMsg extends BindInetMsg {

    initCmd(nRootID: number, nMainID: number) {
        super.initCmd(0, nMainID);
        this.bindMsgListener();
        this.initRegister();
    }

    //绑定 mainID 监听
    private bindMsgListener() {
        this.rootInetMsg = app.socket.getRootInetMsg(this.nRootID);
        this.rootInetMsg.bindMsgListener(this.nMainID, this.OnRecvData.bind(this))
    }

    initRegister() {

    }
}

export class GatewayMainInetMsg extends MainInetMsg {
    initMainID(nMainID: number) {
        this.initCmd(Root_cmd.CMDROOT_GATEWAY_MSG, nMainID);
    }
}
export class LoginMainInetMsg extends MainInetMsg {
    initMainID(nMainID: number) {
        this.initCmd(Root_cmd.CMDROOT_LOGIN_MSG, nMainID);
    }
}
export abstract class PlazeMainInetMsg extends MainInetMsg {
    initMainID(nMainID: number) {
        // this.initCmd(Root_cmd.CMDROOT_PLAZA_MSG, nMainID);
    }

    protected initEvents(): boolean | void {
        super.initEvents()
        this.bindEvent({
            eventName:EVENT_ID.EVENT_CLEAN_USER_DATA,
            callback:this.cleanUserData.bind(this)
        })
    }
    abstract cleanUserData():void;
}
export class GameServerMainInetMsg extends MainInetMsg {
    initMainID(nMainID: number) {
        // this.initCmd(Root_cmd.CMDROOT_GAMESERVER_MSG, nMainID);
    }
}
export class WebMainInetMsg extends MainInetMsg {
    initMainID(nMainID: number) {
        // this.initCmd(Root_cmd.CMDROOT_WEB_MSG, nMainID);
    }
}
