/**
 * Created by lixu on 16/10/10.
 */
var rosterData;
app.directive('classListController', function () {
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/classListController.html',
        // require:'',
        // priority:'',
        replace: true,
        scope: {
            data: '=data'
        },
        controller: function ($scope, $element, $attrs, $$log, $state, $interval, $http, $$requestUrl, $$toast, $rootScope, $$iconfont,$location,$stateParams) {

            $scope.listClass = function (index) {
                rosterData = $scope.data.roster[index];
                $state.go("setOrder",{"operateType":"orderId"});
            };

            $$log.debug('classListController');
            $$log.info($scope);
        }
    };
});


