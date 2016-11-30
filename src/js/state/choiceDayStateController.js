
/**
 * Created by lixu on 16/9/23.
 */
app.controller('choiceDayStateController',function($$tabbar,$$navbar,$rootScope, $state, $scope,$location, $$log, $$title, getData){
    $scope.data = getData.data;

    $$log.debug('choiceDayStateController');
    $$log.info($scope);
    //view config
    $$title.setTitle("选择提醒时间");
    $$navbar.showReturnBtn();
    $$tabbar.setIndex(-1);
});
