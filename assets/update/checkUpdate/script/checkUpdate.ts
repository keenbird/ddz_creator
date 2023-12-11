import { ProgressBar, _decorator, game } from 'cc';
const { ccclass } = _decorator;

import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
import { httpConfig } from '../../../app/config/HttpConfig';

@ccclass('checkUpdate')
export class checkUpdate extends FWDialogViewBase {
	/**配置 */
	popupData: { bNotForce?: boolean } = <any>{}
	/**进度条组件 */
	progressBar: ProgressBar
	/**关闭Esc事件 */
	bEsc = false
	protected initData(): boolean | void {
		//初始化数据
		this.progressBar = this.Items.ProgressBar.getComponent(ProgressBar);
		//进度设置为0
		this.progressBar.progress = 0;
	}
	protected initView(): boolean | void {
		//多语言
		this.Items.Label_title.string = fw.language.get("VERSION UPDATE")
		this.Items.Label_check.string = fw.language.get("Update")
		this.Items.Text_update_tips.string = fw.language.get("updating")
		//进度
		this.Items.ProgressBar.active = false;
		//更新
		let bUpdate = app.interface.contrastApkVersion(app.native.device.getAppVersion(), app.runtime.newApkVersion);
		this.Items.Sprite_check.active = bUpdate;
		//提示
		if (bUpdate) {
			this.Items.Label_tips.string = fw.language.get(`New version found.`);
		} else {
			this.Items.Label_tips.string = fw.language.get(`The current version is the latest version.`);
		}
		//关闭按钮
		this.Items.Node_close.active = this.popupData.bNotForce;
	}
	protected initBtns(): boolean | void {
		//更新
		this.Items.Sprite_check.onClickAndScale(() => {
			if (fsUtils) {
				this.Items.ProgressBar.active = true;
				this.Items.Sprite_check.active = false;
				let apkFileName = `apk_${app.runtime.newApkVersion}.apk`;
				let url = `${httpConfig.path_creator}apk/${apkFileName}`;
				let path = `${app.file.getFileDir(app.file.FileDir.Apk)}${apkFileName}`;
				fw.print(`downloadFile: ${url}`);
				fw.print(`path: ${path}`);
				fsUtils.downloadFile(
					url,
					path,
					null,
					(totalBytesReceived: number, totalBytesExpected: number) => {
						let nProgress = app.func.toNumber((totalBytesReceived / totalBytesExpected).toFixed(2));
						this.Items.Label_progress.string = `${nProgress}%`;
						this.progressBar.progress = nProgress;
					},
					(err: Error, storagePath: string) => {
						this.Items.ProgressBar.active = false;
						if (err) {
							fw.printError(err);
						} else {
							fw.print(`apk filePath: ${storagePath}`);
							//安装apk
							this.installApk(storagePath);
						}
					});
			} else {
				fw.printWarn(`fsUtils is undefined`);
			}
		});
	}
	//安装apk
	installApk(filePath: string) {
		if (app.file.isFileExist(filePath) && !app.file.isDirectoryExist(filePath)) {
			//去安装
			app.interface.installApk(filePath);
		} else {
			fw.printWarn(`intallApk file not found: ${filePath}`);
		}
	}
	/**关闭还是退出 */
	onClose(...args: any[]) {
		if (this.popupData.bNotForce) {
			super.onClose(...args);
		} else {
			game.end();
		}
	}
}
