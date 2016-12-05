/**
 * Created by gaoqz on 16/11/10.
 */

app.controller('settingStateController',function($http, $rootScope, $state, $scope,$location, $$log, $$title,$$tabbar,$$navbar, $$confirm, $$requestUrl, $$toast){
    $$log.info($scope);
    $$title.setTitle('设置');
    $$tabbar.setIndex(-1);
    $$navbar.showReturnBtn();
    $scope.nurseStatus = parseInt(localStorage.authorizedStatus);
    $scope.exitSign = function(){
        $$confirm.show({
            title: '退出提示',
            msg: '确定退出吗？',
            callback: function () {
                $http({
                    method: 'POST',
                    url: $$requestUrl.getUrl("signOut")
                }).success(function (response) {
                    if(response.result.success == true){
                        $$toast.show('退出成功！');
                        localStorage.clear();
                        localStorage.guided = 'true';
                        // $$log.debug('globalNurseId:'+localStorage.globalNurseId);
                        // $$log.debug('token:'+localStorage.token);
                        // $$log.debug('globaldepartment:'+localStorage.globalDepartmentId);
                        location.href = location.origin + location.pathname + '?'+ '#/login';
                    }else{
                        $$toast.show(response.result.display);
                    }
                    return response;
                });
            },
            confirmText: '确定',
            cancelText: '取消'
        });
    };
});
