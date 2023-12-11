import { _decorator, Node as ccNode, __private, v3, CCInteger, Sprite, SpriteFrame, UIOpacity, tween, Vec3, Tween } from 'cc';
const { ccclass, property } = _decorator;
import { EDITOR } from 'cc/env';

@ccclass(`Afterimage`)
export class Afterimage extends (fw.FWComponent) {
    /**
     * 残影图片
     */
    @property({ type: SpriteFrame })
    _spriteFrame: SpriteFrame
    @property({ type: SpriteFrame, tooltip: `残影图片`, displayOrder: 1 })
    get spriteFrame(): SpriteFrame {
        return this._spriteFrame;
    }
    set spriteFrame(spriteFrame: SpriteFrame) {
        this._spriteFrame = spriteFrame;
        if (EDITOR) {
            let sprite = this.getComponent(Sprite) || this.addComponent(Sprite);
            sprite.spriteFrame = this._spriteFrame;
        }
    }
    /**
     * 残影数量
     */
    @property({ type: CCInteger, tooltip: `残影数量`, displayOrder: 2 })
    afterimageNums: number = 5
    /**
     * 残影节点
     */
    _afterimageNodes: ccNode[] = []
    /**
     * 上一次位置
     */
    _lastPosition: Vec3
    initView() {
        // //移除自身的sprite
        // this.getComponent(Sprite)?.destroy();
        //刷新残影节点数量
        this.updateAfterimageNums();
        //拖尾节点数
        this.node.on(ccNode.EventType.TRANSFORM_CHANGED, (type: number) => {
            if (type & ccNode.TransformBit.POSITION) {
                let lastPosition = this.node.getPosition();
                if (this._lastPosition) {
                    app.func.positiveTraversal(this._afterimageNodes, (element, index) => {
                        let posDiff = v3(lastPosition).subtract(element.getPosition());
                        tween(element)
                            .by(1.0, { position: posDiff })
                            .start();
                    });
                }
                this._lastPosition = lastPosition;
            }
        });
        tween(this.node)
            .by(100, { position: v3(10000, 0, 0) })
            .start();
    }
    /**刷新残影数量 */
    updateAfterimageNums(afterimageNums?: number) {
        this.afterimageNums ??= afterimageNums;
        let nDiff = 255 / (this.afterimageNums + 1);
        let afterimagNodeLen = this._afterimageNodes.length;
        for (let i = afterimagNodeLen; i < this.afterimageNums; ++i) {
            let node = new ccNode();
            this.node.parent.addChild(node);
            this._afterimageNodes.push(node);
            node.setPosition(this.node.getPosition());
            node.setSiblingIndex(this.node.getSiblingIndex());
            node.obtainComponent(Sprite).spriteFrame = this.spriteFrame;
            node.obtainComponent(UIOpacity).opacity = 255 - (this.afterimageNums - i) * nDiff;
        }
    }
}