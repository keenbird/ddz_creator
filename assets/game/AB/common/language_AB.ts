import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { language_GameBase } from '../../GameBase/common/language_GameBase';

@ccclass('language_AB')
export class language_AB extends language_GameBase {
    protected initData(): boolean | void {
        super.initData();
        //添加语言配置
        this.addLanguageConfig([
            {
                unique: fw.BundleConfig.AB.bundleName,
                languageType: fw.LanguageType.en,
                languageConfig: {
                    //TODO
                }
            },
            {
                unique: fw.BundleConfig.AB.bundleName,
                languageType: fw.LanguageType.brasil,
                languageConfig: {
                    [`You have been put on Auto-Play for missing a turn`]: `आपका समय समाप्त हो गया है और स्वचालित रूप से संसाधित हो गए हैं`,
                    [`I'm back`]: `मैं वापस आ गया हूं`,
                    [`Round`]: `गोल`,
                    [`BAHAR`]: `बहारी`,
                    [`ANDAR`]: `अंदर`,
                    [`SKIP`]: `छोड़ें`,
                }
            },
        ]);
    }
}

/**类型声明调整 */
declare global {
    namespace globalThis {
        type type_language_AB = language_AB
    }
}
