import proto from "../common";
import { ACTOR } from "../../config/cmd/ActorCMD";
import { DF_RATE } from "../../config/ConstantConfig";
import { GS_PLAZA_MSGID } from "../../config/NetConfig";
import { PlazeMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";

export class exchangeCenter extends PlazeMainInetMsg {
    /**命令ID */
    // cmd = proto.plaza_exchange.GS_PLAZA_EXCHANGE_MSG
    //兑换列表
    m_ExchangeViewArray = []
    //兑换历史列表
    m_ExchangeHistorytArray = []
    //是否已经获取到历史记录
    m_getHistoryTime = 0
    //保存玩家兑换地址信息
    saveExchangeAds = {}
    //根据用户DBID存储
    userDBID = {}
    //提现类型
    WithdrawType = {
        CPF: 0x1,
        PHONE: 0x4,
        EMAIL: 0x8,
        EVP: 0x10,
        CNPJ: 0x20,
    }

    mExchangeCtrl = 0;
    mExchangeGoldToRedpacketCtrl = 0;
    //兑换码开关
    mExchangeBarCtrl = 0;
    //提现配置
    mExchangeCashOutCfg: ExchangeCashOutCfg;
    //转账配置
    mExchangeTransfersCfg;

    initData() {
        this.initMainID(GS_PLAZA_MSGID.GS_PLAZA_MSGID_EXCHANGE);
    }
    cleanUserData() {
    }
    // initRegister() {
    //     //兑换系统提示信息
    //     this.bindMessage({
    //         struct: proto.plaza_exchange.exchange_tips_s,
    //         cmd: this.cmd.PLAZA_EXCHANGE_TIPS,
    //         callback: this.OnRecv_ExchangeTips.bind(this),
    //     });
    //     //提现配置
    //     this.bindMessage({
    //         struct: proto.plaza_exchange.cash_out_config_s,
    //         cmd: this.cmd.PLAZA_EXCHANGE_CASHOUT_CONFIG,
    //         callback: this.OnRecv_ExchangeCashOutCfg.bind(this),
    //     });
    //     //提现
    //     this.bindMessage({
    //         struct: proto.plaza_exchange.cash_out_c,
    //         cmd: this.cmd.PLAZA_EXCHANGE_CASHOUT,
    //     });
    //     //提现DB处理完后返回给客户端
    //     this.bindMessage({
    //         struct: proto.plaza_exchange.cash_out_s,
    //         cmd: this.cmd.PLAZA_EXCHANGE_CASHOUT_DB_RET,
    //         callback: this.OnRecv_ExchangeCashReturnNew.bind(this),
    //     });
    // }

    getExchangeViewArray() {
        return this.m_ExchangeViewArray || [];
    }

    getExchangeHistoryArray() {
        return this.m_ExchangeHistorytArray || [];
    }

    getCashOutCfg() {
        return this.mExchangeCashOutCfg || {};
    }

    getShowPrice() {
		let showPrice: number[] = [];
        let oneTime = false
        let data = {
            showPrice: showPrice,
            oneTime : oneTime,
        }
        let cfg = center.exchange.getCashOutCfg();
		if (!cfg.open) {
			return data;
		}
		let list = cfg.price.list
		let firstFlag = center.user.getActorProp(ACTOR.ACTOR_PROP_DAY_OVERFLOWBAG_FLAG);
		if (firstFlag == 0 && list[0] > 0) {
			oneTime = true
			showPrice.push(list[0]);
		}

		let rechargeAmount = center.user.getActorProp(ACTOR.ACTOR_PROP_RECHARGE_AMOUNT);
		let rechargeLimit = cfg.outCashRechargeLimit;

		if (!(rechargeLimit > -1 && rechargeAmount >= rechargeLimit) && cfg.price.list[1] > 0) {
			for (let index = 1; index < list.length && index <= 6; index++) {
				list[index] > 0 && showPrice.push(list[index]);
			}
		} else {
			for (let index = 2; index < list.length && index <= 7; index++) {
				list[index] > 0 && showPrice.push(list[index]);
			}
		}
        data = {
            showPrice: showPrice,
            oneTime : oneTime,
        }
        return data
    }

    getCurDayCashOutLimit() {
        let rechargeAmount = center.user.getActorProp(ACTOR.ACTOR_PROP_RECHARGE_AMOUNT)
        rechargeAmount = rechargeAmount * DF_RATE
        let limitCfg: proto.common.IDayCashOutLimit = null;
        if (this.mExchangeCashOutCfg.chargeTimeCfg) {
            for (let i = 0; i < this.mExchangeCashOutCfg.chargeTimeCfg.length; i++) {
                const v = this.mExchangeCashOutCfg.chargeTimeCfg[i];
                if (rechargeAmount >= v.recharge_min && rechargeAmount < v.recharge_max) {
                    limitCfg = v;
                }
            }
        }
        return limitCfg;
    }

    getCanCashOutGold() {
        let numwithdrawable = parseInt(center.user.getActorProp(ACTOR.ACTOR_PROP_WITHDRAW_GOLD));
        let numtotal = parseInt(center.user.getActorProp(ACTOR.ACTOR_PROP_GOLD));
        let withdrawSwitch = center.user.isSwitchOpen("btWithdrawSwitch");
        let canCashOutGold = 0;
        if (withdrawSwitch) {
            canCashOutGold = numtotal;
        } else {
            canCashOutGold = numwithdrawable;
        }
        return canCashOutGold;
    }

    //提现
    sendExchangeCashOut(nWithDrawType: number, money: number, upi: string, accountnumber: string, ifsc: string, phone: string, name: string) {
        let data = {
            withdraw_type: nWithDrawType,
            money: money,
            upi: upi,
            account_number: accountnumber,
            ifsc_code: ifsc,
            ac_id: center.user.getActorProp(ACTOR.ACTOR_PROP_DBID),
            phone: phone,
            user_name: name,
        }
        let dataJson = JSON.stringify(data);
        app.file.setIntegerForKey(`WithdrawType`, nWithDrawType);
        app.file.setStringForKey(`LastWithdrawInfo`, dataJson);
        app.file.setStringForKey(`LastWithdrawInfo${nWithDrawType}`, dataJson);
        this.sendMessage({
            cmd: this.cmd.PLAZA_EXCHANGE_CASHOUT,
            name: `ExchangeCashOutReq`,
            data: data,
        });
    }

    OnRecv_ExchangeTips(data: proto.plaza_exchange.exchange_tips_s) {
        let languageConfig: { [nID: number]: string };
        languageConfig = {
            [14]: `Withdrawal account UPI is empty`, //提现账户UPI为空
            [15]: `Withdrawal is successful, under review`, //提现成功审核中
            [16]: `Insufficient cash withdrawal`, //可提现金额不足
            [17]: `You have no withdrawals this month, please withdraw again next month`, //超出当月可提现次数
            [18]: `Mobile phone number is empty`, //手机号码为空
            [19]: `Bank card number cannot be empty`, //银行卡号不能为空
            [20]: `IFSC code cannot be empty`, //IFSC code 不能为空
            [21]: `You need to play games to increase the amount you can withdraw`, //可提现金额需要的流水不足
            [22]: `Please enter receiving account ID`, //转账玩家id为空
            [23]: `Insufficient transferable amount`, //转账金额不足
            [24]: `The number of transfers has been used up`, //转账次数已用完
            [25]: `You need to play games to increase the amount you can withdraw`, //转账现金额需要的流水不足
            [26]: `Please enter a valid account ID`, //对方授权不够
            [28]: `Only VIP players can use this feature.`, //提现需要充值
            [29]: `The withdrawal limit on the day has been reached, please try again tomorrow.`, //当天提现次数不足
            [30]: `The withdrawal limit on the day has been reached, please try again tomorrow.`, //每天提现金额不足
            [31]: `The name entered is invalid.`, //填写名字非法
            [32]: `The entered mobile number is invalid.`, //填写手机号非法
        }

        let tips = data.tips ?? "";
        if(tips == "") {
            tips = languageConfig[data.tips_id] ?? `${`Please contact customer service or try again later. `}${data.tips_id}`
        }
        app.popup.showToast(tips ?? "");
    }

    OnRecv_ExchangeCashOutCfg(data: proto.plaza_exchange.cash_out_config_s) {
        this.mExchangeCashOutCfg = {};
        this.mExchangeCashOutCfg.open = parseInt(data.cashout_cfg.status) == 1;
        this.mExchangeCashOutCfg.timer = parseInt(data.cashout_cfg.count);
        this.mExchangeCashOutCfg.freeTimer = parseInt(data.cashout_cfg.free_count);
        this.mExchangeCashOutCfg.price = data.cashout_cfg.price;
        this.mExchangeCashOutCfg.chargeCfg = data.cashout_cfg.charge_item;
        this.mExchangeCashOutCfg.btOutCashType = parseInt(data.cashout_cfg.out_cash_type ?? 2);
        this.mExchangeCashOutCfg.chargeTimeCfg = data.cashout_cfg.day_cash_out_limit ?? [];
        this.mExchangeCashOutCfg.outCashRechargeLimit = data.cashout_cfg.out_cash_recharge_limit ?? - 1;
        this.mExchangeCashOutCfg.payRechargeLimit = data.cashout_cfg.pay_recharge_limit ?? - 1;
    }

    OnRecv_ExchangeCashReturnNew(data: proto.plaza_exchange.cash_out_s) {
        if (!fw.isNull(data.id)) {
            app.popup.showDialog({
                viewConfig: fw.BundleConfig.plaza.res[`withdraw/withdraw_success`],
                data: {
                    nOrderId: data.id,
                }
            });
        }
    }
}


declare global {
    namespace globalThis {
        interface ExchangeCashOutCfg {
            open?: boolean,
            timer?: number,
            freeTimer?: number,
            price?: proto.common.IArrOne32,
            chargeCfg?: proto.common.ISCharge[],
            btOutCashType?: number,
            chargeTimeCfg?: proto.common.IDayCashOutLimit[]
            outCashRechargeLimit?: number
            payRechargeLimit?: number;
        }
    }
}