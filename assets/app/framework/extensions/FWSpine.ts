import { _decorator, sp, __private } from 'cc';
const { ccclass, property } = _decorator;
import { EDITOR } from 'cc/env';

@ccclass('FWSpine')
export class FWSpine extends sp.Skeleton {
	@property
	bTestPause: boolean = false;
	update(dt: number) {
		if (EDITOR && !this.bTestPause) {
			if (this.paused) return;
			dt *= this.timeScale * sp.timeScale;
			if (this.isAnimationCached()) {
				if (this._isAniComplete) {
					if (this._animationQueue.length === 0 && !this._headAniInfo) {
						let frameCache = this._frameCache;
						if (frameCache && frameCache.isInvalid()) {
							frameCache.updateToFrame();
							let frames = frameCache.frames;
							this._curFrame = frames[frames.length - 1];
						}
						return;
					}
					if (!this._headAniInfo) {
						this._headAniInfo = this._animationQueue.shift();
					}
					this._accTime += dt;
					if (this._accTime > this._headAniInfo.delay) {
						let aniInfo = this._headAniInfo;
						this._headAniInfo = null;
						this.setAnimation(0, aniInfo.animationName, aniInfo.loop);
					}
					return;
				}
				this._updateCache(dt);
			} else {
				this._updateRealtime(dt);
			}
		} else {
			super.update?.(dt);
		}
	}
}
