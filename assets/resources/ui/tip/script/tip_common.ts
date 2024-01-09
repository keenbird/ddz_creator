import { RichText, _decorator } from 'cc';
const { ccclass } = _decorator;

import { FWTipViewBase } from '../../../../app/framework/view/popup/FWTipViewBase';

@ccclass('tip_common')
export class tip_common extends FWTipViewBase {
    /**配置参数 */
    popupData: FWPopupTipParam = <any>{}
    protected initView(): boolean | void {
        //是否隐藏关闭按钮
        if (this.popupData.bNotClose) {
            this.Items.Node_close.active = false;
        }
    }
    /**刷新界面 */
    updatePopupView() {
        //调整标题显示
        if (fw.isValid(this.Items.Label_title)) {
            if (fw.isValid(this.popupData.title)) {
                this.Items.Label_title.string = this.popupData.title;
            } else {
                this.Items.Label_title.string = "提示";
            }
        }
        //调整文本显示
        if (fw.isValid(this.Items.Label_content)) {
            let label_content_rich = this.Items.Label_content.obtainComponent(RichText)
            if (fw.isValid(this.popupData.text)) {
                if (this.popupData.data?.directShow) {
                    label_content_rich.string = this.popupData.text;
                } else {
                    label_content_rich.string = `<color=#8e4936>${this.popupData.text}</color>`;
                }
            } else {
                let tip = "tip..."
                label_content_rich.string = `<color=#8e4936>${tip}</color>`;
            }
        }
        //初始化按钮，如果不传则默认添加一个
        if (!this.popupData.btnList || this.popupData.btnList.length <= 0) {
            this.popupData.btnList = [
                {
                    styleId: 1
                }
            ];
        }
        let tempData = this.popupData;
        this.Items.Layout_btns.removeAllChildren(true);
        this.popupData.btnList.forEach((element: BtnStyleParam) => {
            //调整回调
            let oldCallback = element.callback;
            element.callback = () => {
                oldCallback && oldCallback();
                !element.bNotClose && this.onClickClose();
            };
            //新建按钮
            app.popup.newBtn({
                btnStyle: element,
                parent: this.Items.Layout_btns,
                visible: () => {
                    return fw.isValid(this) && tempData == this.popupData;
                }
            });
        });
    }
    /**??? */
    onCancelClickClose() {
        if (this.popupData.closeCallback) {
            this.popupData.closeCallback();
        }
        super.onCancelClickClose()
    }
}

declare global {
    namespace globalThis {
        type type_tip_common = tip_common
    }
}
