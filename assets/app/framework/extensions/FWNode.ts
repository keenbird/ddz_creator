import { _decorator, Node as ccNode, Button, Component, isValid, instantiate, Asset, Label, v3, UITransform, size, Size, AssetManager, native, UIOpacity, Sprite, ImageAsset, SpriteFrame, Texture2D, js } from 'cc';
import { FWButton } from './FWButton';
import { EDITOR } from 'cc/env';

if (!EDITOR) {
    /**重写_destruct函数，节点销毁时触发 */
    if (!ccNode.prototype.__old_destruct) {
        ccNode.prototype.__old_destruct = ccNode.prototype._destruct;
        ccNode.prototype._destruct = function (): void {
            //清理事件
            this.removeAllEvent();
            //资源释放
            if (this._destroyResList) {
                this._destroyResList.forEach((element: Asset) => {
                    //引用计数-1
                    element.decRef(true);
                });
            }
            //定时器销毁
            if (this.__timer_map) {
                for (let [key, value] of this.__timer_map) {
                    value.forEach((element: number) => {
                        if (key == `timeout`) {
                            this.clearTimeoutTimer(element, true);
                        } else if (key == `interval`) {
                            this.clearIntervalTimer(element, true);
                        } else {
                            fw.printWarn(`clear timer error: unknow timer type -> ${key}`);
                        }
                    });
                }
                this.__timer_map.clear();
                this.__timer_map = null;
            }
            //销毁原生回调监听
            if (this._nativeEvents) {
                for (let [nativeEventName, funcs] of this._nativeEvents) {
                    if (typeof (funcs) == `function`) {
                        native.jsbBridgeWrapper?.removeNativeEventListener(nativeEventName, funcs);
                    } else {
                        funcs.forEach(func => {
                            native.jsbBridgeWrapper?.removeNativeEventListener(nativeEventName, func);
                        });
                    }
                }
            }
            return this.__old_destruct();
        }
    }
    //给Node添加Items属性
    Object.defineProperty(ccNode.prototype, `Items`, {
        get: function () {
            if (!fw.isValid(this._Items)) {
                app.func.getTargetItems(this);
            }
            return this._Items;
        },
        set: function (item: { [key: string]: ccNode }) {
            this._Items = item;
        },
    });
    //给Node添加size属性
    Object.defineProperty(ccNode.prototype, `size`, {
        get: function () {
            let t = this.getComponent(UITransform);
            if (t) {
                return size(t.contentSize);
            } else {
                return size();
            }
        },
        set: function (s: Size) {
            let t = this.getComponent(UITransform);
            if (t) {
                t.setContentSize(s);
            }
        },
    });
    //给Node添加visible属性
    Object.defineProperty(ccNode.prototype, `visible`, {
        get: function () {
            return this._visible;
        },
        set: function (visible: boolean) {
            if (this._visible == visible) {
                return;
            }
            this._visible = visible;
            this.obtainComponent(UIOpacity).opacity = this._visible ? 255 : 0;
        },
    });
    //给Node添加string属性（前提是有Label组件）
    Object.defineProperty(ccNode.prototype, `string`, {
        get: function () {
            return this.obtainComponent(Label).string;
        },
        set: function (str: string) {
            this.obtainComponent(Label).string = str;
        },
    });
    //异步设置spriteFrame（前提是有Sprite组件）
    ccNode.prototype.updateSprite = function (bundleResConfig: BundleResConfig, data?: FWUpdateSpriteParam) {
        app.file.updateImage(Object.assign({
            node: this,
            bundleResConfig: bundleResConfig,
        }, data ?? {}));
    }
    //同步设置spriteFrame（前提是有Sprite组件）
    ccNode.prototype.updateSpriteSync = function (bundleResConfig: BundleResConfig) {
        if (!bundleResConfig) {
            return;
        }
        let sprite = this.getComponent(Sprite);
        if (!sprite) {
            return;
        }
        sprite.spriteFrame = this.loadBundleResSync(bundleResConfig);
    }
    //同步设置spriteFrame（前提是有Sprite组件）
    ccNode.prototype.setSpriteFrameByImageAsset = function (imageAsset: ImageAsset) {
        let sprite = this.getComponent(Sprite);
        if (!sprite) {
            return;
        }
        //调整显示
        const spriteFrame = new SpriteFrame();
        const texture = new Texture2D();
        texture.image = imageAsset;
        spriteFrame.texture = texture;
        sprite.spriteFrame = spriteFrame;
        this.addDecRefRes(spriteFrame);
        this.addDecRefRes(texture);
    }
    //添加自动清理资源
    ccNode.prototype.addDecRefRes = function (asset: Asset) {
        (this._destroyResList ??= []).push(asset);
    }
    //移除所有孩子
    if (!ccNode.prototype.__old_removeAllChildren) {
        ccNode.prototype.__old_removeAllChildren = ccNode.prototype.removeAllChildren;
        ccNode.prototype.removeAllChildren = function (bDestroy?: boolean): void {
            // if (bDestroy) {
            //     this.children.forEach((element: ccNode) => {
            //         isValid(element, true) && element.destroy();
            //     });
            // }
            // this.__old_removeAllChildren();
            if (bDestroy) {
                this.destroyAllChildren();
            } else {
                this.__old_removeAllChildren();
            }
        }
    }
    //移除自身
    if (!ccNode.prototype.__old_removeFromParent) {
        ccNode.prototype.__old_removeFromParent = ccNode.prototype.removeFromParent;
        ccNode.prototype.removeFromParent = function (bDestroy?: boolean): void {
            // this.__old_removeFromParent();
            // bDestroy && isValid(this, true) && this.destroy();
            if (bDestroy) {
                this.destroy();
            } else {
                this.__old_removeFromParent();
            }
        }
    }
    //点击
    ccNode.prototype.onClick = function (callback: Function, data?: FWButtonParam): void {
        //记录回调函数
        if (this.__callback) {
            this.__callback = callback;
            return;
        } else {
            this.__callback = callback;
        }
        data ??= {};
        //自定义控件
        let classConstructor = data.classConstructor ?? FWButton;
        //添加按钮控件
        let button = this.getComponent(Button);
        let fwButton = this.getComponent(classConstructor);
        if (!fwButton && button) {
            this.removeComponent(button);
            app.func.isWin32() && fw.printError();
        }
        this.obtainComponent(classConstructor).updateButton(data);
        //添加回调
        this.off(Button.EventType.CLICK);
        this.on(Button.EventType.CLICK, () => {
            try {
                this.__callback?.();
            } catch (error) {
                fw.printError(error)
            }
            //播放按钮点击音效
            !data.bNotAudio && app.audio.playEffect(fw.BundleConfig.resources.res[`audio/button_click_1`]);
        });
    }
    ccNode.prototype.onClickAndScale = function (callback: Function, data?: FWButtonParam): void {
        this.onClick(callback, Object.assign(data ?? {}, { transition: Button.Transition.SCALE }));
    }
    //添加子节点
    if (!ccNode.prototype._addChild_) {
        ccNode.prototype._addChild_ = ccNode.prototype.addChild;
        ccNode.prototype.addChild = function (child: ccNode) {
            //添加子节点
            this._addChild_(child);
            //扩展Items
            app.func.getTargetItems(child, this.Items);
        }
    }
    if (!ccNode.prototype._insertChild_) {
        ccNode.prototype._insertChild_ = ccNode.prototype.insertChild;
        ccNode.prototype.insertChild = function (child: ccNode, siblingIndex: number): void {
            //添加子节点
            this._insertChild_(child, siblingIndex);
            //扩展Items
            app.func.getTargetItems(child, this.Items);
        }
    }
    //获取组件，没有则自动添加
    ccNode.prototype.obtainComponent = function <T extends Component>(component: new (...args: any[]) => T): T {
        if (!component) {
            fw.printError(`obtainComponent error: component is null`);
            return;
        }
        const components = (<any>this).__componentsMap ??= new Map();
        let com = components.get(component);
        if (!fw.isValid(com)) {
            com = this.getComponent(component) ?? this.addComponent(component);
            components.set(component, com);
        }
        return com;
    }
    //单次定时器
    ccNode.prototype.setTimeout = function (callback: Function, time: number, bImmediately?: boolean): NodeJS.Timeout {
        if (!callback || fw.isNull(time)) {
            return null;
        }
        //是否立即执行
        bImmediately && callback(bImmediately);
        let nTimer: NodeJS.Timeout;
        nTimer = setTimeout(() => {
            if (isValid(this, true)) {
                //执行回调
                callback(false);
                //删除计时器
                this.clearTimeoutTimer(nTimer);
            }
        }, time * 1000);
        this.__timer_map ??= new Map();
        if (!this.__timer_map.has(`timeout`)) {
            this.__timer_map.set(`timeout`, []);
        }
        this.__timer_map.get(`timeout`).push(nTimer);
        return nTimer;
    }
    //循环定时器
    ccNode.prototype.setInterval = function (callback: Function, time: number, bImmediately?: boolean): NodeJS.Timer {
        if (!callback || fw.isNull(time)) {
            return null;
        }
        //是否立即执行
        bImmediately && callback(bImmediately);
        let nTimer: NodeJS.Timer;
        nTimer = setInterval(() => {
            if (isValid(this, true)) {
                //执行回调
                callback(false);
            } else {
                //删除计时器
                clearInterval(nTimer);
            }
        }, time * 1000);
        this.__timer_map ??= new Map();
        if (!this.__timer_map.has(`interval`)) {
            this.__timer_map.set(`interval`, []);
        }
        this.__timer_map.get(`interval`).push(nTimer);
        return nTimer;
    }
    //移除定时器
    ccNode.prototype.clearTimeoutTimer = function (nTimer: NodeJS.Timeout | string | number | undefined, bDestroy?: boolean): void {
        if (isValid(app, true) && !fw.isNull(nTimer)) {
            if (!bDestroy && this.__timer_map && this.__timer_map.has(`timeout`)) {
                let list = this.__timer_map.get(`timeout`);
                for (let i = 0; i < list.length; ++i) {
                    if (nTimer == list[i]) {
                        list.splice(i, 1);
                        break;
                    }
                }
            }
        }
        clearTimeout(nTimer);
    };
    //移除全部定时器
    ccNode.prototype.clearAllTimeoutTimer = function (bDestroy?: boolean): void {
        if (!bDestroy && this.__timer_map && this.__timer_map.has(`timeout`)) {
            let list = this.__timer_map.get(`timeout`);
            for (let i = 0; i < list.length; ++i) {
                clearTimeout(list[i]);
                break;
            }
            list.splice(0, list.length)
        }
    }
    //移除定时器
    ccNode.prototype.clearIntervalTimer = function (nTimer: number, bDestroy?: boolean): void {
        if (isValid(app, true) && !fw.isNull(nTimer)) {
            if (!bDestroy && this.__timer_map && this.__timer_map.has(`interval`)) {
                let list = this.__timer_map.get(`interval`);
                for (let i = 0; i < list.length; ++i) {
                    if (nTimer == list[i]) {
                        list.splice(i, 1);
                        break;
                    }
                }
            }
        }
        clearInterval(nTimer);
    };
    //克隆
    ccNode.prototype.clone = function (): ccNode {
        return instantiate(this);
    }
    //监听native事件
    ccNode.prototype.addNativeEventListener = function (nativeEventName: string, callback: NativeEventCallback, bCanRepeate?: boolean): void {
        if (!this._nativeEvents) {
            this._nativeEvents = new Map();
        }
        if (!this._nativeEvents.has(nativeEventName)) {
            if (bCanRepeate) {
                this._nativeEvents.set(nativeEventName, []);
                this._nativeEvents.get(nativeEventName).push(callback);
            } else {
                this._nativeEvents.set(nativeEventName, callback);
            }
        } else {
            if (bCanRepeate) {
                this._nativeEvents.get(nativeEventName).push(callback);
            } else {
                native.jsbBridgeWrapper?.removeNativeEventListener(nativeEventName, this._nativeEvents.get(nativeEventName));
                this._nativeEvents.set(nativeEventName, callback);
            }
        }
        native.jsbBridgeWrapper?.addNativeEventListener(nativeEventName, callback);
    }
    ccNode.prototype.removeNativeEventListener = function (nativeEventName: string, callback?: NativeEventCallback): void {
        if (isValid(app, true) && this._nativeEvents.has(nativeEventName)) {
            let list = this._nativeEvents.get(nativeEventName);
            let bCanRepeate = typeof (list) == `function`;
            if (bCanRepeate) {
                if (callback) {
                    app.func.positiveTraversal(list, (element: NativeEventCallback, index: number) => {
                        if (element == callback) {
                            list.splice(index, 1);
                            return true;
                        }
                    });
                    native.jsbBridgeWrapper?.removeNativeEventListener(nativeEventName, callback);
                } else {
                    app.func.positiveTraversal(list, (element: NativeEventCallback) => {
                        native.jsbBridgeWrapper?.removeNativeEventListener(nativeEventName, element);
                    });
                    this._nativeEvents.delete(nativeEventName);
                }
            } else {
                native.jsbBridgeWrapper?.removeNativeEventListener(nativeEventName, list);
                this._nativeEvents.delete(nativeEventName);
            }
        }
    }
    ccNode.prototype.handlerNativeEventListener = function (data: HandlerNativeEventListenerParam): string {
        let nativeEventName = data.nativeEventName ?? `AutoNativeEventID_${fw.getEventID()}`;
        if (data.once) {
            function func(jsonResponse: string) {
                //自动移除事件监听
                native.jsbBridgeWrapper?.removeNativeEventListener(nativeEventName, func);
                //执行回调
                data.callback(jsonResponse);
            }
            this.addNativeEventListener(nativeEventName, func);
        } else {
            this.addNativeEventListener(nativeEventName, data.callback);
        }
        return nativeEventName;
    }
    //绑定事件
    ccNode.prototype.bindEvent = function (data: FWBindEventParam): void {
        this.__bindEvents ??= [];
        let newData = Object.assign(data, { valideTarget: this });
        this.__bindEvents.push(newData);
        app.event.bindEvent(newData);
        newData.bImmediately && newData.callback(null, null);
    }
    //移除事件
    ccNode.prototype.removeEvent = function (data: FWRemoveEventParam): void {
        if (isValid(app, true)) {
            app.event.removeEvent(Object.assign(data, { valideTarget: this }));
            if (this.__bindEvents) {
                app.func.reverseTraversal(this.__bindEvents, (element: FWBindEventParam, index: number) => {
                    if (element.eventName == data.eventName) {
                        this.__bindEvents.splice(index, 1);
                    }
                });
            }
        }
    }
    //移除所有事件（通过节点自身api绑定的事件）
    ccNode.prototype.removeAllEvent = function (): void {
        if (isValid(app, true)) {
            //注销所有事件
            if (this.__bindEvents) {
                this.__bindEvents.forEach((element: FWBindEventParam) => {
                    app.event.removeEvent(element);
                });
                this.__bindEvents.splice(0, this.__bindEvents.length);
            }
        }
    }
    //镜像翻转
    ccNode.prototype.mirror = function (data: { x?: boolean, y?: boolean, z?: boolean }, bMirror?: boolean): void {
        if (!this.__initScale) {
            this.__initScale = this.getScale();
        }
        this.__mirror = bMirror ?? this.__mirror;
        let mirror = this.__mirror == true ? -1 : 1;
        this.setScale(fw.v3(
            !!data.x ? this.__initScale.x * mirror : this.__initScale.x,
            !!data.y ? this.__initScale.y * mirror : this.__initScale.y,
            !!data.z ? this.__initScale.z * mirror : this.__initScale.z,
        ));
        this.__mirror = !this.__mirror;
    }
    //设置全屏居中
    ccNode.prototype.toWorldCenter = function (data?: ToWorldCenterParam): void {
        data ??= {};
        let bNotAnchorPoint = data.bNotAnchorPoint ?? true;
        let transform = this.obtainComponent(UITransform);
        let anchorPoint = transform.anchorPoint;
        let cSize = transform.contentSize;
        this.setWorldPosition(v3(
            app.winSize.width / 2 + (bNotAnchorPoint ? (anchorPoint.x - 0.5) : 0) * cSize.width,
            app.winSize.height / 2 + (bNotAnchorPoint ? (anchorPoint.y - 0.5) : 0) * cSize.height,
            0
        ));
    }
    //设置父节点下居中
    ccNode.prototype.toParentCenter = function (data?: ToParentCenterParam): void {
        if (!this.parent) {
            return;
        }
        data ??= {};
        let bNotAnchorPoint = data.bNotAnchorPoint ?? true;
        let pTransform = this.parent.obtainComponent(UITransform);
        let cTransform = this.obtainComponent(UITransform);
        let pAnchorPoint = pTransform.anchorPoint;
        let cAnchorPoint = cTransform.anchorPoint;
        let cSize = cTransform.contentSize;
        let pSize = pTransform.contentSize;
        this.setPosition(v3(
            pSize.width * (pAnchorPoint.x - 0.5) + (bNotAnchorPoint ? (cAnchorPoint.x - 0.5) : 0) * cSize.width,
            pSize.height * (pAnchorPoint.y - 0.5) + (bNotAnchorPoint ? (cAnchorPoint.y - 0.5) : 0) * cSize.height,
            0
        ));
    }
    //设置到指定节点下居中
    ccNode.prototype.toNodeCenter = function (data?: ToNodeCenterParam): void {
        data ??= {};
        if (!isValid(data.node)) {
            return;
        }
        let bNotAnchorPoint = data.bNotAnchorPoint ?? true;
        let nTransform = data.node.obtainComponent(UITransform);
        let cTransform = this.obtainComponent(UITransform);
        let nAnchorPoint = nTransform.anchorPoint;
        let cAnchorPoint = cTransform.anchorPoint;
        let cSize = cTransform.contentSize;
        let nSize = nTransform.contentSize;
        let wPos = data.node.getWorldPosition();
        this.setWorldPosition(v3(
            wPos.x - nSize.width * (nAnchorPoint.x - 0.5) + (bNotAnchorPoint ? (cAnchorPoint.x - 0.5) : 0) * cSize.width,
            wPos.y - nSize.height * (nAnchorPoint.y - 0.5) + (bNotAnchorPoint ? (cAnchorPoint.y - 0.5) : 0) * cSize.height,
            0
        ));
    }
    //加载子包
    ccNode.prototype.loadBundle = function (bundleConfig: BundleConfigType | BundleResConfig, callback?: (bundle: AssetManager.Bundle) => void, data?: LoadBundleExtendParam): void {
        app.assetManager.loadBundle(bundleConfig, callback, Object.assign(data ?? {}, { valideTarget: this }));
    }
    //加载子包中的资源
    ccNode.prototype.loadBundleRes = function <T extends Asset>(bundleResConfig: BundleResConfig, type?: any, callback?: any, data?: AssetLoadExtendParam): void {
        //调整参数
        const isValidType = js.isChildClassOf(type as Constructor<Asset>, Asset);
        !data && ((typeof (callback) != `function`) ? (data = callback ?? {}, callback = null) : (data = {}));
        !callback && !isValidType && (typeof (type) == `function`) && (callback = type, type = null);
        app.assetManager.loadBundleRes(bundleResConfig, type, callback, Object.assign(data ?? {}, { valideTarget: this }));
    }
    //同步加载子包中的资源
    ccNode.prototype.loadBundleResSync = function <T extends Asset>(bundleResConfig: BundleResConfig, type?: AssetLoadTypeParam<T>): T {
        return app.assetManager.loadBundleResSync(bundleResConfig, type);
    }
    //单次定时器（秒级）
    ccNode.prototype.scheduleOnce = function (callback: Function, delay?: number, bImmediately?: boolean): void {
        this.obtainComponent(UITransform).scheduleOnce(callback, delay);
        if (bImmediately) {
            callback?.(0, true);
        }
    }
    //循环定时器（秒级）
    ccNode.prototype.schedule = function (callback: Function, interval?: number, repeat?: number, delay?: number, bImmediately?: boolean): void {
        this.obtainComponent(UITransform).schedule(callback, interval, repeat, delay);
        if (bImmediately) {
            callback?.(0, true);
        }
    }
    //删除指定定时器
    ccNode.prototype.unschedule = function (callback: Function): void {
        this.obtainComponent(UITransform).unschedule(callback);
    }
    //删除所有定时器
    ccNode.prototype.unscheduleAllCallbacks = function (): void {
        this.obtainComponent(UITransform).unscheduleAllCallbacks();
    }
}

declare module 'cc' {
    /**Node扩展 */
    interface Node {
        /**节点销毁时资源调用decRef */
        _destroyResList: Asset[]
        /**添加自动清理资源 */
        addDecRefRes: (asset: Asset) => void
        /**重写_destruct函数，节点销毁时触发 */
        __old_destruct: () => void
        /**节点初始化Scale，需自己赋值 */
        __initScale?: Vec3
        /**节点初始化位置，需自己赋值 */
        __initPos?: Vec3
        /**节点引用容器 */
        _Items: { [key: string]: ccNode }
        /**节点引用容器 */
        Items: { [key: string]: ccNode }
        /**节点显隐（不操作Node的active，而是opacity，强制将opacity设为255或者0） */
        _visible: boolean
        /**节点显隐（不操作Node的active，而是opacity，强制将opacity设为255或者0） */
        visible: boolean
        /**获取节点尺寸（前提是有UITransform组件） */
        size: Size
        /**设置string（前提是有Label组件） */
        string: string
        /**异步设置spriteFrame（前提是有Sprite组件） */
        updateSprite: (bundleResConfig: BundleResConfig, data?: FWUpdateSpriteParam) => void
        /**同步设置spriteFrame（前提是有Sprite组件） */
        updateSpriteSync: (bundleResConfig: BundleResConfig) => void
        /**设置精灵 */
        setSpriteFrameByImageAsset(imageAsset: ImageAsset): void
        /**旧removeAllChildren */
        __old_removeAllChildren: Function
        removeAllChildren(bDestroy?: boolean): void
        /**旧removeFromParent */
        __old_removeFromParent: Function
        removeFromParent(bDestroy?: boolean): void
        /**点击事件回调 */
        __callback: Function
        /**注册点击回调 */
        onClick(callback: Function, data?: FWButtonParam): void
        onClickAndScale(callback: Function, data?: FWButtonParam): void
        /**添加子节点 */
        _addChild_(child: ccNode): void
        _insertChild_(child: this | ccNode, siblingIndex: number): void
        /**获取组件，没有则自动添加 */
        obtainComponent<T extends Component>(t: new (...args: any[]) => T): T
        /**单次定时器（秒级） */
        scheduleOnce(callback: (dt: number, bImmediately?: boolean) => void, delay?: number, bImmediately?: boolean): void
        /**循环定时器（秒级） */
        schedule(callback: (dt: number, bImmediately?: boolean) => void, interval?: number, repeat?: number, delay?: number, bImmediately?: boolean): void
        /**删除指定定时器 */
        unschedule(callback: Function): void
        /**删除所有定时器 */
        unscheduleAllCallbacks(): void
        /**定时器列表 */
        __timer_map: Map<string, number[]>;
        /**
         * 单次定时器（秒级） 
         * @deprecated
        */
        setTimeout(callback: Function, time: number, bImmediately?: boolean): NodeJS.Timeout
        /**
         * 循环定时器（秒级） 
         * @deprecated
         * */
        setInterval(callback: Function, time: number, bImmediately?: boolean): NodeJS.Timer
        /**移除定时器 */
        clearTimeoutTimer(nTimer: NodeJS.Timeout | string | number | undefined, bDestroy?: boolean): void
        /**移除全部定时器 */
        clearAllTimeoutTimer(bDestroy?: boolean): void
        /**移除定时器 */
        clearIntervalTimer(nTimer: number, bDestroy?: boolean): void
        /**克隆 */
        clone(): ccNode
        /**监听native事件 */
        _nativeEvents: Map<string, Function[]>
        handlerNativeEventListener(data: HandlerNativeEventListenerParam): string
        addNativeEventListener(nativeEventName: string, callback: NativeEventCallback, bCanRepeate?: boolean): void
        removeNativeEventListener(nativeEventName: string, callback?: NativeEventCallback): void
        /**bindEvents */
        __bindEvents: FWBindEventParam[];
        /**绑定事件 */
        bindEvent(data: FWBindEventParam): void
        /**移除事件 */
        removeEvent(data: FWRemoveEventParam): void
        /**移除所有事件（通过节点自身api绑定的事件） */
        removeAllEvent(): void
        /**镜像翻转 */
        mirror(data: { x?: boolean, y?: boolean, z?: boolean }, bMirror?: boolean): void
        /**设置全屏居中（默认不受锚点影响，即整体居中） */
        toWorldCenter(data?: ToWorldCenterParam): void
        /**设置父节点下居中（默认不受锚点影响，即整体居中） */
        toParentCenter(data?: ToParentCenterParam): void
        /**设置到指定节点下居中（默认不受锚点影响，即整体居中） */
        toNodeCenter(data?: ToNodeCenterParam): void
        /**加载子包 */
        loadBundle(bundleConfig: BundleConfigType | BundleResConfig, callback?: (bundle: AssetManager.Bundle) => void, data?: LoadBundleExtendParam): void
        /**加载子包中的资源 */
        loadBundleRes<T extends Asset>(bundleResConfig: BundleResConfig, callback?: AssetLoadCallbackParam<T>, data?: AssetLoadExtendParam): void
        loadBundleRes<T extends Asset>(bundleResConfig: BundleResConfig, type: AssetLoadTypeParam<T>, callback?: AssetLoadCallbackParam<T>, data?: AssetLoadExtendParam): void
        loadBundleRes<T extends Asset>(bundleResConfig: BundleResConfig, type?: any, callback?: any, data?: AssetLoadExtendParam): void
        /**同步加载资源 */
        loadBundleResSync<T extends Asset>(bundleResConfig: BundleResConfig, type?: AssetLoadTypeParam<T>): T
    }
}

/**类型声明调整 */
declare global {
    namespace globalThis {
        /**原生回调 */
        type NativeEventCallback = (jsonResponse: string) => void
        /**世界中心点参数 */
        type ToWorldCenterParam = {
            /**受锚点影响 */
            bNotAnchorPoint?: boolean
        }
        /**父节点下居中 */
        type ToParentCenterParam = {
            /**受锚点影响 */
            bNotAnchorPoint?: boolean
        }
        /**指定节点下居中 */
        type ToNodeCenterParam = {
            /**受锚点影响 */
            node?: ccNode
            /**受锚点影响 */
            bNotAnchorPoint?: boolean
        }
        type HandlerNativeEventListenerParam = {
            /**是否值执行一次 */
            once?: boolean
            /**事件名称 */
            nativeEventName?: string
            /**事件回调 */
            callback: NativeEventCallback
        }
    }
}

export { }
