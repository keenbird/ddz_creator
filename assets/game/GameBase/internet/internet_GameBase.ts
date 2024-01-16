import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { GameInetMsg } from '../../../app/center/game/gameInetMsg';

@ccclass('internet_GameBase')
export class internet_GameBase extends GameInetMsg {
    /**命令ID */
    cmd: any = {}
    /**错误座位，基类为 0xffff (65535)，如果子类不一样需要重新赋值 */
    INVALID_CHAIRID = 0xffff
    /**初始化 */
    start() {
        super.start();
        // this.initGameInet(gameCenter.room, gameCenter.room.cmd.GAME_ROOM_CS_GAMEDATA);
    }
    /**房间规则 */
    setGameRuleData(struct: any, func: InetMsgCallback | InetMsgCallbackData) {
        gameCenter.room.bindMsgStructPB(gameCenter.room.cmd.GAME_ROOM_S_GAMERULE, struct);
        gameCenter.room.bindRecvFunc(gameCenter.room.cmd.GAME_ROOM_S_GAMERULE, func);
    }
    /**断线重入 */
    setDropEndData(struct: any, func: InetMsgCallback | InetMsgCallbackData) {
        gameCenter.room.bindMsgStructPB(gameCenter.room.cmd.GAME_ROOM_S_DROPEND, struct);
        gameCenter.room.bindRecvFunc(gameCenter.room.cmd.GAME_ROOM_S_DROPEND, func);
    }
    /**中途入桌 */
    setHalfWayJoinData(struct: any, func: InetMsgCallback | InetMsgCallbackData) {
        gameCenter.room.bindMsgStructPB(gameCenter.room.cmd.GAME_ROOM_S_HALFWAYJOIN, struct);
        gameCenter.room.bindRecvFunc(gameCenter.room.cmd.GAME_ROOM_S_HALFWAYJOIN, func);
    }
    /**踢人重入 */
    setReplace(struct: any, func: InetMsgCallback | InetMsgCallbackData) {
        gameCenter.room.bindMsgStructPB(gameCenter.room.cmd.GAME_ROOM_S_REPLACE, struct);
        gameCenter.room.bindRecvFunc(gameCenter.room.cmd.GAME_ROOM_S_REPLACE, func);
    }
    /**绑定到gameCenter.room */
    helpLuaStruct(name: string, struct: any[]) {
        // to do 等子游戏pb都移植完，在删除这个函数，不用了
        // gameCenter.room.unregisterStruct(name);
        // gameCenter.room.registerStruct(name, struct);
    }
    /**销毁 */
    onViewDestroy() {
        gameCenter.room.unbindRecvFunc(gameCenter.room.cmd.GAME_ROOM_S_REPLACE);
        gameCenter.room.unbindRecvFunc(gameCenter.room.cmd.GAME_ROOM_S_DROPEND);
        gameCenter.room.unbindRecvFunc(gameCenter.room.cmd.GAME_ROOM_S_GAMERULE);
        gameCenter.room.unbindRecvFunc(gameCenter.room.cmd.GAME_ROOM_S_HALFWAYJOIN);

        gameCenter.room.unbindMsgStructPB(gameCenter.room.cmd.GAME_ROOM_S_REPLACE);
        gameCenter.room.unbindMsgStructPB(gameCenter.room.cmd.GAME_ROOM_S_DROPEND);
        gameCenter.room.unbindMsgStructPB(gameCenter.room.cmd.GAME_ROOM_S_GAMERULE);
        gameCenter.room.unbindMsgStructPB(gameCenter.room.cmd.GAME_ROOM_S_HALFWAYJOIN);

        super.onViewDestroy();
    }
}
