import { Label, Node as ccNode, Slider, UITransform, _decorator } from 'cc';
const { ccclass } = _decorator;

import { FWDialogViewBase } from '../../../../app/framework/view/popup/FWDialogViewBase';

//刷新数据类型
export enum SettingUpdateType {
	Music = 1,
	Sound = 2,
}

@ccclass('setting')
export class setting extends FWDialogViewBase {
	//是否滑块滑动
	private bSliderMove: boolean = false;
	//是否可写数据
	private bCanWrite: boolean = true;
	protected initView(): boolean | void {
		//调整标题
		this.changeTitle({ title: `Setting` });
		//版本号
		this.Items.Label_version.obtainComponent(Label).string = `version: 0`;
		this.Items.Label_version.obtainComponent(Label).string = `version: ${app.file.getPlazaVersion()}`;
		//调整当前状态
		//音乐
		this.updateSlider(this.Items.Node_music.Items.Slider, app.audio.getMusicSwitch(), app.audio.getMusicVolume(), true);
		//音效
		this.updateSlider(this.Items.Node_sound.Items.Slider, app.audio.getEffectSwitch(), app.audio.getEffectVolume(), true);
		//滑动监听
		//音乐
		this.Items.Node_music.Items.Slider.on(`slide`, () => {
			//避免快速读写
			this.bSliderMove = true;
			this.bCanWrite && this.updateData(SettingUpdateType.Music);
			this.updateSlider(this.Items.Node_music.Items.Slider, app.audio.getMusicSwitch(), null, false);
		});
		//滑块
		this.Items.Node_music.Items.Handle.on(ccNode.EventType.TOUCH_END, () => {
			this.updateData(SettingUpdateType.Music);
			this.updateSlider(this.Items.Node_music.Items.Slider, app.audio.getMusicSwitch(), null, false);
		});
		//音效
		this.Items.Node_sound.Items.Slider.on(`slide`, () => {
			//避免快速读写
			this.bSliderMove = true;
			this.bCanWrite && this.updateData(SettingUpdateType.Sound);
			this.updateSlider(this.Items.Node_sound.Items.Slider, app.audio.getEffectSwitch(), null, false);
		});
		//滑块
		this.Items.Node_sound.Items.Handle.on(ccNode.EventType.TOUCH_END, () => {
			this.updateData(SettingUpdateType.Sound);
			this.updateSlider(this.Items.Node_sound.Items.Slider, app.audio.getEffectSwitch(), null, false);
		});
		//控制读写定时器
		this.setInterval(() => {
			this.bCanWrite = true;
		}, 0.1);

		this.Items.Node_close.onClickAndScale(() => {
			this.onCancelClickClose()
		});
	}
	updateSlider(slider: ccNode, bSwitch: boolean, nProgress: number, bSlider: boolean) {
		//进度
		let progress = bSwitch ? (nProgress ?? slider.getComponent(Slider).progress) : 0;
		//滑块进度
		if (bSlider) {
			slider.getComponent(Slider).progress = progress;
		}
		//调整亮条长度
		slider.Items.Sprite_light.getComponent(UITransform).width = slider.size.width * progress;
	}
	updateData(nType?: SettingUpdateType) {
		//设置读写状态
		this.bCanWrite = false;
		//音乐
		if (!nType || nType == SettingUpdateType.Music) {
			let progress = this.Items.Node_music.Items.Slider.getComponent(Slider).progress;
			app.audio.setMusicVolume(progress);
			app.audio.setMusicSwitch(progress > 0);
		}
		//音效
		if (!nType || nType == SettingUpdateType.Sound) {
			let progress = this.Items.Node_sound.Items.Slider.getComponent(Slider).progress;
			app.audio.setEffectVolume(progress);
			app.audio.setEffectSwitch(progress > 0);
		}
	}
	protected update(dt: number): void {
		if (this.bCanWrite && this.bSliderMove) {
			this.updateData(SettingUpdateType.Music);
			this.updateData(SettingUpdateType.Sound);
			this.bSliderMove = false;
		}
	}
}


/**声明全局调用 */
declare global {
    namespace globalThis {
        interface LanguageMenuBtnParam {
			/**语言类型 */
			nLanguageType: string
			/**按钮节点 */
			node: ccNode
			/**按钮回调 */
			callback: (data: LanguageMenuBtnParam) => void
        }
    }
}
