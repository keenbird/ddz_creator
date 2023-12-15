import { _decorator } from 'cc';
const { ccclass } = _decorator;
 
@ccclass('realGame_GameBase')
export class realGame_GameBase extends (fw.FWComponent) {
	protected initView(): boolean | void {

	}
	protected initBtns(): boolean | void {
		this.node.onClickAndScale(() => {
			if (app.game.main.getGotoRealVisible()) {
				app.game.main.gotoReal();
			}
		});
	}
}
