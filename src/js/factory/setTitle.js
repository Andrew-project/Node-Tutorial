/**
 * Created by dongsj on 16/7/15.
 * 设置titile方法,针对微信重新加载favicon
 */
app.factory('$$title', function ($$getUserAgent, $timeout,$$log,$$navbar) {
    return {
        setTitle: function (title) {
            var $body = $('body');
            document.title = title;
            $$navbar.setTitle(title);
            if ($$getUserAgent.versions.weixin || $$getUserAgent.mobile) {
                var $iframe = $('<iframe style="display: none" src="/favicon.ico"></iframe>').on('load', function () {
                    $timeout(function () {
                        $iframe.remove();
                        $$log.debug('$$title.setTitle.removeIframe');
                    }, 100);
                }).appendTo($body);
            }
            $$log.debug('$$title.setTitle');
        }
    };
});