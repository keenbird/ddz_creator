import { _decorator, Node as ccNode } from 'cc';
const { ccclass } = _decorator;

//部分游戏中界面的层级
let nZOrder = 0;
const viewZOrder = {
    Jetton: nZOrder, //下注
    Head: ++nZOrder, //头像
    JettonAnim: ++nZOrder, //下注动画
    Message: ++nZOrder, //聊天气泡
    Anim: ++nZOrder, //动画（“开始”、“结束”等）
    Chat: ++nZOrder, //聊天界面
    Guide: ++nZOrder, //引导
    Menu: ++nZOrder, //菜单
    Dialog: ++nZOrder, //游戏内弹框
    Touch: ++nZOrder, //顶层触摸
};

@ccclass('main_GameBase')
export class main_GameBase extends (fw.FWComponent) {
    /**部分游戏中界面的层级 */
    viewZOrder = viewZOrder
    /**对应深度的视图节点（可通过名称访问，也可通过zOrder访问） */
    viewZOrderNode: { [P in keyof typeof viewZOrder | number]: ccNode } = <any>{}
    /**可选筹码最大数量 */
    nMaxChipCount = 5
    /**魔法表情界面 */
    emojiView: ccNode
    /**客户端座位索引映射玩家 */
    playerByIndex: { [index: number]: PlayerSitInfo } = {}
    /**服务器座位号映射玩家 */
    playerByChairID: { [nChairID: number]: PlayerSitInfo } = {}
    onLoad() {
        //初始化数据
        this.initData_GameMainBase();
        //初始化按钮
        this.initBtns_GameMainBase();
        //初始化界面
        this.initView_GameMainBase();
        //初始化事件
        this.initEvents_GameMainBase();
        //父类
        super.onLoad();
    }
    /**初始化界面 */
    initView_GameMainBase() {
        //刷新模式
        this.updateMode();
    }
    /**初始化数据 */
    initData_GameMainBase(): void {
        //创建对应深度的视图节点
        let baseNode = new ccNode();
        this.node.addChild(baseNode);
        app.func.setWidget({
            node: baseNode
        });
        app.func.traversalObject(this.viewZOrder, (element, key: string) => {
            let view = new ccNode(`zorderNode_${key}`);
            this.viewZOrderNode[element] = view;
            this.viewZOrderNode[key] = view;
            baseNode.addChild(view);
            app.func.setWidget({
                node: view
            });
        });
    }
    /**初始化一个可能的按钮 */
    private initOneBtn_GameMainBase(node: ccNode, callback: Function) {
        node && node.onClickAndScale(callback);
    }
    /**初始化事件 */
    initBtns_GameMainBase(): void {
        //聊天
        this.initOneBtn_GameMainBase(this.Items.Node_chat ?? this.Items.Sprite_chat, this.onClickChat.bind(this));
        //退出
        this.initOneBtn_GameMainBase(this.Items.Node_close ?? this.Items.Sprite_close, this.onClickMenu.bind(this));
        //设置
        this.initOneBtn_GameMainBase(this.Items.Node_setting ?? this.Items.Sprite_setting, this.onClickSetting.bind(this));
        //玩家
        this.initOneBtn_GameMainBase(this.Items.Node_online_people ?? this.Items.Sprite_online_people, this.onClickPlayer.bind(this));
        //规则
        this.initOneBtn_GameMainBase(this.Items.Node_rule ?? this.Items.Sprite_rule, this.onClickRule.bind(this));
        //商城
        this.initOneBtn_GameMainBase(this.Items.Node_buy ?? this.Items.Node_shop, this.onClickShop.bind(this));
    }
    /**刷新模式 */
    updateMode() {
        //真金 or 练习场
        let nodeReal = this.Items.Node_real;
        let nodeShop = this.Items.Node_buy ?? this.Items.Node_shop;
        let bPractice = center.roomList.isPracticeRoom();
        nodeShop && (nodeShop.active = !bPractice);
        nodeReal && (nodeReal.active = bPractice);
        //调整icon
        if (this.Items.Sprite_self_icon) {
            app.file.updateImage({
                node: this.Items.Sprite_self_icon,
                bundleResConfig: app.game.getRes(`ui/main/img/atlas/${bPractice ? `gm_buy_icon_practice` : `gold_rs`}/spriteFrame`),
            });
        }
    }
    /**初始化事件 */
    initEvents_GameMainBase(): void {
        //返回键事件
        this.bindEvent({
            eventName: app.event.CommonEvent.Keyback,
            callback: this.onKeyBackClick.bind(this),
        });
        //自动默认监听服务器时间
        app.func.traversalObject(app.game.internet.cmd, (element, key) => {
            if (typeof (key) == `string` && this[key]) {
                this.bindEvent({
                    eventName: key,
                    callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam) => {
                        this[key](arg1.data);
                    }
                });
            }
        });
    }
    /**返回按钮事件 */
    onKeyBackClick() {
        this.exitGame();
    }
    /**充值限制状态 */
    getRechargeState() {
        return true;
    }
    /**是否允许前往真金场操作 */
    getGotoRealVisible() {
        return true;
    }
    /**前往练习场 */
    doPractice(data?: any) {
        //TODO
    }
    /**前往真金 */
    doReal(data?: any) {
        //TODO
    }
    /**前往真金场，游戏存在练习场功能时需要实现 */
    gotoReal() {
        app.popup.showToast(`This game not found real game`);
    }
    /**前往练习场，游戏存在练习场功能时需要实现 */
    gotoPractice() {
        app.popup.showToast(`This game not found practice game`);
    }
    /**选择模式 */
    showModeSwitch() {
        app.popup.showDialog({
            viewConfig: app.game.getRes(`ui/modeSwitch/modeSwitch`),
            data: {
                doPracticeCallback: () => {
                    this.doPractice();
                },
                doRealCallback: () => {
                    this.doReal();
                },
            }
        });
    }
    /**菜单界面 */
    onClickMenu() {
        app.popup.showDialog({
            viewConfig: app.game.getRes(`ui/menu/menu`),
        });
    }
    /**设置界面 */
    onClickSetting() {
        app.popup.showDialog({
            viewConfig: fw.BundleConfig.resources.res[`ui/setting/setting`],
        });
    }
    /**设置帮助 */
    onClickHelp() {
        app.popup.showToast({ text: `TODO help` });
    }
    /**聊天界面 */
    onClickChat(_btn: ccNode) {
        app.popup.showDialog({
            viewConfig: app.game.getRes(`ui/chat/chat`),
            data: Object.assign({ btn: _btn }, app.game.chatConfig),
        });
    }
    /**点击商城 */
    onClickShop(): void {
        this.popupShop()
    }
    /**展示商城 */
    popupShop() {
        let nLastPayValue = this.getMallLastPayValue();
		let nBuffNum = this.getBuffNum();
		let bShow = this.canShowMegaGift();

		let showMall = () => {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`shop/shop_main`],
			});
		}

		if (nBuffNum == 1 && bShow) {
			let tbMegaCfg = this.getMegaGiftCfg();
			let nMegaPrice = tbMegaCfg.mega_cfg1.price / 10;
			showMall();
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`megaGift/MegaGift`]
			});
		} else {
			showMall();
		}
    }
    /**点击游戏规则 */
    onClickRule(): void {
        app.popup.showDialog({
            viewConfig: app.game.getRes(`ui/rule/rule`)
        });
    }
    /**点击在线玩家 */
    onClickPlayer(): void {
        //子类自己实现
    }
    /**退出游戏 */
    exitGame(): void {
        app.gameManager.exitGame();
    }

    canShowMegaGift() {
		let result = false;
		if (center.luckyCard.checkShowMegaGift() && app.sdk.isSdkOpen("firstpay")) {
			result = true;
		}

		return result;
	}
    getBuffNum() {
        return center.user.getBuffNum();
    }

	getMegaGiftCfg() {
		return center.luckyCard.getMegaGiftCfg();
	}

	getMallLastPayValue() {
		return app.file.getIntegerForKey("LastPayValue", 0, { all: true });
	}
}

/**类型声明调整 */
declare global {
    namespace globalThis {
        /**通过nChairID或者index获得playerInfo */
        type PlayerSitInfo = { node?: ccNode, index?: number, nChairID?: number }
    }
}
