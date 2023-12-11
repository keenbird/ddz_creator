export class JumpManager extends (fw.FWComponent) {
    /**常规活动统一跳转接口 */
    jump(data: ActivityConfig) {
        let extend = app.http.parseUrl_schemeWork(data.url);
        if (extend.methon) {
            //执行对应函数
            if (this[extend.methon]) {
                this[extend.methon](extend,data);
            } else {
                app.func.isWin32() && app.popup.showToast({
                    text: `当前活动跳转接口还未在JumpManager中实现 -> ${extend.methon}`
                });
            }
        }
    }
    /**??? */
    schemeWork(scheme: string) {
        //TODO
    }
    /**比较版本 */
    comparisonVersion(version1: string, version2: string) {
        let v1 = Number(version1.replace(`.`, ``)) || 0;
        let v2 = Number(version2.replace(`.`, ``)) || 0;
        return v1 > v2 ? 1 : -1;
    }

    gotoShare() {
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`freeCash/freeCash_share`]
		});
    }

    openURL(params:{webUrl?:string},data:ActivityConfig) {
        app.native.device.openURL(params.webUrl);
    }

    refer() {
        if (center.user.isSwitchOpen("btShareSwitch")) {
            if (center.user.isSwitchOpen("btLEOShare") && app.sdk.isSdkOpen("leoshare")) {
                app.popup.showDialog({
                    viewConfig: fw.BundleConfig.plaza.res[`myRefer/myShare`]
                });
            } else {
                app.popup.showDialog({
                    viewConfig: fw.BundleConfig.plaza.res[`myRefer/myRefer`]
                });
            }
        }
    }

    gotoGame(params:{ID?:string},data:ActivityConfig) {
        center.roomList.gotoRoom({kindId:parseInt(params.ID)})
    }
};
