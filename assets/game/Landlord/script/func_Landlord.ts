import { _decorator, Node as ccNode,Animation, Vec2,Vec3 } from 'cc';
const { ccclass } = _decorator;

import { yx } from '../yx_Landlord';
import { func_GameBase } from '../../GameBase/common/func_GameBase';
import proto from '../protobuf/Landlord_format';

@ccclass('func_Landlord')
export class func_Landlord extends func_GameBase {
    /**客户端可用椅子号 */
    clientChairIDs: number[]
    initData() {
        this.clientChairIDs = [0, 1, 2];
    }
    /**获取客户端椅子号 */
    getClientChairIDByServerChairID(nServerChairID: number): number {
        const nMaxPlayerCount = yx.internet.nMaxPlayerCount;
        const nSelfChairID = Math.max(yx.internet.nSelfChairID, 0);
        return this.clientChairIDs[(nServerChairID - nSelfChairID + nMaxPlayerCount) % nMaxPlayerCount];
    }
    /**花色 */
    getCardColor(nCardValue: number) {
        return (nCardValue & 0xF0);
    }
    /**牌值 */
    getCardValue(nCardValue: number) {
        return (nCardValue & 0x0F);
    }
    /**刷新牌 */
    updateCard(card: ccNode, nCardValue?: number) {
        let str: string;
        //花色
        let nColor = yx.func.getCardColor(nCardValue);
        //牌值
        let nValue = yx.func.getCardValue(nCardValue);
        //牌值
        str = `num_${(nColor == yx.config.CardColor.Club || nColor == yx.config.CardColor.Spade) ? `black` : `red`}_`;
        card.Items.Sprite_value.updateSprite(app.game.getRes(`ui/main/img/atlas/${str}${nValue}/spriteFrame`), { bAutoShowHide: true, });
        //小花色
        str = ({
            [yx.config.CardColor.Club]: `logo_club`,
            [yx.config.CardColor.Diamond]: `logo_diamond`,
            [yx.config.CardColor.Heart]: `logo_heart`,
            [yx.config.CardColor.Spade]: `logo_spade`,
        })[nColor];
        card.Items.Sprite_color_small.updateSprite(app.game.getRes(`ui/main/img/atlas/${str}/spriteFrame`), { bAutoShowHide: true, });
        //大花色
        if (nValue > 10) {
            str = `logo_${nValue}`;
        } else {
            str = ({
                [yx.config.CardColor.Club]: `logo_club`,
                [yx.config.CardColor.Diamond]: `logo_diamond`,
                [yx.config.CardColor.Heart]: `logo_heart`,
                [yx.config.CardColor.Spade]: `logo_spade`,
            })[nColor];
        }
        card.Items.Sprite_color_big.updateSprite(app.game.getRes(`ui/main/img/atlas/${str}/spriteFrame`), { bAutoShowHide: true, });
    }

    /**播放闹钟最后三秒动作 */
    playTimerAnimation(nodeTimer: ccNode,isPlay :boolean) {
        if(fw.isNull(nodeTimer) || fw.isNull(nodeTimer.Items[`Sprite_TimerBG`])){
            return
        }
        const a = nodeTimer.Items[`Sprite_TimerBG`].getComponent(Animation);
        a.stop()
        if(isPlay){
            a.play(`clock`);
            yx.main.sound.playClockEffect()
        }else{
            a.play(`clock`);
            a.stop()
        }
    }
    
    /**设置闹钟倒计时 */
    //@ts-ignore
    setTimerSchedule(nodeTimer: ccNode,time :number,callback?:Function,needAni?:boolean) {
        if(fw.isNull(nodeTimer) || fw.isNull(nodeTimer.Items[`BMFont_TimeValue`])){
            return
        }
        nodeTimer["clockTime"] = time
        yx.func.playTimerAnimation(nodeTimer,false)
        let isAni = needAni == false ? false : true
        let updateLastTime = () => {
            nodeTimer.Items[`BMFont_TimeValue`].string = "" + nodeTimer["clockTime"]
            if(isAni){
                if (nodeTimer["clockTime"] == 1 || nodeTimer["clockTime"] == 2 || nodeTimer["clockTime"] == 3 ) {
                    yx.func.playTimerAnimation(nodeTimer,true)
                }
            }
            if (nodeTimer["clockTime"] <= 0) {
                if (nodeTimer["schedule_updateClockTime"]) {
                    nodeTimer.clearIntervalTimer(nodeTimer["schedule_updateClockTime"]);
                    nodeTimer["schedule_updateClockTime"] = null;
                }
                if(callback){
                    callback()
                }
                // app.event.dispatchEvent({
                //     eventName: EVENT_ID.EVENT_PLAZA_FIRSTRECHRGE_LASTTIME,
                // });
            }
            nodeTimer["clockTime"]--;
            
        }
        updateLastTime();
        if (nodeTimer["schedule_updateClockTime"]) {
            nodeTimer.clearIntervalTimer(nodeTimer["schedule_updateClockTime"]);
            nodeTimer["schedule_updateClockTime"] = null;
        }
        nodeTimer["schedule_updateClockTime"] = this.setInterval(updateLastTime, 1)
    }

    //[[
        //1.发牌时发出的牌按照大小自左向右排序(大王,小王,2,A,K,Q,J,10,9,8,7,6,5,4,3)
        //2.同点数的牌按花色进行排序,自左向右为黑桃,红桃,梅花,方片.
    //]]
    sortCard(cardVec){
        cardVec.sort((a: ccNode, b: ccNode) => {
            if (a === b) {
              return 0;
            }
            
            const aZOrder = a.getComponent("card_Landlord").getCardLocalZOrder();
            const bZOrder = b.getComponent("card_Landlord").getCardLocalZOrder();
          
            if (aZOrder < bZOrder) {
              return -1;
            } else if (aZOrder > bZOrder) {
              return 1;
            } else {
              return 0;
            }
          });
    }

    //整理扑克的数据，丢到一个table里
    cardDatasFromVector(sourceVec):any[]{
        var result = []
        if(sourceVec && sourceVec.length>0){
            for(var i=0;i<sourceVec.length;i++){
                if(!fw.isNull(sourceVec[i])){
                    result.push(sourceVec[i].getComponent("card_Landlord").getCardData())
                }
            }
        }


        return result
    }

    //判断server传过来的牌值是否正确
    verification(cardData:number):boolean{
        if(!cardData || typeof cardData !== 'number'){
            return false
        }


        return yx.config.CARD_DATA.indexOf(cardData) != -1
    }

    // /**
    // @brief 弹起扑克
    // @param cardData         待弹起的扑克数据
    // @param cardDataCount    待弹起的扑克数量
    // @param sourceVec        手牌容器
    // */
    popCardsByData(cardData, cardDataCount, handCardVec, callback, laiziCardData){
        if(cardDataCount == 0){
            return
        }
        if(laiziCardData > 0){
           
        }else{
            for(var i=0;i<cardDataCount;i++){
                var card = this.findCardFromVectorByData(handCardVec, cardData[i])
                if(!fw.isNull(card)){
                    card.getComponent("card_Landlord").setPop(true)
                    if(callback){
                        callback(card)
                    }
                }
            }
        }
    }
    //根据传入牌值数组去掉手牌
    removeCardByData(cardData:number[],handCardNode:ccNode[],handCardData:number[]){
        for(let i=0;i<cardData.length;i++){
            this.removeCardByValue(cardData[i],handCardNode)
            let idx = handCardData.indexOf(cardData[i])
            if(idx != -1){
                handCardData.splice(idx,1)
            }
        }
    }
    //根据传入牌值获取手牌
    removeCardByValue(cardValue:number,handCardNode:ccNode[]){
        for(var i=handCardNode.length-1;i>=0;i--){
            if(handCardNode[i].getComponent("card_Landlord").getCardData() == cardValue){
                let card = handCardNode[i]
                handCardNode.splice(i,1)
                card.removeFromParent(true)
                return true
            }
        }
        return false
    }
    //获取出牌的坐标
    getCardPositionForOutCard(ClientChairID:number,cardCount:number):Vec3[]{
        var posVecs:Vec3[] = []
        if(ClientChairID == 0){
            for(var i=0;i<cardCount;i++){
                posVecs.push(new Vec3((yx.config.CARD_PADDING_OF_OUT_CARDS+10)*(i-(cardCount-1)/2)-yx.config.OUT_CARD_SIZE.width*yx.config.CARD_SCALE_OUT_CARDS*0.5,0,1))
            }
        }else if(ClientChairID == 1){
            for(var i=0;i<cardCount;i++){
                posVecs.push(new Vec3(yx.config.CARD_PADDING_OF_OUT_CARDS*(cardCount -i - 1)*-1-yx.config.OUT_CARD_SIZE.width*yx.config.CARD_SCALE_OUT_CARDS,0,1))
            }
        }else if(ClientChairID == 2){
            for(var i=0;i<cardCount;i++){
                posVecs.push(new Vec3(yx.config.CARD_PADDING_OF_OUT_CARDS*(i),0,1))
            }
        }
        return posVecs
    }

    //获取摊牌的坐标
    getCardPositionForTanCard(ClientChairID:number,cardCount:number):Vec3[]{
        var posVecs:Vec3[] = []
        if(ClientChairID == 0){
            for(var i=0;i<cardCount;i++){
                posVecs.push(new Vec3(yx.config.CARD_PADDING_OF_OUT_CARDS*(i-(cardCount-1)/2)-yx.config.OUT_CARD_SIZE.width*yx.config.CARD_SCALE_OUT_CARDS*0.5,0,1))
            }
        }else if(ClientChairID == 1){
            let max = cardCount >= 10 ? 10 : cardCount
            for(var i=0;i<cardCount;i++){
                posVecs.push(new Vec3(yx.config.CARD_PADDING_OF_OUT_CARDS*(max -i%max - 1)*-1-yx.config.OUT_CARD_SIZE.width*yx.config.CARD_SCALE_OUT_CARDS,-70*(Math.floor(i/max))+70,1))
            }
        }else if(ClientChairID == 2){
            for(var i=0;i<cardCount;i++){
                posVecs.push(new Vec3(yx.config.CARD_PADDING_OF_OUT_CARDS*(i%10),-70*(Math.floor(i/10))+70,1))
            }
        }
        return posVecs
    }

    //获取明牌的坐标
    getCardPositionForMingpai(ClientChairID:number,cardCount:number):Vec3[]{
        var posVecs:Vec3[] = []
        if(ClientChairID == 0){
            for(var i=0;i<cardCount;i++){
                posVecs.push(new Vec3(yx.config.CARD_PADDING_OF_OUT_CARDS*(i-(cardCount-1)/2)-yx.config.OUT_CARD_SIZE.width*yx.config.CARD_SCALE_OUT_CARDS*0.5,0,1))
            }
        }else if(ClientChairID == 1){
            for(var i=0;i<cardCount;i++){
                posVecs.push(new Vec3(20*(cardCount -i - 1)*-1-yx.config.CARD_SIZE.width*0.36,0,1))
            }
        }else if(ClientChairID == 2){
            for(var i=0;i<cardCount;i++){
                posVecs.push(new Vec3(20*(i),0,1))
            }
        }
        return posVecs
        var posVecs:Vec3[] = []
        if(ClientChairID == 0){
            for(var i=0;i<cardCount;i++){
                posVecs.push(new Vec3(yx.config.CARD_PADDING_OF_OUT_CARDS*(i-(cardCount-1)/2)-yx.config.OUT_CARD_SIZE.width*yx.config.CARD_SCALE_OUT_CARDS*0.5,0,1))
            }
        }else if(ClientChairID == 1){
            let max = cardCount >= 10 ? 10 : cardCount
            for(var i=0;i<cardCount;i++){
                posVecs.push(new Vec3(20*(max -i%max - 1)*-1-yx.config.OUT_CARD_SIZE.width*0.4,-45*(Math.floor(i/max)),1))
            }
        }else if(ClientChairID == 2){
            for(var i=0;i<cardCount;i++){
                posVecs.push(new Vec3(20*(i%10),-45*(Math.floor(i/10)),1))
            }
        }
        return posVecs
    }

   // /**
    // @brief 查找牌索引(癞子)
    // @param vec      待查找的容器
    // @param cardID   牌的ID()
    // @return 待查找牌的索引
    // */
    cardIndexFromVectorByData(vec, cardData){
        var index = -1
        for(var i=0;i<vec.length;i++){
            if(cardData == vec[i].getComponent("card_Landlord").getCardData()){
                index = i
                break
            }
        }
    
        return index
    }

    ///
       // @brief 查找牌
       // @param vec		待查找的容器
       // @param cardID	牌的ID()
       // @return 待查找的牌
    //
    findCardFromVectorByData(vec,cardData){
        var card = null
        for(var i=0;i<vec.length;i++){
            if(cardData == vec[i].getComponent("card_Landlord").getCardData()){
                card = vec[i]
                break;
            }
        }
        return card
    }

    //根据张数 三带单转飞机带单/三带双转飞机带双
    turnSequenceByCardNum(data: proto.client_proto_ddz.IDDZ_S_OutCard){
        if(data.cardtype == yx.config.OutCardType.Triplet_Attached_Card && data.outcards.length > 4){
            data.cardtype = yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards
        }
        if(data.cardtype == yx.config.OutCardType.Triplet_Attached_Pair && data.outcards.length > 5){
            data.cardtype = yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Pairs 
        }
        return data
    }

}

/**类型声明调整 */
declare global {
    namespace globalThis {
        type type_func_Landlord = func_Landlord
    }
}
