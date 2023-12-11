import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { FWPopupViewBase } from './FWPopupViewBase';

@ccclass('FWSystemViewBase')
export class FWSystemViewBase extends FWPopupViewBase {
    onClickClose() {
        app.popup.closeSystem(this.node);
    }
}
