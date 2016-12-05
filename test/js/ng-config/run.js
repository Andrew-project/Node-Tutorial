/**
 * Created by dongsj on 16/7/15.
 * app.run
 */
var imLoaded = 'false';
app.run(function ($rootScope, $window, $location, $$log, $$env, $$initRem, $$wx, $$shence, $$loading, $$navbar, $state, $$txIM, $$tabbar, $timeout) {
    // $$log.hideAll(true);
    $$log.showAll(true);
    $$shence.init();
    // $$log.showAll();
    $$env.setEnvirement('debug');
    // $$env.setEnvirement('debug');
    // $$env.setEnvirement('pro');
    $$initRem.init();
    $rootScope.$on('$locationChangeStart', locationChangeStart);
    $rootScope.$on('$locationChangeSuccess', locationChangeSuccess);
    $rootScope.$on('$stateChangeStart', stateChangeStart);
    $rootScope.$on('$stateChangeSuccess', stateChangeSuccess);
    function stateChangeStart($rootScope, $state) {
        // if (localStorage.lastPage == 'messageTag' && $state.name != 'messageTag') {
        //     $$log.debug('important!!!');
        //     $$log.debug(localStorage.lastPage);
        //     $$log.debug($state.name);
        //     localStorage.lastPage = $state.name;
        //     location.reload();
        // }
        // localStorage.lastPage = $state.name;
        // if ($state.name == 'messageTag') {
        // if (localStorage.messageTag === undefined) {
        //     localStorage.messageTag = 0;
        // }
        // localStorage.messageTag = parseInt(localStorage.messageTag) + 1;
        // if (parseInt(localStorage.messageTag) % 2 == 1) {
        //     location.href = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/messageTag';
        // }
        // }
        if (($state.name == 'allPatientList' || $state.name == 'toolList') && imLoaded == 'false') {
            var listeners = {
                "onMsgNotify": function (newMsgList) {
                    for (var i = 0; i < newMsgList.length; i++) {
                        addMsg(newMsgList[i]);
                    }
                }
            };
            var chatList = $$txIM.loadList();
            for (var i = 0; i < chatList.length; i++) {
                if (chatList[i].lastMsg.type != 'empty' && chatList[i].lastMsg.newMsg === true) {
                    $timeout(function () {
                        $$tabbar.setNewMsg(0, true);
                    }, 2000);
                }
            }
            var addMsg = function (msg) {
                var msgEle = $$txIM.createMsgEle(msg);
                if (!msgEle) {
                    return false;
                }
                // var lastEle = $$txIM.loadLastMsg(msgEle.fromAccount);
                // if (lastEle.fullTime == undefined || msgEle.fullTime > lastEle.fullTime) {
                $$tabbar.setNewMsg(0, true);
                // }
            };
            $$txIM.login(listeners, function () {
                imLoaded = 'true';
                $$txIM.sendIMArray();
                // $$txIM.getAllFriend(function (resp) {
                //     $$txIM.syncC2CMsgs(function (resp) {
                //         for (var i = 0; i < resp.length; i++) {
                //             if($$txIM.createMsgEle(resp[i]).fullTime>$$txIM.loadLastMsg(resp[i].fromAccount)){
                //                 addMsg(resp[i]);
                //             }
                //         }
                //     });
                // });
                // $$txIM.getAllGroup(function (resp) {
                //     // var groupIds=[];
                //     for (var i = 0; i < resp.GroupIdList.length; i++) {
                //         $$txIM.syncGROUPLastMsgs(resp.GroupIdList[i].GroupId, function (resp) {
                //             for (var i = 0; i < resp.length; i++) {
                //                 if($$txIM.createMsgEle(resp[i]).fullTime>$$txIM.loadLastMsg(resp[i].fromAccount)){
                //                     addMsg(resp[i]);
                //                 }
                //             }
                //         });
                //     }
                // });
            });
        }
        $$log.debug('stateChangeStart');
        $$log.info(arguments, 3);
        $$log.info($state);
        $$shence.track('__page_'+$state.name,{
            name:$state.name,
            url:$state.url,
            pre:sessionStorage.prePage
        });
        sessionStorage.prePage=$state.name;
        $$loading.show();
    }

    function stateChangeSuccess($rootScope) {
        $$log.debug('stateChangeSuccess');
        $$log.info(arguments, 3);
        $$loading.hide();
    }

    function locationChangeStart(event) {
        $$log.debug('locationChangeStart');
        $$log.info(arguments, 3);
        // wx.ready(function () {
        //     wx.hideOptionMenu();
        // });
    }

    function locationChangeSuccess(event) {
        $$log.debug('locationChangeSuccess');
        $$log.info(arguments, 3);
        $$loading.hide();
    }
});