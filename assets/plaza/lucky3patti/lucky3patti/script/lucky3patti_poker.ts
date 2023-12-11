
import { _decorator, Component, Node as ccNode, Sprite, SpriteFrame, CCInteger, SpriteAtlas, tween, v4, Quat, v3, v2, UITransform } from 'cc';
import { Lucky3PattiLogic } from './model/Lucky3PattiLogic';
import { Lucky3PattiTypeDef } from './model/Lucky3PattiTypeDef';

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = lucky3patti_poker
 * DateTime = Tue Feb 22 2022 16:56:14 GMT+0800 (中国标准时间)
 * Author = 大禹_Jason
 * FileBasename = lucky3patti_poker.ts
 * FileBasenameNoExtension = lucky3patti_poker
 * URL = db://assets/game/game_teenpatti/script/lucky3patti_poker.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

@ccclass('lucky3patti_poker')
export class lucky3patti_poker extends (fw.FWComponent) {
    @property(Sprite)
    private imgBack: Sprite = null;
    @property(Sprite)
    private imgShadow: Sprite = null;
    @property(Sprite)
    private imgFontBack: Sprite = null;
    @property(Sprite)
    private imgFontShadow: Sprite = null;
    @property(ccNode)
    private nodeFont: ccNode = null;
    @property(Sprite)
    private imgNum: Sprite = null;
    @property(Sprite)
    private imgType: Sprite = null;
    @property(Sprite)
    private imgLogo: Sprite = null;
    @property(Sprite)
    private imgLogoSpl: Sprite = null;
    @property(SpriteAtlas)
    private pokerImg: SpriteAtlas = null;

    @property(CCInteger)
    private pokerData: number = 0x00;

    initView() {
        this.nodeFont.active = false;
        this.imgBack.node.active = false;
    }

    updateData(data: number) {
        let bValid = Lucky3PattiLogic.verification(data);
        if (bValid) {
            this.pokerData = data;
            let num = Lucky3PattiLogic.getPokerValue(data);
            let nType = Lucky3PattiLogic.getPokerColor(data);
            let color = Lucky3PattiLogic.getTypeColor(nType);
            let numStr = Lucky3PattiTypeDef.ePokerValueString[num - 1];
            let typeStr = Lucky3PattiLogic.getTypeString(nType);
            let logoStr = Lucky3PattiLogic.getLogoString(nType, num);
            let numName = "num_" + color + "_" + numStr
            let colorName = "logo_" + typeStr
            let logoName = "logo_" + logoStr

            this.imgLogo.spriteFrame = this.pokerImg.getSpriteFrame(logoName);
            this.imgLogoSpl.spriteFrame = this.pokerImg.getSpriteFrame(logoName);
            this.imgType.spriteFrame = this.pokerImg.getSpriteFrame(colorName);
            this.imgNum.spriteFrame = this.pokerImg.getSpriteFrame(numName);

            this.imgLogo.node.active = (num < 0x0B);
            this.imgLogoSpl.node.active = (num >= 0x0B);

        } else {
            fw.print(" ======updateData data is invalid=============== ");
        }
    }

    rotatePoker(nDelayTime: number, index: number, callBack: Function) {
        let nAngle = -360;
        tween(this.imgBack.node)
            .delay(nDelayTime)
            .to(0.4, { eulerAngles: v3(0, 0, nAngle) })
            .start();

        tween(this.nodeFont)
            .delay(nDelayTime)
            .by(0.4, { eulerAngles: v3(0, 0, nAngle) })
            .start();

        tween(this.node)
            .delay(nDelayTime + 0.2)
            .call(() => {
                this.showBackView(false);
                if (callBack) {
                    callBack(index);
                }
            })
            .start();
    }

    showDown(index: number = 0, callBack: Function = null) {
        this.node.eulerAngles = v3(0, 180, 0);
        tween(this.node)
            .to(0.1, { eulerAngles: v3(0, 270, 0) })
            .call(() => {
                this.showBackView(false);
            })
            .to(0.3, { eulerAngles: v3(0, 360, 0) })
            .call(() => {
                if (callBack) {
                    callBack(index);
                }
            })
            .start();

    }

    showBackView(bShow: boolean = true) {
        this.showBack(bShow);
        this.showFont(!bShow);
    }

    showBack(bShow: boolean) {
        this.imgBack.node.active = bShow;
    }

    showShadow(bShow: boolean) {
        this.imgShadow.node.active = bShow;
        this.imgFontShadow.node.active = bShow;
    }

    showFont(bShow: boolean = true) {
        this.nodeFont.active = bShow;
    }

    dealCard(x_: number, y_: number, time_: number = 3) {
        this.node.setPosition(v3(-120, 0));
        tween(this.node)
            .call(() => {
                this.showBackView(true);
            })
            .delay(0.2)
            .to(time_, { position: v3(x_, y_) })
            .start();
    }

    public reset(): void {
        this.nodeFont.active = false;
        this.imgBack.node.active = false;
        this.Items.imgBack.obtainComponent(UITransform).setAnchorPoint(v2(0.5, 0.5));
        this.Items.nodeFont.obtainComponent(UITransform).setAnchorPoint(v2(0.5, 0.5));
        this.Items.nodeFont.setPosition(v3(0, 0));
        this.Items.imgBack.setPosition(v3(0, 0));
        this.Items.imgBack.setRotation(0, 0, 0, 0);
        this.Items.nodeFont.setRotation(0, 0, 0, 0);
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/decorator.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
