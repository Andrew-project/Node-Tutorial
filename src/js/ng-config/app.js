/**
 * Created by dongsj on 16/7/15.
 * angular APP
 */
var appStoreName = '测试';
var app = angular.module('YHZS', ["ui.router"]);
var myChatInfo = undefined;
if (localStorage['getMyChatInfo']) {
    myChatInfo = JSON.parse(localStorage['getMyChatInfo']).date;
}
var imChatType = undefined;

mui.init({
    keyEventBind: {
        backbutton: true
    }
});

