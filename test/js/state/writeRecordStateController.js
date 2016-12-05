/**
 * Created by lixu on 16/9/20.
 */
app.controller('writeRecordStateController',function($rootScope, $state, $scope,$location, $$log, $$title,$$tabbar, getData,$$toast,$$navbar,$stateParams){
    $scope.data = getData.data;
    $scope.eventId = $stateParams.eventId;
    $$log.debug('writeRecordStateController');
    $$log.info($scope);
    $$title.setTitle('填写记录');
    $$tabbar.setIndex(-1);
    $$navbar.showReturnBtn();
});
