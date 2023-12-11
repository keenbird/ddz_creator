import { ResolutionPolicy, _decorator, Node as ccNode, view, screen, size, CCObject } from 'cc';
const { ccclass } = _decorator;

import { DesignResolutionSize, ScreenOrientationType } from '../../config/ConstantConfig';

/**运行时数据，用于跨子包数据交互 */
/**运行时数据，用于跨子包数据交互 */
/**运行时数据，用于跨子包数据交互 */
@ccclass('RuntimeManager')
export class RuntimeManager extends (fw.FWComponent) {
    /**主要存放一些运行时数据 */
    [key: AnyKeyType]: any
    /**常驻界面（用于储存暂时不销毁的界面，来达到恢复界面的效果） */
    permanentView: Map<ccNode, boolean> = new Map()
    /**选择的游戏名称（lua移植过来的，部分游戏有用到） */
    selectGameName: string
    /**是否为Rummy练习场 */
    isRummyPractice: boolean
    /**上一个场景名 */
    lastSceneType: string
    /**新版本apk，其它可能需要到该版本信息 */
    newApkVersion: string = ``

    //屏幕切换--began-------------------------------------------------
    /**竖屏枚举 */
    /**当前界面竖屏状态 */
    _nCurScreenOrientation = ScreenOrientationType.Horizontal_true
    get nCurScreenOrientation() {
        return this._nCurScreenOrientation;
    }
    set nCurScreenOrientation(value: ScreenOrientationType) {
        //值相同不处理
        if (this._nCurScreenOrientation == value) {
            return;
        }
        //刷新方向
        this._nCurScreenOrientation = value;
        //是否调整原生屏幕方向
        (<any>this)._nativeScreenOrientation ??= ScreenOrientationType.Horizontal_true;
        switch (app.runtime.nCurScreenOrientation) {
            case ScreenOrientationType.Vertical_true:
            case ScreenOrientationType.Horizontal_false:
                if ((<any>this)._nativeScreenOrientation != ScreenOrientationType.Vertical_true) {
                    (<any>this)._nativeScreenOrientation = ScreenOrientationType.Vertical_true;
                    if (app.initWinSize.width / app.initWinSize.height > DesignResolutionSize.width / DesignResolutionSize.height) {
                        view.setDesignResolutionSize(DesignResolutionSize.height, DesignResolutionSize.width, ResolutionPolicy.FIXED_WIDTH);
                    } else {
                        view.setDesignResolutionSize(DesignResolutionSize.height, DesignResolutionSize.width, ResolutionPolicy.FIXED_HEIGHT);
                    }
                    if (app.func.isBrowser()) {
                        screen.windowSize = size(app.initWinSize.height, app.initWinSize.width);
                    } else {
                        app.native.device.setRequestedOrientation(1);
                    }
                }
                break;
            case ScreenOrientationType.Vertical_false:
            case ScreenOrientationType.Horizontal_true:
            default:
                if ((<any>this)._nativeScreenOrientation != ScreenOrientationType.Horizontal_true) {
                    (<any>this)._nativeScreenOrientation = ScreenOrientationType.Horizontal_true;
                    if (app.initWinSize.width / app.initWinSize.height > DesignResolutionSize.width / DesignResolutionSize.height) {
                        view.setDesignResolutionSize(DesignResolutionSize.width, DesignResolutionSize.height, ResolutionPolicy.FIXED_HEIGHT);
                    } else {
                        view.setDesignResolutionSize(DesignResolutionSize.width, DesignResolutionSize.height, ResolutionPolicy.FIXED_WIDTH);
                    }
                    if (app.func.isBrowser()) {
                        screen.windowSize = size(app.initWinSize.width, app.initWinSize.height);
                    } else {
                        app.native.device.setRequestedOrientation(0);
                    }
                }
                break;
        }
        //事件通知
        app.event.dispatchEvent({
            eventName: `ChangeScreenOrientation`,
        });
    }
    //屏幕切换--end---------------------------------------------------

    // //屏幕切换--began-------------------------------------------------
    // /**当前界面竖屏状态 */
    // _nCurScreenOrientation = ScreenOrientationType.Horizontal_true
    // /**当前列表 */
    // orientationList: { orientation: ScreenOrientationType, target: CCObject, }[] = [{ orientation: this._nCurScreenOrientation, target: <any>Symbol(), }]
    // get nCurScreenOrientation() {
    //     return this._nCurScreenOrientation;
    // }
    // set nCurScreenOrientation(value: ScreenOrientationType) {
    //     //值相同不处理
    //     if (this._nCurScreenOrientation == value) {
    //         return;
    //     }
    //     //刷新方向
    //     this._nCurScreenOrientation = value;
    // }
    // addScreenOrientation(orientation: ScreenOrientationType, target: CCObject, index?: number) {
    //     if (orientation != ScreenOrientationType.Horizontal_true && orientation != ScreenOrientationType.Vertical_true) {
    //         return;
    //     }
    //     this.delScreenOrientation(target, true);
    //     this.orientationList.splice(index ?? this.orientationList.length, 0, {
    //         orientation,
    //         target,
    //     });
    //     this.updateScreenOrientation();
    // }
    // delScreenOrientation(target: CCObject, bNotUpdate?: boolean) {
    //     app.func.reverseTraversal(this.orientationList, (element, index) => {
    //         if (element.target == target) {
    //             this.orientationList.splice(index, 1);
    //             !bNotUpdate && this.updateScreenOrientation();
    //             return true;
    //         }
    //     });
    // }
    // refreshScreenOrientation() {
    //     if ((<any>this)._nativeScreenOrientation == ScreenOrientationType.Vertical_true) {
    //         if (app.initWinSize.width / app.initWinSize.height > DesignResolutionSize.width / DesignResolutionSize.height) {
    //             view.setDesignResolutionSize(DesignResolutionSize.height, DesignResolutionSize.width, ResolutionPolicy.FIXED_WIDTH);
    //         } else {
    //             view.setDesignResolutionSize(DesignResolutionSize.height, DesignResolutionSize.width, ResolutionPolicy.FIXED_HEIGHT);
    //         }
    //         if (app.func.isBrowser()) {
    //             screen.windowSize = size(app.initWinSize.height, app.initWinSize.width);
    //         } else {
    //             app.native.device.setRequestedOrientation(1);
    //         }
    //     } else {
    //         if (app.initWinSize.width / app.initWinSize.height > DesignResolutionSize.width / DesignResolutionSize.height) {
    //             view.setDesignResolutionSize(DesignResolutionSize.width, DesignResolutionSize.height, ResolutionPolicy.FIXED_HEIGHT);
    //         } else {
    //             view.setDesignResolutionSize(DesignResolutionSize.width, DesignResolutionSize.height, ResolutionPolicy.FIXED_WIDTH);
    //         }
    //         if (app.func.isBrowser()) {
    //             screen.windowSize = size(app.initWinSize.width, app.initWinSize.height);
    //         } else {
    //             app.native.device.setRequestedOrientation(0);
    //         }
    //     }
    // }
    // updateScreenOrientation() {
    //     let last = this.orientationList[this.orientationList.length - 1];
    //     if (last) {
    //         //是否调整原生屏幕方向
    //         (<any>this)._nativeScreenOrientation ??= ScreenOrientationType.Horizontal_true;
    //         switch (last.orientation) {
    //             case ScreenOrientationType.Vertical_true:
    //                 if ((<any>this)._nativeScreenOrientation != ScreenOrientationType.Vertical_true) {
    //                     (<any>this)._nativeScreenOrientation = ScreenOrientationType.Vertical_true;
    //                     this.refreshScreenOrientation();
    //                 }
    //                 break;
    //             case ScreenOrientationType.Horizontal_true:
    //                 if ((<any>this)._nativeScreenOrientation != ScreenOrientationType.Horizontal_true) {
    //                     (<any>this)._nativeScreenOrientation = ScreenOrientationType.Horizontal_true;
    //                     this.refreshScreenOrientation();
    //                 }
    //                 break;
    //             default:
    //                 break;
    //         }
    //         //事件通知
    //         app.event.dispatchEvent({
    //             eventName: `ChangeScreenOrientation`,
    //         });
    //     }
    // }
    // //屏幕切换--end---------------------------------------------------

    /**初始化 */
    initData() {
        app.runtime.ludo_color = app.file.getIntegerForKey(LudoColorIndexKey, LudoColorIndex.color1);
    }
}

/**人数 */
export const LudoPlayerNumKey = `SecondaryLudoPlayerNum`
export const LudoPlayerNum = {
    /**2人 */
    player2: 2,
    /**4人 */
    player4: 4
}

/**人数 */
export const LudoColorIndexKey = `SecondaryLudoColorIndex`
export const LudoColorIndex = {
    /**红 */
    color1: 1,
    /**黄 */
    color2: 2,
    /**绿 */
    color3: 3,
    /**蓝 */
    color4: 4,
}
