import { Label, _decorator } from 'cc';
const { ccclass } = _decorator;

import { NetType } from '../../../app/framework/manager/SockManager';
import { NetManager } from '../../../app/framework/network/lib/NetManager';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('more')
export class more extends FWDialogViewBase {
	protected initView(): boolean | void {
		//隐藏部分界面
		this.Items.Node_item.active = false;
		//版本号
		this.Items.Label_version.obtainComponent(Label).string = `version: 0`;
		this.Items.Label_version.obtainComponent(Label).string = `version: ${app.file.getPlazaVersion()}`;
	}
	protected initBtns(): boolean | void {
		//其它区域关闭
		this.node.onClick(this.onClickClose.bind(this));
		//背景屏蔽点击
		this.Items.Sprite_bg.onClick(() => { });
		//菜单
		this.initMenuBtns();
		//客服
		this.Items.Image_service.onClickAndScale(() => {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`service/service_main`]
			});
		});
		//多语言
		this.initLanguageBtns();
	}
	/**菜单按钮 */
	initMenuBtns() {
		//菜单
		let btns = [
			{
				content: fw.language.get("Settings"),
				bundleResConfig: fw.BundleConfig.plaza.res[`more/img/DT_settings/spriteFrame`],
				callback: () => {
					app.popup.showDialog({
						viewConfig: fw.BundleConfig.resources.res[`ui/setting/setting`],
					});
				}
			},
			{
				content: fw.language.get("Check for updates"),
				bundleResConfig: fw.BundleConfig.plaza.res[`more/img/DT_check/spriteFrame`],
				callback: () => {
					app.popup.showDialog({
						viewConfig: fw.BundleConfig.update.res[`checkUpdate/checkUpdate`],
						data: {
							bNotForce: true,
						}
					});
				},
			},
			// {
			// 	content: fw.language.get("How to play"),
			// 	bundleResConfig: fw.BundleConfig.plaza.res[`more/img/DT_how/spriteFrame`],
			// 	callback: () => {
			// 		app.popup.showDialog({
			// 			viewConfig: fw.BundleConfig.plaza.res[`help/help_dlg`],
			// 		});
			// 	},
			// },
			{
				content: fw.language.get("Activity"),
				bundleResConfig: fw.BundleConfig.plaza.res[`more/img/DT_activity/spriteFrame`],
				callback: () => {
					app.popup.showDialog({
						viewConfig: fw.BundleConfig.plaza.res[`activity/activity`],
					});
				},
			},
			{
				content: fw.language.get("Logout"),
				bundleResConfig: fw.BundleConfig.plaza.res[`more/img/DT_logout/spriteFrame`],
				callback: () => {
					//断开连接
					center.login.closeConnect();
					//切换到登录
					fw.scene.changeScene(fw.SceneConfigs.login);
				},
			},
		]
		this.Items.Layout.removeAllChildren(true)
		btns.forEach(element => {
			let item = this.Items.Node_item.clone();
			this.Items.Layout.addChild(item);
			item.active = true;
			//图标样式
			item.Items.Sprite_icon.updateSprite(element.bundleResConfig, { bAutoShowHide: true });
			//文本
			item.Items.Label_content.getComponent(Label).string = element.content;
			//点击回调
			item.onClickAndScale(() => {
				element.callback();
				this.onClickClose();
			});
		});

		this.Items.service_t.string = fw.language.get("Service")
	}
	/**多语言按钮 */
	initLanguageBtns() {
		
	}
}
