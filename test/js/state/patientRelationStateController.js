/**
 * Created by gaoqz on 16/11/9.
 */

app.controller('patientRelationStateController',function($rootScope, $state, $scope,$location, $$log, $$title,$$tabbar,$$navbar){
    $$log.info($scope);
    $$title.setTitle('更多');
    $$tabbar.setIndex(-1);
    $$navbar.showReturnBtn();
});
