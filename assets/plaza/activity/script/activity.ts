import { instantiate, Node as ccNode, Prefab, Sprite, UITransform, v3, _decorator } from 'cc';
const { ccclass } = _decorator;

import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
import { DOWN_IMAGE_TYPE } from '../../../app/config/ConstantConfig';

@ccclass('activity')
export class activity extends FWDialogViewBase {
	/**上一个选中的界面 */
	lastSelectActivity: ActivityContentParam
	/**菜单，在app.func.createMenu时创建 */
	menu: FWMenuParam<ActivityConfig>
	/**活动内容 */
	activityContentNode: { [key: number]: ActivityContentParam } = {}
	protected initEvents(): boolean | void {
	}
	protected initView(): boolean | void {
		//调整标题
		this.changeTitle({ title: fw.language.get("Activity") });
		//隐藏部分界面
		this.Items.Node_menu_item.active = false;
		//刷新界面
		this.updateView();
	}
	protected initBtns(): boolean | void {
		//活动点击
		this.Items.Node_content.onClick(this.onClickActivity.bind(this));
	}
	updateView() {
		//刷新左侧菜单
		let activityList = center.activity.getRunningActivityList();
		this.Items.content.removeAllChildren(true);
		let btns = [];
		activityList.forEach(element => {
			//解析数据
			let activityUrlConfig = center.activity.getActivityUrlConfig(element);
			let show = true
			if (activityUrlConfig.activityShow && activityUrlConfig.activityShow == "false") {
				show = false
			}
			if (show) {
				let btn = this.Items.Node_menu_item.clone();
				this.Items.content.addChild(btn);
				btn.active = true;
				//添加一个选项
				btns.push(<FWOneMenuBtnParam<ActivityConfig>>{
					node: btn,
					data: element,
					text: `${element.title}`,
					callback: () => {
						this.changeActivity(element);
					}
				});
			}
		});
		//创建菜单
		app.func.createMenu({
			mountObject: this,
			btns: btns,
		});
	}
	changeActivity(activityConfig: ActivityConfig) {
		//同一个不处理
		let newSelectActivity = this.activityContentNode[activityConfig.nrid];
		if (this.lastSelectActivity) {
			if (this.lastSelectActivity == newSelectActivity) {
				return;
			}
			//隐藏上一个
			this.lastSelectActivity.node.active = false;
		}
		//是否已经加载好了
		if (newSelectActivity) {
			this.lastSelectActivity = newSelectActivity;
			this.lastSelectActivity.node.active = true;
			return;
		}
		//显示问号
		this.Items.Sprite_null.active = true;
		//解析数据
		let activityUrlConfig = center.activity.getActivityUrlConfig(activityConfig);
		//新建图片
		let img = this.Items.Sprite_null.clone();
		this.Items.Node_content.addChild(img);
		img.setPosition(v3());
		img.getComponent(Sprite).sizeMode = Sprite.SizeMode.CUSTOM;
		img.getComponent(UITransform).contentSize = this.Items.Node_content.getComponent(UITransform).contentSize;
		//刷新图片
		img.active = false;
		app.file.updateTexture({
			node: img,
			serverPicID: activityConfig.imgurl,
			type: DOWN_IMAGE_TYPE.Activity,
			callback: () => {
				//显示图片
				img.active = true;
				//隐藏问号
				this.Items.Sprite_null.active = false;
			}
		});
		//记录上一个
		this.lastSelectActivity = { node: img, bInit: !activityUrlConfig.activityName };
		//缓存信息
		this.activityContentNode[activityConfig.nrid] = this.lastSelectActivity;
		//动态活动组件，扩展参数中有activityName则认为是动态活动
		if (activityUrlConfig.activityName) {
			app.dynamicActivity.checkUpdate(activityConfig, () => {
				this.activityContentNode[activityConfig.nrid].bInit = true;
			});
		}
	}
	onClickActivity() {
		let menu = this.menu;
		if (menu.target) {
			let activityConfig = menu.target.data;
			let activityUrlConfig = center.activity.getActivityUrlConfig(activityConfig);
			if (activityUrlConfig.activityName) {
				//未初始化完成不处理
				if (this.activityContentNode[activityConfig.nrid].bInit) {
					let c: class_dynamicActivity = app.dynamicActivity.getDynamicActivityCom(activityUrlConfig.activityName);
					if (c) {
						c.instance().onClickActivity();
					} else {
						fw.print(`activity onClickActivity error`);
					}
				} else {
					app.popup.showToast(`Please try again later!`);
				}
			}else if(activityConfig.url.startsWith("pandaddz://")){
				app.jump.jump(activityConfig)
			}
		}
	}
}

/**类型声明调整 */
declare global {
	namespace globalThis {
		/**活动内容参数 */
		type ActivityContentParam = {
			/**活动图节点 */
			node: ccNode
			/**是否已经初始化完成 */
			bInit: boolean
		}
	}
}
