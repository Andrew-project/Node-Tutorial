/**
 * Created by lsh on 16/11/26.
 */

var http = require("http");
var url = require("url");
var fs = require("fs");

function setLog(req) {
    var out = fs.createWriteStream("./request.log");
    out.write("method: " + req.method + '\r\n');
    out.write("url: " + req.url + '\r\n');
    out.write("请求对象: " + JSON.stringify(req.headers) + '\r\n');
    out.end("VISOION:" + req.httpVersion);
}

function resData(req, res) {
    res.writeHead(200, {"Content-Type":'application/json','charset':'utf-8','Access-Control-Allow-Origin':'http://localhost:63342'});
    var fileStr = '';
    if (req.method === 'GET') {
        fileStr = './userInfo.md';
    } else {
        fileStr = './login.md';
    }
    var result = '';
    fs.readFile('./result.md', 'utf8', function (err, data) {
        if (err) {
            result = JSON.stringify(JSON.parse(data).testCase.error);
        } else {
            result = JSON.stringify(JSON.parse(data).testCase.success);
        }
    });
    fs.readFile(fileStr, 'utf8', function (err, data) {
        var resData = '';
        data = JSON.stringify(JSON.parse(data).testCase["default"].response);
        if (err) {

        } else {
            resData = '{"result"' + ':' + result + ","  +'"data"'+ ':' + data + '}';
        }
        res.write(resData);
        res.end();
    });
}
function start(route, handle) {
    function onRequest(request, response) {
        if (request.url != "/favicon.ico") {
            // var pathname = url.parse(request.url).pathname;
            request.on('data', function (data) {
                console.log("服务端接收到的数据是: " + decodeURIComponent(data));
            });

            request.on('end', function () {
                console.log("数据接收完毕");
            });

            resData(request, response);
            setLog(request);
        }

        //
        // route(handle, pathname, response);
        // // response.writeHead(200, {"Content-Type": "text/plain"});
        // var content = route(handle, pathname);
        // response.write(content);
    }
    http.createServer(onRequest).listen(8888);

    // function execute(someF, value) {
    //     someF(value);
    // }
    //
    // execute(function (word) {
    //     console.log(word);
    // }, "Hello");

}

exports.start = start;
