/**
 * Created by lixu on 16/9/26.
 */
app.controller('dutyChangeStateController',function($rootScope, $state, $scope,$location, $$log, $$title, getData,$stateParams,$$tabbar,$$navbar,$$shence){
    $scope.data = getData.data;
    $scope.weekOffset=($stateParams.weekOffset===""?0:$stateParams.weekOffset);
    // $$shence.track('changeScheduleClassStateController',{
    //     weekOffset:($stateParams.weekOffset===""?0:$stateParams.weekOffset)
    // });
    // $$shence.track('_YHZS-V1.2', {
    //     activeOption: 'changeScheduleClassStateController'
    // });
    $$log.debug('dutyChangeStateController');
    $$log.info($scope);
    $$title.setTitle('查看排班表');
    $$navbar.showReturnBtn();
    $$tabbar.setIndex(-1);
});