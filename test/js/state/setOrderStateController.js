/**
 * Created by lixu on 16/9/19.
 */
app.controller('setOrderStateController',function($rootScope, $state, $scope,$location, $$log, $$title,$$navbar,$$tabbar,getData,$stateParams){
    $scope.data = getData.data;
    $$log.debug('setOrderStateController');
    $$log.info($scope);
    switch ($stateParams.operateType ){
        case 'new':
            $$title.setTitle('创建班次');
            break;
        default:
            $$title.setTitle('修改班次');
            break;
    }
    $$navbar.showReturnBtn();
    $$tabbar.setIndex(-1);
});
