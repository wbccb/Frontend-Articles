const axios = function (config) {
    // 执行ajax请求
    console.warn("axios触发！");

    return {code: 0, message: "成功"};
}



axios.interceptors = {
    request: {
        data: []
    },
    response: {
        data: []
    }
}
axios.interceptors.request.use = (fn, fn1) => {
    axios.interceptors.request.data.push({
        resolved: fn,
        rejected: fn1
    });
}
axios.interceptors.response.use = (fn, fn1) => {
    axios.interceptors.response.data.push({
        resolved: fn,
        rejected: fn1
    });
}

axios.run = (config) => {
    let chain = [{
        resolved: axios,
        rejected: undefined
    }];

    const requestArray = axios.interceptors.request.data;
    // 真实axios的拦截器是倒序的，即request2->request1->axios->response1->response2
    for (let i = 0; i < requestArray.length; i++) {
        const item = requestArray[i];
        chain.unshift(item);
    }

    const responseArray = axios.interceptors.response.data;
    for (let i = 0; i < responseArray.length; i++) {
        const item = responseArray[i];
        chain.push(item);
    }

    let promise = Promise.resolve(config);
    let i = 0;
    while (i < chain.length) {
        const {resolved, rejected} = chain[i];
        promise = promise.then(resolved, rejected);
        i++;
    }

    chain = [];
    return promise;
}


axios.interceptors.request.use(function (config) {
    console.log("interceptors request1 触发");
    return config;
}, function (error) {
    console.error("interceptors request1 error触发");
    return Promise.reject(error);
});

axios.interceptors.request.use(function (config) {
    console.log("interceptors request2 触发");
    return config;
}, function (error) {
    console.error("interceptors request2 error触发");
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    console.log("interceptors response1 触发");
    return response;
}, function (error) {
    console.error("interceptors response1 error触发");
    return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
    console.log("interceptors response2 触发");
    return response;
}, function (error) {
    console.error("interceptors response2 error触发");
    return Promise.reject(error);
});

axios.run({
    test: 1
}).then(res => {
    console.warn("最终请求返回结果是", res);
}).catch(error => {
    console.error("最终请求返回结果error是", error);
});


