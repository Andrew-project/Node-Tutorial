/**
 * Created by yihuan on 16/9/29.
 */
var nurseInfo = {};

app.controller('aletrNurseInfoStateController',function($$env,$$tabbar,$interval,$$requestUrl,$http,$$toast,$$navbar,$rootScope, $state, $scope,$location, $$log, $$title,getData, $$loading,$$confirm){
    $scope.data = getData.data;

    if (nurseInfo.basic !== undefined) {
        $scope.data = nurseInfo;
        if ($scope.data.occupation.certs.length > 0 ) {
            $scope.data.occupation.certs = JSON.stringify($scope.data.occupation.certs);
        } else {
            $scope.data.occupation.certs = '';
        }
        if ($scope.data.occupation.photocopy.length > 0) {
            $scope.data.occupation.photocopy = JSON.stringify($scope.data.occupation.photocopy);
        } else {
            $scope.data.occupation.photocopy = '';
        }
    } else {
        nurseInfo = $scope.data;
    }
    //认证之后，不允许再修改
    if(typeof getData.data.basic != "undefined" &&  getData.data.basic.authorizedStatus > 2 ){

        $scope.isPass = true;

    }else{
        $scope.isPass = false;
    }

    if ($scope.data.result.success) {
        if ($scope.data.occupation.certs === '') {
            $scope.data.occupation.certs = [{"certNo": "", "certName": "护士执业证书管理号"},{"certNo": "", "certName": "护士专业技术资格证书管理号"},{"certNo": "", "certName": ""}];
        } else {
            $scope.data.occupation.certs = JSON.parse($scope.data.occupation.certs);
            if ($scope.data.occupation.certs.length < 3) {
                $scope.data.occupation.certs.push({"certNo": "", "certName": ""});
            }
        }
        $scope.data.occupation.photocopy = $scope.data.occupation.photocopy === ''? []:JSON.parse( $scope.data.occupation.photocopy);
    }

    $$title.setTitle('优护助手 - 身份认证');
    $$navbar.showReturnBtn();
    $$tabbar.setIndex(-1);

    $scope.isAlert = false;

    $scope.setIsAlert = function(){
        $scope.isAlert = ! $scope.isAlert;
    };


    $scope.basic = $scope.data.basic;
    $scope.occupation = $scope.data.occupation;

    if (aletrNurseInfoHospital.organizationId !== undefined) {
        $scope.basic.organizationName = aletrNurseInfoHospital.organizationName;
        $scope.basic.organizationId = aletrNurseInfoHospital.organizationId;
        $scope.basic.departmentName = "";
        $scope.basic.departmentId = "";
    }

    if (aletrNurseInfoOffice.departmentName !== undefined) {
        $scope.basic.departmentName = aletrNurseInfoOffice.departmentName;
        $scope.basic.departmentId = aletrNurseInfoOffice.departmentId;
    }

    $scope.count = 0;

    $scope.checkPhone = function(){
        if($scope.basic.phone.toString().length < 11){
            $$toast.show('输入的电话号码不正确');
        } else {
            $http({
                method: 'POST',
                url: $$requestUrl.getUrl("getAlertPhoneCaptcha"),
                data: {
                    "phone":$scope.basic.phone
                }
            }).success(function (response) {
                if(response.result.success === true ){
                    // 倒计时
                    $scope.count = 60;
                    if($scope.count > 0){
                        $scope.countDown = $interval(function(){
                            $scope.count--;
                        },1000,60);
                    }
                } else {
                    $$toast.show(response.result.displayMsg);
                }
            });
        }
    };

    $scope.goChoiceHospital = function () {
        if($scope.isPass == false){
            $state.go('choiceHospital');
        }else{
            return;
        }
    };

    $scope.goChoiceDepartment = function () {
        if($scope.isPass == false){
            $state.go('choiceDepartment', {'hospitalId': $scope.basic.organizationId});
        }else{
            return;
        }
    };

    $scope.delUrl= function (url) {
        if($scope.isPass == false){
            $$confirm.show({
                title: '删除提示',
                msg: '<p style="text-align: center;">确定要删除该图片吗？</p>',
                callback: function () {
                    var urls = $scope.data.occupation.photocopy;
                    for (var i =0 ; i< urls.length; i++) {
                        if (url == urls[i]) {
                            $scope.data.occupation.photocopy.splice(i, 1);
                        }
                    }
                    $$toast.show('删除成功');
                },
                confirmText: '确定',
                cancelText: '取消'
            });
        }else{
            return;
        }

    };

    function bindPicInput(id) {
        //trigger触发input
        $('' + id + '-file').trigger('click');

        $('' + id + '-img').bind("click", function () {
            $('' + id + '-file').trigger('click');
        });
    }

    $scope.imgIndex = 0;


    if($scope.isPass == false){
        $('#id-1').on('click', function () {
            var id = $(this).attr('id');
            bindPicInput("#" + id);
            $scope.imgIndex = 1;
        });

        $('#id-0-img').on('click', function () {
            $('#id-0-file').trigger('click');
            $scope.imgIndex = 0;
        });
    }



    $scope.putCertificate = function(id){
        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }
        var file, localUrl;
        if ($scope.imgIndex === 0) {
            file = document.getElementById('id-0-file').files[0];
            localUrl = document.getElementById('id-0-file').files[0].name;
        } else {
            file = document.getElementById('id-1-file').files[0];
            localUrl = document.getElementById('id-1-file').files[0].name;
        }

        function getFileName(o){
            var pos=o.lastIndexOf(".");
            // var last = pos.lastIndexOf(".");
            return o.substring(pos+1);
        }

        var postfix =  getFileName(localUrl);
        var storeAs = 'avatar/' + guid() + '.'+postfix+'';

        var bucket = '';
        var urlStr ='';
        if($$env.getEnvirement() == 1){
            $$log.debug('dev 1');
            bucket = 'yhjstatic-dev';
            urlStr = 'http://yhjstatic-dev.oss-cn-shanghai.aliyuncs.com/';

        }else if($$env.getEnvirement() == 2){
            $$log.debug('pro 2');
            bucket = 'yhjstatic';
            urlStr = 'http://yhjstatic.oss-cn-shanghai.aliyuncs.com/';
        }

        var client = new OSS.Wrapper({
            region: 'oss-cn-shanghai',
            accessKeyId: 'LTAICadISGBAyskk',
            accessKeySecret: 'TSnzCdIizqqW1QdW7VxbBJYStaMeZj',
            bucket: bucket
        });

        $$loading.show();
        client.multipartUpload(storeAs, file).then(function (result) {
            var url = urlStr + result.name+'?x-oss-process=image/resize,h_500';
            if ($scope.imgIndex === 0) {
                $scope.data.basic.avatarUrl = url;
                $$log.debug('url++'+ $scope.data.basic.avatarUrl);
                $scope.$apply();
                $$loading.hide();
            } else {
                $scope.data.occupation.photocopy.push(url);
                $scope.$apply();
                $$loading.hide();
                $('#id-1-text').hide();
                $('#id-2-text').show();
            }
        }).catch(function (err) {
            $$loading.hide();
            $$toast.show('上传失败！请重新上传');
            $$log.debug(err);
        });
    };


    $scope.register = function () {
        // var basicData = $scope.data.basic;
        // var occupationData = $scope.data.occupation;
        var certs = [];
        for (var j=0; j< $scope.data.occupation.certs.length; j++) {
            if ($scope.data.occupation.certs[j].certNo !== "" && $scope.data.occupation.certs[j].certName !== "") {
                certs.push($scope.data.occupation.certs[j]);
            }
        }

        if($scope.data.basic.name == ''){
            $$toast.show('用户姓名不能为空');
        }else{
            $$loading.show();
            $http({
                method: 'patch',
                url: $$requestUrl.getUrl("updateNurseInfo", {"nurseId": localStorage.globalNurseId}),
                data: {
                    "basic": {
                        "id": parseInt(localStorage.globalNurseId),
                        "name": $scope.data.basic.name,
                        "avatarUrl": $scope.data.basic.avatarUrl,
                        // "phone": $scope.data.basic.phone,
                        // "captcha": $scope.identifyCode,
                        "authorizedName": $scope.data.basic.authorizedName,
                        "authorizedStatus":  parseInt($scope.data.basic.authorizedStatus),
                        "departmentId": $scope.data.basic.departmentId,
                        "organizationId": $scope.data.basic.organizationId,
                        "organizationName": $scope.data.basic.organizationName,
                        "departmentName": $scope.data.basic.departmentName,
                        "professionalTitle": $scope.data.basic.professionalTitle,
                        // "qrImgUrl": null
                    },
                    "occupation": {
                        "IDNumber": $scope.data.occupation.IDNumber,
                        "certs": JSON.stringify(certs),
                        "photocopy": JSON.stringify($scope.data.occupation.photocopy)
                    }
                }
            }).success(function (response) {
                if(typeof response.result != "undefined"){
                    $$loading.hide();
                }
                if (response.result.success === true) {
                    $$toast.show("数据提交成功");
                    nurseInfo = {};
                    history.go(-1);
                } else {
                    $$toast.show( response.result.displayMsg);
                }
            });

        }

        // if(basicData.phone != "" ){
        //     $$toast.show('手机号不能为空');
        // }else  if(){
        //
        // }

        // if (basicData.organizationName === '' || basicData.departmentName === '' || basicData.name === '' || basicData.phone === '' || basicData.professionalTitle === '' || occupationData.IDNumber === '' ||   occupationData.certs[0].certNo === '' || occupationData.certs[1].certNo === '' || occupationData.photocopy.length < 1 || (occupationData.certs[2].certNo !== '' && occupationData.certs[2].certName === '') || (occupationData.certs[2].certName !== '' && occupationData.certs[2].certNo === '')) {
        //     $$toast.show('请检查信息再提交');
        //     return false;
        // } else {
        //
        // }
    };
});

