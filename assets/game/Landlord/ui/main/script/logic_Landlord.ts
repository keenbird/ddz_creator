import { _decorator } from 'cc';
import { yx } from '../../../yx_Landlord';
import { RenderEntityBoolSharedBufferView } from '../../../../../../engine/cocos/2d/renderer/render-entity';
const { ccclass } = _decorator;
 
interface AnalyseResultEx {
	cbSingleCount: number;
	cbDoubleCount: number;
	cbThreeCount: number;
	cbFourCount: number;
	cbSingleCardData: number[];
	cbDoubleCardData: number[];
	cbThreeCardData: number[];
	cbFourCardData: number[];
}

interface HitCardResult {
    cbOutCardType : number;
    cbCardCount : number;
    cbLaiziCount: number;
    isFromBoom : boolean;
    cbResultCard : number[];
}
  
interface CardsAnalyseResult {
	cbQuadrupleCount: number;
	cbQuadrupleCountLaiZi: number;
	cbTripleCount: number;
	cbDoubleCount: number;
	cbSingleCount: number;
	cbQuadrupleCardData: number[];
	cbQuadrupleCardDataLaiZi: number[];
	cbTripleCardData: number[];
	cbTripleCardData_unOrder: number[];
	cbTripleCardData_unBomb: number[];
	cbDoubleCardData: number[];
	cbDoubleCardData_unOrder: number[];
	cbDoubleCardData_unBomb: number[];
	cbSingleCardData: number[];
	cbSingleCardData_unOrder: number[];
	cbSingleCardData_unBomb: number[];
	bContainsRocket: boolean;
	cbRocketCardData: number[];
	bLaiZiBomb: boolean;
	cbLaiZiBombCardData: number[];
	cbFiveCount: number;
	cbFiveCardData: number[];
	cbFiveCardDataLaiZi: number[];
  }

@ccclass('logic_Landlord')
export class logic_Landlord extends (fw.FWComponent) {
	cbRegionTail: number;
	cbRegionHead: number;
	createTagAnalyseResultEx(): AnalyseResultEx {
		return {
		  cbSingleCount: 0,
		  cbDoubleCount: 0,
		  cbThreeCount: 0,
		  cbFourCount: 0,
		  cbSingleCardData: [],
		  cbDoubleCardData: [],
		  cbThreeCardData: [],
		  cbFourCardData: [],
		};
	}

	createHitCardResult(): HitCardResult {
		return {
			cbOutCardType : -1,
			cbCardCount : 0,
			cbLaiziCount: 0,
			isFromBoom : false,
			cbResultCard : [],
		};
	}
	
	createCardsAnalyseResult(): CardsAnalyseResult {
		return {
		  cbQuadrupleCount: 0,
		  cbQuadrupleCountLaiZi: 0,
		  cbTripleCount: 0,
		  cbDoubleCount: 0,
		  cbSingleCount: 0,
		  cbQuadrupleCardData: [],
		  cbQuadrupleCardDataLaiZi: [],
		  cbTripleCardData: [],
		  cbTripleCardData_unOrder: [],
		  cbTripleCardData_unBomb: [],
		  cbDoubleCardData: [],
		  cbDoubleCardData_unOrder: [],
		  cbDoubleCardData_unBomb: [],
		  cbSingleCardData: [],
		  cbSingleCardData_unOrder: [],
		  cbSingleCardData_unBomb: [],
		  bContainsRocket: false,
		  cbRocketCardData: [],
		  bLaiZiBomb: false,
		  cbLaiZiBombCardData: [],
		  cbFiveCount: 0,
		  cbFiveCardData: [],
		  cbFiveCardDataLaiZi: [],
		};
	}
	
	//合并cbLhsCardData和cbRhsCardData
	mergeCardData(cbLhsCardData:number[],cbLhsCardCount:number,cbRhsCardData:number[],cbRhsCardCount:number):[number[],number]{
		var cbUnionCardCount = cbLhsCardCount
		var cbUnionCardData = []
		for(var i=0;i<cbLhsCardData.length;i++){
			cbUnionCardData.push(cbLhsCardData[i])
		}

		for(var i=0;i<cbRhsCardData.length;i++){
			var bNeedUpdate = true
			for(var j=0;j<cbUnionCardData.length;j++){
				if(cbRhsCardData[i] == cbUnionCardData[j]){
					bNeedUpdate = false
                	break
				}
			}
			if(bNeedUpdate == true){
				cbUnionCardCount++;
				cbUnionCardData[cbUnionCardCount-1] = cbRhsCardData[i]
			}
		}
		//根据牌面值排序
		this.SortCardData(cbUnionCardData,cbUnionCardCount,yx.config.CardSortOrder.ASC)
		return [cbUnionCardData,cbUnionCardCount]
	}
	//[[
		//@brief 重新排序出牌的扑克ZOrder
		//@discussion 6-5-5-5-4-4-4-3，重新排序后，5-5-5-4-4-4-6-3
		//@param cbCardData	打出的扑克
		//@param cbCardCount	打出的张数
		//@return 是否是合法的序列
	//]]
	resortZOrderForOutCard(cbCardData:number[],cbCardCount:number,bFirstOut?:boolean):number[] {
		//1.先对扑克进行排序
    	this.SortCardData(cbCardData,cbCardCount,yx.config.CardSortOrder.DESC)
		//2.分析手牌的组成
		var analyseResult = this.AnalyzeCardData(cbCardData,cbCardCount,yx.config.CardSortOrder.DESC)
		//3.根据牌型的组成判断牌型
		var outType = this.GetCardType(cbCardData,cbCardCount,bFirstOut)
		//4.对扑克重新排序，如：飞机带单44443333=>44433343
		if(outType == yx.config.OutCardType.Invalid){
			return cbCardData
		}else if(outType == yx.config.OutCardType.Sequence){
			return cbCardData
		}else if(outType == yx.config.OutCardType.Triplet_Attached_Pair){
			cbCardData = []
			for(var i=0;i<analyseResult.cbTripleCardData.length;i++){
				cbCardData.push(analyseResult.cbTripleCardData[i])
			}
			for(var i=0;i<analyseResult.cbDoubleCardData.length;i++){
				cbCardData.push(analyseResult.cbDoubleCardData[i])
			}
		}else if(outType == yx.config.OutCardType.Triplet_Attached_Card){
			cbCardData = []
			for(var i=0;i<analyseResult.cbTripleCardData.length;i++){
				cbCardData.push(analyseResult.cbTripleCardData[i])
			}
			for(var i=0;i<analyseResult.cbSingleCardData.length;i++){
				cbCardData.push(analyseResult.cbSingleCardData[i])
			}
		}else if(outType == yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Pairs){
			cbCardData = []
			var cbTripletsCardData = []
			var cbDoubleCardData = []
			for(var i=0;i<analyseResult.cbTripleCardData.length;i++){
				cbTripletsCardData.push(analyseResult.cbTripleCardData[i])
			}
			var checkDouble = true
			if(checkDouble){
				//--飞机带炸
				for(var i=0;i<analyseResult.cbQuadrupleCardData.length;i++){
					cbDoubleCardData.push(analyseResult.cbQuadrupleCardData[i])
				}
				for(var i=0;i<analyseResult.cbDoubleCardData.length;i++){
					cbDoubleCardData.push(analyseResult.cbDoubleCardData[i])
				}
				if(analyseResult.cbSingleCount > 0){
					for(var i=0;i<analyseResult.cbSingleCardData.length;i++){
						cbDoubleCardData.push(analyseResult.cbSingleCardData[i])
					}
				}
			}
			this.SortCardData(cbDoubleCardData,cbDoubleCardData.length,yx.config.CardSortOrder.DESC)
        	cbCardData = []
			//--组合
			for(var i=0;i<cbTripletsCardData.length;i++){
				cbCardData.push(cbTripletsCardData[i])
			}
			for(var i=0;i<cbDoubleCardData.length;i++){
				cbCardData.push(cbDoubleCardData[i])
			}
		}else if(outType == yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards){
			var cbTripletsCardData = []
			var cbSingCardData = []
			//--对于2特殊处理
			if(this.GetCardLogicValue(analyseResult.cbTripleCardData[0]) == this.GetCardLogicValue(0x02)){
				cbSingCardData.push(analyseResult.cbTripleCardData[0])
				cbSingCardData.push(analyseResult.cbTripleCardData[1])
				cbSingCardData.push(analyseResult.cbTripleCardData[2])
			}
			var [cbThreeCardData,cbThreeCount] = this.GetThreeSameGroup_One(analyseResult,cbCardCount)
			var firstLogicValue = this.GetCardLogicValue(cbThreeCardData[0])
			var bFirst = true
			for(var i=1;i<cbThreeCount;i++){
				var nextLogicValue = this.GetCardLogicValue(cbThreeCardData[i*3])
				if(firstLogicValue == nextLogicValue + i ){
					if(bFirst == true){
						cbTripletsCardData.push(cbThreeCardData[(i-1)*3])
						cbTripletsCardData.push(cbThreeCardData[(i-1)*3+1])
						cbTripletsCardData.push(cbThreeCardData[(i-1)*3+2])
						bFirst = false
					}
					cbTripletsCardData.push(cbThreeCardData[(i)*3])
					cbTripletsCardData.push(cbThreeCardData[(i)*3+1])
					cbTripletsCardData.push(cbThreeCardData[(i)*3+2])
				}else{
					if(bFirst == true){
						cbSingCardData.push(cbThreeCardData[(i-1)*3])
						cbSingCardData.push(cbThreeCardData[(i-1)*3+1])
						cbSingCardData.push(cbThreeCardData[(i-1)*3+2])
						firstLogicValue = nextLogicValue + 1
					}else{
						cbSingCardData.push(cbThreeCardData[(i)*3])
						cbSingCardData.push(cbThreeCardData[(i)*3+1])
						cbSingCardData.push(cbThreeCardData[(i)*3+2])
					}
				}
			}
			this.SortCardData(cbTripletsCardData,cbTripletsCardData.length,yx.config.CardSortOrder.DESC)
			if(analyseResult.bContainsRocket == true){
				cbSingCardData.push(analyseResult.cbRocketCardData[0])
				cbSingCardData.push(analyseResult.cbRocketCardData[1])
			}
			for(var i=0;i<analyseResult.cbQuadrupleCount;i++){
				cbSingCardData.push(analyseResult.cbQuadrupleCardData[(i+1)*4-3])
			}
			for(var i=0;i<analyseResult.cbSingleCardData.length;i++){
				cbSingCardData.push(analyseResult.cbSingleCardData[i])
			}
			for(var i=0;i<analyseResult.cbDoubleCardData.length;i++){
				cbSingCardData.push(analyseResult.cbDoubleCardData[i])
			}

			this.SortCardData(cbSingCardData,cbSingCardData.length,yx.config.CardSortOrder.DESC)
			cbCardData = []
			//--组合
			for(var i=0;i<cbTripletsCardData.length;i++){
				cbCardData.push(cbTripletsCardData[i])
			}
			for(var i=0;i<cbSingCardData.length;i++){
				cbCardData.push(cbSingCardData[i])
			}
		}else if(outType == yx.config.OutCardType.Quadplex_Attached_Two_Pairs){
			cbCardData = []
			for(var i=0;i<analyseResult.cbQuadrupleCardData.length;i++){
				cbCardData.push(analyseResult.cbQuadrupleCardData[i])
			}
			for(var i=0;i<analyseResult.cbQuadrupleCardDataLaiZi.length;i++){
				cbCardData.push(analyseResult.cbQuadrupleCardDataLaiZi[i])
			}
			for(var i=0;i<analyseResult.cbLaiZiBombCardData.length;i++){
				cbCardData.push(analyseResult.cbLaiZiBombCardData[i])
			}
			for(var i=0;i<analyseResult.cbDoubleCardData.length;i++){
				cbCardData.push(analyseResult.cbDoubleCardData[i])
			}
		}else if(outType == yx.config.OutCardType.Quadplex_Attached_Two_Cards){
			cbCardData = []
			for(var i=0;i<analyseResult.cbQuadrupleCardData.length;i++){
				cbCardData.push(analyseResult.cbQuadrupleCardData[i])
			}
			for(var i=0;i<analyseResult.cbQuadrupleCardDataLaiZi.length;i++){
				cbCardData.push(analyseResult.cbQuadrupleCardDataLaiZi[i])
			}
			for(var i=0;i<analyseResult.cbLaiZiBombCardData.length;i++){
				cbCardData.push(analyseResult.cbLaiZiBombCardData[i])
			}
			this.SortCardData(analyseResult.cbDoubleCardData,analyseResult.cbDoubleCount*2,yx.config.CardSortOrder.DESC)
			for(var i=0;i<analyseResult.cbDoubleCardData.length;i++){
				cbCardData.push(analyseResult.cbDoubleCardData[i])
			}
        	this.SortCardData(analyseResult.cbSingleCardData,analyseResult.cbSingleCount,yx.config.CardSortOrder.DESC)
			for(var i=0;i<analyseResult.cbSingleCardData.length;i++){
				cbCardData.push(analyseResult.cbSingleCardData[i])
			}
			for(var i=0;i<analyseResult.cbRocketCardData.length;i++){
				cbCardData.push(analyseResult.cbRocketCardData[i])
			}
		}
		return cbCardData
		
	}
	CompareCard(cbLCardData:number[], cbLCardCount:number, cbRCardData:number[], cbRCardCount:number,cbInRCardType?:number):boolean{
		var cbLCardType = this.GetCardType(cbLCardData, cbLCardCount)
		var cbRCardType = cbInRCardType ? cbInRCardType : this.GetCardType(cbRCardData, cbRCardCount )
		//下手牌非法，无需比较，不可以出牌
		if(cbRCardType == yx.config.OutCardType.Invalid){
			return false
		}
		//上手牌非法，无需比较，可以出牌
		if(cbLCardType == yx.config.OutCardType.Invalid){
			return true
		}
		//如果上手牌是连炸
		if(cbLCardType == yx.config.OutCardType.serial_bomb){
			if(cbRCardType == yx.config.OutCardType.serial_bomb){
				if(cbLCardCount == cbRCardCount){
					var cbRCardLogicValue = this.GetCardLogicValue(cbRCardData[0])
					var cbLCardLogicValue = this.GetCardLogicValue(cbLCardData[0])
					return cbRCardLogicValue > cbLCardLogicValue
				}else{
					return cbRCardCount > cbLCardCount
				}
			}else{
				return false
			}
		}

		//如果下手牌是连炸 上手牌不是 则能出牌
		if(cbRCardType == yx.config.OutCardType.serial_bomb){
			return true
		}

		//下手牌是火箭，最大，可以出牌
		if(cbRCardType == yx.config.OutCardType.Rocket){
			return true
		}

		//左手牌是火箭，没有大于的，不可以出牌
		if(cbLCardType == yx.config.OutCardType.Rocket){
			return false
		}

		// //上家是癞子炸弹
		// if(cbLCardType == yx.config.OutCardType.LaiZiBomb){
		// 	return false
		// }

		// //下家是癞子炸弹
		// if(cbRCardType == yx.config.OutCardType.LaiZiBomb){
		// 	return true
		// }

		//上家是自己打出的牌，此时是任意出牌，可以出牌
		if(cbLCardType == yx.config.OutCardType.Arbitrary){
			return true
		}

		//上右手是炸弹，最大
		if(cbLCardType != yx.config.OutCardType.Bomb && cbRCardType == yx.config.OutCardType.Bomb){
			return true
		}

		//左手是炸弹，最大
		if(cbLCardType == yx.config.OutCardType.Bomb && cbRCardType != yx.config.OutCardType.Bomb){
			return false
		}

		//左手不是软炸 右手是软炸，最大
		if( cbLCardType != yx.config.OutCardType.softBomb && cbRCardType == yx.config.OutCardType.softBomb ){
			return true
		}

		//左手是软炸，最大  右手不是软炸
		if(cbLCardType == yx.config.OutCardType.softBomb && cbRCardType != yx.config.OutCardType.softBomb){
			return false
		}

		//规则不一致
		if(cbLCardType != cbRCardType || cbLCardCount != cbRCardCount){
			return false
		}

		if(cbRCardType == yx.config.OutCardType.Single 
		    ||cbRCardType == yx.config.OutCardType.Double 
		    ||cbRCardType == yx.config.OutCardType.Triplet 
		    ||cbRCardType == yx.config.OutCardType.Sequence 
		    ||cbRCardType == yx.config.OutCardType.Sequence_Of_Pairs 
		    ||cbRCardType == yx.config.OutCardType.Sequence_Of_Triplets 
		    ||cbRCardType == yx.config.OutCardType.softBomb 
		    ||cbRCardType == yx.config.OutCardType.Bomb 
		){
			//以上牌型，均可按首牌逻辑值来判断大小
			var cbRCardLogicValue = this.GetCardLogicValue(cbRCardData[0])
			var cbLCardLogicValue = this.GetCardLogicValue(cbLCardData[0])
        	return cbRCardLogicValue > cbLCardLogicValue
		}else if(cbRCardType == yx.config.OutCardType.Triplet_Attached_Card
			||cbRCardType == yx.config.OutCardType.Triplet_Attached_Pair
			||cbRCardType == yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards
			||cbRCardType == yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Pairs
		){
			//三带一、三带二, 通过分析结果，取三张的首张来比较
			var lResult = this.AnalyzeCardData(cbLCardData, cbLCardCount, yx.config.CardSortOrder.DESC)
			var rResult = this.AnalyzeCardData(cbRCardData, cbRCardCount, yx.config.CardSortOrder.DESC)

			if(5 >= cbLCardCount){
				var cbLFirstCardLogicValue = this.GetCardLogicValue(lResult.cbTripleCardData[0])
				var cbRFirstCardLogicValue = this.GetCardLogicValue(rResult.cbTripleCardData[0])
            	return cbRFirstCardLogicValue > cbLFirstCardLogicValue     
			}

			//查找所有三张组合
			var [cbNextThreeCardData,cbNextThreeCount] = this.GetThreeSameGroup_One(rResult, cbRCardCount)
			var [cbFirstThreeCardData,cbFirstThreeCount] = this.GetThreeSameGroup_One(lResult, cbLCardCount)

			//获取数值
			var cbNextLogicValue = this.GetCardLogicValue(cbNextThreeCardData[0])
			var cbFirstLogicValue = this.GetCardLogicValue(cbFirstThreeCardData[0])
			//对比扑克
        	return cbNextLogicValue>cbFirstLogicValue
		}else if(cbRCardType == yx.config.OutCardType.Quadplex_Attached_Two_Cards
			||cbRCardType == yx.config.OutCardType.Quadplex_Attached_Two_Pairs
		){
			//四带二张、四带二对, 通过分析结果，取四张的首张来比较
			var lResult = this.AnalyzeCardData(cbLCardData, cbLCardCount, yx.config.CardSortOrder.DESC)
			var rResult = this.AnalyzeCardData(cbRCardData, cbRCardCount, yx.config.CardSortOrder.DESC)
			var cbLFirstCardLogicValue = this.GetCardLogicValue(lResult.cbQuadrupleCardData[0])
			var cbRFirstCardLogicValue = this.GetCardLogicValue(rResult.cbQuadrupleCardData[0])

			
			if(lResult.cbQuadrupleCount > 0){
				cbLFirstCardLogicValue = this.GetCardLogicValue(lResult.cbQuadrupleCardData[0])
			}else if(lResult.cbQuadrupleCountLaiZi > 0){
				cbLFirstCardLogicValue = this.GetCardLogicValue(lResult.cbQuadrupleCardDataLaiZi[0])
			}else if(lResult.bLaiZiBomb){
				cbLFirstCardLogicValue = this.GetCardLogicValue(lResult.cbLaiZiBombCardData[0])
			}

			if(rResult.cbQuadrupleCount > 0){
				cbRFirstCardLogicValue = this.GetCardLogicValue(rResult.cbQuadrupleCardData[0])
			}else if(rResult.cbQuadrupleCountLaiZi > 0){
				cbRFirstCardLogicValue = this.GetCardLogicValue(rResult.cbQuadrupleCardDataLaiZi[0])
			}else if(rResult.bLaiZiBomb){
				cbRFirstCardLogicValue = this.GetCardLogicValue(rResult.cbLaiZiBombCardData[0])
			}

			return cbRFirstCardLogicValue > cbLFirstCardLogicValue
		}
		return false
	}
	GetThreeSameGroup_One(AnalyseResult:CardsAnalyseResult,cbCardCount:number):[number[],number]{
		var cbThreeCardData = []
		if(yx.config.MAX_COUNT < AnalyseResult.cbTripleCardData.length){
			return [cbThreeCardData,0]
		}
		//查找所有三张 组合
		var cbSameCount = 3
		var cbThreeCount = AnalyseResult.cbTripleCount
		for(var i=0;i<AnalyseResult.cbTripleCardData.length;i++){
			cbThreeCardData.push(AnalyseResult.cbTripleCardData[i])
		}
		for(var i=0;i<AnalyseResult.cbQuadrupleCount;i++){
			cbThreeCardData.push(AnalyseResult.cbQuadrupleCardData[i*4])
			cbThreeCardData.push(AnalyseResult.cbQuadrupleCardData[i*4+1])
			cbThreeCardData.push(AnalyseResult.cbQuadrupleCardData[i*4+2])
			cbThreeCount++
		}
		//判断组合数
		if(cbThreeCount == 0){
			return [cbThreeCardData,cbThreeCount]
		}

		//从大到小排序
    	this.SortCardData(cbThreeCardData,cbThreeCardData.length,yx.config.CardSortOrder.DESC)
		//过滤掉非连牌数据2
		if (this.GetCardLogicValue(cbThreeCardData[1]) == this.GetCardLogicValue(0x02) ){
			var cbThreeCardDataTemp = []
			for(var i=0;i<cbThreeCardData.length;i++){
				cbThreeCardDataTemp.push(cbThreeCardData[i])
			}
			cbThreeCardData = []
			for(var i=cbSameCount;i<cbThreeCardDataTemp.length;i++){
				cbThreeCardData.push(cbThreeCardDataTemp[i])
			}
			
			cbThreeCount = cbThreeCount - 1
		}

		return [cbThreeCardData,cbThreeCount]
	}
	getLaiZiCardData():number{
		return 0
	}
	SearchOutCard(cbHandCardData:number[],cbHandCardCount:number,cbTurnCardData:number[],cbTurnCardCount:number,mode:number,bSearchType:any,SearchOutCardType:number):[boolean,any[],number]{
		let self = this
		if (cbHandCardCount == 0) {
			return [false,null,0]
		}

		var hitResult = []
		for(var i=0;i<20;i++){
			hitResult.push(this.createHitCardResult())
		}

		var cbHitCardCount = 1

		var cbHandCardDataCopy = cbHandCardData.slice()
		var cbHandCardCountCopy = cbHandCardCount

		var cbOutCardData = this.resortZOrderForOutCard(cbTurnCardData,cbTurnCardCount,false) //clone(cbTurnCardData)
		var cbOutCardCount = cbTurnCardCount


		var cbTurnCardHeadLogicValue = 0x00
		if(cbTurnCardData.length > 0 && cbTurnCardCount > 0 && ! bSearchType){
			cbTurnCardHeadLogicValue = this.GetCardLogicValue(cbOutCardData[0])
		}
		//分析手牌扑克
		//分析当前手牌的组成
		var analyseResult = this.AnalyzeHandCardData(cbHandCardDataCopy,cbHandCardCountCopy,yx.config.CardSortOrder.DESC)
		var unorderResult = this.AnalyzeCardDataUnOrder(analyseResult,yx.config.CardSortOrder.DESC)
		//--计算手牌癞子数量
		var cbLaiZiCount = 0
		
		var cbTurnOutType = bSearchType == true ? SearchOutCardType : this.GetCardType(cbOutCardData,cbOutCardCount)
		//-- 找大于连炸的牌
		if(cbTurnOutType == yx.config.OutCardType.serial_bomb){
			var cbLogicValue = this.GetCardLogicValue(cbOutCardData[0])
			var cbQuadrupleCount = analyseResult.cbQuadrupleCount
			var cbOutCardQuadrupleCount = cbOutCardCount / 4
			if(cbOutCardQuadrupleCount <= cbQuadrupleCount ){
				for(var line=cbOutCardQuadrupleCount;cbOutCardQuadrupleCount<=cbQuadrupleCount;line++){
					for(var i=cbQuadrupleCount;i>=1;i--){
						if (i - line < 0 ){
							break
						}
						var cbHandLogicValue = this.GetCardLogicValue(analyseResult.cbQuadrupleCardData[(i-1)*4])
						var cbHandLogicValue2 = this.GetCardLogicValue(analyseResult.cbQuadrupleCardData[(i - line)*4])
						if(cbHandLogicValue2 != 15 && (cbHandLogicValue2 > cbLogicValue || line > cbOutCardQuadrupleCount) && cbHandLogicValue2 - cbHandLogicValue == line - 1 ){
							hitResult[cbHitCardCount-1].cbResultCard = []
							for(var k=i-line+1;k<=i;k++){
								for(var j=1;j<=4;j++){
									hitResult[cbHitCardCount-1].cbResultCard.push(analyseResult.cbQuadrupleCardData[(k-1)*4+j-1])
								}
							}
							hitResult[cbHitCardCount-1].cbCardCount = line * 4
                        	cbHitCardCount = cbHitCardCount + 1
							if(cbHitCardCount > yx.config.MAX_COUNT){
								return [true,hitResult,cbHitCardCount-1]
							}
						}
					}
				}
			}
		}else{
			if(cbTurnOutType == yx.config.OutCardType.Arbitrary){
				var minSequenceLen = 5
				var prefind = function(rs){
					var vec = [0,0]
					if(rs.cbSingleCount >= minSequenceLen){
						var maxSequenceLen = 0
                    	var startIDX = 0
						for(var outIDX=1;outIDX <=rs.cbSingleCount;outIDX++){
							var curSequenceLen = 1
                        	startIDX = outIDX
							for(var innerIDX=outIDX;innerIDX <=rs.rs.cbSingleCount - 1;innerIDX++){
								var lastLogicValue = this.GetCardLogicValue(rs.cbSingleCardData[innerIDX-1])
                            	var nextLogicValue = this.GetCardLogicValue(rs.cbSingleCardData[innerIDX])
							}
							//连续
							if(lastLogicValue - 1 != nextLogicValue || lastLogicValue >= this.GetCardLogicValue(0x02)){
								break
							}else{
								curSequenceLen = curSequenceLen + 1
							}
                            
						}
						if(curSequenceLen >= minSequenceLen && curSequenceLen >= maxSequenceLen){
							maxSequenceLen = curSequenceLen
                            vec[0] = maxSequenceLen     //记录最大连数
                            vec[1] = startIDX * 1       //记录最大连数的起始位置
						}
					}else{
						vec[0] = 0
                    	vec[1] = 0
					}
					return vec
				}
				if(mode == yx.config.SearchMode.SearchMode_FullRegion){
					//TODO 全区间选牌
					if(this.GetCardLogicValue(this.cbRegionHead) == this.GetCardLogicValue(this.cbRegionTail)){
						hitResult[cbHitCardCount-1].cbResultCard[0] = self.cbRegionHead
						hitResult[cbHitCardCount-1].cbResultCard[1] = self.cbRegionTail
						hitResult[cbHitCardCount-1].cbCardCount = 2
						cbHitCardCount = cbHitCardCount + 1
						return [true,hitResult,cbHitCardCount-1]
					}
					var vecInfo = prefind(unorderResult)
					var len = vecInfo[0]
					var offset = vecInfo[1]
					if(len >= minSequenceLen){
						var baseData = []
						for(var i=offset;i<=offset+len;i++){
							baseData.push(unorderResult.cbSingleCardData[i-1])
						}
						if(this.GetCardLogicValue(baseData[0]) >= this.GetCardLogicValue(0x02)){
							return [false,hitResult,cbHitCardCount]
						}
						for(var i=0;i<baseData.length;i++){
							hitResult[cbHitCardCount-1].cbResultCard.push(baseData[i])
						}
						hitResult[cbHitCardCount-1].cbCardCount = len
						
						//--需求过滤，（手牌是否包含头和尾的顺子，包含则采用，不包含则废弃）
						var bContainsHead = false
                    	var bContainsTail = false
						for(var j=0;j<hitResult[cbHitCardCount-1].cbCardCount;j++){
							if(this.GetCardLogicValue(hitResult[cbHitCardCount-1].cbResultCard[j]) == this.GetCardLogicValue(this.cbRegionHead)){
								bContainsHead = true
							}
							if(this.GetCardLogicValue(hitResult[cbHitCardCount-1].cbResultCard[j]) == this.GetCardLogicValue(this.cbRegionTail)){
								bContainsTail = true
							}
						}
						if(bContainsHead == true && bContainsTail == true){
							cbHitCardCount = cbHitCardCount + 1
                       		return [true,hitResult,cbHitCardCount-1]
						}else{
							return [false,hitResult,cbHitCardCount-1]
						}
					}
				}else if(mode == yx.config.SearchMode.SearchMode_Sliding){
					///TODO 滑动选牌
                	var type = this.GetCardType(cbHandCardData, cbHandCardCount)
					if(type != yx.config.OutCardType.Invalid){
						for(var i=0;i<cbHandCardData.length;i++){
							hitResult[cbHitCardCount-1].cbResultCard.push(cbHandCardData[i])
						}
						hitResult[cbHitCardCount-1].cbCardCount = cbHandCardCount
						cbHitCardCount = cbHitCardCount + 1
						return [true,hitResult,cbHitCardCount-1]
					}else{
						//TODO 不能构成牌型，分析牌，优先拿顺子开路
						var vecInfo = prefind(unorderResult)
						var len = vecInfo[0]
						var offset = vecInfo[1]
						if(len>=minSequenceLen){
							var baseData = []
							for(var i=offset;i<=offset+len;i++){
								baseData.push(unorderResult.cbSingleCardData[i-1])
							}
							if(this.GetCardLogicValue(baseData[0]) >= this.GetCardLogicValue(0x02)){
								return [false,hitResult,cbHitCardCount-1]
							}
							//拷贝主体牌
							for(var i=0;i<baseData.length;i++){
								hitResult[cbHitCardCount-1].cbResultCard.push(baseData[i])
							}
							hitResult[cbHitCardCount-1].cbCardCount = len
							cbHitCardCount = cbHitCardCount + 1
							return [true,hitResult,cbHitCardCount-1]
						}
						return [false,hitResult,cbHitCardCount-1]
					}
				}
			}else if(cbTurnOutType == yx.config.OutCardType.Invalid){
				return [false,hitResult,cbHitCardCount-1]
			}else if(cbTurnOutType == yx.config.OutCardType.Single || cbTurnOutType == yx.config.OutCardType.Double){
				var cbTurnCardLogicValue = this.GetCardLogicValue(cbTurnCardData[0])
				//--搜索单张
				if(cbTurnCardCount == 1){
					var cbTempSingCount = unorderResult.cbSingleCardData_unOrder.length
					if(cbTempSingCount >= cbTurnCardCount){
						//-不拆牌统计
						for(var i=0;i<cbTempSingCount;i++){
							var cbIndex = i
							if(this.GetCardLogicValue(unorderResult.cbSingleCardData_unOrder[cbIndex]) > cbTurnCardLogicValue){
								hitResult[cbHitCardCount-1].cbCardCount = cbTurnCardCount
								hitResult[cbHitCardCount-1].cbResultCard[0] = unorderResult.cbSingleCardData_unOrder[cbIndex]
								cbHitCardCount++;
								if(cbHitCardCount > yx.config.MAX_COUNT){
									return [true,hitResult,cbHitCardCount-1]
								}
							}
						}
					}
				}

				//搜索对子
				if(cbTurnCardCount == 2){
					var ndoubleCount = unorderResult.cbDoubleCardData_unOrder.length/2
					if(ndoubleCount * 2 >= cbTurnCardCount){
						//--不拆牌统计
						for(var i=0;i<ndoubleCount;i++){
							var cbIndex = i*2
							if(this.GetCardLogicValue(unorderResult.cbDoubleCardData_unOrder[cbIndex]) > cbTurnCardLogicValue){
								hitResult[cbHitCardCount-1].cbCardCount = cbTurnCardCount
								hitResult[cbHitCardCount-1].cbResultCard[0] = unorderResult.cbDoubleCardData_unOrder[cbIndex]
								hitResult[cbHitCardCount-1].cbResultCard[1] = unorderResult.cbDoubleCardData_unOrder[cbIndex+1]
								cbHitCardCount = cbHitCardCount + 1
								if(cbHitCardCount > yx.config.MAX_COUNT){
									return [true,hitResult,cbHitCardCount-1]
								}
							}
						}
					}
				}
			}else if(cbTurnOutType == yx.config.OutCardType.Triplet){
				var cbTurnCardLogicValue = this.GetCardLogicValue(cbTurnCardData[0])
            	var nTripleCount = unorderResult.cbTripleCardData_unOrder.length/3
				if(nTripleCount*3 >= cbTurnCardCount){
					//--非拆牌统计
					for(var i =0;i<nTripleCount;i++){
						var cbIndex = i*3
						if(this.GetCardLogicValue(unorderResult.cbTripleCardData_unOrder[cbIndex]) > cbTurnCardLogicValue){
							hitResult[cbHitCardCount-1].cbCardCount = cbTurnCardCount
							hitResult[cbHitCardCount-1].cbResultCard[0] = unorderResult.cbTripleCardData_unOrder[cbIndex]
							hitResult[cbHitCardCount-1].cbResultCard[1] = unorderResult.cbTripleCardData_unOrder[cbIndex+1]
							hitResult[cbHitCardCount-1].cbResultCard[2] = unorderResult.cbTripleCardData_unOrder[cbIndex+2]
							cbHitCardCount = cbHitCardCount + 1
							if(cbHitCardCount > yx.config.MAX_COUNT){
								return [true,hitResult,cbHitCardCount-1]
							}
						}
					}
				}
			}else if(cbTurnOutType == yx.config.OutCardType.Triplet_Attached_Card){
				var  cbLogicValue = 0
            	var isLink = true //判断出的牌 是否是连续的

            	cbLogicValue = this.GetCardLogicValue(cbOutCardData[0])
				if(this.GetCardLogicValue(cbOutCardData[1]) != cbLogicValue || this.GetCardLogicValue(cbOutCardData[2]) != cbLogicValue ){
					isLink = false
				}

				if(isLink == true){
					cbTurnCardHeadLogicValue = cbTurnCardHeadLogicValue > 0 ? cbLogicValue : 0
					var minSequenceLen = 1 //最少连续的长度
					var prefind1 = function (rs){
						if(rs.cbTripleCount >= 1){
							return rs.cbTripleCount
						}
						return 0
					}
					var len = 0
					//如果有三张可以压 不拆四张
					var isFindBig = false
					for(var i=0;i<analyseResult.cbTripleCount;i++){
						var cbTripleLogicValue = this.GetCardLogicValue(analyseResult.cbTripleCardData[i*3])
						if(cbTripleLogicValue > cbTurnCardHeadLogicValue){
							isFindBig = true
                        	break
						}
						
					}
					if(isFindBig == true){
						len = prefind1(analyseResult)
						if(len >= minSequenceLen){
							this.SortCardData(analyseResult.cbTripleCardData,analyseResult.cbTripleCardData.length,yx.config.CardSortOrder.ASC) 
							for(var i=0;i<len;i++){
								//创建临时的主体牌
								if(this.GetCardLogicValue(analyseResult.cbTripleCardData[i*3]) > cbTurnCardHeadLogicValue){
									var baseData =[]
									for(j=i*3;j<(i+1)*3;j++){
										baseData.push(analyseResult.cbTripleCardData[j])
									}
									hitResult[cbHitCardCount-1].cbResultCard[0] = baseData[0]
									hitResult[cbHitCardCount-1].cbResultCard[1] = baseData[1]
									hitResult[cbHitCardCount-1].cbResultCard[2] = baseData[2]

									var [a,b] = this.GetCardsByTriplets(cbHandCardDataCopy, cbHandCardCount, hitResult[cbHitCardCount-1].cbResultCard, 1, cbTurnOutType)
									if(a == 1){
										hitResult[cbHitCardCount-1].cbCardCount = 4
										cbHitCardCount = cbHitCardCount + 1
										if(cbHitCardCount > yx.config.MAX_COUNT){
											return [true,hitResult,cbHitCardCount-1]
										}
										
									}
								}
							}
						}
					}else{
						//没有找到可以大于的三张 拆四张
                    	//搜索炸弹
						if(analyseResult.cbQuadrupleCount > 0){
							var cbLogicValue = 0
							if(cbTurnOutType == yx.config.OutCardType.Bomb){
								cbLogicValue = this.GetCardLogicValue(cbOutCardData[0])
							}
							for(var i=analyseResult.cbQuadrupleCount;i>0;i--){
								var cbHandLogicValue = this.GetCardLogicValue(analyseResult.cbQuadrupleCardData[(i-1)*4])
								if(cbHandLogicValue > cbLogicValue){
									hitResult[cbHitCardCount-1].cbResultCard = {}
									for(var j=0;j<4;j++){
										hitResult[cbHitCardCount-1].cbResultCard.push(analyseResult.cbQuadrupleCardData[(i-1)*4+j])
									}
									hitResult[cbHitCardCount-1].cbCardCount = 4
                                	cbHitCardCount = cbHitCardCount + 1
									if(cbHitCardCount > yx.config.MAX_COUNT){
										return [true,hitResult,cbHitCardCount-1]
									}
								}
							}
						}
						//火箭
						if(analyseResult.bContainsRocket == true){
							hitResult[cbHitCardCount-1].cbResultCard = []
							for(var j=0;j<2;j++){
								hitResult[cbHitCardCount-1].cbResultCard.push(analyseResult.cbRocketCardData[j])
							}
							hitResult[cbHitCardCount-1].cbCardCount = 2
                       	    cbHitCardCount = cbHitCardCount + 1
							if(cbHitCardCount > yx.config.MAX_COUNT){
								return [true,hitResult,cbHitCardCount-1]
							}
						} 

						//先炸弹 再拆四张
						len = prefind1(unorderResult)
						if(len >= minSequenceLen){
							this.SortCardData(unorderResult.cbTripleCardData,unorderResult.cbTripleCardData.length,yx.config.CardSortOrder.ASC)
							for(var i=0;i<len;i++){
								//--创建临时的主体牌
								if(this.GetCardLogicValue(unorderResult.cbTripleCardData[i*3]) > cbTurnCardHeadLogicValue){
									var baseData = []
									for(var j=i*3;j<(i+1)*3;j++){
										baseData.push(unorderResult.cbTripleCardData[j])
									}
									hitResult[cbHitCardCount-1].cbResultCard[0] = baseData[0]
									hitResult[cbHitCardCount-1].cbResultCard[1] = baseData[1]
									hitResult[cbHitCardCount-1].cbResultCard[2] = baseData[2]
									var [a,b] = this.GetCardsByTriplets(cbHandCardDataCopy, cbHandCardCount, hitResult[cbHitCardCount-1].cbResultCard, 1, cbTurnOutType)
									if(a == 1){
										hitResult[cbHitCardCount-1].cbCardCount = 4
                                    	cbHitCardCount = cbHitCardCount + 1
										if(cbHitCardCount > yx.config.MAX_COUNT){
											return [true,hitResult,cbHitCardCount-1]
										}
									}
								}
							}
						}
						return [true,hitResult,cbHitCardCount-1]
					}
				}	
			}else if(cbTurnOutType == yx.config.OutCardType.Triplet_Attached_Pair ){
				var  cbLogicValue = 0
				var isLink = true //判断出的牌 是否是连续的
				cbLogicValue = this.GetCardLogicValue(cbOutCardData[0])
				if(this.GetCardLogicValue(cbOutCardData[1]) != cbLogicValue || this.GetCardLogicValue(cbOutCardData[2]) != cbLogicValue){
					isLink = false
				}

				if(isLink == true){
					cbTurnCardHeadLogicValue = cbTurnCardHeadLogicValue > 0 ? cbLogicValue : 0
                	var minSequenceLen = 1 //最少连续的长度
					var prefind2 = function(rs){
						if(rs.cbTripleCount >= 1){
							return rs.cbTripleCount
						}
						return 0
					}
					var  len = 0
					//如果有三张可以压 不拆四张
					var isFindBig = false
					for(var i=0;i<analyseResult.cbTripleCount;i++){
						var cbTripleLogicValue = this.GetCardLogicValue(analyseResult.cbTripleCardData[i*3])
						if (cbTripleLogicValue > cbTurnCardHeadLogicValue ){
							isFindBig = true
							break
						}
					}

					if(isFindBig == true){
						len = prefind2(analyseResult)
						if(len >= minSequenceLen){
							this.SortCardData(analyseResult.cbTripleCardData,analyseResult.cbTripleCardData.length,yx.config.CardSortOrder.ASC)
							for(var i=0;i<len;i++){
								//--创建临时的主体牌
								if(this.GetCardLogicValue(analyseResult.cbTripleCardData[i*3]) > cbTurnCardHeadLogicValue){
									var baseData =[]
									for(var j=i*3;j<(i+1)*3;j++){
										baseData.push(analyseResult.cbTripleCardData[j])
									}
									hitResult[cbHitCardCount-1].cbResultCard[0] = baseData[0]
									hitResult[cbHitCardCount-1].cbResultCard[1] = baseData[1]
									hitResult[cbHitCardCount-1].cbResultCard[2] = baseData[2]
									var [a,b] = this.GetCardsByTriplets(cbHandCardDataCopy, cbHandCardCount, hitResult[cbHitCardCount-1].cbResultCard, 1, cbTurnOutType)
									if(a == 1){
										hitResult[cbHitCardCount-1].cbCardCount = 5
										cbHitCardCount = cbHitCardCount + 1
										if (cbHitCardCount > yx.config.MAX_COUNT ){
											return [true,hitResult,cbHitCardCount-1]
										}
									}
								}
							}
						}	
					}else{
						//搜索炸弹
						if(analyseResult.cbQuadrupleCount > 0){
							var cbLogicValue = 0
							if(cbTurnOutType == yx.config.OutCardType.Bomb){
								cbLogicValue = this.GetCardLogicValue(cbOutCardData[0])
							}
							for(var i=analyseResult.cbQuadrupleCount;i>0;i--){
								var cbHandLogicValue = this.GetCardLogicValue(analyseResult.cbQuadrupleCardData[(i-1)*4])
								if(cbHandLogicValue > cbLogicValue){
									hitResult[cbHitCardCount-1].cbResultCard = []
									for(var j=0;j<4;j++){
										hitResult[cbHitCardCount-1].cbResultCard.push(analyseResult.cbQuadrupleCardData[(i-1)*4+j])
									}
									hitResult[cbHitCardCount-1].cbCardCount = 4
                                	cbHitCardCount = cbHitCardCount + 1
									if(cbHitCardCount > yx.config.MAX_COUNT){
										return [true,hitResult,cbHitCardCount-1]
									}
								}
							}
						}
						//火箭
						if(analyseResult.bContainsRocket == true ){
							hitResult[cbHitCardCount-1].cbResultCard = []
							for(var j=0;j<2;j++){
								hitResult[cbHitCardCount-1].cbResultCard.push(analyseResult.cbRocketCardData[j])
							}
							hitResult[cbHitCardCount-1].cbCardCount = 2
                        	cbHitCardCount = cbHitCardCount + 1
							if(cbHitCardCount > yx.config.MAX_COUNT){
								return [true,hitResult,cbHitCardCount-1]
							}
						}
						len = prefind2(unorderResult)
						if(len >= minSequenceLen){
							this.SortCardData(unorderResult.cbTripleCardData,unorderResult.cbTripleCardData.length,yx.config.CardSortOrder.ASC)
							for(var i=0;i<len;i++){
								if(this.GetCardLogicValue(unorderResult.cbTripleCardData[i*3]) > cbTurnCardHeadLogicValue){
									var baseData = []
									for(var j=i*3;j<(i+1)*3;j++){
										baseData.push(unorderResult.cbTripleCardData[j])
									}
									hitResult[cbHitCardCount-1].cbResultCard[0] = baseData[0]
									hitResult[cbHitCardCount-1].cbResultCard[1] = baseData[1]
									hitResult[cbHitCardCount-1].cbResultCard[2] = baseData[2]
									var [a,b] =this.GetCardsByTriplets(cbHandCardDataCopy, cbHandCardCount, hitResult[cbHitCardCount-1].cbResultCard, 1, cbTurnOutType) 
									if(a==1){
										return [true,hitResult,cbHitCardCount-1]
									}
								}
							}
						}
						return [true,hitResult,cbHitCardCount-1]
					}
				}
			}else if(cbTurnOutType == yx.config.OutCardType.Sequence || cbTurnOutType == yx.config.OutCardType.Sequence_Of_Pairs || cbTurnOutType == yx.config.OutCardType.Sequence_Of_Triplets){
				//长度判断
				if(cbHandCardCountCopy >= cbTurnCardCount){
					//计算连数和组合数
                	var cbSameCount = 3
					if(cbTurnOutType == yx.config.OutCardType.Sequence){
						cbSameCount = 1
					}else if(cbTurnOutType == yx.config.OutCardType.Sequence_Of_Pairs){
						cbSameCount = 2
					}
					var cbTurnLineCount = cbTurnCardCount / cbSameCount

					// A顺最大 直接跳过
					var cbMaxValue = this.GetCardLogicValue(0x01)
					if(bSearchType != true && this.GetCardLogicValue(cbOutCardData[0]) != cbMaxValue){
						var SearchBigCard = function(cbTempSingData,cbTempSingCount){
							//拆牌后的数量加癞子数量小于 直接跳出
							if(cbTempSingCount + cbLaiZiCount >= cbTurnLineCount){
								//判断到 A
                            	//因为从小到大3456..QKA,当经过K物理牌 AAAKKK存在 此时A物理牌 后补K就重复了 
                            	//更重要没利用上物理K 服务端判断牌型出错
								var bGetMaxValue = false
								//获取数值
								var cbOutLogicValue = bSearchType == false ? self.GetCardLogicValue(cbOutCardData[cbTurnCardCount-1]) : 0
								//搜索连牌
								for(var i=0;i<cbTempSingCount;i++){
									var cbHandLogicValue = self.GetCardLogicValue(cbTempSingData[i])
									if(cbHandLogicValue > cbOutLogicValue){
										var cbLaiZiCountTemp = cbLaiZiCount
										var cbLineCount = 0
										var cbCount = 0
										var j = i
										hitResult[cbHitCardCount-1].cbResultCard = []
										while(j < cbTempSingCount){
											var cbLeftCount = cbSameCount
                                        	var cbLogicValue = self.GetCardLogicValue(cbTempSingData[j]) - cbLineCount
											if(cbLogicValue == cbHandLogicValue){
												//获取同牌
												var [cbLeftCount1,cbResultCard] = self.GetSameCard(cbHandCardDataCopy,cbHandCardCountCopy,cbTempSingData[j],cbSameCount)
												cbLeftCount = cbLeftCount1
												for(var x=0;x<cbResultCard.length;x++){
													hitResult[cbHitCardCount-1].cbResultCard.push(cbResultCard[x])
												}
												//累计张数
                                            	var cbTempCount = cbLeftCount > 0 ? (cbSameCount - cbLeftCount) : cbSameCount
                                            	cbCount = cbCount + cbTempCount
											}

											//增加连数
											if (cbLeftCount == 0 ){
												cbLineCount = cbLineCount + 1

												//纯lz代替 继续判断当前数值
												if (cbLogicValue != cbHandLogicValue ){
													j = j - 1
												}
											}

											//完成判断
											if(cbCount == cbTurnCardCount){
												//判断到A
												if(cbMaxValue == self.GetCardLogicValue(hitResult[cbHitCardCount-1].cbResultCard[cbCount-1]) ){
													bGetMaxValue = true
												}

												hitResult[cbHitCardCount-1].cbCardCount = cbTurnCardCount
												self.SortCardData(hitResult[cbHitCardCount-1].cbResultCard,hitResult[cbHitCardCount-1].cbCardCount,yx.config.CardSortOrder.DESC)
												cbHitCardCount = cbHitCardCount + 1
												if(cbHitCardCount > yx.config.MAX_COUNT ){
													return [true,hitResult,cbHitCardCount-1]
												}
												break
											}
											j= j + 1
										}

										if (bGetMaxValue == true ){
											break
										}
									}
								}
							}
						}

						//拿出拆分后所有的癞子牌
						var cbTempSingData = []
						var cbTempSingCount = 0

						//先用不拆炸弹的单牌搜索
						var nSingleCount = unorderResult.cbSingleCardData_unOrder.length
						for(var i=0;i<nSingleCount;i++){
							//过滤掉癞子和大小王 2
							if(this.GetCardLogicValue(unorderResult.cbSingleCardData_unOrder[i]) >= this.GetCardLogicValue(0x02)
							|| unorderResult.cbSingleCardData_unOrder[i] == 0x4E
							|| unorderResult.cbSingleCardData_unOrder[i] == 0x4F){

							}else{
								cbTempSingCount = cbTempSingCount + 1
                           	    cbTempSingData[cbTempSingCount-1] = unorderResult.cbSingleCardData_unOrder[i]
							}
						}
						this.SortCardData(cbTempSingData,cbTempSingCount,yx.config.CardSortOrder.ASC)
                    
                    	SearchBigCard(cbTempSingData,cbTempSingCount)
						//搜索炸弹
						if(analyseResult.cbQuadrupleCount > 0){
							var cbLogicValue = 0
							if(cbTurnOutType == yx.config.OutCardType.Bomb){
								cbLogicValue = this.GetCardLogicValue(cbOutCardData[0])
							}

							for(var i=analyseResult.cbQuadrupleCount;i>0;i--){
								var cbHandLogicValue = this.GetCardLogicValue(analyseResult.cbQuadrupleCardData[(i-1)*4])
								if(cbHandLogicValue > cbLogicValue){
									hitResult[cbHitCardCount-1].cbResultCard = []
									for (var j=0;j<4;j++ ){
										hitResult[cbHitCardCount-1].cbResultCard.push(analyseResult.cbQuadrupleCardData[(i-1)*4+j])
									} 
									hitResult[cbHitCardCount-1].cbCardCount = 4
									cbHitCardCount = cbHitCardCount + 1
									if (cbHitCardCount > yx.config.MAX_COUNT ){
										return [true,hitResult,cbHitCardCount-1]
									}
								}
							}
						}

						//火箭
						if(analyseResult.bContainsRocket == true){
							hitResult[cbHitCardCount-1].cbResultCard = []
							for(var j=0;j<2;j++){
								hitResult[cbHitCardCount-1].cbResultCard.push(analyseResult.cbRocketCardData[j])
							}
							hitResult[cbHitCardCount-1].cbCardCount = 2
							cbHitCardCount = cbHitCardCount + 1
							if(cbHitCardCount > yx.config.MAX_COUNT){
								return [true,hitResult,cbHitCardCount-1]
							}
						}

						//再用拆炸弹的牌
						if(analyseResult.cbQuadrupleCount > 0){
							cbTempSingData = []
                        	cbTempSingCount = 0
							for(var i=0;i<unorderResult.cbSingleCount;i++){
								//过滤掉癞子和大小王
								if(this.GetCardLogicValue(unorderResult.cbSingleCardData[i]) >= this.GetCardLogicValue(0x02)
								|| unorderResult.cbSingleCardData[i] == 0x4E
								|| unorderResult.cbSingleCardData[i] == 0x4F){

								}else{
									cbTempSingCount = cbTempSingCount + 1
									cbTempSingData[cbTempSingCount-1] = unorderResult.cbSingleCardData[i]
								}
							}
							this.SortCardData(cbTempSingData,cbTempSingCount,yx.config.CardSortOrder.ASC)
                        	SearchBigCard(cbTempSingData,cbTempSingCount)
						}
						return [true,hitResult,cbHitCardCount-1]
					}
				}
			}else if(cbTurnOutType == yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards || cbTurnOutType == yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Pairs){
				//长度判断
				if(cbHandCardCountCopy >= cbTurnCardCount){
					//计算连数和组合数
					var cbSameCount = 3
					var cbTurnLineCount = cbTurnCardCount / (cbTurnOutType == yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards ? 4 : 5)

					//出牌数值
					//针对0x34 0x34 0x34 0x35 0x35 0x35 0x36 0x36 0x36 + 0x0a 0x1a 0x2a 所以需要i+3
					var cbMinIndex = 0
					var cbLogicValueFirst = 0
					var isLink = true //判断出的牌 是否是连续的
					for(var i=0;i<cbTurnCardCount-cbSameCount;i++){
						cbLogicValueFirst = this.GetCardLogicValue(cbOutCardData[i])
						if(this.GetCardLogicValue(cbOutCardData[i+1]) != cbLogicValueFirst || this.GetCardLogicValue(cbOutCardData[i+2]) != cbLogicValueFirst ||
						this.GetCardLogicValue(cbOutCardData[i+3]) != cbLogicValueFirst-1){
							isLink = false
						}else{
							cbMinIndex = cbSameCount*cbTurnLineCount
                        	break 
						}
					}
					if(isLink == true){
						var searchBigCard = function(cbTempSingData,cbTempSingCount){
							if(cbTempSingCount + cbLaiZiCount >= cbTurnLineCount ){
								//判断到 A
								//因为从小到大3456..QKA,当经过K物理牌 AAAKKK存在 此时A物理牌 后补K就重复了 
								//更重要没利用上物理K 服务端判断牌型出错
								var bGetMaxValue = false

								//获取数值
								var cbOutLogicValue = bSearchType == false ? self.GetCardLogicValue(cbOutCardData[cbMinIndex]) : 0
								//搜索连牌
								for(var i=0;i<cbTempSingCount;i++){
									//获取数值
                                	var cbHandLogicValue = self.GetCardLogicValue(cbTempSingData[i])

                                	//检测判断
									if(cbHandLogicValue > cbOutLogicValue){
										//搜索连牌
										var cbLaiZiCountTemp = cbLaiZiCount
										var cbLineCount = 0
										var cbCount = 0
										hitResult[cbHitCardCount-1].cbResultCard = []
										var j = i
										while(j<= cbTempSingCount){
											var cbLeftCount = cbSameCount
											var cbLogicValue = self.GetCardLogicValue(cbTempSingData[j]) - cbLineCount
											if(cbLogicValue == cbHandLogicValue){
                                            	//获取同牌
                                            	var [cbLeftCount1,cbResultCard] = self.GetSameCard(cbHandCardDataCopy,cbHandCardCountCopy,cbTempSingData[j],cbSameCount)
												cbLeftCount = cbLeftCount1
												for(var x=0;x<cbResultCard.length;x++){
													hitResult[cbHitCardCount-1].cbResultCard.push(cbResultCard[x])
												}
												//累计张数
                                            	cbCount = cbCount + (cbLeftCount > 0 ? (cbSameCount - cbLeftCount) : cbSameCount)
											
											}

											//增加连数
											if (cbLeftCount == 0 ){
												cbLineCount = cbLineCount + 1
												//纯lz代替 继续判断当前数值
												if (cbLogicValue != cbHandLogicValue ){
													j=j-1
												}
											}

											//完成判断
											if(cbCount == cbTurnLineCount * cbSameCount){
												// 判断到 A
                                            	var bGetA = cbMaxValue == self.GetCardLogicValue(hitResult[cbHitCardCount-1].cbResultCard[cbCount-1])

												//--获取单牌判断
												var [a,b] =self.GetCardsByTriplets(cbHandCardDataCopy,cbHandCardCount,hitResult[cbHitCardCount-1].cbResultCard,cbTurnLineCount,cbTurnOutType)
												if(a == 1){
													if(bGetA){
														bGetMaxValue = true
													}

													hitResult[cbHitCardCount-1].cbCardCount = cbTurnCardCount
													self.SortCardData(hitResult[cbHitCardCount-1].cbResultCard,hitResult[cbHitCardCount-1].cbResultCard.length,yx.config.CardSortOrder.DESC)
													cbHitCardCount = cbHitCardCount + 1
													if(cbHitCardCount > yx.config.MAX_COUNT){
														return [true,hitResult,cbHitCardCount-1]
													}
													break
												}
											}
											j= j + 1
										}
										if (bGetMaxValue ){
											break
										}
									}
								}
							}
						}
						//A顺最大 直接跳出
						var cbMaxValue = this.GetCardLogicValue(0x01)
						if(cbLogicValueFirst != cbMaxValue){
							//拿出拆分后所有的癞子牌
							var cbTempSingData = []
							var cbTempSingCount = 0

							//先用不拆炸弹的单牌搜索
							var nSingleCount = unorderResult.cbSingleCardData_unOrder.length
							for(var i=0;i<nSingleCount;i++){
								//过滤掉癞子和大小王 2
								if(this.GetCardLogicValue(unorderResult.cbSingleCardData_unOrder[i]) >= this.GetCardLogicValue(0x02)
								|| unorderResult.cbSingleCardData_unOrder[i] == 0x4E
								|| unorderResult.cbSingleCardData_unOrder[i] == 0x4F){

								}else{
									cbTempSingCount = cbTempSingCount + 1
									cbTempSingData[cbTempSingCount-1] = unorderResult.cbSingleCardData_unOrder[i]
								}
							}
							this.SortCardData(cbTempSingData,cbTempSingCount,yx.config.CardSortOrder.ASC)
                        	searchBigCard(cbTempSingData,cbTempSingCount)
							//搜索炸弹
							if(analyseResult.cbQuadrupleCount > 0 ){
								var cbLogicValue = 0
								if(cbTurnOutType == yx.config.OutCardType.Bomb){
									cbLogicValue = this.GetCardLogicValue(cbOutCardData[0])
								}
								for(var i=analyseResult.cbQuadrupleCount;i>0;i--){
									var cbHandLogicValue = this.GetCardLogicValue(analyseResult.cbQuadrupleCardData[(i-1)*4])
									if( cbHandLogicValue > cbLogicValue){
										hitResult[cbHitCardCount-1].cbResultCard = []
										for(var j=0;j<4;j++){
											hitResult[cbHitCardCount-1].cbResultCard.push(analyseResult.cbQuadrupleCardData[(i-1)*4+j])
										}
										hitResult[cbHitCardCount-1].cbCardCount = 4
										cbHitCardCount = cbHitCardCount + 1
										if (cbHitCardCount > yx.config.MAX_COUNT ){
											return [true,hitResult,cbHitCardCount-1]
										}
									}
								}
							}
							//--火箭
							if(analyseResult.bContainsRocket == true){
								hitResult[cbHitCardCount-1].cbResultCard = []
								for(var j=0;j<2;j++){
									hitResult[cbHitCardCount-1].cbResultCard.push(analyseResult.cbRocketCardData[j])
								}
								hitResult[cbHitCardCount-1].cbCardCount = 2
								cbHitCardCount = cbHitCardCount + 1
								if(cbHitCardCount > yx.config.MAX_COUNT){
									return [true,hitResult,cbHitCardCount-1]
								}
							}

							if(analyseResult.cbQuadrupleCount > 0){
								for(var i=0;i<unorderResult.cbSingleCount;i++){
									//过滤掉癞子和大小王
									if(this.GetCardLogicValue(unorderResult.cbSingleCardData[i]) >= this.GetCardLogicValue(0x02)
									|| unorderResult.cbSingleCardData[i] == 0x4E
									|| unorderResult.cbSingleCardData[i] == 0x4F){

									}else{
										cbTempSingCount = cbTempSingCount + 1
										cbTempSingData[cbTempSingCount-1] = unorderResult.cbSingleCardData[i]
									}
								}
								this.SortCardData(cbTempSingData,cbTempSingCount,yx.config.CardSortOrder.ASC)
								SearchBigCard(cbTempSingData,cbTempSingCount)
							}
						}
					}
				}
			}else if(cbTurnOutType == yx.config.OutCardType.Quadplex_Attached_Two_Cards || cbTurnOutType == yx.config.OutCardType.Quadplex_Attached_Two_Pairs){
				//长度判断
				if(cbHandCardCountCopy >= cbTurnCardCount){
					//获取数值
					var cbLogicValue = 0
					var isLink = true
					for(var i=0;i<cbTurnCardCount - 2;i++){
						cbLogicValue = this.GetCardLogicValue(cbOutCardData[i])
						if (this.GetCardLogicValue(cbOutCardData[i+1]) != cbLogicValue || this.GetCardLogicValue(cbOutCardData[i+2]) != cbLogicValue ||
						this.GetCardLogicValue(cbOutCardData[i+3]) != cbLogicValue ){
							isLink = false
						}else{
							break 
						}
					}

					if(isLink == true){
						cbTurnCardHeadLogicValue = cbTurnCardHeadLogicValue > 0 ? cbLogicValue : 0
						//计算出牌连数
						var cbTurnLineCount = 0
						if(cbTurnOutType == yx.config.OutCardType.Quadplex_Attached_Two_Cards){
							cbTurnLineCount = cbTurnCardCount / 6
						}else if(cbTurnOutType == yx.config.OutCardType.Quadplex_Attached_Two_Pairs){
							cbTurnLineCount = cbTurnCardCount / 8
						}

						if(cbTurnOutType == yx.config.OutCardType.Quadplex_Attached_Two_Cards){
							let cacheCard = function(){
								for(var outIndex=0;outIndex<unorderResult.cbQuadrupleCount;outIndex++){
									//创建一个临时的主体数据
									var baseData = []
									//校验是否合法
									var cbTempValue = unorderResult.cbQuadrupleCardData[(outIndex)*4]
									if(this.GetCardLogicValue(cbTempValue) > cbTurnCardHeadLogicValue){
										for(var idx = 0;idx<4;idx++){
											hitResult[cbHitCardCount-1].cbResultCard.push(unorderResult.cbQuadrupleCardData[(outIndex)*4+idx])
										}
										var tmpCount, tmpResult = this.GetCardsByTriplets(cbHandCardDataCopy,cbHandCardCount,hitResult[cbHitCardCount-1].cbResultCard,1,cbTurnOutType)
                                    	// dump(tmpResult, " =========1========= tmpCount: " .. tmpCount)
										if(tmpCount == 1){
											hitResult[cbHitCardCount-1].cbCardCount = 6
											cbHitCardCount = cbHitCardCount + 1
											if(cbHitCardCount > yx.config.MAX_COUNT){
												return [true,hitResult,cbHitCardCount-1]
											}
										}
									}
								}

								// for(var outIndex=0;outIndex<unorderResult.cbQuadrupleCountLaiZi;outIndex++){
								// 	//创建一个临时的主体数据
								// 	var baseData = []
								// 	//校验是否合法
								// 	var cbTempValue = unorderResult.cbQuadrupleCardDataLaiZi[(outIndex)*4]
								// 	if(this.GetCardLogicValue(cbTempValue) > cbTurnCardHeadLogicValue){
								// 		for(var idx = 0;idx<4;idx++){
								// 			hitResult[cbHitCardCount-1].cbResultCard.push(unorderResult.cbQuadrupleCardDataLaiZi[(outIndex)*4+idx])
								// 		}
								// 		var tmpCount, tmpResult = this.GetCardsByTriplets(cbHandCardDataCopy,cbHandCardCount,hitResult[cbHitCardCount-1].cbResultCard,1,cbTurnOutType)
                                //     	// dump(tmpResult, " =========1========= tmpCount: " .. tmpCount)
								// 		if(tmpCount == 1){
								// 			hitResult[cbHitCardCount-1].cbCardCount = 6
								// 			cbHitCardCount = cbHitCardCount + 1
								// 			if(cbHitCardCount > yx.config.MAX_COUNT){
								// 				return [true,hitResult,cbHitCardCount-1]
								// 			}
								// 		}
								// 	}
								// }
							}

							if(unorderResult.cbQuadrupleCount >= cbTurnLineCount || unorderResult.cbQuadrupleCardDataLaiZi.length >= cbTurnLineCount){
								cacheCard()
							}
						}
						if(cbTurnOutType == yx.config.OutCardType.Quadplex_Attached_Two_Pairs){
							let cacheCard = function(){
								for(var outIndex=0;outIndex<unorderResult.cbQuadrupleCount;outIndex++){
									//创建一个临时的主体数据
									var baseData = []
									//校验是否合法
									var cbTempValue = unorderResult.cbQuadrupleCardData[(outIndex)*4]
									if(this.GetCardLogicValue(cbTempValue) > cbTurnCardHeadLogicValue){
										for(var idx = 0;idx<4;idx++){
											hitResult[cbHitCardCount-1].cbResultCard.push(unorderResult.cbQuadrupleCardData[(outIndex)*4+idx])
										}
										var tmpCount, tmpResult = this.GetCardsByTriplets(cbHandCardDataCopy,cbHandCardCount,hitResult[cbHitCardCount-1].cbResultCard,1,cbTurnOutType)
                                    	// dump(tmpResult, " =========1========= tmpCount: " .. tmpCount)
										if(tmpCount == 1){
											hitResult[cbHitCardCount-1].cbCardCount = 8
                                        	cbHitCardCount = cbHitCardCount + 1
											if(cbHitCardCount > yx.config.MAX_COUNT){
												return [true,hitResult,cbHitCardCount-1]
											}
										}
									}
								}

								// for(var outIndex=0;outIndex<unorderResult.cbQuadrupleCountLaiZi;outIndex++){
								// 	//创建一个临时的主体数据
								// 	var baseData = []
								// 	//校验是否合法
								// 	var cbTempValue = unorderResult.cbQuadrupleCardDataLaiZi[(outIndex)*4]
								// 	if(this.GetCardLogicValue(cbTempValue) > cbTurnCardHeadLogicValue){
								// 		for(var idx = 0;idx<4;idx++){
								// 			hitResult[cbHitCardCount-1].cbResultCard.push(unorderResult.cbQuadrupleCardDataLaiZi[(outIndex)*4+idx])
								// 		}
								// 		var tmpCount, tmpResult = this.GetCardsByTriplets(cbHandCardDataCopy,cbHandCardCount,hitResult[cbHitCardCount-1].cbResultCard,1,cbTurnOutType)
                                //     	// dump(tmpResult, " =========1========= tmpCount: " .. tmpCount)
								// 		if(tmpCount == 1){
								// 			hitResult[cbHitCardCount-1].cbCardCount = 6
								// 			cbHitCardCount = cbHitCardCount + 1
								// 			if(cbHitCardCount > yx.config.MAX_COUNT){
								// 				return [true,hitResult,cbHitCardCount-1]
								// 			}
								// 		}
								// 	}
								// }
							}

							if(unorderResult.cbQuadrupleCount >= cbTurnLineCount || unorderResult.cbQuadrupleCardDataLaiZi.length >= cbTurnLineCount){
								cacheCard()
							}
						}
					}
				}
			}

			//搜索软炸弹
			if (analyseResult.cbQuadrupleCountLaiZi > 0 && 
				cbTurnOutType != yx.config.OutCardType.serial_bomb &&
				cbTurnOutType != yx.config.OutCardType.Rocket && 
				cbTurnOutType != yx.config.OutCardType.LaiZiBomb && 
				cbTurnOutType != yx.config.OutCardType.Bomb ){
				var cbLogicValue = 0
				if (cbTurnOutType == yx.config.OutCardType.softBomb ){
					cbLogicValue = this.GetCardLogicValue(cbOutCardData[0])
				}

				for (var i=0;i<analyseResult.cbQuadrupleCountLaiZi;i++){
					var cbHandLogicValue = this.GetCardLogicValue(analyseResult.cbQuadrupleCardDataLaiZi[(i)*4])
					if (cbHandLogicValue > cbLogicValue ){
						hitResult[cbHitCardCount-1].cbResultCard = {}
						for(var j=0;j<4;j++){
							hitResult[cbHitCardCount-1].cbResultCard.push(analyseResult.cbQuadrupleCardDataLaiZi[(i)*4+j])
						}
						
						hitResult[cbHitCardCount-1].cbCardCount = 4
						cbHitCardCount = cbHitCardCount + 1
						if (cbHitCardCount > yx.config.MAX_COUNT ){
							return [true,hitResult,cbHitCardCount-1]
						}
					}
				} 
			}
			//搜索炸弹
			if (analyseResult.cbQuadrupleCount > 0 && 
				cbTurnOutType != yx.config.OutCardType.serial_bomb &&
				cbTurnOutType != yx.config.OutCardType.Rocket && 
				cbTurnOutType != yx.config.OutCardType.LaiZiBomb ){
				var cbLogicValue = 0
				if (cbTurnOutType == yx.config.OutCardType.Bomb ){
					cbLogicValue = this.GetCardLogicValue(cbOutCardData[0])
				}

				for (var i=0;i<analyseResult.cbQuadrupleCount;i++){
					var cbHandLogicValue = this.GetCardLogicValue(analyseResult.cbQuadrupleCardData[(i)*4])
					if (cbHandLogicValue > cbLogicValue ){
						hitResult[cbHitCardCount-1].cbResultCard = {}
						for(var j=0;j<4;j++){
							hitResult[cbHitCardCount-1].cbResultCard.push(analyseResult.cbQuadrupleCardData[(i)*4+j])
						}
						
						hitResult[cbHitCardCount-1].cbCardCount = 4
						cbHitCardCount = cbHitCardCount + 1
						if (cbHitCardCount > yx.config.MAX_COUNT ){
							return [true,hitResult,cbHitCardCount-1]
						}
					}
				} 
			}

			//连炸
			if (yx.config.m_use_serial_bomb && analyseResult.cbQuadrupleCount >= 2){
				var cbQuadrupleCardData = analyseResult.cbQuadrupleCardData
				var cbQuadrupleCount = analyseResult.cbQuadrupleCount
				for(var cbSearchOutCardQuadrupleCount=2;cbSearchOutCardQuadrupleCount<=cbQuadrupleCount;cbSearchOutCardQuadrupleCount++){
					for(var i=cbQuadrupleCount;i>=cbQuadrupleCount;i--){
						if(i - cbSearchOutCardQuadrupleCount < 0){
							break
						}
						var cbHandLogicValue = this.GetCardLogicValue(analyseResult.cbQuadrupleCardData[(i-1)*4])
						var cbHandLogicValue2 = this.GetCardLogicValue(analyseResult.cbQuadrupleCardData[(i - cbSearchOutCardQuadrupleCount)*4])
						if(cbHandLogicValue2 != 15 && cbHandLogicValue2 - cbHandLogicValue == cbSearchOutCardQuadrupleCount - 1){
							hitResult[cbHitCardCount-1].cbResultCard = []
							for(var k=i-cbSearchOutCardQuadrupleCount+1;k<=i;k++){
								for(var j=0;j<4;j++){
									hitResult[cbHitCardCount-1].cbResultCard.push(analyseResult.cbQuadrupleCardData[(k-1)*4+j])
								}
							}
							hitResult[cbHitCardCount-1].cbCardCount = cbSearchOutCardQuadrupleCount * 4
                        	cbHitCardCount = cbHitCardCount + 1
							if (cbHitCardCount > yx.config.MAX_COUNT ){
								return [true,hitResult,cbHitCardCount-1]
							}
						}
					}
				}
			}
			//癞子炸弹
			if(analyseResult.bLaiZiBomb == true &&
				cbTurnOutType != yx.config.OutCardType.serial_bomb &&
				cbTurnOutType != yx.config.OutCardType.Rocket ){
				hitResult[cbHitCardCount-1].cbResultCard = {}
				for (var j=0;j<4;j++ ){
					hitResult[cbHitCardCount-1].cbResultCard.push(analyseResult.cbLaiZiBombCardData[j])
				}
				hitResult[cbHitCardCount-1].cbCardCount = 4
				cbHitCardCount = cbHitCardCount + 1
				if (cbHitCardCount > yx.config.MAX_COUNT ){
					return [true,hitResult,cbHitCardCount-1]
				}
			}


			//-火箭
			if(analyseResult.bContainsRocket == true && cbTurnOutType != yx.config.OutCardType.serial_bomb){
				hitResult[cbHitCardCount-1].cbResultCard = []
				for(var j=0;j<2;j++){
					hitResult[cbHitCardCount-1].cbResultCard.push(analyseResult.cbRocketCardData[j])
				}
				hitResult[cbHitCardCount-1].cbCardCount = 2
				cbHitCardCount = cbHitCardCount + 1
				if(cbHitCardCount > yx.config.MAX_COUNT){
					return [true,hitResult,cbHitCardCount-1]
				}
			}

			//单牌
			if (cbTurnOutType == yx.config.OutCardType.Single ){
				var cbTurnCardLogicValue = this.GetCardLogicValue(cbTurnCardData[0])
				for (var i=0;i<unorderResult.cbSingleCardData_unBomb.length;i++){
					if (this.GetCardLogicValue(unorderResult.cbSingleCardData_unBomb[i]) > cbTurnCardLogicValue ){
						hitResult[cbHitCardCount-1].cbCardCount = cbTurnCardCount
						hitResult[cbHitCardCount-1].cbResultCard[0] = unorderResult.cbSingleCardData_unBomb[i]
						cbHitCardCount = cbHitCardCount + 1
						if (cbHitCardCount > yx.config.MAX_COUNT ){
							return [true,hitResult,cbHitCardCount-1]
						}
					}
				}
			}

			//对子
			if (cbTurnOutType == yx.config.OutCardType.Double ){
				var cbTurnCardLogicValue = this.GetCardLogicValue(cbTurnCardData[0])
				var ndoubleCount = unorderResult.cbDoubleCardData_unBomb.length/2
				for (var i=0;i<ndoubleCount;i++ ){
					var cbIndex = i*2
					if (this.GetCardLogicValue(unorderResult.cbDoubleCardData_unBomb[cbIndex]) > cbTurnCardLogicValue ){
						hitResult[cbHitCardCount-1].cbCardCount = cbTurnCardCount
						hitResult[cbHitCardCount-1].cbResultCard[0] = unorderResult.cbDoubleCardData_unBomb[cbIndex]
						hitResult[cbHitCardCount-1].cbResultCard[1] = unorderResult.cbDoubleCardData_unBomb[cbIndex+1]
						cbHitCardCount = cbHitCardCount + 1
						if (cbHitCardCount > yx.config.MAX_COUNT ){
							return [true,hitResult,cbHitCardCount-1]
						}
					}
				}
			}

			//三张
			if (cbTurnOutType == yx.config.OutCardType.Triplet ){
				var cbTurnCardLogicValue = this.GetCardLogicValue(cbTurnCardData[0])
				var nTripleCount = unorderResult.cbTripleCardData_unBomb.length/3
				if (nTripleCount*3 >= cbTurnCardCount ){
					//非拆牌统计
					for (var i=0;i<nTripleCount;i++ ){
						var cbIndex = i*3
						if (this.GetCardLogicValue(unorderResult.cbTripleCardData_unBomb[cbIndex]) > cbTurnCardLogicValue ){
							hitResult[cbHitCardCount-1].cbCardCount = cbTurnCardCount
							hitResult[cbHitCardCount-1].cbResultCard[0] = unorderResult.cbTripleCardData_unBomb[cbIndex]
							hitResult[cbHitCardCount-1].cbResultCard[1] = unorderResult.cbTripleCardData_unBomb[cbIndex+1]
							hitResult[cbHitCardCount-1].cbResultCard[2] = unorderResult.cbTripleCardData_unBomb[cbIndex+2]
							cbHitCardCount = cbHitCardCount + 1
							if (cbHitCardCount > yx.config.MAX_COUNT ){
								return [true,hitResult,cbHitCardCount-1]
							}
						}
					}
				}
			}
		}
		return [true,hitResult,cbHitCardCount-1]
	}	
	//获取单双数据(全部单牌 全部对牌 飞机带最优单双 三张带最优单双 四张带最优单双)
	GetCardsByTriplets(cbHandCardData:number[],cbHandCardCount:number,cbResultCard:number[],cbTurnLineCount:number,CardType:number):[number,number[]]{
		var bGetAll = false
		var bTakeDouble = false
		var cbCountSame = 0
		var cbGetCount = 0
		if(CardType == yx.config.OutCardType.Single){
			cbGetCount = 13+2  //1~K+大小王
        	bGetAll = true
		}else if(CardType == yx.config.OutCardType.Double){
			cbGetCount = 13*2
			bGetAll = true
			bTakeDouble = true
		}else if(CardType == yx.config.OutCardType.Triplet_Attached_Card){
			cbGetCount = 1
        	cbCountSame = 3
		}else if(CardType == yx.config.OutCardType.Triplet_Attached_Pair){
			cbGetCount = 2
			cbCountSame = 3
			bTakeDouble = true
		}else if(CardType == yx.config.OutCardType.Quadplex_Attached_Two_Cards){
			cbGetCount = 2
        	cbCountSame = 4
		}else if(CardType == yx.config.OutCardType.Quadplex_Attached_Two_Pairs){
			cbGetCount = 4
			cbCountSame = 4
			bTakeDouble = true
		}else if(CardType == yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards){
			cbGetCount = cbTurnLineCount
       	    cbCountSame = 3
		}else if(CardType == yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Pairs){
			cbGetCount = cbTurnLineCount * 2
			cbCountSame = 3
			bTakeDouble = true
		}else if(CardType == yx.config.OutCardType.Double){
			cbGetCount = 13*2
			bGetAll = true
			bTakeDouble = true
		}
		var cbResultCount = cbTurnLineCount * cbCountSame
		if(cbResultCount > 0 && (cbHandCardCount < cbResultCount || cbTurnLineCount == 0)){
			return [0,cbResultCard]
		}

		//--剩余手牌
		var cbHandCardDataCopy1 = []
		for(var i=0;i<cbHandCardCount;i++){
			cbHandCardDataCopy1.push(cbHandCardData[i])
		}
		var [removeResult,cbHandCardDataCopy,cbHandCardCount] = this.RemoveCard(cbResultCard, cbResultCount, cbHandCardDataCopy1, cbHandCardCount)
		if(cbResultCount > 0 && removeResult == false){
			return [0,cbResultCard]
		}

		// /--手牌不足
		if(!bGetAll && cbHandCardCount < cbGetCount){
			return [0,cbResultCard]
		}

		//从小到大 控制优先小牌开始
    	//组合变量
		var cbLZCardCount = 0
		var cblaiZiCardCount = 0
		var cblaiziCardData= []
		var cbKingCardCount = 0
		var cbKingCardData = []
		var cbTypeCardCount =[0,0,0,0]
		var cbTypeCardData =[]  //[4][MAX_COUNT] = { 0 }
		for(var i=0;i<4;i++){
			cbTypeCardData[i] =[]
		}
		var cbSingleInTripletCount = 0
		var cbSingleInTripletData= []
		var cbPairInTripletCount = 0
		var cbPairInTripletData = []
		var cbPairInSingleAndLzCount = 0
		var cbPairInSingleAndLzData = []
		//组合查找
		var cbLZCardLogicValue = 0//this.GetCardLogicValue(this.m_cbLaiZiCardData)
		var i = 0
		while(i<cbHandCardCount){
			var cbCurLogicValue = this.GetCardLogicValue(cbHandCardDataCopy[i])
			if(cbCurLogicValue == cbLZCardLogicValue){
				cblaiZiCardCount = cblaiZiCardCount + 1
				cblaiziCardData[cblaiZiCardCount] = cbHandCardDataCopy[i]
				cbLZCardCount = cblaiZiCardCount
			}else if(cbCurLogicValue >= (yx.config.GAME_CARD_LOGIC_VALUE_MAX - 1)){
				cbKingCardCount = cbKingCardCount + 1
            	cbKingCardData[cbKingCardCount] = cbHandCardDataCopy[i]
			}else{
				//查找同牌
            	var cbSameCount = 1
				for(var j=i+1;j<cbHandCardCount;j++){
					var nextLogicValue = this.GetCardLogicValue(cbHandCardDataCopy[j])
					if (nextLogicValue != cbCurLogicValue ){
						break
					}
                	cbSameCount = cbSameCount + 1
				}

				//单牌情况的限制条件
            	var bContinue = false
				if(cbSameCount == 1 && ! bGetAll){
					//--单牌不能与组合值相等(不能凑成四张或以上 同牌)
					for(var t=0;t<cbTurnLineCount;t++){
						if(cbCurLogicValue == this.GetCardLogicValue(cbResultCard[(t) * cbCountSame + 1])){
							bContinue = true
                        	break
						}
					}
				}

				//--查找带对 从三张同牌取两张/取单张
				if(bContinue == false){
					if(bTakeDouble == true && cbSameCount == 3){
						//三张取两
						cbPairInTripletData[cbPairInTripletCount] = cbHandCardDataCopy[i]
						cbPairInTripletData[cbPairInTripletCount+1] = cbHandCardDataCopy[i+1]
						cbPairInTripletCount = cbPairInTripletCount + 2

						//三张取单
						cbSingleInTripletCount = cbSingleInTripletCount + 1
						cbSingleInTripletData[cbSingleInTripletCount-1] = cbHandCardDataCopy[i+2]
					}
					// /--单双三四列表保存
					var cbIndex = cbSameCount
					for(var k=0;k<cbSameCount;k++){
						cbTypeCardData[cbIndex-1][cbTypeCardData[cbIndex-1].length ] = cbHandCardDataCopy[i + k ]
					}
					cbTypeCardCount[cbIndex-1] = cbTypeCardCount[cbIndex-1] + cbSameCount
					if(cbSameCount > 1){
						i = i + (cbSameCount - 1)
					}
				}
			}
			i = i + 1 
		}
		//单牌lz组合对牌
		if(bTakeDouble == true){
			//规则修正 四带两对 这两对不能成炸 只能从三张 提取两张 且 第三张作为单牌不能跟lz合成对
			if(CardType != yx.config.OutCardType.Quadplex_Attached_Two_Pairs){
				//合并单牌
				for(var i=0;i<cbSingleInTripletCount;i++){
					cbTypeCardData[0].push(cbSingleInTripletData[i])
				}
				cbTypeCardCount[0] = cbTypeCardCount[0] + cbSingleInTripletCount
            	this.SortCardData(cbTypeCardData[0], cbTypeCardCount[0])
			}

			//组合对牌
			var cbCount = cbTypeCardCount[0]
			// while(cbCount > 0 && cblaiZiCardCount > 0){
			// 	cbPairInSingleAndLzData[cbPairInSingleAndLzCount] = cbTypeCardData[0][cbCount-1]
			// 	cbPairInSingleAndLzData[cbPairInSingleAndLzCount+1] = this.GetCardFaceValue(cbTypeCardData[0][cbCount-1]) + this.GetCardColorShape(cblaiziCardData[cblaiZiCardCount-1]) + yx.config.CARD_LAIZI_VALUE
			// 	cbPairInSingleAndLzCount = cbPairInSingleAndLzCount + 2

			// 	cbCount = cbCount - 1
			// 	cblaiZiCardCount = cblaiZiCardCount -1
			// }
		}

		//规则修正 四带两对 这两对不能成炸 只能从四张 提取两张
		if(CardType == yx.config.OutCardType.Quadplex_Attached_Two_Pairs){
			if(cbTypeCardCount[3] > 0){
				var cbFourCount = cbTypeCardCount[3]/4
				var cbCardTemp = []
				for(var j=0;j<cbFourCount;j++){
					cbCardTemp[(j)*2] = cbTypeCardData[3][(j)*4]
					cbCardTemp[(j)*2+1] = cbTypeCardData[3][(j)*4+1]
					cbTypeCardCount[3] = cbTypeCardCount[3] - 2
				}
          
			}

			if(cblaiZiCardCount > 3){
				cblaiZiCardCount = 3
			}
		}

		//最优顺序查找
		if(bTakeDouble == false){
			var cbOrderCount: number[] = [
				cbTypeCardCount[0],
				cbTypeCardCount[1],
				cbTypeCardCount[2],
				cbKingCardCount > 1 ? 0 : cbKingCardCount,
				cblaiZiCardCount <= 3 ? cblaiZiCardCount : 0,
				cbTypeCardCount[3],
				cbKingCardCount === 2 ? 2 : 0,
				cblaiZiCardCount === 4 ? 4 : 0,
			];
			
			var pcbOrderData: number[] = [
				cbTypeCardData[0],
				cbTypeCardData[1],
				cbTypeCardData[2],
				cbKingCardData,
				cblaiziCardData,
				cbTypeCardData[3],
				cbKingCardData,
            	cblaiziCardData,
			];

			for(var i=0;i<cbOrderCount.length;i++){
				var cbCount = cbOrderCount[i]
				while(cbCount > 0 && cbGetCount > 0){
					cbResultCount = cbResultCount+1
					cbResultCard[cbResultCount-1] = pcbOrderData[i][cbCount-1]
					cbCount = cbCount - 1
					cbGetCount = cbGetCount - 1
				}

				if( cbGetCount == 0){
					break;
				}
			}
		}else{
			var cbOrderCount: number[] = [
				cbTypeCardCount[1],
				cbPairInTripletCount,
				cbPairInSingleAndLzCount,
				cblaiZiCardCount === 2 ? 2 : 0,
				cbTypeCardCount[3],
				cbKingCardCount === 3 ? 2 : 0,
				cblaiZiCardCount === 4 ? cblaiZiCardCount : 0,
				(CardType === yx.config.OutCardType.Double && cbLZCardCount > 1) ? 2 : 0,
			];
			  
			var pcbOrderData1: any[] = [
				cbTypeCardData[1],
				cbPairInTripletData,
				cbPairInSingleAndLzData,
				cblaiziCardData,
				cbTypeCardData[3],
				cblaiziCardData,
				cblaiziCardData,
				cblaiziCardData,
			];

			for(var i=0;i<cbOrderCount.length;i++){	
				var cbCount = cbOrderCount[i]
				while(cbCount > 0 && cbGetCount > 0){
					cbResultCount = cbResultCount + 1
					cbResultCard[cbResultCount-1] = pcbOrderData[i][cbCount-1]
					cbCount = cbCount - 1
					cbGetCount = cbGetCount - 1
				}

				if(cbGetCount == 0){
					break
				}
			}
		}

		//规则隐藏
		if(CardType == yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards){
			var ResOutCardType = this.GetCardType(cbResultCard,cbResultCount)
			if(ResOutCardType == yx.config.OutCardType.Sequence_Of_Triplets || ResOutCardType == yx.config.OutCardType.Invalid){
				return [0,[]]
			}  
        
		}
		var resultCount = cbGetCount == 0 ? 1 : 0
		return [resultCount,cbResultCard]
	}
	//获取同牌
	GetSameCard(cbHandCardData:number[],cbHandCardCount:number,cbCard:number,cbMaxCount:number):[number,number[]]{
		var cbCount = 0
		var cbResultCard = []
		var cbCardValue = this.GetCardLogicValue(cbCard)
		for (var i=0;i< cbHandCardCount;i++ ){
			if (cbCardValue == this.GetCardLogicValue(cbHandCardData[i]) ){
				cbCount = cbCount + 1
				cbResultCard[cbCount-1] = cbHandCardData[i]
				if (cbMaxCount == cbCount ){
					break
				}
			}
		}

		//剩余牌数
		return [cbMaxCount - cbCount,cbResultCard]
	}
	//--移除牌
	RemoveCard(cbRemoveCard:number[],cbRemoveCount:number,cbHandCardData:number[],cbHandCardCount:number):[boolean,number[],number]{
		if(cbRemoveCount > cbHandCardCount){
			return [false,cbHandCardData,cbHandCardCount]
		}
		var cbDeleteCount = 0
		var cbHandCardDataCopy = []
		var cbHandCardCountCopy = cbHandCardCount
		for(var i=0;i<cbHandCardCountCopy;i++){
			cbHandCardDataCopy[i] = cbHandCardData[i]
		}

		//将待删除的扑克置零
		for(var removeIndex=0;removeIndex<cbRemoveCount;removeIndex++){
			for(var handIndex=0;handIndex<cbHandCardCountCopy;handIndex++){
				//--删除癞子牌
				// if(this.isLaiZiCardValue(cbRemoveCard[removeIndex])){

				// }
				if(cbRemoveCard[removeIndex] == cbHandCardDataCopy[handIndex]){
					cbDeleteCount = cbDeleteCount + 1
					cbHandCardDataCopy[handIndex] = 0
					break
				}
			}
		}

		if(cbDeleteCount != cbRemoveCount){
			return [false,cbHandCardData,cbHandCardCount]
		}

		cbHandCardData =[]
		var cbLeftCardIndex = 1
		for(var i=0;i<cbHandCardCountCopy;i++){
			if(cbHandCardDataCopy[i] != 0){
				cbHandCardData[cbLeftCardIndex] = cbHandCardDataCopy[i]
            	cbLeftCardIndex = cbLeftCardIndex + 1
			}
		}

		cbHandCardCount = cbHandCardCount - cbDeleteCount

    	return [true,cbHandCardData,cbHandCardCount]
	}
	AnalyzeCardDataUnOrder(orderResult:CardsAnalyseResult,order:number){
		if(orderResult == null){
			return
		}
		var order = order ? order: yx.config.CardSortOrder.DESC
		var unorderResult = this.createCardsAnalyseResult()
		//--拆成单张
		if(orderResult.cbSingleCount > 0){
			unorderResult.cbSingleCardData = orderResult.cbSingleCardData.slice()
			unorderResult.cbSingleCount = orderResult.cbSingleCount
		}
		for(var i=0;i<unorderResult.cbSingleCardData.length;i++){
			unorderResult.cbSingleCardData_unOrder.push(unorderResult.cbSingleCardData[i])
		}
		this.SortCardData(unorderResult.cbSingleCardData_unOrder,unorderResult.cbSingleCardData_unOrder.length,yx.config.CardSortOrder.ASC)
	
		if(orderResult.cbDoubleCount > 0){
			var cbdoubleTempData = []
			for(var i=0;i<orderResult.cbDoubleCount;i++){
				var cbLaiziCount = 0
				for(var j=(i+1)*2;j<=((i+1)*2+1);j++){
					//暂时没癞子
				}
				if(cbLaiziCount != 1){
					unorderResult.cbSingleCount++;
					var  cbIndex = unorderResult.cbSingleCount
					unorderResult.cbSingleCardData[cbIndex-1] = orderResult.cbDoubleCardData[i*2]
					cbdoubleTempData.push(orderResult.cbDoubleCardData[i*2])
				}
			}
			this.SortCardData(cbdoubleTempData,cbdoubleTempData.length,yx.config.CardSortOrder.ASC)
			for(var i=0;i<cbdoubleTempData.length;i++){
				unorderResult.cbSingleCardData_unOrder.push(cbdoubleTempData[i])
			}
		}
		
		if(orderResult.cbTripleCount > 0){
			var cbTripleTempData = []
			for(var i=0;i<orderResult.cbTripleCount;i++){
				var cbLaiziCount = 0
				for(var j=(i+1)*2;j<=((i+1)*2+1);j++){
					//暂时没癞子
				}
				if(cbLaiziCount != 1 && cbLaiziCount != 2){
					unorderResult.cbSingleCount++;
					var  cbIndex = unorderResult.cbSingleCount
					unorderResult.cbSingleCardData[cbIndex-1] = orderResult.cbDoubleCardData[i*3]
					cbTripleTempData.push(orderResult.cbDoubleCardData[i*3])
				}
			}
			this.SortCardData(cbTripleTempData,cbTripleTempData.length,yx.config.CardSortOrder.ASC)
			for(var i=0;i<cbTripleTempData.length;i++){
				unorderResult.cbSingleCardData_unOrder.push(cbTripleTempData[i])
			}
		}

		if(orderResult.cbQuadrupleCount > 0){
			var cbQuadrupleTempData = []
			for(var i=0;i<orderResult.cbQuadrupleCount;i++){
		
					unorderResult.cbSingleCount++;
					var  cbIndex = unorderResult.cbSingleCount
					unorderResult.cbSingleCardData[cbIndex-1] = orderResult.cbDoubleCardData[i*4]
					cbQuadrupleTempData.push(orderResult.cbDoubleCardData[i*4])
				
			}
			this.SortCardData(cbQuadrupleTempData,cbQuadrupleTempData.length,yx.config.CardSortOrder.ASC)
			for(var i=0;i<cbQuadrupleTempData.length;i++){
				unorderResult.cbSingleCardData_unBomb.push(cbQuadrupleTempData[i])
			}
		}

		if(orderResult.bLaiZiBomb == true){
			unorderResult.cbSingleCount = unorderResult.cbSingleCount + 1
			var  cbIndex = unorderResult.cbSingleCount
			unorderResult.cbSingleCardData[cbIndex-1] = orderResult.cbLaiZiBombCardData[0]
			unorderResult.cbSingleCardData_unBomb.push(orderResult.cbLaiZiBombCardData[0])
		}
		this.SortCardData(unorderResult.cbSingleCardData,unorderResult.cbSingleCount,order)

		if(orderResult.bContainsRocket == true){
			unorderResult.cbSingleCardData_unBomb.push(orderResult.cbRocketCardData[1])
			unorderResult.cbSingleCardData_unBomb.push(orderResult.cbRocketCardData[0])
		}

		//拆成对子
		if(orderResult.cbDoubleCount > 0){
			unorderResult.cbDoubleCardData = orderResult.cbDoubleCardData.slice()
			unorderResult.cbDoubleCount =orderResult.cbDoubleCount
		}
		for(var i=0;i<unorderResult.cbDoubleCardData.length;i++){
			unorderResult.cbDoubleCardData_unOrder.push(unorderResult.cbDoubleCardData[i])
		}
		this.SortCardData(unorderResult.cbDoubleCardData_unOrder,unorderResult.cbDoubleCardData_unOrder.length,yx.config.CardSortOrder.ASC)

		if(orderResult.cbTripleCount > 0){
			var cbTripleTempData = []
			for(var j=(i+1)*2;j<=((i+1)*2+1);j++){
				//暂时没癞子
			}
			if(cbLaiziCount !=1 && cbLaiziCount !=2){
				unorderResult.cbDoubleCount ++;
                var  cbIndex = unorderResult.cbDoubleCount
                unorderResult.cbDoubleCardData[cbIndex*2-2] = orderResult.cbTripleCardData[i * 2+1]
                unorderResult.cbDoubleCardData[cbIndex*2-1]   = orderResult.cbTripleCardData[i * 2]
                cbTripleTempData.push(orderResult.cbTripleCardData[i * 2+1])
                cbTripleTempData.push(orderResult.cbTripleCardData[i * 2])
			}
			this.SortCardData(cbTripleTempData,cbTripleTempData.length,yx.config.CardSortOrder.ASC)
			for(var i=0;i<cbTripleTempData.length;i++){
				unorderResult.cbDoubleCardData_unOrder.push(cbTripleTempData[i])
			}
		}
		
		if(orderResult.cbQuadrupleCount > 0){
			var cbQuadrupleTempData = []
			for(var i=0;i<orderResult.cbQuadrupleCount;i++){
				unorderResult.cbDoubleCount = unorderResult.cbDoubleCount + 1
				var  cbIndex = unorderResult.cbDoubleCount
				unorderResult.cbDoubleCardData[cbIndex*2-2] = orderResult.cbQuadrupleCardData[i * 4]
				unorderResult.cbDoubleCardData[cbIndex*2-1]   = orderResult.cbQuadrupleCardData[i * 4+1]
				cbQuadrupleTempData.push(orderResult.cbQuadrupleCardData[i * 4])
				cbQuadrupleTempData.push(orderResult.cbQuadrupleCardData[i * 4+1])
			}
			
			this.SortCardData(cbQuadrupleTempData,cbQuadrupleTempData.length,yx.config.CardSortOrder.ASC)
			for(var i=0;i<cbQuadrupleTempData.length;i++){
				unorderResult.cbDoubleCardData_unBomb.push(cbQuadrupleTempData[i])
			}
		}

		if(orderResult.bLaiZiBomb == true){
			unorderResult.cbDoubleCount++;
			var  cbIndex = unorderResult.cbDoubleCount
			unorderResult.cbDoubleCardData[cbIndex*2-2] = orderResult.cbLaiZiBombCardData[0]
			unorderResult.cbDoubleCardData[cbIndex*2-1]   = orderResult.cbLaiZiBombCardData[1]
			unorderResult.cbDoubleCardData_unOrder.push(orderResult.cbLaiZiBombCardData[0])
			unorderResult.cbDoubleCardData_unOrder.push(orderResult.cbLaiZiBombCardData[1])
		}
		this.SortCardData(unorderResult.cbDoubleCardData,unorderResult.cbDoubleCount,order)
		//拆成三张
		if(orderResult.cbTripleCount > 0 ){
			unorderResult.cbTripleCardData = orderResult.cbTripleCardData.slice()
			unorderResult.cbTripleCount = orderResult.cbTripleCount
		}
		for(var i=0;i<unorderResult.cbTripleCardData.length;i++){
			unorderResult.cbTripleCardData_unOrder.push(unorderResult.cbTripleCardData[i])
		}
		this.SortCardData(unorderResult.cbTripleCardData_unOrder,unorderResult.cbTripleCardData_unOrder.length,yx.config.CardSortOrder.ASC)

		if(orderResult.cbQuadrupleCount > 0 ){
			var cbQuadrupleTempData = []
			for(var i=0;i<orderResult.cbQuadrupleCount;i++){
				unorderResult.cbTripleCount++;
				var  cbIndex = unorderResult.cbTripleCount
				unorderResult.cbTripleCardData[cbIndex*3-3] = orderResult.cbQuadrupleCardData[i * 4]
				unorderResult.cbTripleCardData[cbIndex*3-2] = orderResult.cbQuadrupleCardData[i * 4+1]
				unorderResult.cbTripleCardData[cbIndex*3-1]   = orderResult.cbQuadrupleCardData[i * 4+2]
				cbQuadrupleTempData.push(orderResult.cbQuadrupleCardData[i * 4])
				cbQuadrupleTempData.push(orderResult.cbQuadrupleCardData[i * 4+1])
				cbQuadrupleTempData.push(orderResult.cbQuadrupleCardData[i * 4+2])
			}
			this.SortCardData(cbQuadrupleTempData,cbQuadrupleTempData.length,yx.config.CardSortOrder.ASC)
			for(var i=0;i<cbQuadrupleTempData.length;i++){
				unorderResult.cbTripleCardData_unBomb.push(cbQuadrupleTempData[i])
			}
		}

		if(orderResult.bLaiZiBomb == true){
			unorderResult.cbTripleCount++;
			var  cbIndex = unorderResult.cbTripleCount
			unorderResult.cbTripleCardData[cbIndex*3-3] = orderResult.cbLaiZiBombCardData[0]
			unorderResult.cbTripleCardData[cbIndex*3-2] = orderResult.cbLaiZiBombCardData[1]
			unorderResult.cbTripleCardData[cbIndex*3-1]   = orderResult.cbLaiZiBombCardData[2]

			unorderResult.cbTripleCardData_unBomb.push(orderResult.cbLaiZiBombCardData[0])
			unorderResult.cbTripleCardData_unBomb.push(orderResult.cbLaiZiBombCardData[1])
			unorderResult.cbTripleCardData_unBomb.push(orderResult.cbLaiZiBombCardData[2])
		}

		this.SortCardData(unorderResult.cbTripleCardData,unorderResult.cbTripleCount,order)

		//存软炸
		if (orderResult.cbQuadrupleCountLaiZi > 0 ){
			unorderResult.cbQuadrupleCardDataLaiZi = orderResult.cbQuadrupleCardDataLaiZi.slice()
			unorderResult.cbQuadrupleCountLaiZi = orderResult.cbQuadrupleCountLaiZi
		}
		this.SortCardData(unorderResult.cbQuadrupleCardDataLaiZi,unorderResult.cbQuadrupleCountLaiZi,order)
		//存四张
		if (orderResult.cbQuadrupleCount > 0 ){
			unorderResult.cbQuadrupleCardData = orderResult.cbQuadrupleCardData.slice()
			unorderResult.cbQuadrupleCount = orderResult.cbQuadrupleCount
		}
		this.SortCardData(unorderResult.cbQuadrupleCardData,unorderResult.cbQuadrupleCount,order)
		return unorderResult
	}
	AnalyzeHandCardData(cbCardData:number[],cbCardCount:number,order:number):CardsAnalyseResult{
		var result = this.createCardsAnalyseResult()
		if(cbCardCount<=0){
			return
		}
		let self = this
		var findtripRepeat = function(cbTripleCardData:number[],cardData:number){
			var isRepeat = false
			for(var i=0;i<cbTripleCardData.length;i++){
				if(self.GetCardLogicValue(cbTripleCardData[i]) == self.GetCardLogicValue(cardData)){
					isRepeat = true
                	break;
				}
			}
			return isRepeat
		}

		result = this.AnalyzeCardData(cbCardData,cbCardCount)
		return result
	}
	AnalyzeCardData(cbCardData:number[],cbCardCount:number,order?:number):CardsAnalyseResult{
		var result = this.createCardsAnalyseResult()
		var i = 0
		var order = order ?  order : yx.config.CardSortOrder.DESC
		while(i<cbCardCount){
			var cbSameCount = 1
			var cbLogicValue =this.GetCardLogicValue(cbCardData[i])       //当前牌的牌面值

			//--分析火箭数据
			if((i+1) < cbCardCount){
				//下一张牌的牌面值
				var nextLogicValue = this.GetCardLogicValue(cbCardData[i+1])
				//i为大王，i+1为小王/i为小王，i+1为大王
				if ((cbLogicValue == yx.config.GAME_CARD_LOGIC_VALUE_MAX && nextLogicValue == yx.config.GAME_CARD_LOGIC_VALUE_MAX -1) ||
					(cbLogicValue == yx.config.GAME_CARD_LOGIC_VALUE_MAX -1  && nextLogicValue == yx.config.GAME_CARD_LOGIC_VALUE_MAX) ){
					result.bContainsRocket = true
					result.cbRocketCardData[1] = cbCardData[i]
					result.cbRocketCardData[2] = cbCardData[i+1]
					i = i + 2
					cbLogicValue =this.GetCardLogicValue(cbCardData[i])
				}
			}

			//分析非火箭数据
			//统计牌面值相同的牌的数量
			for(var j=i+1;j<cbCardCount;j++){
				var nextLogicValue = this.GetCardLogicValue(cbCardData[j])
				if(cbLogicValue != nextLogicValue){
					break
				}
				cbSameCount = cbSameCount + 1
			}
			//--单牌
			if(cbSameCount == 1){
				result.cbSingleCount = result.cbSingleCount + 1
				var cbIndex = result.cbSingleCount
            	result.cbSingleCardData[cbIndex*cbSameCount-1] = cbCardData[i]        //保存扑克数据

			// --对子
			}else if(cbSameCount == 2){
				result.cbDoubleCount = result.cbDoubleCount + 1
				for(var j=i;j<(i+cbSameCount);j++){
					result.cbDoubleCardData.push(cbCardData[j])
				}

			}else if(cbSameCount == 3){
				result.cbTripleCount = result.cbTripleCount + 1
				for(var j=i;j<(i+cbSameCount);j++){
					result.cbTripleCardData.push(cbCardData[j])
				}
				
			}else if(cbSameCount == 4){
				result.cbQuadrupleCount = result.cbQuadrupleCount + 1
				for(var j=i;j<(i+cbSameCount);j++){
					result.cbQuadrupleCardData.push(cbCardData[j])
				}
				
			}

			i = i + cbSameCount
		}

		//对每种牌型的数组进行排序
		this.SortCardData(result.cbSingleCardData,result.cbSingleCount * 1,order)
		this.SortCardData(result.cbDoubleCardData,result.cbDoubleCount * 2,order)
		this.SortCardData(result.cbTripleCardData,result.cbTripleCount * 3,order)
		this.SortCardData(result.cbQuadrupleCardData,result.cbQuadrupleCount * 4,order)
		this.SortCardData(result.cbFiveCardData,result.cbFiveCount * 5,order)

		return result
	}
	GetCardType(cbPreCardData:number[],cbCardCount:number,bFirstOut?:boolean) {
		var  cbCardData = []
   		cbCardData = cbPreCardData.slice();
		this.SortCardData(cbCardData,cbCardCount,yx.config.CardSortOrder.DESC)
		if(cbCardCount == 0){ //空牌
			return yx.config.OutCardType.Arbitrary
		}else if(cbCardCount == 1){  //单牌
			return yx.config.OutCardType.Single
		}else if(cbCardCount == 2){ //对子 或者 火箭
			if((cbCardData[1] == 0x4F && cbCardData[2] == 0x4E) || (cbCardData[1] == 0x4E && cbCardData[2] == 0x4F)){
				return yx.config.OutCardType.Rocket
			}
			if(this.GetCardLogicValue(cbCardData[1]) == this.GetCardLogicValue(cbCardData[2])){
				return yx.config.OutCardType.Double
			}
		}
		
		//统计相同牌值的数量
    	var  AnalyseResult = this.AnalysebCardData(cbCardData,cbCardCount)
		//四张判断
		if(AnalyseResult.cbFourCount > 0){
			// 判断是非是连炸
        	if  (yx.config.m_use_serial_bomb){
				//全是炸弹牌
				if(AnalyseResult.cbFourCount * 4 == cbCardCount && AnalyseResult.cbFourCount > 1){
					var is_serial_bomb = true
					var cbValue1 = this.GetCardLogicValue(AnalyseResult.cbFourCardData[0])
					var cbValue2 = 0
					//2 本能构成连炸
					if(cbValue1 != 15){
						for(let i=2;i<=AnalyseResult.cbFourCount;i++){
							cbValue2 = this.GetCardLogicValue(AnalyseResult.cbFourCardData[(i-1)*4])+(i-1)
                        	is_serial_bomb = is_serial_bomb && cbValue1 == cbValue2
						}
						if(is_serial_bomb){
							return yx.config.OutCardType.serial_bomb
						}
					}
				}
			}

			//优先判断 44443333->炸弹带双/飞机带单
			if(cbCardCount == 8 && AnalyseResult.cbFourCount == 2){
				var cbValue1 = this.GetCardLogicValue(AnalyseResult.cbFourCardData[0])
            	var cbValue2 = this.GetCardLogicValue(AnalyseResult.cbFourCardData[4])+1
				if((cbValue1 != this.GetCardLogicValue(0x02) && cbValue1 == cbValue2) ){ //|| self.m_cbLaiZiCardData > 0){
					if(bFirstOut == true){
						return yx.config.OutCardType.Quadplex_Two_special //首出可以组成两种特殊牌型
					}else{
						var maxValue = yx.config.CARD_SPECIAL_VALUE_MAX
						var cbcolorShapeValue = this.GetCardColorShape(cbCardData[0])
						if(cbcolorShapeValue>=yx.config.CARD_SPECIAL_VALUE && cbcolorShapeValue <= maxValue){
							return yx.config.OutCardType.Quadplex_Attached_Two_Pairs
						}else{
							return yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards
						}
					}
				}else{
					return yx.config.OutCardType.Quadplex_Attached_Two_Pairs
				}
			}

			//4张炸弹
			if(AnalyseResult.cbFourCount == 1 && cbCardCount == 4){
				return yx.config.OutCardType.Bomb
			}

			if(AnalyseResult.cbFourCount == 1 && AnalyseResult.cbSingleCount == 2 && cbCardCount == 6){
				return yx.config.OutCardType.Quadplex_Attached_Two_Cards
			}else if( AnalyseResult.cbFourCount == 1 && AnalyseResult.cbDoubleCount == 1 && cbCardCount == 6){
				return yx.config.OutCardType.Quadplex_Attached_Two_Cards
			}else if(AnalyseResult.cbFourCount == 1 && AnalyseResult.cbDoubleCount == 2 && cbCardCount == 8){
				return yx.config.OutCardType.Quadplex_Attached_Two_Pairs
			}
			//--飞机带单判断
			if(yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards == this.GetThreeLineTakeOne(AnalyseResult,cbCardCount)){
				return yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards
			}
			// /--规则，飞机带(双)炸0
			if(AnalyseResult.cbThreeCount > 1 ){
				var cbFirstCardData = AnalyseResult.cbThreeCardData[0]            //牌值
				var cbFirstLogicValue = this.GetCardLogicValue(cbFirstCardData)   //花色

				//错误过滤
				if(cbFirstLogicValue < 15){
					var bLink = true
					for(var i=1;i<AnalyseResult.cbThreeCount;i++){
						if(cbFirstLogicValue != this.GetCardLogicValue(AnalyseResult.cbThreeCardData[i*3]) + i){
							bLink = false
                        	break
						}
					}
					var doublenum
					var cbTempDataDouble
					doublenum = AnalyseResult.cbDoubleCount + AnalyseResult.cbFourCount * 2
					if(bLink == true && (AnalyseResult.cbThreeCount * 5 == cbCardCount) && (doublenum == AnalyseResult.cbThreeCount)){
						return yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Pairs
					}
				}
			}
		}

		//三张判断
		if(AnalyseResult.cbThreeCount > 0){
			if(AnalyseResult.cbThreeCount == 1 && cbCardCount == 3 ){
				return yx.config.OutCardType.Triplet
			}

			//新三张判断
			if(AnalyseResult.cbThreeCount >= 2){
				//-- 找出最长 3张连续
				var endIndex = 1
				var dpLen = []
				var maxLen = 1
            	dpLen[0] = 1
				var cbFirstLogicValue:number
				var cbSecondLogicValue:number
				for(var i=0;i<AnalyseResult.cbThreeCount-1;i++){
					cbFirstLogicValue = this.GetCardLogicValue(AnalyseResult.cbThreeCardData[i * 3 ])
                	cbSecondLogicValue = this.GetCardLogicValue(AnalyseResult.cbThreeCardData[(i+1) * 3])
					//-- 前后连续 不能是2 大小王
					if(cbFirstLogicValue == cbSecondLogicValue + 1 && cbFirstLogicValue < 15 && cbSecondLogicValue < 15 ){
						dpLen[i+1] ++
						if( dpLen[i+1] > maxLen){
							endIndex = i+1
                        	maxLen = dpLen[i+1]
						}
					}else{
						dpLen[i+1] = 1
					}
				}
				//--先获取对子数量
				var doublenum 
				var cbTempDataDouble
				doublenum = AnalyseResult.cbDoubleCount
				//无带牌
				if(maxLen == AnalyseResult.cbThreeCount && maxLen * 3 == cbCardCount){
					return yx.config.OutCardType.Sequence_Of_Triplets
				//有带牌 带单
				}else if(maxLen * 4 == cbCardCount){
					return yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards
				//有带牌 带双
				}else if( maxLen * 5 == cbCardCount && doublenum == AnalyseResult.cbThreeCount){
					return yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Pairs
				//拆散飞机带牌
				}else if( maxLen * 4 > cbCardCount && (maxLen * 4 - cbCardCount) % 4 == 0){
					return yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards
				}
			}

			//连牌判断
        	if (AnalyseResult.cbThreeCount >= 1 ){
				var [cbThreeCardData,cbThreeCount] = this.GetThreeSameGroup(AnalyseResult,cbCardCount)
				var cbFirstCardData = cbThreeCardData[0]
				var cbFirstLogicValue = this.GetCardLogicValue(cbFirstCardData)
				if(cbFirstLogicValue > this.GetCardLogicValue(0x01)){
					return yx.config.OutCardType.Invalid
				}
				var cbLinkCount = 1
				for(var i=1;i<cbThreeCount;i++){
					var cbTempThreeCardData = cbThreeCardData[i*3]
					if(cbFirstLogicValue != (this.GetCardLogicValue(cbTempThreeCardData)+i)){
						cbFirstLogicValue = (this.GetCardLogicValue(cbTempThreeCardData)+i)
					}else{
						cbLinkCount = cbLinkCount + 1
					}
				}

				//牌型判断
				if(cbLinkCount*3 == cbCardCount){
					return yx.config.OutCardType.Sequence_Of_Triplets
				}
				if(cbLinkCount * 4 == cbCardCount){
					return (cbLinkCount == 1) ? yx.config.OutCardType.Triplet_Attached_Card : yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards
				}
				if((cbLinkCount * 5 == cbCardCount) && (AnalyseResult.cbDoubleCount == AnalyseResult.cbThreeCount)){
					return (cbLinkCount == 1) ? yx.config.OutCardType.Triplet_Attached_Pair : yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Pairs
				}
			}
			return yx.config.OutCardType.Invalid
		}

		//两张类型
		if(AnalyseResult.cbDoubleCount >= 3){
			var cbFirstCardData = AnalyseResult.cbDoubleCardData[0]
			var cbFirstLogicValue = this.GetCardLogicValue(cbFirstCardData)
			if(cbFirstLogicValue > this.GetCardLogicValue(0x01)){
				return yx.config.OutCardType.Invalid
			}

			//连牌判断
			for (i=1;i<AnalyseResult.cbDoubleCount ;i++){
				var cbTempDoubleCardData = AnalyseResult.cbDoubleCardData[i*2]
				if (cbFirstLogicValue != (this.GetCardLogicValue(cbTempDoubleCardData)+i) ){
					return yx.config.OutCardType.Invalid
				}
			}
			//连对判断
			if (AnalyseResult.cbDoubleCount*2 == cbCardCount ){
				return yx.config.OutCardType.Sequence_Of_Pairs
			}

			return yx.config.OutCardType.Invalid
		}

		//单牌判断
		if(AnalyseResult.cbSingleCount >= 5 && AnalyseResult.cbSingleCount == cbCardCount){
			var cbFirstCardData = AnalyseResult.cbSingleCardData[0]
			var cbFirstLogicValue = this.GetCardLogicValue(cbFirstCardData)

			if( cbFirstLogicValue > this.GetCardLogicValue(0x01)){
				return yx.config.OutCardType.Invalid
			}
			//--连牌判断
			for (i=1;i<AnalyseResult.cbSingleCount ;i++){
				var cbSubValue = cbFirstLogicValue - this.GetCardLogicValue(AnalyseResult.cbSingleCardData[i])
				if(cbSubValue != (i)){
					return yx.config.OutCardType.Invalid
				}
			}

			return yx.config.OutCardType.Sequence
		}
		return yx.config.OutCardType.Invalid
	}
	GetThreeLineTakeOne(AnalyseResult:AnalyseResultEx,cbCardCount:number){
		//查找所有三张组合
		var  cbSameCount = 3
		var [cbThreeCardData,cbThreeCount] = this.GetThreeSameGroup(AnalyseResult,cbCardCount)
		if(cbThreeCount == 0){
			return 0
		}
		//连牌判断
		var cbLinkCount = 1
    	var cbFirstLogicValue = this.GetCardLogicValue(cbThreeCardData[0])
		for(var i=1;i<cbThreeCount;i++){
			var cbCardData = cbThreeCardData[i*3]
			if(cbFirstLogicValue != this.GetCardLogicValue(cbCardData) + i ){
				break;
			}else{
				cbLinkCount++
			}
		}
		//牌型判断
		if(cbLinkCount > 1 && cbLinkCount * 4 == cbCardCount){
			return yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards
		}
		if(cbLinkCount > 1 && cbCardCount % 4 == 0 &&  cbLinkCount * 4 > cbCardCount && cbCardCount == 16 ){
			return yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards
		}
		this.SortCardData(cbThreeCardData,cbThreeCount,yx.config.CardSortOrder.ASC)
		//连牌判断
		cbLinkCount = 1
		cbFirstLogicValue = this.GetCardLogicValue(cbThreeCardData[0])
		for(var i=1;i<cbThreeCount;i++){
			var cbCardData = cbThreeCardData[i*3]
			if(cbFirstLogicValue != this.GetCardLogicValue(cbCardData) - i ){
				break;
			}else{
				cbLinkCount++
			}
		}
		//牌型判断
		if(cbLinkCount > 1 && cbLinkCount * 4 == cbCardCount){
			return yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards
		}
		if(cbLinkCount > 1 && cbCardCount % 4 == 0 &&  cbLinkCount * 4 > cbCardCount && cbCardCount == 16 ){
			return yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards
		}

		return yx.config.OutCardType.Invalid
	}
	GetThreeSameGroup(AnalyseResult:AnalyseResultEx,cbCardCount:number):[number[],number]{
		var cbThreeCardData = []
		if(yx.config.MAX_COUNT < AnalyseResult.cbThreeCardData.length){
			return [cbThreeCardData,0]
		}
		//查找所有三张 组合
		var cbSameCount = 3
		var cbThreeCount = AnalyseResult.cbThreeCount
		for(var i=0;i<AnalyseResult.cbThreeCardData.length;i++){
			cbThreeCardData.push(AnalyseResult.cbThreeCardData[i])
		}
		for(var i=0;i<AnalyseResult.cbFourCount;i++){
			cbThreeCardData.push(AnalyseResult.cbFourCardData[(i+1)*4-4])
			cbThreeCardData.push(AnalyseResult.cbFourCardData[(i+1)*4-3])
			cbThreeCardData.push(AnalyseResult.cbFourCardData[(i+1)*4-2])
			cbThreeCount++;
		}
		//判断组合数
		if(cbThreeCount == 0){
			return [cbThreeCardData,cbThreeCount]
		}
		//从大到小排序
		this.SortCardData(cbThreeCardData,cbThreeCardData.length,yx.config.CardSortOrder.DESC)
		//过滤掉非连牌数据
		if(this.GetCardLogicValue(cbThreeCardData[1]) == this.GetCardLogicValue(0x02) ){
			var cbThreeCardDataTemp = []
			for(var i=0;i<cbThreeCardData.length;i++){
				cbThreeCardDataTemp.push(cbThreeCardData[i])
			}
			cbThreeCardData = []
			for(var i=cbSameCount;i<cbThreeCardDataTemp.length;i++){
				cbThreeCardData.push(cbThreeCardDataTemp[i])
			}
			cbThreeCount++
		}
		return [cbThreeCardData,cbThreeCount]
	}
	GetCardColorShape(cbCardData:number) {
		return cbCardData &  yx.config.CARD_COLOR_MASK
	}
	
	AnalysebCardData(cbCardData:number[],cbCardCount:number) {
		var AnalyseResult = this.createTagAnalyseResultEx()
		var i = 0
		while(i<cbCardCount){
			var cbSameCount = 1
			var singTempCardData = cbCardData[i]
			var cbLogicValue = this.GetCardLogicValue(singTempCardData)

			for(var j=i+1;j<cbCardCount;j++){
				if(this.GetCardLogicValue(cbCardData[j]) != cbLogicValue){
					break;
				}
				cbSameCount++;
			}

			if(cbSameCount == 1){
				AnalyseResult.cbSingleCount++;
				var cbIndex = AnalyseResult.cbSingleCount
				AnalyseResult.cbSingleCardData[cbIndex*cbSameCount-1] = cbCardData[i]
			}else if(cbSameCount == 2){
				AnalyseResult.cbDoubleCount++;
				for (var j=i;j<(i+cbSameCount);j++ ){
					AnalyseResult.cbDoubleCardData.push(cbCardData[j])
				}
			}else if(cbSameCount == 3){
				AnalyseResult.cbThreeCount++;
				for (var j=i;j<(i+cbSameCount);j++ ){
					AnalyseResult.cbThreeCardData.push(cbCardData[j])
				}
			}else if(cbSameCount == 4){
				AnalyseResult.cbFourCount++;
				for (var j=i;j<(i+cbSameCount);j++ ){
					AnalyseResult.cbFourCardData.push(cbCardData[j])
				}
			}
			i = i + cbSameCount
		}
		return AnalyseResult
	}

	SortCardData(cbCardData:number[],cbCardCount:number,order?:number) {
		if(cbCardCount == 0 || cbCardCount == 1){
			return
		}
		var order = order ?  order : yx.config.CardSortOrder.DESC
		if(order == yx.config.CardSortOrder.ASC ){
			cbCardData.sort((a: number, b: number) => {
				if (a === b) {
				  return 0;
				}
			
			  
				if (this.GetCardLogicValue(a) ==  this.GetCardLogicValue(b)) {
				  return a - b
				} 

				return this.GetCardLogicValue(a) - this.GetCardLogicValue(b)
			  });
		}else if(order == yx.config.CardSortOrder.DESC ){
			cbCardData.sort((a: number, b: number) => {
				if (a === b) {
				  return 0;
				}
			
			  
				if (this.GetCardLogicValue(a) ==  this.GetCardLogicValue(b)) {
				  return b - a
				} 

				return this.GetCardLogicValue(b) - this.GetCardLogicValue(a)
			  });
		}
	}
	GetCardLogicValue(cbCardData:number) :number{
		if(cbCardData == 0x00){
			return 0x00
		}
		var cardValue = this.GetCardFaceValue(cbCardData)  
		var cardLogicValue = 0x00
		if(cardValue <= 0x02){
			cardLogicValue = cardValue + yx.config.GAME_CARD_VALUE_LOGIC_COUNT - 0x02
		}else if(cardValue>=0x03 && cardValue<=0x0D){
			cardLogicValue = cardValue
		}else{
			cardLogicValue = cardValue + 0x02      //大小王牌面值为16,17
		}
		return cardLogicValue
	}
	GetCardFaceValue(cbCardData:number) :number{
		return cbCardData & yx.config.CARD_VALUE_MASK
	}
	initData() {
	
	}
	protected initEvents(): boolean | void {
	
	}
	protected initView(): boolean | void {
	
	}
	protected initBtns(): boolean | void {
	
	}
}

/**类型声明调整 */
declare global {
    namespace globalThis {
        type type_logic_Landlord = logic_Landlord
    }
}