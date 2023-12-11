import { Prefab, RichText, view } from 'cc';
import { Sprite } from 'cc';
import { v3 } from 'cc';
import { instantiate, Label, math, ScrollView, Node as ccNode, Overflow, UITransform, _decorator, color } from 'cc';
import { ACTOR } from '../../../app/config/cmd/ActorCMD';
import { DF_RATE, DF_SYMBOL, DOWN_IMAGE_TYPE } from '../../../app/config/ConstantConfig';
import { httpConfig } from '../../../app/config/HttpConfig';
const { ccclass } = _decorator;

import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
import { LUCKCARD } from '../../../app/config/cmd/LuckyCardCMD';
import { SpriteFrame } from 'cc';
import { Node } from 'cc';
import { guide_hand_1 } from '../../../resources/ui/guide/script/guide_hand_1';
import proto from '../../../app/center/common';
import { PayChannel_viewBase } from './PayChannel_viewBase';

@ccclass('PayChannel')
export class PayChannel extends FWDialogViewBase {
    payChannelViewCtrl: PayChannel_viewBase;
    initData() {
        this.payChannelViewCtrl = this.obtainComponent(PayChannel_viewBase);
        this.payChannelViewCtrl.close = this.close.bind(this)
        this.payChannelViewCtrl.setPopupData(this.popupData)
    }
}
