import { Animation as ccAnimation, BlockInputEvents, Color, color, ImageAsset, instantiate, Label, Layout, Mask, Node as ccNode, Prefab, ScrollView, Size, size, sp, Sprite, SpriteFrame, Texture2D, UITransform, v3, Vec3, Widget, tween, Camera, find, view, TransformBit, Mat4, Quat, Vec2, UIRenderer, RichText } from 'cc';

import { FWMask } from '../extensions/FWMask';
import { FWSpine } from '../extensions/FWSpine';

/**主要定义一些通用的UI接口 */
export class FWFunctionUI extends (fw.FWComponent) {
    /**调整相机（最远端正好照射在屏幕上） */
    updateCamera(node: ccNode) {
        //相机组件
        const camera = node.getComponent(Camera);
        //调整相机位置
        node.getWorldPosition(fw._v3);
        fw._v3.z = camera.far;
        node.setWorldPosition(fw._v3);
        //调整相机照射视角
        const canvas = find(`Canvas`) ?? find(`MainCanvas`);
        const cUITransform = canvas.getComponent(UITransform);
        //fov
        camera.fov = 2 * Math.atan((cUITransform.height / 2) / camera.far) * (180 / Math.PI);
    }
    /**设置节点Layer */
    changeLayer(node: ccNode, layer: number) {
        node.layer = layer;
        node.children.forEach(element => {
            this.changeLayer(element, layer);
        });
    }
    /**获取节点的子节点引用，通过target.Items[名称]引用节点 */
    getTargetItems<T extends ccNode>(target: T, Items?: { [index: string]: ccNode }) {
        //调整引用容器Items
        Items ??= target._Items ??= Object.create(null);
        //以旧的为准
        Items[target.name] ??= target;
        //获取节点的子节点引用
        target.children.forEach(element => {
            //获取子节点的子节点引用
            this.getTargetItems(element, Items);
        });
        return Items;
    }
    /**node节点是否在view节点中显示（view的可视区域是否有node节点的渲染） */
    checkNodeInView(data: {
        /**检测的节点 */
        node: ccNode,
        /**界面节点 */
        view: ccNode,
    }) {
        if (!fw.isValid(data.node) || !fw.isValid(data.view)) {
            return false;
        }
        let vPoints = [];
        vPoints.push(app.func.getWorldPositionByLocalPosition({
            node: data.view,
            pos: app.func.getNodeLocalLeftBottomPosition(data.view),
        }));
        vPoints.push(app.func.getWorldPositionByLocalPosition({
            node: data.view,
            pos: app.func.getNodeLocalLeftTopPosition(data.view),
        }));
        vPoints.push(app.func.getWorldPositionByLocalPosition({
            node: data.view,
            pos: app.func.getNodeLocalRightTopPosition(data.view),
        }));
        vPoints.push(app.func.getWorldPositionByLocalPosition({
            node: data.view,
            pos: app.func.getNodeLocalRightBottomPosition(data.view),
        }));
        let bIng: boolean = false;
        do {
            //左下
            if (bIng = app.func.pointInPolygon(app.func.getWorldPositionByLocalPosition({
                node: data.node,
                pos: app.func.getNodeLocalLeftBottomPosition(data.node),
            }), vPoints)) {
                break;
            }
            //左上
            if (bIng = app.func.pointInPolygon(app.func.getWorldPositionByLocalPosition({
                node: data.node,
                pos: app.func.getNodeLocalLeftTopPosition(data.node),
            }), vPoints)) {
                break;
            }
            //右下
            if (bIng = app.func.pointInPolygon(app.func.getWorldPositionByLocalPosition({
                node: data.node,
                pos: app.func.getNodeLocalRightBottomPosition(data.node),
            }), vPoints)) {
                break;
            }
            //右上
            if (bIng = app.func.pointInPolygon(app.func.getWorldPositionByLocalPosition({
                node: data.node,
                pos: app.func.getNodeLocalRightTopPosition(data.node),
            }), vPoints)) {
                break;
            }
        } while (false);
        return bIng;
    }
    /**获取节点左下角坐标 */
    getNodeLocalLeftBottomPosition(node: ccNode) {
        const uiTransform = node.getComponent(UITransform);
        return fw.v3(
            (0 - uiTransform.anchorPoint.x) * uiTransform.size.width,
            (0 - uiTransform.anchorPoint.y) * uiTransform.size.height,
            0,
        ).clone();
    }
    /**获取节点左上角坐标 */
    getNodeLocalLeftTopPosition(node: ccNode) {
        const uiTransform = node.getComponent(UITransform);
        return fw.v3(
            (0 - uiTransform.anchorPoint.x) * uiTransform.size.width,
            (1 - uiTransform.anchorPoint.y) * uiTransform.size.height,
            0,
        ).clone();
    }
    /**获取节点右下角坐标 */
    getNodeLocalRightBottomPosition(node: ccNode) {
        const uiTransform = node.getComponent(UITransform);
        return fw.v3(
            (1 - uiTransform.anchorPoint.x) * uiTransform.size.width,
            (0 - uiTransform.anchorPoint.y) * uiTransform.size.height,
            0,
        ).clone();
    }
    /**获取节点右上角坐标 */
    getNodeLocalRightTopPosition(node: ccNode) {
        const uiTransform = node.getComponent(UITransform);
        return fw.v3(
            (1 - uiTransform.anchorPoint.x) * uiTransform.size.width,
            (1 - uiTransform.anchorPoint.y) * uiTransform.size.height,
            0,
        ).clone();
    }
    /**设置子节点在ScrollView滚动区域内，注意节点需要在场景中（因为需要获取世界坐标） */
    setScrollItemInView(data: {
        node: ccNode
        bAnim?: boolean
        nScrollTime?: number
    }) {
        let node = data.node;
        let content = node.parent;
        let scrollView = content.parent;
        //此节点可能是遮罩层
        if (!scrollView.getComponent(ScrollView)) {
            scrollView = scrollView.parent;
            //如果未找到ScrollView组件则不处理
            if (!scrollView.getComponent(ScrollView)) {
                return;
            }
        }
        if (!node || !content || !scrollView) {
            return;
        }
        let nDiffX = 0;
        let nDiffY = 0;
        let nSize = node.size;
        let sSize = scrollView.size;
        let nWolrdPos = node.worldPosition;
        let cWolrdPos = content.worldPosition;
        let sWolrdPos = scrollView.worldPosition;
        let nUITransform = node.getComponent(UITransform);
        let sUITransform = scrollView.getComponent(UITransform);
        //左边位置
        let sLeftPos = sWolrdPos.x - sSize.width * sUITransform.anchorX;
        let nLeftPos = nWolrdPos.x - nSize.width * nUITransform.anchorX;
        if (nLeftPos < sLeftPos) {
            nDiffX += sLeftPos - nLeftPos;
        }
        //右边位置
        let sRightPos = sWolrdPos.x + sSize.width * (1 - sUITransform.anchorX);
        let nRightPos = nWolrdPos.x + nSize.width * (1 - nUITransform.anchorX);
        if (nRightPos > sRightPos) {
            nDiffX += sRightPos - nRightPos;
        }
        //上边位置
        let sTopPos = sWolrdPos.y + sSize.height * (1 - sUITransform.anchorY);
        let nTopPos = nWolrdPos.y + nSize.height * (1 - nUITransform.anchorY);
        if (nTopPos > sTopPos) {
            nDiffY += sTopPos - nTopPos;
        }
        //下边位置
        let sBottomPos = sWolrdPos.y - sSize.height * sUITransform.anchorY;
        let nBottomPos = nWolrdPos.y - nSize.height * nUITransform.anchorY;
        if (nBottomPos < sBottomPos) {
            nDiffY += sBottomPos - nBottomPos;
        }
        //无位移偏差不处理
        if (nDiffX == 0 && nDiffY == 0) {
            return {
                nDiffX,
                nDiffY,
            }
        }
        //校准位置
        if (data.bAnim) {
            //暂停ScrollView滚动
            scrollView.getComponent(ScrollView).stopAutoScroll();
            tween(content)
                .to(data.nScrollTime ?? 0.25, { worldPosition: fw.v3(cWolrdPos.x + nDiffX, cWolrdPos.y + nDiffY, cWolrdPos.z) })
                .start();
        } else {
            content.setWorldPosition(fw.v3(cWolrdPos.x + nDiffX, cWolrdPos.y + nDiffY, cWolrdPos.z));
        }
        return {
            nDiffX,
            nDiffY,
        }
    }
    /**设置子节点在ScrollView滚动区域中间，注意节点需要在场景中（因为需要获取世界坐标） */
    setScrollItemInCenter(data: {
        node: ccNode
        bAnim?: boolean
        nScrollTime?: number
    }) {
        let node = data.node;
        let content = node.parent;
        let scrollView = content.parent;
        //此节点可能是遮罩层
        let com = scrollView.getComponent(ScrollView);
        if (!com) {
            scrollView = scrollView.parent;
            //如果未找到ScrollView组件则不处理
            com = scrollView.getComponent(ScrollView);
            if (!com) {
                return;
            }
        }
        if (!node || !content || !scrollView) {
            return;
        }
        let nDiffX = 0;
        let nDiffY = 0;
        let nSize = node.size;
        let cSize = content.size;
        let sSize = scrollView.size;
        let nWolrdPos = node.worldPosition;
        let sWolrdPos = scrollView.worldPosition;
        let cWolrdPos = content.worldPosition.clone();
        let nUITransform = node.getComponent(UITransform);
        let cUITransform = content.getComponent(UITransform);
        let sUITransform = scrollView.getComponent(UITransform);
        //左右中间位置
        if (cSize.width >= sSize.width) {
            let sCenterPosX = sWolrdPos.x - sSize.width * (sUITransform.anchorX - 0.5);
            let nCenterPosX = nWolrdPos.x - nSize.width * (nUITransform.anchorX - 0.5);
            if (nCenterPosX != sCenterPosX) {
                nDiffX += sCenterPosX - nCenterPosX;
            }
        }
        if (cSize.height >= sSize.height) {
            //上下中间位置
            let sCenterPosY = sWolrdPos.y - sSize.height * (sUITransform.anchorY - 0.5);
            let nCenterPosY = nWolrdPos.y - nSize.height * (nUITransform.anchorY - 0.5);
            if (nCenterPosY != sCenterPosY) {
                nDiffY += sCenterPosY - nCenterPosY;
            }
        }
        //无位移偏差不处理
        if (nDiffX == 0 && nDiffY == 0) {
            return {
                nDiffX,
                nDiffY,
            }
        }
        //修正位置
        let wPos = fw.v3(cWolrdPos.x + nDiffX, cWolrdPos.y + nDiffY, cWolrdPos.z).clone();
        if (cSize.width >= sSize.width) {
            //右边
            let sRightPos = sWolrdPos.x + sSize.width * (1 - sUITransform.anchorX);
            let cRightPos = wPos.x + cSize.width * (1 - cUITransform.anchorX);
            if (cRightPos < sRightPos) {
                nDiffX += sRightPos - cRightPos;
            }
            //左边
            let sLeftPos = sWolrdPos.x - sSize.width * sUITransform.anchorX;
            let cLeftPos = wPos.x - cSize.width * cUITransform.anchorX;
            if (cLeftPos > sLeftPos) {
                nDiffX += sLeftPos - cLeftPos;
            }
        }
        if (cSize.height >= sSize.height) {
            //下边
            let sBottomPos = sWolrdPos.y - sSize.height * sUITransform.anchorY;
            let cBottomPos = wPos.y - cSize.height * cUITransform.anchorY;
            if (cBottomPos > sBottomPos) {
                nDiffY += sBottomPos - cBottomPos;
            }
            //上
            let sTopPos = sWolrdPos.y + sSize.height * (1 - sUITransform.anchorY);
            let cTopPos = wPos.y + cSize.height * (1 - cUITransform.anchorY);
            if (cTopPos < sTopPos) {
                nDiffY += sTopPos - cTopPos;
            }
        }
        //校准位置
        com.stopAutoScroll();
        if (data.bAnim) {
            content.setWorldPosition(fw.v3(cWolrdPos.x, cWolrdPos.y, cWolrdPos.z));
            //暂停ScrollView滚动
            tween(content)
                .to(data.nScrollTime ?? 0.25, { worldPosition: fw.v3(cWolrdPos.x + nDiffX, cWolrdPos.y + nDiffY, cWolrdPos.z) })
                .start();
        } else {
            content.setWorldPosition(fw.v3(cWolrdPos.x + nDiffX, cWolrdPos.y + nDiffY, cWolrdPos.z));
        }
        return {
            nDiffX,
            nDiffY,
        }
    }
    /**设置子节点在指定节点区域内，注意节点需要在场景中（因为需要获取世界坐标） */
    setItemInView(data: {
        node: ccNode,
        /**目标节点，默认父节点 */
        target?: ccNode,
        /**优先右靠齐，默认左边 */
        bRight?: boolean
        /**优先下靠齐，默认上 */
        bBottom?: boolean
    }) {
        let target = data.target ?? data.node.parent;
        if (!target) {
            return;
        }
        let tSize = target.size;
        let nSize = data.node.size;
        let tWolrdPos = target.worldPosition.clone();
        let nWolrdPos = data.node.worldPosition.clone();
        let tUITransform = target.getComponent(UITransform);
        let nUITransform = data.node.getComponent(UITransform);
        [
            //右边位置
            {
                sortIndex: 1,
                func: () => {
                    let tRightPos = tWolrdPos.x + tSize.width * (1 - tUITransform.anchorX);
                    let nRightPos = nWolrdPos.x + nSize.width * (1 - nUITransform.anchorX);
                    if (nRightPos > tRightPos) {
                        nWolrdPos.x += tRightPos - nRightPos;
                    }
                }
            },
            //左边位置
            {
                sortIndex: 2,
                func: () => {
                    let tLeftPos = tWolrdPos.x - tSize.width * tUITransform.anchorX;
                    let nLeftPos = nWolrdPos.x - nSize.width * nUITransform.anchorX;
                    if (nLeftPos < tLeftPos) {
                        nWolrdPos.x += tLeftPos - nLeftPos;
                    }
                }
            },
        ]
            .sort((a, b) => {
                return (data.bRight ? -1 : 1) * (a.sortIndex - b.sortIndex);
            })
            .forEach(element => {
                element.func();
            });
        [
            //下边位置
            {
                sortIndex: 2,
                func: () => {
                    let tBottomPos = tWolrdPos.y - tSize.height * tUITransform.anchorY;
                    let nBottomPos = nWolrdPos.y - nSize.height * nUITransform.anchorY;
                    if (nBottomPos < tBottomPos) {
                        nWolrdPos.y += tBottomPos - nBottomPos;
                    }
                }
            },
            //上边位置
            {
                sortIndex: 1,
                func: () => {
                    let tTopPos = tWolrdPos.y + tSize.height * (1 - tUITransform.anchorY);
                    let nTopPos = nWolrdPos.y + nSize.height * (1 - nUITransform.anchorY);
                    if (nTopPos > tTopPos) {
                        nWolrdPos.y += tTopPos - nTopPos;
                    }
                }
            },
        ]
            .sort((a, b) => {
                return (data.bBottom ? -1 : 1) * (a.sortIndex - b.sortIndex);
            })
            .forEach(element => {
                element.func();
            });
        //校准位置
        data.node.setWorldPosition(nWolrdPos);
    }
    /**创建一个面板（默认黑色半透明，屏蔽点击事件） */
    createPanel(data?: CreatePanelParam) {
        data ??= {};
        let node = new ccNode();
        data.parent && data.parent.addChild(node);
        //是否屏蔽点击（默认屏蔽）
        !data.bNotShieldClick && node.obtainComponent(BlockInputEvents);
        //大小
        node.obtainComponent(UITransform).setContentSize(data.size ?? app.winSize);
        //添加一个半透明黑色背景
        let bgNode = new ccNode();
        bgNode.parent = node;
        this.setWidget({ node: bgNode });
        //添加默认纯色半透明背景
        if (!data.blank) {
            let sprite = bgNode.obtainComponent(Sprite);
            //自动大小
            sprite.sizeMode = Sprite.SizeMode.CUSTOM;
            //半透明黑色
            sprite.color = data.color ?? app.func.color(`#00000080`);
            //更换精灵
            bgNode.loadBundleRes(fw.BundleConfig.resources.res[`img/atlas/default_sprite_splash/spriteFrame`], (res: SpriteFrame) => {
                sprite.spriteFrame = res;
            });
        }
        //点击回调
        data.clickCallback && node.onClick(() => {
            data.clickCallback(data);
        });
        return node;
    }
    /**设置Widget */
    setWidget(data: {
        node: ccNode
        top?: number
        left?: number
        right?: number
        target?: ccNode
        bottom?: number
        isAlignTop?: boolean
        isAlignLeft?: boolean
        isAlignRight?: boolean
        isAlignBottom?: boolean
        alignMode?: Widget.AlignMode
    }): Widget {
        let widget = data.node.obtainComponent(Widget);
        widget.target = data.target ?? data.node.parent;
        widget.top = fw.isNull(data.top) ? 0 : data.top;
        widget.left = fw.isNull(data.left) ? 0 : data.left;
        widget.right = fw.isNull(data.right) ? 0 : data.right;
        widget.bottom = fw.isNull(data.bottom) ? 0 : data.bottom;
        widget.isAlignTop = fw.isNull(data.isAlignTop) ? true : data.isAlignTop;
        widget.isAlignLeft = fw.isNull(data.isAlignLeft) ? true : data.isAlignLeft;
        widget.isAlignRight = fw.isNull(data.isAlignRight) ? true : data.isAlignRight;
        widget.isAlignBottom = fw.isNull(data.isAlignBottom) ? true : data.isAlignBottom;
        widget.alignMode = fw.isNull(data.alignMode) ? Widget.AlignMode.ON_WINDOW_RESIZE : data.alignMode;
        widget.updateAlignment();
        return widget;
    }
    /**
     * @T 减少DrawCall（Mask，ScrollView...等组件节点将会被跳过）
     * @T 主要用于图字不会交错叠加的节点，且未使用“裁剪”等功能
     * @T 如果使用了Widget布局，经过处理后Widget布局控件将会被置为不可用
     */
    reduceDrawCall(rootNode: ccNode, dealNode?: ccNode): void {
        let func = () => {
            //调整参数
            dealNode = dealNode ?? rootNode;
            //保存原有节点
            const childs: ccNode[] = [];
            dealNode.children.forEach(element => {
                childs.push(element);
            });
            //失效当前父节点的Layout布局组件
            const layout = dealNode.getComponent(Layout);
            if (layout) {
                layout.enabled = false;
            }
            //drawcall处理节点
            let drawcallNode = (<any>rootNode).__drawcallNode;
            //更节点未处理过，或者正在处理途中
            if (!drawcallNode) {
                //堆放的节点
                drawcallNode = (<any>rootNode).__drawcallNode = new ccNode(`__drawcallNode`);
                drawcallNode.parent = rootNode;
            }
            //节点名称
            let __name: string;
            //节点对应的深度
            let __nZOrder: number;
            //是否遍历子节点
            let __bDoChild: boolean;
            //遍历子节点
            childs.forEach(element => {
                __name = ``;
                __nZOrder = 0;
                __bDoChild = true;
                //文本
                if (element.getComponent(Sprite)) {
                    __name = `__spriteNode`;
                    __nZOrder = 0;
                }
                //图片
                else if (element.getComponent(Label)) {
                    __name = `__labelNode`;
                    __nZOrder = 1;
                }
                //部分组件统一处理
                else {
                    __nZOrder = 2;
                    __name = `__otherNode`;
                    if (element.getComponent(Mask)
                        || element.getComponent(ScrollView)
                    ) {
                        __bDoChild = false;
                    }
                }
                //调整节点
                if (__name) {
                    //节点是否存在
                    if (!drawcallNode[__name]) {
                        let tempNode = new ccNode(__name);
                        drawcallNode.addChild(tempNode);
                        drawcallNode[__name] = tempNode;
                    }
                    drawcallNode[__name].setSiblingIndex(__nZOrder);
                    //widget控件置为不可用
                    const widget = element.getComponent(Widget);
                    if (widget) {
                        widget.enabled = false;
                    }
                    //更换父节点
                    element.setParent(drawcallNode[__name],true);
                    // const wPos = element.worldPosition;
                    // element.parent = drawcallNode[__name];
                    // element.setWorldPosition(wPos);
                }
                //处理子节点
                __bDoChild && this.reduceDrawCall(rootNode, element);
            });
        }
        if (dealNode) {
            func();
        } else {
            //延缓执行，避免布局还未刷新
            rootNode.getComponent(UITransform).scheduleOnce(() => {
                func();
                //刷新排序
                const drawcallNode: ccNode = (<any>rootNode).__drawcallNode;
                if (drawcallNode) {
                    drawcallNode.children.forEach(element => {
                        if (element.name == `__labelNode` || element.name == `__spriteNode`) {
                            element.children.sort((a: ccNode, b: ccNode) => {
                                return a.obtainComponent(UIRenderer).renderData.chunk.bufferId - b.obtainComponent(UIRenderer).renderData.chunk.bufferId;
                            });
                        }
                    });
                }
            });
        }
    }
    /**
     * 创建菜单
     * @l 按钮节点有一点命名要求
     * @l 1、必须包涵两个关键节点（Node_btn_select，Node_btn_normal）
     */
    createMenu<dataType>(data: FWCreateMenuParam<dataType>): FWMenuParam<dataType> {
        let menu: FWMenuParam<dataType> = {
            menuData: data,
            setDefault: (index: number | FWOneMenuBtnParam<dataType>) => {
                let item: FWOneMenuBtnParam<dataType>;
                if (typeof (index) == `number`) {
                    item = data.btns[index];
                } else {
                    app.func.positiveTraversal(data.btns, (element) => {
                        if (element == index) {
                            item = element;
                            return true;
                        }
                    });
                }
                if (item) {
                    item.node.__callback?.();
                }
            }
        };
        //挂载对象
        if (data.mountObject) {
            data.mountObject.menu = menu;
        }
        //初始化按钮
        let btns = menu.menuData.btns;
        btns.forEach(element1 => {
            //更换纹理
            if (element1.bundleResConfig) {
                if (element1.node.Items.Sprite_btn_normal || element1.node.Items.Sprite_btn_select) {
                    this.loadBundleRes(element1.bundleResConfig, (res: SpriteFrame) => {
                        if (element1.node.Items.Sprite_btn_normal) {
                            element1.node.Items.Sprite_btn_normal.getComponent(Sprite).spriteFrame = res;
                        }
                        if (element1.node.Items.Sprite_btn_select) {
                            element1.node.Items.Sprite_btn_select.getComponent(Sprite).spriteFrame = res;
                        }
                    });
                }
            }
            //更换文本
            if (element1.text) {
                if (element1.node.Items.Label_btn_normal) {
                    element1.node.Items.Label_btn_normal.getComponent(Label).string = element1.text;
                }
                if (element1.node.Items.Label_btn_select) {
                    element1.node.Items.Label_btn_select.getComponent(Label).string = element1.text;
                }
            }
            //点击事件
            element1.node.onClick(() => {
                //重复选中不处理
                if (menu.target == element1) {
                    return;
                }
                //调整菜单显隐
                btns.forEach(element2 => {
                    element2.node.Items.Node_btn_select.active = element2.node.uuid == element1.node.uuid;
                    element2.node.Items.Node_btn_normal.active = element2.node.uuid != element1.node.uuid;
                });
                //设置当前选中
                menu.target = element1;
                //回调
                element1.callback && element1.callback(element1);
            });
        });
        //默认选中
        if (!data.bNotDefault) {
            if (menu.menuData.defaultCallback) {
                app.func.positiveTraversal(btns, (element) => {
                    if (menu.menuData.defaultCallback(element)) {
                        element.node.__callback();
                        return true;
                    }
                });
            } else {
                menu.setDefault(menu.menuData.defaultIndex || 0);
            }
        }
        //返回菜单对象
        return menu;
    }
    /**注意，使用的是Sprite模式，同事还会调整节点结构 */
    addMask(data: FWAddMaskParam) {
        let parent = data.node.parent;
        let mask = parent.getComponent(FWMask);
        if (!mask) {
            let parent: ccNode = (<any>data.node).__Mask;
            //是否已经添加过遮罩
            if (!parent) {
                parent = (<any>data.node).__Mask = new ccNode();
                //添加遮罩组件
                mask = parent.obtainComponent(FWMask);
                //设置模式
                mask.type = Mask.Type.SPRITE_STENCIL;
                //设置父节点
                parent.parent = data.node.parent;
                //调整节点结构和位置
                let siblingIndex = data.node.getSiblingIndex();
                parent.setSiblingIndex(siblingIndex);
                parent.setPosition(data.node.position);
                //调整尺寸
                let nSize = data.node.size;
                let transform = parent.obtainComponent(UITransform);
                transform.contentSize = size(nSize.width - 1, nSize.height - 1);
                //调整节点结构和位置
                data.node.parent = parent;
                data.node.setPosition(v3(0, 0, 0));
            }
        }
        //设置遮罩
        data.node.active = false;
        parent.loadBundleRes(data.bundleResMaskConfig ?? fw.BundleConfig.resources.res[`ui/head/img/atlas/head_mask_1/spriteFrame`], (res: SpriteFrame) => {
            data.node.active = true;
            res.addRef();
            parent.addDecRefRes(res);
            mask.getComponent(Sprite).spriteFrame = res;
        });
        return mask;
    }
    /**触摸隐藏（方式：加一个同级的节点） */
    addTouchHide(node: ccNode, data?: AddTouchHideParam) {
        let parent = node.parent;
        if (!fw.isValid([node, parent]) || (<any>node).__addTouchHide) {
            return;
        }
        data ??= {};
        let touch = new ccNode();
        touch.active = node.active;
        parent.addChild(touch);
        //设置为node的下层节点
        touch.setSiblingIndex(node.getSiblingIndex());
        //全屏大小
        touch.obtainComponent(UITransform).setContentSize(app.winSize);
        //全屏居中
        touch.toWorldCenter();
        //点击显隐
        touch.onClick(() => {
            if (data.bRemove) {
                node.removeFromParent(true);
            } else {
                node.active = false;
            }
            data.callback?.();
        });
        //监听节点显隐
        node.on(ccNode.EventType.ACTIVE_IN_HIERARCHY_CHANGED, () => {
            touch.active = node.active;
        });
        //节点移除
        function removeFunc(child: ccNode) {
            if (child == node) {
                parent.off(ccNode.EventType.CHILD_REMOVED, removeFunc, parent);
                (<any>node).__addTouchHide = false;
                touch.removeFromParent(true);
            }
        }
        parent.on(ccNode.EventType.CHILD_REMOVED, removeFunc, parent);
        //标记处理
        (<any>node).__addTouchHide = true;
    }
    /**颜色app.func.color(`#fffffff`) or app.func.color(255, 255, 255, 255) */
    color(r: string | number, g?: number, b?: number, a?: number) {
        if (typeof (r) == `string`) {
            if (r.charAt(0) == `#`) {
                r = r.slice(1);
            }
            let tempR = parseInt(r.slice(0, 2) || `00`, 16);
            let tempG = parseInt(r.slice(2, 4) || `00`, 16);
            let tempB = parseInt(r.slice(4, 6) || `00`, 16);
            let tempA = parseInt(r.slice(6, 8) || `ff`, 16);
            return color(tempR, tempG, tempB, tempA);
        } else {
            return color(r, g, b, a);
        }
    }
    /**Label滚动上涨 */
    scrollNumber(data: ScrollNumberParam) {
        //便捷调用
        let node = data.node;
        //添加清理滚动数字定时器方法
        if (!(<any>node).clearScrollTimer) {
            (<any>node).clearScrollTimer = () => {
                node.unschedule((<any>node)._scrollNumber);
                node.unschedule((<any>node)._doScrollNumber);
            }
        }
        //清除滚动定时器
        (<any>node).clearScrollTimer();
        //值相同不处理
        let nBegan = data.began ?? 0;
        if (nBegan == data.end) {
            if (data.format) {
                data.format(nBegan, data);
            } else {
                node.string = `${nBegan}`;
            }
            data.callback && data.callback(data);
            return;
        }
        //刷新定时器
        let nCur = 0;
        let nMax = data.nCount ?? 10;
        let func = (nInterval: number) => {
            (<any>node)._scrollNumber = (dt: number, bImmediately: boolean) => {
                let nValue = nBegan + (data.end - nBegan) * nCur / nMax;
                //避免精度问题
                nValue = app.func.numberAccuracy(nValue);
                if (data.format) {
                    data.format(nValue, data);
                } else {
                    node.string = `${nValue}`;
                }
                if (++nCur > nMax) {
                    data.callback && data.callback(data);
                } else {
                    !bImmediately && func(nInterval);
                }
            }
            node.scheduleOnce((<any>node)._scrollNumber, nInterval, nCur == 0);
        }
        node.visible = false;
        (<any>node)._doScrollNumber = (dt: number, bImmediately: boolean) => {
            func(data.nInterval ?? ((data.nTime ?? 1.0) / nMax));
            node.visible = true;
        }
        if (fw.isNull(data.nDelay)) {
            (<any>node)._doScrollNumber();
        } else {
            node.scheduleOnce((<any>node)._doScrollNumber, data.nDelay);
        }
    }
    /**创建spine动画，必须传入父节点 */
    createSpine(data: CreateSpineParam): ccNode {
        if (!fw.isValid(data.parent)) {
            throw Error(`createSpine error: parent is invalid`);
        }
        //是否新建节点
        let node = data.node ??= new ccNode();
        //spine组件
        let spine = node.getComponent(sp.Skeleton) ?? node.obtainComponent(FWSpine);
        //渲染模式，包括 REALTIME（默认）、SHARED_CACHE 和 PRIVATE_CACHE 三种。
        // 1. REALTIME 模式，实时运算，支持 Spine 所有的功能。
        // 2. SHARED_CACHE 模式，将骨骼动画及贴图数据进行缓存并共享，相当于预烘焙骨骼动画。拥有较高性能，但不支持动作融合和动作叠加，只支持动作开始和结束事件。至于内存方面，当创建 N（N>=3）个相同骨骼、相同动作的动画时，会呈现内存优势。N 值越大，优势越明显。综上 SHARED_CACHE 模式适用于场景动画、特效、副本怪物、NPC 等，能极大提高帧率和降低内存。
        // 3. PRIVATE_CACHE 模式，与 SHARED_CACHE 类似，但不共享动画及贴图数据，且会占用额外的内存，仅存在性能优势，如果大量使用该模式播放动画可能会造成卡顿。若想利用缓存模式的高性能，但又存在换装需求（不能共享贴图数据）时，那么 PRIVATE_CACHE 就适合你。
        !fw.isNull(data.cacheMode) && spine.setAnimationCacheMode(data.cacheMode);
        //是否循环播放当前骨骼动画
        spine.premultipliedAlpha = false;
        //添加引用
        data.spine = spine;
        //数据保存
        (<any>node).data = data;
        //加载spine文件
        if (data.bImmediately) {
            //父节点（必须先添加到父节点，播放才能生效）
            data.parent.addChild(node);
            //加载资源
            let res = app.assetManager.loadBundleResSync(data.res, sp.SkeletonData);
            //设置spine资源
            spine.skeletonData = res;
            //播放相应动画
            data.animName && spine.setAnimation(0, data.animName, !!data.bLoop);
            //动画播放结束
            data.complete && spine.setCompleteListener((x: sp.spine.TrackEntry) => {
                data.complete(data, x);
            });
            //回调
            data.callback && data.callback(data);
        } else {
            //父节点（必须先添加到父节点，播放才能生效）
            data.parent.addChild(node);
            //加载资源
            node.loadBundleRes(data.res, sp.SkeletonData, (res) => {
                //父节点是否有效
                if (!fw.isValid(data.parent)) {
                    return;
                }
                //设置spine资源
                spine.skeletonData = res;
                //播放相应动画
                data.animName && spine.setAnimation(0, data.animName, !!data.bLoop);
                //动画播放结束
                data.complete && spine.setCompleteListener((x: sp.spine.TrackEntry) => {
                    data.complete(data, x);
                });
                //回调
                data.callback && data.callback(data);
            });
        }
        return node;
    }
    /**获取节点下坐标转化后的世界坐标 */
    getWorldPositionByLocalPosition(data: {
        node: ccNode,
        pos: Vec3,
    }) {
        return data.node.getComponent(UITransform).convertToWorldSpaceAR(data.pos);
    }
    /**创建帧动画 */
    createFrameAnimation(data: CreateFrameAnimation) {
        //是否新建节点
        let node = data.node ??= new ccNode();
        //父节点
        data.parent && data.parent.addChild(node);
        //加载spine文件
        let func = (res: Prefab) => {
            let animNode = instantiate(res);
            animNode.parent = node;
            //animetion
            let animation = data.anim = animNode.getComponent(ccAnimation);
            //播放指定动画
            animation.play(data.animName ?? `animation`);
            //事件
            data.events && data.events.forEach(element => {
                animation.on(element.eventName, () => {
                    element.callback(animation, data);
                });
            });
            //回调
            data.callback && data.callback(data);
        }
        if (data.bImmediately) {
            func(node.loadBundleResSync(data.res));
        } else {
            node.loadBundleRes(data.res, func);
        }
        return node;
    }
    /**世界坐标在节点上 */
    checkPosInNodeRange(worldPos: Vec3, node: ccNode) {
        if (!node.active) {
            return false;
        }
        node.inverseTransformPoint(fw._v3, worldPos);
        let uiTransform = node.getComponent(UITransform);
        //左边
        if (fw._v3.x < (0 - uiTransform.anchorX) * uiTransform.width) {
            return false;
        }
        //右边
        if (fw._v3.x > (1 - uiTransform.anchorX) * uiTransform.width) {
            return false;
        }
        //上边
        if (fw._v3.y > (1 - uiTransform.anchorY) * uiTransform.height) {
            return false;
        }
        //下边
        if (fw._v3.y < (0 - uiTransform.anchorY) * uiTransform.height) {
            return false;
        }
        //处于节点区域内
        return true;
    }
    /**base64生成Texture2D */
    base64ToTexture2D(base64: string, callback: (texture: Texture2D) => void) {
        if (base64) {
            let img = new Image();
            img.onload = function () {
                let imageAsset = new ImageAsset();
                imageAsset.reset(img);
                let texture = new Texture2D();
                texture.image = imageAsset;
                callback?.(texture);
            }
            img.onerror = function (err) {
                fw.printError(err);
            }
            img.src = base64.startsWith(`data:image`) ? base64 : `data:image/png;base64,${base64}`;
        } else {
            callback?.(null);
        }
    }
    /**base64生成SpriteFrame */
    base64ToSpriteFrame(base64: string, callback: (spriteFrame: SpriteFrame) => void) {
        // this.base64ToTexture2D(base64, (texture: Texture2D) => {
        //     if (texture) {
        //         let spriteFrame = new SpriteFrame();
        //         spriteFrame.texture = texture;
        //         callback?.(spriteFrame);
        //     } else {
        //         callback?.(null);
        //     }
        // });
        // base64 图片加载模板
        let url = `${base64}`
        app.assetManager.loadRemote({
                url: url,
                bCleanCache: true,
                option: { ext: `.png` },
                callback: (imageAsset:ImageAsset) => {
                    let spriteFrame = SpriteFrame.createWithImage(imageAsset)
                    callback?.(spriteFrame);
                },
                failCallback: () => {
                    callback?.(null);
                }
            });
    }
    /**uint8arrayToSpriteFrame */
    uint8ArrayToSpriteFrame(uint8Array: Uint8Array, width: number, height: number): SpriteFrame {
        //生成一张新的图来进行替换
        let imageAsset: ImageAsset = new ImageAsset();
        imageAsset.reset({
            _data: uint8Array,
            width: width,
            height: height,
            format: Texture2D.PixelFormat.RGBA8888,
            _compressed: false
        });
        let spriteFrame = SpriteFrame.createWithImage(imageAsset);
        return spriteFrame;
    }
    /**
     * 将透视相机 x，y z点转换成世界坐标
     * @param camera 
     * @param x 
     * @param y 
     * @param z
     * @returns 
     */
    cameraPosToMainPos(camera: Camera, x: number, y: number, z: number) {
        let cam = camera.camera;
        let scalex = cam.width / view.getVisibleSize().width;
        let scaley = cam.height / view.getVisibleSize().height;
        let ret = v3()
        let ray = camera.screenPointToRay(x * scalex, y * scaley);
        let zOffset = z - ray.o.z;
        // 如果z 轴没发生变化
        if (zOffset == 0 || ray.d.z == 0) {
            ray.computeHit(ret, 0);
        } else {
            ray.computeHit(ret, zOffset / ray.d.z);
        }
        return ret
    }
};

/**类型声明调整 */
declare global {
    namespace globalThis {
        type AddTouchHideParam = {
            /**是否移除 */
            bRemove?: boolean
            /**回调 */
            callback?: Function
        }
        /**创建FrameAnimation */
        type CreateFrameAnimation = {
            /**节点 */
            node?: ccNode
            /**父节点 */
            parent?: ccNode
            /**spine资源 */
            res: BundleResConfig
            /**动画名称 */
            animName?: string
            /**Animation对象（无需传入，创建成功后自动赋值） */
            anim?: ccAnimation
            /**创建成功回调 */
            callback?: (data: CreateFrameAnimation) => void
            /**立即创建 */
            bImmediately?: boolean
            /**开始播放时触发 */
            events?: { eventName: ccAnimation.EventType, callback: (anim: ccAnimation, data: CreateFrameAnimation) => void }[]
        }
        /**创建spine */
        type CreateSpineParam = {
            /**节点 */
            node?: ccNode
            /**父节点 */
            parent?: ccNode
            /**spine资源 */
            res: BundleResConfig
            /**动画名称 */
            animName?: string
            /**是否循环播放 */
            bLoop?: boolean
            /**sp.Skeleton对象（无需传入，创建成功后自动赋值） */
            spine?: sp.Skeleton
            /**缓存模式 */
            cacheMode?: sp.AnimationCacheMode
            /**用来设置动画播放一次循环结束后的事件监听 */
            complete?: (data: CreateSpineParam, x: sp.spine.TrackEntry) => void
            /**回调 */
            callback?: (data: CreateSpineParam) => void
            /**立即创建 */
            bImmediately?: boolean
        }
        /**滚动数值 */
        type ScrollNumberParam = {
            /**文本节点 */
            node: ccNode
            /**起始值 */
            began?: number
            /**结束值 */
            end: number
            /**滚动次数 */
            nCount?: number
            /**滚动时长 */
            nTime?: number
            /**滚动间隔 */
            nInterval?: number
            /**延时启动 */
            nDelay?: number
            /**自己格式化 */
            format?: (nValue: number, data: ScrollNumberParam) => void
            /**每次更新 */
            update?: (data: ScrollNumberParam) => void
            /**回调 */
            callback?: (data: ScrollNumberParam) => void
        }
        /**创建面板参数 */
        type CreatePanelParam = {
            /**父节点 */
            parent?: ccNode
            /**大小 */
            size?: Size
            /**空节点 */
            blank?: boolean
            /**颜色 */
            color?: Color
            /**是否屏蔽点击（默认屏蔽） */
            bNotShieldClick?: boolean
            /**点击回调 */
            clickCallback?: (data: CreatePanelParam) => void
        }
        /**菜单参数 */
        interface FWOneMenuBtnParam<dataType> {
            /**按钮节点 */
            node: ccNode
            /**更换纹理，注意：默认更换Sprite_btn_normal，Sprite_btn_select的纹理 */
            file?: BundleResConfig
            /**更换文本，注意：默认更换Label_btn_normal，Label_btn_select的纹理 */
            text?: string
            /**点击回调 */
            callback?: (data: FWOneMenuBtnParam<dataType>) => void
            /**扩展参数 */
            data?: dataType
            /**可自定义扩展参数 */
            [key: AnyKeyType]: any
        }
        type FWCreateMenuParam<dataType = any> = {
            /**按钮列表 */
            btns: FWOneMenuBtnParam<dataType>[]
            /**不设置默认选中，默认设置 */
            bNotDefault?: boolean
            /**默认选中index，不传默认选中第一个 */
            defaultIndex?: number
            /**默认选中检测 */
            defaultCallback?: (btn: FWOneMenuBtnParam<dataType>) => boolean
            /**挂载对象，初始化时将menu赋值给当前对象 */
            mountObject?: any
        }
        interface FWMenuParam<dataType> {
            /**当前选中节点 */
            target?: FWOneMenuBtnParam<dataType>
            /**菜单数据 */
            menuData: FWCreateMenuParam<dataType>
            /**设置默认 */
            setDefault: (item: number | FWOneMenuBtnParam<dataType>) => void
        }
        type FWAddMaskParam = {
            /**UI节点 */
            node: ccNode
            /**资源 */
            bundleResMaskConfig?: BundleResConfig
        }
    }
}
