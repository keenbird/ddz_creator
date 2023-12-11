import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('language_GameBase')
export class language_GameBase extends (fw.FWComponent) {
    private _loadedLanguage:OneLanguageConfig[] = []
    protected initData(): boolean | void {
        super.initData();
        this.addLanguageConfig([
            {
                unique: fw.BundleConfig.GameBase.bundleName,
                languageType: fw.LanguageType.en,
                languageConfig: {
                    //文本
                    [`ChipMaskRich`]: `Recharge to become a <color=#E2DB35><u>VIP Player</></> to unlock`,
                    //精灵--began---------------------------------------
                    //精灵--end-----------------------------------------
                }
            },
            {
                unique: fw.BundleConfig.GameBase.bundleName,
                languageType: fw.LanguageType.brasil,
                languageConfig: {
                    //文本
                    //下注总金额超出限制
                    [`The total bet amount exceeds the limit`]: `O valor total da aposta excede o limite`,
                    //限制下注遮罩
                    [`ChipMaskRich`]: `Somente<color=#E2DB35><u> Jogador VIP</></> podem usar`,
                    //菜单
                    [`Menu`]: `Menu`,
                    [`Exit to lobby`]: `Sair`,
                    [`How to play`]: `Regra do jogo`,
                    [`Settings`]: `configuração`,
                    //精灵--began---------------------------------------
                    //精灵--end-----------------------------------------
                }
            }
        ]);
    }
    /**添加语言配置 */
    addLanguageConfig(languageList: OneLanguageConfig[]) {
        languageList && languageList.forEach(element => {
            fw.language.addLanguageConfig(<OneLanguageConfig>(Object.assign({
                unique: app.gameManager.gameConfig.bundleConfig.bundleName,
                npriority: fw.LanguagePriority.Game,
            }, element)));
            this._loadedLanguage.push(element);
        });
    }

    onViewDestroy(): void {
        this._loadedLanguage.forEach(element => {
            fw.language.delLanguageConfig(element);
        });
        this._loadedLanguage = [];
        super.onViewDestroy();
    }
}

/**类型声明调整 */
declare global {
    namespace globalThis {
        type type_language_GameBase = language_GameBase
        type languageItemParam = {

        }
    }
}
