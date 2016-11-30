/**
 * Created by lixu on 16/9/18.
 */
app.directive('scheduleController',function(){
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/scheduleController.html',
        // require:'',
        // priority:'',
        replace: true,
        scope: {
            data: '=data'
        },
        controller:function($scope, $element, $attrs, $$log, $state,$interval, $$txIM, $http, $$requestUrl, $$toast, $rootScope, $$iconfont){
            //$scope.iconfont = $$iconfont.init;


            $$log.debug('scheduleController');
            $$log.info($scope);
        }
    };
});




