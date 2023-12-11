import { WebView, game, native } from "cc";
import { sys } from "cc";
import { type } from "os";
import { ACTOR } from "../../config/cmd/ActorCMD";
import { httpConfig } from "../../config/HttpConfig";
import { PAY_MODE } from "../../config/ModuleConfig";

export interface OrderInfo {
    price: number,// 价格
    RID: string,// 订单号
    userID: string,// 支付用户id
    keyName: string,// 支付方式名称
}

export abstract class SDKBase extends (fw.FWComponent) {
    m_szOrderNum: string;
    m_mOrderInfo: Map<string, OrderInfo>;
    m_nPrice: number;
    m_nRID: string | number;
    m_keyName: string;
    mPayMode: PAY_MODE;
    m_GoodsName: string;
    m_Func: () => void;
    mOrderCallback: Map<string, () => void>;
    mSdkOpen: any = [];

    initData() {
        this.m_mOrderInfo = new Map();
        this.mOrderCallback = new Map();
        this.mSdkOpen = {}
        this.initLngAndLat()
    }

    onPayBefore() {
        let payMode = this.getPayMode();
        let orderNum = this.m_szOrderNum;

        if (this.m_szOrderNum == null) return

        if (PAY_MODE.PAY_MODE_DIAMONDS_CALLBACK == payMode) {
            let callbackFunc = this.getOrderFunc();
            if (typeof callbackFunc == "function") {
                this.setOrderFunc(null);
                this.addOrderCallback(orderNum, callbackFunc);
            }
        }

        this.m_mOrderInfo.set(orderNum, {
            price: this.m_nPrice,
            RID: this.m_nRID + "",
            userID: center.login.getUserDBID() + "",
            keyName: this.m_keyName,
        })
    }

    getOrderInfo(orderNum: string) {
        if (this.m_mOrderInfo.has(orderNum)) {
            return this.m_mOrderInfo.get(orderNum);
        }
    }
    /**
     * 设置支付模式
     * @param nPayMode 
     */
    setPayMode(nPayMode: PAY_MODE) {
        this.mPayMode = nPayMode;
    }

    getPayMode() {
        return this.mPayMode;
    }
    /**
     * 设置商品名称
     * @param szName 
     */
    setGoodsName(szName: string) {
        this.m_GoodsName = szName
    }

    getGoodsName() {
        return this.m_GoodsName;
    }
    /**
     * 设置商品价格
     * @param nPrice 
     */
    setPrice(nPrice: number) {
        this.m_nPrice = nPrice
    }

    getPrice() {
        return this.m_nPrice;
    }
    /**
     * 设置订单号
     * @param szOrderNum 
     */
    setOrderNum(szOrderNum: string) {
        this.m_szOrderNum = szOrderNum
    }

    getOrderNum() {
        return this.m_szOrderNum;
    }

    /**
     * 商品唯一id
     * @param nRID 
     */
    setRID(nRID: string | number) {
        this.m_nRID = nRID
    }

    getRId() {
        return this.m_nRID;
    }

    /**
    * 各自子类继承实现, 这里只处理windows
    */
    pay() {
        let payName = this.getKeyName();
        if (payName != "") {
            if (payName == "windows") {
                app.popup.closeLoading();
                this.windowsPay();
                fw.print("sdkDefinepay  windowsPay");
            } else {
                this.payNormal()
                fw.print("sdkDefinepay  payNormal");
            }
        }

        this.onPayBefore()
    }
    /**
     * 设置支付方式名
     * @param keyName 
     */
    setKeyName(keyName: string) {
        this.m_keyName = keyName
    }
    getKeyName() {
        return this.m_keyName || "";
    }
    /**
     * 设置支付接口回调函数
     * @param orderfunc 
     */
    setOrderFunc(orderfunc: () => void) {
        this.m_Func = orderfunc
    }

    getOrderFunc() {
        return this.m_Func;
    }

    addOrderCallback(order, func) {
        if (typeof func != "function") return;
        this.mOrderCallback.set(order, func)
    }

    loginFB() {
        app.native.facebook.login();
    }

    facebookShareLink(url, urlmsg) {
        app.native.facebook.shareLink(url, urlmsg)
    }

    shareMore(url, urlmsg) {
        app.native.facebook.shareMore(url, urlmsg)
    }

    facebookLogPurchase(mapParam) {
        app.native.facebook.logPurchase(mapParam.purchaseAmount, mapParam.currency)
    }

    getDeviceIDParams() {
        return {
            GAID: app.native.device.getGAID(),
        }
    }

    windowsPay() {
        let url = httpConfig.path_pay + "Paymentapi/recharge";
        app.http.get({
            //请求链接
            url: url,
            //完成时回调函数
            callback: (bSuccess, response) => {
                if (bSuccess) {
                    // app.popup.showToast("Success")
                } else {
                    app.popup.showToast(fw.language.get("Fail"))
                }
            },
            //请求参数
            params: {
                OrderNum: this.getOrderNum(),
            },
        })
    }

    // 统一的支付接口
    payNormal() {
        let url = httpConfig.path_pay + "Cashier/pay";
        let params = {
            od : this.getOrderNum(),
            pay_key : this.getKeyName(),
            timestamp : app.func.time(),
        }
        app.http.post({
            //请求链接
            url: url,
            //完成时回调函数
            callback: (bSuccess, response) => {
                app.popup.closeLoading()
                if (bSuccess) {
                    // 调起支付页面
                    if (response.status == 1) {
                        let pay_url = response.data.pay_url;
                        if( pay_url != "") {
                            if (response.open_type == 0) {
                                // app.popup.showShopWebLayer(pay_url)
                                app.popup.showToast("todo webpay")
                            } else {
                                app.native.device.openURL(pay_url);
                            }
                            if (response.delay_notice == 1) {
                                app.event.dispatchEvent({
                                    eventName:"ShowShopPlayTips",
                                })
                            } 
                        }
                    }else if(response.status == 0 && response.code == 2) {
                        // 用户需要填写手机号
                        // 显示绑定手机弹框
                        app.popup.showDialog({
                            viewConfig: fw.BundleConfig.plaza.res[`userInfo/bind_phone`]
                        });

                    } else {
                        app.popup.showToast(response.msg ?? fw.language.get("fail"))
                    }
                } else {
                    app.popup.showToast(fw.language.get("Fail"))
                }
            },
            //请求参数
            params: params,
        });

    }

    doExitGame() {
        if (sys.isBrowser) {
            window.history.back();
        } else {
            game.end();
        } 
    }

    reportEvent(eventName, params) {

    }

    checkUpdateBefore(callback) {
        if (this.isSdkOpen("GPShenhe")) {
            callback(false)
            app.popup.showDialog({
                viewConfig: fw.BundleConfig.update.res[`update/review_main`]
            })
        } else {
            callback(true)
        }
    }

    paySuccess(orderStr) {
        if (this.mOrderCallback.has(orderStr)) {
            let func = this.mOrderCallback.get(orderStr)
            try {
                func();
            } catch (e) {
                fw.printError(e);
            }
            this.mOrderCallback.delete(orderStr);
        }

        let orderInfo = this.m_mOrderInfo.get(orderStr);
        if (orderInfo == null) return;
        //测试支付不上报
        if (orderInfo.keyName == "window") return;

        app.event.reportEvent("rechar_success", {
            purchaseAmount: orderInfo.price.toString(), // 金额
            currency: "INR", //货币标识
            RID: orderInfo.RID, //商品id
            order_id: orderStr, //订单id
            userID: orderInfo.userID, //用户id
        });
    }

    emergency() {

    }

    extraLoginParams(data: any) {

    }

    requestSdkOpenInfo(callback) {
        let fail = (msg?) => {
            let reTry = () => {
                this.requestSdkOpenInfo(callback)
            }
            app.popup.showTip({
                text: msg || fw.language.get("Failed to pull sdk configuration!"),
                btnList: [
                    {
                        styleId: 1,
                        callback:reTry
                    }
                ],
                closeCallback: reTry
            });
        }

        let user_type = app.native.device.getOperatorsID()
        let user_sub_type = app.native.device.getOperatorsSubID()
        let url = httpConfig.path_pay + "OtherApi/AppStart"

        let params = {
            user_type: user_type,
            user_sub_type: user_sub_type,
            type: 2,
        } as any

        if (app.func.isAndroid()) {
            params.gaid = app.native.device.getGAID()
        } else if (app.func.isIOS()) {
            params.gaid = app.native.device.getIDFA()
        }

        app.http.post({
            //请求链接
            url: url,
            //完成时回调函数
            callback: (successed, result) => {
                if (successed && result && result.status == 1) {
                    this.mSdkOpen = result.data ?? {}
                    callback()
                    return
                }
                fail();
            },
            //请求参数
            params: params,
        })
    }

    isSdkOpen(key) {
        let isOpen = this.mSdkOpen[key];
        return isOpen == null || isOpen == 1;
    }

    startWebViewPageShare() {
        if (center.user.isSwitchOpen("btShareSwitch")) {
            app.popup.showDialog({
                viewConfig: fw.BundleConfig.plaza.res[`myRefer/myRefer`]
            })
        }
    }

    initLngAndLat() {
        this.updateLngAndLat(this.onLocationUpdate.bind(this));
    }

    // 判断权限是否存在 并请求刷新1次位置信息
    updateLngAndLat(func) {
        let p = ["android.permission.ACCESS_COARSE_LOCATION", "android.permission.ACCESS_FINE_LOCATION"];
        if (app.native.device.hasPermissions(...p)) {
            app.native.device.requestLocationUpdates(func);
        } else {
            app.native.device.requestPermissions(fw.language.get("request location permission"), 1, ...p)
        }
    }

    getLngAndLat() {
        this.updateLngAndLat(this.onLocationUpdate.bind(this));
        return app.native.device.getLngAndLat();
    }

    onLocationUpdate(lat, lng) {
        app.native.device.removeLocationUpdates();
    }
    /**
     * 登录成功后上报位置信息 没有权限会导致本次上报失败
     */
    uploadLngAndLat() {
        let user_id = center.user.getActorProp(ACTOR.ACTOR_PROP_DBID);
        let day = new Date().getDay();
        let lastDay = app.file.getIntegerForKey("uploadLngAndLatDay", 0)
        fw.print("uploadLngAndLat", day, lastDay)
        this.updateLngAndLat((lat, lng) => {
            let data = {
                user_id: user_id,
                lng: lng,
                lat: lat,
                callback: (successed, result) => {
                    if (successed) {
                        app.file.setIntegerForKey("uploadLngAndLatDay", day)
                    }
                }
            }
            this.requestGeoLimit(data);
            app.native.device.removeLocationUpdates();
        })
    }

    requestGeoLimit(data) {
        let user_id = data.user_id;
        let lng = data.lng;
        let lat = data.lat;
        let requestGeoLimitCallback = data.callback;
        let url = httpConfig.path_pay + "OtherApi/geoLimit"
        app.http.post({
            //请求链接
            url: url,
            //完成时回调函数
            callback: (bSuccess, response) => {
                if (requestGeoLimitCallback) {
                    requestGeoLimitCallback(bSuccess, response)
                }
            },
            //请求参数
            params: {
                user_id: user_id,
                lng: lng,
                lat: lat,
                timestamp: app.func.time(),
            },
        })
    }

    openPolicy() {
    }

    openTHC() {
    }

    isIosDev() {
        return false;
    }
}