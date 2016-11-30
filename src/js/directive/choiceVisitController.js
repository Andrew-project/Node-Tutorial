/**
 * Created by lixu on 16/9/19.
 */
var templateObj = {};
app.directive('choiceVisitController',function(){
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/choiceVisitController.html',
        // require:'',
        // priority:'',
        replace: true,
        scope: {
            data: '=data'
        },
        controller:function($scope, $element, $attrs, $$log, $state, $http, $$requestUrl, $$toast, $rootScope, $$iconfont){
            globalTemplateData = {};
            newSelPushTemplate = [];
            $scope.followClick = function(follow){
                templateObj = follow;
                history.go(-1);
            };
            //点击编辑的随访模板
            $scope.editTemplate = function(){
                $state.go("editVisit", {operateType :'show'});
            };

            //点击新建随访模板
            $scope.newUser = function(follow){
                $state.go("setTemplate",{operateType :'new'});
            };

            $$log.debug('choiceVisitController');
            $$log.info($scope);
        }
    };
});
