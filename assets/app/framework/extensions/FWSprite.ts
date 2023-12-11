import { _decorator, Sprite } from 'cc';
import { EDITOR } from 'cc/env';

if (!EDITOR) {
	/**多语言刷新 */
	// Sprite.prototype.updateLanguage = function (bundleResConfig?: BundleResConfig) {
	// 	if (this.spriteFrame) {
	// 		if (bundleResConfig) {
	// 			app.file.updateImage({
	// 				node: this.node,
	// 				bAutoShowHide: false,
	// 				bundleResConfig: bundleResConfig,
	// 			});
	// 		} else {
	// 			let assetInfo = app.assetManager.getAssetInfoByUuid(this.spriteFrame._uuid);
	// 			if (assetInfo && assetInfo.path) {
	// 				app.file.updateImage({
	// 					node: this.node,
	// 					bAutoShowHide: false,
	// 					bundleResConfig: fw.BundleConfig[assetInfo.bundle.name].res[assetInfo.path],
	// 				});
	// 			}
	// 		}
	// 	}
	// }
	/**__preload */
	// if (!Sprite.prototype.____preload_old) {
	// 	Sprite.prototype.____preload_old = Sprite.prototype.__preload;
	// 	Sprite.prototype.__preload = function () {
	// 		this.bindEvent({
	// 			bOne: true,
	// 			eventName: `UpdateLanguage`,
	// 			callback: () => {
	// 				this.updateLanguage();
	// 			}
	// 		});
	// 		this.____preload_old();
	// 		//这里主要是刷新预制体中创建的spriteFrame
	// 		//如果在执行__preload之前就已经执行过更换图片（app.file.updateTexture标记），那这里就不处理了
	// 		!this.__tex && this.updateLanguage();
	// 	}
	// }

	Sprite.prototype.updateImage = function (bundleResConfig?: BundleResConfig) {
		app.file.updateImage({
			node: this.node,
			bundleResConfig: bundleResConfig,
		});
	}
}

declare module 'cc' {
	/**Sprite扩展 */
	interface Sprite {
		/**上一个图片路径缓存（app.file.updateTexture标记） */
		__tex: string | number
		/**多语言刷新 */
		updateLanguage: (bundleResConfig?: BundleResConfig) => void
		/**更新图片 */
		updateImage: (bundleResConfig?: BundleResConfig) => void
		// /**新__preload函数，由于提示的问题这里注释掉 */
		// __preload: () => void
		/**旧__preload函数 */
		____preload_old: () => void
	}
}

export { }
