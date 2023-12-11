import { EVENT_ID } from "../../config/EventConfig";
import { EventParam } from "../manager/FWEventManager";
import { SDKBase } from "./SDKBase";

export class SDKLeo extends SDKBase {
    
    initData() {
        super.initData();
        // app.native.firebase.requestFireBaseToken()
    }

    initEvents(): boolean | void {
        this.bindEvent(EventParam.FWBindEventParam(EVENT_ID.EVENT_LOGIN_LOGINEND,()=>{
            app.native.leo.requestShareInfo();
        }))
    }

    reportEvent(eventName, params) {
        super.reportEvent(eventName, params)
        this.reportAdjustEvent(eventName,params)

        if (eventName == "login") {
            //向leo上报用户登录id
            let key = center.login.getUserDBID()
            app.native.leo.setGameUid(key+"")
        }

        if(eventName == "rechar_success") {
            let nowTime = app.func.time();
            if(app.sdk.isSdkOpen("fb2")) {
                let firstpaytime = app.file.getStringForKey("firstpaytime","")
                if(firstpaytime != "") {
                    if (nowTime <= parseInt(firstpaytime) + 24 * 60 * 60 ) {
                        app.native.facebook.logPurchase(params.purchaseAmount + "",params.currency)
                    }
                }
            }else if(app.sdk.isSdkOpen("fb3")) {
                let registerTime = center.user.getRegisterTime() ?? 0
                if (nowTime <= parseInt(registerTime) + 24 * 60 * 60 ) {
                    app.native.facebook.logPurchase(params.purchaseAmount + "",params.currency)
                }
            }else if(app.sdk.isSdkOpen("fb1")) {
                app.native.facebook.logPurchase(params.purchaseAmount + "",params.currency)
            }
        }
    }

    extraLoginParams(params) {
        app.native.leo.extraLoginParams(params);
    }

    emergency() {
        app.native.leo.startWebViewPage();
    }

    startWebViewPageShare() {
        app.native.leo.startWebViewPageShare()
    }

    checkUpdateBefore(callback) {
        app.native.leo.leoCheck(callback)
    }

    reportAdjustEvent(eventName:string,params) {
        // 支付不上報
        if (eventName == "rechar_success" ) return;
        app.native.adjust.reportEvent(eventName, params);
    }

    showFreebouns() {
        app.popup.showToast("undeveloped")
        if (app.sdk.isSdkOpen("sharepopup")) {
            // if (display.comparisonLuaInstallVersion("221") > 0 ) {

            // }
            // app.popup.showDialog(POPUP_ID.POPUP_TYPE_FREEBOUNS_LEO_NEW)
        }
        //     if display.comparisonLuaInstallVersion("221") > 0 then
        //         manager.popup:newPopup(POPUP_ID.POPUP_TYPE_FREEBOUNS_LEO_NEW)
        //     else
        //         manager.popup:newPopup(POPUP_ID.POPUP_TYPE_FREEBOUNS_LEO)
        //     end
        // else
        //     manager.popup:newPopup(POPUP_ID.POPUP_TYPE_FREEBOUNS)
        // end
    }

    openPolicy() {
        let operatorsId = app.native.device.getOperatorsID()
        if(operatorsId == "11" || operatorsId == "12") {
            app.native.leo.openPolicy();
        }else{
            super.openPolicy()
        }
    }

    openTHC() {
        let operatorsId = app.native.device.getOperatorsID()
        if(operatorsId == "11" || operatorsId == "12") {
            app.native.leo.openTHC();
        }else{
            super.openTHC()
        }
    }

    // isRealGold() {
    //     return app.native.leo.isRealGold();
    // }
}