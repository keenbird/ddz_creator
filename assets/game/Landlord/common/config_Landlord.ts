import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { config_GameBase } from '../../GameBase/common/config_GameBase';

@ccclass('config_Landlord')
export class config_Landlord extends config_GameBase {
    /**操作类型 */
    JettonArea = {
        /**A押注 */
        BTN_BETA: 1,
        /**B押注 */
        BTN_BETB: 2,
        /**不下注 */
        BTN_SKIP: 3,
        /**超时 */
        OVER_TIME: 4,
    }
    /**游戏状态 */
    GameState = {
        /**空闲 */
        FREE: 0,
        /**第一阶段（发第一张牌） */
        BET1: 1,
        /**第二阶段（发第二张牌） */
        BET2: 2,
        /**游戏结束 */
        END: 3,
    }
    /**游戏状态 */
    PlayerStates = {
        /**空闲 */
        Free: 0,
        /**参与 */
        Join: 1,
        /**已下注 */
        Play: 2,
        /**超时 */
        TimeOut: 3,
    }
    /** */
    CardColor = CardColor
}

/**牌花色 */
enum CardColor {
    /**方块 */
    Diamond = 0x00,
    /**梅花 */
    Club = 0x10,
    /**红桃 */
    Heart = 0x20,
    /**黑桃 */
    Spade = 0x30,
}

/**类型声明调整 */
declare global {
    namespace globalThis {
        type type_config_Landlord = config_Landlord
    }
}
