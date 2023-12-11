import { _decorator } from 'cc';
const { ccclass } = _decorator;

import { FWDialogViewBase } from '../../../../../app/framework/view/popup/FWDialogViewBase';

@ccclass('rule_AB')
export class rule_AB extends FWDialogViewBase {
	protected initView(): boolean | void {
		this.changeTitle({
			title: ({
				[fw.LanguageType.en]: `How to play`,
				[fw.LanguageType.brasil]: `कैसे खेलें`,
			})[fw.language.languageType]
		});

		this.Items.Label_1.string = ({
			[fw.LanguageType.en]: `The dealer puts a card in the center of the table.\nThis is the Joker card.`,
			[fw.LanguageType.brasil]: `डीलर टेबल के बीच में एक कार्ड रखता है। यह जोकर कार्ड है।`,
		})[fw.language.languageType];

		this.Items.Label_3.string = ({
			[fw.LanguageType.en]: `Players bet on which side a card of Joker's rank\nwill drop , Andar or Bahar.`,
			[fw.LanguageType.brasil]: `खिलाड़ी शर्त लगाते हैं कि जोकर रैंक का कार्ड किस तरफ गिरेगा, अंदर या बहार।`,
		})[fw.language.languageType];

		this.Items.Label_5.string = ({
			[fw.LanguageType.en]: `You bet twice . The first bet happens after\nthe Joker card appears.`,
			[fw.LanguageType.brasil]: `आपने दो बार शर्त लगाई। पहली बेट जोकर कार्ड के प्रकट होने के बाद होती है।`,
		})[fw.language.languageType];

		this.Items.Label_6.string = ({
			[fw.LanguageType.en]: `Second bet happens after two cards have been\ndealt to the table.`,
			[fw.LanguageType.brasil]: `दूसरा बेट तब होता है जब दो कार्ड टेबल पर डील हो जाते हैं।`,
		})[fw.language.languageType];

		this.Items.Label_8.string = ({
			[fw.LanguageType.en]: `The game ends when a card of the same rank as\nthe Joker lands on Andar or Bahar.`,
			[fw.LanguageType.brasil]: `खेल समाप्त होता है जब जोकर के समान रैंक का एक कार्ड अंदर और बहार पर उतरता है`,
		})[fw.language.languageType];
	}
}
