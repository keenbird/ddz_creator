import { native, sys } from 'cc';
import './../__init'

let testConfig = {
    /**选服开关 */
    bSelectServer: true,
    /**锁定Win32 */
    bLockWin: false,
    /**显隐FPS等信息 */
    bDisplayStats: true,
    /**游戏热更开关*/
    bGameUpdate: sys.os != sys.OS.WINDOWS,
    /**热更是否校验MD5值 */
    bCheckMd5: false,
    /**是否启用php代理服务器ip端口 */
    bServerProxy: false,
    /**渠道号 */
    sChannelID: "1",
    /**包名 */
    sPackageName: "1",
}
if (sys.isNative) {
    let path = "config.json"
    if (native.fileUtils.isFileExist(path)) {
        try {
            let str = native.fileUtils.getStringFromFile(path);
            let data = JSON.parse(str);
            testConfig = {
                /**选服开关 */
                bSelectServer: data.bSelectServer ?? false,
                /**锁定Win32 */
                bLockWin: data.bLockWin ?? false,
                /**显隐FPS等信息 */
                bDisplayStats: data.bDisplayStats ?? false,
                /**游戏热更开关*/
                bGameUpdate: data.bGameUpdate ?? sys.os != sys.OS.WINDOWS,
                /**热更是否校验MD5值 */
                bCheckMd5: data.bCheckMd5 ?? false,
                /**是否启用php代理服务器ip端口 */
                bServerProxy: data.bServerProxy ?? true,
            }
        } catch (error) {
            console.error(error);
        }
    }
}

/**声明全局调用 */
declare global {
    namespace globalThis {
        interface _fw {
            DEBUG: typeof testConfig
        }
    }
}

fw.DEBUG = testConfig