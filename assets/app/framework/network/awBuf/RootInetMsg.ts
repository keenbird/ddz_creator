import { MAX_NET_PACKAGE_SIZE, Root_cmd } from "../../../config/NetConfig";
import { ByteStream } from "../lib/NetInterface";

export class RootInetMsg {
    nCmdRootID: Root_cmd;
    private _readByteStream = new ByteStream();
    private _writeByteStream = new ByteStream();
    private _writeArrayBuffer = new ArrayBuffer(MAX_NET_PACKAGE_SIZE)
    m_mapMainMsgListener: Map<number, any>;
    constructor(nCmdRootID: Root_cmd) {
        this.nCmdRootID = nCmdRootID;
        app.socket.main.addResponeHandler(this.nCmdRootID, this.OnRecvDataRoot, this);
        this.m_mapMainMsgListener = new Map();
    }

    bindMsgListener(nMainID, pFun) {
        if (this.m_mapMainMsgListener[nMainID] != null) {
            return true
            // throw new Error(`${this.constructor.name}:bindMsgListener()`);
        }
        this.m_mapMainMsgListener[nMainID] = pFun
        return true
    }

    unbindMsgListener(nMainID) {
        if (this.m_mapMainMsgListener[nMainID] != null) {
            this.m_mapMainMsgListener[nMainID] = null
            return true
            // throw new Error(`${this.constructor.name}:bindMsgListener()`);
        }
        return true
    }

    OnRecvDataRoot(data: ArrayBuffer) {
        this._readByteStream.setBuffers(data);
        let pByteStream = this._readByteStream;
        let wMsgLen = pByteStream.readUInt16();
        let wMsgType = pByteStream.readUInt8();
        let wVersion = pByteStream.readUInt16();
        let uRoomSvrId = pByteStream.readUInt32();
        let nMainID = pByteStream.readUInt16();

        let pMsgListener = this.m_mapMainMsgListener[nMainID]
        if (pMsgListener == null) {
            fw.printError(`${this.constructor.name}:OnRecvDataRoot(): warning RootID:${this.nCmdRootID} MainID:${nMainID} didn't bind listener!!!`)
            return
        }
        pMsgListener(pByteStream)
    }

    sendData(buf: ArrayBuffer) {
        return app.socket.main.send(buf);
    }

    getSendData(nMainID, func) {
        this._writeByteStream.setBuffers(this._writeArrayBuffer);
        let pSendStream = this._writeByteStream;
        pSendStream.writeSInt16(0);
        pSendStream.writeSInt8(1);
        pSendStream.writeSInt16(0); //版本
        pSendStream.writeSInt32(app.gameManager.gameData.nServerID); //房间时ser id
        pSendStream.writeSInt16(nMainID);
        func(pSendStream)
        return pSendStream.buffers.slice(0, pSendStream.curIndex);
    }
}