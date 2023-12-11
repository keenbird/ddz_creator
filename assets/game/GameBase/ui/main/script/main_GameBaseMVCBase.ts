import { _decorator } from 'cc';


const { ccclass } = _decorator;


@ccclass('main_GameBaseMVCBase')
export class main_GameBaseMVCBase extends (fw.FWComponent) {
	onLoad() {
        //初始化事件
        this.initEvents_GameMainBase();
        //父类
        super.onLoad();
    }
	
	/**初始化事件 */
    initEvents_GameMainBase(): void {
        //返回键事件
        this.bindEvent({
            eventName: app.event.CommonEvent.Keyback,
            callback: this.onKeyBackClick.bind(this),
        });
    }

    /**返回按钮事件 */
    onKeyBackClick() {
        this.exitGame();
    }

    /**退出游戏 */
    exitGame(): void {
        app.gameManager.exitGame();
    }
}
