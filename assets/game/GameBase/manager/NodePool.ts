
import { Layers, Node as ccNode } from "cc"
import { find, isValid } from "cc";

export class NodePoolBase extends (fw.FWComponent) {
    static sNodePoolIndex: number = 0
    nNodePoolIndex: number;//创建自增标签
    onLoad() {
        super.onLoad();
        this.nNodePoolIndex = NodePoolBase.sNodePoolIndex++;
    }
}


export class NodePool {

    private _pool: ccNode[];
    private _isDirty = false;

    constructor() {
        this._pool = [];
    }

    /**
     * @en The current available size in the pool
     * @zh 获取当前缓冲池的可用对象数量
     */
    public size() {
        return this._pool.length;
    }

    /**
     * @en Destroy all cached nodes in the pool
     * @zh 销毁对象池中缓存的所有节点
     */
    public clear() {
        // const count = this._pool.length;
        // for (let i = 0; i < count; ++i) {
        //     if (isValid(this._pool[i], true)) {
        //         this._pool[i].destroy();
        //     }
        // }
        this._pool.length = 0;
    }

    /**
     * @en Put a new Node into the pool.
     * It will automatically remove the node from its parent without cleanup.
     * It will also invoke unuse method of the poolHandlerComp if exist.
     * @zh 向缓冲池中存入一个不再需要的节点对象。
     * 这个函数会自动将目标节点从父节点上移除，但是不会进行 cleanup 操作。
     * @example
     * import { instantiate } from 'cc';
     * const myNode = instantiate(this.template);
     * this.myPool.put(myNode);
     */
    public put(obj: ccNode) {
        if (obj && this._pool.indexOf(obj) === -1) {
            // Remove from parent, but don't cleanup
            // obj.removeFromParent();
            (obj as any).__resume_worldPosition = obj.getWorldPosition();
            obj.worldPosition = fw.v3(10000,10000,10000)
            this._pool.push(obj);
            this._isDirty = true;
        }
    }

    /**
     * @en Get a obj from pool, if no available object in pool, null will be returned.
     * This function will invoke the reuse function of poolHandlerComp if exist.
     * @zh 获取对象池中的对象，如果对象池没有可用对象，则返回空。
     * 这个函数会调用 poolHandlerComp 的 reuse 函数，如果组件和函数都存在的话。
     * @example
     *   let newNode = this.myPool.get();
     */
    public get(): ccNode | null {
        const last = this._pool.length - 1;
        if (last < 0) {
            return null;
        }
        else {
            if (this._isDirty) {
                this.sort();
                this._isDirty = false;
            }
            // Pop the last object in pool
            const obj = this._pool.pop();
            obj.worldPosition = (obj as any).__resume_worldPosition;
            // this._pool.length = last;
            // obj.visible = true;
            return obj;
        }
    }

    public sort() {
        // this._pool.sort((a: ccNode, b: ccNode) => {
        //     return b.getComponent(NodePoolBase).nNodePoolIndex - a.getComponent(NodePoolBase).nNodePoolIndex;
        // })
    }
}