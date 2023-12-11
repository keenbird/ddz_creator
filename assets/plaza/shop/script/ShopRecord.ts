import { Label, ScrollView, Sprite, Node as ccNode, _decorator, color } from 'cc';
const { ccclass } = _decorator;

import { ACTOR } from '../../../app/config/cmd/ActorCMD';
import { httpConfig } from '../../../app/config/HttpConfig';
import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
import { DF_SYMBOL, GrayColor, ScreenOrientationType } from '../../../app/config/ConstantConfig';

@ccclass('ShopRecord')
export class ShopRecord extends FWDialogViewBase {
    /**是否具有横竖屏切换功能（意思是当前界面会调整 “横竖屏” 状态），如果界面设计没有适配横竖屏，那么应该设置该属性为true，并调整_nScreenOrientation值为当前界面设计方向 */
    bHaveScreenOrientation: boolean = true
    /**调整屏幕方向 */
    _nScreenOrientation: ScreenOrientationType = ScreenOrientationType.Vertical_false
    lastInfoList: any
    initData() {
        let url = httpConfig.path_pay + "User/getUserPayLog";
        let params = {
            user_id: center.user.getActorProp(ACTOR.ACTOR_PROP_DBID),
            timestamp: app.func.time(),
        };
        app.http.post(
            {
                url: url,
                params: params,
                valideTarget: this.node,
                callback: function (bSuccess, content) {
                    if (bSuccess) {
                        let result = content;
                        if (result) {
                            if (result.status == 1) {
                                this.valideTarget.obtainComponent(ShopRecord).updateView(result.data);
                            }
                        }
                    }
                },
            }
        );
    }
    initView() {
        //标题
        this.Items.Text_record.obtainComponent(Label).string = fw.language.get("Record");
        this.Items.Text_id_title.obtainComponent(Label).string = fw.language.get("Recharge ID");
        this.Items.Text_amount_title.obtainComponent(Label).string = fw.language.get("Recharge Amount");
        //玩家ID
        this.Items.Text_userId.obtainComponent(Label).string = `(ID ${center.user.getUserID()})`;
        //隐藏部分界面
        this.Items.Panel_item.active = false;
    }
    updateView(infoList: any) {
        infoList = infoList ?? {};
        this.lastInfoList = infoList;
        let tempInfoList = app.func.clone(infoList);
        tempInfoList.sort((a, b) => {
            return parseInt(a.order_id) - parseInt(a.order_id);
        });
        //移除原有元素
        let content = this.Items.ScrollView.obtainComponent(ScrollView).content;
        content.removeAllChildren(true);
        for (let k = 0; k < tempInfoList.length; k++) {
            let item = this.Items.Panel_item.clone();
            content.addChild(item);
            item.active = true;
            ShopRecord.updateOne(item, tempInfoList[k]);
        }
    }
    /**刷新单个 */
    static updateOne(item: ccNode, v: any) {
        //状态信息
        let statusInfo = [
            { txt: fw.language.get("Processing"), color: color(0xff, 0x9e, 0x47) },
            { txt: fw.language.get("Successed"), color: color(0x2f, 0xd4, 0x5a) },
            { txt: fw.language.get("Failed"), color: color(0xff, 0x64, 0x6c) },
        ];
        //金额
        item.Items.Text_amount.obtainComponent(Label).string = DF_SYMBOL + `${v.amount}`;
        //id
        item.Items.Text_id.obtainComponent(Label).string = v.order_id;
        //支付方式
        item.Items.Text_pay_name.obtainComponent(Label).string = v.payname || "";
        //时间
        let strTime = String(v.ctime).replace('|', '\n');
        item.Items.Text_time.obtainComponent(Label).string = strTime;
        //状态
        item.Items.Text_state.obtainComponent(Label).string = statusInfo[v.status].txt;
        item.Items.Image_state.obtainComponent(Sprite).color = statusInfo[v.status].color;
        //帮助
        if (item.Items.Label_ex) {
            let label = item.Items.Label_ex.getComponent(Label);
            label.unscheduleAllCallbacks();
            if (v.status == 0) {
                let nDiffTime = 24 * 60 * 60 - (app.func.time() - app.func.timestamp(v.ctime.replace(`|`, ` `)) / 1000);
                if (nDiffTime > 0) {
                    let update = (dt: number) => {
                        nDiffTime -= dt;
                        const h = Math.max(Math.floor(nDiffTime / 60 / 60), 0);
						const m = Math.max(Math.floor((nDiffTime - h * 60 * 60) / 60), 0);
						const s = Math.max(Math.floor(nDiffTime % 60), 0);
                        label.string = `${app.func.formatNumberForZore(h)}:${app.func.formatNumberForZore(m)}:${app.func.formatNumberForZore(s)}`;
                        if (nDiffTime < -0.2) {
                            label.unscheduleAllCallbacks();
                            label.string = ``;
                        }
                    }
                    label.unscheduleAllCallbacks();
                    label.schedule(update);
                    update(0);
                } else {
                    label.string = ``;
                }
            } else if (v.status == 1) {
                label.string = ``;
            } else {
                //是否是缓存界面
                const oldData = JSON.safeParse(app.file.getStringFromUserFile({
                    filePath: `feedback/shop${v.order_id}`,
                }));
                if (oldData) {
                    label.string = ({
                        [fw.LanguageType.en]: `Still have questions?`,
                        [fw.LanguageType.brasil]: `Ainda tem perguntas?`,
                    })[fw.language.languageType];
                    label.color = GrayColor;
                } else {
                    label.string = ({
                        [fw.LanguageType.en]: `Question about this order?`,
                        [fw.LanguageType.brasil]: `Pergunta sobre este pedido?`,
                    })[fw.language.languageType];

                    label.color = app.func.color(`#000000`);
                }
                item.Items.Label_ex.onClick(() => {
                    app.popup.showDialog({
                        viewConfig: fw.BundleConfig.plaza.res[`shop/shop_record_feedback`],
                        data: {
                            recordData: v,
                        },
                    });
                });
            }
            if (!(<any>item).bBindShopFeedbackSuccessed) {
                (<any>item).bBindShopFeedbackSuccessed = true;
                item.bindEvent({
                    eventName: `ShopFeedbackSuccessed`,
                    callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam) => {
                        const data: ShopRecordData = arg1.data;
                        if (data && data.order_id == v.order_id) {
                            label.string = ({
                                [fw.LanguageType.en]: `Still have questions?`,
                                [fw.LanguageType.brasil]: `Ainda tem perguntas?`,
                            })[fw.language.languageType];
                            label.color = GrayColor;
                        }
                    }
                });
            }
        }
    }
}

declare global {
    namespace globalThis {
        interface ShopRecordData {
            /**订单号 */
            order_id?: string
            /**金额 */
            amount?: string
            /**支付名称 */
            payname?: string
            /**时间（格式化后的时间） */
            ctime?: string
            /**时间（时间戳） */
            ptime?: string
            /**状态 */
            status?: string
        }
    }
}
