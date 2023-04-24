function debounce(fn, time) {
    // 必须超过time才调用fn，否则就延迟调用fn

    // 适用于不停输入，不停触发fn延后执行
    let timer = null;
    return (...args)=> {
        if(timer) {
            clearTimeout(timer);
            timer = null;
        }

        timer = setTimeout(()=> {
            fn(...args);
        }, time);
    }
}

const inputChange = debounce(()=> {
    // 如果停止输入1秒后，才把这个值往外传递
    console.info("防抖触发");
}, 1000);

document.getElementById("input").onchange = (e)=> {
    // inputChange(e.target.value) 如果1毫秒触发一次，会在最后一次的1秒后才回调fn()=console.info("防抖触发");
}


// 必须超过wait时间才能触发一次，用于控制时间，如果过于频繁，会消耗性能，比如1秒只能触发2次，那就可以1000/2=500等待时间
function throttle(fn, wait=50) {

    let time = new Date().getTime();

    return ()=> {
        if(new Date().getTime() - time > wait) {
            const args = Array.prototype.slice(arguments);
            time = new Date().getTime();
            fn.apply(this, args);
        }
    }
}
