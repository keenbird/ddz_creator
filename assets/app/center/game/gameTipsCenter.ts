import { _decorator } from 'cc';
const { ccclass } = _decorator;

import proto from '../common';
import { GS_GAME_MSGID } from '../../config/NetConfig';
import { ERRID, ERRID_MSG } from '../../config/ConstantConfig';
import { GameServerMainInetMsg } from '../../framework/network/awBuf/MainInetMsg';

@ccclass('GameTipsCenter')
export class GameTipsCenter extends GameServerMainInetMsg {
    /**命令ID */
    // cmd = proto.game_tips.GS_TIPS_MSG;
    initData() {
        // this.initMainID(GS_GAME_MSGID.GS_GAME_MSGID_TIPS);
    }
    // initRegister() {
    //     //提示
    //     this.bindMessage({
    //         struct: proto.game_tips.game_tips_s,
    //         cmd: this.cmd.GAME_TIPS_MSG,
    //         callback: this.OnRecv_Tips.bind(this),
    //     });
    // }
    //提示
    OnRecv_Tips(data: proto.game_tips.Igame_tips_s) {
        let tips = data.tips
        let msg = tips == "" ? ERRID_MSG.get(data.type) : tips;
        if (msg) {
            msg = msg;
        } else {
            msg = "UNKOWN ERROR";
        }
        switch (data.type) {
            case ERRID.STOP_SERVER:
            case ERRID.GAME_DROP_KICK:
            case ERRID.GAME_KICK_NOPLAY:
            case ERRID.GAME_KICK_RECHARGE:
            case ERRID.GAME_KICK_HAND_TIMEOUT:
                fw.print(`服务器踢人`);
                app.gameManager.exitGame(true,{
                    callback: () => {
                        app.popup.showTip({ text: msg })
                    }
                });
                return;
            case ERRID.STOP_PRETREATMENT:
                app.popup.closeLoading();
                let str = fw.language.getString("<color=#8e4936>This game will undergo maintenance at <color=#f93b21>${STOP_TIME}</color>. You can play other games during this time.</color>",{
                    STOP_TIME:app.func.time_HM(msg)
                })
                app.gameManager.exitGame(true,{
                    callback: () => {
                        app.popup.showTip({ text: str, data: {directShow: true} });
                    }
                });
                return;
            default:
                app.popup.showToast(msg)
                break;
        }
    }
}