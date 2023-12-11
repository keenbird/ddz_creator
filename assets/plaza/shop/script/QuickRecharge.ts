import { Label, Node as ccNode, _decorator } from 'cc';
const { ccclass } = _decorator;

import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
import { DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { EVENT_ID } from '../../../app/config/EventConfig';
import { ACTOR } from '../../../app/config/cmd/ActorCMD';

@ccclass('QuickRecharge')
export class QuickRecharge extends FWDialogViewBase {
    /**弹框参数 */
    popupData: {
        /**最小值 */
        nRechargeNumMin?: number
        /**指定面额 */
        rechargeNum?: number
        /**提示2展示信息*/
        tips_2?:string
        /**取消购买回调 */
        cancelBuyCallback?: () => void
    } = {}
    /**面额 */
    priceNum: number
    initView() {
        //多语言
        this.Items.Label_title.string = fw.language.getString("Tip");
        this.Items.Text_tips_1.string = fw.language.getString("Your balance is not enough to continue.");
        this.Items.Text_tips_2.string = fw.language.getString("You can add cash by one click.");
        this.Items.Text_ok.string = fw.language.getString("Add Cash");
        this.Items.Text_shop.string = fw.language.getString("Other Amount>>");
        //刷新界面
        this.updatePopupView();
    }
    initBtns() {
        this.Items.Node_close.onClickAndScale(this.onClickCancelBuy.bind(this));
        this.Items.Image_ok.onClickAndScale(()=>{
            center.user.showChoose(this.priceNum);
			this.onClickClose()
        });
        this.Items.Panel_shop.onClickAndScale(this.goShop.bind(this));
    }
    initEvents() {
        //购买通知
        this.bindEvent({
            eventName: EVENT_ID.EVENT_PLAZA_MALL_RMBORDER,
            callback: () => {
                app.sdk.pay();
            }
        });
        //奖励提示
        this.bindEvent({
            eventName: EVENT_ID.EVENT_GETREWARDTIPS,
            callback: (ndata) => {
                this.onClickClose();
            }
        });
    }
    onClickCancelBuy() {
        this.popupData.cancelBuyCallback?.();
        this.onCancelClickClose();
    }
    // onCancelClickClose() {
	// 	super.onCancelClickClose();
    //     if (center.user.canShowMegaGift()) {
	// 		center.user.showMegaGift()
	// 	}
	// }
    goShop() {
        this.onClickClose();
        app.popup.showDialog({
            viewConfig: fw.BundleConfig.plaza.res[`shop/shop_main`],
            data: {
                minPay: this.priceNum
            },
        });
    }
    setCancelBuyCallback(callback: () => void) {
        this.popupData.cancelBuyCallback = callback;
    }
    updatePopupView(...arg: any[]): void {
        let list = center.mall.mallLimitConfig.num.list;
        if (this.popupData.rechargeNum) {
            this.priceNum = this.popupData.rechargeNum;
        } else {
            if (this.popupData.nRechargeNumMin) {
                app.func.positiveTraversal(list, (element,index) => {
                    if (element >= this.popupData.nRechargeNumMin || index == list.length-1) {
                        this.priceNum = element;
                        return true;
                    }
                });
            } else {
                this.priceNum = list[0];
            }
        }
        this.Items.Text_gold.getComponent(Label).string = DF_SYMBOL + this.priceNum;
        this.Items.Text_id.getComponent(Label).string = "ID:" + center.user.getActorProp(ACTOR.ACTOR_PROP_DBID);

        this.Items.Text_tips_2.string = this.popupData.tips_2 ?? fw.language.getString("You can add cash by one click.");
    }
}

declare global {
    namespace globalThis {
        type type_QuickRecharge = QuickRecharge
    }
}
