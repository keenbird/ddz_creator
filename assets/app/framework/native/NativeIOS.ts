import { DeviceIOS } from './DeviceIOS';
import { NativeBase } from './NativeBase';
import { BuglyIOS } from './module/BuglyIOS';
import { AdjustIOS } from './module/AdjustIOS';
import { FacebookIOS } from './module/FacebookIOS';

import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('NativeIOS')
export class NativeIOS extends NativeBase {
    get bugly(): BuglyIOS {
        return this.obtainComponent(BuglyIOS);
    }
    get facebook(): FacebookIOS {
        return this.obtainComponent(FacebookIOS);
    }
    get adjust(): AdjustIOS {
        return this.obtainComponent(AdjustIOS);
    }
    get device(): DeviceIOS {
        return this.obtainComponent(DeviceIOS);
    }
}
