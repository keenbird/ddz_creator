import { _decorator, Color, Label, SpriteFrame, Sprite, EditBox } from 'cc';
const { ccclass } = _decorator;

import { ACTOR } from '../../../app/config/cmd/ActorCMD';
import { EVENT_ID } from '../../../app/config/EventConfig';
import { DF_RATE, DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('UserProfile')
export class UserProfile extends FWDialogViewBase {
	bigBgColor: Color;
	smallBgColor: Color;
	textTitleColor: Color;
	textColor: Color;

	initData() {
		this.bigBgColor = new Color(98, 18, 19);
		this.smallBgColor = new Color(68, 15, 2);
		this.textColor = new Color(233, 183, 106);
		this.textTitleColor = new Color(233, 183, 106);
	}

	protected initView(): boolean | void {
		this.Items.Text_deposited_title.string = fw.language.get("Deposited")
		this.Items.Text_winnings_title.string = fw.language.get("Winnings")
		this.Items.Text_totalcash_title.string = fw.language.get("Total Cash")
		this.Items.Text_bonus_title.string = fw.language.get("Bonus")
		this.Items.Text_mobile_title.string = fw.language.get("Mobile")
		this.Items.Text_go.string = fw.language.get("Bind")
		this.Items.Image_logout_t.string = fw.language.get("Logout")
		this.Items.Text_edit.string = fw.language.get("Edit")

		this.Items.Text_id.obtainComponent(Label).string = "ID:" + (center.user.getActorProp(ACTOR.ACTOR_PROP_DBID) || "");

		//其它区域关闭
		this.node.onClick(this.onClickClose.bind(this));
		//背景屏蔽点击
		this.Items.Panel_bg.onClick(() => { });

		//名称输入
		this.setInputProperty();

		//玩家名称
		this.updateName();
		//玩家头像
		this.loadUserIcon();

		//vip
		let nVipLevel = center.user.getActorVipLevel();
		if (nVipLevel > 0) {
			this.Items.BitmapFontLabel_vip.obtainComponent(Label).string = nVipLevel;
			this.Items.Image_vip.loadBundleRes(fw.BundleConfig.plaza.res["userInfo/img_new/VIP_icon_VIP1/spriteFrame"],(res: SpriteFrame) => {
				this.Items.Image_vip.obtainComponent(Sprite).spriteFrame = res;
			});
			this.Items.Image_vip_icon.loadBundleRes(fw.BundleConfig.plaza.res["userInfo/img_new/VIP_icon_01/spriteFrame"],(res: SpriteFrame) => {
				this.Items.Image_vip_icon.obtainComponent(Sprite).spriteFrame = res;
			});
		} else {
			this.Items.BitmapFontLabel_vip.obtainComponent(Label).string = "";
			this.Items.Image_vip.loadBundleRes(fw.BundleConfig.plaza.res["userInfo/img_new/VIP_icon_VIP2/spriteFrame"],(res: SpriteFrame) => {
				this.Items.Image_vip.obtainComponent(Sprite).spriteFrame = res;
			});
			this.Items.Image_vip_icon.loadBundleRes(fw.BundleConfig.plaza.res["userInfo/img_new/VIP_icon_02/spriteFrame"],(res: SpriteFrame) => {
				this.Items.Image_vip_icon.obtainComponent(Sprite).spriteFrame = res;
			});
		}
		//手机号码
		this.updatePhone();
		//总计数据
		let numtotal = parseInt(center.user.getActorProp(ACTOR.ACTOR_PROP_GOLD));
		let numwithdrawable = parseInt(center.user.getActorProp(ACTOR.ACTOR_PROP_WITHDRAW_GOLD));
		this.Items.Text_deposited.obtainComponent(Label).string = DF_SYMBOL + " " + (numtotal - numwithdrawable) / DF_RATE;
		this.Items.Text_winnings.obtainComponent(Label).string = DF_SYMBOL + " " + numwithdrawable / DF_RATE;
		this.Items.Text_totalcash.obtainComponent(Label).string = DF_SYMBOL + " " + numtotal / DF_RATE;
		this.Items.Text_bonus.obtainComponent(Label).string = DF_SYMBOL + " " + parseInt(center.user.getActorProp(ACTOR.ACTOR_PROP_RECHARGE_SAVED_BONUS)) / DF_RATE;
		//title
		this.Items.Text_deposited_title.obtainComponent(Label).color = this.textTitleColor;
		this.Items.Text_winnings_title.obtainComponent(Label).color = this.textTitleColor;
		this.Items.Text_totalcash_title.obtainComponent(Label).color = this.textTitleColor;
		this.Items.Text_bonus_title.obtainComponent(Label).color = this.textTitleColor;
		this.Items.Text_mobile_title.obtainComponent(Label).color = this.textTitleColor;
		//text
		this.Items.Text_deposited.obtainComponent(Label).color = this.textColor;
		this.Items.Text_winnings.obtainComponent(Label).color = this.textColor;
		this.Items.Text_totalcash.obtainComponent(Label).color = this.textColor;
		this.Items.Text_bonus.obtainComponent(Label).color = this.textColor;
		this.Items.Text_mobile_front.obtainComponent(Label).color = this.textColor;
		this.Items.Text_mobile.obtainComponent(Label).color = this.textColor;
	}

	protected initBtns(): boolean | void {
		//编辑名称
		this.Items.Image_nameEdit.onClickAndScale(this.onClickModifNick.bind(this));
		//编辑信息
		this.Items.Image_go.onClickAndScale(this.onClickGo.bind(this));
		//更换头像
		this.Items.Image_head.onClickAndScale(this.onClickHead.bind(this));
		//退出登入
		this.Items.Image_logout.onClickAndScale(this.onClickLogout.bind(this));
	}

	protected initEvents(): boolean | void {
		//名称变动
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_ACTOR_MODIFY_RETURN,
			],
			callback: this.updateName.bind(this),
		});
		//头像变动
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_ICON_UPLOAD_SUCCEED,
			],
			callback: this.loadUserIcon.bind(this),
		});
		//手机号变动
		this.bindEvent({
			eventName: [
				EVENT_ID.EVENT_ACTOR_BINDING_PHONE,
			],
			callback: this.updatePhone.bind(this),
		});
	}

	updatePhone() {
		//手机号码
		let nPhoneNumber = center.user.getActorProp(`szPhone`);
		let bPhoneOk = !!nPhoneNumber;
		this.Items.Image_go.active = !bPhoneOk;
		this.Items.Text_mobile.active = bPhoneOk;
		if (bPhoneOk) {
			this.Items.Text_mobile.obtainComponent(Label).string = nPhoneNumber.replace(/^(\d{3})\d+(\d{4})/, "$1****$2");
		}
	}
	updateName() {
		this.Items.Text_name.obtainComponent(Label).string = center.user.getActorName();
	}

	loadUserIcon() {
		//头像
		app.file.updateHead({
			node: this.Items.Image_head,
			serverPicID: center.user.getActorMD5Face(),
		});
	}

	setInputProperty() {
		//名字输入事件绑定
		let oldName = this.Items.Text_name.obtainComponent(Label).string;
		this.Items.TextField_name.on("editing-did-began", () => {
			oldName = this.Items.Text_name.obtainComponent(Label).string;
			this.Items.TextField_name.obtainComponent(EditBox).string = "";
			this.Items.Text_name.obtainComponent(Label).string = "";
		})

		this.Items.TextField_name.on("editing-did-ended", () => {
			let b = this.onClickChangeName();
			this.Items.TextField_name.obtainComponent(EditBox).string = "";
			if (b == false) {
				this.Items.Text_name.obtainComponent(Label).string = oldName;
			}
		})

		this.Items.TextField_name.on("editing-return", () => {
			this.Items.Text_name.obtainComponent(Label).string = oldName;
		})
	}

	onClickGo() {
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`userInfo/bind_phone`]
		});
		this.onClickClose();
	}

	onClickChangeName() {
		let editorInfo = this.Items.TextField_name.obtainComponent(EditBox).string;
		if (editorInfo == "") {
			return false;
		}

		if (editorInfo == center.user.getActorName()) {
			app.popup.showToast({
				text: `text_input_valid_email`
			})
			return false;
		}

		let SensitiveWordTB = [",", "+v", "+V", "vx", "VX", "+q", "+Q", ":"];
		for (let i = 0; i < SensitiveWordTB.length; i++) {
			let v = SensitiveWordTB[i];
			if (editorInfo.indexOf(v) != -1) {
				app.popup.showToast({
					text: `Special symbols cannot exist in the name`
				})
				return false;
			}
		}


		center.user.sendSubmitModifyName(editorInfo)
		return true;
	}

	onClickModifNick() {
		if (!fw.isNull(this.Items.TextField_name)) {
			this.Items.TextField_name.obtainComponent(EditBox)._impl.beginEditing();
		}
	}

	onClickHead() {
		app.popup.showDialog({
			viewConfig: fw.BundleConfig.plaza.res[`userInfo/userInfo_change_head`]
		});
	}

	onClickLogout() {
		//断开连接
		center.login.closeConnect();
		//切换到登录
		fw.scene.changeScene(fw.SceneConfigs.login);
	}
}
