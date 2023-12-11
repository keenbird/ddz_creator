import { _decorator } from 'cc';
const { ccclass } = _decorator;
 
@ccclass('realGame_GameBase')
export class realGame_GameBase extends (fw.FWComponent) {
	protected initView(): boolean | void {
		//--多语言处理--began------------------------------------------
		//文本
		//精灵
		this.Items.Sprite_real_game_txt.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
		    app.file.updateImage({
		        node: this.Items.Sprite_real_game_txt,
		        bundleResConfig: ({
		            [fw.LanguageType.en]: () => { return app.game.getRes(`ui/realGame/img/atlas/btn_realgame_txt/spriteFrame`); },
		            [fw.LanguageType.brasil]: () => { return app.game.getRes(`ui/realGame/img/atlas/btn_realgame_txt_brasil/spriteFrame`); },
		        })[fw.language.languageType](),
		    });
		});
		//--多语言处理--end--------------------------------------------
	}
	protected initBtns(): boolean | void {
		this.node.onClickAndScale(() => {
			if (app.game.main.getGotoRealVisible()) {
				app.game.main.gotoReal();
			}
		});
	}
}
