import { _decorator, Label, tween, Vec2, Vec3, Sprite } from "cc";
import { DOWN_IMAGE_TYPE } from "../../../app/config/ConstantConfig";
const { ccclass, property, integer } = _decorator;

export class HeadCtrl_GameBase extends (fw.FWComponent) {
    _headSprite: Sprite;

    init(headSprite: Sprite) {
        this._headSprite = headSprite;
    }

    private get headSprite() {
        return this._headSprite ?? this.node.getComponent(Sprite)
    }

    clear() {
        this.headSprite.spriteFrame = null;
    }

    setHeadUrl(serverPicID: string,userId:number) {
        app.file.updateHead({
            node: this.headSprite.node,
            serverPicID: serverPicID,
			nUserID:userId,
            type: DOWN_IMAGE_TYPE.Head,
        });
    }
}