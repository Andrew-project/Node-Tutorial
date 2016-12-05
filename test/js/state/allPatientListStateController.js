/**
 * Created by yihuan on 16/9/18.
 */
app.controller('allPatientListStateController', function ($stateParams, $rootScope, $state, $scope, $location, $$log, $$title, getData, $$tabbar, $$navbar) {
    // 1-住院，2-出院，0-未入院
    $$log.debug('allPatientListStateController');
    $$log.debug($stateParams.operateType);
    if ($stateParams.operateType == 'show') {
        $$title.setTitle('我的患者');
        $$tabbar.setIndex(1);
        $$navbar.hideReturnBtn();
    } else {
        $$title.setTitle('选择随访对象');
        $$tabbar.setIndex(-1);
        $$navbar.showReturnBtn();
    }
    $scope.data = getData.data;
    $$log.debug(getData.data);
    // $$navbar.setRightBtnShow(2);
    // $$tabbar.hide();
    // $$navbar.hideReturnBtn();

});
