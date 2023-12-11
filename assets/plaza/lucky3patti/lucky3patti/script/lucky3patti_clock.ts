import { _decorator, Node as ccNode, Label, sp, Sprite, SpriteFrame } from 'cc';
import { EVENT_ID } from '../../../../app/config/EventConfig';
import { LUCKY3PT_CARDTYPE_NAME_LEN, LUCKY3PT_GAME_STATE } from '../../const';
import { lucky3pt } from './model/desk';
const { ccclass } = _decorator;

@ccclass('lucky3patti_clock')
export class lucky3patti_clock extends (fw.FWComponent) {
    private m_desk: lucky3pt.DeskBean;
    private m_clock: number;
    private m_timestamp: number;

    initData() {
        this.m_clock = 0;
        this.m_timestamp = 0;
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

        this.Items.sp_clock.obtainComponent(sp.Skeleton).setCompleteListener(() => {
            if (LUCKY3PT_GAME_STATE.playing == this.m_desk.getGameState()) {
                this.playClock(this.m_desk.getLeaveTime());
            }
        });
    }
    initView() {
        this.reset();
        if (LUCKY3PT_GAME_STATE.playing == this.m_desk.getGameState()) {
            this.changeEvent(1);
        } else {
            var tpath = `lucky3patti/lucky3patti/img/common/${this.m_desk.getResultData().nWinArea + 1}/spriteFrame`;
            this.Items.sprite_titlebg.loadBundleRes(fw.BundleConfig.plaza.res[tpath],(res) => {
                this.Items.sprite_titlebg.obtainComponent(Sprite).spriteFrame = res as SpriteFrame;
            });
            this.Items.label_title.obtainComponent(Label).string = LUCKY3PT_CARDTYPE_NAME_LEN[this.m_desk.getResultData().nWinArea];
        }
    }
    update(dt): void {
        this.updateClock();
    }
    public setData<T>(data_: T): void {
        this.m_desk = data_["deskBean"];
    }

    private onGameStart<T, U>(cmd_: T, param_: U): void {
        this.reset();
        this.changeEvent(3);
    }
    private onGameBalancePre<T, U>(cmd_: T, param_: U): void {
        this.changeEvent(4);
        var tpath = `lucky3patti/lucky3patti/img/common/${this.m_desk.getResultData().nWinArea + 1}/spriteFrame`;
        this.Items.sprite_titlebg.loadBundleRes(fw.BundleConfig.plaza.res[tpath],(res) => {
            this.Items.sprite_titlebg.obtainComponent(Sprite).spriteFrame = res as SpriteFrame;
        });
        this.Items.label_title.obtainComponent(Label).string = LUCKY3PT_CARDTYPE_NAME_LEN[this.m_desk.getResultData().nWinArea];
    }
    private updateClock(): void {
        let ttime: number = this.m_clock - (app.func.time() - this.m_timestamp);
        if (LUCKY3PT_GAME_STATE.playing == this.m_desk.getGameState()) {
            if (0 < ttime) {
                this.Items.label_title.obtainComponent(Label).string = `Betting: ${app.func.formatNumberForZore(ttime)}s`;
            }
        }
        // this.m_nodeClock.active = time > 0;6
    }

    public changeEvent(event_: number): void {
        switch (event_) {
            case 1:
                this.reset();
                if (LUCKY3PT_GAME_STATE.playing == this.m_desk.getGameState()) {
                    this.playClock(this.m_desk.getLeaveTime());
                }
                break;
            case 2:
                this.reset();
                break;
            case 3:
                this.playStartEndAnim(true);
                break;
            case 4:
                this.m_clock = 0;
                this.playStartEndAnim(false);
                break;
        }
    }

    private playClock(clock_: number): void {
        this.m_timestamp = app.func.time();
        this.m_clock = Math.max(0, clock_);
        this.updateClock();
    }

    //播放开始动画
    private playStartEndAnim(flag_: boolean): void {
        this.Items.sp_clock.active = true;
        this.Items.sp_clock.obtainComponent(sp.Skeleton).loop = false;
        if (flag_) {
            this.Items.sp_clock.obtainComponent(sp.Skeleton).animation = "start";
        } else {
            this.Items.sp_clock.obtainComponent(sp.Skeleton).animation = "end";
        }
    }
    private reset(): void {
        this.playClock(0);
        this.Items.label_title.obtainComponent(Label).string = "Waiting";
        this.Items.sp_clock.active = false;
        var tpath = `lucky3patti/lucky3patti/img/common/${0}/spriteFrame`;
        this.Items.sprite_titlebg.loadBundleRes(fw.BundleConfig.plaza.res[tpath],(res) => {
            this.Items.sprite_titlebg.obtainComponent(Sprite).spriteFrame = res as SpriteFrame;
        });
    }

}