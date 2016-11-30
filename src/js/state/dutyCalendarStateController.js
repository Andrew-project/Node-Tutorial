/**
 * Created by lixu on 16/9/20.
 */
app.controller('dutyCalendarStateController',function($rootScope, $state, $scope,$location, $$log, $$title, getData,$stateParams,$$tabbar,$$navbar){
    $scope.data = getData.data;
    $$log.debug($stateParams);
    $scope.weekOffset=($stateParams.weekOffset===""?0:$stateParams.weekOffset);
    $$log.debug('dutyCalendarStateController');
    $$log.info($scope);
    $$title.setTitle('查看排班表');
    $$navbar.showReturnBtn();
    $$tabbar.setIndex(-1);
});