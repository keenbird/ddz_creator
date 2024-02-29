import "./../../_init/tool/_FWFunc"
enum EVENT_ID {
	EVENT_PLAZA_TIPS_ERROR, //大厅踢人
	
	EVENT_BACK_PLAZA_PLANE, //大厅回退上一个界面
	EVENT_CLEAN_USER_DATA, //清理center数据

	EVENT_LOGIN_LOGINEND, //登录中心登录事件
	EVENT_LOGIN_NOTICE_UPDATE,//登录公告内容更新

	EVENT_PLAZA_ACTOR_VARIABLE, //广场中心玩家易变属性更新
	EVENT_ACTOR_MODIFY_RETURN, //玩家修改资料成功后返回
	EVENT_ACTOR_BINDING_PHONE, //玩家绑定手机成功后返回

	EVENT_ICON_SELECT_RETURN, //安卓返回消息，头像选择完成
	EVENT_ICON_UPLOAD_SUCCEED, //头像上传成功


	EVENT_PLAZA_CHAT_SYSTEM, //广场中心系统消息


	EVENT_PLAZA_TASK_INFO, //任务管理,任务进度
	EVENT_PLAZA_TASK_VIEW, //任务管理,任务视图
	EVENT_PLAZA_TASK_ADD, //任务管理,新增任务
	EVENT_PLAZA_TASK_CHANGE, //任务管理,任务改变
	EVENT_PLAZA_TASK_SUBSYDIY, //任务管理,破产补助
	EVENT_PLAZA_TASK_SUBSYDIY_DATA, //任务管理,破产补助数据


	EVENT_PLAZA_MALL_VIEW_RETURN, //广场中心商城
	EVENT_PLAZA_MALL_RMBORDER_MEGAGIFT, //广场中心商城
	EVENT_PLAZA_MALL_TIPS, //广场中心商城


	EVENT_EMAIL_VIEW_RETURN, //邮件，邮件概述返回
	EVENT_EMAIL_TEXT_RETURN, //邮件，邮件正文返回
	EVENT_EMAIL_PICK_RETURN, //邮件，邮件附件获取返回
	EVENT_EMAIL_EMAIL_ADD, //邮件，增加一封新邮件
	EVENT_EMAIL_VIEW_STATE, //邮件，邮件概述状态改变


	EVENT_ROOM_ONLINECOUNT_RETURN, //房间在线人数返回
	EVENT_ROOM_KIND_ID_CHANGE, //游戏房间kindid 改变
	EVENT_REVIEW_CONTROL_CHANGE, //审核模式 改变
	EVENT_ROOM_COMBINE_CHANGE, //游戏房间自定义分组

	/////////////////////////////////////////////
	//游戏房间内数据
	EVENT_PLAY_TALBEREF, //桌子刷新
	EVENT_PLAY_ACTOR_MATCH, //玩家进入匹配
	EVENT_TABLE_BASE_INFO, //更新桌子  房间名字和底分
	EVENT_PLAY_ACTOR_PUBLIC, //玩家公有数据
	EVENT_PLAY_ACTOR_PRIVATE, //玩家私有数据
	EVENT_PLAY_ACTOR_VARIABLE, //玩家属性更新
	EVENT_PLAY_ACTOR_SELFONTABLE,//自己上桌					
	EVENT_PLAY_ACTOR_ONTABLE, //玩家上桌
	EVENT_PLAY_ACTOR_OUTTABLE, //玩家离桌
	EVENT_PLAY_ACTOR_TIPSUPROOM, //提示升场
	EVENT_PLAY_ACTOR_RAISE_HAND, //玩家举手
	EVENT_PLAY_ACTOR_TIPSDOWNROOM, //提示降场
	EVENT_PLAY_ACTOR_RAISEHANDS, //用户举手	


	EVENT_PLAY_CHAT_ROOM, //房间聊天
	EVENT_PLAY_CHAT_PRIVATE, //私聊
	EVENT_PLAY_CHAT_TABLE, //游戏桌内聊天
	EVENT_PLAY_CHAT_ROOMPHRASES, //房间内聊天短语
	EVENT_PLAY_CHAT_GAMEPHRASES, //游戏内聊天短语
	EVENT_PLAY_CHAT_MAGICFACE, //房间内互动表情
	EVENT_PLAY_CHAT_SYSTEM, //系统消息


	/////////////////////////////////////////////
	//幸运卡
	EVENT_PLAZA_LUCKCARD_CONFIG, //幸运卡配置（日卡周卡月卡季卡等）
	EVENT_PLAZA_LUCKCARD_BUY_ODER, //服务器下发购买幸运卡的订单，客户端拿到这个订单去支付RMB
	EVENT_PLAZA_LUCKCARD_BUY_RESULT, //购买幸运卡的结果
	EVENT_PLAZA_LUCKCARD_DAILY_APPLY_RET, //获取每日奖励的结果
	EVENT_PLAZA_LUCKCARD_USER_RET, //玩家的幸运卡信息

	

	//快充
	EVENT_PLAZA_QUICKCHARGE, //快充订单下发通知事件-


	/////////////////////////////////////////////

	EVENT_PLAZA_SHARE_OPEN, //分享赚钱 开关
	EVENT_PLAZA_SHARE_TOTAL_DATA, //分享赚钱 累计分享数据
	EVENT_PLAZA_SHARE_FREECASH_CHANGE, //free cash分享数据更新


	EVENT_PLAZA_BONUSGET_SUCCEED, //领取返利成功

	//大厅功能管理
	EVENT_PLAZA_CUSTOM_CONTROL_CFG,

		
	//////////运营礼包////////////////////
	EVENT_TASK_SUBSIDY_REWARD, //领取破产补助结果		

	//////新手任务 start////////////
	EVENT_GETFREEBONUSTIPS,
	//////新手任务 end////////////

	//////mega礼包 start////////////
	EVENT_MEGAGIFT_CONFIG,
	EVENT_MEGAGIFT_BUY_RESULT,
	//////mega礼包 end////////////

	//////支付任务 start////////////
	EVENT_PAYTASK_BUY_RESULT,
	EVENT_TASK_REWARD_GET,
	EVENT_PAYTASK_INFO_CHANGE,
	//////支付任务 end////////////

	EVENT_PAY_SUCCESS, //充值成功

	//7天签到
	EVENT_PLAZA_SEVEN_ACTIVE_DATA, //签到用户数据
	EVENT_PLAZA_SEVEN_ACTIVE_REWARD_RET, //签到奖励领取
	//
	EVENT_RECHARGE_PROTECT_CFG, //充值保护配置
	EVENT_RECHARGE_PROTECT_REWARD, //充值保护领奖返回

	//转盘
	EVENT_WHEEL_REWARD, //抽奖返回
	EVENT_WHEEL_USERDATA, //用户数据
	//新转盘
	EVENT_NEW_WHEEL_REWARD, //抽奖返回
	EVENT_NEW_WHEEL_USERDATA, //用户数据
	EVENT_NEW_WHEEL_CONFIG,
	//支付渠道刷新 
	EVENT_PAY_CHANNEL_LIST, //支付渠道刷新



	////////////大厅排行榜//////////
	EVENT_PLAZABAG_GETRANKDATA,
	////////////大厅排行榜//////////

	// --10 天任务
	EVENT_TEN_DAY_TASK_ACTIVITY_DATA,
	EVENT_TEN_DAY_TASK_ACTIVITY_RET,

}
fw.getEventID({ enum: EVENT_ID });
export { EVENT_ID }

//C++，java，objc底层推送的事件ID
// enum C_EVENT_ID {
// 	EVENT_ICON_SELECT_RETURN = 23,
// 	EVENT_EXCHANGE_SCAN_QR_RETURN = 88,
// 	//断线重连事件
// 	SHOW_RECONNECT = -2003,
// 	STOP_RECONNECT = -2002,

// 	//关闭和显示加载界面
// 	CLOSE_LOADING = -2000,
// 	SHOW_LOADING = -2001,

// 	//以下有些没用
// 	//sdk登录成功回调
// 	SDK_LOGINSUCCESS = -5000,
// 	//sdk自动登录
// 	SDK_ATUOLOGIN = -4999,
// 	//sdk退出成功
// 	SDK_LOGOUTSUCCESS = -4998,
// 	//微信分享返回
// 	SDK_WX_SHAREBACK = -4997,
// 	//个推
// 	SDK_PUSHEVENTID = -10000,

// 	//电池电量
// 	SDK_BATTERYSTATE = -4996, //(返回的值 是电量0 - 100)
// 	//网络信号强度
// 	SDK_WIFISTATE = -4995, //(返回的值 是信号等级0 - 4)
// 	//移动信号强度
// 	SDK_NETSTATE = -4994, //(返回的值 是信号等级0 - 4)
// }
// fw.getEventID({ enum: C_EVENT_ID });
// export { C_EVENT_ID }

export const report_event = {
	app_open: {
		dec: "应用启动",
		params: {},
	},
	app_update: {
		dec: "应用更新",
		params: {},
	},
	app_update_success: {
		dec: "应用更新成功",
		params: {},
	},
	login: {
		dec: "登录成功",
		params: {
			userID: "0",
			loginType: "0",
			loginType_str: "0",
		},
	},
	rechar_page: {
		dec: "充值页面",
		params: {},
	},
	rechar_success: {
		dec: "充值成功",
		params: {
			purchaseAmount: "0.0", // 金额
			currency: "INR", // 货币标识
			RID: "0", // 商品id
			order_id: "0", //订单id
			userID: "0" // 用户id
		} //参数模板
	},
	register: {
		dec: "注册成功",
		params: {
			userID: "0", //用户id
			account: "0",
			loginType: "0",
			loginType_str: "0"
		} //参数模板
	},
	start_game: {
		dec: "开始游戏",
		params: {
			gameName: "ddz", // 游戏名称
		} //参数模板
	},
	widraw_page: {
		dec: "提现界面",
		params: {} //参数模板
	},
	widraw_success: {
		dec: "提现成功",
		params: {
			purchaseAmount: "0.0", //金额
			currency: "INR",//货币标识
		} //参数模板
	},
	register_login: {
		dec: "注册登录",
		params: {
			uid: "0", //用户id
		} //参数模板
	}
}

export type report_event_type = typeof report_event
export type report_event_name = keyof report_event_type

function reportEvent<T extends report_event_name, P extends report_event_type[T]["params"]>(event: T, params: P) {

	// app.native.adjust.reportEvent(event, params);
}