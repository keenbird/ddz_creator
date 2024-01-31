import { Size, _decorator ,Node as ccNode,Animation,instantiate,Prefab,v3, Color,Sprite, Rect } from 'cc';
import { yx } from '../yx_Landlord';
const { ccclass } = _decorator;
 
@ccclass('card_Landlord')
export class card_Landlord extends (fw.FWComponent) {
	m_cbCardData:number;
	m_cbCardFaceValue:number = -1;
	m_cbCardLogicValue:number = -1;
	m_nCardColorShape:number;
	m_nCardColorValue:number;
	m_nCardSizeType:number;
	m_bLandlord:boolean;
	m_bSelected:boolean;
	m_bPop:boolean;
	m_pCardNode:ccNode;
	cardBgSize:Size;
	m_nCardZOrder:number;
	pokerResPath:string = "img/poker/";
	setCardData(cardData : number,sizeType :number) {
		this.m_cbCardData = cardData
		this.m_nCardSizeType = sizeType

		this.initCardType()
		this.initCardInfo(cardData)
		this.initCardUI()
	}
	//初始化扑克大小
	initCardType() {
		var jokerFileName = ["Node_JokerCard_L", "Node_JokerCard_S", "Node_JokerCard_S", "Node_OutJokerCard", "Node_OutJokerCard"]
    	var commFileName = ["Node_CommonCard_L", "Node_CommonCard_S", "Node_CommonCard_S", "Node_OutCommonCard", "Node_OutCommonCard"]
		var dic = {}
		for (const key in yx.config.CardSizeType) {
			if (yx.config.CardSizeType.hasOwnProperty(key)) {
				const value = yx.config.CardSizeType[key];
				if(this.isJoker()){
					dic[value] = jokerFileName[value-1]
				}else{
					dic[value] = commFileName[value-1]
				}
			}
		}

		let childs = this.node.children;
        for (let i = 0; i < childs.length; ++i) {
            if(childs[i].name == dic[this.m_nCardSizeType]){
				this.m_pCardNode = childs[i]
			}else{
				childs[i].removeFromParent(true)
			}
        }
		if(this.m_nCardSizeType == yx.config.CardSizeType.CardSizeType_Hands){
			this.m_pCardNode.Items.ImageView_CardTypeLogo.active = false
		}
		this.m_pCardNode.setPosition(0,0)
		this.cardBgSize =  this.m_pCardNode.Items.ImageView_MainBG.size
		this.node.size = this.cardBgSize
	}
	//初始化扑克数值
	initCardInfo(cardData:number) {
		this.m_cbCardData = cardData
		this.m_nCardColorShape = this.getCardColor(cardData)
    	this.m_cbCardFaceValue = this.getCardValue(cardData)
		if(this.m_cbCardFaceValue <= 0x02){
			this.m_cbCardLogicValue = this.m_cbCardFaceValue + yx.config.GAME_CARD_VALUE_LOGIC_COUNT - 0x02
		}else if(this.m_cbCardFaceValue >= 0x03 && this.m_cbCardFaceValue <=0x0D){
			this.m_cbCardLogicValue = this.m_cbCardFaceValue
		}else{
			//大小王
			this.m_cbCardLogicValue = this.m_cbCardFaceValue + 0x02
		}
		//计算牌层级(大小自左向右[大王,小王,2,A,K,Q,J,10,9,8,7,6,5,4,3],花色自左向右[黑桃,红桃,梅花,方片])
		var cardShopColorValue = (this.m_nCardColorShape>> 4) % yx.config.GAME_CARD_UNIT_BLOCK_COUNT
		this.m_nCardZOrder = yx.config.GAME_CARD_ZODER_MAX - this.m_cbCardLogicValue * yx.config.GAME_CARD_UNIT_BLOCK_COUNT - cardShopColorValue
		//计算牌色
		if (this.isJoker() ){
			this.m_nCardColorValue = (cardData == yx.config.CARD_DATA[yx.config.GAME_CARD_SUM-1]) ? yx.config.CardColorValue.CardColorValue_Red : yx.config.CardColorValue.CardColorValue_Black
		}else{
			this.m_nCardColorValue = (this.m_nCardColorShape>> 4) % 2
		}
	}
	//修改牌面
	initCardUI() {
		var faceValueRes = this.pokerResPath + `num_${this.cardColorToString(this.m_nCardColorValue)}_${this.cardValueToString(this.m_cbCardFaceValue)}/spriteFrame`
		this.m_pCardNode.Items.ImageView_CardFaceValue.updateSprite(app.game.getRes(faceValueRes))

		var  cardType = this.cardTypeToString(this.m_nCardColorShape)
		if(cardType == yx.config.CARD_TYPE_JOKER){
			this.m_pCardNode.Items.ImageView_CardType.active = false
		}else{
			var cardTypeRes = this.pokerResPath + `logo.${cardType}/spriteFrame`
			this.m_pCardNode.Items.ImageView_CardType.updateSprite(app.game.getRes(cardTypeRes))
		}

		var cardLogoRes =  this.pokerResPath + this.cardLogoToString( this.m_cbCardFaceValue, this.m_nCardColorValue, this.m_nCardColorShape)
		this.m_pCardNode.Items.ImageView_CardTypeLogo.updateSprite(app.game.getRes(cardLogoRes))
		
		this.m_pCardNode.Items.ImageView_MarkOfLandlord.active = false
		this.m_pCardNode.Items.ImageView_MarkOfPublicCard.active = false
	}
	isJoker():boolean {
		if(this.m_cbCardData == 0x4E || this.m_cbCardData == 0x4F ){
			return true
		}
    	return false
	}
	//获取花色
	getCardColor(cardData:number):number {
		return cardData  & yx.config.CARD_COLOR_MASK
	}
	//获取牌值
	getCardValue(cardData:number):number  {
		return cardData  &  yx.config.CARD_VALUE_MASK
	}
	//获取牌色的字符串
	cardColorToString(color:number):string  {
		var colorString = ""
		if(color == yx.config.CardColorValue.CardColorValue_Red){
			colorString = yx.config.CARD_COLOR_RED
		}else if(color == yx.config.CardColorValue.CardColorValue_Black){
			colorString = yx.config.CARD_COLOR_BLACK
		}else if(color == yx.config.CardColorValue.CardColorValue_Laizi){
			colorString = yx.config.CARD_COLOR_LAIZI
		}
		return colorString
	}
	//获取花色的字符串
	cardTypeToString(color:number):string  {
		var typeString = yx.config.CARD_TYPE_CLUB
		if(color == yx.config.CardColorShape.CardColorShape_Club){
			typeString = yx.config.CARD_TYPE_CLUB
		}else if(color == yx.config.CardColorShape.CardColorShape_Diamond){
			typeString = yx.config.CARD_TYPE_DIAMOND
		}else if(color == yx.config.CardColorShape.CardColorShape_Heart){
			typeString = yx.config.CARD_TYPE_HEART
		}else if(color == yx.config.CardColorShape.CardColorShape_Spade){
			typeString = yx.config.CARD_TYPE_SPADE
		}else if(color == yx.config.CardColorShape.CardColorShape_Joker){
			typeString = yx.config.CARD_TYPE_JOKER
		}
		return typeString
	}
	//获取牌值的字符串
	cardValueToString(cardValue:number):string  {
		if(cardValue > 15 || cardValue < 0){
			return ""
		}
		var cardNames = [
			"A", "2", "3", "4", "5", 
			"6", "7", "8", "9", "10", 
			"J", "Q", "K", "JR", "JR"
		]
		return cardNames[cardValue-1]
	}
	//设置卡牌弹起
	setPop(isPop:boolean)  {
		this.m_bPop = isPop
		var y = this.m_bPop ? yx.config.CARD_POP_OFFSET_Y : 0
		this.node.setPosition(this.node.getPosition().x, y)

		if(!isPop){
			// this.showBombEffect(false)
		}
	}
	getTouchRect():Rect{
		var rect = new Rect(this.m_pCardNode.worldPosition.x, this.m_pCardNode.worldPosition.y, yx.config.CARD_SIZE.width, yx.config.CARD_SIZE.height)
		return rect
	}
	//获取弹起状态
	getStatusPop():boolean  {
		return this.m_bPop
	}
	//获取m_pCardNode
	getCardNode():ccNode  {
		return this.m_pCardNode
	}
	
	setSelected(isSel:boolean)  {
		if(this.m_bSelected== isSel){
			return
		}
		this.m_bSelected = isSel
		for(var i=0;i<this.m_pCardNode.children.length;i++){
			const sprite = this.m_pCardNode.children[i].getComponent(Sprite);
			if (sprite) {
				if(this.m_bSelected){
					sprite.color = new Color(204, 204, 204, 255);
				}else{
					sprite.color = new Color(255, 255, 255, 255);
				}
			} else {
				console.error('节点上没有 Sprite 组件');
			}
			
			
		}

	}

	//是否展示地主标
	showMarkAsLandlord(isShow:boolean) {
		this.m_pCardNode.Items.ImageView_MarkOfLandlord.active = isShow
	}
	//是否展示明牌标志
	showMarkAsPublicCard(isShow:boolean) {
		this.m_pCardNode.Items.ImageView_MarkOfPublicCard.active = isShow
	}
	//获取牌值
	getCardData() : number {
		return this.m_cbCardData
	}
	//获取牌面值
	getCardFaceValue() : number {
		return this.m_cbCardFaceValue
	}
	//获取牌逻辑值
	getCardLogicValue() : number {
		return this.m_cbCardLogicValue
	}
	//获取牌层级
	getCardLocalZOrder() : number {
		return this.m_nCardZOrder
	}
	//获取牌类型
	getCardType() : number {
		return this.m_nCardColorShape
	}
	//获取牌花色
	getCardColorValue() : number {
		return this.m_nCardColorValue
	}
	//展示炸弹标志
	markBoom(isBoom:boolean,lianzhaNum?:number)  {
		var num = lianzhaNum ? lianzhaNum : 1
		this.m_pCardNode.Items.ImageView_MarkOfBoom.active = isBoom
		if(isBoom){
			var boomLogoRes =  this.pokerResPath + `yxc_zd${num}/spriteFrame`
			this.m_pCardNode.Items.ImageView_MarkOfBoom.updateSprite(app.game.getRes(boomLogoRes))
		}
	}
	//设置是否展示右下角标
	setLogoVisible(isVisible:boolean)  {
		
		this.m_pCardNode.Items.ImageView_CardTypeLogo.active = isVisible
	}

	//获取右下角牌标的图片名字
	cardLogoToString(cardValue:number, cardColor:number, cardType:number):string {
		var logoString = ""
		if(this.isJoker()){
			logoString = `logo.${this.cardColorToString(cardColor)}.${this.cardValueToString(cardValue)}/spriteFrame`
		}else{
			logoString = `logo.${this.cardTypeToString(cardType)}/spriteFrame`
		}
		return logoString
	}
	//展示炸弹牌的光亮动画
	showBombLight(startCard:ccNode){
		var cardSize = new Size(155.5, 208)
		var scaleX = 1
		var scaleY = 1
		var path = "ccbResources/LandlordRes/ui/ani/tx_ddz_2022_paixinghuanrao.csb"
		var aniWidth = 418
		var aniHeight = 274
		var delX = this.cardBgSize.width - cardSize.width - 4
		delX = startCard.getComponent("card_Landlord").isJoker() ? delX + 5 : delX
		var startX = startCard.getPosition().x 
		var cardX = this.node.getPosition().x
		var delY = this.cardBgSize.height - cardSize.height + 1
		scaleX = (cardX - startX + cardSize.width)/aniWidth 
		scaleY = cardSize.height/aniHeight
	

		this.loadBundleRes(fw.BundleConfig.Landlord.res[`ui/anim/tx_ddz_2022_paixinghuanrao`], (res: Prefab) => {
			let aniNode = instantiate(res);
			if(!fw.isNull(aniNode)){
				this.m_pCardNode.addChild(aniNode)
				
				aniNode.scale = v3(scaleX, scaleY, 1)
				aniNode.setPosition((cardSize.width - (cardX - startX) + delX ) * 0.5   , cardSize.height/2 + delY)
				const a = aniNode.getComponent(Animation);
				
				a.on(Animation.EventType.FINISHED, () => {
					aniNode.removeFromParent(true)
				});
				a.play(`tx_ddz_2022_paixinghuanrao`);
			}
		});

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
