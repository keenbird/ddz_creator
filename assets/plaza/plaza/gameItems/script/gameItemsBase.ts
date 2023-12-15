import { sp, SpriteFrame, _decorator } from 'cc';
const { ccclass } = _decorator;

import { GameMarkType } from '../../script/plaza_game_config';

@ccclass('gameItemsBase')
export class gameItemsBase extends (fw.FWComponent) {
	protected initView(): boolean | void {
		//隐藏部分界面
		this.Items.Sprite_game_mark.active = false;
	}
	//刷新界面
	updateView(data: OnePlazaGameConfigParam) {
		
	}
}
