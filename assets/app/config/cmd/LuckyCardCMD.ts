export enum NEW_ONEYUAN_GIFT_STATE {
    emOneYuanUnReceive = 0,// 未领取
    emOneYuanSureReceive = 1,// 可以领取
    emOneYuanReceive = 2,// 已领取
    emOneYuanTimeOut = 3,// 过期
}

export enum LUCKCARD {
    LUCKCARD_DAY_CARD = 1,		//日卡
    LUCKCARD_WEEK_CARD = 2,		//周卡
    LUCKCARD_MONTH_CARD = 3,	//月卡
    //以后拓展：季卡，半年卡，年卡等
}