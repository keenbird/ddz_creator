
import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { FWLoadingViewBase } from '../../../../app/framework/view/popup/FWLoadingViewBase';

@ccclass('loading_common')
export class loading_common extends FWLoadingViewBase {
    /**初始化界面 */
    initView() {
        // tween(this.Items.Sprite_bg)
        //     .by(1.0, { eulerAngles: new Vec3(0, 0, -180) })
        //     .union()
        //     .repeatForever()
        //     .start();
    }
    /**返回键关闭 */
    onCancelClickClose() {
        if (app.func.isWin32()) {
            super.onCancelClickClose();
        } else {
            //不允许关闭
        }
    }
}
