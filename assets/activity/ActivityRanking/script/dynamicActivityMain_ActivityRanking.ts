import { ScrollView, UITransform, _decorator } from 'cc';
const { ccclass } = _decorator;

import { httpConfig } from '../../../app/config/HttpConfig';
import { DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { dynamicActivityBase } from '../../../plaza/activity/script/dynamicActivityBase';

@ccclass('dynamicActivityMain_ActivityRanking')
export class dynamicActivityMain_ActivityRanking extends dynamicActivityBase {
    /**最大页 */
    nMaxPage: number = 0
    /**当前页 */
    nCurPage: number = 0
    /**下一页 */
    nNextPage: number = this.nCurPage + 1
    protected initData(): boolean | void {
        this.getData();
    }
    protected initView(): boolean | void {
        //隐藏部分界面
        this.Items.item.active = false;
        this.Items.Node_self.active = false;
    }
    protected initEvents(): boolean | void {
        //自动拉取下一页
        let cSize = this.Items.content.size;
        let sSize = this.Items.ScrollView.size;
        let cUITransform = this.Items.content.getComponent(UITransform);
        let sUITransform = this.Items.ScrollView.getComponent(UITransform);
        this.Items.ScrollView.on(ScrollView.EventType.SCROLLING, () => {
            //正在请求
            if (this.nCurPage == this.nNextPage) {
                return;
            }
            //已经是最大页数
            if (this.nCurPage == this.nMaxPage) {
                return;
            }
            let cBottomPos = this.Items.content.worldPosition.y - cSize.height * cUITransform.anchorY;
            let sBottomPos = this.Items.ScrollView.worldPosition.y - sSize.height * sUITransform.anchorY;
            if (sBottomPos - cBottomPos < 150) {
                this.getData();
            }
        });
    }
    /**获取排行榜数据 */
    getData() {
        let activityUrlConfig = center.activity.getActivityUrlConfig(app.dynamicActivity.getDynamicActivityConfig(`ActivityRanking`));
        this.nCurPage = this.nNextPage;
        app.http.post({
            url: `${httpConfig.path_activity}ActivityApi/commonRank`,
            params: {
                user_id: center.user.getUserID(),
                act_id: activityUrlConfig.act_id ?? 7,
                timestamp: app.func.time(),
                page: this.nNextPage
            },
            callback: (bSuccess, response) => {
                if (bSuccess) {
                    //请求的页数正确
                    if (this.nCurPage == response.data.page) {
                        //调整最大页码
                        this.nMaxPage = response.data.total_page;
                        //调整下一页
                        this.nNextPage = response.data.page + 1;
                        //刷新界面
                        this.updateView(response.data);
                    }
                } else {
                    this.nCurPage = this.nNextPage - 1;
                }
            }
        });
    }
    /**刷新界面 */
    updateView(data: any) {
        //调整标题
        this.Items.Label_title.string = `${data.title ?? ``} Event Is Over`;
        //自己
        let nSelfRank = app.func.toNumber(data.user.rank);
        let bTop3 = nSelfRank <= 3;
        this.Items.Node_self.active = true;
        //排名
        this.Items.Node_self.Items.Label_rank.active = !bTop3;
        this.Items.Node_self.Items.Sprite_rank.active = bTop3;
        this.Items.Node_self.Items.Label_rank.string = `${nSelfRank}`;
        if (bTop3) {
            app.file.updateImage({
                node: this.Items.Node_self.Items.Sprite_rank,
                bundleResConfig: fw.BundleConfig.ActivityRanking.res[`ui/main/img/JS_icon${nSelfRank}`]
            });
        }
        //奖励
        this.Items.Node_self.Items.Label_reward.string = `${DF_SYMBOL}${data.user.values}`;
        //列表
        let index = 0;
        let childs = this.Items.content.children;
        if (data.list) {
            data.list.forEach(element => {
                let item = childs[index];
                if (!item) {
                    item = this.Items.item.clone();
                    item.parent = this.Items.content;
                }
                item.active = true;
                //背景
                item.Items.Sprite_bg.active = index % 2 == 0;
                //排名
                let nRank = app.func.toNumber(element.rank);
                let bTop3 = nRank <= 3;
                //排名
                item.Items.Label_rank.active = !bTop3;
                item.Items.Sprite_rank.active = bTop3;
                item.Items.Label_rank.string = `${nRank}`;
                if (bTop3) {
                    app.file.updateImage({
                        node: item.Items.Sprite_rank,
                        bundleResConfig: fw.BundleConfig.ActivityRanking.res[`ui/main/img/JS_icon${nRank}`]
                    });
                }
                //名称
                item.Items.Label_name.string = element.nickname;
                //奖励
                item.Items.Label_reward.string = `${DF_SYMBOL}${data.user.values}`;
                ++index;
            });
        }
        for (; index < childs.length; ++index) {
            childs[index].active = false;
        }
    }
}
