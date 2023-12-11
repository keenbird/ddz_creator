import { _decorator, Node as ccNode } from 'cc';
const { ccclass } = _decorator;

/**二级界面基础 */
@ccclass('plaza_secondary_base')
export class plaza_secondary_base extends (fw.FWComponent) {
	/**初始化是否完成 */
	bInit: boolean = false
	/**配置参数 */
	data: UpdateSecondaryParam
	setData(data: UpdateSecondaryParam) {
		this.data = data;
	}
	onLoad() {
		//初始化按钮
		this.initBtns_plaza_secondary_base();
		//初始化按钮
		this.initEvents_plaza_secondary_base();
		//父类
		super.onLoad();
		//初始化完成
		this.bInit = true;
	}
	initBtns_plaza_secondary_base() {
		if (this.Items.Sprite_close) {
			this.Items.Sprite_close.onClickAndScale(() => {
				this.data && this.data.visible && this.data.visible(this.node);
			});
		}
	}
	initEvents_plaza_secondary_base() {
		//返回键事件
		this.bindEvent({
			eventName: app.event.CommonEvent.Keyback,
			callback: () => {
				if (this.node.active) {
					this.onClickClose();
				} else {
					return true;
				}
			}
		});
	}
	onClickClose() {
		this.data && this.data.visible && this.data.visible(this.node);
	}
}
