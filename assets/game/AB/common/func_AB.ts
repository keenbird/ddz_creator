import { _decorator, Node as ccNode } from 'cc';
const { ccclass } = _decorator;

import { yx } from '../yx_AB';
import { func_GameBase } from '../../GameBase/common/func_GameBase';

@ccclass('func_AB')
export class func_AB extends func_GameBase {
    /**客户端可用椅子号 */
    clientChairIDs: number[]
    initData() {
        this.clientChairIDs = [1, 2, 3, 4, 5];
    }
    /**获取客户端椅子号 */
    getClientChairIDByServerChairID(nServerChairID: number): number {
        const nMaxPlayerCount = yx.internet.nMaxPlayerCount;
        const nSelfChairID = Math.max(yx.internet.nSelfChairID, 0);
        return this.clientChairIDs[(nServerChairID - nSelfChairID + nMaxPlayerCount) % nMaxPlayerCount];
    }
    /**花色 */
    getCardColor(nCardValue: number) {
        return (nCardValue & 0xF0);
    }
    /**牌值 */
    getCardValue(nCardValue: number) {
        return (nCardValue & 0x0F);
    }
    /**刷新牌 */
    updateCard(card: ccNode, nCardValue?: number) {
        let str: string;
        //花色
        let nColor = yx.func.getCardColor(nCardValue);
        //牌值
        let nValue = yx.func.getCardValue(nCardValue);
        //牌值
        str = `num_${(nColor == yx.config.CardColor.Club || nColor == yx.config.CardColor.Spade) ? `black` : `red`}_`;
        card.Items.Sprite_value.updateSprite(app.game.getRes(`ui/main/img/atlas/${str}${nValue}/spriteFrame`), { bAutoShowHide: true, });
        //小花色
        str = ({
            [yx.config.CardColor.Club]: `logo_club`,
            [yx.config.CardColor.Diamond]: `logo_diamond`,
            [yx.config.CardColor.Heart]: `logo_heart`,
            [yx.config.CardColor.Spade]: `logo_spade`,
        })[nColor];
        card.Items.Sprite_color_small.updateSprite(app.game.getRes(`ui/main/img/atlas/${str}/spriteFrame`), { bAutoShowHide: true, });
        //大花色
        if (nValue > 10) {
            str = `logo_${nValue}`;
        } else {
            str = ({
                [yx.config.CardColor.Club]: `logo_club`,
                [yx.config.CardColor.Diamond]: `logo_diamond`,
                [yx.config.CardColor.Heart]: `logo_heart`,
                [yx.config.CardColor.Spade]: `logo_spade`,
            })[nColor];
        }
        card.Items.Sprite_color_big.updateSprite(app.game.getRes(`ui/main/img/atlas/${str}/spriteFrame`), { bAutoShowHide: true, });
    }
}

/**类型声明调整 */
declare global {
    namespace globalThis {
        type type_func_AB = func_AB
    }
}
