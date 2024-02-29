import { Node } from "cc";

import { ACTOR,PROTO_ACTOR } from "../config/cmd/ActorCMD";
import { EVENT_ID } from "../config/EventConfig";
import { httpConfig } from "../config/HttpConfig";
import { DF_RATE } from "../config/ConstantConfig";
import { GS_PLAZA_MSGID } from "../config/NetConfig";
import { EventHelp, addEvent } from "../framework/manager/FWEventManager";
import { PlazeMainInetMsg } from "../framework/network/awBuf/MainInetMsg";
import proto from "./common";
import { Type } from "protobufjs";




enum GUIDE {
    // //新手引导权限
    // GUIDE_GOTO_NEW_ROOM = 0x0001,          //已进入新手房
    GUIDE_WIN_NEW_ROOM = 0x0002,          //已完成第1胜局
    // GUIDE_GOTO_JUNIOR_ROOM = 0x0004,          //已进入初级房
    GUIDE_WIN_JUNIOR_ROOM = 0x0008,          //已完成第2胜局
    GUIDE_CLIENT_JUNIOR_ROOM = 0x0010,          //已在结束界面的左边按钮 -> 领取红包券
    GUIDE_EXCHANGE_RED_PACKET_VALUE = 0x0020,          //已点击兑换商城
    // GUIDE_WIN_HBQ_ROOM = 0x0040,          //已完成1胜局中级房
    // GUIDE_EXCHANGE_HBQ = 0x0080,          //已兑换1元微信红包
    // GUIDE_WIN_HBQ_ROOM_SECOND = 0x0100,          //已完成2胜局中级房
    GUIDE_WIN_THREE = 0x0200,          //已完成3胜局
    GUIDE_XXL_ENTER_ROOM = 0x10000,         //进入房间
    GUIDE_XXL_JIASU = 0x20000,         //加速引导
    GUIDE_GUOSHANCHE_GAME = 0x80000,         //过山车引导

    //新手2
    NOVICE_GUIDE_WIN_NEW_ROOM_ONE = 0x0001, //赢1局新手房
    NOVICE_GUIDE_WIN_NEW_ROOM_TWO = 0x0002, //赢2局新手房
    NOVICE_GUIDE_WIN_NEW_ROOM_THREE = 0x0004, //赢3局新手房
    NOVICE_GUIDE_WIN_NEW_ROOM_FOUR = 0x0008, //赢4局新手房
    NOVICE_GUIDE_WIN_NEW_ROOM_FIVE = 0x0010, //赢5局新手房
    NOVICE_GUIDE_WIN_NEW_HIGH_ROOM_ONE = 0x0020, //赢1局新手高级房
    // NOVICE_GUIDE_WIN_EXCHANGE_FINISH = 0x0040 //兑换成功// 用老的
}

const enum ACTORTIPS {
    ACTORTIPS_NAME_LEN_ERR,
    ACTORTIPS_PHONE_INVALID,
    ACTORTIPS_INVALID,
    ACTORTIPS_ARGSERR,
}

const ERRID_MSG: Map<ACTORTIPS, string> = new Map([
    [ACTORTIPS.ACTORTIPS_NAME_LEN_ERR, /**lang*/"Nickname cannot exceed 15 characters"],
    [ACTORTIPS.ACTORTIPS_PHONE_INVALID, /**lang*/"Invalid Phone Number!"],
    [ACTORTIPS.ACTORTIPS_INVALID, /**lang*/"Invalid bonus!"],
    [ACTORTIPS.ACTORTIPS_ARGSERR, /**lang*/"Invalid Param!"],
])

export const ENCONTAINER_EQUIP = 1	//装备
export const ENCONTAINER_PACKET = 2	//背包



//功能开启标志
const OPENFLAG_FIRSTRECHARGE = 0x1 //首次充值
const OPENFLAG_FIRSTSIGN = 0x2 //首次签到
const OPENFLAG_FIRSTLOGIN = 0x4 //首次登陆游戏
const OPENFLAG_FIRSTBINDPHONE = 0x8 //首次绑定手机


export class UserCenter extends PlazeMainInetMsg {
    event = new EventHelp()
    /**命令ID */
    cmd = proto.client_proto.USER_INFO_SUB_MSG_ID
    /**功能开关 */
    switchInfo: { [key: string]: number }
    /**引导是否完成 */
    guideFlag = {}
    /**引导标识 */
    BITSETFLAG = BITSETFLAG
    /**易变属性 */
    _actorProp = new Proxy(<any>{}, {
        set(target: object, p: string , newValue: any, receiver: any): boolean {
            /**旧值 */
            let oldValue = Reflect.get(target, p);
            /**刷新数值 */
            Reflect.set(target, p, newValue, receiver);
            /**事件通知 */
            app.event.dispatchEvent({
                //事件名为枚举类型键值
                eventName: center.user.getActorEventName(p),
                data: {
                    oldValue: oldValue,
                    newValue: newValue,
                }
            });
            return true;
        }
    });

    nRegisterTime = 0 // 用户注册时间
    nNewSevenTimes = 0 // 新版七天生效时间
    mActorProrUseChannelid = 0 // 用户注册渠道
    mBackToPlazaHasShow = 0
    private _mVipLvInfoList: VipLvInfo[] = [];
    private _mVipLvInfo: any
    private _otherInfo: any = {};
    private _mVipRewardStatus: any;
    mUserInfoFromWebData: any = {};
    mUserInfoFromErrorTime = 0; //webUserData接口拉取数据失败次数
    private _mShareConfig: {};
    nPlazaServerID: any;
    mIsFirstCashAllComplete = false;//当前商城所有配置有返利的金额是否已经充过值


    initData() {
        this.cleanUserData()
    }

    cleanUserData(): void {
        this._mVipLvInfo = {}
        this.mBackToPlazaHasShow = 0
        this.mIsFirstCashAllComplete = false;
    }

    initEvents() {
        super.initEvents()
        this.initMainID(GS_PLAZA_MSGID.GS_PLAZA_MSGID_ACTOR);

        //游戏广播中假如收到我的属性变更，这里要处理
        this.bindEvent({
            eventName: EVENT_ID.EVENT_PLAY_ACTOR_VARIABLE,
            callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam) => {
                //刷新自身金币
                if(arg1.dict.actor[PROTO_ACTOR.UAT_UID] == this.getUserID()){
                    this.setActorProp(arg1.dict.btPropID,arg1.dict.nNewValue);
                }
            }
        });
    }
    initRegister() {
        //玩家易变属性
        this.bindMessage({
            struct: proto.client_proto.UserAttriChangePush,
            cmd: this.cmd.UISMI_USER_ATTRI_CHANGE_PUSH,
            callback: this.OnRecv_ActorVariable.bind(this)
        });
        //用户数据变更推送
        this.bindMessage({
            struct: proto.client_proto.UserADataChangePush,
            cmd: this.cmd.UISMI_USER_DATA_CHANGE_PUSH,
            callback: this.OnRecv_UserDataChange.bind(this)
        });
        //请求背包数据
        this.bindMessage({
            struct: proto.client_proto.UserBagDataReq,
            cmd: this.cmd.UISMI_USER_BAG_REQ,
        });
        //请求背包数据返回
        this.bindMessage({
            struct: proto.client_proto.UserBagDataResp,
            cmd: this.cmd.UISMI_USER_BAG_RESP,
            callback: this.OnRecv_UserBagResp.bind(this)
        });
        
  
    }
    /**获取属性事件名 =>（ACTOR[PROTO_ACTOR.UAT_GOLD] 或者 `ACTOR_EVENT_${PROTO_ACTOR.UAT_FACE_URL}`） */
    getActorEventName(actorName: string) {
        return PROTO_ACTOR[actorName] ?? `ACTOR_EVENT_${actorName}`;
    }
    /**获取自身属性 */
    getActor() {
        return this._actorProp;
    }
    /**获取广场ID */
    getActorPlazaID() {
        return this.nPlazaServerID;
    }
    /**获取玩家属性 */
    getActorProp(actor: ACTOR | string | number): any {
        return this._actorProp[actor];
    }
    /**设置玩家属性 */
    setActorProp(actor: ACTOR | string | number,value:string | number): any {
        return this._actorProp[actor] = value;
    }
    /**获取玩家vip等级 */
    getActorVipLevel() {
        return this._actorProp[ACTOR.ACTOR_PROP_VIPLEVEL];
    }
    /**获取玩家姓名 */
    getActorName(): string {
        return this._actorProp[PROTO_ACTOR.UAT_NICKNAME] ?? ``;
    }
    /**得到玩家手机号 */
    getActorPhone() {
        return this._actorProp[`szPhone`] ?? ``;
    }
    /**获取玩家头像 */
    getActorMD5Face(): string {
        return this._actorProp[PROTO_ACTOR.UAT_FACE_TYPE] == 1 ? this._actorProp[PROTO_ACTOR.UAT_FACE_ID] : this._actorProp[PROTO_ACTOR.UAT_FACE_URL]
    }
    /**设置玩家头像 */
    setActorMD5Face(md5Face: string): void {
        this._actorProp[PROTO_ACTOR.UAT_FACE_URL] = md5Face;
    }
    /**获取玩家ID */
    getUserID(): number {
        return this._actorProp[PROTO_ACTOR.UAT_UID];
    }
    /**充值总额 */
    getTotalRecharged(): number {
        return this._actorProp[ACTOR.ACTOR_PROP_RECHARGE_AMOUNT] ?? 0;
    }
    /**是否未充值 */
    isNotRecharged(): boolean {
        return !(this.getTotalRecharged() > 0);
    }
    /**获取玩家金币 */
    getActorGold(): number {
        return this._actorProp[PROTO_ACTOR.UAT_GOLD];
    }
    /**获取玩家钻石 */
    getActorDiamond(): number {
        return this._actorProp[PROTO_ACTOR.UAT_DIAMOND];
    }
    /**获取邮箱地址（web数据） */
    getEmail() {
        return this.mUserInfoFromWebData.email ?? ``;
    }
    /**获取手机号码（web数据） */
    getPhone() {
        return this.mUserInfoFromWebData.phone ?? ``;
    }
    /**获取提现手机号码（web数据） */
    getWithdrawPhone() {
        return this.mUserInfoFromWebData.withdrawphone ?? ``;
    }
    /**获取实名（web数据） */
    getRealName() {
        return this.mUserInfoFromWebData.realname ?? ``;
    }
    /**是否已经绑定了手机号（web数据） */
    isBindPhone() {
        return !!(this.getPhone());
    }
    /**是否填写了名字和邮箱（web数据） */
    isFillUserInfo() {
        return !!(this.getRealName() && this.getEmail());
    }
    /**是否完整 支付所需手机号，邮箱，姓名（web数据） */
    isFillAllPayInfo() {
        return !!(this.getRealName() && this.getEmail() && this.getWithdrawPhone());
    }
    /**得到分享配置 */
    getShareConfig() {
        return this._mShareConfig;
    }
    //得到绑定手机奖励金币
    getBindAwakeGold() {
        return this._otherInfo["bind_awake_gold"];
    }
    //是否是首次登录玩家
    isFristLogin() {
        return this._otherInfo["IsFirstLogin"] ?? false;
    }
    getFristLoginReward() {
        return this._otherInfo["FirstLoginReward"] ?? {};
    }
    //是否绑定手机
    isBindingPhone() {
        return (this._actorProp[ACTOR.ACTOR_PROP_OPENFLAG] & OPENFLAG_FIRSTBINDPHONE) != 0;
    }
    //是否是游客
    isGuest() {
        return this._actorProp[ACTOR.ACTOR_PROP_ISGUEST] == 1
    }
    //是否是GM
    isGM() {
        return this._actorProp[ACTOR.ACTOR_PROP_GM] != 0
    }
    //判断某个功能是否开启
    isOpenFlag(flag: number) {
        return (this._actorProp[ACTOR.ACTOR_PROP_OPENFLAG] & flag) != 0;
    }
    /**获取玩家流水 */
    getGameStatement() {
        return this._actorProp[ACTOR.ACTOR_PROP_GAME_STATEMENT] || 0
    }
    getVIPLevelInfoArray() {
        return this._mVipLvInfoList
    }
    getMaxLevel() {
        return this._mVipLvInfoList.length - 1
    }

    getVipRewardInfo() {
        return this._mVipLvInfo
    }

    getRewardStatus() {
        return this._mVipRewardStatus
    }

    getVipLv(vip_ex: number) {
        let maxLen = this._mVipLvInfoList.length;
        if (maxLen == 0) return 0;
        for (const iterator of this._mVipLvInfoList) {
            if (vip_ex < iterator.nNeedExp) {
                return iterator.nLevel
            }
        }
        return this._mVipLvInfoList[maxLen - 1].nLevel;
    }

    getVipLevelInfo(level: number) {
        let vipInfo: VipLvInfo = {
            nLevel: 0,
            nNeedExp: 0,
            nDayBonusLimit: 0,
            nWeekBonusLimit: 0,
            nMonthBonusLimit: 0,
        }
        for (let v of this._mVipLvInfoList) {
            if (level == v.nLevel) {
                vipInfo = v
                break
            }
        }
        return vipInfo
    }

    //修改用户资料，姓名+性别
    sendSubmitModifyActorInfo(szName: string, nSex: number) {
        let data = proto.plaza_actorprop.actor_modify_data_c.create()
        data.name = szName
        data.sex = nSex
        this.sendMessage({
            cmd: this.cmd.PLAZA_ACTOR_MODIFYDATA,
            data: data
        });
    }
    //修改用户资料，姓名
    sendSubmitModifyName(szName: string) {
        let nSex = center.user.getActorProp(PROTO_ACTOR.UAT_SEX)
        this.sendSubmitModifyActorInfo(szName, nSex)
    }

    //修改用户资料，性别
    sendSubmitModifySex(nSex: number) {
        let szName = center.user.getActorName()
        this.sendSubmitModifyActorInfo(szName, nSex)
    }

    /**获取验证码 */
    getVerification(params: {
        phone: string,
        type: number,
        buffhd?: string,
        user_type?: string,
        user_sub_type?: string,
        timestamp?: number,
    }, callback?: (bSuccess: boolean, response: any) => void) {
        params = Object.assign({
            buffhd: app.native.device.getHDID() ?? `0`,
            user_type: app.native.device.getOperatorsID() ?? `0`,
            user_sub_type: app.native.device.getOperatorsSubID() ?? `0`,
            timestamp: app.func.time(),
        }, params)
        app.http.post({
            url: `${httpConfig.path_pay}User/sendSmsV2`,
            params: params,
            callback: (bSuccess: boolean, response: any) => {
                if (bSuccess) {
                    if (response.status == 1) {
                        callback?.(true, response);
                        app.popup.showToast(`OTP sent successfully`);
                    } else {
                        callback?.(false, response);
                        app.popup.showTip({ text: response.info ?? `OTP sending failed, please try again` });
                    }
                } else {
                    callback?.(false, response);
                    app.popup.showTip({ text: `OTP sending failed, please try again` });
                }
            }
        });
    }

    /**
     * 绑定手机
     * @param phone 
     * @param szVerify 
     */
    doBindPhone(phone: string, szVerify: string) {
        app.http.post({
            url: httpConfig.path_pay + "Hall/GuestBindPhone",
            params: {
                user_id: this.getActorProp(PROTO_ACTOR.UAT_UID),
                phone: phone,
                token: szVerify,
                timestamp: app.func.time()
            },
            callback: (bSuccess, response) => {
                if (bSuccess) {
                    if (1 == response.status) {
                        center.login.bindPhoneSuccess(response.data.account, response.data.password);
                        this.updateUserPhoneBind(phone);
                        app.popup.showToast("Binding succeeded");
                        app.event.dispatchEvent({ eventName: EVENT_ID.EVENT_ACTOR_BINDING_PHONE });
                    } else {
                        app.popup.showToast(response.info ?? "Binding failed");
                    }
                } else {
                    app.popup.showToast("Binding failed");
                }
            }
        });
    }


    /**
     * 获取用户基础信息from web
     */
    initUserInfoFromWeb() {
        this.mUserInfoFromWebData = {};
        app.http.post({
            url: httpConfig.path_pay + "hall/userInfo",
            params: {
                user_id: this.getActorProp(PROTO_ACTOR.UAT_UID),
                timestamp: app.func.time()
            },
            callback: (bSuccess, response) => {
                if (bSuccess) {
                    this.mUserInfoFromErrorTime = 0;
                    if (1 == response.status) {
                        this.mUserInfoFromWebData = response.data
                        this.updateUserInfoBind(response.data?.email, response.data?.realname)
                        this.updateUserPhoneBind(response.data?.phone)
                    }
                } else {
                    this.mUserInfoFromErrorTime++;
                    if (this.mUserInfoFromErrorTime < 3) {
                        this.initUserInfoFromWeb();
                    }
                }
            }
        });
    }
    /**
     * 更新用户邮箱和真实姓名信息
     * @param email 
     * @param name 
     * @returns 
     */
    updateUserInfoBind(email: string, name: string) {
        if ((email ?? "") == "" || (name ?? "") == "") return;
        let nameInfo = {
            email: email,
            name: name,
        }
        app.file.setStringForKey("userInfoBindStr", JSON.stringify(nameInfo));
        app.file.setIntegerForKey("userInfoBind", 1);
        this.updateUserPayInfoBind();
    }
    /**
     * 更新用户手机信息
     * @param phone 
     * @returns 
     */
    updateUserPhoneBind(phone: string) {
        if ((phone ?? "") == "") return;
        let isPhone = /^\d+$/.test(phone)
        if (isPhone) {
            //赋值
            this._actorProp[`szPhone`] = phone;
            this.mUserInfoFromWebData.phone = phone;
            app.file.setIntegerForKey("userPhoneBind", 1);
            this.updateUserPayInfoBind();
        }
    }
    /**
     * 更新用户支付信息
     */
    updateUserPayInfoBind() {
        let userInfoBind = app.file.getIntegerForKey("userInfoBind", 0) == 1;
        let userPhoneBind = app.file.getIntegerForKey("userPhoneBind", 0) == 1
        if (userInfoBind && userPhoneBind) {
            app.file.setIntegerForKey("userPayInfoBind", 1);
        }
    }

    chooseDefaultHead(headMd5) {
        app.http.post({
            url: httpConfig.path_pay + "user/facev2",
            params: {
                uid: this.getActorProp(PROTO_ACTOR.UAT_UID),
                md5: headMd5,
                timestamp: app.func.time()
            },
            callback: (bSuccess, response) => {
                fw.print("chooseDefaultHead 访问成功", response)
                if (bSuccess) {
                    if (1 == response.status) {
                    }
                } else {
                }
            }
        });
    }
    /**
     * 新版七天生效时间
     * @returns 
     */
    getTaskSevenTime() {
        return this.nNewSevenTimes
    }
    /**
     * 注册时间
     * @returns 
     */
    getRegisterTime() {
        return this.nRegisterTime ?? 0;
    }
    /**
     * 是否是闲玩小号
     * @returns 
     */
    isXianWanXiaoHao() {
        return (this._actorProp[ACTOR.ACTOR_PROP_RIGHT] & 0x02) == 0x02
    }
    /**
     * 玩家登录属性储存
     * @param dict 
     */
    setLoginActor(dict: proto.client_proto.ILoginAttrNtf){
        this._actorProp[PROTO_ACTOR.UAT_NICKNAME] = dict.nickname;
        this._actorProp["szPhone"] = dict.phone;
        this._actorProp[PROTO_ACTOR.UAT_UID] = dict.userId;PROTO_ACTOR.UAT_NICKNAME
        this._actorProp[PROTO_ACTOR.UAT_SEX] = dict.sex; // 性别('f'=男 'm'=女)
        this._actorProp[PROTO_ACTOR.UAT_FACE_URL] = dict.imgUrl;
        this._actorProp[PROTO_ACTOR.UAT_FACE_TYPE] = dict.imgType; //0:系统头像  1：自定义头像
        this._actorProp[PROTO_ACTOR.UAT_FACE_ID] = dict.imgId;
        this._actorProp[PROTO_ACTOR.UAT_DIAMOND] = dict.diamond;
        this._actorProp[PROTO_ACTOR.UAT_GOLD] = dict.goldbean;
        this.mActorProrUseChannelid = app.func.toNumber(dict.channel);//玩家渠道ID
    }


    //获取玩家玩牌总局数
    getTotalGamePlayCount() {
        return this._actorProp[ACTOR.ACTOR_PROP_LOSTCOUNT] ?? 0
            + this._actorProp[ACTOR.ACTOR_PROP_WINCOUNT] ?? 0
            + this._actorProp[ACTOR.ACTOR_PROP_DRAWCOUNT] ?? 0
        // + this._actorProp[ACTOR.ACTOR_PROP_DROPCOUNT] ?? 0
    }

    isFirstPlayGame() {
        return this.getTotalGamePlayCount() < 1
    }
    //每日超值礼包购买标记
    getActorOverFlowBagFlag() {
        return this._actorProp[ACTOR.ACTOR_PROP_DAY_OVERFLOWBAG_FLAG] == 0
    }
    //玩家vip经验
    getActorVipExp() {
        return this._actorProp[ACTOR.ACTOR_PROP_VIPEXP]
    }


    /**
     * 玩家易变属性
     * @param dict 
     */
    OnRecv_ActorVariable(dict: proto.client_proto.IUserAttriChangePush) {
        dict.attriList.forEach(v => {
            this._actorProp[v.key] = v.valueType == 1 ?  app.func.toNumber(v.value) : v.value
            this.event.dispatchEvent({
                eventName: v.key,
                dict: v,
            });
        });
        // app.event.dispatchEvent({
        //     eventName: EVENT_ID.EVENT_PLAZA_ACTOR_VARIABLE,
        //     dict: dict.attriList,
        // });
    }
    OnRecv_UserDataChange(dict: proto.client_proto.IUserADataChangePush) {
        
    }
   /**
     * 请求背包数据返回
     * @param dict 
     */
    OnRecv_UserBagResp(dict: proto.client_proto.UserBagDataResp) {
        // this._actorProp[PROTO_ACTOR.UAT_SEX] = dict.sex;
        // this._actorProp[PROTO_ACTOR.UAT_NICKNAME] = dict.name;
        // app.event.dispatchEvent({
        //     eventName: EVENT_ID.EVENT_ACTOR_MODIFY_RETURN,
        // });
    }
   

    async popGift(bBackPlaza, bFromLogin, isAddCashClick) {
        //仅在大厅界面下弹出
        if (fw.scene.getSceneName() != fw.SceneConfigs.plaza.sceneName) {
            return;
        }
        let nBuffNum = this.getBuffNum();
        if (nBuffNum == 3) {
            if (center.luckdraw.isOpen() && center.luckdraw.isEnoughTimes() && (center.luckdraw.checkShowLimit() || center.luckdraw.isCanDraw())) {
                if (bFromLogin || isAddCashClick) {
                    app.popup.showDialog({
                        viewConfig: fw.BundleConfig.plaza.res[`wheel/wheelDlg`]
                    });
                } else {
                    if (this.mBackToPlazaHasShow < 6) {
                        this.mBackToPlazaHasShow = this.mBackToPlazaHasShow + 1
                        app.popup.showDialog({
                            viewConfig: fw.BundleConfig.plaza.res[`wheel/wheelDlg`]
                        });
                    }
                }
            }
        } else if (nBuffNum == 2) {
            if (center.task.isTaskCashBackOpen() && app.sdk.isSdkOpen("paytask")) {
                let taskPayCashBackInfo = center.task.getTaskPayCashBackInfo()
                if (isAddCashClick && taskPayCashBackInfo && taskPayCashBackInfo.pay_task_tag == 1) {
                    return
                }
                if (bFromLogin || isAddCashClick) {
                    app.popup.showDialog({
                        viewConfig: fw.BundleConfig.plaza.res[`superCashBack/superCashBack`]
                    })
                } else {
                    let myGold = center.user.getActorProp(PROTO_ACTOR.UAT_GOLD)
                    if (myGold / DF_RATE < 1000 && this.mBackToPlazaHasShow < 6) {
                        this.mBackToPlazaHasShow = this.mBackToPlazaHasShow + 1
                        app.popup.showDialog({
                            viewConfig: fw.BundleConfig.plaza.res[`superCashBack/superCashBack`]
                        })
                    }
                }
            }
        } else if (nBuffNum == 1) {
            let showMegaGift = () => {
                if (center.luckyCard.checkShowMegaGift() && app.sdk.isSdkOpen("firstpay") && center.jeckpotdraw.checkShowLimit()) {
                    if (bFromLogin || isAddCashClick) {
                        app.popup.showDialog({
                            viewConfig: fw.BundleConfig.plaza.res[`megaGift/MegaGift`]
                        });
                    } else {
                        if (this.mBackToPlazaHasShow < 6) {
                            this.mBackToPlazaHasShow = this.mBackToPlazaHasShow + 1
                            app.popup.showDialog({
                                viewConfig: fw.BundleConfig.plaza.res[`megaGift/MegaGift`]
                            });
                        }
                    }
                }
            }
            let showNewWheel = () => {
                if (center.jeckpotdraw.isOpen() && (center.jeckpotdraw.checkShowLimit() || center.jeckpotdraw.isCanDraw())) {
                    if (bFromLogin || isAddCashClick) {
                        app.popup.showDialog({
                            viewConfig: fw.BundleConfig.plaza.res[`newWheel/wheelDlg_new`]
                        });
                    } else {
                        if (this.mBackToPlazaHasShow < 6) {
                            this.mBackToPlazaHasShow = this.mBackToPlazaHasShow + 1
                            app.popup.showDialog({
                                viewConfig: fw.BundleConfig.plaza.res[`newWheel/wheelDlg_new`]
                            });
                        }
                    }
                }
            }
            if (isAddCashClick) {
                showMegaGift()
            } else if (center.jeckpotdraw.isOpen()) {
                if (center.jeckpotdraw.getBuyWheelState()) {
                    // --购买了转盘就直接弹转盘
                    showNewWheel()
                } else if (center.luckyCard.checkShowMegaGift() && app.sdk.isSdkOpen("firstpay")) {
                    // --有mega礼包 就2选1
                    let random = Math.floor(Math.random() * (2 - 1 + 1)) + 1; //含最大值，含最小值
                    if (random == 1) {
                        showMegaGift()
                    } else {
                        showNewWheel()
                    }
                } else {
                    // --没有就直接弹转盘
                    showNewWheel()
                }
            } else {
                showMegaGift()
            }
        }
    }

   
}

/**引导 */
enum BITSETFLAG {
    /**Rummy引导 */
    PreventBrushGold_Rummy_Flag = 69,

    /**水果机充值debuff标记 */
    SGJ_RechargeDebuffFlag = 77,

    /**引导最大索引 */
    MAX_INDEX = 64 * 3,
}

interface VipLvInfo {
    nLevel: number,
    nNeedExp: number,
    nDayBonusLimit: number,
    nWeekBonusLimit: number,
    nMonthBonusLimit: number,
}