import { Node as ccNode, Component } from "cc"

declare global {
    namespace globalThis {
        /**是否是一个有效的对象 */
        type ValideTargetType = ccNode | Component
        /**任意键值类型 */
        type AnyKeyType = string | number | symbol
        /**任意Object */
        type AnyObjectType = { [key: AnyKeyType]: any }
        /**Int8Array | Int16Array | Int32Array */
        type IntArray = Int8Array | Int16Array | Int32Array
        /**扩展申明，使其支持传number */
        function parseFloat(string: string | number): number
        /**扩展申明，使其支持传number */
        function parseInt(str: string | number, radix?: number): number
        /**索引类型为Number的Object */
        interface NumObj<T> {
            [index: number]: T
        }
    }
}

/**Node事件监听解释
 * on(`xxx`, callback, target, useCapture);
 * `xxx`：事件名称
 * callback：回调函数
 * target：callback.call(target, arg0, ...), 即callback中this的指向（如果callback使用了bind, 则target为bind参数列表后的第一个参数，其它参数后移）
 * useCapture：事件将在 “向下透传” 阶段触发，否则将在 “向上透传” 阶段触发。
 * 例如：
 * 1、
 * Node-000 -> on(`xxx`, callback, target, false);
 * 
 *     Node-001 -> on(`xxx`, callback, target, false);
 * 
 *         Node-002 -> on(`xxx`, callback, target, false);
 * 
 * 结果为：Node-002 -> Node-001 -> Node-000
 * 
 * 2、
 * Node-000 -> on(`xxx`, callback, target, true);
 * 
 *     Node-001 -> on(`xxx`, callback, target, false);
 * 
 *         Node-002 -> on(`xxx`, callback, target, false);
 * 
 * 结果为：Node-000 -> Node-002 -> Node-001
 * 
 * 3、
 * Node-000 -> on(`xxx`, callback, target, false);
 * 
 *     Node-001 -> on(`xxx`, callback, target, true);
 * 
 *         Node-002 -> on(`xxx`, callback, target, false);
 * 
 * 结果为：Node-001 -> Node-002 -> Node-000
 * 
 * 4、
 * Node-000 -> on(`xxx`, callback, target, false);
 * 
 *     Node-001 -> on(`xxx`, callback, target, false);
 * 
 *         Node-002 -> on(`xxx`, callback, target, true);
 * 
 * 结果为：Node-002 -> Node-001 -> Node-000
 * 
 * 5、
 * Node-000 -> on(`xxx`, callback, target, true);
 * 
 *     Node-001 -> on(`xxx`, callback, target, true);
 * 
 *         Node-002 -> on(`xxx`, callback, target, false);
 * 
 * 结果为：Node-000 -> Node-001 -> Node-002
 * 
 * 5、
 * Node-000 -> on(`xxx`, callback, target, true);
 * 
 *     Node-001 -> on(`xxx`, callback, target, false);
 * 
 *         Node-002 -> on(`xxx`, callback, target, true);
 * 
 * 结果为：Node-000 -> Node-002 -> Node-001
 * 
 * 6、
 * Node-000 -> on(`xxx`, callback, target, false);
 * 
 *     Node-001 -> on(`xxx`, callback, target, true);
 * 
 *         Node-002 -> on(`xxx`, callback, target, true);
 * 
 * 结果为：Node-001 -> Node-002 -> Node-000
 * 
 * 7、
 * Node-000 -> on(`xxx`, callback, target, true);
 * 
 *     Node-001 -> on(`xxx`, callback, target, true);
 * 
 *         Node-002 -> on(`xxx`, callback, target, true);
 * 
 * 结果为：Node-000 -> Node-001 -> Node-002
 * 
 */
