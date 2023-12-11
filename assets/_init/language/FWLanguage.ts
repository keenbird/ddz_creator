import { Label, RichText, _decorator, assert } from 'cc';
const { ccclass } = _decorator;

@ccclass('FWLanguage')
export class FWLanguage extends (fw.FWComponent) {
    /**刷新列表 */
    elementList: LanguageOneElementParam[] = []
    /**监听事件 */
    initEvents(): boolean | void {
        this.bindEvent({
            eventName: `UpdateLanguage`,
            callback: this.updateLanguage.bind(this)
        });
    }
    /**刷新语言显示 */
    updateLanguage() {
        this.elementList.forEach(element => {
            this.updateOne(element);
        });
    }
    /**刷新单个 */
    updateOne(element: LanguageOneElementParam) {
        switch (element.type) {
            case ElementType.Params_Label : {
                //找到对应类型的组件
                let com = this.getComponent(Label) || this.getComponent(RichText);
                //刷新文本
                com.string = fw.language.getString(element.key,element.params);
                break
            }
            case ElementType.Label: {
                //找到对应类型的组件
                let com = this.getComponent(Label) || this.getComponent(RichText);
                //刷新文本
                com.string = fw.language.get(element.key);
                break;
            }
            case ElementType.Sprite: {
                let bundleResConfigFunc = fw.language.get(element.key, { bCanNone: true });
                if (bundleResConfigFunc) {
                    app.file.updateImage({
                        node: this.node,
                        bundleResConfig: (typeof (bundleResConfigFunc) == `function`) ? bundleResConfigFunc() : bundleResConfigFunc,
                    });
                }
                break;
            }
            case ElementType.Custom: {
                element.callback && element.callback(fw.language.get(element.key, { bCanNone: element.bCanNone }));
                break;
            }
            default:
                fw.printError(`FWLanguage updateLanguage error: ${element.type}`);
        }
    }
    /**自定义 */
    bindCustom(key: string, callback: (str: string) => void, bCanNone?: boolean) {
        //清理旧的绑定
        this.removeBind(ElementType.Custom);
        let element = {
            type: ElementType.Custom,
            callback: callback,
            bCanNone: bCanNone,
            key: key,
        }
        //添加新的绑定
        this.elementList.push(element);
        //默认刷新一次
        this.updateOne(element);
    }
    /**绑定参数文本 */
    bindParamsLabel(key: string,params:GetStringParam) {
        //清理旧的绑定
        this.removeBind(ElementType.Params_Label);
        let element = {
            type: ElementType.Params_Label,
            key: key,
            params:params,
        }
        //添加新的绑定
        this.elementList.push(element);
        //默认刷新一次
        this.updateOne(element);
    }
    /**绑定文本 */
    bindLabel(key: string) {
        //清理旧的绑定
        this.removeBind(ElementType.Label);
        let element = {
            type: ElementType.Label,
            key: key,
        }
        //添加新的绑定
        this.elementList.push(element);
        //默认刷新一次
        this.updateOne(element);
    }
    /**绑定图片，值是可以是一个函数需要返回BundleResConfig对象，或者是BundleResConfig对象 */
    bindSprite(key: string) {
        //清理旧的绑定
        this.removeBind(ElementType.Sprite);
        let element = {
            type: ElementType.Sprite,
            key: key,
        }
        //添加新的绑定
        this.elementList.push(element);
        //默认刷新一次
        this.updateOne(element);
    }
    /**清理绑定 */
    removeBind(type: ElementType) {
        app.func.positiveTraversal(this.elementList, (element, index) => {
            if (element.type == type) {
                this.elementList.splice(index, 1);
                return true;
            }
        });
    }
}

enum ElementType {
    /**文本 */
    Label,
    /**参数文本 */
    Params_Label,
    /**精灵 */
    Sprite,
    /**精灵 */
    Custom,
}

/**声明全局调用 */
declare global {
    namespace globalThis {
        type LanguageOneElementParam = {
            /**处理类型 */
            type: ElementType,
            /**键值 */
            key: string,
            /**配置不存在是否返回空 */
            bCanNone?: boolean
            /**参数文本传入的参数 */
            params?:GetStringParam,
            /**自定义翻译回调 */
            callback?: (str: string) => void
        }
        interface _fw {
            FWLanguage: typeof FWLanguage
        }
    }
}
fw.FWLanguage = FWLanguage;