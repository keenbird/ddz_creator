import { sys, view, Label, ScrollView, Node as ccNode, UITransform, _decorator, size } from 'cc';
const { ccclass } = _decorator;

import { ACTOR } from '../../../app/config/cmd/ActorCMD';
import { EVENT_ID } from '../../../app/config/EventConfig';
import { DF_RATE, DF_SYMBOL, ScreenOrientationType } from '../../../app/config/ConstantConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('ShopMain')
export class ShopMain extends FWDialogViewBase {
    /**是否具有横竖屏切换功能（意思是当前界面会调整 “横竖屏” 状态），如果界面设计没有适配横竖屏，那么应该设置该属性为true，并调整_nScreenOrientation值为当前界面设计方向 */
    bHaveScreenOrientation: boolean = true
    /**调整屏幕方向 */
    _nScreenOrientation: ScreenOrientationType = ScreenOrientationType.Vertical_false

    /**配置参数 */
    popupData: any = {}

    tutorial_link;
    /**当前使用支付itemInfo */
    payInfo: any
    /**数量菜单 */
    menuCount: FWMenuParam<any>;
    initData() {
        //TODO
    }
    initView() {
        //调整标题
        this.changeTitle({ title: fw.language.get("ADD CASH") });
        this.Items.Image_record_text.string = fw.language.get("Record")
        this.Items.Image_service_text.string = fw.language.get("Service")
        this.Items.Text_title_total_get.string = fw.language.get("TOTAL GET")
        this.Items.Text_title_cash.string = fw.language.get("CASH")
        this.Items.Text_title_selAmount.string = fw.language.get("Select payment amount")
        this.Items.Text_item_bonus.string = fw.language.get("Bonus")
        this.Items.Text_title_selMethod.string = fw.language.get("Select payment method")
        this.Items.payment_update.string = fw.language.get("Payment update, please use later")
        this.Items.Text_item_how_addCash.string = fw.language.get("How to Add Cash?")
        this.Items.Text_what_content.string = fw.language.get("Get 10% Cash Back on your losing amount.")

        //隐藏部分界面
        this.Items.Panel_ex.active = false;
        this.Items.Panel_pay_item.active = false;
        this.Items.Panel_add_cash_item.active = false;
        this.Items.Image_how_to_cash.active = false;
        this.Items.payment_update.active = false;

        this.tutorial_link = false;

        //支付方式
        //修改成异步获取
        center.mall.phpGetPayChannel((list) => {
            if (!fw.isNull(this.node)) {
                this.initPay(list);
            }
        })

        //更新界面
        this.updateView();
    }
    initBtns() {
        //问号
        this.Items.Image_what.onClickAndScale(this.onClickWhat.bind(this))
        // //退出
        // this.Items.Image_close.onClickAndScale(this.onClickClose.bind(this))
        //记录
        this.Items.Image_record.onClickAndScale(this.onClickRecord.bind(this))
        //服务
        this.Items.Image_service.onClickAndScale(this.onClickService.bind(this))
        //购买
        this.Items.Panel_add_cash.onClickAndScale(this.onClickAddCash.bind(this))
        //
        this.Items.Image_how_to_cash.onClickAndScale(this.onClickHowToAddCash.bind(this))
        //客服
        this.Items.Panel_add_server.onClickAndScale(this.onClickRecord.bind(this))
        //扩展层
        this.Items.Panel_ex.onClick(() => {
            this.setWhatVisible(false);
        });
    }

    initEvents() {
        //奖励提示
        this.bindEvent(
            {
                eventName: EVENT_ID.EVENT_GETREWARDTIPS,
                callback: (ndata) => {
                    this.onClickClose();
                }
            }
        );
        //RMB购买服务器返回订单号给予客户端
        this.bindEvent(
            {
                eventName: EVENT_ID.EVENT_PLAZA_MALL_RMBORDER,
                callback: (data) => {
                    app.sdk.pay();
                }
            }
        );
        //充值提示
        this.bindEvent(
            {
                eventName: `ShowShopPlayTips`,
                callback: () => {
                    app.popup.showDialog({
                        viewConfig: fw.BundleConfig.plaza.res[`shop/shop_tips_vertical`]
                    });
                }
            }
        );
        //充值次数发生变更
        this.bindEvent(
            {
                eventName: [
                    EVENT_ID.EVENT_PAY_SUCCESS,
                    EVENT_ID.EVENT_PLAZA_FIRSTRECHRGE_LASTTIME,
                ],
                callback: (dict) => {
                    this.updateView();
                }
            }
        );
    }

    //初始化支付方式
    initPay(payConfig) {
        if (fw.isNull(this.node)) {
            return;
        }
        let content = this.Items.ScrollView_pay.obtainComponent(ScrollView).content
        content.removeAllChildren(true);
        //充值列表
        let btns = [];
        let selectItem = null;
        let defaultKeyName = app.file.getStringForKey("LastPayKeyName", "");
        for (let index = 0; index < payConfig.length; index++) {
            const v = payConfig[index];
            let item = this.Items.Panel_pay_item.clone();
            content.addChild(item);
            item.active = true;
            //最热
            item.Items.Image_item_hot.active = v.tag == 2;
            //扩展标识
            item.Items.Text_btn_normal_ex.obtainComponent(Label).string = v.desc;
            item.Items.Text_btn_select_ex.obtainComponent(Label).string = v.desc;
            if (null == v.desc || "" == v.desc) {
                let oriPos1 = item.Items.Label_btn_normal.position;
                let oriPos2 = item.Items.Label_btn_select.position;
                item.Items.Label_btn_normal.setPosition(oriPos1.x, 0, oriPos1.z);
                item.Items.Label_btn_select.setPosition(oriPos2.x, 0, oriPos2.z);
            }
            let btn = {
                node: item,
                text: v.name,
                callback: () => {
                    this.payInfo = v;
                    this.tutorial_link = v.tutorial_link;
                    this.Items.Image_how_to_cash.active = false;
                    if (this.tutorial_link && this.tutorial_link != "") {
                        this.Items.Image_how_to_cash.active = true;
                    }
                }
            }
            btns.push(<FWOneMenuBtnParam<typeof btn>>btn);
            //默认选项
            if (!selectItem && defaultKeyName == v.key_name) {
                selectItem = index;
            }
        }
        //创建菜单
        app.func.createMenu({
            defaultIndex: selectItem,
            mountObject: this,
            btns: btns,
        });
    }

    updateView() {
        let mallLimitConfig = center.mall.mallLimitConfig;
        //自己的金额
        this.Items.Text_coin.obtainComponent(Label).string = "" + center.user.getActorProp(ACTOR.ACTOR_PROP_GOLD) / DF_RATE;
        //是否跳过第一个
        let nLastPayValue = app.file.getIntegerForKey("LastPayValue", 0, { all: true });
        let nRechangeTimes = app.file.getIntegerForKey("RechargeTimes", 0,{ all: true });
        let nRechangeTotalNum = app.file.getIntegerForKey("RechargeTotalNum", 0, { all: true });
        let bJumpFirst = nRechangeTimes > mallLimitConfig.buy_30times || nRechangeTotalNum > mallLimitConfig.buy_amount;
        //充值列表
        let btns = [];
        let nIndex = 0;
        let selectItem = 0;
        let selectIndex = 0;
        let nCashList = mallLimitConfig.num.list;
        let minPay = parseInt(this.popupData.minPay || nLastPayValue);
        let selectPayValue = 0;
        let sortPayValue = app.func.clone(nCashList);
        for (let k = 0; k < sortPayValue.length; k++) {
            const v = sortPayValue[k];
            selectPayValue = v;
            if (v >= minPay) {
                break;
            }
        }
        //移除原有元素
        let content = this.Items.ScrollView_add_cash.obtainComponent(ScrollView).content;
        content.removeAllChildren(true);
        for (let k = 0; k < nCashList.length; k++) {
            const v = nCashList[k];
            // //最多显示8个
            // if (nIndex >= 8) {
            //     break;
            // }
            if (!bJumpFirst || k > 0) {
                let item = this.Items.Panel_add_cash_item.clone();
                content.addChild(item);
                item.active = true;
                nIndex += 1;
                if (minPay == 0) {
                    //默认选中第二个
                    if (nIndex == 2) {
                        selectItem = v;
                    }
                } else {
                    if (v == selectPayValue) {
                        selectItem = v;
                    }
                }
                //奖励
                let nbonus = 0;
                let nRatio = center.luckyCard.getFirstRechrgeRatio(v)
                nbonus = nRatio.goodsNum
                let tempFirstCashVaild = false
                let notShowBonusReward = center.luckyCard.getShowBonusRewardStatus()
                if (nRatio.index > -1) {
                    tempFirstCashVaild = nRatio.ratio > 0 && center.user.isFirstCashVaild(nRatio.index) && !notShowBonusReward;
                }
                item.Items.Image_item_bonus.active = tempFirstCashVaild;

                //重新调整值
                let ratio = tempFirstCashVaild ? nRatio.ratio : 0;
                let giftTxt = fw.language.get("Bonus")
                let giftTxt2 = fw.language.get("BONUS")
                if (nRatio.goodsId == center.goods.gold_id.cash) {
                    giftTxt = fw.language.get("Cash")
                    giftTxt2 = fw.language.get("CASH")
                } else if (nRatio.goodsId == center.goods.gold_id.withdraw_gold) {
                    giftTxt = fw.language.get("Withdraw")
                    giftTxt2 = fw.language.get("WITHDRAW")
                } 
                
                item.Items.Text_item_bonus.obtainComponent(Label).string = giftTxt + " " + ratio + "%";
                let btn = {
                    node: item,
                    data: v,
                    text: DF_SYMBOL + v,
                    callback: () => {
                        //total
                        this.Items.BitmapFontLabel_total.obtainComponent(Label).string = `${v + nbonus}`;
                        //cash
                        this.Items.BitmapFontLabel_cash.obtainComponent(Label).string = `${v}`;
                        //bonus
                        this.Items.Text_title_bonus.obtainComponent(Label).string = giftTxt2
                        if (item.Items.Image_item_bonus.active) {
                            this.Items.BitmapFontLabel_bonus.obtainComponent(Label).string = String(nbonus);
                        } else {
                            this.Items.BitmapFontLabel_bonus.obtainComponent(Label).string = String(0);
                        }
                        //Text_add_cash
                        this.Items.Text_add_cash.obtainComponent(Label).string = fw.language.get("Add Cash") + " " + DF_SYMBOL + v;
                    }
                }
                btns.push(<FWOneMenuBtnParam<typeof v>>btn);
            }
        }
        btns.forEach((btn,index) => {
            if (btn.data == selectItem) {
                selectIndex = index
            }
        });
        //创建菜单
        this.menuCount = app.func.createMenu({
            defaultIndex: selectIndex,
            mountObject: this,
            btns: btns,
        });
    }

    setWhatVisible(bVisible?: boolean) {
        this.Items.Panel_ex.active = bVisible;
    }

    onClickWhat() {
        this.setWhatVisible(true);
    }

    onClickRecord() {
        app.popup.showDialog({
            viewConfig: fw.BundleConfig.plaza.res[`shop/shop_record`]
        });
    }

    onClickService() {
        app.popup.showDialog({
            viewConfig: fw.BundleConfig.plaza.res[`service/ServiceMain`]
        });
    }

    onClickHowToAddCash() {
        if (this.tutorial_link && this.tutorial_link != "") {
            sys.openURL(this.tutorial_link)
        }
    }

    onClickAddCash() {
        if (!this.menuCount || !this.menuCount.target || !this.payInfo) {
            return
        }

        let nValue = this.menuCount.target.data;
        let mallLimitConfig = center.mall.mallLimitConfig;
        if (!(nValue >= mallLimitConfig.min_num && nValue <= mallLimitConfig.max_num)) {
            app.popup.showToast({ text: `${mallLimitConfig.min_num}-${mallLimitConfig.max_num} is allowed` })
            return
        }

        let data: PayChannelData = {};
        data.lRMB = nValue;
        data.orderCallback = function () {
            let goodsData = center.mall.getBatchMallGoodsInfo();
            if (goodsData) {
                center.mall.sendRmbBatchBuy(goodsData.rid, nValue);
                app.popup.showLoading();
            }
        }
        //保存上一次支付方式
        app.file.setStringForKey("LastPayKeyName", this.payInfo.key_name);
        //保存上次购买的价格
        app.file.setIntegerForKey("LastPayValue", parseInt(nValue), { all: true });
        //检测支付
        let v = this.payInfo;
        data.customCallback = function () {
            //执行支付
            let payFast = function () {
                if (data.orderCallback) {
                    app.sdk.setKeyName(v.key_name);
                    setTimeout(() => {
                        data.orderCallback()
                    }, 1)
                }
            }
            let need_phone = parseInt(v.phone_need != null ? v.phone_need : 1);
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
        }

        center.mall.payChooseType(data);
    }
}

declare global {
    namespace globalThis {
        type plaza_ShopMain = ShopMain
    }
}
