/**
 * Created by yihuan on 16/9/26.
 */

app.controller('selectListStateController', function ($rootScope, $state, $scope, $location, $$log, $$title, getData, $$navbar, $$tabbar, $stateParams, $$confirm, $$toast, $http, $$requestUrl,$$loading) {
    $$log.debug('selectListStateController');
    $$log.info($scope);
    $$navbar.setTitle('选择沟通的对象');
    $$navbar.showReturnBtn();
    $$tabbar.setIndex(-1);

    $scope.allNursesData = getData.nurse.data.all;
    $scope.nurseData = getData.nurse.data.nurse === undefined?[]:getData.nurse.data.nurse;

    $$log.debug('getData.patient.user');
    $$log.debug(getData.patient.user);
    $scope.isManage = localStorage.getItem('authorizedStatus') > 3 ? true : false;

    $$log.debug('00000000'+$scope.isManage);
    $$log.debug('typeof getData.patient.user != "undefined"'+(typeof getData.patient.data.user != "undefined"));


    if (typeof getData.patient.data.user != "undefined" && $scope.isManage != true) {
        $$log.debug('00000000');
        for (var i = 0; i < getData.patient.data.user.length; i++) {
            for (var j = 0; j < getData.patient.data.user[i].member.length; j++) {
                if(typeof getData.patient.data.user[i].member[j].tag != 'undefined'){
                    $$log.debug('typeof $scope.data.user[i].member[j].tag ');
                    $$log.debug(typeof getData.patient.data.user[i].member[j].tag != 'undefined');
                    for(var k = 0 ; k < getData.patient.data.user[i].member[j].tag.length ; k++){
                        if(getData.patient.data.user[i].member[j].tag[k].tagType == 3 ){
                            getData.patient.data.user[i].member[j].isBlack = true;
                            $$log.debug('$scope.data.user[i].member[j].isBlack');
                            $$log.debug(getData.patient.data.user[i].member[j].isBlack);

                            break;
                        }else{
                            getData.patient.data.user[i].member[j].isBlack = false;
                        }
                    }
                }else{
                    getData.patient.data.user[i].member[j].isBlack = false;
                }
            }
        }
        for(var i = 0 ; i < getData.patient.data.user.length ; i++){
            getData.patient.data.user[i].isNull = false;
        }
        for (var i = 0; i < getData.patient.data.user.length; i++) {
            for (var j = 0; j < getData.patient.data.user[i].member.length; j++) {
                var flag = 0;
                if(getData.patient.data.user[i].member[j].isBlack == true){
                    flag = flag + 1;
                    $$log.debug('flag'+flag);
                    $$log.debug('$scope.data.user[i].member.length'+getData.patient.data.user[i].member.length);
                    if(flag == getData.patient.data.user[i].member.length){
                        getData.patient.data.user[i].isNull = true;
                    }
                }
            }
        }
        // $scope.data.user =  $$patientFilter.getpatient($scope.data.user);
        $$log.debug('$scope.data.user');
        $$log.debug(getData.patient.data.user);
    }
    $$log.debug('$scope.patientData');
    $scope.patientData = getData.patient.data.user;
    $$log.debug($scope.patientData);


    //去重护士本身
    for (var i=0; i< $scope.allNursesData.length; i++) {
        if ($scope.allNursesData[i].nurseId == localStorage.globalNurseId) {
            $scope.allNursesData.splice(i, 1);
        }
    }

    for (var i=0; i< $scope.nurseData.length; i++) {
        for (var j =0; j < $scope.nurseData[i].member.length; j++) {
            if ($scope.nurseData[i].member[j].nurseId == localStorage.globalNurseId) {
                $scope.nurseData[i].member.splice(j, 1);
                break;
            }
        }
        if ($scope.nurseData[i].member.length === 0) {
            $scope.nurseData.splice(i, 1);
        }
    }

    $scope.nurseLength = 0;
    $scope.patientLength = 0;
    $scope.memberLength = 0;
    $scope.isNurseShow = true;

    function gotoChat(){
        location.href = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/chat';
    }
    if(typeof $scope.nurseData != "undefined" ){
        $scope.nurseLength = $scope.allNursesData.length;
        for (var i = 0; i < $scope.nurseData.length; i++) {
            // $scope.nurseLength += $scope.nurseData[i].member.length;
            $scope.nurseData[i].memberNum = $scope.nurseData[i].member.length;
        }
    }
    if(typeof $scope.patientData != "undefined"){
        for (var j = 0; j < $scope.patientData.length; j++) {
            $scope.patientLength += $scope.patientData[j].member.length;
        }
    }

    $scope.switchActive = function (isNurseShow) {
        $scope.isNurseShow = isNurseShow;
    };

    $scope.allCheckNurse = function () {
        $scope.open = !$scope.open;
    };
    //卷展
    $scope.openClose = function (obj) {
        obj.open = !obj.open;

    };

    //allCheck
    $scope.allCheck = function (allObj) {
        allObj.sel = (allObj.sel == 2) ? 0 : 2;
        for (var i = 0; i < allObj.member.length; i++) {
            allObj.member[i].sel = (allObj.sel == 2);
        }
    };

    $scope.allNurseCheck = function () {
        $scope.allSel = !$scope.allSel;
        for (var i = 0; i < $scope.allNursesData.length; i++) {
            $scope.allNursesData[i].sel = $scope.allSel;
        }
    };

    //checkSelf
    $scope.checkSelf = function (allObj, selfObj) {
        selfObj.sel = !selfObj.sel;
        var selAll = true;
        var unselAll = true;
        for (var i = 0; i < allObj.member.length; i++) {
            if (allObj.member[i].sel === false) {
                selAll = false;
            } else {
                unselAll = false;
            }
        }

        if (selAll === true) {
            allObj.sel = 2;
        } else if (unselAll === true) {
            allObj.sel = 0;
        } else {
            allObj.sel = 1;
        }
    };

    $scope.checkAllSelf = function (nurse) {
        nurse.sel = !nurse.sel;
        var isAll = true;
        for (var i = 0; i < $scope.allNursesData.length; i++) {
            if ($scope.allNursesData[i].sel !== true) {
                isAll = false;
                break;
            } else {
                isAll = true;
            }
        }
        $scope.allSel = isAll;
    };

    //patientAllCheck
    $scope.patientAllCheck = function (patientData) {
        patientData.sel = (patientData.sel == 2) ? 0 : 2;
        for (var i = 0; i < patientData.length; i++) {
            for (var j = 0; j < patientData[i].member.length; j++) {
                patientData[i].member[j].sel = (patientData.sel == 2);
            }
        }
    };

    //checkPatientSelf
    $scope.checkPatientSelf = function (patientData, selfObj) {
        selfObj.sel = !selfObj.sel;

        var selAll = true;
        var unselAll = true;
        for (var i = 0; i < patientData.length; i++) {
            for (var j = 0; j < patientData[i].member.length; j++) {
                if (patientData[i].member[j].sel === false) {
                    selAll = false;
                } else {
                    unselAll = false;
                }
            }
        }

        if (selAll === true) {
            patientData.sel = 2;
        } else if (unselAll === true) {
            patientData.sel = 0;
        } else {
            patientData.sel = 1;
        }
    };

    $scope.setCommunicate = function () {
        $$loading.show();
        var resultArr = [];
        var nurseIds = [];
        var userIds = [];
        if(typeof $scope.nurseData != "undefined"){
            for (var i = 0; i < $scope.nurseData.length; i++) {
                for (var j = 0; j < $scope.nurseData[i].member.length; j++) {
                    if ($scope.nurseData[i].member[j].sel === true && $scope.nurseData[i].member[j].isBlack != true ) {
                        resultArr.push($scope.nurseData[i].member[j]);
                        nurseIds.push($scope.nurseData[i].member[j]);
                    }
                }
            }

            for (var m = 0; m < $scope.allNursesData.length; m++) {
                if ($scope.allNursesData[m].sel === true) {
                    resultArr.push($scope.allNursesData[m]);
                    nurseIds.push($scope.allNursesData[m]);
                }
            }
        }
        if(typeof $scope.patientData != "undefined"){
            for (var k = 0; k < $scope.patientData.length; k++) {
                for (var q = 0; q < $scope.patientData[k].member.length; q++) {
                    if ($scope.patientData[k].member[q].sel === true && $scope.patientData[k].member[q].isBlack != true) {
                        resultArr.push($scope.patientData[k].member[q]);
                        userIds.push($scope.patientData[k].member[q]);
                    }
                }
            }
        }
            //去重
        var arr = resultArr;
        for (var i=0; i< arr.length; i++) {
            if (arr[i].userId != undefined) {
                arr.splice(i, 1);
                i = i-1<0? 0:i-1;
            }
        }
        var resultUnique = [], isRusltUnique;
            for (var a = 0; a < arr.length; a++) {
                isRusltUnique = true;
                for (var b = 0; b < resultUnique.length; b++) {
                    if (arr[a].nurseId == resultUnique[b].nurseId) {
                        isRusltUnique = false;
                        break;
                    }
                }
                if (isRusltUnique) {
                    resultUnique.push(arr[a]);
                }
            }

            for (var m=0; m< userIds.length; m++) {
                resultUnique.push(userIds[m]);
            }

            var nurseUnique = [], isNurseIdUnique;

            for (var c = 0; c < nurseIds.length; c++) {
                isNurseIdUnique = true;
                for (var d = 0; d < nurseUnique.length; d++) {
                    if (nurseIds[c].nurseId == nurseUnique[d].nurseId) {
                        isNurseIdUnique = false;
                        break;
                    }
                }
                if (isNurseIdUnique) {
                    nurseUnique.push(nurseIds[c]);
                }
            }

            resultArr = resultUnique;
            nurseIds = nurseUnique;


        console.log('---0000');
        console.log(resultArr);
        console.log(nurseIds);

        if (resultArr.length === 0) {
            $$toast.show('请选择沟通对象');
            $$loading.hide();
            return false;
        }
        $$log.debug('resultArr.length '+resultArr.length );
        //判断是否为群聊

        if (resultArr.length > 1) {

            $$loading.hide();
            $$confirm.show({
                title: '请输入群聊名称',
                msg: '<input class="h3 border-line border-color-global-base padding-left-md" style="width:80%" type="text">',
                callback: function () {
                    $$loading.show();
                    var name = $('.confirm').find('input').val();
                    $scope.groupName = name;
                    var nurseId = [];
                    var userId = [];

                    if(nurseIds.length>0){
                        for (var i = 0; i < nurseIds.length; i++) {
                            nurseId.push(nurseIds[i].nurseId);
                        }
                    }
                    nurseId.push(localStorage.globalNurseId);
                    if(userIds.length >0){
                        for(var j = 0; j < userIds.length ; j++){
                            userId.push(userIds[j].userId);
                        }
                    }

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
                        gotoChat();
                    });
                },
                confirmText: '确定',
                cancelText: '取消'
            });
        } else {

            $http({
                method: 'POST',
                url: $$requestUrl.getUrl(resultArr[0].type == 'nurse' ? 'createC2CNurse':'createC2CUser',{fromId:localStorage.globalNurseId, toId: resultArr[0].type == 'nurse' ?resultArr[0].nurseId : resultArr[0].userId})
            }).success(function (response) {
                if(typeof response.result.success != "undefined"){
                    $$loading.hide();
                }
                if(response.result.success === true) {
                    localStorage.targetChatId=response.toAccount.identifier;
                } else {
                    $$toast.show(response.result.displayMsg.toString());
                }
                gotoChat();
            });
        }
    };
});



