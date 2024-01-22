 import { _decorator, Label, v3, Sprite, color, UITransform, view, Node as ccNode, Event, BufferAsset, Asset, assetManager, Graphics, Vec2, Vec3, Color, size, tween, TweenAction, SetAction, delayTime, instantiate, Camera, SpriteFrame, RenderTexture } from 'cc';
const { ccclass, executeInEditMode, property } = _decorator;
import { EDITOR } from 'cc/env';

import { servers, servers_default } from '../../../app/config/HttpConfig';
import { FWSpine } from '../../../app/framework/extensions/FWSpine';
import { FWTween } from '../../../app/framework/extensions/FWTween';

@ccclass('selectServer')
export class selectServer extends fw.FWComponent {
    initView() {
        if (app.func.isWin32()) {
            window.test = this;
        }
    }
    @fw.Decorator.IntervalExecution(0.2, (nLeftTime: number) => {
        app.popup.showToast(`${nLeftTime}秒后重试！`);
    })
    test() {
        let camera1 = app.Items[`Camera-001`].getComponent(Camera);
        camera1.screenScale = 0.1;

        let camera = app.Items[`Camera`].getComponent(Camera);
        const renderTex = new RenderTexture();
        renderTex.reset(Object.assign({}, { width: app.winSize.width / 4, height: app.winSize.height / 4 }));
        camera.targetTexture = renderTex;

        let s = new SpriteFrame();
        s.texture = renderTex;
        app.Items[`Sprite`].getComponent(Sprite).spriteFrame = s;

        app.Items[`Sprite`].active = false;
        app.Items[`Sprite`].active = true;
    }
    start() {
        if (!EDITOR) {
            this.Items.Node_item.active = false;
            //win32下可选服
            if (fw.DEBUG.bSelectServer || app.func.isWin32()) {
                //添加server
                let childs = this.Items.content.children;
                servers.forEach((element, index) => {
                    let item = childs[index];
                    if (!item) {
                        item = this.Items.Node_item.clone();
                        this.Items.content.addChild(item);
                    }
                    item.active = true;
                    item.setPosition(v3());
                    item.onClickAndScale(() => {
                        center.login.selectServer(element);
                    });
                    item.Items.Label_name.getComponent(Label).string = element.Name;
                    item.Items.Label_ip.getComponent(Label).string = element.url_login;
                    item.getComponent(Sprite).color = index % 2 == 0 && color(255, 255, 0) || color(255, 0, 0);
                });
                //上一次的结果
                let lastElementStr = app.file.getStringForKey("LastSelectServer", "", { all: true });
                if (lastElementStr) {
                    let lastElement = JSON.safeParse(lastElementStr);
                    if (lastElement) {
                        let last = this.Items.Node_item.clone();
                        this.node.addChild(last);
                        last.active = true;
                        let pos = this.Items.content.getWorldPosition();
                        pos.y = view.getDesignResolutionSize().height / 2;
                        pos.x = pos.x + this.Items.content.getComponent(UITransform).width / 2 + last.getComponent(UITransform).width / 2;
                        last.setWorldPosition(v3(pos));
                        last.onClickAndScale(() => {
                            center.login.selectServer(lastElement);
                        });
                        last.getComponent(Sprite).color = color(0, 255, 255);
                        last.Items.Label_name.getComponent(Label).string = lastElement.Name;
                        last.Items.Label_ip.getComponent(Label).string = lastElement.url_login;
                    }
                }
            } else {
                //使用默认服
                center.login.selectServer(servers_default);
            }
            app.func.reduceDrawCall(this.Items.content);
        }
    }
    initEvents() {
        if (!EDITOR) {
            //监听空格键，自动进入上一次选择的服务器
            this.bindEvent({
                once: true,
                eventName: app.event.CommonEvent.Keyboard,
                callback: (data) => {
                    if (data.eventData.keyCode == app.event.CommonKey.Space) {
                        let lastElementStr = app.file.getStringForKey("LastSelectServer", "", { all: true });
                        if (lastElementStr) {
                            let serverConfig = JSON.safeParse(lastElementStr);
                            if (serverConfig) {
                                center.login.selectServer(serverConfig);
                            }
                        } else {
                            app.popup.showToast({ text: `未找到上一次选服配置` });
                        }
                    } else {
                        return true;
                    }
                }
            });
        }
    }
}
