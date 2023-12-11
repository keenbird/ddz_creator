import { Label, Vec3, easing, lerp } from "cc";

export class StageAnim_GameBase extends (fw.FWComponent) {
    protected static tmpVec3 = new Vec3();
    protected _pos:Vec3[];
    protected _time: number = 0;
    protected _delay:number = 0;
    protected _bRunning = false;
    protected _callback:Function;
    protected _stageTime:number[] = [];
    protected _stageIndex:number = 0;
    protected _stageMaxIndex:number = 0;
    protected _stageFunc:Function[];
    scrollEndListener: Function;

    protected static updateQuadOut(object:StageAnim_GameBase,ratio: number) {
        StageAnim_GameBase.updateNormal(object,easing.quadOut(ratio))
    }

    protected static updateNormal(object:StageAnim_GameBase,ratio: number) {
        Vec3.lerp(StageAnim_GameBase.tmpVec3,object._pos[object._stageIndex], object._pos[object._stageIndex+1], ratio);
        object.position = StageAnim_GameBase.tmpVec3;
    }

    get stageTime() {
        return this._stageTime[this._stageIndex];
    }

    get preStageTime() {
        if(this._stageIndex > 0)
            return this._stageTime[this._stageIndex-1];
        return 0;
    }

    scroll(data) {
        this.reset(data);
        this.run();
    }

    protected reset(data) {
        this.initStageAnim(data);
        this.initStageAnimTime(data);
    }

    protected initStageAnim(data) {
        let {fromPos, delay = 0,callback} = data;
        this._callback = callback;
        this._delay = delay;
        this.position = fromPos;
    }
    
    protected initStageAnimTime(data) {
        this._time = 0;
        this._stageIndex = 0;
        this._stageMaxIndex = this._stageTime.length-1;
        for (let i = 1; i < this._stageTime.length; i++) {
            this._stageTime[i] += this._stageTime[i-1];
        }
    }

    run() {
        this._bRunning = true;
    }

    pause() {
        this._bRunning = false;
    }

    protected update(dt: number): void {
        if(!this._bRunning) return
        this._time += dt
        if(this._time < this._delay) {
            return
        }
        let time = this._time - this._delay;
        let stageTime = this.stageTime;
        let preStageTime = this.preStageTime;
        let stageTotalTime = stageTime - preStageTime;
        let stageRuningTime = time - preStageTime;
        
        // 当前状态结束
        while(time >= stageTime) {
            // 是否运行结束
            if(this._stageIndex >= this._stageMaxIndex) {
                time = stageTime;
                stageRuningTime = time - preStageTime;
                this._bRunning = false;
                break
            } else {
                this._stageIndex++;
                // 刷新时间
                stageTime = this.stageTime;
                preStageTime = this.preStageTime;
                stageTotalTime = stageTime - preStageTime;
                stageRuningTime = time - preStageTime;
            }
        }

        let ratio = stageRuningTime / stageTotalTime;
        this._stageFunc[this._stageIndex](this,ratio);
        
        if(!this._bRunning) {
            this._callback?.();
            this.scrollEndListener?.();
        }
    }

    set position(curNum:Vec3) {
        this.node.setPosition(curNum)
    }
}

export class Scroll_GameBaiRenMVCBase extends StageAnim_GameBase {
    protected _pos:Vec3[] = [new Vec3(),new Vec3()];
    protected _stageFunc:Function[] = [
        Dropped_GameBaiRenMVCBase.updateQuadOut,
    ];
    
    protected initStageAnim(data) {
        super.initStageAnim(data);
        let {fromPos,toPos,speed} = data;
        // 设置各个阶段坐标位置
        this._pos[0].set(fromPos);
        this._pos[1].set(toPos);
        // 设置各个阶段运行时间
        let duration = Vec3.distance(this._pos[0],this._pos[1]) / speed;
        this._stageTime[0] = duration;
    }
}

export class Dropped_GameBaiRenMVCBase extends StageAnim_GameBase {
    protected _pos:Vec3[] = [new Vec3(),new Vec3(),new Vec3(),new Vec3()];
    // 回弹高度和时间
    protected _reboundH = 30;
    protected _reboundTime = 0.2;
    protected _stageFunc:Function[] = [
        Dropped_GameBaiRenMVCBase.updateQuadOut,
        Dropped_GameBaiRenMVCBase.updateNormal,
        Dropped_GameBaiRenMVCBase.updateNormal,
    ];
    
    protected initStageAnim(data) {
        super.initStageAnim(data);
        let {fromPos,toPos,speed,reboundH=this._reboundH} = data;
        this._reboundH = reboundH;
        // 设置各个阶段坐标位置
        this._pos[0].set(fromPos);
        this._pos[1].set(toPos);
        this._pos[2].set(toPos);
        this._pos[2].y += this._reboundH;
        this._pos[3].set(toPos);
        // 设置各个阶段运行时间
        let duration = Vec3.distance(this._pos[0],this._pos[1]) / speed;
        this._stageTime[0] = duration;
        this._stageTime[1] = this._reboundTime;
        this._stageTime[2] = this._reboundTime;
    }
}


export class ScrollOut_GameBaiRenMVCBase extends StageAnim_GameBase {
    protected _pos:Vec3[] = [new Vec3(),new Vec3(),new Vec3()];
    // 回弹高度和时间
    protected _reboundH = 30;
    protected _reboundTime = 0.2;
    protected _stageFunc:Function[] = [
        Dropped_GameBaiRenMVCBase.updateQuadOut,
        Dropped_GameBaiRenMVCBase.updateNormal,
    ];

    protected initStageAnim(data) {
        super.initStageAnim(data);
        let {fromPos,toPos,speed,reboundH=this._reboundH} = data;
        this._reboundH = reboundH;
        // 设置各个阶段坐标位置
        this._pos[0].set(fromPos);
        this._pos[1].set(toPos);
        this._pos[1].y -= this._reboundH;
        this._pos[2].set(toPos);
        // 设置各个阶段运行时间
        let duration = Vec3.distance(this._pos[0],this._pos[1]) / speed;
        this._stageTime[0] = duration;
        this._stageTime[1] = this._reboundTime;
    }
}

export class ScrollNum_GameBase extends (fw.FWComponent) {
    private m_Label_component: Label;
    private _duration: number = 0;
    private _nums:number[] = []
    private _time: number = 0;
    private _num: number = 0;
    private _callback: Function;
    private _bRunning: boolean = false;
    public formatNum:(num:number)=>string

    protected initData(): boolean | void {
        this.m_Label_component = this.node.getComponent(Label);
    }

    bindLabel(component:Label) {
        this.m_Label_component = component
    }
    
    startScroll(data:{
        fromNum?:number,
        toNum:number,
        duration:number,
        callback?:Function,
    }) {
        let {fromNum = this.num,toNum,duration,callback} = data;
        this._duration = duration;
        this._nums[0] = fromNum;
        this._nums[1] = toNum;
        this._time = 0;
        this.num = fromNum;
        this._callback = callback;
        this._bRunning = true;
    }

    protected update(dt: number): void {
        if(!this._bRunning) return
        if(this._time >= this._duration) {
            this._bRunning = false;
            this._callback?.();
            return
        }
        this._time += dt
        let ratio = 1.0;
        if (this._duration > 0) {
            ratio = this._time / this._duration;
        }
        if (ratio >= 1) {
            ratio = 1;
        }
        this.num = lerp(this._nums[0], this._nums[1], ratio);
    }

    get num() {
        return this._num;
    }

    set num(curNum:number) {
        this._num = curNum;
        if (!fw.isValid(this.m_Label_component)) return
        this.m_Label_component.string = this.formatNum?.(curNum) ?? curNum.toString();
    }
}