import { _decorator, EditBox, ImageAsset, Sprite, SpriteFrame } from 'cc';
const { ccclass } = _decorator;

import { DF_RATE, FeedbackType, ScreenOrientationType } from '../../../app/config/ConstantConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
import { FWButton } from '../../../app/framework/extensions/FWButton';
import { ShopRecord } from './ShopRecord';

@ccclass('shop_record_feedback')
export class shop_record_feedback extends FWDialogViewBase {
    /**是否具有横竖屏切换功能（意思是当前界面会调整 “横竖屏” 状态），如果界面设计没有适配横竖屏，那么应该设置该属性为true，并调整_nScreenOrientation值为当前界面设计方向 */
    bHaveScreenOrientation: boolean = true
	/**调整屏幕方向 */
	_nScreenOrientation: ScreenOrientationType = ScreenOrientationType.Vertical_true
	popupData: {
		recordData: ShopRecordData
	}
	protected initView(): boolean | void {
		//调整标题
		this.changeTitle({
			title: ({
				[fw.LanguageType.en]: `Recharge help`,
				[fw.LanguageType.brasil]: `Ajuda com recarga`,
			})[fw.language.languageType]
		});
		this.Items.Label_screenshot.string = ({
			[fw.LanguageType.en]: `Upload Screenshot`,
			[fw.LanguageType.brasil]: `Enviar imagem`,
		})[fw.language.languageType];
		this.Items.Label_say.string = ({
			[fw.LanguageType.en]: `I want to say`,
			[fw.LanguageType.brasil]: `Eu gostaria de dizer`,
		})[fw.language.languageType];
		//刷新界面
		ShopRecord.updateOne(this.Items.Image_item_bg, this.popupData.recordData);
		//是否是缓存界面
		const oldData: ShopFeedbackCachedData = JSON.safeParse(app.file.getStringFromUserFile({
			filePath: `feedback/shop${this.popupData.recordData.order_id}`,
		}));
		if (oldData) {
			this.updateContentImage(oldData.filePath);
		}
		this.updateStatus(!!oldData, oldData);
	}
	protected initBtns(): boolean | void {
		//选择图片
		this.Items.Sprite_screenshot.onClick(() => {
			if (app.func.isBrowser()) {
				app.file.openSelectFile({
					type: app.file.READ_FILE_TYPE.Data_Url,
					callback: (content: string, file: File) => {
						(<any>this).file = file;
						app.func.base64ToSpriteFrame(content, (spriteFrame) => {
							this.updateContentImage(spriteFrame);
						});
					}
				});
			} else {
				if (app.native.device.hasPermissions(`android.permission.READ_EXTERNAL_STORAGE`)) {
					(<any>this).filePath = `${app.file.getFileDir(app.file.FileDir.Copy)}feedback/shop${this.popupData.recordData.order_id}.png`;
					app.native.device.pickFromGallery((<any>this).filePath);
				} else {
					app.native.device.requestPermissions(`Request permission to read external files`, 1, `android.permission.READ_EXTERNAL_STORAGE`)
				}
			}
		});
	}
	protected initEvents(): boolean | void {
		this.bindEvent({
			eventName: `CameraPicture`,
			callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam) => {
				this.updateContentImage(arg1.data);
			}
		});
	}
	/**调整状态 */
	updateStatus(bResend: boolean, oldData?: ShopFeedbackCachedData) {
		let editBox = this.Items.EditBox.getComponent(EditBox);
		if (bResend) {
			this.Items.Label_ok.string = ({
				[fw.LanguageType.en]: `Resend`,
				[fw.LanguageType.brasil]: `Reenviar`,
			})[fw.language.languageType];
			editBox.enabled = false;
			editBox.placeholder = oldData.content;
			this.Items.Node_ok.onClickAndScale(() => {
				this.updateStatus(false);
			});
			this.Items.Sprite_screenshot.obtainComponent(Sprite).grayscale = true;
			this.Items.Sprite_screenshot.obtainComponent(FWButton).interactable = false;
			this.Items.Node_say.Items.Sprite.updateSprite(fw.BundleConfig.plaza.res[`withdraw/img/atlas/shuru_nor/spriteFrame`]);
			this.Items.Node_screenshot.Items.Sprite.updateSprite(fw.BundleConfig.plaza.res[`withdraw/img/atlas/shuru_nor/spriteFrame`]);
		} else {
			this.Items.Label_ok.string = `Ok`;
			editBox.enabled = true;
			editBox.placeholder = ({
				[fw.LanguageType.en]: `Please enter your idea or suggestions.`,
				[fw.LanguageType.brasil]: `Por favor, digite sua ideia ou sugestões.`,
			})[fw.language.languageType]
			this.Items.Sprite_screenshot.obtainComponent(Sprite).grayscale = false;
			this.Items.Sprite_screenshot.obtainComponent(FWButton).interactable = true;
			this.Items.Sprite_screenshot.updateSprite(fw.BundleConfig.plaza.res[`withdraw/img/atlas/btn_img/spriteFrame`]);
			this.Items.Node_say.Items.Sprite.updateSprite(fw.BundleConfig.plaza.res[`withdraw/img/atlas/shuru_sel/spriteFrame`]);
			this.Items.Node_screenshot.Items.Sprite.updateSprite(fw.BundleConfig.plaza.res[`withdraw/img/atlas/shuru_sel/spriteFrame`]);
			this.Items.Node_ok.onClickAndScale(this.onClickOk.bind(this));
		}
	}
	/**调整图片 */
	updateContentImage(path: string | BundleResConfig | SpriteFrame) {
		if (!path) {
			return;
		}
		let node = this.Items.Sprite_screenshot;
		if (typeof (path) == `string`) {
			if (app.file.isFileExist(path) && !app.file.isDirectoryExist(path)) {
				app.assetManager.loadRemote<ImageAsset>({
					url: path,
					bCleanCache: true,
					callback: (imageAsset) => {
						node.setSpriteFrameByImageAsset(imageAsset);
					}
				});
			}
		} else {
			if (path instanceof SpriteFrame) {
				//调整显示
				node.getComponent(Sprite).spriteFrame = path;
			} else {
				node.loadBundleRes(path,(res: SpriteFrame) => {
					node.getComponent(Sprite).spriteFrame = res;
				},{
					failCallback:() => {
						fw.printError(`图片加载异常: ${path ? path.all : `null`}`);
					}
				});
			}
		}
	}
	/**ok */
	onClickOk() {
		const content = this.Items.EditBox.getComponent(EditBox).string;
		if (!content) {
			app.popup.showToast(`feedback content is empty`);
			return;
		}
		app.interface.uploadFeedback({
			content: content,
            recharge_id: this.popupData.recordData.order_id,
			file: (<any>this).file,
			filePath: (<any>this).filePath,
			feedbackType: FeedbackType.RechargeHelp,
			callback: (response) => {
				if (response.status == 1) {
					/**缓存提现反馈内容 */
					app.file.writeStringToUserFile({
						filePath: `feedback/shop${this.popupData.recordData.order_id}`,
						fileData: JSON.stringify({
							recordData: this.popupData.recordData,
							filePath: (<any>this).filePath,
							content: content,
						}),
					});
					/**事件通知 */
					app.event.dispatchEvent({
						eventName: `ShopFeedbackSuccessed`,
						data: this.popupData.recordData,
					});
					if (!fw.isNull(this)) {
						this.onClickClose();
					}
					app.popup.showDialog({
						viewConfig: fw.BundleConfig.plaza.res[`service/service_feedback_tips`],
					});
				}
			}
		});
	}
}

declare global {
	namespace globalThis {
		interface ShopFeedbackCachedData {
			/**提现记录 */
			recordData: ShopRecordData,
			/**图片路径 */
			filePath: string,
			/**反馈内容 */
			content: string,
		}
	}
}
