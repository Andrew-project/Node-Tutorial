/**
 * Created by lixu on 16/10/10.
 */
app.controller('classListStateController',function($rootScope, $state, $scope,$location, $$log, $$title, getData,$$navbar,$$tabbar){
    $scope.data = getData.data;
    $$log.debug('classListStateController');
    $$log.info($scope);
    //view config
    $$title.setTitle('班次列表');
    $$navbar.showReturnBtn();
    $$tabbar.setIndex(-1);
});

