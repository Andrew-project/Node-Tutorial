/**
 * Created by yihuan on 16/9/19.
 */
var orderObjArr = [];
var attentionObjArr = [];
var runNurseObjArr = [];
app.controller('nurseListStateController', function ($$toast, $rootScope, $state, $scope, $location, $$log, $$title, $$navbar, $$tabbar, getData, $stateParams) {

    $scope.data = getData.data;
    $scope.open = true;
    if (typeof $scope.data == "undefined") {
        $$log.debug('服务器返回的数据为空');
        $$toast.show("服务器返回数据为空");
        return false;
        // $scope.dataArr.nurse.length == 0;

    } else {
        $scope.dataArr = $scope.data;

    }
    $scope.operateType = $stateParams.operateType;//1--选择我的同事页面, 2--同事页面
    $$navbar.showReturnBtn();
    $$tabbar.setIndex(-1);
    $scope.ownNurseId = localStorage.globalNurseId;

    if (typeof $scope.dataArr.nurse != 'undefined') {
        for (var i = 0; i < $scope.dataArr.nurse.length; i++) {
            $scope.dataArr.nurse[i].memberNum = $scope.dataArr.nurse[i].member.length;
            // if (i == 0) {
            //     $scope.dataArr.nurse[i].open = true;
            // } else {
            //     $scope.dataArr.nurse[i].open = false;
            // }
        }

    }
    //显示已经选择的同事
    switch ($stateParams.operateType) {
        case 'show':
            $$navbar.setTitle('我的同事');
            break;
        case 'selectOrder':
            $$navbar.setTitle('选择排班对象');
            showSel(orderObjArr);
            break;
        case 'selectAttention':
            $$navbar.setTitle('选择关注对象');
            showSel(attentionObjArr);
            break;
        case 'selectRunNurse':
            $$navbar.setTitle('选择执行护士');
            showSel(runNurseObjArr);
            break;
    }

    function showSel(arr) {

        $$log.debug('默认选中的数组');

        $$log.debug(arr);

        if (arr.length == 0) {
            $$log.debug('selArr === null');
            return false;
        } else {
            for (var j = 0; j < $scope.dataArr.all.length; j++) {
                for (var i = 0; i < arr.length; i++) {
                    if ($scope.dataArr.all[j].nurseId == arr[i].member.id) {
                        $scope.dataArr.all[j].sel = true;
                    } else {
                        $scope.dataArr.all[j].sel = $scope.dataArr.all[j].sel || false;
                    }
                }
            }
            var isAll = true;
            for (var j = 0; j < $scope.dataArr.all.length; j++) {
                if ($scope.dataArr.all[j].sel != true) {
                    isAll = false;
                    break;
                } else {
                    isAll = true;
                }
            }
            $scope.dataArr.all.sel = isAll;
        }

    }

    //openCloseAll
    $scope.openCloseAll = function () {
        $scope.open = !$scope.open;
    };
    //openClose
    $scope.openClose = function (nurse) {
        nurse.open = !nurse.open;
    };

    //allCheck
    $scope.allCheck = function () {
        $scope.dataArr.all.sel = !$scope.dataArr.all.sel;
        for (var j = 0; j < $scope.dataArr.all.length; j++) {
            $scope.dataArr.all[j].sel = $scope.dataArr.all.sel;
        }

    };

    $scope.allNurseCheck = function (nurse) {
        nurse.sel = !nurse.sel;
        for (var j = 0; j < nurse.member.length; j++) {
            nurse.member[j].sel = nurse.sel;
        }
    };

    $scope.checkNurseSelf = function (selfObj, nurse) {
        selfObj.sel = !selfObj.sel;
        nurse.sel = true;
        for (var i = 0; i < nurse.member.length; i++) {
            if (nurse.member[i].sel != true) {
                nurse.sel = false;
                break;
            } else {
            }
        }
    };
    //checkSelf
    $scope.checkSelf = function (selfObj) {
        selfObj.sel = !selfObj.sel;
        var isAll = true;
        for (var j = 0; j < $scope.dataArr.all.length; j++) {
            if ($scope.dataArr.all[j].sel != true) {
                isAll = false;
                break;
            }
        }
        $scope.dataArr.all.sel = isAll;
    };


    //setNurseArr
    $scope.setNurseArr = function () {
        $$log.debug($scope.dataArr);
        $scope.nurseObjArr = [];
        $$log.debug($scope.nurseObjArr);

        for (var i = 0; i < $scope.dataArr.all.length; i++) {
            if ($scope.dataArr.all[i].sel == true) {
                var member = {
                    "name": $scope.dataArr.all[i].name,
                    "id": $scope.dataArr.all[i].nurseId
                };
                var item = {
                    'member': member,
                    delObj: []
                };
                $scope.nurseObjArr.push(item);
            }
        }
        if ($scope.dataArr.nurse != undefined) {
            for (var i = 0; i < $scope.dataArr.nurse.length; i++) {
                for (var j = 0; j < $scope.dataArr.nurse[i].member.length; j++) {
                    if ($scope.dataArr.nurse[i].member[j].sel == true) {
                        var member = {
                            "name": $scope.dataArr.nurse[i].member[j].name,
                            "id": $scope.dataArr.nurse[i].member[j].nurseId
                        };
                        var item = {
                            'member': member,
                            delObj: []
                        };
                        $scope.nurseObjArr.push(item);
                    }
                }
            }
        }
        var nurseArr = [], isUnique;
        for (var i = 0; i < $scope.nurseObjArr.length; i++) {
            isUnique = true;
            for (var j = 0; j < nurseArr.length; j++) {
                if (nurseArr[j].member.id == $scope.nurseObjArr[i].member.id) {
                    isUnique = false;
                    break;
                }
            }
            if (isUnique) {
                nurseArr.push($scope.nurseObjArr[i]);
            }
        }

        $scope.nurseObjArr = nurseArr;

        switch ($scope.operateType) {

            case 'selectOrder':
                orderObjArr = $scope.nurseObjArr;
                break;
            case 'selectAttention':
                attentionObjArr = $scope.nurseObjArr;
                $$log.debug(attentionObjArr);
                break;

            case 'selectRunNurse':
                runNurseObjArr = $scope.nurseObjArr;
                break;
        }

        if ($scope.nurseObjArr.length == 0) {

            $$toast.show('没有选择同事,请至少选择一个');

        } else {

            $$log.debug('选择的同事对象');
            $$log.debug($scope.nurseObjArr);
            // $state.go('sort');
            history.go(-1);

        }

    };


});

