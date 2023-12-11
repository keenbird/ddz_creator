import { CocosParams, NativePackTool } from "../base/default";
export interface IWindowsParam {
    targetPlatform: 'x64';
}
export declare class WindowsPackTool extends NativePackTool {
    params: CocosParams<IWindowsParam>;
    create(): Promise<boolean>;
    generate(): Promise<boolean>;
    make(): Promise<boolean>;
    windowsSelectCmakeGeneratorArgs(): Promise<string[]>;
    getCmakeGenerator(): string;
    run(): Promise<boolean>;
}
