/**
 * Created by lsh on 16/11/16.
 */
app.controller('statisticsCountStateController',function($rootScope, $state, $scope,$location, $$log, $$title,$$tabbar,$$navbar,$$shence, $stateParams) {
    $$navbar.showReturnBtn();
    $$tabbar.hide();
    $scope.type = $stateParams.statisticType;
    $$title.setTitle($scope.type == 'plan'? '康复计划阅读统计': '康复工具使用统计');
})