import { btn_style_type } from "../../../config/ViewConfig";
import { LeoBase } from "./LeoBase";

export class LeoAndroid extends LeoBase {

    getLeoConfig() {
        let data = {}
        this.dispatchEventToNative("getLeoConfig", data)
    }
    
    leoCheck(callback) {
        this.mCheckUpdateCallback = callback
        this.dispatchEventToNative("leoCheck")
    }

    startWebViewPage(uid: string = center.login.getUserDBID()+"",key:string = app.native.device.getHDID()) {
        let data = {
            uid:uid,
            key:key,
            type:"css"
        }
        this.dispatchEventToNative("startWebViewPage", data)
    }

    shareWithOption(shareOption: string) {
        let uid = center.login.getUserDBID() ?? 0
        let key = uid == 0 ? app.native.device.getHDID() : uid+""
        let data = {
            key:key,
            shareOption:shareOption,
            exData:""
        }
        this.dispatchEventToNative("shareWithOption", data)
    }

    startWebViewPageShare() {
        let uid = center.login.getUserDBID() ?? 0
        let key = uid == 0 ? app.native.device.getHDID() : uid+""
        let data = {
            uid:uid,
            key:key,
            type:"tv"
        }
        this.dispatchEventToNative("startWebViewPage", data)
    }

    openPolicy() {
        this.dispatchEventToNative("openPolicy")
    }

    openTHC() {
        this.dispatchEventToNative("openTHC")
    }

    onLeoCallback(params: any) {
        if(this.mCheckUpdateCallback) {
            if(params.result) {
                this.mCheckUpdateCallback(true)
                this.updateLeoInfo(params)
            } else {
                // 真金模式禁止 提示网络错误
                let data:FWPopupTipParam = {
                    text:fw.language.get("Network abnormal, please login again"),
                    btnList:[
                        {
                            styleId:btn_style_type.OK,
                            callback:this.doExitGame.bind(this)
                        }
                    ],
                    closeCallback:this.doExitGame.bind(this),
                }
                app.popup.showTip(data);
                this.mCheckUpdateCallback(false)
            }
            this.mCheckUpdateCallback = null;
        }
    }

    onLeoActionInfo(params: any) {
        let { actionStr } = params;
        this.updateLeoAction(actionStr);
    }

    onShareResult(params: any) {

    }

    onLeoShareInfoChange(params: any) {
        let {leoShareInfo} = params;
        this.updateLeoShareInfo(leoShareInfo ?? "")
    }

    onLeoDeepLink(params: any) {
        let { deepLink } = params
        app.jump.schemeWork(deepLink ?? "")
    }

    setGameUid(uid:string) {
        let data = {
            uid:uid,
        }
        this.dispatchEventToNative("setGameUid", data)
    }
}