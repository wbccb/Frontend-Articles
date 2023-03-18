# 抛弃复杂分支，抓住核心点
1. 关注重点流程，抽离出核心步骤
2. 关注核心产物，比如NormalModule、ModuleGraph等等
3. 核心产物如果实在不明白作用，要主动调试，并且打印出来，示例就尤其重要
4. 要有耐心，一步一步来，因为实在太多callBack了

# 调试流程

1. 先查看所有代码，尽可能剥离出所有可能的核心流程，构建出下图
## ![make阶段.svg](https://wbccb.github.io/blog/image/webpack5-debugger-make1.svg)

2. 根据上图可能核心流程，将每一个流程有可能的代码进行补充，构建出下图
## ![make阶段.svg](https://wbccb.github.io/blog/image/webpack5-debugger-make2.svg)


3. 上图就是简化版本的代码，根据这个代码进行debugger调试，完善细节，删除不重要的步骤，构建出下图

