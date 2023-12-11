import { Node as ccNode, _decorator } from 'cc';
const { ccclass } = _decorator;

import { PayChannel } from './PayChannel';
import { PayChannel_viewBase } from './PayChannel_viewBase';

@ccclass('PayChannel_vertical')
export class PayChannel_vertical extends (fw.FWComponent) {
    m_guidePosX: number = 30;
    m_guidePosY: number = 60;
    payChannelViewCtrl: PayChannel_viewBase;
	popupData: PayChannelData = <any>{};
    initData() {
        this.payChannelViewCtrl = this.obtainComponent(PayChannel_viewBase);
        this.payChannelViewCtrl.close = this.onClickClose.bind(this)
        this.payChannelViewCtrl.m_guidePosX = this.m_guidePosX
        this.payChannelViewCtrl.m_guidePosY = this.m_guidePosY
        this.payChannelViewCtrl.setPopupData(this.popupData)
    }
    initBtns() {
        this.Items.Panel_close.onClickAndScale(this.onClickClose.bind(this));
    }
    protected initEvents(): boolean | void {
        //返回键
        this.bindEvent({
            eventName: app.event.CommonEvent.Keyback,
            callback: () => {
                this.onCancelClickClose();
            }
        });
    }
    onClickClose() {
        if (this.node.active) {
            this.node.active = false;
            app.event.dispatchEvent({
              eventName: "hidePayChannelVeritcal",
            })
        }
    }
    onCancelClickClose() {
        this.onClickClose()
    }
}