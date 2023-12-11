import { _decorator, error, game, native } from 'cc';
import './../base/_FWClass'
import './../__init'

import { httpConfig } from '../../app/config/HttpConfig';

const HotUpdateEvent = {
    /**下载过程 */
    Progress: `HotUpdateProgress`,
    /**下载完成 */
    Complete: `HotUpdateComplete`,
}

/**以下是c++中的事件枚举定义 */
enum EventCode {
    /**
     * 本地manifest异常
     * native.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST
     */
    ERROR_NO_LOCAL_MANIFEST = 0,
    /**
     * 下载manifest异常
     * native.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST
     */
    ERROR_DOWNLOAD_MANIFEST = 1,
    /**
     * manifest解析异常
     * native.EventAssetsManager.ERROR_PARSE_MANIFEST
     */
    ERROR_PARSE_MANIFEST = 2,
    /**
     * 发现新版本
     * native.EventAssetsManager.NEW_VERSION_FOUND
     */
    NEW_VERSION_FOUND = 3,
    /**
     * 已经是最新版本了
     * native.EventAssetsManager.ALREADY_UP_TO_DATE
     */
    ALREADY_UP_TO_DATE = 4,
    /**
     * 更新中
     * native.EventAssetsManager.UPDATE_PROGRESSION
     */
    UPDATE_PROGRESSION = 5,
    /**
     * 资源已更新
     * native.EventAssetsManager.ASSET_UPDATED
     */
    ASSET_UPDATED = 6,
    /**
     * 资源更新失败
     * native.EventAssetsManager.ERROR_UPDATING
     */
    ERROR_UPDATING = 7,
    /**
     * 更新完成
     * native.EventAssetsManager.UPDATE_FINISHED
     */
    UPDATE_FINISHED = 8,
    /**
     * 更新失败
     * native.EventAssetsManager.UPDATE_FAILED
     */
    UPDATE_FAILED = 9,
    /**
     * 解压资源失败
     * native.EventAssetsManager.ERROR_DECOMPRESS
     */
    ERROR_DECOMPRESS = 10
};

export interface IHotUpdateLister {
    /**
     * 没有更新
     * @param am 
     * @returns 
     */
    notUpdate: (am?: _FWHotUpdateManager) => void;
    /**
     * 热更新失败
     * @param am 
     * @returns 
     */
    updateFail: (am?: _FWHotUpdateManager, error?: string) => void;
    /**
     * 热更新成功
     * @param am 
     * @returns 
     */
    updateSuccess: (am?: _FWHotUpdateManager) => void;
    /**
     * 开始热更新
     * @param am 
     * @returns 
     */
    startUpdate: (am?: _FWHotUpdateManager) => void;
    /**
     * 开始下载更新版本
     * @param am 
     * @returns 
     */
    downloadUpdateConfig: (am?: _FWHotUpdateManager) => void;
    /**
     * 下载更新版本配置失败
     */
    downloadUpdateConfigFail: (am?: _FWHotUpdateManager, error?: string) => void;
    /**
     * 下载更新版本配置成功
     */
    // downloadUpdateConfigSuccess: (am: _FWHotUpdateManager) => void;
}
export class HotUpdateLister implements IHotUpdateLister {
    notUpdate(am: _FWHotUpdateManager) { }
    updateFail(am: _FWHotUpdateManager, error: string) { }
    updateSuccess(am: _FWHotUpdateManager) { }
    startUpdate(am: _FWHotUpdateManager) { }
    downloadUpdateConfig(am: _FWHotUpdateManager) { }
    downloadUpdateConfigFail(am: _FWHotUpdateManager, error: string) { }
    // downloadUpdateConfigSuccess(am: _FWHotUpdateManager) { }
}

export class _FWHotUpdateManager extends (fw.FWClass) {
    /**检测版本次数（用于调整显示） */
    private checkCount = 0
    /**Manifest工具 */
    private _am: native.AssetsManager = null
    /**BundleName */
    private _bundleName: string
    /**热更缓存路径 */
    private _storagePath: string
    /**热更缓存路径 */
    private _relativePath: string
    /**当前处理的热更配置 */
    private _hConfigs: HotUpdateConfigs
    /**最后一次进度信息 */
    private _lastFWDispatchEventParam: FWDispatchEventParam
    /**更新完成回调 */
    private _hLister: IHotUpdateLister
    /**
     * 获得一个热更对象
     * @重点 完成后需要手动调用destroy的释放对象
     * @param data 热更配置
     * @returns FWHotUpdateManager对象
     */
    public static getOnce(data: HotUpdateConfigs) {
        //实例一个热更对象
        let once = new _FWHotUpdateManager();
        //保存数据
        once._hConfigs = data;
        //初始化
        once.init();
        //返回实例
        return once;
    }
    private constructor() {
        super();
    }
    /**
     * 获取native.AssetsManager
     */
    get ctrl() {
        return this._am;
    }
    /**初始化（回调通过事件传递，文件头部有注释，需要界面处理的添加事件监听即可） */
    init() {
        //热更仅在native端生效
        if (!app.func.isNative()) {
            fw.printWarn(`当前非原生环境`);
            return this;
        }
        //打印当前处理信息
        fw.print(`_FWHotUpdateManager HotUpdateConfigs`);
        fw.print(`${this._hConfigs}`);
        //设置热更缓存路径（如果是“game_”开头的bundle，默认添加“game”目录结构，“game_”开头未必一定是游戏）
        let bundleName = this._hConfigs.bundleConfig.bundleName;
        //resources特殊处理一下
        if (bundleName == `resources`) {
            this._bundleName = `main`;
            this._storagePath = `${app.file.getHotUpdatePath()}${this._bundleName}/`;
            this._relativePath = ``;
        } else {
            this._bundleName = bundleName;
            this._storagePath = `${app.file.getHotUpdatePath()}main/assets/${this._bundleName}/`;
            this._relativePath = `assets/${this._bundleName}/`;
        }
        fw.print(`热更缓存路径: ${this._storagePath}`);
        //热更监听
        this._hLister = this._hConfigs.lister ?? new HotUpdateLister();
        return this;
    }
    /**设置热更监听 */
    setHotUpdateLister(lister: IHotUpdateLister) {
        this._hLister = lister;
    }
    /**检测是否需要更新 */
    async checkUpdate() {
        /**
         * 浏览器下不执行热更
         */
        if (app.func.isBrowser()) {
            if (this._hLister.notUpdate) {
                this._hLister.notUpdate(this);
            }
            return;
        }
        try {
            //资源热更
            if (await this.checkResourcesUpdate()) {
                //更新开始
                if (this._hLister.downloadUpdateConfig) {
                    this._hLister.downloadUpdateConfig(this);
                }
            } else {
                if (this._hLister.notUpdate) {
                    this._hLister.notUpdate(this);
                }
            }
        } catch (error) {
            fw.printError(error);
            if (this._hLister.updateFail) {
                this._hLister.updateFail(this, fw.getErroMessage(error));
            }
        }
    }
    /**执行热更 */
    public hotUpdate() {
        fw.print(`执行更新`);
        //清理回调
        this.clearCallback();
        //设置回调
        this._am.setEventCallback(this.updateCb.bind(this));
        //执行更新
        this._am.update();
    }
    /**本地回调 */
    checkCb(event: HotUpdateProgressParam) {
        let bError = false;
        let bDoUpdate = false;
        switch (event.getEventCode()) {
            case EventCode.ERROR_NO_LOCAL_MANIFEST:
                fw.printError(`本地manifest文件未找到~`);
                bError = true;
                break;
            case EventCode.ERROR_DOWNLOAD_MANIFEST:
                fw.printError(`下载manifest发生错误~`);
                bError = true;
                break;
            case EventCode.ERROR_PARSE_MANIFEST:
                fw.printError(`解析manifest发生错误~`);
                bError = true;
                break;
            case EventCode.ALREADY_UP_TO_DATE:
                fw.print(`已经是最新版本了~`);
                break;
            case EventCode.NEW_VERSION_FOUND:
                this._am.prepareUpdate();
                fw.print(`发现新版本~`);
                fw.print(`需更新的包体大小为: ${Math.ceil(this._am.getTotalBytes() / 1024)}kb`);
                bDoUpdate = this._am.getTotalBytes() > 0;
                break;
            default:
                fw.print(`热更checkCb code : ${event.getEventCode()}`);
                return;
        }
        //清理回调
        this.clearCallback();
        //版本文件处理是否失败
        if (bError) {
            fw.printError(`更新失败：manifest文件处理失败`, event.getMessage());
            if (this._hLister.downloadUpdateConfigFail) {
                this._hLister.downloadUpdateConfigFail(this, event.getMessage());
            }
        } else {
            //执行更新 或者 执行回调
            if (bDoUpdate) {
                if (this._hLister.startUpdate) {
                    this._hLister.startUpdate(this);
                }
            } else {
                if (this._hLister.notUpdate) {
                    this._hLister.notUpdate(this);
                }
            }
        }
    }
    /**热更回调 */
    updateCb(event: HotUpdateProgressParam) {
        let failed = false;
        let successed = false;
        let needRestart = false;
        switch (event.getEventCode()) {
            case EventCode.ERROR_NO_LOCAL_MANIFEST:
                failed = true;
                fw.printError(`本地manifest文件未找到~`);
                break;
            case EventCode.UPDATE_PROGRESSION:
                //print(`byteProgress : ${event.getPercent()}`);
                //print(`fileProgress : ${event.getPercentByFile()}`);
                //print(`${event.getDownloadedFiles()} / ${event.getTotalFiles()}`);
                //print(`${event.getDownloadedBytes()} / ${event.getTotalBytes()}`);
                //事件通知
                this._lastFWDispatchEventParam = {
                    event: event,
                    data: this._hConfigs,
                    eventName: HotUpdateEvent.Progress,
                }
                app.event.dispatchEvent(this._lastFWDispatchEventParam);
                return;
            case EventCode.ERROR_DOWNLOAD_MANIFEST:
                failed = true;
                fw.printError(`下载manifest发生错误~`);
                break;
            case EventCode.ERROR_PARSE_MANIFEST:
                failed = true;
                fw.printError(`解析manifest发生错误~`);
                break;
            case EventCode.ALREADY_UP_TO_DATE:
                successed = true;
                fw.print(`已经是最新版本了~`);
                break;
            case EventCode.UPDATE_FINISHED:
                successed = true;
                fw.print(`更新完成~`);
                // 用来恢复之前的搜索路径
                app.file.resumeSearchPaths();
                needRestart = this._bundleName == `main`;
                //事件通知
                app.event.dispatchEvent({
                    data: this._hConfigs,
                    eventName: HotUpdateEvent.Complete,
                });
                app.scheduleOnce(() => {
                    if (this._hLister.updateSuccess) {
                        this._hLister.updateSuccess(this);
                    }
                });
                break;
            case EventCode.UPDATE_FAILED:
                failed = true;
                fw.printError(`更新失败 : ${event.getMessage()}`);
                if (this._hLister.updateFail) {
                    this._hLister.updateFail(this, "update failed");
                }
                break
            case EventCode.ERROR_UPDATING:
                failed = true;
                fw.printError(`资源更新失败 : ${event.getAssetId()}, ${event.getMessage()}`);
                // //重试
                // this.retry();
                break;
            case EventCode.ERROR_DECOMPRESS:
                failed = true;
                fw.printError(`解压资源失败 : ${event.getMessage()}`);
                break;
            default:
                fw.print(`热更updateCb : ${event.getEventCode()}`);
                return;
        }
    }
    /**强更 */
    checkForceUpdate(): boolean {
        //this._hConfigs.serverVersionConfig
        return false;
    }
    /**apk热更 */
    checkApkUpdate() {
        //this._hConfigs.serverVersionConfig
        return false;
    }
    /**资源热更 */
    async checkResourcesUpdate() {
        let { nLocalVersion, projectManifest } = await this.getLocalVersion();
        if (this.compareVersion(nLocalVersion)) {
            return false;
        }
        let remoteVersion = this._hConfigs.newVersion;
        let url = `${httpConfig.path_creator}${this._bundleName}/${remoteVersion}/project.manifest`;
        app.http.get({
            url: url,
            callback: (bSuccess, response) => {
                if (bSuccess) {
                    //初始化
                    this.initAssetsManager();
                    //加载本地配置，如果版本“小于等于”缓存版本则会使用缓存版本的Manifest文件
                    this._am.loadLocalManifest(projectManifest);
                    //用来恢复之前的搜索路径
                    app.file.resumeSearchPaths();
                    //当前manifest信息
                    let manifest = this._am.getLocalManifest();
                    if (manifest) {
                        fw.print(`manifest info:`);
                        fw.print(`version: ${manifest.getVersion()}`);
                        fw.print(`packageUrl: ${manifest.getPackageUrl()}`);
                        fw.print(`versionFileUrl: ${manifest.getVersionFileUrl()}`);
                        fw.print(`manifestFileUrl: ${manifest.getManifestFileUrl()}`);
                    }
                    //清理回调
                    this.clearCallback();
                    //设置回调
                    this._am.setEventCallback(this.checkCb.bind(this));
                    //替换域名
                    response.packageUrl = `${httpConfig.path_creator}${this._bundleName}/${remoteVersion}/`;
                    response.remoteManifestUrl = `${response.packageUrl}project.manifest`;
                    response.remoteVersionUrl = `${response.packageUrl}version.manifest`;
                    //写入临时文件
                    let str = JSON.stringify(response);
                    let tempFilePath = `${this._storagePath}project.manifest.temp`;
                    app.file.writeStringToFile({
                        finalPath: tempFilePath,
                        fileData: str,
                    });
                    //加载远程版本文件（自己合成）
                    if (!this._am.loadRemoteManifest(new native.Manifest(str, tempFilePath))) {
                        if (this._hLister.downloadUpdateConfigFail) {
                            this._hLister.downloadUpdateConfigFail(this, `parse fail: ${url}`);
                        }
                    }
                }
                else {
                    if (this._hLister.downloadUpdateConfigFail) {
                        this._hLister.downloadUpdateConfigFail(this, `download fail: ${url}`);
                    }
                }
            },
        });
        return true;
    }
    /**获取本地版本号和文件路径 */
    async getLocalVersion() {
        //版本
        let nLocalVersion: string = `0`;
        //projectManifest解析后的json对象
        let versionConfig: VersionManifestConfig | null;
        //加载资源
        let projectManifest = `${this._relativePath}project.manifest`;
        //win32不处理
        if (app.file.notSupport()) {
            nLocalVersion = this._hConfigs.newVersion;
        } else {
            //版本资源配置
            let bundleConfig = this._hConfigs.bundleConfig;
            fw.print(`load ${this._bundleName} ${bundleConfig.res[`project`].path}`);
            if (!app.file.isFileExist(projectManifest)) {
                //没有版本文件初始化一份版本文件
                app.file.writeStringToFile({
                    //绝对路径
                    finalPath: `${this._storagePath}project.manifest`,
                    //文件内容
                    fileData: `{"packageUrl": "", "remoteManifestUrl": "", "remoteVersionUrl": "", "version": "0"}`
                });
            }
            //读取文件内容
            let content = app.file.getStringFromFile({
                //绝对路径
                finalPath: projectManifest
            });
            if (content) {
                //解析
                versionConfig = JSON.safeParse(content);
                if (versionConfig) {
                    nLocalVersion = versionConfig.version;
                }
            }
        }
        return { nLocalVersion, projectManifest, versionConfig };
    }
    /**
     * 对比本地版本
     * @param oldVersion 缓存版本
     */
    compareVersion(oldVersion: string) {
        fw.print(`compareVersion ${this._bundleName}`);
        fw.print(`newVersion: ${this._hConfigs.newVersion}`, app.func.toNumber(this._hConfigs.newVersion));
        fw.print(`oldVersion: ${oldVersion}`, app.func.toNumber(oldVersion));
        //版本相同或者更新则无需更新
        return app.func.toNumber(oldVersion) >= app.func.toNumber(this._hConfigs.newVersion);
    }
    /**
     * 初始化热更新c++插件
     * @returns 
     */
    initAssetsManager() {
        if (this._am) {
            return;
        }
        //用于测试自定义清单的具有空清单url的初始化
        this._am = new native.AssetsManager(``, this._storagePath, (versionA: string, versionB: string) => {
            /**
             * 设置您自己的版本比较处理程序
             * 当versionA为“传入版本”时，versionB为“缓存版本”
             * 当versionA为“缓存版本”时，versionB为“远程版本”
             * C代码的处理：
             *     （1）用“传入版本”还是用“缓存版本”，“versionA” > “versionB”时用“传入版本”
             *     （2）是否需要更新，“versionA” < “versionB”时执行认定需要更新
             */
            let vA = Number(versionA);
            let vB = Number(versionB);
            if (++this.checkCount > 0) {
                fw.print(`传入版本：${vA}`);
                fw.print(`缓存版本：${vB}`);
            } else {
                fw.print(`当前版本：${vA}`);
                fw.print(`远程版本：${vB}`);
            }
            if (vA > vB) {
                return 1;
            } else if (vA == vB) {
                return 0;
            } else {
                return -1;
            }
        });
        //设置验证回调，但是我们还没有md5 check函数，所以只打印一些消息
        //验证通过返回true，否则返回false
        this._am.setVerifyCallback((path: string, asset: native.ManifestAsset) => {
            //测试代码
            if (fw.DEBUG.bCheckMd5) {
                let localMD5 = app.md5.hashArrayBuffer(new Uint8Array(app.file.getDataFromFile(path)), false);
                fw.print(`Verification passed path:${path} remoteMd5: ${asset.md5} localMD5: ${localMD5}`);
                return asset.md5 == localMD5;
            } else {
                return true;
            }
        });
        //android特殊处理
        if (app.func.isAndroid()) {
            //当并发任务太多时，一些Android设备可能会减慢下载过程。
            //数值可能不准确，请多做测试，找出最适合您的游戏。
            //最大并发任务数限制为2
            this._am.setMaxConcurrentTask(10);
        }
    }
    /**清理回调 */
    clearData() {
        //清理零时数据
        this.checkCount = 0;
        this._hConfigs = null;
        this._lastFWDispatchEventParam = null;
        //清理回调
        this.clearCallback();
        //清理am
        if (this._am) {
            delete this._am;
            this._am = null;
        }
    }
    /**清理回调 */
    clearCallback() {
        this._am?.setEventCallback(() => { });
    }
    /**重试 */
    retry() {
        this._am?.downloadFailedAssets();
    }
    /**清理缓存 */
    deleteCache() {
        fw.print(`delete : ${this._storagePath}`);
        if (app.file.removeDirectory(this._storagePath)) {
            fw.print(`successed`);
        } else {
            fw.print(`failed`);
        }
    }
    /**销毁 */
    destroy() {
        this.clearData();
    }
}

export class _UpdateGame extends (fw.FWComponent) {
    startUpdate(needUpdateHotUpdateManagerQueue: _FWHotUpdateManager[]) {
        return app.func.doPromise((resolve) => {
            resolve(1);
        });
    }
}

/**
 * 类型声明调整
 */
declare global {
    namespace globalThis {
        /**热更配置 */
        type HotUpdateConfigs = {
            /**远程版本号 */
            newVersion: string
            /**prject.manifest文件所在bundle */
            bundleConfig: BundleConfigType
            /**大厅服务器热更参数 */
            serverVersionConfig?: ServerVersionConfig
            /**更新回调监听 */
            lister: IHotUpdateLister
            /**更新完成回调 */
            callback?: (config: HotUpdateConfigs) => void
            /**开始更新回调 */
            startCallback?: (config: HotUpdateConfigs) => void
        }
        /**服务器version文件配置 */
        type ServerVersionConfig = {
            /**版本号 */
            newFlist: string
            /**? */
            protect: string
            /**? */
            downUrl: string
            /**? */
            protectUrl: string
        }
        /**version文件配置 */
        type VersionManifestConfig = {
            /**包体文件下载路径 */
            packageUrl: string
            /**project文件下载路径 */
            remoteManifestUrl: string
            /**version文件下载路径 */
            remoteVersionUrl: string
            /**当前版本version */
            version: string
            /**资源列表 */
            assets: { size: number, md5: string, compressed?: boolean, extension?: string }[]
        }
        /**更新过程事件数据结构 */
        type HotUpdateProgressParam = {
            /**事件名称 */
            getEventCode: () => EventCode
            /**获取当前下载管理器 */
            getAssetsManagerEx: () => number
            /**获取信息 */
            getMessage: () => string
            /**获取当前字节进度 => getDownloadedBytes / getTotalBytes */
            getPercent: () => number
            /**获取文件文件进度 => getDownloadedFiles / getTotalFiles */
            getPercentByFile: () => number
            /**获取当前下载总字节数 */
            getDownloadedBytes: () => number
            /**获取总共所需下载总字节数 */
            getTotalBytes: () => number
            /**获取当前下载总文件数 */
            getDownloadedFiles: () => number
            /**获取总共所需下载总文件数 */
            getTotalFiles: () => number
            /**是否处于工作状态 */
            isResuming: () => boolean
            /**获取AssetId */
            getAssetId: () => number
            /**获取CURLECode */
            getCURLECode: () => number
            /**获取CURLMCode */
            getCURLMCode: () => number
        }
    }
}

declare global {
    namespace globalThis {
        interface _fw {
            HotUpdateEvent: typeof HotUpdateEvent
            FWHotUpdateManager: typeof _FWHotUpdateManager
        }
    }
}
fw.HotUpdateEvent = HotUpdateEvent;
fw.FWHotUpdateManager = _FWHotUpdateManager;
