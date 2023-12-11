import { _decorator, Action, CallFunc, Node as ccNode, DelayTime, delayTime, FiniteTimeAction, Hide, ITweenOption, RemoveSelf, sequence, SetAction, Show, Tween, TweenAction } from 'cc';
const { ccclass, property } = _decorator;
import { EDITOR } from 'cc/env';

// https://medium.com/dailyjs/typescript-create-a-condition-based-subset-types-9d902cea5b8c
type FlagExcludedType<Base, Type> = { [Key in keyof Base]: Base[Key] extends Type ? never : Key };
type AllowedNames<Base, Type> = FlagExcludedType<Base, Type>[keyof Base];
type KeyPartial<T, K extends keyof T> = { [P in K]?: T[P] };
type OmitType<Base, Type> = KeyPartial<Base, AllowedNames<Base, Type>>;
// eslint-disable-next-line @typescript-eslint/ban-types
type ConstructorType<T> = OmitType<T, Function>;

@ccclass('FWTween')
export class FWTween<T> extends Tween<T> {
	/**是否可用 */
	protected _bAvailable: boolean = true;
	/**动画列表 */
	protected _actions: Action[] = [];
	/**复用列表 */
	protected static _tweenPool: FWTween<unknown>[] = []
	/**复用列表 */
	protected static _tweenActionPool: Map<ConstructorType<Action>, Action[]> = new Map()
	/**获取一个复用的Tween */
	public static get<T>(target?: T): FWTween<T> {
		let item: FWTween<T>;
		while (!item || !item.isVisible()) {
			item = this._tweenPool.pop() ?? new FWTween();
		}
		target && item.target(target);
		item.setVisible(false);
		return item;
	}
	/**Action是否是可复用Action */
	protected static isReuseAction(action: Action) {
		return !!fw.any(action)._isReuseAction;
	}
	/**设置Action是可复用Action */
	protected static setIsReuseAction(action: Action) {
		fw.any(action)._isReuseAction = true;
	}
	/**获取一个复用Action */
	protected static getAction<T extends Action>(ctor: Constructor<T>): T {
		let action = FWTween._tweenActionPool.get(ctor)?.pop() as T;
		if (!action) {
			action = new ctor();
			FWTween.setIsReuseAction(action);
		}
		return action;
	}
	start(): FWTween<T> {
		const action = FWTween.getAction(CallFunc);
		action.initWithFunction(() => {
			this.recycling();
		});
		this._actions.push(action);
		super.start();
		return this;
	}
	stop(): FWTween<T> {
		FWTween._tweenPool.push(this);
		return this;
	}
	clone(target: T): FWTween<T> {
		return FWTween.get(target).then(fw.any(this)._union()) as FWTween<T>;
	}
	to(duration: number, props: ConstructorType<T>, opts?: ITweenOption): FWTween<T> {
		const action = FWTween.getAction(TweenAction);
		opts = opts || Object.create(null);
		(opts as any).relative = false;
		action.init(duration, props, opts);
		this._actions.push(action);
		return this;
	}
	by(duration: number, props: ConstructorType<T>, opts?: ITweenOption): FWTween<T> {
		const action = FWTween.getAction(TweenAction);
		opts = opts || Object.create(null);
		(opts as any).relative = true;
		action.init(duration, props, opts);
		this._actions.push(action);
		return this;
	}
	set(props: ConstructorType<T>): FWTween<T> {
		const action = FWTween.getAction(SetAction);
		fw.any(action)._props = {};
		action.init(props);
		this._actions.push(action);
		return this;
	}
	delay(duration: number): FWTween<T> {
		const action = FWTween.getAction(DelayTime);
		action.setDuration(duration);
		this._actions.push(action);
		return this;
	}
	call(callback: Function): FWTween<T> {
		const action = FWTween.getAction(CallFunc);
		action.initWithFunction(callback);
		this._actions.push(action);
		return this;
	}
	hide(): FWTween<T> {
		const action = FWTween.getAction(Hide);
		this._actions.push(action);
		return this;
	}
	show(): FWTween<T> {
		const action = FWTween.getAction(Show);
		this._actions.push(action);
		return this;
	}
	removeSelf(): FWTween<T> {
		const action = FWTween.getAction(RemoveSelf);
		action.init(false);
		this._actions.push(action);
		return this;
	}
	destroySelf(): FWTween<T> {
		const action = FWTween.getAction(RemoveSelf);
		action.init(true);
		this._actions.push(action);
		return this;
	}
	/**是否可用 */
	public isVisible() {
		return this._bAvailable;
	}
	/**设置是否可用（不可以手动调用） */
	protected setVisible(bVisible: boolean) {
		this._bAvailable = bVisible;
	}
	/**回收当前tween */
	recycling(): FWTween<T> {
		for (let l = this._actions, i = l.length - 1; i >= 0; --i) {
			const a = l[i];
			//是否是可复用的Action
			if (FWTween.isReuseAction(a)) {
				const c = a.constructor;
				//是否存在复用列表
				if (!FWTween._tweenActionPool.has(c)) {
					FWTween._tweenActionPool.set(c, []);
				}
				//回收
				FWTween._tweenActionPool.get(c).push(a);
			}
		}
		//清空Action
		this._actions.length = 0;
		//回收
		FWTween._tweenPool.push(this);
		//标记为不可用
		this.setVisible(true);
		return this;
	}
}

declare module 'cc' {
	/**Tween扩展 */
	// interface Tween {
	// 	play: any
	// }
}

/**类型声明调整 */
declare global {
	namespace globalThis {
	}
}

export { }
