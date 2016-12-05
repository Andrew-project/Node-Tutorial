/**
 * Created by lixu on 16/9/14.
 */
app.controller('createCalenderStateController',function($$navbar,$rootScope, $state, $scope,$location, $$log, $$title,$$tabbar){
    $$log.debug('createCalenderStateController');
    $$log.info($scope);
    $$title.setTitle('新建日程');
    $$tabbar.setIndex(-1);
    $$navbar.showReturnBtn();
    // $$navbar.setRightBtnShow(3,'跳过');
});