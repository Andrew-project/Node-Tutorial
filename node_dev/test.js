var express = require("express");
var http = require('http');
var fs = require('fs');
var url = require('url');
var app = express();
var router= express.Router();

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


// getPromise('./node_dev/config.md').then(function (data) {
//     matchPath(data);
// }).then(function (err) {
//     console.log(err)
// })
//
// function getPromise(path) {
//     var promise = new Promise(function(resolve, reject){
//         fs.readFile(path, 'utf8', function(err, data) {
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
// fs.readFile('./node_dev/config.md', 'utf8', function (err, data) {
//     if (err) {
//
//     } else {
//         matchPath(data);
//     }
// });

var pathData = fs.readFileSync('./node_dev/config.md', 'utf8');

// function matchPath(pathData) {
    var config = eval(pathData);
    router.all("/*", function (req, res, next) {
        for (var i = 0; i < config.length; i++) {
            if (IsOkOfUrl(config[i].url, req.url)) {
                fun(config[i].url, config[i].path);
                break;
            }
        }
        res.send(errorList[1]);
        next();
    });
// }

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
        for (var i=0; i< arr.length; i++) {
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

app.listen(5000)