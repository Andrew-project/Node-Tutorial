/**
 * Created by dongsj on 16/8/10.
 * toast
 * *********************
 * $$toast.show
 * 显示toast
 *
 */
app.factory('$$toast', function ($$log, $rootScope) {
    return {
        show: function (msg, callback) {
            if (callback === undefined) {
                callback = function () {
                };
            }
            $$log.debug('$$toast.show');
            $$log.info(msg);
            $$log.info(callback);
            $rootScope.$emit('toastShow', msg, callback);
        }
    };
});

app.directive('toastController',function(){
    return{
        restrict:'AE',
        templateUrl:'templates/common/toastController.html',
        replace:true,
        scope:{},
        controller:function($rootScope, $timeout, $sce, $scope){
            var showTime = 3000;
            $scope.showBlock = false;
            $scope.msg = '';
            $rootScope.$on('toastShow', function (e, msg, callback) {
                $scope.showBlock = true;
                $scope.msg = $sce.trustAsHtml(msg);
                // $scope.$apply();
                $timeout(function () {
                    $scope.showBlock = false;
                    $scope.msg = '';
                    // $scope.$apply();
                    if (callback) {
                        callback();
                    }
                }, showTime);
            });
        }
    };
});