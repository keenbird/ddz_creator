import { report_event_name, report_event_type } from "../../../config/EventConfig";
import { AdjustBase, IAdjustEvent } from "./AdjustBase";

export class AdjustAndroid extends AdjustBase {

    reportEvent(eventName: string, _eventparams = {} as any) {
        let eventToken = this.eventTokens[eventName as string]

        if (!eventToken) {
            fw.print(`adjust reportEvent ${eventName} not eventToken`)
            return;
        }

        let data: IAdjustEvent = {
            eventToken: eventToken,
        }

        let eventparams = Object.assign({},_eventparams);

        if(eventparams.purchaseAmount) {
            data.currency = eventparams.currency;
            data.revenue = eventparams.purchaseAmount + "";
            delete eventparams.purchaseAmount;
            delete eventparams.currency;
        }
        if(eventparams.orderId) {
            data.orderId = eventparams.orderId;
            delete eventparams.orderId;
        }
        if(eventparams.callbackId) {
            data.callbackId = eventparams.callbackId;
            delete eventparams.callbackId;
        }

        let keys = Object.keys(eventparams)
        if(keys.length > 0) {
            keys.forEach(key=>{
                eventparams[key] = eventparams[key] + "";
            })
            data.callbackStr = JSON.stringify(eventparams);
        }
        
        this.dispatchEventToNative("event", data)
    }
}