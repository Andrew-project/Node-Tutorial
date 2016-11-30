/**
 * Created by dongsj on 16/8/16.
 */
app.directive('chatController', function () {
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/chatController.html',
        // require:'',
        // priority:'',
        replace: true,
        scope: {
            // data: '=data',
            // userId:'=userId'
            // myUserId: '@',
            // myUserHead: '@',
            // myUserSig: '@',
            // targetUserId: '@',
            // targetUserHead: '@',
            // chatType: '@'
        },
        controller: function ($scope, $element, $attrs, $$log, $timeout, $$loading, $$txIM, $$toast, $state, $$title, $$confirm) {
            // $scope.targetUserId = sessionStorage.saveChatTargetId;
            // $scope.targetUserHead = sessionStorage.saveChatTargetHead;
            // $scope.targetNickname = sessionStorage.saveChatTargetNickname;
            // $scope.myUserId = sessionStorage.saveChatMyId;
            // $scope.myUserSig = sessionStorage.saveChatMySig;
            // $scope.myUserHead = sessionStorage.saveChatMyHead;
            // var defaultUserHead = 'http://123.57.52.12:7963/img/userHead.jpg';
            // $scope.myUserHead = sessionStorage.saveChatMyHead || defaultUserHead;
            // $scope.targetUserHead = $scope.targetUserHead || defaultUserHead;
            $$loading.show();
            $scope.msg = '';
            $scope.rows = 1;
            // $scope.msgArray = localStorage['chatList:'+localStorage.targetChatId]==undefined?[]:JSON.parse(localStorage['chatList:'+localStorage.targetChatId]);
            $scope.msgArray = [];
            $scope.updateGroupInfo = function () {
                if (localStorage.targetChatId.indexOf('@') >= 0) {
                    $$confirm.show({
                        title: '修改群组名称',
                        msg: '<input class="h3 border-line border-color-global-base" type="text">',
                        callback: function () {
                            var name = $('.confirm').find('input').val();
                            $$txIM.updateGroupInfo(localStorage.targetChatId, name, function () {
                                $$title.setTitle(name + '(' + $('.titleContent').html().split('(')[1]);
                            }, function () {

                            })
                        },
                        confirmText: '确定',
                        cancelText: '取消'
                    });
                }
            };
            $scope.gotoMsgTag = function () {
                location.href = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/messageTag';
            };
            var addMsg = function (msg) {
                $$log.log('addMsg');
                $$log.debug(msg);
                var msgEle = $$txIM.createMsgEle(msg, false);
                if (!msgEle) {
                    return false;
                }
                for (var i = 0; i < $scope.msgArray.length; i++) {
                    if ($scope.msgArray[i].fullTime == msgEle.fullTime && $scope.msgArray[i].fromAccount == msgEle.fromAccount && $scope.msgArray[i].msg == msgEle.msg) {
                        return false;
                    }
                }
                $scope.msgArray.push(msgEle);
                $scope.$apply();
                // if (myChatInfo.id != msg.fromAccount) {
                $$txIM.saveLastMsg(msgEle);
                $$txIM.markReadLastMsg(localStorage.targetChatId);
                $$txIM.setRead(localStorage.targetChatId);
                // }
                $scope.iscroll.refresh();
                $scope.iscroll.scrollToElement('.msgBlock:last-of-type', 0);
                localStorage['chatList:' + localStorage.targetChatId] = JSON.stringify($scope.msgArray);
            };
            var listeners = {
                "onMsgNotify": function (newMsgList) {
                    for (var i = 0; i < newMsgList.length; i++) {
                        if (newMsgList[i].fromAccount != myChatInfo.id && newMsgList[i].sess._impl.id == localStorage.targetChatId) {
                            addMsg(newMsgList[i]);
                        }
                    }
                }
            };

            function loadHistory() {
                $$txIM.getHistoryMsgs(function (resp) {
                    $$txIM.markReadLastMsg(localStorage.targetChatId);
                    var msgEle;
                    for (var i = resp.length - 1; i >= 0; i--) {
                        msgEle = $$txIM.createMsgEle(resp[i], false);
                        if (!msgEle) {
                            continue;
                        }
                        var inArray = false;
                        for (var j = 0; j < $scope.msgArray.length; j++) {
                            if ($scope.msgArray[j].fullTime == msgEle.fullTime && $scope.msgArray[j].fromAccount == msgEle.fromAccount && $scope.msgArray[j].msg == msgEle.msg) {
                                inArray = true;
                            }
                        }
                        if (!inArray) {
                            $scope.msgArray.unshift(msgEle);
                        }
                    }
                    for (i = resp.length - 1; i >= 0; i--) {
                        msgEle = $$txIM.createMsgEle(resp[i], false);
                        if (msgEle != false && msgEle != undefined && msgEle.type != undefined) {
                            $$txIM.saveLastMsg(msgEle);
                            $$txIM.setRead(localStorage.targetChatId);
                            break;
                        }
                    }
                    $scope.$apply();
                    $scope.iscroll.refresh();
                    $scope.iscroll.scrollToElement('.msgBlock:last-of-type', 0);
                    $$txIM.sendIMArray(function (resp) {
                        for (var i = resp.length - 1; i >= 0; i--) {
                            var msgEle = $$txIM.createMsgEle(resp[i], false);
                            if (!msgEle) {
                                continue;
                            }
                            $scope.msgArray.push(msgEle);
                        }
                        $scope.$apply();
                        $scope.iscroll.refresh();
                        $scope.iscroll.scrollToElement('.msgBlock:last-of-type', 0);
                    });
                    $$txIM.saveLastMsg($scope.msgArray[$scope.msgArray.length - 1]);
                });
            }

            $$txIM.login(listeners, function () {
                $timeout(function () {
                    $$loading.hide();
                }, 1000);
                $scope.myUserId = myChatInfo.id;
                $scope.msgArray = [];
                $$txIM.markReadLastMsg(myChatInfo.id, localStorage.targetChatId);
                if (localStorage.targetChatId.indexOf('@') < 0) {
                    $$log.debug('C2C');
                    $$log.debug(localStorage.targetChatId);
                    $$txIM.getC2CInfo([localStorage.targetChatId], function (resp) {
                        for (var i = 0; i < resp.UserProfileItem[0].ProfileItem.length; i++) {
                            if (resp.UserProfileItem[0].ProfileItem[i].Tag == 'Tag_Profile_IM_Nick') {
                                $$title.setTitle(resp.UserProfileItem[0].ProfileItem[i].Value);
                                break;
                            }
                        }
                    });
                    $$txIM.syncC2CMsgs(function (newMsgList) {
                        // if (newMsgList.length >= 15) {
                        for (var i = 0; i < newMsgList.length; i++) {
                            if (newMsgList[i].sess._impl.id == localStorage.targetChatId) {
                                addMsg(newMsgList[i]);
                            }
                        }
                        if ($scope.msgArray.length < 15) {
                            loadHistory();
                        }
                        $scope.iscroll.refresh();
                        $scope.iscroll.scrollToElement('.msgBlock:last-of-type', 0);
                        // }
                        // else {
                        // }
                    });
                } else {
                    loadHistory();
                }

            }, function () {
                // $$toast.show('连接服务器失败，重试中');
            });
            $scope.sendMsg = function () {
                if ($scope.msg.trim() !== '') {
                    $$txIM.sendTextMsg($scope.msg, localStorage.targetChatId, function (msg) {
                            addMsg(msg);
                            // $('#msg').val('');
                            $scope.msg = '';
                            $scope.rows = 1;
                            $timeout(function () {
                                $scope.$apply();
                            });
                            // $('textarea').trigger('change');
                        },
                        function () {
                            // $('#msg').val('');
                            $scope.msg = '';
                            $scope.rows = 1;
                            $timeout(function () {
                                $scope.$apply();
                            });
                            // $('textarea').trigger('change');
                        });
                }
            };
            $scope.sendEle = function () {
                localStorage.pushPatient = localStorage.targetChatId;
                location.href = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/patientPushObj/contentList';
                // $state.go('contentList', {operateType: 'patientPushObj'});
                // var targetArray = ['test1', 'test3'];
                // var eleArray = [
                //     {
                //         type: 'type1',
                //         id: '1',
                //         name: 'name1',
                //         desc: '1descdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdesc',
                //         img: 'img'
                //     },
                //     {
                //         type: 'type2',
                //         id: '2',
                //         name: 'name2',
                //         desc: '2descdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdesc',
                //         img: 'img'
                //     }
                // ];
                // $$txIM.initImArrayAndSend(targetArray,eleArray);
                // $$txIM.sendElementMsg(
                //     {
                //         type: 'type1',
                //         id: '1',
                //         name: 'name',
                //         desc: 'descdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdescdesc',
                //         img: 'img'
                //     },localStorage.targetChatId, function (msg) {
                //         addMsg(msg);
                //     },
                //     function () {
                //     });
            };
            $scope.showTime = function (msg) {
                var index = $scope.msgArray.indexOf(msg);
                if (index === 0) {
                    return true;
                }
                return $scope.msgArray[index].fullTime - $scope.msgArray[index - 1].fullTime >= 60 * 5;
            };
            $timeout(function () {
                $scope.iscroll = new IScroll('.chatMsg');
            });
            $$log.debug('chatController');
            $$log.info($scope);
        }
    };

});
