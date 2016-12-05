/**
 * Created by lixu on 16/9/23.
 */
app.directive('choiceColorController',function(){
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/choiceColorController.html',
        // require:'',
        // priority:'',
        replace: true,
        scope: {
            // data: '=data',
        },
        controller:function($scope, $element, $attrs, $$log, $$color,$state,$interval, $$txIM, $http, $$requestUrl, $$toast, $rootScope, $$iconfont){
            $scope.obj = obj;

            $scope.selColor = function(className){
                colorName = className;
                isAddOrder = false;
                history.go(-1);
            };

            $$log.debug('choiceColorController');
            $$log.info($scope);
        }
    };
});

