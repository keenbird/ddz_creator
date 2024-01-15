import { _decorator, Node as ccNode,js } from 'cc';
import { yx } from '../yx_Landlord';
import { logic_Landlord } from '../ui/main/script/logic_Landlord';
const { ccclass } = _decorator;
const PATH_PREFIX: string = "audio/";
const ResPath = (path: string): string => {
  return PATH_PREFIX + path;
};

const audioPaths = {
    SINGLE: ResPath("%s/1"),
    SINGLE_3: ResPath("%s/4"),
    SINGLE_4: ResPath("%s/5"),
    SINGLE_5: ResPath("%s/6"),
    SINGLE_6: ResPath("%s/7"),
    SINGLE_7	: ResPath("%s/8"),
	SINGLE_8	: ResPath("%s/9"),
	SINGLE_9	: ResPath("%s/10"),
	SINGLE_10: ResPath("%s/11"),
	SINGLE_11: ResPath("%s/12"),
	SINGLE_12: ResPath("%s/13"),
	SINGLE_13: ResPath("%s/14"),
	SINGLE_14: ResPath("%s/2"),
	SINGLE_15: ResPath("%s/3"),
	SINGLE_16: ResPath("%s/15"),
	SINGLE_17: ResPath("%s/16"),

	PAIRS	: ResPath("%s/17"),

	PAIRS_3	: ResPath("%s/20"),
	PAIRS_4	: ResPath("%s/21"),
	PAIRS_5	: ResPath("%s/22"),
	PAIRS_6	: ResPath("%s/23"),
	PAIRS_7	: ResPath("%s/24"),
	PAIRS_8	: ResPath("%s/25"),
	PAIRS_9	: ResPath("%s/26"),
	PAIRS_10: ResPath("%s/27"),
	PAIRS_11: ResPath("%s/28"),
	PAIRS_12: ResPath("%s/29"),
	PAIRS_13: ResPath("%s/30"),
	PAIRS_14: ResPath("%s/18"),
	PAIRS_15: ResPath("%s/19"),		

	TRIPLET_3 : ResPath("%s/33"),
	TRIPLET_4 : ResPath("%s/34"),
	TRIPLET_5 : ResPath("%s/35"),
	TRIPLET_6 : ResPath("%s/36"),
	TRIPLET_7 : ResPath("%s/37"),
	TRIPLET_8 : ResPath("%s/38"),
	TRIPLET_9 : ResPath("%s/39"),
	TRIPLET_10: ResPath("%s/40"),
	TRIPLET_11: ResPath("%s/41"),
	TRIPLET_12: ResPath("%s/42"),
	TRIPLET_13: ResPath("%s/43"),
	TRIPLET_14: ResPath("%s/31"),
	TRIPLET_15: ResPath("%s/32"),

	SEQUENCE_PAIRS_1		: ResPath("%s/44"),
	SEQUENCE_PAIRS_2		: ResPath("%s/45"),

	SEQUENCE_5			: ResPath("%s/46"),
	SEQUENCE_6			: ResPath("%s/47"),
	SEQUENCE_7			: ResPath("%s/48"),
	SEQUENCE_8			: ResPath("%s/49"),
	SEQUENCE_9			: ResPath("%s/50"),
	SEQUENCE_10			: ResPath("%s/51"),
	SEQUENCE_11			: ResPath("%s/52"),
	SEQUENCE_TOP			: ResPath("%s/53"),

	SERIAL_BOMB_2		: ResPath("%s/54"),
	SERIAL_BOMB_3		: ResPath("%s/55"),
	SERIAL_BOMB_4		: ResPath("%s/56"),
	SERIAL_BOMB_5		: ResPath("%s/129"),

	BOMB_1				: ResPath("%s/57"),
	BOMB_2				: ResPath("%s/59"),
	BOMB_3				: ResPath("%s/60"),
	BOMB_4				: ResPath("%s/58"),
	BOMB_5			    : ResPath("%s/61"),
	BOMB_6				: ResPath("%s/62"),

	ROCKET				: ResPath("%s/63"),

	QUADPLEX_TWO_1		: ResPath("%s/64"),
	QUADPLEX_TWO_2		: ResPath("%s/65"),

	TRIPLET_SINGLE_3 : ResPath("%s/68"),
	TRIPLET_SINGLE_4 : ResPath("%s/69"),
	TRIPLET_SINGLE_5 : ResPath("%s/70"),
	TRIPLET_SINGLE_6 : ResPath("%s/71"),
	TRIPLET_SINGLE_7 : ResPath("%s/72"),
	TRIPLET_SINGLE_8 : ResPath("%s/73"),
	TRIPLET_SINGLE_9 : ResPath("%s/74"),
	TRIPLET_SINGLE_10: ResPath("%s/75"),
	TRIPLET_SINGLE_11: ResPath("%s/76"),
	TRIPLET_SINGLE_12: ResPath("%s/77"),
	TRIPLET_SINGLE_13: ResPath("%s/78"),
	TRIPLET_SINGLE_14: ResPath("%s/66"),
	TRIPLET_SINGLE_15: ResPath("%s/67"),

	TRIPLET_PAIRS_3 : ResPath("%s/81"),
	TRIPLET_PAIRS_4 : ResPath("%s/82"),
	TRIPLET_PAIRS_5 : ResPath("%s/83"),
	TRIPLET_PAIRS_6 : ResPath("%s/84"),
	TRIPLET_PAIRS_7 : ResPath("%s/85"),
	TRIPLET_PAIRS_8 : ResPath("%s/86"),
	TRIPLET_PAIRS_9 : ResPath("%s/87"),
	TRIPLET_PAIRS_10: ResPath("%s/88"),
	TRIPLET_PAIRS_11: ResPath("%s/89"),
	TRIPLET_PAIRS_12: ResPath("%s/90"),
	TRIPLET_PAIRS_13: ResPath("%s/91"),
	TRIPLET_PAIRS_14: ResPath("%s/79"),
	TRIPLET_PAIRS_15: ResPath("%s/80"),

	SEQUENCE_TRIPLETS: ResPath("%s/92"),
	SEQUENCE_TRIPLETS_CARDS: ResPath("%s/93"),

	ALERTOR_2_1: ResPath("%s/94"),
	ALERTOR_2_2: ResPath("%s/96"),
	ALERTOR_1: ResPath("%s/95"),

	NO_AFFORD_1: ResPath("%s/97"),
	NO_AFFORD_2: ResPath("%s/98"),
	NO_AFFORD_3: ResPath("%s/99"),
	NO_AFFORD_4: ResPath("%s/100"),

	AFFORD_1: ResPath("%s/101"),
	AFFORD_2: ResPath("%s/102"),
	AFFORD_3: ResPath("%s/103"),

	CALL: ResPath("%s/104"),
	GRAB: ResPath("%s/105"),
	GRAB_ME: ResPath("%s/106"),
	NO_CALL: ResPath("%s/107"),
	NO_GRAB: ResPath("%s/108"),

	DOUBLE: ResPath("%s/109"),
	DOUBLE_SUPER: ResPath("%s/110"),
	NO_DOUBLE: ResPath("%s/111"),

	SPRING: ResPath("%s/112"),
	ANTI_SPRING: ResPath("%s/113"),
	SPRINGED: ResPath("%s/114"),

	BASE_CARD_1: ResPath("%s/115"),
	BASE_CARD_2: ResPath("%s/116"),
	BASE_CARD_3: ResPath("%s/117"),

	CALL_ONE_1: ResPath("%s/118"),
	CALL_ONE_2: ResPath("%s/119"),
	CALL_ONE_3: ResPath("%s/121"),
	CALL_ONE_4: ResPath("%s/120"),

	CALL_TWO_1: ResPath("%s/122"),
	CALL_TWO_2: ResPath("%s/123"),

	CALL_THREE_1: ResPath("%s/124"),//3分
	CALL_THREE_2: ResPath("%s/126"),//3分，不给你们机会
	CALL_THREE_3: ResPath("%s/125"),//3分抄底

	CALLED_ONE: ResPath("%s/127"),
	CALLED_TWO: ResPath("%s/128"),

	PROMOTION_DANGER: ResPath("women/129"),

	PROMOTION_1: ResPath("women/130"),
	PROMOTION_2: ResPath("women/131"),
	PROMOTION_3: ResPath("women/132"),

	PROMOTION_4: ResPath("women/133"),
	PROMOTION_5: ResPath("women/134"),

	PROMOTION_6: ResPath("women/135"),
	PROMOTION_7: ResPath("women/136"),

	MATCH_LOSE_1: ResPath("women/137"),
	MATCH_LOSE_2: ResPath("women/138"),

	MATCH_REWARD_1: ResPath("women/139"),
	MATCH_REWARD_2: ResPath("women/140"),

	MATCH_WIN_1: ResPath("women/141"),
	MATCH_WIN_2: ResPath("women/142"),

	EFFECT_CARD: ResPath("sendcard"),
	EFFECT_CLOCK: ResPath("clock"),
	EFFECT_WIN: ResPath("win"),
	EFFECT_LOSE: ResPath("lose"),
	EFFECT_BOMB: ResPath("bomb"),
	EFFECT_ROCKET: ResPath("rocket"),
	EFFECT_PLANE: ResPath("plane"),
	EFFECT_SEQUENCE: ResPath("sequence"),
	EFFECT_SPRING: ResPath("spring"),
	EFFECT_SHUTCARD: ResPath("shutcard"),

	EFFECT_DISCARD: ResPath("effect_discard"),





	BLESS_COME: ResPath("bless_come"),						//红包来了
	BLESS_OPEN: ResPath("bless_open"),						//福袋打开

	FUKA: ResPath("effect_fuka"),								//福卡音效
	MULTIPLY: ResPath("effect_multiply"),

	MATCH_BGN: ResPath("match/match_bgn"),						//比赛开始
	MATCH_LOSE: ResPath("match/match_lose"),						//比赛失败
	MATCH_OUT: ResPath("match/match_out"),						//比赛淘汰
	MATCH_PROMOTION: ResPath("match/match_promotion"),			//比赛晋级
	MATCH_REVIEVE: ResPath("match/match_revieve"),				//比赛复活
	MATCH_REWARD: ResPath("match/match_reward"),					//比赛奖励
	MATCH_WIN: ResPath("match/match_win"),						//比赛胜利

	SEND_DUMP: ResPath("sendcardDump"),							//按堆发牌音效
	SORT_CARD: ResPath("sortcard"),								//理牌音效
};

@ccclass('sound_Landlord')
export class sound_Landlord  {
    logic: logic_Landlord = new logic_Landlord
    getSexByActor(pActor:any):string{
        let strSex = "man"

        return strSex
    }

    playSound(path:string){
        app.audio.playEffect(fw.BundleConfig.Landlord.res[path]);
    }

    playCardTypeSound(initData:landlordSoundInitData){
        let strSex = this.getSexByActor(initData.pActor)
        let path = ''
        //本局首轮出牌
        if(initData.bFirstRound){
            if(initData.nCardType == yx.config.OutCardType.Single){
                let logicValue = this.logic.GetCardLogicValue(initData.cbCardData[0])
                if(logicValue < 10){
                    path =  js.formatStr(audioPaths["SINGLE"], strSex)
                }
            }else if(initData.nCardType == yx.config.OutCardType.Double){
                let logicValue = this.logic.GetCardLogicValue(initData.cbCardData[0])
                if(logicValue < 10){
                    path =  js.formatStr(audioPaths["PAIRS"], strSex)
                }
            }else if(initData.nCardType == yx.config.OutCardType.Sequence_Of_Pairs){
                let pairCount = initData.nCount / 2
                if (pairCount < 5 ){
                    path = js.formatStr(audioPaths["SEQUENCE_PAIRS_1"], strSex)
                }else{
                    path = js.formatStr(audioPaths["SEQUENCE_PAIRS_2"], strSex)
                }
            }else if(initData.nCardType == yx.config.OutCardType.Sequence){
                let pairCount = initData.nCount / 2
                if (initData.bTopSequence ){
                    path = js.formatStr(audioPaths["SEQUENCE_TOP"], strSex)
                }else{
                    let key = js.formatStr("SEQUENCE_%d", initData.nCount)
                    path = js.formatStr(audioPaths[key], strSex)
                }
            }else if(initData.nCardType == yx.config.OutCardType.serial_bomb){
                let nBombCount = initData.nCount / 4
                let key = js.formatStr("SERIAL_BOMB_%d", nBombCount)
                path = js.formatStr(audioPaths[key], strSex)
            }

            if(! initData.bSecondBomb){
                if(initData.nCardType == yx.config.OutCardType.Bomb || initData.nCardType == yx.config.OutCardType.softBomb ||initData.nCardType == yx.config.OutCardType.LaiZiBomb ){
                    let key = "%s"
                    if(initData.isTeam){
                        let randNum = Math.random() > 0.5 ? 1 : 3
                        key = js.formatStr("BOMB_%d", randNum)
                    }else{
                        let randNum = 1
                        key = js.formatStr("BOMB_%d", randNum)
                    }
                    path = js.formatStr(audioPaths[key], strSex)
                }
            }

            if(path != ''){
                this.playSound(path)
                return
            }
        }

        //.接炸弹
        if(initData.bSecondBomb){
            let randNum = Math.random() > 0.5 ? 5 : 6
            let key = js.formatStr("BOMB_%d", randNum)

            if(initData.isTeam){ //如果是队友打的还是用随机播放
                randNum = Math.random() > 0.5 ? 1 : 3
                key = js.formatStr("BOMB_%d", randNum)
            }
            path = js.formatStr(audioPaths[key], strSex)
            if(path != ''){
                this.playSound(path)
                return
            }
        }

        if(initData.bSpecialBomb){
            let randNum = 1
            let key = "BOMB_4"
            if(initData.isTeam){ //如果是队友打的还是用随机播放
                randNum = Math.random() > 0.5 ? 1 : 3
                key = js.formatStr("BOMB_%d", randNum)
            }
            path = js.formatStr(audioPaths[key], strSex)
            if(path != ''){
                this.playSound(path)
                return
            }
        }

        if(initData.nCardType == yx.config.OutCardType.Single ){
            let logicValue = this.logic.GetCardLogicValue(initData.cbCardData[0])
            let key = js.formatStr("SINGLE_%d", logicValue)
            path = js.formatStr(audioPaths[key], strSex)
        }else if(initData.nCardType == yx.config.OutCardType.Double ){
            let logicValue = this.logic.GetCardLogicValue(initData.cbCardData[0])
            let key = js.formatStr("PAIRS_%d", logicValue)
            path = js.formatStr(audioPaths[key], strSex)
        }else if(initData.nCardType == yx.config.OutCardType.Triplet ){
            let logicValue = this.logic.GetCardLogicValue(initData.cbCardData[0])
            let key = js.formatStr("TRIPLET_%d", logicValue)
            path = js.formatStr(audioPaths[key], strSex)
        }else if(initData.nCardType == yx.config.OutCardType.Rocket ){
 
            path = js.formatStr(audioPaths["ROCKET"], strSex)
        }else if(initData.nCardType == yx.config.OutCardType.Double ){
            let logicValue = this.logic.GetCardLogicValue(initData.cbCardData[0])
            let key = js.formatStr("PAIRS_%d", logicValue)
            path = js.formatStr(audioPaths[key], strSex)
        }else if(initData.nCardType == yx.config.OutCardType.Quadplex_Attached_Two_Cards || initData.nCardType == yx.config.OutCardType.Quadplex_Attached_Two_Pairs ){
            let randNum = Math.random() > 0.5 ? 1 : 2
            let key = js.formatStr("QUADPLEX_TWO_%d", randNum)
            path = js.formatStr(audioPaths[key], strSex)
        }else if(initData.nCardType == yx.config.OutCardType.Triplet_Attached_Card ){
            let logicValue = this.logic.GetCardLogicValue(initData.cbCardData[0])
            let key = js.formatStr("TRIPLET_SINGLE_%d", logicValue)
            path = js.formatStr(audioPaths[key], strSex)
        }else if(initData.nCardType == yx.config.OutCardType.Triplet_Attached_Pair ){
            let logicValue = this.logic.GetCardLogicValue(initData.cbCardData[0])
            let key = js.formatStr("TRIPLET_PAIRS_%d", logicValue)
            path = js.formatStr(audioPaths[key], strSex)
        }else if(initData.nCardType == yx.config.OutCardType.Sequence_Of_Triplets ){
            path = js.formatStr(audioPaths["SEQUENCE_TRIPLETS"], strSex)
        }else if(initData.nCardType == yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards || initData.nCardType == yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Pairs){
            path = js.formatStr(audioPaths["SEQUENCE_TRIPLETS_CARDS"], strSex)
        }

        this.playSound(path)
    }


    playAlertorSound(initData:landlordSoundInitData){
        let strSex = this.getSexByActor(initData.pActor)
     
        if(initData.nCount == 2){
            let randNum = Math.random() > 0.5 ? 1 : 2
            let key = js.formatStr("ALERTOR_2_%d", randNum)
            let path = js.formatStr(audioPaths[key], strSex)
            this.playSound(path)
        }else if(initData.nCount == 1){
            let path = js.formatStr(audioPaths["ALERTOR_1"], strSex)
            this.playSound(path)
        }
        
    }

    playPassSound(initData:landlordSoundInitData){
        let strSex = this.getSexByActor(initData.pActor)
        //--太小，不压
        if(initData.bSmall){
            let path = js.formatStr(audioPaths["NO_AFFORD_4"], strSex)
            this.playSound(path)
        }else {
            let randNum = Math.floor(Math.random() * 3) + 1;
            let key = js.formatStr("NO_AFFORD_%d", randNum)
            let path = js.formatStr(audioPaths[key], strSex)
            this.playSound(path)
        }
    }

    playOptSound(initData:landlordSoundInitData){
        let strSex = this.getSexByActor(initData.pActor)
       
        if(initData.tag == yx.config.ActionEvent.CallPositive){
            this.playSound(js.formatStr(audioPaths["CALL"], strSex))
        }else if(initData.tag == yx.config.ActionEvent.CallNegative){
            this.playSound(js.formatStr(audioPaths["NO_CALL"], strSex))
        }else if(initData.tag == yx.config.ActionEvent.GrabPositive){
            if(initData.bGrapAgain){
                this.playSound(js.formatStr(audioPaths["GRAB_ME"], strSex))
            }else{
                this.playSound(js.formatStr(audioPaths["GRAB"], strSex))
            }
        }else if(initData.tag == yx.config.ActionEvent.GrabNegative){
            this.playSound(js.formatStr(audioPaths["NO_GRAB"], strSex))
        }else if(initData.tag == yx.config.ActionEvent.DoublePositive){
            this.playSound(js.formatStr(audioPaths["DOUBLE"], strSex))
        }else if(initData.tag == yx.config.ActionEvent.DoubleNegative){
            this.playSound(js.formatStr(audioPaths["NO_DOUBLE"], strSex))
        }else if(initData.tag == yx.config.ActionEvent.DoubleSuper){
            this.playSound(js.formatStr(audioPaths["DOUBLE_SUPER"], strSex))
        }
    }

    playSpringSound(initData:landlordSoundInitData){
        let strSex = this.getSexByActor(initData.pActor)
       
        if(initData.tag == yx.config.SpringType.spring){
            this.playSound(js.formatStr(audioPaths["SPRING"], strSex))
        }else if(initData.tag == yx.config.SpringType.antiSpring){
            this.playSound(js.formatStr(audioPaths["ANTI_SPRING"], strSex))
        }else if(initData.tag == yx.config.SpringType.beSpring){
            this.playSound(js.formatStr(audioPaths["SPRINGED"], strSex))
        }
    }

    playOutCardSound(initData:landlordSoundInitData){
        let strSex = this.getSexByActor(initData.pActor)
       
        if(initData.tag == 1){
            this.playSound(js.formatStr(audioPaths["AFFORD_1"], strSex))  //压死
        }else if(initData.tag == 2){
            let randNum = Math.floor(Math.random() * 2) + 1;
            let key = js.formatStr("AFFORD_%d", randNum)
            let path = js.formatStr(audioPaths[key], strSex)
            this.playSound(path)
        }
    }

    playBaseCardSound(initData:landlordSoundInitData){
        let strSex = this.getSexByActor(initData.pActor)
       
        if(initData.tag == 1){
            let randNum = Math.floor(Math.random() * 2) + 1;
            let key = js.formatStr("BASE_CARD_%d", randNum)
            let path = js.formatStr(audioPaths[key], strSex)
            this.playSound(path)
        }else if(initData.tag == 2){
            this.playSound(js.formatStr(audioPaths["BASE_CARD_3"], strSex))  
        }
    }

    playCallPointSound(initData:landlordSoundInitData){
        let strSex = this.getSexByActor(initData.pActor)
       
        if(initData.nCount == 1){
            if(initData.tag  == 1){
                let randNum = Math.floor(Math.random() * 4) + 1;
                let key = js.formatStr("CALL_ONE_%d", randNum)
                let path = js.formatStr(audioPaths[key], strSex)
                this.playSound(path)
            }else if(initData.tag  == 2){
                let randNum = Math.floor(Math.random() * 3) + 1;
                let key = js.formatStr("CALL_ONE_%d", randNum)
                let path = js.formatStr(audioPaths[key], strSex)
                this.playSound(path)
            }else if(initData.tag  == 3){
                this.playSound(js.formatStr(audioPaths["CALL_ONE_1"], strSex))  
            }
        }else if(initData.nCount == 2){
            if(initData.tag  == 1 || initData.tag  == 2){
                let randNum = Math.floor(Math.random() * 2) + 1;
                let key = js.formatStr("CALL_TWO_%d", randNum)
                let path = js.formatStr(audioPaths[key], strSex)
                this.playSound(path)
            }else if(initData.tag  == 3){
                this.playSound(js.formatStr(audioPaths["CALL_TWO_1"], strSex))  
            }
        }else if(initData.nCount == 3){
            if(initData.tag  == 1 || initData.tag  == 2){
                let randNum = Math.floor(Math.random() * 2) + 1;
                let key = js.formatStr("CALL_THREE_%d", randNum)
                let path = js.formatStr(audioPaths[key], strSex)
                this.playSound(path)
            }else if(initData.tag  == 3){
                let randNum = Math.random() > 0.5 ? 1 : 3
                let key = js.formatStr("CALL_THREE_%d", randNum)
                let path = js.formatStr(audioPaths[key], strSex)
                this.playSound(path)
            }
        }
    }

    playSendCard(){
        this.playSound(audioPaths["EFFECT_CARD"])  
    }

    playDiscard(){
        this.playSound(audioPaths["EFFECT_DISCARD"])  
    }

    playClockEffect(){
        this.playSound(audioPaths["EFFECT_CLOCK"])  
    }

    playSettleEffect(bWin:boolean){
        if(bWin){
            this.playSound(audioPaths["EFFECT_WIN"])  
        }else{
            this.playSound(audioPaths["EFFECT_LOSE"])  
        }
        
    }

    playSpringEffect(){
        this.playSound(audioPaths["EFFECT_SPRING"])  
    }

    playCardTypeEffect(initData:landlordSoundInitData){
        if(initData.nCardType == yx.config.OutCardType.Sequence || 
        initData.nCardType == yx.config.OutCardType.Sequence_Of_Pairs ){
            this.playSound(audioPaths["EFFECT_SEQUENCE"])  
        }else if(initData.nCardType == yx.config.OutCardType.Sequence_Of_Triplets || 
        initData.nCardType == yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Cards || 
        initData.nCardType == yx.config.OutCardType.Sequence_Of_Triplets_With_Attached_Pairs ){
            this.playSound(audioPaths["EFFECT_PLANE"])  
        }else if(initData.nCardType == yx.config.OutCardType.Rocket){
            this.playSound(audioPaths["EFFECT_ROCKET"])  
        }else if(initData.nCardType == yx.config.OutCardType.softBomb || 
        initData.nCardType == yx.config.OutCardType.Bomb || 
        initData.nCardType == yx.config.OutCardType.LaiZiBomb ||
        initData.nCardType == yx.config.OutCardType.serial_bomb){
            this.playSound(audioPaths["EFFECT_BOMB"])  
        }
    }

  

    playShutCardSound(){
        this.playSound(audioPaths["EFFECT_SHUTCARD"])  
    }

    playSendDump(){
        this.playSound(audioPaths["SEND_DUMP"])  
    }

    playSortCard(){
        this.playSound(audioPaths["SORT_CARD"])  
    }


    playMultiply(){
        this.playSound(audioPaths["MULTIPLY"])  
    }

   
}


export interface landlordSoundInitData {
	pActor?: any; //玩家信息
	bFirstRound?: boolean; //是否首出
	nCardType?: number;  //牌型
	cbCardData?: number[]; //牌值
	nCount?: number;  //牌数
	bTopSequence?: boolean; //是否通天顺
	bSecondBomb?: boolean;  //是否接着炸
	isTeam?: boolean; //是否队友出牌
    bSpecialBomb?: boolean;  //是否炸特定牌型
    bSmall ?: boolean; //太小，不压
    tag ?: number; // 操作音频tag
    bGrapAgain?:boolean;//是否再抢
}


export default audioPaths;