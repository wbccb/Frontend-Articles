# 背景
`vite`预构建目的有一个是：CommonJS 和 UMD 兼容性，会将一些node_modules的依赖转化为`esmodule`的格式


# 如何将commonjs转化为esmodule

## CommonJS和ECMAScript
### 1 .简介
Node.js 既支持 CommonJS 标准，也完全支持 ECMAScript 标准。Node.js 环境下用 js语言编写的文件，有三种格式：.js、.mjs、.cjs。

- .mjs ：此类文件只用能 ECMAScript 标准解析执行；
- .cjs ：此类文件只用能 CommonJS 标准解析执行；
- .js ： 根据具体情况决定，采用什么标准来执行：
### 2. 不同点

- CommonJS模块输出的是一个值的拷贝，ES6 模块输出的是值的引用（并且这个映射是只读的）
- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
- 因为两个模块加载机制的不同，所以在对待循环加载的时候，它们会有不同的表现。**CommonJS**遇到循环依赖的时候，只会输出已经执行的部分，后续的输出或者变化，是不会影响已经输出的变量。而ES6模块相反，使用import加载一个变量，变量不会被缓存，真正取值的时候就能取到最终的值
- 关于两个模块互相引用的问题，在ES6模块当中，是支持加载**CommonJS**模块的。但是反过来，**CommonJS**并不能requireES6模块，在NodeJS中，两种模块方案是分开处理的。
- ES6 Module的导入导出都是声明式的，它不支持导入路径是一个表达式，所有导入导出必须位于模块的顶层作用域；**CommonJS可以放在任意的位置**
```json
// require命令的基本功能是，读入并执行一个 js 文件，然后返回该模块的 exports 对象。如果没有发现指定模块，会报错。
// 第一次加载模块的时候，Node会缓存该模块，后面再次加载该模块，就直接冲缓存中读取module.exports属性。
// CommonJS模块的加载机制是，require的是被导出的值的拷贝。也就是说，一旦导出一个值，模块内部的变化就影响不到这个值
// require缓存这个可以从webpack打包后的代码知道原理!!!!
var mod = require('./commonJs.js');
console.log(mod.counter);  // 3
console.log(mod.getCount()); // 3
mod.incCounter(); // count++
console.log(mod.getCount()); // 4
console.log(mod.counter); // 3


var mod1 = require('./commonJs.js');
console.log(mod === mod1); // true
console.log(mod1.getCount()); // 4
console.log(mod1.counter);  // 3

mod1.incCounter();// count++
console.log(mod.getCount()); // 5
```