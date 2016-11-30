/**
 * Created by dongsj on 16/10/12.
 */
app.controller('fakeMainPageStateController', function ($$confirm,$$toast, $state, $scope, $$log, $$title, $$tabbar, $$navbar) {
    $scope.toLogin = function () {
        $$confirm.show({
               title:'尚未登录',
               msg: '请登录后进行操作',
               callback:function(){
                   $state.go('login');
               },
               confirmText:'登录',
               cancelText:'取消'
        });
        // $$toast.show('请您登录后进行操作');
        // $state.go('login');
    };
    $$log.debug('fakeMainPageStateController');
    $$log.info($scope);
    $$title.setTitle('优护助手');
    $$navbar.show();
    $$tabbar.setIndex(0);
    $$navbar.hideReturnBtn();
});
