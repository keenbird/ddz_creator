import { _decorator } from 'cc';
import { DeviceWindows } from './DeviceWindows';

const { ccclass } = _decorator;
import { NativeBase } from './NativeBase';

@ccclass('NativeWindows')
export class NativeWindows extends NativeBase {


    get device(): DeviceWindows {
        return this.obtainComponent(DeviceWindows)
    }


}
