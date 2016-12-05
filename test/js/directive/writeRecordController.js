/**
 * Created by lixu on 16/9/20.
 */
app.directive('writeRecordController', function () {
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/writeRecordController.html',
        // require:'',
        // priority:'',
        replace: true,
        scope: {
            data: '=data'
        },
        controller: function ($scope, $element, $attrs, $$log, $state, $interval, $$txIM, $http, $$requestUrl, $$toast, $rootScope, $$iconfont, $stateParams, $timeout,$$loading) {
            $scope.event = $scope.data.event;
            $scope.actions = null;
            console.log($scope.event);
            //时间格式转化
            for (var i = 0; i < $scope.event.length; i++) {
                $scope.event[i].startTime = new Date(parseInt($scope.event[i].startTime)).format("yyyy-MM-dd");
            }

            $scope.stateButton = function (index) {
                $scope.selIndex = $scope.selIndex == index ? -1 : index;
            };

            //设置默认展开的随访
            for (var j = 0; j < $scope.data.event.length; j++) {
                if ($stateParams.eventId == $scope.data.event[j].id) {
                    $scope.selIndex = j;
                }
            }

            //点击推送
            $scope.push = function (target) {
                $$loading.show();
                $http({
                    method: 'POST',
                    url: $$requestUrl.getUrl('weiXinPushFollow'),
                    data: target.wechat.content.msg
                }).success(function (response) {
                    if (response.result.success === true) {
                        $http({
                            method: 'PATCH',
                            url: $$requestUrl.getUrl("updateFollowUpRecord", {id: target.id}),
                            data: {
                                "eventId": target.id,
                                "purpose": target.purpose,
                                "brief": target.brief,
                                "wechat": {
                                    "actionId": target.wechat.actionId,
                                    "status": 2
                                }
                            }
                        }).success(function (response) {
                            $$loading.hide();
                            if (response.result.success === true) {
                                $$toast.show('推送成功');
                                target.wechat.status = 2;
                            }
                        });
                    } else {
                        $$toast.show('推送失败');
                    }
                });
            };

            //点击完成本次随访
            $scope.completeFollowUp = function (target) {
                if (target.purpose == "" || target.brief.content == "") {
                    $$toast.show('请检查信息后提交');
                } else {
                    $http({
                        method: 'PATCH',
                        url: $$requestUrl.getUrl("updateFollowUpRecord", {id: target.id}),
                        data: {
                            "eventId": target.id,
                            "purpose": target.purpose,
                            "brief": target.brief,
                            "wechat": {
                                "actionId": target.wechat.actionId,
                                "status": 2
                            },
                            "status": 2
                        }
                    }).success(function (response) {
                        $$log.debug("writeRecordStateController");
                        $$log.info(response);
                        if (response.result.success === true) {
                            $$toast.show('修改随访信息成功');
                            history.go(-1);

                        }
                    });
                }
            };

            //建立单聊聊
            $scope.setSelChat = function (target) {
                $http({
                    method: 'GET',
                    url: $$requestUrl.getUrl("setChatFollowUp", {
                        fromId: localStorage.globalNurseId,
                        toId: target.personId
                    }),
                    params: {}
                }).success(function (response) {
                    localStorage.targetChatId = response.toAccount.identifier;
                    $$log.debug('localStorage.targetChatId:  ' + localStorage.targetChatId);
                    location.href = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/chat';

                    $$log.debug("setChatFollowUp");
                    $$log.info(response);
                });
                // $$shence.track('_setChatFollowUp');
            };
        }
    };
});