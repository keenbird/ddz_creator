import { PATHS } from "../../../config/ConstantConfig";
import { EVENT_ID, report_event_name, report_event_type } from "../../../config/EventConfig";
import { httpConfig } from "../../../config/HttpConfig";
import { EventParam } from "../../manager/FWEventManager";
import { FacebookBase } from "./FacebookBase";

export class FacebookAndroid extends FacebookBase {

    onLoginSuccess(params: any) {
        let { name, id, token } = params;
        this.loginFB(name, id, token)
    }
    onLoginFail(params: any) {
        let { errorMsg } = params;
        app.popup.showToast(errorMsg ?? fw.language.get("Facebook login failed, please enter a valid username and password"))
    }
    onLoginCancel(params: any) {
        app.popup.showToast(fw.language.get("login cancel"))
    }

    onShareSuccess(params: any) {
        app.popup.showToast(fw.language.get("Share success"))
    }

    onShareCancel(params: any) {
        app.popup.showToast(fw.language.get("share cancel"))
    }

    onShareFail(params: any) {
        let { errorMsg } = params;
        app.popup.showToast(errorMsg ?? fw.language.get("Facebook login failed, please enter a valid username and password"))
    }

    login() {
        this.dispatchEventToNative("loginFacebook")
    }

    logout() {
        this.dispatchEventToNative("logoutFacebook")
    }
    shareLink(url: string, msg: string) {
        let data = {
            url: url,
            msg: msg,
        }
        this.dispatchEventToNative("shareLink", data)
    }

    shareMore(url: string, title: string) {
        let data = {
            url: url,
            title: title,
        }
        this.dispatchEventToNative("shareMore", data)
    }

    logPurchase(purchaseAmount: string, currency: string) {
        let data = {
            purchaseAmount: purchaseAmount,
            currency: currency,
        }
        this.dispatchEventToNative("logPurchase", data)
    }
}