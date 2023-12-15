import { DeviceAndroid } from './DeviceAndroid';

import { NativeBase } from './NativeBase';

export class NativeAndroid extends NativeBase {
    

    get device(): DeviceAndroid {
        return this.obtainComponent(DeviceAndroid)
    }


}
