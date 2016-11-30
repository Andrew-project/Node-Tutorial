/**
 * Created by gaoqz on 16/11/9.
 */

app.directive('patientRelationController', function () {
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/patientRelationController.html',
        replace: true,
        scope: {
            data: '=data'
        },
        controller: function ($scope, $$confirm, $$toast, $element, $attrs, $$log, $state, $interval, $$txIM, $http, $$requestUrl, $$loading, $rootScope, $$iconfont) {
            $scope.attentionIds = [];
            if (patientInfo.tag !== undefined) {
                for (var j = 0; j < patientInfo.tag.length; j++) {
                    if (patientInfo.tag[j].tagType == 2 && localStorage.globalNurseId == patientInfo.tag[j].tagName) {
                        $scope.isAttention = true;
                    }

                    if (patientInfo.tag[j].tagType == 3) {
                        $scope.isBlackList = true;
                    }
                }
            } else {
                $scope.isAttention = false;
                $scope.isBlackList = false;
            }

            if (patientInfo.departmentTag !== undefined && patientInfo.departmentTag.tag !== undefined) {
                for (var i = 0; i < patientInfo.departmentTag.tag.length; i++) {
                    for (var j = 0; j < patientInfo.departmentTag.tag[i].tag.length; j++) {
                        if (patientInfo.departmentTag.tag[i].tag[j].tagType == 3) {
                            $scope.blackListTagId = {
                                'tagId': patientInfo.departmentTag.tag[i].tag[j].tagId,
                            };
                        }
                        if (patientInfo.departmentTag.tag[i].tag[j].tagType == 2) {
                            $scope.attentionIds.push(patientInfo.departmentTag.tag[i].tag[j]);
                        }
                    }
                }
            }

            $scope.onChangeAttentionClick = function () {
                var data = [];
                if ($scope.isBlackList == true) {
                    $$toast.show('请先将该患者移出科室黑名单，然后添加关注');
                    return false;
                }
                $$loading.show();
                if (patientInfo.tag !== undefined) {
                    for (var i = 0; i < patientInfo.tag.length; i++) {
                        if (patientInfo.tag[i].tagName != localStorage.globalNurseId && patientInfo.tag[i].tagType != 3) {
                            data.push({'tagId': patientInfo.tag[i].tagId});
                        }
                    }
                }
                if ($scope.isAttention != true) {
                    data.push({'tagId': -1});
                }
                $http({
                    method: 'PATCH',
                    url: $$requestUrl.getUrl("attentionTagStateController", ({"nurseId": patientInfo.userId})),
                    data: {
                        'tag': data
                    }
                }).success(function (response) {
                    $$loading.hide();
                    if (response.result.success === true) {
                        var content = $scope.isAttention != true ? '添加关注成功' : '取消关注成功';
                        $scope.isAttention = $scope.isAttention != true ? true : false;
                        $$toast.show(content);
                        var ls = { time: 0 };
                        localStorage['allPatientList'] = JSON.stringify(ls);
                        // history.go(-1);
                    }
                });
            }

            $scope.onChangeStatusClick = function () {
                if (localStorage.authorizedStatus !== '4' && localStorage.authorizedStatus !== '5') {
                    $$toast.show('您没有权限进行此操作');
                    return false;
                }
                ;
                if ($scope.isBlackList !== true) {
                    var msg;
                    if ($scope.attentionIds.length > 0) {
                        msg = '该患者已经被' + $scope.attentionIds.length + '位护士关注，加入科室黑名单将取消所有关注，确定加入科室黑名单吗？';
                    } else {
                        msg = '加入科室黑名单将取消所有关注，确定加入科室黑名单吗吗？';
                    }
                    $$confirm.show({
                        title: '重要提示',
                        msg: msg,
                        callback: function () {
                            httpRequest();
                        },
                        confirmText: '确定',
                        cancelText: '取消'
                    });
                } else {
                    httpRequest();
                }
            };

            var httpRequest = function () {
                var data = [];
                if (patientInfo.tag !== undefined) {
                    for (var i = 0; i < patientInfo.tag.length; i++) {
                        if (patientInfo.tag[i].tagType != 2 && patientInfo.tag[i].tagType != 3) {
                            data.push({'tagId': patientInfo.tag[i].tagId});
                        }
                    }
                }
                if ($scope.isBlackList != true) {
                    data.push($scope.blackListTagId);
                }
                $$loading.show();
                $http({
                    method: 'PATCH',
                    url: $$requestUrl.getUrl("blackListTagStateController", ({"nurseId": patientInfo.userId})),
                    data: {
                        'tag': data
                    }
                }).success(function (response) {
                    $$loading.hide();
                    if (response.result.success === true) {
                        var content = $scope.isBlackList != true ? '加入科室黑名单成功' : '移出科室黑名单成功';
                        $scope.isBlackList = $scope.isBlackList != true ? true : false;
                        $scope.isAttention = $scope.isBlackList == true ? false : $scope.isBlackList;
                        $$toast.show(content);
                        var ls = { time: 0 };
                        localStorage['allPatientList'] = JSON.stringify(ls);
                        // history.go(-1);
                    }
                });
            }
        }
    };
});
