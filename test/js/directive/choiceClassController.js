/**
 * Created by lixu on 16/9/19.
 */
var classArr = [];
var colorName = 'green';
var isAddOrder = true;
app.directive('choiceClassController', function () {
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/choiceClassController.html',
        // require:'',
        // priority:'',
        replace: true,
        scope: {
            data: '=data'
        },
        controller: function ($scope, $element, $attrs, $$log, $state, $interval, $http, $$requestUrl, $$toast, $rootScope, $$iconfont, $location, $stateParams) {
            if ($stateParams.operateType == 'add') {
                $scope.isAdd = true;
            } else {
                $scope.isAdd = false;
            }
            if ($scope.data.roster != undefined && $scope.data.roster.length > 0) {
                if (classArr.length > 0) {
                    for (var i = 0; i < $scope.data.roster.length; i++) {
                        for (var j = 0; j < classArr.length; j++) {
                            if ($scope.data.roster[i].id == classArr[j].id) {
                                $scope.data.roster[i].sel = true;
                            } else {
                                // $scope.data.roster[i].sel = false;
                                $scope.data.roster[i].sel = $scope.data.roster[i].sel || false;
                            }
                        }
                    }
                } else {
                    for (var m = 0; m < $scope.data.roster.length; m++) {
                        $scope.data.roster[m].sel = false;
                    }
                }
            }

            $scope.chooseOrder = function (rosters) {
                rosterData = rosters;
                $state.go("setOrder", {operateType: rosters.id});
            };

            $scope.confirmRoster = function () {
                classArr = [];
                for (var n = 0; n< $scope.data.roster.length; n++) {
                    if ($scope.data.roster[n].sel === true) {
                        classArr.push($scope.data.roster[n]);
                    }
                }
                history.go(-1);
            };

            $$log.debug('choiceClassController');
            $$log.info($scope);
        }
    };
});