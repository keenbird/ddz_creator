import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { FWDialogViewBase } from '../../../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('rule_AB')
export class rule_AB extends FWDialogViewBase {
	protected initView(): boolean | void {
		this.changeTitle({
			title: `How to play`
		});

		this.Items.Label_1.string = `The dealer puts a card in the center of the table.\nThis is the Joker card.`;

		this.Items.Label_3.string = `Players bet on which side a card of Joker's rank\nwill drop , Andar or Bahar.`;

		this.Items.Label_5.string = `You bet twice . The first bet happens after\nthe Joker card appears.`;

		this.Items.Label_6.string = `Second bet happens after two cards have been\ndealt to the table.`;

		this.Items.Label_8.string = `The game ends when a card of the same rank as\nthe Joker lands on Andar or Bahar.`;
	}
}
