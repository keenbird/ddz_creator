import { Animation, Node as ccNode, Font, Label, Layout, UIOpacity, UITransform, v3, _decorator } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('head_GameBase')
export class head_GameBase extends (fw.FWComponent) {
	/**头像数据 */
	data: HeadDataParam
	/**分数动画 */
	scoreAnim: Animation
	protected initView(): boolean | void {
		//隐藏分数
		this.Items.Node_score.active = false;
		//初始化
		this.scoreAnim = this.Items.Node_score.getComponent(Animation);
		this.scoreAnim.on(Animation.EventType.FINISHED, () => {
			this.Items.Node_score.active = false;
		});
	}
	protected initEvents(): boolean | void {
		this.bindEvent({
			eventName: `PlayWinLoseScoreAnim`,
			callback: (arg1, arg2) => {
				if (!this.data || this.data.nChairID != arg1.data.nChairID) {
					return;
				}
				this.playScoreAnim(arg1.data.nScore);
			}
		});
	}
	playScoreAnim(nScore: number) {
		//分数为0不处理
		if (!nScore || nScore == 0) {
			return;
		}
		this.Items.Node_score.active = true;
		//刷新图片
		app.file.updateImage({
			bAutoShowHide: true,
			node: this.Items.Sprite_score_bg,
			bundleResConfig: app.game.getRes(`ui/head/img/atlas/${nScore > 0 ? `win_di` : `lose_di`}`)
		});
		//调整分数
		if (nScore > 0) {
			this.Items.Label_score.string = `+${nScore}`;
			this.loadBundleRes(app.game.getRes(`ui/head/font/p_win_1`), Font, (res) => {
				this.Items.Label_score.getComponent(Label).font = res;
			});
			app.file.updateImage({
				node: this.Items.Sprite_score_bg,
				bundleResConfig: app.game.getRes(`ui/head/img/atlas/win_di/spriteFrame`)
			});
		} else {
			this.Items.Label_score.string = `${nScore}`;
			this.loadBundleRes(app.game.getRes(`ui/head/font/p_lose_1`), Font, (res) => {
				this.Items.Label_score.getComponent(Label).font = res;
			});
			app.file.updateImage({
				node: this.Items.Sprite_score_bg,
				bundleResConfig: app.game.getRes(`ui/head/img/atlas/lose_di/spriteFrame`)
			});
		}
		this.Items.Label_score.getComponent(Label).updateRenderData(true);
		this.Items.Sprite_score_bg.getComponent(Layout).updateLayout(true);
		let wPos = fw._v3;
		this.Items.Node_score.getWorldPosition(wPos);
		let bSize = this.Items.Node_bg.getComponent(UITransform).contentSize;
		let sSize = this.Items.Sprite_score_bg.getComponent(UITransform).contentSize;
		if (wPos.x > app.winSize.width / 2) {
			this.Items.Sprite_score_bg.setPosition(v3(0 - (bSize.width / 2 + sSize.width / 2) + 25));
		} else {
			this.Items.Sprite_score_bg.setPosition(v3(0 + (bSize.width / 2 + sSize.width / 2) - 25));
		}
		//播放动画
		this.Items.Node_score.getComponent(UIOpacity).opacity = 0;
		this.scoreAnim.play();
	}
	updateHeadData(data: HeadDataParam) {
		this.data = data;
	}
}

/**类型声明调整 */
declare global {
	namespace globalThis {
		type HeadDataParam = {
			/**服务器座位号 */
			nChairID?: number
			/**客户端座位号 */
			index?: number
		}
	}
}
