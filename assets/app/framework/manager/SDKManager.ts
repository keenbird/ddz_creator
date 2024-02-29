import { COMPILATION_SDKTYPE } from "../../config/ModuleConfig";
import { SDKDefine } from "../sdk/SDKDefine";



let CONFIG = {}
CONFIG[COMPILATION_SDKTYPE.DEFAULT] = SDKDefine;

export class SDKManager {
    static getSdkClass() {
        let SDKType = app.native.device.getSDKtype()
        return CONFIG[SDKType];
    }
}