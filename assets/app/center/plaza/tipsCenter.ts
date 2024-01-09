import { ERRID, ERRID_MSG } from '../../config/ConstantConfig';
import { EVENT_ID } from '../../config/EventConfig';
import { GS_PLAZA_MSGID, sint, slong, stchar, uchar, ulong } from '../../config/NetConfig';
import { PlazeMainInetMsg } from '../../framework/network/awBuf/MainInetMsg';
import proto from '../common';
export class tipsCenter extends PlazeMainInetMsg {
    /**命令ID */
    // cmd = proto.plaza_tips.GS_PLAZA_TIPS_MSG
    mOrderCallback: Map<string, Function>

    initData() {
        this.initMainID(GS_PLAZA_MSGID.GS_PLAZA_MSGID_TIPS);
        this.mOrderCallback = new Map();
    }

    cleanUserData() {

    }
    
    // initRegister() {
    //     this.bindMessage({
    //         struct: proto.plaza_tips.tips_s,
    //         cmd: this.cmd.PLAZA_TIPS_MSG,
    //         callback: this.OnRecv_PLAZA_TIPS_MSG.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_tips.rewardtips_s,
    //         cmd: this.cmd.PLAZA_TIPS_REWARD,
    //         callback: this.OnRecv_PLAZA_TIPS_REWARD.bind(this),
    //     });
    //     this.bindMessage({
    //         struct: proto.plaza_tips.rechargeret_s,
    //         cmd: this.cmd.PLAZA_TIPS_RECHARGE_RET,
    //         callback: this.OnRecv_PLAZA_TIPS_RECHARGE.bind(this),
    //     });
    // }
    //提示消息
    OnRecv_PLAZA_TIPS_MSG(data: proto.plaza_tips.tips_s) {
        let tips = data.tips
        let msg = tips != "" ? tips : ERRID_MSG.get(data.type)
        if (!msg) {
            msg = "UNKOWN ERROR"
        }else{
            msg = msg
        }
        switch (data.type) {
            case ERRID.STOP_SERVER:
                fw.scene.changePlazaUpdate({
                    callback: () => {
                        app.popup.showTip({ text: msg })
                    }
                });
                break;
            case ERRID.SERVER_BUSY:
            case ERRID.ACCOUNT_INVALID:
            case ERRID.ACCOUNT_FREEZE:
            case ERRID.PASSWORD_ERROR:
            case ERRID.LOGIN_FREQUENT:
            case ERRID.ACCOUNT_ERROR:
            case ERRID.SYSTEM_ERROR:
            case ERRID.SYSTEM_KICK:
            case ERRID.SYSTEM_KICK_PHP:
            case ERRID.SAVING_DATA:
            case ERRID.MSG_HEAD_ERROR:
            case ERRID.MSG_HANDLE_ERROR:
            case ERRID.PLAZA_LOGIN_DB_ERROR:
            case ERRID.LOAD_DATA_ERROR:
            case ERRID.SAVE_DATA_ERROR:
            case ERRID.PLAZA_RELOGIN:
            case ERRID.RELOAD_PLAZA:
                fw.scene.changeScene(fw.SceneConfigs.login, {
                    callback: () => {
                        app.popup.showTip({ text: msg })
                    }
                });
                app.event.dispatchEvent({
                    eventName: EVENT_ID.EVENT_PLAZA_TIPS_ERROR,
                })
                center.login.closeConnect()
                break;
            case ERRID.STOP_PRETREATMENT:
                app.popup.closeLoading();
                let str = fw.language.getString("<color=#8e4936>This game will undergo maintenance at <color=#f93b21>${STOP_TIME}</color>. You can play other games during this time.</color>",{
                    STOP_TIME:app.func.time_HM(msg)
                })
                app.popup.showTip({ text: str, data: {directShow: true} });
                break;
            default:
                app.popup.showToast(msg)
                break;
        }
    }
    //奖励提示
    OnRecv_PLAZA_TIPS_REWARD(data: proto.plaza_tips.rewardtips_s) {
        //统计数据
        let rewardData = {
            reward : []
        }
        if (data.gold && Number(data.gold)>0){
            let item = {
                nGoodsID :center.goods.gold_id.cash,
                nGoodsNum:Number(data.gold),
            }
            rewardData.reward.push(item)
        }
		data.reward_goods.forEach(element => {
			let item = {
                nGoodsID :element.good_id,
                nGoodsNum:element.good_num,
            }
            rewardData.reward.push(item)
		});

        app.popup.closeLoading();
        // -1 未分类
        // 5 签到快充
        // 9 日卡
        // 10 周卡
        // 11 月卡
        // 36 mega礼包
        // 39 7天奖励礼包
        // 41 slotbag
        let dontShowTitle = false;
        switch (data.order_type) {
            case -1:
            case 5:
            case 9:
            case 10:
            case 11:
            case 36:
            case 39:
                dontShowTitle = true
                break
        }
        center.mall.payReward(rewardData.reward, dontShowTitle, data);

        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_GETREWARDTIPS,
            dict: rewardData,
        });
    }
    //充值提示
    OnRecv_PLAZA_TIPS_RECHARGE(data: proto.plaza_tips.rechargeret_s) {
        let order_id = data.order
        if (this.mOrderCallback.has(order_id)) {
            this.mOrderCallback.get(order_id)()
            this.mOrderCallback.delete(order_id)
        }
        app.sdk.paySuccess(order_id)

        let orderInfo = app.sdk.getOrderInfo(order_id)
        if (orderInfo) {
            let price = orderInfo.price
            let oldPrice = app.file.getIntegerForKey("MALL_RML_PAY_VALUE_LATE", 0)
            app.file.setIntegerForKey("MALL_RML_PAY_VALUE_LATE", Math.max(price, oldPrice))
            //累计充值金额
            let totalPrice = app.file.getIntegerForKey("RechargeTotalNum", 0, { all: true }) + price
            app.file.setIntegerForKey("RechargeTotalNum", totalPrice, { all: true })

            let keyName = orderInfo.keyName ?? ""
            app.file.setStringForKey("RechargeKeyName", keyName, { all: true })
        }

        //递增充值次数
        let rechargeTimes = app.file.getIntegerForKey("RechargeTimes", 0, { all: true }) + 1
        app.file.setIntegerForKey("RechargeTimes", rechargeTimes, { all: true })

        app.event.dispatchEvent({
            //事件名
            eventName: EVENT_ID.EVENT_PAY_SUCCESS,
            // //参数可自定义
            // dict: null,
        })

        center.user.isFirstCashAllComplete()
    }

    addOrderCallback(order: string, func: Function) {
        this.mOrderCallback.set(order, func)
    }
}