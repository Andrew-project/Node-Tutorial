/**
 * Created by lixu on 16/9/24.
 */
app.controller('choiceDepartmentStateController',function($$tabbar,$$navbar,$rootScope, $state, $scope,$location, $$log, $$title, getData){
    $scope.data = getData.data;
    //view config
    $$title.setTitle("选择科室");
    $$navbar.showReturnBtn();
    $$tabbar.setIndex(-1);

});
