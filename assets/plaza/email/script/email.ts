import { instantiate, Label, Node as ccNode, Overflow, ScrollView, Sprite, SpriteFrame, UITransform, v3, _decorator } from 'cc';
import proto from '../../../app/center/common';
const { ccclass } = _decorator;

import { EVENT_ID } from '../../../app/config/EventConfig';
import { DF_RATE, DOWN_IMAGE_TYPE } from '../../../app/config/ConstantConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
import dayjs from 'dayjs';
import { EmailType } from '../../../app/center/plaza/emailCenter';

@ccclass('email')
export class email extends FWDialogViewBase {
	/**菜单列表 */
	menu: FWMenuParam<proto.plaza_email.IEmailViewItem>;
	/**邮件类型 */
	nClassType: number
	/**当前未读邮箱数量 */
	nNoCloseNum: number = 0
	/**配置参数 */
    popupData: any = {}
	responderTimer: number;
	initData() {
		//获取邮件
		center.email.send_PLAZA_EMAIL_VIEW();
	}
	protected initView(): boolean | void {
		//--多语言处理--began------------------------------------------
		//文本
		this.Items.Label_all.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
			this.Items.Label_all.string = {
				[fw.LanguageType.en]: `Claim&Read All`,
				[fw.LanguageType.brasil]: `Ler e resgatar tudo`,
			}[fw.language.languageType];
		});
		//精灵
		//--多语言处理--end--------------------------------------------
		//调整标题
		this.changeTitle({ title: `Email` });
		//隐藏部分界面
		this.Items.Node_menu_item.active = false;
		this.Items.Node_item_reward.active = false;
		this.Items.Sprite_reward_bg.active = false;
		this.Items.item_faq.active = false;
		this.Items.Node_responder.active = false;
		//调整部分界面显示
		this.Items.Label_email.string = ``;
		//刷新分类
		this.updateClasses();
	}
	protected initBtns(): boolean | void {
		//调整按钮文本
		let gNode = this.Items.Node_get;
		(<type_btn_common>(gNode.getComponent(`btn_common`))).setData({
			text: fw.language.get(`Get`),
			styleId: 3
		});
		gNode.onClickAndScale(this.onClickGet.bind(this));
		//一键领取
		this.Items.Sprite_all.onClickAndScale(() => {
			if (this.nNoCloseNum > 0) {
				center.email.send_PLAZA_EMAIL_A_KEY_TO_GET({});
			}
		});
		//调整按钮文本
		let responderNode = this.Items.Node_responder;
		(<type_btn_common>(responderNode.getComponent(`btn_common`))).setData({
			text: fw.language.get(`Reply`),
			styleId: 3
		});
		responderNode.onClickAndScale(this.onClickResponder.bind(this));
	}
	protected initEvents(): boolean | void {
		//邮件列表
		this.bindEvent({
			eventName: EVENT_ID.EVENT_EMAIL_VIEW_RETURN,
			callback: this.updateView.bind(this)
		});
		//邮件内容
		this.bindEvent({
			eventName: EVENT_ID.EVENT_EMAIL_TEXT_RETURN,
			callback: (arg1) => {
				//刷新当前邮箱内容
				this.updateContent(arg1.data);
				//未读邮箱个数
				this.updateNoCloseNum();
			}
		});
		//邮件状态发生变更
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_EMAIL_VIEW_STATE, //邮件状态变更
				// `PLAZA_EMAIL_A_KEY_TO_GET_RET`, //一键领取
			],
			callback: (arg1) => {
				this.updateContent(arg1.data);
			}
		});
		//提取附件返回 
		this.bindEvent({
			eventName: EVENT_ID.EVENT_EMAIL_PICK_RETURN,
			callback: (arg1) => {
				let data: any = {}
				data.reward = []
				let dict: proto.plaza_email.email_pick_ret_s = arg1.data
				dict.good_list.forEach(element => {
					let item: any = {}
					item.nGoodsID = element.goods_id
					item.nGoodsNum = element.goods_num
					data.reward.push(item);
				});
				data.extend =  {bDontShowTitle:true}
				app.popup.showDialog({
					viewConfig: fw.BundleConfig.resources.res[`ui/reward/reward`],
					data: data,
				});
			}
		});
	}
	/**选择分类 */
	selectClass(element: any) {
		//记录筛选类型
		this.nClassType = element.nClassType;
		//调整显示
		this.Items.Node_select.Items.Label_select.string = element.name;
		//刷新界面
		this.updateView();
	}
	/**刷新分类 */
	updateClasses() {
		//隐藏部分界面
		this.Items.Node_select_item.active = false;
		this.Items.Node_select_list.active = false;
		//展开分类
		this.Items.Sprite_select_bg.onClick(() => {
			this.Items.Sprite_select_state.angle = 0;
			this.Items.Node_select_list.active = true;
		});
		this.Items.Node_select_list.onClick(() => {
			this.Items.Sprite_select_state.angle = 90;
			this.Items.Node_select_list.active = false;
		});
		let refer = {
			[fw.LanguageType.en]: `Refer&Earn`,
			[fw.LanguageType.brasil]: `Indique e Ganhe`,
		}[fw.language.languageType];
		let classes = [
			{ name: fw.language.get(`ALL`), nClassType: center.email.EmailClassType.All, },
			{ name: fw.language.get(`Withdraw`), nClassType: center.email.EmailClassType.Withdraw, },
			{ name: fw.language.get(`Recharge`), nClassType: center.email.EmailClassType.Recharge, },
			{ name: fw.language.get(`Service`), nClassType: center.email.EmailClassType.Service, },
			{ name: refer, nClassType: center.email.EmailClassType.Refer, },
			{ name: fw.language.get(`Bonus`), nClassType: center.email.EmailClassType.Bonus, },
			{ name: fw.language.get(`Other`), nClassType: center.email.EmailClassType.Other, },
		];
		let index = 0;
		let childs = this.Items.Sprite_select_list.children;
		let nDefaultClassType = center.email.EmailClassType.All;
		classes.forEach((element, i) => {
			let item = childs[index];
			if (!item) {
				item = this.Items.Node_select_item.clone();
				item.parent = this.Items.Sprite_select_list;
			}
			if (!item.__callback) {
				item.onClick(() => {
					//关闭
					this.Items.Node_select_list.__callback();
					//相同类型不处理
					if (this.nClassType == element.nClassType) {
						return;
					}
					//调整筛选
					this.selectClass(element);
				});
			}
			item.active = true;
			//名称
			item.Items.Label_select.string = element.name;
			//线
			item.Items.Sprite_line.active = i < childs.length - 1;
			//默认选中
			if (nDefaultClassType == element.nClassType) {
				item.__callback();
			}
			++index;
		});
		for (; index < childs.length; ++index) {
			childs[index].active = false;
		}
	}
	updateView() {
		//清理菜单
		let btns = [];
		let selectItem = 0;
		this.Items.content.removeAllChildren(true);
		let emailList = center.email.getEmailListByClassType(this.nClassType);
		app.func.positiveTraversal(emailList, (element, index) => {
            let btn = {
				node: this.Items.Node_menu_item.clone(),
				text: element.title,
				data: element,
				callback: () => {
					this.updateContent(element);
				}
			}
			this.Items.content.addChild(btn.node);
			btn.node.active = true;
			btns.push(btn);

			//默认选项
            if (!selectItem && element.send_type == this.popupData.targetJump && element.state != EmailType.EMAILSTATE_CLOSE) {
                selectItem = index;
            }
        });

		//创建菜单
		app.func.createMenu({
			defaultIndex: selectItem,
			mountObject: this,
			btns: btns,
		});
		//未读邮箱个数
		this.updateNoCloseNum();
	}
	updateContent(data: proto.plaza_email.IEmailViewItem) {
		//数据异常 or 数据不匹配不处理
		if (!this.menu || this.menu.target.data.email_id != data.email_id) {
			return;
		}
		//刷新内容
		this.Items.Label_email.active = false;
		this.Items.item_faq.active = false;
		this.Items.Node_responder.active = false;
		let emailContent = center.email.getEmailContent(data.email_id);
		if (!emailContent) {
			this.addOneLable('')
			center.email.send_PLAZA_EMAIL_VIEWTEXT({ email_id: data.email_id });
		} else {
			//刷新红点
			let btns = this.menu.menuData.btns;
			btns.forEach(element => {
				element.node.Items.Sprite_red.active = center.email.getEmailState(element.data.email_id) == 0;
			});
			//邮件内容
			let emailInfo = center.email.getEmailInfo(emailContent.email_id);
			this.clearIntervalTimer(this.responderTimer);
			if (emailInfo) {
				if (emailInfo.send_type == center.email.EmailClassType.Service && this.splitEmailTextSuccess(emailContent.email_text)) {
					this.Items.content_email.removeAllChildren(true);
					this.addOneChatnew((<any>this).infoTable);
					this.clearIntervalTimer(this.responderTimer);
					if ((<any>this).infoTable[1]) {
						this.Items.Node_responder.active = true;
						let updateResponderTime = () => {
							let ttime = app.func.time() - (<any>this).infoTable[1].time;
							// fw.print("updateResponderTime ", ttime)
							if (ttime > 12*3600) {
								this.clearIntervalTimer(this.responderTimer);
								this.Items.Node_responder.active = false;
							} else {
								// app.popup.showToast("ttime " + ttime)
							}
						}
						updateResponderTime();
						this.responderTimer = this.setInterval(() => {
							updateResponderTime();
						}, 1);
					}
				} else {
					let string = `${emailContent.email_text}\n\n${dayjs.unix(emailInfo.send_time).format("DD-MM-YYYY HH:mm:ss")}`;
					this.addOneLable(string)
				}
			} else {
				this.addOneLable(`${emailContent.email_text}`)
			}
			//奖励
			let gold = emailContent.gold ?? 0;
			let goods = emailContent.good_List ?? [];

			let goodsView: proto.plaza_email.IGoodsItem[] = []
			goods.forEach((element) => {
				switch (element.goods_id) {
					case center.goods.gold_id.cash:
					case center.goods.gold_id.withdraw_gold:
						gold = gold + element.goods_num
						break;
					default:
						goodsView.push(element)
						break;
				}
			})

			if (gold > 0 || goodsView.length > 0) {
				this.Items.Layout_reward.removeAllChildren(true);
				this.Items.Sprite_reward_bg.active = true;
				if (goodsView.length > 0) {
					goodsView.forEach((element) => {
						let item = this.Items.Node_item_reward.clone();
						this.Items.Layout_reward.addChild(item);
						item.active = true;
						//物品信息
						let goodsInfo = center.goods.getGoodsInfo(element.goods_id);
						//图标
						app.file.updateTexture({
							bAutoShowHide: true,
							type: DOWN_IMAGE_TYPE.Dynamic,
							node: item.Items.Sprite_reward,
							serverPicID: goodsInfo.packet_pic_id,
						});
						//数量
						item.Items.Sprite_reward.scale = v3(0.6, 0.6, 0.6)
						let num = center.goods.isGold(element.goods_id) ? element.goods_num/DF_RATE : element.goods_num
						item.Items.Label_reward.string = `x${num}`;
					});
				} 
				if (gold > 0) {
					let item = this.Items.Node_item_reward.clone();
					this.Items.Layout_reward.addChild(item);
					item.active = true;
					//数量
					let num = gold/DF_RATE
					item.Items.Label_reward.string = `x${num}`;
					item.Items.Sprite_reward.scale = v3(0.6, 0.6, 0.6)
					item.Items.Sprite_reward.loadBundleRes(fw.BundleConfig.resources.res[`ui/reward/img/atlas/Rs_jinbi/spriteFrame`],(res: SpriteFrame) => {
						item.Items.Sprite_reward.obtainComponent(Sprite).spriteFrame = res;
					});
				}
				
			} else {
				this.Items.Sprite_reward_bg.active = false;
			}
			//state 发送查看状态 0是新邮件 1是已查看 2是已关闭邮件 / 已领取邮件
			let bOver = center.email.getEmailState(emailContent.email_id) == 2;
			this.Items.Node_over.active = bOver;
			this.Items.Node_get.active = !bOver;
		}
	}
	splitEmailTextSuccess(str: string) {
		let success = true;
		let fruits = str.split("##*##");
		let infoTable = [];
		fruits.forEach((element)=>{
			let info = element.split("||");
			if (!info[0] || !info[1] || !info[1].match(/^\d+$/)) {
				success = false;
			}
			let item = {
				text: info[0],
				time: info[1],
			}
			infoTable.push(item);
		});
		(<any>this).infoTable = infoTable;
		return success
	}
	/**添加一次交流 */
	addOneChatnew(infoTable: ServerChatParam[]) {
		let item = this.Items.Node_content.Items[`item_faq`].clone();
        item.parent = this.Items.content_email;
        item.active = true;
		item.Items.Label_item_title.active = false;
		item.Items.Label_item_title_d.active = false;
		//回复
		item.Items.Label_item_content.string = infoTable[1].text + "\n\n" + `${dayjs.unix(infoTable[1].time).format("DD-MM-YYYY HH:mm:ss")}`;
		let count = 0
		let setString = () => {
			if (count%2 == 1) {
				item.Items.Label_item_title_d.string = infoTable[0].text;
				item.Items.Label_item_title.active = false;
				item.Items.Label_item_title_d.active = true;
			} else {
				app.func.setStringLimitWidth(item.Items.Label_item_title, ' ' + infoTable[0].text, 670, "...");
				item.Items.Label_item_title.active = true;
				item.Items.Label_item_title_d.active = false;
			}
			count++;
		}
		item.Items.Sprite_content_bg.onClick(()=>{
			setString()
		})
		setString()
	}
	addOneLable(text) {
		this.Items.content_email.removeAllChildren(true)
		let item = this.Items.Label_email.clone();
        item.parent = this.Items.content_email;
        item.active = true;
        //文本内容
        item.string = text;
	}
	//未读邮箱个数
	updateNoCloseNum() {
		this.nNoCloseNum = center.email.getEmailNoCloseNum();
		this.Items.Label_all_num.string = `(${this.nNoCloseNum})`;
	}
	onClickGet() {
		//数据不匹配不处理
		if (!this.menu || !this.menu.target.data.email_id) {
			return;
		}
		center.email.send_PLAZA_EMAIL_PICK({ email_id: this.menu.target.data.email_id });
	}
	onClickResponder() {
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`service/service_feedback`],
		});
	} 
}

/**
 * 类型声明调整
 */
 declare global {
    namespace globalThis {
        /**反馈参数 */
        type ServerChatParam = {
            /**文本 */
            text: string
            /**时间 */
            time: number
        }
    }
}