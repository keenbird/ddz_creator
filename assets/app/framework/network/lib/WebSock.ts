import { ISocket, NetData } from "./NetInterface";

/*
*   WebSocket封装
*   1. 连接/断开相关接口
*   2. 网络异常回调
*   3. 数据发送与接收
*   
*   2018-5-14 by 宝爷
*/

export class WebSock implements ISocket {
    private _ws: WebSocket = null;              // websocket对象

    onConnected: (event) => void = null;
    onMessage: (msg) => void = null;
    onError: (event) => void = null;
    onClosed: (event) => void = null;

    connect(options: any) {
        if (this._ws) {
            if (this._ws.readyState === WebSocket.CONNECTING) {
                fw.print("websocket connecting, wait for a moment...")
                return false;
            }
        }

        let url = null;
        if (options.url) {
            url = options.url;
        } else {
            let ip = options.host;
            let port = options.port;
            let protocol = options.protocol ? options.protocol : 'ws';
            url = `${protocol}://${ip}:${port}`;
        }

        this._ws = new WebSocket(url);
        this._ws.binaryType = options.binaryType ? options.binaryType : "arraybuffer";
        this._ws.onmessage = this.onmessage.bind(this);
        this._ws.onopen = this.onopen.bind(this);
        this._ws.onerror = this.onerror.bind(this);
        this._ws.onclose = this.onclose.bind(this);
        return true;
    }

    send(buffer: NetData) {
        if (this._ws.readyState == WebSocket.OPEN) {
            this._ws.send(buffer);
            return true;
        }
        return false;
    }

    close() {
        if (!this._ws) return;
        // 测试后发现code 无作用 不同平台 返回的错误码不一致 自定义code 不生效
        this._ws.close()
    }

    onmessage(event: MessageEvent) {
        this.onMessage(event.data);
    }

    onopen(event: Event) {
        this.onConnected(event);
    }

    onerror(event: Event) {
        this.onError(event);
    }

    onclose(event: CloseEvent) {
        this.onClosed(event);
    }
}