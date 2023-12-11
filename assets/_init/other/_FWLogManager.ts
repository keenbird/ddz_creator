import { _decorator } from 'cc';
const { ccclass } = _decorator;

import './../config/_FWTestConfigs'
import './../base/_FWClass'
import './../__init'

export enum DEBUG {
    none,
    error,
    warn,
    info,
    debug,
}
export const DEBUG_LEVEL = DEBUG.debug

@ccclass('_FWLogManager')
class _FWLogManager extends (fw.FWClass) {
    /**普通日志输出 */
    public static printDebug(...data: any[]): void {
        if (DEBUG_LEVEL >= DEBUG.debug) {
            if (!fw.DEBUG.bSelectServer) {
                return;
            }
            _FWLogManager.dealData(console.debug, ...data);
        }
    }
    /**普通日志输出 */
    public static print(...data: any[]): void {
        if (DEBUG_LEVEL >= DEBUG.info) {
            if (!fw.DEBUG.bSelectServer) {
                return;
            }
            _FWLogManager.dealData(console.log, ...data);
        }
    }
    /**警告日志输出 */
    public static printWarn(...data: any[]): void {
        if (DEBUG_LEVEL >= DEBUG.warn) {
            if (!fw.DEBUG.bSelectServer) {
                return;
            }
            _FWLogManager.dealData(console.warn, ...data);
        }
    }
    /**错误日志输出 */
    public static printError(...data: any[]): void {
        if (DEBUG_LEVEL >= DEBUG.error) {
            if (!fw.DEBUG.bSelectServer) {
                return;
            }
            _FWLogManager.dealData(console.error, ...data);
        }
    }
    /**获取堆栈 */
    public static getStack() {
        return fw.DEBUG.bSelectServer ? new Error().stack : ``;
    }
    /**处理数据 */
    public static dealData(callback: Function, ...data: any[]): any {
        // 打印比较耗时非自测不要打开
        // if (isValid(app, true) && !app.func.isBrowser() && !fw.isNull(data)) {
        //     app.func.positiveTraversal(data, (element: any, index: number) => {
        //         if (typeof (element) == `object`) {
        //             let cache = [];
        //             if (element instanceof Error) {
        //                 data[index] = element;
        //             } else {
        //                 data[index] = JSON.stringify(element, (key, value) => {
        //                     let type = typeof value
        //                     if (value !== null) {
        //                         //避免日志过多
        //                         if (key.charAt(0) == `_`) {
        //                             return;
        //                         }
        //                         if (type === `object`) {
        //                             // 移除
        //                             if (cache.indexOf(value) !== -1) {
        //                                 return;
        //                             }
        //                             // 收集所有的值
        //                             cache.push(value);
        //                         } else if (type == `bigint`) {
        //                             return value.toString();
        //                         } else {
        //                             //TODO
        //                         }
        //                     }
        //                     return value;
        //                 }, 2);
        //             }
        //             cache = null; // 清空变量，便于垃圾回收机制回收
        //         }
        //     });
        // }
        return callback(...data);
    }
}

declare global {
    namespace globalThis {
        interface _fw {
            printDebug: typeof _FWLogManager.printDebug
            print: typeof _FWLogManager.print
            printWarn: typeof _FWLogManager.printWarn
            printError: typeof _FWLogManager.printError
            getStack: typeof _FWLogManager.getStack
        }
    }
}
fw.printDebug = _FWLogManager.printDebug
fw.print = _FWLogManager.print
fw.printWarn = _FWLogManager.printWarn
fw.printError = _FWLogManager.printError
fw.getStack = _FWLogManager.getStack
