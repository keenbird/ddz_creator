import { Reader, Writer } from "protobufjs";
import { sint, uchar, uchars } from "../../../config/NetConfig";
import { ByteStream } from "../lib/NetInterface";
import { InetStruct } from "./InetStruct";
import { RootInetMsg } from "./RootInetMsg";
import { isValid } from "cc";

interface StructPB {
    encode(message: any, writer?: Writer): Writer;
    decode(reader: (Reader | Uint8Array), length?: number): any;
}

export class BindInetMsg extends (fw.FWComponent) {
    /**根命令ID */
    declare nRootID: number
    /**主命令ID */
    declare nMainID: number
    /**结构解析对象 */
    declare structParse: InetStruct
    /**绑定的结构map */
    declare mapStruct: Map<number, any>
    /**绑定的回调map */
    declare mapCallback: Map<number, InetMsgCallbackData>
    /**绑定的PB协议map */
    declare mapStructPB: Map<number, StructPB>
    /**RootInetMsg */
    declare rootInetMsg: RootInetMsg;
    /**测试输出执行消息函数（测试用） */
    bPrintMessageFuncName: boolean = false
    /**消息队列（只有标记进入消息队列的消息） */
    messageList: MessageParam[] = [];
    /**标记上一条消息是否处理完 */
    bCanTriggerMessage: boolean = true;
    /**初始化cmd */
    initCmd(nRootID: number, nMainID: number) {
        this.nRootID = nRootID;
        this.nMainID = nMainID;
        this.mapStruct = new Map();
        this.mapCallback = new Map();
        this.structParse = new InetStruct();
        this.mapStructPB = new Map();
        this.registerPBStruct();
    }
    /**获取结构名称 */
    getStructName(data: GetStructNameParam): string {
        let structName = "";
        if (data.name != null) {
            structName = data.name;
        } else if (data.cmd != null) {
            if (data.callback) {
                structName = `${this.nMainID}_${data.cmd}_recv`;
            } else {
                structName = `${this.nMainID}_${data.cmd}_send`;
            }
        } else {
            fw.printError(`bindMessage error`);
        }
        return structName;
    }
    /**“注册回调”“注册结构”等 */
    bindMessage(data: BindMessageParam) {
        //结构体名称
        let structName = this.getStructName(data);
        if (data.struct instanceof Array) {
            //绑定结构体
            if (data.inheritanceStruct) {
                this.registerInheritanceStruct(structName, data.struct, data.inheritanceStruct);
            } else {
                this.registerStruct(structName, data.struct);
            }
            if (!fw.isNull(data.cmd)) {
                this.bindMsgStruct(data.cmd, structName);
            }
        } else {
            this.bindMsgStructPB(data.cmd, data.struct);
        }
        //设置命令回调
        if (data.callback) {
            //绑定消息回调
            this.bindRecvFunc(data.cmd, {
                callback: function (dataEx: any, ...arg: any[]) {
                    if (!data.callback(dataEx, ...arg) && !!this.cmd) {
                        //发送通知
                        app.event.dispatchEvent({
                            eventName: this.cmd[data.cmd],
                            data: dataEx,
                        });
                    }
                }.bind(this),
                funcName: data.callback.name,
                bQueue: data.bQueue ?? false,
                printLog: data.printLog ?? true,
            });
        }
        //调整结构命名
        data.name = structName;
        return data;
    }
    /**发送消息 */
    protected sendMessage<T>(data: SendMessageParam<T>): boolean {
        return this.sendData(data.cmd, this.getStructName(data), data.data == null ? {} : data.data);
    }
    /**绑定结构体 */
    registerStruct(structName: string, struct: any) {
        return this.structParse.registerStruct(structName, struct);
    }
    /**注册结构体，带继承 */
    registerInheritanceStruct(structName: string, struct: any[], parentStructName: string) {
        return this.structParse.registerInheritanceStruct(structName, struct, parentStructName);
    }
    /**解绑结构体，带继承 */
    unregisterStruct(structName: string) {
        this.structParse.unregisterStruct(structName);
    }
    /**绑定消息结构 */
    bindMsgStruct(nSubID: number, structName: string) {
        this.mapStruct.set(nSubID, structName);
    }
    /**解绑消息结构 */
    unbindMsgStruct(nSubID: number) {
        this.mapStruct.delete(nSubID);
    }
    /**绑定消息回调 */
    bindRecvFunc(nSubID: number, data: InetMsgCallback | InetMsgCallbackData) {
        if (typeof data == 'function') {
            this.mapCallback.set(nSubID, {
                callback: data,
                funcName: data.name,
                printLog: true,
            });
        } else {
            data.funcName = data.funcName || data.callback.name;
            this.mapCallback.set(nSubID, data);
        }
    }
    /**解绑消息回调 */
    unbindRecvFunc(nSubID: number) {
        this.mapCallback.delete(nSubID);
    }
    /**解析数据 */
    OnRecvData(pByteStream: ByteStream) {
        //对象已经失效，不再处理
        if (!isValid(this, true)) {
            return;
        }
        let nSubID = pByteStream.readUInt8();
        let strBindStructName = this.mapStruct.get(nSubID);
        if (strBindStructName == null) {
            // fw.printError(`${this.constructor.name}:OnRecvDataRoot(): warning RootID:${this.rootInetMsg.nRootID} MainID:${this.nMainID} SubID:${nSubID} didn't bind struct!!!`)
            return
        }
        let tblData = null;
        try {
            tblData = this.structParse.readTableFromByteStream(strBindStructName, pByteStream);
            if (tblData == null) {
                fw.printError(`${this.constructor.name}:OnRecvDataRoot(): warning SubID:${nSubID} StructName:${strBindStructName} !!!`);
            }
        } catch (e) {
            fw.printWarn(strBindStructName, e);
        }
        let strBindStructPB = this.mapStructPB.get(nSubID);
        if (strBindStructPB != null) {
            let pbData: any;
            try {
                pbData = strBindStructPB.decode(tblData.szBuff, tblData.nBuffLen);
            } catch (e) {
                fw.printError(e);
            }
            this.exeMsg(nSubID, pbData, pByteStream)
        } else {
            this.exeMsg(nSubID, tblData, pByteStream)
        }
    }
    /**执行消息命令 */
    exeMsg(nSubID: number, dict: any, pByteStream: ByteStream) {
        if (this.mapCallback.has(nSubID)) {
            let data = this.mapCallback.get(nSubID)
            if (data.printLog) {
                fw.print(data.funcName || data.callback.name, dict)
            }
            if (data.bQueue) {
                dict.__nQueueTime = app.func.millisecond();
                this.triggerMessageList({
                    data: data,
                    dict,
                    pByteStream,
                });
            } else {
                data.callback(dict, pByteStream);
            }
        }
    }
    /**标记消息处理完成 */
    clearMessageList() {
        this.bCanTriggerMessage = true;
        this.messageList.splice(0, this.messageList.length);
    }
    /**触发消息队列消息 */
    triggerMessageList(message?: MessageParam) {
        //添加消息
        message && this.messageList.push(message);
        //是否执行下一条消息
        if (this.bCanTriggerMessage) {
            if (this.messageList.length > 0) {
                //获取第一条消息
                let next = this.messageList[0];
                //删除第一条消息
                this.messageList.splice(0, 1);
                //标记消息堵塞
                this.setTriggerMessageVisible(false);
                //测试输出
                this.bPrintMessageFuncName && fw.print(`do message: ${next.data.funcName ?? `null`}`);
                //接收和执行的时差
                next.dict.__nDiffTime = (app.func.millisecond() - next.dict.__nQueueTime) / 1000;
                //执行
                next.data.callback(next.dict, next.pByteStream);
            }
        }
    }
    /**标记消息处理完成 */
    setTriggerMessageVisible(bVisible: boolean) {
        //设置标记
        this.bCanTriggerMessage = bVisible;
        //尝试触发下一条消息
        bVisible && this.triggerMessageList();
    }
    /**发送消息 */
    protected sendData(nSubID: number, structName: string | any, dict?: any) {
        fw.print("sendData", this.nMainID,nSubID,structName, dict)
        return this.rootInetMsg.sendData(this.getSendData(nSubID, structName, dict));
    }
    /**获取发送消息数据 */
    getSendData(nSubID: number, structName: string | any, dict?: any) {
        let strBindStructPB = this.mapStructPB.get(nSubID);
        if (strBindStructPB != null) {
            let szBuff = strBindStructPB.encode(dict ?? structName).finish();
            dict = {
                nBuffLen: szBuff.length,
                szBuff: szBuff,
            }
            structName = "SendProtobufMsg"
        }
        return this.rootInetMsg.getSendData(this.nMainID, (pSendStream: ByteStream) => {
            this.package(pSendStream, nSubID, structName, dict)
        });
    }
    /**打包消息数据 */
    package(pSendStream: ByteStream, nSubID: number, structName: string, dict: any) {
        pSendStream.writeSInt16(nSubID);
        pSendStream.writeSInt32(dict.nBuffLen); //包体原始长度
        if (this.structParse.writeTableToByteStream(structName, dict, pSendStream) != true) {
            throw new Error(`${this.constructor.name} : sendData structName:${structName}`);
        }
    }
    //注册基础pb结构体
    registerPBStruct() {
        var dict = [
            [sint, "nBuffLen"],
            [uchar, "szBuff", - 1], //因为字符串碰0结束 这里走数组 lua自行转数据
        ]
        this.registerStruct("ProtobufMsg", dict)
        var dict = [
            [sint, "nBuffLen"],
            [uchar, "szBuff", - 1],
        ]
        this.registerStruct("SendProtobufMsg", dict)
    }
    /**绑定pb消息*/
    bindMsgStructPB(nSubID: number, pbCls) {
        this.bindMsgStruct(nSubID, "ProtobufMsg");
        this.mapStructPB.set(nSubID, pbCls);
    }
    /**解绑消息结构 */
    unbindMsgStructPB(nSubID: number) {
        this.unbindMsgStruct(nSubID);
        this.mapStructPB.delete(nSubID);
    }
}
/**声明全局调用 */
declare global {
    namespace globalThis {
        type InetMsgCallback = (data: any, byteStream?: ByteStream) => any
        interface MessageParam {
            /**绑定的回调信息 */
            data: InetMsgCallbackData
            /**解析的数据 */
            dict: any
            /**数据流 */
            pByteStream: ByteStream
        }
        interface BindPbMsg {
            /**cmd */
            cmd?: number
            /**pb消息结构 */
            struct?: any
            /**消息回调 */
            callback?: (data: any) => void
        }
        interface GetStructNameParam {
            /**指定ID */
            cmd?: number
            /**指定名称 */
            name?: string
            /**是否监听服务器返回 */
            callback?: Function | boolean
        }
        interface InetMsgCallbackData {
            callback: InetMsgCallback,
            funcName?: string,
            printLog: boolean,
            /**是否进入消息队列 */
            bQueue?: boolean
        }
        interface BindMessageParam {
            /**结构体 */
            struct: any[] | StructPB
            /**继承的结构体名称 */
            inheritanceStruct?: string
            /**命令ID */
            cmd?: number
            /**消息回调 */
            callback?: InetMsgCallback
            /**自定义命名 */
            name?: string
            /**是否进入消息队列 */
            bQueue?: boolean
            /**接收消息是否自动打印日志 */
            printLog?: boolean
        }
        interface SendMessageParam<T> {
            /**发送ID */
            cmd: number
            /**指定结构名称 */
            name?: string
            /**发送数据 */
            data?: T
        }
    }
}
