import { _decorator, sys } from 'cc';
import { NETWORK_TYPE } from '../../config/ConstantConfig';
const { ccclass } = _decorator;
import { DeviceBase, LngAndLat } from './DeviceBase';

@ccclass('DeviceWindows')
export class DeviceWindows extends DeviceBase {
    
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
        return 0;
    }
    getVersion(): string {
        return `windows`;
    }
    getMacAddress(): string {
        return "";
    }
    getBiosID(): string {
        return "";
    }
    getCpuID(): string {
        return "";
    }
    getHDID(): string {
        return "";
    }
    getMachineName(): string {
        return navigator.appName;
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
        return 4;
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
        return "";
    }
    setClipBoard(copyStr: string) {
        return;
    }
    shareTextToWhatsApp(shareStr: string) {
        return;
    }

}
