/**
 * Created by yihuan on 16/9/19.
 */
app.controller('toolListStateController',function($rootScope, $state, $scope,$location, $$log, $$title,$$tabbar,$$navbar,$$shence){

    $$log.debug('toolListStateController');
    $$log.info($scope);
    $$shence.track('_toolListStateController');
    //配置页面信息
    $$navbar.setTitle('工具');
    $$navbar.show();
    $$tabbar.setIndex(2);
    $$navbar.hideReturnBtn();
    followPatientObj = [];
    templateObj = {};
    runNurseObjArr = {};
    templateTime = '';
    globalTemplateData = {};
    classArr = [];
    orderObjArr = [];
    remindArr = [];
    admissionTime = null;
    sortType = 'new';
});
