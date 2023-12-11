import '../__init'

/**链表信息 */
class FWListInfo {
    /**链表长度 */
    public count: number = 0
}
fw.FWListInfo = FWListInfo

/**链表 */
class FWList {
    /**头 */
    public head: FWListItem = null
    /**尾 */
    public tail: FWListItem = null
    /**链表信息 */
    public info: FWListInfo = new FWListInfo()
    /**添加一个item */
    add(item: FWListItem) {
        //链表元素为空
        if (!this.head) {
            this.head = item;
            this.tail = item;
        }
        //添加引用
        item.list = this;
        //添加到末尾
        this.tail.tail = item;
        //链表长度增加
        ++this.info.count;
    }
    /**移除一个item */
    remove(item: FWListItem) {
        //不是这个链表中的元素
        if (item.list != this) {
            return;
        }
        //item是不是头部
        if (item.head) {
            item.head.tail = item.tail;
        } else {
            this.head = item.tail;
        }
        //数量递减
        --this.info.count;
    }
}
fw.FWList = FWList

/**链表元素 */
class FWListItem {
    /**头 */
    public head: FWListItem = null
    /**尾 */
    public tail: FWListItem = null
    /**链表 */
    public list: FWList = null
    /**移除 */
    public delete() {
        this.list.remove(this);
    }
}
fw.FWListItem = FWListItem

declare global {
    namespace globalThis {
        interface _fw {
            /**链表 */
            FWList: typeof FWList
            /**链表信息 */
            FWListInfo: typeof FWListInfo
            /**链表元素 */
            FWListItem: typeof FWListItem
        }
    }
}