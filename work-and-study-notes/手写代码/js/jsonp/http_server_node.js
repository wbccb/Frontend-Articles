const http = require("http");
const url = require("url");

const server = http.createServer(function(request, response) {
    if(request.url === "/favicon.io") {
        return;
    }

    // 拼接返回的数据
    const parseUrl = url.parse(request.url, true);
    const fnName = parseUrl.query.callback;
    response.writeHead(200, {"Content-Type":"text/plain;charset=utf-8"});
    const data = "{data: 27}";
    console.log(fnName);
    const str = fnName + `(${data})`;
    response.end(str);
});


server.listen(3002, function(){
   console.log("server is starting on the 3002");
});