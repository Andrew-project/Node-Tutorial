var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// var fs = require('fs');
// var fileStreamRotator = require('file-stream-rotator');
// var url = require('url');
// var logDir = path.join(__dirname, 'logs');
// fs.existsSync(logDir) || fs.mkdirSync(logDir); // ensure log directory exists

var app = express();

// 缓存
option = {maxAge: 30000};

//切换配置环境
// pro --> pro 正式环境， test --> test 测试环境， dev --> src 本地环境
const TARGET = process.env.npm_lifecycle_event;

if (TARGET == 'pro') {
    app.use("/pro/js", express.static(__dirname + "/pro/js", option));
    app.use("/pro/img", express.static(__dirname + "/pro/img", option));
    app.use("/pro/css", express.static(__dirname + "/pro/css", option));
    app.use("/pro/iconfont", express.static(__dirname + "/pro/iconfont", option));
    app.use("/pro/templates", express.static(__dirname + "/pro/templates", option));

    app.use("/*", function (req, res, next) {
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
    app.use("/test/iconfont", express.static(__dirname + "/test/iconfont", option));
    app.use("/test/templates", express.static(__dirname + "/test/templates", option));

    app.use("/*", function (req, res, next) {
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

var router = require('./node_dev/node');

if (TARGET == 'dev') {
    app.use("/src/js", express.static(__dirname + "/src/js", option));
    app.use("/src/img", express.static(__dirname + "/src/img", option));
    app.use("/src/css", express.static(__dirname + "/src/css", option));
    app.use("/src/iconfont", express.static(__dirname + "/src/iconfont", option));
    app.use("/src/templates", express.static(__dirname + "/src/templates", option));

    app.use('/src/json', router);
    app.use("/*", function (req, res, next) {
        res.sendfile("src/index.html");
    });

    app.use(logger('combined'));
    app.use(express.static(path.join(__dirname, 'src')));
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
