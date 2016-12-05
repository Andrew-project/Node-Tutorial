/**
 * Created by lixu on 16/9/14.
 */

app.controller('basicInfoStateController',function($rootScope, $state, $scope,$location, $$log, $$title,$$tabbar,$$navbar){
    $scope.data = '';
    $$title.setTitle('优护助手-身份认证');
    $$tabbar.setIndex(-1);
    $$navbar.showReturnBtn();
    $$navbar.hideRightQRbtn();
    // $$navbar.hideRightText();
    $$navbar.show();
});

