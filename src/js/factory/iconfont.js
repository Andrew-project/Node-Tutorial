/**
 * Created by dongsj on 16/7/15.
 * iconfont转换
 */
app.factory('$$iconfont', function ($$env) {
    return {
        init: function (ele) {
            if ($$env.getEnvirement() > 0) {
                ele = ele.replace('&#x', '');
                ele = ele.replace(';', '');
                ele = String.fromCharCode(parseInt(ele, 16));
            }
            return ele;
        }
    };
});