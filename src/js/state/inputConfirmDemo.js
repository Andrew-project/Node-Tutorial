/**
 * Created by dongsj on 2016/9/14.
 */
app.controller("inputConfirmDemo", function ($$confirm, $timeout, $$loading, $$toast, $$navbar) {
    $timeout(function () {
        $$navbar.setTitle('test');
        $$navbar.showReturnBtn();
        $$confirm.show({
            title: 'confirm',
            msg: '<input class="h3 border-line border-color-global-base" type="text">',
            callback: function () {
                $$toast.show('confirm clicked', function () {
                    $$loading.show();
                });
            },
            confirmText: 'confirm',
            cancelText: 'cancel'
        });
    });
});