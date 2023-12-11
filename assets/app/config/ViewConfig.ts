//全局zorder配置
export const ZOder = {
    GamePopup: 1, //游戏弹窗层级
    Popup: 2, //大厅弹窗层级
    Loading: 3, //加载层级
    Toast: 4, //提示层级
}

interface SceneLayerInterface {
    name: string;
    zorder: number;
}

export const sceneLayer: Record<string, SceneLayerInterface> = {
    gamePopup: {
        name: "gamePopup",
        zorder: ZOder.GamePopup
    },
    popup: {
        name: "popup",
        zorder: ZOder.Popup
    },
    loading: {
        name: "loading",
        zorder: ZOder.Loading
    },
    toast: {
        name: "toast",
        zorder: ZOder.Toast
    },
}

export const viewPath = {
    frameworkPrefab: "app/framework/prefab/",
}

/**按钮类型 */
export enum btn_style_type {
	OK=1,
	NO,
	NORMAL,
}

let data = <any>{}
export function resetViewConfig(newData) {
    data = newData;
}
export const ViewConfig = new Proxy(<any>{}, {
    get(target: object, p: string, receiver: any): any {
        let value = data[p]
        return value;
    }
});