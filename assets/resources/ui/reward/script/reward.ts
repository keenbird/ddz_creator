import { Label, Sprite, SpriteFrame, _decorator } from 'cc';
const { ccclass } = _decorator;

import proto from '../../../../app/center/common';
import { btn_common } from '../../btn/script/btn_common';
import { EVENT_ID } from '../../../../app/config/EventConfig';
import { DF_RATE } from '../../../../app/config/ConstantConfig';
import { FWDialogViewBase } from '../../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('reward')
export class reward extends FWDialogViewBase {
	/**配置参数 */
	popupData: RewardDataParam = <any>{}
	protected initView(): boolean | void {
		//隐藏部分界面
		this.Items.Node_item.active = false;
		//调整部分界面显示
		this.Items.Label_tip.getComponent(Label).string = ``;
	}
	protected initBtns(): boolean | void {
		//OK
		this.Items.Node_ok.getComponent(btn_common).initStyle({
			styleId: 1,
			text: `Ok`,
			callback: () => {
				this.onClickClose();
			}
		});
	}
	protected initEvents(): boolean | void {
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_PAY_SUCCESS,
			],
			callback: (arg1, arg2) => {
				this.Items.Sprite_title.active = false;
			}
		});
	}
	//添加一个物品
	addItem(data: RewardItem) {
		let item = this.Items.Node_item.clone();
		this.Items.Layout.addChild(item);
		item.active = true;
		// //动画
		// tween(item)
		// 	.by(0.5, { angle: 30 })
		// 	.union()
		// 	.repeatForever()
		// 	.start();
		//图标
		item.Items.Sprite_icon.active = false;
		let nGoodsID = app.func.toNumber(data.nGoodsID);
		let goodInfo = center.goods.getGoodsInfo(nGoodsID);
		if (!data.bundleResConfig) {
			switch (nGoodsID) {
				case center.goods.gold_id.cash:
				case center.goods.gold_id.withdraw_gold:
					data.bundleResConfig = fw.BundleConfig.resources.res[`ui/reward/img/atlas/Rs_jinbi/spriteFrame`]
					break;
				case center.goods.gold_id.bonus:
					data.bundleResConfig = fw.BundleConfig.resources.res[`ui/reward/img/atlas/Rs_bonus/spriteFrame`]
					break;
				default:
					break;
			}
		}
		if (!center.goods.isGold(nGoodsID) && goodInfo) {
			app.file.updateImage({
				node: item.Items.Image_icon,
				serverPicID: goodInfo.packet_pic_id,
			});
		} else if (data.bundleResConfig) {
			item.Items.Sprite_icon.loadBundleRes(data.bundleResConfig,(res: SpriteFrame) => {
				item.Items.Sprite_icon.getComponent(Sprite).spriteFrame = res;
				item.Items.Sprite_icon.active = true;
			});
		} else {
			item.Items.Sprite_icon.active = true;
		}
		//数量
		let nGoodsNum = data.nGoodsNum;
		if (nGoodsNum > 0 && center.goods.isGold(nGoodsID)) {
			nGoodsNum = nGoodsNum / DF_RATE
		}
		item.Items.Label_count.getComponent(Label).string = `x${nGoodsNum}`;
		//返回引用
		return item;
	}
	updatePopupView() {
		//扩展参数
		let extend = this.popupData.extend ?? {};
		//标题
		this.Items.Sprite_title.active = !extend.bDontShowTitle;
		//提示语
		this.Items.Label_tip.getComponent(Label).string = extend.tip || "";
		//清空列表
		this.Items.Layout.removeAllChildren(true);
		//统计数据
		let gold = 0;
		let reward = [];
		let rewardTemp = [];
		this.popupData.reward.forEach(element => {
			if (center.goods.isGoldMerge(element.nGoodsID)) {
				gold = gold + element.nGoodsNum;
			} else {
				rewardTemp.push(element);
			}
		});
		if (gold > 0) {
			reward.push({nGoodsID:center.goods.gold_id.cash,nGoodsNum:gold});
		}
		rewardTemp.forEach(element => {
			reward.push(element);
		});
		reward.forEach(element => {
			this.addItem(element);
		});
	}
	onClickClose() {
		//是否有关闭回调
		this.popupData.closeCallback && this.popupData.closeCallback(this.popupData);
		//时间通知
		app.event.dispatchEvent({
			eventName: `CommonRewardClosed`,
			data: this.popupData,
		});
		//正常关闭
		super.onClickClose();
	}
}

declare global {
	namespace globalThis {
		type type_reward = reward
		type RewardDataParam = {
			/**奖励列表 */
			reward: RewardItem[]
			/**扩展数据 */
			extend?: RewardExtendParam
			/**关闭回调 */
			closeCallback?: (data: RewardDataParam) => void
		}
		type RewardItem = {
			/**物品ID */
			nGoodsID: number
			/**物品数量 */
			nGoodsNum: number
			/**显示样式 */
			bundleResConfig?: BundleResConfig
		}
		type RewardExtendParam = {
			/**提示信息 */
			tip?: string
			/**不显示标题 */
			bDontShowTitle?: boolean
			/**通用奖励协议 */
			data?: proto.plaza_tips.Irewardtips_s
		}
	}
}
