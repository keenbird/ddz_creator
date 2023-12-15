import { js, Label, AssetManager, ProgressBar, tween, _decorator, __private } from 'cc';
const { ccclass } = _decorator;

import { FWDialogViewBase } from '../../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('loadBar')
export class loadBar extends FWDialogViewBase {
	/**关闭返回键效果 */
	bEsc: boolean = false
	/**配置参数 */
	popupData: PreloadParam1 = <any>{}
	setPopupData(data: PreloadParam1) {
		//调整参数
		if (!(data.list instanceof Array)) {
			data.list = [data.list];
		}
		this.popupData = data;
	}
	initData() {
		this.popupData && this.updatePreloadData(this.popupData);
	}
	protected initView(): boolean | void {
		//刷新界面
		this.updateLoad({
			progress: 0,
			text: `loading %s%`,
		});
	}
	protected initEvents(): boolean | void {
		//事件刷新
		this.bindEvent({
			eventName: "UpdateLoad",
			callback: (arg1, arg2) => {
				this.updateLoad(arg1.data);
			}
		});
		//事件更新参数刷新
		this.bindEvent({
			eventName: "UpdatePreloadData",
			callback: (arg1: FWDispatchEventParam, arg2) => {
				this.updatePreloadData(arg1.data);
			}
		});
	}
	/**刷新显示 */
	updateLoad(data: UpdateLoadParam1) {
		//文本
		let text = data.text == null ? `loading %s%` : data.text;
		this.Items.Label.getComponent(Label).string = js.formatStr(text, Math.ceil((data.progress ?? 0) * 100));

		this.Items.ProgressBar.getComponent(ProgressBar).progress = data.progress
	}
	/**添加预加载参数，由于使用的是bundle.loadDir，所以资源加载后可通过bundle.get同步获取 */
	updatePreloadData(data: PreloadParam1) {
		let input = [];
		let loadWorks = [];
		let list = <PreloadItemsParam1[]>data.list;
		list.forEach(preloadParam => {
			//先加在子包
			loadWorks.push(this.loadBundle(preloadParam.bundleConfig, (bundle) => {
				//统计需要加载的文件
				preloadParam.preloadList?.forEach(dir => {
					let infos = bundle.getDirWithPath(dir);
					for (const assetInfo of infos) {
						input.push({ uuid: assetInfo.uuid, __isNative__: false, ext: assetInfo.extension || '.json', bundle: bundle.name });
					}
				});
			}));
		});
		Promise.all(loadWorks).then(() => {
			let oldProgress = 0;
			app.assetManager.loadAny(
				input,
				(finished, total, item: AssetManager.RequestItem) => {
					//加载过程中total会增加因为预设一些资源有依赖项需要加载
					let newProgress = finished / total;
					if (newProgress > oldProgress) {
						oldProgress = newProgress;
						//通知刷新显示
						app.event.dispatchEvent({
							eventName: "UpdateLoad",
							data: <UpdateLoadParam1>{
								progress: oldProgress,
							}
						});
					}
				},
				(err, res) => {
					if (err) {
						fw.printError(err);
					} else {
						if (fw.isValid(this.node)) {
							this.onClickClose();
							data.callback && data.callback(true, data);
						}
					}
				}
			);
		});
	}
	showMask() {
		return false;
	}
}

/**类型声明调整 */
declare global {
	namespace globalThis {
		type type_load1 = loadBar
		/**预加载回调 */
		type PreloadCallback1 = (bSussess: boolean, data: PreloadParam1) => void
		/**预加载单项参数 */
		type PreloadItemsParam1 = {
			/**子包配置 */
			bundleConfig: BundleConfigType
			/**预加载文件夹相对路径 */
			preloadList: string[]
			/**加载提示文本，默认`loading %s%` */
			text?: string
		}
		/**预加载所需参数 */
		type PreloadParam1 = {
			/**预加载列表 */
			list: PreloadItemsParam1 | PreloadItemsParam1[]
			/**回调 */
			callback?: PreloadCallback1
		}
		/**更新界面所需参数 */
		type UpdateLoadParam1 = {
			/**加载进度：[0, 1] */
			progress: number
			/**加载提示文本，默认`loading %s%` */
			text?: string
		}
	}
}
