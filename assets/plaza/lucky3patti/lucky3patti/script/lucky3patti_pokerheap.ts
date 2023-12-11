import { _decorator, Node as ccNode, Label, sp, v2, Vec2, Vec3, v3, tween } from 'cc';
import { EVENT_ID } from '../../../../app/config/EventConfig';
import { LUCKY3PT_GAME_STATE } from '../../const';
import { lucky3patti_poker } from './lucky3patti_poker';
import { lucky3pt } from './model/desk';
const { ccclass, property } = _decorator;

@ccclass('lucky3patti_pokerheap')
export class lucky3patti_pokerheap extends (fw.FWComponent) {
    private m_desk: lucky3pt.DeskBean;
    @property([ccNode])
    private m_pokers: lucky3patti_poker[] = [];
    private m_bankerPos: Vec2[];
    private m_otherPos: Vec2[];
    private m_otherRatiaon: Vec3;

    initData() {
        this.m_bankerPos = [v2(-120, 0), v2(0, 0), v2(120, 0)];
        this.m_otherPos = [v2(-32.60, -3), v2(0, 0), v2(-32.60, 3)];
        this.m_otherRatiaon = v3(-18, 0, 18);

    }
    initEvents() {
        var teventsData = [
            { event: EVENT_ID.EVENT_LUCKY3PATTI_START, callback: this.onGameStart.bind(this) },
            { event: EVENT_ID.EVENT_LUCKY3PATTI_BALANCE_PRE, callback: this.onGameBalancePre.bind(this) },
        ];
        teventsData.forEach(element => {
            this.bindEvent(
                {
                    eventName: element.event,
                    callback: <T>(data: T) => {
                        if (element.callback) {
                            element.callback(element.event, data["dict"]);
                        }
                    }
                }
            );
        });
    }
    initView() {
        this.reset();
        if (LUCKY3PT_GAME_STATE.free == this.m_desk.getGameState()) {
            this.setCard(this.m_desk.getHeapcard());
            for (var i = 0; i < 3; ++i) {
                this.m_pokers[i].obtainComponent(lucky3patti_poker).node.setPosition(this.m_bankerPos[i].x, this.m_bankerPos[i].y);
                this.m_pokers[i].obtainComponent(lucky3patti_poker).showBackView(false);
                this.m_pokers[i].obtainComponent(lucky3patti_poker).showDown();
            }
        } else {
            this.playDealCardsAni();
        }
    }
    public setData<T>(data_: T): void {
        this.m_desk = data_["deskBean"];
    }

    private onGameStart<T, U>(cmd_: T, param_: U): void {
        this.playDealCardsAni();
    }
    private onGameBalancePre<T, U>(cmd_: T, param_: U): void {
        this.playShowCardsAni();
    }
    public setCard(cards_: number[]): void {
        for (var i = 0; i < 3; ++i) {
            this.m_pokers[i].obtainComponent(lucky3patti_poker).updateData(cards_[i]);
        }
    }
    public reset(): void {
        for (var i = 0; i < 3; ++i) {
            this.m_pokers[i].obtainComponent(lucky3patti_poker).node.setPosition(v3(this.m_bankerPos[0].x, this.m_bankerPos[i].y));
            this.m_pokers[i].obtainComponent(lucky3patti_poker).reset();
        }
    }
    /**
     * 发牌动画
     */
    public playDealCardsAni(): void {
        let tpoker: lucky3patti_poker;
        this.reset();
        for (var i = 0; i < 3; ++i) {
            tpoker = this.m_pokers[i].obtainComponent(lucky3patti_poker);
            tpoker.dealCard(this.m_bankerPos[i].x, this.m_bankerPos[i].y, 0.1);
        }

    }
    /**
     * 展现牌动画
     */
    public playShowCardsAni(): void {
        this.setCard(this.m_desk.getHeapcard());
        for (var i = 0; i < 3; ++i) {
            this.m_pokers[i].obtainComponent(lucky3patti_poker).showBackView(false);
            this.m_pokers[i].obtainComponent(lucky3patti_poker).showDown();
        }
    }


    public setShow(isShow_: boolean = true): void {
        this.node.active = isShow_;
    }


}