import { _decorator } from 'cc';
import { EVENT_ID, report_event_name, report_event_type } from '../../../config/EventConfig';
import { MODULE_NAME } from '../../../config/ModuleConfig';
import { ModuleBase } from '../ModuleBase';
import { httpConfig } from '../../../config/HttpConfig';
import { PATHS } from '../../../config/ConstantConfig';
import { EventParam } from '../../manager/FWEventManager';

const { ccclass } = _decorator;

export abstract class FacebookBase extends ModuleBase {
    public eventTokens = {};

    initModule() {
        this._module_name = MODULE_NAME.facebook;
    }

    loginFB(name, id, token) {
        let url = httpConfig.path_pay + "Login/facebook";
        let extra = {} as any;
        extra.token = token;
        extra.nickname = name;
        extra.isVpn = app.native.device.isVpnUsed()
        let loginParams = center.login.getLoginPhpParams(id, extra);

        let checkCallback = async (bSuccess: boolean, response) => {
            if (bSuccess) {
                if (response.status == 1) {
                    app.event.dispatchEvent(EventParam.FWDispatchEventParam(EVENT_ID.EVENT_LOGIN_PHP_SUCCESS));
                    if (app.http.checkPhpSign(response) && await center.login.isAllowLogin(response.wflag)) {
                        let fbUserInfo = {} as any;
                        fbUserInfo.id = id;
                        fbUserInfo.token = token;
                        fbUserInfo.name = name;
                        let fbUserInfoStr = JSON.stringify(fbUserInfo);
                        app.file.writeStringToFile({
                            fileData: fbUserInfoStr,
                            filePath: PATHS.LoginFBPWD,
                            bEncrypt:true,
                        });
                        center.roomList.downloadRoomInfo(response.version)
                        center.roomList.doPhpQuickRecharge(response.qversion)
                        center.login.loginFacebook(response.account, response.password, response.is_reg == 1)
                    }
                } else {
                    app.popup.showToast(response.info ?? fw.language.get("Facebook login failed, please enter a valid username and password"))
                    app.event.dispatchEvent(EventParam.FWDispatchEventParam(EVENT_ID.EVENT_LOGIN_PHP_FAIL))
                }
            } else {
                app.event.dispatchEvent(EventParam.FWDispatchEventParam(EVENT_ID.EVENT_LOGIN_PHP_FAIL))
            }
        }

        app.http.post({
            url: url,
            callback: checkCallback,
            params: loginParams,
        })
    }

    abstract onLoginSuccess(params);
    abstract onLoginFail(params);
    abstract onLoginCancel(params);

    abstract onShareSuccess(params);
    abstract onShareCancel(params);
    abstract onShareFail(params);

    abstract login();
    abstract logout();
    abstract shareLink(url: string, msg: string);
    abstract shareMore(url: string, title: string);
    abstract logPurchase(purchaseAmount: string, currency: string);

}