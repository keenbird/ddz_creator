import { js, Label, AssetManager, ProgressBar, tween, _decorator, __private } from 'cc';
const { ccclass } = _decorator;

import { FWDialogViewBase } from '../../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('load')
export class load extends FWDialogViewBase {
	/**关闭返回键效果 */
	bEsc: boolean = false
	/**配置参数 */
	popupData: PreloadParam = <any>{}
	setPopupData(data: PreloadParam) {
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
	updateLoad(data: UpdateLoadParam) {
		//文本
		let text = data.text == null ? `loading %s%` : data.text;
		this.Items.Label.getComponent(Label).string = js.formatStr(text, Math.ceil((data.progress ?? 0) * 100));
	}
	/**添加预加载参数，由于使用的是bundle.loadDir，所以资源加载后可通过bundle.get同步获取 */
	updatePreloadData(data: PreloadParam) {
		let input = [];
		let loadWorks = [];
		let list = <PreloadItemsParam[]>data.list;
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
							data: <UpdateLoadParam>{
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
		type type_load = load
		/**预加载回调 */
		type PreloadCallback = (bSussess: boolean, data: PreloadParam) => void
		/**预加载单项参数 */
		type PreloadItemsParam = {
			/**子包配置 */
			bundleConfig: BundleConfigType
			/**预加载文件夹相对路径 */
			preloadList: string[]
			/**加载提示文本，默认`loading %s%` */
			text?: string
		}
		/**预加载所需参数 */
		type PreloadParam = {
			/**预加载列表 */
			list: PreloadItemsParam | PreloadItemsParam[]
			/**回调 */
			callback?: PreloadCallback
		}
		/**更新界面所需参数 */
		type UpdateLoadParam = {
			/**加载进度：[0, 1] */
			progress: number
			/**加载提示文本，默认`loading %s%` */
			text?: string
		}
	}
}
