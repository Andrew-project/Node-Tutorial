var express = require("express");
var http = require('http');
var fs = require('fs');
var url = require('url');
var app = express();


getPromise('./node_dev/config.md').then(function (data) {
    matchPath(data);
});

function getPromise(path) {
    var promise = new Promise(function(resolve, reject){
        fs.readFile(path, 'utf8', function(err, data) {
            if (err) {
                reject(err);
            } else {
                resolve(data)
            }
        })
    });
    return promise;
}

function matchPath(pathData) {
    var config = eval(pathData);
    console.log(typeof config)
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
}

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
        console.log(rx);
        rx = new RegExp(rx);
        console.log(rx)
        return rx.test(request_url);
    }
}

app.listen(5000)