import { PlazeMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";
import { httpConfig } from "../../config/HttpConfig";
import { EVENT_ID } from "../../config/EventConfig";

export class activityCenter extends PlazeMainInetMsg {
    /**活动列表 */
    activityList: ActivityConfig[] = []
    /**公告列表 */
    noticeList: NoticeConfig[] = []
    /**??? */
    noticeMessagePopNum: {[key:number]:number} = {}
    saveActIsRead: {[key:string]:number} = {};
    initData() {
    }

    cleanUserData() {
        
    }

    initRegister() {

    }

    /**解析活动url */
    getActivityUrlConfig(activity: ActivityConfig): ActivityUrlConfig {
        return app.http.parseUrl_schemeWork(activity.url);
    }
    /**获取活动列表 */
    getActivityList(): ActivityConfig[] {
        return this.activityList;
    }
    /**获取有效活动列表 */
    getRunningActivityList(): ActivityConfig[] {
        let list = [];
        let nNowTime = app.func.time();
        this.activityList.forEach(element => {
            if (nNowTime >= element.stime && nNowTime <= element.etime) {
                list.push(element);
            }
        });
        return list;
    }
    /**通过名称获取活动 */
    getActivityByName(activityName: string, data?: any) {
        data ??= {};
        let activity = null;
        activityName = activityName.replace(`\s`, ``).toLowerCase();
        let list = data.bAll ? this.getActivityList() : this.getRunningActivityList();
        app.func.positiveTraversal(list, (element) => {
            if (activityName == element.title.replace(`\s`, ``).toLowerCase()) {
                activity = element;
                return true;
            }
        });
        return activity;
    }
    /**获取公告列表 */
    getNoticeList(): NoticeConfig[] {
        return this.noticeList;
    }
    getRunningNoticeList(): NoticeConfig[] {
        let list = [];
        let nNowTime = app.func.time();
        this.noticeList.forEach(element => {
            if (nNowTime >= element.stime && nNowTime <= element.etime) {
                list.push(element);
            }
        });
        return list;
    }
    /**初始化通知消息弹出次数配置 */
    initNoticeMessagePopNum() {
        let nSaveDay = app.file.getIntegerForKey(`activePopupInfo`, 0);
        let nCurDay = new Date().getDate();
        if (nSaveDay != nCurDay) {
            this.noticeMessagePopNum = {};
            this.saveNoticeMessagePopNum();
            app.file.setIntegerForKey(`activePopupInfo`, nCurDay);
        } else {
            let str = app.file.getStringFromFile({
                filePath: `activePopupInfo`,
                default: `{}`,
            });
            this.noticeMessagePopNum = JSON.safeParse(str);
        }
    }
    /**保存通知消息弹出次数配置 */
    saveNoticeMessagePopNum(data?: any) {
        data ??= this.noticeMessagePopNum;
        app.file.writeStringToFile({
            filePath: `activePopupInfo`,
            fileData: JSON.stringify(data)
        });
    }
    /**获取通知消息弹出次数 */
    getNoticeMessagePopNum(nRID: number) {
        return this.noticeMessagePopNum[nRID] ?? 0;
    }
    /**通知消息弹出次数+1 */
    addNoticeMessagePopNum(nRID: number) {
        if (fw.isNull(this.noticeMessagePopNum[nRID])) {
            this.noticeMessagePopNum[nRID] = 0;
        } else {
            ++this.noticeMessagePopNum[nRID];
        }
        this.saveNoticeMessagePopNum();
    }
    // 根据ID获取该消息是否被读取(=1表示已经被读取过)
    getOneInfoItemHaveRead(nRecordID) {
        nRecordID = String(nRecordID)
        let infoPath = `${app.file.getFileDir(app.file.FileDir.Config)}activeReadInfo.json`;
        let strInfo = app.file.getStringFromFile({
            finalPath: infoPath,
            default: `{}`,
        });
        let TtbInitInfo = JSON.safeParse(strInfo)
        if (TtbInitInfo == null) {
            return true
        }
        if (TtbInitInfo[nRecordID] == 1) {
            return false
        }
        return true
    }
    // 保存已读
    setOneInfoItemHaveRead(recordID:number) {
        let nRecordID = String(recordID)
        let infoPath = `${app.file.getFileDir(app.file.FileDir.Config)}activeReadInfo.json`;
        let strInfo = app.file.getStringFromFile({
            finalPath: infoPath,
            default: `{}`,
        });
        let TtbInitInfo = JSON.safeParse(strInfo)
        if (strInfo != null && TtbInitInfo != null) {
            TtbInitInfo[nRecordID] = 1
            let Strjson = JSON.stringify(TtbInitInfo)
            app.file.writeStringToFile({
                finalPath: infoPath,
                fileData: Strjson
            });
        } else {
            this.saveActIsRead[nRecordID] = 1
            let Strjson = JSON.stringify(this.saveActIsRead)
            app.file.writeStringToFile({
                finalPath: infoPath,
                fileData: Strjson
            });
        }
    }
    notifyUnReadNum() {
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_ACTIVITY_NOTIFY_NUM
        });
    }
    /**获取活动列表 */
    requestActivityList() {
        app.http.post({
            params: {
                user_id: center.user.getUserID(),
                user_type: app.native.device.getOperatorsID(),
                user_sub_type: app.native.device.getOperatorsSubID(),
                timestamp: app.func.time(),
            },
            url: `${httpConfig.path_pay}OtherApi/noticelist`,
            callback: (bSuccess, response) => {
                if (bSuccess) {
                    if (response.status == 1) {
                        this.activityList = response.data.actlist ?? [];
                        this.noticeList = response.data.noticelist ?? [];
                    }
                } else {
                    fw.printError(`requestActivityList failed`);
                }
            }
        });
    }
}

declare global {
    namespace globalThis {
        /**活动参数 */
        type ActivityConfig = {
            /**标题 */
            title: string
            /**描述 */
            content: string
            /**开始 */
            stime: number
            /**结束时间 */
            etime: number
            /**url */
            url: string
            /**图片地址 */
            imgurl: string
            /**排序值 */
            sorts: number
            /**??? */
            gold: number
            /**??? */
            nrid: number
            /**??? */
            pay: number
            /**??? */
            rtime: number
            /**??? */
            subscript: number
        }
        /**公告参数 */
        type NoticeConfig = {
            /**标题 */
            title: string
            /**描述 */
            content: string
            /**开始 */
            stime: number
            /**结束时间 */
            etime: number
            /**??? */
            gold: number
            /**??? */
            nrid: number
            /**??? */
            pay: number
            /**??? */
            rtime: number
            /**??? */
            subscript: number
        }
        /**动态活动url参数 */
        type ActivityUrlConfig = {
            /**活动名称 */
            activityName: string
            /**版本号 */
            version: number | string
            /**排序值 */
            sortIndex?: number
            /**活动ID */
            act_id?: number | string
            /**是否显示在活动弹框 */
            activityShow?: string
        }
    }
}
