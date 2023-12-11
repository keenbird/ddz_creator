import { Label, Node, Prefab, Vec3, _decorator, instantiate, js, math } from 'cc';
import { EVENT_ID } from '../../../app/config/EventConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
import { guide_hand_1 } from '../../../resources/ui/guide/script/guide_hand_1';
import proto from '../../../app/center/common';
import { DF_RATE, DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { type } from '../../../../engine/cocos/core/data/class-decorator';
const { ccclass } = _decorator;

@ccclass('megaGift_viewBase')
export class megaGift_viewBase extends (fw.FWComponent) {
	paying: boolean;
	popupData: megaGiftDataParam_base = <any>{};
	guideNode: Node;
	needGuide: boolean;
	isVertical: boolean = false;
	onClickCancelBuy: Function;
	close: Function;
	initData() {
		this.needGuide = false;
	}
	protected initEvents(): boolean | void {
        //返回键
        this.bindEvent({
            eventName: "closeMegaGift",
            callback: () => {
                this.close();
            }
        });
    }
	protected initView(): boolean | void {
		this.Items.Text_time_once.string = fw.language.get("Only one chance,choose any one to buy.")

		if (!center.luckyCard.checkShowMegaGift()) {
			fw.print("[error] megaGift:initView config == nil")
			this.close()
			return
		}

		let config = center.luckyCard.getMegaGiftCfg()
		if ((!config.megaGifPrice) || config.megaGifPrice.length == 0) {
			this.close()
			return
		}

		this.paying = false

		this.Items.Panel_1.active = config.megaGifPrice.length == 1
		this.Items.Panel_2.active = config.megaGifPrice.length == 2
		let worldPosition = fw.v3(0, 0, 0);
		if (config.megaGifPrice.length == 1) {
			this.initPanelView(this.Items.Panel_1, this.Items.Panel_1, 0)
			worldPosition = this.Items.Panel_1.Items.Image_buy.getWorldPosition();
		} else if (config.megaGifPrice.length == 2) {
			this.initPanelView(this.Items.Panel_2, this.Items.Panel_2.Items.Panel_price1, 0)
			this.initPanelView(this.Items.Panel_2, this.Items.Panel_2.Items.Panel_price2, 1)
			worldPosition = this.Items.Panel_2.Items.Panel_price2.Items.Image_buy.getWorldPosition();
		}
		let showMegaGiftCount = app.file.getIntegerForKey("showMegaGift", 0)
		if (showMegaGiftCount < 2) {
			// 新手引导统计
			app.file.setIntegerForKey("showMegaGift", showMegaGiftCount + 1)
			this.showGuide(worldPosition)
		}
	}

	public showGuide(worldPosition: Vec3) {
		this.needGuide = true;
		if (!fw.isValid(this.guideNode)) {
			this.node.loadBundleRes(fw.BundleConfig.resources.res[`ui/guide/guide_hand_2`],(res: Prefab) => {
				// 异步原因可能存在多次回调
				if (!fw.isValid(this.guideNode)) {
					let node = instantiate(res);
					this.guideNode = node
					this.node.addChild(node);
					node.setWorldPosition(worldPosition.add3f(100, -80, 0));
				}
			});
		}
	}

	public removeGuide() {
		this.needGuide = false;
		if (fw.isValid(this.guideNode)) {
			this.guideNode.removeFromParent(true)
			this.guideNode = null;
		}
	}

	protected initBtns(): boolean | void {

	}

	cloceFun() {
		this.close();
	}

	initPanelView(panel, panelPrice, index) {
		let config = center.luckyCard.getMegaGiftCfg()
		let gifPrice = config.megaGifPrice[index]
		let nPrice = gifPrice.price / 10;
		let nRate = center.luckyCard.getMegaGiftRate(index+1)

		panelPrice.Items.Text_rate.getComponent(Label).string = `+${app.func.numberAccuracy(nRate * 100)}%`;
		panelPrice.Items.Text_price.getComponent(Label).string = DF_SYMBOL + (js.formatStr("%s", nPrice));

		panelPrice.Items.Text_cash.getComponent(Label).string = DF_SYMBOL + (js.formatStr("%s", gifPrice.prop_num / DF_RATE));
		panelPrice.Items.Text_bonus.getComponent(Label).string = DF_SYMBOL + (js.formatStr("%s", gifPrice.bonus_num / DF_RATE));
		panelPrice.Items.Text_total.getComponent(Label).string = DF_SYMBOL + (js.formatStr("%s", (gifPrice.bonus_num + gifPrice.prop_num) / DF_RATE));
		if (fw.isValid(panelPrice.Items.Text_price_nor)) {
			panelPrice.Items.Text_price_nor.getComponent(Label).string = DF_SYMBOL + (js.formatStr("%s", (gifPrice.bonus_num + gifPrice.prop_num) / DF_RATE));
		}

		panelPrice.Items.Label_cash.string = fw.language.get("Cash")
		panelPrice.Items.Label_bonus.string = fw.language.get("Bonus")
		panelPrice.Items.Label_total.string = fw.language.get("Total Get")
		panel.Items.other_amount_t.string = fw.language.get("Other Amount>>")

		let sleepTime = 5
		let onBuy = () => {
			if (gifPrice && !this.paying) {
				this.paying = true
				let data:PayChannelData = {
					lRMB: Number(gifPrice.price) / 10,
					orderCallback: () => {
						center.luckyCard.sendMegaBuy(gifPrice.gift_rid)
					},
					isAutoSelect: true,
					megaGiftData: gifPrice,
					needGuide: this.needGuide
				}
				center.mall.payChooseType(data, this.isVertical)
				setTimeout(() => {
					this.paying = false
				}, sleepTime)
			}
			// 因为这里会刷新needGuide所以放后面
			this.removeGuide()
		}

		panelPrice.Items.Image_buy.onClickAndScale(() => {
			onBuy()
		});
		panel.Items.Image_close.onClickAndScale(() => {
			this.onClickCancelBuy()
		});
		panel.Items.other_amount.onClickAndScale(() => {
			this.onClickOtherAmount()
		});
	}

	onClickOtherAmount() {
		this.onClickCancelBuy()
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`shop/shop_main`]
		});
	}
}

declare global {
	namespace globalThis {
		type plaza_megaGift = megaGift_viewBase
		type megaGiftDataParam_base = {
			cancelBuyCallback?: Function
		}
	}
}
