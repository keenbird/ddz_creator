import { _decorator, Node as ccNode, ScrollView, UITransform, Size, Layout, Sprite } from 'cc';
const { ccclass, executeInEditMode } = _decorator;

/**复用节点滚动列表（只支持单项滚动，content使用了布局）
 * @example 
 *  this.Items.ScrollView.getComponent(FWReuseItemScrollView<string>).setItemsData({
 *      item: this.Items.ScrollView.Items.item,
 *      datas: [`1`, `2`, `3`, `4`, `5`, `6`],
 *      update: (item, data) => {
 *          item.Items.Label.string = data;
 *      },
 *  });
 */
@ccclass('FWReuseItemScrollView')
@executeInEditMode(true)
export class FWReuseItemScrollView<T> extends ScrollView {
    /**调整默认值--began------------------------------------------ */
    /**是否开启水平滚动 */
    horizontal: boolean = false
    /**开启惯性后，在用户停止触摸后滚动多快停止，0表示永不停止，1表示立刻停止 */
    brake: number = 0.75
    /**回弹持续的时间，0 表示将立即反弹 */
    bounceDuration: number = 0.23
    /**调整默认值--end------------------------------------------ */

    /**自定义数据 */
    private data: ReuseItemScrollViewData<T>

    /**缓存复用节点列表 */
    private items: ccNode[] = []
    /**item的大小 */
    itemSize: Size
    /**ScrollView的大小 */
    scrollViewSize: Size
    /**占位节点 */
    private placeholderNode: ccNode
    /**界面最多显示几个元素 */
    nMaxPageNum: number = 0
    /**当前显示到哪个索引（最小的那个） */
    nCurItemIndex: number = 0
    /**item的数量 */
    itemCount: number = 0

    /**是否测试组件 */
    bTest: boolean = false
    onLoad() {
        super.onLoad?.();
        //初始化content
        this.content ??= this.node.getChildByPath(`content`) ?? this.node.getChildByPath(`view/content`);
        //监听滚动
        this.node.on(ScrollView.EventType.SCROLLING, () => {
            let nCheckIndex: number;
            const childs = this.content.children;
            const nOldCurIndex = this.nCurItemIndex;
            const nOldMaxIndex = this.nCurItemIndex + this.nMaxPageNum;
            nCheckIndex = this.nCurItemIndex - 1;
            if (app.func.checkNodeInView({
                node: childs[nCheckIndex],
                view: this.node
            })) {
                --this.nCurItemIndex;
                this.checkPlaceholdNode(childs[nOldMaxIndex], nOldMaxIndex);
                this.checkPlaceholdNode(childs[nCheckIndex], nCheckIndex);
                return;
            }
            nCheckIndex = this.nCurItemIndex + this.nMaxPageNum + 1;
            if (app.func.checkNodeInView({
                node: childs[nCheckIndex],
                view: this.node
            })) {
                ++this.nCurItemIndex;
                this.checkPlaceholdNode(childs[nOldCurIndex], nOldCurIndex);
                this.checkPlaceholdNode(childs[nCheckIndex], nCheckIndex);
                return;
            }
        });
    }
    /**刷新数据 */
    setItemsData(data: ReuseItemScrollViewData<T>) {
        //刷新数据
        this.data = data;
        //隐藏item节点
        this.data.item.active = false;
        this.itemSize = this.data.item.getComponent(UITransform).contentSize.clone();
        this.scrollViewSize = this.node.getComponent(UITransform).contentSize.clone();
        //最大数量
        const layout = this.content.getComponent(Layout);
        if (layout) {
            if (layout.type == Layout.Type.HORIZONTAL) {
                this.nMaxPageNum = Math.ceil(this.scrollViewSize.width / this.itemSize.width);
            } else if (layout.type == Layout.Type.VERTICAL) {
                this.nMaxPageNum = Math.ceil(this.scrollViewSize.height / this.itemSize.height);
            } else if (layout.type == Layout.Type.GRID) {
                const nHCount = Math.ceil(this.scrollViewSize.width / this.itemSize.width);
                const nVCount = Math.ceil(this.scrollViewSize.height / this.itemSize.height);
                this.nMaxPageNum = nHCount * nVCount;
            } else {
                this.nMaxPageNum = 1;
            }
        } else {
            this.nMaxPageNum = 1;
        }
        //调整当前索引
        this.nCurItemIndex = Math.min(Math.min(this.nCurItemIndex, this.nMaxPageNum), this.data.datas.length - this.nMaxPageNum);
        //创建占位节点
        if (!fw.isValid(this.placeholderNode)) {
            this.placeholderNode = this.node.getChildByName(`_placeholderNode`);
            if (!this.placeholderNode) {
                this.placeholderNode = new ccNode(`_placeholderNode`);
                this.placeholderNode.addComponent(UITransform);
                this.placeholderNode.parent = this.node;
                this.placeholderNode.active = false;
            }
        }
        this.placeholderNode.getComponent(UITransform).setContentSize(this.itemSize);
        //刷新界面
        this.updateView();
    }
    updateView() {
        //数据异常不处理
        if (!this.data || !this.data.item) {
            return;
        }
        //移除之前的定时器
        this.content.children.forEach(child => {
            child.unschedule((<any>child).__reuseFunc);
        });
        let index = 0;
        const childs = this.content.children;
        const nDelayTime = this.data.nDelayTime ?? 0.1;
        this.data.datas.forEach(() => {
            let placeholderNode = childs[index];
            if (!placeholderNode) {
                placeholderNode = this.placeholderNode.clone();
                placeholderNode.parent = this.content;
                if (this.bTest) {
                    let sprite = placeholderNode.getComponent(Sprite) || placeholderNode.addComponent(Sprite);
                    sprite.color = app.func.color(`#00ff00`);
                    sprite.sizeMode = Sprite.SizeMode.CUSTOM;
                    placeholderNode.updateSprite(fw.BundleConfig.resources.res[`ui/common/img/black/spriteFrame`]);
                }
            }
            this.checkPlaceholdNode(placeholderNode, index, nDelayTime * index);
            placeholderNode.active = true;
            ++index;
        });
        for (; index < childs.length; ++index) {
            const item = childs[index];
            this.checkPlaceholdNode(item, index);
            item.active = false;
        }
    }
    checkPlaceholdNode(node: ccNode, index: number, nDelayTime?: number) {
        //无效节点不处理
        if (!fw.isValid(node) || !this.data) {
            return;
        }
        const bVisible = index >= this.nCurItemIndex && index <= this.nCurItemIndex + this.nMaxPageNum;
        if (bVisible) {
            const func = () => {
                let item: ccNode = (<any>node).__reuseItem;
                if (!item) {
                    item = this.items.shift();
                    if (!item) {
                        item = this.data.item.clone();
                        ++this.itemCount;
                    }
                    item.parent = node;
                    item.toParentCenter();
                }
                const data = this.data.datas[index];
                if (item.active && (<any>item).__reuseScrollData == data) {
                    return;
                }
                item.active = true;
                (<any>node).__reuseItem = item;
                (<any>item).__reuseScrollData = data;
                this.data.update((<any>node).__reuseItem, data, index);
            }
            if (nDelayTime) {
                (<any>node).__reuseFunc = func;
                node.scheduleOnce((<any>node).__reuseFunc, nDelayTime);
            } else {
                func();
            }
        } else {
            //暂停定时器
            node.unschedule((<any>node).__reuseFunc);
            //回收复用节点
            let item: ccNode = (<any>node).__reuseItem;
            if (item) {
                item.parent = null;
                item.active = false;
                this.items.push(item);
                (<any>node).__reuseItem = null;
            }
        }
    }
    onDestroy() {
        this.items.forEach(element => {
            element.destroy();
        });
    }
}

/**声明全局调用 */
declare global {
    namespace globalThis {
        interface ReuseItemScrollViewData<T> {
            /**数据列表 */
            datas: T[]
            /**刷新数据接口 */
            update: (item: ccNode, data: T, index: number) => void
            /**item */
            item: ccNode
            /**每一个item初始化的延时时间，默认每隔0.1秒创建一个（滑动时，则使用立即创建） */
            nDelayTime?: number
        }
    }
}
