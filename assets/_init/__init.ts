import { dynamicAtlasManager, macro, sys } from "cc";
import { EDITOR } from "cc/env";

class _fw {

}
declare global {
    namespace globalThis {
        namespace fw {
            //TODO
        }
        var fw: _fw
        var PDVersion: number
    }
}

//强制开启动态合图
//macro.CLEANUP_IMAGE_CACHE = false;
//dynamicAtlasManager.enabled = true;
//关闭动态合图
dynamicAtlasManager.enabled = false;
//动态合图张数调整为8张
dynamicAtlasManager.maxAtlasCount = 8;
//动态合图单张大小限制调整
dynamicAtlasManager.maxFrameSize = 512;

//全局作用域下的调用
globalThis.fw = <any>new _fw();

//下面语句有用
//避免提示app找不到
globalThis.app = globalThis.app;
//避免提示jsb找不到
globalThis.jsb = globalThis.jsb;
//避免提示fsUtils找不到
globalThis.fsUtils = globalThis.fsUtils;

if (sys.isNative) {
    globalThis.PDVersion = globalThis.PDVersion ?? 0;
} else {
    globalThis.PDVersion = 10000
}

//错误输出特殊处理
if (!EDITOR) {
    if (sys.isBrowser && sys.os == sys.OS.WINDOWS) {
        //关闭浏览器error提示
        //方式1
        //通过代码将debugMode改为None，或者将浏览器上方的debugMode改为None。
        //方式2
        console.__error_old = console.error;
        console.error = (...data: any[]) => {
            console.__error_old(...data);
            Promise.resolve().then(() => {
                let element = document.getElementById(`error`);
                if (element) {
                    element.style.display = `none`;
                }
            });
        }
        //由于浏览器报错不提示，这里将报错转至console.error
        if (cc) {
            //cc异常输出
            (<any>cc)._throw = (...data: any[]) => {
                return console.error(...data);
            }
        }
        // window.__onerror_old = window.onerror;
        // window.onerror = (...data: any[]) => {
        //     window.__onerror_old(...data);
        // }
    }
}

/**
 * 类型声明调整
 */
declare global {
    namespace globalThis {
        /**native下才有该全局变量，fsUtils的定义在jsb-fs-utils.js中 */
        var fsUtils: any
    }
    interface Console {
        /**旧error */
        __error_old: (...data: any[]) => void
    }
}

export { }
