/**
 * Created by yihuan on 2016/11/11.
 */
app.controller('nurseTagManageStateController',function($rootScope, $state, $scope,$location, $$log, $$title, getData,$$tabbar,$$navbar){
    $$log.debug('nurseTagManageStateController');
    $$log.info($scope);
    $$navbar.show();
    $$navbar.setTitle('护士标签');
    $$tabbar.setIndex(-1);
    $$navbar.showReturnBtn();
    $scope.data = getData.data;
});
