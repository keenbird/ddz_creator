
/*
*   网络相关接口定义
*   
*   2019-10-8 by 宝爷
*/

export type NetData = (string | ArrayBufferLike | Blob | ArrayBufferView);
export type NetCallFunc = (data: any) => void;

// 回调对象
export interface CallbackObject {
    target: any,                // 回调对象，不为null时调用target.callback(xxx)
    callback: NetCallFunc,      // 回调函数
}

// 请求对象
export interface RequestObject {
    buffer: NetData,            // 请求的Buffer
    rspCmd: number,             // 等待响应指令
    rspObject: CallbackObject,  // 等待响应的回调对象
}

// 协议辅助接口
export interface IProtocolHelper {
    getHeadlen(): number;                   // 返回包头长度
    getHearbeat(): NetData;                 // 返回一个心跳包
    checkPackage(msg: NetData): boolean;    // 检查包数据是否合法
    getPackageId(msg: NetData): number;     // 返回包的id或协议类型
}

// 默认字符串协议对象
export class DefStringProtocol implements IProtocolHelper {
    getHeadlen(): number {
        return 0;
    }
    getHearbeat(): NetData {
        return "";
    }
    checkPackage(msg: NetData): boolean {
        return true;
    }
    getPackageId(msg: NetData): number {
        return 0;
    }
}

// Socket接口
export interface ISocket {
    onConnected: (event) => void;           // 连接回调
    onMessage: (msg: NetData) => void;      // 消息回调
    onError: (event) => void;               // 错误回调
    onClosed: (event) => void;              // 关闭回调

    connect(options: any);                  // 连接接口
    send(buffer: NetData);                  // 数据发送接口
    close();  // 关闭接口
}

// 网络提示接口
export interface INetworkTips {
    connectTips(isShow: boolean): void;
    reconnectTips(isShow: boolean): void;
}

export class ByteArray {
    list = [];
    byteOffset = 0;
    length = 0;

    reset() {
        this.list = [];
        this.byteOffset = 0;
        this.length = 0;
    }

    push(unit8Arr: Uint8Array) {
        this.list.push(unit8Arr);
        this.length += unit8Arr.length;
    }

    readBytes(len: number) {
        if (len > 0) {
            let rbuf = new Uint8Array(len);
            let rbuf_ind = 0;
            while (rbuf_ind < len) {
                if (this.list.length > 0) {
                    let tmpbuf = this.list.shift();
                    let tmplen = tmpbuf.length;
                    let last_len = len - rbuf_ind;
                    if (tmplen >= last_len) {
                        //足夠了
                        let tmpbuf2 = tmpbuf.subarray(0, last_len);
                        rbuf.set(tmpbuf2, rbuf_ind);
                        rbuf_ind += tmpbuf2.length;
                        if (last_len < tmplen) {
                            let newUint8Array = tmpbuf.subarray(last_len, tmplen);
                            this.list.unshift(newUint8Array);
                        }
                        break;
                    } else {
                        rbuf.set(tmpbuf, rbuf_ind);
                        rbuf_ind += tmplen;
                    }
                } else {
                    rbuf = rbuf.subarray(0, rbuf_ind);
                    break;
                }
            }
            this.length -= rbuf.length;
            return rbuf;
        }
        return null;
    }
}
import Long from "long";
export class ByteStream {
    buffers: ArrayBuffer;
    dataView: DataView;
    totalSize: number;
    curIndex: number;
    littleEndian: boolean;

    setBuffers(buffers: ArrayBuffer, littleEndian?: boolean) {
        this.buffers = buffers;
        this.dataView = new DataView(buffers);
        this.totalSize = buffers.byteLength;
        this.curIndex = 0;
        this.littleEndian = littleEndian ? littleEndian : true;
    }

    readSInt8() {
        let size = 1
        if (this.curIndex + size > this.totalSize) {
            return null;
        }
        let index = this.curIndex;
        this.curIndex += size;
        return this.dataView.getInt8(index);
    }
    readUInt8() {
        let size = 1
        if (this.curIndex + size > this.totalSize) {
            return null;
        }
        let index = this.curIndex;
        this.curIndex += size;
        return this.dataView.getUint8(index);
    }
    readSInt16() {
        let size = 2
        if (this.curIndex + size > this.totalSize) {
            return null;
        }
        let index = this.curIndex;
        this.curIndex += size;
        return this.dataView.getInt16(index, this.littleEndian);
    }
    readUInt16() {
        let size = 2
        if (this.curIndex + size > this.totalSize) {
            return null;
        }
        let index = this.curIndex;
        this.curIndex += size;
        return this.dataView.getUint16(index, this.littleEndian);
    }
    readSInt32() {
        let size = 4
        if (this.curIndex + size > this.totalSize) {
            return null;
        }
        let index = this.curIndex;
        this.curIndex += size;
        return this.dataView.getInt32(index, this.littleEndian);
    }
    readUInt32() {
        let size = 4
        if (this.curIndex + size > this.totalSize) {
            return null;
        }
        let index = this.curIndex;
        this.curIndex += size;
        return this.dataView.getUint32(index, this.littleEndian);
    }
    readSInt64() {
        let size = 8
        if (this.curIndex + size > this.totalSize) {
            return null;
        }
        let index = this.curIndex;
        this.curIndex += size;

        let byteArray = [];
        for (let offset = 0; offset < size; offset++) {
            byteArray.push(this.dataView.getUint8(index + offset))
        }
        let num = this.littleEndian ? Long.fromBytesLE(byteArray, false) : Long.fromBytesBE(byteArray, false)
        return num.toNumber();
    }
    readUInt64() {
        let size = 8
        if (this.curIndex + size > this.totalSize) {
            return null;
        }
        let index = this.curIndex;
        this.curIndex += size;

        let byteArray = [];
        for (let offset = 0; offset < size; offset++) {
            byteArray.push(this.dataView.getUint8(index + offset))
        }
        let num = this.littleEndian ? Long.fromBytesLE(byteArray, true) : Long.fromBytesBE(byteArray, true)
        return num.toNumber();
    }
    readBool() {
        let size = 1
        if (this.curIndex + size > this.totalSize) {
            return null;
        }
        let index = this.curIndex;
        this.curIndex += size;
        return this.dataView.getUint8(index) == 1;
    }
    readFloat() {
        let size = 4
        if (this.curIndex + size > this.totalSize) {
            return null;
        }
        let index = this.curIndex;
        this.curIndex += size;
        return this.dataView.getFloat32(index, this.littleEndian);
    }
    readDouble() {
        let size = 8
        if (this.curIndex + size > this.totalSize) {
            return null;
        }
        let index = this.curIndex;
        this.curIndex += size;
        return this.dataView.getFloat64(index, this.littleEndian);
    }

    writeSInt8(nVal: number) {
        let size = 1
        if (this.curIndex + size > this.totalSize) {
            return false;
        }
        let index = this.curIndex;
        this.curIndex += size;
        this.dataView.setInt8(index, nVal);
        return true;
    }
    writeUInt8(nVal: number) {
        let size = 1
        if (this.curIndex + size > this.totalSize) {
            return false;
        }
        let index = this.curIndex;
        this.curIndex += size;
        this.dataView.setUint8(index, nVal);
        return true;
    }
    writeSInt16(nVal: number) {
        let size = 2
        if (this.curIndex + size > this.totalSize) {
            return false;
        }
        let index = this.curIndex;
        this.curIndex += size;
        this.dataView.setInt16(index, nVal, this.littleEndian);
        return true;
    }
    writeUInt16(nVal: number) {
        let size = 2
        if (this.curIndex + size > this.totalSize) {
            return false;
        }
        let index = this.curIndex;
        this.curIndex += size;
        this.dataView.setUint16(index, nVal, this.littleEndian);
        return true;
    }
    writeSInt32(nVal: number) {
        let size = 4
        if (this.curIndex + size > this.totalSize) {
            return false;
        }
        let index = this.curIndex;
        this.curIndex += size;
        this.dataView.setInt32(index, nVal, this.littleEndian);
        return true;
    }
    writeUInt32(nVal: number) {
        let size = 4
        if (this.curIndex + size > this.totalSize) {
            return false;
        }
        let index = this.curIndex;
        this.curIndex += size;
        this.dataView.setUint32(index, nVal, this.littleEndian);
        return true;
    }
    writeSInt64(nVal: number | string) {
        let size = 8
        if (this.curIndex + size > this.totalSize) {
            return false;
        }
        let index = this.curIndex;
        this.curIndex += size;

        let bigint = Long.fromValue(nVal, false)
        let byteArray = this.littleEndian ? bigint.toBytesLE() : bigint.toBytesBE()
        byteArray.forEach((val, offset) => {
            this.dataView.setUint8(index + offset, val);
        });
        return true;
    }
    writeUInt64(nVal: number | string) {
        let size = 8
        if (this.curIndex + size > this.totalSize) {
            return false;
        }
        let index = this.curIndex;
        this.curIndex += size;
        let bigint = Long.fromValue(nVal, false)
        let byteArray = this.littleEndian ? bigint.toBytesLE() : bigint.toBytesBE()
        byteArray.forEach((val, offset) => {
            this.dataView.setUint8(index + offset, val);
        });
        return true;
    }
    writeBool(bVal: boolean) {
        let size = 1
        if (this.curIndex + size > this.totalSize) {
            return false;
        }
        let index = this.curIndex;
        this.curIndex += size;
        this.dataView.setUint8(index, bVal ? 1 : 0);
        return true;
    }
    writeFloat(fVal: number) {
        let size = 4
        if (this.curIndex + size > this.totalSize) {
            return false;
        }
        let index = this.curIndex;
        this.curIndex += size;
        this.dataView.setFloat32(index, fVal, this.littleEndian);
        return true;
    }
    writeDouble(dVal: number) {
        let size = 8
        if (this.curIndex + size > this.totalSize) {
            return false;
        }
        let index = this.curIndex;
        this.curIndex += size;
        this.dataView.setFloat64(index, dVal, this.littleEndian);
        return true;
    }
}



// 状态码	名称	描述
// 0–999 - 保留段, 未使用。
// 1000	CLOSE_NORMAL	正常关闭; 无论为何目的而创建, 该链接都已成功完成任务。
// 1001	CLOSE_GOING_AWAY	终端离开, 可能因为服务端错误, 也可能因为浏览器正从打开连接的页面跳转离开。
// 1002	CLOSE_PROTOCOL_ERROR	由于协议错误而中断连接。
// 1003	CLOSE_UNSUPPORTED	由于接收到不允许的数据类型而断开连接(如仅接收文本数据的终端接收到了二进制数据)。
// 1004 - 保留。 其意义可能会在未来定义。
// 1005	CLOSE_NO_STATUS	保留。 表示没有收到预期的状态码。
// 1006	CLOSE_ABNORMAL	保留。 用于期望收到状态码时连接非正常关闭(也就是说, 没有发送关闭帧)。
// 1007	Unsupported Data	由于收到了格式不符的数据而断开连接(如文本消息中包含了非 UTF - 8 数据)。
// 1008	Policy Violation	由于收到不符合约定的数据而断开连接。 这是一个通用状态码, 用于不适合使用 1003 和 1009 状态码的场景。
// 1009	CLOSE_TOO_LARGE	由于收到过大的数据帧而断开连接。
// 1010	Missing Extension	客户端期望服务器商定一个或多个拓展, 但服务器没有处理, 因此客户端断开连接。
// 1011	Internal Error	客户端由于遇到没有预料的情况阻止其完成请求, 因此服务端断开连接。
// 1012	Service Restart	服务器由于重启而断开连接。[Ref]
// 1013	Try Again Later	服务器由于临时原因断开连接, 如服务器过载因此断开一部分客户端连接。[Ref]
// 1014 - 由 WebSocket 标准保留以便未来使用。
// 1015	TLS Handshake	保留。 表示连接由于无法完成 TLS 握手而关闭(例如无法验证服务器证书)。
// 1016–1999 - 由 WebSocket 标准保留以便未来使用。
// 2000–2999 - 由 WebSocket 拓展保留使用。
// 3000–3999 - 可以由库或框架使用。 不应由应用使用。 可以在 IANA 注册, 先到先得。
// 4000–4999 - 可以由应用使用。
