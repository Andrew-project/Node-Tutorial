/**
 * Created by dongsj on 16/10/27.
 */
app.directive('guidePageController', function () {
        return {
            restrict: 'AE',
            templateUrl: 'templates/controller/guidePageController.html',
            replace: true,
            scope: {},
            controller: function ($timeout,$scope) {
                var swiper;
                // localStorage.clear();
                $scope.selIndex=0;
                localStorage.guided='true';
                $timeout(function () {
                    swiper = new Swiper('.swiper-container',{
                        pagination: '.swiper-pagination',
                        onSlideNextStart:function(){
                            $scope.selIndex++;
                            $timeout(function(){
                                $scope.$apply();
                            });
                        },
                        onSlidePrevStart:function(){
                            $scope.selIndex--;
                            $timeout(function(){
                                $scope.$apply();
                            });
                        }
                    });
                });
                $scope.next = function () {
                    swiper.slideNext();
                }
            }
        }
    }
);
