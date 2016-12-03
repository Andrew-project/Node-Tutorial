/**
 * Created by lixu on 16/9/14.
 */
var basicInfoObject = {
    "id": 0,
    'name': "",
    "organizationId": "",
    "organizationName": "",
    "departmentId": "",
    "departmentName": "",
    "professionalTitle": "",
    'avatarUrl': "",
    'phone': ""
};
var basicInfo = {
    "hospital": "",
    "office": ""
};
app.directive('basicInfoController', function () {
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/basicInfoController.html',
        replace: true,
        scope: {
            data: '=data'
        },
        controller: function ($$env, $scope, $element, $attrs, $$log, $state, $$toast, $http, $$requestUrl, $$loading, $rootScope, $$iconfont) {
            if (basicInfoObject.name.length === 0 || basicInfoObject.professionalTitle.length === 0) {
                $scope.name = "";
                $scope.professionalTitle = "";
                $scope.hospitalName = "";
                $scope.departmentName = "";
                $scope.avatarUrl = "";
            } else {
                $scope.name = basicInfoObject.name;
                $scope.professionalTitle = basicInfoObject.professionalTitle;
                $('#id-1-img').attr('src', basicInfoObject.avatarUrl);
            }

            //跳页面选择值
            function getValueArr(valueArr) {
                switch (valueArr) {
                    case 'hospitalObj':
                        $$log.debug('hospitalObj');
                        $$log.debug(hospitalObj);
                        $scope.hospitalName = hospitalObj.organizationName;
                        $scope.hospitalId = hospitalObj.organizationId;
                        break;
                    case 'departmentObj':
                        $scope.departmentName = departmentObj.departmentName;
                        $scope.departmentId = departmentObj.departmentId;
                        break;
                }
            }

            //页面在加载时读取orderArr,attentionObjArr,classArr,remindArr
            getValueArr('hospitalObj');
            getValueArr('departmentObj');

            $scope.goChoiceHospital = function () {
                basicInfoObject.name = $scope.name;
                basicInfoObject.professionalTitle = $scope.professionalTitle;
                basicInfoObject.avatarUrl = $('#id-1-img').attr('src');
                basicInfo.hospital = true;
                $state.go('choiceHospital');
            };

            //跳转选择科室页面
            $scope.goChoiceDepartment = function () {
                if ($scope.hospitalName === '' || $scope.hospitalName === undefined) {
                    $$toast.show('请先选择所在医院');
                } else {
                    basicInfoObject.name = $scope.name;
                    basicInfoObject.professionalTitle = $scope.professionalTitle;
                    basicInfoObject.avatarUrl = $('#id-1-img').attr('src');
                    basicInfo.office = true;
                    $state.go('choiceDepartment', {'hospitalId': $scope.hospitalId});
                }
            };

            //上传头像
            $scope.changeUserHead = function () {
                function guid() {
                    function s4() {
                        return Math.floor((1 + Math.random()) * 0x10000)
                            .toString(16)
                            .substring(1);
                    }

                    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                        s4() + '-' + s4() + s4() + s4();
                }

                var file = document.getElementById('id-1-file').files[0];
                var localUrl = document.getElementById('id-1-file').files[0].name;

                function getFileName(o) {
                    var pos = o.lastIndexOf(".");
                    // var last = pos.lastIndexOf(".");
                    return o.substring(pos + 1);
                }

                var postfix = getFileName(localUrl);
                var storeAs = 'avatar/' + guid() + '.' + postfix;
                $$log.debug('$$env');
                $$log.debug($$env.getEnvirement());
                var bucket = '';
                var urlStr = '';
                if ($$env.getEnvirement() == 1) {
                    $$log.debug('dev 1');
                    bucket = 'yhjstatic-dev';
                    urlStr = 'http://yhjstatic-dev.oss-cn-shanghai.aliyuncs.com/'
                } else if ($$env.getEnvirement() == 2) {
                    $$log.debug('pro 2');
                    bucket = 'yhjstatic';
                    urlStr = 'http://yhjstatic.oss-cn-shanghai.aliyuncs.com/';
                }
                $$log.debug('bucket' + bucket);
                $$log.debug('ulrStr' + urlStr);

                var client = new OSS.Wrapper({
                    region: 'oss-cn-shanghai',
                    accessKeyId: 'LTAICadISGBAyskk',
                    accessKeySecret: 'TSnzCdIizqqW1QdW7VxbBJYStaMeZj',
                    bucket: bucket
                });
                $$loading.show();
                client.multipartUpload(storeAs, file).then(function (result) {
                    var url = urlStr + result.name + '?x-oss-process=image/resize,h_500';
                    $$log.debug('返回的图片路径为：' + url);
                    $scope.headImgUrl = url;
                    document.getElementById('id-1-img').src = url;
                    $scope.avatarUrl = document.getElementById('id-1-img').src;
                    $$loading.hide();
                }).catch(function (err) {
                    $$loading.hide();
                    $$toast.show('上传失败！请重新上传');
                    $$log.debug(err);
                });
            };

            $('#id-1-img').on('click', function () {
                var id = $(this).attr('id');
                console.log(id);
                $('#id-1-file').trigger('click');
            });

            $scope.nextTwoUser = function () {
                $scope.avatarUrl = $('#id-1-img').attr('src');
                $$log.debug('$scope.avatarUrl' + $scope.avatarUrl);
                var isHospitalNameNull = ($scope.hospitalName == '' || typeof $scope.hospitalName == 'undefined');
                var isDepartmentNameNull = ($scope.departmentName == '' || typeof $scope.departmentName == 'undefined');
                $$log.debug('departmentName' + isHospitalNameNull);
                $$log.debug('isDepartmentNameNull' + isDepartmentNameNull);

                if ($scope.name == '' || $scope.professionalTitle == '' || isHospitalNameNull || isDepartmentNameNull) {
                    $$toast.show('请检查信息再提交');
                    return false;
                } else {
                    basicInfoObject = {
                        "id": parseInt(localStorage.globalNurseId),
                        'name': $scope.name,
                        "organizationId": $scope.hospitalId,
                        "organizationName": $scope.hospitalName,
                        "departmentId": $scope.departmentId,
                        "departmentName": $scope.departmentName,
                        "professionalTitle": $scope.professionalTitle,
                        'avatarUrl': $scope.avatarUrl,
                        'phone': globalNursePhone.toString()
                    };
                    $http({
                        method: 'PATCH',
                        url: $$requestUrl.getUrl("createBasicInfo", {"nurseId": localStorage.globalNurseId}),
                        data: {
                            'basic': basicInfoObject
                        }
                    }).success(function (response) {
                        if (response.result.success === true) {
                            $state.go('professionInfo');
                            $$log.debug('creatBasicInfo');
                            $$log.info(response);
                            localStorage.globalDepartmentId = $scope.departmentId;
                            localStorage.department = $scope.departmentName;
                            localStorage.hospital = $scope.hospitalName;
                            localStorage.hospitalId = $scope.hospitalId;

                        } else {
                            $$toast.show(response.result.displayMsg.toString() ? response.result.displayMsg.toString() : '服务器扔过来一个错误');
                        }
                    });
                }
            };
            localStorage.globalDepartmentId = $scope.departmentId;
        }
    };
});
