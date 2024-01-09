import { color } from "cc";

//雷亚尔符号："R$"
export const DF_SYMBOL = "R$"
/**“金币”转“卢比”，1金币=0.01卢比 */
export const DF_RATE = 100;

/**设计分辨率 */
export const DesignResolutionSize = {
    width: 1280,
    height: 720,
}

/**文本置灰颜色 */
export const GrayColor = color(`#BBBBBD`);

/**最大节点深度（自定义的） */
export const MAX_SIBLING = 1000000;

/**下载图片类型 */
export enum DOWN_IMAGE_TYPE {
    /**普通资源（子包下的资源） */
    Image = `image`,
    /**头像 */
    Head = `head`,
    /**广告 */
    Advert = `advert`,
    /**动态？？？ */
    Dynamic = `Dynamic`,
    /**活动 */
    Activity = `Activity`,
    /**网络图片 */
    UrlImage = `urlImage`,
}

/**（真，假）横竖屏 */
export enum ScreenOrientationType {
    /**真横屏 */
    Horizontal_true,
    /**真竖屏 */
    Vertical_true,
    /**假横屏 */
    Horizontal_false,
    /**假竖屏 */
    Vertical_false,
}

/**反馈类型 */
export const FeedbackType = {
    /**默认 */
    default: `0`,
    /**游戏问题 */
    GameProblem: `7`,
    /**充值问题 */
    RechargeHelp: `8`,
    /**其它问题 */
    OtherHelp: `9`,
    /**登录问题 */
    Login: `11`,
    /**游戏Bug问题 */
    GameBug: `12`,
    /**???赢金问题 */
    WinGoldHelp: `13`,
    /**日常奖励问题 */
    DailyRewards: `14`,
    /**VIP问题 */
    VIP: `15`,
    /**???100免费奖金 */
    FreeGoldHelp: `16`,
    /**邀请问题 */
    InvitationHelp: `17`,
    /**提现过程问题 */
    WithdrawProcess: `18`,
    /**提现成功问题 */
    WithdrawSuccessed: `19`,
    /**提现失败问题 */
    WithdrawFailed: `20`,
    /**提现帮助问题 */
    WithdrawHelp: `21`,
    /**游戏任务问题 */
    GameMissions: `22`,
    /**游戏支持问题 */
    GameSupport: `23`,
}

/**游戏聊天类型 */
export const GameParseType = {
    /**语音短语 */
    GameParseSound: 0,
    /**表情短语 */
    GameParseFace: 1,
}

export enum NETWORK_TYPE {
    NETWORK_TYPE_NONE = 0,
    NETWORK_TYPE_WIFI = 1,//wifi
    NETWORK_TYPE_NET = 2,//数据流量
}

export enum ERRID {
    OK,//成功
    //common
    STOP_SERVER,// 服务器维护中，请稍后
    SERVER_BUSY,//服务器繁忙，请稍后重试
    ACCOUNT_INVALID,// 账号不存在
    ACCOUNT_FREEZE,//账号冻结
    PASSWORD_ERROR,//密码错误
    LOGIN_FREQUENT,//您的账号正在登录
    ACCOUNT_ERROR,// 账号登录信息异常
    SYSTEM_ERROR,//系统数据异常
    SYSTEM_KICK,//系统踢出
    SYSTEM_KICK_PHP,//系统踢出(PHP)
    SAVING_DATA,//下线存盘中
    MSG_HEAD_ERROR,//消息包头异常
    MSG_HANDLE_ERROR,//消息处理异常
    CHAT_CONFIG_ERROR,//配置错误
    STOP_PRETREATMENT,//停服预处理提示
    // plaza
    PLAZA_LOGIN_DB_ERROR = 100,//登录广场DB返回数据异常
    LOAD_DATA_ERROR,//加载用户部件数据异常
    SAVE_DATA_ERROR,//用户数据落地异常
    PLAZA_RELOGIN,//挤号
    RELOAD_PLAZA,//客户端重新登录提示收到此消息客户端执行退出广场重新登录流程
    //room
    GAME_LOGIN_DB_ERROR = 500, // 登录游戏DB异常
    GAME_RELOGIN,//你的账号在别处登录，如果有疑问，请联系客服！
    GAME_LOAD_DATA_ERROR,//加载用户游戏数据异常
    GAME_KICK_FORCE,//系统强制踢出，如果有疑问，请联系客服！
    GAME_KICK_NO_SIGNUP,//没有报名比赛!
    GAME_KICK_HAND_TIMEOUT,//举手超时！
    GAME_KICK_KILL_GAME,//发生异常，强制解散游戏！
    GAME_KICK_PLAZA_OFFLINE,//游戏已离线，请重新登录游戏！
    GAME_KICK_LOGIN_MULTI,//同一账号禁止登录多个游戏
    GAME_DROP_KICK,//游戏离线踢出
    GAME_GOLD_LIMIT,//金币限制
    GAME_KICK_NOPLAY,//长时间未游戏，离开房间！
    GAME_KICK_RECHARGE,//踢人消息, 并提示充值
    GAME_MAINTENANCE,//游戏维护
    GAME_USE_PROP_NOGOLD,//金币不足，不能使用道具！
    GAME_WIN_MORE_TIP,//谢谢，请多赢一点，祝您好运！
};

export const ERRID_MSG: Map<ERRID, string> = new Map([
    [ERRID.STOP_SERVER, /**lang*/"The server is being upgraded, please try again later."],
    [ERRID.SERVER_BUSY, /**lang*/"Login busy, please try again later!"],
    [ERRID.ACCOUNT_INVALID, /**lang*/"Account does not exist!"],
    [ERRID.ACCOUNT_FREEZE, /**lang*/"Account has been frozen!"],
    [ERRID.PASSWORD_ERROR, /**lang*/"Password ERROR!"],
    [ERRID.LOGIN_FREQUENT, /**lang*/"Your account is logging in!"],
    [ERRID.ACCOUNT_ERROR, /**lang*/"Account login information is abnormal!"],
    [ERRID.SYSTEM_ERROR, /**lang*/"System Data is abnormal!"],
    [ERRID.SYSTEM_KICK, /**lang*/"kicked out of the system!"],
    [ERRID.SYSTEM_KICK_PHP, /**lang*/"kicked out of the system!"],
    [ERRID.SAVING_DATA, /**lang*/"Offline saving data, try again later!"],
    [ERRID.MSG_HEAD_ERROR, /**lang*/"Message header exception!"],
    [ERRID.MSG_HANDLE_ERROR, /**lang*/"Message processing exception!"],
    [ERRID.CHAT_CONFIG_ERROR, /**lang*/"Chat configuration error!"],
    [ERRID.PLAZA_LOGIN_DB_ERROR, /**lang*/"Login square DB exception!"],
    [ERRID.LOAD_DATA_ERROR, /**lang*/"loading user data exception!"],
    [ERRID.SAVE_DATA_ERROR, /**lang*/"Saveing user data exception!"],
    [ERRID.PLAZA_RELOGIN, /**lang*/"Your account is logged in elsewhere, if you have any questions, please contact customer service!"],
    [ERRID.RELOAD_PLAZA, /**lang*/"An update was detected, please log out and log in again!"],
    [ERRID.GAME_LOGIN_DB_ERROR, /**lang*/"Logging in to the game DB is abnormal"],
    [ERRID.GAME_RELOGIN, /**lang*/"Your account is logged in elsewhere, if you have any questions, please contact customer service!"],
    [ERRID.GAME_LOAD_DATA_ERROR, /**lang*/"Loading user game data is abnormal!"],
    [ERRID.GAME_KICK_FORCE, /**lang*/"The system forcibly kicks it out, if you have any questions, please contact customer service!"],

    [ERRID.GAME_KICK_NO_SIGNUP, /**lang*/"Not sign up the match!"],
    [ERRID.GAME_KICK_HAND_TIMEOUT, /**lang*/"You're back in the lobby because you're not ready."],
    [ERRID.GAME_KICK_KILL_GAME, /**lang*/"An exception occurred, the game was forcibly dismissed!"],
    [ERRID.GAME_KICK_PLAZA_OFFLINE, /**lang*/"The game is offline, please log in to the game again!"],
    [ERRID.GAME_KICK_LOGIN_MULTI, /**lang*/"It is forbidden to log in to multiple games with the same account"],

    [ERRID.GAME_DROP_KICK, /**lang*/"Offline user kicked out!"],
    [ERRID.GAME_GOLD_LIMIT, /**lang*/"Not enough money to Login game!"],
    [ERRID.GAME_KICK_NOPLAY, /**lang*/"No playing for a long time to exit!"],
    [ERRID.GAME_KICK_RECHARGE, /**lang*/"Play game requires ###, please recharge!"],
    [ERRID.GAME_MAINTENANCE, /**lang*/"The game is under maintenance, please try again later!"],

    [ERRID.GAME_USE_PROP_NOGOLD, /**lang*/"Not enough money to use prop!"],
    [ERRID.GAME_WIN_MORE_TIP, /**lang*/"Thank you, please win more and good luck!"],

])

export enum ROOM_RULE_ENTER {
    gold,

    noLimit = 100,
    roomConfigLimit,
    goldLimitMin,
    goldLimitMax,
}

//PHP对接用
export enum LOGINTYPE {
    ACCOUNT = 0, // 账号登录
    PHONE = 1, // 手机号码登录
    EMAIL = 2, // 邮箱登录
    WEIXIN = 3, // 微信登录
    FB = 4, // facebook登录
    IOS = 5,	  // ios登录
    UUID = 254, // 伪码登录(手机程序安装的自身的Installtion ID)
    GUEST = 255, // 游客登录
}

//C++对接用
export enum CPLUSLOGINTYPE {
    LTD_NULL = 0, //占位
    LTD_TOKEN = 1, // token登录的串
    LTD_PASSWORD = 2, // 账号密码登录
    LTD_CODE = 3, // 手机验证码登录
}

export const trucoRoomType = {
	Dirty: 24,
	Clean: 25,
}

export const LOGINTYPE_STR = {
    [LOGINTYPE.ACCOUNT]: "logintype_account",
    [LOGINTYPE.PHONE]: "logintype_phone",
    [LOGINTYPE.EMAIL]: "logintype_email",
    [LOGINTYPE.WEIXIN]: "logintype_weixin",
    [LOGINTYPE.FB]: "logintype_fb",
    [LOGINTYPE.IOS]: "logintype_ios",
    [LOGINTYPE.UUID]: "logintype_uuid",
    [LOGINTYPE.GUEST]: "logintype_guest",
}

export const FileEncryptKey = "b9d27fa6b64db9390678aa4fe42bdf84"
export const PATHS = {
    LoginPhonePWD : `login/LoginPhonePWD`,
    LoginFBPWD : `login/LoginFBPWD`,
    LoginGuestPWD : `login/LoginGuestPWD`
}
