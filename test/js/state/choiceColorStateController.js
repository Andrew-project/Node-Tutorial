/**
 * Created by lixu on 16/9/23.
 */
app.controller('choiceColorStateController',function($$tabbar,$$navbar,$rootScope, $state, $scope,$location, $$log, $$title,$$color){
    $$log.debug('choiceColorStateController');
    $$log.info($scope);
    //view config
    $$title.setTitle("选择颜色");
    $$navbar.showReturnBtn();
    $$tabbar.setIndex(-1);
});
