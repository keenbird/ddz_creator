import { NetNode, NetTipsType } from "../lib/NetNode";

export class AwBufNetNode extends NetNode {
    constructor() {
        super();
        this._disconnectCallback = this.disconnectCallback.bind(this);
    }

    protected onConnected(event) {
        super.onConnected(event)
        center.login.loginToServer();
        //事件通知
        app.event.dispatchEvent({
            eventName: "WebSocketConnected"
        });
    }

    disconnectCallback(event: CloseEvent) {
        //清理重连提示
        this.updateNetTips(NetTipsType.Connecting, false);
        this.updateNetTips(NetTipsType.ReConnecting, false);
        // app.popup.showToast("conecnt fail");
        center.login.inetDisconnected(event)
    }
}