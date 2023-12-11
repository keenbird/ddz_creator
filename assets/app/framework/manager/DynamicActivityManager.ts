import { js, _decorator, __private } from 'cc';
const { ccclass } = _decorator;

import { _FWHotUpdateManager } from '../../../_init/hotupdate/_FWHotUpdateManager';

@ccclass('DynamicActivityManager')
export class DynamicActivityManager extends (fw.FWComponent) {
	/**获取指定动态活动主入口组件 */
	getDynamicActivityCom(activityName: string) {
		return <class_dynamicActivity>js.getClassByName(`dynamicActivity_${activityName}`);
	}
	/**获取指定动态活动配置 */
	getDynamicActivityConfig(activityName: string) {
		let config: ActivityConfig;
		app.func.positiveTraversal(this.getDynamicActivityConfigs(), (element) => {
			let activityUrlConfig = center.activity.getActivityUrlConfig(element);
			if (activityUrlConfig.activityName == activityName) {
				config = element;
				return true;
			}
		});
		return config;
	}
	/**获取动态活动配置列表 */
	getDynamicActivityConfigs() {
		let configs: ActivityConfig[] = [];
		center.activity.getRunningActivityList().forEach(element => {
			let activityUrlConfig = center.activity.getActivityUrlConfig(element);
			if (activityUrlConfig.activityName) {
				configs.push(element);
			}
		});
		return configs;
	}
	/**检测更新 活动目前不动态更新 走大厅更新 */
	async checkUpdate(data: ActivityConfig, callback?: (bSuccess: boolean) => void) {
		if (app.func.isBrowser() || !fw.DEBUG.bGameUpdate) {
			callback?.(true);
		} else {
			//解析数据
			let activityUrlConfig = center.activity.getActivityUrlConfig(data);
			if (activityUrlConfig) {
				let am = fw.FWHotUpdateManager.getOnce(<HotUpdateConfigs>{
					bundleConfig: fw.BundleConfig[activityUrlConfig.activityName],
					newVersion: activityUrlConfig.version,
				});
				let { nLocalVersion } = await am.getLocalVersion();
				if (nLocalVersion != "0") {
					callback?.(true);
				} else {
					callback?.(false);
				}
			}
		}
	}
	/**显示活动 */
	showStandardActivity(activityName: string) {
		return app.func.doPromise((resolve: (value: unknown) => void, reject: (reason?: any) => void) => {
			if (!activityName) {
				return
			}
			let configs = this.getDynamicActivityConfig(activityName);
			if (configs) {
				this.checkUpdate(configs, (Successed) => {
					if (Successed) {
						resolve(true);
					} else {
						reject(`activity update error: ${configs.title}`);
						fw.printWarn(`activity update error: ${configs.title}`);
					}
				})
			}
		});
	}
	/**检查是否本地存在改活动 */
	checkActivity(activityName) {
		app.assetManager.loadBundle(activityName);
	}
}
