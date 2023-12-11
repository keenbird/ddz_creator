import './../other/_FWLogManager'
import './../__init'

let LanguageType = new Proxy({
    /**英文 */
    en: `en`,
    /**中文 */
    zh: `zh`,
    /**巴西 */
    brasil: `brasil`,
}, {
    get: (target, p, receiver) => {
        let v = Reflect.get(target, p, receiver);
        if (v == null) {
            Reflect.set(target, p, p, receiver);
        }
        return p;
    },
    set: (target, p, newValue, receiver) => {
        fw.printError(`LanguageType only ready`);
        return false;
    },
});

class Language extends (fw.FWClass) {
    _regExp = /\$\{([\w]+)\}/g;

    /**禁止外部实例化 */
    private constructor(...args: any[]) {
		super(...args);
    }
    /**单例 */
    private static _instance: Language
    /**获取单例 */
    public static getInstance() {
        return Language._instance ?? (Language._instance = new Language());
    }
    /**当前语言 */
    private _languageType: string
    /**当前语言 */
    public get languageType() {
        return this._languageType;
    }
    /**语言配置集合 */
    private _languageConfig: { [languageType: string]: OneLanguageConfig[] } = {}
    /**通过key获取文本 */
    init(languageType: string) {
        if (typeof (languageType) != `string`) {
            fw.printError(`languageType not string`);
            return;
        }
        if (this._languageType == languageType) {
            return;
        }
        //调整当前语言
        this._languageType = languageType;
        //缓存语言配置
        app?.file.setStringForKey(`LanguageType`, this._languageType, { all: true });
        //刷新显示
        this.update();
        //返回自身
        return this;
    }
    /**通过key获取语言语言资源 */
    get(key: string, data: GetExtParam = {}): any {
        let config = this._languageConfig[data.languageType ?? this._languageType];
        let str: any = data.bCanNone ? null : key;
        if (config) {
            for (let i = config.length - 1; i >= 0; --i) {
                let element = config[i];
                let value = element.languageConfig[key];
                if (value) {
                    str = value;
                    break;
                }
            }
        }
        return str;
    }
    /**通过key获取语言语言资源 */
    getString(key: string, data: GetStringParam = {}): any {
        let config = this._languageConfig[data.languageType ?? this._languageType];
        let str: string = key;
        if (config) {
            for (let i = config.length - 1; i >= 0; --i) {
                let element = config[i];
                let value = element.languageConfig[key];
                if (value && typeof value == "string") {
                    str = value;
                    break;
                }
            }
        }
        return str.replace(this._regExp, (_, v) => {
            return (data[v] ?? v) + "";
        });
    }
    /**添加语言配置 */
    addLanguageConfig(data: OneLanguageConfig) {
        //删除就配置
        this.delLanguageConfig(data);
        //新配置
        let config = this._languageConfig[data.languageType] ??= [];
        config.push(data);
        config.sort((a, b) => {
            return b.npriority - a.npriority;
        });
    }
    /**删除语言配置 */
    delLanguageConfig(data: OneLanguageConfig) {
        if (data.languageType) {
            let config = this._languageConfig[data.languageType];
            if (config) {
                for (let i = 0; i < config.length; ++i) {
                    if (config[i].unique == data.unique) {
                        config.splice(i, 1);
                        break;
                    }
                }
            }
        } else {
            for (let key in this._languageConfig) {
                let config = this._languageConfig[key];
                for (let i = 0; i < config.length; ++i) {
                    if (config[i].unique == data.unique) {
                        config.splice(i, 1);
                        break;
                    }
                }
            }
        }
    }
    /**刷新 */
    update() {
        //事件通知
        app?.event.dispatchEvent({
            eventName: `UpdateLanguage`,
        });
    }
}

/**优先使用优先级高的语言，同等优先级使用后添加的 */
enum LanguagePriority {
    /**通用 */
    Common,
    /**通用 */
    Main,
    /**大厅 */
    Plaza,
    /**游戏 */
    Game,
}

/**声明全局调用 */
declare global {
    namespace globalThis {
        type LanguageConfigType = string | (() => BundleResConfig)
        interface GetExtParam {
            /**未找到时是否返回空，默认返回key */
            bCanNone?: boolean
            /**语言类型，默认当前语言 */
            languageType?: string
        }

        interface GetStringParam {
            /**语言类型，默认当前语言 */
            languageType?: string
            /** 模式字符串传参*/
            [key: string]: any
        }
        interface LanguageConfig {
            [key: string]: LanguageConfigType
        }
        interface OneLanguageConfig {
            /**唯一标识符 */
            unique?: string
            /**语言类型 */
            languageType?: string
            /**语言优先级 */
            npriority?: LanguagePriority
            /**语言配置 */
            languageConfig?: LanguageConfig
        }
        interface _fw {
            /**语言模块单例 */
            language: Language
            /**语言优先级 */
            LanguagePriority: typeof LanguagePriority
            /**语言类型 */
            LanguageType: typeof LanguageType & { [key: string]: string }
        }
    }
}
//部分配置
fw.LanguageType = LanguageType
fw.LanguagePriority = LanguagePriority
//单例
fw.language = Language.getInstance()