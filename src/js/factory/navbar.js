/**
 * Created by dongsj on 16/8/10.
 * navbar
 * *********************
 * $$navbar.show
 * 显示navbar
 *
 * $$navbar.hide
 * 隐藏navbar
 *
 * $$navbar.showReturnBtn
 * 显示navbar的returnBtn
 *
 * $$navbar.hideReturnBtn
 * 隐藏navbar的returnBtn
 *
 * $$navbar.setTitle
 * 设置navbar的title
 */
app.factory('$$navbar', function ($$log, $rootScope) {
    return {
        //只能向父级传递data
        show: function () {
            $rootScope.$emit('setNavbarShow', true);
            $$log.debug($rootScope.setNavbarShow);
            $$log.debug('$$navbar.hide');
        },

        hide: function () {
            $rootScope.$emit('setNavbarShow', false);
            $$log.debug($rootScope.setNavbarShow);
            $$log.debug('$$navbar.hide');
        },

        showReturnBtn: function () {
            $rootScope.$emit('setNavbarReturnBtnShow', true);
            $$log.debug('$$navbar.showReturnBtn');
        },
        hideReturnBtn: function () {
            $rootScope.$emit('setNavbarReturnBtnShow', false);
            $$log.debug('$$navbar.hideReturnBtn');
        },
        setTitle: function (titleContent) {
            $rootScope.$emit('setNavbarTitle', titleContent);
            $$log.info(titleContent);
        },
        setRightBtnShow: function(showStyle,content){
            $rootScope.$emit('setRightBtnShow', true);
            var info = '';
            switch(showStyle) {


                //-----to-dongsj
                // //右侧按钮显示为icon
                // case 1:
                //     $rootScope.$emit('setRightIconBtn', content);
                //     info = 'setRightIconBtn';
                //     break;
                //
                // //右侧显示为text
                // case 2:
                //     $rootScope.$emit('setRightTextBtn',content);
                //     info = 'setRightTextBtn';
                //     break;



                //右侧按钮显示为QR
                case 1:
                    $rootScope.$emit('setRightIconBtn', true);
                    info = 'setRightIconBtn';
                    break;

                //右侧按钮显示为加号
                case 2:
                    $rootScope.$emit('setRightAddTagBtn', true);
                    break;

                //右侧显示为text
                case 3:
                    $rootScope.$emit('setRightTextBtn',content);
                    info = 'setRightTextBtn';
                    break;

            }

            $$log.debug('$$navbar.showRightQRbtn'+'showstyle:'+info);

        },

        hideRightQRbtn: function(){
            $rootScope.$emit('setRightBtnShow', false);
            $$log.debug('$$navbar.hideRightQRbtn');
        }


    };
});