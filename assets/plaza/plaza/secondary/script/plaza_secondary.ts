import { _decorator, Node as ccNode, ScrollView } from 'cc';
const { ccclass } = _decorator;

import { plaza_secondary_base } from './plaza_secondary_base';
import { PlazaGameConfig } from '../../script/plaza_game_config';
import { COMBINE_ID } from '../../../../app/center/plaza/roomListCenter';
import { plaza_secondary_content } from '../gameContents/base/plaza_secondary_content';

@ccclass('plaza_secondary')
export class plaza_secondary extends plaza_secondary_base {
	/**是否重刷 */
	bRefresh: boolean = false
	/**当前选中 */
	selectName: string
	protected initView(): boolean | void {
		//隐藏部分界面
		this.Items.Node_btn_game.active = false;
	}
	public onViewEnter(): void {
		//刷新菜单
		this.bRefresh = true;
		this.updateGameMenu();
		this.bRefresh = false;
	}
	public onClickClose(): void {
		//清理数据
		this.selectName = ``;
		//关闭界面
		super.onClickClose();
	}
	updateGameMenu() {
		let isRummygame = app.sdk.isSdkOpen("rummygame");
		let isRummyLayerMode = center.roomList.checkRummyLayerMode();
		let games = isRummygame || isRummyLayerMode ? this.reviewGames() : this.normalGames();
		app.func.positiveTraversal(games, (element) => {
			if (!element.sdk || app.sdk.isSdkOpen(element.sdk)) {
				if (element.combines) {
					app.func.positiveTraversal(element.combines, (elementEx) => {
						element.roomList = center.roomList.getRoomCombineByCombineIDAndPlayerNum(elementEx);
					});
				}
			}
		});
		let index = 0;
		let defaultIndex = -1;
		let btns: FWOneMenuBtnParam<unknown>[] = [];
		let childs = this.Items.content.children;
		app.func.positiveTraversal(games, (element) => {
			if (!element.roomList && !element.bClassification) {
				return;
			}
			let tempIndex = index;
			let item = childs[tempIndex];
			if (!item) {
				item = this.Items.Node_btn_game.clone();
				this.Items.content.addChild(item);
			}
			//默认
			if (defaultIndex < 0) {
				if (this.selectName) {
					if (this.selectName == element.name) {
						defaultIndex = tempIndex;
					}
				} else {
					app.func.positiveTraversal(element.linkPlazaGameConfig, elementEx => {
						if (elementEx == this.data.extend.plazaGameConfig) {
							defaultIndex = tempIndex;
							return true;
						}
					});
				}
			}
			btns.push({
				node: item,
				callback: () => {
					this.selectName = element.name;
					//刷新界面
					let tempData = this.bRefresh ? Object.assign({}, element, { extend: this.data.extend.plazaGameConfig }) : element;
					this.addView({
						data: tempData,
						bHideOther: true,
						viewConfig: element.viewRes,
						parent: this.Items.Node_content,
						callback: (view: ccNode) => {
							//非分类标签时选择默认菜单
							if (!element.bClassification) {
								view.getComponent(plaza_secondary_content).setMenuDefault(tempData.extend);
							}
						}
					});
					//使节点在视图中
					this.Items.ScrollView.getComponent(ScrollView).setNodeInView({
						node: item
					});
				}
			});
			item.Items.Sprite_icon.updateSprite(element.iconRes, { bAutoShowHide: true });
			if (element.nameRes.path) {
				item.Items.Sprite_name.updateSprite(element.nameRes as BundleResConfig, { bAutoShowHide: true });
			} else {
				item.Items.Sprite_name.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
					app.file.updateImage({
						node: item.Items.Sprite_name,
						bundleResConfig: element.nameRes[fw.language.languageType],
						bAutoShowHide: true,
					});
				});
			}
			item.active = true;
			++index;
		});
		for (let j = childs.length; index < j; ++index) {
			childs[index].active = false;
		}
		app.func.createMenu({
			btns: btns,
			defaultIndex: defaultIndex,
		});
	}
	normalGames(): SecondaryGameParam[] {
		return [
			{
				name: `troco`,
				nameRes: fw.BundleConfig.plaza.res[`plaza/secondary/gameItems/img/atlas/EJ_tab_paulista_en/spriteFrame`],
				iconRes: fw.BundleConfig.plaza.res[`plaza/secondary/gameItems/img/atlas/EJ_tab_paulista/spriteFrame`],
				linkPlazaGameConfig: [
					PlazaGameConfig.Truco,
				],
				combines: [
					COMBINE_ID.truco_Paulista,
				],
				extend: { combine: COMBINE_ID.truco_Paulista },
				viewRes: fw.BundleConfig.plaza.res[`plaza/secondary/gameContents/truco/plaza_secondary_truco`]
			},
			{
				name: `bairen`,
				nameRes: {
					[fw.LanguageType.en]: fw.BundleConfig.plaza.res[`plaza/secondary/gameItems/img/atlas/EJ_tab_bairen_txt/spriteFrame`],
					[fw.LanguageType.brasil]: fw.BundleConfig.plaza.res[`plaza/secondary/gameItems/img/atlas/EJ_tab_bairen_txt_brasil/spriteFrame`],
				},
				iconRes: fw.BundleConfig.plaza.res[`plaza/secondary/gameItems/img/atlas/EJ_tab_bairen/spriteFrame`],
				bClassification: true,
				viewRes: fw.BundleConfig.plaza.res[`plaza/secondary/gameContents/bairen/plaza_secondary_bairen`]
			},
			{
				name: `slot`,
				nameRes: fw.BundleConfig.plaza.res[`plaza/secondary/gameItems/img/atlas/EJ_tab_slot_txt/spriteFrame`],
				iconRes: fw.BundleConfig.plaza.res[`plaza/secondary/gameItems/img/atlas/EJ_tab_slot/spriteFrame`],
				bClassification: true,
				viewRes: fw.BundleConfig.plaza.res[`plaza/secondary/gameContents/slot/plaza_secondary_slot`]
			},
		];
	}
	reviewGames(): SecondaryGameParam[] {
		return [
			{
				nameRes: fw.BundleConfig.plaza.res[`plaza/secondary/gameItems/img/atlas/EJ_tab_paulista_en/spriteFrame`],
				iconRes: fw.BundleConfig.plaza.res[`plaza/secondary/gameItems/img/atlas/EJ_tab_paulista/spriteFrame`],
				linkPlazaGameConfig: [
					PlazaGameConfig.Truco,
				],
				combines: [
					COMBINE_ID.truco_Paulista,
				],
				extend: { combine: COMBINE_ID.truco_Paulista },
				viewRes: fw.BundleConfig.plaza.res[`plaza/secondary/gameContents/truco/plaza_secondary_truco`]
			},
		];
	}
}

/**声明全局调用 */
declare global {
	namespace globalThis {
		type SecondaryGameParam = {
			/**配置名称 */
			name?: string
			/**二级界面的次级界面资源“右侧界面” */
			viewRes: BundleResConfig
			/**大厅关联配置 */
			linkPlazaGameConfig?: OnePlazaGameConfigParam[]
			/**图标预制资源 */
			iconRes?: BundleResConfig
			/**文本预制资源 */
			nameRes?: BundleResConfig | { [languageType: string]: BundleResConfig }
			/**sdk控制开关 */
			sdk?: String
			/**服务器房间数据 */
			roomList?: any[]
			/**是否仅是分类标签（不需要检测是否有房间） */
			bClassification?: boolean
			/**自定义分组（二级界面的次级菜单“右侧菜单”） */
			combines?: number[]
			/**扩展参数（二级界面主菜单“左侧菜单”） */
			extend?: OnePlazaGameConfigParam
		}
	}
}
