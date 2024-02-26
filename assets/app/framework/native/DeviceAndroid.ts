import { JsonAsset, sys } from 'cc';
import { _decorator } from 'cc';
const { ccclass } = _decorator;
import { DeviceBase, LngAndLat } from './DeviceBase';

@ccclass('DeviceAndroid')
export class DeviceAndroid extends DeviceBase {

    getSDKtype(): number {
        return (this as any).__getSDKtype ??= this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "getSDKtype",
            strFuncParam: "()I",
        });
    }

    linsterLocationUpdates: (lat: any, lng: any) => void;
    getSystemType() {
        return 1;
    }

    getVersion(): string {
        return (this as any).__getVersion ??= this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "getSysVersion",
            strFuncParam: "()Ljava/lang/String;",
        });
    }

    getMacAddress(): string {
        return this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "getLocalMacAddress",
            strFuncParam: "()Ljava/lang/String;",
        });
    }
    /**获取 主板Bios ID //android没有用androidId 代替 */
    getBiosID(): string {
        return this.getAndroidId();
    }
    /**获取CPU ID */
    getCpuID(): string {
        return (this as any).__getCpuID ??= this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "getMobileModel",
            strFuncParam: "()Ljava/lang/String;",
        });
    }
    /**androidid */
    getAndroidId() {
        return (this as any).__getAndroidId ??= this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "getAndroidId",
            strFuncParam: "()Ljava/lang/String;",
        });
    }
    /**获取设备唯一ID */
    getHDID(): string {
        let leoGAID = app.native.leo.getGAID();
        if (leoGAID == "" || leoGAID.match(/^[0-]+$/)) {
            let gaid = this.callStaticMethod({
                strAndroidPackagePath: "com/panda/util",
                strClassName: "Utils",
                funcName: "getGAID",
                strFuncParam: "()Ljava/lang/String;",
            });
            if (gaid == "" || gaid.match(/^[0-]+$/)) {
                return this.getAndroidId();
            }
            return gaid;
        }
        return leoGAID;
    }
    /**获取谷歌广告ID */
    getGAID(): string {
        let leoGAID = app.native.leo.getGAID();
        if (leoGAID == "" || leoGAID.match(/^[0-]+$/)) {
            let gaid = this.callStaticMethod({
                strAndroidPackagePath: "com/panda/util",
                strClassName: "Utils",
                funcName: "getGAID",
                strFuncParam: "()Ljava/lang/String;",
            });
            if (gaid == "" || gaid.match(/^[0-]+$/)) {
                gaid = `pd-${this.getUUID()}`;
            }
            return gaid;
        }
        return leoGAID;
    }
    /**
     * 手机唯一标识
     * 需要申请 "android.permission.READ_PRIVILEGED_PHONE_STATE" 权限
     * @returns 
     */
    getDeviceId(): string {
        return this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "getDeviceId",
            strFuncParam: "()Ljava/lang/String;",
        });
    }
    /**获取机器名 */
    getMachineName(): string {
        return (this as any).__getMachineName ??= this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "getMobileModel",
            strFuncParam: "()Ljava/lang/String;",
        });
    }
    /**获取当前语言 */
    getLanguage(): string {
        return sys.language;
    }
    /**关闭闪屏界面 */
    hideSplashView() {
        let data = {
        }
        this.dispatchEventToNative("hideSplashView", data)
    }
    /**获取随机生成的ID */
    getUUID(): string {
        return (this as any).__getUUID ??= this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "getUUID",
            strFuncParam: "()Ljava/lang/String;",
        });
    }
    /**IDFA ios广告唯一标识 */
    getIDFA(): string {
        return "";
    }
    /**获取经纬度 */
    //@RequiresPermission(anyOf = {"android.permission.ACCESS_COARSE_LOCATION","android.permission.ACCESS_FINE_LOCATION"})
    getLngAndLat(): LngAndLat {
        let jsonStr = this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "getLngAndLat",
            strFuncParam: "()Ljava/lang/String;",
        });
        return JSON.safeParse(jsonStr) ?? {
            ret: 1,
            lat: 0,
            lng: 0,
        };
    }
    /**请求监听经纬度变化 */
    requestLocationUpdates(linster: (lat, lng) => void, minTimeMs: number = 0, minDistanceM: number = 0) {
        this.linsterLocationUpdates = linster;
        this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "requestLocationUpdates",
            strFuncParam: "(II)V",
        }, minTimeMs, minDistanceM);
    }
    /**经纬度变化 */
    @fw.Decorator.TryCatch()
    onLocationChanged(params) {
        let { lat, lng } = params;
        this.linsterLocationUpdates(lat, lng);
    }
    /**移除经纬度变化监听 */
    removeLocationUpdates() {
        this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "removeLocationUpdates",
            strFuncParam: "()V",
        });
    }
    /**打开位置权限 */
    gotoLocationSetting() {
        this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "gotoLocationSetting",
            strFuncParam: "()V",
        });
    }
    /**切换横竖屏 */
    setRequestedOrientation(screen_orientation: number) {
        this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "setRequestedOrientation",
            strFuncParam: "(I)V",
        }, screen_orientation);
    }
    /**获得当前屏幕方向 */
    getRequestedOrientation() {
        return this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "getRequestedOrientation",
            strFuncParam: "()I",
        });
    }
    /**跳转app设置界面 */
    gotoAppDetailIntent() {
        this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "gotoAppDetailIntent",
            strFuncParam: "()V",
        });
    }
    /**跳转权限设置界面提示弹窗 */
    gotoSettings(title: string = `Tips`, rationale: string = `This app requires these permissions to work properly`) {
        this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "gotoSettings",
            strFuncParam: "(Ljava/lang/String;Ljava/lang/String;)V",
        }, title, rationale);
    }
    /**获取渠道id */
    getOperatorsID(): string {
        return (this as any).__getOperatorsID ??= this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "GetOperatorsID",
            strFuncParam: "()Ljava/lang/String;",
        });
    }
    /**获取子渠道标识 */
    getOperatorsSubID(): string {
        return (this as any).__getOperatorsSubID ??= this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "GetOperatorsSubID",
            strFuncParam: "()Ljava/lang/String;",
        });
    }
    /**获取渠道标识 */
    getChannel(): string {
        return (this as any).__getChannel ??= this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "GetChannel",
            strFuncParam: "()Ljava/lang/String;",
        });
    }
    /**
     * 检测权限是否被禁用 如果禁用了需要 调用 gotoSettings 让用户自己去打开权限
     * @param args 
     * @returns 
     */
    somePermissionPermanentlyDenied(...args: string[]): boolean {
        let jsonStr = JSON.stringify(args);
        return this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Permissions",
            funcName: "somePermissionPermanentlyDenied",
            strFuncParam: "(Ljava/lang/String;)Z",
        }, jsonStr);
    }
    /**
     * 检测权限是被授权
     * @param args 
     * @returns 
     */
    hasPermissions(...args: string[]): boolean {
        let jsonStr = JSON.stringify(args);
        return this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Permissions",
            funcName: "hasPermissions",
            strFuncParam: "(Ljava/lang/String;)Z",
        }, jsonStr);
    }
    /**
     * 请求权限
     * @param rationale 描述
     * @param requestCode 请求code
     * @param args 权限字符串
     * @returns 
     */
    requestPermissions(rationale: string, requestCode: number, ...args: string[]) {
        let jsonStr = JSON.stringify(args);
        return this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Permissions",
            funcName: "requestPermissions",
            strFuncParam: "(Ljava/lang/String;ILjava/lang/String;)V",
        }, rationale, requestCode, jsonStr);
    }
    /**
     * 请求权限被同意
     * @param params 
     */
    onPermissionsGranted(params: any) {
        let { perms, requestCode } = params;
        app.event.dispatchEvent({
            eventName: `RequestPermissionsResp`,
            data: {
                bSuccess: true,
                params: params,
            }
        });
        // app.popup.showToast(`onPermissionsGranted ${perms}`);
    }
    /**
     * 请求权限被禁用
     * @param params 
     */
    onPermissionsDenied(params) {
        let { perms, requestCode } = params;
        app.event.dispatchEvent({
            eventName: `RequestPermissionsResp`,
            data: {
                bSuccess: false,
                params: params,
            }
        });
        // app.popup.showToast(`onPermissionsDenied ${perms}`);
    }
    /**
     * 获得wifi 信号强度
     * @returns 
     */
    getWifiLevel(): number {
        return this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "NetUtils",
            funcName: "getWifiLevel",
            strFuncParam: "()I",
        });
    }
    /**
     * 获得电量
     * @returns 
     */
    getBatteryLevel(): number {
        var level = this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "NetUtils",
            funcName: "getBatteryLevel",
            strFuncParam: "()I",
        });
        return Math.floor(app.func.toNumber(level)) * 0.01
        
    }
    /**
     * 获得手机信号强度
     * @returns 
     */
    //@RequiresPermission(value = "android.permission.ACCESS_FINE_LOCATION")
    getTeleSignalStrength(): number {
        return this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "NetUtils",
            funcName: "getTeleSignalStrength",
            strFuncParam: "()I",
        });
    }
    /**
     * 获取网络类型
     * public static final int NETWORK_TYPE_NONE = 0;
     * public static final int NETWORK_TYPE_LAN = 1;wifi
     * public static final int NETWORK_TYPE_WWAN = 2;数据流量
     * @returns 
     */
    getNetworkType(): number {
        return this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "NetUtils",
            funcName: "getNetworkType",
            strFuncParam: "()I",
        });
    }

    /**
     * 相册选图
     * @param path 保存路径
     */
    //@RequiresPermission(value = "android.permission.READ_EXTERNAL_STORAGE")
    pickFromGallery(path: string) {
        this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "EasyPhotos",
            funcName: "pickFromGallery",
            strFuncParam: "(Ljava/lang/String;)V",
        }, app.func.removePathRepeatDiagonal(path));
    }
    /**
     * 相册选图返回
     * @param params 
     */
    onPickFromGallery(params) {
        let { returnCode, activity_resultCode, path } = params;
        if( returnCode == 0 ) {
            app.popup.showToast("fail")
            return 
        }
        app.event.dispatchEvent({
            eventName: `CameraPicture`,
            data: app.func.removePathRepeatDiagonal(path),
        });
    }
    /**
     * 相机拍照
     * @param path 保存路径
     */
    //@RequiresPermission(value = "android.permission.CAMERA")
    pickFromCapture(path: string) {
        this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "EasyPhotos",
            funcName: "pickFromCapture",
            strFuncParam: "(Ljava/lang/String;)V",
        }, app.func.removePathRepeatDiagonal(path));
    }
    /**
     * 相机拍照返回
     */
    onPickFromCapture(params) {
        let { returnCode, activity_resultCode, path } = params;
        if( returnCode == 0 ) {
            app.popup.showToast("fail")
            return 
        }
    }
    /**
     * 剪切图片
     * @param inPath 输入路径
     * @param outPath 输出路径
     * @param width 宽
     * @param height 高
     */
    startCropImage(inPath: string, outPath: string, width: number = 300, height: number = 300) {
        this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "EasyPhotos",
            funcName: "startCropImage",
            strFuncParam: "(Ljava/lang/String;Ljava/lang/String;II)V",
        }, inPath, outPath, width, height);
    }
    /**
     * 剪切图片返回
     */
    onCropImage(params) {
        let { returnCode, activity_resultCode, path } = params;
        if( returnCode == 0 ) {
            app.popup.showToast("fail")
            return 
        }
    }
    /**
     * app版本名称
     * @returns 
     */
    installApk(filePath: string): string {
        return this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "installApk",
            strFuncParam: "(Ljava/lang/String;)V",
        }, filePath);
    }
    /**
     * app版本名称
     * @returns 
     */
    getAppVersion(): string {
        return this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "getAppVersion",
            strFuncParam: "()Ljava/lang/String;",
        });
    }
    /**
     * 设置剪切板内容
     * @param copyStr 
     * @returns 
     */
    setClipBoard(copyStr: string) {
        return this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "setClipBoard",
            strFuncParam: "(Ljava/lang/String;)V",
        }, copyStr);
    }
    /**
     * 分享内容到whatsapp
     * @param shareStr 
     * @returns 
     */
    shareTextToWhatsApp(shareStr: string) {
        let whatsAppPackageName = "com.whatsapp";
        let whatsAppAppName = "WhatsApp";
        return this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "shareTextToApp",
            strFuncParam: "(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)V",
        }, whatsAppPackageName, whatsAppAppName, shareStr);
    }
    /**
     * 检测是否安装apk
     * @param packageName 
     */
    isAppInstall(packageName: string) {
        return this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "isAppInstall",
            strFuncParam: "(Ljava/lang/String;)Z",
        }, packageName);
    }
    /**
     * 模拟器检测
     */
    async checkIsAndroidEMU(): Promise<boolean> {
        return app.func.doPromise((resolve) => {
            let resConfig = fw.BundleConfig.resources.res["androidEMUJudgeConfig"];
            this.loadBundleRes(resConfig,(res: JsonAsset) => {
                for (let key in res.json) {
                    for (let nameKey in res.json[key].package) {
                        let name = res.json[key].package[nameKey];
                        if (this.isAppInstall(name)) {
                            resolve(true)
                            return;
                        }
                    }
                }
                resolve(false)
            })
        })
    }
    
    /**Vpn检测 */
    isVpnUsed():boolean {
        try {
            return this.callStaticMethod({
                strAndroidPackagePath: "com/panda/util",
                strClassName: "Utils",
                funcName: "isVpnUsed",
                strFuncParam: "()Z",
            });
        } catch (error) {
            return false;
        }
    }
    /**WIFI代理检测 */
    isWifiProxy():boolean {
        return this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "Utils",
            funcName: "isWifiProxy",
            strFuncParam: "()Z",
        });
    }
    /**
     * 获得图片宽高信息
     */
    getImageInfo(path: string) {
        return this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "EasyPhotos",
            funcName: "getImageInfo",
            strFuncParam: "(Ljava/lang/String;)Ljava/lang/String;",
        }, path);
    }
    /**
     * 设置自动压缩图片宽高
     */
    setCompressImageInfo(isAutoCompressImage: boolean, compressImageWidth: number, compressImageHeight: number) {
        return this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "EasyPhotos",
            funcName: "setCompressImageInfo",
            strFuncParam: "(ZLjava/lang/String;Ljava/lang/String;)V",
        }, isAutoCompressImage, compressImageWidth, compressImageHeight);
    }
    /**
     * 压缩图片
     */
    compressImage(path: string, outPath: string) {
        return this.callStaticMethod({
            strAndroidPackagePath: "com/panda/util",
            strClassName: "EasyPhotos",
            funcName: "compressImage",
            strFuncParam: "(Ljava/lang/String;Ljava/lang/String;)Z",
        }, path, outPath);
    }
}
