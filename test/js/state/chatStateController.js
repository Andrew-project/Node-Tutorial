/**
 * Created by dongsj on 16/9/14.
 */
app.controller('chatStateController',function($rootScope, $state, $scope,$location, $$log, $$title,$$navbar,$$tabbar){
    sessionStorage.imLoaded=false;
    $$log.debug('chatStateController');
    $$title.setTitle('聊天');
    $$log.info($scope);
    $$tabbar.hide();
    $$navbar.showReturnBtn();
});
