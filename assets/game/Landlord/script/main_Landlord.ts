import { _decorator, Node as ccNode, instantiate, math, ProgressBar,NodeEventType,sp, Animation, AnimationClip, Prefab, tween,v3, UIOpacity, Tween, Sprite, UITransform, Button, Label, Vec3, Vec2, Rect, Size } from 'cc';
const { ccclass } = _decorator;

import { yx } from '../yx_Landlord';
import { player_Landlord } from './player_Landlord';
import proto from './../protobuf/Landlord_format';
import { ACTOR, PROTO_ACTOR } from '../../../app/config/cmd/ActorCMD';
import { FWSpine } from '../../../app/framework/extensions/FWSpine';
import { DF_RATE, DF_SYMBOL } from '../../../app/config/ConstantConfig';
import { main_GameBase } from '../../GameBase/ui/main/script/main_GameBase';
import { logic_Landlord } from './logic_Landlord';
import { landlordSoundInitData, sound_Landlord } from './sound_Landlord';
import { EVENT_ID } from '../../../app/config/EventConfig';

@ccclass('main_Landlord')
export class main_Landlord extends main_GameBase {
    /**筹码索引 */
    nChipIndex: number = -1
    /**地主ID */
    nLandlordId: number = -1
    /**player */
    player: player_Landlord = null
    /**logic */
    logic: logic_Landlord = new logic_Landlord
    /**sound */
    sound: sound_Landlord = new sound_Landlord
    /**玩家手牌数据 */
    m_HandCardData: any[];
    /**玩家手牌Node */
    m_HandCardNode: ccNode[] = [];
    m_mapGMPos: Vec3[]= [];
    m_vecCardsPosition: Vec3[]= [];
    m_vecSelectedCache: any[]= [];
    mDragCardNode: ccNode;
    mChoseCardNode: ccNode;
    m_vecPopCache: any[]= [];
    m_RegionData :number[] = [0,0];
    callPointTimes: number = 0; //已经叫地主的次数 大于3等于已经第二轮
    schedule_updateTime:any;
    m_SearchResult:any;   //搜索可出的牌型
    m_cbHitCount:number = 0; //搜索可出的牌型数量
    m_cbTipIndex:number = 0; //搜索的引数
    m_bFirstRound:boolean = false //是否首出
    protected initData(): boolean | void {
        this.m_HandCardData = []
        this.m_HandCardNode = []
    }
    protected initView(): boolean | void {
        app.audio.setDefMusic(fw.BundleConfig.Landlord.res[`audio/gamebg`]);
		app.audio.playMusic();
        //刷新下注
        // this.updateChipScore();
        // //添加player
        this.player = this.obtainComponent(app.game.getCom(`player`));
        // //清理游戏
        this.clearOneGame();
        //初始化时间
        this.initTimeLabel();
        //适配
		this.fitSceneNode();
        //房间基础信息
        this.initTableInfo({
            roomName : yx.internet.roomName,
            roomBase : yx.internet.roomBase,
        });
    }
    protected fitSceneNode(){
		if(app.isIphoneX){
			this.scheduleOnce(()=>{
				this.Items.node_top_left.setPosition(v3(this.Items.node_top_left.getPosition().x+66,this.Items.node_top_left.getPosition().y,1))
                this.Items.node_outcard_pos_2.setPosition(v3(this.Items.node_outcard_pos_2.getPosition().x+66,this.Items.node_outcard_pos_2.getPosition().y,1))
                this.Items.node_player_2.setPosition(v3(this.Items.node_player_2.getPosition().x+66,this.Items.node_player_2.getPosition().y,1))
			},0)
		}
	}
    protected initEvents(): boolean | void {
        //玩家金币金币变更
        this.bindEvent({
            eventName: ACTOR[ACTOR.ACTOR_PROP_GOLD],
            callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam) => {
                this.updateChipVisible();
            }
        });
        this.bindEvent({
            eventName: `GameRule`,
            callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam): boolean | void => {
                this.updateChipScore();
            }
        });
        // this.bindEvent({
        //     eventName: `GameReconnectRoom`,
        //     callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam): boolean | void => {
        //         //重连
        //         this.doReconnect(arg1.data);
        //     }
        // });
        this.bindEvent({
            eventName: EVENT_ID.EVENT_TABLE_BASE_INFO,
            callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam): boolean | void => {
                this.initTableInfo(arg1.data);
            }
        });

    }
    sendUserMemory(isUse:boolean){
        yx.internet.DDZ_C_USE_MEMORY({
            buse:isUse
        })
        app.file.setBooleanForKey(`Use_cardRecorder`, isUse, { all: false });
    }
    protected initBtns(): boolean | void {
        this.Items.btn_cardRecord.onClickAndScale(() => {
            if(this.Items.node_card_recorder.active){
                this.showCardRecorder(false)
                this.sendUserMemory(false)
            }else{
                this.sendUserMemory(true)
            }
        });
        this.Items.Sprite_rule.onClickAndScale(() => {
            yx.internet.DDZ_C_DISMISS({ })
        });
        
        /**Andar */
        this.Items.Sprite_BtnMore.onClickAndScale(() => {
            this.onMoveBgClick()
        });

        this.Items.btn_return.onClickAndScale(() => {
            // fw.scene.changeScene(fw.SceneConfigs.plaza);
            app.gameManager.exitGame();
        });
       
        this.Items.Sprite_BtnTrusteeship.onClickAndScale(() => {
            yx.internet.DDZ_C_TRUSTEESHIP({
                btrusteeship:true
            })
        });
        /**trusteeship */
        this.Items.Node_trusteeship.onClickAndScale(() => {
            yx.internet.DDZ_C_TRUSTEESHIP({
                btrusteeship:false
            })
        });
        this.initCardTouchLayerEvent()
        this.initEmptySpaceEvent()
        this.initActionBar()
    }
    /**清理一局游戏 */
    clearOneGame() {
        this.callPointTimes = 0
        this.nLandlordId = -1
        //清理定时器
        this.unscheduleAllCallbacks();
        //清理所有动画节点
        var per = this.viewZOrderNode[this.viewZOrder.Anim]
        per.removeAllChildren(true);
        //清理桌面牌
        // this.updateTableCard(null, false);
        // this.setOperateVisible(false, true);
        this.cleanHandCard()
        this.resetActionBarOnFree();
        this.resetNodeLookCard();
        this.resetActionBar();
        this.showTrustLayout(false)
        this.showCardRecorder(false)
        this.showGameTip(false)
        this.showBasePool(false);
        this.resetBaseCardPool();
        this.setBaseScorePool( 1 );
        this.displayHandsAnalyseTips(false)
        
        //player隐藏
        this.player.clearOneGame();
        
        //--------------test-------------//
        //this.DDZ_S_MSG_TIPS({type:2,curchair:255,countdown:5},[false,false,false])
        // app.popup.closeAllToast()
        // yx.internet.nSelfChairID = 0
        // this.scheduleOnce(function(){
            
            // this.didReceiveSendCard([1,2,3,4,5,6,7,8,9,10,11,12,13,17,18,19,20,21,22,23],true)
            // // 
            // this.showBasePool(true);
            // this.showOperateBtn(yx.config.ActionBarStatus.ActionBarStatus_PublicOutCard,15,null)
            // let data:proto.client_proto_ddz.IDDZ_S_OutCard={
            //     outcards : [1,2,3,4,5,6,7,8,9,10,11,12,13,17,18,19,20,21,22,23],
            //     cardtype : yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Pairs,
            //     outchair : 2
            // }
            // this.didReceiveOutCard(data)
            // let data2:proto.client_proto_ddz.IDDZ_S_OutCard={
            //     outcards : [1,2,3,4,5,6,7,8,9,10,11,12,13,17,18,19,20,21,22,23],
            //     cardtype : yx.config.OutCardType.Bomb,
            //     outchair : 1
            // }
            // this.didReceiveOutCard(data2)
            // this.scheduleOnce(function(){
            //     let data:proto.client_proto_ddz.IDDZ_S_OutCard={
            //         outcards : [1,2,3,4,5,6,7,8,9,10,11,12,13],
            //         cardtype : yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Pairs,
            //         outchair : 2
            //     }
            //     this.didReceiveOutCard(data)
            // }, 2);
            // this.scheduleOnce(function(){
            //     this.didReceiveMingpai(1,[1,2,3,4,5,6,7,8,9,10,11,12,13,17,18,19,20,21,22,23])
            // this.didReceiveMingpai(2,[1,2,3,4,5,6,7,8,9,10,11,12,13,17,18,19,20,21,22,23])
            // }, 4);
            // // this.didReceiveMingpai(1,[1,2,3,4,5,6,7,8,9,10,11,12,13])
            // // this.didReceiveMingpai(2,[1,2,3,4,5,6,7,8,9,10,11,12,13])
            // this.scheduleOnce(function(){
            //     // this.showLastThreeCardAndMove([78,79,50],0,true)
                
            //     // this.showXbeiAni(3,15)
            //     let dataSeettle:proto.client_proto_ddz.IDDZ_S_GameEnd = {
            //         handcards:[
            //             {
            //                 data:[1,2,3,4,5,6,7,8,9,10,11,12,13,17,18,19,20,21,22,23]
            //             },
            //             {
            //                 data:[1,2,3,4,5,6,7,8,9,10,11,12,13,17,18,19,20,21,22,23]
            //             },
            //             {
            //                 data:[1,2,3,4,5,6,7,8,9,10,11,12,13,17,18,19,20,21,22,23]
            //             },
            //         ],
            //         settleinfo:{
            //             toptimes:[999999,8888,77777],
            //             golds:[999999,-555555,-444444],
            //             broke:[false,false,false],
            //             toplimit:[true,false,false],
            //             baopei:[false,false,true],
            //             doubletimes:[1,2,4],
            //             flag: 1
            //         }
            //     }
            //     yx.internet.nSelfChairID = 1
            //     this.DDZ_S_MSG_GAMEEND(dataSeettle)
            // }, 3);
            // app.popup.showToast("assssssssssssssssssssssssss");
            // app.popup.showTip({ text: "Something went wrong with login, please login again" })
        // }, 5);
        
    }
    //初始化三张牌的状态
    resetNodeLookCard(){
        this.Items.btn_cardLook.active = false
        this.Items.node_showThreeNormal.active = false
        this.Items.node_showThreeAniNode.active = true
        this.Items.node_showThreeAniNode.removeAllChildren()
        for(let i=0;i<3;i++){
            this.Items.node_showThreeNormal.Items["Sprite_BaseCardBG_"+i].active = true
        }
        
    }
    //清理手牌
    cleanHandCard(){
        this.m_HandCardData = []
        for(var i=this.m_HandCardNode.length-1;i>=0;i--){
            this.m_HandCardNode[i].removeFromParent(true)
        }
        this.m_HandCardNode = []
        Tween.stopAllByTarget(this.Items.node_handCard);
    }
    //清理所有等待时间的按钮
    resetActionBarOnFree(){
        let childs = this.Items.node_action_bar_onfree.children;
        for (let i = 0; i < childs.length; ++i) {
            childs[i].active = false
        }
    }
    //清理所有操作按钮
    resetActionBar(){
        let childs = this.Items.node_action_bar.children;
        for (let i = 0; i < childs.length; ++i) {
            childs[i].active = false
            if(!fw.isNull(childs[i].Items["node_clock"])){
                yx.func.playTimerAnimation(childs[i].Items["node_clock"], false);
            }
            
        }
    }
    //是否展示托管界面
    showTrustLayout(isShow:boolean){
        this.Items.Sprite_trusteeship.active = isShow
    }
    //是否展示记牌器
    showCardRecorder(isShow:boolean){
        this.Items.node_card_recorder.active = isShow
    }
    //是否展示记牌器
    setCardRecorderData(recorderDada : any){
        var faceNames = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "E", "F"]
        for(var i=0;i<faceNames.length;i++){
            this.Items["BMFont_CountKey_"+faceNames[i]].string = recorderDada[i+1] ?? 0+""
        }
        
    }
    //初始化房间名字和底分
    initTableInfo(data){
        this.Items.tableinfo.string = data.roomName + " 底分" + data.roomBase
    }
    //是否展示游戏提示
    showGameTip(type: any){
        this.Items.special_tip.active = false
        this.Items.game_tip.active = false
        var runFun = function(node:ccNode){
            tween(node)
                .delay(1)
                .hide()
                .start()
        }
        if(type == "special"){
            this.Items.special_tip.active = true
            runFun(this.Items.special_tip)
        }else if(type == "game"){
            this.Items.game_tip.active = true
            runFun(this.Items.game_tip)
        }
    }
    //是否展示Top底牌栏
    showBasePool(isShow: boolean){
        this.Items.three_card_pool_bg.active = isShow
    }

    //恢复底牌为背牌
    resetBaseCardPool(){
        let childs = this.Items.Layout_BaseCardPool.children;
        for (let i = 0; i < childs.length; ++i) {
            childs[i].removeAllChildren()
        }
    }
    //设置底牌倍数
    setBaseScorePool(beishu : number,isAni?:boolean){
        this.Items.BMFont_MutipleValue.string = "" + beishu
        if(isAni){
            this.loadBundleRes(fw.BundleConfig.Landlord.res[`ui/anim/ani_beishubianhua_0`], (res: Prefab) => {
                let aniNode = instantiate(res);
                if(!fw.isNull(aniNode)){
                    this.Items.BMFont_MutipleValue.addChild(aniNode)
                    aniNode.Items["BitmapFontLabel_19"].string = "" + beishu
                    var tScale = 1
                    aniNode.scale = v3(tScale, tScale, tScale)
                    const a = aniNode.getComponent(Animation);
                    
                    a.on(Animation.EventType.FINISHED, () => {
                        aniNode.removeFromParent(true)
                    });
                    a.play(`ani_beishubianhua_0`);
                }
            });
        }
        
    }
    //展示X倍动画
    showXbeiAni(beishu : number,Allbeishu : number){
        this.loadBundleRes(fw.BundleConfig.Landlord.res[`ui/anim/ani_beishubianhua`], (res: Prefab) => {
            let aniNode = instantiate(res);
            if(!fw.isNull(aniNode)){
                this.viewZOrderNode[this.viewZOrder.Anim].addChild(aniNode)
                aniNode.Items["BitmapFontLabel_1"].string = "X" + beishu
                var tScale = yx.config.changeOldResScale
                aniNode.scale = v3(tScale, tScale, tScale)
                aniNode.setPosition(new Vec3(0,70,1))
                const a = aniNode.getComponent(Animation);
 
                a.on(Animation.EventType.FINISHED, () => {
                    aniNode.removeFromParent(true)
                });
                a.play(`ani_beishubianhua`);
                
                var targetWorldPos = this.Items.BMFont_MutipleValue.worldPosition
                var aniWorldPos = aniNode.worldPosition
                tween(aniNode)
                    .delay(0.8)
                    .parallel(
                        tween().to(0.3, { scale: new Vec3(tScale, tScale, tScale)}),
                        tween().by(0.3, { position: new Vec3(targetWorldPos.x-aniWorldPos.x, targetWorldPos.y-aniWorldPos.y, 1) })
                    )
                    .call(()=>{
                        this.setBaseScorePool(Allbeishu,true)
                    })
                    .start()
            }
        });
    }

    //创建最底层的触摸,用来关闭部分界面
    initEmptySpaceEvent(){
        var _onTouchBegan = function(touch, event){
            this.onMoveBgClick(true)
        }

        this.Items.Sprite_bg.on(NodeEventType.TOUCH_START, _onTouchBegan, this);       
    }
    //初始化玩家操作按钮
    initActionBar(){
        //叫地主
        this.Items.Node_BarStatusCallLandlord.Items.Sprite_BtnPositive.onClickAndScale(() => {
            yx.internet.DDZ_C_CALL_POINT({
                point:yx.internet.toppoint+1
            })
        });
        //不叫地主
        this.Items.Node_BarStatusCallLandlord.Items.Sprite_BtnNegative.onClickAndScale(() => {
            yx.internet.DDZ_C_CALL_POINT({
                point:0
            })
        });
        //抢地主
        this.Items.Node_BarStatusGrabLandlord.Items.Sprite_BtnPositive.onClickAndScale(() => {
            yx.internet.DDZ_C_CALL_POINT({
                point:yx.internet.toppoint+1
            })
        });
        //不抢地主
        this.Items.Node_BarStatusGrabLandlord.Items.Sprite_BtnNegative.onClickAndScale(() => {
            yx.internet.DDZ_C_CALL_POINT({
                point:0
            })
        });
        //抢地主
        this.Items.Node_BarStatusGrabLandlord.Items.Sprite_BtnPositive.onClickAndScale(() => {
            yx.internet.DDZ_C_CALL_POINT({
                point:yx.internet.toppoint+1
            })
        });
        //出牌
        this.Items.Node_BarStatusCanAfford.Items.Sprite_BtnDiscard.onClickAndScale(() => {
            this.checkPopCard()
        });
        //不出
        this.Items.Node_BarStatusCanAfford.Items.Sprite_BtnPass.onClickAndScale(() => {
            yx.internet.DDZ_C_PASS_CARD({})
        });
        //提示
        this.Items.Node_BarStatusCanAfford.Items.Sprite_BtnTip.onClickAndScale(() => {
            this.putDownAllHandCard()
            if(this.m_cbTipIndex >= this.m_cbHitCount){
                this.m_cbTipIndex = 0
            }
            yx.func.popCardsByData(this.m_SearchResult[this.m_cbTipIndex].cbResultCard, this.m_SearchResult[this.m_cbTipIndex].cbCardCount,this.m_HandCardNode,null, this.logic.getLaiZiCardData())
            this.updateDisplayOfOutCardBtn()
            this.m_cbTipIndex++;
        });
        //要不起
        this.Items.Node_BarStatusCannotAfford.Items.Sprite_BtnDiscard.onClickAndScale(() => {
            yx.internet.DDZ_C_PASS_CARD({})
        });
        //超级加倍
        this.Items.Node_BarStatusDouble.Items.Sprite_BtnNegativeSuper.onClickAndScale(() => {
            if(center.user.getActorDiamond() > yx.internet.ddzBaseInfo.superdoubleDiamond){
                yx.internet.DDZ_C_DOUBLE({
                    times:yx.internet.ddzBaseInfo.superdoubletimes
                })
            }else{
                app.popup.showToast("钻石不足,请到商城购买")
            }
            
        });
        //加倍
        this.Items.Node_BarStatusDouble.Items.Sprite_BtnNegative.onClickAndScale(() => {
            yx.internet.DDZ_C_DOUBLE({
                times:yx.internet.ddzBaseInfo.doubletimes
            })
        });
        //不加倍
        this.Items.Node_BarStatusDouble.Items.Sprite_BtnPositive.onClickAndScale(() => {
            yx.internet.DDZ_C_DOUBLE({
                times:1
            })
        });
        //明牌
        this.Items.Node_BarStatusPublicCard.Items.Sprite_BtnPublic.onClickAndScale(() => {
            yx.internet.DDZ_C_SHOW_CARDS({
                times:yx.internet.ddzBaseInfo.showtimes
            })
        });
        //出牌
        this.Items.Node_BarStatusPublicOutCard.Items.Sprite_BtnOutCard.onClickAndScale(() => {
            this.checkPopCard()
        });

        //--------------------onfree----------------------//
        //开始游戏
        this.Items.Node_BarStyleForPrivate.Items.Sprite_ContinueBtn.onClickAndScale(() => {
            this.startGameAgain()
        });
        //换桌
        this.Items.Node_BarStyleForHappy.Items.Sprite_ChangeRoom.onClickAndScale(() => {
            this.startGameAgain()
        });
        //准备
        this.Items.Node_BarStyleForHappy.Items.Sprite_GetReady.onClickAndScale(() => {
            this.startGameAgain()
        });
    }
    //再来一局
    startGameAgain(){
        gameCenter.user.clean();
        this.resetActionBarOnFree()
        this.clearOneGame()
        gameCenter.room.sendEnterMatchREQ(app.gameManager.room_id)
    }
    //出牌判断，正确则发送出牌命令
    checkPopCard(){
        this.updateDisplayOfOutCardBtn()
        var cardData:number[] = []
        var cardType:number = -1
        var tempCache = yx.func.cardDatasFromVector(this.m_vecPopCache)
        if(tempCache.length == 0){
            app.popup.showToast("请至少选1张牌")
            return
        }
        console.log("checkPopCard POP LEN :",tempCache.length)
		cardData = this.logic.resortZOrderForOutCard(tempCache, tempCache.length )

        if(cardData.length != 0){
            var maxCardInfo = yx.internet.m_MaxCardInfo
            var isLarger = false
            cardType = this.logic.GetCardType(cardData, cardData.length)
            if(cardType == yx.config.OutCardType.Quadplex_Two_special ){
                if(maxCardInfo.nType != -1){
                    //不是首出就直接用上家牌型来对比
                    cardType = maxCardInfo.nType
                }else{
                    //首出时候可选飞机或者四带二
                    this.showChoseCardLayout(cardData)
                    return
                }
            }
            isLarger = this.logic.CompareCard(maxCardInfo.cardData, maxCardInfo.cardCount, cardData, cardData.length,maxCardInfo.nType,cardType)
            if  (cardType == -1 || ! isLarger){
                if(cardType == -1 ){
                    this.displayHandsAnalyseTips(true, yx.config.HandsAnalyseTipType.HandsAnalyseTipType_InvalidCard)
                }else{
                    this.displayHandsAnalyseTips(true, yx.config.HandsAnalyseTipType.HandsAnalyseTipType_NoAvaliableCard)
                }
                this.scheduleOnce(function(){
                    this.displayHandsAnalyseTips(false)
                },0.4)
                return;
            }
            this.clearPopCardCache()
            yx.internet.DDZ_C_OUT_CARD({
                cards:cardData,
                cardtype: cardType
            })
            this.putDownAllHandCard()
        }
    }

    //是否展示选牌型界面
    showChoseCardLayout(cardData?:number[]){
        let self = this
        var createrCard = function(parentNode:ccNode,carddata:number[]){
            for(let i=0;i<carddata.length;i++){
                var card = self.getOneCardByData(carddata[i],yx.config.CardSizeType.CardSizeType_OutCard)
                parentNode.addChild(card)
                card.setPosition(yx.config.OUT_CARD_SIZE.width*(i+0.5),-yx.config.OUT_CARD_SIZE.height+20)
            }                
        }
        this.hideChoseCardLayout()
        this.loadBundleRes(fw.BundleConfig.Landlord.res[`ui/main/reuse/node_multiple_choose_card`], (res: Prefab) => {
            let layout = instantiate(res);
            if(!fw.isNull(layout)){
                this.viewZOrderNode[this.viewZOrder.Anim].addChild(layout)
                var tScale = yx.config.changeOldResScale
                layout.scale = v3(tScale, tScale, tScale)
                this.mChoseCardNode = layout

                let planeTemp  = this.logic.resortZOrderForOutCard(cardData, cardData.length ,yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards)
                createrCard(layout.Items.Node_1,planeTemp)
                layout.Items.Sequence_Of_Triplets_Layout.onClickAndScale(() => {
                    this.clearPopCardCache()
                    yx.internet.DDZ_C_OUT_CARD({
                        cards:planeTemp,
                        cardtype: yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards
                    })
                    this.putDownAllHandCard()
                    this.hideChoseCardLayout()
                });

                let quadplexTemp  = this.logic.resortZOrderForOutCard(cardData, cardData.length ,yx.config.OutCardType.Quadplex_Attached_Two_Pairs)
                createrCard(layout.Items.Node_2,quadplexTemp)
                layout.Items.Quadplex_Attached_Two_Pairs_Layout.onClickAndScale(() => {
                    this.clearPopCardCache()
                    yx.internet.DDZ_C_OUT_CARD({
                        cards:quadplexTemp,
                        cardtype: yx.config.OutCardType.Quadplex_Attached_Two_Pairs
                    })
                    this.putDownAllHandCard()
                    this.hideChoseCardLayout()
                });
            }
        });
    }
    //隐藏选牌型界面
    hideChoseCardLayout(){
      
        if(this.mChoseCardNode != null){
            this.mChoseCardNode.removeFromParent(true)
            this.mChoseCardNode = null
        }
    }
    //创建卡牌触摸屏
    initCardTouchLayerEvent(){
        let self = this
        var touchEventType = "selCard" //选牌
        var m_TouchPointStart = new Vec2(0,0)
        var isTouchCard = false
        var _onTouchBegan = function(touch){
            console.log("touch:",touch)
            touch.preventSwallow = true;
            // --移除多种牌型选择框
            // if this.m_gameLayer then
            //     this.m_gameLayer:removeChooseCardNode()
            // end
            // var size = self.Items.cardTouchLayout.getComponent(UITransform).contentSize
            // var rect = new Rect(0, self.Items.node_handCard.worldPosition.y, size.width, 335 - self.Items.node_handCard.worldPosition.y)
            
            m_TouchPointStart = touch.getUILocation()
            touchEventType = "selCard"
            isTouchCard = false
            for(var i=0;i<this.m_HandCardNode.length;i++){
                var card = this.m_HandCardNode[i]
                var cardRect = card.getComponent("card_Landlord").getTouchRect()
                if(cardRect.contains(m_TouchPointStart)){
                    isTouchCard = true
                    break;  
                }
            }
            if(isTouchCard){
                return true
            }else{
                this.putDownAllHandCard()
                this.hideChoseCardLayout()
                return false
            }
        }

        var _onTouchMove = function(touch, event){
            if(!isTouchCard){
                return
            }
            console.log("_onTouchMove")
            var touchPos = touch.getUILocation()
            var rectX = (touchPos.x < m_TouchPointStart.x) ? touchPos.x : m_TouchPointStart.x
            var rectY = (touchPos.x < m_TouchPointStart.x) ? touchPos.y : m_TouchPointStart.y
            var rectW = Math.abs(m_TouchPointStart.x - touchPos.x)
            var rectH = Math.abs(m_TouchPointStart.y - touchPos.y)
            var rect = new Rect(rectX, rectY, rectW, rectH)
            this.m_vecSelectedCache = []

            var preTouchEventType = touchEventType
            
            if (touchPos.y > yx.config.OUT_CARD_OFFSET_Y + this.Items.node_handCard.worldPosition.y + 20 &&  this.getGameStatus() == yx.config.GameState.PLAY ){
                touchEventType = "outCard" // 出牌
            }else{
                touchEventType = "selCard"
            }
            for(var i=0;i<this.m_HandCardNode.length;i++){
                var card = this.m_HandCardNode[i]
                var cardRect = card.getComponent("card_Landlord").getTouchRect()
                var tempRect = cardRect
                if(i != (this.m_HandCardNode.length-1)){
                    tempRect.width = yx.config.CARD_PADDING_OF_HAND_CARDS
                }
                var isIntersect =  tempRect.intersects(rect);
                if(card){
                    if(touchEventType == "selCard"){
                        card.getComponent("card_Landlord").setSelected(isIntersect)
                        if(isIntersect){
                            this.m_vecSelectedCache.push(card)
                        }
                    }else if(touchEventType == "outCard"){
                        card.getComponent("card_Landlord").setSelected(false)
                    }
                }
            }
            if(touchEventType != preTouchEventType){
                if(preTouchEventType == "selCard"){
                    // if(!fw.isNull(this.mDragCardNode) ){
                    //     this.mDragCardNode.removeFromParent()
                    //     this.mDragCardNode = null
                    // }
                    // this.mDragCardNode = new ccNode()
                    // this.Items.node_handCard.addChild(this.mDragCardNode)
                    // this.mDragCardNode.setSiblingIndex(999)
                    // this.mDragCardNode.setScale(new Vec3(0.8,0.8,0.8))
                    // var tempCache = yx.func.cardDatasFromVector(this.m_vecPopCache)
				    // var cbTempCardData = this.logic.resortZOrderForOutCard(tempCache, tempCache.length)
                    // var length = tempCache.length
                    // var startX = -((length - 1) * yx.config.CARD_PADDING_OF_HAND_CARDS + yx.config.CARD_SIZE.width) / 2 
                    // for(var i=0;i<length;i++){
                    //     if(yx.func.verification(cbTempCardData[i])){
                    //         var card = this.getOneCardByData(cbTempCardData[i],yx.config.CardSizeType.CardSizeType_Hands)
                    //         card.setSiblingIndex(i)
                    //         this.mDragCardNode.addChild(card)
                    //         card.setPosition(startX+(i)*yx.config.CARD_PADDING_OF_HAND_CARDS,-yx.config.CARD_SIZE.height/2)
                    //         if(i==length-1){
                    //             card.getComponent("card_Landlord").setLogoVisible(true)
                    //         }
                    //     }else{

                    //     }
                    // }
                }else if(preTouchEventType == "outCard"){
                    if(!fw.isNull(this.mDragCardNode) ){
                        this.mDragCardNode.removeFromParent()
                        this.mDragCardNode = null
                    }
            
                }
            }

            if(touchEventType == "outCard"){
                if(!fw.isNull(this.mDragCardNode) ){
                    var worldPosy =  touch.getUILocation().y -this.Items.node_handCard.worldPosition.y
                    var worldPosx =  touch.getUILocation().x -this.Items.node_handCard.worldPosition.x 
                    this.mDragCardNode.setPosition(worldPosx,worldPosy)
                }
            }
        }
        
        var _onTouchEnded = function(touch, event){
            if(!isTouchCard){
                return
            }
            console.log("_onTouchEnded")
            touch.preventSwallow = true;
            self.hideChoseCardLayout()
            var tmpFun = function(){
                var  touchPos = touch.getUILocation()
                var moveDelta = new Vec2(touchPos.x - m_TouchPointStart.x, touchPos.y - m_TouchPointStart.y)
                if(Math.abs(moveDelta.x) <= yx.config.CARD_GESTURE_TAP_OFFSET_MAX && Math.abs(moveDelta.y) <= yx.config.CARD_GESTURE_TAP_OFFSET_MAX ){
                    var rectVectorSize = self.m_HandCardNode.length
                    var cardData = 0x00
                    var pCard = null
                    for(var i=(rectVectorSize-1);i>=0;i--){
                        var card = self.m_HandCardNode[i]
                        var cardRect = card.getComponent("card_Landlord").getTouchRect()
                        var isContains = cardRect.contains(m_TouchPointStart)
                        if (isContains && card ){
                            cardData = card.getComponent("card_Landlord").getCardData()
                            pCard = card
                            var popState = card.getComponent("card_Landlord").getStatusPop()
                            card.getComponent("card_Landlord").setPop(! popState)
                            card.getComponent("card_Landlord").setSelected(false)
                            break
                        }
                    }
                    self.updateDisplayOfOutCardBtn()

                    self.m_vecSelectedCache = []

                    //扑克已经移除，或者已经落下，不在通过搜索弹起
                    if (fw.isNull(pCard)  || (pCard.getComponent("card_Landlord").getStatusPop() == false) ){
                        return
                    }

                    //弃牌阶段禁用 滑动出牌
                    if  (self.getGameStatus() == yx.config.GameState.PLAY){
                        //区间搜索出牌
					    self.regionSearch(cardData)
                    }else{
                        var pSelectedCard = [cardData]
                        var nSelectedLen = pSelectedCard.length
                        yx.func.popCardsByData(pSelectedCard, nSelectedLen,self.m_HandCardNode,null, 0)
					}
                      
                    return
                }

                var TryData = function(){
                    for(var i=0;i<self.m_vecSelectedCache.length;i++){
                        var isPop = self.m_vecSelectedCache[i].getComponent("card_Landlord").getStatusPop()
                        self.m_vecSelectedCache[i].getComponent("card_Landlord").setPop(! isPop)
                    }
                }
    
                try {
                    TryData();
                } catch (error) {
                    console.error("Error occurred: " + error);
                    return;
                }

                for(var i=0;i<self.m_HandCardNode.length;i++){
                    self.m_HandCardNode[i].getComponent("card_Landlord").setSelected(false)
                }

                if(self.getGameStatus() == yx.config.GameState.PLAY){
                    self.slidingSearch()
                }else{
                    self.m_vecSelectedCache = []
                }

                self.updateDisplayOfOutCardBtn()
            }

            

            if(touchEventType == "outCard"){
                if(!fw.isNull(self.mDragCardNode) ){
                    self.mDragCardNode.removeFromParent()
                    self.mDragCardNode = null
                }
                var tempCache = yx.func.cardDatasFromVector(self.m_vecPopCache)
               
                var cbTempCardData = self.logic.resortZOrderForOutCard(tempCache, tempCache.length)
                tempCache = []
                if(cbTempCardData.length != 0){
                    // var maxCardInfo = yx.internet.m_MaxCardInfo
                    // var isLarger = false
	                // var cardDataType = -1
                    // cardDataType = self.logic.GetCardType(cbTempCardData, cbTempCardData.length)
                    // isLarger = self.logic.CompareCard(maxCardInfo.cardData, maxCardInfo.cardCount, cbTempCardData, cbTempCardData.length)
                    // if  (cardDataType == -1 || ! isLarger){
                    //     self.displayHandsAnalyseTips(true, yx.config.HandsAnalyseTipType.HandsAnalyseTipType_InvalidCard)
                    //     self.scheduleOnce(function(){
                    //         self.displayHandsAnalyseTips(false)
                    //         self.putDownAllHandCard()
                    //     },0.4)
                    // }
                    // self.clearPopCardCache()
                    // yx.internet.DDZ_C_OUT_CARD({
                    //     cards:cbTempCardData,
                    //     cardtype: cardDataType
                    // })
                    // self.putDownAllHandCard()
                }else{
                    tmpFun()
                }
                 
            }else{
                tmpFun()
            }
        }

        var _onTouchCancel = function(touch, event){
            if(!isTouchCard){
                return
            }
            console.log("_onTouchCancel")
            _onTouchEnded(touch, event)
            this.markRegionCardData(0x00)
            if(!fw.isNull(this.mDragCardNode) ){
                this.mDragCardNode.removeFromParent()
                this.mDragCardNode = null
            }
        }
        this.Items.cardTouchLayout.on(NodeEventType.TOUCH_START, _onTouchBegan, this);
        this.Items.cardTouchLayout.on(NodeEventType.TOUCH_MOVE, _onTouchMove, this);
        this.Items.cardTouchLayout.on(NodeEventType.TOUCH_END, _onTouchEnded, this);
        this.Items.cardTouchLayout.on(NodeEventType.TOUCH_CANCEL, _onTouchCancel, this);
    }
    //展示操作按钮
    showOperateBtn(type:number,time:number,callback?:Function,data?:any,noClockAni?:boolean){
        this.resetActionBar()
        let barNode:ccNode = null
        switch(type){
            /* 叫地主状态(不叫 or 叫地主) */
            case yx.config.ActionBarStatus.ActionBarStatus_CallLandlord: {
                barNode = this.Items.Node_BarStatusCallLandlord
                break;
            }
            /* 抢地主状态(不抢 or 抢地主) */
            case yx.config.ActionBarStatus.ActionBarStatus_GrabLandlord: {
                barNode = this.Items.Node_BarStatusGrabLandlord
                break;
            }
            /* 要得起状态(不打 or 出牌 or 提示) */
            case yx.config.ActionBarStatus.ActionBarStatus_CanAfford: {
                barNode = this.Items.Node_BarStatusCanAfford
                break;
            }
            /* 要不起 */
            case yx.config.ActionBarStatus.ActionBarStatus_CannotAfford: {
                barNode = this.Items.Node_BarStatusCannotAfford
                break;
            }
            /* 加倍(不加倍 or 加倍) */
            case yx.config.ActionBarStatus.ActionBarStatus_Double: {
                barNode = this.Items.Node_BarStatusDouble
                if(data){
                    var bmt = this.Items.Node_BarStatusDouble.Items.Sprite_BtnNegative.Items.bmt
                    bmt.updateSprite(fw.BundleConfig.Landlord.res[`img/table/btn/${data[0] == 4 ? `yxc_img_x4` : `yxc_img_x2`}/spriteFrame`])
                    

                    var bmt1 = this.Items.Node_BarStatusDouble.Items.Sprite_BtnNegativeSuper.Items.bmt
                    bmt1.updateSprite(fw.BundleConfig.Landlord.res[`img/table/btn/${data[1] == 4 ? `yxc_img_x4` : `yxc_img_x2`}/spriteFrame`])
                    
                }
                break;
            }
            /* 明牌(明牌xn) */
            case yx.config.ActionBarStatus.ActionBarStatus_PublicCard: {
                barNode = this.Items.Node_BarStatusPublicCard
                if(data){
                    var bmt = this.Items.Node_BarStatusPublicCard.Items.bmt
                    bmt.updateSprite(fw.BundleConfig.Landlord.res[`img/table/btn/${data == 4 ? `yxc_img_x4` : `yxc_img_x2`}/spriteFrame`])
                    
                }
                break;
            }
            /* 只能 出牌 */
            case yx.config.ActionBarStatus.ActionBarStatus_PublicOutCard: {
                barNode = this.Items.Node_BarStatusPublicOutCard
                break;
            }
            default: {
                break;
            }
        }
        if(!fw.isNull(barNode)){
            barNode.active = true
            let needAni = noClockAni ? false : true
            yx.func.setTimerSchedule(barNode.Items["node_clock"], time, callback,needAni);
        }
    }
    //展示空闲状态按钮(开始游戏,准备,换桌)
    showStartGameBtn(type:number){
        this.resetActionBarOnFree()
        switch(type){
            /* 只有开始游戏 */
            case yx.config.FreeActionBarStatus.FreeActionBarStatus_Start: {
                this.Items.Node_BarStyleForPrivate.active = true
                break
            }
            /* 可换桌可准备 */
            case yx.config.FreeActionBarStatus.FreeActionBarStatus_ChangeAndReady: {
                this.Items.Node_BarStyleForHappy.active = true
                this.Items.Node_BarStyleForHappy.Items.Sprite_GetReady.active = true
                break
            }
            /* 已准备可换桌 */
            case yx.config.FreeActionBarStatus.FreeActionBarStatus_Change: {
                this.Items.Node_BarStyleForHappy.active = true
                this.Items.Node_BarStyleForHappy.Items.Sprite_GetReady.active = false
                break
            }
            default: {
                break
            }
        }
    }
    //玩家出牌命令
    didReceiveOutCard(data:proto.client_proto_ddz.IDDZ_S_OutCard){
        var cardData = cardData = this.logic.resortZOrderForOutCard(data.outcards, data.outcards.length ,data.cardtype)
        var cardType = data.cardtype
        var nChairID = data.outchair
        
        const ClientChairID = yx.func.getClientChairIDByServerChairID(nChairID);
        if(ClientChairID == 0){
            yx.func.removeCardByData(cardData,this.m_HandCardNode,this.m_HandCardData)
            this.resetHandCardPos()
        }else{
            this.player.setPlayerCardNumVisibleBySudCardNum(nChairID,true,cardData.length,true) 
            if(yx.internet.bMingpai[nChairID]){
                var mingpaiParent:ccNode = this.player.getMingpaiParent(nChairID)
                var tempCache = yx.func.cardDatasFromVector(mingpaiParent.children)
                for(var i=0;i<cardData.length;i++){
                    if (tempCache.indexOf(cardData[i]) != -1) {
                        tempCache.splice(tempCache.indexOf(cardData[i]),1)
                    }
                }
                this.didReceiveMingpai(nChairID,tempCache)
            }
        }

        var bTopSequence = (cardType == yx.config.OutCardType.Sequence && this.logic.GetCardFaceValue(cardData[0]) == 0x01)
        var bNewTurn = (yx.internet.m_MaxCardInfo.cbChairID == nChairID || yx.internet.m_MaxCardInfo.cbChairID == -1)
        var bSecondBomb = (cardType == yx.config.OutCardType.Bomb ||  cardType == yx.config.OutCardType.serial_bomb) 
        var isTeam = yx.internet.m_MaxCardInfo.cbChairID != yx.internet.landlordSeat && nChairID != yx.internet.landlordSeat &&  ! bNewTurn //上个打牌的是否是队友
        var bSpecialBomb = ! bNewTurn && this.logic.isSpecialBomb(cardType, bTopSequence, yx.internet.m_MaxCardInfo)  //如果是新一轮 出牌这个就不属于炸其他牌型
        var isShutCardType = this.logic.isShutCardType(cardData, cardData.length, cardType)
        let leaveHandCardNum = 20
        if(ClientChairID != 0){
            leaveHandCardNum = this.player.getCardNum(nChairID)
            if(leaveHandCardNum <= 6 && cardData.length > 6){
                isShutCardType = true
            }
        }else{
            leaveHandCardNum = this.m_HandCardNode.length
        }
        //处理音效
        
        if(isShutCardType){
            this.sound.playShutCardSound()
        }else{
            this.sound.playDiscard()
        }
        let  [bPlayAfford, nType] = this.logic.isPlayAffordSound(bNewTurn)
        if(bPlayAfford){
            let soundData:landlordSoundInitData = {
                // pActor : player:getActor(),
                tag : nType,
            }
            this.sound.playOutCardSound(soundData)
        }else{
            let soundData:landlordSoundInitData = {
                bFirstRound : this.m_bFirstRound ,
                nCardType : cardType,
                cbCardData : cardData,
                nCount : cardData.length,
                // pActor : player:getActor(),
                bTopSequence : bTopSequence,
                bSecondBomb : bSecondBomb,
                bSpecialBomb : bSpecialBomb,
                isTeam : isTeam
            }
            this.sound.playCardTypeSound(soundData)
        }

        if(leaveHandCardNum <= 2 && leaveHandCardNum > 0){
            this.scheduleOnce(()=>{
                let soundData:landlordSoundInitData = {
                    // pActor : player:getActor(),
                    nCount : leaveHandCardNum,
                }
                this.sound.playAlertorSound(soundData)
            },1)
        }
        if(bSecondBomb){
            this.showXbeiAni(2,data.toptimes)
        }
        this.ShowOutCard(nChairID,cardData,cardType,true)
    }
    //重设手牌位置
    resetHandCardPos(){
        yx.func.sortCard(this.m_HandCardNode)
        this.resetCardsPosition(this.m_HandCardNode.length)
        var cardsPos = this.m_vecCardsPosition
        for(var i=0;i<this.m_HandCardNode.length;i++){
            let card = this.m_HandCardNode[i]
            card.setPosition(cardsPos[i])
            card.setSiblingIndex(card.getComponent("card_Landlord").getCardLocalZOrder())
            card.getComponent("card_Landlord").showMarkAsLandlord(false)
            card.getComponent("card_Landlord").showMarkAsPublicCard(false)
            card.getComponent("card_Landlord").setLogoVisible(false)
            if(i==this.m_HandCardNode.length-1){
                card.getComponent("card_Landlord").setLogoVisible(true)
                card.getComponent("card_Landlord").showMarkAsLandlord(this.nLandlordId != -1 && yx.func.getClientChairIDByServerChairID(this.nLandlordId) == 0)
                if(yx.internet.bMingpai[yx.internet.nSelfChairID]){
                    card.getComponent("card_Landlord").showMarkAsPublicCard(true)
                }
            }
        }
        this.showBoomMask()
    }
    //展示出牌动画
    ShowOutCard(nChairID:number,cardData:number[],cardType:number,needAni:boolean){
        const ClientChairID = yx.func.getClientChairIDByServerChairID(nChairID);
        var posVecs = yx.func.getCardPositionForOutCard(ClientChairID,cardData.length)
        var outCardParent:ccNode = this.player.getOutCardParent(nChairID,true)
        var cardArr = []
        const tScale = yx.config.CARD_SCALE_OUT_CARDS
        for(var i=0;i<cardData.length;i++){
            var card = this.getOneCardByData(cardData[i],yx.config.CardSizeType.CardSizeType_OutCard)
            card.setScale(new Vec3(tScale,tScale,tScale))
            outCardParent.addChild(card)
            cardArr.push(card)
            if((cardType == yx.config.OutCardType.Sequence_Of_Triplets || cardType == yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards || cardType == yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Pairs) && needAni){
                card.setPosition(ClientChairID == 1 ? posVecs[cardData.length - 1] : posVecs[0])
                tween(card)
                    .to(0.2,{ position:posVecs[i] })
                    .start()
            }else{
                card.setPosition(posVecs[i])
            }
            if(i == cardData.length-1){
                card.getComponent("card_Landlord").setLogoVisible(true)    
            }else{
                card.getComponent("card_Landlord").setLogoVisible(false) 
            }
        }
        if(needAni){
            //牌堆整体表现
            if(cardType == yx.config.OutCardType.Sequence_Of_Triplets || cardType == yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards || cardType == yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Pairs){
                outCardParent.obtainComponent(UIOpacity).opacity =1 
                tween(outCardParent.obtainComponent(UIOpacity))
                    .to(0.05,{ opacity:255 })
                    .start()
            }else if(cardType == yx.config.OutCardType.Bomb || cardType == yx.config.OutCardType.LaiZiBomb || cardType == yx.config.OutCardType.Rocket || cardType == yx.config.OutCardType.serial_bomb){
                outCardParent.obtainComponent(UIOpacity).opacity =1 
                tween(outCardParent.obtainComponent(UIOpacity))
                    .to(0.05,{ opacity:255 })
                    .start()
                tween(outCardParent)
                    .call(() => {
                        outCardParent.setScale(new Vec3(1.5,1.5,1.5))
                    })
                    .delay(0.05)
                    .to(0.2,{ scale:new Vec3(0.95,0.95,0.95) }, { easing: 'sineOut' })
                    .to(0.1,{ scale:new Vec3(1,1,1) }, { easing: 'sineOut' })
                    .start()
            } else{
                outCardParent.obtainComponent(UIOpacity).opacity =1 
                tween(outCardParent.obtainComponent(UIOpacity))
                    .to(0.05,{ opacity:255 })
                    .start()
                tween(outCardParent)
                    .call(() => {
                        outCardParent.setScale(new Vec3(0.8,0.8,0.8))
                    })
                    .delay(0.05)
                    .to(0.2,{ scale:new Vec3(1,1,1) }, { easing: 'sineOut' })
                    .start()
            }
            //牌型特效
            this.playCardTypeEffect(nChairID,cardType,posVecs)
        }
    }
    //展示明牌
    didReceiveMingpai(nChairID:number,cardData:number[]){
        const ClientChairID = yx.func.getClientChairIDByServerChairID(nChairID);
        var posVecs = yx.func.getCardPositionForMingpai(ClientChairID,cardData.length)
        var mingpaiParent:ccNode = this.player.getMingpaiParent(nChairID,true)

        const tScale = 1
        for(var i=0;i<cardData.length;i++){
            var card = this.getOneCardByData(cardData[i],yx.config.CardSizeType.CardSizeType_PoolCard)
            card.setScale(new Vec3(tScale,tScale,tScale))
            mingpaiParent.addChild(card)
            card.setPosition(posVecs[i])
        }
    }
    //展示摊牌
    didReceiveTanpai(nChairID:number,cardData:number[]){
        const ClientChairID = yx.func.getClientChairIDByServerChairID(nChairID);
        var posVecs = yx.func.getCardPositionForTanCard(ClientChairID,cardData.length)
        var mingpaiParent:ccNode = this.player.getOutCardParent(nChairID,true)

        const tScale = yx.config.CARD_SCALE_OUT_CARDS
        for(var i=0;i<cardData.length;i++){
            var card = this.getOneCardByData(cardData[i],yx.config.CardSizeType.CardSizeType_OutCard)
            card.setScale(new Vec3(tScale,tScale,tScale))
            mingpaiParent.addChild(card)
            card.setPosition(posVecs[i])
        }
    }
    //牌型特效
    playCardTypeEffect(nChairID:number,cardType:number,posVecs:Vec3[],callback?:Function){
        const ClientChairID = yx.func.getClientChairIDByServerChairID(nChairID);
        var aniName:string = ""
        var parentNode:ccNode = this.viewZOrderNode[this.viewZOrder.Anim]
        var pos:Vec3= new Vec3(0,0,0)
        if(cardType == yx.config.OutCardType.Sequence){
            parentNode = this.player.getOutCardParent(nChairID)
            var pos1 = posVecs[Math.floor((posVecs.length-1)/2)]
            pos = new Vec3(pos1.x,pos1.y+40,pos1.z)
            aniName = "ani_node_shunzi"
        }else if(cardType == yx.config.OutCardType.Sequence_Of_Pairs){
            parentNode = this.player.getOutCardParent(nChairID)
            var pos1 = posVecs[Math.floor((posVecs.length-1)/2)]
            pos = new Vec3(pos1.x,pos1.y+40,pos1.z)
            aniName = "ani_node_liandui"
        }else if(cardType == yx.config.OutCardType.Sequence_Of_Triplets || cardType == yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards || cardType == yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Pairs){
            aniName = "ani_node_feiji"
        }else if(cardType == yx.config.OutCardType.softBomb || cardType == yx.config.OutCardType.Bomb || cardType == yx.config.OutCardType.LaiZiBomb ){
            aniName = "ani_node_zhadan"
        }else if(cardType == yx.config.OutCardType.Rocket  ){
            aniName = "ani_node_huojian"
        }else if(cardType == yx.config.OutCardType.serial_bomb || cardType == yx.config.OutCardType.Quadplex_Two_special ){
            aniName = "ani_node_lianzha"
        }
        if(aniName != ""){
            this.loadBundleRes(fw.BundleConfig.Landlord.res[`ui/anim/`+aniName], (res: Prefab) => {
                let aniNode = instantiate(res);
                if(!fw.isNull(aniNode)){
                    parentNode.addChild(aniNode)
                    if(aniName == "ani_node_shunzi" || aniName == "ani_node_liandui" ){
                        if(ClientChairID == 1){
                            aniNode.Items.Node_zuo.active = false
                        }else{
                            aniNode.Items.Node_you.active = false
                        }
                    }
                    aniNode.setPosition(pos)
                    var tScale = yx.config.changeOldResScale
                    aniNode.scale = v3(tScale, tScale, tScale)
                    const a = aniNode.getComponent(Animation);
                    
                    a.on(Animation.EventType.FINISHED, () => {
                        aniNode.removeFromParent(true)
                    });
                    a.play(aniName);
                    let soundData:landlordSoundInitData = {
                        nCardType : cardType
                    }
                    this.sound.playCardTypeEffect(soundData)
                }
            });
        }
        
    }
    //发牌命令
    didReceiveSendCard(cardData:number[],isAni?:boolean){
        this.m_HandCardData = cardData
        for(var i=0;i<cardData.length;i++){
            var node = this.getOneCardByData(cardData[i],yx.config.CardSizeType.CardSizeType_Hands)
            if(!fw.isNull(node)){
                this.m_HandCardNode.push(node)
            }
            
            // this.Items.node_handCard.addChild(node)
        }
        yx.func.sortCard(this.m_HandCardNode)
        this.resetCardsPosition(cardData.length)
        if(isAni){
            this.sendCardAni(true,3,null,2)
        }else{
            this.Items.node_handCard.setPosition(this.getGameManagerPostion(this.m_HandCardNode.length-1))
            for(let i=0;i<this.m_HandCardNode.length ;i++){
                var card = this.m_HandCardNode[i]
                if(!fw.isNull(card)){
                    this.Items.node_handCard.addChild(card)
                    var targetPos = this.m_vecCardsPosition[i]
                    card.setPosition(targetPos)
                    card.getSiblingIndex(card.getComponent("card_Landlord").getCardLocalZOrder())
                }
            }
            this.resetHandCardPos()
        }
    }

    markRegionCardData(data:number,data2?:number){
        if(data == 0x00){
            this.m_RegionData = [0,0]
        }else{
            this.m_RegionData[0] = data
            this.m_RegionData[1] = data2
        }
    }

    clearPopCardCache(){
        this.m_vecPopCache = []
    }

    putDownAllHandCard(vec?:ccNode[]){
         if(!vec){
            vec = this.m_HandCardNode
         }
         for(var i=0;i<vec.length;i++){
            var card = vec[i]
            if(!fw.isNull(card)){
                if(card.getComponent("card_Landlord").getStatusPop()){
                    card.getComponent("card_Landlord").setPop(false)
                    card.getComponent("card_Landlord").setSelected(false)
                }else{
                    card.getComponent("card_Landlord").setSelected(false)
                }
            }
         }
         this.clearPopCardCache()
    }

    displayHandsAnalyseTips(isShow:boolean, type?:number){
        if(isShow){
            this.Items.node_no_card_bigger_than_others.active = true
            if(type == yx.config.HandsAnalyseTipType.HandsAnalyseTipType_NoAvaliableCard){
                this.Items.nobiggerLabel.string = "没有大于上家的牌"
            }else if(type == yx.config.HandsAnalyseTipType.HandsAnalyseTipType_InvalidCard){
                this.Items.nobiggerLabel.string = "不符合出牌规则"
            }
        }else{
            this.Items.node_no_card_bigger_than_others.active = false
        }
    }

    getMaxCardDataInfo(){
        return  yx.internet.m_MaxCardInfo
    }
    //滑动搜索
    slidingSearch(){
        let self = this
        //获取选中扑克的数据
        var pSelectedCard = yx.func.cardDatasFromVector(self.m_vecSelectedCache)
        var nSelectedLen = pSelectedCard.length

        //获取弹起扑克的数据
        self.updateDisplayOfOutCardBtn()
        var pPopCard = yx.func.cardDatasFromVector(self.m_vecPopCache)
        var nPopCardLen = pPopCard.length
        var popCardType = this.logic.GetCardType(pPopCard,nPopCardLen)
        if(popCardType == yx.config.OutCardType.Sequence){
            return
        }
    
	    var [pUnionCard,nUnionCardLen] = this.logic.mergeCardData(pSelectedCard, nSelectedLen, pPopCard, nPopCardLen)

        //如果是特殊牌型弹出提示语(双炸、飞机带炸)
	    var unionCardType = this.logic.GetCardType(pUnionCard,nUnionCardLen,false)
        if(unionCardType == yx.config.OutCardType.Quadplex_Two_special ){
            //显示特殊牌型提示语
            this.showGameTip("special")
            //tipsFunc.newHintTip("带牌包含'炸弹'，但不算'炸弹'，请谨慎出牌!")
        }else if(unionCardType == yx.config.OutCardType.Quadplex_Attached_Two_Pairs){
            //四带两对 两对是炸弹
		    var AnalyseResult = this.logic.AnalyzeCardData(pUnionCard,nUnionCardLen)
		
            if(AnalyseResult.cbQuadrupleCount > 1){
                this.showGameTip("special")
                // tipsFunc.newHintTip("带牌包含'炸弹'，但不算'炸弹'，请谨慎出牌!")
            }
        }else if(unionCardType == yx.config.OutCardType.Quadplex_Attached_Two_Cards){
            //四带二 (带王炸)
		    var AnalyseResult = this.logic.AnalyzeCardData(pUnionCard,nUnionCardLen)
		
            if(AnalyseResult.bContainsRocket == true){
                this.showGameTip("special")
                // tipsFunc.newHintTip("带牌包含'炸弹'，但不算'炸弹'，请谨慎出牌!")
            }
        }else if(unionCardType == yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards){
            //--飞机带炸弹(炸弹在飞机本身)
		    var AnalyseResult = this.logic.AnalyzeCardData(pUnionCard,nUnionCardLen)
		
            if(AnalyseResult.cbQuadrupleCount > 0 || AnalyseResult.bContainsRocket == true ){
                this.showGameTip("special")
                // tipsFunc.newHintTip("带牌包含'炸弹'，但不算'炸弹'，请谨慎出牌!")
            }
        }else if(unionCardType == yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Pairs){
            //飞机带炸弹(炸弹是对子)
		    var AnalyseResult = this.logic.AnalyzeCardData(pUnionCard,nUnionCardLen)
		
            if(AnalyseResult.cbQuadrupleCount > 0){
                this.showGameTip("special")
                // tipsFunc.newHintTip("带牌包含'炸弹'，但不算'炸弹'，请谨慎出牌!")
            }
        }
       
        var outType = yx.internet.m_MaxCardInfo.nType
	    //只有顺子、连对进行划牌搜索
        
        if(outType == yx.config.OutCardType.Sequence 
            || outType == yx.config.OutCardType.Sequence_Of_Pairs 
            || outType == yx.config.OutCardType.Arbitrary 
        ){
            var selectCardType = this.logic.GetCardType(pSelectedCard,nSelectedLen)
		    //只有在划的牌不能组成牌型时再去搜索
            if(selectCardType == yx.config.OutCardType.Invalid){
                var [bFind,searchResult,cbHitCount] = this.logic.SearchOutCard(pSelectedCard, nSelectedLen, yx.internet.m_MaxCardInfo.cardData, yx.internet.m_MaxCardInfo.cardCount, yx.config.SearchMode.SearchMode_Sliding,false, yx.internet.m_MaxCardInfo.nType)
                if (cbHitCount > 0 ){
                    this.putDownAllHandCard()
                    //有具体的压牌牌型，按最小能压的来出
                    yx.func.popCardsByData(searchResult[0].cbResultCard, searchResult[0].cbCardCount,self.m_HandCardNode,null, this.logic.getLaiZiCardData())
                }
            }
        }
        this.m_vecSelectedCache = []
    }
    //区间搜索
    regionSearch(cbCurrentCardData:number){
        let self = this
        this.updateDisplayOfOutCardBtn()
        if(yx.internet.m_MaxCardInfo.nType == -1){
            console.log("LH1",yx.func.cardDatasFromVector(this.m_vecPopCache))
            if(this.m_vecPopCache.length == 1 || this.m_vecPopCache.length == 2){
                this.markRegionCardData(cbCurrentCardData)
            }
            if(this.m_vecPopCache.length == 2){
                let regionData = yx.func.cardDatasFromVector(this.m_vecPopCache)
                this.logic.SortCardData(regionData,regionData.length)  
                this.markRegionCardData(regionData[0],regionData[1])
                console.log("LH2",this.m_RegionData[0],this.m_RegionData[1])
                if(this.m_RegionData[0] != 0x00 && this.m_RegionData[1] != 0x00){
                    var cbHandsData = yx.func.cardDatasFromVector(this.m_HandCardNode)
                    var cbHandsLen = cbHandsData.length

                    var cbRegionData = this.logic.GetRegionData(this.m_RegionData[0], this.m_RegionData[1], cbHandsData, cbHandsLen)
                    var cbRegionLen = cbRegionData.length

                    var pFuncOfPopCards = function(cbCardData:number[], cbCardCount:number){
                        self.putDownAllHandCard()
                        yx.func.popCardsByData(cbCardData, cbCardCount,self.m_HandCardNode,null, self.logic.getLaiZiCardData())
                        self.updateDisplayOfOutCardBtn()
                    }

                    var vecSortUnit = []
                    var vecResultData = []

                    //优先级配置（值越小，优先级越高）
                    var arrTypePriority = [
                        yx.config.OutCardType.Sequence_Of_Pairs,
                        yx.config.OutCardType.Sequence,
                        yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Pairs,
                        yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards,
                        yx.config.OutCardType.Quadplex_Attached_Two_Pairs,
                        yx.config.OutCardType.Quadplex_Attached_Two_Cards,
                        yx.config.OutCardType.Sequence_Of_Triplets,
                        yx.config.OutCardType.Triplet_Attached_Pair,
                        yx.config.OutCardType.Triplet_Attached_Card,
                        yx.config.OutCardType.Triplet,
                        yx.config.OutCardType.Bomb,
                        yx.config.OutCardType.Rocket,
                        yx.config.OutCardType.Double
                    ]

                    
                    var [bFind, regionResult, regionResultCount] = this.logic.RegionSearch(cbHandsData,cbHandsLen,this.m_RegionData[0], this.m_RegionData[1], yx.internet.m_MaxCardInfo.cardData, yx.internet.m_MaxCardInfo.cardCount,yx.internet.m_MaxCardInfo.nType)
                    
                    if(bFind){
                        for (let i=0;i<regionResultCount;i++ ){
                            var tag = "RegionSearch"
                            var cardType = this.logic.GetCardType(regionResult[i].cbResultCard, regionResult[i].cbCardCount)
                            var map = {
                                first : i,
                                second : cardType
                            }
                            vecSortUnit.push( map)

                            var vec = []
                            for (let j=0;j<regionResult[i].cbCardCount;j++ ){
                                vec.push(regionResult[i].cbResultCard[j])
                            }
                            vecResultData.push(vec)
                        }

                        var priorityOfType = function(cardType){
                            for (let i=0;i<arrTypePriority.length;i++ ){
                                if (arrTypePriority[i] == cardType ){
                                    return i
                                }
                            }
                            return -1
                        }

                        var sortFunc = function(lhs, rhs) {
                            var lhsIDX = lhs.first;
                            var lhsType = lhs.second;
                        
                            var rhsIDX = rhs.first;
                            var rhsType = rhs.second;
                        
                            if (priorityOfType(lhsType) < priorityOfType(rhsType)) {
                                return -1;
                            } else if (priorityOfType(lhsType) > priorityOfType(rhsType)) {
                                return 1;
                            } else {
                                var lHeadLogicValue = this.logic.GetCardLogicValue(vecResultData[lhsIDX][0]);
                                var rHeadLogicValue = this.logic.GetCardLogicValue(vecResultData[rhsIDX][0]);
                        
                                if (lHeadLogicValue < rHeadLogicValue) {
                                    return -1;
                                } else if (lHeadLogicValue > rHeadLogicValue) {
                                    return 1;
                                } else {
                                    return 0;
                                }
                            }
                        };
                        
                        vecSortUnit.sort(sortFunc.bind(this))

                        var bestResult = vecSortUnit[0]
                        var IDX = bestResult.first
                        var Type = bestResult.second
                        pFuncOfPopCards(regionResult[IDX].cbResultCard, regionResult[IDX].cbCardCount)
                    }
                }
                this.markRegionCardData(0x00)
            }
        }else{
            //TODO 有最大牌，压牌，此处进行半区间搜索
            var cbHandsData = yx.func.cardDatasFromVector(this.m_HandCardNode)
            var cbHandsLen = cbHandsData.length  
            
            //分析手牌扑克
            var analyseResult = this.logic.AnalyzeCardData(cbHandsData, cbHandsLen) //非拆牌结果
            var unorderResult = this.logic.AnalyzeCardDataUnOrder(analyseResult) //拆牌结果
            var outcardType = yx.internet.m_MaxCardInfo.nType
            if(outcardType == yx.config.OutCardType.Single){
                if(this.m_vecPopCache.length <= 1){
                    //TODO 没有弹起的扑克
                    var cbCardCount = 1
                    var cbCardData = [0]
                    var nCount = 0

                    nCount = unorderResult.cbSingleCount * 1
                    for (let i=0;i<nCount;i++){
                        if (cbCurrentCardData == unorderResult.cbSingleCardData[i] ){
                            var idx = Math.floor(i / 1)
                            cbCardData[0] = unorderResult.cbSingleCardData[idx]
                            break
                        }
                    }
                    if(cbCardData[0] != 0){
                        if (this.logic.GetCardLogicValue(cbCardData[0]) > this.logic.GetCardLogicValue(yx.internet.m_MaxCardInfo.cardData[0]) ){
                 
                            this.putDownAllHandCard()
                            yx.func.popCardsByData(cbCardData, cbCardCount,self.m_HandCardNode,null, this.logic.getLaiZiCardData())
                        }
                    }
                }
            }else if(outcardType == yx.config.OutCardType.Double){
                if(this.m_vecPopCache.length <= 1){
                    //TODO 没有弹起的扑克
                    var cbCardCount = 2
                    var cbCardData = [0,0]
                    var nCount = unorderResult.cbDoubleCount * 2

                    nCount = unorderResult.cbSingleCount * 1
                    for (let i=0;i<nCount;i++){
                        if (cbCurrentCardData == unorderResult.cbDoubleCardData[i] ){
                            var idx = i % 2 == 0 ? i : i-1
                            cbCardData[0] = unorderResult.cbDoubleCardData[idx]
                            cbCardData[1] = unorderResult.cbDoubleCardData[idx+1]
                            break
                        }
                    }
                    if(cbCardData[0] != 0){
                        if (this.logic.GetCardLogicValue(cbCardData[0]) > this.logic.GetCardLogicValue(yx.internet.m_MaxCardInfo.cardData[0]) ){
                 
                            this.putDownAllHandCard()
                            yx.func.popCardsByData(cbCardData, cbCardCount,self.m_HandCardNode,null, this.logic.getLaiZiCardData())
                        }
                    }
                }
            }else if(outcardType == yx.config.OutCardType.Triplet){
                if(this.m_vecPopCache.length <= 1){
                    //TODO 没有弹起的扑克
                    var cbCardCount = 3
                    var cbCardData:number[] = [0,0,0]
                    var nCount = 0

                    nCount = unorderResult.cbSingleCount * 1
                    for (let i=0;i<nCount;i++){
                        if (cbCurrentCardData == unorderResult.cbTripleCardData[i] ){
                            var idx = Math.floor(i/3) * 3 
                            cbCardData[0] = unorderResult.cbTripleCardData[idx]
                            cbCardData[1] = unorderResult.cbTripleCardData[idx+1]
                            cbCardData[2] = unorderResult.cbTripleCardData[idx+2]
                            break
                        }
                    }
                    if(cbCardData[0] != 0){
                        if (this.logic.GetCardLogicValue(cbCardData[0]) > this.logic.GetCardLogicValue(yx.internet.m_MaxCardInfo.cardData[0]) ){
                 
                            this.putDownAllHandCard()
                            yx.func.popCardsByData(cbCardData, cbCardCount,self.m_HandCardNode,null, this.logic.getLaiZiCardData())
                        }
                    }
                }
            }else if(outcardType == yx.config.OutCardType.Triplet_Attached_Card){

            }else if(outcardType == yx.config.OutCardType.Triplet_Attached_Pair){

            }
            this.updateDisplayOfOutCardBtn()
        }
    }
    getGameStatus() : number{
        return yx.internet.nGameState
    }

    updateDisplayOfOutCardBtn(){
        //刷新弹起缓存
        this.updatePopCache()
        //设置出牌按钮的置灰与否
        // if (this.m_vecPopCache.length == 0 ){
        //     this.disableAction(self.m_pActionDisCardSprite, true)
        // }else{
        //     this.disableAction(self.m_pActionDisCardSprite, false)
        // }
           
    }

    updatePopCache(){
        this.m_vecPopCache = []
        console.log("LH3",this.m_HandCardNode.length,yx.func.cardDatasFromVector(this.m_vecPopCache))
        for(var i=0;i<this.m_HandCardNode.length;i++){
            if(this.m_HandCardNode[i].getComponent("card_Landlord").getStatusPop() == true){
                this.m_vecPopCache.push(this.m_HandCardNode[i])
            }
        }
        console.log("LH4",yx.func.cardDatasFromVector(this.m_vecPopCache))
    }

    resetCardsPosition(nCardCount:number){
        if(nCardCount == 0){
            return
        }
        var gmWidth = 0
        var cardPaddingOfHandCards = 0
        var delX = 24
        this.m_mapGMPos = []
        this.m_vecCardsPosition = []
        if(nCardCount <= 17)  {
            yx.config.CARD_PADDING_TOTAL_OF_HAND_CARDS = 35
            gmWidth = (nCardCount - 1) * yx.config.CARD_PADDING_OF_HAND_CARDS + yx.config.CARD_SIZE.width
            cardPaddingOfHandCards = yx.config.CARD_PADDING_OF_HAND_CARDS
        }else{
            yx.config.CARD_PADDING_TOTAL_OF_HAND_CARDS = 30
            gmWidth = app.winSize.width - yx.config.CARD_PADDING_TOTAL_OF_HAND_CARDS
            cardPaddingOfHandCards = (app.winSize.width - yx.config.CARD_PADDING_TOTAL_OF_HAND_CARDS - yx.config.CARD_SIZE.width) / (nCardCount - 1)
        }
        
        for (var i=1;i<=(nCardCount + 1);i++){
            var tmp1 = (i == 1) ? 0 : 1
            var tmp2 = (i <= 2) ? 0 : (i - 1)
            var tmpGmWidth = yx.config.CARD_SIZE.width * tmp1 + cardPaddingOfHandCards * tmp2
            var pos1 = new Vec3((app.winSize.width - yx.config.CARD_PADDING_TOTAL_OF_HAND_CARDS - tmpGmWidth) / 2 + delX, this.Items.node_handCard.getPosition().y,1)
            this.m_mapGMPos.push(pos1)
        }

        this.Items.node_handCard.obtainComponent(UITransform).setContentSize(new Size(gmWidth,this.Items.cardTouchLayout.obtainComponent(UITransform).height))
        this.Items.node_handCard.setPosition(this.m_mapGMPos[nCardCount-1])
        for(var i=0;i<=(nCardCount - 1);i++){
            var pos2 = new Vec3(cardPaddingOfHandCards * i+10-app.winSize.width/2-yx.config.CARD_PADDING_TOTAL_OF_HAND_CARDS/2, 0,1)
            this.m_vecCardsPosition.push(pos2)

        }
       
        
    }

    //获取单张牌
    getOneCardByData(cardValue:number,cardType:number) : ccNode{
        // let res = this.loadBundleResSync(app.game.getRes('ui/main/reuse/node_poker'),Prefab)
        let res = this.loadBundleResSync(fw.BundleConfig.Landlord.res['ui/main/reuse/node_poker'], Prefab);
        //实例化对象
        let node :ccNode = null
        if(res){
            node= instantiate(res);
            let card_Landlord = node.getComponent("card_Landlord");
            card_Landlord.setCardData(cardValue,cardType)
        }
        

        return node
    }

    //获取卡牌父节点坐标
    getGameManagerPostion(cardCount:number) : Vec3{
        return this.m_mapGMPos[cardCount]
        
    }

    //发牌动画
    sendCardAni(isShow : boolean ,animationTime:number,sendCB?:Function, type ?: Number){
        var cbHandCache = this.m_HandCardNode
        var cardsPos = this.m_vecCardsPosition
        var  unitDelayTime = animationTime /cbHandCache.length
        let self = this
        var actionCallFuncOfGM = function(idx:number){
            var length = cbHandCache.length
            if(sendCB){
                sendCB(idx,length)
            }
            if(idx==(length-1)){
                var tem = cbHandCache[length-1]
                tem.getComponent("card_Landlord").setLogoVisible(true)    
            }
        }
        var showLight = function(idx:number){
            var length = cbHandCache.length
            if(idx==length-1){
                self.showBoomLightAni()
                self.showBoomMask()
            }
        }
        if(type == 3){
            var initPMPos = this.getGameManagerPostion(cbHandCache.length)
            this.Items.node_handCard.setPosition(initPMPos)

            for(let i=0;i<cbHandCache.length ;i++){
                var card = cbHandCache[i]
                if(!fw.isNull(card)){
                    this.Items.node_handCard.addChild(card)
                    var originPos = new Vec3(0,0)
                    var targetPos = new Vec3(0,0)
                    if(i!=0){
                        originPos = new Vec3(cardsPos[i - 1].x+app.winSize.width/2,cardsPos[i - 1].y,cardsPos[i - 1].z) 
                    }else{
                        originPos = new Vec3(cardsPos[i ].x+app.winSize.width/2,cardsPos[i ].y,cardsPos[i].z) 
                    }
                    targetPos = cardsPos[i]

                    card.setPosition(originPos)
                    card.obtainComponent(UIOpacity).opacity =1 
                    // card.setCascadeOpacityEnabled(true)
                    card.setSiblingIndex(card.getComponent("card_Landlord").getCardLocalZOrder())

                    var  delayTime = unitDelayTime * (i+1) 
                    tween(card)
                        .delay(delayTime)
                        .call(() => {
                            // card.obtainComponent(UIOpacity).opacity =255 
                            for(var p = 0;p<yx.internet.nMaxPlayerCount;p++){
                                const ClientChairID = yx.func.getClientChairIDByServerChairID(p);
                                if(ClientChairID != 0){
                                    this.player.setPlayerCardNumVisible(p,true,i+1,true)
                                }
                            }
                            this.sound.playSendCard()
                        })
                        .to(unitDelayTime, { position:targetPos })
                        .start();
                    tween(card.obtainComponent(UIOpacity))
                        .delay(delayTime)
                        .to(0, { opacity: 255 })
                                .start()
                        .start();
                    tween(this.Items.node_handCard)
                        .delay(delayTime)
                        .call(() => {
                            actionCallFuncOfGM(i)
                        })
                        .start();
                }
                
            }
        }else if(type == 2){
            unitDelayTime = unitDelayTime * 0.68
            var initPMPos = this.getGameManagerPostion(1)
            this.Items.node_handCard.setPosition(initPMPos)

            for(let i=0;i<cbHandCache.length ;i++){
                var card = cbHandCache[i]
                if(!fw.isNull(card)){
                    this.Items.node_handCard.addChild(card)
                    var originPos = new Vec3(0,0)
                    var targetPos = new Vec3(0,0)
                    if(i!=0){
                        originPos = new Vec3(cardsPos[i - 1].x,cardsPos[i - 1].y,cardsPos[i - 1].z) 
                    }else{
                        originPos = new Vec3(cardsPos[i ].x,cardsPos[i ].y,cardsPos[i].z) 
                    }
                    targetPos = cardsPos[i]

                    card.setPosition(originPos)
                    card.obtainComponent(UIOpacity).opacity =1 
                    // card.setCascadeOpacityEnabled(true)
                    card.getSiblingIndex(card.getComponent("card_Landlord").getCardLocalZOrder())
                    
                    var gmPos = this.getGameManagerPostion(i)
                    var delayTime = unitDelayTime * (i + 1)
                    var  delayTime = unitDelayTime * (i+1)
                    tween(card)
                        .delay(delayTime)
                        .call(() => {
                            // card.obtainComponent(UIOpacity).opacity =255 
                            for(var p = 0;p<yx.internet.nMaxPlayerCount;p++){
                                const ClientChairID = yx.func.getClientChairIDByServerChairID(p);
                                if(ClientChairID != 0){
                                    this.player.setPlayerCardNumVisible(p,true,i+1,true)
                                }
                            }
                        })
                        .to(unitDelayTime, { position:targetPos })
                        .start();
                    tween(card.obtainComponent(UIOpacity))
                        .delay(delayTime)
                        .to(0, { opacity: 255 })
                                .start()
                        .start();
                    tween(this.Items.node_handCard)
                        .delay(unitDelayTime * i)
                        .to(unitDelayTime, { position:gmPos })
                        .call(() => {
                            actionCallFuncOfGM(i)
                        })
                        .delay(0.2)
                        .call(() => {
                            showLight(i)
                        })
                        .start();
                }
                
            }
        }
    }
    
    //展示炸弹手牌亮光
    showBoomLightAni(){
        var rocketArr = [ ]
        var boomArr = []
        for(var i=0;i<this.m_HandCardNode.length;i++){
            var card = this.m_HandCardNode[i]
            var isJoker = card.getComponent("card_Landlord").isJoker()
            if(isJoker){
                rocketArr.push(card)
            }else{
                if(boomArr.length == 0){
                    boomArr.push(card)
                }else{
                    if(card.getComponent("card_Landlord").getCardFaceValue() == boomArr[0].getComponent("card_Landlord").getCardFaceValue()){
                        boomArr.push(card)
                    }else{
                        boomArr = []
                        boomArr.push(card)
                    }
                }
            }
            if(boomArr.length == 4){
                card.getComponent("card_Landlord").showBombLight(boomArr[0])
                boomArr = []
            }
        }
        if(rocketArr.length == 2){
            rocketArr[1].getComponent("card_Landlord").showBombLight(rocketArr[0])
            rocketArr = []
        }
        
    }
    //判断炸弹加上炸弹标签
    showBoomMask(){
        var boomArr = []
        for(var i=0;i<this.m_HandCardNode.length;i++){
            var card = this.m_HandCardNode[i]
            var isJoker = card.getComponent("card_Landlord").isJoker()
            if(isJoker){
            }else{
                if(boomArr.length == 0){
                    boomArr.push(card)
                }else{
                    if(card.getComponent("card_Landlord").getCardFaceValue() == boomArr[0].getComponent("card_Landlord").getCardFaceValue()){
                        boomArr.push(card)
                    }else{
                        boomArr = []
                        boomArr.push(card)
                    }
                }
            }
            card.getComponent("card_Landlord").markBoom(false)
            if(boomArr.length == 4){
                boomArr[0].getComponent("card_Landlord").markBoom(true)
                boomArr = []
            }
        }
    }
    //插入三张牌
    insertThreeCard(lastThreeCache:number[],nChairID:number){
        const ClientChairID = yx.func.getClientChairIDByServerChairID(nChairID);
        if(ClientChairID == 0){
            var arr = []
            for(var i=0;i<lastThreeCache.length;i++){
                var node = this.getOneCardByData(lastThreeCache[i],yx.config.CardSizeType.CardSizeType_Hands)
                this.m_HandCardNode.push(node)
                this.m_HandCardData.push(lastThreeCache[i])
                this.Items.node_handCard.addChild(node)
                arr.push(node)
            }
            this.resetHandCardPos()
            for(let i=0;i<arr.length;i++){
                let card = arr[i]
                card.getComponent("card_Landlord").setPop(true)
                tween(card)
                    .delay(1)
                    .to(0.3,{ position:new Vec3(card.getPosition().x,0,1)})
                    .call(()=>{
                        card.getComponent("card_Landlord").setPop(false)
                    })
                    .start()
            }
        }else{
            this.player.setPlayerCardNumVisible(nChairID,true,20,false) 
            if(yx.internet.bMingpai[nChairID]){
                var mingpaiParent:ccNode = this.player.getMingpaiParent(nChairID)
                var tempCache = yx.func.cardDatasFromVector(mingpaiParent.children)
                for(var i=0;i<lastThreeCache.length;i++){
                    tempCache.push(lastThreeCache[i])
                }
                this.logic.SortCardData(tempCache,tempCache.length,yx.config.CardSortOrder.DESC)                
                this.didReceiveMingpai(nChairID,tempCache)
            }
        }
    }
    //展示三张牌揭开后的动画
    showLastThreeCardAndMove(lastThreeCache:number[],nChairID?:number,isAni?:boolean){
        let needAni = isAni == false ? false : true
        let self = this
        this.Items.node_showThreeNormal.active = isAni 
        let startPosArr = []
        let endPosArr = []
        let showFun = (card:ccNode,bg:ccNode,baseBg:ccNode,endPos:Vec2,isLast:boolean)=>{
            tween(card)
                .hide()
                .delay(0.4)
                .show()
                .to(0.4, { scale: new Vec3(1.25,1.25,1.25) })
                
                .parallel(
                    tween().to(0.5, { scale: new Vec3(0.90,0.90,0.90)}),
                    tween().to(0.5, { position: new Vec3(endPos.x-2, endPos.y, 1) })
                )
                .call(() => {
                    card.removeFromParent()
                    baseBg.addChild(card)
                    card.setPosition(-2,0)
                })
                .start()
            
            tween(bg)
                .show()
                .to(0.4, { scale: new Vec3(0,1,0) })
                .call(() => {
                    if(isLast){
                        self.insertThreeCard(lastThreeCache,nChairID)
                    }
                    
                })
                .hide()
                .start()
        }
        if(needAni){
            for(let i=0;i<lastThreeCache.length;i++){
                let bg = this.Items.node_showThreeNormal.Items["Sprite_BaseCardBG_"+i]
                bg.active = true
                let bgPos = bg.getPosition()
                startPosArr.push(bgPos)
    
                let baseBg = this.Items.Layout_BaseCardPool.Items["Sprite_BaseCardBG_"+i]
                let endPos = new Vec2()
                endPos.x = bgPos.x + (baseBg.worldPosition.x -  bg.worldPosition.x)
                endPos.y = bgPos.y + (baseBg.worldPosition.y -  bg.worldPosition.y)
                endPosArr.push(endPos)
    
                let card = this.getOneCardByData(lastThreeCache[i],yx.config.CardSizeType.CardSizeType_PoolCard)
                card.getComponent("card_Landlord").getCardNode().setPosition(-27,-39)
                this.Items.node_showThreeAniNode.addChild(card)
                card.setScale(new Vec3(0,1.25,1.25))
                card.setPosition(bgPos.x,bgPos.y )
                
                showFun(card,bg,baseBg,endPos,i==lastThreeCache.length-1)
            }
        }else{
            for(let i=0;i<lastThreeCache.length;i++){
                let baseBg = this.Items.Layout_BaseCardPool.Items["Sprite_BaseCardBG_"+i]
                let card = this.getOneCardByData(lastThreeCache[i],yx.config.CardSizeType.CardSizeType_PoolCard)
                card.getComponent("card_Landlord").getCardNode().setPosition(-27,-39)
                card.setScale(new Vec3(0.90,0.90,0.90))
                baseBg.addChild(card)
                card.setPosition(-2,0)
            }
        }
        
        
    }
    //展示更多按钮
    onMoveBgClick(isActive?:boolean){
        if(isActive != null && isActive != this.Items.menu_bg.active){
            return
        }
        this.Items.menu_bg.active = !this.Items.menu_bg.active
    }
    //初始化时间
    initTimeLabel(){
        let self = this
        var setTimeLabel = function(){
            const now = new Date();
            const hours = now.getHours().toString().padStart(2, '0');
            const minutes = now.getMinutes().toString().padStart(2, '0');
            const time = `${hours}:${minutes}`;
            self.Items.Text_Time.string = time
        }

        setTimeLabel();
        if (this.schedule_updateTime) {
            this.clearIntervalTimer(this.schedule_updateTime);
            this.schedule_updateTime = null;
        }
        this.schedule_updateTime = this.setInterval(setTimeLabel, 1)
    }

    DDZ_S_MSG_USER_ENTER(data: proto.client_proto_ddz.IDDZ_S_UserEnter) {
        
    }
    DDZ_S_MSG_TIPS(data: proto.client_proto_ddz.IDDZ_S_Tips,bdouble?:boolean[]) {
        switch (data.type) {
            case proto.client_proto_ddz.DDZ_TIPS.DDZ_TIPS_START: {
                   this.clearOneGame()
                    break;
                }
            case proto.client_proto_ddz.DDZ_TIPS.DDZ_TIPS_SHOW_START: {
                    this.showOperateBtn(yx.config.ActionBarStatus.ActionBarStatus_PublicCard,data.countdown,null,yx.internet.ddzBaseInfo.showtimes,true)
                    break;
                }
            case proto.client_proto_ddz.DDZ_TIPS.DDZ_TIPS_CALL_START: {
                    this.resetActionBar()
                    let logicChair = yx.func.getClientChairIDByServerChairID(data.curchair)
                    if(logicChair == 0){
                        if(this.callPointTimes >= 3){
                            this.showOperateBtn(yx.config.ActionBarStatus.ActionBarStatus_GrabLandlord,data.countdown,null)
                        }else{
                            this.showOperateBtn(yx.config.ActionBarStatus.ActionBarStatus_CallLandlord,data.countdown,null)
                        }
                    }else{
                        this.player.setPlayerTimerVisible(data.curchair,true,data.countdown,null,true,true)
                    }
                    this.player.setPlayerCallStateVisible(data.curchair,false)
                    break;
                }
            case proto.client_proto_ddz.DDZ_TIPS.DDZ_TIPS_RESTART: {
                    this.clearOneGame()
                    break;
                }
            case proto.client_proto_ddz.DDZ_TIPS.DDZ_TIPS_DOUBLE_START: {
                    for(let i=0;i<yx.internet.nMaxPlayerCount;i++){
                        let needCountDown = bdouble && bdouble[i] == true ? false : true
                        if(needCountDown){
                            this.player.setPlayerCallStateVisible(i,false)
                            let logicChair = yx.func.getClientChairIDByServerChairID(i)
                            if(logicChair == 0){
                                this.showOperateBtn(yx.config.ActionBarStatus.ActionBarStatus_Double,data.countdown,null,[yx.internet.ddzBaseInfo.doubletimes,yx.internet.ddzBaseInfo.superdoubletimes],true)
                            }else{
                                this.player.setPlayerTimerVisible(i,true,data.countdown,null,null,true)
                            }
                        }
                    }
                    break;
                }
            case proto.client_proto_ddz.DDZ_TIPS.DDZ_TIPS_OUT_START: {
                    let logicChair = yx.func.getClientChairIDByServerChairID(data.curchair)
                    this.m_bFirstRound = data.bFirst
                    if(logicChair == 0){
                        if(data.bFirst){
                            this.showOperateBtn(yx.config.ActionBarStatus.ActionBarStatus_PublicOutCard,data.countdown,null)
                        }else{
                            var pSelectedCard = yx.func.cardDatasFromVector(this.m_HandCardNode)
                            var nSelectedLen = pSelectedCard.length
                                                   
                            var bFind : boolean
                            [bFind,this.m_SearchResult,this.m_cbHitCount] = this.logic.SearchOutCard(pSelectedCard, nSelectedLen, yx.internet.m_MaxCardInfo.cardData, yx.internet.m_MaxCardInfo.cardCount, yx.config.SearchMode.SearchMode_FullRegion,false, yx.internet.m_MaxCardInfo.nType)
                            this.m_cbTipIndex = 0
                            if(this.m_cbHitCount > 0){
                                this.showOperateBtn(yx.config.ActionBarStatus.ActionBarStatus_CanAfford,data.countdown,null)
                            }else{
                                this.showOperateBtn(yx.config.ActionBarStatus.ActionBarStatus_CannotAfford,3,()=>{
                                    yx.internet.DDZ_C_PASS_CARD({})
                                },null,true)
                            }
                        }
                    }else{
                        this.player.setPlayerTimerVisible(data.curchair,true,data.countdown,null,true)
                    }
                    this.player.getOutCardParent(data.curchair,true)
                    this.player.setPlayerCallStateVisible(data.curchair,false)
                    break;
                }
            
            default:
               
                break;
        }
        
    }
    DDZ_S_MSG_SEND_CARD(data: proto.client_proto_ddz.IDDZ_S_SendCard) {
        this.showBasePool(true);
        this.didReceiveSendCard(data.sendcards,true)
        if(app.file.getBooleanForKey(`Use_cardRecorder`, false) ){
            this.sendUserMemory(true)
        }
    }
    DDZ_S_MSG_SHOW_CARD(data: proto.client_proto_ddz.IDDZ_S_ShowCard) {
        let logicChair = yx.func.getClientChairIDByServerChairID(data.showchair)
        if(logicChair == 0){
            this.resetActionBar()
            var cardLen = this.m_HandCardNode.length
            for(var i=0;i<cardLen;i++){
                this.m_HandCardNode[i].getComponent("card_Landlord").showMarkAsPublicCard(i==(cardLen-1))
            }
        }else{
            this.didReceiveMingpai(data.showchair,data.showcards)
        }
        this.showXbeiAni(yx.internet.ddzBaseInfo.showtimes,data.toptimes)
        //播放明牌音效

    }
    DDZ_S_MSG_CALL_POINT(data: proto.client_proto_ddz.IDDZ_S_CallPoint,isAni?:boolean) {
        let needAni = isAni == false ? false : true
        //播放叫/抢地主音效
        let content = ""
        let soundTag = 0
        let bGrapAgain = false
        let callTimes = 0
        switch (data.callcode) {
            case proto.client_proto_ddz.DDZ_CALL_STATUS.DDZ_CALL_STATUS_NO_CALL: {
                content = "不叫"
                soundTag = yx.config.ActionEvent.CallNegative
                break;
            }
            case proto.client_proto_ddz.DDZ_CALL_STATUS.DDZ_CALL_STATUS_CALL: {
                content = "叫地主"
                soundTag = yx.config.ActionEvent.CallPositive
                callTimes = 3
                break;
            }
            case proto.client_proto_ddz.DDZ_CALL_STATUS.DDZ_CALL_STATUS_NO_ROB: {
                content = "不抢"
                soundTag = yx.config.ActionEvent.GrabNegative
                break;
            }
            case proto.client_proto_ddz.DDZ_CALL_STATUS.DDZ_CALL_STATUS_ROB_1: {
                content = "抢地主"
                soundTag = yx.config.ActionEvent.GrabPositive
                callTimes = 2
                break;
            }
            case proto.client_proto_ddz.DDZ_CALL_STATUS.DDZ_CALL_STATUS_ROB_2: {
                content = "抢地主"
                soundTag = yx.config.ActionEvent.GrabPositive
                callTimes = 2
                break;
            }
            case proto.client_proto_ddz.DDZ_CALL_STATUS.DDZ_CALL_STATUS_ROB_3: {
                content = "抢地主"
                soundTag = yx.config.ActionEvent.GrabPositive
                callTimes = 2
                bGrapAgain = true
                break;
            }
            default:
               
                break;
        }
        if(content != ""){
            this.callPointTimes++
            this.player.setPlayerCallStateVisible(data.callchair,true,content)
            if(needAni){
                if(callTimes > 0){
                    this.showXbeiAni(callTimes,data.toptimes)
                }
                var soundData:landlordSoundInitData = {
                    // pActor : player:getActor(),
                    tag : soundTag,
                    bGrapAgain: bGrapAgain
                }
                this.sound.playOptSound(soundData)
            }
            let logicChair = yx.func.getClientChairIDByServerChairID(data.callchair)
            if(logicChair == 0){
                this.resetActionBar()
            }else{
                this.player.setPlayerTimerVisible(data.callchair,false)
            }
        }
        
    }
    DDZ_S_MSG_CALL_END(data: proto.client_proto_ddz.IDDZ_S_CallEnd) {
        this.resetActionBar()
        this.showLastThreeCardAndMove(data.backcards,data.bankerchair)
        this.player.setPlayerDizhuVisible(data.bankerchair,true)
        
        this.setBaseScorePool(data.toptimes,true)
    }
    DDZ_S_MSG_DOUBLE(data: proto.client_proto_ddz.IDDZ_S_Double,isAni?:boolean) {
        let needAni = isAni == false ? false : true
        //播放加倍/超级加倍音效
        let content = ""
        let soundTag = 0
        switch (data.opetimes) {
            case 1: { //不加倍
                content = "不加倍"
                soundTag = yx.config.ActionEvent.DoubleNegative
                break;
            }
            case yx.internet.ddzBaseInfo.doubletimes: { //加倍
                content = "加倍"
                soundTag = yx.config.ActionEvent.DoublePositive
                break;
            }
            case yx.internet.ddzBaseInfo.superdoubletimes: {  //超级加倍
                content = "超级加倍"
                soundTag = yx.config.ActionEvent.DoubleSuper
                break;
            }
            default:
                break;
        }
        if(content != ""){
            this.player.setPlayerCallStateVisible(data.opechair,true,content)
            if(needAni){
                var soundData:landlordSoundInitData = {
                    // pActor : player:getActor(),
                    tag : soundTag,
                }
                this.sound.playOptSound(soundData)
                if(data.opetimes > 1){
                    this.showXbeiAni(data.opetimes,data.toptimes)
                }
            }
            let logicChair = yx.func.getClientChairIDByServerChairID(data.opechair)
            if(logicChair == 0){
                this.resetActionBar()
            }else{
                this.player.setPlayerTimerVisible(data.opechair,false)
            }
        }
    }
    DDZ_S_MSG_OUT_CARD(data: proto.client_proto_ddz.IDDZ_S_OutCard) {
        //判断飞机和三带一互转
        data = yx.func.turnSequenceByCardNum(data)

        let logicChair = yx.func.getClientChairIDByServerChairID(data.outchair)
        if(logicChair == 0){
            this.resetActionBar()
            this.putDownAllHandCard()
        }else{
            this.player.setPlayerTimerVisible(data.outchair,false)
        }
        this.hideChoseCardLayout()
        this.didReceiveOutCard(data)
    }
    DDZ_S_MSG_PASS_CARD(data: proto.client_proto_ddz.IDDZ_S_PassCard) {
        let logicChair = yx.func.getClientChairIDByServerChairID(data.passchair)
        if(logicChair == 0){
            this.resetActionBar()
        }else{
            this.player.setPlayerTimerVisible(data.passchair,false)
        }
        //播放不要音效 //随机的话要和文字配合上
        var soundData:landlordSoundInitData = {
            // pActor : player:getActor(),
            bSmall : this.logic.isSmallCard(),
        }
        this.sound.playPassSound(soundData)
        this.player.setPlayerCallStateVisible(data.passchair,true,"不要")
            
    }
    DDZ_S_MSG_USE_MEMORY(data: proto.client_proto_ddz.IDDZ_S_UseMemory) {
        if(!this.Items.node_card_recorder.active){
            this.showCardRecorder(true)
        }
        this.setCardRecorderData(data.recordindex)
    }
    DDZ_S_MSG_TRUSTEESHIP(data: proto.client_proto_ddz.IDDZ_S_Trusteeship) {
        let logicChair = yx.func.getClientChairIDByServerChairID(data.chair)
        if(logicChair == 0){
            this.showTrustLayout(data.trusteeship)
        }else{
            this.player.setPlayerTrusteeship(data.chair,data.trusteeship)
        }
    }
    DDZ_S_MSG_RECONNECT(reconnData: proto.client_proto_ddz.IDDZ_S_Reconnect) {
        this.clearOneGame()
        if(yx.internet.nGameState == yx.config.GameState.FREE){
            return
        }
        let operateCode = -1
        let bdouble:boolean[] = null
        //发牌阶段
        if(yx.internet.nGameState >= yx.config.GameState.SENDCARD){
            this.showBasePool(true);
            this.showCardRecorder(reconnData.usememory == 1)
            if(reconnData.usememory == 1){
               this.setCardRecorderData(reconnData.recordindex) 
            }else if(reconnData.usememory == 0){
                if(app.file.getBooleanForKey(`Use_cardRecorder`, false) ){
                    this.sendUserMemory(true)
                }
            }
            for(var i=0;i<yx.internet.nMaxPlayerCount;i++){
                if(i==yx.internet.nSelfChairID){
                    this.didReceiveSendCard(reconnData.handcards[yx.internet.nSelfChairID].data,false)
                    this.showTrustLayout(reconnData.btrusteeship[i])
                }else{
                    this.player.setPlayerCardNumVisible(i,true,reconnData.handcards[i].data.length)
                    this.player.setPlayerTrusteeship(i,reconnData.btrusteeship[i])
                }
            }
        }
        //明牌阶段
        if(yx.internet.nGameState >= yx.config.GameState.SHOW){
            this.setBaseScorePool(reconnData.toptimes)
            for(var i=0;i<yx.internet.nMaxPlayerCount;i++){
                if(reconnData.bshow[i]){
                    if(i==yx.internet.nSelfChairID){
                        var cardLen = this.m_HandCardNode.length
                        for(var i=0;i<cardLen;i++){
                            this.m_HandCardNode[i].getComponent("card_Landlord").showMarkAsPublicCard(i==(cardLen-1))
                        }
                    }else{
                        //处理对家明牌
                        this.didReceiveMingpai(i,reconnData.handcards[i].data)
                    }
                }else{
                    if(yx.internet.nGameState == yx.config.GameState.SHOW && i==yx.internet.nSelfChairID){
                        operateCode = proto.client_proto_ddz.DDZ_TIPS.DDZ_TIPS_SHOW_START
                    }
                }
            }
        }
        //叫分阶段
        if(yx.internet.nGameState == yx.config.GameState.CALLPOINT){
            for(var i=0;i<reconnData.historycall.length;i++){
                let callData:proto.client_proto_ddz.IDDZ_S_CallPoint = {
                    callcode:reconnData.historycall[i],
                    callchair:reconnData.historychair[i]
                }
                this.DDZ_S_MSG_CALL_POINT(callData,false)
                this.callPointTimes++
            }
            operateCode = proto.client_proto_ddz.DDZ_TIPS.DDZ_TIPS_CALL_START
        }
        //加倍阶段
        if(yx.internet.nGameState >= yx.config.GameState.DOUBLE){
            if(yx.internet.nGameState == yx.config.GameState.DOUBLE){
                for(var i=0;i<yx.internet.nMaxPlayerCount;i++){
                    if(reconnData.bdouble[i]){
                        let doubleData:proto.client_proto_ddz.IDDZ_S_Double = {
                            opetimes:reconnData.doubletimes[i],
                            opechair:i
                        }
                        this.DDZ_S_MSG_DOUBLE(doubleData,false)
                    }
                }
                operateCode = proto.client_proto_ddz.DDZ_TIPS.DDZ_TIPS_DOUBLE_START
                bdouble = reconnData.bdouble
            }
            this.player.setPlayerDizhuVisible(reconnData.bankerchair,false)
          
            this.showLastThreeCardAndMove(reconnData.backcards,null,false)
        }
        //出牌阶段
        if(yx.internet.nGameState == yx.config.GameState.PLAY){
            for(var i=0;i<yx.internet.nMaxPlayerCount;i++){
                if( reconnData.turncards[i] && reconnData.turncards[i].data.length > 0){
                    this.ShowOutCard(i,reconnData.turncards[i].data,-1,false)
                }else{
                    if(reconnData.passornull[i]){
                        this.player.setPlayerCallStateVisible(i,true,"不要")
                    }
                }
            }
            operateCode = proto.client_proto_ddz.DDZ_TIPS.DDZ_TIPS_OUT_START
        }
        //恢复操作按钮
        if(yx.internet.nGameState<yx.config.GameState.SETTLEMENT){
            let operateData:proto.client_proto_ddz.IDDZ_S_Tips = {
                type:operateCode,
                countdown:reconnData.countdown,
                curchair:reconnData.curchair,
                bFirst : reconnData.turncards.length == 0
            }
            this.DDZ_S_MSG_TIPS(operateData,bdouble)
        }
    }

    DDZ_S_MSG_GAMEEND(data: proto.client_proto_ddz.IDDZ_S_GameEnd) {

        //展示春天/反春天
        let showSpringAni = (type:number,callback?:Function)=>{
            let aniName = type == 1 ? "effect_spring" : "effect_spring_pposite"
            this.loadBundleRes(fw.BundleConfig.Landlord.res[`ui/anim/`+aniName], (res: Prefab) => {
                let aniNode = instantiate(res);
                if(!fw.isNull(aniNode)){
                    this.viewZOrderNode[this.viewZOrder.Anim].addChild(aniNode)
                    var tScale = yx.config.changeOldResScale
                    aniNode.scale = v3(tScale, tScale, tScale)
                    const a = aniNode.getComponent(Animation);

                    a.play(aniName);
                    a.on(Animation.EventType.FINISHED, () => {
                        aniNode.removeFromParent(true)
                        callback?.()
                    });
                   
                    this.sound.playSpringEffect()   
                }
            });
            let nType = yx.config.SpringType.beSpring
            if(data.settleinfo.golds[yx.internet.nSelfChairID] > 0){
                nType = yx.internet.isSelfLandlord() ?  yx.config.SpringType.spring : yx.config.SpringType.antiSpring
            }
            var soundData:landlordSoundInitData = {
                // pActor : player:getActor(),
                tag : nType,
            }
            this.sound.playSpringSound(soundData)            
        } 
        //展示斗地主/农民结算小动画
        let showLoseWin = (callback?:Function)=>{
            let aniName = `node_${yx.internet.isSelfLandlord() ? `landlord` : `famer` }_${data.settleinfo.golds[yx.internet.nSelfChairID] > 0 ? `win` : `lose`}`
            this.loadBundleRes(fw.BundleConfig.Landlord.res[`ui/anim/`+aniName], (res: Prefab) => {
                let aniNode = instantiate(res);
                if(!fw.isNull(aniNode)){
                    this.viewZOrderNode[this.viewZOrder.Anim].addChild(aniNode)
                    var tScale = yx.config.changeOldResScale
                    aniNode.scale = v3(tScale, tScale, tScale)
                    const a = aniNode.getComponent(Animation);

                    a.play(aniName);
                    a.on(Animation.EventType.FINISHED, () => {
                        aniNode.removeFromParent(true)
                        callback?.()
                    });
                    if(data.settleinfo.golds[yx.internet.nSelfChairID] > 0){
                        this.sound.playSettleEffect(true)
                    }else{
                        this.sound.playSettleEffect(false)
                    }
                }
            });
        } 
        //摊牌以及展示结算流水
        let showTanpaiAndCoin =  (callback?:Function)=>{
            for(let i=0;i<yx.internet.nMaxPlayerCount;i++){
                this.player.getOutCardParent(i,true)
                this.player.setSettlementScoreVisible(i,true,data.settleinfo.golds[i],true)
                let logicChair = yx.func.getClientChairIDByServerChairID(i)
                if(logicChair != 0){
                    this.didReceiveTanpai(i,data.handcards[i].data)
                    this.player.getMingpaiParent(i,true)
                }
            }
            this.scheduleOnce(()=>{
                callback?.()
            },2)
        } 
        this.player.setPlayerCallStateVisible(null, false);
        this.player.setPlayerTimerVisible(null, false);
        this.showTrustLayout(false)
        this.resetActionBar()
        this.setBaseScorePool(data.settleinfo.toptimes[yx.internet.nSelfChairID],false)
        if(data.settleinfo.flag > 0){
            showTanpaiAndCoin()
            showSpringAni(data.settleinfo.flag,()=>{
                showLoseWin(()=>{
                    this.showSettleLayout(data.settleinfo)
                })
            })
        }else{
            showTanpaiAndCoin(()=>{
                showLoseWin(()=>{
                    this.showSettleLayout(data.settleinfo)
                })
            })
        }
    }

    showSettleLayout(data: proto.client_proto_ddz.IDDZSettle) {
        let self = this
        let isWin = data.golds[yx.internet.nSelfChairID] > 0
        let aniName = `node_settlement_${isWin ? `win` : `fail`}`
        let aniBgName = `tx_ddz_settlement_${isWin ? `win` : `fail`}_bg`
        let txtColor = app.func.color(255, 255, 255, 255)

        let signNumber = function(number):string{
            let tempStr = ''
            if(number >= 0){
                tempStr = "+" + app.func.FormatNumber(number)
            }else{
                tempStr = "-" + app.func.FormatNumber(Math.abs(number))
            }
            return tempStr
        }
        this.loadBundleRes(fw.BundleConfig.Landlord.res[`ui/anim/`+aniName], (res: Prefab) => {
            let aniNode = instantiate(res);
            if(!fw.isNull(aniNode)){
                this.viewZOrderNode[this.viewZOrder.Anim].addChild(aniNode)
                aniNode.Items.Layout_close.getComponent(UITransform).setContentSize(app.winSize );
                var tScale = 1
                aniNode.scale = v3(tScale, tScale, tScale)
                const a = aniNode.getComponent(Animation);
                aniNode.name = "settleLayout"
                a.play(aniName);
                
                let FileNode_TitleBarBG = aniNode.Items.FileNode_TitleBarBG
                const b = FileNode_TitleBarBG.getComponent(Animation);
                b.play(aniBgName);
                b.on(Animation.EventType.FINISHED, () => {
                    b.play(aniBgName);
                });

                let btn_settle_start = aniNode.Items.btn_settle_start
                const c = btn_settle_start.getComponent(Animation);
                c.play(`tx_ddz_jiesuan_anniu`);
                c.on(Animation.EventType.FINISHED, () => {
                    c.play(`tx_ddz_jiesuan_anniu`);
                });

                aniNode.Items.Sprite_PlayBtn_new.onClickAndScale(() => {
                    //再来一局
                    aniNode.removeFromParent(true)
                    this.startGameAgain()
                });

                aniNode.Items.Sprite_CloseBtn.onClickAndScale(() => {
                    //关闭
                    aniNode.removeFromParent(true)
                    self.showStartGameBtn(yx.config.FreeActionBarStatus.FreeActionBarStatus_ChangeAndReady)
                });

                for(let i=0;i<yx.internet.nMaxPlayerCount;i++){
                    let logicChair = yx.func.getClientChairIDByServerChairID(i)
                    let node_cell = aniNode.Items[`node_cell_`+logicChair]
                    if(isWin){
                        txtColor = logicChair==0 ? app.func.color(233, 102, 56, 255) : app.func.color(171, 115, 98, 255)
                    }else{
                        txtColor = logicChair==0 ? app.func.color(47, 169, 255, 255) : app.func.color(101, 103, 135, 255)
                    }
                    node_cell.Items.Text_Nick.obtainComponent(Label).color = txtColor
                    node_cell.Items.Text_FinalMutiple.obtainComponent(Label).color = txtColor
                    node_cell.Items.Text_CurrencyFluctuation.obtainComponent(Label).color = txtColor

                    //昵称
                    let actor = gameCenter.user.getPlayerInfoByChairID(i);
                    if(actor){
                        node_cell.Items.Text_Nick.string = actor[PROTO_ACTOR.UAT_NICKNAME]
                    }
                    //地主身份
                    node_cell.Items.DDZ_dizhubiaoshi_1.active = yx.internet.landlordSeat == i
                    //是否加倍
                    node_cell.Items.Image_double.active = data.doubletimes[i] > 1
                    //是否破产
                    node_cell.Items.Sprite_Bankrupt.active = data.broke[i] 
                    //是否包赔
                    node_cell.Items.Node_FullCompensation.active = data.baopei[i] 
                    //是否封顶
                    node_cell.Items.Node_Limit.active = data.toplimit[i] 
                    //倍数
                    node_cell.Items.Text_FinalMutiple.string = data.toptimes[i] +""
                    //货币增减
                    node_cell.Items.Text_CurrencyFluctuation.string = signNumber(data.golds[i] ) 
                }
            }
        });
        
    }

    //-----------------------------老代码 ------------------------------------//
    /**刷新倍率动画 */
    updateMultipleAnim() {
        (<any>this).multipleState ??= 0;
        let func = (<any>this).updateMultipleAnimFunc ??= (n: ccNode) => {
            let spine = n.obtainComponent(FWSpine);
            switch (yx.internet.nGameState) {
                case yx.config.GameState.BET1:
                    app.audio.playEffect(app.game.getRes(`audio/mult`));
                    spine.setAnimation(0, `2x_`, false);
                    spine.setCompleteListener(() => {
                        spine.setCompleteListener(null);
                        spine.setAnimation(0, `2.25x`, true);
                    });
                    break;
                case yx.config.GameState.BET2:
                    spine.setAnimation(0, `2.25x_`, false);
                    spine.setCompleteListener(() => {
                        spine.setCompleteListener(null);
                        spine.setAnimation(0, `2x`, true);
                    });
                    break;
                case yx.config.GameState.END:
                    break;
                case yx.config.GameState.FREE:
                default:
                    spine.setCompleteListener(null);
                    spine.setAnimation(0, `2x`, false);
                    break;
            }
        }
        func(this.Items.Node_a.Items.Node_multiple);
        func(this.Items.Node_b.Items.Node_multiple);
    }
    /**操作 */
    onOperate(nType: number, nJettonScore?: number) {
        if (fw.isNull(nJettonScore)) {
            const gameConfig = yx.internet.gameConfig;
            if (gameConfig) {
                nJettonScore = gameConfig.nChipScore[this.nChipIndex];
            } else {
                nJettonScore = 0;
            }
        }
        const nGold = gameCenter.user.getGold();
        if (nGold - yx.internet.nJettonScore - nJettonScore < 0) {
            center.giftBag.showGiftBagDialog(() => {
                app.popup.showDialog(fw.BundleConfig.plaza.res[`shop/quickRecharge`], {
                    nRechargeNumMin: (nGold - yx.internet.nJettonScore) / DF_RATE,
                });
            });
            return;
        }
        yx.internet.MSG_BET_C({
            nJettonArea: nType,
            nJettonScore: nJettonScore,
        });
    }
    /**刷新下注 */
    updateChipScore() {
        //刷新
        let nIndex = 0;
        const gameConfig = yx.internet.gameConfig;
        let nDefaultIndex = app.file.getIntegerForKey(`AB_chipIndex`, -1);
        if (gameConfig) {
            for (let i = 0, j = gameConfig.nChipScore; i < j.length; ++i) {
                const nValue = j[i];
                
                //是否默认选中
                if (nDefaultIndex < 0) {
                    nDefaultIndex = i;
                }
                ++nIndex;
            }
        } else {
            this.Items.Label_andar_value.string = ``;
            this.Items.Label_bahar_value.string = ``;
        }
        
        this.updateChipVisible();
    }
    updateChipVisible() {
        let bNeedChangChip = false;
        const nLeftGold = gameCenter.user.getGold() - yx.internet.nJettonScore;
       
    }
    /**发牌动画 */
    playFaPai(startNode: ccNode, targetNode: ccNode, nCardValue: number, callback?: Function) {
        const n = new ccNode();
        n.obtainComponent(UITransform);
        n.parent = this.viewZOrderNode[this.viewZOrder.Anim];
        n.obtainComponent(Sprite);
        n.updateSprite(app.game.getRes(`ui/main/img/atlas/poker_bg/spriteFrame`));
        //调整大小
        n.setScale(fw.v3(0.25));
        //调整位置
        n.setWorldPosition(startNode.worldPosition);
        app.audio.playEffect(app.game.getRes(`audio/dealcards`));
        tween(n)
            .parallel(
                //注意：这里使用了targetNode的父亲节点的放大缩小比例
                tween(n).to(0.35, { scale: targetNode.parent.scale }),
                tween(n).to(0.35, { angle: 180 }),
                tween(n).to(0.35, { worldPosition: targetNode.worldPosition }),
            )
            .delay(0.05)
            .call(() => {
                n.removeFromParent(true);
                this.updateTableCard(targetNode, true, nCardValue);
                callback?.();
            })
            .start();
    }
    /**显示区域 */
    playCardWin(nJettonArea?: number, callback?: Function) {
        const func = (<any>this).playCardWinFunc ??= (n: ccNode, bVisible: boolean, callback?: Function) => {
            n.active = bVisible;
            if (bVisible) {
                Tween.stopAllByTarget(n);
                tween(n)
                    .hide()
                    .delay(0.25)
                    .show()
                    .delay(0.25)
                    .union()
                    .repeat(5)
                    .call(() => {
                        callback?.();
                    })
                    .start();
            }
        }
        func(this.Items.Node_card_banker.Items.Sprite_light, true, () => {
            callback?.();
        });
        func(this.Items.Node_card_a.Items.Sprite_light, nJettonArea == yx.config.JettonArea.BTN_BETA);
        func(this.Items.Node_card_b.Items.Sprite_light, nJettonArea == yx.config.JettonArea.BTN_BETB);
    }
    /**刷新桌面牌 */
    updateTableCard(card?: ccNode, bVisible?: boolean, nCardValue?: number) {
        if (fw.isNull(card)) {
            this.Items.Node_card_a.active = bVisible;
            this.Items.Node_card_b.active = bVisible;
            this.Items.Node_card_banker.active = bVisible;
        } else {
            card.active = bVisible;
            yx.func.updateCard(card, nCardValue);
        }
    }

    /**刷新桌面牌 */
    setOperateVisible(bVisible: boolean, bNotAnim?: boolean) {
        if (bVisible) {
            this.updateChipVisible();
            this.Items.Sprite_bottom_bg.active = true;
            app.audio.playEffect(app.game.getRes(`audio/yourturn`));
            this.Items.Sprite_bottom_bg.__initPos ??= this.Items.Sprite_bottom_bg.getPosition();
            this.Items.Sprite_bottom_bg.setPosition(this.Items.Sprite_bottom_bg.__initPos);
        } else {
            if (bNotAnim) {
                this.Items.Sprite_bottom_bg.active = false;
            } else {
                tween(this.Items.Sprite_bottom_bg)
                    .by(0.35, { position: fw.v3(0, -200, 0) })
                    .call(() => {
                        this.Items.Sprite_bottom_bg.active = false;
                    })
                    .start();
            }
        }
    }
    MSG_GAMESCENE_S(data: proto.game_ab.IMSG_GAMESCENE_S) {
        //标记完成
        yx.internet.setTriggerMessageVisible(true);
    }
    MSG_FREE_S(data: proto.game_ab.IMSG_FREE_S) {
        //清理上一局
        this.clearOneGame();
        //刷新下注
        this.updateChipScore();
        //标记完成
        yx.internet.setTriggerMessageVisible(true);
    }
    MSG_START_S(data: proto.game_ab.IMSG_START_S) {
        //刷新倍率
        this.updateMultipleAnim();
        //刷新庄家牌
        
    }
    MSG_BET_S(data: proto.game_ab.IMSG_BET_S) {
        //设置区域下注
        this.player.setAreaChipVisible(data.nChairID, true, Object.assign({ bAnim: true }, data));
        //隐藏倒计时
        this.player.setCountdownVisible(data.nChairID, false);
        //隐藏操作界面
        if (data.nChairID == yx.internet.nSelfChairID) {
            this.setOperateVisible(false);
        }
        //玩家玩家信息
        this.player.updateOnePlayer(data.nChairID);
        //标记完成
        yx.internet.setTriggerMessageVisible(true);
    }
    MSG_BET_PART2_S(data: proto.game_ab.IMSG_BET_PART2_S) {
        //调整倍率
        this.updateMultipleAnim();
        //发牌
        const nodes = [
            this.Items.Node_card_a,
            this.Items.Node_card_b,
        ];
        let index = 0;
        let func = () => {
            if (index < data.uCards.length) {
                ++index;
            } else {
                //开启倒计时
                this.player.setCountdownVisible(null, true, data.nLeaveTime);
                //显示操作界面
                if (yx.internet.playerState[yx.internet.nSelfChairID] != yx.config.PlayerStates.TimeOut) {
                    this.setOperateVisible(true);
                }
                //标记完成
                yx.internet.setTriggerMessageVisible(true);
            }
        }
        func();
    }
    MSG_END_S(data: proto.game_ab.IMSG_END_S) {
        //隐藏自己的操作
        this.setOperateVisible(false);
        //发牌
        const nodes = [
            this.Items.Node_card_a,
            this.Items.Node_card_b,
        ];
        let index = 0;
        let func = () => {
            if (index < data.uCards.length) {
                ++index;
            } else {
                app.func.doPromise(resolve => {
                    //闪牌动画
                    this.playCardWin(data.nJettonArea, resolve);
                    //显示玩家赢牌区域
                    this.player.setChipWinVisible(null, true, data.nJettonArea);
                }).then(() => {
                    return app.func.doPromise(resolve => {
                        let bFirst = true;
                        //赢筹码动画
                        for (let nChairID = 0; nChairID < yx.internet.nMaxPlayerCount; ++nChairID) {
                            let nWinScore = data.nSitUserWinScore[nChairID * 2 + data.nJettonArea - 1];
                            if (nWinScore > 0) {
                                if (bFirst) {
                                    bFirst = false;
                                    this.player.playWinChipAnim(nChairID, data.nJettonArea, nWinScore, resolve);
                                } else {
                                    this.player.playWinChipAnim(nChairID, data.nJettonArea, nWinScore);
                                }
                            }
                        }
                        bFirst && resolve();
                    });
                }).then(() => {
                    return app.func.doPromise(resolve => {
                        let bFirst = true;
                        //输筹码动画
                        for (let nChairID = 0; nChairID < yx.internet.nMaxPlayerCount; ++nChairID) {
                            let nLoseScore = data.nSitUserWinScore[nChairID * 2 + data.nJettonArea % 2];
                            if (nLoseScore < 0) {
                                if (bFirst) {
                                    bFirst = false;
                                    this.player.playLoseChipAnim(nChairID, data.nJettonArea, resolve);
                                } else {
                                    this.player.playLoseChipAnim(nChairID, data.nJettonArea);
                                }
                            }
                        }
                        bFirst && resolve();
                    });
                });
            }
        }
        func();
    }
    MSG_TIPS_S(data: proto.game_ab.IMSG_TIPS_S) {
        //TODO
    }
    MSG_PLAYER_STATUS_S(data: proto.game_ab.IMSG_PLAYER_STATUS_S) {
        //刷新玩家状态
        this.player.updatePlayerState(data.nChairID, data.ucCurState);
        //自己超时
        if (data.nChairID == yx.internet.nSelfChairID && data.ucCurState == yx.config.PlayerStates.TimeOut) {
            //隐藏操作界面
            this.setOperateVisible(false, true);
        }
    }
    doReconnect(data: proto.game_ab.IMSG_RECONNECT_S) {
        //清理旧状态
        this.clearOneGame();
        //刷新倍率
        this.updateMultipleAnim();
        //刷新a牌
        this.updateTableCard(this.Items.Node_card_a, true, data.uCardData[0]);
        //刷新庄家牌
        this.updateTableCard(this.Items.Node_card_banker, true, data.uCardData[1]);
        //刷新b牌
        this.updateTableCard(this.Items.Node_card_b, true, data.uCardData[2]);
        //刷新玩家状态
        data.btSitUserState.forEach((nState: number, nChairID: number) => {
            this.player.updatePlayerState(nChairID, nState);
        });
    }
}

declare global {
    namespace globalThis {
        type type_main_Landlord = main_Landlord
    }
}
