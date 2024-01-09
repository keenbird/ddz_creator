import { _decorator, sys } from 'cc';
import { NETWORK_TYPE } from '../../config/ConstantConfig';
const { ccclass } = _decorator;
import { DeviceBase, LngAndLat } from './DeviceBase';

@ccclass('DeviceWechat')
export class DeviceWechat extends DeviceBase {
    
    installApk(filePath: string): void {
        fw.print("未能实现安装",filePath)
    }

    async checkIsAndroidEMU() {
        return Promise.resolve(false);
    }

    isAppInstall(packageName: string) {
        return false;
    }
    
    getSDKtype(): number {
        return 0;
    }

    getSystemType(): number {
        return 1;
    }
    getVersion(): string {
        try {
            const res = wx.getSystemInfoSync()
            return res.version
        } catch (e) {
        // Do something when catch error
        }

        // wx.getSystemInfo({
        //     success(res) {
        //         return res.version;
        //     },
        //     fail: function (err?: any): void {
        //         // throw new Error('Function not implemented.');
        //     },
        //     complete: function (res?: any): void {
        //         // throw new Error('Function not implemented.');
        //     }
        // })
        // return "1.0.0";
    }
    getMacAddress(): string {
        return "";
    }
    getBiosID(): string {
        try {
            const res = wx.getSystemInfoSync()
            return res.model
        } catch (e) {
        // Do something when catch error
        }
        // wx.getSystemInfo({
        //     success(res) {
        //         return res.model;
        //     },
        //     fail: function (err?: any): void {
        //         // throw new Error('Function fail.' +err);
        //     },
        //     complete: function (res?: any): void {
        //         // throw new Error('Function not implemented.');
        //     }
        // })
        // return "";
    }
    getCpuID(): string {
        return "";
    }
    getHDID(): string {
        return "";
    }
    getMachineName(): string {
        try {
            const res = wx.getSystemInfoSync()
            return res.model
        } catch (e) {
        // Do something when catch error
        }
        // wx.getSystemInfo({
        //     success(res) {
        //         return res.model;
        //     },
        //     fail: function (err?: any): void {
        //         // throw new Error('Function not implemented.');
        //     },
        //     complete: function (res?: any): void {
        //         // throw new Error('Function not implemented.');
        //     }
        // })
        // return navigator.appName;
    }
    getLanguage(): string {
        return sys.language;
    }
    /**关闭闪屏界面 */
    hideSplashView() {
    }
    getUUID(): string {
        return "";
    }
    getIDFA(): string {
        return "";
    }
    getLngAndLat(): LngAndLat {
        return {
            ret: 1,
            lat: 0,
            lng: 0,
        };
    }
    getOperatorsID(): string {
        return "0";
    }
    getOperatorsSubID(): string {
        return `channel_default`;
    }
    getChannel(): string {
        return "channel_default";
    }
    getAndroidId(): string {
        return "";
    }
    getGAID(): string {
        return "";
    }
    getDeviceId(): string {
        return "";
    }
    requestLocationUpdates(linster: (lat: number, lng: number) => void, minTimeMs?: number, minDistanceM?: number) {
    }
    removeLocationUpdates() {
    }
    gotoLocationSetting() {
    }
    setRequestedOrientation(screen_orientation: number) {
    }
    getRequestedOrientation() {
        return 0
    }
    gotoAppDetailIntent() {
    }
    gotoSettings(title?: string, rationale?: string) {
    }
    somePermissionPermanentlyDenied(...args: string[]): boolean {
        return false;
    }
    hasPermissions(...args: string[]): boolean {
        return true;
    }
    requestPermissions(rationale: string, requestCode: number, ...args: string[]) {
    }
    getWifiLevel(): number {
        var signal =  wx.WifiInfo.signalStrength || 0
        var signalNum = 4
        if(app.func.getWechatPlatform() == "android"){
            if(signal>=0 && signal<25){
                signalNum = 1
            }else if(signal>=25 && signal<50){
                signalNum = 2
            }else if(signal>=50 && signal<75){
                signalNum = 3
            }else if(signal>=75 && signal<=100){
                signalNum = 4
            }
        }else if(app.func.getWechatPlatform() == "ios"){
            if(signal>=0 && signal<0.25){
                signalNum = 1
            }else if(signal>=0.25 && signal<0.50){
                signalNum = 2
            }else if(signal>=0.50 && signal<0.75){
                signalNum = 3
            }else if(signal>=0.75 && signal<=1){
                signalNum = 4
            }
        }
        return signalNum;
    }
    getTeleSignalStrength(): number {
        return 4;
    }
    getNetworkType(): number {
        return NETWORK_TYPE.NETWORK_TYPE_NET;
    }
    pickFromGallery(path: string) {
        return;
    }
    pickFromCapture(path: string) {
        return;
    }
    startCropImage(inPath: string, outPath: string, width?: number, height?: number) {
        return;
    }
    getAppVersion(): string {
        const accountInfo = wx.getAccountInfoSync();
        const version = accountInfo.miniProgram.version;
        return version || "1.0.0";
    }
    setClipBoard(copyStr: string) {
        wx.setClipboardData({
        data: copyStr,
        success (res) {
            //Tip
        }
        })
    }
    shareTextToWhatsApp(shareStr: string) {
        return;
    }

}



