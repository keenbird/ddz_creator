import { _decorator } from "cc";
import { GameChatCenter } from "./gameChatCenter";
import { GameLoginCenter } from "./gameLoginCenter";
import { GameRoomCenter } from "./gameRoomCenter";
import { GameTipsCenter } from "./gameTipsCenter";
import { GameUserCenter } from "./gameUserCenter";
import { GameRobotCenter } from "./gameRobotCenter";
const { ccclass } = _decorator;

/**用户状态枚举定义 */
export enum GAME_USER_STATE {
    /**未知状态 */
    ACTOR_STATE_UNKNOWN = -1,
    /**空闲状态 */
    ACTOR_STATE_FREE = 1,
    /**举手状态 */
    ACTOR_STATE_HAND = 2,
    /**游戏状态 */
    ACTOR_STATE_GAME = 3,
    /**掉线状态 */
    ACTOR_STATE_DROP = 4,
    /**旁观状态(暂未实现) */
    ACTOR_STATE_WATCH = 5,
    /**占座等待下一场游戏状态(用户不参与本局游戏) */
    ACTOR_STATE_WAITNEXT = 6,
    /**等待游戏模块设置游戏状态 */
    ACTOR_STATE_WAITSETPLAY = 7,
    /**GM旁观状态(不参与游戏) */
    ACTOR_STATE_GMLOOK = 8,
}

@ccclass('GameCenter')
export class GameCenter extends (fw.FWComponent) {
    login: GameLoginCenter;
    user: GameUserCenter;
    room: GameRoomCenter;
    chat: GameChatCenter;
    tips: GameTipsCenter;
    robot:GameRobotCenter;
    onLoad() {
        super.onLoad()
        globalThis.gameCenter = this;
        this.login = this.obtainComponent(GameLoginCenter);
        this.user = this.obtainComponent(GameUserCenter);
        this.room = this.obtainComponent(GameRoomCenter);
        this.chat = this.obtainComponent(GameChatCenter);
        this.tips = this.obtainComponent(GameTipsCenter);
        this.robot = this.obtainComponent(GameRobotCenter);
    }
}

declare global {
    namespace globalThis {
        var gameCenter: GameCenter;
    }
}