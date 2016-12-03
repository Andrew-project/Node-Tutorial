var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var fileStreamRotator = require('file-stream-rotator');

var url = require('url');
var app = express();

var logDir = path.join(__dirname, 'logs');
fs.existsSync(logDir) || fs.mkdirSync(logDir); // ensure log directory exists

// 缓存
option = {maxAge: '1d'};

//切换配置环境
const TARGET = process.env.npm_lifecycle_event;

if (TARGET == 'pro') {
  app.use("/pro/js", express.static(__dirname + "/pro/js", option));
  app.use("/pro/img", express.static(__dirname + "/pro/img", option));
  app.use("/pro/css", express.static(__dirname + "/pro/css", option));
  app.use("/pro/templates", express.static(__dirname + "/pro/templates", option));

  app.use("/*", function(req, res, next) {
    res.sendfile("pro/index.html");
  });

  app.use(logger('combined')); //终端输出日志
  // var accessLogStream = fileStreamRotator.getStream({
  //   date_format: 'YYYYMMDD',
  //   filename: path.join(logDir, 'access-' + 'pro' + '-%DATE%.log'),
  //   frequency: 'daily',
  //   verbose: true
  // }); // create a rotating write stream
  // app.use(logger('common', {stream: accessLogStream})); //文件输出日志

  app.use(express.static(path.join(__dirname, 'pro')));
}

if (TARGET == 'test') {
  app.use("/test/js", express.static(__dirname + "/test/js", option));
  app.use("/test/img", express.static(__dirname + "/test/img", option));
  app.use("/test/css", express.static(__dirname + "/test/css", option));
  app.use("/test/templates", express.static(__dirname + "/test/templates", option));

  app.use("/*", function(req, res, next) {
    res.sendfile("test/index.html");
  });

  app.use(logger('combined')); //终端输出日志
  // var accessLogStream = fileStreamRotator.getStream({
  //   date_format: 'YYYYMMDD',
  //   filename: path.join(logDir, 'access-' + 'test' + '-%DATE%.log'),
  //   frequency: 'daily',
  //   verbose: true
  // }); // create a rotating write stream
  // app.use(logger('common', {stream: accessLogStream})); //文件输出日志

  app.use(express.static(path.join(__dirname, 'test')));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


if (TARGET == 'dev') {
  var resData = '';

  readFile('./node_dev/requestUrl.json');

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
  app.all('/src/api/*', function (req, res, next) {
    var out = fs.createWriteStream("./logs/request.log");
    out.write("method: " + req.method + '\r\n');
    out.write("url: " + req.url + '\r\n');
    out.write("body: " + JSON.stringify(req.body) + '\r\n');
    out.write("请求对象: " + JSON.stringify(req.headers) + '\r\n');
    out.end("VISOION:" + req.httpVersion);

    var pathName = url.parse(req.url).pathname;
    pathName = pathName.replace("/src", "");

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
}

if (TARGET == 'dev') {
  app.use("/src/js", express.static(__dirname + "/src/js", option));
  app.use("/src/img", express.static(__dirname + "/src/img", option));
  app.use("/src/css", express.static(__dirname + "/src/css", option));
  app.use("/src/json", express.static(__dirname + "/src/json", option));
  app.use("/src/templates", express.static(__dirname + "/src/templates", option));

  app.use("/*", function(req, res, next) {
    res.sendfile("src/index.html");
  });
  // app.use("/*", function (req, res) {
  //   if(req.path.indexOf('/api')>=0){
  //     res.send("server text");
  //   }else{
  //     res.sendfile('src/index.html');
  //   }
  // });

  app.use(logger('combined'));
  app.use(express.static(path.join(__dirname, 'src')));
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
