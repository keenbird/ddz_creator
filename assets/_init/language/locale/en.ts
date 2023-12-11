import './../language'

let languageConfig: LanguageConfig = {
    ////大厅通用//began//////////////////
    [`DT_hot`]: () => { return fw.BundleConfig.plaza.res[`plaza/gameItems/img/DT_hot/spriteFrame`]; },
    [`DT_new`]: () => { return fw.BundleConfig.plaza.res[`plaza/gameItems/img/DT_new/spriteFrame`]; },
    [`plaza_addCash_txt`]: () => { return fw.BundleConfig.plaza.res[`plaza/img/plaza_addCash_txt/spriteFrame`]; },
    [`plaza_btn_withdraw_txt`]: () => { return fw.BundleConfig.plaza.res[`plaza/img/plaza_btn_withdraw_txt/spriteFrame`]; },
    [`plaza_btn_service_txt`]: () => { return fw.BundleConfig.plaza.res[`plaza/img/plaza_btn_service_txt/spriteFrame`]; },
    [`plaza_btn_activity_txt`]: () => { return fw.BundleConfig.plaza.res[`plaza/img/plaza_btn_activity_txt/spriteFrame`]; },
    [`plaza_more_txt`]: () => { return fw.BundleConfig.plaza.res[`plaza/img/plaza_more_txt/spriteFrame`]; },
    [`plaza_btn_share_txt`]: () => { return fw.BundleConfig.plaza.res[`plaza/img/plaza_btn_share_txt/spriteFrame`]; },
    [`plaza_btn_freeCash_txt`]: () => { return fw.BundleConfig.plaza.res[`plaza/img/plaza_btn_freeCash_txt/spriteFrame`]; },
    ////大厅通用//end////////////////////

    ////premium//began//////////////////
    [`premium_tips_num`]: `<color=#8e4936>Recharge <color=#f93b21>R$%s </color>or more to become a<color=#f93b21> VIP </color>player</color>`,
    [`premium_tips_num_2`]: `<color=#8e4936>Add cash <color=#f93b21>R$%s </color>now to become a<color=#f93b21> VIP2 </color>player</color>`,
    [`premium_tips_num_3`]: `<color=#8e4936>Recharge <color=#f93b21>R$%s </color>or more to become a<color=#f93b21> VIP1 </color>player</color>`,
    [`premium_tips`]: `<color=#8e4936>Recharge any amount to become a<color=#f93b21> VIP </color>player</color>`,
    [`VIP_RECHARGE_TIPS_1`]: `<color=#8e4936>Only<color=#f93b21> VIP </color>players can use this feature</color>`,
    [`VIP_RECHARGE_TIPS_2`]: `<color=#8e4936>Keep playing for real money, you need to be a VIP player</color>`,
    [`VIP_RECHARGE_TIPS_3`]: `<color=#8e4936>Only <color=#f93b21> VIP </color> players can place multiple bets</color>`,
    [`VIP_RECHARGE_TIPS_4`]: `<color=#8e4936>Only <color=#f93b21> VIP1 </color> players can make withdrawals</color>`,
    [`VIP_RECHARGE_TIPS_5`]: `<color=#8e4936>Only<color=#f93b21> VIP2 </color>players can use this feature</color>`,
    ////premium//end////////////////////
    
    ////系统广播//began//////////////////
    broadcast_msg_1:"[<color=#72ff00>[1]</color>] get [<color=#fff373>JACKPOT</color>] and win [<color=#fff373>R$[2]</color>] in [<color=#ff7315>[3]</color>]",
    broadcast_msg_2:"[<color=#72ff00>[1]</color>] winning [<color=#fff373>R$[2]</color>] in [<color=#ff7315>[3]</color>]",
    broadcast_msg_3:"[<color=[3]>[1]</color>] withdraws [<color=[4]>R$[2]</color>]",
    broadcast_msg_4:"[<color=#fd8e22>[1]</color>] recharge [<color=#fd8e22>R$[2]</color>]",
    ////系统广播//end////////////////////

    // 十天任务
    ["The event is about to end"]:"The event is about to end",
    ["Collect"]:"Collect",
    ["Total recharge R$300"]:"Total recharge R$300",
    ["Day${day}"]:"Day${day}",
    ["${day} days"]:"${day} days",
    ["Win R$300"]:"Win R$300",
    ["log into the game"]:"log into the game",
    ["Unlock tomorrow"]:"Unlock tomorrow",
    ["GO"]:"GO",
    ["Get 1 spin for every 3 tasks completed"]:"Get 1 spin for every 3 tasks completed",
    ["Also need R$300 to collect"]:"Also need R$300 to collect",
    // 刮刮卡
    ["Empty"]:"Empty",
    ["You can claim the reward once a day, up to 30 times"]:"You can claim the reward once a day, up to 30 times",
    //一套转盘
    ["<color=#ffffff>Add Cash </color><color=#FDFF2F>${DF_SYMBOL}${num} get 1 spin</color>"]:"<color=#ffffff>Add Cash </color><color=#FDFF2F>${DF_SYMBOL}${num} get 1 spin</color>",
    //vip礼包
    ["VIP GIFT"]:"VIP GIFT",
    ["<color=#ffffff>1% </color><color=#22936F>of the money you lose will become bonus for you</color>"]:"<color=#ffffff>1% </color><color=#22936F>of the money you lose will become bonus for you</color>",
    ["Daily Bonus"]:"Daily Bonus",
    ["Weekly Bonus"]:"Weekly Bonus",
    ["Monthly Bonus"]:"Monthly Bonus",
    ["Have Bonus"]:"Have Bonus",
    ["Get time"]:"Get time",
    ["UP to"]:"UP to",
    ["1 point for every ${DF_SYMBOL}1 recharge"]:"1 point for every ${DF_SYMBOL}1 recharge",
    ["Add Cash to become VIP${lv}"]:"Add Cash to become VIP${lv}",
    ["Add Cash"]:"Add Cash",
    //停服预处理提示
    ["<color=#8e4936>This game will undergo maintenance at <color=#f93b21>${STOP_TIME}</color>. You can play other games during this time.</color>"]:"<color=#8e4936>This game will undergo maintenance at <color=#f93b21>${STOP_TIME}</color>. You can play other games during this time.</color>",
}
fw.language.addLanguageConfig({
    languageType: fw.LanguageType.en,
    unique: `common_en`,
    languageConfig: languageConfig,
    npriority: fw.LanguagePriority.Common,
});

export default languageConfig
