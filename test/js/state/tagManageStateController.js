/**
 * Created by yihuan on 2016/11/9.
 */
app.controller('tagManageStateController',function($rootScope, $state, $scope,$location, $$log, $$title,$$tabbar,$$navbar,$$shence){

    $$log.debug('tagManageStateController');
    $$log.info($scope);
    // $$shence.track('_tagManageStateController');

    //配置页面信息
    $$navbar.setTitle('标签管理');
    $$navbar.show();
    $$tabbar.setIndex(-1);
    $$navbar.showReturnBtn();

});
