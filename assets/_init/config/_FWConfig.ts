import { sys } from 'cc'
import './../__init'

const config = {
    /**作为子包所需的配置 */
    bundle: {
        //普通
        AB: <BundleConfigType>{},
        //基础
        GameBase: <BundleConfigType>{},
        //活动
        //可动态调用，无需声明
        //大厅
        main: <BundleConfigType>{},
        secondary: <BundleConfigType>{},
        setting: <BundleConfigType>{},
        plaza: <BundleConfigType>{},
        login: <BundleConfigType>{},
        resources: <BundleConfigType>{},
    },
    /**作为游戏所需的配置，gameId为后台子集分类值，客户端自定义的版本号要从10000起步，因为后台有业务逻辑 */
    /**作为游戏所需的配置，gameId为后台子集分类值，客户端自定义的版本号要从10000起步，因为后台有业务逻辑 */
    /**作为游戏所需的配置，gameId为后台子集分类值，客户端自定义的版本号要从10000起步，因为后台有业务逻辑 */
    game: {
        /**普通 began------------------------------------------------------------- */
        /**AB */
        AB: <OneGameConfig>{ gameId: 1, relyGame: 10000 },
        /**普通 end------------------------------------------------------------- */
        Landlord: <OneGameConfig>{ gameId: 2, relyGame: 10000 },
        /**基础 began------------------------------------------------------------- */
        /**游戏基础 */
        GameBase: <OneGameConfig>{ gameId: 10000, },
        /**基础 end------------------------------------------------------------- */
    },

    /**scene所需的配置 */
    scene: {
        //普通
        AB: <OneSceneConfig>{ bGame: true },
        Landlord: <OneSceneConfig>{ bGame: true ,bSubPackage: true,preloadList:[`ui/main/main`,`ui`,`img/poker`]},
        //大厅
        plaza: <OneSceneConfig>{ frameRate: 30, bSubPackage: true, preloadList: sys.isBrowser ? [] : ['activity',  'shop'] },
        //登录选择界面
        login: <OneSceneConfig>{ frameRate: 30, bSubPackage: true, },
        app: <OneSceneConfig>{ frameRate: 30, bSubPackage: false, },
    }
}

/**声明全局调用 */
declare global {
    namespace globalThis {
        interface _fw {
            config: typeof config
        }
    }
}
fw.config = config
