/**
 * Created by dongsj on 16/8/10.
 */
app.directive('navbarController', function () {
    return {
        restrict: 'AE',
        templateUrl: 'templates/common/navbarController.html',
        replace: true,
        scope: {},
        controller: function ($rootScope, $timeout, $sce, $scope, $$log, $$env) {
            $scope.navbarShow = true;
            $scope.returnBtnShow = false;
            $scope.navbarContent = '';
            $scope.rightBtnShow = false;
            $scope.QRbtn = false;
            $scope.addTagBtn = false;
            $scope.addBtn = false;
            $scope.textBtn='';

            $scope.returnBtnClick = function () {
                $$log.debug('navbarController.returnBtnClick');
                history.go(-1);
            };
            //是否显示标题栏
            //监听从$rootScope传来的setNavbarShow
            $rootScope.$on('setNavbarShow', function (e, navbarShow) {
                // $$log.debug('tittittittittittittittittittittittittittittit');
                $$log.debug(navbarShow);
                $scope.navbarShow = navbarShow;
                // $scope.$apply();
            });
            //返回按钮
            $rootScope.$on('setNavbarReturnBtnShow', function (e, returnBtnShow) {
                $scope.returnBtnShow = returnBtnShow;
                // $scope.$apply();
            });
            //设置标题
            $rootScope.$on('setNavbarTitle', function (e, titleContent) {
                $scope.navbarTitle = titleContent;
                // $scope.$apply();
                $timeout(function(){
                    $scope.$apply();
                });
            });

            //是否显示右侧按钮
            $rootScope.$on('setRightBtnShow', function (e, rightBtnShow) {
                $scope.rightBtnShow = rightBtnShow;
                // $scope.$apply();
            });

            //右侧按钮显示为icon-QR
            $rootScope.$on('setRightIconBtn', function (e, iconNum) {
                $scope.iconNum = iconNum;
                // $scope.$apply();
            });

            //右侧按钮显示为加号
            $rootScope.$on('setRightAddTagBtn', function (e, addTagBtn) {
                $scope.addTagBtn = addTagBtn;
                // $scope.$apply();
            });

            //右侧text
            $rootScope.$on('setRightTextBtn', function (e, textBtn) {
                $scope.textBtn = textBtn;
                // $scope.$apply();
            });

            $scope.goMessageTag = function(){

                $$log.debug('跳到首页');
                //点击跳过,跳到首页

                var t = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/messageTag';

                $$log.debug(t);
                jumpPage(t);

                function jumpPage(p){
                    location.href=p;
                }
            };

            //-----------to-dongsj
            // //右侧按钮显示为icon
            // $rootScope.$on('setRightIconBtn', function (e, iconNum) {
            //     $scope.iconNum = iconNum;
            // });
            //
            // //右侧text
            // $rootScope.$on('setRightTextBtn', function (e, textBtn) {
            //     $scope.textBtn = textBtn;
            // });

        }
    };
});