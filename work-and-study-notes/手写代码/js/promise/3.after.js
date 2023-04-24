// 类似webpack中的代码，需要执行多次才能结束
// 也类似于Promise.all()，需要收集一定次数才能结束


// time是次数
// cb是最终的回调，处理一定次数后进行cb回调
function after(time, cb) {

    const result = {};

    return (key, value)=> {
        time--;
        result[key] = value;
        if(time === 0) {
            cb(result);
        }
    }
}


let out = after(2, (result)=> {
    console.log("收集到了所有的结果", result);
});


out("1", "1");
out("2", "2");