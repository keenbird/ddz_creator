import { ByteStream } from "../framework/network/lib/NetInterface";

// 请求对象
export class GS_Head {
    wMsgLen: number;  //代理使用的头码信息
    wBodyLen: number;  //代理使用的头码信息
    wVersion: number;  //消息头版本号
    MainID: number;  //主消息码
    SubID: number;  //子消息码
    uRoomSvrId: number;  //玩家uid
}

export class GS_HeadNull extends GS_Head {
    private _byteStream = new ByteStream();
    initByteStream(buffers: ByteStream) {
        this.wMsgLen = buffers.readSInt16();
        this.wVersion = buffers.readSInt16();
        this.uRoomSvrId = buffers.readSInt32();
        this.MainID = buffers.readSInt16();
        this.SubID = buffers.readSInt16();
        this.wBodyLen = buffers.readSInt32();
    }
    initArrayBuffer(buffers: ArrayBuffer) {
        this._byteStream.setBuffers(buffers);
        this.initByteStream(this._byteStream);
    }
}

export const S_GS_HeadNull = new GS_HeadNull()

export const GS_HeadNull_Size = 16;
export const MAX_NET_PACKAGE_SIZE = 65535 - 8; //65535 uShort最大长度  -8作为缓冲区

export enum Root_cmd {
    CMDROOT_GATEWAY_MSG = 0, //代理前端消息
    CMDROOT_LOGIN_MSG = 1, //登录服务器消息
    CMDROOT_PLAZA_MSG = 2, //广场消息
    CMDROOT_GAMESERVER_MSG = 3, //游戏服务器消息
    CMDROOT_WEB_MSG = 4, //WEB服务器消息
}

export enum GS_PLAZA_MSGID {
    GS_PLAZA_MSGID_TIPS = 0, //提示 s->c
    GS_PLAZA_MSGID_LOGIN = 1, //登录 c->s->c
    GS_PLAZA_MSGID_ACTOR = 2, //玩家 s->c
    GS_PLAZA_MSGID_CHAT = 3, //聊天 c->s->c
    GS_PLAZA_MSGID_CONTAINER = 4, //容器 s->c
    GS_PLAZA_MSGID_TASK = 5, //任务 c->s->c
    GS_PLAZA_MSGID_SIGN = 6, //签到 c->s->c
    GS_PLAZA_MSGID_RELATION = 7, //社交 c->s->c
    GS_PLAZA_MSGID_MALL = 8, //商城 c->s->c
    GS_PLAZA_MSGID_GIFTBAG = 9, //礼包 c->s->c 
    GS_PLAZA_MSGID_EXCHANGE = 10, //兑换 c->s->c
    GS_PLAZA_MSGID_EMAIL = 11, //邮件 c->s->c
    GS_PLAZA_MSGID_GOODS = 12, //物品 c->s->c
    GS_PLAZA_MSGID_ROOM = 13, //房间 c->s->c
    GS_PLAZA_MSGID_PACKET = 14, //背包 c->s->c
    GS_PLAZA_MSGID_REDPACKET = 15, //红包广场 c->s->c
    GS_PLAZA_MSGID_RANKING = 16, //排行榜 c->s->c
    GS_PLAZA_MSGID_LUCKYGOLD = 17, //招财金牛 c->s->c
    GS_PLAZA_MSGID_LUCKYDRAW = 18, //幸运大抽奖 c->s->c
    GS_PLAZA_MSGID_STATUS = 19, //状态 c->s->c
    GS_PLAZA_MSGID_WORLDLOTTERY = 20, //世界彩池 s->c
    //GS_PLAZA_MSGID_EXTENSIONSYSTEM = 21, //推广员 c->s->c
    GS_PLAZA_MSGID_JACKPOTDRAW = 21, //推广员 c->s->c
    GS_PLAZA_MSGID_HAPPYSEVEN = 22, //七天乐 c->s->c
    GS_PLAZA_MSGID_SUPERVIP = 23, //至尊VIP c->s->c
    GS_PLAZA_MSGID_SEVENSIGN = 24, //七天签到 c->s->c
    GS_PLAZA_MSGID_PRIVATEROOM = 25, //私人房 c->s->c
    GS_PLAZA_MSGID_LUCK_CARD = 27, //幸运卡
    GS_PLAZA_MSGID_TASKACTIVE = 29, //活动任务
    GS_PLAZA_MSGID_SHARE = 30, //分享赚钱
    // GS_PLAZA_MSGID_ROLLTHEDICE = 31, //黄金大色子
    GS_PLAZA_MSGID_NEWPEOPLE_TASK = 32, //七日福利任务
    GS_PLAZA_MSGID_ONEBRINGSTENTHOUSAND = 33, //一本万利 c->s->c
    GS_PLAZA_MSGID_SAVINGPOT = 34, //存钱罐 c->s->c
    GS_PLAZA_MSGID_MATCH_MSG = 35, //比赛房
    GS_PLAZA_MSGID_TIMETOGETLUCK = 36, //时来运转
    GS_PLAZA_MSGID_NEWEXTEND = 37, //东北分享
    // GS_PLAZA_ENDGAME_MSG = 38, //残局
    GS_PLAZA_MSGID_USERDATATRANSFER = 39, //数据转移
    GS_PLAZA_MSGID_SMALLFUNCTION = 40, //小功能插件
    GS_PLAZA_MSGID_RESOURCESYSTEM = 41, //资源系统插件
    GS_PLAZA_MSGID_GUESSNUMBERGAME = 42, //猜数字游戏
    GS_PLAZA_MSGID_LUCKYPATTIGAME = 43, //Lucky3Patti小游戏
    GS_PLAZA_MSGID_SCRATCHCARD = 44, //刮刮卡 （30-cards）
    GS_PLAZA_MSGID_IPLMATCH = 45, //IPLMatch
}

export enum GS_GATEWAY_MSGID {
    GS_GATEWAY_MSGID_COMMAND = 0,
    GS_GATEWAY_MSGID_P2P = 1,
}

export enum GS_LOGIN_MSGID {
    GS_LOGIN_MSGID_LOGIN = 0,
}

export enum GS_GAME_MSGID {
    GS_GAME_MSGID_ROOM = 0, //房间 c->s->c	
    GS_GAME_MSGID_TIPS = 1, //提示 s->c
    GS_GAME_MSGID_LOGIN = 2, //登录 c->s->c		
    GS_GAME_MSGID_ACTOR = 3, //玩家 s->c
    GS_GAME_MSGID_CHAT = 4, //聊天 c->s->c	
    GS_GAME_MSGID_LUA = 5, //LUA c->s	
    GS_GAME_MSGID_MATCH = 6, //比赛 c->s->c
    GS_GAME_MSGID_SMGAME = 7, //小游戏 c->s->c
    GS_GAME_MSGID_MATCH_DALI = 8, //大奖赛 c->s->c
}

let eInetSInt8 = 0
let eInetUInt8 = 1
let eInetSInt16 = 2
let eInetUInt16 = 3
let eInetSInt32 = 4
let eInetUInt32 = 5
let eInetSInt64 = 6
let eInetUInt64 = 7
let eInetBool = 8
let eInetFloat = 9
let eInetDouble = 10
let eInetString = 11
let eInetWString = 12

export const uchar = eInetUInt8
export const schar = eInetSInt8
export const sint64 = eInetSInt64
export const slong = eInetSInt32
export const ulong = eInetUInt32
export const ushort = eInetUInt16
export const uint64 = eInetUInt64
export const sshort = eInetSInt16
export const sint = eInetSInt32
export const uint = eInetUInt32
export const bool = eInetBool
export const sfloat = eInetFloat
export const ushortlen = eInetUInt16
export const uchars = eInetString
export const stcharend = eInetWString
export const stchar = eInetWString
export const BYTE = eInetUInt8
