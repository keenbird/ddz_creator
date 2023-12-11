import { Node as ccNode, __private, _decorator, isValid } from 'cc';
const { ccclass, property } = _decorator;
import { EDITOR } from 'cc/env';

@ccclass('FWGameAutoComponent')
export class FWGameAutoComponent extends (fw.FWComponent) {
	/**
	 * 需要先进入游戏，指定游戏配置后才可生效
	 * 组件前缀，自动添加app.game.getCom(`name`)，不重复添加
	 */
	@property({})
	componentFront: string = ``
	/**自动添加组件（在node节点被赋值时，主动添加） */
	@property({})
	bAutoAddCom: boolean = true
	/**旧获取Component函数 */
	__oldGetComponent: any
	/**节点信息 */
	_node: ccNode = null
	get node() {
		return this._node;
	}
	set node(value: ccNode) {
		//相同不处理
		if (this._node == value) {
			return;
		}
		//还原之前的节点
		if (this._node && !EDITOR) {
			this._node.getComponent = this.__oldGetComponent;
		}
		//新赋值
		this._node = value;
		//调整新节点
		if (value && !EDITOR) {
			//自动脚本时，可能对应的脚本还未添加到节点上，所以在使用时调整getComponent的功能
			this.__oldGetComponent = value.getComponent.bind(value);
			value.getComponent = (...args: any[]) => {
				let com = this.__oldGetComponent(...args);
				if (com) {
					return com;
				} else {
					this.addAutoComponent();
					return this.__oldGetComponent(...args);
				}
			}
			//主动添加
			if (this.bAutoAddCom) {
				this.addAutoComponent();
			}
		}
	}
	protected addAutoComponent() {
		if (this.componentFront && isValid(app, true) && !EDITOR) {
			//获取组件
			let com = app.gameManager.getCom(this.componentFront);
			//尝试添加组件
			this.__oldGetComponent(com) ?? this.addComponent(com);
			//清理
			this.componentFront = ``;
		}
	}
	protected __preload(): void {
		super.__preload?.();
		//尝试添加组件
		this.addAutoComponent();
	}
}
