/**
 * Created by lixu on 16/9/23.
 */
var remindArr = [];
app.directive('choiceDayController',function(){
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/choiceDayController.html',
        // require:'',
        // priority:'',
        replace: true,
        scope: {
            data: '=data'
        },
        controller:function($scope, $element, $attrs, $$log, $state,$interval, $$txIM, $http, $$requestUrl, $$toast, $rootScope, $$iconfont){

            $scope.alertClick = function(alert){
                if (remindArr.length >= 1) {
                    remindArr = [];
                }
                remindArr.push(alert);
                history.go(-1);
            };

            $$log.debug('choiceDayController');
            $$log.info($scope);
        }
    };
});
