import { Label, _decorator } from 'cc';
import { ACTOR } from '../../../../app/config/cmd/ActorCMD';
import { DF_RATE, DF_SYMBOL } from '../../../../app/config/ConstantConfig';
import { EVENT_ID } from '../../../../app/config/EventConfig';
import { lucky3pt } from './model/desk';
const { ccclass } = _decorator;

@ccclass('lucky3patti_userinfo')
export class lucky3patti_userinfo extends (fw.FWComponent) {
	private m_desk: lucky3pt.DeskBean;
	initData() {

	}
	protected initEvents(): boolean | void {
		var teventsData = [
			{ event: EVENT_ID.EVENT_PLAZA_ACTOR_VARIABLE, callback: this.onActorVariable.bind(this) },
		];

		teventsData.forEach(element => {
			this.bindEvent(
				{
					eventName: element.event,
					callback: <T>(data: T) => {
						if (element.callback) {
							element.callback(element.event, data["dict"]);
						}
					}
				}
			);
		});
	}
	protected initView(): boolean | void {
		this.Items.label_num.obtainComponent(Label).string = DF_SYMBOL + (center.user.getActorProp(ACTOR.ACTOR_PROP_GOLD) / DF_RATE);
	}
	protected initBtns(): boolean | void {
		this.Items.sprite_add.onClickAndScale(() => {
			fw.print("click add !!!");
		});
		this.Items.sprite_question.onClickAndScale(() => {
			app.popup.showDialog({
				viewConfig: fw.BundleConfig.plaza.res["lucky3patti/lucky3patti/lucky3patti_rule"],
				data: this.m_desk,
			});
		});
	}
	// public setData<T>(data_: T): void {
	// 	this.m_desk = data_["deskBean"];
	// }
	private onActorVariable<T, U>(cmd_: T, param_: U): void {
		this.Items.label_num.obtainComponent(Label).string = DF_SYMBOL + (center.user.getActorProp(ACTOR.ACTOR_PROP_GOLD) / DF_RATE);
	}
}
