import { sp, SpriteFrame, _decorator } from 'cc';
const { ccclass } = _decorator;

import { GameMarkType } from '../../script/plaza_game_config';
import { LanguageSprite } from '../../../../_init/language/component/LanguageSprite';

@ccclass('gameItemsBase')
export class gameItemsBase extends (fw.FWComponent) {
	protected initView(): boolean | void {
		//隐藏部分界面
		this.Items.Sprite_game_mark.active = false;
	}
	//刷新界面
	updateView(data: OnePlazaGameConfigParam) {
		//（标记）
		if (!fw.isNull(data.nMarkType)) {
			this.Items.Sprite_game_mark.active = true;
			switch (data.nMarkType) {
				case GameMarkType.Hot: {
					app.file.updateImage({
						bAutoShowHide: true,
						node: this.Items.Sprite_game_mark,
						bundleResConfig: fw.BundleConfig.plaza.res[`plaza/gameItems/img/DT_hot_bg/spriteFrame`],
					});
					app.file.updateImage({
						bAutoShowHide: true,
						node: this.Items.Sprite_game_mark_txt,
						bundleResConfig: fw.BundleConfig.plaza.res[`plaza/gameItems/img/DT_hot/spriteFrame`],
					});
					break;
				}
				case GameMarkType.New: {
					app.file.updateImage({
						bAutoShowHide: true,
						node: this.Items.Sprite_game_mark,
						bundleResConfig: fw.BundleConfig.plaza.res[`plaza/gameItems/img/DT_new_bg/spriteFrame`],
					});
					this.Items.Sprite_game_mark_txt.obtainComponent(fw.FWLanguage).bindSprite(`DT_new`);
					break;
				}
				default: {
					this.Items.Sprite_game_mark.active = false;
				}
			}
		} else {
			this.Items.Sprite_game_mark.active = false;
		}
		//（名称），（“动画” 或 “图标”）
		if (data.animName) {
			this.Items.Spine_game_icon.getComponent(sp.Skeleton).setAnimation(0, data.animName, true);
			while (true) {
				if (data.nameRes) {
					let nameRes_ = data.nameRes
					if (fw.language.languageType == fw.LanguageType.brasil && data.nameResP) {
						nameRes_ = data.nameResP
					}
					this.Items.Sprite_game_name.updateSprite(nameRes_, { bAutoShowHide: true });
					let languageSprite = this.Items.Sprite_game_name.obtainComponent(LanguageSprite)
					languageSprite.loadBundleRes(data.nameRes, (res: SpriteFrame) => {
						languageSprite.setLanguageSpriteFrame("en", res);
					});
					if (data.nameResP) {
						languageSprite.loadBundleRes(data.nameResP, (res: SpriteFrame) => {
							languageSprite.setLanguageSpriteFrame("brasil", res);
						});
					}
					languageSprite.updateLanguage();
					break;
				}
				let gameConfig = data.gameConfig;
				if (gameConfig) {
					let nameResP = fw.BundleConfig.plaza.res[`plaza/gameItems/img/DT_${gameConfig.gameName}_txt_brasil/spriteFrame`]
					let nameRes = fw.BundleConfig.plaza.res[`plaza/gameItems/img/DT_${gameConfig.gameName}_txt/spriteFrame`]
					let nameRes_ = nameRes
					if (fw.language.languageType == fw.LanguageType.brasil) {
						nameRes_ = nameResP
					}
					this.Items.Sprite_game_name.updateSprite(nameRes_, { bAutoShowHide: true });
					let languageSprite = this.Items.Sprite_game_name.obtainComponent(LanguageSprite)
					languageSprite.loadBundleRes(nameRes, (res: SpriteFrame) => {
						languageSprite.setLanguageSpriteFrame("en", res);
					});
					languageSprite.loadBundleRes(nameResP, (res: SpriteFrame) => {
						languageSprite.setLanguageSpriteFrame("brasil", res);
					});
					languageSprite.updateLanguage();
					break;
				}
				break;
			}
			this.Items.Spine_game_icon.active = true;
			this.Items.Sprite_game_icon.active = false;
		} else {
			this.Items.Spine_game_icon.active = false;
			this.Items.Sprite_game_icon.active = true;
			this.Items.Sprite_game_icon.updateSprite(fw.BundleConfig.plaza.res[`plaza/gameItems/img/DT_MoreGame/spriteFrame`], { bAutoShowHide: true });
			this.Items.Sprite_game_name.updateSprite(fw.BundleConfig.plaza.res[`plaza/gameItems/img/DT_MoreGame_txt/spriteFrame`], { bAutoShowHide: true });
		}
	}
}
