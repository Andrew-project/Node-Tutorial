/**
 * Created by lixu on 16/9/20.
 */
var delCalender=[];
var admissionTime = null;
var sortType;
app.directive('dutyCalendarController',function(){
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/dutyCalendarController.html',
        // require:'',
        // priority:'',
        replace: true,
        scope: {
            data: '=data',
            weekOffset:'=weekOffset'
        },
        controller:function($scope, $element, $attrs, $$log, $state,$interval, $$txIM, $http, $$requestUrl, $$toast,$$loading, $rootScope, $$iconfont,$stateParams){
            // //判断
            $scope.nums = [];
            if($scope.data.scheduleByPerson !=undefined && $scope.data.scheduleByPerson.length > 0){
                $scope.dateNum = $scope.data.scheduleByPerson[0].data;
                for (var i=0; i<$scope.data.scheduleByPerson.length; i++) {
                    var d = [];
                    for (var j=0; j<$scope.data.scheduleByPerson[i].data.length; j++) {
                        d.push($scope.data.scheduleByPerson[i].data[j].rosterIds.length);
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
            remindArr = [];

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
                    url: $$requestUrl.getUrl("changeSchedulePersonStateController", {"departmentId": localStorage.globalDepartmentId}),
                    params: {
                        'weekOffset': weekOffset
                    }
                }).success(function (response) {
                    $$loading.hide();
                    if (response.result.success === true) {
                        $scope.data = response;
                        if($scope.data.scheduleByPerson !=undefined && $scope.data.scheduleByPerson.length > 0) {
                            $scope.nums = [];
                            $scope.dateNum = $scope.data.scheduleByPerson[0].data;
                            $scope.nowTime = new Date($scope.data.scheduleByPerson[0].data[0].date).format('yyyy年MM月');
                            for (var i=0; i<$scope.data.scheduleByPerson.length; i++) {
                                var d = [];
                                for (var j=0; j<$scope.data.scheduleByPerson[i].data.length; j++) {
                                    d.push($scope.data.scheduleByPerson[i].data[j].rosterIds.length);
                                }
                                d.sort(function (m,n) {
                                    return n-m;
                                });
                                $scope.nums.push(d[0]);
                            }

                            for(var q=0;q<$scope.data.scheduleByPerson.length;q++){
                                if($scope.data.scheduleByPerson[q].personId == localStorage.globalNurseId){
                                    var personIdData = $scope.data.scheduleByPerson[q];
                                    $scope.data.scheduleByPerson.splice(q,1);
                                    $scope.data.scheduleByPerson.unshift(personIdData);
                                }
                            }
                        }
                    } else {
                        response.result.displayMsg?$$toast.show(response.result.displayMsg):$$toast.show("加载失败");
                    }
                    $$log.debug("dutyCalendarWeekOffsetData");
                    $$log.info(response);
                });
            }

            $scope.routerToMessageTag = function () {
                $state.go("messageTag");
            };

            //点击td
            $scope.editShedule = function (list ,index) {
                sortType = 'dutyCalendar';
                admissionTime = list.data[index].date;
                orderObjArr = [{
                    member: {
                        name:list.name,
                        id:list.personId
                    },
                    delObj: list.data[index].rosterScheduleIds
                }];

                //rosterIds中找班次的rosterId;然后拿出来
                classArr=[], delCalender=[];
                for(var i=0;i<list.data[index].rosterIds.length;i++){
                    for(var j=0;j<$scope.data.rosters.length;j++){
                        if($scope.data.rosters[j].rosterId==list.data[index].rosterIds[i]){
                            delCalender.push({
                                rosterId:list.data[index].rosterIds[i],
                                title:$scope.data.rosters[j].name
                            });
                            break;
                        }
                    }
                }
                for(var m=0;m<list.data[index].rosterIds.length;m++){
                    for(var n=0;n<$scope.data.rosters.length;n++){
                        if($scope.data.rosters[n].rosterId==list.data[index].rosterIds[m]){
                            classArr.push({
                                id:list.data[index].rosterIds[m],
                                title:$scope.data.rosters[n].name
                            });
                            break;
                        }
                    }
                }
                $state.go("sort",{operateType:'alert'});
                $$log.debug('dutyCalendarController');
                $$log.info($scope);
            };
            //排序
            for(var q=0;q<$scope.data.scheduleByPerson.length;q++){
                if($scope.data.scheduleByPerson[q].personId == localStorage.globalNurseId){
                    var personIdData = $scope.data.scheduleByPerson[q];
                    $scope.data.scheduleByPerson.splice(q,1);
                    $scope.data.scheduleByPerson.unshift(personIdData);
                    console.log($scope.data.scheduleByPerson);
                }
            }
        }

    };

});
