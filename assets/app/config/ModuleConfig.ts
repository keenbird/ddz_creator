// 请保证唯一性
export const MODULE_NAME = {
    device : "device",
    bugly : "bugly",
    adjust : "adjust",
    facebook : "facebook",
    leo : "leo",
}


export enum COMPILATION_SDKTYPE {
    DEFAULT = 0,
    LEO = 1,
    BG = 2,
    VDM = 3,
    AWGP = 4,
    AWSDK = 5,
    LEOIOS = 6,
}

export enum PAY_MODE {
    PAY_MODE_NOR, // 正常支付购买金币
    PAY_MODE_DIAMONDS,// 支付购买钻石
    PAY_MODE_DIAMONDS_CALLBACK,// 支付购买钻石后用钻石兑换后续流程
}