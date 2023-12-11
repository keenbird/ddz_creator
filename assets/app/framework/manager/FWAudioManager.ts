
import { _decorator, Node as ccNode, AudioSource, AudioClip, clamp01, isValid } from 'cc';
const { ccclass } = _decorator;

export class FWAudioSource extends AudioSource {
    /**enabled时是否自动播放 */
    _playOnAwake: boolean = false
    /**当前资源 */
    _bundleResConfig: BundleResConfig
    /**直接认为播放完成 */
    clean() {
        this.stop();
        this.node.emit(AudioSource.EventType.ENDED, this);
    }
}

@ccclass('FWAudioManager')
export class FWAudioManager extends (fw.FWComponent) {
    /**音效资源未加载时也可以对FWAudioSource进行操作，引擎底层会记录，加载好后统一处理 */
    /**音效AudioSource */
    private _effectAudioSource: FWAudioSource
    /**音乐AudioSource */
    private _musicAudioSource: FWAudioSource
    /**当前背景音乐路径 */
    private _musicPath: string = ``
    private _defMusic: BundleResConfig;
    /**音效对象池 */
    private _effectNode: ccNode
    private _validEffectAS: FWAudioSource[] = []
    private _invalidEffectAS: FWAudioSource[] = []
    private _invalidEffectASVip: FWAudioSource[] = []
    /**单帧中是否到达播放上限，减1的目的是给背景音乐预留  */
    private _nFrameMax: number = FWAudioSource.maxAudioChannel - 1
    private _bFrameMax: boolean = false
    private _nFrameCur: number = 0
    /**音效缓存 */
    private _audioCache: { [bundleName: string]: { [audioPath: string]: AudioClip } } = {}
    //初始化
    initData() {
        //effect node
        this._effectNode = new ccNode();
        this.node.addChild(this._effectNode);
        this._effectNode.on(AudioSource.EventType.ENDED, (tempAS: FWAudioSource) => {
            let index: number;
            index = this._invalidEffectAS.indexOf(tempAS);
            index != -1 && this._invalidEffectAS.splice(index, 1);
            index = this._invalidEffectASVip.indexOf(tempAS);
            index != -1 && this._invalidEffectASVip.splice(index, 1);
            this._validEffectAS.push(tempAS);
        });
        //音乐AudioSource
        this._musicAudioSource = this.node.addComponent(FWAudioSource);
        //音效AudioSource
        this._effectAudioSource = this.node.addComponent(FWAudioSource);
        //调整当前音量
        this.setMusicVolume(app.file.getFloatForKey(`MusicVolume`, 1, { all: true }));
        this.setEffectVolume(app.file.getFloatForKey(`EffectVolume`, 1, { all: true }));
        //调整开关
        this.setMusicSwitch(app.file.getBooleanForKey(`MusicSwitch`, true, { all: true }));
        this.setEffectSwitch(app.file.getBooleanForKey(`EffectSwitch`, true, { all: true }));
    }
    /*设置默认音乐*/
    setDefMusic(clip: BundleResConfig) {
        this._defMusic = clip;
    }
    /**播放音乐，音效资源未加载时也可以对FWAudioSource进行操作，引擎底层会记录，加载好后统一处理 */
    playMusic(clip?: BundleResConfig, loop: boolean = true) {
        clip = clip ?? this._defMusic
        //记录当前音乐
        let tempMusicPath = `${clip.all}`;
        //加载资源
        if (this._musicPath != tempMusicPath) {
            //缓存Music路径
            this._musicPath = tempMusicPath;
            this.loadBundleRes(clip, AudioClip, (res: AudioClip) => {
                //资源是否变更
                if (this._musicPath != tempMusicPath) {
                    return;
                }
                //停掉原先的
                this._musicAudioSource.stop();
                //调整背景音乐
                this._musicAudioSource.clip = res;
                //设置循环
                this._musicAudioSource.loop = loop;
                //是否正在播放
                this.resumMusic();
            });
        } else {
            //是否正在播放
            this.resumMusic();
        }
    }
    /**设置音乐开关 */
    setMusicSwitch(musicSwitch: boolean) {
        this._musicAudioSource.enabled = musicSwitch;
        app.file.setBooleanForKey(`MusicSwitch`, this._musicAudioSource.enabled, { all: true });
    }
    /**设置音乐音量，范围0-1 */
    setMusicVolume(flag: number) {
        this._musicAudioSource.volume = clamp01(flag);
        app.file.setFloatForKey(`MusicVolume`, this._musicAudioSource.volume, { all: true });
    }
    /**获取音效开光 */
    getMusicSwitch(): boolean {
        return this._musicAudioSource.enabled;
    }
    /**获取音乐音量 */
    getMusicVolume(): number {
        return this._musicAudioSource.volume;
    }
    /**暂停音乐 */
    pauseMusic(bFadeOut?: boolean, nFadeOutTime?: number) {
        //清理计时器
        (<any>this.node).clearScrollTimer?.();
        if (this.getMusicSwitch() && this._musicAudioSource.playing) {
            if (bFadeOut) {
                const nVolume = this.getMusicVolume();
                app.func.scrollNumber({
                    node: this.node,
                    nTime: nFadeOutTime ?? 1.0,
                    nCount: 30,
                    began: nVolume,
                    end: 0,
                    format: (nValue: number) => {
                        this._musicAudioSource.volume = clamp01(nValue);
                    },
                    callback: () => {
                        this._musicAudioSource.pause();
                        this._musicAudioSource.volume = clamp01(nVolume);
                    },
                });
            } else {
                this._musicAudioSource.pause();
            }
        }
    }
    /**恢复音乐 */
    resumMusic(bFadeIn?: boolean, nFadeOutTime?: number) {
        //清理计时器
        (<any>this.node).clearScrollTimer?.();
        this.setMusicVolume(app.file.getFloatForKey(`MusicVolume`, this._musicAudioSource.volume, { all: true }));
        if (this.getMusicSwitch() && !this._musicAudioSource.playing) {
            if (bFadeIn) {
                const nVolume = this.getMusicVolume();
                app.func.scrollNumber({
                    node: this.node,
                    nTime: nFadeOutTime ?? 1.0,
                    nCount: 30,
                    began: 0,
                    end: nVolume,
                    format: (nValue: number) => {
                        this._musicAudioSource.volume = clamp01(nValue);
                    },
                });
            } else {
                this._musicAudioSource.play();
            }
        }
    }
    /**关闭音乐 */
    stopMusic() {
        this._musicAudioSource.playing && this._musicAudioSource.stop();
    }
    /**获取有效的FWAudioSource */
    getValidAudioResource(data: PlayEffectParam = {}): FWAudioSource {
        let tempAS = this._validEffectAS.pop();
        if (!tempAS) {
            if (this._invalidEffectAS.length < (this._nFrameMax - this._invalidEffectASVip.length)) {
                tempAS = this._effectNode?.addComponent(FWAudioSource);
            } else {
                tempAS = this._invalidEffectAS.shift();
            }
        }
        if (tempAS) {
            //先暂停，避免旧音效触发AudioSource.EventType.ENDED事件
            tempAS.stop();
            if (data.bVip) {
                this._invalidEffectASVip.push(tempAS);
            } else {
                this._invalidEffectAS.push(tempAS);
            }
        }
        return tempAS;
    }
    /**播放音效，音效资源未加载时也可以对FWAudioSource进行操作，引擎底层会记录，加载好后统一处理 */
    playEffect(bundleResConfig: BundleResConfig, data: PlayEffectParam = {}): FWAudioSource | null {
        if (!this._effectAudioSource.enabled
            || !this._effectAudioSource.volume
            || this._bFrameMax
            || !bundleResConfig) {
            return;
        }
        //单帧处理数量自增
        this._bFrameMax = ++this._nFrameCur >= (this._nFrameMax - this._invalidEffectASVip.length);
        let tempAS = this.getValidAudioResource(data);
        if (!tempAS) {
            //回调
            data.callback && data.callback(null, data);
            //异常提示
            fw.printError(`playEffect error getValidAudioResource return null`);
            return;
        }
        tempAS._bundleResConfig = bundleResConfig;
        let cache = this._audioCache[bundleResConfig.bundleName] ??= {};
        let func = (clip: AudioClip) => {
            //缓存音效
            cache[bundleResConfig.path] = clip;
            //资源是否已经更换
            if (tempAS._bundleResConfig != bundleResConfig) {
                //回调
                data.callback && data.callback(null, data);
                //异常提示
                fw.printWarn(`playEffect warn audioResource is changed: ${bundleResConfig.all}`);
                return;
            }
            //调整音量
            tempAS.volume = this._effectAudioSource.volume * (data.volumeScale ?? 1);
            //是否循环
            tempAS.loop = false;
            //调整播放音频
            tempAS.clip = clip;
            //回调
            data.callback && data.callback(tempAS, data);
            //播放
            tempAS.play();
        }
        //是否缓存过该资源
        if (cache[bundleResConfig.path]) {
            func(cache[bundleResConfig.path]);
        } else {
            this.loadBundleRes(bundleResConfig, AudioClip, (clip: AudioClip) => {
                func(clip);
            }, {
                failCallback: () => {
                    //资源是否已经更换
                    if (tempAS._bundleResConfig != bundleResConfig) {
                        //回调
                        data.callback && data.callback(null, data);
                        //异常提示
                        fw.printWarn(`playEffect warn audioResource is changed: ${bundleResConfig.all}`);
                    }
                    //异常提示
                    fw.printError(`playEffect error loadBundleRes failed: ${bundleResConfig.all}`);
                }
            });
        }
        return tempAS;
    }
    /**清理音效缓存 */
    clearAudioCache(bundleResConfig?: BundleResConfig | string) {
        if (bundleResConfig) {
            this._audioCache[typeof (bundleResConfig) == `string` ? bundleResConfig : bundleResConfig.bundleName] = {};
        } else {
            this._audioCache = {};
        }
    }
    /**
     * 播放需要管理的特殊音效
     * @param clip {BundleResConfig} clip 音效路径
     * @param loop {Boolean} loop 是否循环播放
     * @param volume {Number} volume 播放音量
     * @returns 
     */
    playEffectSpecial(clip: BundleResConfig, loop: boolean = false, volume: number = 1) {
        if (!this._effectAudioSource.enabled || !this._effectAudioSource.volume) {
            return;
        }
        let ret = this.node.addComponent(FWAudioSourceCtrl);
        this.loadBundleRes(clip, AudioClip, (res: AudioClip) => {
            if (!fw.isValid(ret)) return;
            ret.playEffect(res, loop, volume * this._effectAudioSource.volume);
        });
        return ret;
    }
    /**设置音效开关 */
    setEffectSwitch(effectSwitch: boolean) {
        this._invalidEffectAS.forEach(element => {
            element.enabled = effectSwitch;
        });
        this._effectAudioSource.enabled = effectSwitch;
        app.file.setBooleanForKey(`EffectSwitch`, this._effectAudioSource.enabled, { all: true });
    }
    /**设置音效音量，范围0-1 */
    setEffectVolume(flag: number) {
        let volume = clamp01(flag);
        this._invalidEffectAS.forEach(element => {
            element.volume = volume;
        });
        this._effectAudioSource.volume = volume;
        app.file.setFloatForKey(`EffectVolume`, this._effectAudioSource.volume, { all: true });
    }
    /**获取音效开光 */
    getEffectSwitch(): boolean {
        return this._effectAudioSource.enabled;
    }
    /**获取音效音量 */
    getEffectVolume(): number {
        return this._effectAudioSource.volume;
    }
    /**关闭所有音效 */
    stopAllEffect(bClean: boolean = true) {
        this._invalidEffectAS.forEach(element => {
            bClean ? element.clean() : element.stop();
        });
        this._invalidEffectASVip.forEach(element => {
            bClean ? element.clean() : element.stop();
        });
    }
    /**关闭所有 */
    stopAll(bClean: boolean = true) {
        this.stopMusic();
        this.stopAllEffect(bClean);
    }
    /**每帧刷新 */
    update() {
        this._nFrameCur = 0;
        this._bFrameMax = false;
    }
    /**取消事件监听 */
    onViewExit() {
        if (isValid(this._effectNode)) {
            this._effectNode.off(AudioSource.EventType.ENDED);
        }
    }
}

export class AudioSourceEx extends AudioSource {
    ctrl: FWAudioSourceCtrl;
    bindAudioSourceCtrl(ctrl: FWAudioSourceCtrl) {
        this.ctrl = ctrl
    }
    onViewDestroy() {
        // 和控制类相互绑定一起销毁
        if (isValid(this.ctrl, true))
            this.ctrl.destroy();
    }
}

export class FWAudioSourceCtrl extends (fw.FWComponent) {
    //音乐AudioSource
    private _audioSource: AudioSourceEx;
    private _audioVolume: number;
    private _audioEnabled: boolean;
    onLoad() {
        super.onLoad()
        this._audioSource = this.node.addComponent(AudioSourceEx);
        this._audioSource.bindAudioSourceCtrl(this)
        this.node.on(AudioSource.EventType.STARTED, this.onAudioStarted, this);
        this.node.on(AudioSource.EventType.ENDED, this.onAudioEnded, this);
    }

    onAudioStarted(target) {
        if (this._audioSource != target) return;
    }

    onAudioEnded(target) {
        if (this._audioSource != target) return;
        if (isValid(this, true))
            this.destroy();
    }
    /**
     * @en
     * The volume of this audio source (0.0 to 1.0).<br>
     * Note: Volume control may be ineffective on some platforms.
     * @zh
     * 音频的音量（大小范围为 0.0 到 1.0）。<br>
     * 请注意，在某些平台上，音量控制可能不起效。<br>
     */
    set volume(val: number) {
        this._audioVolume = val;
        this.updateAudioVolume();
    }
    get volume(): number {
        return this._audioVolume;
    }
    /**
     * @en
     * Is the audio currently playing?
     * @zh
     * 当前音频是否正在播放？
     */
    get playing(): boolean {
        return this._audioSource.playing;
    }

    get audioEnabled(): boolean {
        return this._audioEnabled;
    }

    set audioEnabled(value: boolean) {
        this._audioEnabled = value;
        this.updateAudioEnabled();
    }

    playEffect(clip: AudioClip, loop: boolean = false, volume: number = 1) {
        //设置循环
        this._audioSource.loop = loop;
        this._audioSource.clip = clip;
        this.volume = volume;
        this._audioSource.play();
    }

    resumeEffect() {
        this._audioSource.play();
    }

    pauseEffect() {
        this._audioSource.pause();
    }

    stopEffect() {
        this._audioSource.stop();
    }

    updateAudioVolume() {
        this._audioSource.volume = this._audioVolume * app.audio.getEffectVolume();
    }

    updateAudioEnabled() {
        this._audioSource.enabled = this._audioEnabled && app.audio.getEffectSwitch();
    }

    onViewDestroy() {
        if (this._audioSource) {
            this._audioSource.stop();
            // 释放绑定
            if (isValid(this._audioSource, true))
                this._audioSource.destroy();
        }
    }
}

/**类型声明调整 */
declare global {
    namespace globalThis {
        type PlayEffectParam = {
            /**播放音量倍数 0 -> 1，最终播放的音量为 “audioSource.volume * volumeScale” */
            volumeScale?: number
            /**VIP待遇，自主管理，或者直至播放完毕 */
            bVip?: boolean
            /**回调 */
            callback?: (as: FWAudioSource, data: PlayEffectParam) => void
        }
    }
}
