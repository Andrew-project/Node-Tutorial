/**
 * Created by dongsj on 16/8/10.
 * http拦截器
 */
app.factory('$$timestampMarker', function ($$requestUrl, $$log, $location, $q, $injector, $$env, $$toast,$timeout) {
    //http拦截器
    return {
        request: function (config) {
            config.requestTimestamp = new Date().getTime();
            config.headers['Authorization'] = localStorage.token || 'empty';
            config.headers['Accept'] = 'application/json';
            config.headers['Access-Control-Allow-Origin'] = '*';
            config.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
            config.headers['Access-Control-Allow-Headers'] = 'X-Requested-With';
            config.headers['Content-Type'] = 'application/json';
            // header('Access-Control-Allow-Origin: *');
            // header('Access-Control-Allow-Headers: X-Requested-With');
            $$log.debug('requestSend');
            $$log.info(config);
            return config;
        },
        responseError: function (response) {
            $$log.debug('responseError');
            $$log.debug(response);
            if (response.status == 500) {
                $$toast.show('服务器错误');
                //     location.href = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/' + 'login';
                // location.hash = 'login';
            }
        },
        response: function (response) {
            console.log(response);
            if(response.data.result && response.data.result.success == false && response.data.result.displaymsg===undefined){
                response.data.result.displaymsg=response.data.result.displayMsg;
            }
            if(response.data.result && response.data.result.success == false && response.data.result.displayMsg===undefined){
                response.data.result.displayMsg=response.data.result.displaymsg;
            }
            if (response.data.result && (response.data.result.success == false || response.data.result.success == 'false') && response.data.result.code == 401) {
                localStorage.clear();
                localStorage.guided = 'true';
                $timeout(function(){
                    location.href = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/' + 'login';
                },1000);
                location.href = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/' + 'login';
            }
            if (response.data.result && (response.data.result.success == false || response.data.result.success == 'false') && response.data.result.code == 403) {
                $$toast.show(response.data.result.displayMsg,function(){
                    // location.href = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/' + 'userCenter';
                });
                location.href = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/' + 'userCenter';
            } else if (response.data.result && response.data.result.success == false && response.data.result.code > 10000) {
                $$toast.show(response.data.result.displayMsg);
            }
            response.config.responseTimestamp = new Date().getTime();
            return response;

        }
    };
});