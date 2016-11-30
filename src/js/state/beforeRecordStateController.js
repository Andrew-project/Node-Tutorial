/**
 * Created by lixu on 16/9/20.
 */
app.controller('beforeRecordStateController',function($rootScope, $state, $scope,$location, $$log, $$title, getData,$$navbar,$$tabbar){
    $scope.data = getData.data;

    $$log.debug('beforeRecordStateController');
    $$log.info($scope);
    $$navbar.setTitle('之前的随访');
    $$tabbar.setIndex(-1);
    $$navbar.showReturnBtn();
});