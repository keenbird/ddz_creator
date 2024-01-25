import { GS_HeadNull, GS_HeadNull_Size, S_GS_HeadNull } from "../../../config/NetConfig";
import { lzo1x } from "../../external/lzo/lzo1x";
import { lzo1x_ret } from "../../external/lzo/lzo1x_define";
import { ByteArray, ByteStream } from "../lib/NetInterface";
import { WebSock } from "../lib/WebSock";

//客户端与服务器的加密字段
const ENCRYPT_KEY = (() => {
    let key = [ 'E','F','M','N','J','Q','K','W'];
    let ret = [];
    for (let index = 0; index < key.length; index++) {
        const element = key[index];
        ret[index] = element.charCodeAt(0);
    }
    return ret
})();

const S_ByteStream = new ByteStream()
export class AwBufWebSock extends WebSock {
    __buffer__: ByteArray = new ByteArray();//数据缓存
    __packLen__: number;//包体长度
    __curr_buffer: Uint8Array;//当前包数据
    //连接
    connect(options: any) {
        fw.print("connect", options)
        this.__buffer__.reset();
        this.__packLen__ = 0;
        return super.connect(options);
    }
    //接收
    onmessage(event: MessageEvent) {
        let uncomprss_buffer = this._lzo1x_uncomprss_(event.data);
        this._encryptData_(uncomprss_buffer);
        console.log("uncomprss_buffer",uncomprss_buffer)
        this.onMessage(uncomprss_buffer);
    }
    //发送
    send(buffer: ArrayBuffer) {
        this._encryptData_(buffer);
        return super.send(this._lzo_compress_(buffer));
    }
    //读取buff
    _readBuff_(buffer: ArrayBuffer) {
        this.__buffer__.push(new Uint8Array(buffer));
        while (this._canReadBuff_()) {
            let tmpBuffer = this.__curr_buffer;
            this.__curr_buffer = null;
            this.__packLen__ = 0;
            let uncomprss_buffer = this._lzo1x_uncomprss_(tmpBuffer.buffer);
            this._encryptData_(uncomprss_buffer);
            this.onMessage(uncomprss_buffer);
        }
    }
    //读取buff
    _canReadBuff_() {
        let buffer = this.__buffer__;
        if (this.__packLen__ == 0 && buffer.length > 2) {
            let data = buffer.readBytes(2);
            this.__packLen__ = (data[0] & 0xff) | ((data[1] & 0xff) << 8);
        }
        if (this.__packLen__ > 0 && buffer.length >= this.__packLen__) {
            this.__curr_buffer = buffer.readBytes(this.__packLen__);
            return true;
        }
        return false;
    }
    //添加固定字段
    _setAddr_(buffer: ArrayBuffer) {
        //说是这个字段不要了所以去掉
        S_ByteStream.setBuffers(buffer)
        S_ByteStream.writeUInt16(buffer.byteLength);
    }
    //加密
    _encryptData_(buffer: ArrayBuffer) {
        let data_len = buffer.byteLength;
        //加密头信息之后的部分
        if (data_len < GS_HeadNull_Size) {
            return;
        }
        this._setAddr_(buffer);
        let uInt8Array = new Uint8Array(buffer);
        for (let index = GS_HeadNull_Size, uindex = 0; index < data_len; index++, uindex = ++uindex % 8) {
            uInt8Array[index] ^= ENCRYPT_KEY[uindex];
        }
    }
    //压缩
    _lzo_compress_(buffer: ArrayBuffer) {
        let data_len = buffer.byteLength;
        this._setAddr_(buffer);
        if (data_len < GS_HeadNull_Size) {
            return buffer;
        }
        // let state = {
        //     inputBuffer: new Uint8Array(buffer.slice(GS_HeadNull_Size, data_len)),
        //     outputBuffer: new Uint8Array(4)
        // };
        // if (lzo1x.compress(state) == lzo1x_ret.OK) {
        //     if (state.outputBuffer.length < data_len - GS_HeadNull_Size) {
        //         let buff = new ArrayBuffer(state.outputBuffer.length + GS_HeadNull_Size)
        //         let newBuffer = new Uint8Array(buff);
        //         let oldBuffer = new Uint8Array(buffer);
        //         for (let index = 0; index < GS_HeadNull_Size; index++) {
        //             newBuffer[index] = oldBuffer[index];
        //         }
        //         for (let index = 0; index < state.outputBuffer.length; index++) {
        //             newBuffer[GS_HeadNull_Size + index] = state.outputBuffer[index];
        //         }
        //         this._setAddr_(buff);
        //         return buff;
        //     }
        // }
        return buffer;
    }
    //解压
    _lzo1x_uncomprss_(buffer: ArrayBuffer) {
        let data_len = buffer.byteLength;
        if (data_len < GS_HeadNull_Size) {
            return buffer;
        }
        S_GS_HeadNull.initArrayBuffer(buffer);
        let pHead = S_GS_HeadNull;
        if (pHead.wMsgLen - pHead.wBodyLen== GS_HeadNull_Size) {
            return buffer;
        }
        // let new_len = pHead.wMsgLen - pHead.wBodyLen - GS_HeadNull_Size;
        // let state = {
        //     inputBuffer: new Uint8Array(buffer.slice(GS_HeadNull_Size, data_len)),
        //     outputBuffer: new Uint8Array(4)
        // };
        // if (lzo1x.decompress(state) == lzo1x_ret.OK) {
        //     if (state.outputBuffer.length == new_len) {
        //         let buff = new ArrayBuffer(new_len + GS_HeadNull_Size)
        //         let newBuffer = new Uint8Array(buff);
        //         let oldBuffer = new Uint8Array(buffer);
        //         for (let index = 0; index < GS_HeadNull_Size; index++) {
        //             newBuffer[index] = oldBuffer[index];
        //         }
        //         for (let index = 0; index < state.outputBuffer.length; index++) {
        //             newBuffer[GS_HeadNull_Size + index] = state.outputBuffer[index];
        //         }
        //         return buff;
        //     }
        // }
        return buffer;
    }
}