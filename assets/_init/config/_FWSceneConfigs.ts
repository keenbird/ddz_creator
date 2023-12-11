import './_FWBundleConfig'
import './_FWConfig'
import './../__init'

let scene = fw.config.scene

//添加游戏id访问
for (let key in scene) {
	let config = scene[key];
	config.sceneName = key;
	scene[key] = _new(config);
}

//调整访问（没有会自动创建一个）
scene = new Proxy(<any>scene, {
	get(target: any, p: string, receiver: any): any {
		let value = Reflect.get(target, p, receiver);
		if (value == null) {
			value = _new({ sceneName: p });
			Reflect.set(target, p, value);
		}
		return value;
	}
});

//新建函数
function _new(one: OneSceneConfig): OneSceneConfig {
	return new Proxy(one, {
		get(target: OneSceneConfig, p: string, receiver: any): any {
			let value = Reflect.get(target, p, receiver);
			if (value == null) {
				if (p == `bundleConfig`) {
					value = fw.BundleConfig[target.sceneName];
				} else if (p == `bSubPackage`) {
					value = true;
				} else {
					value = null;
				}
				Reflect.set(target, p, value);
			}
			return value;
		}
	});
}

/**类型声明调整 */
declare global {
	namespace globalThis {
		//单个场景配置
		type OneSceneConfig = {
			/**场景名称 */
			sceneName?: string,
			/**帧率默认60 */
			frameRate?: number,
			/**是否是子包 */
			bSubPackage?: boolean,
			/**是否是游戏 */
			bGame?: boolean,
			/**子包名称（默认与场景名称一致） */
			strSubPackageName?: string
			/**包配置 */
			bundleConfig?: BundleConfigType
			/**预加载资源 */
			preloadList?: string[]
		}
	}
}

/**声明全局调用 */
declare global {
	namespace globalThis {
		interface _fw {
			SceneConfigs: typeof scene
		}
	}
}
fw.SceneConfigs = scene
