import { Asset, assetManager, isValid, _decorator, __private } from 'cc';
import { EDITOR } from 'cc/env';
const { ccclass } = _decorator;

if (!EDITOR) {
    /**重写decRef函数 */
    if (!Asset.prototype.__old_decRef) {
        Asset.prototype.__old_decRef = Asset.prototype.decRef;
        Asset.prototype.decRef = function (tryToDestroy?: boolean): Asset {
            //执行原有操作
            let asset = this.__old_decRef(tryToDestroy);
            //立即清理
            if (tryToDestroy && asset.refCount <= 0 && isValid(asset, true)) {
                assetManager.releaseAsset(asset);
                asset.destroy();
            }
            //返回Asset
            return asset;
        }
    }
}

declare module "cc" {
    //Asset扩展
    interface Asset {
        //原decRef函数
        __old_decRef: (autoRelease?: boolean) => Asset;
        //新decRef函数
        decRef: (tryToDestroy?: boolean) => Asset;
        //文件内容（可文本浏览时才有值）
        _file: string
    }
}
