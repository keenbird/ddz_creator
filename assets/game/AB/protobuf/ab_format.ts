import { BYTE, bool, sfloat, sint, sint64, slong, sshort, stchar, stcharend, uchar, uchars, uint, uint64, ulong, ushort, ushortlen, schar } from "../../../app/config/NetConfig"

enum game_ab_cmd {
	MSG_BET_C = 1,
	MSG_BACK_C = 2,
	MSG_SYNCDATA_C = 3,
	MSG_GAMESCENE_S = 101,
	MSG_FREE_S = 102,
	MSG_START_S = 103,
	MSG_BET_PART2_S = 104,
	MSG_BET_S = 105,
	MSG_END_S = 106,
	MSG_TIPS_S = 107,
	MSG_RECONNECT_S = 110,
	MSG_PLAYER_STATUS_S = 111,
}

const root = {
	game_ab: {
		CMD: game_ab_cmd,
		
		MSG_BET_C: [
			[uchar, "nJettonArea"],
			[sint64, "nJettonScore"]
		],
		
		MSG_BACK_C: [
		],
		
		MSG_SYNCDATA_C: [
		],
		
		GameConfig: [
			[sint, "nChipScore", 7],
			[sint64, "nUserMaxJettonScore",],
			[sint64, "nMaxJettonScore",],
			[ushort, "wABOdds", 2],
			[ushort, "wP1OddsPercent",],
		],
		
		MSG_GAMESCENE_S: [
			[sint, "nLeaveTime"]
		],
		
		MSG_FREE_S: [
			[sint, "nLeaveTime"],
			["GameConfig", "gameConfig"]
		],
		
		MSG_START_S: [
			[sint, "nLeaveTime"],
			[uchar, "uCard"],
		],
		
		MSG_BET_PART2_S: [
			[sint, "nLeaveTime"],
			[uchar, "uCards", 2]
		],
		
		MSG_BET_S: [
			[ushort, "nChairID"],
			[uchar, "nJettonArea"],
			[sint64, "nJettonScore"]
		],
		
		MSG_END_S: [
			[sint, "nLeaveTime"],
			[sint64, "nUserWinScore", 2],
			[sint64, "nSitUserWinScore", 10],
			[sint64, "nAllJettonScore", 2],
			[ushort, "nJettonArea"],
			[uchar, "nCount"],
			[uchar, "uCards", "nCount"]
		],
		
		MSG_TIPS_S: [
			[uchar, "nTipsID"],
		],
		
		MSG_RECONNECT_S: [
			[uchar, "nGameState"],
			[sint, "nLeaveTime"],
			[sint64, "nAllJettonScore", 2],
			[sint64, "nSitUserWinScore", 10],
			[sint64, "nSitUserJettonScore", 10],
			[uchar, "btSitUserState", 5],
			[uchar, "nJettonArea"],
			[uchar, "uCardCounts"],
			[uchar, "uCardData", "uCardCounts"],
		],
		
		MSG_PLAYER_STATUS_S: [
			[ushort, "nChairID"],
			[uchar, "ucCurState"]
		],
		
		GameRule: [
			[ushort, "nLen"],
			[uchar, "cmd"],
			[sint, "nChipScore", 7],
			[sint64, "nUserMaxJettonScore",],
			[sint64, "nMaxJettonScore",],
			[ushort, "wABOdds", 2],
			[ushort, "wP1OddsPercent",],
		],
		
		GameReconnectRoom: [
			[ushort, "nLen"],
			[uchar, "cmd"],
			[uchar, "nGameState"],
			[sint, "nLeaveTime"],
			[sint64, "nAllJettonScore", 2],
			[sint64, "nSitUserWinScore", 10],
			[sint64, "nSitUserJettonScore", 10],
			[uchar, "btSitUserState", 5],
			[uchar, "nJettonArea"],
			[uchar, "uCardCounts"],
			[uchar, "uCardData", "uCardCounts"],
		],
	},
}

declare namespace proto {
	export namespace game_ab {
		export enum CMD {
			MSG_BET_C = 1,
			MSG_BACK_C = 2,
			MSG_SYNCDATA_C = 3,
			MSG_GAMESCENE_S = 101,
			MSG_FREE_S = 102,
			MSG_START_S = 103,
			MSG_BET_PART2_S = 104,
			MSG_BET_S = 105,
			MSG_END_S = 106,
			MSG_TIPS_S = 107,
			MSG_RECONNECT_S = 110,
			MSG_PLAYER_STATUS_S = 111,
		}

		interface IMSG_BET_C {
			nJettonArea?: number
			nJettonScore?: number
		}
		export var MSG_BET_C: any[]

		interface IMSG_BACK_C {
		}
		export var MSG_BACK_C: any[]

		interface IMSG_SYNCDATA_C {
		}
		export var MSG_SYNCDATA_C: any[]

		interface IGameConfig {
			nChipScore?: number[]
			nUserMaxJettonScore?: number
			nMaxJettonScore?: number
			wABOdds?: number[]
			wP1OddsPercent?: number
		}
		export var GameConfig: any[]

		interface IMSG_GAMESCENE_S {
			nLeaveTime?: number
		}
		export var MSG_GAMESCENE_S: any[]

		interface IMSG_FREE_S {
			nLeaveTime?: number
			gameConfig?: proto.game_ab.IGameConfig
		}
		export var MSG_FREE_S: any[]

		interface IMSG_START_S {
			nLeaveTime?: number
			uCard?: number
		}
		export var MSG_START_S: any[]

		interface IMSG_BET_PART2_S {
			nLeaveTime?: number
			uCards?: number[]
		}
		export var MSG_BET_PART2_S: any[]

		interface IMSG_BET_S {
			nChairID?: number
			nJettonArea?: number
			nJettonScore?: number
		}
		export var MSG_BET_S: any[]

		interface IMSG_END_S {
			nLeaveTime?: number
			nUserWinScore?: number[]
			nSitUserWinScore?: number[]
			nAllJettonScore?: number[]
			nJettonArea?: number
			nCount?: number
			uCards?: number[]
		}
		export var MSG_END_S: any[]

		interface IMSG_TIPS_S {
			nTipsID?: number
		}
		export var MSG_TIPS_S: any[]

		interface IMSG_RECONNECT_S {
			nGameState?: number
			nLeaveTime?: number
			nAllJettonScore?: number[]
			nSitUserWinScore?: number[]
			nSitUserJettonScore?: number[]
			btSitUserState?: number[]
			nJettonArea?: number
			uCardCounts?: number
			uCardData?: number[]
		}
		export var MSG_RECONNECT_S: any[]

		interface IMSG_PLAYER_STATUS_S {
			nChairID?: number
			ucCurState?: number
		}
		export var MSG_PLAYER_STATUS_S: any[]

		interface IGameRule {
			nLen?: number
			cmd?: number
			nChipScore?: number[]
			nUserMaxJettonScore?: number
			nMaxJettonScore?: number
			wABOdds?: number[]
			wP1OddsPercent?: number
		}
		export var GameRule: any[]

		interface IGameReconnectRoom {
			nLen?: number
			cmd?: number
			nGameState?: number
			nLeaveTime?: number
			nAllJettonScore?: number[]
			nSitUserWinScore?: number[]
			nSitUserJettonScore?: number[]
			btSitUserState?: number[]
			nJettonArea?: number
			uCardCounts?: number
			uCardData?: number[]
		}
		export var GameReconnectRoom: any[]
	}
}

const proto = root
export default proto