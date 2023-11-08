import { _decorator, AudioClip, AudioSource, sys } from 'cc';
export default class AudioMgr {
    private LocalStorageKey_Bg: string = "bgMusicFlag";
    private LocalStorageKey_Effect: string = "effectMusicFlag";
    private effectOn: boolean;
    private bgOn: boolean;
    private currBg: AudioClip;
    private currAudioSource: AudioSource;
    private bgVolume: number;
    private effectVolume: number;
    public constructor() {
        this.bgVolume = 0.1;
        this.effectVolume = 0.5;
        this.setBgVolume(this.bgVolume);
        this.setEffectVolume(this.effectVolume);
        this.setDefaultSwitchState();
    }
   /**
    * 读取背景音乐和音效的设置
    */
    private setDefaultSwitchState(): void {
        let bgMusicFlag = sys.localStorage.getItem(this.LocalStorageKey_Bg);
        if (!bgMusicFlag) {
        this.bgOn = true;
        } else {
        this.bgOn = bgMusicFlag == "1";
        }

        let effectMusicFlag = sys.localStorage.getItem(this.LocalStorageKey_Effect);
        if (!effectMusicFlag) {
        this.effectOn = true;
        } else {
        this.effectOn = effectMusicFlag == "1";
        }
    }
   /**
    * 播放音效
    * @param audioClip
    */
    public playEffect(audioClip: AudioClip, loops: number = 1): void {
        if (!this.effectOn)
        return;
        this.currAudioSource.clip=audioClip;
        this.currAudioSource.loop= loops == 1;
        this.currAudioSource.play();
    }
   /**
    * 停止音效播放
    * @param audioId
    */
    public stopEffect(audioId: number): void {
        if (audioId && audioId > 0) {
        // cc.audioEngine.stopEffect(audioId);
        }
    }
   /**
    * 播放背景音乐
    * @param key
    */
    public playBg(audioClip: AudioClip): void {
        this.currBg = audioClip;
        if (!this.bgOn)
        return;
        // cc.audioEngine.playMusic(audioClip, true);
    }
   /**
    * 停止背景音乐
    */
    public stopBg(): void {
        // cc.audioEngine.stopMusic();
    }
   /**
    * 设置音效是否开启
    * @param $isOn
    */
    public setEffectOn($isOn: boolean): void {
        this.effectOn = $isOn;
        sys.localStorage.setItem(this.LocalStorageKey_Effect, $isOn ? "1" : "0");
    }
   /**
    * 设置背景音乐是否开启
    * @param $isOn
    */
    public setBgOn($isOn: boolean): void {
        this.bgOn = $isOn;
        sys.localStorage.setItem(this.LocalStorageKey_Bg, $isOn ? "1" : "0");

        if (!this.bgOn) {
        this.stopBg();
        } else {
        if (this.currBg) {
        this.playBg(this.currBg);
        }
        }
    }
   /**
    * 背景音乐是否已开启
    * @returns {boolean}
    */
    public get bgIsOn(): boolean {
        return this.bgOn;
    }
   /**
    * 音效是否已开启
    * @returns {boolean}
    */
    public get effectIsOn(): boolean {
        return this.effectOn;
    }
   /**
    * 设置背景音乐音量
    * @param volume
    */
    public setBgVolume(volume: number): void {
        volume = Math.min(volume, 1);
        volume = Math.max(volume, 0);
        this.bgVolume = volume;
        // cc.audioEngine.setMusicVolume(this.bgVolume);
    }
   /**
    * 获取背景音乐音量
    * @returns {number}
    */
    public getBgVolume(): number {
        return this.bgVolume;
    }
   /**
    * 设置音效音量
    * @param volume
    */
    public setEffectVolume(volume: number): void {
        volume = Math.min(volume, 1);
        volume = Math.max(volume, 0);
        this.effectVolume = volume;
        // cc.audioEngine.setEffectsVolume(this.effectVolume);
    }
   /**
    * 获取音效音量
    * @returns {number}
    */
    public getEffectVolume(): number {
        return this.effectVolume;
    }
}

