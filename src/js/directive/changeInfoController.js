/**
 * Created by lixu on 16/9/18.
 */
app.directive('changeInfoController',function(){
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/changeInfoController.html',
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
            $$log.debug('changeInfoController');
            $$log.info($scope);
        }
    };
});



