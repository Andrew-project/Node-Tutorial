/**
 * Created by dongsj on 16/10/11.
 */
app.controller('guidePageStateController', function ($rootScope, $state, $scope, $location, $$log, $$title, $$navbar, $$tabbar, $$shence) {
    $$shence.track('_guidePageStateController', {
        appStoreName: appStoreName
    });
    localStorage.guided = 'true';
    $$tabbar.hide();
    $$navbar.hide();
});
