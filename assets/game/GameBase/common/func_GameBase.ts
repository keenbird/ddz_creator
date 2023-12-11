import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('func_GameBase')
export class func_GameBase extends fw.FWComponent {
	//TODO
}

/**类型声明调整 */
declare global {
    namespace globalThis {
        type type_func_GameBase = func_GameBase
	}
}
