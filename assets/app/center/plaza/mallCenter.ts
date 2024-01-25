import { instantiate, Prefab, _decorator } from 'cc';
import { PayChannel } from '../../../plaza/shop/script/PayChannel';
const { ccclass } = _decorator;

import { ACTOR } from '../../config/cmd/ActorCMD';
import { EVENT_ID } from "../../config/EventConfig";
import { httpConfig } from '../../config/HttpConfig';
import { GS_PLAZA_MSGID } from '../../config/NetConfig';
import { PlazeMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";
import proto from '../common';

const cmds = {
    MALL_TAG_GOLD: 1,	    //商城跳转到金币
    MALL_TAG_DIMOND: 2,	//商城跳转到钻石
    MALL_TAG_PROP: 3,	    //商城跳转到道具
    MALL_TAG_VIP: 4,		//商城跳转到VIP
    MALL_TAG_VIP_DISCOUNT: 5,		//商城跳转到VIP特惠
    MALL_TAG_VIP_GOLD: 6,		//vip随机商品

    MALL_PRICETYPE_DIAMONDS: 0,		//钻石购买
    MALL_PRICETYPE_GOLD: 1,			//金币购买
    MALL_PRICETYPE_RMB: 2,				//RMB购买

    MALL_RECHARGE_TIPS_1: 0,         //您当日充值有点多哦，请休息一会哦！
    MALL_RECHARGE_TIPS_2: 1,		 //您当日充值即将达到上限，请注意额度限制哦！
    MALL_RECHARGE_TIPS_3: 2,		 //您当日充值已达上限，无法进行充值了哦！
    MALL_RECHARGE_TIPS_4: 3,		 //本日可猜金币数已达上限，不可再次猜红包！
    MALL_RECHARGE_TIPS_5: 4,		 //本日可获得奖金已达上限，不可再次参赛！
}

@ccclass('mallCenter')
export class mallCenter extends PlazeMainInetMsg {

    ORDER_TYPE;
    m_bIsGetMallView = false;
    isCanBuyRandomGiftBag = false;
    cashMinNum: number = 0;
    cashMaxNum = 0;
    recharHelpUrl = "";
    cashNumTable = [];
    paychannelList = [];
    mPhpGetPayChannelRefreshTime = 0;
    mPhpGetPayChannelAsynFuncTab = [];

    /**命令ID */
    // cmd = proto.plaza_mall.GS_PLAZA_MALL_MSG
    MallTagArray: proto.plaza_mall.IMallTag[]
    mallLimitConfig: proto.common.IMallLimitCfg
    m_BatchGoods: proto.plaza_mall.IMallGoodNew
    MallGoodArray: proto.plaza_mall.IMallGoodNew[]
    m_rechargeProtectCfg: proto.plaza_mall.gs_mall_recharge_protect_cfg_s

    initData() {
        this.initMainID(GS_PLAZA_MSGID.GS_PLAZA_MSGID_MALL);
        this.ORDER_TYPE = {
            ORDER_TYPE_MALL: 0,// 商城购买
            ORDER_TYPE_TEEPATTI_INDUCE: 37, //teepatti诱导付费
            ORDER_TYPE_PAYBONUS_TASK: 38, //充值任务订单
        };

        this.m_BatchGoods = {};
        this.m_bIsGetMallView = false
        this.MallTagArray = [];
        this.MallGoodArray = [];
        this.isCanBuyRandomGiftBag = false
        this.cashMinNum = 0
        this.cashMaxNum = 0
        this.recharHelpUrl = ""
        this.cashNumTable = [];
        this.paychannelList = [];
        this.mPhpGetPayChannelRefreshTime = 0
        this.mPhpGetPayChannelAsynFuncTab = [];
        this.mallLimitConfig = {};
    }

    cleanUserData() {

    }

    // initRegister() {
    //     this.bindMessage({
    //         struct: proto.plaza_mall.gs_mall_view_c,
    //         cmd: this.cmd.PLAZA_MALL_VIEW,
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_mall.gs_mall_buy_c,
    //         cmd: this.cmd.PLAZA_MALL_BUY,
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_mall.gs_mall_rmb_buy_c,
    //         cmd: this.cmd.PLAZA_MALL_RMBBUY,
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_mall.gs_mall_rmb_order_s,
    //         cmd: this.cmd.PLAZA_MALL_RMBORDER,
    //         callback: this.OnRecv_MallRmbOrder.bind(this)
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_mall.gs_mall_tips_s,
    //         cmd: this.cmd.PLAZA_MALL_TIPS,
    //         callback: this.OnRecv_MallTips.bind(this)
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_mall.gs_mall_batch_goods_s,
    //         cmd: this.cmd.PLAZA_MALL_BATCHGOODS,
    //         callback: this.OnRecv_BatchGoods.bind(this)
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_mall.gs_mall_rmb_batch_buy_c,
    //         cmd: this.cmd.PLAZA_MALL_RMBBATCHBUY,
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_mall.gs_mall_tag_info_s,
    //         cmd: this.cmd.PLAZA_MALL_TAG_INFO,
    //         callback: this.onRecv_MallTagInfo.bind(this)
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_mall.gs_mall_goods_info_s,
    //         cmd: this.cmd.PLAZA_MALL_GOODS_INFO,
    //         callback: this.onRecv_MallGoodsInfo.bind(this)
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_mall.gs_mall_recharge_tips_s,
    //         cmd: this.cmd.PLAZA_MALL_RECHARGE_TIPS,
    //         callback: this.onRecv_MallRechargeTips.bind(this)
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_mall.gs_malll_imit_config_s,
    //         cmd: this.cmd.PLAZA_MALL_LIMIT_CONFIG,
    //         callback: this.onRecv_MallLimitConfig.bind(this)
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_mall.gs_mall_recharge_protect_cfg_s,
    //         cmd: this.cmd.PLAZA_MALL_RECHARGE_PROTECT_CONFIG,
    //         callback: this.onRecv_MallProtectConfig.bind(this)
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_mall.gs_mall_recharge_protect_req_c,
    //         cmd: this.cmd.PLAZA_MALL_RECHARGE_PROTECT_GET_REQ,
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_mall.gs_mall_recharge_protect_rsp,
    //         cmd: this.cmd.PLAZA_MALL_RECHARGE_PROTECT_GET_RSP,
    //         callback: this.onRecv_MallProtectGetRsp.bind(this)
    //     });
    // }

    //通过索引Id获取商品信息
    getMallGoodInfo(nRID: number) {
        for (const k in this.MallGoodArray) {
            const v = this.MallGoodArray[k];
            if (v["nRID"] == nRID) {
                return v
            }
        }
        return null;
    }

    //通过商品Id获取商品信息 返回找到的第一个
    getMallGoodInfoByGoodsID(nRID) {
        for (const k in this.MallGoodArray) {
            const v = this.MallGoodArray[k];
            if (v["nRID"] == nRID) {
                return v
            }
        }
        return null;
    }

    //获得标签列表
    getMallTagList() {
        return this.MallTagArray;
    }

    //获得可批量购买商品
    getBatchMallGoodsInfo() {
        return this.m_BatchGoods;
    }

    //通过分类标签获得商品列表
    getMallGoodsListByTag(sTagID) {
        let temp = [];
        for (let k = 0; k < this.MallGoodArray.length; k++) {
            const v = this.MallGoodArray[k];
            if (v["sTagID"] == sTagID) {
                temp.push(v);
            }
        }
        return temp;
    }

    getRechargeProtectCfg() {
        return this.m_rechargeProtectCfg;
    }

    getMallLimitConfig() {
        return { cashMinNum: this.cashMinNum, cashMaxNum: this.cashMaxNum, cashNumTable: this.cashNumTable };
    }

    getRecharHelpUrl() {
        return this.recharHelpUrl || "";
    }

    sendRmbBatchBuy(nRID, uCount) {
        this.__sendRmbBatchBuy(nRID, uCount, this.ORDER_TYPE.ORDER_TYPE_MALL)
    }

    __sendRmbBatchBuy(nRID, uCount, nOrderType) {
        let data = proto.plaza_mall.gs_mall_rmb_batch_buy_c.create()
        data.rid = nRID
        data.count = uCount
        data.order_type = nOrderType
        this.sendData(this.cmd.PLAZA_MALL_RMBBATCHBUY, data);
    }

    sendGetProtectReward() {
        let data = proto.plaza_mall.gs_mall_recharge_protect_req_c.create()
        this.sendData(this.cmd.PLAZA_MALL_RECHARGE_PROTECT_GET_REQ, data)
    }

    /**RMB购买服务器返回订单号给予客户端 */
    OnRecv_MallRmbOrder(dict: proto.plaza_mall.gs_mall_rmb_order_s) {
        let goodsInfo = center.goods.getGoodsInfo(this.m_BatchGoods.goodsid);
        let goodsName = "";
        if (goodsInfo) {
            goodsName = goodsInfo.goods_name;
        } else {
            goodsName = this.m_BatchGoods.title;
        }
        // 设置好支付后，调起支付
        app.sdk.setPrice(dict.rmb);
        app.sdk.setGoodsName(goodsName);
        app.sdk.setOrderNum(dict.order);
        app.sdk.setRID(dict.rid);
        app.sdk.pay();
    }
    /**提示客户端 */
    OnRecv_MallTips(dict: proto.plaza_mall.gs_mall_tips_s) {
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAZA_MALL_TIPS,
            data: dict,
        });
    }
    /**可批量购买商品下发 */
    OnRecv_BatchGoods(dict: proto.plaza_mall.gs_mall_batch_goods_s) {
        this.m_BatchGoods = dict.goods;
    }
    /**商品标签 */
    onRecv_MallTagInfo(dict: proto.plaza_mall.gs_mall_tag_info_s) {
        this.MallTagArray = dict.data || [];
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAZA_MALL_VIEW_RETURN,
        });
    }
    /**商城物品 */
    onRecv_MallGoodsInfo(dict: proto.plaza_mall.gs_mall_goods_info_s) {
        if (dict.flag == 0) {
            this.MallGoodArray = dict.data || [];
        } else {
            for (let i = 0; i < dict.data.length; i++) {
                this.MallGoodArray.push(dict.data[i]);
            }
        }
        if (dict.flag == 0 || dict.flag == 2) {
            app.event.dispatchEvent({
                eventName: EVENT_ID.EVENT_PLAZA_MALL_VIEW_RETURN,
            });
        }
    }
    /**充值绿色提示 */
    onRecv_MallRechargeTips(dict: proto.plaza_mall.gs_mall_recharge_tips_s) {
        switch (dict.tips_id) {
            case cmds.MALL_RECHARGE_TIPS_1:
                app.popup.showTip({ text: "Perfect information success" });
                break;
            case cmds.MALL_RECHARGE_TIPS_2:
                app.popup.showTip({ text: "Perfect information success" });
                break;
            case cmds.MALL_RECHARGE_TIPS_3:
                app.popup.showTip({ text: "Perfect information success" });
                break;
            case cmds.MALL_RECHARGE_TIPS_4:
                break;
            case cmds.MALL_RECHARGE_TIPS_5:
                break;
        }
    }
    /**商城限制配置 */
    onRecv_MallLimitConfig(dict: proto.plaza_mall.gs_malll_imit_config_s) {
        this.cashMinNum = dict.mall_cfg.min_num;
        this.cashMaxNum = dict.mall_cfg.max_num;
        this.recharHelpUrl = dict.mall_cfg.help_url;
        this.cashNumTable = dict.mall_cfg.num.list || [];
        //配置
        dict.mall_cfg.num.list ??= [];
        this.mallLimitConfig = dict.mall_cfg;
        this.mallLimitConfig.num.list.sort((a, b) => {
            return a - b;
        });
    }
    /**充值保护配置 */
    onRecv_MallProtectConfig(dict: proto.plaza_mall.gs_mall_recharge_protect_cfg_s) {
        this.m_rechargeProtectCfg = dict;
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_RECHARGE_PROTECT_CFG,
            data: dict,
        });
    }
    /**充值保护领奖返回 */
    onRecv_MallProtectGetRsp(dict: proto.plaza_mall.gs_mall_recharge_protect_rsp) {
        let tips = [
            "Success",
            "Activity closed",
            "Time has not come",
            "Invalid activity",
            "Maximum times"
        ];
        if (dict.result == 0) {
            let data: any = {}
            data.reward = [{ nGoodsID: center.goods.gold_id.cash, nGoodsNum: dict.prize_count }]
            data.extend = { bDontShowTitle: true }
            app.popup.showDialog({
                viewConfig: fw.BundleConfig.resources.res[`ui/reward/reward`],
                data: data,
            });
        }
        if (dict.result > 0 && dict.result <= 4) {
            app.popup.showTip({ text: tips[dict.result] })
        }
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_RECHARGE_PROTECT_REWARD,
            data: dict,
        });
    }

    phpGetPayChannel(callback) {
        this.mPhpGetPayChannelRefreshTime = app.func.time() + 30;

        let url = httpConfig.path_pay + "payment/channelList";
        let params = {
            vip: center.user.getActorVipLevel(),
            user_id: center.user.getActorProp(PROTO_ACTOR.UAT_UID),
            channel_id: app.native.device.getOperatorsID(),
            subChannel_id: app.native.device.getOperatorsSubID(),
        };

        app.http.post(
            {
                url: url,
                params: params,
                callback: (bSuccess, content) => {
                    if (bSuccess) {
                        let result = content;
                        if (result) {
                            if (result.status == 1) {
                                this.paychannelList = result.data;
                                if (callback) {
                                    callback(result.data);
                                }
                                app.event.dispatchEvent({
                                    eventName: EVENT_ID.EVENT_PAY_CHANNEL_LIST,
                                })
                            }
                        }
                    }
                },
            }
        )
    }


    payChooseType(dict: PayChannelData, isVertical?: boolean) {
        this.phpGetPayChannel((payChannel) => {
            this.asynPayChooseType(dict, payChannel, isVertical);
        });
    }


    asynPayChooseType(dict: PayChannelData, payChannel, isVertical?: boolean) {
        if (payChannel) {
            // EventHelp.reportEvent("rechar_page") to do
            let payChannelCount = payChannel.length;
            let rechargeAutoSelectCount = app.file.getIntegerForKey("RechargeAutoSelectCount", 0)
            let vipLv = center.user.getActorVipLevel();

            let defaultCall = function () {
                if (dict.customCallback) {
                    dict.customCallback();
                } else {
                    if (isVertical) {
                        app.event.dispatchEvent({
                            eventName: "showPayChannelVeritcal",
                            data: dict,
                        })
                    } else {
                        app.popup.showDialog({
                            viewConfig: fw.BundleConfig.plaza.res[`shop/payChannel_dlg`],
                            data: dict,
                        });
                    }
                }
            }

            if (center.user.isSwitchOpen("btDirectToPayChannelSwitch")) {
                defaultCall();
            } else if (payChannelCount == 1) {
                let payFast = function () {
                    if (dict.orderCallback) {
                        app.sdk.setKeyName(payChannel[0].key_name);
                        setTimeout(() => {
                            app.popup.showLoading({ nAutoOutTime: 10 });
                            dict.orderCallback();
                        }, 1);
                    }
                }
                let need_phone = parseInt(payChannel[0].phone_need ?? 1);
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
            } else if (payChannelCount >= 1 && vipLv > 1 && dict.isAutoSelect == true && rechargeAutoSelectCount < 3) {
                let payFast = function () {
                    //每天前3次点击直接呼起支付。
                    //优先呼起上次支付成功的支付方式 没有就循环支付方式列表
                    app.file.setIntegerForKey("RechargeAutoSelectCount", rechargeAutoSelectCount + 1);
                    let keyName = app.file.getStringForKey("RechargeKeyName", "");
                    for (let i = 0; i < payChannel.length; i++) {
                        const v = payChannel[i];
                        if (keyName == v.key_name) {
                            if (dict.orderCallback) {
                                app.sdk.setKeyName(v.key_name);
                                setTimeout(() => {
                                    app.popup.showLoading({ nAutoOutTime: 10 });
                                    dict.orderCallback();
                                }, 1);
                            }
                            return;
                        }
                    }

                    let sortList = app.func.clone(payChannel);
                    sortList.sort((a, b) => {
                        return parseInt(a.pay_sorts) - parseInt(b.pay_sorts);
                    });
                    let index = (rechargeAutoSelectCount % payChannelCount);
                    if (dict.orderCallback) {
                        app.sdk.setKeyName(sortList[index].key_name);
                        setTimeout(() => {
                            app.popup.showLoading({ nAutoOutTime: 10 });
                            dict.orderCallback();
                        }, 1);
                    }
                }

                let need_phone = parseInt(payChannel[0].phone_need ?? 1);
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
            } else {
                defaultCall();
            }

        }
    }
    /**展示奖励弹窗，传入奖励list */
    payReward(dict: RewardItem[], dontShowTitle: boolean = false, data?: proto.plaza_tips.Irewardtips_s) {
        let extendData = { bDontShowTitle: dontShowTitle, data: data, };
        app.popup.showDialog({
            viewConfig: fw.BundleConfig.resources.res[`ui/reward/reward`],
            data: { reward: dict, extend: extendData },
        });
    }
    /**??? */
    isRechargeProtectOpen() {
        let cfg = this.getRechargeProtectCfg();
        let nPrize = center.user.getActorProp(ACTOR.ACTOR_PROP_RECHARGE_PROTECT_PRIZE) ?? 0;
        let nTime = center.user.getActorProp(ACTOR.ACTOR_PROP_RECHARGE_PROTECT_END_TIME) ?? 0;
        return (nTime > 0 && nPrize > 0) && (cfg && cfg.is_close == 1);
    }

    getRechargeProtectTime() {
        let nDelServerTime = center.user.getServerDelTime()
        let nTime = center.user.getActorProp(ACTOR.ACTOR_PROP_RECHARGE_PROTECT_END_TIME)
        let nCurTime = app.func.time()
        let nDelTime = nTime - nCurTime
        if (nDelServerTime >= 0) {
            nDelTime = nDelTime - Math.abs(nDelServerTime)
        } else {
            nDelTime = nDelTime + Math.abs(nDelServerTime)
        }
        nDelTime = nDelTime > 0 && nDelTime || 0

        let nHour = Math.floor(nDelTime / 3600)
        let nMin = Math.floor((nDelTime - nHour * 3600) / 60)
        let nSecond = nDelTime - nHour * 3600 - nMin * 60

        fw.print(" ================== nDelServerTime: ", nDelServerTime)
        fw.print(" ================== nTime: ", nTime)
        fw.print(" ================== nDelTime: ", nDelTime)
        fw.print(" ================== nEndTime: ", (nCurTime + nDelTime))
        fw.print(" ================== nSecond: ", (nHour * 3600 + nMin * 60 + nSecond))

        let time = {
            nHour: nHour,
            nMin: nMin,
            nSecond: nSecond,
            nDelTime: nDelTime,
        }
        return time
    }
    isShowProtectDlg() {
        let nSceneName = fw.scene.getSceneName()
        let bInGame = nSceneName == fw.SceneConfigs.plaza.sceneName
        let nFlag = bInGame && app.file.getIntegerForKey("RECHARGE_PROTECT_ROOM", 0) || app.file.getIntegerForKey("RECHARGE_PROTECT_PLAZA", 0)
        let bOpen = this.isRechargeProtectOpen();
        fw.print(" ================ bInGame: ", String(bInGame))
        fw.print(" ================ nSceneName: ", nSceneName)
        fw.print(" ================ nFlag: ", nFlag)
        if (nFlag == 0 && bOpen) {
            if (bInGame) {
                app.file.setIntegerForKey(`RECHARGE_PROTECT_ROOM`, 1);
            } else {
                app.file.setIntegerForKey(`RECHARGE_PROTECT_PLAZA`, 1);
            }
            app.file.setStringForKey("RECHARGE_PROTECT_DATE", app.func.time_YMD());
        }
        return (bOpen && nFlag == 0)
    }
}

