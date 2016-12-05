/**
 * Created by gaoqz on 16/11/10.
 */

app.controller('blackListStateController',function($rootScope, $state, $scope,$location, $$log, $$title,$$navbar,$$tabbar, getData){
    $$log.debug('blackListStateController');
    $scope.data = getData.data;
    $$title.setTitle('科室黑名单');
    $$log.info($scope);
    $$tabbar.hide();
    $$navbar.showReturnBtn();
});

