import { Vec2, v2, Vec3, v3, Vec4, v4 } from 'cc';
import './../__init'

//全局复用对象

//定义复用对象（仅用于简短上下文，不可用于回调）

fw._v2 = v2();
fw._v3 = v3();
fw._v4 = v4();
fw.v2 = (x?: number | Vec2, y?: number) => {
    x ??= 0;
    if (typeof (x) != `number`) {
        x = <Vec2>(x);
        y = x.y;
        x = x.x;
    } else {
        y ??= x;
    }
    fw._v2.set(x, y);
    return fw._v2;
}
fw.v3 = (x?: number | Vec2 | Vec3, y?: number, z?: number) => {
    x ??= 0;
    if (typeof (x) != `number`) {
        x = <Vec3>(x);
        y = x.y ?? 0;
        z = x.z ?? 0;
        x = x.x ?? 0;
    } else {
        y ??= x;
        z ??= x;
    }
    fw._v3.set(x, y, z);
    return fw._v3;
}
fw.v4 = (x?: number | Vec2 | Vec3 | Vec4, y?: number, z?: number, o?: number) => {
    x ??= 0;
    if (typeof (x) != `number`) {
        x = <Vec4>(x);
        y = x.y ?? 0;
        z = x.z ?? 0;
        o = x.w ?? 0;
        x = x.x ?? 0;
    } else {
        y ??= x;
        z ??= x;
        o ??= x;
    }
    fw._v4.set(x, y, z, o);
    return fw._v4;
}

fw.pos = function(x: number | Vec2 | Vec3 = 0, y: number = 0, z: number = 0) {
    if (typeof (x)!= `number`) {
        x = <Vec3>(x);
        y = x.y ?? 0;
        z = x.z ?? 0;
        x = x.x ?? 0;
    }
    fw._v3.set(x, y, z);
    return fw._v3;
}

fw.scale = function(x: number | Vec2 | Vec3 = 1, y: number = 1, z: number = 1) {
    if (typeof (x)!= `number`) {
        x = <Vec3>(x);
        y = x.y ?? 1;
        z = x.z ?? 1;
        x = x.x ?? 1;
    } else if(arguments.length == 1) {
        y = x;
        z = x;
        x = x;
    }
    fw._v3.set(x, y, z);
    return fw._v3;
}

fw.removePos = new Vec3(10000,10000,10000)

declare global {
    namespace globalThis {
        interface _fw {
            //定义复用对象（仅用于简短上下文，不可用于回调）
            _v2: Vec2
            //定义复用对象（仅用于简短上下文，不可用于回调）
            _v3: Vec3
            //定义复用对象（仅用于简短上下文，不可用于回调）
            _v4: Vec4
            //定义复用对象（仅用于简短上下文，不可用于回调）
            v2: (x?: number | Vec2, y?: number, z?: number) => Vec2
            //定义复用对象（仅用于简短上下文，不可用于回调）
            v3: (x?: number | Vec2 | Vec3, y?: number, z?: number) => Vec3
            //定义复用对象（仅用于简短上下文，不可用于回调）
            v4: (x?: number | Vec2 | Vec3 | Vec4, y?: number, z?: number) => Vec4
            /** 坐标复用 */
            pos: (x?: number | Vec2 | Vec3, y?: number, z?: number) => Vec3
            /** 缩放复用 */
            scale: (x?: number | Vec2 | Vec3, y?: number, z?: number) => Vec3
            // 定义世界外的坐标
            removePos:Vec3
        }
    }
}