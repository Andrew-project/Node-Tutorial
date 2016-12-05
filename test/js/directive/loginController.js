/**
 * Created by lixu on 16/9/14.
 */
var globalNursePhone = "";
app.directive('loginController', function () {
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/loginController.html',
        replace: true,
        controller: function ($scope, $element, $attrs, $$log, $state, $interval, $$txIM, $http, $$requestUrl, $$getClientInfo, $$toast, $rootScope, $$iconfont, $$loading,$$shence) {
            //$scope.iconfont = $$iconfont.init;
            $scope.phone = "";
            $scope.identifyCode = "";
            $scope.password = "";
            $scope.count = 0;
            // localStorage.clear();
            $scope.checkPhone = function () {
                if ($scope.phone.toString().length == 0) {
                    $$toast.show('输入的电话号码不能为空');
                } else {
                    if ($scope.phone.toString().length < 11) {
                        $$toast.show('输入的电话号码不正确');
                    } else {
                        $$loading.show();
                        $http({
                            method: 'POST',
                            url: $$requestUrl.getUrl("getLoginPhoneCaptcha"),
                            data: {
                                "phone": $scope.phone.toString()
                            }
                        }).success(function (response) {
                            if(typeof response.result.success != "undefined"){
                                $$loading.hide();
                            }
                            $$log.info(response);
                            if (response.result.success == true) {

                                // 倒计时
                                $scope.count = 60;
                                if ($scope.count > 0) {
                                    $scope.countDown = $interval(function () {
                                        $scope.count--;
                                        $$log.debug($scope.count);

                                    }, 1000, 60);
                                }
                            } else {
                                $$toast.show(response.result.displayMsg);
                            }
                        });
                    }
                }
            };

            //点击登录
            $scope.nextUser = function () {
                if ($scope.phone.toString().length <= 0 || $scope.identifyCode.toString().length <= 0) {
                    $$toast.show('请检查再提交');
                    return false;
                } else {
                    //别在倒计时了
                    $$loading.show();
                    //登录
                    var phone = $scope.phone;
                    var captcha = $scope.identifyCode;
                    localStorage.phone = phone.toString();
                    $http({
                        method: 'post',
                        url: $$requestUrl.getUrl("signIn"),
                        data: {
                            "phone": phone.toString(),
                            "captcha": captcha.toString()
                        }
                    }).success(function (response) {
                        if (typeof response.result.success != "undefined") {
                            $$loading.hide();
                        }
                        if (response.result.success == false) {
                            $$toast.show('验证码错误');
                            return false;
                        } else {
                            $interval.cancel($scope.countDown);
                            $$log.info(response);
                            localStorage.token = response.token;
                            localStorage.globalNurseId = response.nurse.id;
                            localStorage.authorizedStatus = response.nurse.authorizedStatus;
                            // $$shence.identify(response.nurse.id);
                            $$log.debug('response.nurse.phone'+response.nurse.phone);
                            $$log.debug(' phone.toString()'+ phone.toString());
                            globalNursePhone = response.nurse.phone ? response.nurse.phone : phone.toString() ;
                            $$log.debug('localStorage.token:' + localStorage.token);
                            $$log.debug('LocalStorage.globalNurseId:' + localStorage.globalNurseId);
                            $$log.debug('globalNursePhone:' + globalNursePhone);

                            // 新用户
                            if (response.newly === true) {
                                $state.go('basicInfo');
                            } else {
                                if(typeof response.nurse.departmentId != "undefined" && response.nurse.departmentId != ""){
                                    localStorage.globalDepartmentId = response.nurse.departmentId;
                                }else{
                                    $$log.debug('localStorage.globalDepartmentId is null');
                                }
                                if(typeof response.nurse.departmentName != "undefined" && response.nurse.departmentName != ""){
                                    localStorage.department = response.nurse.departmentName;
                                }else{
                                    $$log.debug('localStorage.department is null');
                                }
                                if(typeof response.nurse.organizationName != "undefined" && response.nurse.organizationName != ""){
                                    localStorage.hospital = response.nurse.organizationName;
                                }else{
                                    $$log.debug('localStorage.hospital is null');
                                }
                                if(typeof response.nurse.organizationId != "undefined" && response.nurse.organizationId != ""){
                                    localStorage.hospitalId = response.nurse.organizationId;
                                }else{
                                    $$log.debug('localStorage.hospitalId is null');
                                }

                                $http({
                                    method: 'POST',
                                    url: $$requestUrl.getUrl("createDeviceClient"),
                                    data: {
                                        "personId": localStorage.globalNurseId,
                                        "cid": $$getClientInfo.clientid
                                    }
                                }).success(function (response) {

                                   if(response.result.success == false ){
                                        // $$toast.show(response.result.displayMsg ? response.result.displayMsg.toString() : '服务器扔过来一个错误');
                                        localStorage.gloalIsGetDeviceID = false;
                                    }else{
                                        localStorage.gloalIsGetDeviceID = true;
                                    }

                                    var t = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/messageTag';
                                    jumpPage(t);
                                    function jumpPage(p) {
                                        location.href = p;
                                    }
                                });
                            }
                        }
                    });
                }
            };
        }
    };
});