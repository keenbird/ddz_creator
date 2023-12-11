
import { Button, Label } from 'cc';
import { EDITOR } from 'cc/env';
import { _decorator, Component, Node } from 'cc';
import { EventHandler } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = native
 * DateTime = Thu Aug 11 2022 10:03:40 GMT+0800 (中国标准时间)
 * Author = luohao251
 * FileBasename = app.native.ts
 * FileBasenameNoExtension = native
 * URL = db://assets/login/test/native.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('native_test')
export class native_test extends Component {
    // [1]
    // dummy = '';

    // [2]
    @property(Label)
    content: Label;
    @property(Node)
    simpleButton: Node
    @property(Node)
    buttonContent: Node

    start() {
        // [3]
        let config = [
            "updateContent",
            "requestLocationUpdates",
            "removeLocationUpdates",
            "gotoLocationSetting",
            "setOrientationLandscape",
            "setOrientationPortrait",
            "getRequestedOrientation",
            "gotoAppDetailIntent",
            "gotoSettings",
            "phoneStatePermissionDenied",
            "requestPhoneStatePermissions",
            "wifiPermissionDenied",
            "requestWifiPermissions",
            "pickFromGallery",
            "pickFromCapture",
            "startCropImage",
            "setClipBoard",
            "shareTextToWhatsApp",
            "testError",
            "postException",
            "reportEvent",
            "loginFacebook",
            "logoutFacebook",
            "shareLinkFacebook",
            "shareMoreFacebook",
            "logPurchaseFacebook",
        ]
        config.forEach(v => {
            let btn = this.simpleButton.clone();
            btn.parent = this.buttonContent;
            btn.active = true;
            btn.getComponentInChildren(Label).string = v;
            const clickEventHandler = new EventHandler();
            clickEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
            clickEventHandler.component = 'native_test';// 这个是脚本类名
            clickEventHandler.handler = v;
            btn.getComponent(Button).clickEvents.push(clickEventHandler);
        })
    }

    updateContent() {
        let contentStr = ""
        contentStr += `version:${app.native.device.getVersion()}\n`;
        contentStr += `MacAddress:${app.native.device.getMacAddress()}\n`;
        contentStr += `BiosID:${app.native.device.getBiosID()}\n`;
        contentStr += `CpuID:${app.native.device.getCpuID()}\n`;
        contentStr += `AndroidId:${app.native.device.getAndroidId()}\n`;
        contentStr += `HDID:${app.native.device.getHDID()}\n`;
        contentStr += `GAID:${app.native.device.getGAID()}\n`;
        contentStr += `DeviceId:${app.native.device.getDeviceId()}\n`;
        contentStr += `MachineName:${app.native.device.getMachineName()}\n`;
        contentStr += `UUID:${app.native.device.getUUID()}\n`;
        contentStr += `IDFA:${app.native.device.getIDFA()}\n`;
        contentStr += `OperatorsID:${app.native.device.getOperatorsID()}\n`;
        contentStr += `OperatorsSubID:${app.native.device.getOperatorsSubID()}\n`;
        contentStr += `Channel:${app.native.device.getChannel()}\n`;
        contentStr += `WifiLevel:${app.native.device.getWifiLevel()}\n`;
        contentStr += `TeleSignalStrength:${app.native.device.getTeleSignalStrength()}\n`;
        contentStr += `NetworkType:${app.native.device.getNetworkType()}\n`;
        contentStr += `AppVersion:${app.native.device.getAppVersion()}\n`;
        contentStr += `LngAndLat:${JSON.stringify(app.native.device.getLngAndLat())}\n`;

        this.content.string = contentStr;
    }

    requestLocationUpdates() {
        let p = ["android.permission.ACCESS_COARSE_LOCATION", "android.permission.ACCESS_FINE_LOCATION"];
        if (app.native.device.hasPermissions(...p)) {
            app.native.device.requestLocationUpdates((lat, lng) => {
                app.popup.showToast(`lat:${lat}, lng:${lng}`)
            });
        } else {
            this.requestPermissions("请求位置权限", 1, ...p)
        }
    }

    removeLocationUpdates() {
        app.native.device.removeLocationUpdates();
    }

    gotoLocationSetting() {
        app.native.device.gotoLocationSetting();
    }

    setOrientationLandscape() {
        app.native.device.setRequestedOrientation(0);
    }

    setOrientationPortrait() {
        app.native.device.setRequestedOrientation(1);
    }

    getRequestedOrientation() {
        app.popup.showToast(`orientation:${app.native.device.getRequestedOrientation()}`);
    }

    gotoAppDetailIntent() {
        app.native.device.gotoAppDetailIntent();
    }

    gotoSettings() {
        app.native.device.gotoSettings("测试", "需要xxx权限");
    }
    /**
     * 手机唯一码权限
     */
    phoneStatePermissionDenied() {
        this.checkPermission("android.permission.READ_PRIVILEGED_PHONE_STATE")
    }

    /**
     * 请求手机唯一码权限
     */
    requestPhoneStatePermissions() {
        this.requestPermissions("请求手机唯一码权限", 1, "android.permission.READ_PRIVILEGED_PHONE_STATE")
    }
    /**
     * wifi权限
     */
    wifiPermissionDenied() {
        this.checkPermission("android.permission.LOCAL_MAC_ADDRESS", "android.permission.ACCESS_FINE_LOCATION")
    }
    /**
     * 请求wifi权限
     */
    requestWifiPermissions() {
        this.requestPermissions("请求Wifi权限", 1, "android.permission.LOCAL_MAC_ADDRESS", "android.permission.ACCESS_FINE_LOCATION")
    }

    private checkPermission(...args: string[]) {
        app.popup.showToast(`PermanentlyDenied:${app.native.device.somePermissionPermanentlyDenied(...args)} hasPermissions:${app.native.device.hasPermissions(...args)}`);
    }

    private requestPermissions(rationale: string, requestCode: number, ...args: string[]) {
        app.native.device.requestPermissions(rationale, requestCode, ...args);
    }

    /**
     * 相册选图
     */
    pickFromGallery() {
        if (app.native.device.hasPermissions("android.permission.READ_EXTERNAL_STORAGE")) {
            app.native.device.pickFromGallery(app.file.getFileDir(app.file.FileDir.Copy) + "temp.png");
        } else {
            this.requestPermissions("请求读取外部文件权限", 1, "android.permission.READ_EXTERNAL_STORAGE")
        }
    }
    /**
     * 相机拍照
     */
    pickFromCapture() {
        if (app.native.device.hasPermissions("android.permission.CAMERA")) {
            app.native.device.pickFromCapture(app.file.getFileDir(app.file.FileDir.Copy) + "temp.png");
        } else {
            this.requestPermissions("访问相机权限", 1, "android.permission.CAMERA")
        }

    }
    /**
     * 剪切照片
     */
    startCropImage() {
        app.native.device.startCropImage(app.file.getFileDir(app.file.FileDir.Copy) + "temp.png", app.file.getFileDir(app.file.FileDir.Copy) + "tempCrop.png");
    }

    /**
     * 复制剪切板
     */
    setClipBoard() {
        app.native.device.setClipBoard("这是测试复制");
    }

    /**
     * 分享whatsapp
     */
    shareTextToWhatsApp() {
        app.native.device.shareTextToWhatsApp("这是测试分享");
    }

    /**
     * test error
     */
    testError() {
        let a = null;
        a.b = 1;
    }

    postException() {
        app.native.bugly.postException("test bug", fw.getStack());
    }

    reportEvent() {
        app.event.reportEvent("app_open");
    }

    loginFacebook() {
        app.native.facebook.login();
    }

    logoutFacebook() {
        app.native.facebook.logout();
    }

    shareLinkFacebook() {
        app.native.facebook.shareLink("https://www.baidu.com", "测试分享");
    }

    shareMoreFacebook() {
        app.native.facebook.shareMore("https://www.baidu.com", "测试分享");
    }

    logPurchaseFacebook() {
        app.native.facebook.logPurchase("10.00", "INR");
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
