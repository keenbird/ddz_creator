import { _decorator, Sprite, Label, SpriteFrame } from 'cc';
import { isNull, LUCKY3PT_CARDTYPE, LUCKY3PT_CARDTYPE_NAME } from '../../const';
import { lucky3pt } from './model/desk';
const { ccclass, property } = _decorator;


@ccclass('lucky3patti_trends_item')
export class lucky3patti_trends_item extends (fw.FWComponent) {
	initData() {

	}
	protected initEvents(): boolean | void {

	}
	protected initView(): boolean | void {
		this.stopNewFlagAni();
	}
	protected initBtns(): boolean | void {

	}
	// public setData<T>(data_: T): void {
	// 	this.m_desk = data_["deskBean"];
	// }
	public setData(data_: lucky3pt.GameTrend): void {
		if (!fw.isNull(data_)) {
			// 修改背景
			this.Items.sprite_item_bg.loadBundleRes(fw.BundleConfig.plaza.res[`lucky3patti/lucky3patti/img/common/X_bg_${LUCKY3PT_CARDTYPE_NAME[data_.nCardType]}/spriteFrame`],(res: SpriteFrame) => {
				this.Items.sprite_item_bg.obtainComponent(Sprite).spriteFrame = res;
			});
			this.Items.label_item.obtainComponent(Label).string = LUCKY3PT_CARDTYPE_NAME[data_.nCardType].toUpperCase();
		}
	}
	/**
	 * name
	 */
	public runNewFlagAni(): void {
		this.Items.sprite_flag.active = true;
	}
	public stopNewFlagAni(): void {
		this.Items.sprite_flag.active = false;
	}

}
