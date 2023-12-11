import { Button, Label, Tween, tween, Node as ccNode, UITransform, v3, Vec3, _decorator } from 'cc';
const { ccclass } = _decorator;

import { ACTOR } from '../../../app/config/cmd/ActorCMD';
import { EVENT_ID } from '../../../app/config/EventConfig';
import { DF_RATE, DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('BoonusInfo')
export class BoonusInfo extends FWDialogViewBase {
    initEvents() {
        [
            {
                event: EVENT_ID.EVENT_PLAZA_ACTOR_PRIVATE,
                callback: this.viewUpdate.bind(this),
            },
            {
                event: EVENT_ID.EVENT_PLAZA_ACTOR_VARIABLE,
                callback: this.viewUpdate.bind(this),
            },
        ].forEach(element => {
            this.bindEvent(
                {
                    eventName: element.event,
                    callback: (data: any) => {
                        if (element.callback) {
                            element.callback(element.event, data["dict"]);
                        }
                    }
                }
            );
        });
    }
    initView() {
        //--多语言处理--began------------------------------------------
        //文本
        this.Items.Label_cashback_tip.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
            this.Items.Label_cashback_tip.string = {
                [fw.LanguageType.en]: 'When you lose the game, the bonus will be converted into cash at 10% of the lost amount.',
                [fw.LanguageType.brasil]: 'Quando você perde o jogo, o bônus será convertido em dinheiro a 10% do valor perdido.',
            }[fw.language.languageType];
        });
        //--多语言处理--end--------------------------------------------
        this.Items.Sprite_hand.active = false;
        this.Items.Label_cash.string = `0.00`;
        this.Items.Label_saved.string = `0.00`;
        if (center.luckyCard.isNeedBonusTips()) {
            this.Items.Sprite_hand.active = true;
            tween(this.Items.Sprite_hand)
                .to(0.6, { scale: new Vec3(1.25, 1.25, 1) })
                .to(0.6, { scale: new Vec3(1, 1, 1) })
                .union()
                .repeatForever()
                .start();
        }
        this.viewUpdate();
    }
    initBtns() {
        this.Items.Sprite_collect.onClickAndScale(() => {
            this.getBonus();
        });
    }

    getBonus() {
        Tween.stopAllByTarget(this.Items.Sprite_hand)
        this.Items.Sprite_hand.active = false
        app.file.setIntegerForKey("isBonusTipsShowed", 1)
        let cashback = center.user.getActorProp(ACTOR.ACTOR_PROP_RECHARGE_CASHBACK)
        if (cashback && cashback > 0) {
            center.luckyCard.sendGetCashBack()
        } else {
            app.popup.showToast({ text: fw.language.get("There is no cash back amount available") })
        }
    }

    viewUpdate() {
        let bonus = center.user.getActorProp(ACTOR.ACTOR_PROP_RECHARGE_SAVED_BONUS);
        if (bonus == 0 || bonus > 0) {
            this.Items.Label_saved.string = `${Number(center.user.getActorProp(ACTOR.ACTOR_PROP_RECHARGE_SAVED_BONUS)) / DF_RATE}`;
        }
        let cashback = center.user.getActorProp(ACTOR.ACTOR_PROP_RECHARGE_CASHBACK);
        if (cashback == 0 || cashback > 0) {
            this.Items.Label_cash.string = `${Number(center.user.getActorProp(ACTOR.ACTOR_PROP_RECHARGE_CASHBACK)) / DF_RATE}`;
        }
    }
}
