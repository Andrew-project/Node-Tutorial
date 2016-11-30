/**
 * Created by dongsj on 16/9/18.
 */
var content = {};
app.controller('recentCalenderStateController', function ($rootScope, $state, $scope, $location, $$log, $$title, getData, $$tabbar, $$navbar,$$shence) {
    $scope.data = getData.data;
    $scope.parseDateExpire = function (event) {
        // if((new Date(event.startTime)).format('hh:mm')=='00:00' && (new Date(event.endTime)).format('hh:mm')=='23:59'){
        //     return '全天';
        // }else{
        //     return (new Date(event.startTime)).format('hh:mm')+'-'+(new Date(event.endTime)).format('hh:mm');
        // }
        return (new Date(event.startTime)).format('MM月dd日');
    };
    $scope.onAddClick=function(){
        $$log.debug("onAddClick");
        $$shence.track('_recentCalenderStateControllerAdd');
    };
    $scope.parseDateToday = function (event) {
        if ((new Date(event.startTime)).format('hh:mm') == '00:00' && (new Date(event.endTime)).format('hh:mm') == '23:59') {
            return '全天';
        } else {
            return (new Date(event.startTime)).format('hh:mm') + '-' + (new Date(event.endTime)).format('hh:mm');
        }
    };
    $scope.parseDateFuture = function (event) {
        var sdd = (new Date(event.startTime)).format('dd');
        var edd = (new Date(event.endTime)).format('dd');
        if (sdd == edd) {
            // return (new Date(event.startTime)).format('MM月dd日') + ' ' + (new Date(event.startTime)).format('hh:mm') + '-' + (new Date(event.endTime)).format('hh:mm');
            return (new Date(event.startTime)).format('MM月dd日');
        } else {
            // return (new Date(event.startTime)).format('MM月dd日') + ' ' + (new Date(event.startTime)).format('hh:mm') + '-' + (new Date(event.endTime)).format('hh:mm') + ' 跨' + (Math.floor((event.endTime - event.startTime) / 1000 / 60 / 60 / 24) + 1) + '天';
            return (new Date(event.startTime)).format('MM月dd日') + ' ' + ' 跨' + (Math.floor((event.endTime - event.startTime) / 1000 / 60 / 60 / 24) + 1) + '天';
        }
        // return (new Date(t)).format('mm月dd日');
    };
    $$log.debug('recentCalenderStateController');
    $$log.info($scope);
    $$title.setTitle('日程');
    $$tabbar.setIndex(-1);
    $$navbar.showReturnBtn();
});