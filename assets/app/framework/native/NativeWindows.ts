import { _decorator } from 'cc';
import { DeviceWindows } from './DeviceWindows';
import { AdjustWindows } from './module/AdjustWindows';
import { BuglyWindows } from './module/BuglyWindows';
import { FacebookWindows } from './module/FacebookWindows';
const { ccclass } = _decorator;
import { NativeBase } from './NativeBase';
import { LeoWindows } from './module/LeoWindows';

@ccclass('NativeWindows')
export class NativeWindows extends NativeBase {
    get bugly(): BuglyWindows {
        return this.obtainComponent(BuglyWindows)
    }

    get facebook(): FacebookWindows {
        return this.obtainComponent(FacebookWindows)
    }

    get adjust(): AdjustWindows {
        return this.obtainComponent(AdjustWindows)
    }

    get device(): DeviceWindows {
        return this.obtainComponent(DeviceWindows)
    }

    get leo(): LeoWindows {
        return this.obtainComponent(LeoWindows)
    }
}
