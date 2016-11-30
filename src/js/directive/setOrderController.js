/**
 * Created by lixu on 16/9/19.
 */
var obj = {
    colorId: [1, 2, 3, 4, 5, 6],
    ColorName: ["#32c86e", "#fd8a58", "#f25d5d", "#fec24b", "#529eff", "#ff8080", "#8a8ae7"],
    'name': '',
    'description': '',
    'from': '',
    'to': ''
};
app.directive('setOrderController', function () {
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/setOrderController.html',
        // require:'',
        // priority:'',
        replace: true,
        scope: {
            data: '=data'
        },
        controller: function ($scope, $stateParams, $element, $attrs, $$log, $state, $interval, $http, $$requestUrl, $$toast, $rootScope, $$iconfont,$timeout,$$loading) {
            $scope.getDTime = function (time) {
                return (new Date(time)).format('hh:mm');
            };
            $scope.setStartTime = function () {
                try {
                    var dTime = new Date();
                    dTime.setHours($scope.from.format('hh'), $scope.from.format('mm'));
                    plus.nativeUI.pickTime(function (e) {
                        $scope.from = e.date;
                        $timeout(function () {
                            $scope.$apply();
                        }, 500);
                    }, function (e) {
                    }, {title: "请选择开始时间", is24Hour: true, time: dTime});
                } catch (e) {
                }
            };

            $scope.setEndTime = function () {
                try {
                    var dTime = new Date();
                    dTime.setHours($scope.to.format('hh'), $scope.to.format('mm'));
                    plus.nativeUI.pickTime(function (e) {
                        $scope.to = e.date;
                        $timeout(function () {
                            $scope.$apply();
                        }, 500);
                    }, function (e) {
                    }, {title: "请选择结束时间", is24Hour: true, time: dTime});
                } catch (e) {
                }
            };
            //表单触发
            $('.triggerInputWarp').on('click', '.triggerInput', function () {
                $(this).find('input').focus();
            });
            var d = new Date().format('yyyy/MM/dd');
            if ($stateParams.operateType == 'new') {
                if (isAddOrder === false) {
                    $scope.title = obj.name;
                    $scope.describe = obj.description;
                    $scope.from = obj.from;
                    $scope.to = obj.to;
                    $scope.colorClass = colorName;
                    isAddOrder = true;
                } else {
                    $scope.title = '';
                    $scope.describe = '';
                    // $scope.from = (new Date());
                    // $scope.to = (new Date());
                    $scope.from = new Date(d + ' ' + '08:00');
                    $scope.to = new Date(d + ' ' + '18:00');
                    $scope.colorClass = 'green';
                }
            } else {
                $scope.title = rosterData.title;
                $scope.describe = rosterData.description;
                if (typeof(rosterData.startTime) == 'string') {
                    $scope.from = new Date(d + ' ' + rosterData.startTime);
                } else {
                    $scope.from = rosterData.startTime;
                }
                if (typeof(rosterData.startTime) == 'string') {
                    $scope.to = new Date(d + ' ' + rosterData.endTime);
                } else {
                    $scope.to = rosterData.endTime;
                }
                if (isAddOrder === false) {
                    $scope.colorClass = colorName;
                    isAddOrder = true;
                } else {
                    $scope.colorClass = rosterData.colorClass;
                }
            }

            $scope.getColor = function () {
                if ($stateParams.operateType == 'new') {
                    obj.name = $scope.title;
                    obj.description = $scope.describe;
                    obj.from = $scope.from;
                    obj.to = $scope.to;
                } else {
                    rosterData.title = $scope.title;
                    rosterData.description = $scope.describe;
                    rosterData.startTime = $scope.from;
                    rosterData.endTime = $scope.to;
                }
                $state.go('choiceColor');
            };

            $scope.setOrder = function () {
                if($scope.title.length >3){
                    $$toast.show('班次最多可输入3个字');
                    return false;
                }
                if ($scope.title == '' || $scope.describe == '' || $scope.from == '' || $scope.to == '' || $scope.colorClass == '') {
                    $$toast.show('请检查信息后提交');
                    return false;
                } else {
                    if ($stateParams.operateType == 'new') {
                        $$loading.show();
                        $http({
                            method: 'POST',
                            url: $$requestUrl.getUrl("createNurseScheduleStateController"),
                            data: {
                                "title": $scope.title,
                                "description": $scope.describe,
                                "startTime": new Date($scope.from).format("hh:mm"),
                                "endTime": new Date($scope.to).format("hh:mm"),
                                'colorClass': $scope.colorClass,
                                "gaps": 0
                            }
                        }).success(function (response) {
                            $$loading.hide();
                            if (response.result.success == true) {
                                var ls = {
                                    time: 0
                                };
                                localStorage['changeScheduleClassStateController'] = JSON.stringify(ls);
                                localStorage['batchSchedulesStateController'] = JSON.stringify(ls);
                                localStorage['changeSchedulePersonStateController'] = JSON.stringify(ls);
                                //全局变量置空
                                colorName = '';
                                rosterData = '';
                                $$toast.show('创建成功');
                                history.go(-1);
                            } else {
                                $$toast.show(response.result.msg);
                            }
                        });
                    } else {
                        $$loading.show();
                        $http({
                            method: 'POST',
                            url: $$requestUrl.getUrl("updateNurseSchedule", {'rosterId': rosterData.id}),
                            data: {
                                "title": $scope.title,
                                "description": $scope.describe,
                                "startTime": new Date($scope.from).format("hh:mm"),
                                "endTime": new Date($scope.to).format("hh:mm"),
                                'colorClass': $scope.colorClass,
                                "gaps": 0
                            }
                        }).success(function (response) {
                            $$loading.hide();
                            if (response.result.success == true) {
                                var ls = {
                                    time: 0
                                };
                                localStorage['changeScheduleClassStateController'] = JSON.stringify(ls);
                                localStorage['batchSchedulesStateController'] = JSON.stringify(ls);
                                localStorage['changeSchedulePersonStateController'] = JSON.stringify(ls);
                                //全局变量置空
                                colorName = '';
                                rosterData = '';
                                $$toast.show('修改成功');
                                history.go(-1);
                            } else {
                                $$toast.show(response.result.msg);
                            }
                        });
                    }
                }
            };
            $$log.debug('setOrderController');
            $$log.info($scope);
        }
    };
});






