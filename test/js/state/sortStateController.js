/**
 * Created by lixu on 16/9/18.
 */
app.controller('sortStateController',function($rootScope, $state, $scope,$location, $$log, $$title,$$tabbar,$$navbar){
    $$log.debug('sortStateController');
    $$log.info($scope);
    $$title.setTitle('排班');
    $$tabbar.setIndex(-1);
    $$navbar.showReturnBtn();
});
