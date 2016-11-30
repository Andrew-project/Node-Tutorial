/**
 * Created by lixu on 16/9/23.
 */
app.controller('choiceHospitalStateController',function($$tabbar,$$navbar,$rootScope, $state, $scope,$location, $$log, $$title, getData){
    $scope.data = getData.data;
    //view config
    $$title.setTitle("选择所在医院");
    $$navbar.showReturnBtn();
    $$tabbar.setIndex(-1);

});
