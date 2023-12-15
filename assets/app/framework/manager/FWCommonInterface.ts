
import { game } from "cc";

import { CustomFormData } from "./FWHttpManager";
import { httpConfig } from "../../config/HttpConfig";

export class FWCommonInterface extends fw.FWComponent {
    /**反馈 */
    public uploadFeedback(data: FeedbackParam) {
        //冷却时间
        if ((<any>this).nLastFeedbackTime) {
            let nDiffTime = 30 - (app.func.time() - (<any>this).nLastFeedbackTime);
            if (nDiffTime > 0) {
                app.popup.showToast(`Feedback too frequently, try again in ${nDiffTime} seconds.`);
                return;
            }
        }
        (<any>this).nLastFeedbackTime = app.func.time();
        let form: any;
        let userID = data.userID ?? center.login.getLoginEndUserDBID();
        if (app.func.isBrowser()) {
            form = new FormData();
            if (data.file) {
                form.set(`feedfile`, data.file, `file.png`);
                form.set(`filename`, `file.png`);
            }
        } else {
            form = new CustomFormData();
            if (data.filePath) {
                let arrayBuffer = app.file.getDataFromFile(data.filePath);
                form.set(`feedfile`, arrayBuffer, `file.png`);
                form.set(`filename`, `file.png`);
            }
        }
        form.set(`user_id`, `${userID}`);
        //服务器大小64
        form.set(`email`, `${data.email ?? center.user.getEmail()}`);
        //服务器大小64
        form.set(`phone`, `${data.phone ?? center.user.getActorPhone()}`);
        //服务器大小不限
        form.set(`contents`, `${data.content ?? ``}`);
        form.set(`recharge_id`, `${data.recharge_id ?? ``}`);
        form.set(`kind_id`, `1`);
        form.set(`game_version`, app.native.device.getAppVersion());
        form.set(`system_version`, app.native.device.getVersion());
        form.set(`mobile_model`, app.native.device.getMachineName());
        form.set(`utr`, data.utr ?? ``);
        form.set(`token`, app.md5.hashStr(`${userID}ledou2016`));
        form.set(`submit`, `Submit`);
        form.set(`cat_id`, `${data.feedbackType ?? 0}`);
        app.http.post({
            url: `${httpConfig.path_pay}Public/UploadFeedbackImg`,
            body: form,
            callback: (bSuccess, response) => {
                if (bSuccess) {
                    if (!fw.isNull(response)) {
                        if (response.status > 0) {
                            if (fw.isValid(this)) {
                                data.callback && data.callback(response);
                            }
                        } else {
                            fw.printWarn(response.info);
                        }
                    }
                } else {
                    fw.printError("upload head faild!");
                }
            }
        });
    }
    /**对比apk版本，返回true代表需要更新 */
    public contrastApkVersion(oldVersion: string, newVersion: string) {
        if (!newVersion) {
            return false;
        }
        if (!oldVersion) {
            return true;
        }
        let oldVersionList = oldVersion.split(`.`);
        let newVersionList = newVersion.split(`.`);
        if (oldVersionList.length != newVersionList.length) {
            return true;
        } else {
            for (let i = 0; i < oldVersionList.length; ++i) {
                if (app.func.toNumber(oldVersionList[i]) < app.func.toNumber(newVersionList[i])) {
                    return true;
                }
            }
        }
        return false;
    }
    /**安装apk */
    public installApk(filePath: string) {
        if (app.native.device.hasPermissions(`android.permission.REQUEST_INSTALL_PACKAGES`)) {
            app.native.device.installApk(filePath);
        } else {
            //显示加载
            app.popup.showLoading();
            //请求权限
            app.native.device.requestPermissions(fw.language.get(`Tips`), 1, `android.permission.REQUEST_INSTALL_PACKAGES`);
            //监听事件
            this.bindEvent({
                bOne: true,
                eventName: `RequestPermissionsResp`,
                callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam) => {
                    //隐藏加载
                    app.popup.closeLoading();
                    let data = arg1.data;
                    if (data.bSuccess) {
                        app.native.device.installApk(filePath);
                    } else {
                        if (data.params.requestCode == 1) {
                            app.popup.showTip({
                                text: fw.language.get("Failed to request permission. Go to Settings."),
                                btnList: [
                                    {
                                        styleId: 1,
                                        text: fw.language.get("Go"),
                                        bNotClose: true,
                                        callback: () => {
                                            //先弹提示
                                            app.popup.showTip({
                                                text: fw.language.get("Have you agreed to these permissions?"),
                                                btnList: [
                                                    {
                                                        styleId: 2,
                                                        text: fw.language.get("No"),
                                                        callback: () => {
                                                            game.end();
                                                        }
                                                    },
                                                    {
                                                        styleId: 1,
                                                        text: fw.language.get("Yes"),
                                                        callback: () => {
                                                            this.installApk(filePath);
                                                        }
                                                    },
                                                ],
                                                closeCallback: () => {
                                                    game.end();
                                                }
                                            });
                                            //前往设置
                                            app.native.device.gotoSettings(fw.language.get("Tips"), fw.language.get("This app requires these permissions to function properly."));
                                        }
                                    },
                                ],
                                closeCallback: () => {
                                    game.end();
                                }
                            });
                        } else {
                            app.popup.showTip({
                                text: fw.language.get("update failed"),
                                btnList: [
                                    {
                                        styleId: 1,
                                        text: fw.language.get("exit"),
                                        callback: () => {
                                            game.end();
                                        }
                                    },
                                ],
                                closeCallback: () => {
                                    game.end();
                                }
                            });
                        }
                    }
                }
            });
        }
    }
}
