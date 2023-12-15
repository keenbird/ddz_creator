import { JsonAsset } from "cc";
import { ACTOR } from "../../config/cmd/ActorCMD";
import { EVENT_ID } from "../../config/EventConfig";
import { httpConfig } from "../../config/HttpConfig";
import { PlazeMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";
import { randomInt } from "../../framework/manager/FWFunctionCommon";
import { GS_PLAZA_MSGID } from "../../config/NetConfig";
import proto from "../common";
import { ERRID, ERRID_MSG, ROOM_RULE_ENTER } from "../../config/ConstantConfig";
import { btn_style_type } from "../../config/ViewConfig";

export enum COMBINE_ID {
}

let KIND_ID = {
    ["ddz_ab"]: <KindIDParam>{ _: "AB-1" },
}
Object.keys(KIND_ID).forEach(k => {
    KIND_ID[k] = new Proxy(KIND_ID[k], {
        get(target, p, receiver) {
            let value = Reflect.get(target, p, receiver);
            if (value == null) {
                if (p == `name`) {
                    value = k;
                } else if (p == `value`) {
                    value = -1;
                } else {
                    value = null;
                }
                Reflect.set(target, p, value, receiver);
            }
            return value;
        },
    });
    KIND_ID[KIND_ID[k]._] = KIND_ID[k];
});
export { KIND_ID }

let GAME_NULL = 0 //未知
let GAME_DDZ = 1 //斗地主
let GAME_GD = 2 //掼蛋
let GAME_DN = 3 //斗牛
let GAME_SGJ = 4 //水果机

let roomConfigType = {
    QuickRecharge: 1, //--快充配置
}

export const THIS_GAME_TYPE = GAME_DDZ
export const ROOMGROUP_GOLD = 0	//金币场
export const ROOMGROUP_MATCH = 1 //比赛场
export const ROOMGROUP_PRIVATE = 2 //私人场
export const ROOMGROUP_DIAMOND = 3 //钻石场
export const ROOMGROUP_TWO_DDZ = 4 //二人斗地主
export const ROOMGROUP_BIGAWARD_MATCH = 5 //大奖赛

export class RoomListCenter extends PlazeMainInetMsg {
    /**命令ID */
    cmd = proto.plaza_room.GS_PLAZA_ROOM_MSG
    ROOM_DROP_STATE = proto.plaza_room.ROOM_DROP_STATE
    /**游戏版本 */
    gameVersion: { [kindId: number]: number } = {}
    /**游戏名称 */
    gameName: { [kindId: number]: string } = {}
    /**返回值 */
    KIND_ID: { [P in keyof typeof KIND_ID]: number } = new Proxy(<any>KIND_ID, {
        get(target, p, receiver) {
            return target[p].value;
        },
    })
    /**当前房间KindID */
    nCurKindID: number = 0
    /**房间信息存放路径 */
    roomInfoPath: string
    /**房间信息存放路径 */
    roomInfoFile: string
    /**快充配置 */
    quickRechargeList: QuickRecharge[] = []
    /**快充版本号 */
    nQuickRechargeVersion: number = 0
    /**快充配置zip文件名称 */
    quickRechargeZipFile: string = `quickrecharge.zip`
    /**快充配置json文件名称 */
    quickRechargeJsonFile: string = `quickrecharge.json`
    /**快充配置zip文件路径 */
    quickRechargeZipFilePath: string = `${this.quickRechargeZipFile}`
    /**快充配置json文件路径 */
    quickRechargeJsonFilePath: string = `${this.quickRechargeJsonFile}`



    /**正在请求进入的房间id */
    declare mRequestKindID: any
    /**房间信息 */
    declare mRoomInfo: any
    /**房间组合信息 */
    declare mRoomCombine: { [key: number]: number[] }
    /**需要显示房间人数的房间列表 */
    declare mNeedNumKindId: any[]
    /**房间是否开启 */
    declare m_kindID_open: { [key: number]: boolean }
    /**房间显示控制信息 */
    declare roomControlList: proto.plaza_room.IRoomControlBase[]
    declare rummyLayerScheduler: any
    /**房间配置刷新标记 */
    declare mRoomRefConfigFlag: { [key: number]: boolean }
    declare mRoomInfoVersion: any
    mRoomSortInfo;
    m_roomVaildList: any[];
    mChangeGameServerId: number;
    /**初始化数据 */
    initData() {
        this.initMainID(GS_PLAZA_MSGID.GS_PLAZA_MSGID_ROOM);
        this.roomInfoPath = `${app.file.getFileDir(app.file.FileDir.Config)}`;;
        this.roomInfoFile = `${this.roomInfoPath}tableinfo.json`;
        this.quickRechargeZipFilePath = `${this.roomInfoPath}${this.quickRechargeZipFile}`;
        this.quickRechargeJsonFilePath = `${this.roomInfoPath}${this.quickRechargeJsonFile}`;

        this.m_kindID_open = {};
        this.mChangeGameServerId = 0
        this.initRoomInfo();
        this.updateQuickRechargeConfig();
    }

    cleanUserData() {

    }

    initRegister() {
        this.bindMessage({
            struct: proto.plaza_room.gs_get_room_list_c,
            cmd: this.cmd.PLAZA_ROOM_GETLIST,
        });
        this.bindMessage({
            struct: proto.plaza_room.gs_room_get_serverid_c,
            cmd: this.cmd.PLAZA_ROOM_GETSERVERID,
        });
        this.bindMessage({
            struct: proto.plaza_room.gs_room_server_id_ret_s,
            cmd: this.cmd.PLAZA_ROOM_SERVERIDRET,
            callback: this.PLAZA_ROOM_SERVERIDRET.bind(this),
        });
        this.bindMessage({
            struct: proto.plaza_room.gs_room_quick_recharge_c,
            cmd: this.cmd.PLAZA_ROOM_QUICKRECHARGE,
        });
        this.bindMessage({
            struct: proto.plaza_room.gs_room_rmb_order_s,
            cmd: this.cmd.PLAZA_ROOM_RMBORDER,
            callback: this.PLAZA_ROOM_RMBORDER.bind(this),
        });
        this.bindMessage({
            struct: proto.plaza_room.gs_room_fast_play_c,
            cmd: this.cmd.PLAZA_ROOM_FASTPLAY,
        });
        this.bindMessage({
            struct: proto.plaza_room.gs_room_get_online_count_c,
            cmd: this.cmd.PLAZA_ROOM_GETONLINECOUNT,
        });
        this.bindMessage({
            struct: proto.plaza_room.gs_room_get_online_count_ret_s,
            cmd: this.cmd.PLAZA_ROOM_GETONLINECOUNTRET,
            callback: this.PLAZA_ROOM_GETONLINECOUNTRET.bind(this),
        });
        this.bindMessage({
            struct: proto.plaza_room.gs_gold_room_list_ret_ex_s,
            cmd: this.cmd.PLAZA_ROOM_GOLDLISTRETEX,
            callback: this.PLAZA_ROOM_GOLDLISTRETEX.bind(this),
        });
        this.bindMessage({
            struct: proto.plaza_room.gs_match_room_list_ret_ex_s,
            cmd: this.cmd.PLAZA_ROOM_MATCHLISTRETEX,
            callback: this.PLAZA_ROOM_MATCHLISTRETEX.bind(this),
        });
        this.bindMessage({
            struct: proto.plaza_room.gs_server_id_list_s,
            cmd: this.cmd.PLAZA_ROOM_SERVERID_LIST,
            callback: this.PLAZA_ROOM_SERVERID_LIST.bind(this),
        });
        this.bindMessage({
            struct: proto.plaza_room.gs_customroom_control_s,
            cmd: this.cmd.PLAZA_ROOM_ROOM_CONTROL,
            callback: this.PLAZA_ROOM_ROOM_CONTROL.bind(this),
        });
        this.bindMessage({
            struct: proto.plaza_room.gs_gold_roomlist_modify_s,
            cmd: this.cmd.PLAZA_ROOM_GOLD_LIST_MODIFY,
            callback: this.PLAZA_ROOM_GOLD_LIST_MODIFY.bind(this),
        });
        this.bindMessage({
            struct: proto.plaza_room.gs_cfg_change_notify,
            cmd: this.cmd.PLAZA_ROOM_CFG_CHANGE_NOTIFY,
            callback: this.PLAZA_ROOM_QUICK_RECHARGE.bind(this),
        });
        this.bindMessage({
            struct: proto.plaza_room.gs_room_combine_ret_s,
            cmd: this.cmd.PLAZA_ROOM_ROOM_COMBINE_RET,
            callback: this.PLAZA_ROOM_ROOM_COMBINE_RET.bind(this),
        });
        this.bindMessage({
            struct: proto.plaza_room.gs_room_longhu_wingolds_actor_s,
            cmd: this.cmd.PLAZA_ROOM_LONGHUBATTLE_WINGOLD,
            callback: this.PLAZA_ROOM_LONGHUBATTLE_WINGOLD.bind(this),
        });
        this.bindMessage({
            struct: proto.plaza_room.gs_room_ref_cfg_s,
            cmd: this.cmd.PLAZA_ROOM_REFCONFIG,
            callback: this.PLAZA_ROOM_REFCONFIG.bind(this),
        });
        this.bindMessage({
            struct: proto.plaza_room.gs_get_bairen_winmax_actor_info_req_c,
            cmd: this.cmd.PLAZA_ROOM_BAIREN_WINGOLD_REQ,
        });
        this.bindMessage({
            struct: proto.plaza_room.gs_get_bairen_winmax_actor_info_ret_s,
            cmd: this.cmd.PLAZA_ROOM_BAIREN_WINGOLD_RET,
            callback: this.PLAZA_ROOM_BAIREN_WINGOLD_RET.bind(this),
        });
        this.bindMessage({
            struct: proto.plaza_room.gs_room_game_update_notify_s,
            cmd: this.cmd.PLAZA_ROOM_GAME_UPDATE_NOTIFY,
            callback: this.OnRecv_PlazaRoomGameUpdateNotify.bind(this),
        });
    }
    /**设置游戏版本 */
    setGameVersion(kindId: number, version: number | string) {
        this.gameVersion[kindId] = Number(version);
    }
    /**获取游戏版本 */
    getGameVersion(kindId: number): number {
        return this.gameVersion[kindId] ?? 0;
    }
    /**设置游戏名称 */
    setGameName(kindId: number, name: string) {
        this.gameName[kindId] = name;
    }
    /**获取游戏名称 */
    getGameName(kindId: number): string {
        return this.gameName[kindId] ?? ``;
    }
    /**进入上一次玩的房间 */
    @fw.Decorator.TryCatch(false)
    checkEnterLastPlayRoom(data: any) {
        let lastRoomDataStr = app.file.getStringForKey("LastEnterRoomData", null, { all: true });
        if (lastRoomDataStr && lastRoomDataStr != "") {
            let lastRoomData = JSON.safeParse(lastRoomDataStr);
            if (data.customCallback) {
                return data.customCallback(lastRoomData, data);
            } else {
                this.sendGetRoomServerId(lastRoomData.kindId);
                return true;
            }
        }
        return false;
    }
    /**刷新KindID */
    updateKindID() {
        app.func.traversalObject(this.mRoomInfo, (element: any) => {
            KIND_ID[element.szTitle] && (KIND_ID[element.szTitle].value = element.kindId);
        });
    }
    /**是否是练习场，罗列所有的练习场 */
    isPracticeRoom(nKindID?: number) {
        let KIND_ID = center.roomList.KIND_ID;
        return {
        }[nKindID ?? center.roomList.nCurKindID ?? NaN];
    }
    /**更新金币场KindID */
    updateGoldRoomArray() {
        //配置更新重置kindid为负数
        app.func.traversalObject(KIND_ID, (element: any) => {
            element.value > 0 && (element.value = -element.value);
        });
        this.updateKindID();
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_ROOM_KIND_ID_CHANGE,
        });
    }
    /**获得房间配置信息 */
    getRoomInfo(kindId: number) {
        let snKindID = kindId;
        for (const k in this.mRoomInfo) {
            const v = this.mRoomInfo[k];
            if (v.kindId == snKindID) {
                let userGroupInfo = center.user.getUserGroupData();
                if (userGroupInfo.length > 0) {
                    for (let index = 0; index < userGroupInfo.length; index++) {
                        const KindID = userGroupInfo[index];
                        if (KindID == snKindID) {
                            return v;
                        }
                    }
                } else {
                    return v;
                }
            }
        }
    }

    getCombineIDKindId(kindID) {
        for (const i in this.mRoomCombine) {
            const group = this.mRoomCombine[i];
            for (const k in group) {
                const v = group[k];
                if ((v) == (kindID)) {
                    return i
                }
            }
        }
    }

    /** 传入CombineID 返回该分组下的所有kinds*/
    getKindsByCombineID(combineID: number): number[] {
        for (const i in this.mRoomCombine) {
            if (Number(i) == combineID) {
                return this.mRoomCombine[i];
            }
        }
        return [];
    }

    getCanEntryByGroup(CombineID) {
        let group = this.mRoomCombine[CombineID]
        if (group) {
            for (const k in group) {
                const v = group[k];
                if (v > 0 && this.checkCanEnterRoom(v)) {
                    return v
                }
            }
        }
    }

    @fw.Decorator.IntervalExecution(60)
    refreshRoomPlayNum() {
        this.sendGetOnlineCount()
    }

    getNeednumKindId() {
        let needNumKindId = []
        let preCombineId = [
            COMBINE_ID.rummy_point,
            COMBINE_ID.rummy_10,
            COMBINE_ID.rummy_pool,
            COMBINE_ID.rummy_deals,
            COMBINE_ID.rummy_point_practice,
            COMBINE_ID.rummy_10_practice,
            COMBINE_ID.rummy_pool_practice,
            COMBINE_ID.rummy_deals_practice,
            COMBINE_ID.teenPatti,
            COMBINE_ID.teenPatti_AK47,
            COMBINE_ID.teenPatti_practice,
            COMBINE_ID.teenPatti_AK47_practice,
            COMBINE_ID.ab,
            COMBINE_ID.ab_point
        ]

        preCombineId.forEach(v => {
            if (this.mRoomCombine[v]) {
                for (const key in this.mRoomCombine[v]) {
                    const kindId = this.mRoomCombine[v][key];
                    for (const i in this.mRoomInfo) {
                        const roomInfo = this.mRoomInfo[i];
                        if (roomInfo.kindId == kindId) {
                            needNumKindId.push(kindId)
                        }
                    }
                }
            }
        })
        this.mNeedNumKindId = needNumKindId
    }

    getRoomCombineByCombineID(combineID) {
        return this.mRoomCombine[combineID] ?? [];
    }

    getRoomCombineByCombineIDAndPlayerNum(combineID: number, playerNum?: number) {
        let combineID_room = this.mRoomCombine[combineID] ?? [];
        let showList = [];
        combineID_room.forEach((v: number) => {
            let info = this.getRoomInfo(v)
            if (info && this.isKindIDOpen(v)) {
                if (info.kindId != KIND_ID.ddz_rummyGuide) {
                    if (playerNum) {
                        if (playerNum != 0) {
                            if (info.btMaxTablePlayers == playerNum) {
                                showList.push(info);
                            }
                        } else {
                            showList.push(info);
                        }
                    } else {
                        showList.push(info);
                    }
                }
            }
        });
        return showList;
    }

    isKindIDOpen(kindID: number) {
        return this.m_kindID_open[kindID] == true
    }

    checkRummyLayerMode() {
        let goldStatement = center.user.getGameStatement()
        // true 开启屏蔽
        let modeStatus = false
        if (this.roomControlList && this.roomControlList.length > 0) {
            let nUnlockGold = this.roomControlList[0].unlock_gold;
            if (nUnlockGold == 0) {
                modeStatus = false
            } else if (nUnlockGold == 1) {
                modeStatus = true
            }
        }
        return modeStatus
    }

    checkCanEnterRoom(kindID, isShowTips?) {
        if (this.isKindIDOpen(kindID)) {
            let { limilID } = this.getEnterRoomLimit(kindID)
            if (limilID == ROOM_RULE_ENTER.goldLimitMin) {
                if (isShowTips) {
                    app.popup.showToast({ text: fw.language.get("There is not enough money") });
                }
                return false
            } else if (limilID == ROOM_RULE_ENTER.goldLimitMax) {
                if (isShowTips) {
                    app.popup.showToast({ text: fw.language.get("You have too much money, you can go to a high-level table.") });
                }
                return false
            } else if (limilID == ROOM_RULE_ENTER.roomConfigLimit) {
                return false
            } else if (limilID == ROOM_RULE_ENTER.noLimit) {
                return true
            }
        }
        return false
    }

    getEnterRoomLimit(kindID) {
        let room = this.getRoomInfo(kindID)
        if (room) {
            let LimitRule = room.LimitRule
            let nSignUpMustGold = (LimitRule[ROOM_RULE_ENTER.gold].nMinValue) //下限
            let nSignUpMustGoldMax = (LimitRule[ROOM_RULE_ENTER.gold].nMaxValue) //上限
            let gold = (center.user.getActorProp(ACTOR.ACTOR_PROP_GOLD))

            if (gold < nSignUpMustGold) {
                return {
                    limilID: ROOM_RULE_ENTER.goldLimitMin,
                    gold: gold,
                    offset: nSignUpMustGold - gold,
                }
            } else if (gold > nSignUpMustGoldMax) {
                return {
                    limilID: ROOM_RULE_ENTER.goldLimitMax,
                    gold: gold,
                    offset: gold - nSignUpMustGoldMax,
                }
            } else {
                return {
                    limilID: ROOM_RULE_ENTER.noLimit
                }
            }
        }
        return {
            limilID: ROOM_RULE_ENTER.roomConfigLimit
        }
    }

    gotoRoom(data: {
        kindId?: number,
        haveRoomInfoCallback?: Function,
        noRoomInfoCallback?: Function,
        callback?: Function,
    } = {}) {
        //游戏KindID，必传
        if (!data.kindId) {
            return
        }
        //获取房间信息
        let room = this.getRoomInfo(data.kindId)
        if (room) {
            //是否有特殊处理方式
            if (data.haveRoomInfoCallback) {
                data.haveRoomInfoCallback(
                    data,
                    [
                        room = room
                    ]
                )
            } else {
                this.sendGetRoomServerId(room.kindId)
            }
        } else {
            //是否有特殊处理方式
            if (data.noRoomInfoCallback) {
                data.noRoomInfoCallback(data)
            } else {
                app.popup.showToast({ text: fw.language.get("no config") });
            }
        }
        //执行回调
        if (data.callback) {
            data.callback(
                data,
                [
                    room = room
                ]
            )
        }
    }

    initRoomInfo() {
        this.mRoomInfo = {}
        this.mRoomRefConfigFlag = {}
        this.loadRoomInfo()
    }

    loadRoomInfo() {
        if (!this.loadDownloadRoomInfo()) {
            this.loadDefaultRoomInfo()
        }
    }

    loadRoomSortInfo() {
        let url = httpConfig.path_pay + "OtherApi/datingsort"
        let params = {
            user_type: app.native.device.getOperatorsID(),
            user_sub_type: app.native.device.getOperatorsSubID(),
            timestamp: app.func.time(),
        }
        app.http.post(
            {
                url: url,
                params: params,
                callback: function (bSuccess, content) {
                    if (bSuccess) {
                        let result = content;
                        if (result) {
                            fw.print(result, "loadRoomSortInfo")
                            if (result.status == 1) {
                                this.mRoomSortInfo = result.data
                            }
                        }
                    }
                },
            }
        )
    }

    @fw.Decorator.TryCatch(false)
    loadDownloadRoomInfo() {
        // if (app.func.isBrowser()) {
        //     let roomInfoList = JSON.safeParse(app.file.getStringForKey(this.roomInfoFile, "", { all: true }))
        //     if (roomInfoList) {
        //         return this.safeUpdateRoomInfoByPhp(roomInfoList)
        //     }
        //     return false
        // }
        // let roomInfoList = JSON.safeParse(app.file.getStringFromFile({ finalPath: this.roomInfoFile }))
        // if (roomInfoList) {
        //     return this.safeUpdateRoomInfoByPhp(roomInfoList)
        // }
        return false
    }

    loadDefaultRoomInfo() {
        //调整本地project的下载地址
        // let resConfig = fw.BundleConfig.resources.res["tableinfo"];
        // this.loadBundleRes(resConfig,(res: JsonAsset) => {
        //     try {
        //         // let roomInfoList = res.json
        //         // if (roomInfoList) {
        //         //     return this.updateRoomInfoByPhp(roomInfoList)
        //         // }
        //     } catch (error) {
        //         fw.printError(error)
        //     }
        // })
    }

    safeUpdateRoomInfoByPhp(data) {
        try {
            this.updateRoomInfoByPhp(data)
        } catch (e) {
            return false
        }
        return true
    }

    updateRoomInfoByPhp(data) {
        this.mRoomInfoVersion = data.version;
        let roomlist = data.roomlist || [];
        roomlist.forEach(roomInfo => {
            this.updateRoomInfoItem(roomInfo);
        })
        this.updateGoldRoomArray();
        this.refreshRoomInfoActorCount();
    }
    updateRoomInfoItem(roomInfo) {
        // fw.print(roomInfo, " ==========updateRoomInfoItem======== ")
        let nRID = roomInfo.quick_0
        if (app.func.isIOS()) {
            nRID = roomInfo.quick_2
        } else if (app.func.isAndroid()) {
            nRID = roomInfo.quick_1
        } else if (app.func.isWin32()) {
            nRID = roomInfo.quick_0
        }
        // 假人数配置计算
        let base_online = roomInfo.base_online && roomInfo.base_online.split(",") || []
        // 23 点到 0 点的循环
        base_online[25] = base_online[1]

        let online_num = []
        // 将24小时按每10分钟划分为 144片段
        for (let i = 0; i < 24; i++) {
            let startNum = Number(base_online[i])
            let endNum = Number(base_online[i + 1])
            let offset = (endNum - startNum) / 6
            for (let j = 0; j < 5; j++) {
                online_num[(i - 1) * 6 + j] = Number(startNum + offset * j)
            }
        }
        // 23 点到 0 点的循环
        online_num[144] = online_num[0]

        let tonumberTable = function (t) {
            for (const i in t) {
                t[i] = Number(t[i]);
            }
        }

        let kindId = roomInfo.room_id
        let updateKey = {
            nRID: nRID,
            kindId: kindId,
            groupType: roomInfo.roomtype,
            gameType: THIS_GAME_TYPE,
            roomType: roomInfo.room_type, //房间类型
            nPicID: roomInfo.picid,
            nTax: (roomInfo.tax),
            nSortID: (roomInfo.sort),
            btMaxTablePlayers: (roomInfo.max_players),
            LimitRule: [
                {
                    nMaxValue: (roomInfo.max_gold),
                    nMinValue: (roomInfo.min_gold)
                },
                {
                    nMaxValue: (roomInfo.max_score),
                    nMinValue: (roomInfo.min_score)
                },
                {
                    nMaxValue: (roomInfo.max_exper),
                    nMinValue: (roomInfo.min_exper)
                }
            ],
            IsParctiseRoom: (roomInfo.is_practise),
            szTitle: (roomInfo.title),
            szName: (roomInfo.name),
            nBaseScore: (roomInfo.base_gold),
            nKickoutLimit: (roomInfo.kickout),
            winloseglod: roomInfo.winloseglod && roomInfo.winloseglod.split("*") || [],
            online_num: online_num,
            ChipRechargeLimit: typeof roomInfo.ChipRechargeLimit == "string" ? (roomInfo.ChipRechargeLimit as string).split("-").map(v=>parseInt(v)) : [],
            recochip: roomInfo.recochip ? roomInfo.recochip.split("-") : [],
        }
        tonumberTable(updateKey.winloseglod);
        tonumberTable(updateKey.recochip);


        if (!this.mRoomInfo[kindId]) {
            this.mRoomInfo[kindId] = []
            this.mRoomInfo[kindId].nActorCount = 0
        }
        for (const key in updateKey) {
            const val = updateKey[key];
            this.mRoomInfo[kindId][key] = val
        }
    }

    // 客户端假刷新
    refreshRoomInfoActorCount() {
        let date = new Date();
        for (const i in this.mRoomInfo) {
            const roomInfo = this.mRoomInfo[i];
            let online_num = roomInfo.online_num
            if (online_num) {

                let hour = date.getHours()
                let min = date.getMinutes()
                let curIndex = hour * 6 + Math.floor(min / 10)
                roomInfo.nActorCount = randomInt(online_num[curIndex], online_num[curIndex + 1])
            }
        }
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_ROOM_ONLINECOUNT_RETURN,
        })
    }

    downloadRoomInfoFail() {

    }

    downloadRoomInfo(version, md5Str?) {
        if (this.mRoomInfoVersion == version) {
            return
        }
        let params = {
            version: version
        }
        let url = httpConfig.path_url + "xmlgz/tableinfo.zip"
        let savePath = this.roomInfoPath + "tableinfo.zip"
        fw.print("savePath", savePath)
        fw.print("roomInfoPath", this.roomInfoPath)
        // if ( ZipUtils:doUncompress(savePath,this.roomInfoPath) ) {
        // 	fw.print("=========================")
        // }
        app.http.get(
            {
                url: url,
                params: params,
                responseType: "arraybuffer",
                callback: (bSuccess, content) => {
                    if (bSuccess) {
                        let uint8Array = new Uint8Array(content)
                        let fileMd5 = app.md5.hashArrayBuffer(uint8Array, false);
                        if (!md5Str || fileMd5 == md5Str) {
                            if (app.func.isBrowser()) {
                                let unzip = new Zlib.Unzip(uint8Array)
                                unzip.getFilenames().forEach(element => {
                                    var uint8ArrayData = unzip.decompress(element);
                                    app.file.setStringForKey(this.roomInfoPath + element, app.func.utf8ToString(uint8ArrayData), { all: true })
                                })
                                this.loadRoomInfo()
                                return;
                            }
                            app.file.writeDataToFile({
                                fileData: uint8Array,
                                finalPath: savePath,
                            })
                            app.file.unzipFile({
                                inFilePath: savePath,
                                outFilePath: this.roomInfoPath,
                                callback: (bUnzipState, data) => {
                                    if (bUnzipState) {
                                        this.loadRoomInfo()
                                    } else {
                                        this.downloadRoomInfoFail()
                                    }
                                }
                            })
                        } else {
                            this.downloadRoomInfoFail()
                        }
                    } else {
                        this.downloadRoomInfoFail()
                    }
                },
            }
        )
    }

    getPlazeSortValue(id) {
        return (this.mRoomSortInfo && this.mRoomSortInfo[id]) || 10000
    }

    setVaildRoomList(roomVaildList: any[]) {
        this.m_roomVaildList = roomVaildList
    }

    getVaildRoomList() {
        return this.m_roomVaildList
    }

    /**获取快充配置 */
    getQuickRecharge(nRid: number): QuickRecharge {
        let result: QuickRecharge = null;
        app.func.positiveTraversal(this.quickRechargeList, (element) => {
            if (element.nRID == nRid) {
                result = element;
            }
        });
        return result;
    }
    private m_curLuaVer;
    public setCurLuaVer(ver) {
        this.m_curLuaVer = ver;
    }

    public getCurLuaVer() {
        return this.m_curLuaVer;
    }

    /**下载快充配置 */
    doPhpQuickRecharge(nNewVersion: number | string) {
        if (!nNewVersion) {
            return;
        }
        if (this.nQuickRechargeVersion == nNewVersion) {
            return;
        }
        app.http.get({
            url: `${httpConfig.path_url}xmlgz/${this.quickRechargeZipFile}`,
            responseType: "arraybuffer",
            params: {
                version: nNewVersion,
            },
            callback: (bSuccess, response) => {
                if (bSuccess) {
                    if (app.func.isBrowser()) {
                        let unzip = new Zlib.Unzip(new Uint8Array(response));
                        unzip.getFilenames().forEach(element => {
                            this.updateQuickRechargeConfig(JSON.safeParse(app.func.utf8ToString(unzip.decompress(element))));
                        });
                    } else {
                        app.file.writeDataToFile({
                            fileData: response,
                            finalPath: this.quickRechargeZipFilePath,
                        });
                        app.file.unzipFile({
                            inFilePath: this.quickRechargeZipFilePath,
                            outFilePath: this.roomInfoPath,
                            callback: (bUnzipState, data) => {
                                if (bUnzipState) {
                                    this.updateQuickRechargeConfig();
                                } else {
                                    this.downloadQuickRechargeFail();
                                }
                            }
                        });
                    }
                } else {
                    fw.printError("RequestInfo failed")
                }
            }
        });
    }
    /**刷新快充配置 */
    updateQuickRechargeConfig(data?: any) {
        let config: any;
        if (data) {
            config = data;
        } else {
            if (app.file.notSupport()) {
                return;
            }
            if (app.file.isFileExist(this.quickRechargeJsonFilePath)) {
                config = JSON.safeParse(app.file.getStringFromFile({ finalPath: this.quickRechargeJsonFilePath }))
            } else {
                if (app.file.isFileExist(this.quickRechargeZipFilePath)) {
                    app.file.unzipFile({
                        inFilePath: this.quickRechargeZipFilePath,
                        outFilePath: this.roomInfoPath,
                        callback: (bUnzipState, data) => {
                            if (bUnzipState) {
                                this.updateQuickRechargeConfig();
                            } else {
                                this.downloadQuickRechargeFail();
                            }
                        }
                    });
                    return;
                } else {
                    config = { version: ``, quicklist: [] };
                }
            }
        }
        this.nQuickRechargeVersion = config.version;
        if (config.quicklist) {
            config.quicklist.forEach((v, k) => {
                let nQuickGiveGoodsID = [0, 0, 0]
                let nQuickGiveGoodsNum = [0, 0, 0]
                if (v.give_goods != "") {
                    let splitList = v.give_goods.split("|")
                    if (splitList) {
                        splitList.forEach((vEx, kEx) => {
                            let splitContent = vEx.split(",")
                            if (splitContent) {
                                nQuickGiveGoodsID[kEx] = Number(splitContent[0])
                                nQuickGiveGoodsNum[kEx] = Number(splitContent[1])
                            }
                        })
                    }
                }
                config.quicklist[k] = {
                    nRID: v.sdk_id,
                    nQuickGoodsID: v.goods_id,
                    nQuickGoodsNum: v.goods_num,
                    nQuickNeedRMB: v.price,
                    szQuickTitle: v.title,
                    quickPayIcon: v.thumb_icon,
                    nQuicktype: v.quick_type,
                    nPriceCost: v.srcprice,
                    nQuickGiveGoodsID: nQuickGiveGoodsID,
                    nQuickGiveGoodsNum: nQuickGiveGoodsNum,
                }
            })
            this.quickRechargeList = config.quicklist
        }
    }

    downloadQuickRechargeFail() {

    }

    /********************************************/
    /********************************************/
    /*****************消息收发begin***************/
    /********************************************/
    /********************************************/
    //返回一个可进入的房间服务ID
    PLAZA_ROOM_SERVERIDRET(dict: proto.plaza_room.Igs_room_server_id_ret_s) {
        app.popup.closeLoading()

        // 正常进入房间流程
        this.setGameName(dict.kind_id, dict.game_name)
        this.setGameVersion(dict.kind_id, dict.version)

        let enterGame = () => {
            if (dict.game_name == "" || dict.version == "") {
                app.popup.showTip({ text: fw.language.get("Please contact us, the current game version is wrong") })
                return
            }
            if (dict.server_id <= 0) {
                app.popup.showTip({ text: fw.language.get("no server ID") })
                return
            }
            fw.print(dict.game_name);
            this.nCurKindID = dict.kind_id;
            app.gameManager.gotoGame(dict.game_name, {
                nServerID: dict.server_id,
            })
        }

        // 断线重连
        //0:全新进入 1:掉线重入 2:大厅版本不对 3:捕鱼房间配置不存在4:房间配置不存在 5:单房间停服 6:进入规则限制
        if (dict.drop_state == this.ROOM_DROP_STATE.ENTER) {
            fw.print("正常进入")
            enterGame()
            return
        }

        if (dict.drop_state == this.ROOM_DROP_STATE.DROP_ENTER) {
            if (this.mRequestKindID > 0 && this.mRequestKindID != dict.kind_id) {
                let sureFunc = function () {
                    enterGame();
                }
                let closeFunc = function () {
                    fw.scene.changeScene(fw.SceneConfigs.plaza);
                }
                app.popup.showTip({
                    text: `You have a game in progress, would you like to return to it?`,
                    closeCallback: closeFunc,
                    btnList: [
                        {
                            styleId: 1,
                            callback: sureFunc,
                        },
                    ],
                });
            } else {
                enterGame();
            }
            return;
        }
        if (dict.drop_state == this.ROOM_DROP_STATE.ERROR_VERSION) {
            fw.print("断线重连")
            let sureFunc = function () {
                fw.scene.changePlazaUpdate();
            }
            let closeFunc = function () {
                fw.scene.changeScene(fw.SceneConfigs.plaza);
            }
            app.popup.showTip({
                text: fw.language.get("has new plaza version need update"),
                closeCallback: closeFunc,
                btnList: [
                    {
                        styleId: 1,
                        callback: sureFunc,
                    },
                ],
            })
            return
        }
        if (dict.drop_state == this.ROOM_DROP_STATE.FISH_ROOM_INVALID) {
            fw.print("断线重连")
            let sureFunc = function () {
                fw.scene.changeScene(fw.SceneConfigs.plaza);
            }
            let closeFunc = function () {
                fw.scene.changeScene(fw.SceneConfigs.plaza);
            }
            app.popup.showTip({
                text: fw.language.get("fish config invalid"),
                closeCallback: closeFunc,
                btnList: [
                    {
                        styleId: 1,
                        callback: sureFunc,
                    },
                ],
            })
            return
        }
        if (dict.drop_state == this.ROOM_DROP_STATE.ROOM_INVALID) {
            fw.print("房间配置错误")
            let sureFunc = function () {
                fw.scene.changeScene(fw.SceneConfigs.plaza);
            }
            let closeFunc = function () {
                fw.scene.changeScene(fw.SceneConfigs.plaza);
            }
            app.popup.showTip({
                text: fw.language.get("config invalid"),
                closeCallback: closeFunc,
                btnList: [
                    {
                        styleId: 1,
                        callback: sureFunc,
                    },
                ],
            })
            return
        }
        if (dict.drop_state == this.ROOM_DROP_STATE.MAINTENANCE) {
            fw.print("房间停服")
            let sureFunc = function () {
                fw.scene.changeScene(fw.SceneConfigs.plaza);
            }
            let closeFunc = function () {
                fw.scene.changeScene(fw.SceneConfigs.plaza);
            }
            app.popup.showTip({
                text: fw.language.get("Game service discontinued"),
                closeCallback: closeFunc,
                btnList: [
                    {
                        styleId: 1,
                        callback: sureFunc,
                    },
                ],
            })
            return
        }
        if (dict.drop_state == this.ROOM_DROP_STATE.RULE_LIMIT) {
            let { limilID } = this.getEnterRoomLimit(dict.kind_id)
            if (limilID == ROOM_RULE_ENTER.goldLimitMin) {
                app.popup.showToast({ text: fw.language.get("You don't have enough money to bet.Deposit to unlock levels faster.") })
            } else if (limilID == ROOM_RULE_ENTER.goldLimitMax) {
                let sureFunc = function () {
                    fw.print("nKindIDnKindID", dict.kind_id)
                    let group = this.getCombineIDKindId(dict.kind_id)
                    if (group) {
                        let kindID = this.getCanEntryByGroup(group)
                        if (kindID) {
                            this.sendGetRoomServerId(kindID)
                            return
                        } else {
                            app.popup.showToast({ text: fw.language.get("Can't find table.") })
                        }
                    } else {
                        app.popup.showToast({ text: fw.language.get("Can't find table.") })
                    }
                    fw.scene.changeScene(fw.SceneConfigs.plaza);
                }

                let canleFunc = function () {
                    fw.scene.changeScene(fw.SceneConfigs.plaza);
                }
                app.popup.showTip({
                    text: fw.language.get("You have too much money, you can go to a high-level table."),
                    btnList: [
                        {
                            styleId: 1,
                            callback: sureFunc,
                        },
                    ],
                })
                return false
            } else if (limilID == ROOM_RULE_ENTER.roomConfigLimit) {
                fw.scene.changeScene(fw.SceneConfigs.plaza);
                app.popup.showToast({ text: fw.language.get("Can't find table.") })
            } else if (limilID == ROOM_RULE_ENTER.noLimit) {
                fw.scene.changeScene(fw.SceneConfigs.plaza);
                app.popup.showToast({ text: fw.language.get("room config error") })
            }
            return
        }
        if (dict.drop_state == this.ROOM_DROP_STATE.GAME_UPDATING) {
            app.popup.showTip({
                text: ERRID_MSG.get(ERRID.STOP_SERVER),
                btnList: [
                    {
                        styleId: btn_style_type.NORMAL,
                        callback: () => {
                            if (fw.scene.isGameScene()) {
                                app.gameManager.exitGame();
                            }
                        },
                    },
                ],
                cancelCallback: () => {
                    if (fw.scene.isGameScene()) {
                        app.gameManager.exitGame();
                    }
                }
            });
            // fw.scene.changePlazaUpdate({
            //     callback: () => {
            //         app.popup.showTip({ text: ERRID_MSG.get(ERRID.STOP_SERVER) });
            //     }
            // });
            return
        }
    }

    //RMB购买服务器返回订单号给予客户端
    PLAZA_ROOM_RMBORDER(data: proto.plaza_room.Igs_room_rmb_order_s) {
        let nRID = data.rid;
        let lRMB = data.rmb;
        let szOrder = data.order;
        fw.print(`(待处理)lRMB========${lRMB}, szOrder========${szOrder}, nRID========${nRID}`)
        if (nRID == app.sdk.getRId()) {
            app.event.dispatchEvent({
                eventName: EVENT_ID.EVENT_PLAZA_QUICKCHARGE,
                dict: data,
            })
        } else {
            fw.print(`(待处理)lRMB========${lRMB}, szOrder========${szOrder}, nRID========${nRID} 已过期`)
        }
    }

    //获得房间在线人数返回
    PLAZA_ROOM_GETONLINECOUNTRET(data: proto.plaza_room.Igs_room_get_online_count_ret_s) {
        // fw.print("PLAZA_ROOM_GETONLINECOUNTRET")
        // dump(dict, "PLAZA_ROOM_GETONLINECOUNTRET")
        data.list.forEach(v => {
            let uKindId = v.kind_id;
            if (!this.mRoomInfo[uKindId]) {
                this.mRoomInfo[uKindId] = {
                    nActorCount: v.count,
                }
            } else {
                this.mRoomInfo[uKindId].nActorCount = v.count;
            }
        });

        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_ROOM_ONLINECOUNT_RETURN,
        })
    }

    //金币场列表返回(新的)
    PLAZA_ROOM_GOLDLISTRETEX(data: proto.plaza_room.Igs_gold_room_list_ret_ex_s) {
        //TODO
    }

    //比赛场列表返回(新的）
    PLAZA_ROOM_MATCHLISTRETEX(data: proto.plaza_room.Igs_match_room_list_ret_ex_s) {
        //TODO
    }

    //下发房间ID
    PLAZA_ROOM_SERVERID_LIST(data: proto.plaza_room.Igs_server_id_list_s) {
        fw.print("PLAZA_ROOM_SERVERID_LIST")
        fw.print(data, "PLAZA_ROOM_SERVERID_LIST")

        let TagGetServerID = data.kind_id;
        // let szName = dict.szName
        // this.m_kindID_open[szName] = {}
        this.m_kindID_open = {}

        TagGetServerID.forEach(v => {
            if (v)
                this.m_kindID_open[v] = v > 0;
        });

        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_ROOM_KIND_ID_CHANGE,
        })
    }

    //房间显示控制信息
    PLAZA_ROOM_ROOM_CONTROL(data: proto.plaza_room.Igs_customroom_control_s) {
        //刷新数据
        // fw.print(data, "PLAZA_ROOM_ROOM_CONTROL")
        this.roomControlList = data.list;
        if (this.rummyLayerScheduler) {
            clearTimeout(this.rummyLayerScheduler);
            this.rummyLayerScheduler = null;
        }
        let update = () => {
            this.rummyLayerScheduler = setTimeout(update, 60 * 1000);
            this.checkRummyLayerMode();
        };
        update();

        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_REVIEW_CONTROL_CHANGE,
        })
    }

    //下发修改的房间配置
    PLAZA_ROOM_GOLD_LIST_MODIFY(data: proto.plaza_room.gs_gold_roomlist_modify_s) {
        //TODO
    }

    //下发快充配置
    PLAZA_ROOM_QUICK_RECHARGE(data: proto.plaza_room.gs_cfg_change_notify) {
        fw.print(data, "OnRecv_PLAZA_ROOM_CFG_CHANGE_NOTIFY")
        if (data.type == roomConfigType.QuickRecharge) {
            this.doPhpQuickRecharge(data.ver)
        }
    }

    //房间组合
    PLAZA_ROOM_ROOM_COMBINE_RET(data: proto.plaza_room.gs_room_combine_ret_s) {
        this.mRoomCombine = {};
        data.combine_data.forEach((element) => {
            this.mRoomCombine[element.combine_id] = element.kind_list;
        });
        this.getNeednumKindId();
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_ROOM_COMBINE_CHANGE,
        });
    }

    //龙虎斗赢金TUPS框
    PLAZA_ROOM_LONGHUBATTLE_WINGOLD(data: proto.plaza_room.gs_room_longhu_wingolds_actor_s) {
        //TODO
    }

    //房间配置刷新
    PLAZA_ROOM_REFCONFIG(data: proto.plaza_room.Igs_room_ref_cfg_s) {
        //刷新数据
        fw.print(data, "PLAZA_ROOM_REFCONFIG")
        let nRoomID = data.room_id;
        if (this.mRoomRefConfigFlag[nRoomID]) {
            return;
        }
        this.mRoomRefConfigFlag[nRoomID] = true;
        let params = {
            room_id: nRoomID,
            channelid: app.native.device.getOperatorsID(),
            timestamp: app.func.time(),
        }
        let url = httpConfig.path_pay + "OtherApi/getRoomConfig";
        setTimeout(
            function () {
                app.http.post(
                    {
                        url: url,
                        params: params,
                        callback: (bSuccess, content) => {
                            this.mRoomRefConfigFlag[nRoomID] = false;
                            if (bSuccess) {
                                let result = content;
                                if (result) {
                                    // fw.print(result, "requestSdkOpenInfo")
                                    if (result.status == 1) {
                                        this.updateRoomInfoItem(result.data)
                                    }
                                }
                            }
                        },
                    }
                )
            }.bind(this),
            randomInt(0, 60)
        );
    }

    PLAZA_ROOM_BAIREN_WINGOLD_RET(data: proto.plaza_room.Igs_get_bairen_winmax_actor_info_req_c) {
        //TODO
    }

    OnRecv_PlazaRoomGameUpdateNotify(data: proto.plaza_room.Igs_room_game_update_notify_s) {
        app.popup.closeLoading()
        data.tip && app.popup.showToast(data.tip);
    }
    /*********************************************/
    /*********************************************/
    /*******************send***********************/
    /*********************************************/
    /*********************************************/
    //获取房间列表
    sendGetRoomList(nGroupType: number) {
        let sData = proto.plaza_room.gs_get_room_list_c.create();
        sData.game_type = THIS_GAME_TYPE;
        sData.group_type = nGroupType;
        return this.sendData(this.cmd.PLAZA_ROOM_GETLIST, sData);
    }
    /** 相同游戏换房间*/
    sendChangeGameServer(kindId: number) {
        app.popup.showLoading();
        this.mChangeGameServerId = kindId
        gameCenter.room.sendOutRoom()
    }

    onChangeGameServer() {
        if (this.isNeedChangeGameServer()) {
            let serverid = this.mChangeGameServerId;
            this.mChangeGameServerId = 0;
            setTimeout(() => {
                this.sendGetRoomServerId(serverid)
            }, 500)
        }
    }

    isNeedChangeGameServer() {
        return this.mChangeGameServerId != 0
    }

    /**请求一个可进入的房间服务ID */
    sendGetRoomServerId(kindId: number) {
        if (!fw.isValid(kindId)) {
            return;
        }
        let info = this.getRoomInfo(kindId)
        if (info == null) {
            return
        }
        this.mRequestKindID = kindId;
        let data = proto.plaza_room.gs_room_get_serverid_c.create({
            game_type: info.gameType,
            group_type: info.groupType,
            kind_id: info.kindId,
            version: app.file.getPlazaVersion(),
        });
        //保存信息
        app.file.setStringForKey("LastEnterRoomData", JSON.stringify(data), { all: true });
        this.sendData(this.cmd.PLAZA_ROOM_GETSERVERID, data);
        app.popup.showLoading({ nAutoOutTime: 10 });
    }

    /**快充 */
    sendQuickRecharge(nRID: number) {
        let data = proto.plaza_room.gs_room_quick_recharge_c.create()
        data.rid = nRID
        this.sendData(this.cmd.PLAZA_ROOM_QUICKRECHARGE, data)
    }

    //获取在线人数
    sendGetOnlineCount() {
        fw.print("sendGetOnlineCount")
        // let data = {
        //     nListCount = roomType,
        //     uKindIDList = kindID
        // }
        // let bsuccess = this:sendData(PLAZA_ROOM_GETONLINECOUNT, "GetOnlineCount", data)
        // fw.print(bsuccess)
        // 客户端假刷新
        this.refreshRoomInfoActorCount();
    }

    //请求百人最近20局赢最多的用户那个，昵称，头像，赢金数额
    sendGetBaiRenWinMaxInfo() {
        let sData = proto.plaza_room.gs_get_bairen_winmax_actor_info_req_c.create();
        this.sendData(this.cmd.PLAZA_ROOM_BAIREN_WINGOLD_REQ, sData);
    }
    /********************************************/
    /********************************************/
    /*****************消息收发end****************/
    /********************************************/
    /********************************************/

    sendGetCrashRoomServerId() {
        if( this.isKindIDOpen(center.roomList.KIND_ID.CrashSingle) && !center.user.isGuideComplete(center.user.BITSETFLAG.SGJ_RechargeDebuffFlag) && center.user.getTotalRecharged() < 200) {
            center.roomList.sendGetRoomServerId(center.roomList.KIND_ID.CrashSingle);
        } else {
            center.roomList.sendGetRoomServerId(center.roomList.KIND_ID.Crash);
        }
    }
}


/**声明全局调用 */
declare global {
    namespace globalThis {
        type KindIDParam = {
            /**后台配置名称 */
            _?: string
            /**后台KindID值 */
            value?: number
            /**前端映射名称 */
            name?: string
        }
        interface QuickRecharge {
            nRID: number,
            nQuickGoodsID: number,
            nQuickGoodsNum: number,
            nQuickNeedRMB: number,
            szQuickTitle: string,
            quickPayIcon: string,
            nQuicktype: string,
            nPriceCost: number,
            nQuickGiveGoodsID: number[],
            nQuickGiveGoodsNum: number[],
        }
    }
}
