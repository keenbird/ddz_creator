import { _decorator, Node as ccNode, Sprite, SpriteFrame, native, Vec3, Size, RenderTexture, UITransform, Canvas, Material } from 'cc';
import { EDITOR } from 'cc/env';
const { ccclass } = _decorator;

import CryptoES from 'crypto-es';
import { httpConfig } from '../../config/HttpConfig';
import { DOWN_IMAGE_TYPE, FileEncryptKey } from '../../config/ConstantConfig';

/**下载的资源位置（所有的下载都必须使用这里面定义的路径） */
enum FileDir {
    /**读写路径 */
    Root = ``,
    /**头像 */
    Head = `down/head/`,
    /**活动图 */
    Advert = `down/advert/`,
    /**普通网络图 */
    Image = `down/img/`,
    /**道具图） */
    Prop = `down/prop/`,
    /**配置 */
    Config = `down/config/`,
    /**拷贝的文件 */
    Copy = `copy/`,
    /**零时文件 */
    Temp = `temp/`,
    /**强更 */
    Apk = `apk/`,
    /**热更 */
    Hotupdate = `HotUpdate/`,
}

@ccclass('FWFileManager')
export class FWFileManager extends (fw.FWComponent) {
    /**fileutils--began------------------------------------------------------------------------------- */
    /**可写目录 */
    private _writablePath: string
    /**子包文件信息 */
    private _bundleExitInfo: { [bundleName: string]: false | { [path: string]: boolean } } = {}
    /**文件搜索路径优先级 */
    private _searchPaths: string[] = native.fileUtils?.getSearchPaths();
    /**大厅版本号 */
    plazeVersion = 0;
    /**读取文件格式（web） */
    READ_FILE_TYPE = READ_FILE_TYPE
    /**下载的资源位置（所有的下载都必须使用这里面定义的路径） */
    FileDir = FileDir
    /**获取大厅版本号 */
    notSupport() {
        let bNotSupport = !app.func.isNative();
        if (bNotSupport) {
            if (!(<any>this).__print_notSupport) {
                (<any>this).__print_notSupport = true;
                fw.printWarn(`fileManager: not native platform.`);
            }
        }
        return bNotSupport;
    }
    /**获取大厅版本号 */
    getPlazaVersion() {
        return this.plazeVersion;
    }
    /**设置大厅版本号 */
    setPlazaVersion(ver: number | string) {
        this.plazeVersion = Number(ver);
    }
    /**获取文件路径 */
    getFileDir(downloadPath: FileDir) {
        return `${this.getWritablePath()}${downloadPath}`;
    }
    /**获取热更目录 */
    getHotUpdatePath(): string {
        return this.getFileDir(this.FileDir.Hotupdate);
    }
    /**获取热更缓存路径 */
    getAllHotUpdatePath(): string[] {
        return [
            this.getHotUpdatePath() + `main/`,
        ];
    }
    /**设置热更缓存路径 */
    setAllHotUpdatePath(): void {
        //将热更路径表添加到最前面
        this.addSearchPaths(this.getAllHotUpdatePath());
    }
    /**清理热更缓存路径 */
    clearAllHotUpdatePath(): void {
        if (app.file.notSupport()) {
            return;
        }
        this.getAllHotUpdatePath().forEach(element => {
            if (native.fileUtils.removeDirectory(element)) {
                fw.print(`FWFileManager clearAllHotUpdatePath successed ${element}`);
            } else {
                fw.print(`FWFileManager clearAllHotUpdatePath failed ${element}`);
            }
        });
    }
    /**清理路径缓存 */
    purgeCachedEntries() {
        if (app.file.notSupport()) {
            return;
        }
        native.fileUtils.purgeCachedEntries();
    }
    /**相对路径或者绝对路径 */
    isFileExist(filePath: string): boolean {
        if (app.file.notSupport()) {
            return false;
        }
        return native.fileUtils.isFileExist(filePath);
    }
    /**获取可写路径（以 / 结尾） */
    getWritablePath(): string {
        if (app.file.notSupport()) {
            return `/`;
        }
        if (!this._writablePath) {
            this._writablePath = native.fileUtils.getWritablePath();
        }
        return this._writablePath;
    }
    /**获取玩家读写文件夹名 */
    getUserDir(nUserID?: number | string): string {
        return `User` + (nUserID ?? center.login.getLoginEndUserDBID());
    }
    /**获取玩家读写路径 */
    getUserWritablePath(nUserID?: number | string): string {
        return this.getWritablePath() + this.getUserDir(nUserID) + `/`;
    }
    /**获取路径 */
    getFilePathDir(data: {
        /**文件路径 */
        filePath: string
    }): string {
        return data.filePath.replace(data.filePath.match(/[^\\/]+\.?[^.\\/]+$/)[0], ``);
    }
    /**获取“文件名.扩展名” */
    getFullFileName(data: {
        /**文件路径 */
        filePath: string
    }): string {
        let fullFileName = data.filePath.match(/[^\\/]+\.[^.\\/]+$/);
        return (fullFileName && fullFileName.length > 0) ? fullFileName[0] : ``;
    }
    /**获取“.扩展名” */
    getFileExtensionName(data: {
        /**文件路径 */
        filePath: string
    }): string {
        let fullFileName = this.getFullFileName(data);
        let fileExtensionName = fullFileName.match(/\.[^.\\/]+$/);
        return (fileExtensionName && fileExtensionName.length > 0) ? fileExtensionName[0] : ``;
    }
    /**获取“文件名” */
    getFileName(data: {
        /**文件路径 */
        filePath: string
    }): string {
        return this.getFullFileName(data).replace(this.getFileExtensionName(data), ``);
    }
    /**获取String用户数据 */
    getStringFromUserFile(data: {
        /**文件路径 */
        filePath?: string
        /**文件最终路径 */
        finalPath?: string
        /**玩家userId */
        nUserID?: number | string
    }): string {
        if (!data.filePath && !data.finalPath) {
            fw.print(`getStringFromUserFile error : `, data);
            return;
        }
        //获取用户读写路径
        if (!data.finalPath) {
            data.finalPath = this.getUserWritablePath(data.nUserID) + data.filePath;
        }
        return this.getStringFromFile(data);
    }
    /**获取String通用数据 */
    getStringFromFile(data: {
        /**文件路径 */
        filePath?: string
        /**文件最终路径 */
        finalPath?: string
        /**默认返回字符串 */
        default?: string
        bEncrypt?: boolean
    }): string {
        //filePath为WritablePath下的相对路径，finalPath为全路径
        if (!data.filePath && !data.finalPath) {
            fw.print(`getStringFromFile error : `, data);
            return data.default ?? ``;
        }
        let path = data.finalPath ?? (this.getWritablePath() + data.filePath);
        let ret = ""
        if (app.file.notSupport()) {
            ret = app.file.getStringForKey("file:" + path, data.default ?? ``, { all: true });
        } else {
            if (!app.file.isFileExist(path) && app.file.isDirectoryExist(path)) {
                ret = data.default ?? ``;
            } else {
                ret = native.fileUtils.getStringFromFile(path);
            }
        }

        if (data.bEncrypt) {
            ret = CryptoES.AES.decrypt(ret, FileEncryptKey).toString(CryptoES.enc.Utf8);
        }

        return ret
    }
    /**写文件 */
    writeDataToFile(data: {
        /**数据为ArrayBuffer时，默认以Int8Array格式写入文件 */
        fileData: IntArray | ArrayBuffer
        /**文件路径 */
        filePath?: string
        /**文件最终路径 */
        finalPath?: string
    }): boolean {
        if (app.file.notSupport()) {
            return false;
        }
        if ((!data.fileData || data.fileData.byteLength == 0) || (!data.filePath && !data.finalPath)) {
            fw.print(`writeDataToFile error : `, data);
            return;
        }
        let finalPath = data.finalPath ?? (this.getWritablePath() + data.filePath);
        let fileDir = this.getFilePathDir({ filePath: finalPath });
        if (!native.fileUtils.isDirectoryExist(fileDir)) {
            if (!native.fileUtils.createDirectory(fileDir)) {
                fw.print(`writeDataToFile error createDirectory fileDir : `, fileDir);
                fw.print(`writeDataToFile error createDirectory finalPath : `, finalPath);
                return false;
            }
        }
        if (data.fileData instanceof ArrayBuffer) {
            return native.fileUtils.writeDataToFile(new Int8Array(data.fileData), finalPath);
        } else {
            return native.fileUtils.writeDataToFile(data.fileData, finalPath);
        }
    }
    /**写文件 */
    writeStringToFile(data: {
        /**内容 */
        fileData: string
        /**文件路径 */
        filePath?: string
        /**文件最终路径 */
        finalPath?: string
        bEncrypt?: boolean
    }): boolean {
        if (!data.filePath && !data.finalPath) {
            fw.print(`writeStringToFile error : `, data);
            return;
        }
        let finalPath = data.finalPath ?? (this.getWritablePath() + data.filePath);
        let fileData = data.fileData;
        if (data.bEncrypt) {
            fileData = CryptoES.AES.encrypt(fileData, FileEncryptKey).toString();
        }
        if (app.file.notSupport()) {
            app.file.setStringForKey("file:" + finalPath, fileData, { all: true });
            return true;
        }
        let fileDir = this.getFilePathDir({ filePath: finalPath });
        if (!native.fileUtils.isDirectoryExist(fileDir)) {
            if (!native.fileUtils.createDirectory(fileDir)) {
                fw.print(`writeStringToFile error createDirectory fileDir : `, fileDir);
                fw.print(`writeStringToFile error createDirectory finalPath : `, finalPath);
                return false;
            }
        }
        return native.fileUtils.writeStringToFile(fileData, finalPath);
    }
    /**写入String用户数据 */
    writeStringToUserFile(data: {
        /**内容 */
        fileData: string
        /**文件路径 */
        filePath?: string
        /**文件最终路径 */
        finalPath?: string
        /**玩家userId */
        nUserID?: number
    }): boolean {
        if (!data.filePath && !data.finalPath) {
            fw.print(`writeStringToUserFile error : `, data);
            return false;
        }
        //获取用户读写路径
        if (!data.finalPath) {
            data.finalPath = this.getUserWritablePath(data.nUserID) + data.filePath;
        }
        return this.writeStringToFile(data);
    }
    /**解压文件 */
    unzipFile(data: {
        /**zip文件完整路径 */
        inFilePath: string
        /**解压后文件存放路径 */
        outFilePath?: string
        /**是否不删除zip文件 */
        bNotRemoveZip?: boolean
        /**执行回调 */
        callback?: (bUnzipState: boolean, data: any) => void
    }): void {
        if (app.file.notSupport()) {
            return;
        }
        if (!app.file.isFileExist(data.inFilePath) && app.file.isDirectoryExist(data.inFilePath)) {
            fw.print(`unzipFile error : `, data);
            return;
        }
        //解压文件，outFilePath是输出的文件夹路径
        if (!data.outFilePath) {
            data.outFilePath = data.inFilePath.replace(/[^\\/]*$/, ``);
        }
        let bUnzipState = app.file.doUncompress(data.inFilePath, data.outFilePath);
        //解压后自动删除
        if (!data.bNotRemoveZip) {
            app.file.removeFile(data.inFilePath);
        }
        //执行回调
        if (data.callback) {
            data.callback(bUnzipState, data);
        }
        //提示
        if (bUnzipState) {
            fw.print(`文件解压成功 : `, data);
        } else {
            fw.print(`文件解压失败 : `, data);
        }
    }
    /**刷新搜索路径（去重处理） */
    refreshSearchPaths(searchPaths?: string[]): void {
        if (app.file.notSupport()) {
            return;
        }
        if (!EDITOR) {
            searchPaths = searchPaths || app.file.getSearchPaths();
            //统一斜杆
            for (let index = 0; index < searchPaths.length; index++) {
                searchPaths[index] = searchPaths[index].replace(/[\\/]+/g, `/`);
            }
            //去重
            searchPaths = Array.from(new Set(searchPaths));
            //重新调整搜索路径
            app.file.setSearchPaths(searchPaths);
            this._searchPaths = searchPaths;
            //打印
            fw.print(`HotUpdateSearchPaths :`, searchPaths);
            //缓存热更搜索路径
            localStorage.setItem(`HotUpdateSearchPaths`, JSON.stringify(searchPaths));
        }
    }
    /**添加（往前添加） */
    addSearchPaths(newSearchPaths: string[]): string[] {
        let searchPaths = [];
        if (app.file.notSupport()) {
            return searchPaths;
        }
        if (!EDITOR) {
            //获取当前搜索路径表
            searchPaths = app.file.getSearchPaths();
            fw.print(`addSearthPaths :`, newSearchPaths);
            //打印old
            fw.print(`HotUpdateSearchPaths old:`, searchPaths);
            //将热更路径表添加到最前面
            Array.prototype.unshift.apply(searchPaths, newSearchPaths);
            //重新调整搜索路径
            this.refreshSearchPaths(searchPaths);
        }
        return searchPaths;
    }
    /** 恢复搜索路径优先级 */
    resumeSearchPaths() {
        this.refreshSearchPaths(this._searchPaths);
    }

    /**获取当前版本 */
    getLocalVersion(callback: (version: string) => void) {
        this.loadBundleRes(fw.BundleConfig.resources.res[`version`],(res) => {
            let oldVersionConfig: VersionManifestConfig = null
            if (app.func.isBrowser()) {
                //解析
                oldVersionConfig = JSON.safeParse(res._file);
            } else {
                //读取文件内容
                let content = app.file.getStringFromFile({
                    //绝对路径
                    finalPath: res.nativeUrl,
                });
                if (content) {
                    //解析
                    oldVersionConfig = JSON.safeParse(content);
                }
            }
            if (oldVersionConfig) {
                //通知
                callback(oldVersionConfig.version);
            } else {
                callback(``);
            }
        });
    }
    /**检测子包资源是否存在（浏览器检测需要优先加载子包，否则为异步，则需要回调处理） */
    isBundleResExist(bundleResConfig: BundleResConfig, callback?: (bExist: boolean) => void): boolean {
        //处理函数
        let result = (bExist: boolean) => {
            // 该日志打印有点多，测试的时候在开启，不测试就关闭
            // !bExist && fw.print(`${bundleResConfig.bundleName} not exist ${bundleResConfig.path}`);
            callback?.(bExist);
            return bExist;
        };
        //子包已经加载
        let bundle = app.assetManager.loadBundleSync(bundleResConfig);
        if (bundle) {
            return result(!!bundle.getInfoWithPath(bundleResConfig.path));
        }
        //子包是否存在
        let bundleFileInfo = this._bundleExitInfo[bundleResConfig.bundleName];
        if (bundleFileInfo == false) {
            return result(false);
        }
        //子包未加载
        if (app.file.notSupport()) {
            //是否异步回调检测
            if (callback) {
                app.assetManager.loadBundle(bundleResConfig,() => {
                    callback(app.file.isBundleResExist(bundleResConfig));
                },{
                    failCallback:() => {
                        callback(false);
                    }
                });
            }
        } else {
            if (fw.isNull(bundleFileInfo)) {
                let bundleJsonPath = `assets/${bundleResConfig.bundleName}/cc.config.json`;
                let fileData = app.file.getStringFromFile(bundleJsonPath);
                if (fileData) {
                    bundleFileInfo = {};
                    let bundleJson = JSON.safeParse(fileData);
                    if (bundleJson) {
                        app.func.traversalObject(bundleJson.paths, (element: any) => {
                            bundleFileInfo[element[0]] = true;
                        });
                        this._bundleExitInfo[bundleResConfig.bundleName] = bundleFileInfo;
                        return result(bundleFileInfo[bundleResConfig.path]);
                    }
                }
                this._bundleExitInfo[bundleResConfig.bundleName] = false;
                return result(false);
            } else {
                return result(bundleFileInfo[bundleResConfig.path]);
            }
        }
        //这里不需要调用result
        return false;
    }
    /**改变子包对应文件的文件名（测试功能，暂时没用） */
    changeBundleFileName(data: any) {
        let bundleJsonPathOld = `assets/${data.bundleResConfig.bundleName}/index.js`;
        let bundleJsonPathNew = `HotUpdate/main/assets/${data.bundleResConfig.bundleName}/index.${data.version}.js`;
        let fileData = app.file.getStringFromFile({ filePath: bundleJsonPathOld });
        this.writeStringToFile({
            fileData: fileData,
            filePath: bundleJsonPathNew
        });
    }
    /**截屏 */
    screenshot(data: ScreenshotParam): RenderTexture | null {
        let camera = app.getComponent(Canvas).cameraComponent;
        if (camera.targetTexture) {
            fw.printWarn(`screenshot Error camera targetTexture is not null`);
            return;
        }
        //获取节点位置大小
        if (fw.isValid(data.node)) {
            let uiTransform = data.node.getComponent(UITransform);
            let size = uiTransform.contentSize.clone();
            let wPos = data.node.worldPosition;
            let scale = data.node.scale;
            size.height *= scale.y;
            size.width *= scale.x;
            //是否调整尺寸
            data.size ??= size;
            //是否调整位置
            data.pos ??= fw.v3(wPos.x - size.width * uiTransform.anchorX, wPos.y - size.height * uiTransform.anchorY).clone();
        }
        const renderTex = new RenderTexture();
        renderTex.reset(Object.assign({}, app.winSize));
        camera.targetTexture = renderTex;
        this.scheduleOnce(() => {
            //截图后默认倒置的图片回正
            let pos = data.pos ?? fw.v3();
            const s = data.size ?? app.winSize;
            let pixels_original = renderTex.readPixels(pos.x, pos.y, s.width, s.height);
            let pixels_new = new Uint8Array(s.width * s.height * 4);
            let rowBytes = s.width * 4;
            for (let row = 0; row < s.height; ++row) {
                let srow = s.height - 1 - row;
                let start = Math.floor(srow * s.width * 4);
                let reStart = row * s.width * 4;
                for (let i = 0; i < rowBytes; ++i) {
                    pixels_new[reStart + i] = pixels_original[start + i];
                }
            }
            data.outSize ??= s;
            if (native.saveImageData) {
                if (app.file.notSupport()) {
                    return;
                }
                //路径校验
                let filePath = data.finalPath ?? `${app.file.getFileDir(app.file.FileDir.Temp)}${data.filePath ?? `screenshot/tempScreenshot.png`}`;
                //删除旧文件
                if (app.file.isFileExist(filePath)) {
                    app.file.removeFile(filePath);
                }
                //是否需要创建文件夹
                let fileDir = app.file.getFilePathDir({ filePath: filePath });
                if (!app.file.isDirectoryExist(fileDir)) {
                    app.file.createDirectory(fileDir);
                }
                //缓存图片
                native.saveImageData(pixels_new, data.outSize.width, data.outSize.height, filePath).then(() => {
                    //截图完成
                    app.popup.showToast(fw.language.get("Screenshot complete"));
                    //回调
                    data.outFilePath = filePath;
                    data.callback && data.callback(data, pixels_new);
                });
            } else {
                //回调
                data.callback && data.callback(data, pixels_new);
            }
            camera.targetTexture = null;
            //释放内存
            renderTex.destroy();
        }, 0);
        return renderTex;
    }
    /**存储图片数据 */
    saveImageData(data: Uint8Array, width: number, height: number, savefilePath: string, callback?: Function) {
        if (native.saveImageData) {
            if (app.file.notSupport()) {
                return;
            }
            //路径校验
            let filePath = `${app.file.getFileDir(app.file.FileDir.Temp)}${savefilePath}`;
            //删除旧文件
            if (app.file.isFileExist(filePath)) {
                app.file.removeFile(filePath);
            }
            //是否需要创建文件夹
            let fileDir = app.file.getFilePathDir({ filePath: filePath });
            if (!app.file.isDirectoryExist(fileDir)) {
                app.file.createDirectory(fileDir);
            }
            //缓存图片
            native.saveImageData(data, width, height, filePath).then(() => {
                //回调
                callback?.()
            });
        } else {
            //回调
            callback?.()
        }
    }
    /**获取头像服务器文件夹名称 */
    getServerImageDir(serverPicID: number | string) {
        if (!(<any>this)._initServerImageDir) {
            (<any>this)._initServerImageDir = true;
            var table = '00000000 77073096 EE0E612C 990951BA 076DC419 706AF48F E963A535 9E6495A3 0EDB8832 79DCB8A4 E0D5E91E 97D2D988 09B64C2B 7EB17CBD E7B82D07 90BF1D91 1DB71064 6AB020F2 F3B97148 84BE41DE 1ADAD47D 6DDDE4EB F4D4B551 83D385C7 136C9856 646BA8C0 FD62F97A 8A65C9EC 14015C4F 63066CD9 FA0F3D63 8D080DF5 3B6E20C8 4C69105E D56041E4 A2677172 3C03E4D1 4B04D447 D20D85FD A50AB56B 35B5A8FA 42B2986C DBBBC9D6 ACBCF940 32D86CE3 45DF5C75 DCD60DCF ABD13D59 26D930AC 51DE003A C8D75180 BFD06116 21B4F4B5 56B3C423 CFBA9599 B8BDA50F 2802B89E 5F058808 C60CD9B2 B10BE924 2F6F7C87 58684C11 C1611DAB B6662D3D 76DC4190 01DB7106 98D220BC EFD5102A 71B18589 06B6B51F 9FBFE4A5 E8B8D433 7807C9A2 0F00F934 9609A88E E10E9818 7F6A0DBB 086D3D2D 91646C97 E6635C01 6B6B51F4 1C6C6162 856530D8 F262004E 6C0695ED 1B01A57B 8208F4C1 F50FC457 65B0D9C6 12B7E950 8BBEB8EA FCB9887C 62DD1DDF 15DA2D49 8CD37CF3 FBD44C65 4DB26158 3AB551CE A3BC0074 D4BB30E2 4ADFA541 3DD895D7 A4D1C46D D3D6F4FB 4369E96A 346ED9FC AD678846 DA60B8D0 44042D73 33031DE5 AA0A4C5F DD0D7CC9 5005713C 270241AA BE0B1010 C90C2086 5768B525 206F85B3 B966D409 CE61E49F 5EDEF90E 29D9C998 B0D09822 C7D7A8B4 59B33D17 2EB40D81 B7BD5C3B C0BA6CAD EDB88320 9ABFB3B6 03B6E20C 74B1D29A EAD54739 9DD277AF 04DB2615 73DC1683 E3630B12 94643B84 0D6D6A3E 7A6A5AA8 E40ECF0B 9309FF9D 0A00AE27 7D079EB1 F00F9344 8708A3D2 1E01F268 6906C2FE F762575D 806567CB 196C3671 6E6B06E7 FED41B76 89D32BE0 10DA7A5A 67DD4ACC F9B9DF6F 8EBEEFF9 17B7BE43 60B08ED5 D6D6A3E8 A1D1937E 38D8C2C4 4FDFF252 D1BB67F1 A6BC5767 3FB506DD 48B2364B D80D2BDA AF0A1B4C 36034AF6 41047A60 DF60EFC3 A867DF55 316E8EEF 4669BE79 CB61B38C BC66831A 256FD2A0 5268E236 CC0C7795 BB0B4703 220216B9 5505262F C5BA3BBE B2BD0B28 2BB45A92 5CB36A04 C2D7FFA7 B5D0CF31 2CD99E8B 5BDEAE1D 9B64C2B0 EC63F226 756AA39C 026D930A 9C0906A9 EB0E363F 72076785 05005713 95BF4A82 E2B87A14 7BB12BAE 0CB61B38 92D28E9B E5D5BE0D 7CDCEFB7 0BDBDF21 86D3D2D4 F1D4E242 68DDB3F8 1FDA836E 81BE16CD F6B9265B 6FB077E1 18B74777 88085AE6 FF0F6A70 66063BCA 11010B5C 8F659EFF F862AE69 616BFFD3 166CCF45 A00AE278 D70DD2EE 4E048354 3903B3C2 A7672661 D06016F7 4969474D 3E6E77DB AED16A4A D9D65ADC 40DF0B66 37D83BF0 A9BCAE53 DEBB9EC5 47B2CF7F 30B5FFE9 BDBDF21C CABAC28A 53B39330 24B4A3A6 BAD03605 CDD70693 54DE5729 23D967BF B3667A2E C4614AB8 5D681B02 2A6F2B94 B40BBE37 C30C8EA1 5A05DF1B 2D02EF8D';
            let crc32 = function (str: string, crc: number) {
                crc ??= 0;
                var n = 0, p = 0;
                crc = crc ^ (-1);
                for (var i = 0, iTop = str.length; i < iTop; i++) {
                    n = (crc ^ str.charCodeAt(i)) & 0xFF;
                    p = n * 9;
                    crc = (crc >>> 8) ^ Number(`0x` + table.slice(p, p + 8));
                }
                return crc ^ (-1);
            };
            (<any>this)._getServerImageDir = (str: string) => {
                let value = crc32(str, 0);
                if (value < 0) {
                    //转无符号
                    value >>>= 0;
                }
                return value;
            };
        }
        return `${Math.abs((<any>this)._getServerImageDir(serverPicID) % 10000)}`;
    }
    /**保存文件到本地（用于浏览器保存到电脑） */
    saveForWebBrowser(data: any, FileName: string) {
        let jsonString = JSON.stringify(data);
        let textFileAsBlob = new Blob([jsonString]);
        let downloadLink = document.createElement(`a`);
        downloadLink.download = FileName;
        downloadLink.innerHTML = `Download File`;
        if (window.URL != null) {
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.onclick = () => {
                document.body.removeChild(downloadLink);
            };
            downloadLink.style.display = `none`;
            document.body.appendChild(downloadLink);
        }
        downloadLink.click();
    }
    /**更新精灵 */
    updateImage(data: FWUpdateSpriteParam) {
        this.updateTexture(Object.assign(data, { type: DOWN_IMAGE_TYPE.Image }));
    }
    /**更新头像 */
    updateHead(data: FWUpdateSpriteParam) {
        this.updateTexture(Object.assign(data, { type: DOWN_IMAGE_TYPE.Head }));
    }
    /**更新网络图片 */
    updateUrlImage(data: FWUpdateSpriteParam) {
        this.updateTexture(Object.assign(data, { type: DOWN_IMAGE_TYPE.UrlImage }));
    }
    /**更换图片 */
    updateTexture(data: FWUpdateSpriteParam) {
        //节点失效
        if (!fw.isValid(data.node) || !data.node.getComponent(Sprite)) {
            return;
        }
        //调整Sprite属性
        let sprite = data.node.obtainComponent(Sprite);
        //刷新标识（用于加载后鉴别数据是否更变）
        let tex = data.serverPicID ?? (data.bundleResConfig && data.bundleResConfig.all);
        if (sprite.__tex == tex) {
            return;
        }
        sprite.__tex = tex;
        //调整参数
        let type = data.type || DOWN_IMAGE_TYPE.Head;
        //serverPicID可能是userID
        if (typeof (data.serverPicID) == `number`) {
            if (type == DOWN_IMAGE_TYPE.Head) {
                data.bundleResConfig = fw.BundleConfig.resources.res[`ui/head/img/atlas/LM_touxiang_${data.serverPicID % 30 + 1}/spriteFrame`];
            } else {
                data.serverPicID = `${data.serverPicID}`;
            }
        }
        //保存位置
        let savePath: string;
        //下载路径
        let serverPath: string = ``;
        switch (type) {
            case DOWN_IMAGE_TYPE.Image:
                serverPath = httpConfig.path_dynamic;
                savePath = `${this.getWritablePath()}${this.FileDir.Image}`;
                break;
            case DOWN_IMAGE_TYPE.Dynamic:
                serverPath = httpConfig.path_dynamic;
                savePath = `${this.getWritablePath()}${this.FileDir.Image}`;
                break;
            case DOWN_IMAGE_TYPE.Activity:
                serverPath = httpConfig.path_activity;
                savePath = `${this.getWritablePath()}${this.FileDir.Advert}`;
                break;
            case DOWN_IMAGE_TYPE.Advert:
                serverPath = httpConfig.path_pay;
                savePath = `${this.getWritablePath()}${this.FileDir.Advert}`;
                break;
            case DOWN_IMAGE_TYPE.UrlImage:
                savePath = `${this.getWritablePath()}${this.FileDir.Image}`;
                break;
            case DOWN_IMAGE_TYPE.Head:
                //头像自动显隐
                fw.isNull(data.bAutoShowHide) && (data.bAutoShowHide = true);
                if (sprite) {
                    //使用当前尺寸
                    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
                    this.loadBundleRes(fw.BundleConfig.resources.res[`shader/head/head-sprite-material-rect`], Material, (res) => {
                        sprite.customMaterial ??= res;
                    });
                    // //添加遮罩
                    // app.func.addMask({
                    //     node: data.node,
                    //     bundleResMaskConfig: data.bundleResMaskConfig,
                    // });
                }
                serverPath = httpConfig.path_face;
                savePath = `${this.getWritablePath()}${this.FileDir.Head}`;
                break;
            default:
                serverPath = httpConfig.path_face;
                fw.printError("updateTexture unknow type");
                savePath = `${this.getWritablePath()}${this.FileDir.Image}`;
                break;
        }
        //先隐藏
        data.bAutoShowHide && (data.node.visible = false);
        //是否是子包资源
        if (data.bundleResConfig) {
            //是否自动添加/spriteFrame结尾
            let assetInfo = app.assetManager.getAssetInfoByPath(data.bundleResConfig);
            if (assetInfo && assetInfo.ctor != SpriteFrame) {
                data.bundleResConfig.path += `/spriteFrame`;
                data.bundleResConfig.all += `/spriteFrame`;
            }
            data.node.loadBundleRes(data.bundleResConfig,(res: SpriteFrame) => {
                //数据已经更换，不处理
                if (data.node.obtainComponent(Sprite).__tex != tex) {
                    return;
                }
                //后显示
                data.bAutoShowHide && (data.node.visible = true);
                //调整显示
                if (!data.checkCallback || data.checkCallback(data)) {
                    data.node.obtainComponent(Sprite).spriteFrame = res;
                }
                //回调
                data.callback?.();
            });
        } else {
            //图片名称
            let picName = (`${data.serverPicID}`).match(/[\w\.]*$/)[0];
            //文件绝对路径
            let finalPath = data.finalPath ?? `${savePath}${picName}`;
            //缓存下载回调
            let url: string;
            serverPath = `${serverPath}${serverPath.endsWith(`/`) ? `` : `/`}`;
            if (type == DOWN_IMAGE_TYPE.Head) {
                url = `${serverPath}${this.getServerImageDir(data.serverPicID)}/${data.serverPicID}`;
            } else if (type == DOWN_IMAGE_TYPE.UrlImage) {
                url = `${data.serverPicID}`;
            } else {
                url = `${serverPath}${data.serverPicID}`;
            }
            //“下载文件”还是“加载缓存文件”
            app.downloader.downloadFile({
                url: url,
                bImage: true,
                finalPath: finalPath,
                onComplete: (err, res: SpriteFrame) => {
                    //数据已经更换，不处理
                    if (!fw.isValid(data.node) || data.node.obtainComponent(Sprite).__tex != tex) {
                        return;
                    }
                    //后显示
                    data.bAutoShowHide && (data.node.visible = true);
                    if (res) {
                        //调整显示
                        if (!data.checkCallback || data.checkCallback(data)) {
                            data.node.getComponent(Sprite).spriteFrame = res;
                        }
                        //回调
                        data.callback && data.callback(finalPath);
                    } else {
                        //执行失败回调
                        if (data.failCallback) {
                            data.failCallback();
                        } else {
                            switch (type) {
                                case DOWN_IMAGE_TYPE.Head:
                                    //使用默认头像
                                    data.serverPicID = app.func.toNumber(data.nUserID ?? 1);
                                    app.file.updateTexture(data);
                                default:
                                    break;
                            }
                        }
                    }
                }
            });
        }
    }
    /**仅浏览器可用 */
    openSelectFile(data: FWOpenSelectFileParam) {
        let s = document.createElement(`input`) as HTMLInputElement;
        s.id = `_file_input_`;
        s.type = `file`;
        s.onchange = (evt: any) => {
            const fileList = evt.target.files;
            let file = fileList[0];
            if (!file) {
                fw.printWarn(`No file selected`);
                return;
            }
            let reader: FileReader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                data.callback && data.callback(e.target.result, file);
            };
            switch (data.type) {
                case READ_FILE_TYPE.Data_Url:
                    reader.readAsDataURL(file);
                    break;
                case READ_FILE_TYPE.BinaryString:
                    reader.readAsBinaryString(file);
                    break;
                case READ_FILE_TYPE.ArrayBuffer:
                    reader.readAsArrayBuffer(file);
                    break;
                case READ_FILE_TYPE.Text:
                default:
                    //作为字符串读出
                    //reader.readAsText(file,`gb2312`);
                    //默认是用utf-8格式输出的，想指定输出格式就再添加一个参数，像txt的ANSI格式只能用国标才能显示出来
                    reader.readAsText(file);
                    break;
            }
            //清理结果，避免下次重复选择时不响应
            s.value = ``;
        };
        s.click();
    }
    /**fileutils--end------------------------------------------------------------------------------- */

    /**userdefault--began------------------------------------------------------------------------------- */
    /**Integer（注意：默认会将name绑定userId，扩展参数data中传入all将不绑定userId） */
    setIntegerForKey(_name: string, _value: number, _data?: FWLocalStorageExParam) {
        localStorage.setItem(this.dealParam(_name, _data), _value.toString());
    }
    /**Integer（注意：默认会将name绑定userId，扩展参数data中传入all将不绑定userId） */
    getIntegerForKey(_name: string, _default: number, _data?: FWLocalStorageExParam): number {
        let result = localStorage.getItem(this.dealParam(_name, _data));
        return Number((fw.isNull(result) || result == `NaN`) ? _default : result);
    }
    /**Float（注意：默认会将name绑定userId，扩展参数data中传入all将不绑定userId） */
    setFloatForKey(_name: string, _value: number, _data?: FWLocalStorageExParam) {
        this.setIntegerForKey(_name, _value, _data);
    }
    /**Float（注意：默认会将name绑定userId，扩展参数data中传入all将不绑定userId） */
    getFloatForKey(_name: string, _default: number, _data?: FWLocalStorageExParam): number {
        return this.getIntegerForKey(_name, _default, _data);
    }
    /**Double（注意：默认会将name绑定userId，扩展参数data中传入all将不绑定userId） */
    setDoubleForKey(_name: string, _value: number, _data?: FWLocalStorageExParam) {
        this.setIntegerForKey(_name, _value, _data);
    }
    /**Double（注意：默认会将name绑定userId，扩展参数data中传入all将不绑定userId） */
    getDoubleForKey(_name: string, _default: number, _data?: FWLocalStorageExParam): number {
        return this.getIntegerForKey(_name, _default, _data);
    }
    /**Boolean（注意：默认会将name绑定userId，扩展参数data中传入all将不绑定userId） */
    setBooleanForKey(_name: string, _value: boolean, _data?: FWLocalStorageExParam) {
        localStorage.setItem(this.dealParam(_name, _data), _value.toString());
    }
    /**Boolean（注意：默认会将name绑定userId，扩展参数data中传入all将不绑定userId） */
    getBooleanForKey(_name: string, _default: boolean, _data?: FWLocalStorageExParam): boolean {
        let result = localStorage.getItem(this.dealParam(_name, _data));
        return (fw.isNull(result) ? _default.toString() : result) == true.toString();
    }
    /**String（注意：默认会将name绑定userId，扩展参数data中传入all将不绑定userId） */
    setStringForKey(_name: string, _value: string, _data?: FWLocalStorageExParam) {
        localStorage.setItem(this.dealParam(_name, _data), _value.toString());
    }
    /**String（注意：默认会将name绑定userId，扩展参数data中传入all将不绑定userId） */
    getStringForKey(_name: string, _default: string, _data?: FWLocalStorageExParam): string {
        let result = localStorage.getItem(this.dealParam(_name, _data));
        return fw.isNull(result) ? _default : result;
    }
    /**获取前缀 */
    getFront(_name: string, _data?: FWLocalStorageExParam) {
        let result: string = ``;
        if (!fw.isNull(_data.bGame) && app.gameManager.gameConfig) {
            result = `${app.gameManager.gameConfig.gameName}_${result}`;
        }
        if (!fw.isNull(_data.nUserID)) {
            result = `${_data.nUserID}_${result}`;
        } else {
            result = `${center.user.getUserID()}_${result}`;
        }
        result = `${result}_${_name}`;
        return result;
    }
    /**自动处理参数 */
    dealParam(_name: string, _data?: FWLocalStorageExParam) {
        _data = _data ?? {};
        return _data.all ? _name : this.getFront(_name, _data);
    }
    /**userdefault--end------------------------------------------------------------------------------- */
}

enum READ_FILE_TYPE {
    /**readAsDataURL，数据为Base64加密格式 */
    Data_Url,
    /**readAsText，数据为普通文本格式 */
    Text,
    /**readAsText，二进制字符串 */
    /**readAsBinaryString */
    BinaryString,
    /**readAsArrayBuffer，ArrayBuffer */
    ArrayBuffer,
}

/**类型声明调整 */
declare global {
    namespace globalThis {
        /**截图参数 */
        type ScreenshotParam = {
            /**指定节点区域 */
            node?: ccNode
            /**位置，不传默认Vec3(0, 0, 0) */
            pos?: Vec3
            /**大小，不传默认app.winSize */
            size?: Size
            /**输入图片的大小，不传默认截图区域大小 */
            outSize?: Size
            /**文件路径（可写路径下的相对路径） */
            filePath?: string
            /**文件路径（可写路径下的绝对路径） */
            finalPath?: string
            /**输出路径（完整路径，无需传入，截图完成后自动赋值） */
            outFilePath?: string
            /**截图回调 */
            callback?: (data: ScreenshotParam, uint8Array: Uint8Array) => void
        }
        /**缓存扩展参数 */
        type FWLocalStorageExParam = {
            /**是否对所有玩家设置 */
            all?: boolean
            /**指定玩家ID */
            nUserID?: string
            /**是否添加游戏标识 */
            bGame?: boolean
        }
        /**更新精灵 */
        type FWUpdateSpriteParam = {
            /**必须添加了Sprite组件，图片加载成功后会自动为其替换 */
            node?: ccNode
            /**玩家ID（用于显示默认图标） */
            nUserID?: number
            /**服务器图片名称 用户id 或者 网络图片链接*/
            serverPicID?: string | number
            /**子包资源 */
            bundleResConfig?: BundleResConfig
            /**遮罩资源*/
            bundleResMaskConfig?: BundleResConfig
            /**客户端缓存完整路径 */
            finalPath?: string
            /**条件检测 */
            checkCallback?: (data: FWUpdateSpriteParam) => boolean
            /**下载类型 */
            type?: DOWN_IMAGE_TYPE
            /**自动显隐，加载前隐藏，加载后显示 */
            bAutoShowHide?: boolean
            /**回调，返回文件路径 */
            callback?: (filePath?: string) => void
            /**处理失败回调 */
            failCallback?: () => void
            /**扩展参数 */
            data?: any
        }
        /**打开文件管理器 */
        type FWOpenSelectFileParam = {
            /**文件读取方式 */
            type?: READ_FILE_TYPE
            /**读取成功回调 */
            callback?: (content: string | ArrayBuffer, file: File) => void
        }
    }
}
