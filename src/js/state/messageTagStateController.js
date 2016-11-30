/**
 * Created by dongsj on 16/9/18.
 */
app.controller('messageTagStateController', function ($rootScope, $state, $scope, $location, $$log, $$title, getData, $$tabbar, $$navbar,$$shence) {
    sessionStorage.imLoaded = false;
    $$tabbar.setNewMsg(0, false);
    $scope.data = getData.data;
    $scope.notify = [];
    $scope.calendar = [];
    $scope.onAddClick=function(){
      $$shence.track('_messageTagStateControllerAdd');
    };
    $scope.gotoPage = function (page) {
        location.href = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/' + page;
    };
    var i;

    for (i = 0; $scope.data.today != undefined && i < $scope.data.today.length; i++) {
        // if ($scope.data.today[i].type == 1) {
        $scope.notify.push($scope.data.today[i].title);
        // }
    }
    for (i = 0; $scope.data.expire != undefined && i < $scope.data.expire.length; i++) {
        // if ($scope.data.expire[i].type == 1) {
        $scope.notify.push($scope.data.expire[i].title);
        // }
    }
    for (i = 0; $scope.data.future != undefined && i < $scope.data.future.length; i++) {
        // if ($scope.data.future[i].type == 1) {
        $scope.notify.push($scope.data.future[i].title);
        // }
    }
    for (i = 0; $scope.data.roster != undefined && i < $scope.data.roster.length; i++) {
        $scope.calendar.push($scope.data.roster[i].title);
    }
    $scope.calendar = $scope.calendar.join(' ');
    $$log.debug('messageTagStateController');
    $$log.info($scope);
    $$title.setTitle('优护助手');
    $$navbar.show();
    $$tabbar.setIndex(0);
    $$navbar.hideReturnBtn();
});
