/**
 * Created by lixu on 16/9/21.
 */
app.controller('dutyListStateController',function($rootScope, $state, $scope,$location, $$log, $$title, getData,$stateParams,$$tabbar,$$navbar){
    $scope.data = getData.data;
    $scope.weekOffset=($stateParams.weekOffset===""?0:$stateParams.weekOffset);
    $$log.debug('dutyListStateController');
    $$log.info($scope);
    $scope.nowTimeDay = new Date().format('yyyy-MM-dd').split('-')[1];
    console.log($scope.nowTimeDay);
    // $$title.setTitle('批量排班'+'（'+$scope.nowTimeDay+'月）');
    $$navbar.showReturnBtn();
    $$tabbar.setIndex(-1);
});
