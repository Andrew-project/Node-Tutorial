/**
 * Created by lixu on 16/9/19.
 */
app.directive('editVisitController',function(){
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/editVisitController.html',
        // require:'',
        // priority:'',
        replace: true,
        scope: {
            data: '=data'
        },
        controller:function($scope, $element, $attrs, $$log, $state,$interval, $http, $$requestUrl, $$toast, $rootScope,$stateParams){

            if($stateParams.operateType == 'add'){
                $scope.isAdd = true;
            }else{
                $scope.isAdd = false;
            }
            $scope.goSetTemplate = function (follow) {
                globalTemplateData = follow;
                $state.go('setTemplate',{'operateType':follow.templateId});
            };
            $scope.newTemplate = function(){
                globalTemplateData = {};
                $state.go('setTemplate',{'operateType':"new"});
            };
            $$log.debug('editVisitControl$$$ler');
            $$log.info($scope);
        }
    };
});

