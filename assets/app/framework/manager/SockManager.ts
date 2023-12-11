
import { _decorator, Component, Node as ccNode, math, isValid } from 'cc';
import { PlazaCenter } from '../../center/plazaCenter';
import { UserCenter } from '../../center/userCenter';
import { httpConfig, server_config, socket_config } from '../../config/HttpConfig';
import { GS_Head, GS_HeadNull_Size, Root_cmd } from '../../config/NetConfig';
import { AwBufNetNode } from '../network/awBuf/NetNode';
import { AwBufProtocol } from '../network/awBuf/Protocol';
import { RootInetMsg } from '../network/awBuf/RootInetMsg';
import { AwBufWebSock } from '../network/awBuf/WebSock';
import { ByteArray, ByteStream, INetworkTips, IProtocolHelper, NetData } from '../network/lib/NetInterface';
import { NetManager } from '../network/lib/NetManager';
import { NetConnectOptions, NetNode } from '../network/lib/NetNode';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = SockManager
 * DateTime = Tue Jan 18 2022 17:44:34 GMT+0800 (中国标准时间)
 * Author = luohao251
 * FileBasename = SockManager.ts
 * FileBasenameNoExtension = SockManager
 * URL = db://assets/main/app/framework/manager/SockManager.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

export enum NetType {
    main,
}

class NetTips implements INetworkTips {
    connectTips(isShow: boolean): void {
        if (isValid(app, true)) {
            app.popup.closeLoading();
            if (isShow) {
                app.popup.showLoading({ text: "connecting to server..." });
            }
        }
    }
    reconnectTips(isShow: boolean): void {
        if (isValid(app, true)) {
            app.popup.closeLoading();
            if (isShow) {
                app.popup.showLoading({ text: "reconnecting" });
            }
        }
    }
}

const center = [PlazaCenter, UserCenter]

@ccclass('SockManager')
export class SockManager extends Component {
    serverData: server_config;
    rootInetMsg: Map<Root_cmd, RootInetMsg>;
    socketData: socket_config;

    onLoad() {
        let Node = new AwBufNetNode();
        Node.init(new AwBufWebSock(), new AwBufProtocol(), new NetTips());
        NetManager.getInstance().setNetNode(Node, NetType.main);

        this.rootInetMsg = new Map();
        this.rootInetMsg.set(Root_cmd.CMDROOT_GATEWAY_MSG, new RootInetMsg(Root_cmd.CMDROOT_GATEWAY_MSG))
        this.rootInetMsg.set(Root_cmd.CMDROOT_LOGIN_MSG, new RootInetMsg(Root_cmd.CMDROOT_LOGIN_MSG))
        this.rootInetMsg.set(Root_cmd.CMDROOT_PLAZA_MSG, new RootInetMsg(Root_cmd.CMDROOT_PLAZA_MSG))
        this.rootInetMsg.set(Root_cmd.CMDROOT_GAMESERVER_MSG, new RootInetMsg(Root_cmd.CMDROOT_GAMESERVER_MSG))
        this.rootInetMsg.set(Root_cmd.CMDROOT_WEB_MSG, new RootInetMsg(Root_cmd.CMDROOT_WEB_MSG))
    }

    public getRootInetMsg(nCmdRootID: number) {
        return this.rootInetMsg.get(nCmdRootID);
    }

    public initServerConfig(serverData: server_config) {
        httpConfig.setUrl(this.serverData = serverData);
        this.setSocketConfig(serverData);
    }

    public setSocketConfig(socketData: socket_config) {
        this.socketData = {
            url_login: socketData.url_login,
            port_min: socketData.port_min,
            port_max: socketData.port_max,
        }
    }

    public connect() {
        if (!this.socketData) {
            fw.printWarn(`socketData is null`);
            return;
        }
        let options: NetConnectOptions = {
            //地址
            host: this.socketData.url_login,
            //端口
            port: math.randomRangeInt(this.socketData.port_min, this.socketData.port_max + 1),
            //-1 永久重连，0不自动重连，其他正整数为自动重试次数
            autoReconnect: 5,
        }
        NetManager.getInstance().connect(options, NetType.main);
    }

    public send(buf: NetData) {
        NetManager.getInstance().send(buf, NetType.main);
    }

    public disconnect(needReconnect = false) {
        NetManager.getInstance().close(NetType.main, needReconnect);
    }

    public isWorking() {
        return NetManager.getInstance().getNetNode(NetType.main).isWorking();
    }

    public get main() {
        return NetManager.getInstance().getNetNode(NetType.main);
    }

}