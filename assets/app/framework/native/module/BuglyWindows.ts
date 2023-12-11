import { report_event_name, report_event_type } from "../../../config/EventConfig";
import { BuglyBase } from "./BuglyBase";

export class BuglyWindows extends BuglyBase {
    postException(reason: string, stack: string) {
        let data = {
            reason: reason,
            stack: stack,
        }
        this.dispatchEventToNative("postException", data)
    }

    setUserId(user_id: string) {
        let data = {
            user_id: user_id,
        }
        this.dispatchEventToNative("setUserId", data)
    }
}