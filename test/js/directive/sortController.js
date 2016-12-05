/**
 * Created by lixu on 16/9/18.
 */
var orderObjArr = [];
app.directive('sortController', function () {
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/sortController.html',
        // require:'',
        // priority:'',
        replace: true,
        scope: {
            data: '=data',
            orderDate: '=date'
        },
        controller: function ($scope, $element, $attrs, $$log, $state, $interval, $$txIM, $http, $$requestUrl, $$toast, $rootScope, $stateParams, $$iconfont, $timeout,$$loading) {
            $scope.rosterId = [];  //班次Id
            $scope.executorId = [];//排班对象
            $scope.watchers = [];
            $scope.delIds = [];  //排班表带来的数据
            $scope.setDate = function () {
                try {
                    var dDate = new Date();
                    dDate.setFullYear($scope.admissionTime.format('yyyy'), $scope.admissionTime.format('MM') - 1, $scope.admissionTime.format('dd'));
                    var minDate = new Date();
                    minDate.setFullYear(2016, 0, 1);
                    var maxDate = new Date();
                    maxDate.setFullYear(2018, 11, 31);
                    plus.nativeUI.pickDate(function (e) {
                        $scope.admissionTime = e.date;
                        $scope.setAdmissionTime();
                        $timeout(function () {
                            $scope.$apply();
                        }, 500);
                    }, function (e) {
                    }, {title: "请选择日期", date: dDate, minDate: minDate, maxDate: maxDate});
                } catch (e) {

                }
            };
            //表单触发
            $('.triggerInputWarp').on('click', '.triggerInput', function () {
                $(this).find('input').focus();
            });
            if (admissionTime != null) {
                if (typeof(admissionTime) == 'number') {
                    $scope.admissionTime = new Date(parseInt(admissionTime));
                } else {
                    $scope.admissionTime = admissionTime;
                }
            } else {
                $scope.admissionTime = $scope.admissionTime || (new Date());
            }

            function setValueArr(valueArr) {
                var nameArr = [];
                switch (valueArr) {
                    case 'orderObjArr':
                        for (var i = 0; i < orderObjArr.length; i++) {
                            nameArr.push(orderObjArr[i].member.name);
                            $scope.executorId.push(orderObjArr[i].member.id);
                            for (var k = 0; k < orderObjArr[i].delObj.length; k++) {
                                $scope.delIds.push(orderObjArr[i].delObj[k]);
                            }
                        }
                        $scope.name = nameArr.join('，');
                        break;
                    case 'classArr':
                        for (var q = 0; q < classArr.length; q++) {
                            nameArr.push(classArr[q].title);
                            $scope.rosterId.push(classArr[q].id);
                        }
                        $scope.class = nameArr.join('，');
                        break;
                }
            }
            //页面在加载时读取orderArr,attentionObjArr,classArr,remindArr
            setValueArr('orderObjArr');
            setValueArr('attentionObjArr');
            setValueArr('classArr');

            $scope.setAdmissionTime = function () {
                admissionTime = $scope.admissionTime;
            };

            $scope.submitSchedules = function () {
                if ($scope.name == '' || $scope.admissionTime === undefined || $scope.admissionTime === null || $scope.class == '') {
                    $$toast.show('请检查信息后提交');
                    return false;
                } else {
                    var delId;
                    if ($scope.delIds.length == 1) {
                        delId = $scope.delIds[0];
                    } else if ($scope.delIds.length > 1) {
                        delId = $scope.delIds.join(',');
                    } else {
                        delId = '';
                    }
                    if (delId != '' && delId != undefined && delId != null) {
                        $http({
                            method: 'DELETE',
                            url: $$requestUrl.getUrl("dropSortSchedule", ({"rosterScheduleIds": delId}))
                        }).success(function (response) {
                            if (response.result.success === true) {
                                $$loading.show();
                                $http({
                                    method: 'POST',
                                    url: $$requestUrl.getUrl("createSortScheduleStateController"),
                                    data: {
                                        "rosterId": $scope.rosterId,
                                        "executorId": $scope.executorId,
                                        "date": Date.parse($scope.admissionTime)
                                    }
                                }).success(function (response) {
                                    $$loading.hide();
                                    if (response.result.success === true) {
                                        //全局变量置空
                                        orderObjArr = [];
                                        classArr = [];
                                        remindArr = [];
                                        delId = [];
                                        $$toast.show("修改排班成功");
                                        if (sortType == 'dutyCalendar' || sortType == 'dutyChange') {
                                            history.go(-1);
                                        } else {
                                            $state.go("dutyCalendar");
                                        }
                                        var ls = {
                                            time: 0
                                        };
                                        localStorage['changeScheduleClassStateController'] = JSON.stringify(ls);
                                        localStorage['batchSchedulesStateController'] = JSON.stringify(ls);
                                        localStorage['changeSchedulePersonStateController'] = JSON.stringify(ls);
                                    }else{
                                        response.result.displaymsg ? $$toast.show(response.result.displaymsg):$$toast.show("修改排班失败");
                                    }
                                    $$log.debug("sorts");
                                    $$log.info(response);
                                });
                            }
                        });
                    } else {
                        $$loading.show();
                        $http({
                            method: 'POST',
                            url: $$requestUrl.getUrl("createSortScheduleStateController"),
                            data: {
                                "rosterId": $scope.rosterId,
                                "executorId": $scope.executorId,
                                "date": Date.parse($scope.admissionTime)
                            }
                        }).success(function (response) {
                            $$loading.hide();
                            if (response.result.success === true) {

                                //全局变量置空
                                orderObjArr = [];
                                classArr = [];
                                remindArr = [];
                                delId = [];
                                $$toast.show("排班成功");
                                if (sortType == 'dutyCalendar' || sortType == 'dutyChange') {
                                    history.go(-1);
                                } else {
                                    $state.go("dutyCalendar");
                                }
                                var ls = {
                                    time: 0
                                };
                                localStorage['changeScheduleClassStateController'] = JSON.stringify(ls);
                                localStorage['batchSchedulesStateController'] = JSON.stringify(ls);
                                localStorage['changeSchedulePersonStateController'] = JSON.stringify(ls);
                            }else {
                                response.result.displaymsg ? $$toast.show(response.result.displaymsg):$$toast.show("排班失败");
                            }
                            $$log.debug("sorts");
                            $$log.info(response);
                        });
                    }
                }
            };
            $$log.debug('sortController');
            $$log.info($scope);
        }
    };
});





