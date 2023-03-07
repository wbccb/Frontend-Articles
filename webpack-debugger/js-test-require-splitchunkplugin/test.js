// 由于计算代码和合并代码逻辑揉杂在一起，因此调整了代码顺序，增强可读性
renderMain(renderContext, hooks, compilation) {
    let source = new ConcatSource();
    const iife = runtimeTemplate.isIIFE();
    // 1. 计算出"function __webpack_require__(moduleId)"等代码
    const bootstrap = this.renderBootstrap(renderContext, hooks);
    // 2. 计算出所有module的代码
    const chunkModules = Template.renderChunkModules(
        chunkRenderContext,
        inlinedModules
            ? allModules.filter(m => !inlinedModules.has(m))
            : allModules,
        module => this.renderModule(module, chunkRenderContext, hooks, true),
        prefix
    );
    // 3. 计算出运行时的代码
    const runtimeModules =
        renderContext.chunkGraph.getChunkRuntimeModulesInOrder(chunk);

    // 1. 合并立即执行函数的最头部的代码，一个(()=> {
    if (iife) {
        if (runtimeTemplate.supportsArrowFunction()) {
            source.add("/******/ (() => { // webpackBootstrap\n");
        } else {
            source.add("/******/ (function() { // webpackBootstrap\n");
        }
        prefix = "/******/ \t";
    } else {
        prefix = "/******/ ";
    }
    // 2. 合并所有module的代码
    if (
        chunkModules ||
        runtimeRequirements.has(RuntimeGlobals.moduleFactories) ||
        runtimeRequirements.has(RuntimeGlobals.moduleFactoriesAddOnly) ||
        runtimeRequirements.has(RuntimeGlobals.require)
    ) {
        source.add(prefix + "var __webpack_modules__ = (");
        source.add(chunkModules || "{}");
        source.add(");\n");
        source.add(
            "/************************************************************************/\n"
        );
    }
    // 3. 合并"__webpack_module_cache__ = {};function __webpack_require__(moduleId)"等加载代码
    if (bootstrap.header.length > 0) {
        const header = Template.asString(bootstrap.header) + "\n";
        source.add(
            new PrefixSource(
                prefix,
                useSourceMap
                    ? new OriginalSource(header, "webpack/bootstrap")
                    : new RawSource(header)
            )
        );
        source.add(
            "/************************************************************************/\n"
        );
    }
    // 4. 合并runtime模块代码
    if (runtimeModules.length > 0) {
        source.add(
            new PrefixSource(
                prefix,
                Template.renderRuntimeModules(runtimeModules, chunkRenderContext)
            )
        );
        source.add(
            "/************************************************************************/\n"
        );
        // runtimeRuntimeModules calls codeGeneration
        for (const module of runtimeModules) {
            compilation.codeGeneratedModules.add(module);
        }
    }
    // 5. 合并"Load entry module and return exports"等代码，即立即执行函数中的执行入口文件解析的代码部分
    // 主动触发入口文件的加载
    source.add(
        new PrefixSource(
            prefix,
            new ConcatSource(
                toSource(bootstrap.beforeStartup, "webpack/before-startup"),
                "\n",
                hooks.renderStartup.call(
                    toSource(bootstrap.startup.concat(""), "webpack/startup"),
                    lastEntryModule,
                    {
                        ...renderContext,
                        inlined: false
                    }
                ),
                toSource(bootstrap.afterStartup, "webpack/after-startup"),
                "\n"
            )
        )
    );
    // 6. 合并立即执行函数的最后最后的代码
    if (iife) {
        source.add("/******/ })()\n");
    }
}