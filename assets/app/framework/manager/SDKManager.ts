import { COMPILATION_SDKTYPE } from "../../config/ModuleConfig";
import { SDKBase } from "../sdk/SDKBase";
import { SDKDefine } from "../sdk/SDKDefine";
import { SDKLeo } from "../sdk/SDKLeo";



let CONFIG = {}
CONFIG[COMPILATION_SDKTYPE.DEFAULT] = SDKDefine;
CONFIG[COMPILATION_SDKTYPE.LEO] = SDKLeo;

export class SDKManager {
    static getSdkClass() {
        let SDKType = app.native.device.getSDKtype()
        return CONFIG[SDKType];
    }
}