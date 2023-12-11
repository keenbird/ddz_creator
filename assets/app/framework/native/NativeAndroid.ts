import { DeviceAndroid } from './DeviceAndroid';
import { AdjustAndroid } from './module/AdjustAndroid';
import { BuglyAndroid } from './module/BuglyAndroid';
import { FacebookAndroid } from './module/FacebookAndroid';
import { LeoAndroid } from './module/LeoAndroid';
import { NativeBase } from './NativeBase';

export class NativeAndroid extends NativeBase {
    
    get bugly(): BuglyAndroid {
        return this.obtainComponent(BuglyAndroid)
    }

    get facebook(): FacebookAndroid {
        return this.obtainComponent(FacebookAndroid)
    }

    get adjust(): AdjustAndroid {
        return this.obtainComponent(AdjustAndroid)
    }

    get device(): DeviceAndroid {
        return this.obtainComponent(DeviceAndroid)
    }

    get leo(): LeoAndroid {
        return this.obtainComponent(LeoAndroid)
    }
}
