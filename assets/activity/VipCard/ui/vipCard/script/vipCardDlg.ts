import { js, Node, tween, Tween, UIOpacity, v3 } from 'cc';
import { RichText } from 'cc';
import { sp } from 'cc';
import { Label, _decorator, Button } from 'cc';
import proto from '../../../../../app/center/common';
import { UseCardInfo } from '../../../../../app/center/plaza/luckyCardCenter';
import { ACTOR } from '../../../../../app/config/cmd/ActorCMD';
import { LUCKCARD } from '../../../../../app/config/cmd/LuckyCardCMD';
import { DF_RATE, DF_SYMBOL } from '../../../../../app/config/ConstantConfig';
import { EVENT_ID } from '../../../../../app/config/EventConfig';
import { FWDialogViewBase } from '../../../../../app/framework/view/popup/FWDialogViewBase';
const { ccclass } = _decorator;

let day_color = "#6ef0d2"
let week_color = "#6edcf0"
let month_color = "#e6afff"

@ccclass('vipCardDlg')
export class vipCardDlg extends FWDialogViewBase {
	action: number;
	initData() {

	}
	protected initEvents(): boolean | void {
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_PLAZA_LUCKCARD_BUY_ODER,
			],
			callback: (arg1, arg2) => {
				app.sdk.pay();
			}
		});
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_PLAZA_LUCKCARD_USER_RET,
			],
			callback: (arg1, arg2) => {
				this.updateView()
			}
		});
	}
	protected initView(): boolean | void {
		//--多语言处理--began------------------------------------------
		//文本
		this.Items.Label_title_buy_1.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
			this.Items.Label_title_buy_1.string = {
				[fw.LanguageType.en]: `For only`,
				[fw.LanguageType.brasil]: `por apenas`,
			}[fw.language.languageType];
		});
		this.Items.Label_title_buy_7.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
			this.Items.Label_title_buy_7.string = {
				[fw.LanguageType.en]: `For only`,
				[fw.LanguageType.brasil]: `por apenas`,
			}[fw.language.languageType];
		});
		this.Items.Label_title_buy_30.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
			this.Items.Label_title_buy_30.string = {
				[fw.LanguageType.en]: `For only`,
				[fw.LanguageType.brasil]: `por apenas`,
			}[fw.language.languageType];
		});
		//--多语言处理--end--------------------------------------------

		this.updateView();
	}

	updateView() {
		let day_cfg = center.luckyCard.getMonthCardConfigByType(LUCKCARD.LUCKCARD_DAY_CARD)
		let week_cfg = center.luckyCard.getMonthCardConfigByType(LUCKCARD.LUCKCARD_WEEK_CARD)
		let month_cfg = center.luckyCard.getMonthCardConfigByType(LUCKCARD.LUCKCARD_MONTH_CARD)

		if (day_cfg) {
			let buyInfo = center.luckyCard.getCurUseCardInfoNew(LUCKCARD.LUCKCARD_DAY_CARD)
			this.Items.Image_day.Items.node_buy.active = false
			this.Items.Image_day.Items.node_reward.active = false
			this.Items.Image_day.Items.mask.active = false
			if (buyInfo) {
				this.Items.Image_day.Items.node_reward.active = true
				this.refreshRewardItem(this.Items.Image_day, day_cfg, buyInfo, LUCKCARD.LUCKCARD_DAY_CARD)
			} else {
				this.Items.Image_day.Items.node_buy.active = true
				this.refreshItem(this.Items.Image_day, day_cfg, LUCKCARD.LUCKCARD_DAY_CARD)
			}
			this.setCardName(this.Items.Image_day, "daily");
		}
		if (week_cfg) {
			let buyInfo = center.luckyCard.getCurUseCardInfoNew(LUCKCARD.LUCKCARD_WEEK_CARD)
			this.Items.Image_week.Items.node_buy.active = false
			this.Items.Image_week.Items.node_reward.active = false
			this.Items.Image_week.Items.mask.active = false
			if (buyInfo) {
				this.Items.Image_week.Items.node_reward.active = true
				this.refreshRewardItem(this.Items.Image_week, week_cfg, buyInfo, LUCKCARD.LUCKCARD_WEEK_CARD)
			} else {
				this.Items.Image_week.Items.node_buy.active = true
				this.refreshItem(this.Items.Image_week, week_cfg, LUCKCARD.LUCKCARD_WEEK_CARD)
			}
			this.setCardName(this.Items.Image_week, "weekly");
		}
		if (month_cfg) {
			let buyInfo = center.luckyCard.getCurUseCardInfoNew(LUCKCARD.LUCKCARD_MONTH_CARD)
			this.Items.Image_month.Items.node_buy.active = false
			this.Items.Image_month.Items.node_reward.active = false
			this.Items.Image_month.Items.mask.active = false
			if (buyInfo) {
				this.Items.Image_month.Items.node_reward.active = true
				this.refreshRewardItem(this.Items.Image_month, month_cfg, buyInfo, LUCKCARD.LUCKCARD_MONTH_CARD)
			} else {
				this.Items.Image_month.Items.node_buy.active = true
				this.refreshItem(this.Items.Image_month, month_cfg, LUCKCARD.LUCKCARD_MONTH_CARD)
			}
			this.setCardName(this.Items.Image_month, "monthly");
		}
		this.setViewStatus()
	}

	protected initBtns(): boolean | void {
		this.Items.Image_close.onClickAndScale(() => {
			this.onClickClose();
		})
	}
	setViewStatus() {
		this.Items.Image_week.active = false
		this.Items.Image_month.active = false
		this.Items.Image_day.active = false
		let { isopen, openStatus } = center.luckyCard.isLuckCardOpen()
		if (openStatus[LUCKCARD.LUCKCARD_DAY_CARD]) {
			this.Items.Image_day.active = true
		}
		if (openStatus[LUCKCARD.LUCKCARD_WEEK_CARD]) {
			this.Items.Image_week.active = true
		}
		if (openStatus[LUCKCARD.LUCKCARD_MONTH_CARD]) {
			this.Items.Image_month.active = true
		}
	}
	setBtnSleep(rootNode) {
		let Image_buy = rootNode.Items.Image_buy
		Image_buy.getComponent(Button).interactable = false

		let countdownTime = 5
		let updateLastTime = () => {
			if (countdownTime == 0 && !fw.isNull(Image_buy)) {
				Image_buy.getComponent(Button).interactable = true
				stop()
			}
			countdownTime = countdownTime - 1
		}
		let stop = () => {
			if (this.action) {
				this.clearIntervalTimer(this.action)
				this.action = null
			}
		}

		stop()
		updateLastTime()
		this.action = this.setInterval(updateLastTime, 1)
	}

	refreshRewardItem(rootNode: Node, cardCfg: proto.plaza_luckcard.ICardConfig, curUseCardInfo: UseCardInfo, cardType: LUCKCARD) {
		rootNode.Items.Label_get.obtainComponent(fw.FWLanguage).bindLabel(`Get`);
		rootNode.Items.Label_next.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
			rootNode.Items.Label_next.string = {
				[fw.LanguageType.en]: `Get it tomorrow`,
				[fw.LanguageType.brasil]: `Consiga amanhã`,
			}[fw.language.languageType];
		});

		let info = cardCfg
		let color = ""
		if (info) {
			rootNode.Items.reward.getComponent(Label).string = String(Number(info.daily_gift[0].goods_num || 0) / DF_RATE);
			if (info.card_type == LUCKCARD.LUCKCARD_WEEK_CARD) {
				let count = parseInt(center.user.getActorProp(ACTOR.ACTOR_PROP_LOTTERY_WEEK_PRICENUM));
				if (count > 0) {
					rootNode.Items.reward.getComponent(Label).string = String(count / DF_RATE);
				}
				color = week_color;
			} else if (info.card_type == LUCKCARD.LUCKCARD_MONTH_CARD) {
				let count = parseInt(center.user.getActorProp(ACTOR.ACTOR_PROP_LOTTERY_MONTH_PRICENUM));
				if (count > 0) {
					rootNode.Items.reward.getComponent(Label).string = String(count / DF_RATE);
				}
				color = month_color;
			} else if (info.card_type == LUCKCARD.LUCKCARD_DAY_CARD) {
				let count = parseInt(center.user.getActorProp(ACTOR.ACTOR_PROP_LOTTERY_DAY_PRICENUM));
				if (count > 0) {
					rootNode.Items.reward.getComponent(Label).string = String(count / DF_RATE);
				}
				color = day_color;
			}
			let str = {
				[fw.LanguageType.en]: `<color=${color}>* Remaining valid time:</color><color=#fff639> %d </color><color=${color}>day</color>`,
				[fw.LanguageType.brasil]: `<color=${color}>* Tempo válido restante:</color><color=#fff639> %d </color><color=${color}>dia</color>`,
			}[fw.language.languageType];
			rootNode.Items.reward_time.getComponent(RichText).string = js.formatStr(str, curUseCardInfo.nDaysRemaining);
		}

		let getReward = () => {
			if (!center.luckyCard.isLuckCardRewardGet(curUseCardInfo.nCardID)) {
				center.luckyCard.sendGetLuckcardDailyApply(curUseCardInfo.nCardID);
			}
		}

		rootNode.Items.Image_get.onClickAndScale(() => {
			getReward();
		})

		this.setGetOrNextBtn(rootNode, false, false);

		if (info) {
			if (!center.luckyCard.isLuckCardRewardGet(info.card_id)) {
				this.setGetOrNextBtn(rootNode, true, false);
			} else {
				this.setSleep(rootNode)
				this.setGetOrNextBtn(rootNode, false, true);
			}
		}
	}

	setGetOrNextBtn(rootNode: Node, active1: boolean, active2: boolean) {
		let Image_next = rootNode.Items.Image_next
		let Image_get = rootNode.Items.Image_get
		let mask = rootNode.Items.mask
		Image_get.active = active1
		Image_next.active = active2
		mask.active = active1
		Tween.stopAllByTarget(mask);
		if (active1) {
			mask.obtainComponent(UIOpacity).opacity = 100;
			tween(mask)
				.to(1.0, { scale: v3( 1.02 ,  1.02 ,  1 ) })
				.to(1.0, { scale: v3( 0.98 ,  0.98 ,  1 ) })
				.union()
				.repeatForever()
				.start();
			tween(mask.obtainComponent(UIOpacity))
				.to(1, { opacity: 255 })
				.to(1, { opacity: 100 })
				.union()
				.repeatForever()
				.start();
		}

		rootNode.Items.Label_day_desc.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
			rootNode.Items.Label_day_desc.string = {
				[fw.LanguageType.en]: active1 ? `This is your reward today.` : `Today's reward received.`,
				[fw.LanguageType.brasil]: active1 ? `Esta é a recompensa de hoje.` : `Recompensa de hoje recebida.`,
			}[fw.language.languageType];
		});
	}

	refreshItem(rootNode: Node, cfg: proto.plaza_luckcard.ICardConfig, cardType: LUCKCARD) {
		let root = rootNode
		let reward = rootNode.Items.reward
		let rewardnow = rootNode.Items.get_now
		let rewardday = rootNode.Items.get_everyday
		let castbef = rootNode.Items.cast_bef
		let castnow = rootNode.Items.cast_now
		let rate = rootNode.Items.label_rate
		let getday = rootNode.Items.reward_day
		let getday_num = rootNode.Items.reward_day_num

		let reNum = parseInt(cfg.daily_gift[0].goods_num || 0) / DF_RATE
		let reNumNow = parseInt(cfg.once_gifts[0].goods_num || 0)
		reNumNow = reNumNow > 1 && reNumNow || 0
		reNumNow = reNumNow / DF_RATE
		let total = cfg.gift_days * reNum + reNumNow
		reward.getComponent(Label).string = String(total)
		rewardnow.getComponent(RichText).string = this.getRichText(cardType, `${DF_SYMBOL}${reNumNow}`, fw.language.get(`now`))
		rewardday.getComponent(RichText).string = this.getRichText(cardType, `${DF_SYMBOL}${reNum}`, fw.language.get(`every day`))
		castbef.getComponent(Label).string = `${DF_SYMBOL}${cfg.prime_cost}`;
		castnow.getComponent(Label).string = `${DF_SYMBOL}${cfg.price}`;
		rate.getComponent(Label).string = `${Math.ceil(total/cfg.price*100)}%`;
		getday.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
			getday.string = {
				[fw.LanguageType.en]: `Valid for\n      days`,
				[fw.LanguageType.brasil]: `Válido por\n      dias`,
			}[fw.language.languageType];
		});
		getday_num.getComponent(Label).string = `${cfg.gift_days}`

		root.Items.Image_buy.onClickAndScale(() => {
			if (center.luckyCard.canBuyLuckCard(cardType)) {
				let vipData = app.func.clone(cfg) as VipCardConfig
				vipData.vipDays = cfg.gift_days
				vipData.vipType = cardType

				let data: PayChannelData = {
					lRMB: cfg.price,
					orderCallback: () => {
						center.luckyCard.sendBuyLuckcard(cfg.card_id)
						if (!fw.isNull(rootNode)) {
							this.setBtnSleep(rootNode)
						}
					},
					isAutoSelect: true,
					nType: 2,
					vipData: vipData,
				}
				center.mall.payChooseType(data)
			}
		})
	}
	setCardName(parent: Node, name: string) {
		parent.Items.card_name.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
			app.file.updateImage({
				node: parent.Items.card_name,
				bundleResConfig: ({
					[fw.LanguageType.en]: () => { return fw.BundleConfig.VipCard.res[`ui/vipCard/img/atlas/${name}_en/spriteFrame`]; },
					[fw.LanguageType.brasil]: () => { return fw.BundleConfig.VipCard.res[`ui/vipCard/img/atlas/${name}_rs/spriteFrame`]; },
				})[fw.language.languageType](),
			});
		});
	}
	getRichText(cardType: LUCKCARD, s1: string, s2: string) {
		let color = ""
		if (cardType == LUCKCARD.LUCKCARD_WEEK_CARD) {
			color = week_color;
		} else if (cardType == LUCKCARD.LUCKCARD_MONTH_CARD) {
			color = month_color;
		} else if (cardType == LUCKCARD.LUCKCARD_DAY_CARD) {
			color = day_color;
		}
		let str = {
			[fw.LanguageType.en]: `<color=${color}>Get</color><color=#fff639> %s </color><color=${color}>%s</color>`,
			[fw.LanguageType.brasil]: `<color=${color}>Pegar</color><color=#fff639> %s </color><color=${color}>%s</color>`,
		}[fw.language.languageType];
		return js.formatStr(str, s1, s2)
	}
	setSleep(root) {
		let Image_next = root.Items.Image_next
		let Image_get = root.Items.Image_get
		let time = root.Items.Image_next.Items.time

		let cutTime = app.func.time()
		let data = new Date()
		let todayEndTime: Date = new Date(data.getFullYear(), data.getMonth(), data.getDate(), 0, 0, 0, 0);
		let countdownTime = todayEndTime.getTime() - cutTime

		let updateLastTime = () => {
			let hour = Math.floor((countdownTime % (3600 * 24)) / 3600)
			let min = Math.floor(((countdownTime % (3600 * 24)) % 3600) / 60)
			let sec = ((countdownTime % (3600 * 24)) % 3600) % 60
			let time_s = js.formatStr("%s:%s:%s", app.func.formatNumberForZore(hour), app.func.formatNumberForZore(min), app.func.formatNumberForZore(sec))
			time.getComponent(Label).string = time_s
			if (countdownTime == 0 && !fw.isNull(Image_get) && !fw.isNull(Image_next)) {
				this.setGetOrNextBtn(root, true, false);
				stop()
			}
			countdownTime = countdownTime - 1
		}

		let stop = () => {
			if (root.action) {
				root.clearIntervalTimer(root.action)
				root.action = null
			}
		}

		stop()
		updateLastTime()
		root.action = root.setInterval(updateLastTime, 1)
	}
}

interface VipCardConfig extends proto.plaza_luckcard.ICardConfig {
	vipDays: number
	vipType: number
}