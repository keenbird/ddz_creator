import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('config_GameBase')
export class config_GameBase extends (fw.FWComponent) {
    //TODO
}

/**类型声明调整 */
declare global {
    namespace globalThis {
        type type_config_GameBase = config_GameBase
    }
}
