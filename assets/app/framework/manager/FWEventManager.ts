
import { _decorator, Component, Node, input, Input, __private, EventKeyboard, KeyCode, game, Game } from 'cc';
import { report_event_type } from '../../config/EventConfig';
import { AWEvent } from '../extensions/AWEvent';
const { ccclass } = _decorator;

export function addEvent<T extends { new(...args: any[]): {} }>(target: T) {
    return class extends target {
        //事件表
        events: { [eventName: string]: FWBindEventParam[] } = Object.create(null)
        //添事件监听（回调函数执行时，会把data作为第二个参数传回）
        bindEvent(data: FWBindEventParam) {
            if (fw.isNull(data.eventName)) {
                return;
            }
            //不传有效节点默认（常驻事件）
            if (fw.isNull(data.valideTarget)) {
                data.valideTarget = {
                    uuid: `0`
                };
            } else {
                if (!fw.isValid(data.valideTarget)) {
                    return;
                }
            }
            //添加事件监听
            ((data.eventName instanceof Array) ? data.eventName : [data.eventName]).forEach((eventName: string | number) => {
                this.events[eventName] ??= [];
                let list = this.events[eventName];
                if (data.bOne || (list.length > 0 && list[0].bOne)) {
                    data.bOne = true;
                    list.length = 0;
                }
                list.push(data);
            });
        }
        //派发事件（事件函数执行时，会把data作为第一个参数传回）
        dispatchEvent(data: FWDispatchEventParam) {
            //遍历发送事件
            app.func.positiveTraversal(((data.eventName instanceof Array) ? data.eventName : [data.eventName]), (eventName) => {
                //遍历派送事件
                const list = this.events[eventName];
                if (!list) {
                    return;
                }
                let bOver = false;
                const bInvalideTarget = fw.isNull(data.valideTarget);
                app.func.reverseTraversal(list, (eventData: FWBindEventParam, index: number) => {
                    if (!fw.isValid(eventData.valideTarget)) {
                        list.splice(index, 1);
                    } else {
                        if (bInvalideTarget || data.valideTarget == eventData.valideTarget) {
                            let result = eventData.callback(data, eventData);
                            //只监听一次回调的事件，处理结果需要返回“假”
                            if (!result && eventData.once) {
                                list.splice(index, 1);
                            }
                            //“只执行一次”
                            if (!result && data.once) {
                                bOver = true;
                                return true;
                            }
                            //“中断”
                            if (data.interrupt) {
                                bOver = true;
                                return true;
                            }
                        }
                    }
                    if (bOver) {
                        return true;
                    }
                });
                if (list.length == 0) {
                    delete this.events[eventName];
                }
            });
        }
        //移除指定事件
        removeEvent(data: FWRemoveEventParam) {
            //遍历删除
            ((data.eventName instanceof Array) ? data.eventName : [data.eventName]).forEach((eventName: string | number) => {
                if (fw.isNull(data.valideTarget)) {
                    delete this.events[eventName];
                } else {
                    const list = this.events[eventName];
                    if (!list) {
                        return;
                    }
                    //遍历派送事件
                    app.func.reverseTraversal(list, (eventData: FWBindEventParam, index: number) => {
                        if (data.valideTarget == eventData.valideTarget) {
                            list.splice(index, 1);
                        }
                    });
                    if (list.length == 0) {
                        delete this.events[eventName];
                    }
                }
            });
        }
        //移除所有事件
        removeAllEvent() {
            this.events = Object.create(null);
        }
    };
}

@addEvent
export class EventHelp {
    /**事件表 */
    declare eventTable: Map<string | number, Map<number, Map<string | Node, FWBindEventParam[]>>>
    /**添事件监听（回调函数执行时，会把data作为第二个参数传回） */
    declare bindEvent: (data: FWBindEventParam) => void
    /**派发事件（事件函数执行时，会把data作为第一个参数传回） */
    declare dispatchEvent: (data: FWDispatchEventParam) => void
    /**移除指定事件 */
    declare removeEvent: (data: FWRemoveEventParam) => void
    /**移除所有事件 */
    declare removeAllEvent: () => void
}

@addEvent
@ccclass('FWEventManager')
export class FWEventManager extends Component {
    declare eventTable: Map<string | number, Map<number, Map<string | Node, FWBindEventParam[]>>>;
    declare dispatchEvent: (data: FWDispatchEventParam) => void;
    declare removeEvent: (data: FWRemoveEventParam) => void;
    declare bindEvent: (data: FWBindEventParam) => void;
    declare removeAllEvent: () => void;
    /**部分通用事件 */
    CommonEvent = {
        /**按键事件 */
        Keyboard: `KeyboardForClick`,
        /**返回键事件 */
        Keyback: `KeyboardForKeyback`,
    }
    /**部分按键（native下只有Esc） */
    CommonKey = {
        /**Esc、home、返回键 */
        Esc: 27,
        /**空格键 */
        Space: 32,
    }
    /**初始化 */
    onLoad() {
        //键盘输入监听
        input.off(Input.EventType.KEY_UP);
        if (app.func.isIOS()) {
            input.on(Input.EventType.KEY_UP, this.onIosKeyUp.bind(this), this);
        } else if (app.func.isAndroid()) {
            input.on(Input.EventType.KEY_UP, this.onAndroidKeyUp.bind(this), this);
        } else if (app.func.isWin32()) {
            input.on(Input.EventType.KEY_UP, this.onWindowsKeyUp.bind(this), this);
        } else {
            fw.printWarn(`FWEventManager onLoad error unknow platform`);
        }
        //切后台
        game.on(Game.EVENT_HIDE, function () {
            if (fw.isValid(app)) {
                (<any>this).nHideTime = app.func.millisecond();
                app.event.dispatchEvent({
                    eventName: `GameHide`,
                    data: {
                        time: (<any>this).nHideTime,
                    }
                });
            }
        }, this);
        //切回来
        game.on(Game.EVENT_SHOW, function () {
            if (fw.isValid(app)) {
                app.event.dispatchEvent({
                    eventName: `GameShow`,
                    data: {
                        time: app.func.millisecond(),
                        diff: app.func.millisecond() - (<any>this).nHideTime,
                    }
                });
            }
        }, this);
    }
    /**ios按键 */
    onIosKeyUp(event: EventKeyboard) {
        if (event.keyCode == KeyCode.MOBILE_BACK) {
            this.onKeyBackClick();
        }
        this.onKeyboardClick(event);
    }
    /**android按键 */
    onAndroidKeyUp(event: EventKeyboard) {
        if (event.keyCode == KeyCode.MOBILE_BACK) {
            this.onKeyBackClick();
        }
        this.onKeyboardClick(event);
    }
    /**windows按键 */
    onWindowsKeyUp(event: EventKeyboard) {
        if (event.keyCode == KeyCode.ESCAPE) {
            this.onKeyBackClick();
        }
        this.onKeyboardClick(event);
    }
    /**返回键 */
    onKeyBackClick() {
        //发送事件
        this.dispatchEvent({
            once: true,
            reverse: true,
            eventName: this.CommonEvent.Keyback,
        });
    }
    /**其它键 */
    onKeyboardClick(event: EventKeyboard) {
        //发送事件
        this.dispatchEvent({
            eventData: event,
            eventName: this.CommonEvent.Keyboard,
        });
        //测试界面
        if (event.keyCode == KeyCode.F1) {
            // app.gameManager.isTest = true;
            // app.runtime.isRummyPractice = true;
            // app.gameManager.gameConfig = fw.GameConfigs.Rummy;
            // this.scheduleOnce(() => {
            //     fw.scene.changeScene(fw.SceneConfigs.Rummy);
            // }, 0.5);
        }
        //断线重连测试
        if (event.keyCode == KeyCode.F2) {
            app.socket.disconnect(true);
        }
    }

    reportEvent<T extends keyof report_event_type, P extends report_event_type[T]["params"]>(eventName: T, params?: P) {
        let safeParams = AWEvent.safeParams(eventName, params)
        if (!safeParams) return;
        AWEvent.reportEvent(eventName, safeParams)
        app.sdk.reportEvent(eventName, safeParams);
    }

    setUserID(userID) {
        AWEvent.setUserID(userID);
    }
}

export const EventParam = {
    /**
     * 生成FWDispatchEventParam分发数据
     * @param eventName 
     * @param data 
     * @returns 
     */
    FWDispatchEventParam(eventName: string | number, data?) {
        return Object.assign(data ?? {}, { eventName: eventName });
    },

    /**
     * 生成FWBindEventParam监听数据
     * @param eventName 事件id
     * @param data 监听
     * @returns 
     */
    FWBindEventParam(eventName: string | number, callback: FWBindEventFunc, data?) {
        return Object.assign(data ?? {}, { eventName: eventName, callback: callback });
    }
}

/**类型声明调整 */
declare global {
    namespace globalThis {
        type FWEventName = (string | number) | (string | number)[]
        type FWEventValidTarget = ValideTargetType | { uuid: string }
        type FWBindEventFunc = (arg1: FWDispatchEventParam, arg2: FWBindEventParam) => boolean | void
        type FWBindEventParam = {
            /**事件名 */
            eventName: FWEventName
            //事件回调
            callback: FWBindEventFunc
            /**事件有效控制节点 */
            valideTarget?: FWEventValidTarget
            /**只触发一次后自动注销事件（注意：需要callback 返回 “假” ） */
            once?: boolean
            /**事件回调是否唯一（保存最后一次绑定的对调，如需调整要先删除旧回调） */
            bOne?: boolean
            /**事件编号（自动生成，无需手动传入） */
            index?: number
            /**参数可自定义 */
            [index: AnyKeyType]: any
        }
        type FWDispatchEventParam = {
            /**事件名 */
            eventName: FWEventName
            /**事件有效控制节点 */
            valideTarget?: FWEventValidTarget
            /**只回调一次 */
            once?: boolean
            /**事件后添加先触发 */
            reverse?: boolean
            /**是否中断处理（由回调函数调整） */
            interrupt?: boolean
            /**参数可自定义 */
            [index: AnyKeyType]: any
        }
        type FWRemoveEventParam = {
            /**事件名 */
            eventName: FWEventName
            /**事件有效控制节点 */
            valideTarget?: FWEventValidTarget
            /**参数可自定义 */
            [index: AnyKeyType]: any
        }
    }
}