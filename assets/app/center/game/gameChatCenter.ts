import { _decorator } from 'cc';
const { ccclass } = _decorator;

import proto from '../common';
import { EVENT_ID } from '../../config/EventConfig';
import { GS_GAME_MSGID } from '../../config/NetConfig';
import { GameServerMainInetMsg } from '../../framework/network/awBuf/MainInetMsg';

@ccclass('GameChatCenter')
export class GameChatCenter extends GameServerMainInetMsg {
    /**命令ID */
    // cmd = proto.game_chat.GS_GAME_CHAT_MSG;
    m_lastTime: number = 0;
    initData() {
        this.initMainID(GS_GAME_MSGID.GS_GAME_MSGID_CHAT);
    }
    // initRegister() {
    //     //房间聊天
    //     this.bindMessage({
    //         struct: proto.game_chat.chat_room_cs,
    //         cmd: this.cmd.GAME_CHAT_ROOM,
    //         callback: this.OnRecv_GameChatRoom.bind(this),
    //     });
    //     //私聊
    //     this.bindMessage({
    //         struct: proto.game_chat.chat_private_cs,
    //         cmd: this.cmd.GAME_CHAT_PRIVATE,
    //         callback: this.OnRecv_GameChatPrivate.bind(this),
    //     });
    //     //游戏桌内聊天
    //     this.bindMessage({
    //         struct: proto.game_chat.chat_table_cs,
    //         cmd: this.cmd.GAME_CHAT_TABLE,
    //         callback: this.OnRecv_GameChatTable.bind(this),
    //     });
    //     //游戏桌内聊天
    //     this.bindMessage({
    //         struct: proto.game_chat.chat_room_phrases_cs,
    //         cmd: this.cmd.GAME_CHAT_ROOMPHRASES,
    //         callback: this.OnRecv_GameChatRoomPhrases.bind(this),
    //     });
    //     //游戏内聊天短语
    //     this.bindMessage({
    //         struct: proto.game_chat.chat_game_phrases_cs,
    //         cmd: this.cmd.GAME_CHAT_GAMEPHRASES,
    //         callback: this.OnRecv_GameChatGamePhrases.bind(this),
    //     });
    //     //系统消息
    //     this.bindMessage({
    //         struct: proto.game_chat.chat_system_s,
    //         cmd: this.cmd.GAME_CHAT_SYSTEM,
    //         callback: this.OnRecv_GameChatSystem.bind(this),
    //     });
    // }
    /**房间聊天 */
    OnRecv_GameChatRoom(data: proto.game_chat.Ichat_room_cs) {
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAY_CHAT_ROOM,
            data: data.buff
        });
    }
    /**私聊 */
    OnRecv_GameChatPrivate(data: proto.game_chat.Ichat_private_cs) {
        //别的玩家对自己私聊
        if (center.login.getUserDBID() == data.recv_user_id) {
            app.event.dispatchEvent({
                eventName: EVENT_ID.EVENT_PLAY_CHAT_PRIVATE,
                data: data.buff
            });
        }
    }
    /**游戏桌内聊天 */
    OnRecv_GameChatTable(data: proto.game_chat.Ichat_table_cs) {
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAY_CHAT_TABLE,
            data: data
        });
    }
    /**房间内聊天短语 */
    OnRecv_GameChatRoomPhrases(data: proto.game_chat.Ichat_room_phrases_cs) {
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAY_CHAT_ROOMPHRASES,
            data: data.index
        });
    }
    /**游戏内聊天短语 */
    OnRecv_GameChatGamePhrases(data: proto.game_chat.Ichat_game_phrases_cs) {
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAY_CHAT_GAMEPHRASES,
            data: data,
        });
    }
    /**系统消息 */
    OnRecv_GameChatSystem(data: proto.game_chat.Ichat_system_s) {
        app.event.dispatchEvent({
            eventName: EVENT_ID.EVENT_PLAY_CHAT_SYSTEM,
            data: data.buffer,
        });
    }
    /**发送游戏内聊天短语 */
    send_GAME_CHAT_GAMEPHRASES(data: proto.game_chat.Ichat_game_phrases_cs) {
        let curTime = app.func.time();
        if (curTime - this.m_lastTime <= 1) {
            app.popup.showToast("You sent too fast");
            return
        }
        this.m_lastTime = curTime;
        let sendData = proto.game_chat.chat_game_phrases_cs.create();
        sendData.user_id = data.user_id;
        sendData.index = data.index;
        sendData.type = data.type;
        this.sendData(this.cmd.GAME_CHAT_GAMEPHRASES, sendData);
    }
}

declare global {
    namespace globalThis {
        type ChatParam = proto.game_chat.Ichat_game_phrases_cs
    }
}