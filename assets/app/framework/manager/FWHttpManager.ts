import { isValid, Node as ccNode, CCObject } from "cc";
import 'url-search-params-polyfill';

export interface FWHttpParams {
    /**请求链接 */
    url: string
    /**完成时回调函数 */
    callback?: (bSuccess: boolean, response: string | any) => void
    /**事件有效控制节点 */
    valideTarget?: CCObject
    /**返回数据类型
     * @tip "" 空的 responseType 字符串与默认类型 "text" 相同。
     * @tip "arraybuffer" response 是一个包含二进制数据的 JavaScript ArrayBuffer。
     * @tip "blob" response 是一个包含二进制数据的 Blob 对象。
     * @tip "document" response 是一个 HTML Document 或 XML XMLDocument，根据接收到的数据的 MIME 类型而定。请参阅 HTML in XMLHttpRequest HTML，了解有关使用 XHR 获取 HTML 内容的更多信息。
     * @tip "json" response 是通过将接收到的数据内容解析为 JSON 而创建的 JavaScript 对象。
     * @tip "text" response 是 DOMString 对象中的文本。
     */
    responseType?: XMLHttpRequestResponseType
    /**body数据（不能与params参数共存） */
    body?: any
    /**body参数（不能与body参数共存） */
    params?: AnyObjectType
    /**url参数 */
    params_url?: AnyObjectType
    /**是否自动签名（默认签名） */
    bAutoSign?: boolean
    /**自定义请求头类型 */
    content_type?: string
}

export interface FWHttpGetParams extends FWHttpParams { }

export interface FWHttpPostParams extends FWHttpParams { }

export enum ReadyState {
    /**正在建立连接连接，还没有完成。 */
    connecting = 0,
    /**连接成功建立，可以进行通信。 */
    successed = 1,
    /**连接正在进行关闭握手，即将关闭。 */
    about2close = 2,
    /**连接已经关闭或者根本没有建立。 */
    closed = 3,
    /**已完成 */
    completed = 4,
}

export const strReadyState: { [key: string]: string } = {
    [ReadyState.connecting]: `正在建立连接连接，还没有完成。`,
    [ReadyState.successed]: `连接成功建立，可以进行通信。`,
    [ReadyState.about2close]: `连接正在进行关闭握手，即将关闭。`,
    [ReadyState.closed]: `连接已经关闭或者根本没有建立。`,
    [ReadyState.completed]: `已完成`,
}

export class FWHttpManager extends (fw.FWComponent) {
    /**get请求 */
    get(data: FWHttpGetParams) {
        //显示加载界面
        app.popup.showLoading();
        let xhr = new XMLHttpRequest();
        let params = data.params ?? data.params_url;
        if (!!params) {
            data.url = `${data.url}?${app.http.splicingParams(params)}`;
        }
        fw.print(`httpGet: ${data.url}`);
        let responseType = data.responseType ?? `json`;
        let errInfo = `get failed: ${data.url}, status: `;
        let onComplete = (error: Error, response?: any) => {
            //游戏可能在重启
            if (!isValid(app)) {
                return;
            }
            //隐藏加载界面
            app.popup.closeLoading();
            //节点失效后不再处理
            if (!fw.isNull(data.valideTarget) && !isValid(data.valideTarget)) {
                return;
            }
            if (error) {
                try {
                    fw.printError(error);
                    fw.print(`url: ${data.url}`);
                    fw.print(`responseType: ${responseType}`);
                } catch (e) {
                    fw.print(e);
                }
                data.callback?.(false, error);
            } else {
                data.callback?.(true, response);
            }
        }

        xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 0) {
                if (onComplete) { onComplete(null, xhr.response); }
            } else if (onComplete) { onComplete(new Error(`${errInfo}${xhr.status}(no response)`)); }
        };

        // if (onProgress) {
        //     xhr.onprogress = (e) => {
        //         if (e.lengthComputable) {
        //             onProgress(e.loaded, e.total);
        //         }
        //     };
        // }

        xhr.onerror = () => {
            if (onComplete) { onComplete(new Error(`${errInfo}${xhr.status}(error)`)); }
        };

        xhr.ontimeout = () => {
            if (onComplete) { onComplete(new Error(`${errInfo}${xhr.status}(time out)`)); }
        };

        xhr.onabort = () => {
            if (onComplete) { onComplete(new Error(`${errInfo}${xhr.status}(abort)`)); }
        };

        xhr.onreadystatechange = function () {
            fw.print(`httpGet: ${strReadyState[xhr.readyState]}`);
            fw.print(`httpGet readyState = ${xhr.readyState} status = ${xhr.status}`);
        }
        /*
        *credentials，即用户凭证，是指 cookie、HTTP身份验证和TLS客户端证书。需要注意的是，它不涉及代理身份验证或源标头。
        *XMLHttpRequest 的 withCredentials 属性
        *默认值为false。在获取同域资源时设置 withCredentials 没有影响。
        *true：在跨域请求时，会携带用户凭证
        *false：在跨域请求时，不会携带用户凭证；返回的 response 里也会忽略 cookie
        */
        xhr.open(`GET`, data.url, true);
        // xhr.setRequestHeader(`Access-Control-Allow-Origin`, `*`);
        // xhr.setRequestHeader(`Access-Control-Allow-Methods`, `GET, POST`);
        // xhr.setRequestHeader(`Access-Control-Allow-Headers`, `x-requested-with,content-type,authorization`);
        xhr.setRequestHeader(`Content-Type`, `application/x-www-form-urlencoded`);
        // xhr.setRequestHeader(`Authorization`, `Bearer ` + ``);
        // 8 seconds for timeout
        xhr.timeout = 8000;
        // 设置返回数据为二进制数据
        xhr.responseType = responseType;
        xhr.send();
    }
    /**post请求 */
    post(data: FWHttpPostParams, autoShowLoading: boolean = false) {
        autoShowLoading && app.popup.showLoading();
        let xhr = new XMLHttpRequest();
        // 调整url参数
        if (!!data.params_url) {
            if ((data.bAutoSign ?? true) && !data.params_url[`sign`]) {
                data.params_url[`sign`] = this.getSign(data.params_url);
            }
            data.url = `${data.url}?${app.http.splicingParams(data.params_url)}`;
        }
        fw.print(`POST: ${data.url}`);
        // 调整body参数
        if (!!data.params) {
            if ((data.bAutoSign ?? true) && !data.params[`sign`]) {
                data.params[`sign`] = this.getSign(data.params);
            }
            fw.print(`params: ${JSON.stringify(data.params)}`);
        }
        let body = data.body ?? app.http.splicingParams(data.params);
        let contentType = data.content_type;
        if (!data.content_type) {
            // xhr.setRequestHeader(`Authorization`, `Bearer ` + ``);
            // xhr.setRequestHeader(`Access-Control-Allow-Origin`, `*`);
            // xhr.setRequestHeader(`Access-Control-Allow-Methods`, `GET, POST`);
            // xhr.setRequestHeader(`Content-Type`, `multipart/form-data; boundary=customformdata`);
            let bodyType = typeof (body);
            if (bodyType == `string`) {
                contentType = `application/x-www-form-urlencoded`;
            } else {
                if (body instanceof CustomFormData) {
                    contentType = `multipart/form-data; boundary=${body.boundary_key}`;
                    //调整数据
                    body = body.arrayBuffer;
                }
            }
        }
        let errInfo = `post failed: ${data.url}, status: `;
        let onComplete = (error: Error, response?: any) => {
            //游戏可能在重启
            if (!isValid(app)) {
                return;
            }
            //隐藏加载界面
            autoShowLoading && app.popup.closeLoading();
            //节点失效后不再处理
            if (!fw.isNull(data.valideTarget) && !isValid(data.valideTarget)) {
                return;
            }
            if (error) {
                try {
                    fw.printError(error);
                    fw.print(`url: ${data.url}`);
                    fw.print(`contentType: ${contentType}`);
                    fw.print(`body: ${JSON.stringify(body)}`);
                } catch (e) {
                    fw.print(e);
                }
                data.callback?.(false, error);
            } else {
                data.callback?.(true, response);
            }
        }

        xhr.onload = () => {
            if (xhr.status === 200 || xhr.status === 0) {
                if (onComplete) { onComplete(null, xhr.response); }
            } else if (onComplete) { onComplete(new Error(`${errInfo}${xhr.status}(no response)`)); }
        };

        // if (onProgress) {
        //     xhr.onprogress = (e) => {
        //         if (e.lengthComputable) {
        //             onProgress(e.loaded, e.total);
        //         }
        //     };
        // }

        xhr.onerror = () => {
            if (onComplete) { onComplete(new Error(`${errInfo}${xhr.status}(error)`)); }
        };

        xhr.ontimeout = () => {
            if (onComplete) { onComplete(new Error(`${errInfo}${xhr.status}(time out)`)); }
        };

        xhr.onabort = () => {
            if (onComplete) { onComplete(new Error(`${errInfo}${xhr.status}(abort)`)); }
        };

        xhr.onreadystatechange = function () {
            if (app.func.isWin32()) {
                fw.print(`httpPost: ${strReadyState[xhr.readyState]}`);
                fw.print(`httpPost readyState = ${xhr.readyState} status = ${xhr.status}`);
            }
        }
        xhr.withCredentials = false;
        // 8 seconds for timeout
        xhr.timeout = 8000;
        // 设置返回数据为二进制数据
        xhr.responseType = data.responseType ?? `json`;
        xhr.open(`POST`, data.url, true);
        
        // xhr.setRequestHeader(`Access-Control-Allow-Origin`, `*`);
        // xhr.setRequestHeader(`Access-Control-Allow-Methods`, `GET, POST`);
        // xhr.setRequestHeader(`Access-Control-Allow-Headers`, `x-requested-with,content-type,authorization`);
        
        contentType && xhr.setRequestHeader(`Content-Type`, contentType);
        xhr.send(body);
    }
    /**post请求 */
    postPromise<T = any>(data: FWHttpPostParams): Promise<{ bSuccess: boolean, response: T }> {
        return app.func.doPromise((resolve, reject) => {
            data.callback = (bSuccess: boolean, response: T) => {
                resolve({
                    bSuccess: bSuccess,
                    response: response,
                })
            };
            this.post(data);
        })
    }
    //拼接参数
    splicingParams(params: AnyObjectType): string {
        let paramsStr = ``;
        if (params) {
            Object.keys(params).sort().forEach((element, index) => {
                paramsStr = `${paramsStr}${((index > 0) ? `&` : ``)}${element}=${params[element]}`;
            });
        }
        return paramsStr;
    }
    //加密Key
    getSignKey(): string {
        return `abc`;
    }
    getPhpSignKey() {
        return `abc`;
    }
    /**获取参数md5 */
    getSign(params: AnyObjectType): string {
        return app.md5.hashStr(`${this.splicingParams(params)}&${this.getSignKey()}`);
    }
    /**解析pandaddz://schemeWork?methon=refer */
    parseUrl_schemeWork(url: string): any {
        // 获取 URL 参数字符串
        let paramsStr = url.substring(url.indexOf('?') + 1);
        // 按照 & 分割字符串，再按照 = 分割每个参数
        let paramPairs = paramsStr.split('&').map((v) => {
            return v.split(`=`);
        });
        // 将参数对转换为键值对的形式，存入 data 对象
        let data = {};
        if (paramPairs) {
            paramPairs.forEach(parse => {
                data[parse[0]] = decodeURIComponent(parse[1]);
            });
        }
        // 返回包含 URL 参数的对象
        return data;
    }
    getPhpSign(params: Object) {
        let paramsStr = ``;
        Object.keys(params).sort().forEach((element, index) => {
            if (element != `sign`) {
                paramsStr = `${paramsStr}${((index > 0) ? `&` : ``)}${element}=${params[element]}`;
            }
        });
        paramsStr += `&${this.getPhpSignKey()}`;
        return app.md5.hashStr(paramsStr);
    }
    checkPhpSign(params: any) {
        let phpSign = ``;
        let needCheckAgain = false;
        if (params.sign && params.sign != ``) {
            needCheckAgain = true;
            phpSign = this.getPhpSign(params);
        }
        let canLogin = needCheckAgain && phpSign == params.sign;
        if (!canLogin) {
            app.popup.showToast(`sign check failed`);
        }
        return canLogin;
    }
}

/**自定义form-data */
export class CustomFormData {
    /**form-data 数据信息 */
    public infos: any[] = []
    /**boundary值，必须与请求头对应->setRequestHeader(`Content-Type`, `multipart/form-data; boundary=${boundary}` */
    public boundary_key: string = `customformdata`
    /**参数的boundary */
    public boundary: string = `--${this.boundary_key}`
    /**结尾的boundary */
    public end_boundary: string = `${this.boundary}--`
    /**添加一个参数 */
    public append(key: string, value: any, filename?: string) {
        this.infos.push(`\r\n`);
        this.infos.push(`${this.boundary}\r\n`);
        if (filename) {
            this.infos.push(`Content-Disposition: form-data; name="${key}"; filename="${filename}"\r\n`);
            this.infos.push(`Content-Type: image/png\r\n\r\n`);
        } else {
            this.infos.push(`Content-Disposition: form-data; name="${key}"\r\n\r\n`);
        }
        this.infos.push(value);
    }
    /**添加参数（为了和浏览器FormData格式一致） */
    public set(key: string, value: any, filename?: string) {
        this.append(key, value, filename);
    }
    /**转ArrayBuffer */
    public get arrayBuffer(): ArrayBuffer {
        let bytes: number[][] = [];
        this.infos.push(`\r\n${this.end_boundary}`);
        this.infos.forEach(element => {
            if (typeof element == `string`) {
                bytes.push(app.func.stringToUtf8(element));
            } else if (element instanceof ArrayBuffer) {
                bytes.push(Array.prototype.slice.call(new Uint8Array(element)));
            } else if (element instanceof Uint8Array) {
                let array: number[] = [];
                for (let i = 0; i < element.length; i++) {
                    array.push(element[i]);
                }
                bytes.push(array);
            }
        });
        let data: number[] = [];
        for (let v of bytes) {
            for (let n of v) {
                data.push(n);
            }
        }
        return new Uint8Array(data).buffer;
    }
}
