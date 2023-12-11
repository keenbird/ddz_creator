import { BindInetMsg } from "../../framework/network/awBuf/BindInetMsg";
import { ByteStream } from "../../framework/network/lib/NetInterface";

import { GameServerMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";

export class GameInetMsg extends BindInetMsg {
    declare nSubID: number
    declare mMainInetMsg: GameServerMainInetMsg

    initGameInet(main: GameServerMainInetMsg, nSubID: number) {
        this.initCmd(main.nRootID, main.nMainID);
        this.mMainInetMsg = main;
        this.nSubID = nSubID;
        this.bindMsgListener();
        this.initRegister();
    }

    //绑定 mainID 监听
    private bindMsgListener() {
        this.rootInetMsg = this.mMainInetMsg.rootInetMsg;
        this.mMainInetMsg.bindMsgStruct(this.nSubID, "null");
        this.mMainInetMsg.bindRecvFunc(this.nSubID, {
            callback: (dict, pByteStream: ByteStream) => {
                this.OnRecvData(pByteStream);
            },
            printLog: false,
        });
    }

    onViewDestroy() {
        this.mMainInetMsg?.unbindRecvFunc(this.nSubID);
        super.onViewDestroy();
    }

    protected initRegister() {
        //TODO
    }

    /**
     * 打包发送数据
     * @param nSubID 
     * @param strStructName 
     * @param luaTable 
     * @param pSendStream 
     */
    package(pSendStream: ByteStream, nSubID, strStructName, luaTable,) {
        // 游戏子命令
        pSendStream.writeSInt8(this.nSubID);
        super.package(pSendStream, nSubID, strStructName, luaTable)
    }
}