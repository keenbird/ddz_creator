import './../config/_FWTestConfigs'
import '../other/_FWLogManager'
import '../__init'

/**测试模式下才生效 */
const classDecorator = function (func: Function, bAvailable?: boolean) {
    return bAvailable ?? !fw.DEBUG.bServerProxy ? func : (value: any) => {
        //传参形式，添加修饰器方式：@classDecorator(value)
        return function (target: any) {
            //TODO
        }
    };
}
const functionDecorator = function (func: Function, bAvailable?: boolean) {
    return bAvailable ?? !fw.DEBUG.bServerProxy ? func : (value: any) => {
        return function (target: any, key: AnyKeyType, descriptor: any) {
            return descriptor;
        }
    };
}
const propertyDecorator = function (func: Function, bAvailable?: boolean) {
    return bAvailable ?? !fw.DEBUG.bServerProxy ? func : (value: any) => {
        return function (target: any, propertyName: string) {
            //TODO
        }
    };
}

/**修饰器，可查看文档: Decorator.d.ts */
const Decorator = {
    /**统计function耗时 */
    FuncTimeConsuming: functionDecorator(function (tag?: string) {
        let nMinTime = NaN;
        let nMaxTime = NaN;
        let nTotalTime = 0;
        let nTotalCount = 0;
        return function (target: any, key: AnyKeyType, descriptor: any) {
            const originalMethod = descriptor.value;
            descriptor.value = function (...args: any[]) {
                const nStartTime = new Date().getTime();
                const result = originalMethod.apply(this, args);
                const nDiff = new Date().getTime() - nStartTime;
                ++nTotalCount;
                nTotalTime += nDiff;
                nMinTime = isNaN(nMinTime) ? nDiff : Math.min(nMinTime, nDiff);
                nMaxTime = isNaN(nMaxTime) ? nDiff : Math.max(nMaxTime, nDiff);
                fw.print(`${tag ?? `${target.__classname__}.${key.toString()}`}: ${nDiff}ms`);
                return result;
            };
            return descriptor;
        };
    }),
    /**间隔执行（一段时间不重复执行，秒级） */
    IntervalExecution: functionDecorator(function (time: number, faildCallback?: (nLeftTime: number) => void) {
        return function (target: any, key: AnyKeyType, descriptor: any) {
            //数据异常时不处理
            if (typeof time == `number` && !isNaN(time)) {
                let nLast: number;
                const originalMethod = descriptor.value;
                descriptor.value = function (...args: any[]) {
                    const nNow = new Date().getTime();
                    if (nLast) {
                        const nDiff = (nNow - nLast) / 1000;
                        if (nDiff < time) {
                            faildCallback?.(nDiff);
                            return null;
                        }
                    }
                    nLast = nNow;
                    return originalMethod.apply(this, args);
                }
            }
            return descriptor;
        };
    }, true),
    /**try catch */
    TryCatch: functionDecorator(function (ret: any) {
        return function (target: any, key: string, descriptor: PropertyDescriptor) {
            const originalMethod = descriptor.value;
            descriptor.value = function (...args: any[]) {
                try {
                    return originalMethod.apply(this, args);
                } catch (error) {
                    fw.printError(error);
                    return ret;
                }
            };
        };
    }, true),
}
fw.Decorator = Decorator;

declare global {
    namespace globalThis {
        interface _fw {
            Decorator: typeof Decorator
        }
    }
}
