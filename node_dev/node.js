/**
 * Created by lsh on 16/11/26.
 */

var express = require("express");
var http = require('http');
var fs = require('fs');
var url = require('url');
var app = express();
var router = express.Router();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

var resData = readFile('./node_dev/requestUrl.json');

var errorList = [
    {
        "result": {
            "success": false,
            "code": 400,
            "msg": "param missing",
            "displayMsg": "缺少参数"
        }
    },
    {
        "result": {
            "success": false,
            "code": 404,
            "msg": "not found",
            "displayMsg": "NOT FOUND"
        }
    },
    {
        "result": {
            "success": false,
            "code": 405,
            "msg": "method error",
            "displayMsg": "请求方法错误"
        }
    },
    {
        "result": {
            "success": false,
            "code": 500,
            "msg": "Internal Error",
            "displayMsg": "服务器错误"
        }
    }
];

var resultErr = {
    "result": {
        "success": false,
        "displayMsg": "error"
    }
};
router.all('/*', function (req, res, next) {
    var out = fs.createWriteStream("./logs/request.log");
    out.write("method: " +resData + '\r\n');
    out.write("url: " + req.url + '\r\n');
    out.write("body: " + JSON.stringify(req.body) + '\r\n');
    out.write("请求对象: " + JSON.stringify(req.headers) + '\r\n');
    out.end("VISOION:" + req.httpVersion);

    var pathName = req.url;

    var jsonData = {};
    try {
        jsonData = JSON.parse(resData);
    } catch (e) {
        resultErr.result.displayMsg = JSON.stringify("requestUrl.json -> " + e.toString());
        res.send(resultErr);
    }

    if (jsonData["success"] != undefined) {
        res.send(jsonData);
    } else {
        for (var key in jsonData) {
            var re = eval(jsonData[key]);
            if (re.test(pathName)) {
                var mdPath = './node_dev/md/' + key + '.md';
                fs.readFile(mdPath, 'utf8', function (err, data) {
                    if (err) {
                        res.send(errorList[3]);
                    } else {
                        var simplyData = data.replace(/[\r\n]/g,"");
                        var noteIdxArr = getIdxArr(simplyData, "<", ">");
                        var noteArr = [];
                        var mdData = simplyData;

                        for (var i=0; i< noteIdxArr.length; i++) {
                            noteArr.push(mdData.slice(noteIdxArr[i].left, noteIdxArr[i].right + 1))
                            mdData = simplyData;
                        }
                        for (var m=0; m < noteArr.length; m++) {
                            var noteStr = noteArr[m];
                            noteStr = new RegExp(noteStr, 'g');
                            simplyData = simplyData.replace(noteStr, "");
                        }
                        var sendData = '';
                        try {
                            var testData = JSON.parse(simplyData)["testCase"];
                            for (var i=0; i<testData.length; i++ ) {
                                if (testData[i].name == 'default') {
                                    sendData = testData[i].response[req.method];
                                    break;
                                } else {
                                    resultErr.result.displayMsg = "test标识无法识别";
                                    sendData = resultErr;
                                }
                            }
                        } catch(err) {
                            resultErr.result.displayMsg = JSON.stringify(key + " -> " + err.toString());
                            sendData = resultErr;
                        }
                        res.send(sendData);
                    }
                });
                return;
            }
        }
        res.send(JSON.stringify(errorList[1]));
    }
    // next();
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

module.exports = router;