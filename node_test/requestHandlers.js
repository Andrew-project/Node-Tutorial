/**
 * Created by lsh on 16/11/26.
 */
var exec = require("child_process").exec;

function start(response) {
    console.log("-----Start-----");

    exec("ls -lah", function (error, stdout, stderr) {
        response.writeHead(200, {"Content-Type": "text/plain"});
        response.write(stdout);
        response.end();
    });
    function sleep(milliSeconds) {
        var startTime = new Date().getTime();
        while (new Date().getTime() < startTime + milliSeconds);
    }
    sleep(1000);
    return "Hello Start";
}

function upload() {
    return "Hello Upload";
}

exports.start = start;
exports.upload = upload;