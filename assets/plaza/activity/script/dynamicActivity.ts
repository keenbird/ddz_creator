import { _decorator } from 'cc';
const { ccclass } = _decorator;

@ccclass('dynamicActivity')
export class dynamicActivity {
	/**单例 */
	public static instance<T extends dynamicActivity>(this: new () => T): T {
		return (<any>this)._instance ?? ((<any>this)._instance = new this());
	}
	/**活动名称 */
	public activityName: string = ``
	/**获取活动icon */
	public getIcon(): BundleResConfig {
		return fw.BundleConfig[this.activityName].res[`icon`];
	}
	/**活动显隐控制 */
	public updateVisible() {
		return true;
	}
	/**点击活动回调 */
	public onClickActivity() {
		fw.print(`onClickActivity ${this.activityName}`);
	}
}

declare global {
	namespace globalThis {
		type class_dynamicActivity = typeof dynamicActivity
	}
}
