/**
 * Created by dongsj on 16/7/16.
 */
app.directive('tabbarController', function () {
    return {
        restrict: 'AE',
        templateUrl: 'templates/common/tabbarController.html',
        // require:'',
        // priority:'',
        replace: true,
        scope: {
            active: '@active'
        },
        controller: function ($$shence,$scope, $element, $attrs, $$log, $rootScope,$timeout,$state) {
            $scope.active = $scope.active || 0;
            $scope.newMsgsActive = [false, false, false, false];
            $scope.gotoPage=function(page){
                switch (page){
                    case 0:
                        location.href = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/messageTag';
                        break;
                    case 1:
                        if($state.current.name=='messageTag'){
                            location.href = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/show/allPatientList';
                        }else{
                            $state.go('allPatientList',{operateType:'show'});
                        }
                        break;
                    case 2:
                        if($state.current.name=='messageTag'){
                            location.href = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/toolList';
                        }else{
                            $state.go('toolList');
                        }
                        break;
                    case 3:
                        if($state.current.name=='messageTag'){
                            location.href = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/userCenter';
                        }else{
                            $state.go('userCenter');
                        }
                        break;
                }
            };

            $rootScope.$on('tabbarChange', function (e, index) {
                scrollTo(0, 0);
                $scope.active = index;
                $timeout(function(){
                    $scope.$apply();
                });
                $timeout(function(){
                    $scope.$apply();
                },1000);
                // $scope.$apply();
            });
            $rootScope.$on('setTabbarNewMsg', function (e, index, msgStatus) {
                $scope.newMsgsActive[index] = msgStatus;
                $timeout(function(){
                    $scope.$apply();
                });
            });
            $$log.debug('tabbarController');
            $$log.info($scope);
        }
    };
});

/**
 * Created by dongsj on 16/8/10.
 * tabbar
 * *********************
 * $$tabbar.show
 * 显示tabbar
 *
 * $$tabbar.hide
 * 隐藏tabbar
 *
 */
app.factory('$$tabbar', function ($$log, $rootScope) {
    return {
        hide: function () {
            $rootScope.$emit('tabbarChange', -1);
        },
        setIndex: function (index) {
            $rootScope.$emit('tabbarChange', index);
            $$log.debug('tabbarChange' + index);
        },
        setNewMsg: function (index, msgStatus) {
            $$log.debug('setNewMsg' + index + ':' + msgStatus!==false);
            $rootScope.$emit('setTabbarNewMsg', index, msgStatus!==false);
        }
    };
});