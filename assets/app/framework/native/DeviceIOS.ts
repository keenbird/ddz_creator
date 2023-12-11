import { _decorator } from 'cc';
const { ccclass } = _decorator;
import { DeviceBase, LngAndLat } from './DeviceBase';

@ccclass('DeviceIOS')
export class DeviceIOS extends DeviceBase {
    checkIsAndroidEMU() {
        throw new Error('Method not implemented.');
    }
    isAppInstall(packageName: string) {
        throw new Error('Method not implemented.');
    }
    getSDKtype(): number {
        throw new Error('Method not implemented.');
    }
    getSystemType(): number {
        throw new Error('Method not implemented.');
    }
    getVersion(): string {
        throw new Error('Method not implemented.');
    }
    getMacAddress(): string {
        throw new Error('Method not implemented.');
    }
    getBiosID(): string {
        throw new Error('Method not implemented.');
    }
    getCpuID(): string {
        throw new Error('Method not implemented.');
    }
    getHDID(): string {
        throw new Error('Method not implemented.');
    }
    getMachineName(): string {
        throw new Error('Method not implemented.');
    }
    getUUID(): string {
        throw new Error('Method not implemented.');
    }
    getIDFA(): string {
        throw new Error('Method not implemented.');
    }
    getLngAndLat(): LngAndLat {
        throw new Error('Method not implemented.');
    }
    getOperatorsID(): string {
        throw new Error('Method not implemented.');
    }
    getOperatorsSubID(): string {
        throw new Error('Method not implemented.');
    }
    getChannel(): string {
        throw new Error('Method not implemented.');
    }
    getAndroidId(): string {
        throw new Error('Method not implemented.');
    }
    getGAID(): string {
        throw new Error('Method not implemented.');
    }
    getDeviceId(): string {
        throw new Error('Method not implemented.');
    }
    requestLocationUpdates(linster: (lat: number, lng: number) => void, minTimeMs?: number, minDistanceM?: number) {
        throw new Error('Method not implemented.');
    }
    removeLocationUpdates() {
        throw new Error('Method not implemented.');
    }
    gotoLocationSetting() {
        throw new Error('Method not implemented.');
    }
    setRequestedOrientation(screen_orientation: number) {
        throw new Error('Method not implemented.');
    }
    getRequestedOrientation() {
        throw new Error('Method not implemented.');
    }
    gotoAppDetailIntent() {
        throw new Error('Method not implemented.');
    }
    gotoSettings(title?: string, rationale?: string) {
        throw new Error('Method not implemented.');
    }
    somePermissionPermanentlyDenied(...args: string[]): boolean {
        throw new Error('Method not implemented.');
    }
    hasPermissions(...args: string[]): boolean {
        throw new Error('Method not implemented.');
    }
    requestPermissions(rationale: string, requestCode: number, ...args: string[]) {
        throw new Error('Method not implemented.');
    }
    getWifiLevel(): number {
        throw new Error('Method not implemented.');
    }
    getTeleSignalStrength(): number {
        throw new Error('Method not implemented.');
    }
    getNetworkType(): number {
        throw new Error('Method not implemented.');
    }
    pickFromGallery(path: string) {
        throw new Error('Method not implemented.');
    }
    pickFromCapture(path: string) {
        throw new Error('Method not implemented.');
    }
    startCropImage(inPath: string, outPath: string, width?: number, height?: number) {
        throw new Error('Method not implemented.');
    }
    getAppVersion(): string {
        throw new Error('Method not implemented.');
    }
    setClipBoard(copyStr: string) {
        throw new Error('Method not implemented.');
    }
    shareTextToWhatsApp(shareStr: string) {
        throw new Error('Method not implemented.');
    }
}
