/**
 * Created by lixu on 16/9/21.
 */
app.directive('dutyListController', function () {
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/dutyListController.html',
        // require:'',
        // priority:'',
        replace: true,
        scope: {
            data: '=data',
            showDetail: '=showDetail',
            patientTag: '=patientTag',
            patientId: '=patientId',
            weekOffset: '=weekOffset'
        },
        controller: function ($scope, $element, $attrs, $$log, $state, $interval, $$txIM, $http, $$requestUrl, $$toast,$$loading,$$title, $rootScope, $$iconfont) {
            console.log($scope.data);
            //判断

            if($scope.data.scheduleByPerson !=undefined && $scope.data.scheduleByPerson.length > 0){
                $scope.dateNum = $scope.data.scheduleByPerson[0].data;
            }
            $scope.selRoster = $scope.data.rosters !=undefined && $scope.data.rosters.length > 0 ? $scope.data.rosters[0].rosterId : -1;
            $scope.nowTimeDay = new Date().format('yyyy-MM-dd').split('-')[2];
            $scope.nowTimeMonth = new Date().format('yyyy-MM-dd').split('-')[1];
            admissionTime = null;

            $scope.changeSelRoster = function (selId) {
                $scope.selRoster = selId;
            };
            $$title.setTitle('批量排班'+'（' +new Date($scope.data.scheduleByPerson[0].data[0].date).format('MM')+'月'+'）');

            //点击向上的按钮
            $scope.prevWeek = function () {
                // $state.go('dutyList', {weekOffset: parseInt($scope.weekOffset) - 1});
                $scope.weekOffset = parseInt($scope.weekOffset) - 1;
                getData($scope.weekOffset);
            };

            //点击向下的按钮
            $scope.nextWeek = function () {
                // $state.go('dutyList', {weekOffset: parseInt($scope.weekOffset) + 1});
                $scope.weekOffset = parseInt($scope.weekOffset) + 1;
                getData($scope.weekOffset);
            };

            //点击完成按钮
            $scope.dutyList = function () {
                $state.go("dutyCalendar");
            };

            function getData(weekOffset) {
                $$loading.show();
                $http({
                    method: 'GET',
                    url: $$requestUrl.getUrl("batchSchedulesStateController", {"departmentId": localStorage.globalDepartmentId}),
                    params: {
                        'weekOffset': parseInt(weekOffset)
                    }
                }).success(function (response) {
                    $$loading.hide();
                    if (response.result.success === true) {
                        $scope.data = response;
                        $scope.dateNum = $scope.data.scheduleByPerson[0].data;
                        $$title.setTitle('批量排班'+'（' +new Date($scope.data.scheduleByPerson[0].data[0].date).format('MM')+'月'+'）');
                        //排序
                        for(var q=0;q<$scope.data.scheduleByPerson.length;q++){
                            if($scope.data.scheduleByPerson[q].personId == localStorage.globalNurseId){
                                var personData = $scope.data.scheduleByPerson[q];
                                $scope.data.scheduleByPerson.splice(q, 1);
                                $scope.data.scheduleByPerson.unshift(personData);
                                console.log($scope.data.scheduleByPerson);
                            }
                        }
                    } else {
                        response.result.displayMsg?$$toast.show(response.result.displayMsg):$$toast.show("加载失败");
                    }
                    $$log.debug("dutyListWeekOffsetData");
                    $$log.info(response);
                });
            }

            $scope.routerToMessageTag = function () {
                history.go(-1);
            };

            // 点击td
            $scope.changeShedule = function (list, idx, index) {
                if($scope.selRoster<0){
                    $$toast.show('请新建班次');
                    return false;
                }
                if (list.data[index].rosterIds.indexOf($scope.selRoster) > -1) {
                    $$loading.show();
                    $http({
                        method: 'DELETE',
                        url: $$requestUrl.getUrl("dropSchedule", ({"rosterScheduleIds": list.data[index].rosterScheduleIds[list.data[index].rosterIds.indexOf($scope.selRoster)]}))
                    }).success(function (response) {
                        $$loading.hide();
                        if (response.result.success === true) {
                            list.data[index].rosterScheduleIds.remove(list.data[index].rosterIds.indexOf($scope.selRoster));
                            list.data[index].rosterIds.remove(list.data[index].rosterIds.indexOf($scope.selRoster));
                        } else {
                            $$toast.show(response.result.displayMsg);
                        }
                        var ls={
                            time:0
                        };
                        localStorage['changeScheduleClassStateController'] = JSON.stringify(ls);
                        localStorage['batchSchedulesStateController'] = JSON.stringify(ls);
                        localStorage['changeSchedulePersonStateController'] = JSON.stringify(ls);
                        $$log.debug("deleteClass");
                        $$log.info(response);
                    });
                } else {
                    $$loading.show();
                    $http({
                        method: 'POST',
                        url: $$requestUrl.getUrl("createSchedule", ({"rosterScheduleId": list.data[index].rosterScheduleIds[list.data[index].rosterIds.indexOf($scope.selRoster)]})),
                        data: {
                            rosterId: $scope.selRoster,
                            executorId: list.personId,
                            date: list.data[index].date
                        }
                    }).success(function (response) {
                        $$loading.hide();
                        if (response.result.success === true) {
                            list.data[index].rosterScheduleIds.push(response.id);
                            if (list.data[index].rosterIds.indexOf($scope.selRoster) == -1) {
                                list.data[index].rosterIds.push($scope.selRoster);
                            }
                        } else {
                            $$toast.show(response.result.displayMsg);
                        }
                        var ls={
                            time:0
                        };
                        localStorage['changeScheduleClassStateController'] = JSON.stringify(ls);
                        localStorage['batchSchedulesStateController'] = JSON.stringify(ls);
                        localStorage['changeSchedulePersonStateController'] = JSON.stringify(ls);
                        $$log.debug("createSchedule");
                        $$log.info(response);
                    });
                }
            };

            // //滚动条 90 140
            if($scope.data.rosters !=undefined && $scope.data.rosters.length > 0){
                var len = $scope.data.rosters.length, row;
                if (len % 5 === 0) {
                    row = len / 5;
                } else {
                    row = parseInt((len / 5)+1);
                }
                $("table").css("margin-top", (row * 1.6 + 3) + 'rem');
            }

            //排序
            for(var q=0;q<$scope.data.scheduleByPerson.length;q++){
               if($scope.data.scheduleByPerson[q].personId == localStorage.globalNurseId){
                   var personData = $scope.data.scheduleByPerson[q];
                   $scope.data.scheduleByPerson.splice(q, 1);
                   $scope.data.scheduleByPerson.unshift(personData);
                   console.log($scope.data.scheduleByPerson);
                   // $scope.data.scheduleByPerson[q].unshift($scope.data.scheduleByPerson[q].personId);
               }
            }
        }
    };
});
