import { GS_PLAZA_MSGID } from "../../config/NetConfig";
import { PlazeMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";
import proto from "../common";

enum gold_id {
    /**金币 */
    cash = 22,
    /**可提现金币 */
    withdraw_gold = 23,
    /**bonus */
    bonus = 32,
}

export class goodsCenter extends PlazeMainInetMsg {
    /**命令ID */
    cmd = proto.plaza_goods.GS_PLAZA_GOODS_MSG
    /**金币相关 */
    gold_id = gold_id
    /**物品配置 */
    goodsConfig: Map<number, proto.plaza_goods.IGoodsInfo> = new Map()
    /**客户端可显示的物品列表 */
    clientGoodsIDList: any[] = []
    /**服务器物品列表 */
    serverGoodsIDList: any[] = []
    initData() {
        this.initMainID(GS_PLAZA_MSGID.GS_PLAZA_MSGID_GOODS);
    }
    cleanUserData() {
    }
    initRegister() {
        //获得物品配置信息
        this.bindMessage({
            struct: proto.plaza_goods.get_goods_info_c,
            cmd: this.cmd.PLAZA_GOODS_GETINFO,
        });
        //物品配置信息返回
        this.bindMessage({
            struct: proto.plaza_goods.goods_info_ret_s,
            cmd: this.cmd.PLAZA_GOODS_INFORETURN,
            callback: this.PLAZA_GOODS_INFORETURN.bind(this),
        });
        //物品ID列表信息
        this.bindMessage({
            struct: proto.plaza_goods.good_id_list_s,
            cmd: this.cmd.PLAZA_GOODS_GOODIDLIST,
            callback: this.PLAZA_GOODS_GOODIDLIST.bind(this),
        });
    }
    /**物品配置信息返回 */
    PLAZA_GOODS_INFORETURN(data: proto.plaza_goods.goods_info_ret_s) {
        data.goods_cfg.forEach((element: proto.plaza_goods.IGoodsInfo) => {
            this.goodsConfig.set(element.goods_id, element);
        });
        app.event.dispatchEvent({
            eventName: "PLAZA_GOODS_INFORETURN",
        });
    }
    /**物品ID列表信息 */
    PLAZA_GOODS_GOODIDLIST(data: proto.plaza_goods.good_id_list_s) {
        app.event.dispatchEvent({
            eventName: "PLAZA_GOODS_GOODIDLIST",
        });
    }
    /**获得物品配置信息 */
    send_PLAZA_GOODS_GETINFO(data?: proto.plaza_goods.get_goods_info_c) {
        this.sendMessage({
            cmd: this.cmd.PLAZA_GOODS_GETINFO,
            data: data,
        });
    }
    /**获取单个物品配置 */
    getGoodsInfo(nGoodsID: number) {
        return this.goodsConfig.has(nGoodsID) ? this.goodsConfig.get(nGoodsID) : null;
    }
    /**是否是特定Gold */
    isGold(nGoodsID: number) {
        return this.gold_id[nGoodsID] != null;
    }
    /**是否是特定Gold */
    isGoldMerge(nGoodsID: number) {
        let flag = false
        switch (nGoodsID) {
            case center.goods.gold_id.cash:
            case center.goods.gold_id.withdraw_gold:
                flag = true
                break;
            default:
                flag = false
                break;
        }
        return flag
    }
}
