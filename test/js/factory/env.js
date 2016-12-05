/**
 * Created by dongsj on 16/7/15.
 * 开发环境变量
 *
 ************************************************
 *
 * $$env.setEnvirement
 * 设置开发环境变量
 *
 * $$env.getEnvirement
 * 获取开发环境变量
 *
 */

app.factory('$$env', function () {
    var _envirementIndex = 0;
    return {
        setEnvirement: function (envirement) {
            switch (envirement) {
                case 'app':
                    _envirementIndex = 101;
                    break;
                case 'pro':
                    _envirementIndex = 2;
                    break;
                case 'dev':
                    _envirementIndex = 1;
                    break;
                case 'debug':
                    _envirementIndex = 3;
                    break;
            }
            // $$log.debug('$$env.setEnvirement'+envirement);
        },
        getEnvirement: function () {
            return _envirementIndex;
        }
    };
});