/**
 * Created by lixu on 16/9/19.
 */
var globalTemplateData = {};
app.controller('editVisitStateController',function($rootScope, $state, $scope,$location, $$log, $$tabbar,$$navbar,$$title, getData,$stateParams){
    $scope.data = getData.data;
    newSelPushTemplate = [];
    globalTemplateData = {};
    switch($stateParams.operateType){
        case 'show':
            $$title.setTitle("编辑随访模板");
            break;
        case 'add':
            $$title.setTitle("管理随访模板");
            break;

    }
    $$tabbar.setIndex(-1);
    $$navbar.showReturnBtn();
    $$log.debug('editVisitStateController');
    $$log.info($scope);
});