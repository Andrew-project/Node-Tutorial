/**
 * Created by dongsj on 16/7/15.
 * 神策打点
 *
 ****************************************************
 *
 * $$shence.identify
 * 设置用户信息
 *
 * $$shence.track
 * 记录用户操作
 *
 */
app.factory('$$shence', function ($$log, $$env) {
    return {
        init: function () {
            //神策初始化
            (function (para) {
                var p = para.sdk_url, n = para.name, w = window, d = document, s = 'script', x = null, y = null;
                w.sensorsDataAnalytic201505 = n;
                w[n] = w[n] || function (a) {
                        return function () {
                            (w[n]._q = w[n]._q || []).push([a, arguments]);
                        };
                    };
                var ifs = ['track', 'quick', 'register', 'registerPage', 'registerOnce', 'registerSession', 'registerSessionOnce', 'trackSignup', 'trackAbtest', 'setProfile', 'setOnceProfile', 'appendProfile', 'incrementProfile', 'deleteProfile', 'unsetProfile', 'identify'];
                for (var i = 0; i < ifs.length; i++) {
                    w[n][ifs[i]] = w[n].call(null, ifs[i]);
                }
                if (!w[n]._t) {
                    x = d.createElement(s);
                    y = d.getElementsByTagName(s)[0];
                    x.async = 1;
                    x.src = p;
                    y.parentNode.insertBefore(x, y);
                    w[n]._t = 1 * new Date();
                    w[n].para = para;
                }
            })({
                sdk_url: 'js/lib/sensorsdata.min.js ',
                name: 'sa',
                server_url: 'http://123.56.231.188:8006/sa?project=yhzs_nurse'
                // server_url: 'http://123.56.231.188:8007/sa'
            });
        },
        identify: function (name, info) {
            if (sa !== undefined) {
                $$log.debug('shence.identify');
                $$log.info(name);
                $$log.info(info);
                // if ($$env.getEnvirement() > 1) {
                sa.identify(name, info);
                // }
            } else {
                $$log.error('shence is not loaded');
            }
        },
        track: function (name, info) {
            if (sa !== undefined) {
                info = info || {};
                info.departmentId = localStorage.globalDepartmentId;
                info.hospitalId = localStorage.hospitalId;
                info.department = localStorage.department;
                info.hospital = localStorage.hospital;
                info.phone = localStorage.phone;
                info.appStoreName = appStoreName;
                $$log.debug('shence.track');
                $$log.info(name);
                if (localStorage.globalNurseId) {
                    sa.identify(localStorage.globalNurseId);
                }
                sa.track(name, info);
                sa.quick('autoTrack');//神策系统必须是1.4最新版及以上
                // }
            } else {
                $$log.error('shence is not loaded');
            }
        }
    };
});