/**
 * Created by dongsj on 16/7/15.
 * 日志
 *
 ***********************************************************
 *
 * $$log.log/$$log.info/$$log.warn/$$log.error/$$log.debug
 * 输出log,通过输入参envirementIndex控制在对应环境的显示
 * info显示数据
 * warning显示警告
 * error显示错误
 * debug显示调试
 * log显示其他
 *
 */
app.factory('$$log', function ($log, $$env) {
    var isShowAll = false;
    var isHideAll = false;
    return {
        showAll: function (b) {
            isShowAll = b || true;
        },
        hideAll: function (b) {
            isHideAll = b || true;
        },
        log: function (str, envirementIndex) {
            envirementIndex = envirementIndex ? envirementIndex : 1;
            if (!isHideAll && (isShowAll || $$env.getEnvirement() <= envirementIndex)) {
                $log.log(str);
            }
        },
        info: function (str, envirementIndex) {
            envirementIndex = envirementIndex ? envirementIndex : 1;
            if (!isHideAll && (isShowAll || $$env.getEnvirement() <= envirementIndex)) {
                $log.info(str);
            }
        },
        warn: function (str, envirementIndex) {
            envirementIndex = envirementIndex ? envirementIndex : 1;
            if (!isHideAll && (isShowAll || $$env.getEnvirement() <= envirementIndex)) {
                $log.warn(str);
            }
        },
        error: function (str, envirementIndex) {
            envirementIndex = envirementIndex ? envirementIndex : 3;
            if (!isHideAll && (isShowAll || $$env.getEnvirement() <= envirementIndex)) {
                $log.error(str);
            }
        },
        debug: function (str, envirementIndex) {
            envirementIndex = envirementIndex ? envirementIndex : 1;
            if (!isHideAll && (isShowAll || $$env.getEnvirement() <= envirementIndex)) {
                $log.debug(str);
            }
        }
    };
});