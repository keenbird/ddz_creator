import { SDKBase } from "./SDKBase";

export class SDKDefine extends SDKBase {
    reportEvent(eventName, params) {
        app.native.adjust.reportEvent(eventName, params);
    }
}