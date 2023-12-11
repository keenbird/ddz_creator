import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';

let default_MD5 = {
	[1]: `e136374dfa5293236b41303de25689c7`,
	[2]: `4159167ced2cefe2c529c366b2d43c49`,
	[3]: `9247354b73bc33d1c0761145a89d35e5`,
	[4]: `5de34daad076a71906c31bd3e44a6292`,
	[5]: `2bd8e6c4326abb5cf363bdde0b00a414`,
	[6]: `13aae10b9560b5bb2cac16aee5f7ce91`,
	[7]: `76539b8851d640e9760ae189dfa5e3b6`,
	[8]: `5fb30492695d16876ef328108c01d7c0`,
	[9]: `3316f755b8ef5fa1101df346570cbabc`,
	[10]: `5fe341c235bf132f2f0fde44a16eb85e`,
	[11]: `f614d0d202c48e656de0047b5c85b5cf`,
	[12]: `6859b0edb02f8e8a2278d9877b20aa0a`,
	[13]: `9c7e39882903993622a30372c8086874`,
	[14]: `c91f94809536b18764bdb1f92579f360`,
	[15]: `4e7c37b6f4343ec18c0724508721cd88`,
	[16]: `fe22f27118def1e948b73e30e186acfe`,
	[17]: `6e1ff58d32ba07a4283b50a3e39551f5`,
	[18]: `eee55f90e902742aee0f65db06aa9a41`,
	[19]: `bb47d2f530096306088661b18536258b`,
	[20]: `4d7cc03433a740f473704b907f2f053e`,
	[21]: `712836486e0ec45802a00fb85d4d41ec`,
	[22]: `643b40b363ee3a7604f114964d1803e1`,
	[23]: `35fc3549c39e11ea62f7bbaccbdd4d04`,
	[24]: `1bcaee3c4918d61af99b3a25fde345c0`,
	[25]: `cafbe87cc352899c8a19344a4087bc59`,
	[26]: `55f5c18bd75693867831aa1d33da4b48`,
	[27]: `283eb6f036101278fdf76e946d15b760`,
	[28]: `0d2123b84d1baf0f26b7ee806eaa4f29`,
	[29]: `fa035be6eed9c2d9b7ccd9cb1a088083`,
	[30]: `c382315a911e7a332e8eeaaf2100ebf5`
}

// //测试代码
// globalThis.yyyy = () => {
// 	app.func.traversalObject(default_MD5, (element) => {
// 		app.assetManager.loadRemote({
// 			url: `${'http://192.168.125.109/Static/upload/image/icon/face/'}${app.file.getServerImageDir(element)}/${element}`,
// 			option: { ext: `.png` },
// 			callback: () => { }
// 		});
// 	});
// }

@ccclass('ChangeHead')
export class ChangeHead extends FWDialogViewBase {
	protected initView(): boolean | void {
		//调整标题
		this.changeTitle({ title: fw.language.get('Change Avatar') });//Change Avatar葡萄牙语Mudar Avatar
		//隐藏部分界面
		this.Items.Panel_item.active = false;
		//头像
		//添加一个选择图片
		let itemDefault = this.Items.Panel_item.clone();
		this.Items.content.addChild(itemDefault);
		itemDefault.active = true;
		app.file.updateImage({
			bAutoShowHide: true,
			node: itemDefault.Items.Image_head,
			bundleResConfig: fw.BundleConfig.plaza.res[`userInfo/img_new/YP_btn_jia/spriteFrame`],
		});
		//回调
		itemDefault.onClickAndScale(() => {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res[`userInfo/userInfo_edit_head`],
			});
		});
		//30个系统默认头像
		for (const k in default_MD5) {
			let item = this.Items.Panel_item.clone();
			this.Items.content.addChild(item);
			item.active = true;
			app.file.updateImage({
				bAutoShowHide: true,
				node: item.Items.Image_head,
				bundleResConfig: fw.BundleConfig.resources.res[`ui/head/img/atlas/LM_touxiang_${k}/spriteFrame`],
			});
			//回调
			item.onClickAndScale(() => {
				center.user.chooseDefaultHead(default_MD5[k]);
				this.onClickClose();
			});
		}
	}
}
