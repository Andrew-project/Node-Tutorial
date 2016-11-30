/**
 * Created by lixu on 16/9/20.
 */
app.directive('beforeRecordController',function(){
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/beforeRecordController.html',
        // require:'',
        // priority:'',
        replace: true,
        scope: {
            data: '=data'
        },
        controller:function($scope, $element, $attrs, $$log, $state,$interval, $$txIM, $http, $$requestUrl, $$toast, $rootScope, $$iconfont){
            //$scope.iconfont = $$iconfont.init;
            $scope.phone = "";
            $scope.identifyCode = "";
            $scope.password = "";
            $scope.count = -1;
            $$log.debug('beforeRecordController');
            $$log.info($scope);
        }
    };
});
