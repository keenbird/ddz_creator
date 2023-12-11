import './../other/_FWLogManager'
import './_FWConfig'
import './../__init'

let bundle = fw.config.bundle

//赋值全局变量
fw.BundleConfig = new Proxy(<any>{}, {
    get(target: object, p: string, receiver: any): BundleConfigType {
        let value = Reflect.get(target, p, receiver);
        if (value === undefined) {
            let item: any = {};
            //子包名为key名
            item.bundleName = p;
            //res配置
            item.res = new Proxy({}, {
                get(target: object, p: string, receiver: any): BundleResConfig {
                    return { path: p, bundleName: item.bundleName, all: `${item.bundleName}/${p}` };
                },
                set(target: object, p: string, value: any, receiver: any): boolean {
                    fw.printWarn(`BundleConfig res onlyread`);
                    return false;
                }
            });
            value = item;
            Reflect.set(target, p, value);
        }
        return value;
    }
});

/**类型声明调整 */
declare global {
    namespace globalThis {
        /**子包配置 */
        type BundleConfigType = {
            /**包名称 */
            bundleName?: string
            /**资源配置 */
            res?: { [key: string]: BundleResConfig }
        }
        /**子包界面配置 */
        type BundleResConfig = {
            /**资源路径 */
            path: string
            /**子包名称 */
            bundleName: string
            /**全路径 */
            all: string
        }
    }
}

/**声明全局调用 */
declare global {
    namespace globalThis {
        interface _fw {
            BundleConfig: typeof bundle & { [key: string]: BundleConfigType }
        }
    }
}
