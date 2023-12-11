declare interface keys {
    [`测试内网`],
    [`Play as Mobile`],

    // 广播配置
    broadcast_msg_1,
    broadcast_msg_2,
    broadcast_msg_3,
    broadcast_msg_4,
}

/**多语言key全集，用于提示 */
declare type LanguageKeys = {
    [key in keyof keys]: string
}