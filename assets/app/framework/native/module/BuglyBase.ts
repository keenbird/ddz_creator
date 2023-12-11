import { _decorator } from 'cc';
import { report_event_name, report_event_type } from '../../../config/EventConfig';
import { MODULE_NAME } from '../../../config/ModuleConfig';
import { ModuleBase } from '../ModuleBase';

const { ccclass } = _decorator;

export abstract class BuglyBase extends ModuleBase {
    public eventTokens = {};

    initModule() {
        this._module_name = MODULE_NAME.bugly;
    }

    abstract postException(reason: string, stack: string);

    abstract setUserId(user_id: string);
}