
/**
 * Created by lixu on 16/9/19.
 */
app.controller('choiceClassStateController',function($rootScope, $state, $scope,$location, $$log, $$title, getData,$$navbar,$$tabbar){
    $scope.data = getData.data;
    $$log.debug('choiceClassStateController');
    $$log.info($scope);
    //view config
    $$title.setTitle('选择班次');
    $$navbar.showReturnBtn();
    $$tabbar.setIndex(-1);
});
