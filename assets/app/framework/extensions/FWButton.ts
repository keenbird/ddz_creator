import { _decorator, Button, Node as ccNode, __private, EventTouch, PolygonCollider2D, Intersection2D, UITransform, v2, v3, NodeEventType } from 'cc';
const { ccclass } = _decorator;

@ccclass('FWButton')
export class FWButton extends Button {
    /**当前配置 */
    data: FWButtonParam = {}
    /**多边形组件 */
    polygonCollider2D: PolygonCollider2D
    /**更新按钮样式 */
    updateButton(data: FWButtonParam | Button) {
        this.data = data ?? this.data ?? {};
        //放大缩小倍率
        this.zoomScale = this.data.zoomScale ?? 1.1;
        //点击样式
        this.transition = this.data.transition ?? this.transition;
    }
    protected _onTouchBegan(event?: EventTouch) {
        if (!this._interactable || !this.enabledInHierarchy) { return; }
        // 判断是否在多边形内
        if (!event || !this.data.bPolygon || this.checkBtnPolygonCollider(event)) {
            super._onTouchBegan(event);
            return;
        }
    }
    /**检查按钮点击是否在多边形内 */
    protected checkBtnPolygonCollider(event?: EventTouch) {
        let collider = this.polygonCollider2D ??= this.node.getComponent(PolygonCollider2D);
        if (!collider) {
            return true;
        }
        let point = event.getUILocation();
        let transform = this.node.getComponent(UITransform);
        let local = transform.convertToNodeSpaceAR(v3(point.x, point.y));
        return Intersection2D.pointInPolygon(v2(local.x, local.y), collider.points);
    }
    protected _registerNodeEvent () {
        this.node.on(NodeEventType.TOUCH_START, this._onTouchBegan, this);
        this.node.on(NodeEventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.on(NodeEventType.TOUCH_END, this._onTouchEnded, this);
        this.node.on(NodeEventType.TOUCH_CANCEL, this._onTouchCancel, this);
    }
    protected _unregisterNodeEvent () {
        this.node.off(NodeEventType.TOUCH_START, this._onTouchBegan, this);
        this.node.off(NodeEventType.TOUCH_MOVE, this._onTouchMove, this);
        this.node.off(NodeEventType.TOUCH_END, this._onTouchEnded, this);
        this.node.off(NodeEventType.TOUCH_CANCEL, this._onTouchCancel, this);
    }
}


export class FWButtonLongPress extends FWButton {
    /**当前配置 */
    declare data: FWButtonLongPressParam
    private mLongPressTimer: Function;
    longPressEnabled = true;

    get pressed() {
        return (<any>this)._pressed
    }

    private onLongPressClick() {
        if ( this.pressed && this.longPressEnabled ) {
            (<any>this)._pressed = false;
            // this._updateState();
            this.data.onLongPressClick();
        }
    }

    protected _onTouchBegan(event?: EventTouch) {
        super._onTouchBegan(event);
        // 如果按下添加长按计时器
        if ( this.pressed ) {
            this.unschedule(this.mLongPressTimer)
            if( this.longPressEnabled ) {
                this.mLongPressTimer = this.onLongPressClick.bind(this);
                this.scheduleOnce(this.mLongPressTimer,this.data.pressedTime)
            }
        }
    }
}

/**类型声明调整 */
declare global {
    namespace globalThis {
        /**单个场景扩展节点配置 */
        type FWButtonParam = {
            /**按钮点击样式 */
            transition?: __private._cocos_ui_button__Transition
            /**放大缩小倍率 */
            zoomScale?: number
            /**是否是多边形 */
            bPolygon?: boolean
            /**自定组件 */
            classConstructor?: typeof FWButton
            /**是否播放音效 */
            bNotAudio?: boolean
        }

        type FWButtonLongPressParam = {
            pressedTime:number,
            onLongPressClick:Function
        } & FWButtonParam
    }
}
