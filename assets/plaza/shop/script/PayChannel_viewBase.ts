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

@ccclass('PayChannel_viewBase')
export class PayChannel_viewBase extends (fw.FWComponent) {
    popupData: PayChannelData = <any>{};
    m_cashNum;
    m_payCashNum;
    m_bonusNum;
    m_VipData;
    m_VipDays;
    payData = null;
    m_guidePosX: number = 100;
    m_guidePosY: number = -20;

    menuCount;//菜单
    guideNode: Node;
    close: Function;

    setPopupData(popupData: PayChannelData) {
		this.popupData = popupData;
        this.formatData()
		//刷新界面
		this.updatePopupView();
	}

    formatData() {
        this.m_cashNum = 0;
        this.m_payCashNum = 0;
        this.m_bonusNum = 0;

        if (1 == this.popupData.nType || null == this.popupData.nType) {
            const gifPrice = this.popupData.megaGiftData;
            if (null != gifPrice) {
                this.m_cashNum = gifPrice.prop_num / DF_RATE;
                this.m_bonusNum = (gifPrice.bonus_num) / DF_RATE;
                this.m_payCashNum = parseInt(gifPrice.price) / 10;
            } else if (null != this.popupData.siginboradData) {
                this.m_cashNum = this.popupData.siginboradData.nPriceCost ?? 0;
                this.m_payCashNum = this.popupData.siginboradData.nQuickNeedRMB;
                this.m_bonusNum = 0;
            } else if (this.popupData.cashBonusInfo) {
                this.m_cashNum = parseInt(this.popupData.cashBonusInfo.cash);
                this.m_bonusNum = parseInt(this.popupData.cashBonusInfo.bonus);
                this.m_payCashNum = parseInt(this.popupData.cashBonusInfo.payCash);
            } else {
                this.m_cashNum = this.popupData.lRMB ?? 0;
                this.m_payCashNum = this.m_cashNum;
            }
        } else if (2 == this.popupData.nType) {
            this.m_VipData = this.popupData.vipData;
            this.m_VipDays = this.popupData.vipDays;
        }

        if (true || this.popupData.needGuide) {
            this.showGuide()
        }
    }

    initView() {
        this.Items.Text_add_cash_title.string = fw.language.get("ADD CASH")
        this.Items.Text_total_get_t.string = fw.language.get("TOTAL GET")
        this.Items.Text_cash_t.string = fw.language.get("CASH")
        this.Items.Text_payment_tips.string = fw.language.get("Select payment method")
        this.Items.payment_update.string = fw.language.get("Payment update, please use later")

        this.Items.Panel_payment.active = false;
        this.Items.payment_update.active = false;

        this.Items.Image_pay.onClickAndScale(this.onClickAddCash.bind(this));
    }

    updatePopupView() {
        this.Items.Text_bonus_t.string = this.popupData.giftText || fw.language.get("BONUS")
        this.initViewByType(this.popupData.nType ?? 1);

        center.mall.phpGetPayChannel((data) => {
            if (fw.isValid(this.node)) {
                this.refreshPayChannel(data);
            }
        });
    }

    initViewByType(type_: number) {
        if (1 == type_) {
            //cash
            this.Items.Panel_add_cash.active = true;
            this.Items.Panel_add_vip.active = false;
            const recharge_rid = this.popupData?.extend?.recharge_rid;
            const quickRecharge = center.roomList.getQuickRecharge(recharge_rid);
            if (fw.isNull(quickRecharge) || !quickRecharge.quickPayIcon) {
                this.Items.Text_total_get.obtainComponent(Label).string = DF_SYMBOL + (this.m_cashNum + this.m_bonusNum);
                this.Items.Text_cash.obtainComponent(Label).string = DF_SYMBOL + this.m_cashNum;
                this.Items.Text_bonus.obtainComponent(Label).string = DF_SYMBOL + this.m_bonusNum;
            } else {
                this.Items.Panel_add_cash.active = false;
                app.file.updateImage({
                    node: this.Items.Sprite_icon,
                    serverPicID: quickRecharge.quickPayIcon,
                });
            }
            this.Items.Text_pay.obtainComponent(Label).string = fw.language.get("Add Cash") + " " + DF_SYMBOL + this.m_payCashNum;
        } else if (2 == type_) {
            //vip
            this.Items.Panel_add_cash.active = false;
            this.Items.Panel_add_vip.active = true;
            this.refreshVipItem(this.m_VipData);
        }
    }

    refreshVipItem(data_: VipCardConfig) {
        let tpath = "";
        if (data_.vipType == LUCKCARD.LUCKCARD_MONTH_CARD) {
            tpath = "shop/img/addcash/VIP_Monthly/spriteFrame"
        } else if (data_.vipType == LUCKCARD.LUCKCARD_WEEK_CARD) {
            tpath = "shop/img/addcash/VIP_Weekly/spriteFrame"
        } else if (data_.vipType == LUCKCARD.LUCKCARD_DAY_CARD) {
            tpath = "shop/img/addcash/VIP_daily/spriteFrame"
        }

        let trootNode = this.Items.Panel_add_vip;
        let rewardnow = trootNode.Items.reward_now;
        let rewardday = trootNode.Items.reward_day;
        let imageCard = trootNode.Items.Image_equal;
        let reward_time = trootNode.Items.reward_time;

        let reNum = parseInt(data_.daily_gift[0].goods_num ?? 0) / DF_RATE;
        let reNumNow = parseInt(data_.once_gifts[0].goods_num ?? 0) / DF_RATE;
        let total = data_.vipDays * reNum + reNumNow;

        reward_time.getComponent(RichText).string = fw.language.getString("<color=#ffffff>Valid for </color><color=#FDFF7C>${num}</color><color=#ffffff> days</color>", { num: data_.vipDays });
        rewardnow.getComponent(RichText).string = fw.language.getString("<color=#ffffff>Get </color><color=#FDFF7C>${DF_SYMBOL}${num}</color><color=#ffffff> now</color>", { DF_SYMBOL: DF_SYMBOL, num: reNumNow });
        rewardday.getComponent(RichText).string = fw.language.getString("<color=#ffffff>Get </color><color=#FDFF7C>${DF_SYMBOL}${num}</color><color=#ffffff> every day</color>", { DF_SYMBOL: DF_SYMBOL, num: reNum });
        imageCard.loadBundleRes(fw.BundleConfig.plaza.res[tpath],(res: SpriteFrame) => {
            imageCard.obtainComponent(Sprite).spriteFrame = res;
        });
        this.Items.Text_pay.obtainComponent(Label).string = fw.language.get("Pay") + " " + DF_SYMBOL + data_.price;
    }

    refreshPayChannel(data) {
        if (data == null || 0 >= data.length) {
            this.Items.payment_update.active = true;
            this.Items.Text_payment_tips.active = false;
            return;
        }

        this.Items.payment_update.active = false;
        this.Items.Text_payment_tips.active = true;

        //充值列表
        let btns: FWOneMenuBtnParam<null>[] = [];
        let selectItem = 0;
        let defaultKeyName = app.file.getStringForKey("LastPayKeyName", "");

        //移除原有元素
        let content = this.Items.ListView_payment.obtainComponent(ScrollView).content;
        content.removeAllChildren(true);

        for (let k = 0; k < data.length; k++) {
            const v = data[k];

            let item = this.Items.Panel_payment.clone();
            content.addChild(item);
            item.active = true;


            let tnode_normal = item.Items.Node_btn_normal;
            let tnode_select = item.Items.Node_btn_select;
            tnode_normal.Items.Text_payment.obtainComponent(Label).string = v.name;
            tnode_select.Items.Text_payment.obtainComponent(Label).string = v.name;
            tnode_normal.Items.Text_payment_des.obtainComponent(Label).string = v.desc;
            tnode_select.Items.Text_payment_des.obtainComponent(Label).string = v.desc;
            if (null == v.desc || "" == v.desc) {
                tnode_normal.Items.Text_payment.setPosition(0, 0);
                tnode_select.Items.Text_payment.setPosition(0, 0);
                tnode_normal.Items.Text_payment_des.active = false;
                tnode_select.Items.Text_payment_des.active = false;
            }

            btns.push({
                node: item,
                data: v,
                text: DF_SYMBOL + v,
                callback: () => {
                    this.payData = v;
                }
            });

            //默认选中
            if (v.key_name == defaultKeyName) {
                selectItem = k;
            }
        }

        //创建菜单
        this.menuCount = app.func.createMenu({
            defaultIndex: selectItem,
            mountObject: this,
            btns: btns,
        });
    }

    onClickAddCash() {
        if (!this.payData) return;
        let key_name = this.payData.key_name;
        let need_phone = parseInt(this.payData.phone_need ?? 1);
        let orderCallback = this.popupData.orderCallback;
        //保存上一次支付方式
        app.file.setStringForKey("LastPayKeyName", key_name);
        //保存上次购买价格
        app.file.setIntegerForKey("LastPayValue", parseInt(this.m_payCashNum), { all: true });
        let payFast = function () {
            if (orderCallback) {
                app.sdk.setKeyName(key_name);
                setTimeout(() => {
                    orderCallback();
                    app.popup.showLoading({ nAutoOutTime: 10 })
                }, 1)
            }
        }
        if (need_phone == 1) {
            if (!center.user.isFillAllPayInfo()) {
                app.popup.showDialog({
                    viewConfig: fw.BundleConfig.plaza.res[`userInfo/withdraw_info`]
                });
            } else {
                payFast();
            }
        } else if (need_phone == 0) {
            payFast();
        }
        this.removeGuide();
        this.close();
    }

    public showGuide() {
        if (!fw.isValid(this.guideNode)) {
            this.node.loadBundleRes(fw.BundleConfig.resources.res[`ui/guide/guide_hand_1`],(res: Prefab) => {
                // 异步原因可能存在多次回调
                if (!fw.isValid(this.guideNode)) {
                    let node = instantiate(res);
                    this.guideNode = node
                    node.getComponent(guide_hand_1).playAnim(1.5);
                    this.node.addChild(node);
                    node.setWorldPosition(this.Items.Image_pay.getWorldPosition().add3f(this.m_guidePosX, this.m_guidePosY, 0));
                }
            });
        }
    }

    public removeGuide() {
        if (fw.isValid(this.guideNode)) {
            this.guideNode.removeFromParent(true)
            this.guideNode = null;
        }
    }
}

declare global {
    namespace globalThis {
        type plaza_PayChannel = PayChannel_viewBase
        interface VipCardConfig extends proto.plaza_luckcard.ICardConfig {
            vipDays: number
            vipType: number
        }
        interface PayChannelData {
            customCallback?: Function;
            nType?: number, // 支付类型 1普通 2周卡月卡
            megaGiftData?: proto.common.IMegaGiftItem,// 首充
            siginboradData?: any,//签到礼包
            cashBonusInfo?: any,//幸运签到礼包
            lRMB?,//普通支付金额
            vipData?: VipCardConfig,// 周卡月卡
            vipDays?,// 周卡月卡
            needGuide?: boolean,// 是否需要新手引导
            orderCallback?: Function,// 订单回调
            giftText?,// total = cash + bonus, bonus位置显示传过来的文字 
            /**自动选择支付方式 */
            isAutoSelect?: boolean,
            /**扩展参数 */
            extend?: {
                /**快充id */
                recharge_rid?: number
            }
        }
    }
}

// interface VipCardConfig extends proto.plaza_luckcard.ICardConfig {
//     vipDays: number
//     vipType: number
// }