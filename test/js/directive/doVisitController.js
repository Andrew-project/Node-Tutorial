/**
 * Created by lixu on 16/9/19.
 */
app.directive('doVisitController',function(){
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/doVisitController.html',
        // require:'',
        // priority:'',
        replace: true,
        scope: {
            data: '=data'
        },
        controller:function($scope, $element, $attrs, $$log, $state,$interval, $$txIM, $http, $$requestUrl, $$toast, $rootScope, $$iconfont){
            $scope.phone = "";
            $scope.identifyCode = "";
            $scope.password = "";
            $scope.count = -1;

            $$log.debug('doVisitController');
            $$log.info($scope);
        }
    };
});


