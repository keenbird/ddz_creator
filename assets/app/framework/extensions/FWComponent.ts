import { _decorator, Node as ccNode, Component, Asset, Size, AssetManager, js } from 'cc';
import { EDITOR } from 'cc/env';
const { ccclass } = _decorator;

/**以下实现都基于Component已经添加在Node下 */
if (!EDITOR) {
    //给Component添加datas属性
    Object.defineProperty(Component.prototype, `data`, {
        get: function () {
            if (this.node) {
                if (this._data != undefined) {
                    this.node.data = this._data;
                    this._data = undefined;
                    delete this._data;
                }
                return this.node.data;
            } else {
                return this._data;
            }
        },
        set: function (data: any) {
            if (this.node) {
                this._data = undefined;
                delete this._data;
                this.node.data = data;
            } else {
                this._data = data;
            }
        },
    });
    //给Component添加Items属性
    Object.defineProperty(Component.prototype, `Items`, {
        get: function () {
            return this.node.Items;
        },
        set: function (item: { [key: string]: ccNode }) {
            this.node.Items = item;
        },
    });
    //给Component添加size属性
    Object.defineProperty(Component.prototype, `size`, {
        get: function () {
            return this.node.size;
        },
        set: function (s: Size) {
            return this.node.size = s;
        },
    });
    //添加自动清理资源
    Component.prototype.addDecRefRes = function (asset: Asset) {
        this.node && this.node.addDecRefRes(asset);
    }
    //点击
    Component.prototype.onClick = function (callback: Function, data?: FWButtonParam): void {
        this.node.onClick(callback, data);
    };
    Component.prototype.onClickAndScale = function (callback: Function, data?: FWButtonParam): void {
        this.node.onClickAndScale(callback, data);
    };
    //获取组件，没有则自动添加
    Component.prototype.obtainComponent = function <T extends Component>(t: new (...args: any[]) => T): T {
        return this.node.obtainComponent(t);
    };
    //单次定时器
    Component.prototype.setTimeout = function (callback: Function, time: number, bImmediately?: boolean): number {
        return this.node.setTimeout(callback, time, bImmediately);
    };
    //循环定时器
    Component.prototype.setInterval = function (callback: Function, time: number, bImmediately?: boolean): number {
        return this.node.setInterval(callback, time, bImmediately);
    };
    //移除定时器
    Component.prototype.clearTimeoutTimer = function (nTimer: number, bDestroy?: boolean): void {
        this.node.clearTimeoutTimer(nTimer, bDestroy);
    };
    //移除定时器
    Component.prototype.clearIntervalTimer = function (nTimer: number, bDestroy?: boolean): void {
        this.node.clearIntervalTimer(nTimer, bDestroy);
    };
    //监听native事件
    Component.prototype.addNativeEventListener = function (nativeEventName: string, callback: NativeEventCallback, bCanRepeate?: boolean): void {
        this.node.addNativeEventListener(nativeEventName, callback, bCanRepeate);
    }
    Component.prototype.removeNativeEventListener = function (nativeEventName: string, callback: NativeEventCallback): void {
        this.node.removeNativeEventListener(nativeEventName, callback);
    }
    Component.prototype.handlerNativeEventListener = function (data: HandlerNativeEventListenerParam): string {
        return this.node.handlerNativeEventListener(data);
    }
    //绑定事件
    Component.prototype.bindEvent = function (data: FWBindEventParam): void {
        this.node.bindEvent(data);
    }
    //移除事件
    Component.prototype.removeEvent = function (data: FWRemoveEventParam): void {
        this.node.removeEvent(data);
    }
    //移除所有事件（通过节点自身api绑定的事件）
    Component.prototype.removeAllEvent = function (): void {
        this.node.removeAllEvent();
    }
    //加载子包
    Component.prototype.loadBundle = function (bundleConfig: BundleConfigType | BundleResConfig, callback?: (bundle: AssetManager.Bundle) => void, data?: LoadBundleExtendParam):void {
        app.assetManager.loadBundle(bundleConfig, callback, Object.assign(data ?? {}, { valideTarget: this }));
    }
    //加载子包中的资源
    Component.prototype.loadBundleRes = function<T extends Asset> (bundleResConfig: BundleResConfig, type?: any, callback?: any, data?: AssetLoadExtendParam):void {
        //调整参数
        const isValidType = js.isChildClassOf(type as Constructor<Asset>, Asset);
        !data && ((typeof (callback) != `function`) ? (data = callback ?? {}, callback = null) : (data = {}));
        !callback && !isValidType && (typeof (type) == `function`) && (callback = type, type = null);
        app.assetManager.loadBundleRes(bundleResConfig, type, callback, Object.assign(data ?? {}, { valideTarget: this }));
    }
    //同步加载子包中的资源
    Component.prototype.loadBundleResSync = function (bundleResConfig: BundleResConfig, type?: any) {
        return app.assetManager.loadBundleResSync(bundleResConfig, type)
    }
}

declare module 'cc' {
    /**Component扩展 */
    interface Component {
        /**添加自动清理资源 */
        addDecRefRes: (asset: Asset) => void
        /**节点引用容器 */
        Items: { [key: string]: ccNode }
        /**获取节点尺寸（前提是有UITransform组件） */
        size: Size
        /**点击事件 */
        onClick(callback: Function, data?: FWButtonParam): void
        onClickAndScale(callback: Function, data?: FWButtonParam): void
        /**获取组件，没有则自动添加 */
        obtainComponent<T extends Component>(t: new (...args: any[]) => T): T
        /**单次定时器（秒级） */
        setTimeout(callback: Function, time: number, bImmediately?: boolean): number
        /**循环定时器（秒级） */
        setInterval(callback: Function, time: number, bImmediately?: boolean): number
        /**移除定时器 */
        clearTimeoutTimer(nTimer: number, bDestroy?: boolean): void
        /**移除定时器 */
        clearIntervalTimer(nTimer: number, bDestroy?: boolean): void
        /**监听native事件 */
        handlerNativeEventListener(data: HandlerNativeEventListenerParam): string
        addNativeEventListener(nativeEventName: string, callback: NativeEventCallback, bCanRepeate?: boolean): void
        removeNativeEventListener(nativeEventName: string, callback: NativeEventCallback): void
        /**绑定事件 */
        bindEvent(data: FWBindEventParam): void
        /**移除事件 */
        removeEvent(data: FWRemoveEventParam): void
        /**移除所有事件（通过节点自身api绑定的事件） */
        removeAllEvent(): void
        /**加载子包 */
        loadBundle(bundleConfig: BundleConfigType | BundleResConfig, callback?: (bundle: AssetManager.Bundle) => void, data?: LoadBundleExtendParam):void
        /**加载子包中的资源 */
        loadBundleRes<T extends Asset>(bundleResConfig: BundleResConfig, callback?: AssetLoadCallbackParam<T>, data?: AssetLoadExtendParam):void
        loadBundleRes<T extends Asset>(bundleResConfig: BundleResConfig, type: AssetLoadTypeParam<T>, callback?: AssetLoadCallbackParam<T>, data?: AssetLoadExtendParam):void
        loadBundleRes<T extends Asset>(bundleResConfig: BundleResConfig, type?: any, callback?: any, data?: AssetLoadExtendParam):void
        /**同步加载子包中的资源 */
        loadBundleResSync<T extends Asset>(bundleResConfig: BundleResConfig, type?: AssetLoadTypeParam<T>): T
    }
}
