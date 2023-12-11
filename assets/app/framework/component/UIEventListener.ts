import { _decorator, Component, Node as ccNode, Event } from 'cc';
const { ccclass, property } = _decorator;
import { UIPlaySound } from './UIPlaySound';
/**
 * 按钮事件监听
 */
@ccclass('UIEventListener')
export default class UIEventListener extends Component {
    /**
     * 当鼠标在目标节点在目标节点区域中移动时，不论是否按下
     */
    public mouseMove: (event: any) => void;
    /**
     * 当鼠标移入目标节点区域时，不论是否按下
     */
    public mouseEnter: (event: any) => void;
    /**
     * 当鼠标移出目标节点区域时，不论是否按下
     */
    public mouseLeave: (event: any) => void;
    /**
     * 当鼠标从按下状态松开时触发一次
     */
    public mouseUp: (event: any) => void;
    /**
     * 按钮按钮按下超过一定时间的事件
     */
    public mousePress: (event: any, state: boolean) => void;

    private pressTime: number = 0; //当前按下按钮的时间

    @property
    private pressTipsTime: number = 0.6;//长按事件时间标志
    private isClick: boolean = false; //是否点击了按钮
    private uiPlaySound: UIPlaySound; //点击按钮播放音效

    private touch: Event;
    public onLoad(): void {
        this.uiPlaySound = this.node.getComponent(UIPlaySound);
    }

    start() {
        this.addEvents();
    }

    private addEvents(): void {
        this.node.on(ccNode.EventType.TOUCH_START, this.onMouseEnter, this);
        this.node.on(ccNode.EventType.TOUCH_MOVE, this.onMouseMove, this);
        this.node.on(ccNode.EventType.TOUCH_END, this.onMouseUp, this);
        this.node.on(ccNode.EventType.TOUCH_CANCEL, this.onMouseLeave, this);
    }

    public onViewDestroy(): void {
        this.removeEvents();
    }
    private removeEvents(): void {
        this.mouseLeave = null;
        this.mouseEnter = null;
        this.mouseMove = null;
        this.mouseUp = null;

        this.node.off(ccNode.EventType.TOUCH_START, this.onMouseEnter, this);
        this.node.off(ccNode.EventType.TOUCH_MOVE, this.onMouseMove, this);
        this.node.off(ccNode.EventType.TOUCH_END, this.onMouseUp, this);
        this.node.off(ccNode.EventType.TOUCH_CANCEL, this.onMouseLeave, this);
    }

    private onMouseMove(event: Event): void {
        if (this.mouseMove != null) {
            this.mouseMove(event);
        }
        this.touch = event;
    }
    private onMouseEnter(event: Event): void {
        if (this.mouseEnter != null) {
            this.mouseEnter(event);
        }
        this.touch = event;
        this.isClick = true;
    }
    private onMouseLeave(event: Event): void {
        if (this.mouseLeave != null) {
            this.mouseLeave(event);
        }
        this.touch = null;
        this.isClick = false;
    }
    private onMouseUp(event: Event): void {
        this.isClick = false;
        if (this.pressTime == this.pressTipsTime) {
            if (this.mousePress != null) {
                this.mousePress(event, false); //长按弹起
            } else {
                if (this.mouseUp != null) {
                    this.mouseUp(event);
                }
            }
        } else {
            if (this.mouseUp != null) {
                this.mouseUp(event);
            }
        }
        this.pressTime = 0;
        this.touch = null;
    }

    public update(dt: number): void {
        if (this.isClick == true && this.pressTime != this.pressTipsTime) {
            this.pressTime += dt;
            if (this.pressTime >= this.pressTipsTime) {
                this.pressTime = this.pressTipsTime;
                if (this.mousePress != null && this.touch != null) {
                    this.mousePress(this.touch, true); //长按按下
                }
            }
        }
    }

    public static Get(node: ccNode): UIEventListener {
        let listener: UIEventListener = node.getComponent(UIEventListener);
        if (listener == null) {
            listener = node.addComponent(UIEventListener);
        }
        return listener;
    }
}

