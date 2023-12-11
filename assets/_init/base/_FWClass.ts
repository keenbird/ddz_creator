import './../__init'

class _FWClass {
    constructor(...args: any[]) {
        this.initData();
        this.initEvents();
    }
    initData() {

    }
    initEvents() {

    }
}

declare global {
    namespace globalThis {
        interface _fw {
            FWClass: typeof _FWClass
        }
    }
}
fw.FWClass = _FWClass;
export { }
