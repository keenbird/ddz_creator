import { CocosParams, NativePackTool } from "../base/default";
export interface IOrientation {
    landscapeLeft: boolean;
    landscapeRight: boolean;
    portrait: boolean;
    upsideDown: boolean;
}
export interface IAndroidParams {
    packageName: string;
    sdkPath: string;
    ndkPath: string;
    androidInstant: boolean;
    remoteUrl?: string;
    apiLevel: number;
    appABIs: string[];
    keystorePassword: string;
    keystoreAlias: string;
    keystoreAliasPassword: string;
    keystorePath: string;
    orientation: IOrientation;
    appBundle: boolean;
}
export declare class AndroidPackTool extends NativePackTool {
    params: CocosParams<IAndroidParams>;
    protected copyPlatformTemplate(): Promise<void>;
    protected validatePlatformDirectory(missing: string[]): void;
    create(): Promise<boolean>;
    make(): Promise<boolean>;
    protected setOrientation(): Promise<void>;
    protected updateAndroidGradleValues(): Promise<void>;
    protected configAndroidInstant(): Promise<void>;
    /**
     * 到对应目录拷贝文件到工程发布目录
     */
    copyToDist(): Promise<boolean>;
    run(): Promise<boolean>;
    getAdbPath(): string;
    getApkPath(): string;
    install(): Promise<boolean>;
    checkApkInstalled(): Promise<boolean>;
    startApp(): Promise<boolean>;
}
