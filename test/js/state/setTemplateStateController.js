/**
 * Created by lixu on 16/9/19.
 */
app.controller('setTemplateStateController',function($rootScope,$state,$scope,$location,$$log,$$title,$stateParams,$$tabbar,$$navbar){
    switch($stateParams.operateType){
        case 'new':
            $$title.setTitle('新建随访模板');
            break;
        default:
            $$title.setTitle('编辑随访模板');
            break;
    }
    $$tabbar.setIndex(-1);
    $$navbar.showReturnBtn();
    $$log.debug('setTemplateStateController');
    $$log.info($scope);
});
