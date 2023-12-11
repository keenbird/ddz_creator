import { IVec2Like, UITransform } from 'cc';
import { Intersection2D } from 'cc';
import { Vec3 } from 'cc';
import { Vec2 } from 'cc';
import { color } from 'cc';
import { Graphics } from 'cc';
import { _decorator, Component } from 'cc';
import clipperLib from 'js-angusj-clipper';
const { ccclass, property } = _decorator;

interface RegionInfo {
    region : Vec2[],
    parentCount : number,
}

var clipper : clipperLib.ClipperLibWrapper
(async () => {
    // create an instance of the library (usually only do this once in your app)
    clipper = await clipperLib.loadNativeClipperLibInstanceAsync(
        // let it autodetect which one to use, but also available WasmOnly and AsmJsOnly
        clipperLib.NativeClipperLibRequestedFormat.WasmWithAsmJsFallback    
    );
    fw.print("clipper inited")
})();
@ccclass('PolyBoolComponent')
export class PolyBoolComponent extends Component {
    @property
    DIG_FRAGMENT = 30;
    @property
    DIG_RADIUS = 30;
    regionsDirty: boolean = true;

    private _regions: clipperLib.ReadonlyPaths;

    start() {
    }

    reset() {
        let size = this.node.getComponent(UITransform).contentSize;
        let w = size.width/2;
        let h = size.height/2;
        let regions = [[
            [-w,-h],
            [-w,h],
            [w,h],
            [w,-h],
        ]]

        this.setRegions(regions)
    }

    private get graphics() {
        return this.node.getComponent(Graphics)
    } 

    setRegions(regions: number[][][]) {
        let _regionsInfo:clipperLib.Paths = [];
        regions.forEach((region,index)=>{
            _regionsInfo[index] = region.map(v=>{
                return {x:v[0],y:v[1]};
            })
        })
        this._regions = _regionsInfo;
        
        // 强制渲染避免闪屏
        this.regionsDirty = false;
        let regionsInfo:RegionInfo[] = this.sortRegions(this._regions);
        this.draw(regionsInfo);
    }

    getRegions() {
        let regions:number[][][] = [];
        this._regions.forEach((region,index)=>{
            regions[index] = region.map(v=>{
                return [v.x,v.y];
            })
        })
        return regions;
    }

    expandLine(p1: Vec2, p2: Vec2, width: number): [Vec2, Vec2, Vec2, Vec2] {
        const v = p2.clone().subtract(p1).normalize()
        const u = new Vec2(-v.y,v.x).multiplyScalar(width)
        const p1_ = p1.clone().add(u)
        const p2_ = p1.clone().subtract(u)
        const p3_ = p2.clone().subtract(u)
        const p4_ = p2.clone().add(u)
        return [p1_, p2_, p3_, p4_];
    }
    
	@fw.Decorator.FuncTimeConsuming("_touchMove")
	@fw.Decorator.TryCatch("_touchMove")
    _touchMove(spos:IVec2Like,epos:IVec2Like) {
        if(!clipper) return ;
        this.regionsDirty = true;
        const regions = [];

        const count = this.DIG_FRAGMENT;
        {
            let region = []
            for (let index = 0; index < count; index++) {
                const r = 2 * Math.PI * index / count;
                const x = epos.x + this.DIG_RADIUS * Math.cos(r);
                const y = epos.y + this.DIG_RADIUS * Math.sin(r);
                region.push({x:x, y:y});
            }
            regions.push(region)
        }
        
        if(spos.x != spos.x || spos.y != epos.y) {
            let region = []
            this.expandLine(new Vec2(spos.x,spos.y),new Vec2(epos.x,epos.y),this.DIG_RADIUS).forEach(v=>{
                region.push({x:v.x, y:v.y});
            })
            regions.push(region)
        }
        regions.forEach(v=>{
            // let seg2  = PolyBool.segments({
            //     regions:[v],
            //     inverted: false
            // });
            // let comb = PolyBool.combine(this._segment, seg2);
            // this._segment = PolyBool.selectDifference(comb)
            this._regions = clipper.clipToPaths(
                {
                    clipType:clipperLib.ClipType.Difference,

                    subjectInputs: [
                        { data: this._regions, closed: true },
                    ],

                    clipInputs: [
                        { data: v }
                    ],
                    
                    subjectFillType: clipperLib.PolyFillType.EvenOdd
                }
            )
        })
    }

    sortRegions(regions:clipperLib.ReadonlyPaths) {
        let regionsInfo:RegionInfo[] = [];
        regions.forEach((region,index)=>{
            regionsInfo[index] = {
                region : region.map(v=>{
                    return new Vec2(v.x,v.y);
                }),
                parentCount : 0,
            } 
        })

        regionsInfo.forEach((curRegionInfo,curIndex)=>{
            regionsInfo.forEach((regionInfo,index)=>{
                if(curIndex!=index) {
                    let point = curRegionInfo.region[0]
                    if(Intersection2D.pointInPolygon(point,regionInfo.region)) {
                        curRegionInfo.parentCount++;
                    }
                }
            })
        })
        regionsInfo.sort((a, b) => {
            return a.parentCount - b.parentCount;
        })
        return regionsInfo;
    }

    protected lateUpdate(dt: number): void {
        if(this.regionsDirty) {
            // 减少渲染填充次数
            this.regionsDirty = false;
            let regionsInfo:RegionInfo[] = this.sortRegions(this._regions);
            this.draw(regionsInfo);
        }
    }

    draw(regionsInfo:RegionInfo[]) {
        let graphics = this.graphics
        graphics.clear()
        graphics.lineWidth = 5;
        regionsInfo.forEach(regionInfo=>{
            graphics.fillColor = color(255 - regionInfo.parentCount % 2 * 255, 0, 0);
            let region = regionInfo.region
            graphics.moveTo(region[0].x, region[0].y);
            for (let index = 1; index < region.length; index++) {
                const element = region[index];
                graphics.lineTo(element.x, element.y);
            }
            graphics.close();
            // graphics.stroke();
            graphics.fill();
        })
    }
}


