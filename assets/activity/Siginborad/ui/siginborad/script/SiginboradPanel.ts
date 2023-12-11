import { color, js, Label, _decorator, Node, instantiate, Prefab, Sprite, SpriteFrame } from 'cc';
import proto from '../../../../../app/center/common';
import { DF_RATE, DF_SYMBOL } from '../../../../../app/config/ConstantConfig';
import { EVENT_ID } from '../../../../../app/config/EventConfig';
import { PAY_MODE } from '../../../../../app/config/ModuleConfig';
import { FWDialogViewBase } from '../../../../../app/framework/view/popup/FWDialogViewBase';
import { guide_hand_1 } from '../../../../../resources/ui/guide/script/guide_hand_1';
const { ccclass } = _decorator;

@ccclass('SiginboradPanel')
export class SiginboradPanel extends FWDialogViewBase {
	private mSignReward: proto.plaza_taskactive.ISevenContinueSignGoods[];
	private mSevenActiveGiftID: number;
	private mSevenSignDay: number;
	private mCanSign: boolean;
	private mEndTime: number;
	private mQuickRecharge: QuickRecharge;


	private mSignView: any[];
	clockTimer: number;
	guideNode: Node;
	mDrawData: { drawDay: any; drawMax: any; };
	initData() {
		this.mSignReward = center.taskActive.getSevenActiveSignReward();
		this.mSevenActiveGiftID = center.taskActive.getSevenActiveGiftInfo();
		this.mSevenSignDay = center.taskActive.getSevenActiveSignDay() + 1;
		this.mCanSign = center.taskActive.isCanSignSevenActive();
		this.mEndTime = center.taskActive.getNextSignTime();
		this.mQuickRecharge = center.roomList.getQuickRecharge(this.mSevenActiveGiftID);
		this.mDrawData = center.taskActive.getSevenActiveDrawData();
	}
	protected initEvents(): boolean | void {
		this.bindEvent({
            eventName: EVENT_ID.EVENT_PLAZA_QUICKCHARGE,
            callback: (arg1) => {
                app.sdk.setOrderNum(arg1.dict.order)
            	app.sdk.pay()
            }
        });
		this.bindEvent({
            eventName: EVENT_ID.EVENT_PLAZA_SEVEN_ACTIVE_DATA,
            callback: (arg1) => {
                this.updateView()
            }
        });
		// 领取奖励后关闭弹窗
		this.bindEvent({
            eventName: EVENT_ID.EVENT_PLAZA_SEVEN_ACTIVE_REWARD_RET,
            callback: (arg1) => {
                this.close();
            }
        });
	}
	protected initView(): boolean | void {
		//--多语言处理--began------------------------------------------
		//文本
		this.Items.Label_reward_get.obtainComponent(fw.FWLanguage).bindLabel(`Get`);
		this.Items.Label_reward_next.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
			this.Items.Label_reward_next.string = {
				[fw.LanguageType.en]: `Get next time`,
				[fw.LanguageType.brasil]: `Obter da próxima vez`,
			}[fw.language.languageType];
		});
		this.Items.Label_normal_tips.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
			this.Items.Label_normal_tips.string = {
				[fw.LanguageType.en]: `Login every day can get rewards`,
				[fw.LanguageType.brasil]: `Entrar todos os dias pode obter recompensas`,
			}[fw.language.languageType];
		});
		this.Items.Label_finall_tips.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
			this.Items.Label_finall_tips.string = {
				[fw.LanguageType.en]: `For only`,
				[fw.LanguageType.brasil]: `Por apenas`,
			}[fw.language.languageType];
		});
		//精灵
		this.Items.Sprite_title.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
			app.file.updateImage({
				node: this.Items.Sprite_title,
				bundleResConfig: ({
					[fw.LanguageType.en]: () => { return fw.BundleConfig.Siginborad.res[`ui/siginborad/img/DR_sigin_title/spriteFrame`]; },
					[fw.LanguageType.brasil]: () => { return fw.BundleConfig.Siginborad.res[`ui/siginborad/img/DR_sigin_title_brasil/spriteFrame`]; },
				})[fw.language.languageType](),
			});
		});
		//--多语言处理--end--------------------------------------------

		this.mSignView = [];
		for (var i = 0; i < 7; ++i) {
			this.mSignView[i] = this.Items["item" + (i + 1)];
			this.mSignView[i].Items.Text_num.obtainComponent(Label).string = `${DF_SYMBOL}${this.mSignReward[i].lspecial_goods_num / DF_RATE}`;
		}
		if (this.mQuickRecharge) {
			this.Items.cast_now.obtainComponent(Label).string = `${DF_SYMBOL}${this.mQuickRecharge.nQuickNeedRMB}`;
			this.Items.cast_bef.obtainComponent(Label).string = `${DF_SYMBOL}${this.mQuickRecharge.nPriceCost}`;
		}
		this.updateView();
	}
	protected initBtns(): boolean | void {
		this.Items.close_btn.onClickAndScale(this.onCancelClickClose.bind(this))
		this.Items.Image_reward_get.onClickAndScale(() => {
			if (this.isNeedBuyGift()) {
				if (this.mQuickRecharge) { 
					app.sdk.setPrice(this.mQuickRecharge.nQuickNeedRMB)
					app.sdk.setGoodsName(DF_SYMBOL+this.mQuickRecharge.nQuickNeedRMB)
					app.sdk.setRID(this.mSevenActiveGiftID)
					app.sdk.setPayMode(PAY_MODE.PAY_MODE_NOR)
					let data: PayChannelData = {};
					data.lRMB = this.mQuickRecharge.nQuickNeedRMB;
					data.siginboradData = this.mQuickRecharge;
					data.orderCallback = () => {
						center.roomList.sendQuickRecharge(this.mSevenActiveGiftID);
					}
					data.isAutoSelect = true;
					center.mall.payChooseType(data);
				}
			} else if (this.isNeedDrawReward()) {
				app.popup.showDialog({
					viewConfig: fw.BundleConfig.Siginborad.res[`ui/siginborad/siginborad_fanpai`],
				})
			} else {
				center.taskActive.sendSevenactive();
			}
			this.removeGuide()
		})
	}

	public checkGuide() {
		if(!this.mCanSign)return;
		if(!fw.isValid(this.guideNode) ) {
			this.node.loadBundleRes(fw.BundleConfig.resources.res[`ui/guide/guide_hand_1`],(res: Prefab) => {
				// 异步原因可能存在多次回调
				if(!fw.isValid(this.guideNode)) {
					let node = instantiate(res);
					this.guideNode = node
					node.getComponent(guide_hand_1).playAnim();
					this.node.addChild(node);
					node.setWorldPosition(this.Items.Image_reward_get.getWorldPosition().add3f(100,-20,0));
				}
			});
		}
	}

	public removeGuide() {
		if(fw.isValid(this.guideNode) ) {
			this.guideNode.removeFromParent(true)
			this.guideNode = null;
		}
	}
 
	public updateView(): void {
		if (!center.taskActive.isSevenActiveOpen()) {
			this.close();
		}
		this.mCanSign = center.taskActive.isCanSignSevenActive();
		this.mSevenSignDay = center.taskActive.getSevenActiveSignDay();
		this.mEndTime = center.taskActive.getNextSignTime();
		for (var i = 0; i < 7; ++i) {
			let isCurDay = i == this.mSevenSignDay && this.mCanSign
			if (isCurDay) {
				this.mSignView[i].Items.Sprite_unclaimed.active = true;
			} else {
				this.mSignView[i].Items.Sprite_unclaimed.active = false;
			}
			this.mSignView[i].Items.Image_today.active = isCurDay;
			this.updateDayTxt(this.mSignView[i],i,isCurDay);
			if (i < 6) {
				let tpath = "ui/siginborad/img/DR_bg_xiao/spriteFrame";
				this.mSignView[i].Items.background.getComponent(Sprite).spriteFrame = app.assetManager.loadBundleResSync(fw.BundleConfig.Siginborad.res[tpath]);
			}
			if (i < this.mSevenSignDay) {
				this.mSignView[i].Items.Image_mask.active = true;
				this.mSignView[i].Items.Image_claimed.active = true;
				this.mSignView[i].Items.Panel_bg.color = color(0x9A, 0x9A, 0x9A);
			} else {
				this.mSignView[i].Items.Image_mask.active = false;
				this.mSignView[i].Items.Image_claimed.active = false;
				this.mSignView[i].Items.Panel_bg.color = color(0xff, 0xff, 0xff);
				if (this.mDrawData.drawDay == i+1 && this.mDrawData.drawDay >= 1 && this.mDrawData.drawDay <= 6) {
					this.mSignView[i].Items.Text_num.obtainComponent(Label).string = `${DF_SYMBOL}${this.mDrawData.drawMax / DF_RATE}`;
					let tpath = "ui/siginborad/img/bg_xz_sel/spriteFrame";
                    this.loadBundleRes(fw.BundleConfig.Siginborad.res[tpath],(res: SpriteFrame) => {
                        this.mSignView[this.mDrawData.drawDay-1].Items.background.getComponent(Sprite).spriteFrame = res;
                    });
				}
			}
		}
		let buyGift = this.isNeedBuyGift() && this.mCanSign;
		this.Items.Label_finall_tips.active = buyGift;
		this.Items.Label_normal_tips.active = !buyGift;
		this.Items.Image_reward_get.active = this.mCanSign;
		this.Items.Image_reward_next.active = !this.mCanSign;
		if (this.mCanSign) {
			this.checkGuide()
			this.clearIntervalTimer(this.clockTimer)
		} else {
			this.removeGuide()
			this.clearIntervalTimer(this.clockTimer)
			this.updateCountdown()
			this.clockTimer = this.setInterval(() => {
				this.updateCountdown()
			}, 1);
		}
	}
	private isNeedBuyGift(): boolean {
		return this.mSevenSignDay == 6 && center.taskActive.isBuyGiftSevenActive();
	}

	private isNeedDrawReward(): boolean {
		let neeDraw = false;
		if (this.mDrawData.drawDay == this.mSevenSignDay + 1 && this.mDrawData.drawDay >= 1 && this.mDrawData.drawDay <= 6) {
			neeDraw = true;
		}
		return neeDraw;
	}

	private updateDayTxt(node, i, isCurDay) {
		let dayStr = (i + 1) + fw.language.get(`DAY`);
		if (isCurDay) {
			dayStr = fw.language.get(`TODAY`);
		}
		node.Items.Label_title_day.getComponent(Label).string = dayStr;
	}

	private updateCountdown(): void {
		let countdown = this.mEndTime - app.func.time();
		if (0 >= countdown) {
			this.updateView();
		} else {
			let nHour = Math.floor(countdown / 3600);
			let nMin = Math.floor((countdown - nHour * 3600) / 60);
			let nSecond = countdown - nHour * 3600 - nMin * 60;
			this.Items.get_time.obtainComponent(Label).string = js.formatStr("%s:%s:%s", app.func.formatNumberForZore(nHour), app.func.formatNumberForZore(nMin), app.func.formatNumberForZore(nSecond));
		}
	}
}
