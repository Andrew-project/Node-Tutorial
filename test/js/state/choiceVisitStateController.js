/**
 * Created by lixu on 16/9/19.
 */
app.controller('choiceVisitStateController',function($rootScope, $state, $scope,$location, $$log, $$title, getData,$stateParams,$$tabbar,$$navbar){
    $scope.data = getData.data;
    //view config
    $$tabbar.setIndex(-1);
    $$navbar.showReturnBtn();
    switch($stateParams.operateType){
        case 'show':
            $$title.setTitle("选择随访模板");
            break;
    }
    $$log.debug('choiceVisitStateController');
    $$log.info($scope);

});
