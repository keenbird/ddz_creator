import { GS_LOGIN_MSGID, sint, sint64, slong, stchar, uchar } from "../config/NetConfig";
import { LoginMainInetMsg } from "../framework/network/awBuf/MainInetMsg";
import { httpConfig, server_config, servers_default } from "../config/HttpConfig";
import { EVENT_ID } from "../config/EventConfig";
import proto from "./common";
import { CPLUSLOGINTYPE, ERRID, ERRID_MSG, LOGINTYPE, LOGINTYPE_STR, PATHS } from "../config/ConstantConfig";
import { Node as ccNode, math } from 'cc';
import { EventParam } from "../framework/manager/FWEventManager";

export class LoginCenter extends LoginMainInetMsg {
    cmd = proto.client_proto.LOGIN_SUB_MSG_ID
    // 登录信息
    m_eLoginType = LOGINTYPE.GUEST
    m_strLoginAccount = ""
    m_strLoginMd5Password = ""
    m_strLoginMachineName = ""
    m_strLoginBuffHD = ""
    m_strLoginUUID = ""
    m_strFaceMD5 = ""
    m_strFaceCheck = 0
    m_bReg = false
    m_nLoginEndUserDBID: number = 0
    m_strLoginEndKey = ""
    /**登录定时器ID */
    nShedulerLogining: NodeJS.Timeout
    /**重连定时器ID */
    nShedulerReconnect: number
    /**重连次数 */
    nReconnectCount: number
    /**重连开启时间 */
    nRreconnectStartTime: number
    netWorking: boolean = false;
    m_bRegLogin: boolean;

    m_strSessionKey = ""
    m_strOpenId = ""
    m_strToken = ""

    initData() {
    }

    initEvents() {
        this.initMainID(GS_LOGIN_MSGID.GS_LOGIN_MSGID_LOGIN);
        app.event.bindEvent({
            eventName: "WebSocketConnected",
            callback: () => {

            }
        });
    }

    initRegister() {
        // this.bindMsgStructPB(this.cmd.LSMI_LOGIN_REQ, proto.login_server.login_error_s)
        // this.bindRecvFunc(this.cmd.LSMI_LOGIN_REQ, this.OnRecv_LoginFail.bind(this))

        this.bindMsgStructPB(this.cmd.LSMI_LOGIN_RESP, proto.client_proto.LoginResp)
        this.bindRecvFunc(this.cmd.LSMI_LOGIN_RESP, this.OnRecv_LoginEnd.bind(this))

        this.bindMsgStructPB(this.cmd.LSMI_LOGIN_ATTR_NTF, proto.client_proto.LoginAttrNtf)
        this.bindRecvFunc(this.cmd.LSMI_LOGIN_ATTR_NTF, this.OnRecv_LoginAttrNtf.bind(this))

        

        // this.bindMsgStructPB(this.cmd.LOGIN_MSGID_TIPS, proto.login_server.login_tips_s)
        // this.bindRecvFunc(this.cmd.LOGIN_MSGID_TIPS, this.OnRecv_Tips.bind(this))

        this.bindMsgStructPB(this.cmd.LSMI_LOGIN_REQ, proto.client_proto.LoginReq)
    }

    /**上一次登录的UserID */
    getLoginEndUserDBID() {
        return app.file.getStringForKey(`LoginEndUserDBID`, `0`, { all: true });
    }

    loginToServer() {
        
        if (!app.socket.isWorking()) {
            this.connectServer()
            return
        }

        let loginData = proto.client_proto.LoginReq.create()

        loginData.channel = fw.DEBUG.sChannelID;
        loginData.gameVersion = app.native.device.getAppVersion();
        loginData.loginToken = this.m_strToken;
        loginData.loginAccount = this.m_strLoginAccount;
        loginData.loginPassword = this.m_strLoginMd5Password;
        loginData.loginType = CPLUSLOGINTYPE.LTD_TOKEN;
        loginData.packageName = fw.DEBUG.sPackageName;
        loginData.deviceId = app.native.device.getBiosID();
        loginData.version = app.native.device.getVersion();

        // loginData.channel = fw.DEBUG.sChannelID;
        // loginData.gameVersion = "1.0.0"
        // loginData.loginToken = "Y3BfY29kZT13eCZjcF91aWQ9b0xLX2I0azJwcVpVdmlUNEV2YlF4eGJvaVRQOCZleHBpPTE3MDQ5NDM5NzYmc2lnbj00ZTJmNjM1M2M1YTU0OTYzOTE0ODRhMTE5YzBhMTM2Mw==";
        // loginData.loginAccount = this.m_strLoginAccount;
        // loginData.loginPassword = this.m_strLoginMd5Password;
        // loginData.loginType = CPLUSLOGINTYPE.LTD_TOKEN;
        // loginData.packageName ="1"
        // loginData.deviceId = "iPhone X"
        // loginData.version = "8.0.5"


        app.file.setIntegerForKey("LoginType", this.m_eLoginType, { all: true })
        app.file.setStringForKey("LoginAccount", this.m_strLoginAccount, { all: true })
        app.file.setStringForKey("LoginMd5Pwd", this.m_strLoginMd5Password, { all: true })

        if (this.sendData(this.cmd.LSMI_LOGIN_REQ, loginData)) {
            this.startLoginingTimer()
        }
    }

  

    

    // 手机账号密码登录
    loginPhone(phoneText, loginPwd, is_reg) {
        fw.print("loginCenter:loginPhone")

        this.m_eLoginType = LOGINTYPE.PHONE
        this.m_strLoginAccount = phoneText
        this.m_strLoginMd5Password = loginPwd
        this.m_strLoginMachineName = app.native.device.getMachineName()
        this.m_strLoginBuffHD = app.native.device.getHDID()
        this.m_strLoginUUID = app.native.device.getUUID()
        this.m_bReg = is_reg

        this.loginToServer()
    }
    // 账号密码登录
    loginAccount(szInfo, loginPwd, is_reg) {
        fw.print("loginCenter:loginAccount")
        this.m_eLoginType = LOGINTYPE.ACCOUNT
        this.m_strLoginAccount = szInfo
        this.m_strLoginMd5Password = app.md5.hashStr(loginPwd)
        this.m_strLoginMachineName = app.native.device.getMachineName()
        this.m_strLoginBuffHD = app.native.device.getHDID()
        this.m_strLoginUUID = app.native.device.getUUID()
        this.m_bReg = is_reg
        this.loginToServer()
    }

    // 游客带账号登录，pc 测试用
    loginGuestLua(name) {
        this.m_eLoginType = LOGINTYPE.GUEST
        this.m_strLoginAccount = name
        this.m_strLoginMd5Password = ""
        this.m_strLoginMachineName = name
        this.m_strLoginBuffHD = ""
        this.m_strLoginUUID = ""

        var callback = function(bSuccess: boolean, response: any){
            this.m_strToken = response.data.token
            this.m_strSessionKey = ""
            this.m_strOpenId = ""
            this.m_bReg = response.data.isRegister
            this.loginToServer()
        }.bind(this)
        var params = {
            // channel_id: fw.DEBUG.sChannelID,
            account: name,
        }
        app.http.post({
            url: httpConfig.path_pay + "api/user/guestLogin",
            params: params,
            callback: (bSuccess, response) => {
                if (bSuccess) {
                    if (1 == response.code) {
                        callback ?.(bSuccess,response)
                    } else {
                        app.popup.showToast("登录失败:"+response.msg);
                    }
                } else {
                    app.popup.showToast("登录失败，请联系客服");
                }
            }
        });
    }

    // 向PHP注册登录
    loginByPhp(params: {
        channel_id: string,
        login_type: number,
        code: string,
    }, callback?: (bSuccess: boolean, response: any) => void) {
        app.http.post({
            url: httpConfig.path_pay + "api/user/login",
            params: params,
            callback: (bSuccess, response) => {
                if (bSuccess) {
                    if (1 == response.code) {
                        callback ?.(bSuccess,response)
                    } else {
                        app.popup.showToast("登录失败:"+response.msg);
                    }
                } else {
                    app.popup.showToast("登录失败，请联系客服");
                }
            }
        });
    }

    // 微信登录
    loginWeChat() {
        let self = this
        fw.print("loginCenter:loginAccount")
        this.m_eLoginType = LOGINTYPE.WEIXIN
 
        this.m_strLoginMachineName = app.native.device.getMachineName()
        this.m_strLoginBuffHD = app.native.device.getHDID()
        this.m_strLoginUUID = app.native.device.getUUID()

        var callback = function(bSuccess: boolean, response: any){
            this.m_strToken = response.data.token
            this.m_strSessionKey = response.data.thirdData.sessionKey
            this.m_strOpenId = response.data.thirdData.openid
            this.m_bReg = response.data.isRegister
            this.loginToServer()
        }.bind(this)
        var params = {
            channel_id: fw.DEBUG.sChannelID,
            login_type: this.m_eLoginType,
            code: "",
        }
        wx.login({
            success (res) {
                if (res.code) {
                    //发起网络请求
                    params.code = res.code
                    self.loginByPhp(params,callback)
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            },
            fail (res) {
                console.log('无法微信登录：' + res.errMsg )
            }
        })
    }


    getLoginPhpParams(session_id, extraLoginParams, buffhdEx?) {
        let buffhd = buffhdEx || app.native.device.getHDID()
        let params: any = {
            os: 0,
            idfa: "",
            game_id: 0,
            session_id: session_id,
            buffhd: buffhd,
            machinename: app.native.device.getMachineName(),
            kind_id: 1,
            user_type: app.native.device.getOperatorsID(),
            user_sub_type: app.native.device.getOperatorsSubID(),
            inviter: "",
            timestamp: app.func.time()
        }
        if (app.func.isAndroid()) {
            // 这里不要修改了 已经上线只能将错就错了 android 和 pc 共用来源
            params.os = 0;
            // params.os = 1;
        }
        else if (app.func.isIOS()) {
            params.os = 2;
            params.idfa = app.native.device.getIDFA()
        }
        params.sign = app.http.getSign(params)

        let extra: any = extraLoginParams || {}
        if (app.func.isAndroid()) {
            // extra.cpl_device = app.sdk.getDeviceIDParams()
        }

        let location = app.sdk.getLngAndLat()
        extra.longlat = {
            lng: location.lng,
            lat: location.lat,
        }

        params.extra = extra
        app.native.leo.extraLoginParams(params)
        params.extra = JSON.stringify(params.extra)
        return params
    }
    // 登录提示
    OnRecv_Tips(dict: proto.login_server.Ilogin_tips_s) {
        let btType = dict.type
        switch (btType) {
            case ERRID.ACCOUNT_INVALID:
            case ERRID.ACCOUNT_FREEZE:
            case ERRID.PASSWORD_ERROR:
            case ERRID.LOGIN_FREQUENT:
                app.event.dispatchEvent({
                    //事件名
                    eventName: EVENT_ID.EVENT_LOGIN_FAIL_TIPS,
                    //参数可自定义
                    dict: dict,
                })
                this.closeConnect();
                break;
        }
        let tips = dict.tips
        let msg = tips == "" ? ERRID_MSG.get(dict.type) : tips;
        if (msg) {
            app.popup.showToast(msg)
        } else {
            app.popup.showToast("UNKOWN ERROR")
        }
    }
    // 登录结果
    OnRecv_LoginEnd(dict: proto.client_proto.LoginResp) {
        app.gameManager.setServerId(0)
        app.gameManager.setRoomId(0)
        /**关闭登录计时器 */
        this.stopLoginingTimer()
        // 登录信息存储
        this.m_nLoginEndUserDBID = dict.userId
        this.m_strLoginEndKey = dict.result+""

        // 连接大厅
        // center.plaza.connectServer(this.m_eLoginType, this.m_nLoginEndUserDBID, this.m_strLoginEndKey)

        // 事件派发
        app.event.dispatchEvent({
            //事件名
            eventName: EVENT_ID.EVENT_LOGIN_LOGINEND
        })

        app.event.setUserID(this.m_nLoginEndUserDBID + "")

        app.file.setStringForKey("LoginEndUserDBID", this.m_nLoginEndUserDBID + "", { all: true })

        // 拉取活动列表 login_main.ts 已经下发了活动
        // center.activity.requestActivityList()

        // 上报注册事件
        if (this.m_bReg) {
            app.event.reportEvent("register", {
                userID: this.m_nLoginEndUserDBID + "",
                account: this.m_strLoginAccount,
                loginType: this.m_eLoginType + "",
                loginType_str: LOGINTYPE_STR[this.m_eLoginType],
            })
            this.m_bRegLogin = this.m_bReg
            this.m_bReg = false
        }
        // 上报登录事件
        // app.event.reportEvent("login", {
        //     userID: this.m_nLoginEndUserDBID + "",
        //     loginType: this.m_eLoginType + "",
        //     loginType_str: LOGINTYPE_STR[this.m_eLoginType],
        // })
    }

    OnRecv_LoginAttrNtf(dict: proto.client_proto.ILoginAttrNtf) {
        center.user.setLoginActor(dict)
        this.loginPlaza()
    }

    checkRegLogin() {
        let regLogin = this.m_bRegLogin
        this.m_bRegLogin = false
        return regLogin
    }

    /**
     * 登录失败
     * @param dict 
     */
    OnRecv_LoginFail(dict: proto.login_server.Ilogin_error_s) {
        /**关闭登录计时器 */
        this.stopLoginingTimer()
        this.closeConnect();
        app.event.dispatchEvent({
            //事件名
            eventName: EVENT_ID.EVENT_LOGIN_FAIL,
            //参数可自定义
            dict: dict.error_type,
        })
    }

    /** 网络断开*/
    inetDisconnected(event: CloseEvent) {
        // 正常关闭网络不给提示
        if (!this.netWorking) {
            return
        };
        let timeOutCallback = () => {
            fw.scene.changePlazaUpdate();
        }
        let sceneConfig = fw.scene.getSceneConfig();
        if (sceneConfig == fw.SceneConfigs.update) {
            app.popup.showTip({
                text: "Network connection timed out",
                btnList: [
                    {
                        styleId: 3,
                        callback: timeOutCallback,
                    },
                ],
                closeCallback: timeOutCallback,
            });
            return;
        }
        //登录
        if (sceneConfig == fw.SceneConfigs.login) {
            app.popup.showTip({
                text: "Network connection timed out",
                btnList: [
                    {
                        styleId: 3,
                        callback: timeOutCallback,
                    },
                ],
                closeCallback: timeOutCallback,
            });
            return;
        }
        //重连逻辑
        if (fw.scene.isGameScene()) {
            // gameCenter.game: setReconnectStatus(true);
        }
        let interruptCallback = () => {
            fw.scene.changePlazaUpdate();
        }
        app.popup.showTip({
            title: `Notice`,
            text: `Network connection interrupted, please retry.`,
            btnList: [
                {
                    text: `OK`,
                    styleId: 3,
                    callback: interruptCallback,
                },
            ],
            closeCallback: interruptCallback,
        });
    }
    /**登录定时器 */
    loginingTimeout() {
        this.closeConnect();
        let loginTimeOutCallback = () => {
            fw.scene.changePlazaUpdate();
        }
        app.popup.showTip({
            text: "Login timed out",
            btnList: [
                {
                    styleId: 3,
                    callback: loginTimeOutCallback,
                },
            ],
            closeCallback: loginTimeOutCallback,
        });
    }
    /**开启登录定时器 */
    startLoginingTimer() {
        this.stopLoginingTimer()
        this.nShedulerLogining = setTimeout(this.loginingTimeout.bind(this), 5000);
    }
    /**停止登录定时器 */
    stopLoginingTimer() {
        clearTimeout(this.nShedulerLogining);
        this.nShedulerLogining = null;
    }
    /**连接服务器 */
    connectServer() {
        this.netWorking = true
        app.socket.connect();
    }
    //关闭连接
    closeConnect() {
        this.netWorking = false
        this.stopLoginingTimer();
        //关闭socket
        app.socket.disconnect();
    }

    showLoginNotice() {
        let channel = app.native.device.getOperatorsID();
        app.http.get({
            url: httpConfig.path_pay + `update/getStopServers`,
            params: {
                channel: channel,
                sign: app.md5.hashStr(channel + `aiwan2019`),
            },
            callback: (bSuccess, response) => {
                if (bSuccess) {
                    //不在登录场景就不弹了
                    if (fw.scene.getSceneName() != fw.SceneConfigs.login.sceneName) {
                        return;
                    }
                    let content = response;
                    // content.status = 1
                    // content.data = {}
                    // content.data.content = 1;
                    // content.data.title = "test";
                    // content.data.type = 1
                    if (content.status == 1 && parseInt(content.data.type) == 1) {
                        app.event.dispatchEvent({
                            //事件名
                            eventName: EVENT_ID.EVENT_LOGIN_NOTICE_UPDATE,
                            //参数可自定义
                            data: content,
                        })
                    }
                } else {
                    fw.printError("RequestInfo failed")
                }
            }
        });
    }

    /**记录登入次数 */
    setTodayLoginTimes() {
        let oldInfo = app.file.getStringForKey(`USER_EVERYDAY_LOGIN_TIME`, `0,0`).split(`,`);
        let now = app.func.time_YMD();
        let old = oldInfo[0];
        let nTimes = old != now ? 0 : Number(oldInfo[1]) + 1;
        app.file.setStringForKey(`USER_EVERYDAY_LOGIN_TIME`, `${now},${nTimes}`);
    }
    /**获取登入次数 */
    getTodayLoginTimes(): number {
        let oldInfo = app.file.getStringForKey(`USER_EVERYDAY_LOGIN_TIME`, `0,0`).split(`,`);
        let now = app.func.time_YMD();
        let old = oldInfo[0];
        return old != now ? 0 : Number(oldInfo[1]);
    }

    getUserDBID() {
        return this.m_nLoginEndUserDBID
    }

    getszKey() {
        return this.m_strLoginEndKey
    }

    bindPhoneSuccess(name, password) {
        if (this.m_eLoginType == LOGINTYPE.GUEST && name && name != "") {
            this.m_strLoginAccount = name
            this.m_strLoginMd5Password = password
            let data: FWLocalStorageExParam = {}
            data.all = true;
            app.file.setStringForKey("LoginAccount", name, data)
            app.file.setStringForKey("LoginMd5Pwd", password, data)
        }
    }

    async isAllowLogin(wflag:number = 1) {
        // 关闭模拟器校验
        // if (wflag == 0) {
        //     if (await app.native.device.checkIsAndroidEMU()) {
        //         app.popup.showToast(fw.language.get("Network connection error, please contact customer service.-301"))
        //         return false;
        //     }
        // }
        return true;
    }

    selectServer(serverData: server_config) {
        if (fw.DEBUG.bSelectServer || app.func.isBrowser()) {
            app.popup.showDialog({
                viewConfig: fw.BundleConfig.login.res["testlogin/login_main"],
            });
        } else {
            this.loginPlaza()
        }
        //保存配置
        app.file.setStringForKey("LastSelectServer", JSON.stringify(serverData), { all: true });
        //设置service配置
        app.socket.initServerConfig(serverData);
        //请求Sdk开关
        // app.sdk.requestSdkOpenInfo(this.updateServerProxy.bind(this, this.changeToUpdate.bind(this)))
        // //刷新大厅列表排序
        // center.roomList.loadRoomSortInfo();

        
    }
    loginPlaza(){
        //显示预加载界面
        fw.scene.changeScene(fw.SceneConfigs.plaza);

    }
    changeToUpdate(result) {
        if (fw.DEBUG.bServerProxy) {
            let list: any[] = result.data.list;
            let index = math.randomRangeInt(0, list.length);
            let socketData = list[index];
            let socketConfig = {
                url_login: socketData.ip,
                port_min: socketData.sport,
                port_max: socketData.eport,
            }
            //设置socket配置
            app.socket.setSocketConfig(socketConfig)
        }
        //检测更新
        app.popup.showLoading();
        // app.popup.showMain({
        //     viewConfig: fw.BundleConfig.update.res["update/update_main"],
        //     callback: (view: ccNode) => {
        //         app.popup.closeLoading();
        //     }
        // });
    }


    updateServerProxy(callback) {
        let fail = (msg?) => {
            let reTry = () => {
                this.updateServerProxy(callback)
            }
            app.popup.showTip({
                text: msg || "The network connection timed out, please try again. Error code: PHP101",
                btnList: [
                    {
                        styleId: 1,
                        callback: reTry
                    }
                ],
                closeCallback: reTry
            });
        }

        let channel = app.native.device.getOperatorsID()
        let user_id = this.getLoginEndUserDBID()
        let url = httpConfig.path_pay + "Server/Proxy"

        let params = {
            channel: channel,
        } as any

        if (user_id != "0") {
            params.user_id = user_id
        }

        app.http.post({
            //请求链接
            url: url,
            //完成时回调函数
            callback: (successed, result) => {
                if (successed && result && result.status == 1) {
                    callback(result)
                    return
                }
                fail();
            },
            //请求参数
            params: params,
        })
    }

    doPhpPhoneLogin(phoneNum,extra:{token?:string,pwd?:string} = {}) {
        extra["isVpn"] = app.native.device.isVpnUsed()
        let params = center.login.getLoginPhpParams(phoneNum,extra)
		app.http.post({
			url: `${httpConfig.path_pay}Login/phonev2`,
			params: params,
			callback: async (bSuccess: boolean, response: any) => {
				if (bSuccess) {
					if (response.status == 1) {
						app.event.dispatchEvent(EventParam.FWDispatchEventParam(EVENT_ID.EVENT_LOGIN_PHP_SUCCESS));
						if (await center.login.isAllowLogin(response.wflag) && app.http.checkPhpSign(response)) {
							let phoneInfo = {
								pwd: response.password,
								phoneNum: phoneNum,
							};
							app.file.writeStringToFile({
								fileData: JSON.stringify(phoneInfo),
								filePath: PATHS.LoginPhonePWD,
                                bEncrypt:true,
							});
							center.roomList.downloadRoomInfo(response.version);
                            center.roomList.doPhpQuickRecharge(response.qversion)
							center.login.loginPhone(response.account, response.password, response.is_reg == 1);
						}
					} else {
						app.popup.showToast(response.info || `Login failed`);
						app.event.dispatchEvent(EventParam.FWDispatchEventParam(EVENT_ID.EVENT_LOGIN_PHP_FAIL));
					}
				} else {
					app.event.dispatchEvent(EventParam.FWDispatchEventParam(EVENT_ID.EVENT_LOGIN_PHP_FAIL));
				}
			}
		});
    }
}