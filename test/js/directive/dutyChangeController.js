/**
 * Created by lixu on 16/9/26.
 */
app.directive('dutyChangeController', function () {
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/dutyChangeController.html',
        // require:'',
        // priority:'',
        replace: true,
        scope: {
            data: '=data',
            weekOffset: '=weekOffset'
        },
        controller: function ($scope, $element, $attrs, $$log, $state, $interval, $http, $$requestUrl, $$toast,$$loading, $rootScope, $$iconfont, $stateParams) {
            $scope.nums = [];
            if($scope.data.scheduleByRoster != undefined && $scope.data.scheduleByRoster.length > 0){
                $scope.dateNum = $scope.data.scheduleByRoster[0].data;
                for (var i=0; i<$scope.data.scheduleByRoster.length; i++) {
                    var d = [];
                    for (var j=0; j<$scope.data.scheduleByRoster[i].data.length; j++) {
                        d.push($scope.data.scheduleByRoster[i].data[j].executors.length);
                    }
                    d.sort(function (m,n) {
                        return n-m;
                    });
                    $scope.nums.push(d[0]);
                }
            }

            $scope.nowTimeDay = new Date().format('yyyy-MM-dd').split('-')[2];
            $scope.nowTimeMonth = new Date().format('yyyy-MM-dd').split('-')[1];
            admissionTime = null;

            //点击向上的按钮
            $scope.prevWeek = function () {
                $scope.weekOffset = parseInt($scope.weekOffset) - 1;
                getData($scope.weekOffset);
            };

            //点击向下的按钮
            $scope.nextWeek = function () {
                $scope.weekOffset = parseInt($scope.weekOffset) + 1;
                getData($scope.weekOffset);
            };
            function getData (weekOffset) {
                $$loading.show();
                $http({
                    method: 'GET',
                    url: $$requestUrl.getUrl("changeScheduleClassStateController", {"departmentId": localStorage.globalDepartmentId}),
                    params: {
                        'weekOffset': weekOffset
                    }
                }).success(function (response) {
                    $$loading.hide();
                    if (response.result.success === true) {
                        $scope.data = response;
                        if($scope.data.scheduleByRoster != undefined && $scope.data.scheduleByRoster.length > 0){
                            $scope.nums = [];
                            $scope.dateNum = $scope.data.scheduleByRoster[0].data;
                            $scope.nowTime = new Date($scope.data.scheduleByRoster[0].data[0].date).format('yyyy年MM月');
                            for (var i=0; i<$scope.data.scheduleByRoster.length; i++) {
                                var d = [];
                                for (var j=0; j<$scope.data.scheduleByRoster[i].data.length; j++) {
                                    d.push($scope.data.scheduleByRoster[i].data[j].executors.length);
                                }
                                d.sort(function (m,n) {
                                    return n-m;
                                });
                                $scope.nums.push(d[0]);
                            }
                        }
                    } else {
                        response.result.displayMsg?$$toast.show(response.result.displayMsg):$$toast.show("加载失败");
                    }
                    $$log.debug("dutyChangeWeekOffsetData");
                    $$log.info(response);
                });
            }

            $scope.routerToMessageTag = function () {
                $state.go("messageTag");
            };

            //点击排班按钮
            $scope.setShedules = function (list, row) {
                //不能点击
                return false;
                sortType = 'dutyChange';
                admissionTime = row.date;
                orderObjArr = [], classArr = [], delCalender = [];
                classArr.push({
                    id:list.rosterId,
                    title:list.name

                });
                delCalender.push({
                    rosterId:list.rosterId,
                    title:list.name
                });

                for (var i = 0; i < row.executors.length; i++) {
                    orderObjArr.push({
                        member: {
                            'id': row.executors[i].personId,
                            'name': row.executors[i].name
                        },
                        delObj:[row.executors[i].rosterScheduleId]
                    });
                }
                $state.go("sort", {operateType: 'alert'});
            };
            $$log.debug('dutyChangeController');
            $$log.info($scope);
        }

    };

});

