/**
 * Created by dongsj on 16/8/10.
 */
app.directive('loadingController', function () {
    return {
        restrict: 'AE',
        templateUrl: 'templates/common/loadingController.html',
        replace: true,
        scope: {},
        controller: function ($rootScope, $timeout, $sce, $scope, $$log) {
            // var animateTime = 250;
            $scope.showBlock = false;
            $scope.msg = '';
            $scope.hideAnimate = false;
            $rootScope.$on('loadingShow', function (e) {
                $scope.showBlock = true;
                $timeout(function(){
                    $scope.$apply();
                });
            });
            $rootScope.$on('loadingHide', function (e) {
                // $scope.hideAnimate = true;
                // $timeout(function () {
                $scope.showBlock = false;
                $timeout(function(){
                    $scope.$apply();
                });
                // $scope.hideAnimate = false;
                // }, 250);
            });
            // $timeout(function(){
            //     $rootScope.$emit('loadingShow');
            // },1000)
        }
    };
});
/**
 * Created by dongsj on 16/8/10.
 * loading
 * *********************
 * $$loading.show
 * 显示loading
 *
 * $$loading.hide
 * 隐藏loading
 *
 */
app.factory('$$loading', function ($$log, $rootScope) {
    return {
        show: function () {
            $rootScope.$emit('loadingShow');
            $$log.debug('$$loading.show');
        },
        hide: function () {
            $rootScope.$emit('loadingHide');
            $$log.debug('$$loading.hide');
        }
    };
});