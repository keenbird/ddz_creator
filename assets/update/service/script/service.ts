import { EditBox, ImageAsset, Label, Overflow, ScrollView, Sprite, SpriteFrame, Texture2D, UITransform, _decorator, Node as ccNode, size } from 'cc';
const { ccclass } = _decorator;

import { FWDialogViewBase } from '../../../app/framework/view/popup/FWDialogViewBase';
import { FeedbackType } from '../../../app/config/ConstantConfig';
import { httpConfig } from '../../../app/config/HttpConfig';

@ccclass('service')
export class service extends FWDialogViewBase {
    /**文件 */
    file: any
    /**图片路径 */
    filePath: string
    /**聊天列表 */
    list: FeedbackChatParam[]
    emergencyInfo: any;
    protected initData() {
        this.emergencyInfo = center.user.getServiceEmergencyInfo();
    }
    protected initEvents(): boolean | void {
        this.bindEvent({
            eventName: `CameraPicture`,
            callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam) => {
                this.updateContentImage(arg1.data);
            }
        });
    }
    protected initView(): boolean | void {
        //隐藏部分界面
        this.Items.item_self.active = false;
        this.Items.item_other.active = false;
        this.Items.Node_menu_item.active = false;
        //调整标题
        this.changeTitle({
            title: fw.language.get("Specialty Support"),
        });
        this.Items.Label_emergency.string = fw.language.get("emergency service");
        this.Items.Sprite_send.Items.Label_send.string = fw.language.get("Send");
        this.Items.EditBox_email.Items.PLACEHOLDER_LABEL.string = fw.language.get("Your email");
        this.Items.EditBox_phone.Items.PLACEHOLDER_LABEL.string = fw.language.get("Your phone");
        this.Items.EditBox_describe.Items.PLACEHOLDER_LABEL.string = fw.language.get("Please enter");
        //刷新菜单
        this.updateMenu();
        //初始化界面
        this.updateFAQ();
        this.updateFeedback();
        this.updateEmergency();
    }
    protected initBtns(): boolean | void {
        //发送
        this.Items.Sprite_send.onClickAndScale(this.onClickSend.bind(this));
        //图片选择
        this.Items.Sprite_texture.onClickAndScale(this.onClickSelect.bind(this));
        //紧急客服
        this.Items.Sprite_emergency.onClickAndScale(this.emergency.bind(this));
    }
    updateMenu() {
        //清理菜单
        let btns = [];
        this.Items.content.removeAllChildren(true);
        let emailList = [
            {
                title: fw.language.get("FAQ"),
                callback: () => {
                    this.onClickMenu(this.Items.Node_FAQ);
                }
            },
            {
                title: fw.language.get("Feedback"),
                callback: () => {
                    this.onClickMenu(this.Items.Node_Feedback);
                    //滑动到底部
                    if (this.Items.content_Feedback.size.height > this.Items.Node_Feedback.Items.ScrollView.size.height) {
                        this.Items.Node_Feedback.Items.ScrollView.getComponent(ScrollView).scrollToBottom();
                    }
                }
            },
        ];
        let lastNode: ccNode = null;
        emailList.forEach(element => {
            let btn = {
                node: this.Items.Node_menu_item.clone(),
                text: element.title,
                data: element,
                callback: () => {
                    element.callback?.();
                }
            }
            this.Items.content.addChild(btn.node);
            btn.node.active = true;
            lastNode = btn.node;
            btns.push(btn);
        });
        //隐藏最后一根线
        if (lastNode) {
            lastNode.Items.Sprite_line.active = false;
        }
        //创建菜单
        app.func.createMenu({
            mountObject: this,
            btns: btns,
        });
    }
    /**点击菜单按钮 */
    onClickMenu(node: ccNode) {
        if (fw.isValid(node)) {
            this.Items.Node_content.children.forEach(element => {
                if (element != node) {
                    element.active = false;
                }
            });
            node.active = true;
        }
    }
    /**刷新FAQ界面 */
    updateFAQ() {
        let index = 0;
        let childs = this.Items.content_FAQ.children;

        let question_en = [
            {
                title: `1.Unable to receive verification code.`,
                content: `If you don't receive OTP now, please try again later. \nYou can use guest or Facebook to login the game.\nIf you still can't receive the OTP, please send your \nmobile phone number to customer service.`
            },
            {
                title: `2.Can't log in to the game?`,
                content: `Please log out of the game and try to log in again.\nAt the same time, please check your network and try \nto log in again.If you have been unable to log in, \nplease send a screenshot to us via customer service.`
            },
            {
                title: `3.Can't log in with Facebook?`,
                content: `Facebook can't log in, please log in with the bound\nmobile number.\nPlease let us know about this so we can resolve it.`
            },
        ]
        let question_brasil = [
            {
                title: `1.Não é possível receber o código de verificação.`,
                content: `Se você não receber um código de verificação agora,\ntente novamente mais tarde.Você pode fazer login no \njogo usando o modo Visitante ou Facebook primeiro.\nSe você ainda não conseguir receber o código de \nverificação, entre em contato conosco.`
            },
            {
                title: `2.Não consegue fazer login no jogo?`,
                content: `Por favor,faça logout do jogo e tente fazer login novamente.\nEnquanto isso, verifique sua conexão de internet \ne tente fazer login novamente.Se ainda não conseguir \nfazer login, por favor, nos envie um screenshot através \ndo Feedback.`
            },
            {
                title: `3.Não é possível fazer login com o Facebook?`,
                content: `Não é possível fazer login com o Facebook. Por favor, \nfaça login com o número de celular vinculado. Por favor, \nnos informe sobre isso para que possamos resolvê-lo. `
            },
        ]
        let question = {
            [fw.LanguageType.en]: question_en,
            [fw.LanguageType.brasil]: question_brasil,
        }[fw.language.languageType];
        question.forEach(element => {
            let item = childs[index];
            if (!item) {
                item = this.Items.Node_FAQ.Items.item.clone();
                item.parent = this.Items.content_FAQ;
            }
            if (!item.Items.Sprite_item_bg.__callback) {
                item.Items.Sprite_item_bg.onClick(() => {
                    item.Items.Label_item_content.active = !item.Items.Label_item_content.active;
                    item.Items.Sprite_state.angle = item.Items.Label_item_content.active ? -90 : 0;
                });
            }
            item.active = true;
            item.Items.Label_item_content.active = false;
            item.Items.Label_item_title.string = element.title;
            item.Items.Label_item_content.string = element.content;
            ++index;
        });
        for (let i = index, j = childs.length; i < j; ++i) {
            childs[i].active = false;
        }
    }
    /**刷新Feedback界面 */
    updateFeedback() {
        let log = app.file.getStringFromUserFile({ filePath: `feedback/log`, });
        if (log) {
            this.list = JSON.safeParse(log);
        }
        this.list ??= [
            {
                type: IDType.System,
                content: fw.language.get("If you encounter login problems,\nplease leave a message."),
                time: app.func.time(),
            },
        ];
        this.list.forEach(element => {
            this.addOneChat(element);
        });
    }
    /**刷新Emergency按鈕 */
    updateEmergency() {
        this.Items.Sprite_emergency.active = false;
        if (!this.emergencyInfo) {
            this.getEmergencyInfo();
        } else if (this.emergencyInfo.show_emergency > 0) {
            this.setEmergencyVisible(this.emergencyInfo.show_emergency);
        }
    }
    /**添加一次交流 */
    addOneChat(element: FeedbackChatParam) {
        let item = this.Items.Node_Feedback.Items[element.type == IDType.System ? `item_other` : `item_self`].clone();
        item.parent = this.Items.content_Feedback;
        item.active = true;
        //文本内容
        item.Items.Label_content.string = element.content;
        //校验大小
        let t = item.Items.Label_content.clone();
        let l = t.getComponent(Label);
        l.overflow = Overflow.NONE;
        l.updateRenderData(true);
        if (item.Items.Label_content.size.width > t.size.width) {
            let bSize = item.Items.Sprite_content_bg.size;
            //这里+的数值需要结合UI进行调整
            bSize.width = t.size.width + 20;
            item.Items.Sprite_content_bg.size = bSize;
            //调整Label的模式
            item.Items.Label_content.getComponent(Label).overflow = Label.Overflow.NONE;
        }
        t.destroy();
        //图片
        if (element.filePath) {
            let node = new ccNode();
            let sprite = node.addComponent(Sprite);
            node.parent = item.Items.Sprite_content_bg;
            if (element.type == IDType.System) {
                node.obtainComponent(UITransform).setAnchorPoint(fw.v2(0, 1));
                node.setPosition(fw.v3(10, 0, 0));
            } else {
                node.obtainComponent(UITransform).setAnchorPoint(fw.v2(1, 1));
                node.setPosition(fw.v3(-10, 0, 0));
            }
            if (app.file.isFileExist(element.filePath) && !app.file.isDirectoryExist(element.filePath)) {
                app.assetManager.loadRemote<ImageAsset>({
                    url: element.filePath,
                    bCleanCache: true,
                    option: { ext: `.png` },
                    callback: (imageAsset) => {
                        node.setSpriteFrameByImageAsset(imageAsset);
                        //调整尺寸
                        let nMaxWidth = 450;
                        if (node.size.width > nMaxWidth) {
                            sprite.sizeMode = Sprite.SizeMode.CUSTOM;
                            node.size = size(nMaxWidth, node.size.height * nMaxWidth / node.size.width);
                        }
                        //调整尺寸
                        if (node.size.width > item.Items.Sprite_content_bg.size.width) {
                            let bSize = item.Items.Sprite_content_bg.size;
                            //这里+的数值需要结合UI进行调整
                            bSize.width = node.size.width + 20;
                            item.Items.Sprite_content_bg.size = bSize;
                        }
                        //滑动到底部
                        if (this.Items.content_Feedback.size.height > this.Items.Node_Feedback.Items.ScrollView.size.height) {
                            this.Items.Node_Feedback.Items.ScrollView.getComponent(ScrollView).scrollToBottom();
                        }
                    }
                });
            }
        }
        //时间
        item.Items.Label_time.string = app.func.time_HM(element.time);
        //滑动到底部
        if (this.Items.content_Feedback.size.height > this.Items.Node_Feedback.Items.ScrollView.size.height) {
            this.Items.Node_Feedback.Items.ScrollView.getComponent(ScrollView).scrollToBottom();
        }
    }
    /**调整图片 */
    updateContentImage(path: string | SpriteFrame) {
        let node = this.Items.Sprite_texture;
        if (typeof (path) == `string`) {
            if (app.file.isFileExist(path) && !app.file.isDirectoryExist(path)) {
                app.assetManager.loadRemote<ImageAsset>({
					url: path,
					bCleanCache: true,
					callback: (imageAsset) => {
						node.setSpriteFrameByImageAsset(imageAsset);
					}
				});
            }
        } else {
            //调整显示
            node.getComponent(Sprite).spriteFrame = path;
        }
    }
    /**选择图片 */
    onClickSelect() {
        if (app.func.isBrowser()) {
            app.file.openSelectFile({
                type: app.file.READ_FILE_TYPE.Data_Url,
                callback: (content: string, file: File) => {
                    this.file = file;
                    app.func.base64ToSpriteFrame(content, (spriteFrame) => {
                        this.updateContentImage(spriteFrame);
                    });
                }
            });
        } else {
            if (app.native.device.hasPermissions(`android.permission.READ_EXTERNAL_STORAGE`)) {
                this.filePath = `${app.file.getUserWritablePath()}/feedback/feedback_texture.png`;
                app.native.device.pickFromGallery(this.filePath);
            } else {
                app.native.device.requestPermissions(`Request permission to read external files`, 1, `android.permission.READ_EXTERNAL_STORAGE`);
            }
        }
    }
    /**发送 */
    onClickSend() {
        let content = this.Items.EditBox_describe.Items.TEXT_LABEL.string;
        if (content == ``) {
            app.popup.showToast(`describe is none`);
            return;
        }
        let email = this.Items.EditBox_email.Items.TEXT_LABEL.string;
        if (email == ``) {
            app.popup.showToast(`email is none`);
            return;
        }
        let phone = this.Items.EditBox_phone.Items.TEXT_LABEL.string;
        if (phone == ``) {
            app.popup.showToast(`phone is none`);
            return;
        }
        let element = {
            type: IDType.User,
            content: content,
            filePath: this.filePath,
            time: app.func.time(),
        }
        this.list.push(element);
        this.addOneChat(element);
        app.file.writeStringToUserFile({
            filePath: `feedback/log`,
            fileData: JSON.stringify(this.list),
        });
        app.interface.uploadFeedback({
            email,
            phone,
            content,
            file: this.file,
            filePath: this.filePath,
            feedbackType: FeedbackType.Login,
            callback: (response) => {
                this.Items.EditBox_email.getComponent(EditBox).string = ``;
                this.Items.EditBox_phone.getComponent(EditBox).string = ``;
                this.Items.EditBox_describe.getComponent(EditBox).string = ``;
                let element = {
                    type: IDType.System,
                    content: response.info,
                    time: app.func.time(),
                }
                this.list.push(element);
                this.addOneChat(element);
                app.file.writeStringToUserFile({
                    filePath: `feedback/log`,
                    fileData: JSON.stringify(this.list),
                });
            }
        });
    }
    emergency() {
        if (this.emergencyInfo) {
            if (this.emergencyInfo.show_emergency == 1) {
                app.popup.showDialog({
                    viewConfig: fw.BundleConfig.plaza.res[`help/dialog_service_emergency`],
                    callback: (view, data) => {
                        (<plaza_ServiceEmergency>(view.getComponent(`ServiceEmergency`))).data = { info: this.emergencyInfo };
                    },
                });
            } else if (this.emergencyInfo.show_emergency == 2) {
                app.sdk.emergency();
            }
        } else {
            this.getEmergencyInfo();
        }
    }
    getEmergencyInfo() {
        let params: any = {
            channel: app.native.device.getOperatorsID(),
            timestamp: app.func.time(),
        }
        params.sign = app.http.getSign(params);
        try {
            app.http.post({
                url: httpConfig.path_pay + "hall/emergencyService",
                params: params,
                callback: (bSuccess, response) => {
                    if (bSuccess) {
                        if (!fw.isNull(response)) {
                            if (1 == response.status) {
                                // 缓存活动数据
                                if (!fw.isNull(response.data)) {
                                    this.emergencyInfo = {};
                                    this.emergencyInfo.custom_url = response.data.custom_url;
                                    this.emergencyInfo.show_emergency = Number(response.data.show_emergency);
                                    this.emergencyInfo.emergency_context = response.data.emergency_context;
                                    center.user.setServiceEmergencyInfo(this.emergencyInfo);
                                    if (this.setEmergencyVisible && this.Items && fw.isValid(this.Items.Node_FAQ)) {
                                        this.setEmergencyVisible(this.emergencyInfo.show_emergency);
                                    }
                                }
                            }
                        }
                    } else {
                        fw.print("get getEmergencyInfo failed!");
                    }
                }
            });
        } catch (e) {
            fw.printError(e);
        }
    }
    setEmergencyVisible(status: number) {
        this.Items.Sprite_emergency.active = (status != 0);
    }
}

/**身份类型 */
enum IDType {
    /**系统 */
    System,
    /**玩家 */
    User,
}

/**
 * 类型声明调整
 */
declare global {
    namespace globalThis {
        /**反馈参数 */
        type FeedbackChatParam = {
            /**身份 */
            type: IDType
            /**内容 */
            content: string
            /**图片 */
            filePath?: string
            /**时间 */
            time: number | string
        }
    }
}

