import { report_event_name, report_event_type } from "../../../config/EventConfig";
import { btn_style_type } from "../../../config/ViewConfig";
import { LeoBase } from "./LeoBase";

export class LeoIOS extends LeoBase {
    getLeoConfig() {
        let data = {}
        this.dispatchEventToNative("getLeoConfig", data)
    }
    leoCheck(callback) {
        this.mCheckUpdateCallback = callback
        this.dispatchEventToNative("leoCheck")
        this.setTimeout(()=>{
            let params = {
                result : true,
                commonInfo : '{"pkg":"com.teenpatti.gold.awvun","pvc":28,"svc":2,"aid":"9c9335c175d2ac59","fid":"","gaid":"02f7be24-91b2-4708-884a-827d1a8dbfcb","pvn":"1.0.12","osv":"7.1.2","pn":"AW","pc":"AW_1.1"}',
                leoShareInfo : `{
                    "img": "https:\/\/assets-in.taurus.cash\/taurus\/mipmap-xxhdpi\/7.webp",
                    "descriptions": "share earn cash",
                    "fbIcon": "https:\/\/assets-in.taurus.cash\/taurus\/mipmap-xxhdpi\/1.webp",
                    "waIcon": "https:\/\/assets-in.taurus.cash\/taurus\/mipmap-xxhdpi\/2.webp",
                    "ybIcon": "https:\/\/assets-in.taurus.cash\/taurus\/mipmap-xxhdpi\/0.webp",
                    "more": "https:\/\/assets-in.taurus.cash\/taurus\/mipmap-xxhdpi\/4.webp"
                }`,
                actionStr : `{
                    "isEntranceHint": "1"
                }`,
                iosDev : false,
            }
            this.onLeoCallback(params)
        },2)
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