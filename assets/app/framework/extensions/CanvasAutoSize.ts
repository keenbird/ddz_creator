import { _decorator, Camera,screen, Vec3, view } from 'cc';
import { EDITOR } from 'cc/env';
const { ccclass,type } = _decorator;

const _worldPos = new Vec3();
@ccclass('CanvasAutoSize')
export class CanvasAutoSize extends Camera {
    protected _onResizeCamera () {
        if (this.targetTexture) {
            this.orthoHeight = this.targetTexture.window.height / 2;
        } else {
            const size = screen.windowSize;
            this.orthoHeight = size.height / view.getScaleY() / 2;
        }

        this.node.getWorldPosition(_worldPos);
        this.node.setWorldPosition(_worldPos.x, _worldPos.y, 1000);
    }
    
    public __preload () {
        this._onResizeCamera();
    }

    public onEnable () {
        super.onEnable();
    }

    public onDisable () {
        super.onDisable();
    }
}