
import { Label, _decorator } from 'cc';
const { ccclass } = _decorator;

import { FWToastViewBase } from '../../../../app/framework/view/popup/FWToastViewBase';

@ccclass('toast_common')
export class toast_common extends FWToastViewBase {
    /**调整类型 */
    popupData: FWPopupToastParam = <any>{}
    /**刷新界面 */
    updatePopupView(str?: string) {
        //调整文本显示
        if (fw.isValid(this.Items.Label_content)) {
            this.Items.Label_content.string = str ?? this.popupData.text ?? `tips`;
        }
        //调整颜色
        if (this.popupData.color) {
            this.Items.Label_content.getComponent(Label).color = this.popupData.color;
        }
    }
}
