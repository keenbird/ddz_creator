import { _decorator, Node as ccNode, Component, Prefab, instantiate, isValid } from 'cc';
const { ccclass } = _decorator;
import './../__init'

import { ScreenOrientationType } from '../../app/config/ConstantConfig';

@ccclass('_FWComponent')
class _FWComponent extends Component {
    /**生命周期
     * preload -> onLoad -> onEnable -> start
     * onDisable -> onDestroy
     */
    /**横竖屏切换功能 */
    protected _nScreenOrientation = ScreenOrientationType.Horizontal_true
    get nScreenOrientation() {
        return this._nScreenOrientation;
    }
    set nScreenOrientation(nScreenOrientation: ScreenOrientationType) {
        this._nScreenOrientation = nScreenOrientation;
    }
    /**是否具有横竖屏切换功能（意思是当前界面会调整 “横竖屏” 状态），如果界面设计没有适配横竖屏，那么应该设置该属性为true，并调整_nScreenOrientation值为当前界面设计方向 */
    bHaveScreenOrientation: boolean = false
    /**组件是否受 “横竖屏” 状态影响（意思是是否监听 “横竖屏” 状态变更，然后刷新界面显示）） */
    bUnderScreenOrientation: boolean = false
    /**只在销毁时调整横竖屏状态，隐藏时不调整横竖屏状态 */
    bUpdateOnlyDestroy: boolean = true
    /**初始化函数调用时机 */
    protected _bLifeFuncOnLoad: boolean = true
    /**一般情况下不建议子类重写 */
    onLoad() {
        //是否监听横竖屏切换
        if (this.bUnderScreenOrientation) {
            this.bindEvent({
                bOne: true,
                eventName: `ChangeScreenOrientation`,
                callback: () => {
                    this.updateScreenOrientation();
                },
            });
            this.updateScreenOrientation();
        }
        this._bLifeFuncOnLoad && this.doLifeFunc();
    }
    /**一般情况下不建议子类重写 */
    start() {
        !this._bLifeFuncOnLoad && this.doLifeFunc();
    }
    /**执行生命周期 */
    protected doLifeFunc() {
        //建议按以下顺序调用
        let doList: (() => (boolean | void))[] = [
            this.initData,
            this.initEvents,
            this.initView,
            this.initBtns,
        ];
        for (let i in doList) {
            let ret = doList[i].bind(this)();
            if (ret === true) {
                break;
            }
        }
    }
    /**初始化数据（返回值为真则跳过后面的初始化函数） */
    protected initData(): boolean | void {
        //TODO
    }
    /**初始化界面（返回值为真则跳过后面的初始化函数） */
    protected initView(): boolean | void {
        //TODO
    }
    /**初始化按钮（返回值为真则跳过后面的初始化函数） */
    protected initBtns(): boolean | void {
        //TODO
    }
    /**初始化事件（返回值为真则跳过后面的初始化函数） */
    protected initEvents(): boolean | void {
        //TODO
    }
    /**一般情况下不建议子类重写，界面从 “未显示” 调整为 “显示” */
    private onEnable(): void {
        // //是否刷新横竖屏
        // if (this.bHaveScreenOrientation) {
        //     //记录上一个界面的方向
        //     (<any>this).nLastScreenOrientation = app.runtime.nCurScreenOrientation;
        //     //调整当前方向
        //     app.runtime.nCurScreenOrientation = this.nScreenOrientation;
        //     //添加
        //     app.runtime.addScreenOrientation(this.nScreenOrientation, this);
        // }
        //是否刷新横竖屏
        if (this.bHaveScreenOrientation) {
            //记录上一个界面的方向
            (<any>this).nLastScreenOrientation = app.runtime.nCurScreenOrientation;
            //调整当前方向
            app.runtime.nCurScreenOrientation = this.nScreenOrientation;
        }
        this.onViewEnter();
    }
    /**界面从 “未显示” 调整为 “显示” */
    public onViewEnter(): void {
        //子类实现
    }
    /**一般情况下不建议子类重写，界面从 “显示” 调整为 “未显示” */
    private onDisable(): void {//是否刷新横竖屏
        // //是否刷新横竖屏
        // if (this.bHaveScreenOrientation && !this.bUpdateOnlyDestroy) {
        //     //还原上一个界面的方向
        //     app.runtime.nCurScreenOrientation = (<any>this).nLastScreenOrientation;
        //     //删除
        //     app.runtime.delScreenOrientation(this);
        // }
        //是否刷新横竖屏
        if (this.bHaveScreenOrientation) {
            //还原上一个界面的方向
            app.runtime.nCurScreenOrientation = (<any>this).nLastScreenOrientation;
        }
        this.onViewExit();
    }
    /**界面从 “显示” 调整为 “未显示” */
    public onViewExit(): void {
        //子类实现
    }
    /**屏幕横竖屏切换时刷新 */
    updateScreenOrientation(...arg: any[]) {
        //TODO => app.runtime.nCurScreenOrientation
    }
    /**添加界面 */
    addView(data: AddViewParam) {
        let views = (<any>this).__addViews ??= {};
        let view = data.view ?? views[data.viewConfig.all];
        let func = () => {
            //隐藏其它
            data.bHideOther && this.hideView(null, { [data.viewConfig.all]: true });
            //先执行回调
            data.callback && data.callback(view, data);
            //后设置显隐
            (data.bShowView ?? true) && (view.active = true);
        }
        if (!fw.isValid(view)) {
            this.loadBundleRes(data.viewConfig,(res: Prefab) => {
                let bOnlyOne = data.bOnlyOne ?? true;
                view = views[data.viewConfig.all];
                if (!bOnlyOne || !fw.isValid(view)) {
                    let parent = data.parent ?? this.node;
                    if (!fw.isValid(parent)) {
                        return;
                    }
                    view = instantiate(res);
                    view.active = false;
                    if (fw.isNull(data.zOrder)) {
                        parent.addChild(view);
                    } else {
                        parent.insertChild(view, data.zOrder);
                    }
                    views[data.viewConfig.all] = view;
                }
                func();
            });
        } else {
            func();
        }
    }
    /**隐藏界面 */
    hideView(viewConfig?: BundleResConfig, ignore?: { [path: string]: true }) {
        ignore ??= {};
        let views = (<any>this).__addViews ??= {};
        if (viewConfig) {
            let view = views[viewConfig.all];
            if (view) {
                view.active = false;
            }
        } else {
            app.func.traversalObject(views, (element: ccNode, path: string) => {
                if (!ignore[path]) {
                    element.active = false;
                }
            });
        }
    }
    /**界面显隐状态 */
    getViewVisible(viewConfig: BundleResConfig) {
        let views = (<any>this).__addViews ??= {};
        let view = views[viewConfig.all];
        if (view) {
            return view.active;
        }
        return false;
    }
    /**销毁 */
    private onDestroy() {
        // //是否刷新横竖屏
        // if (this.bHaveScreenOrientation && this.bUpdateOnlyDestroy) {
        //     //还原上一个界面的方向
        //     app.runtime.nCurScreenOrientation = (<any>this).nLastScreenOrientation;
        //     //删除
        //     app.runtime.delScreenOrientation(this);
        // }
        //子类实现
        this.onViewDestroy();
    }
    onViewDestroy() {
        //TODO
    }
    /**返回键回调 */
    onKeyboardForKeyback(): boolean {
        return false;
    }
}

/**类型声明调整 */
declare global {
    namespace globalThis {
        /**界面配置 */
        type AddViewParam = {
            /**自己创建的界面 */
            view?: ccNode
            /**资源配置 */
            viewConfig?: BundleResConfig
            /**是否唯一（默认唯一） */
            bOnlyOne?: boolean
            /**是否隐藏其它界面（默认不隐藏） */
            bHideOther?: boolean
            /**是否显示当前添加的界面（默认显示） */
            bShowView?: boolean
            /**父节点 */
            parent?: ccNode
            /**深度 */
            zOrder?: number
            /**回调 */
            callback?: (view: ccNode, data: AddViewParam) => void
            /**扩展参数 */
            data?: any
        }
    }
}

declare global {
    namespace globalThis {
        interface _fw {
            FWComponent: typeof _FWComponent
        }
    }
}
fw.FWComponent = _FWComponent;
