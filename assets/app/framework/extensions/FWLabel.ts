import { _decorator, Label } from 'cc';
import { EDITOR } from 'cc/env';

if (!EDITOR) {
    // //调整Label的string参数，主要用于多语言支持
    // Object.defineProperty(Label.prototype, `__string_old`, Object.getOwnPropertyDescriptor(Label.prototype, `string`));
    // Object.defineProperty(Label.prototype, `string`, {
    //     get: function () {
    //         return this.__string_old;
    //     },
    //     set: function (str: string) {
    //         this.__string_old = fw.language.get(this._original_string = str);
    //     },
    // });
    // /**原始文本（未转换多语言） */
    // Object.defineProperty(Label.prototype, `_original_string`, fw.configurable());
    // /**多语言刷新 */
    // Label.prototype.updateLanguage = function () {
    //     this.__string_old = fw.language.get(this._original_string ?? (this._original_string = this.__string_old));
    // }
    // /**__preload */
    // if (!Label.prototype.____preload_old) {
    //     Label.prototype.____preload_old = Label.prototype.__preload;
    //     Label.prototype.__preload = function () {
    //         this.bindEvent({
    //             bOne: true,
    //             eventName: `UpdateLanguage`,
    //             callback: () => {
    //                 this.updateLanguage();
    //             }
    //         });
    //         this.____preload_old();
    //         //这里主要是刷新预制体中创建的Label
    //         this.updateLanguage();
    //     }
    // }
}

declare module 'cc' {
    /**Node扩展 */
    interface Label {
        /**旧string属性 */
        __string_old: number
        /**原始文本（未转换多语言） */
        _original_string: number
        /**多语言刷新 */
        updateLanguage: () => void
        // /**新__preload函数，由于提示的问题这里注释掉 */
        // __preload: () => void
        /**旧__preload函数 */
        ____preload_old: () => void
    }
}

export { }
