import { _decorator, Layout } from 'cc';
import { EDITOR } from 'cc/env';

if (!EDITOR) {
    //刷新布局
    if (!Layout.prototype.__updateLayout_old) {
        Layout.prototype.__updateLayout_old = Layout.prototype.updateLayout;
        Layout.prototype.updateLayout = function (force: boolean): void {
            force ??= false;
            if (force) {
                this._layoutDirty = true;
                this._childrenDirty = true;
            }
            this.__updateLayout_old(force);
        }
    }
    //重写_checkUsefulObj，原因：源码在获取节点时需节点全局可见
    (<any>Layout.prototype)._checkUsefulObj = function (): void {
        this._usefulLayoutObj.length = 0;
        const children = this.node.children;
        for (let i = 0; i < children.length; ++i) {
            const child = children[i];
            const uiTrans = child._uiProps.uiTransformComp;
            if (child.active && uiTrans) {
                this._usefulLayoutObj.push(uiTrans);
            }
        }
    }
}

declare module 'cc' {
    /**Layout扩展 */
    interface Layout {
        /**刷新布局 */
        updateLayout(force?: boolean): void
        /**原始updateLayout */
        __updateLayout_old(force?: boolean): void
    }
}

/**类型声明调整 */
declare global {
    namespace globalThis {
        //TODO
    }
}

export { }
