import { _decorator, native } from 'cc';
const { ccclass } = _decorator;

import { DeviceBase } from './DeviceBase';

import { MODULE_NAME } from '../../config/ModuleConfig';

@ccclass('NativeBase')
export abstract class NativeBase extends (fw.FWComponent) {
    initData() {
        /**初始模块 */
        Object.keys(MODULE_NAME).forEach(key=>{
            if(key in this) {
                this[key]
            }
        })
    }

    /**默认android包装器包名 */
    strAndroidPackagePath = "com/cocos/service"
    /**统一调用入口 */
    call(data: SDKCallParamAndroid, ...args: any[]): any {
        fw.print("callStaticMethod", data, ...args);
        let strClassName = data.strClassName ?? "Test";
        let strAndroidPackagePath = data.strAndroidPackagePath ?? this.strAndroidPackagePath;
        if (app.func.isIOS()) {
            return native.reflection.callStaticMethod(strAndroidPackagePath + '/' + strClassName, data.funcName, ...args);
        } else {
            //strFuncParam的检测int和float不是很明确，如果原生形参类型为float最好自己传入strFuncParam，此外自动参数的返回值固定是"V"(void)
            let strFuncParam = data.strFuncParam;
            if (!strFuncParam) {
                strFuncParam = "";
                args.forEach((element) => {
                    switch (typeof (element)) {
                        case "string":
                            strFuncParam = strFuncParam + "Ljava/lang/String;"
                        case "boolean":
                            strFuncParam = strFuncParam + "Z"
                        case "number":
                            let numberE = app.func.toNumber(element);
                            strFuncParam = strFuncParam + ((Math.ceil(numberE) > numberE) ? "F" : "I")
                    }
                });
                strFuncParam = strFuncParam == "" ? "()V" : ("(" + strFuncParam + ")V");
            }
            return native.reflection.callStaticMethod(strAndroidPackagePath + '/' + strClassName, data.funcName, strFuncParam, ...args);
        }
    }
    /**device */
    abstract get device(): DeviceBase;

}

/**类型声明调整 */
declare global {
    namespace globalThis {
        type SDKCallParamAndroid = {
            /**包路径 */
            strAndroidPackagePath?: string
            /**类名 */
            strClassName?: string
            /**函数名 */
            funcName: string
            /**参数类型 */
            strFuncParam?: string
        }
    }
}
