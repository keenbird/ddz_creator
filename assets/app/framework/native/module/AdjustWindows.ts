import { report_event_name, report_event_type } from "../../../config/EventConfig";
import { AdjustBase, IAdjustEvent } from "./AdjustBase";

export class AdjustWindows extends AdjustBase {

    reportEvent(eventName: string, eventparams = {} as any) {
        let eventToken = this.eventTokens[eventName as string]

        if (eventToken == null) {
            fw.print(`adjust reportEvent ${eventName} not eventToken`)
            return;
        }

        let data: IAdjustEvent = {
            eventToken: eventToken,
        }

        if (eventparams.purchaseAmount) {
            data.currency = eventparams.currency;
            data.revenue = eventparams.revenue;
        }
        if (eventparams.orderId) {
            data.orderId = eventparams.orderId;
        }
        if (eventparams.callbackId) {
            data.callbackId = eventparams.callbackId;
        }

        data.callbackStr = JSON.stringify(data)

        this.dispatchEventToNative("event", data)
    }
}