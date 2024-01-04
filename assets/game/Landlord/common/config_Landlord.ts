import { _decorator,Size } from 'cc';
const { ccclass } = _decorator;

import { config_GameBase } from '../../GameBase/common/config_GameBase';
import { yx } from '../yx_Landlord';

@ccclass('config_Landlord')
export class config_Landlord extends config_GameBase {
    /**操作类型 */
    JettonArea = {
        /**A押注 */
        BTN_BETA: 1,
        /**B押注 */
        BTN_BETB: 2,
        /**不下注 */
        BTN_SKIP: 3,
        /**超时 */
        OVER_TIME: 4,
    }
    /**游戏状态 */
    GameState = {
        /**空闲 */
        FREE: 0,
        /**第一阶段（发第一张牌） */
        BET1: 1,
        /**第二阶段（发第二张牌） */
        BET2: 2,
        /**游戏结束 */
        END: 3,
    }
    /**游戏状态 */
    PlayerStates = {
        /**空闲 */
        Free: 0,
        /**参与 */
        Join: 1,
        /**已下注 */
        Play: 2,
        /**超时 */
        TimeOut: 3,
    }
    /** */
    CardColor = CardColor
    /**缩小比例 */
    changeOldResScale = 1/1.5
    /**不符合出牌提示 */
    HandsAnalyseTipType = {
        HandsAnalyseTipType_NoAvaliableCard : 0x00,     //没有大于大家的牌 
        HandsAnalyseTipType_InvalidCard : 0x01         //不符合出牌规则
    }
    /**玩家叫牌状态 */
    playerCallState = {
        Landlord_CallLandlordPositive : "叫地主",    
        Landlord_CallLandlordNegative : "不叫" ,  
        Landlord_GrabLandlordPositive_1 : "抢地主",   
        Landlord_GrabLandlordPositive_2 : "抢地主",    
        Landlord_GrabLandlordPositive_3 : "我抢" ,  
        Landlord_GrabLandlordNegative : "不抢" ,     
        Landlord_GrabMutiplePositive : "加倍",    
        Landlord_GrabMutipleNegative : "不加倍" , 
        Landlord_PublicCard : "明牌",    
        Landlord_CannotAfford_1 : "不要" , 
        Landlord_CannotAfford_4 : "要不起"
    }
    /**花色 */
    CardColorShape = {
        CardColorShape_Diamond : 0x00,     //方
        CardColorShape_Club : 0x10,     //梅
        CardColorShape_Heart : 0x20,     //心
        CardColorShape_Spade : 0x30,     //桃
        CardColorShape_Joker : 0x40,     //王
    }
    /**创建牌的牌型 */
    CardSizeType = {
        CardSizeType_Hands : 1,     //手牌的牌
        CardSizeType_PoolCard : 2,     //底池的牌（最后三张牌）
        CardSizeType_Public : 3,     //明牌的牌（小号、明牌使用）
        CardSizeType_OutCard : 4,     //出牌的牌
        CardSizeType_DisCard : 5,     //弃牌的牌
    }
    //牌值掩码
    CARD_VALUE_MASK = 0x0F
    //花色掩码
    CARD_COLOR_MASK = 0xF0

    //游戏逻辑牌数(3,4,5,6,...,10,J,Q,K,A,2,JOKE1,JOKER2)
    GAME_CARD_VALUE_LOGIC_COUNT = 15
    //牌单元块数量
    GAME_CARD_UNIT_BLOCK_COUNT = 4
    //牌层级最大值
    GAME_CARD_ZODER_MAX = 100
    //有效的牌值
    CARD_DATA = [
        0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0A, 0x0B, 0x0C, 0x0D,			//方块A ~ k
        0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1A, 0x1B, 0x1C, 0x1D,			//梅花A ~ K
        0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2A, 0x2B, 0x2C, 0x2D,			//红心A ~ K（红桃）
        0x31, 0x32, 0x33, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3A, 0x3B, 0x3C, 0x3D,			//黑桃A ~ K
        0x4E, 0x4F
    ]
    //游戏总共牌数
    GAME_CARD_SUM = 54
    //用户最多牌数
    MAX_COUNT = 20
    //游戏逻辑最大值(大王,  17)
    GAME_CARD_LOGIC_VALUE_MAX = 17
    //花色值
    CardColorValue ={
    /* 红色 */
        CardColorValue_Red : 0,
        /* 黑色 */
        CardColorValue_Black : 1,
        /* 癞子（金色） */
        CardColorValue_Laizi : 2,
    }

    CARD_COLOR_RED = "red"
    CARD_COLOR_BLACK = "black"
    CARD_COLOR_LAIZI = "laizi"

    CARD_TYPE_SPADE = "spade"		//桃
    CARD_TYPE_HEART = "heart"		//心
    CARD_TYPE_CLUB = "club"			//梅
    CARD_TYPE_DIAMOND = "diamond"	//方
    CARD_TYPE_JOKER = "joker"		//王
    CARD_TYPE_LAIZI = "laizi"		//癞子

    //偏移值Y（选中牌之后弹起的高度）
    CARD_POP_OFFSET_Y = 30
    //手牌左右距离总和
    CARD_PADDING_TOTAL_OF_HAND_CARDS = 35
    /** 扑克牌的尺寸 */
    CARD_SIZE = new Size(161, 212)
    /** 间距（手牌之间的间隔, 17张铺满来算的） */
    CARD_PADDING_OF_HAND_CARDS =  ((app.winSize.width - this.CARD_PADDING_TOTAL_OF_HAND_CARDS - this.CARD_SIZE.width) / (17 - 1))
    //--滑动出牌高度Y
    OUT_CARD_OFFSET_Y = this.CARD_SIZE.height
    //- 扑克牌单击手势最大偏移值(超过属于滑动，低于属于单击) */
    CARD_GESTURE_TAP_OFFSET_MAX = 5

    //游戏状态
    GameStatus ={
        ///* 空闲 */
        GameStatus_Free : 10,	
        //* 发牌 */
        GameStatus_Config : 11,
        //* 叫分 */
        GameStatus_CallPoints : 12,
        ///*加倍阶段*/
        GameStatus_PlayDouble : 15,
        ///* 对局 */
        GameStatus_Playing : 16,
        ///* 结算 */
        GameStatus_End: 17,
        ///* 弃牌 */
        GameStatus_Discard: 18,
    }

    m_MaxCardInfo={
        cardData : [],
        cardCount : -1,
        cbChairID : -1,
        nType : -1
    }

    //排序方式
    CardSortOrder ={
        ASC : 1,
        DESC : 2
    }
    OutCardType = {
        /* 单张(3) */
        Single:1,
        /* 一对(3-3) */
        Double:2,
        /* 三张(3-3-3) */
        Triplet:3,
        /* 三带一单(3-3-3-4) */
        Triplet_Attached_Card:4,
        /* 三带一对(3-3-3-4-4) */
        Triplet_Attached_Pair:5,
        /* 顺子(3-4-5-6-7-...) */
        Sequence:6,
        /* 连对(3-3-4-4-5-5-...) */
        Sequence_Of_Pairs:7,
        /* 飞机(三连)(3-3-3-4-4-4) */
        Sequence_Of_Triplets:8,
        /* 飞机带单(3-3-3-4-4-4-5-6) */
        Sequence_Of_Triplets_With_Attached_Cards:9,
        /* 飞机带对(3-3-3-4-4-4-5-5-6-6) */
        Sequence_Of_Triplets_With_Attached_Pairs:10,
        /*软炸*/
        softBomb:11,
        /* 炸弹(3-3-3-3) */
        Bomb:12,
        /*癞子炸弹*/
        LaiZiBomb:13,
        /* 王炸(J1-J2) */
        Rocket:14,
        /* 四带二单(3-3-3-3-4-5 或 3-3-3-3-4-4) */
        Quadplex_Attached_Two_Cards:15,
        /* 四带二对(3-3-3-3-4-4-5-5) */
        Quadplex_Attached_Two_Pairs:16,
        /* 任意出牌 */
        Arbitrary:17,
        //两个连续炸弹特殊牌型
        Quadplex_Two_special:18,
        //连炸
        serial_bomb:19,
        /* 不符合出牌规则 */
        Invalid:-1
    }
    m_use_serial_bomb = false
    //特殊牌型数值最大 44443333
    CARD_SPECIAL_VALUE_MAX = 0xC0
    //特殊牌型数值 44443333
    CARD_SPECIAL_VALUE = 0x90
    //搜索方式
    SearchMode = {
        /* 全区间模式（两点固定区间进行快捷选取） */
        SearchMode_FullRegion : 1,
        /* 半区间模式（选1个，预发搜索要压的牌） */
        SearchMode_HalfRegion : 2,
        /* 滑动模式（滑动选牌进行搜索） */
        SearchMode_Sliding : 3,
    }
    //间距（打出的牌之间的间隔）
    CARD_PADDING_OF_OUT_CARDS = 35
    //出牌缩小比例
    CARD_SCALE_OUT_CARDS = 0.6
    /** 扑克牌的尺寸 */
    OUT_CARD_SIZE = new Size(107, 141)

    /* 动作条状态 */
    ActionBarStatus : {
        /* 叫地主状态(不叫 or 叫地主) */
        ActionBarStatus_CallLandlord : 0x20,
        /* 抢地主状态(不抢 or 抢地主) */
        ActionBarStatus_GrabLandlord : 0x30,
        /* 加倍(不加倍 or 加倍) */
        ActionBarStatus_Double : 0x40,
        /* 要得起状态(不打 or 出牌 or 提示) */
        ActionBarStatus_CanAfford : 0x50,
        /* 要不起 */
        ActionBarStatus_CannotAfford : 0x60,
        /* 取消托管 */
        ActionBarStatus_CancelTrusteeship : 0x70,
        /* 明牌(明牌xn) */
        ActionBarStatus_PublicCard : 0x80,
        /* 只能 出牌 */
        ActionBarStatus_PublicOutCard : 0x90,
        /* 弃牌 */
        ActionBarStatus_Discard : 0xA0,
        /* 掩码 */
        ActionBarStatus_Mask : 0xF0
    }
    /* 空闲动作条状态 */
    FreeActionBarStatus : {
        /* 只有开始游戏 */
        FreeActionBarStatus_Start : 0x10,
        /* 可换桌可准备 */
        FreeActionBarStatus_ChangeAndReady : 0x20,
        /* 已准备可换桌 */
        FreeActionBarStatus_Change : 0x30,
        /* 掩码 */
        FreeActionBarStatus_Mask : 0xF0
    }
}

/**牌花色 */
enum CardColor {
    /**方块 */
    Diamond = 0x00,
    /**梅花 */
    Club = 0x10,
    /**红桃 */
    Heart = 0x20,
    /**黑桃 */
    Spade = 0x30,
}

/**类型声明调整 */
declare global {
    namespace globalThis {
        type type_config_Landlord = config_Landlord
    }
}
