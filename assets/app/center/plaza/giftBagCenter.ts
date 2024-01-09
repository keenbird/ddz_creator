import { PlazeMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";
import { GS_PLAZA_MSGID } from "../../config/NetConfig";
import { Node as ccNode }from 'cc';
import { EVENT_ID } from "../../config/EventConfig";
import proto from "../common";
import { ACTOR } from "../../config/cmd/ActorCMD";
import { DF_RATE } from "../../config/ConstantConfig";
import { httpConfig } from "../../config/HttpConfig";

export class giftBagCenter extends PlazeMainInetMsg {
    /**命令ID */
    // cmd = proto.plaza_giftbag.GS_PLAZA_GIFTBAG_MSG
    /**破产礼包配置 */
    mGiftBagCfg:proto.common.IBustBagCfgBase;
    /**是否开启 */
    mIsOpen: boolean = false;
    /**最大购买次数 */
    mMaxBuyCount: number = 0;
    /**购买金币限制 */
    mBuyGoldLimit: number = -1;
    /**购买区间 */
    mBuyGoldList: proto.common.IBustItem[];
    /**快充信息 */
    mBuyInfo: QuickRecharge;
    initData() {
        this.initMainID(GS_PLAZA_MSGID.GS_PLAZA_MSGID_GIFTBAG);
    }

    cleanUserData() {
        
    }

    // initRegister() {
    //     //提示信息
    //     this.bindMessage({
    //         cmd: this.cmd.PLAZA_GIFTBAG_TIPS,
    //         struct: proto.plaza_giftbag.act_tips_s,
    //         callback: this.plazaGiftBagTips.bind(this),
    //     });
    //     //破产礼包配置
    //     this.bindMessage({
    //         cmd: this.cmd.PLAZA_GIFTBAG_BUSTBAG_CFG,
    //         struct: proto.plaza_giftbag.bust_bag_cfg,
    //         callback: this.plazaGiftBagCfg.bind(this),
    //     });
    //     //破产礼包购买结果
    //     this.bindMessage({
    //         cmd: this.cmd.PLAZA_GIFTBAG_BUY_RET,
    //         struct: proto.plaza_giftbag.gift_bag_buy_ret,
    //         callback: this.plazaGiftBagBuyRet.bind(this),
    //     });
    //     //礼包订单号信息
    //     this.bindMessage({
    //         cmd: this.cmd.PLAZA_GIFTBAG_ORDER_RET,
    //         struct: proto.plaza_giftbag.order_ret,
    //         callback: this.plazaGiftBagOrderRet.bind(this),
    //     });
        
    //     this.bindMessage({
    //         struct: proto.plaza_giftbag.gift_bag_buy,
    //         cmd: this.cmd.PLAZA_GIFTBAG_BUY,
    //     });
    // }

    send_PLAZA_GIFTBAG_BUSTBAG_BUY(rechargeRid: number, type: number) {
        let data = proto.plaza_giftbag.gift_bag_buy.create()
        data.recharge_rid = rechargeRid
        data.gift_bag_type = type
        this.sendMessage({
            cmd: this.cmd.PLAZA_GIFTBAG_BUY,
            data: data
        });
    }

    /**提示信息 */
    plazaGiftBagTips(data: proto.plaza_giftbag.act_tips_s) {
        let tips = [
            "Your coins do not meet the requirements",
            "You have reached the purchase limit.",
            "This activity has been closed.",
            "Configuration error. Please try again later."
        ]
        app.popup.showToast({ text: tips[data.tips_id] || "tips"+ data.tips_id })
    }
    /**告示 */
    plazaGiftBagCfg(data: proto.plaza_giftbag.bust_bag_cfg) {
        this.mGiftBagCfg = data.cfg
        this.mIsOpen = data.cfg.is_open
        this.mMaxBuyCount = data.cfg.max_buy_count
        this.mBuyGoldLimit = data.cfg.buy_gold_limit
        this.mBuyGoldList = data.cfg.list || []
        this.mBuyGoldList.sort((a, b) => {
			return a.recharge_max - b.recharge_max;
		});
    }
    /**购买结果 */
    plazaGiftBagBuyRet(data: proto.plaza_giftbag.gift_bag_buy_ret) {
        let rewards = [];
        let flag = false
        data.gift_prop_id.forEach((prop_id, index) => {
            if (prop_id > 0) {
                rewards.push({
                    nGoodsID: prop_id,
                    nGoodsNum: data.gift_prop_num[index],
                });
            }
        });
        rewards.forEach((item)=>{
            if (data.quick_prop_id == item.nGoodsID) {
                flag = true
                item.nGoodsNum = item.nGoodsNum + data.quick_prop_num
            }
        });
        if (!flag) {
            rewards.push({
                nGoodsID: data.quick_prop_id,
                nGoodsNum: data.quick_prop_num,
            });
        }
        app.popup.showDialog({
            viewConfig: fw.BundleConfig.resources.res[`ui/reward/reward`],
            data: { reward: rewards },
        });
    }

    plazaGiftBagOrderRet(data: proto.plaza_giftbag.order_ret) {
        let nRID = data.rid;
        let lRMB = data.rmb;
        let szOrder = data.order;
        fw.print(`(待处理)lRMB========${lRMB}, szOrder========${szOrder}, nRID========${nRID}`)
        if (nRID == app.sdk.getRId()) {
            app.sdk.setOrderNum(szOrder)
            app.sdk.pay()
        } else {
            fw.print(`(待处理)lRMB========${lRMB}, szOrder========${szOrder}, nRID========${nRID} 已过期`)
        }
    }

    isGiftBagOpen() {
        return this.mIsOpen
    }

    getBuyInfo() {
        return this.mBuyInfo
    }

    async showGiftBagDialog(callbackFunc?: Function, cancelClickFun?: Function, callbsdack?: (view: ccNode, data: FWPopupDialogParam) => void) {
        let recharge_rid = -1
        let count = parseInt(center.user.getActorProp(ACTOR.ACTOR_PROP_BUSET_BUY_COUNT));
        let myGold = parseInt(center.user.getActorProp(ACTOR.ACTOR_PROP_GOLD));
        if (this.mIsOpen && count < this.mMaxBuyCount && myGold <= this.mBuyGoldLimit) {
            this.getMaxPaymentHis().then((maxPaymentHis:number = 0)=>{
                this.mBuyGoldList.forEach((list, index)=>{
                    if (maxPaymentHis > list.recharge_min && maxPaymentHis <= list.recharge_max) {
                        recharge_rid = list.recharge_rid;
                    }
                })
                if (recharge_rid == -1 && this.mBuyGoldList.length > 0 ) {
                    recharge_rid = this.mBuyGoldList[0].recharge_rid;
                }
                if (recharge_rid >= 0) {
                    let quickRecharge = center.roomList.getQuickRecharge(recharge_rid);
                    if (quickRecharge) {
                        if (center.user.canShowMegaGift()) {
                            let cancelClickFunTmp = cancelClickFun;
                            cancelClickFun = ()=>{
                                center.user.showMegaGift(cancelClickFunTmp);
                            }
                        }
                        app.popup.showDialog({
                            viewConfig: fw.BundleConfig.plaza.res[`bankruptcyGift/bankruptcyGift`],
                            data: {
                                quickRecharge: quickRecharge,
                                cancelClickListener: cancelClickFun,
                            }
                        });
                    } else {
                        callbackFunc?.();
                    } 
                } else {
                    callbackFunc?.();
                }
            }).catch(()=>{
                callbackFunc?.()
            })
        } else {
            callbackFunc?.()
        }
    }

    /**请求历史单笔最大充值金额 */
    getMaxPaymentHis() {
        return app.func.doPromise((resolve, reject) => {
            let params: any = {
                user_id: center.user.getUserID(),
                timestamp: app.func.time(),
            }
            resolve(0);
            // params.sign = app.http.getSign(params)
            // app.http.post({
            //     url: httpConfig.path_pay + "User/getUserMaxPayment",
            //     params: params,
            //     callback: (bSuccess, response) => {
            //         if (bSuccess) {
            //             if (1 == response.status) {
            //                 let maxPaymentHis = response.data.maxpay
            //                 if (maxPaymentHis < 0 ) {
            //                     maxPaymentHis = 0
            //                 }
            //                 resolve(maxPaymentHis);
            //             } else {
            //                 reject(new Error(`getMaxPaymentHis failed status:${response.status}!`));
            //             }
            //         } else {
            //             reject(new Error("getMaxPaymentHis failed to pull PHP configuration!"));
            //             fw.print("getMaxPaymentHis failed to pull PHP configuration!");
            //         }
            //     }
            // });
        })
    }
}

declare global {
    namespace globalThis {
    }
}
