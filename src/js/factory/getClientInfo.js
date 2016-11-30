/**
 * Created by dongsj on 16/10/10.
 * get hplus ClientInfo
 */
app.factory('$$getClientInfo', function ($$env, $$toast, $$log) {
    var emptyDeviceInfo = {
        appod: 'test',
        appkey: 'test',
        token: 'test',
        clientid: 'test'
    };
    // $$log.debug('$$env.getEnvirement()'+$$env.getEnvirement());
    localStorage.getEnvirement = $$env.getEnvirement();

    if ($$env.getEnvirement() == 0) {
        return emptyDeviceInfo;
    } else {
        try {
            // $$toast.show(JSON.stringify(plus.push.getClientInfo()));
            $$log.debug('$$getClientInfo');
            $$log.info(JSON.stringify(plus.push.getClientInfo()));
            return plus.push.getClientInfo();
        } catch (e) {
            // $$toast.show('无法获取设备信息');
            return emptyDeviceInfo;
        }
    }
});