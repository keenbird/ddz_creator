import proto from "../../../app/center/common";
//这些是暂时的标签，当服务端更新USER_ATTRI_TYPE和ACTOR重叠，替换并删除
export enum ACTOR {		
    ACTOR_PROP_LOSTCOUNT = 32, //输场次
    ACTOR_PROP_WINCOUNT = 33, //赢场次
    ACTOR_PROP_DRAWCOUNT = 34, //平场次
    ACTOR_PROP_DROPCOUNT = 35, //逃跑场次	
    ACTOR_PROP_VIPEXP = 36, //VIP经验值
    ACTOR_PROP_VIPLEVEL = 37, //VIP等级
    ACTOR_PROP_SEX = 38, //用户性别		 // 性别('f'=男 'm'=女)
    ACTOR_PROP_GM = 39, //是否是GM		
    ACTOR_PROP_OPENFLAG = 40, //功能开启标示(参考OPENFLAG定义)
    ACTOR_PROP_GAME_STATE = 41, //用户状态
    ACTOR_PROP_ISGUEST = 42, //游客账号
    ACTOR_PROP_RECHARGE_AMOUNT = 43, //玩家累计充值金额
    ACTOR_PROP_RIGHT = 44,
    
    ACTOR_PROP_DAY_OVERFLOWBAG_FLAG = 65, //提现第一个面额只能提现一次
    ACTOR_PROP_RECHARGE_CASHBACK = 75, //当前返利
    ACTOR_PROP_PRACTISE_SCORE = 76, // 练习积分
    ACTOR_PROP_WITHDRAW_GOLD = 77, // 可提现金币
    ACTOR_PROP_RUMMY_PLAY_COUNT = 78, // 局数变化
    ACTOR_PROP_GAME_STATEMENT = 79, // 游戏流水总数
    ACTOR_PROP_BUSET_BUY_COUNT = 99, //破产礼包购买次数
    ACTOR_PROP_RECHARGE_PROTECT_END_TIME = 115, //充值保护领奖时间
    ACTOR_PROP_RECHARGE_PROTECT_PRIZE = 116, //充值保护奖励数量
    ACTOR_PROP_SERVER_TIME = 120, //当前服务器时间
    ACTOR_PROP_LOTTERY_MONTH_PRICENUM = 121, //当前月卡奖励金额
    ACTOR_PROP_LOTTERY_WEEK_PRICENUM = 122, //当前周卡奖励金额
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