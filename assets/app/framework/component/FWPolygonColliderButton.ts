import { EventTouch, Intersection2D, PolygonCollider2D, UITransform, v2, v3, _decorator } from 'cc';
const { ccclass } = _decorator;

import { FWButton } from "../extensions/FWButton";

@ccclass(`FWPolygonColliderButton`)
export class FWPolygonColliderButton extends FWButton {
    protected _onTouchBegan(event?: EventTouch) {
        if (!this._interactable || !this.enabledInHierarchy) { return; }
        //判断是否在多边形内
        if (event && this.checkBtnPolygonCollider(event)) {
            super._onTouchBegan(event)
            return
        }
    }
    /**检查按钮点击是否在多边形内 */
    protected checkBtnPolygonCollider(event?: EventTouch) {
        let collider = this.node.getComponent(PolygonCollider2D);
        if (!collider) {
            return true;
        }
        let point = event.getUILocation();
        let transform = this.node.getComponent(UITransform);
        let local = transform.convertToNodeSpaceAR(v3(point.x, point.y));
        return Intersection2D.pointInPolygon(v2(local.x, local.y), collider.points);
    }
}