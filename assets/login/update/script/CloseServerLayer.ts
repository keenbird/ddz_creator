import { game, _decorator } from 'cc';
const { ccclass } = _decorator;

import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('CloseServerLayer')
export class CloseServerLayer extends FWDialogViewBase {
    /**弹框数据 */
    popupData: { content: string } = <any>{}
    /**刷新显示 */
    updatePopupView() {
        //内容
        this.Items.content_lab.string = String(this.popupData.content).replace('</br>', '\n');
        //多语言
        this.Items.Text_title.string = fw.language.get("VERSION UPDATE")
        this.Items.okay_text.string = fw.language.get("Okay, login later")
    }
    /**关闭 */
    onClickClose() {
        game.end();
    }
}

/**类型声明调整 */
declare global {
    namespace globalThis {
        type type_CloseServerLayer = CloseServerLayer
    }
}