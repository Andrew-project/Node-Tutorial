/**
 * Created by lsh on 16/11/26.
 */
//
// var server = require("./server");
// var router = require("./router");
// var requestHandlers = require("./requestHandlers");
//
// var handle = {};
// handle["/"] = requestHandlers.start;
// handle["/start"] = requestHandlers.start;
// handle["/upload"] = requestHandlers.upload;
//
// server.start(router.route, handle);

var express = require("express");
var http = require('http');
var fs = require('fs');
var url = require('url');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

var resData = '';
var methods = ["PUT", "POST", "GET", "DELETE", "PATCH"];

readFile('./requestUrl.json');

var errorList = [
    {
        "success": {
            "result": false,
            "code": 400,
            "msg": "param missing",
            "displayMsg": "缺少参数"
        }
    },
    {
        "success": {
            "result": false,
            "code": 404,
            "msg": "not found",
            "displayMsg": "NOT FOUND"
        }
    },
    {
        "success": {
            "result": false,
            "code": 405,
            "msg": "method error",
            "displayMsg": "请求方法错误"
        }
    },
    {
        "success": {
            "result": false,
            "code": 500,
            "msg": "Internal Error",
            "displayMsg": "服务器错误"
        }
    }
];

app.all('*', function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH");
        res.header("Content-Type", 'application/json; charset=utf-8');

        var pathName = url.parse(req.url).pathname;
        var jsonData = JSON.parse(resData);


        if (methods.indexOf(req.method) == -1) {
            res.send(errorList[2]);
        } else {
            for (var key in jsonData) {
                var re = eval(jsonData[key]);
                if (re.test(pathName)) {
                    var mdPath = './md/' + key + '.md';
                    fs.readFile(mdPath, 'utf8', function (err, data) {
                        if (err) {
                            // res.send(err);
                            throw err;
                        } else {
                            var sendData = "";
                            switch (req.method) {
                                case 'GET' || 'PATCH':
                                    sendData = getSendData(req.query, data);
                                    break;
                                case 'POST':
                                    sendData = getSendData(req.body, data);
                                    break;
                                default:
                                    break
                            }
                            console.log(sendData)
                            if (sendData == false) {
                                res.send(errorList[0]);
                            } else {
                                throw sendData;
                                res.send(sendData);
                            }
                        }
                    });
                    return;
                } else {
                    res.send(errorList[1]);
                }
            }
        }
        next();
});

function readFile(path) {
    fs.readFile(path, 'utf8', function (err, data) {
        if (err) {
        } else {
            resData = data;
        }
    });
}

function getSendData(params, data) {
    var testData = JSON.parse(data)["params"];
    for (var key in params) {
        if (testData[key] === undefined || objLen(params) != objLen(testData)) {
            return false;
        }
    }
    return JSON.parse(data)["testCase"]["default"].response;
}

function objLen(obj) {
    var len = 0;
    for (var key in obj) {
        len++;
    }
    return len;
}

app.listen(8888);