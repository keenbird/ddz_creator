import { Node } from "cc";

import { ACTOR,PROTO_ACTOR } from "../config/cmd/ActorCMD";
import { EVENT_ID } from "../config/EventConfig";
import { httpConfig } from "../config/HttpConfig";
import { DF_RATE } from "../config/ConstantConfig";
import { GS_PLAZA_MSGID } from "../config/NetConfig";
import { EventHelp, addEvent } from "../framework/manager/FWEventManager";
import { PlazeMainInetMsg } from "../framework/network/awBuf/MainInetMsg";
import proto from "./common";

enum cmds {
    PLAZA_ACTOR_PRIVATE = 0,//	玩家私有数据										s->c
    PLAZA_ACTOR_VARIABLE = 1,//	玩家易变属性										s->c
    PLAZA_ACTOR_MODIFYDATA = 2,//	玩家修改资料										c->s
    PLAZA_ACTOR_MODIFYDATERET = 3,//	玩家修改资料返回									s->c
    PLAZA_ACTOR_TIPS = 4,//	提示客户端											s->c
    PLAZA_ACTOR_GETVERIFICATION = 5,//	获取验证码(无需等待返回,客户端直接倒计时1分钟)		c->s
    PLAZA_ACTOR_BINDPHONE = 6,//	绑定手机											c->s
    PLAZA_ACTOR_BINDPHONERET = 7,//	绑定手机返回										s->c
    PLAZA_ACTOR_FEEDBACK = 8,//	反馈信息											c->s
    PLAZA_ACTOR_FEEDBACKRET = 9,//	反馈信息返回										s->c
    PLAZA_ACTOR_FIRSTLOGIN = 10,//	首次登陆游戏										s->c
    PLAZA_ACTOR_MODIFYPWD = 11,//	用户修改密码										c->s
    PLAZA_ACTOR_MODIFYPWDRET = 12,//	用户修改密码返回									s->c
    PLAZA_ACTOR_RESETPWD = 13,//	用户重置密码										c->s
    PLAZA_ACTOR_RESETPWDRET = 14,//	用户重置密码返回									s->c
    PLAZA_ACTOR_GETRESETVERIFICATION = 15,//	获得绑定验证码(无需等待返回,客户端直接倒计时1分钟)	c->s
    PLAZA_ACTOR_VIPINFO = 16,//	VIP描述信息下发										s->c
    PLAZA_ACTOR_FACECHANGE = 17,//	玩家修改头像										s->c
    PLAZA_ACTOR_OTHERINFO = 18,//	用户的杂项数据配置									s->c
    PLAZA_ACTOR_GETSHARECONFIG = 19,//	获得分享配置										c->s
    PLAZA_ACTOR_SENDSHARECONFIG = 20,//	下发分享配置										s->c
    PLAZA_ACTOR_PAYCONFIGNEW = 21,//	新支付通路下发										s->c
    PLAZA_ACTOR_PAYKEYTORIDNEW = 22,//	新支付通路的商品ID序列对应匹配配置下发				s->c
    PLAZA_ACTOR_VIPDATA = 23,//	当前vip奖励数据										s->c
    PLAZA_ACTOR_CLIENTOPENFLAG = 24,//    客户端开启功能										c->s
    PLAZA_ACTOR_CLIENTOPENFLAGRET = 25,//	客户端开启功能反馈									s->c
    PLAZA_ACTOR_SET_BIT_FLAG = 26,//    设置新手引导标志位
    PLAZA_ACTOR_BIT_FLAG_UPDATE = 27,//    新手引导集合位
    PLAZA_ACTOR_PAY_NEW_CONTROL_INFO = 28,//    支付控制信息（红宝石，爱玩目前没使用）
    PLAZA_ACTOR_CUSTOM_CONTROL_CFG = 29,//    大厅功能管理配置
    PLAZA_ACTOR_GAMEWEAK_GUIDE_INFO = 30,//    游戏弱引导数据
    PLAZA_ACTOR_MODULESWITCH = 31,//    功能开关
    PLAZA_ACTOR_VIP_GETREWARD = 32,//    领取vip奖励
    PLAZA_ACTOR_VIP_GETREWARD_RES = 33,//    领取vip奖励返回
}
// enum 字符串的原因是为了方便遍历
export enum PLAZA_OPERATIONAL_MODULE {
    MAMMON_GOLD = "1",//财神送金
    LUCKY_DRAW = "2", //幸运大抽奖
    REDPACKET_PLAZA = "3", //红包广场
    DAILY_CHALLENGE = "4", //每日挑战
    EXCHANGE_AWARD = "5", //兑换领奖
    NEWCOMER_GIFTBAG = "6", //新手礼包
    INVATE_GIFT = "7", //邀请有礼
    REDPACKET_WIN_TASK = "8", //累胜红包任务
    GOLD_EXCHANGE_REDPACKET = "9", //金币兑换红包
    PLAZA_GOODS_REDPACKET = "10", //大厅红包券
    REDPACKET_YULE_TOTALWINGOLD = "11", //娱乐场累胜红包
    TIME_LIMIT_TOTAL_RECHARGE = "12", //限时累充活动
    TIME_LIMIT_TOTAL_GOLD = "13", //限时累金活动
    HUANSHOUQI_JUMP = "14", //换手气跳转
    RANDOM_DICE = "15", //黄金大筛盅
    PLAZA_SHARE = "16", //分享
    A_DOLLAR_GIFT_BAG = "17", //一元礼包
    BANKRUPTCY_PREFERENTIAL = "18", //破产特惠
    PREMIUM_REBATE = "19", //超值返利
    SAVING_POT = "20", //存钱罐
    MONTH_CARD = "21", //月卡
    MAKE_GREAT_PROFITS = "22", //一本万利
    MAKE_MONEY_RANKING = "23", //财富榜
    BANKRUPTCY_REVENGEGIFT = "24", //复仇礼包
    EXCHANGE_BAR = "25", //兑换码
    MOUTH_BAG = "26", //月度礼包
    FRIEND_PRIVATE_ROOM = "27", //好友私人房
    BAIREN_BET_GETRED = "28", //下注领红包
    SIGIN_CONRAOL = "29", //签到管理
    ENTER_SGJ_QUICK_MATCH = "30", //
    BOARDCAST_CTRL = "31", //喇叭控制
    FISH_TASK = "32", //捕鱼任务
    DAILY_TASK = "33", //每日任务
    COMPETITIOM_CHALLENGES = "34", //赛事挑战
    FINSH_GOLD_RANKING = "36", //捕鱼赢金榜
    MAKE_FISH_GREAT_PROFITS = "37", //捕鱼一本万利
    GUIDE_REDPACKET_FLAG = "39", //红包引导开关
    GUIDE_RESOURCE_FLAG = "40", //资源引导开关
    GUIDE_LEVEL_MODE_FLAG = "41", //关卡模式引导开关
    SGJ_GUANKA_FLAG = "42", //比基尼水果机关卡任务
}

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

class HALL_GUIDE_ID {
    /**
     * 强制引导用户进入新手房
     * @returns 
     */
    GUIDE_GOTO_ROOM() {
        let flags = center.user.getActorProp(ACTOR.ACTOR_PROP_NOVICE_GUIDE_FLAGS) ?? 0
        return (GUIDE.NOVICE_GUIDE_WIN_NEW_ROOM_TWO & flags) == 0
    }
    /**
     * 弱引导用户进入新手房
     * @returns 
     */
    GUIDE_GOTO_ROOM_2() {
        let flags = center.user.getActorProp(ACTOR.ACTOR_PROP_NOVICE_GUIDE_FLAGS) ?? 0
        return (GUIDE.NOVICE_GUIDE_WIN_NEW_ROOM_FIVE & flags) == 0
    }
    /**
     * 弱引导用户进入高级场新手房
     * @returns 
     */
    GUIDE_GOTO_HIGH_ROOM() {
        let flags = center.user.getActorProp(ACTOR.ACTOR_PROP_NOVICE_GUIDE_FLAGS) ?? 0
        return (GUIDE.NOVICE_GUIDE_WIN_NEW_HIGH_ROOM_ONE & flags) == 0
    }
    /**
     * 引导玩家进入兑换红包 且存在能购买的红包
     * @returns 
     */
    GUIDE_EXCHANGE_RED_PACKET() {
        let flags = center.user.getActorProp(ACTOR.ACTOR_PROP_GUIDE_ID_FLAGS) ?? 0
        let flags2 = center.user.getActorProp(ACTOR.ACTOR_PROP_NOVICE_GUIDE_FLAGS) ?? 0
        return (GUIDE.NOVICE_GUIDE_WIN_NEW_HIGH_ROOM_ONE & flags2) == 0 && (GUIDE.GUIDE_EXCHANGE_RED_PACKET_VALUE & flags) == 0
    }

    GUIDE_XXL_ENTER_ROOM(flags) {
        return (GUIDE.GUIDE_XXL_ENTER_ROOM & flags) == 0
    }

    GUIDE_XXL_JIASU(flags) {
        return (GUIDE.GUIDE_XXL_JIASU & flags) == 0
    }

    GUIDE_GUOSHANCHE_GAME() {
        let flags = center.user.getActorProp(ACTOR.ACTOR_PROP_GUIDE_ID_FLAGS) ?? 0
        return (GUIDE.GUIDE_GUOSHANCHE_GAME & flags) == 0
    }
}

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
        set(target: object, p: string, newValue: any, receiver: any): boolean {
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
    mBankruptGiftBagEndTime = 0 // 破产礼包结束时间
    mReconnectRoomServerId = 0 // 断线重连serverID
    mReconnectRoomServerGroupType = 0 // 断线重连groptype
    mReconnectRoomServerKindID = 0 // 断线重连kind id
    mReconnectRoomDDZMatchType = 0 // 假比赛断线重连标记
    mActorProrUseChannelid = 0 // 用户注册渠道
    mBackToPlazaHasShow = 0
    mTransfersFlag = false ////转账指定账号标记 1是 0不是
    mUserGroupInfo: [] = []
    mDelServerTime: number = 0//与服务器的时间差
    serviceEmergencyInfo: any;
    private _mVipLvInfoList: VipLvInfo[] = [];
    private _mVipLvInfo: any
    private _otherInfo: any = {};
    private _mVipRewardStatus: any;
    mUserInfoFromWebData: any = {};
    mUserInfoFromErrorTime = 0; //webUserData接口拉取数据失败次数
    private _mShareConfig: {};
    mCustomControlCfg: {};
    nPlazaServerID: any;
    mIsFirstCashAllComplete = false;//当前商城所有配置有返利的金额是否已经充过值

    HALL_GUIDE_ID = HALL_GUIDE_ID;
    m_PayItemMap: {};
    m_PayKeyMap: {};
    mGameWakGuideInfo: {};
    m_nSelColor: any;
    mWithdrawGuide: boolean = false;

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
    }
    initRegister() {
    //     //玩家私有数据
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.ator_private_info_s,
    //         cmd: this.cmd.PLAZA_ACTOR_PRIVATE,
    //         callback: this.OnRecv_ActorPrivateInfo.bind(this)
    //     });
        //玩家易变属性
        this.bindMessage({
            struct: proto.client_proto.UserAttriChangePush,
            cmd: this.cmd.UISMI_USER_ATTRI_CHANGE_PUSH,
            callback: this.OnRecv_ActorVariable.bind(this)
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
    //     //提示客户端
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.ator_tips_s,
    //         cmd: this.cmd.PLAZA_ACTOR_TIPS,
    //         callback: this.OnRecv_ActorTips.bind(this)
    //     });
    //     //获取验证码(无需等待返回,客户端直接倒计时1分钟)
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.actor_get_ver_c,
    //         cmd: this.cmd.PLAZA_ACTOR_GETVERIFICATION,
    //     });
    //     //绑定手机
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.bind_phone_c,
    //         cmd: this.cmd.PLAZA_ACTOR_BINDPHONE,
    //     });
    //     //绑定手机返回
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.bind_phone_ret_s,
    //         cmd: this.cmd.PLAZA_ACTOR_BINDPHONERET,
    //         callback: this.OnRecv_BindPhoneRet.bind(this)
    //     });
    //     //反馈信息
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.feed_back_c,
    //         cmd: this.cmd.PLAZA_ACTOR_FEEDBACK,
    //     });
    //     //反馈信息返回
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.feed_back_ret_s,
    //         cmd: this.cmd.PLAZA_ACTOR_FEEDBACKRET,
    //         callback: this.OnRecv_FeedbackRet.bind(this)
    //     });
    //     //首次登陆游戏
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.first_login_s,
    //         cmd: this.cmd.PLAZA_ACTOR_FIRSTLOGIN,
    //         callback: this.OnRecv_FirstLogin.bind(this)
    //     });
    //     //用户修改密码
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.modify_pwd_c,
    //         cmd: this.cmd.PLAZA_ACTOR_MODIFYPWD,
    //     });
    //     //用户修改密码返回
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.modify_pwd_ret_s,
    //         cmd: this.cmd.PLAZA_ACTOR_MODIFYPWDRET,
    //         callback: this.OnRecv_ModifyPwdRet.bind(this)
    //     });
    //     //用户重置密码
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.reset_pwd_c,
    //         cmd: this.cmd.PLAZA_ACTOR_RESETPWD,
    //     });
    //     //用户重置密码返回
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.reset_pwd_ret_s,
    //         cmd: this.cmd.PLAZA_ACTOR_RESETPWDRET,
    //         callback: this.OnRecv_ResetPwdRet.bind(this)
    //     });
    //     //获得绑定验证码(无需等待返回,客户端直接倒计时1分钟)
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.get_reset_verification_c,
    //         cmd: this.cmd.PLAZA_ACTOR_GETRESETVERIFICATION,
    //     });
    //     //VIP描述信息下发
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.vip_info_s,
    //         cmd: this.cmd.PLAZA_ACTOR_VIPINFO,
    //         callback: this.OnRecv_VipInfo.bind(this)
    //     });
    //     //玩家修改头像
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.face_change_s,
    //         cmd: this.cmd.PLAZA_ACTOR_FACECHANGE,
    //         callback: this.OnRecv_FaceChange.bind(this)
    //     });
    //     //用户的杂项数据配置
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.actor_other_info_s,
    //         cmd: this.cmd.PLAZA_ACTOR_OTHERINFO,
    //         callback: this.OnRecv_OtherInfo.bind(this)
    //     });
    //     //获得分享配置
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.actor_get_share_cfg_c,
    //         cmd: this.cmd.PLAZA_ACTOR_GETSHARECONFIG,
    //     });
    //     //下发分享配置
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.actor_send_share_cfg_s,
    //         cmd: this.cmd.PLAZA_ACTOR_SENDSHARECONFIG,
    //         callback: this.OnRecv_ActorSendShareConfig.bind(this)
    //     });
    //     //新支付通路下发
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.pay_config_new_s,
    //         cmd: this.cmd.PLAZA_ACTOR_PAYCONFIGNEW,
    //         callback: this.OnRecv_PayConfigNew.bind(this)
    //     });
    //     //新支付通路的商品ID序列对应匹配配置下发
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.pay_key_torid_new_c,
    //         cmd: this.cmd.PLAZA_ACTOR_PAYKEYTORIDNEW,
    //         callback: this.OnRecv_PayKeyToRIDNew.bind(this)
    //     });
    //     //新VIP描述信息下发
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.vip_data_s,
    //         cmd: this.cmd.PLAZA_ACTOR_VIPDATA,
    //         callback: this.OnRecv_VipBonus.bind(this)
    //     });
    //     //客户端开启功能
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.actor_client_open_flag_c,
    //         cmd: this.cmd.PLAZA_ACTOR_CLIENTOPENFLAG,
    //     });
    //     //客户端开启功能反馈
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.actor_client_open_flag_ret_s,
    //         cmd: this.cmd.PLAZA_ACTOR_CLIENTOPENFLAGRET,
    //         callback: this.OnRecv_GuideRewardInfo.bind(this)
    //     });
    //     //设置新手引导标志位
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.actor_plaza_set_bit_flag_c,
    //         cmd: this.cmd.PLAZA_ACTOR_SET_BIT_FLAG
    //     });
    //     //新手引导集合位
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.actor_plaza_bit_set_update_s,
    //         cmd: this.cmd.PLAZA_ACTOR_BIT_FLAG_UPDATE,
    //         callback: this.onRecv_ActorBitFlg.bind(this)
    //     });
    //     //支付控制信息（红宝石，爱玩目前没使用）
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.actor_pay_new_control_info_s,
    //         cmd: this.cmd.PLAZA_ACTOR_PAY_NEW_CONTROL_INFO,
    //         callback: this.OnRecv_PayWay.bind(this)
    //     });
    //     //大厅功能管理配置
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.actor_plaza_custom_control_cfg_s,
    //         cmd: this.cmd.PLAZA_ACTOR_CUSTOM_CONTROL_CFG,
    //         callback: this.OnRecv_CustomControlCfg.bind(this)
    //     });
    //     //游戏弱引导数据
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.actor_game_weak_guide_info_s,
    //         cmd: this.cmd.PLAZA_ACTOR_GAMEWEAK_GUIDE_INFO,
    //         callback: this.OnRecv_GameWeakGuideInfo.bind(this)
    //     });
    //     //功能开关
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.system_module_switch_s,
    //         cmd: this.cmd.PLAZA_ACTOR_MODULESWITCH,
    //         callback: this.OnRecv_PLAZA_ACTOR_MODULESWITCH.bind(this)
    //     });
    //     //领取vip奖励
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.vip_get_reward_c,
    //         cmd: this.cmd.PLAZA_ACTOR_VIP_GETREWARD
    //     });
    //     //领取vip奖励返回
    //     this.bindMessage({
    //         struct: proto.plaza_actorprop.vip_get_reward_res_s,
    //         cmd: this.cmd.PLAZA_ACTOR_VIP_GETREWARD_RES,
    //         callback: this.OnRecv_VipRewardInfo.bind(this)
    //     });
    }
    /**获取属性事件名 =>（ACTOR[PROTO_ACTOR.UAT_GOLD] 或者 `ACTOR_EVENT_${`szMD5FaceFile`}`） */
    getActorEventName(actorName: string) {
        return ACTOR[actorName] ?? `ACTOR_EVENT_${actorName}`;
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
    getActorProp(actor: ACTOR | string): any {
        return this._actorProp[actor];
    }
    /**获取玩家vip等级 */
    getActorVipLevel() {
        return this._actorProp[ACTOR.ACTOR_PROP_VIPLEVEL];
    }
    /**获取玩家姓名 */
    getActorName(): string {
        return this._actorProp[`szName`] ?? ``;
    }
    /**得到玩家手机号 */
    getActorPhone() {
        return this._actorProp[`szPhone`] ?? ``;
    }
    /**获取玩家头像 */
    getActorMD5Face(): string {

        return this._actorProp[PROTO_ACTOR.UAT_FACE_TYPE] == 0 ? this._actorProp[`szMD5FaceFile`] : this._actorProp[`szFaceSysId`]
    }
    /**设置玩家头像 */
    setActorMD5Face(md5Face: string): void {
        this._actorProp[`szMD5FaceFile`] = md5Face;
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
    /**发送请求获取分享的配置数据 */
    sendApplyShareGameConfig() {
        let data = proto.plaza_actorprop.actor_get_share_cfg_c.create()
        this.sendMessage({
            cmd: this.cmd.PLAZA_ACTOR_GETSHARECONFIG,
            data: data
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
     * 绑定邮箱 姓名
     * @param name 
     * @param email 
     */
    FuncClick_userInfoBind(name: string, email: string) {
        app.http.post({
            url: httpConfig.path_pay + "hall/bindParam",
            params: {
                user_id: this.getActorProp(PROTO_ACTOR.UAT_UID),
                email: email,
                realname: name,
                timestamp: app.func.time()
            },
            callback: (bSuccess, response) => {
                if (bSuccess) {
                    if (1 == response.status) {
                        this.updateUserInfoBind(response.data?.email, response.data?.realname)
                        this.updateUserPhoneBind(center.user.getActorProp("szPhone"))
                        app.popup.showToast("Perfect information success")
                        app.event.dispatchEvent({ eventName: EVENT_ID.EVENT_ACTOR_PERFECT_INFORMATION })
                    } else {
                        app.popup.showToast(response.info ?? "Perfect information failed")
                    }
                } else {
                    app.popup.showToast("Perfect information failed")
                }
            }
        });
    }
    /**
     * 更新用户支付信息
     * @param phone 
     * @param name 
     * @param email 
     */
    setPayInfo(phone: string, name: string, email: string) {
        app.http.post({
            url: httpConfig.path_pay + "Hall/setPaymentInfo",
            params: {
                uid: this.getActorProp(PROTO_ACTOR.UAT_UID),
                phone: phone,
                email: email,
                name: name,
                timestamp: app.func.time()
            },
            callback: (bSuccess, response) => {
                if (bSuccess) {
                    if (1 == response.status) {
                        //刷新web数据
                        if (this.mUserInfoFromWebData) {
                            this.mUserInfoFromWebData.email = email;
                            this.mUserInfoFromWebData.realname = name;
                            this.mUserInfoFromWebData.withdrawphone = phone;
                        }
                        this.updateUserInfoBind(email, name);
                        app.popup.showToast("Perfect information success");
                        app.event.dispatchEvent({ eventName: EVENT_ID.EVENT_ACTOR_PERFECT_PAYINFORMATION });
                    } else {
                        app.popup.showToast(response.info ?? "Perfect information failed");
                    }
                } else {
                    app.popup.showToast("Perfect information failed");
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
    setLoginActor(dict: proto.client_proto.LoginAttrNtf){
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

    /**
     * 玩家私有属性消息
     * @param dict 
     */
    OnRecv_ActorPrivateInfo(dict: proto.plaza_actorprop.ator_private_info_s) {
        this._actorProp[PROTO_ACTOR.UAT_NICKNAME] = dict.name;
        this._actorProp["szPhone"] = dict.phone;
        this._actorProp[PROTO_ACTOR.UAT_FACE_URL] = dict.md5_face_file;


        this._actorProp[PROTO_ACTOR.UAT_UID] = dict.actor_dbid;
        this._actorProp[PROTO_ACTOR.UAT_UID] = dict.uid;
        this._actorProp[PROTO_ACTOR.UAT_GOLD] = dict.gold;
        this._actorProp[PROTO_ACTOR.UAT_DIAMOND] = dict.diamonds;
        this._actorProp[ACTOR.ACTOR_PROP_LOSTCOUNT] = dict.lost_count;
        this._actorProp[ACTOR.ACTOR_PROP_WINCOUNT] = dict.win_count;
        this._actorProp[ACTOR.ACTOR_PROP_DRAWCOUNT] = dict.draw_count;
        this._actorProp[ACTOR.ACTOR_PROP_DROPCOUNT] = dict.drop_count;
        this._actorProp[ACTOR.ACTOR_PROP_SCORE] = dict.score;
        this._actorProp[ACTOR.ACTOR_PROP_VIPEXP] = dict.vip_exp;
        this._actorProp[ACTOR.ACTOR_PROP_VIPLEVEL] = dict.vip_level;
        this._actorProp[ACTOR.ACTOR_PROP_NEXTVIPLEVELEXP] = dict.next_vip_Exp;
        this._actorProp[PROTO_ACTOR.UAT_SEX] = dict.sex;
        this._actorProp[ACTOR.ACTOR_PROP_GM] = dict.gm_flag;
        this._actorProp[ACTOR.ACTOR_PROP_OPENFLAG] = dict.open_flag;
        this._actorProp[ACTOR.ACTOR_PROP_BEHAVIORCTRL] = dict.behavior_ctrl_flag;
        this._actorProp[ACTOR.ACTOR_PROP_PROMOTERDBID] = dict.promoter_dbid;
        this._actorProp[ACTOR.ACTOR_PROP_RECHARGE_AMOUNT] = dict.recharge_amount;//玩家累计充值
        // 弃用
        this._actorProp[ACTOR.ACTOR_PROP_CLIENTOPENFLAG] = dict.client_open_flag;
        this._actorProp[ACTOR.ACTOR_PROP_ISGUEST] = dict.guest; //是否游客登录
        this._actorProp[ACTOR.ACTOR_PROP_BUY_LIMIT] = dict.limit_buy_time;//限时抢购
        this._actorProp[ACTOR.ACTOR_PROP_GUIDE_ID_FLAGS] = dict.guide_right;//玩家新手引导的完成标志 权位表示
        this._actorProp[ACTOR.ACTOR_PROP_NOVICE_GUIDE_FLAGS] = dict.novice_guide;//玩家新手引导的完成标志2 权位表示

        this._actorProp[ACTOR.ACTOR_PROP_RIGHT] = dict.user_right;//用户权限
        this._actorProp[ACTOR.ACTOR_PROP_OTHER_PLATFORM_FLAG] = dict.other_platform_flag;
        this._actorProp[ACTOR.ACTOR_PROP_DAY_LUCKYDRAM_COUNT] = dict.lucky_draw_count;
        this._actorProp[ACTOR.ACTOR_PROP_LEVEL] = dict.user_lvl;
        this._actorProp[ACTOR.ACTOR_PROP_NEW_FIRST_RECHARGE_FLAG] = dict.new_first_recharge_flag;//商城每个金额对应一个标记位
        this._actorProp[ACTOR.ACTOR_PROP_DAY_OVERFLOWBAG_FLAG] = dict.day_over_flow_flag;

        this.nNewSevenTimes = dict.new_seven_times;
        this.nPlazaServerID = dict.plaza_server_id;

        //练习场积分
        this._actorProp[ACTOR.ACTOR_PROP_PRACTISE_SCORE] = dict.practise_score;

        this.mBankruptGiftBagEndTime = dict.bankrupt_end_time;
        //注册时间
        this.nRegisterTime = dict.register_time;


        this.mReconnectRoomServerId = dict.game_server_id;
        this.mReconnectRoomServerGroupType = dict.group_type;
        this.mReconnectRoomServerKindID = dict.kind_id;
        this.mReconnectRoomDDZMatchType = dict.ddz_match_type;

        //充值返利
        this._actorProp[ACTOR.ACTOR_PROP_BONUS_EXPIRE_TIME] = dict.bonus_expire_time;//玩家返利到期时间
        this._actorProp[ACTOR.ACTOR_PROP_WITHDRAW_GOLD] = dict.with_draw_gold;//可提现金币
        this._actorProp[ACTOR.ACTOR_PROP_USE_WITHDRAW_COUNT] = dict.with_draw_count//当月提现次数
        this._actorProp[ACTOR.ACTOR_PROP_RECHARGE_CASHBACK] = dict.recharge_cash_back;//当前返利
        this._actorProp[ACTOR.ACTOR_PROP_TRANSFERACCOUNTS_COUNT] = dict.transfer_account_count;//当月转账次数
        this._actorProp[ACTOR.ACTOR_PROP_RECHARGE_SAVED_BONUS] = dict.recharge_saved_bonus;//剩余返利
        this._actorProp[ACTOR.ACTOR_PROP_OUT_WITHDRAW_NUM_BYDAY] = dict.out_withdraw_gold_day;//当日已经提现金额
        this._actorProp[ACTOR.ACTOR_PROP_BUSET_BUY_COUNT] = dict.bust_count;//破产礼包购买次数
        this._actorProp[ACTOR.ACTOR_PROP_OUT_WITHDRAW_COUNT_BYDAY] = dict.out_withdraw_count_day;//当日已经提现次数

        // this._actorProp[ACTOR.ACTOR_PROP_BUFF_HD_NUM] = dict.nBuffHDNum;
        // this._actorProp[ACTOR.ACTOR_PROP_RUMMY_PLAY_COUNT] = dict.nRummyPlayCount;
        // this._actorProp[ACTOR.ACTOR_PROP_LOTTERY_MONTH_PRICENUM] = dict.uMonthPriceNum;
        // this._actorProp[ACTOR.ACTOR_PROP_LOTTERY_WEEK_PRICENUM] = dict.uWeekPriceNum;

        this.mActorProrUseChannelid = dict.channel_id;//玩家渠道ID

        this.mTransfersFlag = dict.transfer_account_flag == 1;

        if (app.func.time() - this.nRegisterTime <= 24 * 60 * 60) {
            app.event.reportEvent("register_login", { uid: dict.uid })
        }

        gameCenter.room.setRoomOnline(false);

        // 当前是登录界面拉取活动 游戏界面检测断线重连
        if (fw.scene.sceneConfig == fw.SceneConfigs.login) {
            center.activity.initNoticeMessagePopNum();
        } else if (fw.scene.sceneConfig.bGame) {
            // if (!this.checkReconnectRoom() && !this.checkReconnectRoomLogout()) {
            //     app.popup.showTip({ text: "The Internet link is successful and has returned to the lobby" })
            //     fw.scene.changeScene(fw.SceneConfigs.plaza);
            // }
        }
        //通知玩家属性变更
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAZA_ACTOR_PRIVATE,
        });
        //请求邮件信息
        center.email.send_PLAZA_EMAIL_VIEW();
        //获取web玩家信息
        this.initUserInfoFromWeb();
        //上报地理位置
        app.sdk.uploadLngAndLat();
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
    //得到拉米游戏游玩局数
    getRummyPlayCount() {
        return this._actorProp[ACTOR.ACTOR_PROP_RUMMY_PLAY_COUNT] ?? 0
    }
    /**
     * 检测是否存在当前游戏房间配置 如果满足就进入该房间
     * @returns 
     */
    checkReconnectRoom() {
        let roomInfo = gameCenter.room.getRoomInfo();
        let roomInfoLen = fw.isNull(roomInfo) ? 0 : Object.keys(roomInfo).length;
        if (roomInfoLen > 0) {
            let actor = center.user.getActor();
            let nthisMoney = actor[PROTO_ACTOR.UAT_GOLD];
            let room = center.roomList.getRoomInfo(roomInfo.kindId);
            if (room) {
                let nMinGold = room.LimitRule[0].nMinValue;
                if (nthisMoney >= nMinGold) {
                    // center.roomList.sendGetRoomServerId(roomInfo.kindId);
                    return true;
                }
            }
        }
        return false;
    }
    /**检测是服务器否存在用户未结束的游戏 如果有就进入这个房间 */
    checkReconnectRoomLogout() {
        if (this.mReconnectRoomServerId != 0) {
            center.roomList.sendGetRoomServerId(this.mReconnectRoomServerKindID);
            return true;
        }
        return false;
    }
    //转账指定账号标记
    getTransfersFlag() {
        return this.mTransfersFlag
    }

    //server下发的玩家渠道号，目前只有wingo在用
    getServerUseChannelid() {
        return this.mActorProrUseChannelid
    }
    // 重连比赛标记
    getReconnectRoomDDZMatchType() {
        return this.mReconnectRoomDDZMatchType
    }
    /**
     * 破产礼包结束时间
     * @returns 
     */
    getBankruptGiftBagEndTime() {
        return this.mBankruptGiftBagEndTime
    }

    /**
     * 玩家易变属性
     * @param dict 
     */
    OnRecv_ActorVariable(dict: proto.client_proto.IUserAttriChangePush) {
        dict.attriList.forEach(v => {
            // if (v.prop_id == ACTOR.ACTOR_PROP_SERVER_TIME) {
            //     let nCurTime = app.func.time()
            //     this.mDelServerTime = v.new_value - nCurTime;
            // }
            this._actorProp[v.key] = v.valueType == 1 ?  app.func.toNumber(v.value) : v.value
            this.event.dispatchEvent({
                eventName: v.key,
                dict: v,
            });
        });
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAZA_ACTOR_VARIABLE,
            dict: dict.attriList,
        });
    }
    /**
     * 玩家修改资料返回
     * @param dict 
     */
    OnRecv_UserBagResp(dict: proto.plaza_actorprop.actor_modify_data_ret_s) {
        // this._actorProp[PROTO_ACTOR.UAT_SEX] = dict.sex;
        // this._actorProp[PROTO_ACTOR.UAT_NICKNAME] = dict.name;
        // app.event.dispatchEvent({
        //     eventName: EVENT_ID.EVENT_ACTOR_MODIFY_RETURN,
        // });
    }

    //提示客户端
    OnRecv_ActorTips(dict: proto.plaza_actorprop.ator_tips_s) {
        // fw.print("userCenter:OnRecv_ActorTips//////////////////-")
        // fw.print("userCenter:提示客户端//////////////")
        // fw.print(dict, "OnRecv_ActorTips")

        // fw.print("(待处理)此处要弹出提示内容//////////////"..dict.szMsg)
        let tips = dict.msg
        let msg = tips == "" ? ERRID_MSG.get(dict.tips_id) : tips;
        if (msg) {
            app.popup.showToast(msg);
        } else {
            app.popup.showToast("UNKOWN ERROR");
        }
    }

    //绑定手机号返回
    OnRecv_BindPhoneRet(dict: proto.plaza_actorprop.bind_phone_ret_s) {
        fw.print("userCenter:OnRecv_BindPhoneRet//////////////////-")
        fw.print("userCenter:绑定手机号返回//////////////")
        fw.print(dict, "OnRecv_BindPhoneRet")
        this._actorProp["szPhone"] = dict.phone

        fw.print(dict, "Goodsdict = sGoodsID_X,sGoodsNum_X")

        let nGold = dict.gold
        let goodItem = dict.good_item
        let goodsTab = []

        if (nGold > 0) {
            goodsTab.push({
                nGoodsID: center.goods.gold_id.cash,
                nGoodsNum: nGold,
            })
        }

        if (goodItem.length > 0) {
            goodItem.forEach((goods, i: number) => {
                goodsTab.push({
                    nGoodsID: goods.goods_id,
                    nGoodsNum: goods.goods_num,
                })
            });
        }

        if (goodsTab.length > 0) {
            center.mall.payReward(goodsTab, true)
        }

        // 推送绑定手机获得的金币
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_ACTOR_BINDING_PHONE,
            dict: dict.gold
        });
    }
    /**
     * 反馈返回
     * @param dict 
     */
    OnRecv_FeedbackRet(dict: proto.plaza_actorprop.feed_back_ret_s) {
        fw.print("userCenter:OnRecv_FeedbackRet-------------------")
        fw.print("userCenter:反馈返回--------------")
        fw.print("反馈消息只是通知")
        fw.print(dict, "OnRecv_FeedbackRet")

        app.popup.showToast("We have received your feedback, thank you for your valuable comments, we will deal with it as soon as possible, and I wish you a happy game.")

        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAZA_ACTOR_FEEDBACK,
        });
    }
    /**
     * 首次登陆游戏奖励
     * @param dict 
     */
    OnRecv_FirstLogin(dict: proto.plaza_actorprop.first_login_s) {
        this._otherInfo["IsFirstLogin"] = true
        let goodsTab = []

        dict.good_item.forEach((goods) => {
            goodsTab.push({
                sGoodsID: goods.goods_id,
                sGoodsNum: goods.goods_num,
            })
        })

        this._otherInfo["FirstLoginReward"] = { GiveGoodsItem: goodsTab, nGold: dict.gold }
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAZA_ACTOR_FIRST_LOGIN_REWARD
        });
    }
    /**
     * 用户修改密码返回
     * @param dict 
     */
    OnRecv_ModifyPwdRet(dict: proto.plaza_actorprop.modify_pwd_ret_s) {
        fw.print("userCenter:OnRecv_ModifyPwdRet-------------------")
        fw.print("userCenter:用户修改密码返回--------------返回值>0为成功")
        fw.print(dict, "OnRecv_ModifyPwdRet")
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAZA_ACTOR_MODIFYPWDRET,
            dict: dict
        });
    }

    /**
     * 用户重置密码返回
     * @param dict 
     */
    OnRecv_ResetPwdRet(dict: proto.plaza_actorprop.reset_pwd_ret_s) {
        fw.print("userCenter:OnRecv_ResetPwdRet-------------------")
        fw.print("userCenter:用户重置密码返回--------------EventID监听事件要做登录操作")
        fw.print(dict, "OnRecv_ResetPwdRet")
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAZA_ACTOR_RESETPWD,
            dict: dict
        });
    }
    /**
     * 新的VIP描述信息下发
     * @param dict 
     */
    OnRecv_VipInfo(dict: proto.plaza_actorprop.vip_info_s) {
        fw.print("userCenter:OnRecv_VipInfo-------------------")
        this._mVipLvInfoList = []
        dict.Item.forEach((v) => {
            if (v && v.day_bonus_limit) {
                let levelInfo = {
                    nLevel: v.level,
                    nNeedExp: v.need_exp,
                    nDayBonusLimit: v.day_bonus_limit,
                    nWeekBonusLimit: v.week_bonus_limit,
                    nMonthBonusLimit: v.month_bonus_limit,
                }
                this._mVipLvInfoList.push(levelInfo)
            }
        })
        fw.print(this._mVipLvInfoList, "OnRecv_VipInfo")
    }
    /**
     * 新VIP描述信息下发
     * @param dict 
     */
    OnRecv_VipBonus(dict: proto.plaza_actorprop.vip_data_s) {
        fw.print("userCenter:OnRecv_VipBonus-------------------")
        fw.print(dict, "OnRecv_VipBonus", 10)
        this._mVipLvInfo.nDayCurBonus = parseInt(dict.day_cur_bonus)
        this._mVipLvInfo.nDayValidBonus = parseInt(dict.day_valid_bonus)
        this._mVipLvInfo.nWeekCurBonus = parseInt(dict.week_cur_bonus)
        this._mVipLvInfo.nWeekValidBonus = parseInt(dict.week_valid_bonus)
        this._mVipLvInfo.nMonthCurBonus = parseInt(dict.month_cur_bonus)
        this._mVipLvInfo.nMonthValidBonus = parseInt(dict.month_valid_bonus)
        this._mVipRewardStatus = false
        if (this._mVipLvInfo.nDayValidBonus > 0 || this._mVipLvInfo.nWeekValidBonus > 0 || this._mVipLvInfo.nMonthValidBonus > 0) {
            this._mVipRewardStatus = true
        }
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAZA_VIPGIFT_INFO,
        });
    }
    /**
     * 领取vip奖励
     * @param index 
     */
    sendGetVipReward(index) {
        let data = proto.plaza_actorprop.vip_get_reward_c.create();
        data.index = index
        this.sendMessage({
            cmd: this.cmd.PLAZA_ACTOR_VIP_GETREWARD,
            data: data
        });
    }
    /**
     * 领取vip奖励返回
     * @param dict 
     */
    OnRecv_VipRewardInfo(dict) {
        fw.print(dict, "OnRecv_VipRewardInfo")
        let goodsTab = []
        goodsTab.push({
            nGoodsID: center.goods.gold_id.bonus,
            nGoodsNum: dict.bonus,
        })
        center.mall.payReward(goodsTab, true)
    }
    /**
     * 新手引导奖励
     * @param dict 
     */
    OnRecv_GuideRewardInfo(dict: proto.plaza_actorprop.actor_client_open_flag_ret_s) {
        fw.print("userCenter:OnRecv_GuideRewardInfo-------------------")
        fw.print("userCenter:新手引导奖励--------------")
        fw.print(dict, "OnRecv_GuideRewardInfo")
        let data = {} as any
        data.btIndex = dict.index
        data.nGold = dict.gold
        data.goods_id = dict.goods_id
        data.uGoodsNums = dict.goods_nums
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_GUIDE_AWARD,
            dict: dict
        });
    }
    /**
     * 新手引导步骤开关
     * @param func 
     * @param flag 
     */
    checkGuideIsOpen(func: Function, flag): boolean {
        if (typeof func == "function") {
            return func(flag);
        } else {
            return false;
        }
    }
    /**
     * 修改头像
     * @param dict 
     */
    OnRecv_FaceChange(dict: proto.plaza_actorprop.face_change_s) {
        this._actorProp[PROTO_ACTOR.UAT_FACE_URL] = dict.md5_face_file
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_ICON_UPLOAD_SUCCEED,
            dict: dict
        });
    }

    /**
     * 支付通路下发
     * @param dict 
     */
    OnRecv_PayConfigNew(dict: proto.plaza_actorprop.pay_config_new_s) {
        fw.print("userCenter:OnRecv_PayConfigNew-------------------")
        fw.print("userCenter:支付通路下发--------------")
        fw.print(dict, "OnRecv_PayConfigNew")
        this.m_PayItemMap = {}
        dict.data.forEach(v => {
            if (v.statue == 1) {
                let item = {} as any
                item.uSortID = v.sort_id
                item.szPayKey = v.pay_key
                item.uPlatformFlag = v.platform_flag
                item.szPayName = v.pay_name
                item.uDiscount = v.dis_count
                item.uPayFlag = v.pay_flag
                item.btState = v.statue
                this.m_PayItemMap[v.pay_key] = item;
            }
        })
    }
    /**
     * 新支付通路的商品ID序列对应匹配配置下发
     * @param dict 
     */
    OnRecv_PayKeyToRIDNew(dict: proto.plaza_actorprop.pay_key_torid_new_c) {
        fw.print("userCenter:OnRecv_PayKeyToRIDNew-------------------")
        fw.print("userCenter:支付通路对应序列ID下发--------------")
        fw.print(dict, "OnRecv_PayKeyToRIDNew")
        let KeyToRID_ = []
        let KeyToRID = dict.pay_key_data
        let szPayKey = dict.pay_key
        KeyToRID.forEach(v => {
            let KeyItem = {} as any
            KeyItem.nCustomID = v.custom_id
            KeyItem.nRID = v.rid
            KeyItem.szCustomID = v.custom_id_str
            KeyToRID_.push(KeyItem)
        })
        this.m_PayKeyMap[szPayKey] = KeyToRID_
    }
    /**
     * 用户的杂项数据配置
     * @param dict 
     */
    OnRecv_OtherInfo(dict: proto.plaza_actorprop.actor_other_info_s) {
        this._otherInfo["bind_awake_gold"] = dict.bind_awake_gold;
    }
    /**
     * 支付方式
     * @param dict 
     */
    OnRecv_PayWay(dict: proto.plaza_actorprop.actor_pay_new_control_info_s) {

    }
    /**
     * 下发分享配置
     * @param dict 
     */
    OnRecv_ActorSendShareConfig(dict: proto.plaza_actorprop.actor_send_share_cfg_s) {
        let config = {} as any
        config.szTitle = dict.title
        config.szDes = dict.des
        config.szURL = dict.url
        this._mShareConfig = config
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_ACTOR_SHAREGAMECONFIG_INFO,
        });
    }
    /**
     * 大厅功能管理配置
     * @param dict 
     */
    OnRecv_CustomControlCfg(dict: proto.plaza_actorprop.actor_plaza_custom_control_cfg_s) {
        this.mCustomControlCfg = {}
        let datas = dict.data
        datas.forEach(v => {
            let item = {} as any
            item.nType = v.type
            item.nExperience = v.experience
            item.nRechargeAmount = v.recharge_amount
            this.mCustomControlCfg[v.type] = item;
        })
        //默认配置 数据打开
        let data
        Object.keys(PLAZA_OPERATIONAL_MODULE).forEach(key => {
            let nType = PLAZA_OPERATIONAL_MODULE[key];
            if (this.mCustomControlCfg[nType]) {
                data = {
                    nType: nType,
                    nExperience: -1,
                    nRechargeAmount: 0,
                }
                this.mCustomControlCfg[nType] = data
            }
        })

        // EventHelp.FrieEventID(EVENT_ID.EVENT_PLAZA_CUSTOM_CONTROL_CFG)
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAZA_CUSTOM_CONTROL_CFG,
        });
    }

    OnRecv_GameWeakGuideInfo(dict: proto.plaza_actorprop.actor_game_weak_guide_info_s) {
        // this.mGameWakGuideInfo = dict
        let data = {} as any
        data.nRedBlackGameGoldLimit = dict.red_black_game_gold_limit
        data.nSGJGameGoldLimit = dict.sgj_game_gold_limit
        data.nWingoGameGoldLimit = dict.wingo_game_gold_limit
        data.nRedBlackGameCount = dict.red_black_game_count
        data.nSGJGameCount = dict.sgj_game_count
        data.nWingoGameCount = dict.wingo_game_count
        this.mGameWakGuideInfo = data
    }
    /**
     * 反馈客服链接
     * @returns 
     */
    getCustomURL() {
        return this.switchInfo.szCustomURL
    }
    /**获取功能开关配置 */
    getSwitchInfo() {
        return this.switchInfo;
    }
    /**功能开关 */
    isSwitchOpen(lock_id: string) {
        if (!lock_id || !this.switchInfo[lock_id]) {
            return false;
        }
        //是否直接跳转商城开关，server默认是1，打开的时候发0
        if (`btDirectToPayChannelSwitch` == lock_id) {
            return this.switchInfo[lock_id] == 0;
        } else {
            return this.switchInfo[lock_id] == 1;
        }
    }
    /**接收功能开关配置 */
    OnRecv_PLAZA_ACTOR_MODULESWITCH(dict: proto.plaza_actorprop.system_module_switch_s) {
        let data = {} as any
        data.btCanUseExtensionSystem = dict.can_use_extension_system
        data.btTreasureSwitch = dict.treasure_switch
        data.btRedPacketSwitch = dict.red_packet_switch
        data.btSignSwitch = dict.sign_switch
        data.btTaskSwitch = dict.task_switch
        data.btMallSwitch = dict.mall_switch
        data.btExchangeSwitch = dict.exchange_switch
        data.btPlazaLuckyDrawSwicth = dict.plaza_lucky_draw_swicth
        data.btPlazaRedPacketSwitch = dict.plaza_red_packet_switch
        data.btPlazaLuckyGoldSwitch = dict.plaza_lucky_gold_switch
        data.btVipPerSwitch = dict.vip_per_switch
        data.btHappySevenSwitch = dict.happy_seven_switch
        data.btSuperVipsSwicth = dict.super_vips_swicth
        data.btFirstRechargeSwitch = dict.first_recharge_switch
        data.btLimitBuySwitch = dict.limit_buy_switch
        data.btPrivateRoomSwitch = dict.private_room_switch
        data.btSpecialSwitch = dict.special_switch
        data.btIosDefPay = dict.ios_def_pay
        data.btInvateGiftSwitch = dict.invate_gift_switch
        data.btBrokenHelpSwitch = dict.broken_help_switch
        data.btLucyDrawSwitch = dict.lucy_draw_switch
        data.btMonthCardSwitch = dict.month_card_switch
        data.btTreasureGuideSwitch = dict.treasure_guide_switch
        data.btBindPhoneSwitch = dict.bind_phone_switch
        data.btTreasureBroadSwitch = dict.treasure_broad_switch
        data.btDirectToPayChannelSwitch = dict.game_box_switch//是否直接跳转支付方式选择弹框开关，server默认是1，打开的时候发0
        data.btRedpacketWinTaskSwitch = dict.redpacket_win_task_switch
        data.szWebURL = dict.web_url
        data.btDailyChallengeSwitch = dict.daily_challenge_switch
        data.btCasinoSwitch = dict.casino_switch
        data.btRankingListSwitch = dict.ranking_list_switch
        data.btNoviceGuidance = dict.novice_guidance
        data.btBroadSwitch = dict.broad_switch
        data.btShareSwitch = dict.share_switch
        data.btSmashGoldEggsSwitch = dict.smash_gold_eggs_switch
        data.btFruitTaskSwitch = dict.fruit_task_switch
        data.btSavingPotSwitch = dict.saving_pot_switch
        data.btOneBringSwitch = dict.one_bring_switch
        data.btXxlPassSwitch = dict.xxl_pass_switch
        data.btYuleTreasureSwitch = dict.yule_treasure_switch
        data.btLoadShowCharSwitch = dict.load_show_char_switch
        data.btActorLevelSwitch = dict.actor_level_switch
        data.btBuyuSwitch = dict.buyu_switch
        data.btCanJuSwitch = dict.canju_switch
        data.btGuoshancheTaskSwitch = dict.guoshanche_task_switch
        data.btWithdrawSwitch = dict.witch_draw_switch
        data.btWithdrawCharge = dict.witch_draw_charge//提现是否要充值
        data.szCustomURL = dict.custom_url//反馈客服链接
        data.btLEOShare = dict.leo_share//Leo分享开关
        data.btWithdrawType = dict.withdraw_type
        data.teenpatti_switch = dict.teenpatti_switch

        this.switchInfo = data;
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_YAO_QING_ModuleSwitch,
            data: this.switchInfo
        });
    }
    /**
     * 大厅功能开关
     * @param nType 
     */
    checkCustomControlOpen(nType) {
        if (this.mCustomControlCfg[nType]) {
            let data = this.mCustomControlCfg[nType]
            let nExperience = data.nExperience
            let nRechargeAmount = data.nRechargeAmount
            let score = this.getActorProp(ACTOR.ACTOR_PROP_SCORE)
            let vipexp = this.getActorProp(ACTOR.ACTOR_PROP_VIPEXP)
            return (nExperience != -1 && score >= nExperience) || (nRechargeAmount != -1 && vipexp >= nRechargeAmount)
        }
        return false
    }
    /**
     * 大厅功能开关监听
     * @param node 
     * @param nType 
     * @param callback 
     */
    addCustomControlLinster(node, nType, callback) {
        let curStatus = null
        function update() {
            let status = this.checkCustomControlOpen(nType)
            if (curStatus != status) {
                curStatus = status
                if (callback) {
                    callback(curStatus)
                }
            }
        }
        app.event.bindEvent({
            valideTarget: node,
            eventName: EVENT_ID.EVENT_PLAZA_CUSTOM_CONTROL_CFG,
            callback: update.bind(this)
        });
        app.event.bindEvent({
            valideTarget: node,
            eventName: EVENT_ID.EVENT_PLAZA_ACTOR_PRIVATE,
            callback: update.bind(this)
        });
        app.event.bindEvent({
            valideTarget: node,
            eventName: EVENT_ID.EVENT_PLAZA_ACTOR_VARIABLE,
            callback: update.bind(this)
        });
    }
    /**
     * 设置标记位
     * @param bit_set_index 
     */
    sendSetGuidFlag(bit_set_index: number) {
        let data = proto.plaza_actorprop.actor_plaza_set_bit_flag_c.create()
        data.bit_set_index = bit_set_index
        this.sendMessage({
            cmd: this.cmd.PLAZA_ACTOR_SET_BIT_FLAG,
            data: data
        });
    }
    /**
     * 标记位设置成功
     * @param dict 
     */
    onRecv_ActorBitFlg(dict: proto.plaza_actorprop.actor_plaza_bit_set_update_s) {
        dict.list.forEach(element => {
            element.index.forEach((elementEx, index) => {
                this.guideFlag[elementEx] = element.bit_set_value[index];
            });
        });
    }
    /**引导是否完成 */
    isGuideComplete(bitFlag: BITSETFLAG) {
        if (bitFlag > BITSETFLAG.MAX_INDEX) {
            return false;
        }
        let subIndex = bitFlag % 32;
        let mainIndex = (bitFlag - subIndex) / 32;
        let ret = this.isGuideBitSetComplete(this.guideFlag[mainIndex], subIndex)
        return ret;
    }

    isGuideBitSetComplete(bitSetInfo: number, subIndex: number) {
        return (bitSetInfo >> subIndex & 1) > 0
    }

    //获取当前商城subIndex对应金额是否已经充过值, 返回true 表示对应金额没充过值
    isFirstCashVaild(subIndex: number) {
        return (center.user.getActorProp(ACTOR.ACTOR_PROP_NEW_FIRST_RECHARGE_FLAG) >> subIndex & 1) <= 0
    }

    //当前商城所有金额是否已经充过值, 返回true 表示所有金额已经充过, 所有金额只包含配置有返利的金额
    isFirstCashAllComplete() {
        let isCashCount = 0
        let hasBonusCount = 0
        let mallLimitConfig = center.mall.mallLimitConfig;
        let nCashList = mallLimitConfig.num.list;
        for (let k = 0; k < nCashList.length; k++) {
            let v = nCashList[k];
            let nRate = center.luckyCard.getFirstRechrgeRatio(v)
            if (nRate.index > -1 && nRate.ratio > 0) {
                hasBonusCount++;
                if (!(center.user.isFirstCashVaild(nRate.index))) {
                    isCashCount++
                }
            }
        }
        this.mIsFirstCashAllComplete = isCashCount == hasBonusCount
    }

    getIsFirstCashAllComplete() {
        return this.mIsFirstCashAllComplete
    }

    getGuideIndexArray() {
        return BITSETFLAG
    }

    getPayItemMap() {
        return this.m_PayItemMap
    }

    havePay(szPayKey) {
        return this.m_PayItemMap[szPayKey] != null
    }

    getPayItem(szPayKey) {
        if (this.havePay(szPayKey)) {
            return this.m_PayItemMap[szPayKey]
        }
        return null
    }

    getCustomIDString(szPayKey, nRID): string {
        let items = this.getPayItem(szPayKey)
        if (items) {
            for (const iterator of items) {
                if (iterator.nRID == nRID) {
                    return iterator.nCustomID
                }
            }
        }
        return ""
    }

    getServerDelTime() {
        return this.mDelServerTime;
    }

    getRegisterOperatorsSubID() {
        return this.mUserInfoFromWebData.user_sub_type ?? app.native.device.getOperatorsSubID()
    }

    getBuffNum():number {
        let nBuffNum = this.getActorProp(ACTOR.ACTOR_PROP_BUFF_HD_NUM) && this.getActorProp(ACTOR.ACTOR_PROP_BUFF_HD_NUM) || 0
        nBuffNum = nBuffNum > 3 && 3 || nBuffNum
        return nBuffNum
    }

    canShowMegaGift() {
		let nBuffNum = center.user.getBuffNum()
		let bShow = center.luckyCard.checkShowMegaGift() && app.sdk.isSdkOpen("firstpay");
		return nBuffNum == 1 && bShow
	}

    showChoose(minPay?) {
        let showMall = ()=>{
            app.popup.showDialog({
                viewConfig: fw.BundleConfig.plaza.res[`shop/shop_main`],
                data: {
                    minPay: minPay
                },
            });
        }

		if (center.user.canShowMegaGift()) {
            showMall()
			center.user.showMegaGift()
		} else {
			showMall();
		}
	}

    showMegaGift(callback?) {
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`megaGift/MegaGift`],
            data: {
                cancelClickListener: callback,
            }
		});
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

    getSelColor() {
        return this.m_nSelColor
    }

    setSelColor(nColor) {
        this.m_nSelColor = nColor
    }

    /**请求玩家玩法分组信息 */
    getUserGroup() {
        let params = {
            timestamp: app.func.time(),
            uid: center.user.getUserID(),
        }
        app.http.post({
            //请求链接
            url: `${httpConfig.path_pay}hall/userGroup`,
            //请求参数
            params: params,
            //完成时回调函数
            callback: (bSuccess: boolean, response: any) => {
                if (bSuccess) {
                    if (response.status == 1) {
                        this.mUserGroupInfo = response.data;
                    } else if (response.msg) {
                        app.popup.showToast(response.msg);
                    } else {
                        fw.printError(response);
                    }
                } else {
                    fw.printError(response);
                }
            },
        });
    }

    getUserGroupData() {
        return this.mUserGroupInfo
    }

    setServiceEmergencyInfo(info) {
        this.serviceEmergencyInfo = info
    }
    getServiceEmergencyInfo() {
        return this.serviceEmergencyInfo
    }
    getDayIndex() {
        let data = new Date()
        let dated2: Date = new Date(data.getFullYear(), 0, 0, 0, 0, 0, 0);
        let dayIndex = Math.floor((data.getTime() - dated2.getTime()) / (3600 * 24 * 1000))
        fw.print("dayIndex " + dayIndex)
        return dayIndex
    }
    setWithdrawGuide(flag) {
        this.mWithdrawGuide = flag
    }
    checkWithdrawGuide() {
        let withdrawGuide = this.mWithdrawGuide
        this.mWithdrawGuide = false
        return withdrawGuide
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