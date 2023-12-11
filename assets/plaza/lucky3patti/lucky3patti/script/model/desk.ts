import { assertID } from "cc";
import { ACTOR } from "../../../../../app/config/cmd/ActorCMD";
import { LUCKY3PT_AREA_COUNT } from "../../../../../app/center/plaza/lucky3PattiCenter";
import { LUCKY3PT_AREA_ID, LUCKY3PT_CARDTYPE, LUCKY3PT_GAME_STATE } from "../../../const";

export namespace lucky3pt {
    // --1 = {
    //     --     - "card_data"          = "12,28,60"
    //     --     - "card_type"          = "0"
    //     --     - "game_inning_id"     = "7054002708688142378"
    //     --     - "id"                 = "4858"
    //     --     - "jetton_score"       = "73000"
    //     --     - "room_id"            = "10000"
    //     --     - "time"               = "1642387996"
    //     --     - "total_jetton_score" = "1198000"
    //     --     - "total_win_score"    = "71806130"
    //     --     - "user_count"         = "82"
    //     --     - "user_face"          = "1bcaee3c4918d61af99b3a25fde345c0"
    //     --     - "user_id"            = "2000008144"
    //     --     - "user_name"          = "player_ZKoms"
    //     --     - "win_score"          = "4375498"
    //     --     -     }
    export interface JackpotData {
        card_data: string;
        card_type: string;
        game_inning_id: string;
        id: string;
        jetton_score: string;

        room_id: string;
        time: string;
        total_jetton_score: string;
        total_win_score: string;
        user_count: string;

        user_face: string;
        user_id: string;
        user_name: string;
        win_score: string;
    }
    export interface GamePlayer {
        nChairID: number;                                                   // 玩家座位号
    }
    export interface GameTrend {
        nCardType: number;                                                  // 牌类型
    }
    export interface GameWinnerData {
        nActorDBID: number;                                                 // 用户ID
        szUserName: "";                                                     // 名字
        szMD5FaceFile: "";                                                  // 头像
        nJettonScore: number;                                               // 下注
        nWinScore: number;                                                  // 赢金 
    }


    export interface GameResultData {
        nLeaveTime: number;                                                  // 剩余时间
        nPrizePoolGold: number;                                              // 奖池金额
        nCardData: number[];                                                  // 牌数据
        nCardType: LUCKY3PT_CARDTYPE;                                        // 牌类型
        nWinArea: number;                                                     // 中奖区域

        nAllJettonScore: number[];                                            // 所有用户单局总注
        nUserWinScore: number;                                               // 每个区域赢金 
        bigWinner: GameWinnerData;                                           // 奖池大赢家数据
        nBlowPrizeGold: number;                                              // 本局爆奖池总额
    }
    export class DeskBean {
        private m_gameState: LUCKY3PT_GAME_STATE;                            // 游戏状态
        private m_leaveTime: number;                                         // 剩余时间
        private m_prizeGold: number;                                         // 奖池值
        private m_winner: GameWinnerData;                                    // 服务端会给一个数据 避免服务器重启空挡 服务器没有数据去网站拉取
        private m_heapCards: number[];                                          // 牌堆牌

        private m_cardType: number;                                          // 牌堆牌型
        private m_chipScore: number[];                                       // 筹码值数组
        private m_chipIndex: number;                                         // 当前选中的筹码下标
        private m_allJettonScore: number[];                                  // 每个区域所有玩家的下注值
        private m_jettonScore: number[];                                     // 每个区域玩家自己的下注值

        private m_trendCount: number;                                        // 趋势记录的数量
        private m_trend: GameTrend[];                                        // 趋势记录数据
        private m_hostPlayer: GamePlayer;                                    // 玩家自己的数据
        // private m_players: any[] ;                                            // 玩家数据
        private m_resultData: GameResultData;                                // 游戏结果的数据

        private m_userMaxJettonScore: number;                                // 单个用户每个区域下注限额（0 不限额）
        private m_jettonRechargeLimit: number;                               // 下注充值限制
        private m_jackpotData: JackpotData;                                  // 奖池数据

        constructor() {
            this.m_leaveTime = 0;
            this.m_prizeGold = 0;
            this.m_winner = {} as GameWinnerData;
            this.m_chipScore = [0, 0, 0, 0, 0];
            this.m_chipIndex = 0;

            this.m_trendCount = 0;
            this.m_trend = [];
            this.m_hostPlayer = {} as GamePlayer;
            // this.m_players = [] ;
            this.m_userMaxJettonScore = 0;

            this.m_jettonRechargeLimit = 0;
            this.m_jackpotData = {} as JackpotData;
            this.resetData();

        }
        public resetData(): void {
            this.m_gameState = LUCKY3PT_GAME_STATE.free;
            this.m_cardType = LUCKY3PT_CARDTYPE.none;
            this.m_heapCards = [];
            this.m_allJettonScore = [];
            this.m_jettonScore = [];
            for (var i = 0; i < LUCKY3PT_AREA_COUNT; ++i) {
                this.m_allJettonScore[i] = 0;
                this.m_jettonScore[i] = 0;
            }

            this.m_resultData = {} as GameResultData;
            this.m_resultData.nWinArea = -1;

            // LastLucky3PattiBetIndex  上次下注选中的值
            this.m_chipIndex = app.file.getIntegerForKey("LastLucky3PattiBetIndex", 0);
            // 如果上一次下注的钱超过当前拥有的金币
            if (0 != this.m_chipIndex && this.m_chipScore[this.m_chipIndex] > center.user.getActorProp(ACTOR.ACTOR_PROP_GOLD)) {
                var tflag = false;
                for (var i = this.m_chipIndex; i < 0; --i) {
                    if (this.m_chipScore[i] <= center.user.getActorProp(ACTOR.ACTOR_PROP_GOLD)) {
                        this.setChipIndex(i);
                        tflag = true;
                        break
                    }
                }
                if (false == tflag) {
                    this.setChipIndex(0);
                }
            }
        }
        public setData<T>(data_: T): void {
            if (null != data_) {
                this.m_gameState = data_["nGameSatate"];
                this.m_leaveTime = data_["nLeaveTime"];
                this.m_cardType = data_["nCardType"];
                this.m_prizeGold = data_["nPrizePoolGold"];
                this.m_trendCount = data_["nTrendCount"];

                this.m_userMaxJettonScore = data_["nUserMaxJettonScore"];
                this.m_jettonRechargeLimit = data_["nJettonRechargeLimit"];
                this.m_chipScore = app.func.deepCopy(data_["nChipScore"]);
                this.m_jettonScore = app.func.deepCopy(data_["nJettonScore"]);
                this.m_heapCards = app.func.deepCopy(data_["nCardData"]);

                this.m_hostPlayer.nChairID = data_["nChairID"];
                this.setResultData(data_);
                this.setAllJettonScore(data_["nAllJettonScore"]);
                this.setTrend(data_["trend"], data_["nTrendCount"]);
                this.setWinner(data_["bigWinner"]);

                if (0 != this.m_chipIndex && this.m_chipScore[this.m_chipIndex] > center.user.getActorProp(ACTOR.ACTOR_PROP_GOLD)) {
                    var tflag = false;
                    for (var i = this.m_chipIndex; i < 0; --i) {
                        if (this.m_chipScore[i] <= center.user.getActorProp(ACTOR.ACTOR_PROP_GOLD)) {
                            this.setChipIndex(i);
                            tflag = true;
                            break
                        }
                    }
                    if (false == tflag) {
                        this.setChipIndex(0);
                    }
                }

            }
        }
        public setCardType(type_: number): void {
            this.m_cardType = type_;
        }
        public setResultData<T>(data_: T): void {
            this.m_prizeGold = data_["nPrizePoolGold"];
            this.setAllJettonScore(data_["nAllJettonScore"]);
            this.m_resultData.nWinArea = data_["nWinArea"];
            this.m_resultData.nUserWinScore = data_["nUserWinScore"];
            this.m_resultData.nBlowPrizeGold = data_["nBlowPrizeGold"];
        }
        public getResultData(): GameResultData {
            return this.m_resultData;
        }
        // 设置总的下注值
        public setAllJettonScore<T>(data_: T): number[] {
            var tarr = [];
            for (var i = 0; i < this.m_allJettonScore.length; ++i) {
                tarr[i] = 0;
                if (this.m_allJettonScore[i] != data_[i]) {
                    tarr[i] = data_[i] - this.m_allJettonScore[i];
                }
                this.m_allJettonScore[i] = data_[i];
            }
            return tarr;
        }
        public setAllJettonScoreByIndex(index_: number, val_: number): void {
            this.m_allJettonScore[index_] = val_ | 0;
        }
        public addAllJettonScore(index_: number, val_: number): void {
            this.m_allJettonScore[index_] += val_;
        }
        public getAllJettonScore(): number[] {
            return this.m_allJettonScore;
        }
        public setChipScore<T>(data_: T): void {
            app.func.deepCopy(data_, this.m_chipScore);
        }
        public setJettonScore<T>(data_: T): void {
            app.func.deepCopy(data_, this.m_jettonScore);
        }
        public addJettonScore(index_: number, val_: number): void {
            this.m_jettonScore[index_] += val_;
        }
        public getJettonScore(): number[] {
            return this.m_jettonScore;
        }
        public setHeapcard(data_: number[]): void {
            this.m_heapCards = app.func.deepCopy(data_);
        }
        public setTrend<T>(data_: T, len_: number): void {
            this.m_trendCount = len_;
            this.m_trend = [];
            for (var i = 0; i < len_; ++i) {
                this.m_trend[i] = data_[i];
            }
        }
        public addTrend<T>(data_: T): void {
            var tdata: GameTrend = {} as GameTrend;
            tdata.nCardType = data_["nCardType"];
            this.m_trend.push(tdata);
            this.m_trendCount = this.m_trendCount + 1;
        }
        public getTrends(num_: number = null): GameTrend[] {
            if (null == num_ || num_ >= this.m_trendCount) {
                return this.m_trend;
            }
            var tdata = [];
            for (var i = this.m_trendCount - 1; i > this.m_trendCount - num_ - 1; --i) {
                var tindex = this.m_trendCount - i;
                tdata[num_ - tindex] = this.m_trend[i];
            }
            return tdata;
        }

        public getTrendsByIndex(index_: number): GameTrend {
            return this.m_trend[index_];
        }

        public getTrendCount(): number {
            return this.m_trendCount;
        }

        public setWinner<T>(data_: T): boolean {
            if (!this.m_winner || (data_["nActorDBID"] != this.m_winner.nActorDBID || data_["nWinScore"] != this.m_winner.nWinScore)) {
                app.func.deepCopy(data_, this.m_winner);
                return true;
            }
            return false;
        }

        public getWinner(): GameWinnerData {
            return this.m_winner;
        }

        public setChipIndex(index_: number): void {
            if (index_ != this.m_chipIndex) {
                this.m_chipIndex = index_;
                // 保存上一次下注的下标
                app.file.setIntegerForKey("LastLucky3PattiBetIndex", index_);
            }

        }

        public getChipIndex(): number {
            return this.m_chipIndex;
        }

        public setPrizeGold(num_: number): void {
            this.m_prizeGold = num_;
        }
        public getPrizeGold(): number {
            return this.m_prizeGold;
        }

        public setLeaveTime(time_): void {
            this.m_leaveTime = time_;
        }
        public getLeaveTime(): number {
            return this.m_leaveTime;
        }

        public setUserMaxJettonScore(score_): void {
            this.m_userMaxJettonScore = score_;
        }

        public setJettonRechargeLimit(num_): void {
            this.m_jettonRechargeLimit = num_;
        }

        public getBaseChip(): number {
            return this.m_chipScore[this.m_chipIndex];
        }

        public getUserMaxJettonScore(): number {
            return this.m_userMaxJettonScore;
        }

        public getJettonRechargeLimit(): number {
            return this.m_jettonRechargeLimit;
        }
        public getHostPlayer(): GamePlayer {
            return this.m_hostPlayer;
        }
        public setGameState(state_: LUCKY3PT_GAME_STATE): void {
            this.m_gameState = state_;
        }
        public getGameState(): LUCKY3PT_GAME_STATE {
            return this.m_gameState;
        }
        public getChipScore(): number[] {
            return this.m_chipScore;
        }
        public getHeapcard(): number[] {
            return this.m_heapCards;
        }

    }
}


