
/**
 * Created by lixu on 16/9/19.
 */
app.controller('startVisitStateController',function($rootScope, $state, $scope,$location, $$log, $$title,$$tabbar,$$navbar){
    $$log.debug('startVisitStateController');
    $$log.info($scope);
    $$title.setTitle('发起随访');
    $$navbar.show();
    $$tabbar.setIndex(-1);
    $$navbar.showReturnBtn();

});

