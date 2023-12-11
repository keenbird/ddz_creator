// 修饰器
// @module	当前文件模块，文件中的所有成员将被默认为属于此模块，除另外标明
// @submodule	针对模块的划分，处于@module
// @class	标示一个类或者一个函数
// @constructor	对象字面量形式定义类时，可使用此标签标明其构造函数
// @callback	标明是一个回调函数
// @event	标明一个可触发的事件函数，一个典型的事件是由对象定义的一组属性
// @constant	常量
// @member/@var	一个基本数据类型的成员变量
// @method	方法或函数
// @param	方法参数及参数类型
// @property	一个对象的属性
// @readonly	只供阅读
// @return	返回值、类型及描述
// @type	代码变量的类型
// @description	在注释开始描述可省略此标签
// @enum	一个类中属性的类型相同时，使用此标签标明
// @example	示例，代码可自动高亮
// @exports	标识此对象将会被导出到外部调用
// @ignore	忽略此注释块
// @link	内联标签，创建一个链接
// @name	指定一段代码的名称，强制使用此名称，而不是代码里的名称
// @namespace	指定一个变量为命名空间变量
// @static	描述一个不需实例即可使用的变量
// @summary	描述信息的短叙述
// @throws	方法将会出现的错误和异常
// @todo	函数的功能或任务
// @tutorial	一个指向向导教程的链接

// //下面是自定义修饰器案例
// // 类修饰器
// function classDecorator(target) {
//     //简单打印，添加修饰器方式：@classDecorator
//     console.log("Class decorator executed");
//   }
// function classDecorator(target) {
//     //添加新属性（静态属性），添加修饰器方式：@classDecorator
//     target.newProperty = "Hello";
// }
// function classDecorator(target) {
//     //添加新属性（成员属性），添加修饰器方式：@classDecorator
//     target.prototype.sayHello = function() {
//         console.log("Hello from class instance");
//     };
// }
// function classDecorator(target) {
//     //返回一个新的类（类重定义），添加修饰器方式：@classDecorator
//     return class extends target {
//         log(message) {
//             console.log(`Log: ${message}`);
//         }
//     };
// }
// function classDecorator(value) {
//     //传参形式，添加修饰器方式：@classDecorator(value)
//     return function(target) {
//         //TODO
//     };
// }
// 使用方式：“@classDecorator” or “@classDecorator()” or “@classDecorator(value)” 
// class MyClass {
//     //TODO
// }
  
// // 方法修饰器
// function methodDecorator(target, key, descriptor) {
//     //简单打印：@methodDecorator
//     console.log("Method decorator executed");
// }
// function methodDecorator(target, key, descriptor) {
//     //重定义方法，添加修饰器方式：@methodDecorator
//     const originalMethod = descriptor.value;
//     descriptor.value = function (...args) {
//       console.log(`Calling ${key} with arguments: ${args}`);
//       const result = originalMethod.apply(this, args);
//       console.log(`${key} returned: ${result}`);
//       return result;
//     };
//     return descriptor;
// }
// function methodDecorator(target, key, descriptor) {
//     //参数验证，添加修饰器方式：@methodDecorator
//     const originalMethod = descriptor.value;
//     descriptor.value = function (...args) {
//       if (args.some(arg => typeof arg !== "number")) {
//         throw new Error("Arguments must be numbers");
//       }
//       return originalMethod.apply(this, args);
//     };
//     return descriptor;
// }
// function methodDecorator(value) {
//     //传参形式，添加修饰器方式：@methodDecorator(value)
//     return function(target, key, descriptor) {
//       const originalMethod = descriptor.value;
//       descriptor.value = function (...args) {
//         console.log(`${value} Calling ${key} with arguments: ${args}`);
//         const result = originalMethod.apply(this, args);
//         console.log(`${value} ${key} returned: ${result}`);
//         return result;
//       };
//       return descriptor;
//     };
// }
// class MyClass {
//   @methodDecorator
//   myMethod() {
//     // ...
//   }
// }

// // 属性修饰器
// function propertyDecorator(target, key) {
//     //打印，添加修饰器方式：@propertyDecorator
//     console.log("Property decorator executed");
// }
// function propertyDecorator(target, propertyName) {
//     //重定义，并添加getset方法，添加修饰器方式：@propertyDecorator
//     const originalValue = target[propertyName];
//     const getter = function () {
//       return originalValue;
//     };
//     const setter = function (newValue) {
//       if (typeof newValue !== 'string') {
//         throw new Error(`Invalid value for ${propertyName}. Must be a string.`);
//       }
//       originalValue = newValue;
//     };
//     Object.defineProperty(target, propertyName, {
//       get: getter,
//       set: setter,
//       enumerable: true,
//       configurable: true,
//     });
// }
// function propertyDecorator(value) {
//     //传参形式，添加修饰器方式：@propertyDecorator(value)
//     return function (target, propertyName) {
//       const value = target[propertyName];
//       const getter = function () {
//         console.log(`${value} Getting ${propertyName}: ${value}`);
//         return value;
//       };
//       const setter = function (newValue) {
//         console.log(`${value} Setting ${propertyName}: ${newValue}`);
//         value = newValue;
//       };
//       Object.defineProperty(target, propertyName, {
//         get: getter,
//         set: setter,
//         enumerable: true,
//         configurable: true,
//       });
//     };
// }
// class MyClass {
//   @propertyDecorator
//   myProperty = 42;
// }
  
