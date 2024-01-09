import { isValid, Label, Overflow, sys, Node as ccNode } from "cc";

import dayjs from "dayjs";
import { DesignResolutionSize } from "../../config/ConstantConfig";

/**英文月份（1 -> 12）月 */
const MonthEn = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Spt`, `Oct`, `Nov`, `Dec`];

/**框架通用函数 */
export class FWFunctionCommon extends (fw.FWComponent) {
    /**是否是小屏手机 */
    public isSmallScreen() {
        //960  * 540  =>  16 : 9  =>  1.7778
        //1280 * 720  =>  16 : 9  =>  1.7778
        //1920 * 1080 =>  16 : 9  =>  1.7778
        //2340 * 1080 =>  19.5:9  =>  2.1667
        //1560 * 720  =>  13 : 6  =>  2.1667
        //1700 * 720  =>  85 : 36 =>  2.3611
        return (app.winSize.width / app.winSize.height) < 2;
    }
    /**获取当前操作系统 */
    public getPlatform() {
        return sys.os;
    }
    /**获取运行平台 */
    public getRunningPlatform() {
        return sys.platform;
    }
    /**是否是原生平台 */
    public isNative() {
        return sys.isNative;
    }
    /**是否是iOS平台（受测试参数fw.DEBUG.bLockWin影响） */
    public isIOS(targetPlatform?: any) {
        if (fw.DEBUG.bLockWin) {
            return false;
        }
        if (targetPlatform) {
            return targetPlatform === sys.OS.IOS;
        } else {
            return this.getPlatform() === sys.OS.IOS;
        }
    }
    /**是否是Android平台（受测试参数fw.DEBUG.bLockWin影响） */
    public isAndroid(targetPlatform?: any) {
        if (fw.DEBUG.bLockWin) {
            return false;
        }
        if (targetPlatform) {
            return targetPlatform === sys.OS.ANDROID;
        } else {
            return this.getPlatform() === sys.OS.ANDROID;
        }
    }
    /**是否是Win32平台（受测试参数fw.DEBUG.bLockWin影响）在微信开发者工具里为false */
    public isWin32(targetPlatform?: any) {
        if (fw.DEBUG.bLockWin) {
            return true;
        }
        if (targetPlatform) {
            return targetPlatform === sys.OS.WINDOWS;
        } else {
            return this.getPlatform() === sys.OS.WINDOWS;
        }
    }
    /**是否是Browser平台 在微信开发者工具里为false*/
    public isBrowser(targetPlatform?: any) {
        if (targetPlatform) {
            return targetPlatform === sys.Platform.DESKTOP_BROWSER;
        } else {
            return sys.isBrowser;
        }
    }
    /**是否是微信小游戏平台 在微信开发者工具里为ture*/ 
    public isWeChat(targetPlatform?: any) {
        if (targetPlatform) {
            return targetPlatform === sys.Platform.WECHAT_GAME;
        } else {
            return this.getRunningPlatform() === sys.Platform.WECHAT_GAME;
        }
    }
    
    /**weChat环境下细分IOS和安卓 */
    public  getWechatPlatform() : string {
        wx.getSystemInfo({
            success(res) {
                return res.platform
            },
            fail: function (err?: any): void {
                throw new Error("Function not implemented.");
            },
            complete: function (res?: any): void {
                throw new Error("Function not implemented.");
            }
        })
        return ""
    }

    // public getWechatPlatform(): Promise<string> {
    //     return new Promise((resolve, reject) => {
    //       wx.getSystemInfo({
    //           success(res) {
    //               resolve(res.platform);
    //           },
    //           fail() {
    //               reject(new Error("Failed to get system info"));
    //           },
    //           complete: function (res?: any): void {
    //               throw new Error("Function not implemented.");
    //           }
    //       });
    //     });
    //   }
    /**
     * @deprecated
     * 后续会删除，请改用fw.isValid
     * @describe
     * 对象是否无效item === undefined || item === null || item === NaN || !isValid(item, true) */
    public isInvalid(data: any) {
        let datas = (data instanceof Array) ? data : [data];
        for (let i in datas) {
            let item = datas[i];
            if (this.isNull(item) || !isValid(item, true)) {
                return true;
            }
        }
        return false;
    }
    /**
     * @deprecated
     * 后续会删除，请改用fw.isNull
     * @describe
     * 对象是否无效item === undefined || item === null || (typeof (data) == `number` && isNaN(data)) */
    isNull(data: any): boolean {
        if (data === undefined || data === null || (typeof (data) == `number` && isNaN(data))) {
            return true;
        }
        return false;
    }
    /**获取最大的那个 */
    public getMax(data: {
        /**检测目标 */
        targets: any[],
        /**自定义检测函数 */
        checkFunc?: (...args: any[]) => any
    }) {
        let value: any = null;
        let checkFunc = data.checkFunc ? data.checkFunc : (a: number, b: number) => {
            return isNaN(a) ? b : (isNaN(b) ? a : (a > b ? a : b));
        }
        data.targets.forEach((element: any) => {
            if (value == null) {
                value = element;
            } else {
                value = checkFunc(value, element);
            }
        });
        return value;
    }
    /**获取最小的那个 */
    public getMin(data: {
        /**检测目标 */
        targets: any[],
        /**自定义检测函数 */
        checkFunc?: (...args: any[]) => any
    }) {
        let value: any = null;
        let checkFunc = data.checkFunc ? data.checkFunc : (a: number, b: number) => {
            return isNaN(a) ? a : (isNaN(b) ? b : (a < b ? a : b));
        }
        data.targets.forEach((element: any) => {
            if (value == null) {
                value = element;
            } else {
                value = checkFunc(value, element);
            }
        });
        return value;
    }
    /**获得Int最大值 */
    public getIntMax(): number {
        return 2 ** 32 / 2 - 1;
    }
    /**强转为number */
    public toNumber(data: any): number {
        return Number(data);
    }
    /**格式化数值：1 => `01`，1 => `001` ... */
    public formatNumberForZore(value1: number | string, length: number = 2): string {
        return `${value1}`.padStart(length, `0`);
    }
    /**格式化数值：1 => `1.0`，1 => `1.00` ... */
    public formatFloatForZore(value1: number | string, length: number = 2): string {
        let num = `${value1}`.split(`.`);
        return `${num[0]}.${`${num[1] ?? 0}`.slice(0, length).padEnd(length, `0`)}`;
    }
    /**date.getYear(); 获取当前年份(2位)
       date.getFullYear(); 获取完整的年份(4位,1970-????)
       date.getMonth(); 获取当前月份(0-11,0代表1月)
       date.getDate(); 获取当前日(1-31)
       date.getDay(); 获取当前星期X(0-6,0代表星期天)
       date.getTime(); 获取当前时间(从1970.1.1开始的毫秒数)
       date.getHours(); 获取当前小时数(0-23)
       date.getMinutes(); 获取当前分钟数(0-59)
       date.getSeconds(); 获取当前秒数(0-59)
       date.getMilliseconds(); 获取当前毫秒数(0-999)
       date.toLocaleDateString(); 获取当前日期
       date.toLocaleTimeString(); 获取当前时间
       date.toLocaleString( ); 获取日期与时间
    */
    /**获得当前时间戳 (毫秒) */
    public millisecond(): number {
        return new Date().getTime();
    }
    /**获得当前时间戳 (秒) */
    public time(needMS = false): number {
        if (needMS) {
            return this.millisecond() / 1000;
        }
        return parseInt((this.millisecond() / 1000).toString());
    }
    /**获取时间戳（毫秒级）
     * @description YYYY[-/]MM[-/]DD HH:mm:ss:ms
     * @description HH:mm:ss:ms YYYY[-/]MM[-/]DD 
     * @example timestamp(`2020-02-02 02:02:02:0202`) => 1580580122202
     * @example timestamp(`02:02:02:0202 2020/02/02`) => 1580580122202
     */
    public timestamp(formatTime: string): number {
        return new Date(formatTime).getTime();
    }
    /**毫秒级时间戳 -> 格式化时间 年-月-日 -> 2022-08-08 */
    public time_YMD(time?: number | string): string {
        // let tempTime = new Date(time ?? new Date());
        // return `${this.formatNumberForZore(tempTime.getFullYear())}-${this.formatNumberForZore(tempTime.getMonth() + 1)}-${this.formatNumberForZore(tempTime.getDate())}`;
        return dayjs.unix(app.func.toNumber(time ?? app.func.time())).format(`YYYY-MM-DD`);
    }
    /**毫秒级时间戳 -> 格式化时间 年-月-日 时:分:秒 -> 2022-08-08 15:08:08 */
    public time_YMDHMS(time?: number | string): string {
        // let tempTime = new Date(time ?? new Date());
        // return `${this.formatNumberForZore(tempTime.getFullYear())}-${this.formatNumberForZore(tempTime.getMonth() + 1)}-${this.formatNumberForZore(tempTime.getDate())} ${this.formatNumberForZore(tempTime.getHours())}:${this.formatNumberForZore(tempTime.getMinutes())}:${this.formatNumberForZore(tempTime.getSeconds())}`;
        return dayjs.unix(app.func.toNumber(time ?? app.func.time())).format(`YYYY-MM-DD HH:mm:ss`);
    }
    /**毫秒级时间戳 -> 格式化时间 时:分:秒 -> 15:08:08 */
    public time_HMS(time?: number | string): string {
        // let tempTime = new Date(time ?? new Date());
        // return `${this.formatNumberForZore(tempTime.getHours())}:${this.formatNumberForZore(tempTime.getMinutes())}:${this.formatNumberForZore(tempTime.getSeconds())}`;
        return dayjs.unix(app.func.toNumber(time ?? app.func.time())).format(`HH:mm:ss`);
    }
    /**毫秒级时间戳 -> 格式化时间 时:分(AP, PM), 日 月(英文月份) -> 15:08PM, 05 Jan  */
    public time_HM_DM(time?: number | string): string {
        // let tempTime = new Date(time ?? new Date());
        // let nHValue = tempTime.getHours();
        // let half = nHValue > 12 ? `PM` : `AM`;
        // let hours = this.formatNumberForZore(nHValue % 12);
        // let minutes = this.formatNumberForZore(tempTime.getMinutes());
        // let date = this.formatNumberForZore(tempTime.getDate());
        // return `${hours}:${minutes}${half}, ${date} ${MonthEn[tempTime.getMonth()]}`;
        return dayjs.unix(app.func.toNumber(time ?? app.func.time())).format(`HH:mmA, DD MMM`);
    }
    /**毫秒级时间戳 -> 格式化时间 时:分(AP, PM) -> 15:08PM  */
    public time_HM(time?: number | string): string {
        // let tempTime = new Date(time ?? new Date());
        // let nHValue = tempTime.getHours();
        // let half = nHValue > 12 ? `PM` : `AM`;
        // let hours = this.formatNumberForZore(nHValue % 12);
        // let minutes = this.formatNumberForZore(tempTime.getMinutes());
        // return `${hours}:${minutes}${half}`;
        return dayjs.unix(app.func.toNumber(time ?? app.func.time())).format(`HH:mmA`);
    }
    /**毫秒级时间戳 -> 格式化时间 时:分 日/月/年 -> 15:15 05/05/2005  */
    public time_HM_DMY(time?: number | string): string {
        return dayjs.unix(app.func.toNumber(time ?? app.func.time())).format(`HH:mm DD/MM/YYYY`);
    }
    /**获取指定年月的天数 */
    public getDays(year: number, month: number) {
        let bigmonth = `(1)(3)(5)(7)(8)(10)(12)`;
        let strmonth = `(${month})`;
        if (month == 2) {
            if (year % 4 == 0 || (year % 400 == 0 && year % 400 != 0)) {
                return 29;
            } else {
                return 28;
            }
        } else if (bigmonth.match(strmonth)) {
            return 31;
        } else {
            return 30;
        }
    }
    /**获取随机数 [min,max]*/
    public getRandomNum(Min: number, Max: number): number {
        let Range = Max - Min;
        let Rand = Math.random();
        return (Min + Math.round(Rand * Range));
    }
    /**金额用','隔开，例如：10000 => 10,000 千分 */
    public formatNumberForComma(data: number | string) {
        // let list = [];
        // let str = `${data}`;
        // for (let i = str.length - 1, j = 1; i >= 0; --i, ++j) {
        //     list.unshift(str[i]);
        //     j % 3 == 0 && list.unshift(`,`);
        // }
        // if (list[0] == `,`) {
        //     list.shift();
        // }
        // return list.join(``);
        var parts = data.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".");
    }
    /**深拷贝, circularReference参数无需手动传入  */
    public clone<T>(oldObj: T, circularReference: Map<any, any> = new Map()): T {
        // //伪深拷贝（只深copy了第一层属性）
        // //const newOne = Object.assign({}, target);
        // //真深拷贝（但是会破坏原有结构，丢失function，只剩属性变量）
        // const newOne = JSON.parse(JSON.stringify(target));
        // //真深拷贝（网上说可以，但测试似乎有问题，只深copy了第一层属性）
        // // const newOne = Object.create(Object.getPrototypeOf(target), Object.getOwnPropertyDescriptors(target));
        // //新对象
        // return newOne;
        let newObj: any;
        if (circularReference.has(oldObj)) {
            return circularReference.get(oldObj);
        }
        if (oldObj instanceof Array) {
            newObj = [];
            circularReference.set(oldObj, newObj);
            oldObj.forEach((element: any, index: AnyKeyType) => {
                newObj[index] = this.clone(element, circularReference);
            });
            let proto = Object.getPrototypeOf(oldObj);
            if (!fw.isNull(proto)) {
                Object.setPrototypeOf(newObj, proto);
            }
            return newObj;
        } else if (oldObj instanceof Map) {
            newObj = new Map();
            circularReference.set(oldObj, newObj);
            oldObj.forEach((element: any, index: any) => {
                newObj.set(this.clone(index, circularReference), this.clone(element, circularReference));
            });
            let proto = Object.getPrototypeOf(oldObj);
            if (!fw.isNull(proto)) {
                Object.setPrototypeOf(newObj, proto);
            }
            return newObj;
        } else if (typeof (oldObj) == `object` && oldObj != null) {
            newObj = {};
            circularReference.set(oldObj, newObj);
            Object.getOwnPropertyNames(oldObj).forEach(k => {
                newObj[k] = this.clone(oldObj[k], circularReference);
            });
            let proto = Object.getPrototypeOf(oldObj);
            if (!fw.isNull(proto)) {
                Object.setPrototypeOf(newObj, proto);
            }
            return newObj;
        } else {
            return oldObj;
        }
    }
    /**遍历 */
    public traversal<T>(reverse: boolean, list: readonly T[] | Map<any, T>, callback: (element: T, key: any) => boolean | void): boolean | void {
        return reverse ? this.reverseTraversal(list, callback) : this.positiveTraversal(list, callback);
    }
    /**逆序遍历 */
    public reverseTraversal<T>(list: readonly T[] | Map<any, T>, callback: (element: T, key: any) => boolean | void): boolean | void {
        if (fw.isNull(list)) {
            return;
        }
        if (list instanceof Map) {
            return this.reverseTraversal(Array.from(list.keys()), (key) => {
                if (callback(list.get(key), key)) {
                    //中断
                    return true;
                }
            });
        } else {
            for (let i = list.length - 1; i >= 0; --i) {
                if (callback(list[i], i)) {
                    //中断
                    return true;
                }
            }
        }
        return false;
    }
    /**正序遍历 */
    public positiveTraversal<T>(list: readonly T[] | Map<any, T>, callback: (element: T, key: any) => boolean | void): boolean | void {
        if (fw.isNull(list)) {
            return;
        }
        if (list instanceof Map) {
            return this.positiveTraversal(Array.from(list.keys()), (key) => {
                if (callback(list.get(key), key)) {
                    //中断
                    return true;
                }
            });
        } else {
            for (let i = 0; i < list.length; ++i) {
                if (callback(list[i], i)) {
                    //中断
                    return true;
                }
            }
        }
        return false;
    }
    /**遍历对象 */
    public traversalObject<T>(obj: { [key: AnyKeyType]: T }, callback: (element: T, key: keyof typeof obj) => boolean | void): void {
        if (fw.isNull(obj)) {
            return;
        }
        this.positiveTraversal(Object.keys(obj), (key) => {
            return callback(obj[key], key);
        });
    }
    /**避免精度问题 */
    public numberAccuracy(nValue: number): number {
        return this.toNumber((nValue + 0.000001).toFixed(2));
    }
    /**值为number的对象（返回一个空表，当键值不存在时会自动赋值为0） */
    public numberObj(obj?: Object): any {
        return new Proxy(<any>(obj ?? {}), {
            get(target: object, p: AnyKeyType, receiver: any): number {
                let value = Reflect.get(target, p, receiver);
                if (value === undefined) {
                    value = 0;
                    Reflect.set(target, p, value);
                }
                return value;
            }
        });
    }
    /**判断是否是手机电话号码 */
    public isCorrectPhoneNumber(phone: string | number): boolean {
        //转为string
        phone = `${phone}`;
        //号码只能是10位或11位
        if (!(phone.length == 10 || phone.length == 11)) {
            return false;
        }
        //号码必须全是数字
        if (!phone.match(/^\d+$/)) {
            return false;
        }
        return true;
    }
    /**移除字符串 `\s` 匹配的字符 */
    public stringRemoveSpace(str: string): string {
        return str.replace(/\s/g, ``);
    }
    /**判断是否是正确的邮箱 */
    public isCorrectEmail(email: string): boolean {
        return !!email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
        // return !!email.match(/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/);
    }


    // 判断是否为数组
    public isArr = <T>(origin: T): boolean => {
        let str = '[object Array]'
        return Object.prototype.toString.call(origin) == str ? true : false
    }

    /**深度copy */
    public deepCopy = (origin: any, target?: Record<string, any> | any): any => {
        let tflag = this.isArr(origin);
        let tar;
        if (fw.isNull(target)) {
            tar = tflag ? [] : {};
        } else {
            tar = target;
        }

        for (const key in origin) {
            if (Object.prototype.hasOwnProperty.call(origin, key)) {
                if (typeof origin[key] === 'object' && typeof origin[key] !== null) {
                    tar[key] = this.isArr(origin[key]) ? [] : {}
                    this.deepCopy(origin[key], tar[key])
                } else {
                    tar[key] = origin[key]
                }
            }
        }
        return tar
    }
    /**字符串 转 URI 编码组件 */
    encodeURIComponent(uriComponent: string | number | boolean) {
        return encodeURIComponent(uriComponent);
    }
    /**URI 编码组件 转 string */
    decodeURIComponent(encodedURIComponent: string) {
        return decodeURIComponent(encodedURIComponent);
    }
    /**string转base64 */
    stringToBase64(str: string) {
        return btoa(this.encodeURIComponent(str));
    }
    /**base64转string */
    base64ToString(base64: string) {
        return atob(base64);
    }
    /**utf8转string */
    utf8ToString(utf8: number[] | Uint8Array | string) {
        if (typeof utf8 === `string`) {
            return utf8;
        }
        let str = ``, _arr = utf8;
        for (let i = 0; i < _arr.length; i++) {
            let one = _arr[i].toString(2), v = one.match(/^1+?(?=0)/);
            if (v && one.length == 8) {
                let bytesLength = v[0].length;
                let store = _arr[i].toString(2).slice(7 - bytesLength);
                for (let st = 1; st < bytesLength; st++) {
                    store += _arr[st + i].toString(2).slice(2);
                }
                str += String.fromCharCode(parseInt(store, 2));
                i += bytesLength - 1;
            } else {
                str += String.fromCharCode(_arr[i]);
            }
        }
        return str;
    }
    /**string转utf8Bytes */
    stringToUtf8(str: string): number[] {
        let c: string;
        const bytes: number[] = [];
        const code = encodeURIComponent(str);
        for (let i = 0; i < code.length; i++) {
            c = code.charAt(i);
            //方式1
            if (c === `%`) {
                bytes.push(parseInt(code.charAt(i + 1) + code.charAt(i + 2), 16));
                i += 2;
            } else {
                bytes.push(c.charCodeAt(0));
            }
            //方式2
            // if (c >= 0x010000 && c <= 0x10FFFF) {
            //     bytes.push(((c >> 18) & 0x07) | 0xF0);
            //     bytes.push(((c >> 12) & 0x3F) | 0x80);
            //     bytes.push(((c >> 6) & 0x3F) | 0x80);
            //     bytes.push((c & 0x3F) | 0x80);
            // } else if (c >= 0x000800 && c <= 0x00FFFF) {
            //     bytes.push(((c >> 12) & 0x0F) | 0xE0);
            //     bytes.push(((c >> 6) & 0x3F) | 0x80);
            //     bytes.push((c & 0x3F) | 0x80);
            // } else if (c >= 0x000080 && c <= 0x0007FF) {
            //     bytes.push(((c >> 6) & 0x1F) | 0xC0);
            //     bytes.push((c & 0x3F) | 0x80);
            // } else {
            //     bytes.push(c & 0xFF);
            // }
        }
        return bytes;
    }
    /**string转blob */
    stringToBlob(str: string) {
        return new Blob([str]);
    }
    /**blob转string */
    blobToString(blob: Blob, callback: (str: string) => void) {
        let reader = new FileReader();
        reader.readAsText(blob, `utf-8`);
        reader.onload = (e) => {
            callback(<string>reader.result);
        }
    }
    /**blob转base64 */
    blobToBase64(blob: Blob, callback: (base64: string) => void) {
        let a = new FileReader();
        a.onload = function (e) {
            callback(<string>e.target.result);
        }
        a.readAsDataURL(blob);
    }
    /**arraybuffer转string */
    arrayBufferToString(arrayBuffer: ArrayBuffer) {
        const uint8Array = new Uint8Array(arrayBuffer);
        return String.fromCharCode.apply(null, uint8Array);
    }
    /**string转arraybuffer */
    stringToArrayBuffer(str: string) {
        const buffer = new ArrayBuffer(str.length);
        const uint8Array = new Uint8Array(buffer);
        for (let i = 0; i < str.length; ++i) {
            uint8Array[i] = str.charCodeAt(i);
        }
        return buffer;
    }
    /**arraybuffer转base64 */
    arrayBufferToBase64(arrayBuffer: ArrayBuffer) {
        const uint8Array = new Uint8Array(arrayBuffer);
        let base64 = ``;
        let a: number, b: number, c: number, b1: number, b2: number, b3: number, b4: number;
        const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        for (let i = 0; i < uint8Array.length; i += 3) {
            a = uint8Array[i];
            b = uint8Array[i + 1];
            c = uint8Array[i + 2];
            b1 = (a >> 2) & 0x3F;
            b2 = ((a & 0x3) << 4) | ((b >> 4) & 0xF);
            b3 = ((b & 0xF) << 2) | ((c >> 6) & 0x3);
            b4 = c & 0x3F;
            base64 += base64Chars[b1] + base64Chars[b2] + base64Chars[b3] + base64Chars[b4];
        }
        //处理剩余字节
        const remaining = uint8Array.length % 3;
        if (remaining === 1) {
            a = uint8Array[uint8Array.length - 1];
            b1 = (a >> 2) & 0x3F;
            b2 = (a & 0x3) << 4;
            base64 += base64Chars[b1] + base64Chars[b2] + '==';
        } else if (remaining === 2) {
            a = uint8Array[uint8Array.length - 2];
            b = uint8Array[uint8Array.length - 1];
            b1 = (a >> 2) & 0x3F;
            b2 = ((a & 0x3) << 4) | ((b >> 4) & 0xF);
            b3 = (b & 0xF) << 2;
            base64 += base64Chars[b1] + base64Chars[b2] + base64Chars[b3] + '=';
        }
        return base64;
        //这种方式由于要拼接太多的字符串，性能比较低
        // let binary = ``;
        // const uint8Array = new Uint8Array(arrayBuffer);
        // for (let i = 0; i < uint8Array.length; i++) {
        //     binary += String.fromCharCode(uint8Array[i]);
        // }
        // return btoa(binary);
        //这种方式在原生上可能会报"Maximum call stack size exceeded"
        // return btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));
    }
    /**arraybuffer转blob */
    arrayBufferToBlob(arrayBuffer: ArrayBuffer) {
        return new Blob([new Uint8Array(arrayBuffer)]);
    }
    /**base64转blob */
    base64ToBlob(base64: string) {
        //提取base64头的type如 `image/png`
        let type = base64.split(`,`)[0].match(/:(.*?);/)[1];
        //去掉url的头，并转换为byte (atob:编码 btoa:解码)
        let bytes = atob(base64.split(`,`)[1]);
        //处理异常，将ascii码小于0的转换为大于0，通用的、固定长度(bytes.length)的原始二进制数据缓冲区对象
        let ia = new Uint8Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        return new Blob([ia], { type: type });
        // let ab = new ArrayBuffer(bytes.length);
        // for (let i = 0; i < bytes.length; i++) {
        //     ab[i] = bytes.charCodeAt(i);
        // }
        // return new Blob([ab], { type: type });
    }
    /**base64转file */
    base64ToFile(base64: string, filename = `file`) {
        let arr = base64.split(`,`);
        let mime = arr[0].match(/:(.*?);/)[1];
        let suffix = mime.split(`/`)[1];
        let bstr = atob(arr[1]);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], `${filename}.${suffix}`, { type: mime });
    }
    /**string转array<number> */
    public stringToArray(str: string): Array<number> {
        let array = new Array<number>(str.length);
        for (let i = 0, il = str.length; i < il; ++i) {
            array[i] = str.charCodeAt(i) & 0xff;
        }
        return array;
    }
    /**object转string */
    public objectToString(o: any) {
        let r = [];
        let s = ``;
        if (typeof o == `string`) return `\"${o.replace(/([\'\"\\])/g, `\\$1`).replace(/(\n)/g, `\\n`).replace(/(\r)/g, `\\r`).replace(/(\t)/g, `\\t`)}\"`;
        if (typeof o == `object`) {
            if (!o.sort) {
                for (let i in o) {
                    r.push(`${i}:${this.objectToString(o[i])}`);
                }
                if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
                    r.push(`toString:${o.toString.toString()}`);
                }
                s = `{${r.join()}}`;
            } else {
                for (let i = 0; i < o.length; i++) {
                    r.push(this.objectToString(o[i]))
                }
                s = `[${r.join()}]`;
            }
            return s;
        }
        return o.toString();
    }
    /**去除字符串空格
     * value：要去除空格的字符串
     * type： 1-所有空格 2-前后空格 3-前空格 4-后空格
     */
    public trim(value: string, type: any) {
        switch (type) {
            case 1:
                return value.replace(/\s+/g, ``);
            case 2:
                return value.replace(/(^\s*)|(\s*$)/g, ``);
            case 3:
                return value.replace(/(^\s*)/g, ``);
            case 4:
                return value.replace(/(\s*$)/g, ``);
            default:
                return value;
        }
    }
    /**去除路径中重复的正反斜杆 */
    removePathRepeatDiagonal(filePath: string) {
        return filePath.replace(/\\+/g, `\\`).replace(/\/+/g, `/`);
    }
    /**函数耗时 */
    calculationTimeConsumption(data: {
        /**标识符 */
        tag: string
        /**耗时函数 */
        func: (index: number) => void
        /**运行次数，默认10000次 */
        time?: number
    }) {
        //在函数开始时调用 console.time()
        console.time(`time consuming: ${data.tag}`);
        //函数执行的代码
        for (let i = 0, j = data.time ?? 10000; i < j; ++i) {
            data.func(i);
        }
        //在函数结束时调用 console.timeEnd()
        console.timeEnd(`time consuming: ${data.tag}`);
    }
    /**测试一个点是否在一个多边形中，（重要：polygon 点需要顺序传入，可以是顺时针也可以是逆时针） */
    pointInPolygon(point: Point2DParam, polygon: Point2DParam[]): boolean {
        let inside = false;
        const x = point.x;
        const y = point.y;
        let xi: number;
        let yi: number;
        let xj: number;
        let yj: number;
        // use some raycasting to test hits
        // https://github.com/substack/point-in-polygon/blob/master/index.js
        for (let i = 0, j = polygon.length, k = j - 1; i < j; k = i++) {
            xi = polygon[i].x;
            yi = polygon[i].y;
            xj = polygon[k].x;
            yj = polygon[k].y;
            if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
                inside = !inside;
            }
        }
        return inside;
    }
    /**获取多边形中的随机一个点（随机重复测试） */
    getPointInPolygon(polygon: Point2DParam[]): Point2DParam {
        let minX: number, minY: number, maxX: number, maxY: number;
        polygon.forEach(element => {
            if (fw.isNull(minX) || minX > element.x) {
                minX = element.x;
            }
            if (fw.isNull(minY) || minY > element.y) {
                minY = element.y;
            }
            if (fw.isNull(maxX) || maxX < element.x) {
                maxX = element.x;
            }
            if (fw.isNull(maxY) || maxY < element.y) {
                maxY = element.y;
            }
        });
        //位置
        let pos: Point2DParam = { x: 0, y: 0 };
        //循环测试
        while (true) {
            pos.x = Math.random() * (maxX - minX) + minX;
            pos.y = Math.random() * (maxY - minY) + minY;
            if (this.pointInPolygon(pos, polygon)) {
                return pos;
            }
        }
    }
    /**Promise */
    doPromise<T>(executor: (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void) {
        let failed: (reason?: any) => void;
        const stack = app.func.isBrowser() ? new Error().stack : ``;
        return <Promise<T>>(
            new Promise<T>((resolveEx, rejectEx) => {
                failed = rejectEx;
                executor(resolveEx, (e) => {
                    fw.printError(stack);
                    rejectEx(e);
                });
            }).catch((e) => {
                fw.printError(stack);
                fw.printError(e);
                failed?.(e);
            })
        );
    }
    /**??? */
    toArray(data: any[]) {
        function getArray(data: any[]) {
            let ret = [];
            data.forEach((v: any, i) => {
                try {
                    if (v.data instanceof Array) {
                        ret[i] = getArray(v.data)
                    } else {
                        ret[i] = v;
                    }
                } catch (error) {
                    ret[i] = v;
                }
            })
            return ret;
        }
        return getArray(data);
    }
    setStringLimitWidth(view: ccNode, str: string, limitWidth: number, defaultSuffix: string) {
        let view_l = view.getComponent(Label);
        view_l.string = str;
        let t = view.clone();
        let l = t.getComponent(Label);
        l.overflow = Overflow.NONE;
        l.string = str;
        l.updateRenderData(true);
        let view_width = t.size.width
        limitWidth = limitWidth || view_width
        defaultSuffix = defaultSuffix || ""
        if (view_width > limitWidth) {
            let len = str.length;
            let lIndex = 0;
            let mIndex = 0;
            let rIndex = len;
            let str_ = ""
            while (rIndex > lIndex) {
                mIndex = Math.ceil((rIndex + lIndex) / 2);
                str_ = str.substring(1, mIndex)
                l.string = str_ + defaultSuffix;
                l.updateRenderData(true);
                view_width = t.size.width
                if (view_width == limitWidth) {
                    break
                } else if (view_width < limitWidth) {
                    lIndex = mIndex + 1
                } else {
                    rIndex = mIndex - 1
                }
            }
            view_l.string = l.string;
        }
        return l.string
    }
}

export function randomInt(s: number, e?: number) {
    if (!e) {
        e = s;
        s = 0;
    }
    e++;
    let offset = e - s;
    return Math.floor(Math.random() * offset) + s;
}

/**
 * 类型声明调整
 */
declare global {
    namespace globalThis {
        /**2D点 */
        type Point2DParam = {
            x: number
            y: number
        }
        /**反馈参数 */
        type FeedbackParam = {
            /**玩家userID */
            userID?: number | string
            /**邮件 */
            email?: string
            /**手机 */
            phone?: string
            /**反馈描述 */
            content: string
            /**反馈类型 */
            feedbackType: number | string
            /**订单号 */
            utr?: string
            /**文件 */
            file?: any
            /**图片路径 */
            filePath?: string
            /**提现ID */
            recharge_id?: number | string
            /**反馈回调 */
            callback?: (data: any) => void
        }
    }
}
