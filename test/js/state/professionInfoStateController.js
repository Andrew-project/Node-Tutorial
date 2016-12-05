/**
 * Created by lixu on 16/9/14.
 */
app.controller('professionInfoStateController',function($$navbar,$rootScope, $state, $scope,$location, $$log, $$title,$$tabbar){
    $scope.data = "";
    $$log.debug('professionInfoStateController');
    $$log.info($scope);
    $$title.setTitle('优护助手-身份认证');
    $$tabbar.setIndex(-1);
    $$navbar.showReturnBtn();
    $$navbar.setRightBtnShow(3,'跳过');
});