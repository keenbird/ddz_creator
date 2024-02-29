import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { game_GameBase } from '../GameBase/game_GameBase';

@ccclass('game_Landlord')
export class game_Landlord extends game_GameBase {
    /**预加载文件夹列表 子类使用“=”赋值 */
    preloadList = []
    
    protected initView(): boolean | void {
        /**恢复背景音乐 */
        app.audio.resumMusic();
    }
}

declare global {
    namespace globalThis {
        type type_game_Landlord = game_Landlord
    }
}
