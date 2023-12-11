import { _decorator, Node as ccNode, instantiate, math, ProgressBar, sp, Animation, AnimationClip, Prefab, tween, UIOpacity, Tween, Sprite, UITransform, Button } from 'cc';
const { ccclass } = _decorator;

import { yx } from '../../../yx_AB';
import { player_AB } from './player_AB';
import proto from './../../../protobuf/ab_format';
import { ACTOR } from '../../../../../app/config/cmd/ActorCMD';
import { FWSpine } from '../../../../../app/framework/extensions/FWSpine';
import { DF_RATE, DF_SYMBOL } from '../../../../../app/config/ConstantConfig';
import { main_GameBase } from '../../../../GameBase/ui/main/script/main_GameBase';

@ccclass('main_AB')
export class main_AB extends main_GameBase {
    /**筹码索引 */
    nChipIndex: number = -1
    /**player */
    player: player_AB = null
    protected initData(): boolean | void {
        //TODO
    }
    protected initView(): boolean | void {
        //刷新下注
        this.updateChipScore();
        //添加player
        this.player = this.obtainComponent(app.game.getCom(`player`));
        //清理游戏
        this.clearOneGame();
    }
    protected initEvents(): boolean | void {
        //玩家金币金币变更
        this.bindEvent({
            eventName: ACTOR[ACTOR.ACTOR_PROP_GOLD],
            callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam) => {
                this.updateChipVisible();
            }
        });
        this.bindEvent({
            eventName: `GameRule`,
            callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam): boolean | void => {
                this.updateChipScore();
            }
        });
        this.bindEvent({
            eventName: `GameReconnectRoom`,
            callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam): boolean | void => {
                //重连
                this.doReconnect(arg1.data);
            }
        });
    }
    protected initBtns(): boolean | void {
        /**Andar */
        this.Items.Node_andar.onClickAndScale(() => {
            this.onOperate(yx.config.JettonArea.BTN_BETA);
        });
        this.Items.Label_andar.string = fw.language.get(`ANDAR`);
        /**Bahar */
        this.Items.Node_bahar.onClickAndScale(() => {
            this.onOperate(yx.config.JettonArea.BTN_BETB);
        });
        this.Items.Label_bahar.string = fw.language.get(`BAHAR`);
        /**Skip */
        this.Items.Node_skip.onClickAndScale(() => {
            this.onOperate(yx.config.JettonArea.BTN_SKIP, 0);
        });
        this.Items.Label_skip.string = fw.language.get(`SKIP`);
        /**trusteeship */
        this.Items.Node_trusteeship.onClickAndScale(() => {
            yx.internet.MSG_BACK_C({});
        });
        this.Items.Label_trusteeship.string = fw.language.get(`I'm back`);
        this.Items.Label_trusteeship_tips.string = fw.language.get(`You have been put on Auto-Play for missing a turn`);
    }
    /**清理一局游戏 */
    clearOneGame() {
        //清理定时器
        this.unscheduleAllCallbacks();
        //清理所有动画节点
        this.viewZOrderNode[this.viewZOrder.Anim].removeAllChildren(true);
        //清理桌面牌
        this.updateTableCard(null, false);
        this.setOperateVisible(false, true);
        this.Items.Label_round.string = ``;
        this.Items.Node_skip.active = false;
        this.Items.Node_card_a.Items.Sprite_light.active = false;
        this.Items.Node_card_b.Items.Sprite_light.active = false;
        this.Items.Node_card_banker.Items.Sprite_light.active = false;
        //player隐藏
        this.player.clearOneGame();
    }
    /**刷新倍率动画 */
    updateMultipleAnim() {
        (<any>this).multipleState ??= 0;
        let func = (<any>this).updateMultipleAnimFunc ??= (n: ccNode) => {
            let spine = n.obtainComponent(FWSpine);
            switch (yx.internet.nGameState) {
                case yx.config.GameState.BET1:
                    app.audio.playEffect(app.game.getRes(`audio/mult`));
                    spine.setAnimation(0, `2x_`, false);
                    spine.setCompleteListener(() => {
                        spine.setCompleteListener(null);
                        spine.setAnimation(0, `2.25x`, true);
                    });
                    break;
                case yx.config.GameState.BET2:
                    spine.setAnimation(0, `2.25x_`, false);
                    spine.setCompleteListener(() => {
                        spine.setCompleteListener(null);
                        spine.setAnimation(0, `2x`, true);
                    });
                    break;
                case yx.config.GameState.END:
                    break;
                case yx.config.GameState.FREE:
                default:
                    spine.setCompleteListener(null);
                    spine.setAnimation(0, `2x`, false);
                    break;
            }
        }
        func(this.Items.Node_a.Items.Node_multiple);
        func(this.Items.Node_b.Items.Node_multiple);
    }
    /**操作 */
    onOperate(nType: number, nJettonScore?: number) {
        if (fw.isNull(nJettonScore)) {
            const gameConfig = yx.internet.gameConfig;
            if (gameConfig) {
                nJettonScore = gameConfig.nChipScore[this.nChipIndex];
            } else {
                nJettonScore = 0;
            }
        }
        const nGold = gameCenter.user.getGold();
        if (nGold - yx.internet.nJettonScore - nJettonScore < 0) {
            center.giftBag.showGiftBagDialog(() => {
                app.popup.showDialog(fw.BundleConfig.plaza.res[`shop/quickRecharge`], {
                    nRechargeNumMin: (nGold - yx.internet.nJettonScore) / DF_RATE,
                });
            });
            return;
        }
        yx.internet.MSG_BET_C({
            nJettonArea: nType,
            nJettonScore: nJettonScore,
        });
    }
    /**刷新下注 */
    updateChipScore() {
        //刷新
        let nIndex = 0;
        const gameConfig = yx.internet.gameConfig;
        const childs = this.Items.Node_chips.children;
        let nDefaultIndex = app.file.getIntegerForKey(`AB_chipIndex`, -1);
        if (gameConfig) {
            for (let i = 0, j = gameConfig.nChipScore; i < j.length; ++i) {
                const nValue = j[i];
                let item = childs[nIndex];
                if (!item) {
                    item = this.Items.Node_chip_item.clone();
                    item.parent = this.Items.Node_chips;
                }
                item.active = true;
                //缓存值不一样时才刷新
                if ((<any>item).nJettonValue != nValue) {
                    (<any>item).nJettonValue = nValue;
                    item.Items.Label_chip.string = `${nValue / DF_RATE}`;
                    item.Items.Sprite_icon.updateSprite(app.game.getRes(`ui/main/img/atlas/AB_chips_${nIndex + 1}/spriteFrame`));
                    //回调
                    item.onClickAndScale(() => {
                        if (this.nChipIndex == i) {
                            return;
                        }
                        let oldChip = childs[this.nChipIndex];
                        if (oldChip) {
                            Tween.stopAllByTarget(oldChip.Items.Sprite_icon);
                            tween(oldChip.Items.Sprite_icon)
                                .to(0.15, { position: fw.v3(0, 0, 0).clone() })
                                .start();
                        }
                        this.nChipIndex = i;
                        let newChip = childs[this.nChipIndex];
                        if (newChip) {
                            Tween.stopAllByTarget(newChip.Items.Sprite_icon);
                            tween(newChip.Items.Sprite_icon)
                                .to(0.15, { position: fw.v3(0, 10, 0).clone() })
                                .start();
                        }
                        this.Items.Sprite_chip_select.parent = newChip.Items.Sprite_icon;
                        this.Items.Sprite_chip_select.setPosition(fw.v3(0, 0, 0));
                        this.Items.Sprite_chip_select.active = true;
                        //缓存索引
                        app.file.setIntegerForKey(`AB_chipIndex`, this.nChipIndex);
                        //调整下注
                        this.Items.Label_andar_value.string = `${nValue / DF_RATE}`;
                        this.Items.Label_bahar_value.string = `${nValue / DF_RATE}`;
                    });
                }
                //是否默认选中
                if (nDefaultIndex < 0) {
                    nDefaultIndex = i;
                }
                ++nIndex;
            }
        } else {
            this.Items.Label_andar_value.string = ``;
            this.Items.Label_bahar_value.string = ``;
        }
        for (; nIndex < childs.length; ++nIndex) {
            childs[nIndex].active = false;
        }
        //没有符合条件的筹码
        if (nDefaultIndex < 0 || !gameConfig || !childs[nDefaultIndex]) {
            this.Items.Sprite_chip_select.active = false;
            this.nChipIndex = -1;
        } else {
            //默认选中
            childs[nDefaultIndex].__callback();
        }
        this.updateChipVisible();
    }
    updateChipVisible() {
        let bNeedChangChip = false;
        const nLeftGold = gameCenter.user.getGold() - yx.internet.nJettonScore;
        app.func.reverseTraversal(this.Items.Node_chips.children, (element, index) => {
            if (element.active) {
                const nJettonScore = fw.any(element).nJettonValue;
                const bVisible = !fw.isNull(nJettonScore) && (nJettonScore < nLeftGold || index == 0);
                element.getComponent(Button).enabled = bVisible;
                element.Items.Sprite_mask.active = !bVisible;
                //调整可用筹码
                if (bNeedChangChip && bVisible) {
                    bNeedChangChip = false;
                    element.__callback();
                }
                //当前不可用时需调整可用筹码
                if (this.nChipIndex == index && !bVisible) {
                    bNeedChangChip = true;
                }
            }
        })
    }
    /**发牌动画 */
    playFaPai(startNode: ccNode, targetNode: ccNode, nCardValue: number, callback?: Function) {
        const n = new ccNode();
        n.obtainComponent(UITransform);
        n.parent = this.viewZOrderNode[this.viewZOrder.Anim];
        n.obtainComponent(Sprite);
        n.updateSprite(app.game.getRes(`ui/main/img/atlas/poker_bg/spriteFrame`));
        //调整大小
        n.setScale(fw.v3(0.25));
        //调整位置
        n.setWorldPosition(startNode.worldPosition);
        app.audio.playEffect(app.game.getRes(`audio/dealcards`));
        tween(n)
            .parallel(
                //注意：这里使用了targetNode的父亲节点的放大缩小比例
                tween(n).to(0.35, { scale: targetNode.parent.scale }),
                tween(n).to(0.35, { angle: 180 }),
                tween(n).to(0.35, { worldPosition: targetNode.worldPosition }),
            )
            .delay(0.05)
            .call(() => {
                n.removeFromParent(true);
                this.updateTableCard(targetNode, true, nCardValue);
                callback?.();
            })
            .start();
    }
    /**显示区域 */
    playCardWin(nJettonArea?: number, callback?: Function) {
        const func = (<any>this).playCardWinFunc ??= (n: ccNode, bVisible: boolean, callback?: Function) => {
            n.active = bVisible;
            if (bVisible) {
                Tween.stopAllByTarget(n);
                tween(n)
                    .hide()
                    .delay(0.25)
                    .show()
                    .delay(0.25)
                    .union()
                    .repeat(5)
                    .call(() => {
                        callback?.();
                    })
                    .start();
            }
        }
        func(this.Items.Node_card_banker.Items.Sprite_light, true, () => {
            callback?.();
        });
        func(this.Items.Node_card_a.Items.Sprite_light, nJettonArea == yx.config.JettonArea.BTN_BETA);
        func(this.Items.Node_card_b.Items.Sprite_light, nJettonArea == yx.config.JettonArea.BTN_BETB);
    }
    /**刷新桌面牌 */
    updateTableCard(card?: ccNode, bVisible?: boolean, nCardValue?: number) {
        if (fw.isNull(card)) {
            this.Items.Node_card_a.active = bVisible;
            this.Items.Node_card_b.active = bVisible;
            this.Items.Node_card_banker.active = bVisible;
        } else {
            card.active = bVisible;
            yx.func.updateCard(card, nCardValue);
        }
    }
    /**刷新桌面牌 */
    setOperateVisible(bVisible: boolean, bNotAnim?: boolean) {
        Tween.stopAllByTarget(this.Items.Sprite_bottom_bg);
        if (bVisible) {
            this.updateChipVisible();
            this.Items.Sprite_bottom_bg.active = true;
            app.audio.playEffect(app.game.getRes(`audio/yourturn`));
            this.Items.Sprite_bottom_bg.__initPos ??= this.Items.Sprite_bottom_bg.getPosition();
            this.Items.Sprite_bottom_bg.setPosition(this.Items.Sprite_bottom_bg.__initPos);
        } else {
            if (bNotAnim) {
                this.Items.Sprite_bottom_bg.active = false;
            } else {
                tween(this.Items.Sprite_bottom_bg)
                    .by(0.35, { position: fw.v3(0, -200, 0) })
                    .call(() => {
                        this.Items.Sprite_bottom_bg.active = false;
                    })
                    .start();
            }
        }
    }
    MSG_GAMESCENE_S(data: proto.game_ab.IMSG_GAMESCENE_S) {
        //标记完成
        yx.internet.setTriggerMessageVisible(true);
    }
    MSG_FREE_S(data: proto.game_ab.IMSG_FREE_S) {
        //清理上一局
        this.clearOneGame();
        //刷新下注
        this.updateChipScore();
        //标记完成
        yx.internet.setTriggerMessageVisible(true);
    }
    MSG_START_S(data: proto.game_ab.IMSG_START_S) {
        //刷新倍率
        this.updateMultipleAnim();
        //刷新局数
        this.Items.Label_round.string = `${fw.language.get(`Round`)} 1/2`;
        //刷新庄家牌
        this.playFaPai(this.Items.Node_beauty, this.Items.Node_card_banker, data.uCard, () => {
            //设置区域下注
            this.player.setAreaChipVisible(null, true);
            //开启倒计时
            this.player.setCountdownVisible(null, true, data.nLeaveTime);
            //显示操作界面
            if (yx.internet.playerState[yx.internet.nSelfChairID] != yx.config.PlayerStates.TimeOut) {
                this.setOperateVisible(true);
            }
            //标记完成
            yx.internet.setTriggerMessageVisible(true);
        });
    }
    MSG_BET_S(data: proto.game_ab.IMSG_BET_S) {
        //设置区域下注
        this.player.setAreaChipVisible(data.nChairID, true, Object.assign({ bAnim: true }, data));
        //隐藏倒计时
        this.player.setCountdownVisible(data.nChairID, false);
        //隐藏操作界面
        if (data.nChairID == yx.internet.nSelfChairID) {
            this.setOperateVisible(false);
        }
        //玩家玩家信息
        this.player.updateOnePlayer(data.nChairID);
        //标记完成
        yx.internet.setTriggerMessageVisible(true);
    }
    MSG_BET_PART2_S(data: proto.game_ab.IMSG_BET_PART2_S) {
        //调整倍率
        this.updateMultipleAnim();
        //第二轮可以跳过
        this.Items.Node_skip.active = true;
        //刷新局数
        this.Items.Label_round.string = `${fw.language.get(`Round`)} 2/2`;
        //发牌
        const nodes = [
            this.Items.Node_card_a,
            this.Items.Node_card_b,
        ];
        let index = 0;
        let func = () => {
            if (index < data.uCards.length) {
                this.playFaPai(this.Items.Node_beauty, nodes[index % nodes.length], data.uCards[index], func);
                ++index;
            } else {
                //开启倒计时
                this.player.setCountdownVisible(null, true, data.nLeaveTime);
                //显示操作界面
                if (yx.internet.playerState[yx.internet.nSelfChairID] != yx.config.PlayerStates.TimeOut) {
                    this.setOperateVisible(true);
                }
                //标记完成
                yx.internet.setTriggerMessageVisible(true);
            }
        }
        func();
    }
    MSG_END_S(data: proto.game_ab.IMSG_END_S) {
        //隐藏自己的操作
        this.setOperateVisible(false);
        //发牌
        const nodes = [
            this.Items.Node_card_a,
            this.Items.Node_card_b,
        ];
        let index = 0;
        let func = () => {
            if (index < data.uCards.length) {
                this.playFaPai(this.Items.Node_beauty, nodes[index % nodes.length], data.uCards[index], func);
                ++index;
            } else {
                app.func.doPromise(resolve => {
                    //闪牌动画
                    this.playCardWin(data.nJettonArea, resolve);
                    //显示玩家赢牌区域
                    this.player.setChipWinVisible(null, true, data.nJettonArea);
                }).then(() => {
                    return app.func.doPromise(resolve => {
                        let bFirst = true;
                        //赢筹码动画
                        for (let nChairID = 0; nChairID < yx.internet.nMaxPlayerCount; ++nChairID) {
                            let nWinScore = data.nSitUserWinScore[nChairID * 2 + data.nJettonArea - 1];
                            if (nWinScore > 0) {
                                if (bFirst) {
                                    bFirst = false;
                                    this.player.playWinChipAnim(nChairID, data.nJettonArea, nWinScore, resolve);
                                } else {
                                    this.player.playWinChipAnim(nChairID, data.nJettonArea, nWinScore);
                                }
                            }
                        }
                        bFirst && resolve();
                    });
                }).then(() => {
                    return app.func.doPromise(resolve => {
                        let bFirst = true;
                        //输筹码动画
                        for (let nChairID = 0; nChairID < yx.internet.nMaxPlayerCount; ++nChairID) {
                            let nLoseScore = data.nSitUserWinScore[nChairID * 2 + data.nJettonArea % 2];
                            if (nLoseScore < 0) {
                                if (bFirst) {
                                    bFirst = false;
                                    this.player.playLoseChipAnim(nChairID, data.nJettonArea, resolve);
                                } else {
                                    this.player.playLoseChipAnim(nChairID, data.nJettonArea);
                                }
                            }
                        }
                        bFirst && resolve();
                    });
                });
            }
        }
        func();
    }
    MSG_TIPS_S(data: proto.game_ab.IMSG_TIPS_S) {
        //TODO
    }
    MSG_PLAYER_STATUS_S(data: proto.game_ab.IMSG_PLAYER_STATUS_S) {
        //刷新玩家状态
        this.player.updatePlayerState(data.nChairID, data.ucCurState);
        //自己超时
        if (data.nChairID == yx.internet.nSelfChairID && data.ucCurState == yx.config.PlayerStates.TimeOut) {
            //隐藏操作界面
            this.setOperateVisible(false, true);
        }
    }
    doReconnect(data: proto.game_ab.IMSG_RECONNECT_S) {
        //清理旧状态
        this.clearOneGame();
        //刷新倍率
        this.updateMultipleAnim();
        //刷新a牌
        this.updateTableCard(this.Items.Node_card_a, true, data.uCardData[0]);
        //刷新庄家牌
        this.updateTableCard(this.Items.Node_card_banker, true, data.uCardData[1]);
        //刷新b牌
        this.updateTableCard(this.Items.Node_card_b, true, data.uCardData[2]);
        //刷新玩家状态
        data.btSitUserState.forEach((nState: number, nChairID: number) => {
            this.player.updatePlayerState(nChairID, nState);
        });
    }
}

declare global {
    namespace globalThis {
        type type_main_AB = main_AB
    }
}
