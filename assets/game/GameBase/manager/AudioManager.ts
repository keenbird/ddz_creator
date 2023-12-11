import { isValid } from "cc";
import { FWAudioSourceCtrl } from "../../../app/framework/manager/FWAudioManager";

export interface IAudioConfig {
    strPath: string;//预设路径
    intervalTime?: number;//间隔时间
}

export interface IAudioData {
    [index: string]: any;
    callback?: () => void;
}

export class AudioManager<T = any> extends (fw.FWComponent) {
    id: T
    private config: Map<number, IAudioConfig>
    private mAudioPrePlayTime: Map<number, number>;
    private mAudioCtrl: Map<number, FWAudioSourceCtrl>;
    // private audioID: number;

    init(id: T, config: Map<number, IAudioConfig>) {
        this.id = id
        this.config = config
        this.mAudioPrePlayTime = new Map();
        this.mAudioCtrl = new Map();
        // this.audioID = 0
        return this
    }

    playBGMusic(audioID: number, loop = true) {
        app.audio.playMusic(app.gameManager.getRes(this.config.get(audioID).strPath), loop);
    }

    stopPlayBGMusic() {
        app.audio.stopMusic();
    }

    playMusicEffect(audioID: number, volumeScale?: number) {
        let config = this.config.get(audioID);
        let curTime = app.func.time(true);
        if (config.intervalTime) {
            let preTime = this.mAudioPrePlayTime.get(audioID);
            if (preTime && curTime - preTime < config.intervalTime) {
                return;
            }
        }
        this.mAudioPrePlayTime.set(audioID, curTime);
        app.audio.playEffect(app.gameManager.getRes(config.strPath), { volumeScale: volumeScale });
    }

    playMusicEffectSpecial(audioID: number, loop?: boolean, volumeScale?: number) {
        let config = this.config.get(audioID);
        let curTime = app.func.time(true);
        if (config.intervalTime) {
            let preTime = this.mAudioPrePlayTime.get(audioID);
            if (preTime && curTime - preTime < config.intervalTime) {
                return;
            }
        }
        let ctrl = app.audio.playEffectSpecial(app.gameManager.getRes(config.strPath), loop, volumeScale);
        this.mAudioCtrl.set(audioID, ctrl);
    }

    stopAllMusicAndSound() {
        app.audio.stopAll();
        for (const v of this.mAudioCtrl.values()) {
            if (isValid(v, true)) {
                v.destroy()
            }
        }
        this.mAudioCtrl.clear()
    }

    pasueAllMusicAndSound() {
        app.audio.pauseMusic();
    }

    resumeAllMusicAndSound() {
        app.audio.resumMusic();
    }

    stopMusicEffectSpecial(audioID: number) {
        let ctrl = this.mAudioCtrl.get(audioID)
        if (ctrl) {
            this.mAudioCtrl.delete(audioID)
            if (isValid(ctrl, true)) {
                ctrl.destroy()
            }
        }
    }

    isHasMusicEffectSpecial(audioID: number) {
        return this.mAudioCtrl.get(audioID) != undefined
    }

    onViewDestroy() {
        super.onViewDestroy()
        this.stopAllMusicAndSound()
    }
}