/**
 * Created by dongsj on 16/9/19.
 */
app.directive('chatListController', function () {
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/chatListController.html',
        // require:'',
        // priority:'',
        replace: true,
        scope: {},
        controller: function ($scope, $$log, $$txIM, $$toast, $state,$interval) {
            $scope.goChat = function (chat) {
                localStorage.targetChatId = chat.chatId;
                imChatType = chat.type;
                // location.href = location.href.split('#')[0] + '#/chat';
                location.href = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/chat';
            };
            var addMsg = function (msg) {
                var msgEle = $$txIM.createMsgEle(msg, true);
                if (!msgEle) {
                    return false;
                }
                $$log.debug('add');
                $$log.info(msgEle);
                for (var i = 0; i < $scope.chatList.length; i++) {
                    if (($scope.chatList[i].chatId == msgEle.sessId && msgEle.fullTime > $scope.chatList[i].lastMsg.fullTime)
                        || ($scope.chatList[i].chatId == msgEle.sessId && $scope.chatList[i].lastMsg.fullTime == undefined)) {
                        $$log.debug('add2');
                        $$log.info(msgEle);
                        $$log.info($scope.chatList[i].lastMsg);
                        $scope.chatList[i].lastMsg = msgEle;
                        $scope.chatList[i].lastMsgTime = msgEle.fullTime;
                        $$log.debug('finded');
                        $$log.info(msgEle);
                        localStorage.chatList = JSON.stringify($scope.chatList);
                        $scope.$apply();
                    }
                    if ($scope.chatList[i].chatId == msgEle.sessId) {
                        localStorage.chatList = JSON.stringify($scope.chatList);
                        return false;
                    }
                }
                // $$toast.show('您有新的好友');
                // $$log.debug('new friend');
                // $$log.info(msg);
                // $scope.initList();
                // location.href = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/messageTag';

            };
            var listeners = {
                "onMsgNotify": function (newMsgList) {
                    try {
                        for (var i = 0; i < newMsgList.length; i++) {
                            addMsg(newMsgList[i]);
                        }
                    } catch (e) {
                        $$log.debug('page error');
                        // $$toast.show('您有新的消息');
                        // $scope.initList();
                        // location.href = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/messageTag';
                    }
                }
            };
            $scope.initList = function () {
                $$txIM.login(listeners, function () {
                    $$txIM.sendIMArray();
                    $$txIM.getAllFriend(function (resp) {
                        var inChatList = false;
                        for (var i = 0; i < resp.InfoItem.length; i++) {
                            inChatList = false;
                            for (var j = 0; j < $scope.chatList.length; j++) {
                                if ($scope.chatList[j].chatId == resp.InfoItem[i].Info_Account) {
                                    inChatList = true;
                                    var newMsg = $$txIM.loadLastMsg($scope.chatList[j].chatId);
                                    if ($scope.chatList[j].lastMsg.type == 'empty' || newMsg.fullTime > $scope.chatList[j].lastMsg.fullTime) {
                                        $scope.chatList[j].lastMsg = newMsg;
                                    }
                                }
                            }
                            if (!inChatList) {
                                $scope.chatList.push({
                                    chatId: resp.InfoItem[i].Info_Account,
                                    name: resp.InfoItem[i].SnsProfileItem[0].Value,
                                    type: 'C2C',
                                    lastMsg: $$txIM.loadLastMsg(resp.InfoItem[i].Info_Account),
                                    lastMsgTime: $$txIM.loadLastMsg(resp.InfoItem[i].Info_Account).fullTime,
                                    memberNum: 0
                                });
                                // localStorage.chatList = JSON.stringify($scope.chatList);
                            }
                        }
                        $$log.debug('C2C list loaded');
                        $$log.info($scope.chatList);
                        $$txIM.syncC2CMsgs(function (resp) {
                            $$log.debug('C2C syncC2CMsgs');
                            for (var i = 0; i < resp.length; i++) {
                                addMsg(resp[i]);
                            }
                        });
                        localStorage.chatList = JSON.stringify($scope.chatList);
                        $scope.$apply();
                    });
                    $$txIM.getAllGroup(function (resp) {
                        var inChatList = false;
                        for (var i = 0; i < resp.GroupIdList.length; i++) {
                            inChatList = false;
                            for (var j = 0; j < $scope.chatList.length; j++) {
                                if ($scope.chatList[j].chatId == resp.GroupIdList[i].GroupId) {
                                    inChatList = true;
                                    var newMsg = $$txIM.loadLastMsg($scope.chatList[j].chatId);
                                    if ($scope.chatList[j].lastMsg.type == 'empty' || newMsg.fullTime > $scope.chatList[j].lastMsg.fullTime) {
                                        $scope.chatList[j].lastMsg = newMsg;
                                    }
                                }
                            }
                            if (!inChatList) {
                                $scope.chatList.push({
                                    chatId: resp.GroupIdList[i].GroupId,
                                    name: resp.GroupIdList[i].Name,
                                    type: 'GROUP',
                                    lastMsg: $$txIM.loadLastMsg(resp.GroupIdList[i].GroupId),
                                    lastMsgTime: $$txIM.loadLastMsg(resp.GroupIdList[i].GroupId).fullTime,
                                    memberNum: resp.GroupIdList[i].MemberNum
                                });
                            }
                            // groupIds.push(resp.GroupIdList[i].GroupId);
                            $$txIM.syncGROUPLastMsgs(resp.GroupIdList[i].GroupId, function (resp) {
                                for (var i = 0; i < resp.length; i++) {
                                    addMsg(resp[i]);
                                }
                            });
                        }
                        $$log.debug('GROUP list loaded');
                        $$log.info($scope.chatList);
                        localStorage.chatList = JSON.stringify($scope.chatList);
                        $scope.$apply();
                    });
                });
            };
            $scope.chatList = $$txIM.loadList();
            $scope.initList();
            $interval(function(){
                $scope.initList();
            },60000)
        }
    };
});

