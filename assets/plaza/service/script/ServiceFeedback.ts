import { ImageAsset, Sprite, SpriteFrame, Texture2D, UITransform, EditBox } from 'cc';
import { Label, _decorator } from 'cc';
// import { EditBox } from '../../../../engine/typedoc-index';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
const { ccclass } = _decorator;

@ccclass('ServiceFeedback')
export class ServiceFeedback extends FWDialogViewBase {
	nFeedbackType: number;
	filePath: string;
	BtnItems: any[];
	data: any;
	file: Blob;
	initData() {
		this.filePath = ""
		this.nFeedbackType = 12
	}
	protected initEvents(): boolean | void {
		this.bindEvent({
			eventName: ["CloseAllServiceDialog",],
			callback: (arg1, arg2) => {
				this.onClickClose()
			}
		});
        this.bindEvent({
            eventName: `CameraPicture`,
            callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam) => {
                this.updateContentImage(arg1.data);
            }
        });
	}
	protected initView(): boolean | void {
		this.Items.Text_title_.string = fw.language.get("Help&Support")
		this.Items.Text_feedback_type.string = fw.language.get("Feedback Type:")
		this.Items.content_editBox.getComponent(EditBox).placeholder = fw.language.get("Please describe your problems")

		this.Items.Panel_item.active = false
		this.Items.ScrollView_type.Items.Layout.removeAllChildren(true)
	}
	protected initBtns(): boolean | void {
		this.Items.Panel_close_all.onClickAndScale(() => {
			app.event.dispatchEvent({
				eventName: "CloseAllServiceDialog",
			});
		});
		this.Items.Image_texture_input.onClickAndScale(() => {
			this.onClickTexture()
		});
		//按钮文字
		(<type_btn_common>(this.Items.btn_common.getComponent(`btn_common`))).setData({
			text: fw.language.get("Okey"),
			styleId: 3,
			callback: this.onClickSubmit.bind(this),
		});
		let menuList = [
			{
				btnText: fw.language.get("Game Bug"),
				callback: () => { this.nFeedbackType = 12 },
			},
			{
				btnText: fw.language.get("Invitation Help"),
				callback: () => { this.nFeedbackType = 17 },
			},
			{
				btnText: fw.language.get("Other Help"),
				callback: () => { this.nFeedbackType = 9 },
			},
		]
		this.Items.ScrollView_type.Items.Layout.removeAllChildren(true)
		let contentWidth = 0
		this.BtnItems = []
		menuList.forEach((v, i) => {
			let item = this.Items.Panel_item.clone();
			item.active = true
			this.updataList(item, v, i)
			let size = item.getComponent(UITransform)
			contentWidth = contentWidth + size.width
			this.Items.ScrollView_type.Items.Layout.addChild(item)
			this.BtnItems.push(item)
		})
		this.typeClick(0)
	}
	updataList(item, data, index) {

		item.Items.Text_btn_normal.getComponent(Label).string = data.btnText
		item.Items.Text_btn_select.getComponent(Label).string = data.btnText
		item.onClick(() => {
			data.callback()
			this.typeClick(index)
			fw.print("this.nFeedbackType", this.nFeedbackType)
		});
	}
	typeClick(index) {
		this.BtnItems.forEach((item, i) => {
			item.Items.Image_btn_normal.active = !(i == index)
			item.Items.Image_btn_select.active = i == index
		})
	}
	onClickSubmit() {
		let nLastTime = app.file.getIntegerForKey("FeedbackTime", 0)
		if (nLastTime > 0 && app.func.time() - nLastTime < 30) {
			app.popup.showToast({ text: fw.language.get("Feedback after 30 seconds") })
			return
		}
		let content = this.Items.content_editBox.Items.content.getComponent(Label).string
		if (content == "") {
			app.popup.showToast({ text: fw.language.get("Please enter your idea or suggestions") })
			return
		}
		if (this.nFeedbackType == 0) {
			app.popup.showToast({ text: fw.language.get("Please select feedback type") })
			return
		}
		app.interface.uploadFeedback({
			content: content,
			file: this.file,
			filePath: this.filePath,
			feedbackType: this.nFeedbackType,
			callback: (response) => {
				if (response.status == 1) {
					if (!fw.isNull(this)) {
						this.onClickClose()
					}
					app.popup.showDialog({
						viewConfig: fw.BundleConfig.plaza.res[`service/service_feedback_tips`],
					});
				}
			}
		});

		app.file.setIntegerForKey("FeedbackTime", app.func.time())
	}
	onClickTexture() {
		if (app.func.isBrowser()) {
			app.file.openSelectFile({
				type: app.file.READ_FILE_TYPE.Data_Url,
				callback: (content: string, file: File) => {
					this.file = file;
					app.func.base64ToSpriteFrame(content, (spriteFrame) => {
						this.updateContentImage(spriteFrame);
					});
				}
			});
		} else {
			if (app.native.device.hasPermissions(`android.permission.READ_EXTERNAL_STORAGE`)) {
				this.filePath = `${app.file.getUserWritablePath()}feedback/feedback_texture.png`;
				app.native.device.pickFromGallery(this.filePath);
			} else {
				app.native.device.requestPermissions(`Request permission to read external files`, 1, `android.permission.READ_EXTERNAL_STORAGE`);
			}
		}
	}
	/**调整图片 */
	updateContentImage(path: string | SpriteFrame) {
		let node = this.Items.Image_texture_input;
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
			//调整显示
			node.getComponent(Sprite).spriteFrame = path;
		}
	}
}

declare global {
	namespace globalThis {
		type plaza_ServiceFeedback = ServiceFeedback
	}
}