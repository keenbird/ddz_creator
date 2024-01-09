import { _decorator, Sprite, SpriteFrame, Label } from 'cc';
const { ccclass } = _decorator;

@ccclass('btn_common')
export class btn_common extends (fw.FWComponent) {
	private static res: { [path: string]: SpriteFrame } = {}
	/**是否手动初始化 */
	bInit: boolean = false
	/**配置参数 */
	data: BtnStyleParam
	setData(data: BtnStyleParam) {
		this.data = data;
		this.initStyle();
	}
	/**
	 * initStyle不以“_green or _red or ...”等结尾，而是以“_x”结尾是为了避免以后资源变动后名称和资源不对应
	 */
	/**一般用于“同意”，“OK”，“好的” ...等同意类按钮，也可自定义使用 */
	private initStyle_1(data: BtnStyleParam) {
		data.text = data.text ?? `确定`;
		data.bundleResConfig = data.bundleResConfig ?? fw.BundleConfig.resources.res[`ui/btn/an_dh/spriteFrame`];
		this.initStyle(data, true);
	}
	/**一般用于“拒绝”，“No”，“不了” ...等拒绝类按钮，也可自定义使用 */
	private initStyle_2(data: BtnStyleParam) {
		data.text = data.text ?? `拒绝`;
		data.bundleResConfig = data.bundleResConfig ?? fw.BundleConfig.resources.res[`ui/btn/an_hong/spriteFrame`];
		this.initStyle(data, true);
	}
	/**一般用于“了解”，“知道了” ...等中立类按钮，也可自定义使用 */
	private initStyle_3(data: BtnStyleParam) {
		data.text = data.text ?? `了解`;
		data.bundleResConfig = data.bundleResConfig ?? fw.BundleConfig.resources.res[`ui/btn/an_dlv/spriteFrame`];
		this.initStyle(data, true);
	}
	/**初始化界面 */
	protected initView(): boolean | void {
		//刷新显示
		if (!this.bInit) {
			this.initStyle();
		}
	}
	/**自定义初始化函数 */
	initStyle(data?: BtnStyleParam, bSelf?: boolean) {
		data ??= this.data;
		if (!data) {
			return;
		}
		this.bInit = true;
		if (!bSelf && !fw.isNull(data.styleId)) {
			let strFunc = `initStyle_${data.styleId}`;
			if (this[strFunc]) {
				this[strFunc](data);
			} else {
				fw.printError(`FWPopupManager newBtn error`, data);
			}
		} else {
			//背景
			if (fw.isValid(this.Items.Sprite_bg)) {
				//更换背景
				if (fw.isNull(data.bundleResConfig)) {
					// this.Items.Sprite_bg.active = false;
				} else {
					const cache = btn_common.res[data.bundleResConfig.all];
					if (fw.isValid(cache)) {
						this.Items.Sprite_bg.obtainComponent(Sprite).spriteFrame = cache;
					} else {
						this.Items.Sprite_bg.loadBundleRes(data.bundleResConfig,(res: SpriteFrame) => {
							this.Items.Sprite_bg.obtainComponent(Sprite).spriteFrame = res;
							btn_common.res[data.bundleResConfig.all] = res;
						});
					}
				}
			}
			//文本
			if (fw.isValid(this.Items.Label_content)) {
				//更换文本
				this.Items.Label_content.obtainComponent(Label).string = data.text ?? ``;
			}
			//回调
			this.onClickAndScale(data.callback);
		}
	}
}

/**类型声明调整 */
declare global {
	namespace globalThis {
		type type_btn_common = btn_common
		type BtnStyleParam = {
			/**
			 * 样式Id
			 * @value 1、一般用于“同意”，“OK”，“好的” ...等同意类按钮，也可自定义使用
			 * @value 2、一般用于“拒绝”，“No”，“不了” ...等拒绝类按钮，也可自定义使用
			 * @value 3、一般用于“了解”，“知道了” ...等中立类按钮，也可自定义使用
			 */
			styleId: number
			//回调函数
			callback?: Function
			//文本类容
			text?: string
			//点击后不关闭弹框
			bNotClose?: boolean
			//资源配置
			bundleResConfig?: BundleResConfig
		}
	}
}
