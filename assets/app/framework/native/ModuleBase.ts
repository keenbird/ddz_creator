import { native } from 'cc';
import { MODULE_NAME } from '../../config/ModuleConfig';

interface ModuleData {
    method: string;// 函数名称
    params?: any;// 参数
}

export abstract class ModuleBase extends (fw.FWComponent) {
    protected _module_name: string;
    protected _version: number;

    abstract initModule();

    initData() {
        this.initModule();
        fw.print("initModule",this._module_name)
    }

    initEvents() {
        native.jsbBridgeWrapper?.addNativeEventListener(`${this._module_name}`, this.onNativeEventListener.bind(this));
        // 通知java js层准备好了
        this.dispatchEventToNative("initByJs");
    }
    /**
     * native 层回调 表示native 当天版本 用于兼容处理
     * @param params 
     */
    onInit(params) {
        this._version = params.version;
        fw.print(`${this._module_name} onInit ${this._version}`);
    }

    get version() {
        return this._version;
    }

    onNativeEventListener(jsonStr: string) {
        let data = <ModuleData>JSON.safeParse(jsonStr);
        if(!data) return ;
        let method = data.method;
        let func = this[method];
        if (typeof func == "function") {
            func.call(this, data.params);
        }
    }
    /**
     * 异步请求module
     * @param method 
     * @param params 
     */
    dispatchEventToNative(method: string, params?: any) {
        let data = {
            method: method,
            params: params,
        }
        native.jsbBridgeWrapper?.dispatchEventToNative(`${this._module_name}`, JSON.stringify(data));
    }

    callStaticMethod(data: SDKCallParamAndroid, ...args: any[]) {
        return app.native.call(data, ...args);
    }
}