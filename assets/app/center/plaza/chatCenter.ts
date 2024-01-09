import proto from "../common";
import { GS_PLAZA_MSGID } from "../../config/NetConfig";
import { PlazeMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";
import { EVENT_ID } from "../../config/EventConfig";

export enum MSG_TYPE {
    CHAT_SYSTEM,    //普通广播
    CHAT_GETPOOL,   //奖池
    CHAT_GETMONEY,  //赚金
    CHAT_WITHDRAW,  //提现
    CHAT_RECHARGE,  //充值
    CHAT_FISH,      //捕鱼
}

export interface HornParams {
	szChat,
	type,
}

export interface HornData {
	msg_type:MSG_TYPE,
	data:HornParams
}

export class chatCenter extends PlazeMainInetMsg {
    /**命令ID */
    // cmd = proto.plaza_chat.GS_PLAZA_CHAT_MSG
    _wLabaQueue:HornData[];
    initData() {
        this.initMainID(GS_PLAZA_MSGID.GS_PLAZA_MSGID_CHAT);
        this._wLabaQueue =[]
    }
    cleanUserData() {
        
    }
    // initRegister() {
    //     //系统消息
    //     this.bindMessage({
    //         struct: proto.plaza_chat.chat_system_s,
    //         cmd: this.cmd.PLAZA_CHAT_SYSTEM,
    //         callback: this.OnRecv_ChatSystem.bind(this),
    //         printLog: false
    //     });
    // }
    getWLabaData() {
        return this._wLabaQueue
    }
    /**系统消息 */
    OnRecv_ChatSystem(data: proto.plaza_chat.chat_system_s) {
        //TODO
        // fw.print(data, "chat_system_s")
        let message = {} as any
        message.type = data.type
        if ( data.type == 0 ) {
            message.szChat = data.buffer;
        }else {
            let curIndex = 0
            let str = data.buffer;
            let gLen = parseInt(str.substring(curIndex,curIndex+=2));
            let msg_id = parseInt(str.substring(curIndex,curIndex+=gLen));
            let msg_str = `broadcast_msg_${msg_id+1}`
		    let msg = msg_str as string;
            if(msg) {
                let maxLen = str.length;
                let datas:string[] = []
                let value = ""
                while (curIndex < maxLen) {
                    gLen = parseInt(str.substring(curIndex, curIndex+=2))
                    value = str.substring(curIndex, curIndex+=gLen)
                    datas.push(value);
                }
                let repl = {};
                datas.forEach((v,i)=>{
                    repl[`[${i+1}]`]=v
                })
                let re = /\[\d\]/g;
                message.szChat = msg.replace(re,v=> {
                    return repl[v] ?? v
                })
            }
        }
        if(message.szChat) {
            app.event.dispatchEvent({
                eventName: EVENT_ID.EVENT_PLAZA_CHAT_SYSTEM,
                data: message,
            })

            if(this._wLabaQueue.length > 50) this._wLabaQueue.shift();
            if (data.type == MSG_TYPE.CHAT_WITHDRAW) {
                this._wLabaQueue.push({
                    msg_type: data.type,
                    data: message,
                })
            }
        }
    }
}
