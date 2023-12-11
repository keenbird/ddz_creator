import { Paths } from "../utils";
import { CocosProjectTasks } from './cocosProjectTypes';
export interface ICMakeConfig {
    USE_AUDIO?: boolean;
    USE_VIDEO?: boolean;
    USE_WEBVIEW?: boolean;
    USE_JOB_SYSTEM_TBB?: boolean;
    USE_JOB_SYSTEM_TASKFLOW?: boolean;
    USE_PORTRAIT?: boolean;
    CC_USE_METAL?: boolean;
    CC_USE_VUKAN?: boolean;
    CC_USE_GLES3: boolean;
    CC_USE_GLES2: boolean;
    COCOS_X_PATH?: string;
    APP_NAME?: string;
    XXTEAKEY: string;
    [propName: string]: any;
    USE_SERVER_MODE: string;
}
export declare type InternaleNativePlatform = 'mac' | 'android' | 'windows' | 'ios' | 'ohos';
export interface INativePlatformOptions {
    extends?: InternaleNativePlatform;
    overwrite?: InternaleNativePlatform;
    create: () => Promise<boolean>;
    genrate: () => Promise<boolean>;
    make?: () => Promise<boolean>;
    run?: () => Promise<boolean>;
    init: (params: CocosParams<Object>) => void;
}
export declare abstract class NativePackTool {
    params: CocosParams<Object>;
    paths: Paths;
    cmakeArgs: string[];
    setEnv(key: string, value: any): void;
    init(params: CocosParams<Object>): void;
    protected parseVersion(content: string, key: string, def: number): number;
    protected copyCommonTemplate(): Promise<void>;
    private get projEngineVersionPath();
    private _debugInfo;
    private get DebugInfos();
    private _versionParser;
    private get versionParser();
    /**
     * Read version number from cocos-version.json
     */
    protected tryReadProjectTemplateVersion(): {
        version: string;
        skipCheck: boolean | undefined;
    } | null;
    /**
     * Read package.json file in the root folder and return the version field.
     */
    protected tryGetEngineVersion(): string | null;
    /**
     * Version condition from compatibility-info.json for current platform.
     */
    protected tryGetCompatibilityInfo(): string | null;
    private commonDirAreIdentical;
    private skipVersionCheck;
    /**
     * The engine version used to generate the 'native/' folder should match the
     * condition written in the 'compatibility-info.json' file.
     */
    private validateTemplateVersion;
    /**
     * Utility function to check if a file exists dst as in src.
     */
    protected validateDirectory(src: string, dst: string, missingDirs: string[]): void;
    /**
     *  Check files under `native/engine/platform` folder
     */
    protected validatePlatformDirectory(missing: string[]): void;
    /**
     * Check if any file removed from the 'native/' folder
     */
    private validateTemplateConsistency;
    /**
     * - Ensure the engine version used to generete 'native/' folder is compatible
     *   with the current engine version.
     * - Check if any file under the 'native/' folder is removed.
     */
    protected validateNativeDir(): void;
    /**
     * Write cocos-version.json into native/common/cocos-version.json
     */
    protected writeEngineVersion(): void;
    protected copyPlatformTemplate(): Promise<void>;
    protected excuteTemplateTask(tasks: CocosProjectTasks): Promise<void>;
    protected generateCMakeConfig(): Promise<void>;
    protected appendCmakeResDirArgs(args: string[]): void;
    /**
     * 加密脚本，加密后，会修改 cmake 参数，因而需要再次执行 cmake 配置文件的生成
     * @returns
     */
    protected encrypteScripts(): Promise<void>;
    /**
     * 解析、执行 cocos-template.json 模板任务
     */
    protected excuteCocosTemplateTask(): Promise<void>;
    abstract create(): Promise<boolean>;
    generate?(): Promise<boolean>;
    make?(): Promise<boolean>;
    run?(): Promise<boolean>;
}
export declare class CocosParams<T> {
    platformParams: T | any;
    debug: boolean;
    projectName: string;
    cmakePath: string;
    platform: string;
    platformName: string;
    /**
     * engine root
     */
    enginePath: string;
    /**
     * native engine root
     */
    nativeEnginePath: string;
    /**
     * project path
     */
    projDir: string;
    /**
     * build/[platform]
     */
    buildDir: string;
    /**
     * @zh 构建资源路径
     * @en /build/[platform]/data
     */
    buildAssetsDir: string;
    /**
     * @zh 是否加密脚本
     * @en is encrypted
     */
    encrypted?: boolean;
    /**
     * @zh 是否压缩脚本
     * @en is compress script
     */
    compressZip?: boolean;
    /**
     * @zh 加密密钥
     * @en encrypt Key
     */
    xxteaKey?: string;
    /**
     * @zh 是否为模拟器
     * @en is simulator
     */
    simulator?: boolean;
    cMakeConfig: ICMakeConfig;
    constructor(params: CocosParams<Object>);
}
