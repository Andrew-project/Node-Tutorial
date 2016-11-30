/**
 * Created by lixu on 16/11/16.
 */
app.controller('nursePlanCounterStateController',function($rootScope, $state, $scope,$location, $$log, $$title,$$tabbar,$$navbar,$$shence,getData){
    $scope.data = getData.data;
    $$log.debug('nursePlanCounterStateController');
    $$log.info($scope);

    $$shence.track('nursePlanCounterStateController');
    $$title.setTitle('康复计划统计');
    $$navbar.show();
    $$tabbar.setIndex(-1);
    $$navbar.showReturnBtn();
});

