import { _decorator, Node as ccNode } from 'cc';
const { ccclass } = _decorator;

@ccclass('FWLoadByFrameManager')
export class FWLoadByFrameManager extends (fw.FWComponent) {
    /**每帧最大加载数量 */
    __maxCount: number = 5
    /**当前帧已加载数量 */
    __curCount: number = 0
    /**缓存加载列表 */
    __cacheLoadList: AddLoadByFrameParam[] = []
    /**添加加载回调 */
    add(data: AddLoadByFrameParam) {
        //添加缓存
        this.__cacheLoadList.push(data);
        //执行加载
        this.load();
    }
    /**加载资源 */
    load() {
        if (this.__curCount < this.__maxCount && this.__cacheLoadList.length > 0) {
            let list = [];
            let nIndex: number;
            //正序遍历
            app.func.positiveTraversal(this.__cacheLoadList, (element, index: number) => {
                //调整索引
                nIndex = index;
                //是否有效
                if (fw.isNull(element.valideTarget) || fw.isValid(element.valideTarget)) {
                    list.push(element);
                    //超过当前帧处理上限
                    if (++this.__curCount >= this.__maxCount) {
                        return true;
                    }
                }
            });
            //删除
            if (nIndex != null) {
                this.__cacheLoadList.splice(0, nIndex + 1);
            }
            //执行回调
            list.forEach(element => {
                element?.callback();
            });
        }
    }
    /**每帧刷新可用数量 */
    update(dt: number) {
        //重置
        this.__curCount = 0;
        //执行加载
        this.load();
    }
}

/**类型声明调整 */
declare global {
    namespace globalThis {
        type AddLoadByFrameParam = {
            /**加载回调 */
            callback: Function
            /**有效节点 */
            valideTarget?: ccNode
        }
    }
}
