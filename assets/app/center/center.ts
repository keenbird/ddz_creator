import { _decorator } from "cc";
const { ccclass } = _decorator;


import { LoginCenter } from "./loginCenter";
import { UserCenter } from "./userCenter";
import { PlazaCenter } from "./plazaCenter";
import { GatewayCenter } from "./gatewayCenter";

import { GameCenter } from "./game/gameCenter";

import { tipsCenter } from "./plaza/tipsCenter";
import { TaskCenter } from "./plaza/taskCenter";
import { emailCenter } from "./plaza/emailCenter";
import { goodsCenter } from "./plaza/goodsCenter";
import { activityCenter } from "./plaza/activityCenter";
import { RoomListCenter } from "./plaza/roomListCenter";
import { LuckyCardCenter } from "./plaza/luckyCardCenter";
import { wheelManager } from "./plaza/wheelManager";
import { choujiangManager } from "./plaza/choujiangManager";
import { shareCenter } from "./plaza/shareCenter";
import { mallCenter } from "./plaza/mallCenter";
import { taskActiveCenter } from "./plaza/taskActiveCenter";
import { exchangeCenter } from "./plaza/exchangeCenter";
import { rankCenter } from "./plaza/rankCenter";
import { chatCenter } from "./plaza/chatCenter";
import { giftBagCenter } from "./plaza/giftBagCenter";

@ccclass('CenterManager')
export class CenterManager extends (fw.FWComponent) {
    //???
    user: UserCenter
    plaza: PlazaCenter
    login: LoginCenter
    gateway: GatewayCenter
    //game
    game: GameCenter
    //plaza
    tips: tipsCenter
    task: TaskCenter
    goods: goodsCenter
    email: emailCenter
    activity: activityCenter
    roomList: RoomListCenter
    luckyCard: LuckyCardCenter
    jeckpotdraw: wheelManager
    luckdraw: choujiangManager
    share: shareCenter
    mall: mallCenter
    taskActive: taskActiveCenter
    exchange: exchangeCenter
    rank: rankCenter
    chat: chatCenter
    giftBag: giftBagCenter
    /**初始化 */
    onLoad() {
        globalThis.center = this;
        //???
        this.user = this.obtainComponent(UserCenter);
        this.plaza = this.obtainComponent(PlazaCenter);
        this.login = this.obtainComponent(LoginCenter);
        this.gateway = this.obtainComponent(GatewayCenter);
        //game
        this.game = this.obtainComponent(GameCenter);
        //plaza
        this.tips = this.obtainComponent(tipsCenter);
        this.task = this.obtainComponent(TaskCenter);
        this.goods = this.obtainComponent(goodsCenter);
        this.email = this.obtainComponent(emailCenter);
        this.activity = this.obtainComponent(activityCenter);
        this.roomList = this.obtainComponent(RoomListCenter);
        this.luckyCard = this.obtainComponent(LuckyCardCenter);
        this.jeckpotdraw = this.obtainComponent(wheelManager);
        this.luckdraw = this.obtainComponent(choujiangManager);
        this.share = this.obtainComponent(shareCenter);
        this.chat = this.obtainComponent(chatCenter)
        this.mall = this.obtainComponent(mallCenter);
        this.taskActive = this.obtainComponent(taskActiveCenter);
        this.exchange = this.obtainComponent(exchangeCenter);
        this.rank = this.obtainComponent(rankCenter);
        this.giftBag = this.obtainComponent(giftBagCenter);
    }
}

declare global {
    namespace globalThis {
        var center: CenterManager
    }
}