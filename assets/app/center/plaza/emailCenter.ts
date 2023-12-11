import { EVENT_ID } from "../../config/EventConfig";
import { GS_PLAZA_MSGID, sint, sint64, slong, stchar, stcharend, uchar, ushort, ushortlen } from "../../config/NetConfig";
import { PlazeMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";
import proto from "../common";

export enum EmailType {
    EMAILSTATE_NEW = 0, //新邮件
    EMAILSTATE_OPEN = 1, //已查看邮件
    EMAILSTATE_CLOSE = 2, //已关闭邮件
    EMAILSTATE_WITHDRAW = 32, //提现邮件类型
}

export class emailCenter extends PlazeMainInetMsg {
    /**命令ID */
    cmd = proto.plaza_email.GS_PLAZA_EMAIL_MSG
    /**邮件类型 */
    EmailType = EmailType
    /**邮件列表 */
    emailList: proto.plaza_email.IEmailViewItem[] = []
    /**邮件内容列表 */
    emailContentList: proto.plaza_email.Iemail_view_text_ret_s[] = []
    /**邮件分类类型 */
    EmailClassType = {
        All: -1, //所有
        Other: 0, //其它
        Withdraw: 32, //提现
        Recharge: 40, //？？？
        Service: 41, //？？？
        Refer: 30, //？？？
        Bonus: 38, //？？？
    }
    initData() {
        this.initMainID(GS_PLAZA_MSGID.GS_PLAZA_MSGID_EMAIL);
        this.cleanUserData();
    }
    
    cleanUserData() {
    }
    initRegister() {
        //增加一封新邮件
        this.bindMessage({
            struct: proto.plaza_email.email_new_s,
            cmd: this.cmd.PLAZA_EMAIL_ADDNEW,
            callback: this.OnRecv_EmailAdd.bind(this)
        });

        //邮件系统提示信息
        this.bindMessage({
            struct: proto.plaza_email.email_tips_s,
            cmd: this.cmd.PLAZA_EMALI_TIPS,
            callback: this.OnRecv_EmailTips.bind(this)
        });
        //提取附件
        this.bindMessage({
            struct: proto.plaza_email.email_pick_c,
            cmd: this.cmd.PLAZA_EMAIL_PICK,
        });
        //提取附件返回
        this.bindMessage({
            struct: proto.plaza_email.email_pick_ret_s,
            cmd: this.cmd.PLAZA_EMAIL_PICKRETURN,
            callback: this.OnRecv_EmailPickReturn.bind(this)
        });
        //浏览邮件正文
        this.bindMessage({
            struct: proto.plaza_email.email_view_text_c,
            cmd: this.cmd.PLAZA_EMAIL_VIEWTEXT,
        });
        //浏览正文返回
        this.bindMessage({
            struct: proto.plaza_email.email_view_text_ret_s,
            cmd: this.cmd.PLAZA_EMAIL_VIEWTEXTRETURN,
            callback: this.OnRecv_EmailViewTextReturn.bind(this),
        });
        this.bindMessage({
            struct: proto.plaza_email.email_view_c,
            cmd: this.cmd.PLAZA_EMAIL_VIEW,
        });
        //浏览邮件返回
        this.bindMessage({
            struct: proto.plaza_email.email_view_return_s,
            cmd: this.cmd.PLAZA_EMAIL_VIEWRETURN,
            callback: this.OnRecv_EmailViewReturn.bind(this),
        });
        //一键领取
        this.bindMessage({
            struct: proto.plaza_email.email_akey_to_get_c,
            cmd: this.cmd.PLAZA_EMAIL_A_KEY_TO_GET,
        });
        //一键领取返回
        this.bindMessage({
            struct: proto.plaza_email.email_akey_to_get_s,
            cmd: this.cmd.PLAZA_EMAIL_A_KEY_TO_GET_RET,
            callback: this.OnRecv_AKeyToGetRet.bind(this),
        });
    }
    /**增加一封新邮件 */
    OnRecv_EmailAdd(data: proto.plaza_email.email_new_s) {
        this.emailList.push(data.item);
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_EMAIL_EMAIL_ADD,
        });
    }
    /**邮件系统提示信息 */
    OnRecv_EmailTips(data: proto.plaza_email.email_tips_s) {
        app.popup.showToast(data.msg);
    }
    /**提取附件返回 */
    OnRecv_EmailPickReturn(data: proto.plaza_email.email_pick_ret_s) {
        //设置邮件状态
        this.setEmailState(data.email_id, 2);
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_EMAIL_PICK_RETURN,
            data: data,
        });
    }
    /**浏览正文返回 */
    OnRecv_EmailViewTextReturn(data: proto.plaza_email.IEmailViewItem) {
        //删除旧邮件
        this.delEmailContent(data.email_id);
        //添加新邮件
        this.emailContentList.push(data);
        //调整状态
        this.setEmailState(data.email_id, data.state);
        //发送事件
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_EMAIL_TEXT_RETURN,
            data: data,
        });
    }
    /**浏览邮件返回 */
    OnRecv_EmailViewReturn(data: proto.plaza_email.email_view_return_s) {
        //重置列表
        this.emailList = data.item;
        //排序
        this.emailList.sort((a, b) => {
            if (a.state != b.state) {
                return a.state - b.state;
            } else {
                return b.send_time - a.send_time;
            }
        });
        //发送事件
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_EMAIL_VIEW_RETURN,
            data: data,
        });
    }
    /**一键领取返回 */
    OnRecv_AKeyToGetRet(data: proto.plaza_email.email_akey_to_get_s) {
        let goodsArray: RewardItem[] = []
        if (data.golds > 0) {
            goodsArray.push({
                nGoodsID: center.goods.gold_id.cash,
                nGoodsNum: data.golds,
            })
        }
        data.good_list.forEach(v => {
            goodsArray.push({
                nGoodsID: v.goods_id,
                nGoodsNum: v.goods_num,
            })
        })
        if (goodsArray.length > 0) {
            center.mall.payReward(goodsArray,true)
        }
    }
    /**请求邮件列表 */
    send_PLAZA_EMAIL_VIEW(data: proto.plaza_email.Iemail_view_c = {}) {
        this.sendMessage({
            cmd: this.cmd.PLAZA_EMAIL_VIEW,
            data: proto.plaza_email.email_view_c.create(data),
        });
    }
    /**提取附件 */
    send_PLAZA_EMAIL_PICK(data: proto.plaza_email.Iemail_pick_c) {
        this.sendMessage({
            cmd: this.cmd.PLAZA_EMAIL_PICK,
            data: proto.plaza_email.email_pick_c.create(data),
        });
    }
    /**一键领取 */
    send_PLAZA_EMAIL_A_KEY_TO_GET(data?: proto.plaza_email.Iemail_akey_to_get_c) {
        this.sendMessage({
            cmd: this.cmd.PLAZA_EMAIL_A_KEY_TO_GET,
            data: proto.plaza_email.email_akey_to_get_c.create(data),
        });
    }
    /**浏览邮件正文 */
    send_PLAZA_EMAIL_VIEWTEXT(data: proto.plaza_email.Iemail_view_text_c) {
        this.sendMessage({
            cmd: this.cmd.PLAZA_EMAIL_VIEWTEXT,
            data: proto.plaza_email.email_view_text_c.create(data)
        });
    }
    /**获取邮件内容 */
    getEmailContent(emailID: number) {
        let emailContent: proto.plaza_email.Iemail_view_text_ret_s = null;
        app.func.positiveTraversal(this.emailContentList, (element) => {
            if (element.email_id == emailID) {
                emailContent = element;
                return true;
            }
        });
        return emailContent;
    }
    /**获取邮件列表 */
    getEmailList() {
        return this.emailList;
    }
    /**通过分类获取邮件列表 */
    getEmailListByClassType(nClassType: number) {
        let list = [];
        if (nClassType == this.EmailClassType.All) {
            this.emailList.forEach(element => {
                list.push(element);
            });
        } else if (nClassType == this.EmailClassType.Other) {
            this.emailList.forEach(element => {
                switch (element.send_type) {
                    case this.EmailClassType.Withdraw:
                        break;
                    case this.EmailClassType.Recharge:
                        break;
                    case this.EmailClassType.Service:
                        break;
                    case this.EmailClassType.Refer:
                        break;
                    case this.EmailClassType.Bonus:
                        break;
                    default:
                        list.push(element);
                        break;
                }
            });
        } else {
            this.emailList.forEach(element => {
                if (element.send_type == nClassType) {
                    list.push(element);
                }
            });
        }
        return list;
    }
    /**获取对应ID邮件 */
    getEmailInfo(emailID: number): proto.plaza_email.IEmailViewItem {
        let email = null;
        app.func.positiveTraversal(this.emailList, (element) => {
            if (element.email_id == emailID) {
                email = element;
                return true;
            }
        });
        return email;
    }
    /**获取对应ID邮件 */
    delEmailContent(emailID: number) {
        let index = null;
        app.func.positiveTraversal(this.emailContentList, (element, index) => {
            if (element.email_id == emailID) {
                index = index;
                return true;
            }
        });
        !!index && this.emailContentList.splice(index, 1);
    }
    /**设置邮件状态 */
    setEmailState(emailID: number, state: number) {
        let emailInfo = this.getEmailInfo(emailID);
        if (emailInfo) {
            //状态变更
            if (emailInfo.state < state) {
                //更改状态
                emailInfo.state = state;
                //事件通知
                app.event.dispatchEvent({
                    eventName: EVENT_ID.EVENT_EMAIL_VIEW_STATE,
                    data: {
                        email_id: emailID,
                    }
                });
            }
        }
    }
    /**获取邮件状态 */
    getEmailState(emailID: number): number {
        let emailInfo = this.getEmailInfo(emailID);
        if (emailInfo) {
            return emailInfo.state;
        }
        return 0;
    }
    /**获取未关闭的邮件个数 */
    getEmailNoCloseNum(): number {
        let num = 0;
        app.func.positiveTraversal(this.emailList, (element) => {
            element.state != this.EmailType.EMAILSTATE_CLOSE && ++num;
        });
        return num;
    }
    /**获取提现的邮件个数 */
    getEmailWithdrawNum(): number {
        let num = 0;
        app.func.positiveTraversal(this.emailList, (element) => {
            element.send_type == this.EmailType.EMAILSTATE_WITHDRAW && ++num;
        });
        return num;
    }
    /**获取未关闭的提现邮件个数 */
    getEmailWithdrawNotCloseNum(): number {
        let num = 0;
        app.func.positiveTraversal(this.emailList, (element) => {
            (element.state != this.EmailType.EMAILSTATE_CLOSE && element.send_type == this.EmailType.EMAILSTATE_WITHDRAW) && ++num;
        });
        return num;
    }
}