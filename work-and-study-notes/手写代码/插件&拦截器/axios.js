function ajaxPost(url, data = {}, isJSON = false) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        // readyState=0:代理被创建，但是还没有调用open()方法

        let body;
        if (!isJSON) {
            const {email, password} = data;
            body = "email=" + encodeURIComponent(email) + "&password=" + encodeURIComponent(password);
        } else {
            body = data;
        }

        xhr.open("POST", url, true);
        // readyState=1:open方法已经被调用

        xhr.onreadystatechange = function (name) {
            // readyState=3:下载中....responseText属性已经包含部分数据

            // readyState=4:下载操作已经完成
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                } else if (xhr.status === 404) {
                    reject("404 NOT Found")
                } else {
                    reject(xhr.status);
                }
            }
        }
        if (!isJSON) {
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        } else {
            xhr.setRequestHeader("Content-Type", "application/json");
        }

        xhr.send(body);
        // readyState=2:send()方法已经调用
    });
}

function ajaxGet(url) {
    return new Promise((resolve, reject) => {

        const xhr = new XMLHttpRequest();
        // readyStatus=0: 已经建立了XML，但是还没有调用open

        xhr.open("GET", url, true); // 数据拼接在url中
        // readyStatus=1: 已经调用了open()，但是还没调用send

        xhr.onreadystatechange = function (name) {
            // readyState=3: 下载中，responseText属性已经包含了部分数据
            // readyState=4: 下载操作已经完成
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    resolve(xhr.responseText);
                } else if (xhr.status === 404) {
                    reject("404 NOT Found");
                } else {
                    reject(xhr.status);
                }
            }
        }

        xhr.send(null);
    });
}


const axios = function (config) {
    // 执行ajax请求
    console.warn("axios触发！", config);

    const {url, method} = config;
    if(method === "GET") {
        return ajaxGet(url);
    } else if(method === "POST") {
        return ajaxPost(url, config);
    }

    return Promise.reject("method为空");
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

    const axiosResolved = axios.bind(null, config);

    let chain = [{
        resolved: axiosResolved,
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

// 在百度的域名下打包Console直接运行，避免跨域错误
axios.run({
    method: "GET",
    url: "https://baike.baidu.com/item/%E6%96%87%E6%9C%AC/5443630"
}).then(res => {
    console.warn("最终请求返回结果是", res);
}).catch(error => {
    console.error("最终请求返回结果error是", error);
});


