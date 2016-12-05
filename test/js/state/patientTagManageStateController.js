/**
 * Created by yihuan on 2016/11/11.
 */
app.controller('patientTagManageStateController',function($rootScope, $state, $scope,$location, $$log, $$title, getData,$$tabbar,$$navbar){
    $$log.debug('patientTagManageStateController');
    $$log.info($scope);
    $$navbar.show();
    $$navbar.setTitle('患者标签');
    $$tabbar.setIndex(-1);
    $$navbar.showReturnBtn();
    $scope.data = getData.data;
});
