import { view } from 'cc';
import { instantiate, Label, math, ScrollView, Node as ccNode, UITransform, _decorator, color } from 'cc';
import { ACTOR } from '../../../app/config/cmd/ActorCMD';
import { EVENT_ID } from '../../../app/config/EventConfig';
const { ccclass } = _decorator;

import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
import { btn_common } from '../../../resources/ui/btn/script/btn_common';

@ccclass('NoticeDialog')
export class NoticeDialog extends FWDialogViewBase {
    /**配置参数 */
	data
	setData(data) {
		this.data = data;
	}   
    initData() {

    }

    initView() {

        //标题
        this.Items.Label_title.obtainComponent(Label).string = fw.language.get("Notice");
        //按钮文字
        this.Items.btn_common.getComponent(btn_common).initStyle({
            styleId: 1,
            text: `Okey`,
            callback: () => {
                this.onClickClose();
            }
        });

        this.Items.richText.obtainComponent(Label).string = this.data || "";
    }

    initBtns() {
    }

    initEvents() {

    }
}
declare global {
	namespace globalThis {
		type plaza_noticeDialog = NoticeDialog
	}
}
