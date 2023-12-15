import { DeviceIOS } from './DeviceIOS';
import { NativeBase } from './NativeBase';

import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('NativeIOS')
export class NativeIOS extends NativeBase {

    get device(): DeviceIOS {
        return this.obtainComponent(DeviceIOS);
    }
}
