const test = "B.js";
import.meta.hot.acceptExports("test", (mod)=>{
    console.error("B.js热更新触发");
})
// 当acceptExports覆盖了所有export数据时，会强行设置isSelfAccepting=true
const test1 = "B5.js";
export {test, test1}