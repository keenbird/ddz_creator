import proto from "../../../app/center/common";
export enum ACTOR {
    ACTOR_PROP_DBID = 1, //用户的DBID
    ACTOR_PROP_UID = 2, //用户的UID
    ACTOR_PROP_GOLD = 3, //金币值		
    ACTOR_PROP_DIAMONDS = 4, //钻石值		
    ACTOR_PROP_LOSTCOUNT = 5, //输场次
    ACTOR_PROP_WINCOUNT = 6, //赢场次
    ACTOR_PROP_DRAWCOUNT = 7, //平场次
    ACTOR_PROP_DROPCOUNT = 8, //逃跑场次
    ACTOR_PROP_SCORE = 9, //用户积分值		
    ACTOR_PROP_VIPEXP = 10, //VIP经验值
    ACTOR_PROP_VIPLEVEL = 11, //VIP等级
    ACTOR_PROP_NEXTVIPLEVELEXP = 12, //VIP达到下一等级需要的经验值
    ACTOR_PROP_SEX = 13, //用户性别		 // 性别('f'=男 'm'=女)
    ACTOR_PROP_GM = 14, //是否是GM		
    ACTOR_PROP_OPENFLAG = 15, //功能开启标示(参考OPENFLAG定义)
    ACTOR_PROP_GAME_STATE = 16, //用户状态
    ACTOR_PROP_GAME_TABLEINDEX = 17, //用户所在桌号
    ACTOR_PROP_GAME_CHAIR = 18, //用户所在椅子号
    ACTOR_PROP_BEHAVIORCTRL = 19, //用户行为权限(参考ACTOR_BEHAVIORCTRL定义)
    ACTOR_PROP_PROMOTERDBID = 22, //所属推广员DBID
    ACTOR_PROP_CLIENTOPENFLAG = 23, //客户端使用的标志(纯客户端使用,在客户端自定义每个位的作用)
    ACTOR_PROP_ISGUEST = 24, //游客账号
    ACTOR_PROP_BUY_LIMIT = 25, //限时抢购
    ACTOR_PROP_GUIDE_ID_FLAGS = 32, //玩家新手引导的完成标志 权位表示
    ACTOR_PROP_RECHARGE_AMOUNT = 33, //玩家累计充值金额
    ACTOR_PROP_RIGHT = 44,
    ACTOR_PROP_NOVICE_GUIDE_FLAGS = 52, //玩家新手引导的完成标志2 权位表示
    ACTOR_PROP_LEVEL = 53, // 玩家经验等级
    ACTOR_PROP_OTHER_PLATFORM_FLAG = 56, // 现在是捕鱼里玩家首充标志
    ACTOR_PROP_DAY_LUCKYDRAM_COUNT = 63, //每日幸运抽奖次数
    ACTOR_PROP_NEW_FIRST_RECHARGE_FLAG = 64, //新首充购买标记
    ACTOR_PROP_DAY_OVERFLOWBAG_FLAG = 65, //提现第一个面额只能提现一次
    ACTOR_PROP_BONUS_EXPIRE_TIME = 73, //玩家返利到期时间
    ACTOR_PROP_RECHARGE_SAVED_BONUS = 74, //剩余返利
    ACTOR_PROP_RECHARGE_CASHBACK = 75, //当前返利
    ACTOR_PROP_PRACTISE_SCORE = 76, // 练习积分
    ACTOR_PROP_WITHDRAW_GOLD = 77, // 可提现金币
    ACTOR_PROP_RUMMY_PLAY_COUNT = 78, // 局数变化
    ACTOR_PROP_GAME_STATEMENT = 79, // 游戏流水总数
    ACTOR_PROP_USE_WITHDRAW_COUNT = 81, // 当月提现次数
    ACTOR_PROP_OUT_WITHDRAW_COUNT_BYDAY = 82, // 每日提现次数
    ACTOR_PROP_TRANSFERACCOUNTS_COUNT = 85, // 当月转账次数
    ACTOR_PROP_OUT_WITHDRAW_NUM_BYDAY = 98, //每日提现金額
    ACTOR_PROP_BUSET_BUY_COUNT = 99, //破产礼包购买次数
    ACOTR_PROP_SCRATCHCARD_RECHARGE = 107, //刮刮卡上线后累计充值
    ACTOR_PROP_RECHARGE_PROTECT_END_TIME = 115, //充值保护领奖时间
    ACTOR_PROP_RECHARGE_PROTECT_PRIZE = 116, //充值保护奖励数量
    ACTOR_PROP_SERVER_TIME = 120, //当前服务器时间
    ACTOR_PROP_LOTTERY_MONTH_PRICENUM = 121, //当前月卡奖励金额
    ACTOR_PROP_LOTTERY_WEEK_PRICENUM = 122, //当前周卡奖励金额
    ACTOR_PROP_BUFF_HD_NUM = 123, //用户小号
    ACTOR_PROP_LOTTERY_DAY_PRICENUM = 143, //当前天卡奖励金额

    ACTOR_STATE_UNKNOWN = -1, //未知状态
    ACTOR_STATE_FREE = 1, //空闲状态
    ACTOR_STATE_HAND = 2, //举手状态
    ACTOR_STATE_GAME = 3, //游戏状态
    ACTOR_STATE_DROP = 4, //掉线状态
    ACTOR_STATE_WATCH = 5, //旁观状态(暂未实现)
    ACTOR_STATE_WAITNEXT = 6, //占座等待下一场游戏状态(用户不参与本局游戏)		
    ACTOR_STATE_WAITSETPLAY = 7, //等待游戏模块设置游戏状态
    ACTOR_STATE_GMLOOK = 8, //GM旁观状态(不参与游戏)

}
export const PROTO_ACTOR = proto.client_proto.USER_ATTRI_TYPE 
export const INVAL_TABLEID = -1
export const INVAL_CHAIRID = -1
export const INVAL_USERID = -1

export const TABLESTATE_FREE = 0 //空闲
export const TABLESTATE_PLAY = 1 //游戏中