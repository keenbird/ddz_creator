import { Button, Sprite, Node as ccNode, Color, Vec2, _decorator } from 'cc';
import { LUCKY3PT_CARD_CHIP_COUNT } from '../../../../app/center/plaza/lucky3PattiCenter';
import { ACTOR } from '../../../../app/config/cmd/ActorCMD';
import { EVENT_ID } from '../../../../app/config/EventConfig';

import { lucky3pt } from './model/desk';
const { ccclass } = _decorator;

@ccclass('lucky3patti_chips')
export class lucky3patti_chips extends (fw.FWComponent) {
	private m_curTap: number;
	private m_desk: lucky3pt.DeskBean;

	initData() {
		this.m_curTap = 0;
	}
	protected initEvents(): boolean | void {
		var teventsData = [
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_JETTON_RET, callback: this.onUpdateChipsState.bind(this) },
			{ event: EVENT_ID.EVENT_LUCKY3PATTI_START, callback: this.onUpdateChipsState.bind(this) },
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
		this.m_curTap = this.m_desk.getChipIndex();
		this.setCurChipsSelected();
	}
	protected initBtns(): boolean | void {
		let tbetChips: number[] = this.m_desk.getChipScore();
		for (var i = 0; i < 5; ++i) {
			let node = this.Items["node_chips" + i]
			node.onClickAndScale(() => {
				if (this.m_curTap != node.tag) {
					if (tbetChips[node.tag] <= center.user.getActorProp(ACTOR.ACTOR_PROP_GOLD)) {
						this.m_curTap = node.tag;
						this.setCurChipsSelected();
					} else {
						// 弹充值界面
					}
				}
			});
		}
		this.onUpdateChipsState();
	}
	public setData<T>(data_: T): void {
		this.m_desk = data_["deskBean"];
	}
	private onUpdateChipsState<T, U>(cmd_: T = null, param_: U = null): void {
		var tnode: ccNode;
		let tbetChips: number[] = this.m_desk.getChipScore();
		for (var i = 0; i < LUCKY3PT_CARD_CHIP_COUNT; ++i) {
			tnode = this.Items["node_chips" + i];
			if (tbetChips[i] > center.user.getActorProp(ACTOR.ACTOR_PROP_GOLD)) {
				this.setBtnState(tnode, false);
			} else {
				this.setBtnState(tnode, true);

			}
		}
	}
	public setCurChipsSelected(): void {
		var tnode: ccNode;
		for (var i = 0; i < 5; ++i) {
			tnode = this.Items["node_chips" + i];
			tnode["tag"] = i;
			if (this.m_curTap == i) {
				tnode.setPosition(tnode.getPosition().x, 15);
				tnode.Items.sprite_flag.active = true;
				this.m_desk.setChipIndex(this.m_curTap);
			} else {
				tnode.setPosition(tnode.getPosition().x, 0);
				tnode.Items.sprite_flag.active = false;
			}
		}
	}
	public setBtnState(node_: ccNode, state_: boolean = true): void {
		if (state_) {
			node_.Items.sprite_chip.obtainComponent(Sprite).color = new Color(255, 255, 255);
			// node_.obtainComponent(FWButton).interactable = true ;
		} else {
			node_.Items.sprite_chip.obtainComponent(Sprite).color = new Color(128, 128, 128);
			// node_.obtainComponent(FWButton).interactable = false ;
		}
	}

}
