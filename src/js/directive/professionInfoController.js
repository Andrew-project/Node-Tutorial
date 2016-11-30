/**
 * Created by lixu on 16/9/14.
 */
app.directive('professionInfoController', function () {
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/professionInfoController.html',
        replace: true,
        scope: {
            data: '=data'
        },
        controller: function ($$env,$$loading, $scope, $element, $attrs, $$log, $state, $http, $$requestUrl, $$toast) {
            $scope.IDNumber = "";
            $scope.practiceNum = "";
            $scope.technologyNum = "";
            $scope.otherName = "";
            $scope.otherNum = "";
            $scope.numAllrr = [2];
            $scope.numArrLength = 1;
            $scope.photocopyArr = [];
            $scope.imgArray = [];

            function bindPicInput(id) {
                //trigger触发input
                $('' + id + '-file').trigger('click');
                $('' + id + '-img').bind("click", function () {
                    $('' + id + '-file').trigger('click');
                });
            }
            $('#id-1').on('click', function () {
                var id = $(this).attr('id');
                bindPicInput("#" + id);
            });

            $scope.delImg = function (img) {
                img.isShow = !img.isShow;
            };

            $scope.changeUserHead = function (id) {
                function guid() {
                    function s4() {
                        return Math.floor((1 + Math.random()) * 0x10000)
                            .toString(16)
                            .substring(1);
                    }

                    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                        s4() + '-' + s4() + s4() + s4();
                };
                var file = document.getElementById('id-1-file').files[0];
                var localUrl = document.getElementById('id-1-file').files[0].name;

                function getFileName(o) {
                    var pos = o.lastIndexOf(".");
                    // var last = pos.lastIndexOf(".");
                    return o.substring(pos + 1);
                }

                var postfix = getFileName(localUrl);
                var storeAs = 'avatar/' + guid() + '.' + postfix;
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
                    $$log.debug('返回的图片路径为：' + url);
                    $scope.imgArray.push({
                        'url': url,
                        'isShow': true
                    });
                    $scope.$apply();
                    $$loading.hide();
                    $('#id-1-text').hide();
                    $('#id-2-text').show();
                }).catch(function (err) {
                    $$loading.hide();
                    $$toast.show('上传失败！请重新上传');
                    $$log.debug(err);
                });
            };

            $scope.register = function () {
                for (var i = 0; i < $scope.imgArray.length; i++) {
                    if ($scope.imgArray[i].isShow == true) {
                        $scope.photocopyArr.push($scope.imgArray[i].url);
                    }
                }

                $scope.occupation = {
                    "IDNumber": $scope.IDNumber.toString(),
                    "certs": JSON.stringify([
                        {
                            "certNo": $scope.practiceNum,
                            "certName": "护士执业证书管理号"
                        }, {
                            "certNo": $scope.technologyNum,
                            "certName": "护士专业技术资格证书管理号"
                        }, {
                            "certNo": $scope.otherNum,
                            "certName": $scope.otherName
                        }
                    ]),
                    "photocopy": JSON.stringify($scope.photocopyArr)
                };
                function jumpPage(p) {
                    location.href = p;
                }
                if ($scope.photocopyArr.length < 0 || $scope.IDNumber == '' || $scope.practiceNum == '' || $scope.technologyNum == '' || $scope.photocopyArr.length < 0) {
                    $$toast.show('请检查信息再提交');
                    return false;
                } else {
                    var obj = {
                        // "basic": basicInfoObject,
                        "occupation": $scope.occupation
                    };
                    $$log.info(obj);
                    $http({
                        method: 'PATCH',
                        url: $$requestUrl.getUrl("createProfessionInfo", {"nurseId": localStorage.globalNurseId}),
                        data: {
                            // "basic":basicInfoObject,
                            "occupation": $scope.occupation
                        }
                    }).success(function (response) {
                        $$log.debug('createRegisterInfoStateController');
                        $$log.info(response);
                        if (response.result.success == true) {
                            //打开首页
                            var t = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/messageTag';
                            jumpPage(t);
                        } else {
                            $$toast.show(response.result.display);
                        }
                    });
                }
            };
        }
    };
});
