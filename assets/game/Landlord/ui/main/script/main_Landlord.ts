import { _decorator, Node as ccNode, instantiate, math, ProgressBar,NodeEventType,sp, Animation, AnimationClip, Prefab, tween,v3, UIOpacity, Tween, Sprite, UITransform, Button, Label, Vec3, Vec2, Rect, Size } from 'cc';
const { ccclass } = _decorator;

import { yx } from '../../../yx_Landlord';
import { player_Landlord } from './player_Landlord';
import proto from './../../../protobuf/Landlord_format';
import { ACTOR } from '../../../../../app/config/cmd/ActorCMD';
import { FWSpine } from '../../../../../app/framework/extensions/FWSpine';
import { DF_RATE, DF_SYMBOL } from '../../../../../app/config/ConstantConfig';
import { main_GameBase } from '../../../../GameBase/ui/main/script/main_GameBase';
import { boolean } from '../../../../../../engine/cocos/core/data/class-decorator';
import { logic_Landlord } from './logic_Landlord';

@ccclass('main_Landlord')
export class main_Landlord extends main_GameBase {
    /**筹码索引 */
    nChipIndex: number = -1
    /**player */
    player: player_Landlord = null
    /**logic */
    logic: logic_Landlord = new logic_Landlord
    /**玩家手牌数据 */
    m_HandCardData: any[];
    /**玩家手牌Node */
    m_HandCardNode: ccNode[] = [];
    m_mapGMPos: Vec3[]= [];
    m_vecCardsPosition: Vec3[]= [];
    m_vecCardsRect: Rect[]= [];
    m_vecSelectedCache: any[]= [];
    mDragCardNode: ccNode;
    m_vecPopCache: any[]= [];
    m_RegionData :any;
    m_enumGameStatus: number;
    protected initData(): boolean | void {
        this.m_HandCardData = []
        this.m_HandCardNode = []
    }
    protected initView(): boolean | void {
        //刷新下注
        // this.updateChipScore();
        // //添加player
        this.player = this.obtainComponent(app.game.getCom(`player`));
        // //清理游戏
        this.clearOneGame();
        
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
        this.bindEvent({
            eventName: `GameReconnectRoom`,
            callback: (arg1: FWDispatchEventParam, arg2: FWBindEventParam): boolean | void => {
                //重连
                this.doReconnect(arg1.data);
            }
        });
    }
    protected initBtns(): boolean | void {
        /**Andar */
        // this.Items.Node_andar.onClickAndScale(() => {
        //     this.onOperate(yx.config.JettonArea.BTN_BETA);
        // });
        // this.Items.Label_andar.string = fw.language.get(`ANDAR`);
        /**Bahar */
        // this.Items.Node_bahar.onClickAndScale(() => {
        //     this.onOperate(yx.config.JettonArea.BTN_BETB);
        // });
        // this.Items.Label_bahar.string = fw.language.get(`BAHAR`);
        /**Skip */
        // this.Items.Node_skip.onClickAndScale(() => {
        //     this.onOperate(yx.config.JettonArea.BTN_SKIP, 0);
        // });
        // this.Items.Label_skip.string = fw.language.get(`SKIP`);
        /**trusteeship */
        this.Items.Node_trusteeship.onClickAndScale(() => {
            yx.internet.MSG_BACK_C({});
        });
        // this.Items.Label_trusteeship.string = fw.language.get(`I'm back`);
        // this.Items.Label_trusteeship_tips.string = fw.language.get(`You have been put on Auto-Play for missing a turn`);
        this.initCardTouchLayerEvent()
    }
    /**清理一局游戏 */
    clearOneGame() {
        //清理定时器
        this.unscheduleAllCallbacks();
        //清理所有动画节点
        var per = this.viewZOrderNode[this.viewZOrder.Anim]
        per.removeAllChildren(true);
        //清理桌面牌
        // this.updateTableCard(null, false);
        // this.setOperateVisible(false, true);
        this.resetActionBarOnFree();
        this.resetNodeLookCard();
        this.resetActionBar();
        this.showTrustLayout(false)
        this.showCardRecorder(false)
        this.showGameTip(false)
        this.showDipaiBieshu(false,false)
        this.showBasePool(false);
        this.resetBaseCardPool();
        this.setBaseScorePool( 1 );
        this.showNoCardBiggerTip(false)
        
        //player隐藏
        this.player.clearOneGame();
        
        //--------------test-------------//
        // this.schedule(function(){
            this.didReceiveSendCard()
            this.showBasePool(true);
            this.showLastThreeCardAndMove([78,79,50])
            this.showDipaiBieshu(true,true,3)
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
    showCardRecorder(isShow:boolean,recorderDada ?: any){
        this.Items.node_card_recorder.active = isShow
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
    //是否展示底牌倍数
    showDipaiBieshu(isShow: boolean,isAni : boolean, beishu ?: number){
        if(isShow){
            this.Items.Text_dipaibeishu.string = beishu+""
            if(isAni){
                this.Items.Img_dipaiBeisu.active = false
                this.loadBundleRes(fw.BundleConfig.Landlord.res[`ui/anim/ani_beishubianhua_1`], (res: Prefab) => {
                    let aniNode = instantiate(res);
                    if(!fw.isNull(aniNode)){
                        this.Items.Img_dipaiBeisu.active = true
                        this.Items.Img_dipaiBeisu.addChild(aniNode)
                        aniNode.Items["Text_dipaibeishu"].string = "" + beishu +"倍"
                        aniNode.eulerAngles  = new Vec3(0,0,15)
                        aniNode.setPosition(0,1)
                        var tScale = yx.config.changeOldResScale
                        aniNode.scale = v3(tScale, tScale, tScale)
                        const a = aniNode.getComponent(Animation);
                        
                        a.on(Animation.EventType.FINISHED, () => {
                            aniNode.removeFromParent(true)
                        });
                        a.play(`ani_beishubianhua_1`);
                    }
                });
            }else{
                this.Items.Img_dipaiBeisu.active = true
            }
        }else{
            this.Items.Img_dipaiBeisu.active = false
        }
    }
    //恢复底牌为背牌
    resetBaseCardPool(){
        let childs = this.Items.Layout_BaseCardPool.children;
        for (let i = 0; i < childs.length; ++i) {
            childs[i].removeAllChildren()
        }
    }
    //设置底牌倍数
    setBaseScorePool(beishu : number){
        this.Items.BMFont_MutipleValue.string = "" + beishu
        this.loadBundleRes(fw.BundleConfig.Landlord.res[`ui/anim/ani_beishubianhua_0`], (res: Prefab) => {
            let aniNode = instantiate(res);
            if(!fw.isNull(aniNode)){
                this.Items.BMFont_MutipleValue.addChild(aniNode)
                aniNode.Items["BitmapFontLabel_19"].string = "" + beishu
                var tScale = yx.config.changeOldResScale
                aniNode.scale = v3(tScale, tScale, tScale)
                const a = aniNode.getComponent(Animation);
                
                a.on(Animation.EventType.FINISHED, () => {
                    aniNode.removeFromParent(true)
                });
                a.play(`ani_beishubianhua_0`);
            }
        });
    }
    //是否展示出不了牌提示
    showNoCardBiggerTip(isShow : boolean , type ?: Number){
        this.Items.node_no_card_bigger_than_others.active = isShow
        if(isShow){
            if(type == yx.config.HandsAnalyseTipType.HandsAnalyseTipType_InvalidCard ){
                this.Items.nobiggerLabel.string = "没有大于上家的牌"
            }else{
                this.Items.nobiggerLabel.string = "不符合出牌规则"
            }
        }
    }

    //创建触摸屏
    initCardTouchLayerEvent(){
        var touchEventType = "selCard" //选牌
        var m_TouchPointStart = new Vec2(0,0)
        var _onTouchBegan = function(touch, event){
            console.log("touch:",touch)
            console.log("event:",event)
            // --移除多种牌型选择框
            // if this.m_gameLayer then
            //     this.m_gameLayer:removeChooseCardNode()
            // end
            // var size = this.Items.cardTouchLayout.getComponent(UITransform).getContentSize()
            // var rect = new Rect(0, 0, size.width, size.height)
            m_TouchPointStart = touch.touch._startPoint
        }

        var _onTouchMove = function(touch, event){
    
            var touchPos = touch.touch._point
            var rectX = (touchPos.x < m_TouchPointStart.x) ? touchPos.x : m_TouchPointStart.x
            var rectY = (touchPos.x < m_TouchPointStart.x) ? touchPos.y : m_TouchPointStart.y
            var rectW = Math.abs(m_TouchPointStart.x - touchPos.x)
            var rectH = Math.abs(m_TouchPointStart.y - touchPos.y)
            var rect = new Rect(rectX, rectY, rectW, rectH)
            this.m_vecSelectedCache = []

            var preTouchEventType = touchEventType
            
            if (touchPos.y > yx.config.OUT_CARD_OFFSET_Y + this.Items.node_handCard.worldPosition.y){// &&  this:getGameStatus() == DDZ_DEF.GameStatus.GameStatus_Playing ){
                touchEventType = "outCard" // 出牌
            }else{
                touchEventType = "selCard"
            }
            // m_vecCardsRect
            for(var i=0;i<this.m_vecCardsRect.length;i++){
                var card = this.m_HandCardNode[i]
                var cardRect = this.m_vecCardsRect[i]
                var tempRect = cardRect
                if(i != this.m_vecCardsRect.length){
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
                    if(!fw.isNull(this.mDragCardNode) ){
                        this.mDragCardNode.removeFromParent()
                        this.mDragCardNode = null
                    }
                    this.mDragCardNode = new ccNode()
                    this.Items.node_handCard.addChild(this.mDragCardNode)
                    this.mDragCardNode.setSiblingIndex(999)
                    this.mDragCardNode.setScale(new Vec3(0.8,0.8,0.8))
                    var tempCache = yx.func.cardDatasFromVector(this.m_vecPopCache)
				    var cbTempCardData = this.logic.resortZOrderForOutCard(tempCache, tempCache.length)
                    var length = tempCache.length
                    var startX = -((length - 1) * yx.config.CARD_PADDING_OF_HAND_CARDS + yx.config.CARD_SIZE.width) / 2 
                    for(var i=0;i<length;i++){
                        if(yx.func.verification(cbTempCardData[i])){
                            var card = this.getOneCardByData(cbTempCardData[i],yx.config.CardSizeType.CardSizeType_Hands)
                            card.setSiblingIndex(i)
                            this.mDragCardNode.addChild(card)
                            card.setPosition(startX+(i)*yx.config.CARD_PADDING_OF_HAND_CARDS,-yx.config.CARD_SIZE.height/2)
                            if(i==length-1){
                                card.getComponent("card_Landlord").setLogoVisible(true)
                            }
                        }else{

                        }
                    }
                }else if(preTouchEventType == "outCard"){
                    if(!fw.isNull(this.mDragCardNode) ){
                        this.mDragCardNode.removeFromParent()
                        this.mDragCardNode = null
                    }
                    // var tempCache = yx.func.cardDatasFromVector(this.m_vecPopCache)
                    // var cbTempCardData = tempCache.slice();
                    // // var cbTempCardData = this.logic.resortZOrderForOutCard(tempCache, #tempCache)
                    // tempCache = []
                    // if(cbTempCardData.length != 0){

                    // }
                }
            }

            if(touchEventType == "outCard"){
                if(!fw.isNull(this.mDragCardNode) ){
                    var worldPosy =  touch.touch._point.y -this.Items.node_handCard.worldPosition.y
                    var worldPosx =  touch.touch._point.x -this.Items.node_handCard.worldPosition.x 
                    this.mDragCardNode.setPosition(worldPosx,worldPosy)
                }
            }
        }
        let self = this
        var _onTouchEnded = function(touch, event){
            var tmpFun = function(){
                var  touchPos = touch.touch._point
                var moveDelta = new Vec2(touchPos.x - m_TouchPointStart.x, touchPos.y - m_TouchPointStart.y)
                if(Math.abs(moveDelta.x) <= yx.config.CARD_GESTURE_TAP_OFFSET_MAX && Math.abs(moveDelta.y) <= yx.config.CARD_GESTURE_TAP_OFFSET_MAX ){
                    var rectVectorSize = self.m_vecCardsRect.length
                    var cardData = 0x00
                    var pCard = null
                    for(var i=(rectVectorSize-1);i>=0;i--){
                        var card = self.m_HandCardNode[i]
                        var cardRect = self.m_vecCardsRect[i]
                        var isContains = cardRect.contains(m_TouchPointStart)
                        if (isContains && card ){
                            cardData = card.getComponent("card_Landlord").getCardData()
                            pCard = card
                            var popState = card.getComponent("card_Landlord").getStatusPop()
                            card.getComponent("card_Landlord").setPop(! popState)
                            card.getComponent("card_Landlord").setSelected(false)
                            self.updateCardsRect(card)
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
                    if  (self.getGameStatus() == yx.config.GameStatus.GameStatus_Playing){
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
                        self.updateCardsRect(self.m_vecSelectedCache[i])
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

                if(self.getGameStatus() == yx.config.GameStatus.GameStatus_Playing){
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
                    var maxCardInfo = yx.config.m_MaxCardInfo
                    var isLarger = false
	                var cardDataType = -1
                    cardDataType = self.logic.GetCardType(cbTempCardData, cbTempCardData.length)
                    isLarger = self.logic.CompareCard(maxCardInfo.cardData, maxCardInfo.cardCount, cbTempCardData, cbTempCardData.length)
                    if  (cardDataType == -1 || ! isLarger){
                        self.displayHandsAnalyseTips(true, yx.config.HandsAnalyseTipType.HandsAnalyseTipType_InvalidCard)
                        self.schedule(function(){
                            self.displayHandsAnalyseTips(false)
                            self.putDownAllHandCard()
                        },0.4)
                    }
                    self.clearPopCardCache()
                    //this.dispatchClientMSG_OutCard(cbTempCardData, #cbTempCardData)
                    self.putDownAllHandCard()
                }else{
                    tmpFun()
                }
                 
            }else{
                tmpFun()
            }
        }

        var _onTouchCancel = function(){
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

    //发牌命令
    didReceiveSendCard(){
        var cardData = [12, 17,33,49,1,2,3,4,5,6,7,8,9,10,11,20,21,0x4E,0x4F ]
        this.m_HandCardData = cardData
        for(var i=0;i<cardData.length;i++){
            var node = this.getOneCardByData(cardData[i],yx.config.CardSizeType.CardSizeType_Hands)
            this.m_HandCardNode.push(node)
            // this.Items.node_handCard.addChild(node)
        }
        yx.func.sortCard(this.m_HandCardNode)
        
        this.resetCardsPosition(cardData.length)
        this.sendCardAni(true,3,null,2)
    }

    markRegionCardData(data){
        if(data == 0x00){
            this.m_RegionData = {}
        }else{
            var  size = this.m_vecPopCache.length
            if  (this.m_vecPopCache.length == 1 ||  this.m_vecPopCache.length == 2){
                this.m_RegionData[size] = data
            }
        }
    }

    clearPopCardCache(){
        this.m_vecPopCache = []
    }

    putDownAllHandCard(){
         this.m_vecPopCache = []
    }

    displayHandsAnalyseTips(isShow:boolean, type?:number){
        if(isShow){
            this.Items.node_no_card_bigger_than_others.active = true
            if(type == yx.config.HandsAnalyseTipType.HandsAnalyseTipType_NoAvaliableCard){
                this.Items.nobiggerLabel.string = "没有大于大家的牌"
            }else if(type == yx.config.HandsAnalyseTipType.HandsAnalyseTipType_InvalidCard){
                this.Items.nobiggerLabel.string = "不符合出牌规则"
            }
        }else{
            this.Items.node_no_card_bigger_than_others.active = true
        }
    }

    getMaxCardDataInfo(){
        return  yx.config.m_MaxCardInfo
    }

    slidingSearch(){
        //获取选中扑克的数据
        var pSelectedCard = yx.func.cardDatasFromVector(self.m_vecSelectedCache)
        var nSelectedLen = pSelectedCard.length

        //获取弹起扑克的数据
        var pPopCard = yx.func.cardDatasFromVector(self.m_vecPopCache)
        var nPopCardLen = pPopCard.length
        var popCardType = this.logic.GetCardType(pPopCard,nPopCardLen)
        if(popCardType == yx.config.OutCardType.Sequence){
            return
        }
    
	    var [pUnionCard,nUnionCardLen] = this.logic.mergeCardData(pSelectedCard, nSelectedLen, pPopCard, nPopCardLen)

        //如果是特殊牌型弹出提示语(双炸、飞机带炸)
	    var unionCardType = this.logic.GetCardType(pUnionCard,nUnionCardLen,true)
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

        var outType = this.logic.GetCardType(yx.config.m_MaxCardInfo.cardData,yx.config.m_MaxCardInfo.cardCount,false)
	    //只有顺子、连对进行划牌搜索
        if(outType == yx.config.OutCardType.Sequence 
            || outType == yx.config.OutCardType.Sequence_Of_Pairs 
            || outType == yx.config.OutCardType.Arbitrary 
        ){
            var selectCardType = this.logic.GetCardType(pSelectedCard,nSelectedLen)
		    //只有在划的牌不能组成牌型时再去搜索
            if(selectCardType == yx.config.OutCardType.Invalid){
                var bFind,searchResult,cbHitCount = this.logic.SearchOutCard(pSelectedCard, nSelectedLen, self.m_MaxCardInfo.cardData, self.m_MaxCardInfo.cardCount, DDZ_DEF.SearchMode.SearchMode_Sliding,false, DDZ_DEF.OutCardType.Invalid)
                // if cbHitCount > 0 then
                //     self:putDownAllHandCard()
                //     --有具体的压牌牌型，按最小能压的来出
                //     LandlordUtils:popCardsByData(searchResult[1].cbResultCard, searchResult[1].cbCardCount,self.m_vecHandsCache,nil, self.m_pGameLogic:getLaiZiCardData())
                // end
            }
        }
    }
    
    updateCardsRect(updateCard:ccNode){
        var cardIndex = -1
        cardIndex = yx.func.cardIndexFromVectorByData( this.m_HandCardNode, updateCard.getComponent("card_Landlord").getCardData())
        if(cardIndex == -1){
            return
        }
        
        var tmpRect =  this.m_vecCardsRect[cardIndex]
        if (updateCard.getComponent("card_Landlord").getStatusPop() == true ){
            tmpRect = new Rect(
                this.m_vecCardsRect[cardIndex].x, 
                yx.config.CARD_POP_OFFSET_Y, 
                 this.m_vecCardsRect[cardIndex].width, 
                 this.m_vecCardsRect[cardIndex].height
            )
        }else{
            tmpRect = new Rect(
                this.m_vecCardsRect[cardIndex].x, 
                0, 
                 this.m_vecCardsRect[cardIndex].width, 
                 this.m_vecCardsRect[cardIndex].height
            )
        }
         

         this.m_vecCardsRect[cardIndex] = tmpRect
    }
    
    getGameStatus() : number{
        return this.m_enumGameStatus
    }

    updateDisplayOfOutCardBtn(){
        //刷新弹起缓存
        this.updatePopCache()
        //设置出牌按钮的置灰与否
        // if (this.m_vecPopCache.length == 0 ){
        //     this.disableAction(self.m_pActionDisCardSprite, true)
        // }else{
        //     self:disableAction(self.m_pActionDisCardSprite, false)
        // }
           
    }

    updatePopCache(){
        this.m_vecPopCache = []
        for(var i=0;i<this.m_HandCardNode.length;i++){
            if(this.m_HandCardNode[i].getComponent("card_Landlord").getStatusPop() == true){
                this.m_vecPopCache.push(this.m_HandCardNode[i])
            }
        }
        

    }

    resetCardsPosition(nCardCount:number){
        var gmWidth = 0
        var cardPaddingOfHandCards = 0
        var delX = 24
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

        for(var i=0;i<=(nCardCount - 1);i++){
            var pos2 = new Vec3(cardPaddingOfHandCards * i+10-app.winSize.width/2, 0,1)
            this.m_vecCardsPosition.push(pos2)

            var rect = new Rect(cardPaddingOfHandCards * i+35, 0, yx.config.CARD_SIZE.width, yx.config.CARD_SIZE.height)
            this.m_vecCardsRect.push(rect)
        }
       
        this.Items.node_handCard.obtainComponent(UITransform).setContentSize(new Size(gmWidth,this.Items.cardTouchLayout.obtainComponent(UITransform).height))
        this.Items.node_handCard.setPosition((app.winSize.width - gmWidth) / 2, this.Items.node_handCard.getPosition().y)
    }

    //获取单张牌
    getOneCardByData(cardValue:number,cardType:number) : ccNode{
        // let res = this.loadBundleResSync(app.game.getRes('ui/main/reuse/node_poker'),Prefab)
        let res = this.loadBundleResSync(fw.BundleConfig.Landlord.res['ui/main/reuse/node_poker'], Prefab);
        //实例化对象
        let node = instantiate(res);
        let card_Landlord = node.getComponent("card_Landlord");
        card_Landlord.setCardData(cardValue,cardType)

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
            }
        }
        if(type == 3){
            var initPMPos = this.getGameManagerPostion(cbHandCache.length)
            this.Items.node_handCard.setPosition(initPMPos)

            for(let i=0;i<cbHandCache.length ;i++){
                var card = cbHandCache[i]
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
                card.getSiblingIndex(card.getComponent("card_Landlord").getCardLocalZOrder())

                var  delayTime = unitDelayTime * (i+1) 
                tween(card)
                    .delay(delayTime)
                    .call(() => {
                        // card.obtainComponent(UIOpacity).opacity =255 
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
        }else if(type == 2){
            unitDelayTime = unitDelayTime * 0.68
            var initPMPos = this.getGameManagerPostion(1)
            this.Items.node_handCard.setPosition(initPMPos)

            for(let i=0;i<cbHandCache.length ;i++){
                var card = cbHandCache[i]
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

    //展示三张牌揭开后的动画
    showLastThreeCardAndMove(lastThreeCache:number[]){
        this.Items.node_showThreeNormal.active = true
        let startPosArr = []
        let endPosArr = []
        let showFun = (card:ccNode,bg:ccNode,baseBg:ccNode,endPos:Vec2)=>{
            tween(card)
                .hide()
                .delay(0.4)
                .show()
                .to(0.4, { scale: new Vec3(1.6,1.6,1.6) })
                
                .parallel(
                    tween().to(0.5, { scale: new Vec3(1.05,1.05,1.05)}),
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
                .hide()
                .start()
        }
        for(let i=0;i<3;i++){
            let bg = this.Items.node_showThreeNormal.Items["Sprite_BaseCardBG_"+i]
            bg.active = true
            let bgPos = bg.getPosition()
            startPosArr.push(bgPos)

            let baseBg = this.Items.Layout_BaseCardPool.Items["Sprite_BaseCardBG_"+i]
            let endPos = new Vec2()
            endPos.x = bgPos.x + (baseBg.worldPosition.x -  bg.worldPosition.x)
            endPos.y = bgPos.y + (baseBg.worldPosition.y -  bg.worldPosition.y)
            console.log("LH1",endPos.x,bgPos.x,baseBg.worldPosition.x,bg.worldPosition.x)
            endPosArr.push(endPos)

            let card = this.getOneCardByData(lastThreeCache[i],yx.config.CardSizeType.CardSizeType_PoolCard)
            card.getComponent("card_Landlord").getCardNode().setPosition(-25,-32)
            this.Items.node_showThreeAniNode.addChild(card)
            card.setScale(new Vec3(0,1.6,1.6))
            card.setPosition(bgPos.x,bgPos.y )
            
            showFun(card,bg,baseBg,endPos)
        }
        
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