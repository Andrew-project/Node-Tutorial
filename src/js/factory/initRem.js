/**
 * Created by dongsj on 16/7/15.
 * 重算跟节点字号
 *
 * ********************************
 *
 * $$initRem.init
 * 返回初始化方法
 *
 * $$initRem.getSize
 * 返回rem对应px字号
 *
 */
app.factory('$$initRem', function ($$log) {
    return {
        init: function () {
            function resizeHtmlFont() {
                var hW = $("html").width();
                $("body,html").css("font-size", hW / 16 + "px");
                $$log.debug('$$initRem.resizeHtmlFont');
            }

            resizeHtmlFont();
            addEventListener("orientationchange", function (e) {
                resizeHtmlFont();
                e.preventDefault();
            });
            addEventListener("resize", function (e) {
                resizeHtmlFont();
                e.preventDefault();
            });
            $(document).ready(function () {
                resizeHtmlFont();
            });
        },
        getSize: function () {
            return $("html").width() / 16;
        }
    };
});