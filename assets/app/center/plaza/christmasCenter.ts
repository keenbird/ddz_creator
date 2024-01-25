import { ACTOR } from "../../config/cmd/ActorCMD";
import { EVENT_ID } from "../../config/EventConfig";
import { httpConfig } from "../../config/HttpConfig";
import { GS_PLAZA_MSGID, sfloat, sint, sint64, slong, stchar, uchar, uint64, ulong, ushort } from "../../config/NetConfig";
import { PlazeMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";


export class christmasCenter extends PlazeMainInetMsg {
    mRed: {};
    mInitRequstChristmasRed: boolean;
    initData() {
        this.cleanUserData();
    }

    cleanUserData() {
        this.mRed = {}
        this.mInitRequstChristmasRed = false
    }

    initEvents() {
        super.initEvents();
        this.bindEvent({
            eventName: [
                EVENT_ID.EVENT_PAY_SUCCESS,
            ],
            callback: (arg1, arg2) => {
                this.onPaySuccess();
            }
        });
    }

    initRegister() {
    }
    checkAndInitTipsRed() {
        if (!this.mInitRequstChristmasRed) {
            this.mInitRequstChristmasRed = true
            this.requstChristmasRed()
        }
    }
    requstChristmasRed() {
        let params: any = {
            user_id: center.user.getActorProp(PROTO_ACTOR.UAT_UID),
            timestamp: app.func.time(),
        }
        params.sign = app.http.getSign(params)
        try {
            app.http.post({
                url: httpConfig.path_pay + "ActivityApi/ChristmasRed",
                params: params,
                callback: (bSuccess, response) => {
                    if (bSuccess) {
                        if (!fw.isNull(response)) {
                            if (1 == response.status) {
                                // 缓存活动数据
                                if (!fw.isNull(response.data)) {
                                    this.mRed = response.data.red
                                    app.event.dispatchEvent({
                                        eventName: EVENT_ID.EVENT_PLAZA_CHRISTMAS_RED_DATA,
                                    })
                                }
                            }
                        }
                    } else {
                        fw.print("Failed to pull PHP configuration!");
                    }
                }
            });
        } catch (e) {

        }
    }
    isOpen() {
        let activity = center.activity.getRunningActivityList()
        for (let k in activity) {
            if (activity[k].title == "Christmas Gift") {
                return true
            }
        }
        return false
    }
    getChristmasRed() {
        return this.mRed || {}
    }
    onPaySuccess() {
        if (!this.isOpen()) {
            return
        }
        this.requstChristmasRed()
    }
}