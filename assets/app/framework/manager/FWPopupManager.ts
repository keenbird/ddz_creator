import { _decorator, Node as ccNode, Prefab, instantiate, Sprite, SpriteFrame, color, math, BlockInputEvents, Color } from 'cc';
const { ccclass } = _decorator;

import { FWPopupViewBase } from '../view/popup/FWPopupViewBase';
import { FWToastViewBase } from '../view/popup/FWToastViewBase';
import { FWDialogViewBase } from '../view/popup/FWDialogViewBase';

@ccclass('FWPopupManager')
export class FWPopupManager extends (fw.FWComponent) {
    /**遮罩权重 */
    private _maskMap: Map<ccNode, number> = new Map()
    private _maskValidMap: Map<ccNode, number> = new Map()
    /**----main----began---- */
    /**main节点 */
    private _mainNode: ccNode
    /**----main----end---- */
    /**----dialog----began---- */
    /**dialog节点层（所有的dialog都放在这个节点下） */
    private _dialogNode: ccNode
    /**当前dialog界面 */
    private _curDialog: DialogQueueItem
    /**dialog遮罩层 */
    private _dialogMask: ccNode
    /**dialog顺序数组（用于记录弹框先后顺序） */
    private _dialogList: DialogQueueItem[] = []
    /**----dialog----end---- */
    /**----toast----began---- */
    /**toast通用预制 */
    private _toastCommonPrefab: Prefab
    /**----toast----end---- */
    /**----tip----began---- */
    /**tip节点层（所有的tip都放在这个节点下） */
    private _tipNode: ccNode
    /**tip遮罩层 */
    private _tipMask: ccNode
    /**tip顺序数组 */
    private _tipList: ccNode[] = []
    /**tip通用预制 */
    private _tipCommonPrefab: Prefab
    /**tip界面 */
    private _tipMap: Map<ccNode, FWPopupTipParam> = new Map()
    /**----tip----end---- */
    /**----loading----began---- */
    /**loading节点层（所有的loading都放在这个节点下） */
    private _loadingNode: ccNode
    /**loading遮罩层 */
    private _loadingMask: ccNode
    /**loading顺序数组 */
    private _loadingList: ccNode[] = []
    /**loading通用预制 */
    private _loadingCommonPrefab: Prefab
    /**loading界面 */
    private _loadingMap: Map<ccNode, FWPopupLoadingParam> = new Map()
    /**----loading----end---- */
    /**显示背景 */
    showBg(data: FWPopupBgParam): void {
        this.loadBundleRes(data.viewConfig, (prefab: Prefab) => {
            //获取弹框根节点
            let config = fw.scene.SceneExtensionNode.bg;
            let node = this.getNode(config.name);
            if (!node) {
                fw.printError("FWPopupManager showBg error", data);
                return;
            }
            //移除当前界面
            node.removeAllChildren(true);
            //添加新界面
            let view = instantiate(prefab);
            //设置父节点
            view.parent = node;
        });
    }
    /**移除背景 */
    removeBg(): void {
        let config = fw.scene.SceneExtensionNode.bg;
        let node = this.getNode(config.name);
        if (!node) {
            return;
        }
        //移除当前界面
        node.removeAllChildren(true);
    }
    /**更换主界面 */
    showMain(data: FWPopupMainParam): void {
        //获取弹框根节点
        let config = fw.scene.SceneExtensionNode.main;
        let node = this.getNode(config.name);
        if (!node) {
            fw.printError("FWPopupManager showMain error", data);
            return;
        }
        let init = (prefab: Prefab | ccNode) => {
            //移除当前界面
            this.removeMain(data.bCleanOld);
            //标记上一个主界面
            data.lastMain = this._mainNode;
            //调整主界面
            let view = null
            if (prefab instanceof Prefab) {
                view = instantiate(prefab);
            } else {
                view = prefab
            }
            this._mainNode = view;
            //回调（放在addChild前是为了能先与onLoad，以便传递参数）
            if (data.callback) {
                data.callback(view, data);
            }
            //设置父节点
            view.parent = node;
        }
        if (fw.isValid(data.node)) {
            Promise.resolve(data.node).then(init);
            return;
        }
        if (data.prefab) {
            Promise.resolve(data.prefab).then(init);
        } else {
            this.loadBundleRes(data.viewConfig, Prefab, init);
        }
    }
    /**移除主界面 */
    removeMain(bCleanOld?: boolean): void {
        bCleanOld ??= !app.runtime.permanentView.has(this._mainNode);
        fw.isValid(this._mainNode) && this._mainNode.removeFromParent(bCleanOld);
    }
    /** 获得主界面*/
    getMain() {
        return this._mainNode
    }
    /**显示一个弹框 */
    async showDialog(params1: FWPopupDialogParam | BundleResConfig, params2?: any) {
        let data: FWPopupDialogParam;
        if ((params1 as FWPopupDialogParam).viewConfig) {
            data = params1 as FWPopupDialogParam;
        } else {
            data = {
                viewConfig: params1 as BundleResConfig,
                data: params2
            }
        }
        // 检测弹窗遮罩层
        {
            //添加遮罩层
            if (!fw.isValid(this._dialogNode)) {
                //获取弹框根节点
                let config = fw.scene.SceneExtensionNode.dialog;
                let node = this.getNode(config.name);
                if (!node) {
                    fw.printError("FWPopupManager showDialog error", data);
                    return;
                }
                
                //遮罩节点
                this._dialogMask = this.addMaskLayer({ parent: node, nPriority: config.zOrder, zOrder: 0 });
                //节点层添加到根节点
                let viewNode = new ccNode();
                this._dialogNode = viewNode;
                //添加Widget
                node.insertChild(viewNode, 1);
                app.func.setWidget({ node: viewNode });
            }
        }

        //默认绑定当前场景
        data.valideTarget = fw.scene.getScene();
        let dialogQueueItem = this._getItemFromDialogQueueOrCreate(data);
        // 更新弹窗数据
        dialogQueueItem.popupData = data;
        // 更新节点删除标记
        dialogQueueItem.bRemove = false;
        this._updateCurrentDialog(dialogQueueItem);
    }

    /** 获得从队列或者创建一个新的DialogQueueItem */
    private _getItemFromDialogQueueOrCreate(data:FWPopupDialogParam):DialogQueueItem {
        let findIndex = this._dialogList.findIndex((value: DialogQueueItem)=>{
            return value.popupData.viewConfig.all == data.viewConfig.all
        })
        return findIndex == -1 ? {bLoading:false,bRemove:false} : this._dialogList.splice(findIndex,1)[0];
    }

    private _onDialogLoad(item:DialogQueueItem,prefab:Prefab) {
        // 在加载完成前就被关闭了
        if(item.bRemove) return ;
        let node = instantiate(prefab);
        item.node = node;
        let ctrl = node.obtainComponent(FWDialogViewBase);
        item.ctrl = ctrl;
        let popupData = item.popupData;
        //设置弹框数据
        !fw.isNull(popupData.data) && ctrl.setPopupData(popupData.data);
        //回调（放在addChild前是为了能先与onLoad，以便传递参数） 后面会弃用
        popupData.callback?.(node,popupData);
        //调整父节点
        if (node.parent != this._dialogNode) {
            node.parent = this._dialogNode;
        }
        this.closeAllLoading()
        //当前是展示这个弹窗则直接调用
        if(this._curDialog == item) {
            node.active = true;
            //遮罩是否生效
            this.updateMask(this._dialogMask, ctrl.showMask());
            ctrl.show();
        } else {
            node.active = false;
        }
    }

    /**刷新弹框 */
    private _updateCurrentDialog(item: DialogQueueItem) {
        let popupData = item.popupData;
        //显示遮罩层
        this.updateMask(this._dialogMask, true);
        //隐藏上一个界面
        this._hideLastDialog();
        this._curDialog = item;
        //保存数据
        this._dialogList.push(item);

        if( item.ctrl && item.node ) {
            //设置弹框数据
            !fw.isNull(popupData.data) && item.ctrl.setPopupData(popupData.data);
            item.node.active = true;
            //遮罩是否生效
            this.updateMask(this._dialogMask, item.ctrl.showMask());
            item.ctrl.show()
        } else {
            //加载界面的时候先展示遮罩层
            this.updateMask(this._dialogMask, true);
            if(!item.bLoading) {
                item.bLoading = true;
                this._loadDialogPrefab(item)
            }
        }
    }
    
    /** 加载弹窗预设 */
    private _loadDialogPrefab(item:DialogQueueItem) {
        let data = item.popupData;
        this.showLoading()
        this.loadBundleRes(data.viewConfig, Prefab, (prefab) => {
            item.bLoading = false;
            //是否有效 这里因为弹窗管理 管理的是虚拟节点 应该是不需要这个判断了
            if (!fw.isNull(data.valideTarget) && !fw.isValid(data.valideTarget)) {
                return;
            }
            this._onDialogLoad(item,prefab);
        },{
            failCallback:()=>{
                item.bLoading = false;
                // 在加载完成前就被关闭了
                if(item.bRemove) return ;
                // 资源加载失败不要这个弹窗了
                this.closeItemDialog(item);
                this.closeAllLoading()
            }
        });
    }

    /**关闭弹框 */
    closeDialog(view?: ccNode): boolean {
        for (let i = 0; i < this._dialogList.length; ++i) {
            if (view == this._dialogList[i].node) {
                let item = this._dialogList.splice(i, 1)[0];
                if(item) {
                    return this._closeDialog(item);
                }
                return false;
            }
        }
        return false;
    }
    /** 下标关闭dialog */
    closeIndexDialog(index:number): boolean {
        if(this._dialogList.length <= index) {
            return false;
        }
        let item = this._dialogList.splice(index, 1)[0]
        if(item) {
            return this._closeDialog(item);
        }
        return false;
    }
    
    /** 下标关闭dialog */
    closeItemDialog(item:DialogQueueItem): boolean {
        for (let i = 0; i < this._dialogList.length; ++i) {
            if (item == this._dialogList[i]) {
                let removeItem = this._dialogList.splice(i, 1)[0];
                if(removeItem) {
                    return this._closeDialog(removeItem);
                }
                return false;
            }
        }
        return false;
    }
    /** 释放dialog流程 */
    private _closeDialog(item: DialogQueueItem) {
        let view = item.node;
        //标记节点被删除
        item.bRemove = true;

        /** 释放节点 */
        if (fw.isValid(view)) {
            view.removeFromParent(true);
        }

        /** 更新展示节点 */
        if(this._curDialog == item) {
            this._showLastDialog();
        }
        return true;
    }

    /**隐藏所有弹框 */
    closeAllDialog(): void {
        //dialog是否有效
        if (fw.isValid(this._dialogNode)) {
            //移除子节点
            this._dialogNode.removeAllChildren(true);
            //隐藏遮罩层
            this.updateMask(this._dialogMask, false);
        }

        //标记节点被删除
        this._dialogList.forEach(v=>{
            v.bRemove = true;
        })

        //清空数据
        this._curDialog = null;
        this._dialogList.length = 0;
    }
    /**隐藏上一个dialog（并不移除，对遮罩层显隐不造成影响） */
    private _hideLastDialog() {
        //是否还有弹框
        if (this._curDialog && this._curDialog.node) {
            //隐藏界面
            this._curDialog.node.active = false;
            this._curDialog.ctrl.hide();
        }
    }
    /**获得当前界面 */
    getCurDialog(): ccNode {
        return this._curDialog.node;
    }
    /**显示上一个dialog（对遮罩层显隐造成影响） */
    private _showLastDialog(): void {
        //是否还有弹框
        if (this._dialogList.length > 0) {
            let lastView = this._dialogList[this._dialogList.length - 1];
            //刷新标记
            this._curDialog = lastView;
            //显示界面
            //遮罩是否生效
            if(lastView.node) {
                lastView.node.active = true;
                lastView.ctrl.show();
                this.updateMask(this._dialogMask, lastView.ctrl.showMask());
            } else {
                this.updateMask(this._dialogMask, true);
            }
        } else {
            this._curDialog = null;
            //隐藏遮罩层
            this.updateMask(this._dialogMask, false);
        }
    }
    showTip(data: FWPopupTipParam): ccNode {
        //获取弹框根节点
        let config = fw.scene.SceneExtensionNode.tip;
        let node = this.getNode(config.name);
        if (!node) {
            fw.printError("FWPopupManager showTip error", data);
            return;
        }
        //显示数量是否超出限制
        if (this._tipMap.size > 100) {
            return;
        }
        //添加遮罩层
        if (!fw.isValid(this._tipNode)) {
            //遮罩节点
            this._tipMask = this.addMaskLayer({ parent: node, nPriority: config.zOrder, zOrder: 0 });
            //节点层添加到根节点
            let viewNode = new ccNode();
            this._tipNode = viewNode;
            //添加Widget
            node.insertChild(viewNode, 1);
            app.func.setWidget({ node: viewNode });
        }
        //是否使用通用模版
        if (!data.prefab && !fw.isValid(this._tipCommonPrefab)) {
            this.loadBundleRes(fw.BundleConfig.resources.res[`ui/tip/tip_common`], (res: Prefab) => {
                //引用自增，确保不被释放
                res.addRef();
                //持有通用prefab
                this._tipCommonPrefab = res;
                //刷新界面
                this.showTip(data);
            });
            return;
        }
        //隐藏上一个界面
        this.hideLastTip();
        //添加新界面
        let view = instantiate(data.prefab || this._tipCommonPrefab);
        //设置弹框数据
        view.getComponent(FWPopupViewBase)?.setPopupData(data);
        //设置父节点
        view.parent = this._tipNode;
        //保存数据
        this._tipMap.set(view, data);
        this._tipList.push(view);
        //显示遮罩层
        this.updateMask(this._tipMask, true);
        //回调
        data.callback?.(view, data);
        //返回界面
        return view;
    }
    /**关闭一个提示界面 */
    closeTip(view?: ccNode): boolean {
        //隐藏结果
        let result = false;
        //tip是否有效
        if (!fw.isValid(this._tipNode) || !this._tipMap.has(view)) {
            return result;
        }
        //移除该界面
        this._tipMap.delete(view);
        for (let i = 0; i < this._tipList.length; ++i) {
            if (view == this._tipList[i]) {
                this._tipList.splice(i, 1);
                break;
            }
        }
        if (fw.isValid(view)) {
            view.removeFromParent(true);
            result = true;
        }
        //是否还有弹框
        if (this._tipMap.size <= 0) {
            //隐藏遮罩层
            this.updateMask(this._tipMask, false);
        } else {
            //显示上一个界面
            ((view ?? true) || result) && this.showLastTip();
        }
        return result;
    }
    /**获取当前提示界面 */
    getCurTip(): ccNode {
        let curView = null;
        //是否还有弹框
        if (this._tipMap.size > 0) {
            for (let i = this._tipList.length - 1; i >= 0; --i) {
                curView = this._tipList[i];
                if (fw.isValid(curView)) {
                    break;
                }
            }
        }
        return curView;
    }
    /**隐藏所有弹框 */
    closeAllTip(): void {
        //tip是否有效
        if (fw.isValid(this._tipNode)) {
            //移除子节点
            this._tipNode.removeAllChildren(true);
            //隐藏遮罩层
            this.updateMask(this._tipMask, false);
        }
        //清空数据
        this._tipMap.clear();
        this._tipList.splice(0, this._tipList.length);
    }
    /**隐藏上一个tip（并不移除，对遮罩层显隐不造成影响） */
    private hideLastTip(): ccNode {
        //tip是否有效
        if (!fw.isValid(this._tipNode)) {
            return;
        }
        //是否还有弹框
        if (this._tipMap.size > 0) {
            let lastView = this._tipList[this._tipList.length - 1];
            //上一个界面失效，继续处理上上个界面
            if (!fw.isValid(lastView)) {
                //清理上个界面
                this.closeTip(lastView);
                //处理上上个界面
                return this.hideLastTip();
            } else {
                //隐藏界面
                lastView.active = false;
                return lastView;
            }
        }
    }
    /**刷新一个弹框 */
    updateCurrentTip(view: ccNode): void {
        //tip是否有效
        if (!fw.isValid(this._tipNode) || !this._tipMap.has(view)) {
            return;
        }
        //刷新数据
        view.getComponent(FWPopupViewBase)?.setPopupData(this._tipMap.get(view));
        //遮罩是否生效
        this.updateMask(this._tipMask, true);
    }
    /**显示上一个tip（对遮罩层显隐造成影响） */
    private showLastTip(): void {
        //tip是否有效
        if (!fw.isValid(this._tipNode)) {
            return;
        }
        //是否还有弹框
        if (this._tipMap.size > 0) {
            let lastView = this._tipList[this._tipList.length - 1];
            //上一个界面失效，继续处理上上个界面
            if (!fw.isValid(lastView)) {
                //清理上个界面
                this.closeTip(lastView);
                //处理上上个界面
                this.showLastTip();
            } else {
                //显示界面
                lastView.active = true;
                //刷新显示
                this.updateCurrentTip(lastView);
            }
        } else {
            //隐藏遮罩层
            this.updateMask(this._tipMask, false);
        }
    }
    /**显示loading */
    showLoading(data?: FWPopupLoadingParam): ccNode {
        data ??= {};
        //获取弹框根节点
        let config = fw.scene.SceneExtensionNode.loading;
        let node = this.getNode(config.name);
        if (!node) {
            fw.printError("FWPopupManager showLoading error", data);
            return;
        }
        //显示数量是否超出限制
        if (this._loadingMap.size > 100) {
            fw.printError(`showLoading size exceeded limit`);
            return;
        }
        //打印堆栈，好知道是哪里显示的loading
        // fw.printDebug(`showLoading: ${this._loadingMap.size}`);
        // fw.printDebug(fw.getStack());
        //添加遮罩层
        if (!fw.isValid(this._loadingNode)) {
            //遮罩节点
            this._loadingMask = this.addMaskLayer({
                parent: node,
                nPriority: config.zOrder,
                color: color(0, 0, 0, 0),
                zOrder: 0
            });
            //节点层添加到根节点
            let viewNode = new ccNode();
            this._loadingNode = viewNode;
            //添加Widget
            node.insertChild(viewNode, 1);
            app.func.setWidget({ node: viewNode });
        }
        //是否使用通用模版
        if (!data.prefab && !fw.isValid(this._loadingCommonPrefab)) {
            let res = this.loadBundleResSync(fw.BundleConfig.resources.res[`ui/loading/loading_common`], Prefab);
            //引用自增，确保不被释放
            res.addRef();
            //持有通用prefab
            this._loadingCommonPrefab = res;
        }
        //显示遮罩层
        this._loadingMask.active = true;
        // this.updateMask(this._loadingMask, true);
        //隐藏上一个界面
        this.hideLastLoading();
        //添加新界面
        let view = instantiate(data.prefab || this._loadingCommonPrefab);
        //设置父节点
        view.parent = this._loadingNode;
        //保存数据
        this._loadingMap.set(view, data);
        this._loadingList.push(view);
        //最后刷新界面
        this.updateCurrentLoading(view);
        //超时自动关闭
        if (data.nAutoOutTime) {
            view.scheduleOnce(() => {
                app.popup.closeLoading(view);
            }, data.nAutoOutTime);
        }
        //返回界面
        return view;
    }
    /**隐藏上一个loading（并不移除，对遮罩层显隐不造成影响） */
    private hideLastLoading(): ccNode {
        //loading是否有效
        if (!fw.isValid(this._loadingNode)) {
            return;
        }
        //是否还有弹框
        if (this._loadingMap.size > 0) {
            let lastView = this._loadingList[this._loadingList.length - 1];
            //上一个界面失效，继续处理上上个界面
            if (!fw.isValid(lastView)) {
                //清理上个界面
                this.closeLoading(lastView);
                //处理上上个界面
                return this.hideLastLoading();
            } else {
                //隐藏界面
                lastView.active = false;
                return lastView;
            }
        }
    }
    /**刷新一个弹框 */
    updateCurrentLoading(view: ccNode): void {
        //loading是否有效
        if (!fw.isValid(this._loadingNode) || !this._loadingMap.has(view)) {
            return;
        }
        //数据
        let data = this._loadingMap.get(view);
        //调整文本显示
        if (fw.isValid(view.Items.Label_content)) {
            if (fw.isValid(data.text)) {
                view.Items.Label_content.string = data.text;
            } else {
                view.Items.Label_content.string = "loading...";
            }
        }
        //遮罩是否生效
        this._loadingMask.active = true;
        // this.updateMask(this._loadingMask, true);
    }
    /**显示上一个loading（对遮罩层显隐造成影响） */
    private showLastLoading(): void {
        //loading是否有效
        if (!fw.isValid(this._loadingNode)) {
            return;
        }
        //是否还有弹框
        if (this._loadingMap.size > 0) {
            let lastView = this._loadingList[this._loadingList.length - 1];
            //上一个界面失效，继续处理上上个界面
            if (!fw.isValid(lastView)) {
                //清理上个界面
                this.closeLoading(lastView);
                //处理上上个界面
                this.showLastLoading();
            } else {
                //显示界面
                lastView.active = true;
                //刷新显示
                this.updateCurrentLoading(lastView);
            }
        } else {
            //隐藏遮罩层
            this._loadingMask.active = false;
            // this.updateMask(this._loadingMask, false);
        }
    }
    /**获取当前loading */
    getCurLoading(): ccNode {
        let curView = null;
        //是否还有弹框
        if (this._loadingMap.size > 0) {
            for (let i = this._loadingList.length - 1; i >= 0; --i) {
                curView = this._loadingList[i];
                if (fw.isValid(curView)) {
                    break;
                }
            }
        }
        return curView;
    }
    /**隐藏loading */
    closeLoading(view?: ccNode): boolean {
        //隐藏结果
        let result = false;
        //loading是否有效
        if (!fw.isValid(this._loadingNode) || this._loadingMap.size <= 0) {
            return result;
        }
        //打印堆栈，好知道是哪里关闭的loading
        // fw.printDebug(`closeLoading: ${this._loadingMap.size}`);
        // fw.printDebug(fw.getStack());
        //不传界面默认上一个界面
        if (!this._loadingMap.has(view)) {
            view = this._loadingList[this._loadingList.length - 1];
        }
        //移除该界面
        this._loadingMap.delete(view);
        for (let i = 0; i < this._loadingList.length; ++i) {
            if (view == this._loadingList[i]) {
                this._loadingList.splice(i, 1);
                break;
            }
        }
        if (fw.isValid(view)) {
            view.removeFromParent(true);
            result = true;
        }
        //是否还有弹框
        if (this._loadingMap.size <= 0) {
            //隐藏遮罩层
            this._loadingMask.active = false;
            // this.updateMask(this._loadingMask, false);
        } else {
            //显示上一个界面
            ((view ?? true) || result) && this.showLastLoading();
        }
        return result;
    }
    /**隐藏所有loading */
    closeAllLoading(): void {
        //loading是否有效
        if (fw.isValid(this._loadingNode)) {
            //移除子节点
            this._loadingNode.removeAllChildren(true);
            //隐藏遮罩层
            this._loadingMask.active = false;
            // this.updateMask(this._loadingMask, false);
        }
        //清空数据
        this._loadingMap.clear();
        this._loadingList.splice(0, this._loadingList.length);
    }
    /**显示一个提示 */
    showToast(data: FWPopupToastParam | string): ccNode {
        if (typeof data == 'string') {
            data = {
                text: data
            }
        }
        //获取弹框根节点
        let config = fw.scene.SceneExtensionNode.toast;
        let node = this.getNode(config.name);
        if (!node) {
            fw.printError("FWPopupManager showToast error", data);
            return;
        }
        //是否使用通用模版
        if (!data.prefab && !fw.isValid(this._toastCommonPrefab)) {
            this.loadBundleRes(fw.BundleConfig.resources.res[`ui/toast/toast_common`], (res: Prefab) => {
                //引用自增，确保不被释放
                res.addRef();
                //持有通用prefab
                this._toastCommonPrefab = res;
                //刷新界面
                this.showToast(data);
            });
            return;
        }
        //添加新界面
        let view = instantiate(data.prefab || this._toastCommonPrefab);
        //设置弹框数据
        view.getComponent(FWPopupViewBase)?.setPopupData(data);
        //设置父节点
        view.parent = node;
        //返回界面
        return view;
    }
    /**移除一个提示 */
    closeToast(view: ccNode): void {
        //移除该界面
        if (fw.isValid(view)) {
            view.removeFromParent(true);
        }
    }
    /**隐藏所有弹框 */
    closeAllToast(): void {
        //获取弹框根节点
        let config = fw.scene.SceneExtensionNode.toast;
        let node = this.getNode(config.name);
        if (!node) {
            fw.printError("FWPopupManager closeAllToast error");
            return;
        }
        node.removeAllChildren(true);
    }
    /**显示系统提示界面 */
    showSystem(data: FWPopupSystemParam): ccNode {
        //检测预制是否有效
        if (!fw.isValid(data.prefab)) {
            fw.printError("FWPopupManager showSystem error prefab is invalid");
            return;
        }
        //获取弹框根节点
        let config = fw.scene.SceneExtensionNode.system;
        let node = this.getNode(config.name);
        if (!node) {
            fw.printError("FWPopupManager showSystem error", data);
            return;
        }
        //移除当前界面
        node.removeAllChildren(true);
        //添加新界面
        let view = instantiate(data.prefab);
        //设置父节点
        view.parent = node;
        //返回界面
        return view;
    }
    /**移除一个系统提示界面 */
    closeSystem(view?: ccNode): boolean {
        //移除该界面
        if (!view) {
            let config = fw.scene.SceneExtensionNode.system;
            let node = this.getNode(config.name);
            let cLen = node.children.length;
            if (cLen > 0) {
                view = node.children[cLen - 1];
            }
        }
        if (fw.isValid(view)) {
            view.removeFromParent(true);
            return true;
        }
        return false;
    }
    /**显示错误界面 */
    showError(data: FWPopupErrorParam): ccNode {
        //检测预制是否有效
        if (!fw.isValid(data.prefab)) {
            fw.printError("FWPopupManager showError error prefab is invalid");
            return;
        }
        //获取弹框根节点
        let config = fw.scene.SceneExtensionNode.error;
        let node = this.getNode(config.name);
        if (!node) {
            fw.printError("FWPopupManager showError error", data);
            return;
        }
        //移除当前界面
        node.removeAllChildren(true);
        //添加新界面
        let view = instantiate(data.prefab);
        //设置父节点
        view.parent = node;
        //返回界面
        return view;
    }
    /**移除一个错误界面 */
    closeError(view?: ccNode): boolean {
        //移除该界面
        if (!view) {
            let config = fw.scene.SceneExtensionNode.error;
            let node = this.getNode(config.name);
            let cLen = node.children.length;
            if (cLen > 0) {
                view = node.children[cLen - 1];
            }
        }
        if (fw.isValid(view)) {
            view.removeFromParent(true);
            return true;
        }
        return false;
    }
    /**新建一个按钮 */
    newBtn(data: FWPopupNewBtnParam): void {
        this.loadBundleRes(fw.BundleConfig.resources.res["ui/btn/btn_common"], (prefab: Prefab) => {
            if (!fw.isNull(data.visible)) {
                if (typeof data.visible == `function`) {
                    if (!data.visible()) {
                        return;
                    }
                } else {
                    if (!data.visible) {
                        return;
                    }
                }
            }
            let view = instantiate(prefab);
            //调整样式
            (<type_btn_common>(view.getComponent(`btn_common`))).setData(data.btnStyle);
            //父节点
            if (fw.isValid(data.parent)) {
                if (fw.isNull(data.zOrder)) {
                    view.parent = data.parent;
                } else {
                    data.parent.insertChild(view, data.zOrder);
                }
            }
            //执行回调
            !!data.callback && data.callback(view, data);
        });
    }
    /**添加一个遮罩层 */
    private addMaskLayer(data: {
        /**父节点 */
        parent: ccNode
        /**界面遮罩权重值 */
        nPriority: number
        /**遮罩颜色 */
        color?: math.Color
        /**节点深度 */
        zOrder?: number
    }): ccNode {
        //遮罩节点
        let maskNode = new ccNode();
        //添加触摸吞噬
        maskNode.addComponent(BlockInputEvents);
        //添加Sprite
        let sprite = maskNode.addComponent(Sprite);
        //添加Widget
        let widget = app.func.setWidget({ node: maskNode });
        //设置SpriteFrame
        maskNode.loadBundleRes(fw.BundleConfig.resources.res[`ui/common/img/black/spriteFrame`], (res: SpriteFrame) => {
            //更换精灵
            sprite.spriteFrame = res;
            //调整颜色
            sprite.color = data.color || color(0, 0, 0, 180);
            //刷新大小
            widget.updateAlignment();
        });
        //添加节点
        data.parent.insertChild(maskNode, fw.isNull(data.zOrder) ? 0 : data.zOrder);
        //保存引用
        this._maskMap.set(maskNode, data.nPriority);
        //返回遮罩节点
        return maskNode;
    }
    /**调整遮罩显隐 */
    private updateMask(node: ccNode, active: boolean) {
        //配置是否存在
        if (!this._maskMap.has(node)) {
            fw.printError("FWPopupManager updateMask error");
            return;
        }
        //当前处理遮罩的权重值
        let nNewPriority = this._maskMap.get(node);
        //当前显示遮罩的权重值
        let nOldPriority = 0;
        if (active) {
            let oldNode = null;
            for (let [_oldNode, _nPriority] of this._maskValidMap) {
                if (_oldNode.active) {
                    nOldPriority = _nPriority;
                    oldNode = _oldNode;
                    break;
                }
            }
            //调整是否可用
            if (nNewPriority > nOldPriority) {
                if (fw.isValid(oldNode)) {
                    oldNode.active = false;
                }
                node.active = active;
            }
            //记录到可用列表
            if (!this._maskValidMap.has(node)) {
                this._maskValidMap.set(node, this._maskMap.get(node));
            }
        } else {
            //找到权重最高的节点
            let maxNode = null;
            let nMaxPriority = 0;
            for (let [_oldNode, _nPriority] of this._maskValidMap) {
                if (_oldNode.uuid != node.uuid && _nPriority > nMaxPriority) {
                    maxNode = _oldNode;
                    nMaxPriority = _nPriority;
                }
            }
            if (fw.isValid(maxNode)) {
                maxNode.active = true;
            }
            node.active = active;
            //从可用列表移除
            this._maskValidMap.delete(node);
        }
    }
    onViewDestroy() {
        //释放资源
        if (this._tipCommonPrefab) {
            this._tipCommonPrefab.destroy();
            this._tipCommonPrefab = null;
        }
        if (this._toastCommonPrefab) {
            this._toastCommonPrefab.destroy();
            this._toastCommonPrefab = null;
        }
        if (this._loadingCommonPrefab) {
            this._loadingCommonPrefab.destroy();
            this._loadingCommonPrefab = null;
        }
    }
    private getNode(name: string): ccNode {
        return fw.scene.getExtensionNode(name);
    }
}

interface DialogQueueItem {
    node?:ccNode,
    ctrl?:FWDialogViewBase,
    popupData?:FWPopupDialogParam,
    bRemove?:boolean,
    bLoading?:boolean,
}

/**类型声明调整 */
declare global {
    namespace globalThis {
        type FWPopupBgParam = {
            /**界面预制 */
            viewConfig: BundleResConfig
            /**扩展参数 */
            data?: any
        }
        type FWPopupMainParam = {
            /**界面 */
            node?: ccNode
            /**界面预制 */
            prefab?: Prefab
            /**界面资源 */
            viewConfig?: BundleResConfig
            /**回调函数 */
            callback?: (view: ccNode, data: FWPopupMainParam) => void
            /**不移除界面（默认移除） */
            bCleanOld?: boolean
            /**上一个主界面（不需要传入） */
            lastMain?: ccNode
            /**扩展参数 */
            data?: any
        }
        type FWPopupDialogParam = {
            /**界面预制 */
            viewConfig: BundleResConfig
            /**有效对象 不要手动传 自动绑定当前场景*/
            valideTarget?: ccNode
            /**回调函数 */
            callback?: (view: ccNode, data: FWPopupDialogParam) => void
            /**扩展参数 */
            data?: any
        }
        type FWPopupTipParam = {
            /**文本 */
            text: string
            /**标题 */
            title?: string
            /**按钮预设 */
            btnList?: BtnStyleParam[]
            /**取消关闭按钮 */
            bNotClose?: boolean
            /**自定义界面预制 */
            prefab?: Prefab
            /**手动关闭界面触发 */
            closeCallback?: () => void
            /**点击关闭按钮或者keyback触发 */
            cancelCallback?: () => void
            /**初始化后回调 */
            callback?: (view: ccNode, data: FWPopupTipParam) => void
            /**扩展参数 */
            data?: any
        }
        type FWPopupLoadingParam = {
            /**界面预制 */
            prefab?: Prefab
            /**文本 */
            text?: string
            /**超时时间 */
            nAutoOutTime?: number
            /**是否打印堆栈 */
            bPrintStack?: boolean
            /**扩展参数 */
            data?: any
        }
        type FWPopupToastParam = {
            /**界面预制 */
            prefab?: Prefab
            /**文本 */
            text?: string
            /**字色 */
            color?: Color
            /**显示时间，默认1秒 */
            time?: number
            /**刷新 */
            nUpdateDelayTime?: number
            nUpdateIntervalTime?: number
            updateCallback?: (com?: FWToastViewBase) => string
        }
        type FWPopupSystemParam = {
            /**界面预制 */
            prefab: Prefab
            /**扩展参数 */
            data?: any
        }
        type FWPopupErrorParam = {
            /**界面预制 */
            prefab: Prefab
            /**扩展参数 */
            data?: any
        }
        type FWPopupNewBtnParam = {
            /**按钮样式 */
            btnStyle: BtnStyleParam
            /**回调函数 */
            callback?: (view: ccNode, data: FWPopupNewBtnParam) => void
            /**有效判定 */
            visible?: boolean | (() => boolean)
            /**父节点 */
            parent?: ccNode
            /**深度 */
            zOrder?: number
            /**扩展参数 */
            data?: any
        }
    }
}
