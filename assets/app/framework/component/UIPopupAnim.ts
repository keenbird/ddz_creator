import { _decorator, Component, Node , tween, Vec3, Tween} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('UIPopupAnim')
export class UIPopupAnim extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;
    private anim:Tween<any>;
    private isShowing:boolean;
    start () {
        // [3]
        this.isShowing = false;
    }
    // update (deltaTime: number) {
    //     // [4]
    // }
    //弹窗显示动画
    public showPopupAnim() {
        if ( this.isShowing ) return ;
        this.isShowing = true;
        if (this.anim) {
            this.anim.stop();
            this.anim = null;
        }
        this.anim = tween(this.node)
            .set({scale:new Vec3(0, 0, 0)})
            .to(0.15, {scale: new Vec3(1, 1, 1)},{easing: 'sineOutIn'})
            .start();
    }
    
    //弹窗隐藏动画
    public hidePopupAnim() {
        if ( !this.isShowing ) return ;
        this.isShowing = false;
        if (this.anim) {
            this.anim.stop();
            this.anim = null;
        }
        this.anim = tween(this.node)
            .set({scale:new Vec3(1, 1, 1)})
            .to(0.01, {scale: new Vec3(0, 0, 0)},{easing: 'sineOutIn'})
            .start();
    }

    //弹窗移除动画
    public removePopupAnim() {
        if (this.anim) {
            this.anim.stop();
            this.anim = null;
        }
        this.anim = tween(this.node)
            .set({scale:new Vec3(1, 1, 1)})
            .to(0.01, {scale: new Vec3(0, 0, 0)},{easing: 'sineOutIn'})
            .call(() => { 
                this.node.parent.destroy();
            })
            .start();
    }
}