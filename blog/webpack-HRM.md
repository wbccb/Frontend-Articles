# 前置问题
1. 本地文件改变，webpack是如何知道并且触发编译的？
2. 浏览器是如何知道本地代码重新编译，并且迅速请求了新生成的文件的？
3. webpack本地服务器是如何告知浏览器？
4. 浏览器获得这些文件又是如何热更新的？热更新的流程是什么？

# 前置知识点
## 一. 代码改变时自动编译的几种方法
> 摘录自 [webpack官方文档](https://webpack.js.org/guides/development/#choosing-a-development-tool)
1.webpack's [Watch Mode](https://webpack.docschina.org/configuration/watch/#watch)
2.[webpack-dev-server](https://github.com/webpack/webpack-dev-server)
3.[webpack-dev-middleware](https://github.com/webpack/webpack-dev-middleware)
### Watch Mode
```javascript
{
  "scripts": {
    "watch": "webpack --watch",
    "build": "webpack"
  }
}
```
命令行增加`watch`指令，当我们改变文件时，`webpack`会自动编译改变的模块，但是我们得手动刷新浏览器才能看到变化。
### webpack-dev-server
**webpack.config.js**
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devServer: {
		static: './dist',
  },
  optimization: {
    	runtimeChunk: 'single',// 多入口时配置
  }
};
```
**package.json**
```javascript
{
  "scripts": {
      "watch": "webpack --watch",
      "start": "webpack serve --open",
      "build": "webpack"
  }
}
```
`webpack.config.js`配置`devServer`属性，命令行增加`webpack serve --open`指令，当我们改变文件时，`webpack`会自动编译改变的模块，并且自动刷新浏览器
### webpack-dev-middleware
`webpack-dev-middleware`内置于`webpack-dev-server`，主要是用于监测代码文件变化，处理文件编译等流程，我们也可以将它单独拿出来进行其它场景的开发，比如结合express实现文件编译监听功能。
**server.js**
```javascript
const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');

const app = express();
const config = require('./webpack.config.js');
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(
  webpackDevMiddleware(compiler, {
    	publicPath: config.output.publicPath,
  })
);

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!\n');
});
```
**package.json**
```javascript
{
  "scripts": {
        "watch": "webpack --watch",
        "start": "webpack serve --open",
        "server": "node server.js",
        "build": "webpack"
  }
}
```
## 二. 入口调试
### package.json
1.在`Server.js`中设置`debugger`断点
2.在`package.json`中设置`node --inpect-brk`的自动断点
3.运行命令后会自动跳转到`Server.js`中
```javascript
"scripts": {
  "dev-Server": "node --inspect-brk ./node_modules/webpack-dev-server/bin/webpack-dev-server.js",
  "dev-client": "webpack-dev-server",
},
```
### 本地客户端和服务端debugger相关文件说明
#### 客户端入口文件entry
1.编译形成`index.html`文件入口
2.在`index.html`入口文件中编译形成`index.js`，将`webpack-dev-server/client/index.js`和`webpack/hot/dev-server.js`注入到`index.js`中，进行`webSocket`的建立和监听，实时进行热更新操作
3.调试时使用客户端的链接`http://localhost:8080/`
```javascript
入口entry注入：
// 1. node_modules/webpack-dev-server/client/index.js
// 2. node_modules/webpack/hot/dev-server.js
```
#### 服务端启动
1.监听文件变化，进行编译
2.将编译结果发送给客户端进行数据的更新操作
3.调试时使用 `node --inspect-brk ./node_modules/webpack-dev-server/bin/webpack-dev-server.js`
```javascript
编译过程中启动的JS文件：
// 3. node_modules/webpack-dev-server/lib/Server.js
// 4. node_modules/webpack-dev-server/lib/servers/WebsocketServer.js
```

# 源码分析流程
## 一. 热更新总体流程图解
### 1. 整体流程图
![webpack-HRM.svg](https://wbccb.github.io/Frontend-Articles/image/webpack-HRM.svg)

### 2. 流程图文字分析
#### 初始化：本地服务器和客户端初始化
1. Server：`new Server()`后会直接调用`server.start()`，进行服务的启动
2. Client：初始化过程中注入`webpack-dev-server/client/index.js`和`webpack/hot/dev-server.js`到入口文件中
3. Server：在`Server.js`中，进行`webpack-dev-middleware`插件的注册，触发编译以及文件变化的监听
4. Server：使用`express`开启本地node服务器
5. Server和Client：创建`WebSocket`
```javascript
/**
 * 省去细节代码，只保留(核心代码 || 要重点分析的代码)
 */
class Server {
      async start() {
          await this.normalizeOptions();
          await this.initialize();

          if (this.options.webSocketServer) {
              this.createWebSocketServer();
          }
      }

      async normalizeOptions() {
          const { options } = this;
          options.client.webSocketURL = {
              protocol: parsedURL.protocol,
              hostname: parsedURL.hostname,
              port: parsedURL.port.length > 0 ? Number(parsedURL.port) : "",
              pathname: parsedURL.pathname,
              username: parsedURL.username,
              password: parsedURL.password,
          };


          const defaultWebSocketServerOptions = { path: "/ws" };

          if (typeof options.webSocketServer === "undefined") {
              options.webSocketServer = {
                  type: defaultWebSocketServerType,
                  options: defaultWebSocketServerOptions,
              };
          }
      }

      initialize() {
          compilers.forEach((compiler) => {
              this.addAdditionalEntries(compiler);

              if (this.options.hot) {
                  // Apply the HMR plugin
                  const plugin = new webpack.HotModuleReplacementPlugin();
                  plugin.apply(compiler);
              }
          });

          this.setupApp();
          this.setupDevMiddleware();
          this.setupMiddlewares();
          this.createServer();
      }

      addAdditionalEntries(compiler) {
          let additionalEntries = [];
          if (this.options.webSocketServer) {

              additionalEntries.push(
                  `${require.resolve("../client/index.js")}?${webSocketURLStr}`
              );
          }

          if (this.options.hot === "only") {
              additionalEntries.push(require.resolve("webpack/hot/only-dev-server"));
          } else if (this.options.hot) {
              additionalEntries.push(require.resolve("webpack/hot/dev-server"));
          }

          if (typeof webpack.EntryPlugin !== "undefined") {
              // node_modules/webpack-dev-server/client/index.js?protocol=ws%3A&hostname=0.0.0.0&port=9000&pathname=%2Fws&logging=info&overlay=true&reconnect=10&hot=true&live-reload=true
              // node_modules/webpack/hot/dev-server.js
              for (const additionalEntry of additionalEntries) {
                  new webpack.EntryPlugin(compiler.context, additionalEntry, {
                      name: undefined,
                  }).apply(compiler);
              }
          }
      }

      setupDevMiddleware() {
          const webpackDevMiddleware = require("webpack-dev-middleware");

          // middleware for serving webpack bundle
          this.middleware = webpackDevMiddleware(
              this.compiler,
              this.options.devMiddleware
          );
      }

      setupApp() {
          this.app = new express();
      }

      setupMiddlewares() {
          let middlewares = [];

          middlewares.push({
              name: "webpack-dev-middleware",
              middleware: this.middleware
          });

          // middlewares: Array(6)
          // 0:{ name: 'compression', middleware: ƒ }
          // 1:{ name: 'webpack-dev-middleware', middleware: ƒ }
          // 2:{ name: 'express-static', path: '/', middleware: ƒ }
          // 3:{ name: 'serve-index', path: '/', middleware: ƒ }
          // 4:{ name: 'serve-magic-html', middleware: ƒ }
          // 5:{ name: 'options-middleware', path: '*', middleware: ƒ }
          middlewares.forEach((middleware) => {
              if (typeof middleware === "function") {
                  (this.app).use(middleware);
              } else if (typeof middleware.path !== "undefined") {
                  (this.app).use(middleware.path, middleware.middleware);
              } else {
                  (this.app).use(middleware.middleware);
              }
          });
      }

      createServer() {
          this.server = require("http").createServer(
              options,
              this.app
          );

          this.server.on("connection", (socket) => {
              // Add socket to list
              this.sockets.push(socket);
          });
      }

      createWebSocketServer() {
          this.webSocketServer = new (this.getServerTransport())(this); // this.webSocketServer = new WebsocketServer(this);

          if (this.options.hot === true || this.options.hot === "only") {
              this.sendMessage([client], "hot");
          }
          if (this.options.liveReload) {
              this.sendMessage([client], "liveReload");
          }
          this.sendStats([client], this.getStats(this.stats), true);
      }

      getServerTransport() {
          let implementation;
          if (this.options.webSocketServer.type === "ws") {
              implementation = require("./servers/WebsocketServer");
          }
          return implementation;
      }
}
```
#### 初始化文件变化Watching.js管理类，并且触发编译
`Server.js`在注册`webpack-dev-middleware`的时候，进行`Watching.js`的初始化，并且触发第一次编译
```javascript
// node_modules/webpack-dev-server/lib/Server.js
setupDevMiddleware() {
      const webpackDevMiddleware = require("webpack-dev-middleware");

      // middleware for serving webpack bundle
      this.middleware = webpackDevMiddleware(
          this.compiler,
          this.options.devMiddleware
      );
}

// node_modules/webpack-dev-middleware/dist/index.js
function wdm() {
      const context = { compiler };

      setupOutputFileSystem(context); // Start watching

      context.compiler.watch(watchOptions, errorHandler);
}


// node_modules/webpack/lib/Compiler.js
watch(watchOptions, handler) {
      this.watching = new Watching(this, watchOptions, handler);
      return this.watching;
}


// node_modules/webpack/lib/Watching.js
// Watching.js的constructor()->_invalidate()->_go()
_go(fileTimeInfoEntries, contextTimeInfoEntries, changedFiles, removedFiles) {
      const run = () => {
          this.compiler.compile(onCompiled);
      };
      run();
}


// node_modules/Complier.js
compile(callback) {
      this.hooks.make.callAsync(compilation, err => {}); //触发编译
}
```
#### 本地服务端-文件变化运行逻辑
`Server.js`在`Watching.js`注册了文件内存系统的监听，文件发生变化时，会触发重新编译
```javascript
// node_modules/webpack/lib/webpack.js
new NodeEnvironmentPlugin({
    	infrastructureLogging: options.infrastructureLogging
}).apply(compiler);


// node_modules/webpack/lib/node/NodeEnvironmentPlugin.js
compiler.watchFileSystem = new NodeWatchFileSystem(
    compiler.inputFileSystem
);


// node_modules/webpack/lib/Watching.js
// 第一次会主动触发this._go()进行编译，每次编译结束时注册监听
_done(err, compilation) {
    //...
    this.watch(
        compilation.fileDependencies,
        compilation.contextDependencies,
        compilation.missingDependencies
    );
    //...
}
watch(files, dirs, missing) {
    this.watcher = this.compiler.watchFileSystem.watch(...args, () => {
        this._invalidate(
            fileTimeInfoEntries,
            contextTimeInfoEntries,
            changedFiles,
            removedFiles
        );
        this._onChange();
    });
}
_invalidate() {
    this._go(...args);
}
_go(fileTimeInfoEntries, contextTimeInfoEntries, changedFiles, removedFiles) {
    const run = () => {
        this.compiler.compile(onCompiled);
    };
    run();
}


// node_modules/Complier.js
compile(callback) {
    this.hooks.make.callAsync(compilation, err => { }); //触发编译
}
```
#### 本地服务端-通知客户端
1.监听Webpack编译完成后，主动触发`sendStats`方法
2.本地服务端的`webSocket`主动发送`hash`命令和`ok`命令到本地浏览器client端
```javascript
class Server {
    setupHooks() {
        // 初始化时注册done的监听事件，编译完成后，调用sendStats方法进行webSocket的命令发送
        this.compiler.hooks.done.tap(
            "webpack-dev-server",
            (stats) => {
                if (this.webSocketServer) {
                    this.sendStats(this.webSocketServer.clients, this.getStats(stats));
                }
                this.stats = stats;
            }
        );
    }

    sendStats(clients, stats, force) {
        // 更新当前的hash
        this.currentHash = stats.hash;
      
        // 发送给客户端当前的hash值
        this.sendMessage(clients, "hash", stats.hash);

        // 发送给客户端ok的指令
        this.sendMessage(clients, "ok");
    }
}
```
#### 客户端-接收到服务端发来的WebSocket消息
1.收到`type=hash`和`type=ok`两条消息
![截屏2022-10-05 16.00.07.png](https://cdn.nlark.com/yuque/0/2022/png/21527712/1664956818924-66743d5a-c4f9-4811-a44e-5a6177a801b1.png#clientId=ufd798159-93ff-4&crop=0&crop=0&crop=1&crop=1&from=ui&id=u57fc10d4&margin=%5Bobject%20Object%5D&name=%E6%88%AA%E5%B1%8F2022-10-05%2016.00.07.png&originHeight=214&originWidth=710&originalType=binary&ratio=1&rotation=0&showTitle=false&size=40600&status=done&style=none&taskId=u8e79738d-d4b3-4829-9ea5-1e83dbb0db3&title=)

2.`type=hash`更新了当前的`currentHash`值
3.`type=ok`触发了`reloadApp()`方法的执行
```javascript
var onSocketMessage = {
  hash: function hash(_hash) {
    	status.previousHash = status.currentHash;
        status.currentHash = _hash;
  },
  ok: function ok() {
    	sendMessage("Ok");

    	reloadApp(options, status);
  },
};
var socketURL = createSocketURL(parsedResourceQuery);
socket(socketURL, onSocketMessage, options.reconnect);

function reloadApp(_ref, status) {
    function applyReload(rootWindow, intervalId) {
        rootWindow.location.reload();
    }

    var search = self.location.search.toLowerCase();
    var allowToHot = search.indexOf("webpack-dev-server-hot=false") === -1;
    var allowToLiveReload = search.indexOf("webpack-dev-server-live-reload=false") === -1;

    if (hot && allowToHot) {
        log.info("App hot update...");
        hotEmitter.emit("webpackHotUpdate", status.currentHash);
    }
    else if (liveReload && allowToLiveReload) {
        // 根据条件判断执行applyReload()方法
    }
}
```
#### 客户端-hotEmitter.emit("webpackHotUpdate", status.currentHash)
1.`webpack/hot/dev-server.js`接收到`hotEmitter`的消息后，进行`check()`方法的调用
2.`module.hot.check(true)`触发，然后判断是否需要重启
```javascript
var check = function check() {
    module.hot
        .check(true)
        .then(function (updatedModules) {
            if (!updatedModules) {
                log("warning", "[HMR] Cannot find update. Need to do a full reload!");
                window.location.reload();
                return;
            }
        });
};
var hotEmitter = require("./emitter");
hotEmitter.on("webpackHotUpdate", function (currentHash) {
    lastHash = currentHash;

    check();
});
```
#### 客户端-module.hot.check
> /node_modules/webpack/lib/hmr/HotModuleReplacement.runtime.js
在编译形成最终代码时，会注入`HotModuleReplacement.runtime.js`代码，拦截`require`，进行`createRequire`和`createModuleHotObject`
##### createRequire
构建当前`request`的`parent`和`children`，本质是在`require`的基础上保存各个模块之间的依赖关系，为后面的热更新做准备，因为一个文件的更新必定涉及到另外依赖模块的相关更新
##### createModuleHotObject
构建当前`module`的`hot`API，后面的热更新都需要通过`hotCheck`和`hotApply`进行操作
```javascript
function __webpack_require__(moduleId) {
      // ...... 省略代码 ......

      var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
      __webpack_require__.i.forEach(function (handler) { handler(execOptions); });

      // ...... 省略代码 ......

      return module.exports;
}


__webpack_require__.i.push(function (options) {
      var module = options.module;
      var require = createRequire(options.require, options.id);
      module.hot = createModuleHotObject(options.id, module);
      module.parents = currentParents;
      module.children = [];
      currentParents = [];
      options.require = require;
});


function createRequire(require, moduleId) {
      var me = installedModules[moduleId];
      // ...... 省略代码 ......
      var fn = function (request) {
          if (me.hot.active) {
              if (installedModules[request]) {
                  var parents = installedModules[request].parents;
                  if (parents.indexOf(moduleId) === -1) {
                      parents.push(moduleId);
                  }
              } else {
                  currentParents = [moduleId];
                  currentChildModule = request;
              }
              if (me.children.indexOf(request) === -1) {
                  me.children.push(request);
              }
          } else {
              currentParents = [];
          }
          return require(request);
      };
      // ...... 省略代码 ......
      return fn;
}

function createModuleHotObject(moduleId, me) {
    var hot = {
        // ...... 省略代码 ......
        active: true,
        accept: function (dep, callback, errorHandler) {
            // ...... 省略代码 ......
        },
        // ...... 省略代码 ......
        check: hotCheck,
        apply: hotApply,
        // ...... 省略代码 ......
        data: currentModuleData[moduleId]
    };
    currentChildModule = undefined;
    return hot;
}
```
##### hotCheck
1.`module.hot.check`最终会触发`hotCheck()`方法
2.`__webpack_require__.hmrM`：先使用旧的`hash`值进行`hot-update.json`文件的请求，得到`update = {c:["main"], m:[], r:[]} `的更新内容
```javascript
function hotCheck(applyOnUpdate) {

      return setStatus("check")
          .then(__webpack_require__.hmrM) // 为fetch("http://localhost:8080/main.fc1c69066ce336693703.hot-update.json")
          .then(function (update) {
             // update = {c:["main"], m:[], r:[]} 更新内容

              return setStatus("prepare").then(function () {
                  var updatedModules = [];
                  currentUpdateApplyHandlers = [];

                  return Promise.all(
                      Object.keys(__webpack_require__.hmrC).reduce(function (
                          promises,
                          key
                      ) {
                          // key=jsonp
                          // __webpack_require__.hmrC[key](
                          //     update.c,
                          //     update.r,
                          //     update.m,
                          //     promises,
                          //     currentUpdateApplyHandlers,
                          //     updatedModules
                          // ); ===> 转化为jsonp，便于理解
                          __webpack_require__.hmrC.jsonp(update.c, update.r, update.m, promises, currentUpdateApplyHandlers, updatedModules);
                          // chunkIds, removedChunks, removedModules, promises, applyHandlers, updatedModulesList
                          return promises;
                      },
                          [])
                  ).then(function () {
                      return waitForBlockingPromises(function () { // 等待所有的promise更新完成
                          if (applyOnUpdate) {
                              // hotCheck(true)
                              return internalApply(applyOnUpdate);
                          } else {
                              return setStatus("ready").then(function () {
                                  return updatedModules;
                              });
                          }
                      });
                  });
              });
          });
}

__webpack_require__.hmrM = () => {
    if (typeof fetch === "undefined") throw new Error("No browser support: need fetch API");

    // 保留的是client客户端的域名：
    // __webpack_require__.p = "http://localhost:8080/"

    // 保留的是上一次的hash值：
    // __webpack_require__.h = () => ("fc1c69066ce336693703")

    // __webpack_require__.hmrF = () => ("main." + __webpack_require__.h() + ".hot-update.json"); 
    // fetch("http://localhost:8080/main.fc1c69066ce336693703.hot-update.json")
    return fetch(__webpack_require__.p + __webpack_require__.hmrF()).then((response) => {
        return response.json();
    });
};
```
3.`hot-update.json`回调完成后，触发`__webpack_require__.hmrC.jsonp()`方法执行：
(1) 创建`http://localhost:8080/main.f1bcf354bbddd26daa90.hot-update.js`的promise请求，并且加入到promise数组中
(2) 创建对应的全局执行函数，等待`main.xxx.hot-update.js`回调后，执行对应的`module`代码的缓存并且触发对应`promise`的`resolve`请求，从而顺利回调`internalApply()`方法
```javascript
// $hmrDownloadUpdateHandlers$.$key$ => runtime转化为： __webpack_require__.hmrC.jsonp 
__webpack_require__.hmrC.jsonp = function (chunkIds, ...) {
    applyHandlers.push(applyHandler);

    chunkIds.forEach(function (chunkId) {
        // 拼接jsonp请求的url
        promises.push($loadUpdateChunk$(chunkId, updatedModulesList));
    });
};

// 拼接jsonp请求的url
var waitingUpdateResolves = {};
function loadUpdateChunk(chunkId, updatedModulesList) {
    return new Promise((resolve, reject) => {

      waitingUpdateResolves[chunkId] = resolve;
      
        // __webpack_require__.hu = "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
        var url = __webpack_require__.p + __webpack_require__.hu(chunkId);
        __webpack_require__.l(url, loadingEnded);
    });
}

// document.body.appendChild(new Script())，正式发起get请求(jsonp请求)
var inProgress = {};
__webpack_require__.l = (url, done, key, chunkId) => {
    inProgress[url] = [done];
    var onScriptComplete = (prev, event) => {
        var doneFns = inProgress[url];
        delete inProgress[url];
        script.parentNode && script.parentNode.removeChild(script);
        doneFns && doneFns.forEach((fn) => (fn(event)));
    };
    script.onload = onScriptComplete.bind(null, script.onload);
    needAttach && document.head.appendChild(script);
};

// 返回的http://localhost:8080/main.f1bcf354bbddd26daa90.hot-update.js是一个webpackHotUpdatewebpack_inspect马上执行的函数
// 如下图所示
self["webpackHotUpdatewebpack_inspect"] = (chunkId, moreModules, runtime) => {
    for (var moduleId in moreModules) {
        if (__webpack_require__.o(moreModules, moduleId)) {
            currentUpdate[moduleId] = moreModules[moduleId];
            if (currentUpdatedModulesList) currentUpdatedModulesList.push(moduleId);
        }
    }
    if (runtime) currentUpdateRuntime.push(runtime);
    if (waitingUpdateResolves[chunkId]) {
        waitingUpdateResolves[chunkId]();
        waitingUpdateResolves[chunkId] = undefined;
    }
};
```
![image.png](https://cdn.nlark.com/yuque/0/2022/png/21527712/1665127793444-fd0aac01-5bbe-47df-921b-cd25709aa354.png#clientId=u55ad9ffe-6acf-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=186&id=ucc1c6a81&margin=%5Bobject%20Object%5D&name=image.png&originHeight=372&originWidth=1476&originalType=binary&ratio=1&rotation=0&showTitle=false&size=82144&status=done&style=none&taskId=ueb5fdf32-85e4-47b2-a934-2f47b8a6046&title=&width=738)
#### 客户端-module.hot.apply
1.处理所有涉及模块的热更新策略，有的是当依赖的模块发生更新后，这个模块需要通过**重新加载**去完成本模块的全量更新，有的是部分热更新，有的是不更新
2.进行需要update的模块的热更新处理
3.进行需要delete的模块的热更新处理
##### hotApply数组遍历处理
```javascript
function internalApply(options) {
    // 这里的currentUpdateApplyHandlers存储的是上面jsonp请求js文件所创建的callback
    var results = currentUpdateApplyHandlers.map(function (handler) {
        return handler(options);
    });
    currentUpdateApplyHandlers = undefined;

    results.forEach(function (result) {
      if (result.dispose) result.dispose();
    });

    var outdatedModules = [];
    results.forEach(function (result) {
        if (result.apply) {
            // 这里的result的是上面jsonp请求js文件所创建的callback所返回Object的apply方法
            var modules = result.apply(reportError);
            if (modules) {
                for (var i = 0; i < modules.length; i++) {
                    outdatedModules.push(modules[i]);
                }
            }
        }
    });

    return Promise.all([disposePromise, applyPromise]).then(function () {

        return setStatus("idle").then(function () {
            return outdatedModules;
        });
    });
}
```
##### applyHandler-实际的hotApply处理逻辑
> applyHandler()方法位于/node_modules/webpack/lib/hmr/JavascriptHotModuleReplacement.runtime.js
###### 总体执行逻辑概括
1.根据webpack配置拼接出当前`moduleId`的热更新策略，比如允许热更新，比如不允许热更新等等
2.根据热更新策略，拼接多个数据结构，为`applay()`方法代码服务
3.从`internalApply()`可以知道，最终会先执行`result.dispose()`，然后再执行`result.apply()`方法，
4.`dispose()`方法主要执行的逻辑是:
(1)删除缓存数据
(2)移除之前注册的回调函数
(3)移除目前module与其它module的绑定关系(parent和children)
5.`apply()`方法主要执行的逻辑是：
(1)更新全局的window.__webpack_require__对象，存储了所有路径+内容的对象
(2)执行runtime代码，比如_webpack_require__.h = ()=> {"xxxxxhash值"}
(3)触发之前hot.accept部署了依赖变化时的回调callBack
(4)重新加载标识_selfAccepted的module，这种模块会重新require一次
###### 第一个步骤-1：拼接数据结构
1.根据`getAffectedModuleEffects(moduleId)`整理出该`moduleId`的热更新策略，是否需要热更新
2.根据多个对象拼凑出`dispose`和`apply`方法所需要的数据结构
```javascript
function applyHandler(options) {
      currentUpdateChunks = undefined;

      // at begin all updates modules are outdated
      // the "outdated" status can propagate to parents if they don't accept the children
      var outdatedDependencies = {}; // 使用module.hot.accept部署了依赖发生更新后的回调函数
      var outdatedModules = []; // 当前过期需要更新的modules
      var appliedUpdate = {}; // 准备更新的modules


      for (var moduleId in currentUpdate) {
          var newModuleFactory = currentUpdate[moduleId];

          // 获取之前的配置：该moduleId是否允许热更新
          var result = getAffectedModuleEffects(moduleId);

          var doApply = false;
          var doDispose = false;

          switch (result.type) {
              // ...
              case "accepted":
                  if (options.onAccepted) options.onAccepted(result);
                  doApply = true;
                  break;
              //...
          }
          if (doApply) {
              appliedUpdate[moduleId] = newModuleFactory;
              //...代码省略... 拼凑出outdatedDependencies过期的依赖，为下面的module.hot.accept(moduleId, function() {})做准备
          }
          if (doDispose) {
              //...代码省略... 处理配置为dispose的情况
          }

      }
      currentUpdate = undefined;

      // 根据outdatedModules拼凑出需要_selfAccepted=true，即热更新是重新加载一次自己的module的数据到outdatedSelfAcceptedModules中
      var outdatedSelfAcceptedModules = [];
      for (var j = 0; j < outdatedModules.length; j++) {
          var outdatedModuleId = outdatedModules[j];
          // __webpack_require__.c = __webpack_module_cache__
          var module = __webpack_require__.c[outdatedModuleId];
          if (module && (module.hot._selfAccepted || module.hot._main) &&
              appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
              !module.hot._selfInvalidated
          ) {
              // _requireSelf: function () {
              //      currentParents = me.parents.slice();
              //      currentChildModule = _main ? undefined : moduleId;
              // 	    __webpack_require__(moduleId);
              // },
              outdatedSelfAcceptedModules.push({
                  module: outdatedModuleId,
                  require: module.hot._requireSelf, // 重新加载自己
                  errorHandler: module.hot._selfAccepted
              });
          }
      }

      var moduleOutdatedDependencies;

      return {
          dispose: function() {...}
          apply: function(reportError) {...}
      };
}
```
###### 第一个步骤-2：getAffectedModuleEffects方法讲解
```javascript
function getAffectedModuleEffects(updateModuleId) {
      var outdatedModules = [updateModuleId];
      var outdatedDependencies = {};

      var queue = outdatedModules.map(function (id) {
          return {
              chain: [id],
              id: id
          };
      });
      while (queue.length > 0) {
          var queueItem = queue.pop();
          var moduleId = queueItem.id;
          var chain = queueItem.chain;
          var module = __webpack_require__.c[moduleId];
          if (!module || (module.hot._selfAccepted && !module.hot._selfInvalidated)) { continue; }

          // ************ 处理不热更新的情况 ************
          if (module.hot._selfDeclined) {
              return {
                  type: "self-declined",
                  chain: chain,
                  moduleId: moduleId
              };
          }
          if (module.hot._main) {
              return {
                  type: "unaccepted",
                  chain: chain,
                  moduleId: moduleId
              };
          }
          // ************ 处理不热更新的情况 ************

          for (var i = 0; i < module.parents.length; i++) {
              // module.parents=依赖这个模块的modules
              // 遍历所有依赖这个模块的 modules
              var parentId = module.parents[i];
              var parent = __webpack_require__.c[parentId];
              if (!parent) continue;
              if (parent.hot._declinedDependencies[moduleId]) {
                  // 如果依赖这个模块的parentModule设置了不理会当前moduleId热更新的策略，则不处理该parentModule
                  return {
                      type: "declined",
                      chain: chain.concat([parentId]),
                      moduleId: moduleId,
                      parentId: parentId
                  };
              }
              // 如果已经包含在准备更新的队列中，则不重复添加
              if (outdatedModules.indexOf(parentId) !== -1) continue;
              if (parent.hot._acceptedDependencies[moduleId]) {
                  if (!outdatedDependencies[parentId])
                      outdatedDependencies[parentId] = [];
                  // TODO 这个parentModule设置了监听其依赖module的热更新
                  addAllToSet(outdatedDependencies[parentId], [moduleId]);
                  continue;
              }
              delete outdatedDependencies[parentId];
              outdatedModules.push(parentId); // 添加该parentModuleId到队列中，准备更新

              // 加入该parentModuleId到队列中，进行下一轮循环，把parentModule的相关parent也加入到更新中
              queue.push({
                  chain: chain.concat([parentId]),
                  id: parentId
              });
          }
      }

      return {
          type: "accepted",
          moduleId: updateModuleId,
          outdatedModules: outdatedModules,
          outdatedDependencies: outdatedDependencies
      };
}

function addAllToSet(a, b) {
      for (var i = 0; i < b.length; i++) {
          var item = b[i];
          if (a.indexOf(item) === -1) a.push(item);
      }
}
```
###### 第二个步骤：dispose方法
```javascript
dispose: function () {
      currentUpdateRemovedChunks.forEach(function (chunkId) {
          delete installedChunks[chunkId];
      });
      currentUpdateRemovedChunks = undefined;

      var idx;
      var queue = outdatedModules.slice();
      while (queue.length > 0) {
          var moduleId = queue.pop();
          var module = __webpack_require__.c[moduleId];
          if (!module) continue;

          var data = {};

          // Call dispose handlers: 回调注册的disposeHandlers
          var disposeHandlers = module.hot._disposeHandlers;
          for (j = 0; j < disposeHandlers.length; j++) {
              disposeHandlers[j].call(null, data);
          }
          // __webpack_require__.hmrD = currentModuleData置为空
          __webpack_require__.hmrD[moduleId] = data;

          // disable module (this disables requires from this module)
          module.hot.active = false;

          // remove module from cache: 删除module的缓存数据
          delete __webpack_require__.c[moduleId];

          // when disposing there is no need to call dispose handler: 删除其它模块对该moduleId的accept回调
          delete outdatedDependencies[moduleId];

          // remove "parents" references from all children: 
          // 解除moduleId引用的其它模块跟moduleId的绑定关系，跟下面的解除关系是互相补充的
          // 一个是children，一个是parent
          for (j = 0; j < module.children.length; j++) {
              var child = __webpack_require__.c[module.children[j]];
              if (!child) continue;
              idx = child.parents.indexOf(moduleId);
              if (idx >= 0) {
                  child.parents.splice(idx, 1);
              }
          }
      }

      // remove outdated dependency from module children: 
      // 解除引用该moduleId的模块跟moduleId的绑定关系，可以理解为moduleId.parent删除children，跟上面的解除关系是互相补充的
      // 一个是children，一个是parent
      var dependency;
      for (var outdatedModuleId in outdatedDependencies) {
          module = __webpack_require__.c[outdatedModuleId];
          if (module) {
              moduleOutdatedDependencies =
                  outdatedDependencies[outdatedModuleId];
              for (j = 0; j < moduleOutdatedDependencies.length; j++) {
                  dependency = moduleOutdatedDependencies[j];
                  idx = module.children.indexOf(dependency);
                  if (idx >= 0) module.children.splice(idx, 1);
              }
          }

      }
}
```
###### 第三个步骤：apply方法
```javascript
apply: function (reportError) {
      // insert new code
      for (var updateModuleId in appliedUpdate) {
          // __webpack_require__.m = __webpack_modules__
          // 更新全局的window.__webpack_require__对象，存储了所有路径+内容的对象
          __webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
      }

      // run new runtime modules
      // 执行runtime代码，比如_webpack_require__.h = ()=> {"xxxxxhash值"}
      for (var i = 0; i < currentUpdateRuntime.length; i++) {
          currentUpdateRuntime[i](__webpack_require__);
      }

      // call accept handlers：触发之前hot.accept部署了依赖变化时的回调callBack
      for (var outdatedModuleId in outdatedDependencies) {
          var module = __webpack_require__.c[outdatedModuleId];
          if (module) {
              moduleOutdatedDependencies =
                  outdatedDependencies[outdatedModuleId];
              var callbacks = [];
              var errorHandlers = [];
              var dependenciesForCallbacks = [];
              for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
                  var dependency = moduleOutdatedDependencies[j];
                  var acceptCallback = module.hot._acceptedDependencies[dependency];
                  var errorHandler = module.hot._acceptedErrorHandlers[dependency];
                  if (acceptCallback) {
                      if (callbacks.indexOf(acceptCallback) !== -1) continue;
                      callbacks.push(acceptCallback);
                      errorHandlers.push(errorHandler);
                      dependenciesForCallbacks.push(dependency);
                  }
              }
              for (var k = 0; k < callbacks.length; k++) {
                  callbacks[k].call(null, moduleOutdatedDependencies);
              }
          }
      }

      // Load self accepted modules：重新加载标识_selfAccepted的module，这种模块会重新require一次
      for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
          var item = outdatedSelfAcceptedModules[o];
          var moduleId = item.module;

          item.require(moduleId);
      }

      return outdatedModules;
  }
```

### 3. 概括总结
1.构建 bundle.js 的时候，加入一段 HMR runtime 的 js 和一段和本地服务沟通的WebSocket的相关js
2.文件修改会触发 webpack 重新构建，服务器通过向浏览器发送更新消息，浏览器通过 jsonp 拉取更新的模块文件，jsonp 回调触发模块热替换逻辑
## 二. 其它问题总结
### 1. hotApply是如何运行的？
1.先进行`dipose()`进行缓存数据的移除
2.然后再调用`apply()`进行数据的更新，以及对应注册的accept handler回调
> 如果没有在accept中写对应的业务代码，热更新后虽然代码已经变化，但是并不会引起已经更新的module.parent或者module.children的方法重新执行一遍，即不会重新从已经更新的module重新获取值
### 2. hotApply中outdatedModules、appliedUpdate、outdatedSelfAcceptedModules、moduleOutdatedDependencies有什么作用？
#### outdatedModules
需要更新的modules，比如你改变了test1.js，test2.js，那么这里的`outDatedModules=["./test1.js", "./test2.js"]`
#### outdatedSelfAcceptedModules
> 只有在module注册了accetp()这个方法，才能_selfAccepted=true
`outdatedModules`解析配置得到的`_selfAccepted=true`的`modules`
#### outdatedDependencies
> 只有在module.parent注册了accept("[当前的moduleId]", ()=> {})才有这层关系
存储的是`key-value`的对象，其中`key`代表的是当前要更新的`module`的parent，`value`代表当前的module
#### moduleOutdatedDependencies
`outdatedDependencies`的`values`，用于在`dispose()`和`apply()`中进行短暂缓存数据使用
#### appliedUpdate
缓存`moduleId`的数据，如果是`apply`则缓存新的代码，如果是`dipose`模式，则缓存一个警告function
```javascript
if (doApply) {
    appliedUpdate[moduleId] = newModuleFactory;
}
if (doDispose) {
    appliedUpdate[moduleId] = warnUnexpectedRequire;
}
```
### 3. 本地文件改变，webpack是如何知道并且触发编译的？
1.将打包内容放入内存中，初始化时触发compiler编译，compiler编译结束时进行文件系统的监听
2.如果文件发生变化，会触发重新编译的回调
3.编译完成后，重新注册监听


# 参考文章
1. [轻松理解webpack热更新原理](https://juejin.cn/post/6844904008432222215)
2. [Webpack - HMR ](https://github.com/CommanderXL/Biu-blog/issues/51)
3. [webpack5 之 HMR 原理探究](https://xie.infoq.cn/article/2c3b795e7d538ed8b20988793)
4. [webpack官方文档](https://webpack.js.org/api/hot-module-replacement/)