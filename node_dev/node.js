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
            "displayMsg": "请检查请求URL与config文件是否一致"
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

// function getPromise(path) {
//     var promise = new Promise(function(resolve, reject){
//             fs.readFile(path, 'utf8', function(err, data) {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(data)
//             }
//         })
//     });
//     return promise;
// }
//
//
// getPromise('./node_dev/config.md').then(function (data) {
//     matchPath(data);
// });

var configData = fs.readFileSync('./node_dev/config.md', 'utf8');
var config = eval(configData);

router.all("/*", function (req, res) {
    for (var i = 0; i < config.length; i++) {
        if (IsOkOfUrl(config[i].url, req.url) && config[i].method == req.method) {
            res.send(fun(config[i].path, req));
            break;
        }
    }
    res.send(errorList[1]);
});


function fun (path, req) {
    var data = fs.readFileSync(path, 'utf8');
    var simplyData = data.replace(/[\r\n]/g, "");
    var noteIdxArr = getIdxArr(simplyData, "<", ">");
    var noteArr = [];
    var mdData = simplyData;

    for (var i = 0; i < noteIdxArr.length; i++) {
        noteArr.push(mdData.slice(noteIdxArr[i].left, noteIdxArr[i].right + 1))
        mdData = simplyData;
    }
    for (var m = 0; m < noteArr.length; m++) {
        var noteStr = noteArr[m];
        noteStr = new RegExp(noteStr, 'g');
        simplyData = simplyData.replace(noteStr, "");
    }
    simplyData = "{" + simplyData + "}";
    var sendData = '';
    try {
        var testData = JSON.parse(simplyData);
        if (testData["method"] == req.method) {
            testData = testData["testCase"];
            for (var i = 0; i < testData.length; i++) {
                if (testData[i].name == 'default') {
                    sendData = testData[i].response;
                    break;
                } else {
                    resultErr.result.displayMsg = "请确定数据格式是否正确";
                    sendData = resultErr;
                }
            }
        } else {
            resultErr.result.displayMsg = "请检查" + path + "内method参数是否写错!";
            sendData = resultErr;
        }
    } catch (err) {
        resultErr.result.displayMsg = JSON.stringify(path + " -> " + err.toString());
        sendData = resultErr;
    }
    return sendData;
};


function getIdxArr(str, left, right) {
    var idxArr = [];
    for (var j = 0; j < str.length; j++) {
        var item = {};

        if (str[j] == left) {
            item["left"] = j;
            for (var m = j + 1; m < str.length; m++) {
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

function IsOkOfUrl(local_url, request_url) {
    if (local_url == request_url) {
        return true;
    } else {
        var arr = local_url.split("/");
        arr.splice(0, 1);
        var rx = '^';
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].indexOf(":") != -1) {
                rx = rx + "\\/" + "[1-9]+[0-9]{0,}";
            } else {
                rx = rx + "\\/" + arr[i];
            }
        }
        rx = rx + "$";
        rx = new RegExp(rx);
        return rx.test(request_url);
    }
}

module.exports = router;