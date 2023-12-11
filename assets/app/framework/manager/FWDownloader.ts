import { Node as ccNode, ImageAsset, SpriteFrame, Texture2D } from 'cc';

export class FWDownloader extends fw.FWComponent {
    /**
     * 下载文件
     */
    downloadFile(data: DownloadFileParam): XMLHttpRequest {
        //默认是app
        data.valideTarget ??= app;
        //完成回调
        const done = (err: Error | null, response?: any | null) => {
            if (!fw.isValid(data.valideTarget)) {
                return;
            }
            if (data.onComplete) {
                if (data.bImage) {
                    let url = data.url;
                    if (app.func.isBrowser()) {
                        //TODO
                    } else {
                        if (data.filePath || data.finalPath) {
                            url = data.finalPath ?? `${app.file.getFileDir(app.file.FileDir.Root)}${data.filePath}`;
                        }
                    }
                    app.assetManager.loadRemote<ImageAsset>({
                        url: url,
                        bCleanCache: true,
                        option: { ext: `.png` },
                        callback: (imageAsset) => {
                            //调整显示
                            const spriteFrame = new SpriteFrame();
                            const texture = new Texture2D();
                            texture.image = imageAsset;
                            spriteFrame.texture = texture;
                            data.onComplete(null, spriteFrame);
                        },
                        failCallback: () => {
                            data.onComplete(new Error(`downloadFile faild: ${url}`));
                        }
                    });
                } else {
                    data.onComplete(err, response);
                }
            }
        }
        //浏览器直接使用loadRemote
        if (app.func.isBrowser() && data.bImage) {
            done(null);
            return;
        }
        //是否使用缓存文件
        if (data.filePath || data.finalPath) {
            //最终路径
            const finalPath = data.finalPath ?? `${app.file.getFileDir(app.file.FileDir.Root)}${data.filePath}`;
            if (app.file.isFileExist(finalPath) && !app.file.isDirectoryExist(finalPath)) {
                done(null, app.file.getDataFromFile(finalPath));
                return;
            }
        }
        const xhr = new XMLHttpRequest();
        //设置请求地址
        xhr.open('GET', data.url, true);
        const options = <FileDownloadOptions>(data.options ?? {});
        //超时
        xhr.timeout = options.xhrTimeout ?? xhr.timeout;
        //返回值类型
        if (data.bImage) {
            xhr.responseType = `arraybuffer`;
        } else {
            xhr.responseType = options.xhrResponseType ?? xhr.responseType;
        }
        //???
        xhr.withCredentials = options.xhrWithCredentials ?? xhr.withCredentials;
        //???
        if (!fw.isNull(options.xhrMimeType) && xhr.overrideMimeType) {
            xhr.overrideMimeType(options.xhrMimeType);
        }
        //请求头
        if (options.xhrHeader) {
            for (const header in options.xhrHeader) {
                xhr.setRequestHeader(header, options.xhrHeader[header]);
            }
        }
        //完成响应
        xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 0) {
                if (data.filePath || data.finalPath) {
                    if (typeof (xhr.response) == `string`) {
                        app.file.writeStringToFile({
                            fileData: xhr.response,
                            filePath: data.filePath,
                            finalPath: data.finalPath,
                        });
                    } else {
                        app.file.writeDataToFile({
                            fileData: xhr.response,
                            filePath: data.filePath,
                            finalPath: data.finalPath,
                        });
                    }
                }
                done(null, xhr.response);
            } else {
                done(new Error(`${this.getDownloadFileErrorInfo(data)}${xhr.status}(no response)`));
            }
        };
        //下载过程响应
        if (data.onProgress) {
            xhr.onprogress = (e) => {
                if (e.lengthComputable) {
                    data.onProgress(e.loaded, e.total);
                }
            };
        }
        //错误响应
        xhr.onerror = () => {
            done(new Error(`${this.getDownloadFileErrorInfo(data)}${xhr.status}(error)`));
        };
        //超时响应
        xhr.ontimeout = () => {
            done(new Error(`${this.getDownloadFileErrorInfo(data)}${xhr.status}(time out)`));
        };
        //中止响应
        xhr.onabort = () => {
            done(new Error(`${this.getDownloadFileErrorInfo(data)}${xhr.status}(abort)`));
        };
        xhr.send(null);
        return xhr;
    }
    /**获取错误文本 */
    getDownloadFileErrorInfo(data: DownloadFileParam) {
        return `download failed: ${data.url}, status: `;
    }
}

declare global {
    namespace globalThis {
        interface FileDownloadOptions {
            /**
             * Returns the response type.
             *
             * Can be set to change the response type. Values are: the empty string (default), "arraybuffer", "blob", "document", "json", and "text".
             *
             * When set: setting to "document" is ignored if current global object is not a Window object.
             *
             * When set: throws an "InvalidStateError" DOMException if state is loading or done.
             *
             * When set: throws an "InvalidAccessError" DOMException if the synchronous flag is set and current global object is a Window object.
             *
             * [MDN Reference](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/responseType)
             */
            xhrResponseType: XMLHttpRequestResponseType
            /**
             * True when credentials are to be included in a cross-origin request. False when they are to be excluded in a cross-origin  request and when cookies are to be ignored in its response. Initially false.
             *
             * When set: throws an "InvalidStateError" DOMException if state is not unsent or opened, or if the send() flag is set.
             *
             * [MDN Reference](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/withCredentials)
             */
            xhrWithCredentials: boolean
            /**
             * Acts as if the `Content-Type` header value for a response is mime. (It does not change the header.)
             *
             * Throws an "InvalidStateError" DOMException if state is loading or done.
             *
             * [MDN Reference](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/overrideMimeType)
             */
            xhrMimeType: string
            /**
             * Can be set to a time in milliseconds. When set to a non-zero value will cause fetching to terminate after the given time  has passed. When the time has passed, the request has not yet completed, and this's synchronous flag is unset, a timeout  event will then be dispatched, or a "TimeoutError" DOMException will be thrown otherwise (for the send() method).
             *
             * When set: throws an "InvalidAccessError" DOMException if the synchronous flag is set and current global object is a Window  object.
             *
             * [MDN Reference](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/timeout)
             */
            xhrTimeout: number
            /**
             * Combines a header in author request headers.
             *
             * Throws an "InvalidStateError" DOMException if either state is not opened or the send() flag is set.
             *
             * Throws a "SyntaxError" DOMException if name is not a header name or if value is not a header value.
             *
             * [MDN Reference](https://developer.mozilla.org/docs/Web/API/XMLHttpRequest/setRequestHeader)
             */
            xhrHeader: { [name: string]: string }
        }
        interface DownloadFileParam {
            /**请求地址 */
            url: string,
            /**有效对象 */
            valideTarget?: ValideTargetType
            /**是否是图片 */
            bImage?: boolean,
            /**相对路径 */
            filePath?: string,
            /**完整路径 */
            finalPath?: string,
            /**扩展参数 */
            options?: FileDownloadOptions,
            /**下载过程 */
            onProgress?: FileProgressCallback | null | undefined,
            /**下载完成 */
            onComplete?: ((err: Error | null, data?: any | null) => void),
        }
        type FileProgressCallback = (loaded: number, total: number) => void
    }
}
