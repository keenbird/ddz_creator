import { instantiate, Label, Prefab, sp, Tween, tween, UITransform, Vec3, view, _decorator } from 'cc';
import { DF_RATE, DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { EVENT_ID } from '../../../app/config/EventConfig';
import { guide_hand_1 } from '../../../resources/ui/guide/script/guide_hand_1';
const { ccclass } = _decorator;

@ccclass('NodeTurntable')
export class NodeTurntable extends (fw.FWComponent) {
    m_Count: number;
    m_Index: number;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    m_Items: any[];
    m_Data: any;
    m_isTouchClose: boolean;
    m_HandAni: any;
    m_LaganAni: any;
    initData() {

    }
    initEvents() {
        this.bindEvent({
            eventName: [
                EVENT_ID.EVENT_TEN_DAY_TASK_RUN_TURNTABLE,
            ],
            callback: (arg1, arg2) => {
                this.setData(center.task.getTenDayTurnTableRewards())
                this.m_Index = -1
                if (0 < arg1.dict.coins) {
                    for (let i = 0; i < this.m_Data.length; i++) {
                        if (arg1.dict.coins == this.m_Data[i]) {
                            this.m_Index = i
                            break
                        }
                    }
                }
                this.m_LaganAni.setAnimation(0, "lagan_idle", false)
                this.runTurnTableAni(this.m_Index, arg1.dict.callback)
                let ttaskdata = center.task.getTenDayTaskData()
                this.loadHandTips()
            }
        });
        this.bindEvent({
            eventName: [
                EVENT_ID.EVENT_TEN_DAY_TASK_SHOW_TURNTABLE,
            ],
            callback: (arg1, arg2) => {
                this.m_LaganAni.setAnimation(0, "lagan_idle", false)
                this.setData(center.task.getTenDayTurnTableRewards())
                this.m_isTouchClose = true
                this.node.active = true
                // fw.print(this.m_Data)
                this.runTurnTableAni(-1, arg1.dict.callback)
                this.loadHandTips()
            }
        });
    }
    initView() {
        let m_animate = this.Items.anim_deng.obtainComponent(sp.Skeleton).setAnimation(0, "deng", true);
        this.m_LaganAni = this.Items.anim_lagan.obtainComponent(sp.Skeleton)
        this.m_LaganAni.setAnimation(0, "lagan_idle", true)

        this.loadHandTips()

        this.Items.Panel_bg.getComponent(UITransform).setContentSize(view.getVisibleSize().width, view.getVisibleSize().height)
        this.m_Count = -1
        this.m_Index = -1
        this.Items.Panel_item.active = false
        let tsize = this.Items.Panel_turntable_Mask.getComponent(UITransform).size
        let tsize1 = this.Items.Panel_item.getComponent(UITransform).size
        this.startX = tsize.width / 2
        this.startY = (2 * tsize1.height)
        this.endX = tsize.width / 2
        this.endY = -2 * (tsize1.height)
        this.m_Items = []
        for (let index = 1; index <= 4; index++) {
            let titem = this.Items.Panel_item.clone()
            titem.active = false
            this.m_Items.push(titem)
            this.Items.Panel_turntable_Mask.addChild(titem)
            titem.setPosition(this.startX, this.startY - (4 - index) * tsize1.height)
        }
    }
    initBtns() {
        this.Items.Panel_bg.onClickAndScale(() => {
            this.onSpaceClick();
        })
        this.Items.Panel_lagan.onClick(() => {
            this.onLaGanClick();
        })
    }
    showHandTips() {
        let ttaskdata = center.task.getTenDayTaskData()
        if (this.m_HandAni) {
            if (3 <= ttaskdata.finish_tentask_count) {
                this.m_HandAni.active = true
            } else {
                this.m_HandAni.active = false
            }
        }
    }
    loadHandTips() {
        if (this.m_HandAni) {
            this.showHandTips()
        } else {
            this.Items.Panel_lagan.loadBundleRes(fw.BundleConfig.resources.res[`ui/guide/guide_hand_1`],(res: Prefab) => {
                this.m_HandAni = instantiate(res);
                this.Items.Panel_lagan.addChild(this.m_HandAni);
                this.m_HandAni.getComponent(guide_hand_1).playAnim();
                this.m_HandAni.active = false;
                this.m_HandAni.setPosition(30, 80)
                this.showHandTips()
            });
        }   
    }
    getData() {
        return this.m_Data
    }
    setData(data_) {
        let tindex, tdata
        for (let i = 0; i < data_.length; i++) {
            tindex = app.func.getRandomNum(1, data_.length - 1)
            tdata = data_[i]
            data_[i] = data_[tindex]
            data_[tindex] = tdata
        }
        this.m_Data = data_
        this.m_Count = -1
        this.m_Index = -1
        let tsize = this.Items.Panel_turntable_Mask.getComponent(UITransform).size
        let tsize1 = this.Items.Panel_item.getComponent(UITransform).size
        this.startX = tsize.width / 2
        this.startY = (2 * tsize1.height)
        this.endX = tsize.width / 2
        this.endY = -2 * (tsize1.height)
        for (let i = 0; i < 4; i++) {
            this.m_Count = this.m_Count + 1
            this.m_Index = this.m_Index + 1
            if (this.m_Count > this.m_Data.length - 1) {
                this.m_Count = 0
            }
            this.m_Items[i].setPosition(this.startX, this.startY - (4 - i - 1) * tsize1.height)
            this.m_Items[i].Items.Text_num.getComponent(Label).string = DF_SYMBOL + this.m_Data[this.m_Count] / DF_RATE
            this.m_Items[i].active = true
            Tween.stopAllByTarget(this.m_Items[i])
        }
    }
    initTurnTable() {
        this.m_isTouchClose = true
        this.m_Count = -1
        this.m_Index = -1
        let tsize = this.Items.Panel_turntable_Mask.getComponent(UITransform).size
        let tsize1 = this.Items.Panel_item.getComponent(UITransform).size
        this.startX = tsize.width / 2
        this.startY = (2 * tsize1.height)
        this.endX = tsize.width / 2
        this.endY = -2 * (tsize1.height)
        for (let i = 0; i < 4; i++) {
            this.m_Count = this.m_Count + 1
            this.m_Index = this.m_Index + 1
            if (this.m_Count > this.m_Data.length - 1) {
                this.m_Count = 0
            }
            this.m_Items[i].setPosition(this.startX, this.startY - (4 - i - 1) * tsize1.height)
            this.m_Items[i].Items.Text_num.getComponent(Label).string = DF_SYMBOL + this.m_Data[this.m_Count] / DF_RATE
        }
    }
    runTurnTableAni(index_, callback_) {
        this.node.active = true
        if (-1 == index_ || null == index_) {
            this.m_isTouchClose = true
        } else {
            this.m_isTouchClose = false
        }

        this.m_Count = -1
        this.m_Index = 0
        let tsize = this.Items.Panel_turntable_Mask.getComponent(UITransform).size
        let tsize1 = this.Items.Panel_item.getComponent(UITransform).size
        this.startX = tsize.width / 2
        this.startY = (2 * tsize1.height)
        this.endX = tsize.width / 2
        this.endY = -2 * (tsize1.height)

        if (-1 >= index_) {
            // return
        }

        let trandom = app.func.getRandomNum(1, 2)
        // trandom = 1
        for (let i = 0; i < 4; i++) {
            let v = 1000
            if (this.m_isTouchClose) {
                v = 100
            }
            let myFunc = () => {
                tween(this.m_Items[i])
                    .to(Math.abs(this.m_Items[i].getPosition().y - this.endY) / v, { position: new Vec3(this.endX, this.endY, 0) }, { easing: 'linear' })
                    .call(() => {
                        // fw.print("uoiuwieuroiuripiwpoiwrweirpoipoipopoipi", this.m_Index, trandom * this.m_Data.length + index_ + 1)
                        if (this.m_Index - 1  != trandom * this.m_Data.length + index_ + 1) {
                            this.m_Count = this.m_Count + 1
                            if (this.m_Count > this.m_Data.length-1) {
                                this.m_Count = 0
                            }
                            this.m_Index = this.m_Index + 1
                            this.m_Items[i].Items.Text_num.getComponent(Label).string = DF_SYMBOL + this.m_Data[this.m_Count] / DF_RATE
                            this.m_Items[i].data = this.m_Data[this.m_Count]
                            this.m_Items[i].setPosition(this.m_Items[i].getPosition().x, this.startY)
                            Tween.stopAllByTarget(this.m_Items[i])
                            myFunc()
                        } else {
                            for (let j = 0; j < 4; j++) {
                                Tween.stopAllByTarget(this.m_Items[j])
                            }
                            // --纠正坐标
                            for (let j = 0; j < 4; j++) {
                                if (this.m_Items[j].data == this.m_Data[index_]) {
                                    let tcenterH = this.Items.Panel_turntable_Mask.getComponent(UITransform).size.height / 2
                                    tcenterH = 0
                                    this.m_Items[j].setPosition(this.m_Items[j].getPosition().x, tcenterH)
                                    if (0 == j) {
                                        this.m_Items[2].setPosition(this.m_Items[2].getPosition().x, tcenterH + 2 * tsize1.height)
                                        this.m_Items[3].setPosition(this.m_Items[3].getPosition().x, tcenterH + tsize1.height)
                                        this.m_Items[1].setPosition(this.m_Items[1].getPosition().x, tcenterH - tsize1.height)
                                    } else if (1 == j) {
                                        this.m_Items[3].setPosition(this.m_Items[3].getPosition().x, tcenterH + 2 * tsize1.height)
                                        this.m_Items[0].setPosition(this.m_Items[0].getPosition().x, tcenterH + tsize1.height)
                                        this.m_Items[2].setPosition(this.m_Items[2].getPosition().x, tcenterH - tsize1.height)
                                    } else if (2 == j) {
                                        this.m_Items[0].setPosition(this.m_Items[0].getPosition().x, tcenterH + 2 * tsize1.height)
                                        this.m_Items[3].setPosition(this.m_Items[3].getPosition().x, tcenterH + tsize1.height)
                                        this.m_Items[1].setPosition(this.m_Items[1].getPosition().x, tcenterH - tsize1.height)
                                    } else if (3 == j) {
                                        this.m_Items[1].setPosition(this.m_Items[1].getPosition().x, tcenterH + 2 * tsize1.height)
                                        this.m_Items[2].setPosition(this.m_Items[2].getPosition().x, tcenterH + tsize1.height)
                                        this.m_Items[0].setPosition(this.m_Items[0].getPosition().x, tcenterH - tsize1.height)
                                    }
                                }
                            }
                            this.Items.Panel_item.setTimeout(() => {
                                if (callback_) {
                                    callback_()
                                }
                                this.node.active = false
                                if (-1 < index_) {
                                    let path = fw.BundleConfig.plaza.res["tenDayTask/img/lc_icon_JB2/spriteFrame"]
                                    let rewards = []
                                    let goodData = {
                                        bundleResConfig: path,
                                        nGoodsNum: this.m_Data[index_] / DF_RATE,
                                    }
                                    rewards.push(goodData)
                                    let extData =  {bDontShowTitle:true}
                                    app.popup.showDialog({
                                        viewConfig: fw.BundleConfig.resources.res[`ui/reward/reward`],
                                        data: { reward: rewards, extend: extData },
                                    });
                                }
                            }, 2);
                        }
                    })
                    .start();
            }
            myFunc()
        }
    }
    onLaGanClick() {
        let tdata = center.task.getTenDayTaskData()
        if (3 > tdata.finish_tentask_count) {
            app.popup.showToast("You need to complete 3 task before you get a chance!")
            return
        }
        if (this.m_HandAni) {
            this.m_HandAni.active = false
        }
        app.audio.playEffect(fw.BundleConfig.plaza.res[`tenDayTask/audio/tenday_spin`]);
        this.m_LaganAni.setAnimation(0, "lagan_go", false)
        center.task.PLAZA_TASK_TEN_DAY_TASK_ACTIVITY_REQ(1)
    }
    onSpaceClick() {
        if (this.m_isTouchClose) {
            for (let j = 1; j < 4; j++) {
                Tween.stopAllByTarget(this.m_Items[j])
            }
            this.node.active = false
        }
    }
}
