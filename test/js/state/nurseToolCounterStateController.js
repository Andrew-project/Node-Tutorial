/**
 * Created by lixu on 16/11/16.
 */
app.controller('nurseToolCounterStateController',function($rootScope, $state, $scope,$location, $$log, $$title,$$tabbar,$$navbar,$$shence,getData){
    $scope.data = getData.data;
    $$log.debug('nursePlanCounterStateController');
    $$log.info($scope);
    $$shence.track('nurseToolCounterStateController');
    $$title.setTitle('康复工具统计');
    $$navbar.show();
    $$tabbar.setIndex(-1);
    $$navbar.showReturnBtn();
});