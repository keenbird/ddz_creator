import { DeviceWechat } from './DeviceWechat';
import { NativeBase } from './NativeBase';

import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('NativeWechat')
export class NativeWechat extends NativeBase {

    get device(): NativeWechat {
        return this.obtainComponent(NativeWechat);
    }
}
