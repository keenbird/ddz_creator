import { Animation, Label, Sprite, Tween, UITransform, _decorator, Node as ccNode, tween,Font ,Size,v3,UIOpacity,Prefab,instantiate,sp,Texture2D,assetManager} from 'cc';
const { ccclass } = _decorator;

import { yx } from '../../../yx_Landlord';
import proto from './../../../protobuf/Landlord_format';
import { ACTOR,PROTO_ACTOR } from '../../../../../app/config/cmd/ActorCMD';
import { EVENT_ID } from '../../../../../app/config/EventConfig';
import { DF_RATE } from '../../../../../app/config/ConstantConfig';
import { FWSpine } from '../../../../../app/framework/extensions/FWSpine';
import { player_GameBase } from '../../../../GameBase/ui/main/script/player_GameBase';

@ccclass('player_Landlord')
export class player_Landlord extends player_GameBase {
    /**通过客户端位置获取当前玩家易变属性 */
    actorByClientChairID: { [nClientChairID: number]: any } = {}
    img_settlement_bg_x:[number,number,number]
    protected initView(): boolean | void {
        //初始化玩家
        this.img_settlement_bg_x = [0,0,0]
        this.initPlayer();
    }
    protected initEvents(): boolean | void {
        //玩家金币金币变更
        this.bindEvent({
            eventName: ACTOR[PROTO_ACTOR.UAT_GOLD],
            callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam) => {
                //刷新自身金币
                this.updateOnePlayer(yx.internet.nSelfChairID);
            }
        });
        //自己进入桌子
        this.bindEvent({
            eventName: EVENT_ID.EVENT_PLAY_ACTOR_SELFONTABLE,
            callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam): boolean | void => {
                //清理定时器
                this.unscheduleAllCallbacks();
                //刷新所有玩家
                this.updateAllPlayers();
            },
        });
        //其它玩家进入桌子
        this.bindEvent({
            eventName: EVENT_ID.EVENT_PLAY_ACTOR_ONTABLE,
            callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam): boolean | void => {
                this.updateOnePlayer(arg1.dict.nChairID);
            },
        });
        //离开桌子
        this.bindEvent({
            eventName: EVENT_ID.EVENT_PLAY_ACTOR_OUTTABLE,
            callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam): boolean | void => {
                this.updateOnePlayer(arg1.dict.nChairID);
            },
        });
        
    }
    initPlayer() {
        //默认隐藏所有玩家
        for (let i = 0; i < yx.internet.nMaxPlayerCount; ++i) {
            var SettlementBg =this.getSettlementBgByChair(i)
            if(!fw.isNull(SettlementBg)){
                this.img_settlement_bg_x[i] = SettlementBg.getPosition().x
            }
            const player = this.Items[`node_player_${i}`];
            if (player) {
                player.active = false;
                player.Items.btn_open_userinfo.onClickAndScale(() => {
                    //自己不处理
                    if (i == yx.func.getClientChairIDByServerChairID(yx.internet.nSelfChairID)) {
                        return;
                    }
                    //存在玩家时处理
                    let playerInfo = this.actorByClientChairID[i];
                    if (!playerInfo) {
                        return;
                    }
                    this.showEmojiView({ nUserID: playerInfo[ACTOR.ACTOR_PROP_DBID] });
                    
                    
                });
            }
        }
        //刷新所有玩家
        this.updateAllPlayers();
    }
    clearOneGame() {
        //隐藏所有流水表现
        this.setSettlementScoreVisible(null, false);
        //隐藏所有玩家叫牌状态
        this.setPlayerCallStateVisible(null, false);
        //隐藏所有玩家准备状态
        this.setPlayerReadyStateVisible(null, false);
        //隐藏对面两家操作计时闹钟
        this.setPlayerTimerVisible(null, false);
        //隐藏对面两家牌数
        this.setPlayerCardNumVisible(null, false );
        //隐藏所有玩家玩偶形象
        this.setPlayerCartoonVisible(null, false );
        //隐藏所有玩家气泡
        this.setPlayerChatBubble(null, false );
        //隐藏所有玩家托管状态
        this.setPlayerTrusteeship(null, false );
        
        //------------test----------------//    
        // this.setPlayerCartoonVisible(null, true , 2);
        // this.scheduleOnce(() => {
        //     this.setPlayerCartoonVisible(null, true , 1);
        // },3)
        
        // this.scheduleOnce(function(){
        //     this.setPlayerDizhuVisible(0,true)
        // }, 5);
        //------------test----------------//

        // //隐藏部分简单界面
        for (let nChairID = 0, j = yx.internet.nMaxPlayerCount; nChairID < j; ++nChairID) {
            const player = this.getPlayerNode({ nChairID: nChairID });
            if (player) {
                player.Items.Image_dizhu_icon.active = false;
                // player.Items.node_trusteeship.active = false;
            }
        }
    }
    /**刷新所有玩家 */
    updateAllPlayers() {
        for(var i=0;i<yx.internet.nMaxPlayerCount;i++){
            let Actors = gameCenter.user.getActorByChairId(i)
            if(Actors){
                this.updateOnePlayer(i);
            }
        }
    }
    /**刷新一个玩家 */
    updateOnePlayer(nServerChairID: number) {
        if (!yx.internet.isUserCenter()) {
            return;
        }
        const nClientChairID = yx.func.getClientChairIDByServerChairID(nServerChairID);
        const player = this.Items[`node_player_${nClientChairID}`];
        if (player) {
            const playerInfo = gameCenter.user.getPlayerInfoByChairID(nServerChairID);
            this.actorByClientChairID[nClientChairID] = playerInfo;
            if (playerInfo) {
                player.active = true;
                //名称
                player.Items.player_name.string = `${playerInfo[PROTO_ACTOR.UAT_NICKNAME]}`;
                //金币
                player.Items.player_coin.string = `${playerInfo[PROTO_ACTOR.UAT_GOLD]}`;
                this.setPlayerCartoonVisible(nServerChairID,true,1,false)
                // player.Items.Node_chip.active = nServerChairID == yx.internet.nSelfChairID;
                //头像
                // app.file.updateHead({
                //     node: player.Items.Sprite_head,
                //     serverPicID: playerInfo.szMD5FaceFile,
                // });
            } else {
                player.active = false;
            }
        }
    }
    //获取出牌节点
    getOutCardParent(nChairID: number,isCleanChild?:boolean):ccNode{
        const ClientChairID = yx.func.getClientChairIDByServerChairID(nChairID);
        var node : ccNode
        if(ClientChairID == 0){
            node =  this.Items.Node_bottom.Items.node_OutCardPos
        }else{
            for(let i=1;i<=yx.internet.nMaxPlayerCount-1;i++){
                if(i==ClientChairID){
                    node =  this.Items["node_outcard_pos_"+ClientChairID]
                    node.setSiblingIndex(1)
                }else{
                    this.Items["node_outcard_pos_"+i].setSiblingIndex(0)
                }
            }
        }
        if(isCleanChild){
            node.removeAllChildren()
        }
        return node
    }
    //获取明牌节点
    getMingpaiParent(nChairID: number,isCleanChild?:boolean):ccNode{
        const ClientChairID = yx.func.getClientChairIDByServerChairID(nChairID);
        var node : ccNode
        if(ClientChairID != 0){
            const player = this.getPlayerNode({ nChairID: nChairID });
            if (player) {
                node =  player.Items.node_mingpai_pos
            }
        }
        if(isCleanChild && node){
            node.removeAllChildren()
        }
        return node
    }

    //设置玩家实时流水提示
    setSettlementScoreVisible(nChairID: number, bVisible: boolean, num?: number, isAni?: boolean) {
        let self = this
        let func = (nChairIDEx: number) => {
            let showFun = (bgNode :ccNode,cCharID:number) => {
                
                if(bVisible){
                    bgNode.Items.BFL_settlement_score.string = num >= 0 ? "+" + num : "" + num
                    bgNode.updateSprite(app.game.getRes(`ui/main/texture/player/${num >= 0 ? `yxc_pz_sz_y` : `yxc_pz_sz_s`}/spriteFrame`))
                    this.loadBundleRes(app.game.getRes(`ui/main/font/${num >= 0 ? `yxc_pz_sz_yy-num` : `yxc_pz_sz_ss-num`}`), Font, (res) => {
                        bgNode.Items.BFL_settlement_score.getComponent(Label).font = res;
                    });
                    const BFL_settlement_score_width = 153
                    const img_settlement_bg_width = 228
                    const offsetX = 130
                    var  offsetWidth = bgNode.Items.BFL_settlement_score.getComponent(UITransform).width > BFL_settlement_score_width ? bgNode.Items.BFL_settlement_score.getComponent(UITransform).width - BFL_settlement_score_width : 0
                    var addWidth = bgNode.Items.BFL_settlement_score.getComponent(UITransform).width > BFL_settlement_score_width ? img_settlement_bg_width + (bgNode.Items.BFL_settlement_score.getComponent(UITransform).width - BFL_settlement_score_width) : img_settlement_bg_width
                    bgNode.obtainComponent(UITransform).setContentSize(new Size(addWidth, bgNode.obtainComponent(UITransform).height))
                    bgNode.setPosition(self.img_settlement_bg_x[cCharID] + offsetX + offsetWidth/2,bgNode.getPosition().y)
                }
                if(isAni){
                    if(bVisible){
                        var y = bgNode.getPosition().y
                        bgNode.obtainComponent(UIOpacity).opacity = 1;
                        tween(bgNode)
                            .to(0.3, { position: v3(self.img_settlement_bg_x[cCharID] + offsetWidth / 2, y) }, { easing: 'sineOut' })
                            
                            .start();
                        tween(bgNode.obtainComponent(UIOpacity))
                            .to(0.3, { opacity: 255 })
                            .start()
                    }else{
                        tween(bgNode.obtainComponent(UIOpacity))
                                    .to(0.3, { opacity: 0 })
                                    .start()
                    }
                    
                }else{
                    bgNode.active = bVisible
                }
            }
            const ClientChairID = yx.func.getClientChairIDByServerChairID(nChairIDEx);
            showFun(this.getSettlementBgByChair(nChairIDEx),ClientChairID)
            
        }
        if (fw.isNull(nChairID)) {
            for (let k = 0, j = yx.internet.nMaxPlayerCount; k < j; ++k) {
                func(k);
            }
        } else {
            func(nChairID);
        }
    }
    //获取实时流水节点
    getSettlementBgByChair(nChairID: number):ccNode{
        const ClientChairID = yx.func.getClientChairIDByServerChairID(nChairID);
        var node : ccNode
        if(ClientChairID == 0){
            node =  this.Items.Node_bottom.Items.img_settlement_bg
        }else{
            const player = this.getPlayerNode({ nChairID: nChairID });
            if (player) {
                node =  player.Items.img_settlement_bg
            }
        }
        return node
    }
    //设置玩家叫牌状态
    setPlayerCallStateVisible(nChairID: number, bVisible: boolean, content?: string) {
        let self = this
        let func = (nChairIDEx: number) => {
            let showFun = (stateNode :ccNode) => {
                
                if(content){
                    stateNode.string = content
                }
                stateNode.active = bVisible
                
            }
            const ClientChairID = yx.func.getClientChairIDByServerChairID(nChairIDEx);

            var node : ccNode
            if(ClientChairID == 0){
                node =  this.Items.BMFont_Status
            }else{
                const player = this.getPlayerNode({ nChairID: nChairIDEx });
                if (player) {
                    node =  player.Items.bmp_status
                }
            }
            showFun(node)
            
        }
        if (fw.isNull(nChairID)) {
            for (let k = 0, j = yx.internet.nMaxPlayerCount; k < j; ++k) {
                func(k);
            }
        } else {
            func(nChairID);
        }
    }
    //设置对两家计时闹钟
    setPlayerTimerVisible(nChairID: number, bVisible: boolean, time?: number, callback?: Function) {
        let self = this
        let func = (nChairIDEx: number) => {
            let showFun = (clockNode :ccNode) => {
                clockNode.active = bVisible
                if(!bVisible){
                    yx.func.playTimerAnimation(clockNode, false);
                }
                if(bVisible && time > 0){
                    yx.func.setTimerSchedule(clockNode,time,callback)
                }
            }
            const ClientChairID = yx.func.getClientChairIDByServerChairID(nChairIDEx);

            var node : ccNode
            if(ClientChairID != 0){
            
                const player = this.getPlayerNode({ nChairID: nChairIDEx });
                if (player) {
                    node =  player.Items.node_clock
                    showFun(node)
                }
            }
            
            
        }
        if (fw.isNull(nChairID)) {
            for (let k = 0, j = yx.internet.nMaxPlayerCount; k < j; ++k) {
                func(k);
            }
        } else {
            func(nChairID);
        }
    }
    //设置对两家牌数
    setPlayerCardNumVisible(nChairID: number, bVisible: boolean, cardNum?: number, noBaojin?: boolean) {
        let self = this
        noBaojin = noBaojin ? noBaojin : false
        let func = (nChairIDEx: number) => {
            let showFun = (cardNode :ccNode) => {
                cardNode.active = bVisible
                
                if(bVisible && cardNum ){
                    cardNode.Items.BMFont_SurplusValue.string = cardNum + ""
                    if(cardNum > 0 && cardNum <= 2 && !noBaojin){
                        cardNode.Items.ani_jinbaoqi.active = true
                        const a = cardNode.Items.ani_jinbaoqi.getComponent(Animation);
                        // a.stop()
                        a.play(`ani_jinbaoqi`);
                    }
                }
            }
            const ClientChairID = yx.func.getClientChairIDByServerChairID(nChairIDEx);

            var node : ccNode
            if(ClientChairID != 0){
                const player = this.getPlayerNode({ nChairID: nChairIDEx });
                if (player ) {
                    node =  player.Items.Sprite_SurplusCard
                    showFun(node)
                }
            }
            
            
        }
        if (fw.isNull(nChairID)) {
            for (let k = 0, j = yx.internet.nMaxPlayerCount; k < j; ++k) {
                func(k);
            }
        } else {
            func(nChairID);
        }
    }
    //以扣减的方式处理对家牌数
    setPlayerCardNumVisibleBySudCardNum(nChairID: number, bVisible: boolean, subcardNum?: number, noBaojin?: boolean) {
        let self = this

        const ClientChairID = yx.func.getClientChairIDByServerChairID(nChairID);

        var node : ccNode
        if(ClientChairID != 0){
            const player = this.getPlayerNode({ nChairID: nChairID });
            if (player ) {
                node =  player.Items.Sprite_SurplusCard
                let cardNum = app.func.toNumber(node.Items.BMFont_SurplusValue.string) - subcardNum
                this.setPlayerCardNumVisible(nChairID,bVisible,cardNum,noBaojin)
            }
        }
    }
    //获取对家牌数
    getCardNum(nChairID:number):number {
        let self = this
        let num = 20
        const ClientChairID = yx.func.getClientChairIDByServerChairID(nChairID);

        if(ClientChairID != 0){
            const player = this.getPlayerNode({ nChairID: nChairID });
            if (player ) {
                num = app.func.toNumber(player.Items.BMFont_SurplusValue.string) 
            }
        }
        return num
    }
    //隐藏所有玩家托管状态
    setPlayerTrusteeship(nChairID: number, bVisible: boolean) {
        let self = this 
        let func = (nChairIDEx: number) => {
            let showFun = (TrusteeshipNode :ccNode) => {
                TrusteeshipNode.active = bVisible
                
            }
            const ClientChairID = yx.func.getClientChairIDByServerChairID(nChairIDEx);

            var node : ccNode
            if(ClientChairID != 0){
                const player = this.getPlayerNode({ nChairID: nChairIDEx });
                if (player ) {
                    node =  player.Items.node_trusteeship
                    showFun(node)
                }
            }
        }
        if (fw.isNull(nChairID)) {
            for (let k = 0, j = yx.internet.nMaxPlayerCount; k < j; ++k) {
                func(k);
            }
        } else {
            func(nChairID);
        }
    }
    //设置玩家聊天气泡
    setPlayerChatBubble(nChairID: number, bVisible: boolean, content?: string, isAni?: boolean) {
        let func = (nChairIDEx: number) => {
            let showFun = (BubbleNode :ccNode) => {
                BubbleNode.active = bVisible
                
                if(bVisible && content ){
                    BubbleNode.Items.Text_BubbleContent.string = content + ""
                    this.scheduleOnce(function(){
                        BubbleNode.obtainComponent(UITransform).setContentSize(new Size(BubbleNode.getComponent(UITransform).width,BubbleNode.Items.Text_BubbleContent.getComponent(UITransform).height +20))
                    }, 0.1);
                }

                if(isAni){
                    if(bVisible){
                        BubbleNode.obtainComponent(UIOpacity).opacity =1 
                        tween(BubbleNode.obtainComponent(UIOpacity))
                            .to(0.2,{ opacity:255 })
                            .delay(2.5)
                            .to(0.2,{ opacity:1 })
                            .call(()=>{
                                BubbleNode.active = false
                            })
                            .start()    
                    }else{
                        tween(BubbleNode.obtainComponent(UIOpacity))
                            .to(0.2,{ opacity:0 })
                            .call(()=>{
                                BubbleNode.active = false
                            })
                            .start()    
                    }
                }else if(bVisible){
                    tween(BubbleNode.obtainComponent(UIOpacity))
                        .delay(2.5)
                        .to(0.2,{ opacity:0 })
                        .call(()=>{
                            BubbleNode.active = false
                        })
                        .start()    
                }
            }
            const ClientChairID = yx.func.getClientChairIDByServerChairID(nChairIDEx);

            var node : ccNode
            if(ClientChairID != 0){
                const player = this.getPlayerNode({ nChairID: nChairIDEx });
                if (player ) {
                    node =  player.Items.ImageView_BubbleBG
                    showFun(node)
                }
            }else{
                showFun(this.Items.Img_BubbleBG)
            }
            
            
        }
        if (fw.isNull(nChairID)) {
            for (let k = 0, j = yx.internet.nMaxPlayerCount; k < j; ++k) {
                func(k);
            }
        } else {
            func(nChairID);
        }
    }
    //设置玩家玩偶形象 type1:卡通形象  type2：地主农民形象
    setPlayerCartoonVisible(nChairID: number, bVisible: boolean, type?: number, isAni?: boolean, animation?: string ) {
        isAni = isAni == false ? false : true
        let func = (nChairIDEx: number) => {
            let showFun = (parentNode :ccNode) => {
                if(bVisible){
                    if((type == 1 && parentNode.Items.node_cartoon.children.length == 0) || (type == 2 && !parentNode.Items.node_spine.active)){
                        
                        var delayTime = isAni ? 0.5 : 0.1
                        if(type == 1){
                            parentNode.Items.node_spine.active = false
                        }else{
                            parentNode.Items.node_cartoon.removeAllChildren()
                        }
                        if(isAni){
                            this.loadBundleRes(fw.BundleConfig.Landlord.res[`ui/anim/ani_node_huantouxiang`], (res: Prefab) => {
                                let aniNode = instantiate(res);
                                if(!fw.isNull(aniNode)){
                                    parentNode.addChild(aniNode)
                                    
                                    const a = aniNode.getComponent(Animation);
            
                                    a.play(`ani_node_huantouxiang`);
                                    a.on(Animation.EventType.FINISHED, () => {
                                        aniNode.removeFromParent(true)
                                    });
                                }
                            });
                        }
                        this.scheduleOnce(() => {
                            if(type == 1){
                                this.loadBundleRes(fw.BundleConfig.Landlord.res[`ui/anim/tx_ddz_renwuhuxi`], (res: Prefab) => {
                                    let aniNode = instantiate(res);
                                    if(!fw.isNull(aniNode)){
                                        parentNode.Items.node_cartoon.addChild(aniNode)
                                        const a = aniNode.getComponent(Animation);
                                        a.play(`tx_ddz_renwuhuxi`);
                                        // a.getState('tx_ddz_renwuhuxi').repeatCount = Infinity;
                                        a.on(Animation.EventType.FINISHED, () => {
                                            a.play(`tx_ddz_renwuhuxi`);
                                        });
                                    }
                                });
                            }else{
                                var spk = parentNode.Items.node_spine.obtainComponent(FWSpine)
                                
                                this.loadBundleRes(fw.BundleConfig.Landlord.res[`effect/actor/landlordBoy/dizhu`],sp.SkeletonData, (skeletonData: sp.SkeletonData) => {
                                    
                                    spk.skeletonData  = skeletonData
                                    spk.animation = animation ? animation : "daiji"
                                    parentNode.Items.node_spine.active = true
                            
                                });
                            }
                        },delayTime)
                    }
                    
                    
                }else{
                    parentNode.Items.node_spine.active = false
                    parentNode.Items.node_cartoon.removeAllChildren()
                }
                
                
            }
          
         
            const ClientChairID = yx.func.getClientChairIDByServerChairID(nChairIDEx);
            showFun(this.Items[`node_actor_${ClientChairID}`])

        }
        if (fw.isNull(nChairID)) {
            for (let k = 0, j = yx.internet.nMaxPlayerCount; k < j; ++k) {
                func(k);
            }
        } else {
            func(nChairID);
        }
    }
    //设置玩家准备状态
    setPlayerReadyStateVisible(nChairID: number, bVisible: boolean) {
        let self = this
        let func = (nChairIDEx: number) => {
            const ClientChairID = yx.func.getClientChairIDByServerChairID(nChairIDEx);

            var node : ccNode
            if(ClientChairID == 0){
                node =  this.Items.Sprite_ok
            }else{
                const player = this.getPlayerNode({ nChairID: nChairIDEx });
                if (player) {
                    node =  player.Items.sp_ok
                }
            }
            node.active = bVisible
            
        }
        if (fw.isNull(nChairID)) {
            for (let k = 0, j = yx.internet.nMaxPlayerCount; k < j; ++k) {
                func(k);
            }
        } else {
            func(nChairID);
        }
    }
    //设置玩家是否为地主的标志
    setPlayerDizhuVisible(nChairIDEx: number, isAni: boolean) {
        if(yx.main){
            yx.main.nLandlordId = nChairIDEx
        }
        var noAniShow = () =>{
            for (let nChairID = 0, j = yx.internet.nMaxPlayerCount; nChairID < j; ++nChairID) {
                const player = this.getPlayerNode({ nChairID: nChairID });
                if (player) {
                    player.Items.Image_dizhu_icon.active = true;
    
                    if(nChairIDEx == nChairID){
                        player.Items.Image_dizhu_icon.updateSpriteSync(app.game.getRes(`ui/main/texture/player/yxc_tb_dizhu/spriteFrame`));
                        
                    }else{
                        player.Items.Image_dizhu_icon.updateSpriteSync(app.game.getRes(`ui/main/texture/player/yxc_tb_nongming/spriteFrame`));
                    }
                    if(yx.func.getClientChairIDByServerChairID(nChairID) == 0){
                        yx.main.resetHandCardPos()
                    }
                }
            }
        }
        if(isAni){
            for (let nChairID = 0, j = yx.internet.nMaxPlayerCount; nChairID < j; ++nChairID) {
                const player = this.getPlayerNode({ nChairID: nChairID });
                if (player) {
                    player.Items.Image_dizhu_icon.active = false;
                    if(nChairIDEx == nChairID){
                        this.loadBundleRes(fw.BundleConfig.Landlord.res[`ui/anim/tx_ddz_2022_dizhubaoji`], (res: Prefab) => {
                            let aniNode = instantiate(res);
                            if(!fw.isNull(aniNode)){
                                aniNode.parent = yx.main.viewZOrderNode[yx.main.viewZOrder.Anim];
                                var tScale = yx.config.changeOldResScale
                                aniNode.scale = v3(tScale, tScale, tScale)
                                const a = aniNode.getComponent(Animation);
        
                                a.play(`tx_ddz_2022_dizhubaoji`);
                                a.on(Animation.EventType.FINISHED, () => {
                                    tween(aniNode)
                                        .parallel(
                                            tween().to(0.3, { worldPosition: player.Items.Image_dizhu_icon.worldPosition }),
                                            tween().to(0.3, { scale: v3(0.3,0.3,0.3) })
                                        )
                                        .call(() => {
                                            aniNode.removeFromParent(true);
                                            noAniShow()
                                        })
                                        .start()
                                });
                            }
                        });
                    }
                }
            }
        }else{
            noAniShow()
        }
        
    }

    /**播放赢筹码动画 */
    playLoseChipAnim(nChairID: number, nJettonArea: number, callback?: Function) {
        let func = (nChairIDEx: number) => {
            const player = this.getPlayerNode({ nChairID: nChairIDEx });
            if (player) {
                const bA = nJettonArea == yx.config.JettonArea.BTN_BETA;
                const n = new ccNode();
                n.parent = yx.main.viewZOrderNode[yx.main.viewZOrder.Anim];
                n.obtainComponent(Sprite);
                n.obtainComponent(UITransform);
                n.updateSprite(app.game.getRes(`ui/main/img/atlas/${bA ? `AB_biaoqian_B1` : `AB_biaoqian_A1`}/spriteFrame`));
                const l = new ccNode;
                l.parent = n;
                l.setPosition(fw.v3(8, 0, 0));
                const label = l.obtainComponent(Label);
                label.color = app.func.color(`#FFFD45`);
                const t = bA ? player.Items.Label_b : player.Items.Label_a;
                label.string = `${app.func.numberAccuracy(app.func.toNumber(t.string))}`;
                label.fontSize = 20;
                t.string = ``;
                //赢筹码动画
                const c = bA ? player.Items.Node_chip_b : player.Items.Node_chip_a;
                //音效
                app.audio.playEffect(app.game.getRes(`audio/placeabet`));
                tween(n)
                    .set({ worldPosition: c.worldPosition })
                    .to(0.35, { worldPosition: this.Items.Node_beauty.worldPosition })
                    .call(() => {
                        n.removeFromParent(true);
                        callback?.();
                    })
                    .start();
            } else {
                callback?.();
            }
        }
        if (fw.isNull(nChairID)) {
            for (let k = 0, j = yx.internet.nMaxPlayerCount; k < j; ++k) {
                func(k);
            }
        } else {
            func(nChairID);
        }
    }
    /**播放赢筹码动画 */
    playWinChipAnim(nChairID: number, nJettonArea: number, nValue: number, callback?: Function) {
        let func = (nChairIDEx: number) => {
            const player = this.getPlayerNode({ nChairID: nChairIDEx });
            if (player) {
                const bA = nJettonArea == yx.config.JettonArea.BTN_BETA;
                const n = new ccNode();
                n.parent = yx.main.viewZOrderNode[yx.main.viewZOrder.Anim];
                n.obtainComponent(Sprite);
                n.obtainComponent(UITransform);
                n.updateSprite(app.game.getRes(`ui/main/img/atlas/${bA ? `AB_biaoqian_A1` : `AB_biaoqian_B1`}/spriteFrame`));
                const l = new ccNode;
                l.parent = n;
                l.setPosition(fw.v3(8, 0, 0));
                const label = l.obtainComponent(Label);
                label.color = app.func.color(`#FFFD45`);
                const t = bA ? player.Items.Label_a : player.Items.Label_b;
                label.string = `${app.func.numberAccuracy(nValue / DF_RATE)}`;
                label.fontSize = 20;
                //赢筹码动画
                const c = bA ? player.Items.Node_chip_a : player.Items.Node_chip_b;
                const nJettonScore = app.func.toNumber(t.string);
                //音效
                app.audio.playEffect(app.game.getRes(`audio/placeabet`));
                tween(n)
                    .set({ worldPosition: this.Items.Node_beauty.worldPosition })
                    .to(0.35, { worldPosition: c.worldPosition })
                    .delay(0.5)
                    .call(() => {
                        //调整筹码数值
                        label.string = `${app.func.numberAccuracy(nValue / DF_RATE + nJettonScore)}`;
                        //清理下注值
                        t.string = ``;
                    })
                    .to(0.35, { worldPosition: player.worldPosition })
                    .call(() => {
                        //赢金动画
                        player.Items.Node_win_xia.active = true;
                        player.Items.Node_win_xia.obtainComponent(FWSpine).setAnimation(0, `xia`, true);
                        player.Items.Node_win_shang.active = true;
                        player.Items.Node_win_shang.obtainComponent(FWSpine).setAnimation(0, `shang`, false);
                        //下一个动作
                        callback?.();
                    })
                    .hide()
                    .call(() => {
                        if (nChairIDEx == yx.internet.nSelfChairID) {
                            app.audio.playEffect(app.game.getRes(`audio/winner`));
                        }
                        //飘分动画
                        player.Items.Label_win.string = `+${app.func.numberAccuracy(nValue / DF_RATE + nJettonScore)}`;
                        let node = player.Items.Node_win;
                        node.__initPos ??= node.getPosition();
                        node.setPosition(node.__initPos);
                        Tween.stopAllByTarget(node);
                        node.active = true;
                        tween(node)
                            .show()
                            .by(0.5, { position: fw.v3(0, 35, 0).clone() })
                            .delay(2.0)
                            .hide()
                            .start();
                    })
                    .delay(2.0)
                    .call(() => {
                        n.removeFromParent(true);
                        //标记完成
                        yx.internet.setTriggerMessageVisible(true);
                    })
                    .start();
            } else {
                callback?.();
            }
        }
        if (fw.isNull(nChairID)) {
            for (let k = 0, j = yx.internet.nMaxPlayerCount; k < j; ++k) {
                func(k);
            }
        } else {
            func(nChairID);
        }
    }


    /**刷新玩家状态 */
    updatePlayerState(nChairID: number, nState?: number) {
        let func = (nChairIDEx: number) => {
            const player = this.getPlayerNode({ nChairID: nChairIDEx });
            if (player) {
                switch (nState) {
                    case yx.config.PlayerStates.Free:
                        break;
                    case yx.config.PlayerStates.Join:
                        break;
                    case yx.config.PlayerStates.Play:
                        break;
                    case yx.config.PlayerStates.TimeOut:
                        player.Items.Node_state_skip.active = true;
                        break;
                    default:
                        break;
                }
                //是否是自己
                if (nChairID == yx.internet.nSelfChairID) {
                    this.Items.Sprite_trusteeship.active = nState == yx.config.PlayerStates.TimeOut;
                }
            }
        }
        if (fw.isNull(nChairID)) {
            for (let k = 0, j = yx.internet.nMaxPlayerCount; k < j; ++k) {
                func(k);
            }
        } else {
            func(nChairID);
        }
    }
    /**获取对应节点位置，nChairID指服务器玩家座位号 */
    getPlayerNode(data: GetPlayerNodeParam): ccNode {
        let playerNode: ccNode;
        //传入了nUserID
        if (!fw.isNull(data.nUserID)) {
            const actor = gameCenter.user.getActorByDBIDEx(data.nUserID);
            if (actor) {
                data.nChairID = actor.chairID;
            }
        }
        //传入了nChairID
        if (!fw.isNull(data.nChairID)) {
            let nClientChairID: number;
            if (data.nChairID < yx.internet.nMaxPlayerCount) {
                nClientChairID = yx.func.getClientChairIDByServerChairID(data.nChairID);
            } else {
                nClientChairID = data.nChairID + 1;
            }
            playerNode = this.Items[`node_player_${nClientChairID}`];
            if (playerNode) {
                return playerNode;
            }
        }
        return data.defaultNode;
    }
}