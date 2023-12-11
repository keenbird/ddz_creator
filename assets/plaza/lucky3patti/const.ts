



// 游戏状态
export enum LUCKY3PT_GAME_STATE {
    free = 0,                        // 空闲状态
    playing,                         // 游戏状态
}

export enum MINIGAME_ROOMID {
    lucky3patti = 10000,            // Lucky3Patti小游戏
}

/**
 * 错误提示
 * 如果用户在小游戏界面 收到了TipsID_Close TipsID_Nobet TipsID_Maintenance TipsID_InvalidChair 服务器会同时踢出玩家
 * 如果界面打开了  注意要关闭界面 走登出流程
 */
export enum LUCKY3PT_TIPS_ID {
    close = 0,                         // 游戏维护
    full,                              // 游戏爆满
    inVaildJettonScore,               // 非法下注金额
    inVaildJettonArea,                // 非法下注区域
    notEnoughGold,                    // 金币不足
    notEnoughReatin,	                // 下注保留金不足
    rechargeLimit,		                // 充值限制
    nobet,				                // 长时间未下注踢出
    maintenance,		                // 游戏维护
    invalidChair,                      // 无效椅子号
    areaScoreLimit,                   // 区域下注限制
    totalScoreLimit,                  // 桌面总注限制
    lockGame,                         // 正在游戏中
}

// 牌型
export enum LUCKY3PT_CARDTYPE {
    none = -1,
    set = 0,                             // 三条 
    pure,                                // 同花顺
    seq,                                 // 顺子
    color,                               // 同花
    pair,                                // 对子 
    high,                                // 高牌          
}



export const LUCKY3PT_CARDTYPE_NAME = ["set", "pure", "seq", "color", "pair", "high"];
export const LUCKY3PT_CARDTYPE_NAME_LEN = ["SET", "PURE SEQ", "SEQ", "COLOR", "PAIR", "HIGH CARD"];

// 下注区域
export enum LUCKY3PT_AREA_ID {
    set = 0,                             // 三条 
    pure,                                // 同花顺
    seq,                                 // 顺子
    color,                               // 同花
    pair,                                // 对子 
    high,                                // 高牌          
}

export const isNull = <T>(object_: T): boolean => {
    if (!object_ || Object.keys(object_).length == 0) {
        return true;
    }
    return false;
}


// 判断是否为数组
const isArr = <T>(origin: T): boolean => {
    let str = '[object Array]'
    return Object.prototype.toString.call(origin) == str ? true : false
}


export const deepCopy = <T>(origin: T, target?: Record<string, any> | T): T => {
    let tflag = isArr(origin);
    let tar;
    if (fw.isNull(target)) {
        if (tflag) {
            tar = [];
        } else {
            tar = {};
        }
    } else {
        tar = target;
    }

    for (const key in origin) {
        if (Object.prototype.hasOwnProperty.call(origin, key)) {
            if (typeof origin[key] === 'object' && typeof origin[key] !== null) {
                tar[key] = isArr(origin[key]) ? [] : {}
                deepCopy(origin[key], tar[key])
            } else {
                tar[key] = origin[key]
            }
        }
    }
    return tar as T
}