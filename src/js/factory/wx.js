/**
 * Created by dongsj on 16/7/15.
 * 微信相关操作,可链式调用
 *
 ********************************************************************
 *
 * $$wx.config
 * 配置微信js
 *
 * $$wx.setPayInfo
 * 设置微信支付信息
 *
 * $$wx.payAction
 * 调用微信支付
 *
 * $$wx.setShare
 * 设置微信分享
 *
 * $$wx.runReady
 * 绑定wx.ready,调用所有已设置函数
 *
 */
// var department='empty';
app.factory('$$wx', function ($http, $rootScope, $$requestUrl, $$log, $location) {
    var _payInfo = {
        timestamp: 0
    };
    var _wxReadyFunctionArray = [];
    return {
        getDepartment: function () {
            $$log.debug('$$wx.getDepartment');
            $$log.info(department);
            return department;
        },
        configByHttp: function (callback) {
            // if ($$env.getEnvirement() > 2) {
            //     return false;
            // }
            $http({
                method: 'GET',
                url: $$requestUrl.getUrl("wxInit"),
                cache: false,
                params: {url: $location.absUrl()}
            }).success(function (response) {
                // department = response.data;
                wx.config({
                    appId: response.appId,
                    timestamp: response.timestamp,
                    nonceStr: response.nonceStr,
                    signature: response.signature,
                    debug: false,
                    jsApiList: [
                        'onMenuShareTimeline',
                        'onMenuShareAppMessage',
                        'onMenuShareQQ',
                        'onMenuShareWeibo',
                        'onMenuShareQZone',
                        'hideOptionMenu',
                        'showOptionMenu',
                        'hideMenuItems',
                        'showMenuItems',
                        'hideAllNonBaseMenuItem',
                        'showAllNonBaseMenuItem',
                        'scanQRCode',
                        'chooseWXPay'
                    ]
                });
                $$log.debug('$$wx.configByHttp');
                $$log.info(response.data);
                callback(response.data);
            });
        },
        config: function (wxInfo) {
            wx.config(wxInfo);
            _wxReadyFunctionArray = [];
            return this;
        },
        getPayInfoByHttp: function (orderId) {
            $rootScope.$emit('loadingShow');
            $http({
                method: 'GET',
                url: '/user/pay/wechat-pay-info',
                params: {generalOrderId: orderId}
            }).success(function (response) {
                $rootScope.$emit('loadingHide');
                _payInfo = {
                    appId: response.appId,
                    timestamp: response.timeStamp,
                    nonceStr: response.nonceStr,
                    package: response.package,
                    signType: response.signType,
                    paySign: response.paySign,
                    success: function (res) {
                        $rootScope.$emit('toastShow', '支付成功', function () {
                            location.href = '#/orderList';
                        });
                    },
                    fail: function (res) {
                        $rootScope.$emit('toastShow', '支付失败', function () {
                            location.reload();
                        });
                    }
                };
            });
        },
        setPayInfo: function (payInfo) {
            _payInfo = payInfo;
            return this;
        },
        payAction: function (callback) {
            if (_payInfo.timestamp > 0) {
                wx.chooseWXPay({
                    timestamp: _payInfo.timestamp,
                    nonceStr: _payInfo.nonceStr,
                    package: _payInfo.package,
                    signType: _payInfo.signType,
                    paySign: _payInfo.paySign,
                    success: function (res) {
                        callback();
                    },
                    fail: function (res) {
                    }
                });
            } else {
                $rootScope.$emit('toastShow', '获取订单信息出错', function () {
                    location.reload();
                });
            }
            return this;
        },
        setShare: function (shareData) {
            var shareFunction = function () {
                wx.showOptionMenu();
                wx.onMenuShareAppMessage(shareData);
                wx.onMenuShareTimeline(shareData);
                wx.onMenuShareQQ(shareData);
                wx.onMenuShareWeibo(shareData);
                wx.onMenuShareQZone(shareData);
            };
            shareFunction();
            wx.ready(function () {
                shareFunction();
            });
            _wxReadyFunctionArray.push(shareFunction);
            return this;
        },
        runReady: function () {
            wx.ready(function () {
                for (var i = 0; i < _wxReadyFunctionArray.length; i++) {
                    _wxReadyFunctionArray[i]();
                }
                _wxReadyFunctionArray = [];
            });
            return this;
        }
    };
});