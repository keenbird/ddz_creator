const PATH_PREFIX: string = "ccbResources/LandlordRes/";
const ResPath = (path: string): string => {
  return PATH_PREFIX + path;
};

const audioPaths = {
    SINGLE: ResPath("audio/%s/1.mp3"),
    SINGLE_3: ResPath("audio/%s/4.mp3"),
    SINGLE_4: ResPath("audio/%s/5.mp3"),
    SINGLE_5: ResPath("audio/%s/6.mp3"),
    SINGLE_6: ResPath("audio/%s/7.mp3"),
    SINGLE_7	: ResPath("audio/%s/8.mp3"),
	SINGLE_8	: ResPath("audio/%s/9.mp3"),
	SINGLE_9	: ResPath("audio/%s/10.mp3"),
	SINGLE_10: ResPath("audio/%s/11.mp3"),
	SINGLE_11: ResPath("audio/%s/12.mp3"),
	SINGLE_12: ResPath("audio/%s/13.mp3"),
	SINGLE_13: ResPath("audio/%s/14.mp3"),
	SINGLE_14: ResPath("audio/%s/2.mp3"),
	SINGLE_15: ResPath("audio/%s/3.mp3"),
	SINGLE_16: ResPath("audio/%s/15.mp3"),
	SINGLE_17: ResPath("audio/%s/16.mp3"),

	PAIRS	: ResPath("audio/%s/17.mp3"),

	PAIRS_3	: ResPath("audio/%s/20.mp3"),
	PAIRS_4	: ResPath("audio/%s/21.mp3"),
	PAIRS_5	: ResPath("audio/%s/22.mp3"),
	PAIRS_6	: ResPath("audio/%s/23.mp3"),
	PAIRS_7	: ResPath("audio/%s/24.mp3"),
	PAIRS_8	: ResPath("audio/%s/25.mp3"),
	PAIRS_9	: ResPath("audio/%s/26.mp3"),
	PAIRS_10: ResPath("audio/%s/27.mp3"),
	PAIRS_11: ResPath("audio/%s/28.mp3"),
	PAIRS_12: ResPath("audio/%s/29.mp3"),
	PAIRS_13: ResPath("audio/%s/30.mp3"),
	PAIRS_14: ResPath("audio/%s/18.mp3"),
	PAIRS_15: ResPath("audio/%s/19.mp3"),		

	TRIPLET_3 : ResPath("audio/%s/33.mp3"),
	TRIPLET_4 : ResPath("audio/%s/34.mp3"),
	TRIPLET_5 : ResPath("audio/%s/35.mp3"),
	TRIPLET_6 : ResPath("audio/%s/36.mp3"),
	TRIPLET_7 : ResPath("audio/%s/37.mp3"),
	TRIPLET_8 : ResPath("audio/%s/38.mp3"),
	TRIPLET_9 : ResPath("audio/%s/39.mp3"),
	TRIPLET_10: ResPath("audio/%s/40.mp3"),
	TRIPLET_11: ResPath("audio/%s/41.mp3"),
	TRIPLET_12: ResPath("audio/%s/42.mp3"),
	TRIPLET_13: ResPath("audio/%s/43.mp3"),
	TRIPLET_14: ResPath("audio/%s/31.mp3"),
	TRIPLET_15: ResPath("audio/%s/32.mp3"),

	SEQUENCE_PAIRS_1		: ResPath("audio/%s/44.mp3"),
	SEQUENCE_PAIRS_2		: ResPath("audio/%s/45.mp3"),

	SEQUENCE_5			: ResPath("audio/%s/46.mp3"),
	SEQUENCE_6			: ResPath("audio/%s/47.mp3"),
	SEQUENCE_7			: ResPath("audio/%s/48.mp3"),
	SEQUENCE_8			: ResPath("audio/%s/49.mp3"),
	SEQUENCE_9			: ResPath("audio/%s/50.mp3"),
	SEQUENCE_10			: ResPath("audio/%s/51.mp3"),
	SEQUENCE_11			: ResPath("audio/%s/52.mp3"),
	SEQUENCE_TOP			: ResPath("audio/%s/53.mp3"),

	SERIAL_BOMB_2		: ResPath("audio/%s/54.mp3"),
	SERIAL_BOMB_3		: ResPath("audio/%s/55.mp3"),
	SERIAL_BOMB_4		: ResPath("audio/%s/56.mp3"),
	SERIAL_BOMB_5		: ResPath("audio/%s/129.mp3"),

	BOMB_1				: ResPath("audio/%s/57.mp3"),
	BOMB_2				: ResPath("audio/%s/59.mp3"),
	BOMB_3				: ResPath("audio/%s/60.mp3"),
	BOMB_4				: ResPath("audio/%s/58.mp3"),
	BOMB_5			    : ResPath("audio/%s/61.mp3"),
	BOMB_6				: ResPath("audio/%s/62.mp3"),

	ROCKET				: ResPath("audio/%s/63.mp3"),

	QUADPLEX_TWO_1		: ResPath("audio/%s/64.mp3"),
	QUADPLEX_TWO_2		: ResPath("audio/%s/65.mp3"),

	TRIPLET_SINGLE_3 : ResPath("audio/%s/68.mp3"),
	TRIPLET_SINGLE_4 : ResPath("audio/%s/69.mp3"),
	TRIPLET_SINGLE_5 : ResPath("audio/%s/70.mp3"),
	TRIPLET_SINGLE_6 : ResPath("audio/%s/71.mp3"),
	TRIPLET_SINGLE_7 : ResPath("audio/%s/72.mp3"),
	TRIPLET_SINGLE_8 : ResPath("audio/%s/73.mp3"),
	TRIPLET_SINGLE_9 : ResPath("audio/%s/74.mp3"),
	TRIPLET_SINGLE_10: ResPath("audio/%s/75.mp3"),
	TRIPLET_SINGLE_11: ResPath("audio/%s/76.mp3"),
	TRIPLET_SINGLE_12: ResPath("audio/%s/77.mp3"),
	TRIPLET_SINGLE_13: ResPath("audio/%s/78.mp3"),
	TRIPLET_SINGLE_14: ResPath("audio/%s/66.mp3"),
	TRIPLET_SINGLE_15: ResPath("audio/%s/67.mp3"),

	TRIPLET_PAIRS_3 : ResPath("audio/%s/81.mp3"),
	TRIPLET_PAIRS_4 : ResPath("audio/%s/82.mp3"),
	TRIPLET_PAIRS_5 : ResPath("audio/%s/83.mp3"),
	TRIPLET_PAIRS_6 : ResPath("audio/%s/84.mp3"),
	TRIPLET_PAIRS_7 : ResPath("audio/%s/85.mp3"),
	TRIPLET_PAIRS_8 : ResPath("audio/%s/86.mp3"),
	TRIPLET_PAIRS_9 : ResPath("audio/%s/87.mp3"),
	TRIPLET_PAIRS_10: ResPath("audio/%s/88.mp3"),
	TRIPLET_PAIRS_11: ResPath("audio/%s/89.mp3"),
	TRIPLET_PAIRS_12: ResPath("audio/%s/90.mp3"),
	TRIPLET_PAIRS_13: ResPath("audio/%s/91.mp3"),
	TRIPLET_PAIRS_14: ResPath("audio/%s/79.mp3"),
	TRIPLET_PAIRS_15: ResPath("audio/%s/80.mp3"),

	SEQUENCE_TRIPLETS: ResPath("audio/%s/92.mp3"),
	SEQUENCE_TRIPLETS_CARDS: ResPath("audio/%s/93.mp3"),

	ALERTOR_2_1: ResPath("audio/%s/94.mp3"),
	ALERTOR_2_2: ResPath("audio/%s/96.mp3"),
	ALERTOR_1: ResPath("audio/%s/95.mp3"),

	NO_AFFORD_1: ResPath("audio/%s/97.mp3"),
	NO_AFFORD_2: ResPath("audio/%s/98.mp3"),
	NO_AFFORD_3: ResPath("audio/%s/99.mp3"),
	NO_AFFORD_4: ResPath("audio/%s/100.mp3"),

	AFFORD_1: ResPath("audio/%s/101.mp3"),
	AFFORD_2: ResPath("audio/%s/102.mp3"),
	AFFORD_3: ResPath("audio/%s/103.mp3"),

	CALL: ResPath("audio/%s/104.mp3"),
	GRAB: ResPath("audio/%s/105.mp3"),
	GRAB_ME: ResPath("audio/%s/106.mp3"),
	NO_CALL: ResPath("audio/%s/107.mp3"),
	NO_GRAB: ResPath("audio/%s/108.mp3"),

	DOUBLE: ResPath("audio/%s/109.mp3"),
	DOUBLE_SUPER: ResPath("audio/%s/110.mp3"),
	NO_DOUBLE: ResPath("audio/%s/111.mp3"),

	SPRING: ResPath("audio/%s/112.mp3"),
	ANTI_SPRING: ResPath("audio/%s/113.mp3"),
	SPRINGED: ResPath("audio/%s/114.mp3"),

	BASE_CARD_1: ResPath("audio/%s/115.mp3"),
	BASE_CARD_2: ResPath("audio/%s/116.mp3"),
	BASE_CARD_3: ResPath("audio/%s/117.mp3"),

	CALL_ONE_1: ResPath("audio/%s/118.mp3"),
	CALL_ONE_2: ResPath("audio/%s/119.mp3"),
	CALL_ONE_3: ResPath("audio/%s/121.mp3"),
	CALL_ONE_4: ResPath("audio/%s/120.mp3"),

	CALL_TWO_1: ResPath("audio/%s/122.mp3"),
	CALL_TWO_2: ResPath("audio/%s/123.mp3"),

	CALL_THREE_1: ResPath("audio/%s/124.mp3"),//3分
	CALL_THREE_2: ResPath("audio/%s/126.mp3"),//3分，不给你们机会
	CALL_THREE_3: ResPath("audio/%s/125.mp3"),//3分抄底

	CALLED_ONE: ResPath("audio/%s/127.mp3"),
	CALLED_TWO: ResPath("audio/%s/128.mp3"),

	PROMOTION_DANGER: ResPath("audio/women/129.mp3"),

	PROMOTION_1: ResPath("audio/women/130.mp3"),
	PROMOTION_2: ResPath("audio/women/131.mp3"),
	PROMOTION_3: ResPath("audio/women/132.mp3"),

	PROMOTION_4: ResPath("audio/women/133.mp3"),
	PROMOTION_5: ResPath("audio/women/134.mp3"),

	PROMOTION_6: ResPath("audio/women/135.mp3"),
	PROMOTION_7: ResPath("audio/women/136.mp3"),

	MATCH_LOSE_1: ResPath("audio/women/137.mp3"),
	MATCH_LOSE_2: ResPath("audio/women/138.mp3"),

	MATCH_REWARD_1: ResPath("audio/women/139.mp3"),
	MATCH_REWARD_2: ResPath("audio/women/140.mp3"),

	MATCH_WIN_1: ResPath("audio/women/141.mp3"),
	MATCH_WIN_2: ResPath("audio/women/142.mp3"),

	EFFECT_CARD: ResPath("audio/sendcard.mp3"),
	EFFECT_CLOCK: ResPath("audio/clock.mp3"),
	EFFECT_WIN: ResPath("audio/win.mp3"),
	EFFECT_LOSE: ResPath("audio/lose.mp3"),
	EFFECT_BOMB: ResPath("audio/bomb.mp3"),
	EFFECT_ROCKET: ResPath("audio/rocket.mp3"),
	EFFECT_PLANE: ResPath("audio/plane.mp3"),
	EFFECT_SEQUENCE: ResPath("audio/sequence.mp3"),
	EFFECT_SPRING: ResPath("audio/spring.mp3"),
	EFFECT_SHUTCARD: ResPath("audio/shutcard.mp3"),

	EFFECT_DISCARD: ResPath("audio/effect_discard.mp3"),





	BLESS_COME: ResPath("audio/bless_come.mp3"),						//红包来了
	BLESS_OPEN: ResPath("audio/bless_open.mp3"),						//福袋打开

	FUKA: ResPath("audio/effect_fuka.mp3"),								//福卡音效
	MULTIPLY: ResPath("audio/effect_multiply.mp3"),

	MATCH_BGN: ResPath("audio/match/match_bgn.mp3"),						//比赛开始
	MATCH_LOSE: ResPath("audio/match/match_lose.mp3"),						//比赛失败
	MATCH_OUT: ResPath("audio/match/match_out.mp3"),						//比赛淘汰
	MATCH_PROMOTION: ResPath("audio/match/match_promotion.mp3"),			//比赛晋级
	MATCH_REVIEVE: ResPath("audio/match/match_revieve.mp3"),				//比赛复活
	MATCH_REWARD: ResPath("audio/match/match_reward.mp3"),					//比赛奖励
	MATCH_WIN: ResPath("audio/match/match_win.mp3"),						//比赛胜利

	SEND_DUMP: ResPath("audio/sendcardDump.mp3"),							//按堆发牌音效
	SORT_CARD: ResPath("audio/sortcard.mp3"),								//理牌音效
};

export default audioPaths;