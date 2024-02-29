import { Animation, Label, Sprite, Tween, UITransform, _decorator, Node as ccNode, tween } from 'cc';
const { ccclass } = _decorator;

import { yx } from '../../../yx_AB';
import proto from './../../../protobuf/ab_format';
import { ACTOR, PROTO_ACTOR } from '../../../../../app/config/cmd/ActorCMD';
import { EVENT_ID } from '../../../../../app/config/EventConfig';
import { DF_RATE } from '../../../../../app/config/ConstantConfig';
import { FWSpine } from '../../../../../app/framework/extensions/FWSpine';
import { player_GameBase } from '../../../../GameBase/ui/main/script/player_GameBase';

@ccclass('player_AB')
export class player_AB extends player_GameBase {
    /**通过客户端位置获取当前玩家易变属性 */
    actorByClientChairID: { [nClientChairID: number]: any } = {}
    protected initView(): boolean | void {
        //初始化玩家
        this.initPlayer();
    }
    protected initEvents(): boolean | void {
        //玩家金币金币变更
        this.bindEvent({
            eventName: PROTO_ACTOR[PROTO_ACTOR.UAT_GOLD],
            callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam) => {
                //刷新自身金币
                this.updateOnePlayer(yx.internet.nSelfChairID);
            }
        });
        //自己进入桌子
        this.bindEvent({
            eventName: [
                `GameReconnectRoom`,
                EVENT_ID.EVENT_PLAY_ACTOR_SELFONTABLE,
                yx.internet.cmd[yx.internet.cmd.MSG_RECONNECT_S],
            ],
            callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam): boolean | void => {
                //清理定时器
                this.unscheduleAllCallbacks();
                //刷新所有玩家
                this.updateAllPlayers();
            },
        });
        //其它玩家进入桌子
        this.bindEvent({
            eventName: EVENT_ID.EVENT_PLAY_ACTOR_ONTABLE,
            callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam): boolean | void => {
                this.updateOnePlayer(arg1.dict.nChairID);
            },
        });
        //离开桌子
        this.bindEvent({
            eventName: EVENT_ID.EVENT_PLAY_ACTOR_OUTTABLE,
            callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam): boolean | void => {
                this.updateOnePlayer(arg1.dict.nChairID);
            },
        });
    }
    initPlayer() {
        //默认隐藏所有玩家
        for (let i = 0; i < 10; ++i) {
            const player = this.Items[`Node_player_${i}`];
            if (player) {
                player.active = false;
                player.Items.Node_head.onClickAndScale(() => {
                    //自己不处理
                    if (i == yx.func.getClientChairIDByServerChairID(yx.internet.nSelfChairID)) {
                        return;
                    }
                    //存在玩家时处理
                    let playerInfo = this.actorByClientChairID[i];
                    if (!playerInfo) {
                        return;
                    }
                    this.showEmojiView({ nUserID: playerInfo[PROTO_ACTOR.UAT_UID] });
                });
            }
        }
        //刷新所有玩家
        this.updateAllPlayers();
    }
    clearOneGame() {
        //隐藏操作状态
        this.setStateVisible(null, false);
        //隐藏区域亮框
        this.setChipWinVisible(null, false);
        //隐藏区域下注筹码
        this.setAreaChipVisible(null, false);
        //隐藏所有倒计时
        this.setCountdownVisible(null, false);
        //隐藏部分简单界面
        for (let nChairID = 0, j = yx.internet.nMaxPlayerCount; nChairID < j; ++nChairID) {
            const player = this.getPlayerNode({ nChairID: nChairID });
            if (player) {
                player.Items.Node_win.active = false;
                player.Items.Node_win_xia.active = false;
                player.Items.Node_win_shang.active = false;
                player.Items.Node_state_skip.active = false;
            }
        }
    }
    /**刷新所有玩家 */
    updateAllPlayers() {
        gameCenter.user.getActors().forEach(element => {
            this.updateOnePlayer(element.chairID);
        });
    }
    /**刷新一个玩家 */
    updateOnePlayer(nServerChairID: number) {
        if (!yx.internet.isUserCenter()) {
            return;
        }
        const nClientChairID = yx.func.getClientChairIDByServerChairID(nServerChairID);
        const player = this.Items[`Node_player_${nClientChairID}`];
        if (player) {
            const playerInfo = gameCenter.user.getPlayerInfoByChairID(nServerChairID);
            this.actorByClientChairID[nClientChairID] = playerInfo;
            if (playerInfo) {
                player.active = true;
                //名称
                player.Items.Label_name.string = `${playerInfo.szName}`;
                player.Items.Label_name.active = nServerChairID != yx.internet.nSelfChairID;
                //金币
                if (nServerChairID == yx.internet.nSelfChairID) {
                    player.Items.Label_chip.string = `${(playerInfo[PROTO_ACTOR.UAT_GOLD] - yx.internet.nJettonScore) / DF_RATE}`;
                } else {
                    player.Items.Label_chip.string = `${playerInfo[PROTO_ACTOR.UAT_GOLD] / DF_RATE}`;
                }
                player.Items.Node_chip.active = nServerChairID == yx.internet.nSelfChairID;
                //头像
                app.file.updateHead({
                    node: player.Items.Sprite_head,
                    serverPicID: playerInfo.szMD5FaceFile,
                });
            } else {
                player.active = false;
            }
        }
    }
    /**设置倒计时 */
    setCountdownVisible(nChairID: number, bVisible: boolean, nTime?: number) {
        let func = (nChairIDEx: number) => {
            const player = this.getPlayerNode({ nChairID: nChairIDEx });
            if (player) {
                const bNewVisible = bVisible && yx.internet.playerState[nChairIDEx] != yx.config.PlayerStates.TimeOut;
                player.Items.Sprite_timer.active = bNewVisible;
                Tween.stopAllByTarget(player.Items.Sprite_timer);
                const sprite = player.Items.Sprite_timer.obtainComponent(Sprite);
                sprite.unschedule((<any>sprite).updateSurplusTimerFunc);
                if (bNewVisible) {
                    //-1的目的是服务器计时器会更早开始
                    const nNewTime = nTime - 1;
                    const nWarmTime = 4;
                    let nOldTime = nNewTime;
                    const nMaxTime = nNewTime;
                    const nStartTimer = app.func.millisecond();
                    if (nMaxTime <= nWarmTime) {
                        if (nChairIDEx == yx.internet.nSelfChairID) {
                            app.audio.playEffect(app.game.getRes(`audio/timeDown`));
                        }
                        player.Items.Sprite_timer.updateSpriteSync(app.game.getRes(`ui/main/img/atlas/profile_glow_red/spriteFrame`));
                    } else {
                        player.Items.Sprite_timer.updateSpriteSync(app.game.getRes(`ui/main/img/atlas/profile_glow/spriteFrame`));
                    }
                    (<any>sprite).updateSurplusTimerFunc = (dt: number) => {
                        const nLeftTime = Math.max(nNewTime - (app.func.millisecond() - nStartTimer) / 1000, 0);
                        sprite.fillRange = nLeftTime / nMaxTime;
                        //暂停倒计时
                        nLeftTime == 0 && sprite.unschedule((<any>sprite).updateSurplusTimerFunc);
                        //音效
                        if (nOldTime >= nWarmTime && nLeftTime <= nWarmTime) {
                            if (nChairIDEx == yx.internet.nSelfChairID) {
                                app.audio.playEffect(app.game.getRes(`audio/timeDown`));
                            }
                            player.Items.Sprite_timer.updateSpriteSync(app.game.getRes(`ui/main/img/atlas/profile_glow_red/spriteFrame`));
                        }
                        nOldTime = nLeftTime;
                    }
                    sprite.schedule((<any>sprite).updateSurplusTimerFunc);
                }
            }
        }
        if (fw.isNull(nChairID)) {
            for (let k = 0, j = yx.internet.nMaxPlayerCount; k < j; ++k) {
                func(k);
            }
        } else {
            func(nChairID);
        }
    }
    /**筹码亮框 */
    setChipWinVisible(nChairID: number, bVisible: boolean, nJettonArea?: number) {
        let func = (nChairIDEx: number) => {
            const player = this.getPlayerNode({ nChairID: nChairIDEx });
            if (player) {
                let bNewVisible = bVisible;
                if (bNewVisible) {
                    let nValue = 0;
                    if (nJettonArea == yx.config.JettonArea.BTN_BETA) {
                        nValue = app.func.toNumber(player.Items.Label_a.string);
                        player.Items.Sprite_light.setPosition(player.Items.Node_chip_a.position);
                    } else {
                        nValue = app.func.toNumber(player.Items.Label_b.string);
                        player.Items.Sprite_light.setPosition(player.Items.Node_chip_b.position);
                    }
                    //调整显隐状态
                    bNewVisible = nValue > 0;
                }
                player.Items.Sprite_light.active = bNewVisible;
                Tween.stopAllByTarget(player.Items.Sprite_light);
                if (bNewVisible) {
                    tween(player.Items.Sprite_light)
                        .hide()
                        .delay(0.25)
                        .show()
                        .delay(0.25)
                        .union()
                        .repeat(5)
                        .start();
                }
            }
        }
        if (fw.isNull(nChairID)) {
            for (let k = 0, j = yx.internet.nMaxPlayerCount; k < j; ++k) {
                func(k);
            }
        } else {
            func(nChairID);
        }
    }
    /**播放加注动画 */
    playAddChipAnim(nChairID: number, data: proto.game_ab.IMSG_BET_S) {
        const player = this.getPlayerNode({ nChairID: nChairID });
        if (player) {
            const str = data.nJettonArea == yx.config.JettonArea.BTN_BETA ? `a` : `b`;
            const n = player.Items[`Node_chip_${str}`].clone();
            n.parent = yx.main.viewZOrderNode[yx.main.viewZOrder.Anim];
            n.Items[`Node_arrow_${str}`].active = false;
            n.active = true;
            n.Items[`Label_${str}`].string = `${data.nJettonScore / DF_RATE}`;
            const nOld = app.func.toNumber(player.Items[`Label_${str}`].string);
            //音效
            app.audio.playEffect(app.game.getRes(`audio/placeabet`));
            tween(n)
                .set({ worldPosition: player.Items.Node_chip_ab.worldPosition })
                .to(0.25, { worldPosition: player.Items[`Node_chip_${str}`].worldPosition })
                .call(() => {
                    n.removeFromParent(true);
                    player.Items[`Label_${str}`].string = `${nOld + data.nJettonScore / DF_RATE}`;
                    if (nOld > 0) {
                        player.Items[`Node_arrow_${str}`].active = true;
                        const a = player.Items[`Node_arrow_${str}`].getComponent(Animation);
                        a.on(Animation.EventType.FINISHED, () => {
                            a.off(Animation.EventType.FINISHED);
                            a.on(Animation.EventType.FINISHED, () => {
                                a.off(Animation.EventType.FINISHED);
                                a.on(Animation.EventType.FINISHED, () => {
                                    a.off(Animation.EventType.FINISHED);
                                    a.play(`animation2`);
                                });
                                a.play(`animation1`);
                            });
                            a.play(`animation0`);
                        });
                        a.play(`animation0`);
                    }
                })
                .start();
        }
        this.setStateVisible(nChairID, true, data.nJettonArea);
    }
    /**播放赢筹码动画 */
    playLoseChipAnim(nChairID: number, nJettonArea: number, callback?: Function) {
        let func = (nChairIDEx: number) => {
            const player = this.getPlayerNode({ nChairID: nChairIDEx });
            if (player) {
                const bA = nJettonArea == yx.config.JettonArea.BTN_BETA;
                const n = new ccNode();
                n.parent = yx.main.viewZOrderNode[yx.main.viewZOrder.Anim];
                n.obtainComponent(Sprite);
                n.obtainComponent(UITransform);
                n.updateSprite(app.game.getRes(`ui/main/img/atlas/${bA ? `AB_biaoqian_B1` : `AB_biaoqian_A1`}/spriteFrame`));
                const l = new ccNode;
                l.parent = n;
                l.setPosition(fw.v3(8, 0, 0));
                const label = l.obtainComponent(Label);
                label.color = app.func.color(`#FFFD45`);
                const t = bA ? player.Items.Label_b : player.Items.Label_a;
                label.string = `${app.func.numberAccuracy(app.func.toNumber(t.string))}`;
                label.fontSize = 20;
                t.string = ``;
                //赢筹码动画
                const c = bA ? player.Items.Node_chip_b : player.Items.Node_chip_a;
                //音效
                app.audio.playEffect(app.game.getRes(`audio/placeabet`));
                tween(n)
                    .set({ worldPosition: c.worldPosition })
                    .to(0.35, { worldPosition: this.Items.Node_beauty.worldPosition })
                    .call(() => {
                        n.removeFromParent(true);
                        callback?.();
                    })
                    .start();
            } else {
                callback?.();
            }
        }
        if (fw.isNull(nChairID)) {
            for (let k = 0, j = yx.internet.nMaxPlayerCount; k < j; ++k) {
                func(k);
            }
        } else {
            func(nChairID);
        }
    }
    /**播放赢筹码动画 */
    playWinChipAnim(nChairID: number, nJettonArea: number, nValue: number, callback?: Function) {
        let func = (nChairIDEx: number) => {
            const player = this.getPlayerNode({ nChairID: nChairIDEx });
            if (player) {
                const bA = nJettonArea == yx.config.JettonArea.BTN_BETA;
                const n = new ccNode();
                n.parent = yx.main.viewZOrderNode[yx.main.viewZOrder.Anim];
                n.obtainComponent(Sprite);
                n.obtainComponent(UITransform);
                n.updateSprite(app.game.getRes(`ui/main/img/atlas/${bA ? `AB_biaoqian_A1` : `AB_biaoqian_B1`}/spriteFrame`));
                const l = new ccNode;
                l.parent = n;
                l.setPosition(fw.v3(8, 0, 0));
                const label = l.obtainComponent(Label);
                label.color = app.func.color(`#FFFD45`);
                const t = bA ? player.Items.Label_a : player.Items.Label_b;
                label.string = `${app.func.numberAccuracy(nValue / DF_RATE)}`;
                label.fontSize = 20;
                //赢筹码动画
                const c = bA ? player.Items.Node_chip_a : player.Items.Node_chip_b;
                const nJettonScore = app.func.toNumber(t.string);
                //音效
                app.audio.playEffect(app.game.getRes(`audio/placeabet`));
                tween(n)
                    .set({ worldPosition: this.Items.Node_beauty.worldPosition })
                    .to(0.35, { worldPosition: c.worldPosition })
                    .delay(0.5)
                    .call(() => {
                        //调整筹码数值
                        label.string = `${app.func.numberAccuracy(nValue / DF_RATE + nJettonScore)}`;
                        //清理下注值
                        t.string = ``;
                    })
                    .to(0.35, { worldPosition: player.worldPosition })
                    .call(() => {
                        //赢金动画
                        player.Items.Node_win_xia.active = true;
                        player.Items.Node_win_xia.obtainComponent(FWSpine).setAnimation(0, `xia`, true);
                        player.Items.Node_win_shang.active = true;
                        player.Items.Node_win_shang.obtainComponent(FWSpine).setAnimation(0, `shang`, false);
                        //下一个动作
                        callback?.();
                    })
                    .hide()
                    .call(() => {
                        if (nChairIDEx == yx.internet.nSelfChairID) {
                            app.audio.playEffect(app.game.getRes(`audio/winner`));
                        }
                        //飘分动画
                        player.Items.Label_win.string = `+${app.func.numberAccuracy(nValue / DF_RATE + nJettonScore)}`;
                        let node = player.Items.Node_win;
                        node.__initPos ??= node.getPosition();
                        node.setPosition(node.__initPos);
                        Tween.stopAllByTarget(node);
                        node.active = true;
                        tween(node)
                            .show()
                            .by(0.5, { position: fw.v3(0, 35, 0).clone() })
                            .delay(2.0)
                            .hide()
                            .start();
                    })
                    .delay(2.0)
                    .call(() => {
                        n.removeFromParent(true);
                        //标记完成
                        yx.internet.setTriggerMessageVisible(true);
                    })
                    .start();
            } else {
                callback?.();
            }
        }
        if (fw.isNull(nChairID)) {
            for (let k = 0, j = yx.internet.nMaxPlayerCount; k < j; ++k) {
                func(k);
            }
        } else {
            func(nChairID);
        }
    }
    /**设置区域筹码 */
    setAreaChipVisible(nChairID: number, bVisible: boolean, data?: proto.game_ab.IMSG_BET_S & { bAnim?: boolean }) {
        let func = (nChairIDEx: number) => {
            const player = this.getPlayerNode({ nChairID: nChairIDEx });
            if (player) {
                player.Items.Node_chip_ab.active = bVisible;
                if (bVisible && !fw.isNull(data)) {
                    if (data.nJettonScore > 0) {
                        switch (data.nJettonArea) {
                            case yx.config.JettonArea.BTN_BETA:
                                if (data.bAnim) {
                                    this.playAddChipAnim(nChairIDEx, data);
                                } else {
                                    player.Items.Label_a.string = `${data.nJettonScore / DF_RATE}`;
                                    this.setStateVisible(nChairID, true, yx.config.JettonArea.BTN_BETA);
                                }
                                break;
                            case yx.config.JettonArea.BTN_BETB:
                                if (data.bAnim) {
                                    this.playAddChipAnim(nChairIDEx, data);
                                } else {
                                    player.Items.Label_b.string = `${data.nJettonScore / DF_RATE}`;
                                    this.setStateVisible(nChairID, true, yx.config.JettonArea.BTN_BETB);
                                }
                                break;
                            default:
                                this.setStateVisible(nChairID, true, yx.config.JettonArea.BTN_SKIP);
                                break;
                        }
                    } else {
                        this.setStateVisible(nChairID, true, yx.config.JettonArea.BTN_SKIP);
                    }
                } else {
                    player.Items.Label_a.string = ``;
                    player.Items.Label_b.string = ``;
                    player.Items.Node_arrow_a.active = false;
                    player.Items.Node_arrow_b.active = false;
                }
            }
        }
        if (fw.isNull(nChairID)) {
            for (let k = 0, j = yx.internet.nMaxPlayerCount; k < j; ++k) {
                func(k);
            }
        } else {
            func(nChairID);
        }
    }
    /**设置操作状态 */
    setStateVisible(nChairID: number, bVisible: boolean, nState?: number) {
        let func = (nChairIDEx: number) => {
            const player = this.getPlayerNode({ nChairID: nChairIDEx });
            if (player) {
                if (bVisible) {
                    switch (nState) {
                        case yx.config.JettonArea.BTN_BETA:
                            player.Items.Node_state.active = true;
                            player.Items.Label_state.string = fw.language.get(`ANDAR`);
                            player.Items.Sprite_state.updateSprite(app.game.getRes(`ui/main/img/atlas/AB_zt_lv/spriteFrame`));
                            break;
                        case yx.config.JettonArea.BTN_BETB:
                            player.Items.Node_state.active = true;
                            player.Items.Label_state.string = fw.language.get(`BAHAR`);
                            player.Items.Sprite_state.updateSprite(app.game.getRes(`ui/main/img/atlas/AB_zt_hong/spriteFrame`));
                            break;
                        case yx.config.JettonArea.BTN_SKIP:
                            player.Items.Node_state.active = true;
                            player.Items.Label_state.string = fw.language.get(`SKIP`);
                            player.Items.Sprite_state.updateSprite(app.game.getRes(`ui/main/img/atlas/AB_zt_lan/spriteFrame`));
                            break;
                        default:
                            break;
                    }
                } else {
                    player.Items.Node_state.active = false;
                }
            }
        }
        if (fw.isNull(nChairID)) {
            for (let k = 0, j = yx.internet.nMaxPlayerCount; k < j; ++k) {
                func(k);
            }
        } else {
            func(nChairID);
        }
    }
    /**刷新玩家状态 */
    updatePlayerState(nChairID: number, nState?: number) {
        let func = (nChairIDEx: number) => {
            const player = this.getPlayerNode({ nChairID: nChairIDEx });
            if (player) {
                switch (nState) {
                    case yx.config.PlayerStates.Free:
                        break;
                    case yx.config.PlayerStates.Join:
                        break;
                    case yx.config.PlayerStates.Play:
                        break;
                    case yx.config.PlayerStates.TimeOut:
                        player.Items.Node_state_skip.active = true;
                        break;
                    default:
                        break;
                }
                //是否是自己
                if (nChairID == yx.internet.nSelfChairID) {
                    this.Items.Sprite_trusteeship.active = nState == yx.config.PlayerStates.TimeOut;
                }
            }
        }
        if (fw.isNull(nChairID)) {
            for (let k = 0, j = yx.internet.nMaxPlayerCount; k < j; ++k) {
                func(k);
            }
        } else {
            func(nChairID);
        }
    }
    /**获取对应节点位置，nChairID指服务器玩家座位号 */
    getPlayerNode(data: GetPlayerNodeParam): ccNode {
        let playerNode: ccNode;
        //传入了nUserID
        if (!fw.isNull(data.nUserID)) {
            const actor = gameCenter.user.getActorByDBIDEx(data.nUserID);
            if (actor) {
                data.nChairID = actor.chairID;
            }
        }
        //传入了nChairID
        if (!fw.isNull(data.nChairID)) {
            let nClientChairID: number;
            if (data.nChairID < yx.internet.nMaxPlayerCount) {
                nClientChairID = yx.func.getClientChairIDByServerChairID(data.nChairID);
            } else {
                nClientChairID = data.nChairID + 1;
            }
            playerNode = this.Items[`Node_player_${nClientChairID}`];
            if (playerNode) {
                return playerNode;
            }
        }
        return data.defaultNode;
    }
}