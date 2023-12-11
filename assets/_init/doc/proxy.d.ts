
// proxy代理https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy

// get(target, property, receiver) “属性读取操作的捕捉器。”
//     target
//     目标对象。
//     property
//     被获取的属性名。
//     receiver
//     Proxy 或者继承 Proxy 的对象
//     返回值
//     get 方法可以返回任何值。

// set(target, property, value, receiver) “属性设置操作的捕捉器。”
//     target
//     目标对象。
//     property
//     将被设置的属性名或 Symbol。
//     value
//     新属性值。
//     receiver
//     最初被调用的对象。通常是 proxy 本身，但 handler 的 set 方法也有可能在原型链上，或以其他方式被间接地调用（因此不一定是 proxy 本身）。

// has(target, prop) “in 操作符的捕捉器。”
//     target
//     目标对象。
//     prop
//     需要检查是否存在的属性。
//     返回值
//     has 方法返回一个 boolean 属性的值。

// apply(target, thisArg, argumentsList) “函数调用操作的捕捉器。”
//     target
//     目标对象（函数）。
//     thisArg
//     被调用时的上下文对象。
//     argumentsList
//     被调用时的参数数组。
//     返回值
//     apply 方法可以返回任何值。

// ownKeys(target) “Object.getOwnPropertyNames和Object.getOwnPropertySymbols的捕捉器。”
//     target
//     目标对象。
//     返回值
//     ownKeys 方法必须返回一个可枚举对象。

// construct(target, argumentsList, newTarget) “new 操作符的捕捉器。”
//     target
//     目标对象。
//     argumentsList
//     constructor 的参数列表。
//     newTarget
//     最初被调用的构造函数，就上面的例子而言是 p。
//     返回值
//     construct 方法必须返回一个对象。

// isExtensible(target) “Object.isExtensible 方法的捕捉器。”
//     target
//     目标对象。
//     返回值
//     isExtensible方法必须返回一个 Boolean 值或可转换成 Boolean 的值。

// deleteProperty(target, property) “delete 操作符的捕捉器。”
//     target
//     目标对象。
//     property
//     待删除的属性名。
//     返回值
//     deleteProperty 必须返回一个 Boolean 类型的值，表示了该属性是否被成功删除。

// Object.defineProperty()时，configurable、enumerable 和 writable 的值如果不指定，则都默认为 false
// value: 25 // 设置xxx的值，不设置的话默认为undefined 后续不再演示value
// writable: false // 表示属性的值不可以被修改
// enumerable: false // 设置为false表示不能通过 for-in 循环返回
// configurable: false, // configurable 设置为 false，意味着这个属性不能从对象上删除
// defineProperty(target, property, descriptor) “Object.defineProperty 方法的捕捉器。”
//     target
//     目标对象。
//     property
//     待检索其描述的属性名。
//     descriptor
//     待定义或修改的属性的描述符。
//     返回值
//     defineProperty 方法必须以一个 Boolean 返回，表示定义该属性的操作成功与否。

// getPrototypeOf(target) “Object.getPrototypeOf 方法的捕捉器。”
//     target
//     被代理的目标对象。
//     返回值
//     getPrototypeOf 方法的返回值必须是一个对象或者 null。

// setPrototypeOf(target, prototype) “Object.setPrototypeOf 方法的捕捉器。”
//     target
//     被拦截目标对象。
//     prototype
//     对象新原型或为null.
//     返回值
//     如果成功修改了[[Prototype]], setPrototypeOf 方法返回 true,否则返回 false.

// preventExtensions(target) “Object.preventExtensions 方法的捕捉器。”
//     target
//     所要拦截的目标对象。
//     返回值
//     preventExtensions 方法返回一个布尔值。

// getOwnPropertyDescriptor(target, prop) “Object.getOwnPropertyDescriptor 方法的捕捉器。”
//     target
//     目标对象。
//     prop
//     返回属性名称的描述。
//     返回值
//     getOwnPropertyDescriptor 方法必须返回一个 object 或 undefined。
