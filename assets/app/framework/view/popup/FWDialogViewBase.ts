import { _decorator, Label, size } from 'cc';
const { ccclass } = _decorator;

import { FWPopupViewBase, PopupViewEventListener } from './FWPopupViewBase';
import { ScreenOrientationType } from '../../../config/ConstantConfig';
/**
 * dialog 生命周期
 * onLoad() -> onShow() -> onHide() -> onClose() -> onViewDestroy()
 * onShow() -> onHide() -> onShow()
 * updatePopupView 用于弹窗数据更新时触发 可能在onLoad 之前
 */
@ccclass('FWDialogViewBase')
export class FWDialogViewBase extends FWPopupViewBase {
    /**弹框参数 */
    popupData: DialogViewEventListener & any = <any>{}
    onLoad() {
        //扩展调用
        //按钮
        this._initBtns_FWDialogViewBase();
        //调用父类
        super.onLoad();
    }
    /**更换标题 */
    changeTitle(data: FWDialogViewTitleParam) {
        if (fw.isValid(this.Items.Label_title)) {
            this.Items.Label_title.getComponent(Label).string = data.title;
        }
    }
    /**初始化部分按钮 */
    private _initBtns_FWDialogViewBase() {
        //关闭按钮
        let btn_close = this.Items.Node_close || this.Items.Panel_close || this.Items.Sprite_close;
        if (fw.isValid(btn_close)) {
            btn_close.onClickAndScale(this.onCancelClickClose.bind(this));
        }
    }
    /**
     * @deprecated 
     * change close()
     * 删除界面 
     * onCancelClickClose 右上角按钮关闭界面
     * */
    onClickClose() {
        this.close();
    }

    /**右上角按钮关闭界面 */
    onCancelClickClose() {
        this.popupData?.cancelClickListener?.();
        super.onCancelClickClose();
    }
    /**横竖屏 */
    updateScreenOrientation() {
        this.updateScreenOrientationDefault();
    }
    /**横竖屏默认值 */
    updateScreenOrientationDefault() {
        (<any>this).__initAngle ??= this.node.angle;
        switch (this.nScreenOrientation) {
            case ScreenOrientationType.Vertical_true:
            case ScreenOrientationType.Vertical_false:
                this.node.size = size(app.initWinSize.height, app.initWinSize.width);
                switch (app.runtime.nCurScreenOrientation) {
                    case ScreenOrientationType.Vertical_true:
                    case ScreenOrientationType.Horizontal_false:
                        this.node.angle = (<any>this).__initAngle;
                        break;
                    case ScreenOrientationType.Horizontal_true:
                    case ScreenOrientationType.Vertical_false:
                    default:
                        this.node.angle = (<any>this).__initAngle + 90;
                        break;
                }
                break;
            case ScreenOrientationType.Horizontal_false:
            case ScreenOrientationType.Horizontal_true:
            default:
                this.node.size = size(app.initWinSize.width, app.initWinSize.height);
                switch (app.runtime.nCurScreenOrientation) {
                    case ScreenOrientationType.Vertical_true:
                    case ScreenOrientationType.Horizontal_false:
                        this.node.angle = (<any>this).__initAngle + 90;
                        break;
                    case ScreenOrientationType.Horizontal_true:
                    case ScreenOrientationType.Vertical_false:
                    default:
                        this.node.angle = (<any>this).__initAngle;
                        break;
                }
                break;
        }
    }


    /**是否显示遮罩层 */
    showMask(): boolean {
        return true;
    }

    /**
     * 展示dialog
     * @param data 
     */
    show() {
        this.popupData?.showListener?.();
        this.onShow();
    }
    /**
     * 隐藏dialog
     * @param data 
     */
    hide() {
        this.popupData?.hideListener?.();
        this.onHide();
    }
    /**
     * 主动关闭dialog
     * @param data 
     */
    close(data?: any) {
        this.hide();
        this.popupData?.closeListener?.();
        this.onClose(data)
    }

    /**
     * dialog展示
     * @param data 
     */
    protected onShow(data?: any) {
        //TODO
    }

    /**
     * dialog隐藏
     * @param data 
     */
    protected onHide() {
        
    }
    /**
     * dialog关闭
     * @param data 
     */
    protected onClose(data?: any) {
        app.popup.closeDialog(this.node);
    }
}

export interface DialogViewEventListener extends PopupViewEventListener {
    showListener?:Function,
    hideListener?:Function,
    closeListener?:Function,
}

/**类型声明调整 */
declare global {
    namespace globalThis {
        type FWDialogViewTitleParam = {
            /**标题名称 */
            title: string
        }
    }
}