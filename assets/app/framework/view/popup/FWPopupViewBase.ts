import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { ScreenOrientationType } from '../../../config/ConstantConfig';

@ccclass('FWPopupViewBase')
export class FWPopupViewBase extends fw.FWComponent {
    /**组件是否受 “横竖屏” 状态影响（意思是是否监听 “横竖屏” 状态变更，然后刷新界面显示）） */
    bUnderScreenOrientation: boolean = true
    /**Esc键关闭 */
    bEsc: boolean = true
    /**弹框数据 */
    protected popupData: unknown = <any>{}
    /**设置数据 */
    setPopupData(data: unknown, ...arg: any[]) {
        //设置数据
        this.popupData = data;
        //刷新界面
        this.updatePopupView();
    }
    onLoad() {
        //附加界面初始化
        this._initView_FWPopupViewBase();
        //附加事件初始化
        this._initEvents_FWPopupViewBase();
        //调用父类
        super.onLoad();
    }
    private _initView_FWPopupViewBase() {
        //TODO
    }
    private _initEvents_FWPopupViewBase() {
        //返回键
        this.bindEvent({
            eventName: app.event.CommonEvent.Keyback,
            callback: () => {
                if (this.bEsc) {
                    this.onCancelClickClose();
                }
            }
        });
    }
    /**横竖屏默认值 */
    updateScreenOrientationDefault() {
        (<any>this).__initAngle ??= this.node.angle;
        (<any>this).__initScale ??= this.node.scale.clone();
        switch (app.runtime.nCurScreenOrientation) {
            case ScreenOrientationType.Vertical_false:
            case ScreenOrientationType.Horizontal_false:
                this.node.angle = (<any>this).__initAngle + 90;
                this.node.scale = fw.v3((<any>this).__initScale.x * 0.925, (<any>this).__initScale.y * 0.925, (<any>this).__initScale.z);
                break;
            case ScreenOrientationType.Vertical_true:
            case ScreenOrientationType.Horizontal_true:
            default:
                this.node.angle = (<any>this).__initAngle;
                this.node.scale = fw.v3((<any>this).__initScale.x, (<any>this).__initScale.y, (<any>this).__initScale.z);
                break;
        }
    }
    /**手动关闭界面触发 */
    onClickClose(): boolean | void {
        return true;
    }
    /**点击关闭按钮或者keyback触发 */
    onCancelClickClose() {
        this.onClickClose();
    }
    /**刷新界面，设置setPopupData时会主动调用 */
    updatePopupView(...arg: any[]) {
        //TODO
    }
}


export interface PopupViewEventListener {
    cancelClickListener?:Function,
}