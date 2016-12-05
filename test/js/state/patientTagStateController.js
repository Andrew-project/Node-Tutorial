/**
 * Created by yihuan on 16/9/19.
 */
var pushPatient = [];
var pushPatientId = [];



app.controller('patientTagStateController', function ($stateParams, $rootScope, $state, $scope, $location, $$log, $$title, getData, $$tabbar, $$navbar, $http, $$requestUrl, $$toast, $$confirm, $$loading) {
    $scope.data = getData.data;
    $scope.dataArr = $scope.data;
    $$log.debug('patientTagStateController');
    $$log.info($scope.dataArr);
    // $$navbar.show();
    $$navbar.setTitle('患者');
    $$navbar.showReturnBtn();
    $$tabbar.setIndex(-1);
    $$tabbar.hide();
    pushPatient=[];
    pushPatientId=[];
    $scope.tagArr = [];
    $scope.seacheArr = [];
    $scope.showResult = false;


    //判断是选择沟通的对象,推送的对象
    $$log.debug('对页面的操作类型为' + $stateParams.operateType);
    // communicate -- 筛选需要沟通的对象, push -- 选择推送对象
    switch ($stateParams.operateType) {
        case 'communicate':
            $scope.show = 'communicate';
            break;
        case 'push':
            $scope.show = 'push';
            break;
    }

    //删除搜索条件
    $scope.delSeaTag = function (tag) {

        $$log.info('---seacheArr---tag---');
        $$log.debug('tag');
        $$log.debug(tag);
        $$log.debug('$scope.seacheArr');
        $$log.debug($scope.seacheArr);

        $$log.debug('$scope.showResult' + $scope.showResult);

        for (var j = 0; j < $scope.dataArr.tag.length; j++) {
            for (var k = 0; k < $scope.dataArr.tag[j].tag.length; k++) {
                $scope.dataArr.tag[j].tag[k].isActive = false;
            }
        }
        for (var i = 0; i < $scope.seacheArr.length; i++) {
            if ($scope.seacheArr[i].tagMember.tagId == tag.tagMember.tagId && tag.tagCategoryId == $scope.seacheArr[i].tagCategoryId) {
                $$log.debug('del');
                $scope.seacheArr.splice(i, 1);
                if($scope.seacheArr.length == 0){
                    $scope.showResult = false;
                    $$toast.show('请选择标签');
                    $$loading.hide();
                    $$log.debug('$scope.seacheArr');

                    $$log.debug($scope.seacheArr);
                    $$log.debug($scope.seacheArr == []);

                }
            }
        }
        for (var i = 0; i < $scope.seacheArr.length; i++) {
            for (var j = 0; j < $scope.dataArr.tag.length; j++) {
                for (var k = 0; k < $scope.dataArr.tag[j].tag.length; k++) {
                    // $$log.debug('$scope.data.tag[j].tag[k].tagId' + $scope.dataArr.tag[j].tag[k].tagId);
                    // $$log.debug('tag.tagId' + tag.tagMember.tagId);
                    if ($scope.dataArr.tag[j].tag[k].tagId == $scope.seacheArr[i].tagMember.tagId) {
                        $scope.dataArr.tag[j].tag[k].isActive = true;
                    }
                }
            }

        }
        $$log.debug($scope.seacheArr);

        if ($scope.seacheArr.length != 0) {

            if ($scope.showResult) {

                $$loading.show();

                $$log.debug('改变筛选条件，发送请求');

                var tags = [];

                if(tags.length != 0 ){
                    tags = [];
                }

                for (var j = 0; j < $scope.seacheArr.length; j++) {
                    tags.push($scope.seacheArr[j].tagMember.tagId);

                }



                $http({
                    method: 'GET',
                    url: $$requestUrl.getUrl("getTagPatientList", {"nurseId": localStorage.globalNurseId}),
                    params: {
                        "tag": tags.join(',')
                    }
                }).success(function (response) {
                    if (typeof response.result.success != 'undefined') {
                        $$loading.hide();
                    }
                    if (response.result.success === true) {
                        $scope.showResult = true;
                        $scope.userData = response.user;
                        $$log.debug($scope.userData);
                    } else {
                        $$log.debug('服务器返回错误');
                        var display = response.result.displayMsg;
                        $$toast.show(display.toString());
                    }
                    $$log.debug('getTagPatientList.response');
                    $$log.info(response);
                });
            }

        }
    };


    //添加搜索条件
    $scope.alertSeach = function (tag, tagMember) {

        tagMember.isActive = !tagMember.isActive;

        if (tagMember.isActive === true) {
            $scope.seacheArr.push({
                'tagCategoryId': tag.tagCategoryId,
                'tagMember': tagMember
            });
            $$log.debug($scope.seacheArr);
        } else {
            for (var i = 0; i < $scope.seacheArr.length; i++) {

                if ($scope.seacheArr[i].tagMember.tagId == tagMember.tagId) {

                    $scope.seacheArr.splice(i, 1);

                }
            }
            $$log.debug('del');

        }

    };

    //点击搜索
    $scope.tagSeacher = function () {

        $$log.debug($scope.seacheArr);
        var seacheArrTags = [];
        for (var i = 0; i < $scope.seacheArr.length; i++) {
            seacheArrTags.push($scope.seacheArr[i].tagMember.tagId);
        }
        $$log.debug('seacheArrTags');
        $$log.debug(seacheArrTags);


        if ($scope.seacheArr.length === 0) {
            $$toast.show('请输入筛选条件');
        } else {

            $$loading.show();

            $$log.debug(seacheArrTags);
            $$log.debug('seacheArrTags', seacheArrTags.join(','));

            $http({
                method: 'GET',
                url: $$requestUrl.getUrl("getTagPatientList", {"nurseId": localStorage.globalNurseId}),
                params: {
                    "tag": seacheArrTags.join(',')
                }
            }).success(function (response) {
                if (response.result.success != "undefined") {

                    $$loading.hide();

                }

                if (response.result.success === true) {

                    $scope.showResult = true;
                    $scope.userData = response.user;

                } else {
                    var display = response.result.displayMsg;

                    $$toast.show(display.toString());
                }

                $$log.debug('tagPatientList.response');
                $$log.info(response);
                $$log.debug($scope.seacheArr);

            });
        }

    };

    //返回添加搜素条件
    $scope.returnAddTag = function () {
        $scope.showResult = false;
    };

    //全选
    $scope.allCheck = function (userData) {
        userData.sel = (userData.sel == 2) ? 0 : 2;
        for (var i = 0; i < userData.length; i++) {
            for (var j = 0; j < userData[i].member.length; j++) {
                userData[i].member[j].sel = (userData.sel == 2);
            }
        }
    };

    //选择自己
    $scope.checkSelf = function (member) {
        // $$log.debug(allObj);

        // member.sel = !member.sel;

        // var selAll = true;
        // var unselAll = true;
        //
        // for (var i = 0; i < $scope.userData.length; i++) {
        //
        //     for (var j = 0; j < $scope.userData[i].member.length; j++) {
        //
        //         if ($scope.userData[i].member[j].sel === false) {
        //
        //             selAll = false;
        //
        //         } else {
        //
        //             unselAll = false;
        //
        //         }
        //     }
        //
        // }
        //
        // if (selAll === true) {
        //     $scope.userData.sel = 2;
        // } else if (unselAll === true) {
        //     $scope.userData.sel = 0;
        // } else {
        //     $scope.userData.sel = 1;
        // }
        // pushPatient.push(member.identifier);
        // $$log.debug('member.identifier'+member.identifier);
        // $state.go('contentList', {operateType: 'patientPushObj'});

    };

    //给患者推送信息
    $scope.pushPatient = function () {
        $$log.debug('userData');
        $$log.debug($scope.userData);

        // for (var i = 0; i < $scope.userData.length; i++) {
        //     for (var j = 0; j < $scope.userData[i].member.length; j++) {
        //         if ($scope.userData[i].member[j].sel === true) {
        //             pushPatient.push($scope.userData[i].member[j].identifier);
        //         }
        //     }
        // }

        // if (pushPatient.length == 0) {
        //     $$toast.show('请选择患者');
        // } else {
        //     $$log.debug('pushPatient.length');
        //     $$log.debug(pushPatient.length);
        //     $state.go('contentList', {operateType: 'patientPushObj'});
        // }

        for (var i = 0; i < $scope.userData.length; i++) {
            for (var j = 0; j < $scope.userData[i].member.length; j++) {
                pushPatient.push($scope.userData[i].member[j].identifier);
                pushPatientId.push($scope.userData[i].member[j].userId);
            }
        }

        $$log.debug('pushPatient');
        $$log.debug(pushPatient);
        $$log.debug(pushPatientId);
        $state.go('contentList', {operateType: 'patientPushObj'});

    };

    //沟通
    $scope.setCommunicate = function () {

        $$log.debug('userData');
        $$log.debug($scope.userData);

        $scope.resultArr = [];

        // for (var i = 0; i < $scope.userData.length; i++) {
        //     for (var j = 0; j < $scope.userData[i].member.length; j++) {
        //
        //         if ($scope.userData[i].member[j].sel === true) {
        //             $scope.resultArr.push($scope.userData[i].member[j]);
        //         }
        //     }
        // }
        for (var i = 0; i < $scope.userData.length; i++) {
            for (var j = 0; j < $scope.userData[i].member.length; j++) {

                $scope.resultArr.push($scope.userData[i].member[j]);
            }
        }


        if ($scope.resultArr.length === 0) {
            $$toast.show('请选择沟通对象');
            return false;
        }
        //判断是否为群聊
        if ($scope.resultArr.length > 1) {
            $$confirm.show({
                title: '请输入群聊名称',
                msg: '<input class="h3 border-line border-color-global-base" type="text">',
                callback: function () {

                    var name = $('.confirm').find('input').val();
                    var nurseId = [parseInt(localStorage.globalNurseId)];
                    var userId =[];
                    $scope.groupName = name;

                    $$log.debug('群聊名称');
                    $$log.debug($scope.groupName);
                    for(var i = 0 ; i < $scope.resultArr.length ; i++){
                        userId.push($scope.resultArr[i].userId);
                    }
                    $$log.debug('--------------');
                    $$log.debug(userId);
                    $http({
                        method: 'POST',
                        url: $$requestUrl.getUrl("createGroupChat"),
                        data: {
                            groupName: $scope.groupName,
                            nurseIds: nurseId,
                            userIds:userId
                        }
                    }).success(function (response) {
                        if(typeof response.result.success != "undefined"){
                            $$loading.hide();
                        }
                        if(response.result.success === true) {
                            localStorage.targetChatId=response.groupId;
                        } else {
                            $$toast.show(response.result.displayMsg.toString());
                        }
                        location.href = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/chat';
                    });
                    $$log.debug('群聊数组');
                    $$log.debug($scope.resultArr);

                },
                confirmText: '确定',
                cancelText: '取消'
            });
        } else {
            $$log.debug('单聊数组');
            $$log.debug($scope.resultArr);
            $http({
                method: 'POST',
                url: $$requestUrl.getUrl('createC2CUser', {
                    fromId: localStorage.globalNurseId,
                    toId: $scope.resultArr[0].userId
                })
            }).success(function (response) {
                if (typeof response.result.success != "undefined") {
                    $$loading.hide();
                }
                if (response.result.success === true) {
                    localStorage.targetChatId = response.toAccount.identifier;
                } else {
                    $$toast.show(response.result.displayMsg.toString());
                }
                location.href = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/chat';
            });
        }
    };
});