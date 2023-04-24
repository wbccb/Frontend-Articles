//AOP的高阶函数的应用，传入一个核心函数，后面跟着数组的方法，类似vuex拦截器subscribers,
// vuex会先执行所有的before，然后执行核心函数，然后执行after

function perform(anyMethod, wrappers) {
    return ()=> {
        // 顺序遍历，从index=0开始遍历
        wrappers.forEach((item)=> item.before());
        anyMethod();
        // 顺序遍历，从index=0开始遍历
        wrappers.forEach((item)=> item.after());
    }
}


const newFn = perform(()=> {
    // 核心方法
    console.info("插件核心方法");
}, [
    {
        before() {
            console.log("插件1 before");
        },
        after() {
            console.log("插件1 after");
        }
    },
    {
        before() {
            console.log("插件2 before");
        },
        after() {
            console.log("插件2 after");
        }
    }
]);

newFn();

