import { _decorator, Component, Node as ccNode, assetManager, AssetManager, Asset, __private, native, js, SpriteFrame, isValid } from 'cc';
const { ccclass } = _decorator;

/** js 系统 */
const system_js = self["System"];
/**类注册缓存 */
const script_cache_tab: Record<string, any> = system_js[Reflect.ownKeys(system_js).find((v) => typeof v === "symbol")];

@ccclass('FWAssetManager')
export class FWAssetManager extends fw.FWComponent {
    /**loadRemote缓存 */
    public loadRemoteCache: Map<string, Asset> = new Map()
    /**加载子包 */
    loadBundle(bundleConfig: BundleConfigType | BundleResConfig, callback?: (bundle: AssetManager.Bundle) => void, data?: LoadBundleExtendParam) {
        data ??= {};
        let tempName = bundleConfig.bundleName;
        app.func.doPromise<AssetManager.Bundle>((resolve, reject) => {
            const cacheBundle = assetManager.getBundle(tempName);
            if (cacheBundle) {
                resolve(cacheBundle);
            } else {
                assetManager.loadBundle(tempName, data.option, (err, bundle) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(bundle);
                    }
                });
            }
        })
        .then((bundle)=>{
            if (isValid(app, true) && (fw.isNull(data.valideTarget) || fw.isValid(data.valideTarget))) {
                callback?.(bundle);
            }
        })
        .catch((err: Error)=>{
            if (isValid(app, true) && (fw.isNull(data.valideTarget) || fw.isValid(data.valideTarget))) {
                fw.printError(err.message, bundleConfig);
                data.failCallback?.();
            }
        });
    }
    /**加载子包同步（需自行确定子包已经加载） */
    loadBundleSync(bundleConfig: BundleConfigType | BundleResConfig): AssetManager.Bundle | null {
        return assetManager.bundles.get(bundleConfig.bundleName);
    }
    /**
     * 卸载缓存子包脚本 
     * 请不要卸载main 如果 main 更新请重启模拟器
    */
    unloadBundleScriptCache(bundleName: string) {
        if (!app.file.notSupport()) {
            //刷新子包脚本配置
            fw.print(`unloadBundleScriptCache: ${bundleName} begin`);
            //删除代码缓存
            assetManager.downloader.undownloadBundleScriptCache?.(bundleName);
            let prerequisiteImportsKey = `virtual:///prerequisite-imports/${bundleName}`
            let virtualKey = `chunks:///_virtual/${bundleName}`
            let bundle_root = script_cache_tab[virtualKey]
            let unregisterClassArray: Function[] = []
            if (bundle_root) {
                bundle_root.d.forEach((v: { id: string, C: {} }) => {
                    let C = v.C;
                    //获取卸载的class
                    for (const key in C) {
                        let val = C[key];
                        if (val instanceof Function) {
                            unregisterClassArray.push(val)
                        }
                    }
                    delete script_cache_tab[v.id];
                    delete system_js["registerRegistry"][v.id];
                });
                delete script_cache_tab[virtualKey];
                delete system_js["registerRegistry"][virtualKey];
                delete script_cache_tab[prerequisiteImportsKey];
                delete system_js["registerRegistry"][prerequisiteImportsKey];
            }
            js.unregisterClass(...unregisterClassArray);
        }
    }
    /**加载子包中的资源 */
    loadBundleRes<T extends Asset>(bundleResConfig: BundleResConfig, callback?: AssetLoadCallbackParam<T>, data?: AssetLoadExtendParam)
    loadBundleRes<T extends Asset>(bundleResConfig: BundleResConfig, type: AssetLoadTypeParam<T>, callback?: AssetLoadCallbackParam<T>, data?: AssetLoadExtendParam)
    loadBundleRes<T extends Asset>(bundleResConfig: BundleResConfig, type?: any, callback?: any, data?: AssetLoadExtendParam) {
        //调整参数
        const isValidType = js.isChildClassOf(type as Constructor<Asset>, Asset);
        !data && ((typeof (callback) != `function`) ? (data = callback ?? {}, callback = null) : (data = {}));
        !callback && !isValidType && (typeof (type) == `function`) && (callback = type, type = null);
        app.func.doPromise<T>((resolve, reject) => {
            //优先加载子包
            this.loadBundle(bundleResConfig,(bundle) => {
                let assetInfo = app.assetManager.getAssetInfoByPath(bundleResConfig);
                if (assetInfo && assetInfo.ctor == SpriteFrame) {
                    let languagePath = bundleResConfig.path.replace(/(#\w+)?(\/spriteFrame)?$/, `$2`);
                    if (app.assetManager.getAssetInfoByPath(languagePath, bundleResConfig.bundleName)) {
                        bundleResConfig.path = languagePath;
                    }
                }
                console.log("load Res:  bunble:" +bundleResConfig.bundleName+" path:" + bundleResConfig.path)
                let cache: T = bundle.get(bundleResConfig.path, type);
                if (cache) {
                    resolve(cache);
                } else {
                    //加载资源
                    bundle.load(bundleResConfig.path, type, (err, res: T) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(res);
                        }
                    });
                }
            });
        })
        .then((res:T) => {
            if (isValid(app, true) && (fw.isNull(data.valideTarget) || fw.isValid(data.valideTarget))) {
                //执行回调
                callback?.(res);
            }
        })
        .catch((err: Error)=>{
            fw.printError(err.message, bundleResConfig);
            if (isValid(app, true) && (fw.isNull(data.valideTarget) || fw.isValid(data.valideTarget))) {
                data.failCallback?.();
            }
        });;
    }
    /**加载子包中的资源 */
    loadBundleResSync<T extends Asset>(bundleResConfig: BundleResConfig, type?: AssetLoadTypeParam<T>): T {
        let res = this.loadBundleSync(bundleResConfig).get(bundleResConfig.path, type);
        if (!res) {
            //需确保资源已经通过bundle.load加载成功
            fw.printError(`loadBundleResSync error`, bundleResConfig);
        }
        return res;
    }
    /**卸载子包 */
    unloadBundle(nameOrBundle: (string | AssetManager.Bundle) | (string | AssetManager.Bundle)[]) {
        let nameOrBundles = (nameOrBundle instanceof Array) ? nameOrBundle : [nameOrBundle];
        app.func.positiveTraversal(nameOrBundles, (element) => {
            let bundleName: string;
            if (typeof (element) == `string`) {
                bundleName = element;
            } else if (element instanceof AssetManager.Bundle) {
                bundleName = element.name;
            } else {
                //TODO
            }
            if (bundleName) {
                let bundle = assetManager.getBundle(bundleName);
                if (bundle) {
                    fw.print(`unloadBundle: ${bundleName}`);
                    //释放资源
                    bundle.releaseAll();
                    //卸载子包
                    assetManager.removeBundle(bundle);
                    //卸载音频缓存
                    app.audio.clearAudioCache(bundleName);
                    //卸载缓存子包脚本
                    app.assetManager.unloadBundleScriptCache(bundleName);
                    //清理游戏搜索路径缓存
                    app.gameManager.clearSearchResCache();
                    fw.print(`unloadBundle end: ${bundleName}`);
                }
            }
        });
    }
    /**下载远程资源 */
    loadRemote<T extends Asset>(data: LoadRemoteParm<T>) {
        //链接异常
        if (!data.url || data.url.match(/[\\/]$/)) {
            data.failCallback?.();
            return;
        }
        //清理缓存
        data.bCleanCache && app.assetManager.removeLoadRemoteCache(data.url);
        //加载资源
        assetManager.loadRemote(data.url, data.option, (err, res: T) => {
            if (!isValid(app, true)) {
                return;
            }
            try {
                //缓存数据
                if (res) {
                    this.loadRemoteCache.set(data.url, res);
                }
                //无效不处理
                if (!fw.isNull(data.valideTarget) && !fw.isValid(data.valideTarget)) {
                    return;
                }
                if (err) {
                    fw.printWarn(err);
                    data.failCallback?.();
                } else {
                    data.callback && data.callback(res);
                }
            } catch (error) {
                fw.printError(error, data)
            }
        });
    }
    /**移除loadRemote缓存 */
    removeLoadRemoteCache(url: string) {
        if (this.loadRemoteCache.has(url)) {
            let res = this.loadRemoteCache.get(url);
            assetManager.cacheManager?.removeCache(res.nativeUrl);
            assetManager.releaseAsset(res);
            this.loadRemoteCache.delete(url);
        }
    }
    /**从已加载的bundle中获取资源信息 */
    getAssetInfoByUuid(uuid: string): AssetInfo | null {
        let result: any;
        assetManager.bundles.find(element => {
            result = element.getAssetInfo(uuid);
            if (result) {
                result = Object.assign({
                    bundle: element
                }, result);
                return true;
            }
        });
        return result;
    }
    /**从已加载的bundle中获取资源信息，不同bundle可能存在相同路径的资源（不传bundleName时，找到一个路径相符的资源就会返回） */
    getAssetInfoByPath(path: string | BundleResConfig, bundleName?: string): AssetInfo | null {
        let result: any;
        let tempPath: string;
        let tempBundleName: string;
        //调整参数
        if (typeof (path) == `string`) {
            tempPath = path;
        } else {
            tempPath = path.path;
            tempBundleName = path.bundleName;
        }
        if (bundleName) {
            tempBundleName = bundleName;
        }
        //检测资源
        if (tempBundleName) {
            let bundle = assetManager.bundles.get(tempBundleName);
            if (bundle) {
                result = bundle.getInfoWithPath(tempPath);
                if (result) {
                    result = Object.assign({
                        bundle: bundle
                    }, result);
                }
            } else {
                fw.printWarn(`getAssetInfoByPath error get bundle failed`);
            }
        } else {
            assetManager.bundles.find(element => {
                result = element.getInfoWithPath(tempPath);
                if (result) {
                    result = Object.assign({
                        bundle: element
                    }, result);
                    return true;
                }
            });
        }
        return result;
    }
}

declare global {
    namespace globalThis {
        /**加载资源扩展参数 */
        type AssetInfo = {
            bundle: AssetManager.Bundle
        } & __private._cocos_asset_asset_manager_config__IAddressableInfo
        /**加载资源扩展参数 */
        type AssetLoadExtendParam = {
            /**有效节点 */
            valideTarget?: ValideTargetType
            /**失败回调 */
            failCallback?: () => void
        }
        /**加载资源类型 */
        type AssetLoadTypeParam<T extends Asset> = new (...arg: any[]) => T
        /**加载资源回调 */
        type AssetLoadCallbackParam<T extends Asset> = (res: T) => void
        /**加载远程资源 */
        type LoadRemoteParm<T extends Asset> = {
            /**下载链接 */
            url: string
            /**扩展类型 */
            option?: {
                [k: string]: any;
                ext?: string;
            } | null
            /**是否清理旧缓存 */
            bCleanCache?: boolean
            /**有效节点 */
            valideTarget?: ValideTargetType
            /**下载回调，成功时触发 */
            callback?: (res: T) => void
            /**失败回调 */
            failCallback?: () => void
        }
        /**加载子包扩展参数 */
        type LoadBundleExtendParam = {
            /**扩展类型 */
            option?: {
                [k: string]: any;
                version?: string;
            } | null
            /**有效节点 */
            valideTarget?: ValideTargetType
            /**失败回调 */
            failCallback?: () => void
        }
    }
}
// base64 图片加载模板
// let url = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAMAAAAPdrEwAAADJmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDYgNzkuZGFiYWNiYiwgMjAyMS8wNC8xNC0wMDozOTo0NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjQgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RERCMTNFREVCM0JBMTFFQzhDOUY5MjU3ODZBRTEwMjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RERCMTNFREZCM0JBMTFFQzhDOUY5MjU3ODZBRTEwMjIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpEREIxM0VEQ0IzQkExMUVDOEM5RjkyNTc4NkFFMTAyMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpEREIxM0VEREIzQkExMUVDOEM5RjkyNTc4NkFFMTAyMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqxW+zgAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAAA81BMVEW8ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD28ZD27Yzy6Yzy5Yjy3YTy3YTu2YTu1YDuyXzqxXjqwXjqvXTquXTmtXDmsXDmrWzmqWzmoWjinWjimWTilWDejVzeiVzehVjegVjafVTacVDWbUzWaUzWZUzWZUjWYUjWXUTSVUDSUUDSTTzOSTzORTzORTjOQTjOPTjOOTTKNTTKNTDKLTDKKSzKKSzGJSzGJSjGISjFt+MELAAAAH3RSTlMAAwYHUVJTVFVWW1yJipOUpqus19nb3+Dj5PLz+Pn630o4TAAAAZNJREFUeNrt2UFu3DAMheFHirKnLYJiMove/3hdtB2kbWBbEhlpBEwOMAyy4U+vPxiGd48w4nVdVoZHdWvboegRenL+CjD18Fhmpga8Xsuk6dsFlDl1G/SYjE43LYZf/w0CdDlLli4TQA/JMLPWUi0X/INgvWBZck7k8tba7VTouJRd+Iy8rDll6uHRrFeYYeX5p5xWktwTdqANZo0LtNXli6zobuq0g9wzSxWaWztWWcCSskgihgttMFVhZJ5/3XjgEU2sowsn4n5DduqGjWPQDF7dQYa3DLzTAMG3afIddscZ8LcnyfiYgg466KCDDjrooIMOOuiggw466KCDDjrooD+VNrhnk7YPsnm6/rAN+pYrPJq0r30HuZj2M1M4dcPG8aFNzdTNnlhHD2nQKoUJpOTzNWotrSmK7CgpcYGx03KnXS6lYpdtX2thqJITbUMuemyi1x9DzkrstO0OueBPI+Dp+bYLeg2wOmj8/ouhPZ3B4jgbV8X1xaa1fPcbu02B15cdwMT4dJITwSPb6rYpALwBjHr3CkcGkIgAAAAASUVORK5CYII="
// app.assetManager.loadRemote({
//                         url: url,
//                         bCleanCache: true,
//                         option: { ext: `.png` },
//                         callback: (imageAsset) => {
// 							console.log("11")
// 							console.log(imageAsset)
//                         },
//                         failCallback: () => {
// 							console.log("22")
//                         }
//                     });
