import { COMBINE_ID, KIND_ID } from "../../../app/center/plaza/roomListCenter";

/**游戏标识类型 */
enum GameMarkType {
    /**无 */
    None,
    /**新游 */
    New,
    /**火热 */
    Hot,
}

let PlazaGameConfig = {
    MoreGame: <OnePlazaGameConfigParam>{
        iconName: `MoreGame`,
    },
}

for (let key in PlazaGameConfig) {
    let element: OnePlazaGameConfigParam = PlazaGameConfig[key];
    //游戏配置
    element.gameConfig ??= fw.GameConfigs[key];
    //图标预制资源
    element.iconRes ??= fw.BundleConfig.plaza.res[`plaza/gameItems/img/DT_${element.iconName ?? key}/spriteFrame`];
    //文本预制资源
    element.nameRes ??= fw.BundleConfig.plaza.res[`plaza/gameItems/img/DT_${element.iconName ?? key}_txt/spriteFrame`];
    //文本预制资源
    element.nameResP ??= fw.BundleConfig.plaza.res[`plaza/gameItems/img/DT_${element.iconName ?? key}_txt_brasil/spriteFrame`];
}

export { PlazaGameConfig, GameMarkType }

/**声明全局调用 */
declare global {
    namespace globalThis {
        type OnePlazaGameConfigParam = {
            /**游戏配置 */
            gameConfig?: OneGameConfig
            /**图标名称（默认为游戏名称） */
            iconName?: string
            /**图标预制资源 */
            iconRes?: BundleResConfig
            /**文本预制资源 */
            nameRes?: BundleResConfig
            nameResP?:BundleResConfig
            /**自定义分组（跳二级界面） */
            combine?: number
            /**KindID名称 */
            kindIdName?: string
            /**骨骼动画名称*/
            animName?: string
            /**“新”，“火热”等标识 */
            nMarkType?: GameMarkType
        }
    }
}
