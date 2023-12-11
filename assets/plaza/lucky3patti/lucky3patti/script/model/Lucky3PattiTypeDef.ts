/**
 * Predefined variables
 * Name = Lucky3PattiTypeDef
 * DateTime = Wed Feb 23 2022 09:50:25 GMT+0800 (中国标准时间)
 * Author = 大禹_Jason
 * FileBasename = Lucky3PattiTypeDef.ts
 * FileBasenameNoExtension = Lucky3PattiTypeDef
 * URL = db://assets/game/game_teenpatti/script/Lucky3PattiTypeDef.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

export const Lucky3PattiTypeDef = {
    //玩家数量
    ePlayerCount: 5,
    //手牌数量
    ePokerCount: 3,
    //无效值
    eInvalidValue: 0xFF,
    //游戏模式
    eGameMode: {
        normal: 0,
        laizi: 1,
        score: 2,
        scoreLz: 3,
    },
    //游戏状态
    eGameStatus: {
        //空闲
        free: 0,
        //准备
        prepare: 1,
        //打牌中
        play: 2,
        //结算
        settle: 3,
        //比牌
        compare: 4,
    },
    //玩家状态
    ePlayerStatus: {
        //空闲
        free: 0,
        //准备
        prepare: 1,
        //打牌中
        play: 2,
        //弃牌
        giveup: 3,
        //淘汰
        out: 4,
        //结算
        settle: 5,
    },
    //扑克值
    ePokerData: [
        0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D,           //方块A ~ K
        0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D,           //梅花A ~ K
        0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D,           //红桃A ~ K
        0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D            //黑桃A ~ K
    ],
    //扑克逻辑数
    ePokerLogicCount: 13,
    //牌值掩码
    ePokerValueMask: 0x0F,
    //花色掩码
    ePokerColorMask: 0xF0,
    //手牌间距
    ePokerGap: 45,
    //扑克花色
    ePokerColor: {
        diamond: 0x00,    //方块
        club: 0x10,       //梅花
        heart: 0x20,      //红桃
        spade: 0x30,      //黑桃
    },
    //牌型
    ePokerType: {
        Single: 0,             //散牌
        Pair: 1,               //对子
        Straight: 2,           //顺子
        Suit: 3,               //金花
        StraightSuit: 4,       //顺金
        Triplet: 5             //豹子
    },
    //牌型字符串
    ePokerTypeStr: [
        "High card",            //散牌
        "Pair",                 //对子
        "Sequence",             //顺子
        "Color",                //金花
        "Pure Sequence",        //顺金
        "Trail"                 //豹子
    ],
    //下注操作类型
    betType: {
        blind: 0,               //跟注
        chaal: 1                //加注
    },
    //看牌类型
    seeType: {
        see: 0,                 //看牌
        show: 1                 //开牌
    },
    //退出类型
    outType: {
        default: 0,             //无
        exit: 1,                //退出
        switch: 2               //换做
    },
    //癞子牌最小花色
    eLzMinMask: 0x50,
    //癞子牌最小花色
    eLzMaxMask: 0x80,
    //癞子牌值
    ePokerDataLz: [0x01, 0x04, 0x07, 0x0D],
    //牌值显示的字符串
    ePokerValueString: ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"],
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
