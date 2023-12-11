import { _decorator } from 'cc';
import { report_event_name, report_event_type } from '../../../config/EventConfig';
import { MODULE_NAME } from '../../../config/ModuleConfig';
import { ModuleBase } from '../ModuleBase';

const { ccclass } = _decorator;

export interface IAdjustEvent {
    eventToken: string;//事件唯一标识
    revenue?: string;
    currency?: string;//
    orderId?: string;
    callbackId?: string;
    callbackStr?: string;
}

const filePath = "adjust.json";

export abstract class AdjustBase extends ModuleBase {
    public eventTokens = {};

    initModule() {
        this._module_name = MODULE_NAME.adjust;
        this.loadEventTokens();
    }

    @fw.Decorator.TryCatch(false)
    loadEventTokens() {
        let eventTokens = JSON.safeParse(app.file.getStringFromFile({ finalPath: filePath ,default:"{}"}))
        if (eventTokens) {
            return this.eventTokens = eventTokens
        }
        return false
    }

    abstract reportEvent(eventName: string, eventparams?);
}