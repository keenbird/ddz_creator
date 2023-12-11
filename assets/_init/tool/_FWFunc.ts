import './../other/_FWLogManager'
import './../__init'

import { isValid } from 'cc';

//部分全局可用函数
//（注意：主要定义用于全局作用域下的函数）
//（注意：主要定义用于全局作用域下的函数）
//（注意：主要定义用于全局作用域下的函数）

/**事件id */
fw.__eventIndex = 0
/**获取event唯一ID */
fw.getEventID = (data?: GetEventIDParam) => {
    if (data) {
        if (data.obj) {
            Object.keys(data.obj).forEach((element, index) => {
                data.obj[element] = ++fw.__eventIndex;
            });
        } else if (data.enum) {
            Object.keys(data.enum).forEach((element, index) => {
                if (isNaN(Number(element))) {
                    data.enum[element] = ++fw.__eventIndex;
                    data.enum[fw.__eventIndex] = element;
                } else {
                    delete data.enum[element];
                }
            });
        } else if (data.list) {
            data.list.forEach((element, index) => {
                data.list[index] = ++fw.__eventIndex;
            });
        } else {
            //TODO
        }
    } else {
        return ++fw.__eventIndex;
    }
}

/**获取属性特性描述对象 */
fw.configurable = function (data?: ConfigurableParam) {
    return Object.assign(<ConfigurableParam>{
        writable: true,
        enumerable: true,
    }, data ?? {});
}

/**将对象转为any */
fw.any = function (data: object) {
    return data;
}

/**执行动态代码 */
fw.doJavascript = function (javascriptCode: string) {
    //方式1，Function 创建的函数有自己的作用域，其父作用域是全局作用域，只能访问全局变量和自己的局部变量，不能访问函数被创建时所在的作用域。需要注意在 node 环境和 esm 环境存在模块作用域，模块作用域不是全局作用域。Function 创建的函数也不能访问模块作用域。
    return new Function(javascriptCode)();
    //方式2，eval 没有自己的作用域，而是使用执行时所在的作用域，在 eval 中初始化语会将变量加入到当前作用域。由于变量是在运行时动态添加的，导致 v8 引擎不能做出正确的判断，只能放弃优化策略。在严格模式下，eval 有自己的作用域，这样就不会污染当前作用域。
    // return eval(javascriptCode);
    //方式3，这种方式是异步的，没有自己的作用域，其执行时作用域是全局作用域。
    // setTimeout(javascriptCode, 0);
}

/**获取错误信息 */
fw.getErroMessage = function (e) {
    if (typeof e === "string") {
        return e;
    } else if (e instanceof Error) {
        return e.message;
    }
    return "unknow";
}

/**item === undefined || item === null || (typeof (data) == `number` && isNaN(data)) */
fw.isNull = function (data: any) {
    return data === undefined || data === null || (typeof (data) == `number` && isNaN(data));
}

/**对象是否无效item === undefined || item === null || item === NaN || !isValid(item, true) */
fw.isValid = function (data: any) {
    let datas = (data instanceof Array) ? data : [data];
    for (let i = 0, j = datas.length; i < j; ++i) {
        if (fw.isNull(datas[i]) || !isValid(datas[i], true)) {
            return false;
        }
    }
    return true;
}

declare global {
    namespace globalThis {
        type GetEventIDParam = {
            /**枚举类型object */
            enum?: Object
            /**非枚举类型object */
            obj?: Object
            /**数组 */
            list?: (string | number)[]
        }
        type ConfigurableParam = {
            /**设置xxx的值，不设置的话默认为undefined 后续不再显示value */
            value?: any
            /**表示属性的值不可以被修改 */
            writable?: boolean
            /**设置为false表示不能通过 for-in 循环返回 */
            enumerable?: boolean
            /**configurable 设置为 false，意味着这个属性不能从对象上删除 */
            configurable?: boolean
            /**get */
            get?: () => any
            /**set */
            set?: (value: any) => boolean
        }
        interface _fw {
            /**事件id */
            __eventIndex: number
            /**获取event唯一ID */
            getEventID: (data?: GetEventIDParam) => number | null
            /**获得一个configurable */
            configurable: (data?: ConfigurableParam) => ConfigurableParam
            /**执行动态代码 */
            doJavascript: (javascriptCode: string) => any
            /**获得错误消息内容 */
            getErroMessage: (e: any) => string
            /**对象是否无效 item === undefined || item === null || (typeof (data) == `number` && isNaN(data)) */
            isNull: (data: any) => boolean
            /**对象是否有效 !(item === undefined || item === null || item === NaN || !isValid(item, true)) */
            isValid: (data: any) => boolean
            /**将对象转为any */
            any: (data: object) => any
        }
    }
}
