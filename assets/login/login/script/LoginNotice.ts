import { Label } from 'cc';
import { sys, _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('LoginNotice')
export class LoginNotice extends (fw.FWComponent) {
    initData() {

    }
    initEvents() {

    }
    initView() {

    }
    initBtns() {

    }

    updateNoticeView(ret) {
        //标题
        this.Items.Text_title.obtainComponent(Label).string = ret.data.title;

        //内容
        let str = String(ret.data.content).replace('</br>', '\n');
        this.Items.content_lab.obtainComponent(Label).string = str;
    }
}
