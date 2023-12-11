import { ACTOR } from "../../config/cmd/ActorCMD";
import { LUCKCARD } from '../../../app/config/cmd/LuckyCardCMD';
import { DF_RATE } from "../../config/ConstantConfig";
import { EVENT_ID } from "../../config/EventConfig";
import { bool, GS_PLAZA_MSGID, schar, sfloat, sint, sint64, slong, stchar, uchar, uint, uint64, ulong, ushort } from "../../config/NetConfig";
import { PlazeMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";
import proto from "../common";

export interface UseCardInfo {
    nCardType?: number,
    nCardID?: number,
    nDaysRemaining?: number,
    bAppliedToday?: number
}

export interface SelfLuckCardInfos {
    nWeekCardID?: number,
    nWeekDaysRemaining?: number,
    bWeekAppliedToday?: number

    nMonthCardID?: number,
    nMonthDaysRemaining?: number,
    bMonthAppliedToday?: number
}
export interface MegaGifConfig extends proto.common.IMegaGiftCfg {
    megaGifPrice?: proto.common.IMegaGiftItem[]
}


const enum TIPS_ID {
    REPEAT_PURCHASE,
    REPEAT_APPLY,
    INVALID_DATA
}

const ERRID_MSG: Map<TIPS_ID, string> = new Map([
    [TIPS_ID.REPEAT_PURCHASE, /**lang*/"You have already bought it!"],
    [TIPS_ID.REPEAT_APPLY, /**lang*/"Rewards have been claimed!"],
    [TIPS_ID.INVALID_DATA, /**lang*/"The configuration is invalid or the product is off the shelf!"],
])




export class LuckyCardCenter extends PlazeMainInetMsg {
    cmd = proto.plaza_luckcard.GS_PLAZA_LUCKCARD_MSG
    declare mLuckyCardConfig: proto.plaza_luckcard.ICardConfig[]
    declare mSelfLuckCardInfosNew: UseCardInfo[] //已经购买的卡片信息
    declare mGetLuckyCardConfigFlag: boolean;  //是否下发了周卡月卡配置
    declare mSelfLuckCardInfosFlag: boolean;// 标记购买周卡月卡后用户信息返回
    declare mLuckyCardOpen: boolean;
    declare mSelfDBID: any;

    //首充礼包
    declare m_FirstRechrgeConfig: proto.common.IFirstRechargeCfg

    //megaGift 
    declare mMegaGifConfig: MegaGifConfig

    declare isSelfLuckCardBuy: number
    declare newFirstRechrgeLastTime: number;
    declare schedule_updateTime: number;
    declare notShowBonusReward: boolean;

    initData() {
        this.initMainID(GS_PLAZA_MSGID.GS_PLAZA_MSGID_LUCK_CARD);
        this.cleanUserData()
    }

    cleanUserData() {
        this.mGetLuckyCardConfigFlag = false;
        this.mSelfLuckCardInfosFlag = false;
        this.mLuckyCardOpen = false;
        this.mSelfLuckCardInfosNew = [];
        this.mLuckyCardConfig = [];
        this.mMegaGifConfig = null;
        this.isSelfLuckCardBuy = 0;
        this.notShowBonusReward = false;
    }

    initRegister() {
        this.bindMessage({
            struct: proto.plaza_luckcard.luck_card_tips,
            cmd: this.cmd.PLAZA_LUCKCARD_TIPS,
            callback: this.onLuckCardTips.bind(this)
        });

        this.bindMessage({
            struct: proto.plaza_luckcard.luck_card_cfg_req,
            cmd: this.cmd.PLAZA_LUCKCARD_CONFIG_REQ,
        });

        this.bindMessage({
            struct: proto.plaza_luckcard.luck_card_cfg,
            cmd: this.cmd.PLAZA_LUCKCARD_CONFIG,
            callback: this.onLuckCardConfig.bind(this)
        });

        this.bindMessage({
            struct: proto.plaza_luckcard.luck_card_buy,
            cmd: this.cmd.PLAZA_LUCKCARD_BUY,
        });

        this.bindMessage({
            struct: proto.plaza_luckcard.luck_card_buy_oder,
            cmd: this.cmd.PLAZA_LUCKCARD_BUY_ODER,
            callback: this.onLuckCardBuyOder.bind(this)
        });

        this.bindMessage({
            struct: proto.plaza_luckcard.luck_card_buy_res,
            cmd: this.cmd.PLAZA_LUCKCARD_BUY_RESULT,
            callback: this.onLuckCardBuyResult.bind(this)
        });

        this.bindMessage({
            struct: proto.plaza_luckcard.luck_card_daily_apply,
            cmd: this.cmd.PLAZA_LUCKCARD_DAILY_APPLY,
        });

        this.bindMessage({
            struct: proto.plaza_luckcard.luck_card_daily_apply_ret,
            cmd: this.cmd.PLAZA_LUCKCARD_DAILY_APPLY_RET,
            callback: this.onLuckCardDailyApplyRet.bind(this)
        });

        this.bindMessage({
            struct: proto.plaza_luckcard.luck_card_user_req,
            cmd: this.cmd.PLAZA_LUCKCARD_USER_REQ,
        });

        this.bindMessage({
            struct: proto.plaza_luckcard.luck_card_user_ret,
            cmd: this.cmd.PLAZA_LUCKCARD_USER_RET,
            callback: this.onLuckCardUserRet.bind(this)
        });

        this.bindMessage({
            struct: proto.plaza_luckcard.first_recharge_cfg,
            cmd: this.cmd.PLAZA_NEWFIRSTRECHARGE_CONFIG,
            callback: this.onNewFirstRechrgeConfig.bind(this)
        });

        this.bindMessage({
            struct: proto.plaza_luckcard.first_recharge_cashback,
            cmd: this.cmd.PLAZA_NEWFIRSTRECHARGE_CASHBACK,
        });

        this.bindMessage({
            struct: proto.plaza_luckcard.first_recharge_cashback_res,
            cmd: this.cmd.PLAZA_NEWFIRSTRECHARGE_CASHBACK_RESULT,
            callback: this.onCashBackResult.bind(this)
        });

        this.bindMessage({
            struct: proto.plaza_luckcard.mega_gift_cfg,
            cmd: this.cmd.PLAZA_MEGA_GIFT_CFG,
            callback: this.onMegaGiftCfg.bind(this)
        });

        this.bindMessage({
            struct: proto.plaza_luckcard.mega_gift_buy,
            cmd: this.cmd.PLAZA_MEGA_GIFT_BUY,
        });

        this.bindMessage({
            struct: proto.plaza_luckcard.mega_gift_order,
            cmd: this.cmd.PLAZA_MEGA_GIFT_BUY_ORDER,
            callback: this.onMegaGiftBuyOrder.bind(this)
        });

        this.bindMessage({
            struct: proto.plaza_luckcard.mega_gift_buy_res,
            cmd: this.cmd.PLAZA_MEGA_GIFT_BUY_RESULT,
            callback: this.onMegaGiftBuyResult.bind(this)
        });

        this.bindMessage({
            struct: proto.plaza_luckcard.first_recharge_reward_tips,
            cmd: this.cmd.PLAZA_FIRST_RECHARGE_REWARDTIPS,
            callback: this.onFirstRechargeRewardTips.bind(this)
        });
    }

    //请求幸运卡配置（日卡周卡月卡季卡等）
    sendGetLuckcardConfig() {
        let data = proto.plaza_luckcard.luck_card_cfg_req.create()
        return this.sendData(this.cmd.PLAZA_LUCKCARD_CONFIG_REQ, data)
    }

    //购买幸运卡
    sendBuyLuckcard(nID) {
        let data = proto.plaza_luckcard.luck_card_buy.create()
        data.card_id = nID
        return this.sendData(this.cmd.PLAZA_LUCKCARD_BUY, data)
    }
    //获取每日奖励
    sendGetLuckcardDailyApply(nCurCardID) {
        let data = proto.plaza_luckcard.luck_card_daily_apply.create()
        data.card_id = nCurCardID
        return this.sendData(this.cmd.PLAZA_LUCKCARD_DAILY_APPLY, data)
    }
    //玩家请求自己的幸运卡信息
    sendGetUserLuckcard() {
        let data = proto.plaza_luckcard.luck_card_user_req.create()
        return this.sendData(this.cmd.PLAZA_LUCKCARD_USER_REQ, data)
    }

    onLuckCardTips(dict: proto.plaza_luckcard.Iluck_card_tips) {
        let tips = dict.tips //tipsFunc.getLuckCardTips(dict.nType) || dict.szTips
        fw.print("(已处理)此处弹出提示", tips)
        let msg = tips == "" ? ERRID_MSG.get(dict.type_id) : tips;
        if (msg) {
            app.popup.showToast(fw.language.get(msg));
        } else {
            app.popup.showToast(fw.language.get("UNKOWN ERROR"));
        }
    }

    onLuckCardConfig(dict: proto.plaza_luckcard.Iluck_card_cfg) {
        fw.print("luckyCardManager:onLuckCardConfig")
        fw.print(dict, "onLuckCardConfig", 6)
        this.mLuckyCardConfig = dict.card_cfg
        this.mGetLuckyCardConfigFlag = true
        center.luckyCard.isLuckCardOpen()
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAZA_LUCKCARD_CONFIG,
        })
        app.event.dispatchEvent({
			eventName: "UpdateActivityBtn",
			data: "VipCard"
		})
    }

    async showVipCardView() {
        if (center.luckyCard.isLuckCardOpen().isopen) { //--周卡 月卡功能开启
            if(await app.dynamicActivity.showStandardActivity(`VipCard`)) {
                await app.popup.showDialog({
                    viewConfig: fw.BundleConfig.VipCard.res[`ui/vipCard/vipCard_dialog`],
                });
            }
        }
    }

    onLuckCardBuyOder(dict: proto.plaza_luckcard.Iluck_card_buy_oder) {
        fw.print("luckyCardManager:onLuckCardBuyOder")
        fw.print(dict, "onLuckCardBuyOder")
        let szOrder = dict.order_id
        let nRID = dict.rid
        fw.print("(已处理)充值订单号 和 RID", szOrder, nRID)
        fw.print("要区分ios 和 Android")

        let luckCard = this.getLuckCardInfo(nRID);
        if (luckCard) {
            // -- 设置好支付后，调起支付
            app.sdk.setPrice(luckCard.price)
            app.sdk.setGoodsName(luckCard.title)
            app.sdk.setOrderNum(dict.order_id)
            app.sdk.setRID(dict.rid.toString())
            app.event.dispatchEvent({
                eventName: EVENT_ID.EVENT_PLAZA_LUCKCARD_BUY_ODER,
                dict: dict
            })
        } else {
            fw.print("找不到幸运卡")
        }
    }

    onLuckCardBuyResult(dict: proto.plaza_luckcard.luck_card_buy_res) {
        fw.print("luckyCardManager:onLuckCardBuyResult")
        // -- fw.print(dict,"onLuckCardBuyResult")
        if (dict.is_success == 1) {
            app.popup.showToast({ text: fw.language.get("Buy success") })
            this.sendGetUserLuckcard()
            // 这里可以优化根据cardId 去 周卡月卡里面找
            this.mSelfLuckCardInfosFlag = false

            // 购买奖励
            let info = center.luckyCard.getLuckCardInfo(dict.card_id)
            if (info) {
                let rewardTab: RewardItem[] = []
                info.once_gifts.forEach((v) => {
                    if (v.goods_id != 0) {
                        let tab: RewardItem = {
                            nGoodsID: v.goods_id,
                            nGoodsNum: v.goods_num
                        }
                        if (tab.nGoodsNum > 1) {
                            rewardTab.push(tab)
                        }
                    }
                })
                if (rewardTab.length > 0) {
                    center.mall.payReward(rewardTab,true)
                }
            }

            app.event.dispatchEvent({
                eventName: EVENT_ID.EVENT_PLAZA_LUCKCARD_BUY_RESULT,
            })
        } else {
            app.popup.showToast({ text: fw.language.get("Buy failed") })
        }
    }

    onLuckCardDailyApplyRet(dict: proto.plaza_luckcard.luck_card_daily_apply_ret) {
        fw.print(dict, "luckyCardManager:onLuckCardDailyApplyRet")
        if (dict.is_success == 1) {
            let info = this.getLuckCardInfo(dict.card_id)
            if (info) {
                let rewardTab: RewardItem[] = []
                info.daily_gift.forEach(v => {
                    if (v.goods_id != 0) {
                        let tab: RewardItem = {
                            nGoodsID: v.goods_id,
                            nGoodsNum: v.goods_num
                        }
                        if (info.card_type == LUCKCARD.LUCKCARD_WEEK_CARD) {
                            let count = center.user.getActorProp(ACTOR.ACTOR_PROP_LOTTERY_WEEK_PRICENUM)
                            if (count > 0) {
                                tab.nGoodsNum = count
                            }
                        } else if (info.card_type == LUCKCARD.LUCKCARD_MONTH_CARD) {
                            let count = center.user.getActorProp(ACTOR.ACTOR_PROP_LOTTERY_MONTH_PRICENUM)
                            if (count > 0) {
                                tab.nGoodsNum = count
                            }
                        } else if (info.card_type == LUCKCARD.LUCKCARD_DAY_CARD) {
                            let count = center.user.getActorProp(ACTOR.ACTOR_PROP_LOTTERY_DAY_PRICENUM)
                            if (count > 0) {
                                tab.nGoodsNum = count
                            }
                        }
                        rewardTab.push(tab)
                        this.changeLuckCardInfos(info.card_type, 1)
                    }
                })
                center.mall.payReward(rewardTab,true)
            } else {
                app.popup.showToast({ text: fw.language.get("Get the reward for success") })
            }
        } else {
            app.popup.showToast({ text: fw.language.get("Failed to receive reward") })
        }
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAZA_LUCKCARD_DAILY_APPLY_RET,
        })
    }

    onLuckCardUserRet(dict: proto.plaza_luckcard.luck_card_user_ret) {
        fw.print("luckyCardManager:onLuckCardUserRet")
        fw.print(dict, "onLuckCardUserRet")
        this.mSelfLuckCardInfosFlag = true

        this.updateLuckCardUserCard(dict)

        this.mSelfDBID = center.user.getActorProp(ACTOR.ACTOR_PROP_DBID)
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAZA_LUCKCARD_USER_RET,
        })
    }

    // -- 获取当前使用的卡片信息
    getCurUseCardInfoNew(cardType?: LUCKCARD, cardID?: number) {
        if (this.mSelfLuckCardInfosFlag) {
            let useCardInfo: UseCardInfo;
            this.mSelfLuckCardInfosNew.forEach((cardInfo)=>{
                if ((cardType && cardInfo.nCardType == cardType)||(cardID && cardInfo.nCardID == cardID)) {
                    useCardInfo = cardInfo;
                }
            })
            return useCardInfo
        }
    }

    changeLuckCardInfos(cardType: number, status: number) {
        this.mSelfLuckCardInfosNew.forEach((cardInfo)=>{
            if ((cardType && cardInfo.nCardType == cardType)) {
                cardInfo.bAppliedToday = status;
            }
        })
    }

    updateLuckCardUserCard(dict: proto.plaza_luckcard.luck_card_user_ret) {
        let mSelfLuckCardInfosNew: UseCardInfo[] = []
        if (dict.week_card_id > 0) {
            mSelfLuckCardInfosNew.push({
                nCardType: LUCKCARD.LUCKCARD_WEEK_CARD,
                nCardID : dict.week_card_id,
                nDaysRemaining : dict.week_days_remaining,
                bAppliedToday : dict.week_applied_today,
            })
        }
        if (dict.month_card_id > 0) {
            mSelfLuckCardInfosNew.push({
                nCardType: LUCKCARD.LUCKCARD_MONTH_CARD,
                nCardID : dict.month_card_id,
                nDaysRemaining : dict.month_days_remaining,
                bAppliedToday : dict.month_applied_today,
            })
        }
        if (dict.day_card_id > 0) {
            mSelfLuckCardInfosNew.push({
                nCardType: LUCKCARD.LUCKCARD_DAY_CARD,
                nCardID : dict.day_card_id,
                nDaysRemaining : dict.day_days_remaining,
                bAppliedToday : dict.day_applied_today,
            })
        }
        this.mSelfLuckCardInfosNew = mSelfLuckCardInfosNew
    }

    //通过索引Id获取商品信息
    getLuckCardInfo(nRID) {
        nRID = Number(nRID)
        let config: proto.plaza_luckcard.ICardConfig = null
        this.mLuckyCardConfig.forEach(v => {
            if (v.card_id == nRID) {
                config = v
            }
        })
        return config
    }

    getMonthCardConfigByType(cardType) {
        let config: proto.plaza_luckcard.ICardConfig
        for (const card of this.mLuckyCardConfig) {
            if (card.card_type == cardType) {
                config = card
                break
            }
        }
        return config
    }

    canBuyLuckCard(cardType?: number) {
        let flag = true;
        let cardInfo = this.getCurUseCardInfoNew(cardType)
        if (cardInfo) {
            flag = false;
        }
        return flag;
    }

    isLuckCardOpen() {
        let openStatus = {
            [LUCKCARD.LUCKCARD_WEEK_CARD]: false,
            [LUCKCARD.LUCKCARD_MONTH_CARD]: false,
            [LUCKCARD.LUCKCARD_DAY_CARD]: false,
        }
        this.mLuckyCardOpen = false
        this.mLuckyCardConfig.forEach(v => {
            if (v.card_type == LUCKCARD.LUCKCARD_WEEK_CARD && v.status == 1) {
                openStatus[LUCKCARD.LUCKCARD_WEEK_CARD] = true
                this.mLuckyCardOpen = true
            } 
            if (v.card_type == LUCKCARD.LUCKCARD_MONTH_CARD && v.status == 1) {
                openStatus[LUCKCARD.LUCKCARD_MONTH_CARD] = true
                this.mLuckyCardOpen = true
            } else if (v.card_type == LUCKCARD.LUCKCARD_DAY_CARD && v.status == 1) {
                openStatus[LUCKCARD.LUCKCARD_DAY_CARD] = true
                this.mLuckyCardOpen = true
            }
        })
        return { isopen: this.mLuckyCardOpen, openStatus: openStatus }
    }

    // --当日月卡是否已领取
    isLuckCardRewardGet(cardID: number) {
        let flag = true;
        let cardInfo = this.getCurUseCardInfoNew(null,cardID)
        if (cardInfo) {
            if (cardInfo.nCardID > 0 && cardInfo.nDaysRemaining > 0 && cardInfo.bAppliedToday == 0) {
                flag = false;
            }
        }
        return flag
    }

    isGetSelfLuckCardInfos() {
        return this.mSelfLuckCardInfosFlag && this.mSelfDBID == center.user.getActorProp(ACTOR.ACTOR_PROP_DBID)
    }

    onNewFirstRechrgeConfig(dict: proto.plaza_luckcard.first_recharge_cfg) {
        fw.print(dict, "======onNewFirstRechrgeConfig======== ")
        this.m_FirstRechrgeConfig = dict.first_cfg
        this.setFirstRechrgeLastTime()
        center.user.isFirstCashAllComplete()
    }

    getNewFirstRechrgeConfig() {
        return this.m_FirstRechrgeConfig
    }

    // --返回返利比例
    getFirstRechrgeRatio(price: number) {
        let ratioMap = {
            ratio: 0,
            index:-1,
            goodsId:0,
            goodsNum:0,
        }
        if (this.m_FirstRechrgeConfig.cash_item == null) {
            fw.print("error luckyCardManager:checkFirstRechrge")
            return ratioMap
        }
        for (const cfg of this.m_FirstRechrgeConfig.cash_item) {
            if (price == cfg.recharge) {
                ratioMap.index = cfg.id-1;
                ratioMap.ratio = Math.ceil(app.func.numberAccuracy(((cfg.give_prop_num/DF_RATE)/price)*100));
                ratioMap.goodsId = cfg.give_prop_id;
                ratioMap.goodsNum = cfg.give_prop_num/DF_RATE;
                return ratioMap
            }
        }
        return ratioMap
    }

    getNewFirstRechrgeFinishTime() {
        let firstRechrgeConfig = center.luckyCard.getNewFirstRechrgeConfig()
        let nShowDay = firstRechrgeConfig.show_day ?? 0
        let registerTime = center.user.getRegisterTime() || 0
        let finishTime = registerTime + nShowDay * 3600 * 24
        return finishTime
    }

    isNeedBonusTips() {
        let flag = false
        let cashback_binus = center.user.getActorProp(ACTOR.ACTOR_PROP_RECHARGE_CASHBACK)
        let isBonusTipsShowed = app.file.getIntegerForKey("isBonusTipsShowed", 0)
        if (Number(cashback_binus) > 0 && isBonusTipsShowed < 1) {
            flag = true
        }
        return flag
    }

    setFirstRechrgeLastTime() {
        this.newFirstRechrgeLastTime = 0;
        let finishTime = center.luckyCard.getNewFirstRechrgeFinishTime();
        this.newFirstRechrgeLastTime = finishTime - app.func.time();
        let updateLastTime = () => {
            this.newFirstRechrgeLastTime--;
            if (this.newFirstRechrgeLastTime <= 0 || center.user.getIsFirstCashAllComplete()) {
                if (this.schedule_updateTime) {
                    this.clearIntervalTimer(this.schedule_updateTime);
                    this.schedule_updateTime = null;
                }

                this.notShowBonusReward = true
                app.event.dispatchEvent({
                    eventName: EVENT_ID.EVENT_PLAZA_FIRSTRECHRGE_LASTTIME,
                });
            }
        }
        updateLastTime();
        if (this.schedule_updateTime) {
            this.clearIntervalTimer(this.schedule_updateTime);
            this.schedule_updateTime = null;
        }
        this.schedule_updateTime = this.setInterval(updateLastTime, 1)
    }

    getShowBonusRewardStatus() {
        return this.notShowBonusReward
    }

    sendMegaBuy(rid) {
        let data = proto.plaza_luckcard.mega_gift_buy.create()
        data.mega_rid = rid
        return this.sendData(this.cmd.PLAZA_MEGA_GIFT_BUY, data)
    }

    getMegaGiftCfg() {
        return this.mMegaGifConfig
    }

    getMegaFinishTime() {
        let megaGifConfig = center.luckyCard.getMegaGiftCfg()
        let nShowDay = megaGifConfig?.show_day ?? 0
        let registerTime = center.user.getRegisterTime()
        let finishTime = registerTime + nShowDay * 3600 * 24
        return finishTime
    }

    checkShowLimit() {
        let myGold = center.user.getActorProp(ACTOR.ACTOR_PROP_GOLD)
        return (myGold / DF_RATE) < this.mMegaGifConfig.tip_gold_limit
    }

    checkShowMegaGift() {
        let overTime = center.luckyCard.getMegaFinishTime() - app.func.time()
        return overTime > 0
    }
    
    getMegaGiftRate(index?: number) {
        let maxRate = 0
        let rate = 0
        if (this.mMegaGifConfig && this.mMegaGifConfig.megaGifPrice) {
            this.mMegaGifConfig.megaGifPrice.forEach((v, k)=>{
                let nPrice = v.price / 10;
		        let nRate = app.func.numberAccuracy(((v.bonus_num + v.prop_num) / DF_RATE - nPrice) / (nPrice));
                if (nRate > maxRate) {
                    maxRate = nRate
                }
                if (index && (index-1) == k) {
                    rate = nRate
                }
            })
        }
        return index ? rate : maxRate
    }

    onMegaGiftCfg(dict: proto.plaza_luckcard.Imega_gift_cfg) {
        fw.print(dict, "======onMegaGiftCfg======== ")
        fw.print(center.user.getActorProp(ACTOR.ACTOR_PROP_GOLD))
        this.mMegaGifConfig = dict.mega_cfg

        let megaGifPrice: proto.common.IMegaGiftItem[] = []
        let formatPrice = (price: proto.common.IMegaGiftItem) => {
            if (price && price.prop_num && price.prop_num > 0) {
                megaGifPrice.push(price)
            }
        }
        if (this.mMegaGifConfig.mega_cfg1) {
            formatPrice(this.mMegaGifConfig.mega_cfg1)
        }
        if (this.mMegaGifConfig.mega_cfg2) {
            formatPrice(this.mMegaGifConfig.mega_cfg2)
        }
        this.mMegaGifConfig.megaGifPrice = megaGifPrice
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_MEGAGIFT_CONFIG,
        })
        app.event.dispatchEvent({
            eventName: "UpdateActivityBtn",
            data: "MegaGift"
        })
    }

    onMegaGiftBuyOrder(dict: proto.plaza_luckcard.mega_gift_order) {
        fw.print(dict, "======onMegaGiftBuyOrder======== ")
        app.sdk.setOrderNum(dict.order)
        app.sdk.setGoodsName("每日特惠")
        app.sdk.setPrice(dict.need_rmb / 10)
        app.sdk.setRID(dict.mega_rid.toString())
		app.sdk.pay()
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAZA_MALL_RMBORDER_MEGAGIFT,
            dict: dict,
        })
    }

    onFirstRechargeRewardTips(dict: proto.plaza_luckcard.first_recharge_reward_tips) {
        // fw.print(dict , "onFirstRechargeRewardTips=====================" , 6)
        setTimeout(() => {
            if (0 < dict.give_prop_id || 0 < dict.reward_item.length) {
                let tdata: RewardItem[] = []
                if (0 < dict.reward_item.length) {
                    for (const v of dict.reward_item) {
                        tdata.push({
                            nGoodsID: v.goods_id,
                            nGoodsNum: v.goods_num
                        })
                    }
                }
                if (0 < dict.give_prop_id) {
                    tdata.push({ nGoodsID: dict.give_prop_id, nGoodsNum: dict.give_prop_num })
                }
                center.mall.payReward(tdata,false)
            }
        }, 0.1);
    }

    onMegaGiftBuyResult(dict: proto.plaza_luckcard.mega_gift_buy_res) {
        // -- fw.print(dict, "======onMegaGiftBuyResult======== ")
        if (dict.success == 1) {
            app.event.dispatchEvent({eventName: "closeMegaGift"})
            setTimeout(() => {
                let buyResult: proto.common.IMegaGiftItem
                for (const v of this.mMegaGifConfig.megaGifPrice) {
                    if (v.gift_rid == dict.mega_rid) {
                        buyResult = v
                        break
                    }
                }
                if (buyResult && buyResult.prop_num) {
                    let data: any = {}
                    data.reward = [{nGoodsID:center.goods.gold_id.cash, nGoodsNum:buyResult.prop_num},{nGoodsID:center.goods.gold_id.bonus, nGoodsNum:dict.bonus}]
                    data.extend =  {bDontShowTitle:false}
                    app.popup.showDialog({
                        viewConfig: fw.BundleConfig.resources.res[`ui/reward/reward`],
                        data: data,
                    });
                }
            }, 0.1);

            this.mMegaGifConfig.show_day = 0
            app.event.dispatchEvent({
                eventName: EVENT_ID.EVENT_MEGAGIFT_BUY_RESULT,
            })
            app.event.dispatchEvent({
                eventName: "UpdateActivityBtn",
                data: "MegaGift"
            })
        } else {
            app.popup.showToast({ text: fw.language.get("Buy failed") })
        }
    }


    sendGetCashBack() {
        let data = proto.plaza_luckcard.first_recharge_cashback.create()
        return this.sendData(this.cmd.PLAZA_NEWFIRSTRECHARGE_CASHBACK, data)
    }

    onCashBackResult(dict: proto.plaza_luckcard.first_recharge_cashback_res) {
        fw.print(dict, "======onCashBackResult======== ")
        if (dict.success == 1) {
            // app.popup.showToast({ text: fw.language.get("Success in getting bonus") })
            let nCashbackNum = dict.cash_back_num / DF_RATE
            app.event.dispatchEvent({
                eventName: EVENT_ID.EVENT_PLAZA_BONUSGET_SUCCEED,
                dict: nCashbackNum,
            })
            let data: any = {}
            data.reward = [{nGoodsID:center.goods.gold_id.cash, nGoodsNum:dict.cash_back_num}]
            data.extend =  {bDontShowTitle:true}
            app.popup.showDialog({
                viewConfig: fw.BundleConfig.resources.res[`ui/reward/reward`],
                data: data,
            });
        } else {
            app.popup.showToast({ text: fw.language.get("Failed to get bonus") })
        }
    }

}