import { CocosParams, NativePackTool } from "../base/default";
export interface IOrientation {
    landscapeLeft: boolean;
    landscapeRight: boolean;
    portrait: boolean;
    upsideDown: boolean;
}
export interface MacOSParams {
    bundleId: string;
    skipUpdateXcodeProject: boolean;
}
export declare abstract class MacOSPackTool extends NativePackTool {
    params: CocosParams<MacOSParams>;
    create(): Promise<boolean>;
    abstract generate(): Promise<boolean>;
    shouldSkipGenerate(): boolean;
    protected isAppleSilicon(): boolean;
    protected getXcodeMajorVerion(): number;
    skipUpdateXcodeProject(): Promise<void>;
    xcodeDestroyZEROCHECK(): Promise<void>;
}
