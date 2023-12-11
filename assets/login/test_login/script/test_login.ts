
import { _decorator, instantiate, Label } from 'cc';
const { ccclass } = _decorator;

import { PATHS } from '../../../app/config/ConstantConfig';

@ccclass('test_login')
export class test_login extends (fw.FWComponent) {
	//帐号列表
	accountList: TestLoginAccountParam[]
	//帐号表
	accountMap: Map<string, TestLoginAccountParam> = new Map()
	initData() {
		//初始化读取缓存数据
		this.accountList = JSON.safeParse(app.file.getStringForKey("TestLoginAccount", "", { all: true })) ?? [];
		this.refreshAccount();
	}
	protected initBtns(): boolean | void {
		//自定义帐号
		this.Items.Node_custom.onClick(() => {
			this.login(this.Items.TEXT_LABEL.getComponent(Label).string);
		});
	}
	protected initEvents(): boolean | void {
		//测试登录回调
		this.bindEvent({
			eventName: "TestAccountLogin",
			callback: (arg1) => {
				if (this.accountList.length < 10) {
					if (!this.accountMap.has(arg1.account)) {
						this.accountList.push({ account: arg1.account, time: new Date().getTime() });
						this.refreshAccount();
					}
				}
			}
		});
		//监听空格键，自动登录第一个帐号
		this.bindEvent({
			once: true,
			eventName: app.event.CommonEvent.Keyboard,
			callback: (data) => {
				if (data.eventData.keyCode == app.event.CommonKey.Space) {
					const lastLoginAccountData = JSON.safeParse(app.file.getStringFromFile({
						filePath: PATHS.LoginGuestPWD,
						bEncrypt: true,
					}));
					if (lastLoginAccountData) {
						this.login(lastLoginAccountData.account);
					} else {
						app.popup.showToast({ text: `未找到可用于登录的账号信息` });
					}
				} else {
					return true;
				}
			}
		});
		//返回键事件
		this.bindEvent({
			once: true,
			eventName: app.event.CommonEvent.Keyback,
			callback: () => {
				//切换到更新
				fw.scene.changePlazaUpdate();
			}
		});
	}
	refreshAccount() {
		//刷新表
		this.accountMap.clear();
		this.accountList.forEach(element => {
			this.accountMap.set(element.account, element);
		});
		//时间从早到晚
		this.accountList.sort((a, b) => {
			return a.time - b.time;
		});
		//刷新数据
		app.file.setStringForKey("TestLoginAccount", JSON.stringify(this.accountList), { all: true });
		//刷新界面
		this.refreshView();
	}
	refreshView() {
		let index = 0;
		let childs = this.Items.content.children;
		this.accountList.forEach((element: TestLoginAccountParam) => {
			//是否复用节点
			let node = childs[index++];
			if (!node) {
				node = this.Items.Node_item.clone();
				this.Items.content.addChild(node);
			}
			//设置显示
			node.active = true;
			//删除
			node.Items.Sprite_delete.onClickAndScale(() => {
				for (let i = 0; i < this.accountList.length; ++i) {
					if (this.accountList[i].account == element.account) {
						this.accountList.splice(i, 1);
						break;
					}
				}
				this.refreshAccount();
			});
			//置顶
			node.Items.Sprite_top.onClickAndScale(() => {
				for (let i = 0; i < this.accountList.length; ++i) {
					if (this.accountList[i].account == element.account) {
						this.accountList[i].time = this.accountList[0].time - 1;
						break;
					}
				}
				this.refreshAccount();
			});
			//登录
			node.onClickAndScale(() => {
				this.login(element.account);
			});
			//刷新帐号
			node.Items.Label_account.getComponent(Label).string = element.account;
		});
		//隐藏多余节点
		for (; index < childs.length; ++index) {
			childs[index].active = false;
		}
	}
	//登录
	login(account: string) {
		if (!account) {
			app.popup.showToast({ text: `帐号不可为空` });
			return;
		}
		//通知记录帐号
		app.event.dispatchEvent({
			eventName: "TestAccountLogin",
			account: account,
		});
		//测试，直接切场景
		// fw.scene.changeScene(fw.SceneConfigs.plaza)
		//游客登录
		center.login.visitorLogin(account)
	}
}

/**类型声明调整 */
declare global {
	namespace globalThis {
		//界面配置
		type TestLoginAccountParam = {
			//帐号
			account: string
			//登录时间
			time: number
		}
	}
}
