import { Node as ccNode, ScrollView, UITransform, tween, Tween, v3 } from 'cc';

/**使节点在视图中全显，受滑动方向影响 */
ScrollView.prototype.setNodeInView = function (data: SetNodeInViewParam) {
    if (!fw.isValid(data.node)) {
        return;
    }
    let func = () => {
        let diff = v3();
        let sSize = this.node.size;
        let nSize = data.node.size;
        let sPos = this.node.getWorldPosition();
        let nPos = data.node.getWorldPosition();
        let sAnchorPoint = this.node.getComponent(UITransform).anchorPoint;
        let nAnchorPoint = data.node.getComponent(UITransform).anchorPoint;
        //垂直
        if (this.vertical) {
            while (true) {
                //顶部
                let sTop = sPos.y + (1 - sAnchorPoint.y) * sSize.height;
                let nTop = nPos.y + (1 - nAnchorPoint.y) * nSize.height;
                if (sTop < nTop) {
                    diff.y = sTop - nTop;
                    break;
                }
                //底部
                let sBottom = sPos.y - sAnchorPoint.y * sSize.height;
                let nBottom = nPos.y - nAnchorPoint.y * nSize.height;
                if (sBottom > nBottom) {
                    diff.y = sBottom - nBottom;
                    break;
                }
                break;
            }
        }
        //水平
        if (this.horizontal) {
            while (true) {
                //左边
                let sLeft = sPos.x - sAnchorPoint.x * sSize.width;
                let nLeft = nPos.x - nAnchorPoint.x * nSize.width;
                if (nLeft < sLeft) {
                    diff.x = sLeft - nLeft;
                    break;
                }
                //右边
                let sRight = sPos.x + (1 - sAnchorPoint.x) * sSize.width;
                let nRight = nPos.x + (1 - nAnchorPoint.x) * nSize.width;
                if (nRight > sRight) {
                    diff.x = sRight - nRight;
                    break;
                }
                break;
            }
        }
        //滑动
        if (diff.x != 0 || diff.y != 0) {
            //停止之前的滑动
            this.stopAutoScroll();
            Tween.stopAllByTarget(this.content);
            //是否动画
            if (data.bAnim) {
                tween(this.content)
                    .by(data.nScrollTime ?? 0.1, { position: diff })
                    .start();
            } else {
                let pos = fw.v3(this.getContentPosition());
                pos.add(diff);
                this.setContentPosition(pos);
            }
        }
    }
    //是否立即执行
    data.bImmediately ? func() : this.scheduleOnce(func);
}

declare module 'cc' {
    /**ScrollView扩展 */
    interface ScrollView {
        /**使节点在视图中全显，受滑动方向影响 */
        setNodeInView(data: SetNodeInViewParam): void
    }
}

/**声明全局调用 */
declare global {
    namespace globalThis {
        type SetNodeInViewParam = {
            /**ScrollView中的节点 */
            node: ccNode,
            /**是否下一帧执行（初始化时需要在下一帧执行才有效，默认下一帧执行） */
            bImmediately?: boolean
            /**是否播放动画 */
            bAnim?: boolean
            /**滑动时间（默认0.1秒） */
            nScrollTime?: number
        }
    }
}

export { }
