
import { _decorator, Node as ccNode, Animation, Prefab, instantiate, UITransform, ScrollView, Color, Sprite, tween } from 'cc';
import { FWDialogViewBase } from '../../../../app/framework/view/popup/FWDialogViewBase';
import { isNull, LUCKY3PT_TIPS_ID } from '../../const';
import { lucky3pt } from './model/desk';
import { lucky3patti_chips } from './lucky3patti_chips';
import { lucky3patti_bigwinner } from './lucky3patti_bigwinner';
import { lucky3patti_trends_item } from './lucky3patti_trends_item';
import { lucky3patti_betarea } from './lucky3patti_betarea';
import { lucky3patti_jackpot } from './lucky3patti_jackpot';
import { lucky3patti_waiting } from './lucky3patti_waiting';
import { lucky3patti_clock } from './lucky3patti_clock';
import { lucky3patti_pokerheap } from './lucky3patti_pokerheap';
import { ACTOR } from '../../../../app/config/cmd/ActorCMD';
import { Label } from 'cc';
import { DF_RATE } from '../../../../app/config/ConstantConfig';
import { Tween } from 'cc';
import { v3 } from 'cc';
import { EVENT_ID } from '../../../../app/config/EventConfig';
import { LUCKY3PT_TREND_COUNT } from '../../../../app/center/plaza/lucky3PattiCenter';

const { ccclass, property } = _decorator;

@ccclass('lucky3patti_main')
export class lucky3patti_main extends FWDialogViewBase {
	private m_desk: lucky3pt.DeskBean;
	@property(ccNode)
	private m_listTrendItem: ccNode;

	initData() {
		this.m_desk = this.data;
	}
	protected initEvents(): boolean | void {
		var teventsData = [
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_END, callback: this.onGameEnd.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_TIPS, callback: this.onGameTips.bind(this) },
		];
		teventsData.forEach(element => {
			this.bindEvent(
				{
					eventName: element.event,
					callback: <T>(data: T) => {
						if (element.callback) {
							element.callback(element.event, data["dict"]);
						}
					}
				}
			);
		});
	}
	protected initView(): boolean | void {
		this.m_listTrendItem.active = false;
		this.Items.prefab_chips.obtainComponent(lucky3patti_chips).setData({ deskBean: this.m_desk });
		this.Items.prefab_bigwinner.obtainComponent(lucky3patti_bigwinner).setData({ deskBean: this.m_desk });
		this.Items.prefab_betarea.obtainComponent(lucky3patti_betarea).setData({ deskBean: this.m_desk });
		this.Items.prefab_jackpot.obtainComponent(lucky3patti_jackpot).setData({ deskBean: this.m_desk });
		this.Items.prefab_waiting.obtainComponent(lucky3patti_waiting).setData({ deskBean: this.m_desk });
		this.Items.prefab_cardtype.obtainComponent(lucky3patti_clock).setData({ deskBean: this.m_desk });
		this.Items.node_cards.obtainComponent(lucky3patti_pokerheap).setData({ deskBean: this.m_desk });

		this.updateTrends(this.m_desk.getTrends(LUCKY3PT_TREND_COUNT));

	}
	protected initBtns(): boolean | void {
		this.Items.sprite_close.onClickAndScale(() => {
			this.onClickClose();
		});
		this.Items.sprite_trend.onClickAndScale(() => {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res["lucky3patti/lucky3patti/lucky3patti_records"],
				data: this.m_desk,
			});
		});

	}
	public setData<T>(data_: T): void {
		this.m_desk = data_["deskBean"];
	}

	private onGameTips<T, U>(cmd_: T, param_: U): void {
		// 如果用户在小游戏界面 收到了TipsID_Close TipsID_Nobet TipsID_Maintenance 服务器会同时踢出玩家 如果界面打开了  注意要关闭界面 走登出流程
		switch (param_["nTipsID"]) {
			case LUCKY3PT_TIPS_ID.close:
			case LUCKY3PT_TIPS_ID.maintenance:
			case LUCKY3PT_TIPS_ID.invalidChair:
			case LUCKY3PT_TIPS_ID.areaScoreLimit:
			case LUCKY3PT_TIPS_ID.totalScoreLimit:
			case LUCKY3PT_TIPS_ID.nobet: {
				this.onClickClose();
			}
		}
	}
	/**
	 * 结算流程 播放停止下注动画1s    显示牌以及牌型以及中奖区域 这个区域自己的中奖值   最后一秒 重置桌面 发牌动画 
	 * @param cmd_ 
	 * @param param_ 
	 */
	private onGameEnd<T, U>(cmd_: T, param_: U): void {
		tween(this)
			.call(() => {
				//下注结束动画
				app.event.dispatchEvent({
					eventName: EVENT_ID.EVENT_LUCKY3PATTI_BALANCE_PRE,
				});
			})
			.delay(1)
			.call(() => {
				// 刷新最后一次下注的分数
				// this.Items.prefab_betarea.obtainComponent(lucky3patti_betarea).setData({ deskBean: this.m_desk });
				app.event.dispatchEvent({
					eventName: EVENT_ID.EVENT_LUCKY3PATTI_BALANCE,
				});
				let tcount = this.m_desk.getTrendCount() - 1;
				this.addTrendItem(tcount);

				// 奖池动画
				var tresultData: lucky3pt.GameResultData = this.m_desk.getResultData();
				if (!fw.isNull(tresultData) && 0 == tresultData.nWinArea) {
					this.playJackpot(tresultData.nBlowPrizeGold || 0);
				}
			})
			.start();
	}

	private updateTrends(data_: lucky3pt.GameTrend[] = null): void {
		if (fw.isNull(data_)) {
			this.Items.prefab_trends.Items.Layout.removeAllChildren(true);
			return;
		}
		let twidth = 0;
		for (var i = 0; i < data_.length; ++i) {
			var view = this.m_listTrendItem.clone();
			view.active = true;
			var viewBase = view.obtainComponent(lucky3patti_trends_item);
			twidth = view.obtainComponent(UITransform).width;
			this.Items.prefab_trends.Items.Layout.addChild(view);


			viewBase.setData(data_[i]);
			if (i == data_.length - 1) {
				viewBase.runNewFlagAni();
			}
		}
		this.Items.prefab_trends.Items.content.obtainComponent(UITransform).width = twidth * data_.length;
		this.Items.prefab_trends.Items.list_trends.obtainComponent(ScrollView).scrollToRight();
	}

	/**
	 * @param index_ 延时刷新,添加到第几个数据的下标，避免玩家切后台后显示的都是最后一个的数据
	 */
	public addTrendItem(index_: number): void {
		let tnode = this.Items.prefab_trends.Items.Layout;
		let titems = tnode.getComponentsInChildren(lucky3patti_trends_item);
		if (!fw.isNull(titems)) {
			titems.forEach(element => {
				element.stopNewFlagAni()
			});
		}
		var view = this.m_listTrendItem.clone();
		view.active = true;
		var viewBase = view.obtainComponent(lucky3patti_trends_item);
		var twidth = view.obtainComponent(UITransform).width;
		this.Items.prefab_trends.Items.Layout.addChild(view);

		viewBase.setData(this.m_desk.getTrendsByIndex(index_));
		this.Items.prefab_trends.Items.content.obtainComponent(UITransform).width += twidth;
		this.Items.prefab_trends.Items.list_trends.obtainComponent(ScrollView).scrollToRight();
		viewBase.runNewFlagAni();
	}

	/**
	 * 奖池动画
	 * @param num_ 变动的金币
	 */
	private playJackpot(jackNum: number): void {
		let jiangchi_anim = this.Items.jiangchi_anim;
		jiangchi_anim.active = true;

		let zhuanpang = jiangchi_anim.getChildByName("tx_haiwai_zhuanpan");
		zhuanpang.active = true;
		zhuanpang.setPosition(0, 0, 0);

		let tangchuang = jiangchi_anim.getChildByName("tx_haiwai_zhuanpan_tanchuang");
		tangchuang.active = false;
		tangchuang.setPosition(0, 0, 0);


		zhuanpang.obtainComponent(Animation).play("animation0");

		zhuanpang.obtainComponent(Animation).once(Animation.EventType.FINISHED, () => {
			zhuanpang.obtainComponent(Animation).play("animation1");

			tangchuang.active = true;
			tangchuang.obtainComponent(Animation).play();

			tween(zhuanpang)
				.by(0.5, { position: v3(-235, 0, 0) })
				.start();

			tween(tangchuang)
				.by(0.5, { position: v3(235, 0, 0) })
				.start();


			//玩家数据
			//最大赢家
			let player = tangchuang.Items.Node_player_1;
			let info = this.m_desk.getWinner();

			if (info) {
				player.active = true;
				app.file.updateHead({
					node: player.Items.Image_head,
					serverPicID: info.szMD5FaceFile,
				});

				//名字
				player.Items.Text_name.obtainComponent(Label).string = info.szUserName;

				//赢金
				player.Items.Text_chips.obtainComponent(Label).string = String(info.nWinScore / DF_RATE);
			} else {
				player.active = false;
			}

			//自己
			player = tangchuang.Items.Node_player_2;
			let resultData = this.m_desk.getResultData();
			if (!fw.isNull(resultData)) {
				player.active = true;

				app.file.updateHead({
					node: player.Items.Image_head,
					serverPicID: center.user.getActorProp(ACTOR.ACTOR_PROP_DBID),
				});

				//名字
				player.Items.Text_name.obtainComponent(Label).string = center.user.getActorName();

				//赢金
				player.Items.Text_chips.obtainComponent(Label).string = String(resultData.nUserWinScore / DF_RATE);
			} else {
				player.active = false;
			}

		})

		let lab = zhuanpang.Items.BitmapFontLabel_1;
		tween(lab)
			.delay(0.35)
			.call(() => {
				// 数字滚动
				let nJackpotTimerNum = 0;
				let nShowJackpotGoldNum = 0;
				let nJackpotGoldNum = jackNum;

				Tween.stopAllByTarget(lab);
				tween(lab)
					.repeatForever(
						tween()
							.delay(0.05)
							.call(() => {
								nJackpotTimerNum += 0.05;
								nShowJackpotGoldNum += Math.floor(nJackpotGoldNum / 10);
								if (nJackpotTimerNum >= 0.5) {
									lab.obtainComponent(Label).string = String((nJackpotGoldNum / DF_RATE).toFixed(2));
								} else {
									lab.obtainComponent(Label).string = String((nShowJackpotGoldNum / DF_RATE).toFixed(2));
								}
							}))

					.start();
			})
			.start();

		tween(jiangchi_anim)
			.delay(6)
			.call(() => {
				jiangchi_anim.active = false;
			})
			.start();
	}

	public onViewDestroy(): void {
		super.onViewDestroy();
		center.lucky3pt.sendGameLoginOut();
	}


}


