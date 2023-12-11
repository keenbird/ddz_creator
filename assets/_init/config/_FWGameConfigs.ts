import './_FWBundleConfig'
import './_FWSceneConfigs'
import './_FWConfig'
import './../__init'

let config = fw.config.game

//添加游戏id访问
for (let key in config) {
	let element = config[key];
	//游戏名称
	element.gameName = element.gameName ?? key;
	//场景配置
	element.sceneConfig = fw.SceneConfigs[key];
	//子包配置
	element.bundleConfig = fw.BundleConfig[key];
	//添加gameId访问
	config[element.gameId] = element;
	//添加游戏名称访问
	if (!config[element.gameName]) {
		config[element.gameName] = element;
	}
}

export interface GameData {
	// 游戏服id
	nServerID: number,
}

/**类型声明调整 */
declare global {
	namespace globalThis {
		/**多玩法配置 */
		type CombineParam = {
			/**玩法id */
			id: number
		}
		//单个游戏配置
		type OneGameConfig = {
			/**服务器游戏ID（子集分类值） */
			gameId: number,
			/**游戏名称 */
			gameName?: string,
			/**是否有依赖的游戏 */
			relyGame?: number,
			/**场景配置 */
			sceneConfig?: OneSceneConfig
			/**包配置 */
			bundleConfig?: BundleConfigType
			/**预加载资源路径 */
			preloadList?: string[]
		}
	}
}

/**声明全局调用 */
declare global {
	namespace globalThis {
		interface _fw {
			GameConfigs: typeof config
		}
	}
}
fw.GameConfigs = config
