import { report_event } from "../../config/EventConfig";
import { Base64 } from "../external/base64/Base64";

let config = {
    alias: "abc",
    key: "abc",
    url: "https://abc",
}

let AWEventUploadInit = false;
let baseInfo = {
    app_ver: 0,
    device_id: "",
    channel_id: "",
    unique_id: ""
}

let __updateLoadList = [];
let AUTO_UPLOAD = true
let UPLOAD_TIME = 120 //多少秒自动上报
let MAX_SAVE = 40 //最多缓存多少数据

export class EventUpload {

    static init(app_ver, device_id, channel_id) {
        AWEventUploadInit = true;
        baseInfo.app_ver = app_ver
        baseInfo.device_id = device_id
        baseInfo.channel_id = channel_id
        baseInfo.unique_id = ""
    }

    static resetUserID(userID) {
        if (userID) {
            baseInfo.unique_id = userID + ""
        } else {
            baseInfo.unique_id = ""
        }
    }

    static addEventRecord(data) {
        if (!AWEventUploadInit) return;
        let eventData = EventUpload.createEventData(data);
        let record = {
            eventData: eventData,
            unique_id: baseInfo.unique_id,
        }
        __updateLoadList.push(record);

        if (data.isSync || __updateLoadList.length >= MAX_SAVE) {
            EventUpload.uploadEvent()
        } else if (!AUTO_UPLOAD) {
            EventUpload.autoUpLoad()
        }
    }

    static uploadEvent() {
        let updateLoadList = __updateLoadList;
        __updateLoadList = [];
        let unique_id = null;
        let events = [];
        updateLoadList.forEach(v => {
            if (unique_id == null) {
                unique_id = v.unique_id
            } else if (unique_id != v.unique_id) {
                let data = EventUpload.createUploadData({
                    unique_id: unique_id,
                    events: events,
                })
                EventUpload.uploadData(data);
                unique_id = v.unique_id
                events = []
            }
            events.push(v.eventData);
        })

        if (events.length > 0) {
            let data = EventUpload.createUploadData({
                unique_id: unique_id,
                events: events,
            })
            EventUpload.uploadData(data)
        }
    }

    static uploadData(data) {
        let postUrl = config.url;
        fw.print("uploadData", data)
        let dataStr = JSON.stringify(data);
        let ts = app.func.time();
        let sign = app.md5.hashStr([config.alias, ts, dataStr, config.key].join("_")).toUpperCase();
        let auth = Base64.encode([config.alias, ts, sign].join("_"))
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            fw.print('uploadData xhr.readyState = ' + xhr.readyState + '  xhr.status = ' + xhr.status);
        }
        xhr.onerror = function (evt) {
            fw.printError(evt);
        }
        xhr.timeout = 10000;
        xhr.open('POST', postUrl, true);
        xhr.setRequestHeader('Authorization', auth);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Connection', 'close');
        xhr.send(dataStr);
    }

    static autoUpLoad() {
        AUTO_UPLOAD = true;
        setTimeout(() => {
            AUTO_UPLOAD = false
            EventUpload.uploadEvent()
        }, UPLOAD_TIME)
    }
    /**
     * 参数
     * timestamp 时间轴
     * event 事件唯一字符串
     * properties 事件附加参数tab
     * @param data 
     */
    static createEventData(data) {
        let timestamp = data.timestamp ?? app.func.time();
        let event = data.event;
        let properties = data.properties;
        if (properties != null && typeof properties != "object") {
            fw.printError("properties is must be table")
            return;
        }
        if (event == null) {
            fw.printError("event is nil")
            return;
        }
        let eventData = {
            event: event,
            timestamp: timestamp,
            properties: properties,
        }
        return eventData
    }

    static createUploadData(data) {
        let uploadData = {} as any
        uploadData.app_ver = data.app_ver ?? baseInfo.app_ver
        uploadData.device_id = data.device_id ?? baseInfo.device_id
        uploadData.channel_id = data.channel_id ?? baseInfo.channel_id
        uploadData.unique_id = data.unique_id ?? baseInfo.unique_id
        uploadData.events = data.events ?? []
        return uploadData
    }
}


let isInit = false

let isUploadSyc = {
    app_open: true,
    login: true,
    app_update: true,
    app_update_success: true,
}

let needUpload = {
    app_open: true,
    login: true,
    app_update: true,
    app_update_success: true,
}

export class AWEvent {
    static init() {
        isInit = true
        let app_ver = app.file.getPlazaVersion();
        let device_id = app.native.device.getHDID();
        let channel_id = app.native.device.getOperatorsID();
        EventUpload.init(app_ver, device_id, channel_id);
        EventUpload.resetUserID(center.login.getLoginEndUserDBID());
    }

    static setUserID(user_id) {
        EventUpload.resetUserID(user_id);
    }


    static safeParams(eventName, params) {
        params = params ?? {};
        let eventTab = report_event[eventName];
        if (!eventTab) {
            fw.printError("EventHelp.reportEvent not ", eventName)
        }
        let safeParams = {};
        for (const key in eventTab.params) {
            safeParams[key] = params[key] ?? eventTab.params[key];
        }
        return safeParams;
    }

    static reportEvent(eventName, params) {
        fw.print("AWEvent.reportEvent", eventName)
        if (!isInit) {
            AWEvent.init()
        }

        if (!needUpload[eventName]) return;

        // EventUpload.addEventRecord({
        //     event: eventName,
        //     isSync: isUploadSyc[eventName] == true,
        // })
    }

}