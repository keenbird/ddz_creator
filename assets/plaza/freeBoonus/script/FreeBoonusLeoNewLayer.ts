import { Label } from 'cc';
import { _decorator } from 'cc';
const { ccclass } = _decorator;
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('FreeBoonusLeoNewLayer')
export class FreeBoonusLeoNewLayer extends FWDialogViewBase {
	mLeoAdInfo: {
		img?: string; descriptions?: string; shareOptionData?: {
			shareOption: string; name: string; img: string; // updateUrlImageFrame(item.Items.Image_share_icon, v.img)
		}[];
	};
	initData() {
		this.mLeoAdInfo = app.native.leo.getLeoShareInfo();
	}
	protected initEvents(): boolean | void {

	}
	protected initView(): boolean | void {
		this.Items.Panel_share_btn.active = false
		if(this.mLeoAdInfo.img) {
			let data:FWUpdateSpriteParam = {}
			data.serverPicID = this.mLeoAdInfo.img;
			data.node = this.Items.Image_banner;
			app.file.updateUrlImage(data);
		}
		
		let shareOptionData = this.mLeoAdInfo.shareOptionData
		shareOptionData.forEach((v, i) => {
			let item = this.Items.Panel_share_btn.clone()
			item.active = true
			this.Items.ListView_share_btn.addChild(item)
			item.onClickAndScale(() => {
				app.native.leo.shareWithOption(v.shareOption)
			});
			if (v.img) {
				let data:FWUpdateSpriteParam = {}
				data.serverPicID = v.img;
				data.node = item.Items.Image_share_icon;
				app.file.updateUrlImage(data);
			}
			item.Items.Text_share_name.getComponent(Label).string = v.name ?? ""
		})
	}
	protected initBtns(): boolean | void {
		this.Items.close_btn.onClickAndScale(this.onClickClose.bind(this));
	}
}
