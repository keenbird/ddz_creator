import { _decorator, js } from 'cc';
import { EVENT_ID } from "../../config/EventConfig";
import { GS_PLAZA_MSGID } from '../../config/NetConfig';
import { PlazeMainInetMsg } from "../../framework/network/awBuf/MainInetMsg";
import proto from '../common';
const { ccclass } = _decorator;

enum cmds {
	PLAZA_SHARE_MSG_BASE_INFO = 0, 					// 下发基础信息
	PLAZA_SHARE_MSG_SEND_CTRL_INFO = 1,						// 更新控制信息
	PLAZA_SHARE_MSG_INVITE_INFO = 2,						// 下发邀请配置
	PLAZA_SHARE_MSG_INVITE_DATA = 3,							// 玩家邀请数据
	PLAZA_SHARE_MSG_WITHDRAW = 4,				// 申请提现
	PLAZA_SHARE_MSG_WITHDRAW_RES = 5,				// 申请提现返回
}

let shareScene = {
	freeCash: 0,
	freeBoonus: 1,
}

@ccclass('shareCenter')
export class shareCenter extends PlazeMainInetMsg {
	/**命令ID */
	cmd = cmds
	// mLinkInfo: proto.plaza_share.IstShareLinkCfg

	shareScene = shareScene
	MaxCash: any;
	mInviteData: any;
	mIsOpen: boolean;
	nMaxCash: number;
	mShareCallbackFuncTab: {};
	mDefautReqTransaction: any;
	static_index: number;

	initData() {
		this.initMainID(GS_PLAZA_MSGID.GS_PLAZA_MSGID_SHARE);
		this.cleanUserData()
		this.static_index = app.func.time()
		this.mShareCallbackFuncTab = {}
		this.mDefautReqTransaction = this.registerEvent(this.defaultLinster)
	}

	cleanUserData() {
		this.mLinkInfo = {}				//分享链接配置
		this.mIsOpen = false			//功能开关
		this.mInviteData = {
			nCash: 0,
			nWithdrawFlag: 0,
		}
	}

	// initRegister() {
	// 	this.bindMessage({
	// 		struct: proto.plaza_share.gs_share_baseinfo_s,
	// 		cmd: this.cmd.PLAZA_SHARE_MSG_BASE_INFO,
	// 		callback: this.PLAZA_SHARE_MSG_BASE_INFO.bind(this),
	// 	});
	// 	this.bindMessage({
	// 		struct: proto.plaza_share.gs_share_ctrl_info_s,
	// 		cmd: this.cmd.PLAZA_SHARE_MSG_SEND_CTRL_INFO,
	// 		callback: this.PLAZA_SHARE_MSG_SEND_CTRL_INFO.bind(this),
	// 	});
	// 	this.bindMessage({
	// 		struct: proto.plaza_share.gs_share_inviteinfo_s,
	// 		cmd: this.cmd.PLAZA_SHARE_MSG_INVITE_INFO,
	// 		callback: this.PLAZA_SHARE_MSG_INVITE_INFO.bind(this),
	// 	});
	// 	this.bindMessage({
	// 		struct: proto.plaza_share.gs_share_invitedata_s,
	// 		cmd: this.cmd.PLAZA_SHARE_MSG_INVITE_DATA,
	// 		callback: this.PLAZA_SHARE_MSG_INVITE_DATA.bind(this),
	// 	});
	// 	this.bindMessage({
	// 		struct: proto.plaza_share.gs_share_withdraw_c,
	// 		cmd: this.cmd.PLAZA_SHARE_MSG_WITHDRAW,
	// 	});
	// 	this.bindMessage({
	// 		struct: proto.plaza_share.gs_share_withdrawres_s,
	// 		cmd: this.cmd.PLAZA_SHARE_MSG_WITHDRAW_RES,
	// 		callback: this.PLAZA_SHARE_MSG_WITHDRAW_RES.bind(this),
	// 	});
	// }
	/**下发基础信息 */
	PLAZA_SHARE_MSG_BASE_INFO(dict: proto.plaza_share.gs_share_baseinfo_s) {
		this.mLinkInfo = dict.linkinfo;
		app.event.dispatchEvent({
			eventName: EVENT_ID.EVENT_PLAZA_SHARE_TOTAL_DATA,
		});
	}
	/**更新控制信息 */
	PLAZA_SHARE_MSG_SEND_CTRL_INFO(dict: proto.plaza_share.gs_share_ctrl_info_s) {
		this.mIsOpen = Number(dict.show_flag) == 1;
		app.event.dispatchEvent({
			eventName: EVENT_ID.EVENT_PLAZA_SHARE_OPEN,
		});
	}
	/**下发邀请配置 */
	PLAZA_SHARE_MSG_INVITE_INFO(dict: proto.plaza_share.gs_share_inviteinfo_s) {
		this.mIsOpen = Number(dict.state) == 1;
		this.nMaxCash = Number(dict.max_cash);
		app.event.dispatchEvent({
			eventName: EVENT_ID.EVENT_PLAZA_SHARE_OPEN,
		});
	}
	/**玩家邀请数据 */
	PLAZA_SHARE_MSG_INVITE_DATA(dict: proto.plaza_share.gs_share_invitedata_s) {
		this.mInviteData = {};
		this.mInviteData.nCash = Number(dict.cash);
		this.mInviteData.nWithdrawFlag = Number(dict.withdraw_flag);
		app.event.dispatchEvent({
			eventName: EVENT_ID.EVENT_PLAZA_SHARE_FREECASH_CHANGE,
		});
	}
	/**申请提现返回 */
	PLAZA_SHARE_MSG_WITHDRAW_RES(dict: proto.plaza_share.gs_share_withdrawres_s) {
		let ret = dict.ret
		if (ret == 0) {
			app.event.dispatchEvent({
				eventName: "closeDialogAfterWithdraw",
			});

			this.mInviteData.nWithdrawFlag = 1;
			app.event.dispatchEvent({
				eventName: EVENT_ID.EVENT_PLAZA_SHARE_FREECASH_CHANGE,
			});
		}
		if (ret > 0 && ret <= 9) {
			app.popup.showTip({ text: `data error: ${ret}` })
		}
	}
	/**申请提现 */
	send_PLAZA_SHARE_MSG_WITHDRAW(wtype, money, upi, accountnumber, ifsc, phone, name) {
		this.sendMessage<proto.plaza_share.Igs_share_withdraw_c>({
			cmd: this.cmd.PLAZA_SHARE_MSG_WITHDRAW,
			data: {
				withdraw_type: wtype,
				money: money,
				uip: upi,
				account_number: accountnumber,
				ifsc_code: ifsc,
				acid: center.user.getActorProp(PROTO_ACTOR.UAT_UID),
				phone: phone,
				user_name: name,
			}
		});
	}

	registerEvent(func) {
		let index_str = js.formatStr("shareManager_%d", this.static_index)
		this.mShareCallbackFuncTab[index_str] = func
		this.static_index = this.static_index + 1
		return index_str
	}

	onEvent(index_str) {
		if (this.mShareCallbackFuncTab[index_str]) {
			this.mShareCallbackFuncTab[index_str]("success", "ios callback")
		}
	}

	sendCompleteShare() {

	}

	getLimitRedPackageNum() {
		return 99999999
	}

	getShareLinkUrl(shareScene?) {
		//走leo分享链接
		if (app.sdk.isSdkOpen("leoshare")) {
			return app.native.leo.getShareLinkUrl(shareScene, fw.language.languageType)
		} else {
			if (!this.mLinkInfo.url) {
				return ""
			}
			let params = {
				uid: center.user.getActorProp(PROTO_ACTOR.UAT_UID),
				cid: app.native.device.getOperatorsID(),
				st: 1,
				rid: 0,
				subcid: app.native.device.getOperatorsSubID(),
			}
			let paramsStr = js.formatStr("uid=%s&cid=%s&st=%s&rid=%s&subcid=%s", params.uid, params.cid, params.st, params.rid, params.subcid)
			return this.mLinkInfo.url + js.formatStr("?%s", paramsStr)
		}
	}

	getShareLinkUrlValid() {
		return this.mLinkInfo.url ?? ``;
	}

	//获得分享图片PicID
	getSharePicture() {
		return this.mLinkInfo.picture ?? ``;
	}

	//获得分享描述
	getShareDescribe() {
		return this.mLinkInfo.describe ?? ``;
	}
	//功能是否打开
	isOpen() {
		return this.mIsOpen;
	}

	getMaxCash() {
		return this.nMaxCash;
	}

	getInviteData() {
		return this.mInviteData;
	}

	isFreeCashOpen() {
		return this.mIsOpen && this.mInviteData.nWithdrawFlag == 0;
	}

	//分享链接到微信
	//picpath icon 可选
	shareWebpageToWechat(title, desc, url, picpath, isFriends, shareLinster) {
		center.share.shareWebpageToWechat(title, desc, url, picpath, isFriends, shareLinster)
	}

	shareImageToWechat(picpath, isFriends, shareLinster) {
		center.share.shareImageToWechat(picpath, isFriends, shareLinster)
	}

	shareWX(shareLinster) {
		this.shareWebpageToWechat("公路大作战", center.share.getShareDescribe(), center.share.getShareLinkUrl(false), "", true, shareLinster || this.defaultLinster)
	}

	defaultLinster(result, msg) {
		fw.print("shareLinster结果" + result)
		//失败
		if (result == "fail") {
			fw.print("分享失败原因：" + msg)
			//正在进行中   
		} else if (result == "having") {
			fw.print("正在进行分享" + msg)
			//成功返回
		} else if (result == "success") {
			fw.print("分享成功" + msg)
			center.share.sendCompleteShare()
		}
	}
}

