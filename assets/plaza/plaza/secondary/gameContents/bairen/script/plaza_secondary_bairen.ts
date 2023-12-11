import { Prefab, _decorator, Node as ccNode, instantiate } from 'cc';
const { ccclass } = _decorator;

import { PlazaGameConfig } from '../../../../script/plaza_game_config';
import { gameItemsBase } from '../../../../gameItems/script/gameItemsBase';

@ccclass('plaza_secondary_bairen')
export class plaza_secondary_bairen extends (fw.FWComponent) {
	/**游戏分类 */
	games = [
		PlazaGameConfig.Crash,
		PlazaGameConfig.Car,
		PlazaGameConfig.LHD,
		PlazaGameConfig.Horse_Racing,
		PlazaGameConfig.Mines,
	]
	protected initView(): boolean | void {
		let index = 0;
		let childs = this.Items.content.children;
		childs.forEach(element => {
			element.active = false;
		});
		this.loadBundleRes(fw.BundleConfig.plaza.res[`plaza/gameItems/gameItemsBase`], (res: Prefab) => {
			this.games.forEach(element => {
				let item = childs[index];
				if (!item) {
					item = this.Items.item.clone();
					item.parent = this.Items.content;
					let node = instantiate(res);
					node.parent = item;
					if((<any>item).gameData.kindIdName == "Crash") {
						node.onClickAndScale(() => {
							center.roomList.sendGetCrashRoomServerId()
						});
					} else {
						node.onClickAndScale(() => {
							center.roomList.sendGetRoomServerId(center.roomList.KIND_ID[(<any>item).gameData.kindIdName]);
						});
					}
					(<any>item).gameItem = node.getComponent(gameItemsBase);
				}
				item.active = true;
				(<any>item).gameData = element;
				(<any>item).gameItem.updateView(element);
				++index;
			});
		});
	}
}
