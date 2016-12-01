/**
 * Created by lsh on 16/11/26.
 */

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

    var out = fs.createWriteStream("./request.log");
    out.write("method: " + req.method + '\r\n');
    out.write("url: " + req.url + '\r\n');
    out.write("请求对象: " + JSON.stringify(req.headers) + '\r\n');
    out.end("VISOION:" + req.httpVersion);

        if (methods.indexOf(req.method) == -1) {
            res.send(errorList[2]);
        } else {
            var pathName = url.parse(req.url).pathname;

            var jsonData = JSON.parse(resData);

            if (jsonData["success"] != undefined) {
                res.send(jsonData);
            } else {
                for (var key in jsonData) {
                    var re = eval(jsonData[key]);
                    if (re.test(pathName)) {
                        var mdPath = './md/' + key + '.md';
                        fs.readFile(mdPath, 'utf8', function (err, data) {
                            if (err) {
                                res.send(errorList[3]);
                            } else {
                                var simplyData = data.replace(/[\r\n]/g,"");
                                var noteIdxArr = getIdxArr(simplyData, "<", ">");
                                var noteArr = [];
                                var mdData = simplyData;

                                console.log(noteIdxArr);
                                console.log(simplyData);

                                for (var i=0; i< noteIdxArr.length; i++) {
                                    noteArr.push(mdData.slice(noteIdxArr[i].left, noteIdxArr[i].right + 1))
                                    mdData = simplyData;
                                }
                                for (var m=0; m < noteArr.length; m++) {
                                    var noteStr = noteArr[m];
                                    noteStr = new RegExp(noteStr, 'g');
                                    simplyData = simplyData.replace(noteStr, "");
                                }
                                var sendData = JSON.parse(simplyData)["testCase"]["default"];
                                res.send(sendData);
                            }
                        });
                        return;
                    }
                }
                res.send(JSON.stringify(errorList[1]));
            }
        }
        next();
});

function readFile(path) {
    fs.readFile(path, 'utf8', function (err, data) {
        if (err) {
            resData = JSON.stringify(errorList[3]);
        } else {
            resData = data;
        }
    });
}

function getIdxArr(str, left, right) {
    var idxArr = [];
    for (var j=0; j< str.length; j++) {
        var item = {};

        if (str[j] == left) {
            item["left"] = j;
            for (var m=j+1; m< str.length; m++) {
                if (str[m] == right) {
                    item["right"] = m;
                    j = m;
                    break;
                }
            }
            idxArr.push(item);
        }
    }
    return idxArr;
}

app.listen(8888);