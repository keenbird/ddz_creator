import { color, js, Label, _decorator, Node, instantiate, Prefab, tween, Tween, Sprite, SpriteFrame, randomRangeInt, randomRange } from 'cc';
import proto from '../../../../../app/center/common';
import { DF_RATE, DF_SYMBOL } from '../../../../../app/config/ConstantConfig';
import { EVENT_ID } from '../../../../../app/config/EventConfig';
import { PAY_MODE } from '../../../../../app/config/ModuleConfig';
import { FWDialogViewBase } from '../../../../../app/framework/view/popup/FWDialogViewBase';
import { btn_common } from '../../../../../resources/ui/btn/script/btn_common';
import { guide_hand_1 } from '../../../../../resources/ui/guide/script/guide_hand_1';
const { ccclass } = _decorator;

@ccclass('SiginboradFanpai')
export class SiginboradFanpai extends FWDialogViewBase {
    m_bClick: boolean;
    m_bFinish: boolean;
    m_nClickIndex: number;
    m_allAni: any[];
    m_allTxtReward: any[];
    m_allIconReward: any[];
    m_allBtn: any[];
    guideNode: any;
    m_DrawData: { drawDay: any; drawMax: any; };
    m_callBack: Function;
	initData() {
		this.m_bClick = false;
        this.m_bFinish = false;
        this.m_nClickIndex = 1;
        this.m_DrawData = center.taskActive.getSevenActiveDrawData();
	}
	protected initEvents(): boolean | void {
		//返回键
        this.bindEvent({
            eventName: app.event.CommonEvent.Keyback,
            callback: () => {}
        });
        
        this.bindEvent({
            eventName: "UpdateSiginboradFanpai",
            callback: (arg1) => {
                this.m_callBack = arg1.data.callback;
                this.updateData(arg1.data.rewardNum);
            }
        });
	}
	protected initView(): boolean | void {
		this.m_allAni = [];
        this.m_allTxtReward = [];
        this.m_allIconReward = [];
        this.m_allBtn = [];

        for (let index = 1; index <= 5; index++) {
            let btn = this.Items['imgBg'+index]
            btn.onClickAndScale(()=>{
                if (!this.m_bClick) {
                    this.m_nClickIndex = index-1;
                    this.m_bClick = true;
                    center.taskActive.sendSevenactive(true);

                    // Tween.stopAllByTarget(this.Items.btn_common);
                    // tween(this.Items.btn_common)
                    //     .delay(1.0)
                    //     .call(() => {
                    //         this.updateData(951);
                    //     })
                    //     .start();
                }
                this.removeGuide();
                app.file.setBooleanForKey("SiginboradFanpaiGuid", true);
            })
            let ani = btn.Items.fanpai;
            ani.active = false;
            let icon = btn.Items.imgReward1;
            icon.active = false;
            let txtReward = btn.Items.txtReward1;
            txtReward.active = false;
            this.m_allAni.push(ani);
            this.m_allTxtReward.push(txtReward);
            this.m_allIconReward.push(icon);
            this.m_allBtn.push(btn);
        }

        this.Items.btn_common.active = false;
        this.Items.rewardTitle.string = `UP TO ${DF_SYMBOL}${this.m_DrawData.drawMax / DF_RATE}`;

        this.Items.txtClickTips.obtainComponent(fw.FWLanguage).bindCustom(``, () => {
			this.Items.txtClickTips.string = {
				[fw.LanguageType.en]: `Click to choose a reward`,
				[fw.LanguageType.brasil]: `Clique para escolher uma recompensa`,
			}[fw.language.languageType];
		});

        this.checkGuide();
        Tween.stopAllByTarget(this.Items.node_anim);
        tween(this.Items.node_anim)
            .delay(1.0)
            .call(() => {
                    if (this.guideNode) {
                        this.guideNode.active = true;
                    }
                })
            .start();
	}
	protected initBtns(): boolean | void {
		this.Items.btn_common.getComponent(btn_common).initStyle({
			styleId: 1,
			text: `OK`,
			callback: () => {
                if (this.m_callBack) {
                    this.m_callBack()
                }
				this.close();
			}
		});
	}
    public checkGuide() {
        let isGuided = app.file.getBooleanForKey("SiginboradFanpaiGuid", false);
		if(!fw.isValid(this.guideNode) && !isGuided ) {
			this.node.loadBundleRes(fw.BundleConfig.resources.res[`ui/guide/guide_hand_1`],(res: Prefab) => {
				// 异步原因可能存在多次回调
				if(!fw.isValid(this.guideNode)) {
					let node = instantiate(res);
					this.guideNode = node
                    this.guideNode.scale = fw.v3(1.5, 1.5, 1.5);
					node.getComponent(guide_hand_1).playAnim();
					this.node.addChild(node);
                    this.guideNode.active = false;
				}
			});
		}
	}
	public removeGuide() {
		if(fw.isValid(this.guideNode) ) {
			this.guideNode.removeFromParent(true)
			this.guideNode = null;
		}
	}
    updateData(rewardNum: number) {
        this.m_allAni[this.m_nClickIndex].active = true;
        this.m_allTxtReward[this.m_nClickIndex].active = true;
        this.m_allIconReward[this.m_nClickIndex].active = true;
        this.m_allAni[this.m_nClickIndex].scale = fw.v3(1.1, 1.1, 1.1);

        this.getShowNum(rewardNum);

        this.m_allIconReward.forEach((icon,index)=>{
            let iconIndex = this.getIconIndex((<any>this).tbReward, (<any>this).showReward[index]);
            // fw.print("iconIndex",iconIndex);
            if (iconIndex >= 0) {
                let tpath = `ui/siginborad/anim/fanpai/img/lc_icon0${iconIndex+1}/spriteFrame`;
                icon.loadBundleRes(fw.BundleConfig.Siginborad.res[tpath],(res: SpriteFrame) => {
                    icon.obtainComponent(Sprite).spriteFrame = res;
                });
            }
            this.m_allTxtReward[index].string = String((<any>this).showReward[index]/DF_RATE);
        })

        Tween.stopAllByTarget(this.Items.btn_common);
        tween(this.Items.btn_common)
            .delay(1.0)
            .call(() => {
                this.m_allTxtReward.forEach((pLabel)=>{
                    pLabel.active = true;
                })
                this.m_allIconReward.forEach((pIcon)=>{
                    pIcon.active = true;
                })
                this.m_allBtn.forEach((btn)=>{
                    let tpath = "ui/siginborad/anim/fanpai/img/FP_zhengmian/spriteFrame"
                    btn.loadBundleRes(fw.BundleConfig.Siginborad.res[tpath],(res: SpriteFrame) => {
                        btn.obtainComponent(Sprite).spriteFrame = res;
                    });
                })
                this.m_bFinish = true;
                this.Items.btn_common.active = true;
                this.Items.txtClickTips.active = false;
            })
            .start();
    }
    getShowNum(rewardNum: number) {
        let _max = this.m_DrawData.drawMax
        let numMap = [
            {min:300, max:1000},
            {min:600, max:1500},
            {min:1200, max:2500},
            {min:Math.ceil(_max*0.7), max:_max},
        ]
        let tbReward: number[] = [];
        numMap.forEach((num)=>{
            tbReward.push(randomRangeInt(num.min, num.max));
        })
        let showReward: number[] = [];
        tbReward.forEach((num)=>{
            showReward.push(num);
        })
        for (let index = 0; index < showReward.length; index++) {
            let index1 = randomRangeInt(0, showReward.length);
            let index2 = randomRangeInt(0, showReward.length);
            let _temp = showReward[index1];
            showReward[index1] = showReward[index2];
            showReward[index2] = _temp;
        }
        tbReward.push(rewardNum);
        tbReward.sort((a, b) => {//从小到大
            return a - b;
        })
        showReward.splice(this.m_nClickIndex, 0, rewardNum);
        (<any>this).tbReward = tbReward;
        (<any>this).showReward = showReward;
        // fw.print(tbReward)
        // fw.print(showReward)
    }
    getIconIndex(tbData: number[], num: number) {
        let _index = -1;
        tbData.forEach((v, index)=>{
            if (v == num) {
                _index = index;
            }
        })
        return _index;
    }

}
