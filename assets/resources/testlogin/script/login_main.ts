
import { EditBox, Label, Layout, RichText, _decorator, tween } from 'cc';
const { ccclass } = _decorator;

// import { LoginNotice } from './LoginNotice';
import { EVENT_ID } from '../../../app/config/EventConfig';
import { httpConfig } from '../../../app/config/HttpConfig';
import { DF_SYMBOL, LOGINTYPE, PATHS } from '../../../app/config/ConstantConfig';
import { EventParam } from '../../../app/framework/manager/FWEventManager';

@ccclass('login_main')
export class login_main extends (fw.FWComponent) {
	/**接收配置数量 */
	nLoginConfigIndex = 0
	/**超时进入定时器 */
	nEnterTimeOut: number
	/**进入超时定时器 */
	nEnter: number

	initData() {
		//清理大厅节点缓存
		if (fw.isValid(app.runtime.plaza)) {
			app.runtime.permanentView.delete(app.runtime.plaza);
			app.runtime.plaza.destroy();
			app.runtime.plaza = null;
		}
		//清理用户center数据
		app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_CLEAN_USER_DATA,
        })
		//请求登录公告
		// center.login.showLoginNotice();
	}
	protected initEvents(): boolean | void {
		//登录中心登录事件
		this.bindEvent({
			eventName: EVENT_ID.EVENT_LOGIN_LOGINEND,
			callback: () => {
				this.loginProcess("logging in...", 0);
				app.popup.closeAllDialog();
			}
		});
		//登录失败返回
		this.bindEvent({
			eventName: EVENT_ID.EVENT_LOGIN_FAIL,
			callback: (params) => {
				app.popup.closeLoading();
				if (params.flag == 1) {
					app.popup.showTip({
						text: "No such account, please register"
					});
				} else if (params.flag == 2) {
					app.popup.showTip({
						text: "wrong password"
					});
				} else {
					app.popup.showTip({
						text: "Something went wrong with login, please login again"
					});
				}
				this.loginFail();
			}
		});
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_LOGIN_PHP_FAIL,
				EVENT_ID.EVENT_LOGIN_FAIL_TIPS,
				EVENT_ID.EVENT_PLAZA_TIPS_ERROR,
				EVENT_ID.EVENT_GATEWAY_TIPS_ERROR,
			],
			callback: () => {
				this.loginFail();
			}
		});
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_LOGIN_PHP_SUCCESS,
			],
			callback: () => {
				this.loginPhpSuccess();
			}
		});
		this.bindEvent({
			eventName: EVENT_ID.EVENT_PLAZA_ACTOR_PRIVATE,
			callback: () => {
				this.loginProcess("Getting user data...", 70);
				this.nLoginConfigIndex = 0;
				//请求活动列表
				center.activity.requestActivityList();
				//超时进入大厅
				this.nEnterTimeOut = this.setTimeout(() => {
					this.nLoginConfigIndex = 100000;
					this.enterPlaza();
				}, 20);
			}
		});
		this.bindEvent({
			eventName: EVENT_ID.EVENT_ROOM_COMBINE_CHANGE,
			callback: () => {
				fw.print(`nLoginConfigIndex${this.nLoginConfigIndex}`);
				this.nLoginConfigIndex = this.nLoginConfigIndex + 1;
				this.enterPlaza();
			}
		});
		this.bindEvent({
			eventName: EVENT_ID.EVENT_LOGIN_NOTICE_UPDATE,
			callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam) => {
				this.updateLoginNoticeView(arg1.data);
			}
		});
	}
	protected initView(): boolean | void {
		this.Items.youke_edit_node.active = false
		
	}
	protected initBtns(): boolean | void {
		//登录
		this.Items.btn_weixin.onClickAndScale(this.onLoginWeixin.bind(this));
		this.Items.btn_youke.onClickAndScale(this.onClickYouKe.bind(this));
		this.Items.btn_youke_sure.onClickAndScale(this.onSureYoukeLogin.bind(this));
		this.Items.youke_edit_close.onClickAndScale(()=>{
			this.Items.youke_edit_node.active = false
		});
		
	
	
	}

	/**微信登录 */
	onLoginWeixin(data: any) {
        if(app.func.isWeChat){
			center.login.loginWeChat()
		}else{
			this.onClickYouKe()
		}
	}

	/**游客登录输入账号登录 */
	onSureYoukeLogin(data: any) {
		var accountStr:string = this.Items.youke_edit.getComponent(EditBox).string
		if(accountStr == ""){
			app.popup.showToast("请输入账号")
			return
		}
		app.file.setStringForKey("YoukeLogin_Account",accountStr,{all:true})
		center.login.loginGuestLua(accountStr)
	}

	public onViewEnter(): void {
		let bAutoLogin = true
		if(!app.func.isBrowser() && bAutoLogin) {
			this.autoLogin()
		}
	}

	/**登录公告 */
	updateLoginNoticeView(data: any) {
		this.Items.login_notice.active = true;
		// this.Items.login_notice.obtainComponent(LoginNotice).updateNoticeView(data);
	}
	/**登录过程 */
	loginProcess(title: string = "", nProgress?: number) {
		this.Items.Node_login.active = false;
		this.Items.Node_loading.active = true;
		this.Items.Label_loading.string = title;
	}
	/**登录失败 */
	loginFail() {
		app.popup.closeLoading();
		this.Items.Node_login.active = true;
		this.Items.Node_loading.active = false;
		this.clearTimeoutTimer(this.nEnter);
		this.clearTimeoutTimer(this.nEnterTimeOut);
	}

	/**php登录成功 */
	loginPhpSuccess() {
		this.setOTPTimerVisible(false)
	}

	/**游客登录 */
	onClickYouKe() {
		this.Items.youke_edit_node.active = true
		var lastAccount = app.file.getStringForKey("YoukeLogin_Account","",{all:true})
		this.Items.youke_edit.getComponent(EditBox).string = lastAccount
	}

	/**登录 */
	onClickLogin() {
		let phone = this.Items.Sprite_num.Items.TEXT_LABEL.string;
		if (!app.func.isCorrectPhoneNumber(phone)) {
			app.popup.showToast(`Please input valid number`);
			return;
		}

		let token = this.Items.Node_input_OTP.Items.TEXT_LABEL.string;
		if (token.length != 6) {
			app.popup.showToast(`Please enter verification code`);
			return;
		}

		let extra = {
			token : token
		}
		center.login.doPhpPhoneLogin(phone,extra)
	}
	/**获取OTP事件 */
	onGetOTP() {
		//请求验证码
		let phone = this.Items.Sprite_num.Items.TEXT_LABEL.string;
		if (!app.func.isCorrectPhoneNumber(phone)) {
			app.popup.showToast(`Please input valid number`);
			return;
		}
		//获取验证码
		this.getOTP(phone);
	}

	/**检测进入大厅 */
	enterPlaza() {
		if (this.nEnter) {
			return;
		}
		if (this.nLoginConfigIndex < 1) {
			return;
		}
		//请求玩家玩法分组信息
		center.user.getUserGroup();
		//记录登入次数
		center.login.setTodayLoginTimes();
		//刷新桌子人数
		center.roomList.refreshRoomPlayNum();
		this.loginProcess("Enter lobby...", 100);
		this.nEnter = this.setTimeout(() => {
			app.popup.closeLoading();
			fw.scene.changeScene(fw.SceneConfigs.plaza);
		}, 0.3);
	}
	/**倒计时 */
	setOTPTimerVisible(bVisible: boolean) {
		this.Items.Sprite_getOTP.active = !bVisible;
		this.Items.Sprite_getOTP_CD.active = bVisible;
		this.clearIntervalTimer((<any>this).nOTPTimer);
		if (bVisible) {
			(<any>this).nOTPTimeLeft = 60;
			(<any>this).nOTPTimer = this.setInterval(() => {
				//刷新显示
				this.Items.Label_OTP_time.string = `(${(<any>this).nOTPTimeLeft}s)`;
				//时间有效验证
				if (--(<any>this).nOTPTimeLeft < 0) {
					this.clearIntervalTimer((<any>this).nOTPTimer);
					this.Items.Sprite_getOTP.active = true;
					this.Items.Sprite_getOTP_CD.active = false;
				}
			}, 1.0, true);
		}
	}
	/**获取验证码 */
	getOTP(phone: string) {
		//倒计时
		this.setOTPTimerVisible(true);
		//获取验证吗
		center.user.getVerification({
			phone: phone,
			type: 3,
		});
	}
	@fw.Decorator.TryCatch()
	autoLogin() {
		let loginType = app.file.getIntegerForKey("LoginType",-1,{all:true})
		switch(loginType) {
			case LOGINTYPE.WEIXIN: {
				center.login.loginWeChat()
				break
			}
			case LOGINTYPE.GUEST: {
				var lastAccount = app.file.getStringForKey("YoukeLogin_Account","",{all:true})
				center.login.loginGuestLua(lastAccount)
				break
			}
			
			default: {
				//未有自动登录的用户，默认自动使用游客登录游戏
				if(this.Items.Node_youke.active == true) {
					// this.onClickYouKe()
				}
				break
			}
		}
	}
}
