import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { ModuleBase } from './ModuleBase';
import { MODULE_NAME } from '../../config/ModuleConfig';

//lat 经度 lng 纬度
//ret == 1 正常返回的 lat,lng
//ret == 2 需要异步获取  返回的 lat = 0,lng = 0
//ret == -1 没权限
//ret == -2 没有打开位置服务器 需要device.gotoLocationSetting() 去打开设置
export interface LngAndLat {
    ret: number;
    lat: number;
    lng: number;
}
@ccclass('DeviceBase')
export abstract class DeviceBase extends ModuleBase {
    initModule() {
        this._module_name = MODULE_NAME.device;
    }
    /**获取native 类型 用于区分native 功能 */
    abstract getSDKtype(): number;
    /**获取系统类型 */
    abstract getSystemType(): number;
    /**获取系统版本号 */
    abstract getVersion(): string;
    /**获取网卡序列号 */
    abstract getMacAddress(): string;
    /**获取Bios ID */
    abstract getBiosID(): string;
    /**获取CPU ID */
    abstract getCpuID(): string;
    /**获取硬盘 ID */
    abstract getHDID(): string;
    /**获取机器名 */
    abstract getMachineName(): string;
    /**获取当前语言 */
    abstract getLanguage(): string;
    /**关闭闪屏界面 */
    abstract hideSplashView();
    /**获取随机生成的ID */
    abstract getUUID(): string;
    /**IDFA ios广告唯一标识 */
    abstract getIDFA(): string;
    /**获取经纬度 */
    abstract getLngAndLat(): LngAndLat;
    /**获取渠道id */
    abstract getOperatorsID(): string;
    /**获取子渠道标识 */
    abstract getOperatorsSubID(): string;
    /**获取渠道标识 */
    abstract getChannel(): string;
    /**获取androidid */
    abstract getAndroidId(): string;
    /**获取google广告id */
    abstract getGAID(): string;
    /**获取手机唯一标识 */
    abstract getDeviceId(): string;
    /**请求监听经纬度变化 */
    abstract requestLocationUpdates(linster: (lat: number, lng: number) => void, minTimeMs?: number, minDistanceM?: number): void;
    /**移除经纬度变化监听 */
    abstract removeLocationUpdates(): void;
    /**打开位置权限 */
    abstract gotoLocationSetting(): void;
    /**切换横竖屏 */
    abstract setRequestedOrientation(screen_orientation: number): void;
    /**获得当前屏幕方向 */
    abstract getRequestedOrientation(): number;
    /**跳转app设置界面 */
    abstract gotoAppDetailIntent(): void;
    /**跳转权限设置界面提示弹窗 */
    abstract gotoSettings(title?: string, rationale?: string): void;
    /**检测权限是否被禁用 如果禁用了需要 调用 gotoSettings 让用户自己去打开权限 */
    abstract somePermissionPermanentlyDenied(...args: string[]): boolean;
    /**检测权限是被授权 */
    abstract hasPermissions(...args: string[]): boolean;
    /**
     * 请求权限
     * @param rationale 描述
     * @param requestCode 请求code
     * @param args 权限字符串
     * @returns 
     */
    abstract requestPermissions(rationale: string, requestCode: number, ...args: string[]): void;
    /**获得wifi 信号强度 */
    abstract getWifiLevel(): number;
    /**获得手机信号强度 */
    //@RequiresPermission(value = "android.permission.ACCESS_FINE_LOCATION")
    abstract getTeleSignalStrength(): number;
    /**
     * 获取网络类型
     * public static final int NETWORK_TYPE_NONE = 0;
     * public static final int NETWORK_TYPE_LAN = 1;
     * public static final int NETWORK_TYPE_WWAN = 2;
     * @returns 
     */
    abstract getNetworkType(): number;
    /**相册选图 */
    abstract pickFromGallery(savePath: string): void;
    /**相机拍照 */
    abstract pickFromCapture(savePath: string): void;
    /**
     * 剪切图片
     * @param inPath 输入路径
     * @param outPath 输出路径
     * @param width 宽
     * @param height 高
     */
    abstract startCropImage(inPath: string, outPath: string, width?: number, height?: number): void;
    /**安装apk */
    abstract installApk(filePath: string): void;
    /**app版本名称 */
    abstract getAppVersion(): string;
    /**设置剪切板内容 */
    abstract setClipBoard(copyStr: string): void;
    /**分享内容到whatsapp */
    abstract shareTextToWhatsApp(shareStr: string): void;
    /**检测是否安装apk */
    abstract isAppInstall(packageName: string): boolean;
    /**模拟器检测 */
    abstract checkIsAndroidEMU():Promise<boolean>;
    /**Vpn检测 */
    isVpnUsed():boolean {
        return false;
    }
    /**WIFI代理检测 */
    isWifiProxy():boolean {
        return false;
    }
    /**选择头像 */
    chooseFace(func: string) {
        app.native.device.pickFromGallery(`${app.file.getFileDir(app.file.FileDir.Copy)}chooseFace/chooseFace`);
    }
    /**
     * 相册选图返回
     * @param params 
     */
    onPickFromGallery(params: any) {
        let { returnCode, activity_resultCode, path } = params;
        app.event.dispatchEvent({
            eventName: `PickFromGallery`,
            data: params,
        });
    }
    /**打印提示未实现提示 */
    notImplemented() {
        fw.printError(`该平台暂未实现该功能`);
    }

    openURL(url:string = "") {
        if(jsb) {
            jsb.openURL(url)
        }else {
            window.open(url, "_blank","_blank");
        }
    }
}
