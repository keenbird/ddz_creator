import { report_event_name, report_event_type } from "../../../config/EventConfig";
import { FacebookBase } from "./FacebookBase";

export class FacebookIOS extends FacebookBase {

    onLoginSuccess(params: any) {
        let { name, id, token } = params;
    }
    onLoginFail(params: any) {
        let { errorMsg } = params;
    }
    onLoginCancel(params: any) {
    }

    onShareSuccess(params: any) {
    }
    onShareCancel(params: any) {
    }

    onShareFail(params: any) {
        let { errorMsg } = params;
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