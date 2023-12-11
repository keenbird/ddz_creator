import { Label, RichText, Sprite, SpriteFrame, _decorator, assert } from 'cc';
const { ccclass,menu,executionOrder,property,requireComponent,disallowMultiple } = _decorator;

@ccclass('LocalizedSpriteItem')
class LocalizedSpriteItem {
    @property({readonly:true})
    language: string = 'zh';
    @property({
        type: SpriteFrame,
    })
    spriteFrame: SpriteFrame | null = null;
    constructor(language) {
        this.language = language;
    }
}

@ccclass('LanguageSprite')
@menu("language/LanguageSprite")
@executionOrder(10)
@requireComponent(Sprite)
@disallowMultiple(true)
export class LanguageSprite extends (fw.FWComponent) {
    @property(LocalizedSpriteItem)
    spriteItem_en:LocalizedSpriteItem = new LocalizedSpriteItem("en");
    @property(LocalizedSpriteItem)
    spriteItem_brasil:LocalizedSpriteItem = new LocalizedSpriteItem("brasil");

    _sprite:Sprite;
    _languageConfig:Map<string,SpriteFrame>;

    protected initData(): boolean | void {
        //生成多语言配置
        this._languageConfig = new Map();
        Object.values(this).forEach(v=>{
            if( v instanceof LocalizedSpriteItem) {
                this._languageConfig.set(v.language,v.spriteFrame)
            }
        })
    }

    protected initView(): boolean | void {
        this._sprite = this.obtainComponent(Sprite);
        this.updateLanguage();
    }

    /**监听事件 */
    initEvents(): boolean | void {
        this.bindEvent({
            eventName: `UpdateLanguage`,
            callback: this.updateLanguage.bind(this)
        });
    }

    setLanguageSpriteFrame(language:string,spriteFrame:SpriteFrame) {
        this._languageConfig.set(language,spriteFrame)
    }

    /**刷新语言显示 */
    updateLanguage() {
        let languageType = fw.language.languageType;
        if(this._languageConfig.has(languageType)) {
            let spriteFrame = this._languageConfig.get(languageType);
            if(spriteFrame) {
                this._sprite.spriteFrame = spriteFrame;
            }
        }
    }
}