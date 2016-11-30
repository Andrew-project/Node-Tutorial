/**
 * Created by dongsj on 16/8/10.
 */
app.directive('confirmController', function () {
    return {
        restrict: 'AE',
        templateUrl: 'templates/common/confirmController.html',
        replace: true,
        scope:{},
        controller: function ($rootScope, $timeout, $sce, $scope, $$log) {
            var animateTime = 200;
            $scope.showBlock = false;
            $scope.msg = '';
            $scope.hideAnimate = false;
            $scope.title = '';
            $scope.cancelContent = '取消';
            $scope.confirmContent = '确定';
            $scope.btnConfirmCallback = null;
            $scope.btnConfirm = function () {
                $$log.log('confirmController.btnConfirm');
                $rootScope.$emit('confirmHide', $scope.btnConfirmCallback);
            };
            $scope.btnCancel = function () {
                $$log.log('confirmController.btnCancel');
                $rootScope.$emit('confirmHide', function () {
                });
            };
            $rootScope.$on('confirmShow', function (e, option) {
                // option={
                //     title:'',
                //     msg:'',
                //     callback:function(){
                //     },
                //     confirmText:'',
                //     cancelText:''
                // };
                if (option.title && option.msg && option.callback) {
                    $scope.title = option.title;
                    $scope.msg = $sce.trustAsHtml(option.msg);
                    $scope.btnConfirmCallback = option.callback;
                    $scope.cancelText = option.cancelText ? option.cancelText : '取消';
                    $scope.confirmText = option.confirmText ? option.confirmText : '确定';
                    $scope.showBlock = true;
                    // $scope.$apply();
                } else {
                    $$log.error('confirmShow option error');
                }
            });
            $rootScope.$on('confirmHide', function (e, callback) {
                $scope.hideAnimate = true;
                $timeout(function () {
                    $scope.showBlock = false;
                    $scope.hideAnimate = false;
                    $scope.msg='';
                    $timeout(function(){
                       $scope.$apply();
                    });
                    // $scope.$apply();
                    callback();
                }, animateTime);
            });
            // $timeout(function () {
            //     $rootScope.$emit('confirmShow', {
            //             title: 'title',
            //             msg: 'msg',
            //             callback: function () {
            //
            //             }
            //         }
            //     );
            // }, 1000);
        }
    };
});
/**
 * Created by dongsj on 16/8/10.
 * confirm框
 * *********************
 * $$confirm.show
 * 显示confirm
 * option={
 *          title:显示标题
 *          msg: 显示内容
 *          callback:确定时的callback
 *          confirmText:确定文本
 *          cancelText:取消文本
 *         }
 */
app.factory('$$confirm', function ($$log, $rootScope) {
    return {
        show: function (option) {
            $rootScope.$emit('confirmShow',option);
            $$log.debug('$$confirm.show');
            $$log.info(option);
        }
    };
});