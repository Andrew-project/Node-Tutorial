/**
 * Created by yihuan on 16/9/18.
 */
var followPatientObj = {};
app.directive('patientListController', function () {
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/patientListController.html',
        replace: true,
        scope: {
            data: '=data'
        },
        controller: function ($$patientFilter, $scope, $element, $attrs, $$log, $state, $interval, $$txIM, $http, $$requestUrl, $$toast, $rootScope, $$iconfont, $stateParams) {
            $scope.searchKey = null;
            $scope.isSearch = false;
            $scope.isManage = localStorage.getItem('authorizedStatus') > 3 ? true : false;
            $scope.nurseType = localStorage.globalNurseId;

            if ($scope.data.result.success == false) {
                $scope.service = false;
                $$toast.show($scope.data.result.displayMsg);
                return false;
            } else {
                $scope.service = true;
            }
            switch ($stateParams.operateType) {
                case 'show':
                    $scope.isSelect = false;
                    $scope.inNum = 0;
                    $scope.allNum = 0;
                    if (typeof $scope.data.user != "undefined") {
                        for (var i = 0; i < $scope.data.user.length; i++) {
                            if ($scope.data.user[i].member !== undefined) {
                                $scope.allNum += $scope.data.user[i].member.length;
                                for (var j = 0; j < $scope.data.user[i].member.length; j++) {
                                    if ($scope.data.user[i].member[j].status !== 0) {
                                        $scope.inNum++;
                                    }
                                }
                            }
                        }
                    } else {
                        // $scope.data.user.length = 0;
                    }

                    $scope.outNum = $scope.allNum - $scope.inNum;
                    break;
                case 'selectFollowObj':
                    $scope.isSelect = true;
                    break;
            }

            $scope.operateType = $stateParams.operateType;
            if (typeof $scope.data.user != "undefined" && $scope.isManage != true) {


                for (var i = 0; i < $scope.data.user.length; i++) {
                    for (var j = 0; j < $scope.data.user[i].member.length; j++) {
                        if (typeof $scope.data.user[i].member[j].tag != 'undefined') {
                            $$log.debug('typeof $scope.data.user[i].member[j].tag ');
                            $$log.debug(typeof $scope.data.user[i].member[j].tag != 'undefined');
                            for (var k = 0; k < $scope.data.user[i].member[j].tag.length; k++) {
                                if ($scope.data.user[i].member[j].tag[k].tagType == 3) {
                                    $scope.data.user[i].member[j].isBlack = true;
                                    $$log.debug('$scope.data.user[i].member[j].isBlack');
                                    $$log.debug($scope.data.user[i].member[j].isBlack);
                                    break;
                                } else {
                                    $scope.data.user[i].member[j].isBlack = false;
                                }
                            }
                        } else {
                            $scope.data.user[i].member[j].isBlack = false;
                        }
                    }
                }
                for (var i = 0; i < $scope.data.user.length; i++) {
                    $scope.data.user[i].isNull = false;
                }
                for (var i = 0; i < $scope.data.user.length; i++) {
                    for (var j = 0; j < $scope.data.user[i].member.length; j++) {
                        var flag = 0;
                        if ($scope.data.user[i].member[j].isBlack == true) {
                            flag = flag + 1;
                            $$log.debug('flag' + flag);
                            $$log.debug('$scope.data.user[i].member.length' + $scope.data.user[i].member.length);
                            if (flag == $scope.data.user[i].member.length) {
                                $scope.data.user[i].isNull = true;
                            }
                        }
                    }
                }
                // $scope.data.user =  $$patientFilter.getpatient($scope.data.user);
                $$log.debug('$scope.data.user');
                $$log.debug($scope.data.user);

            }
            $scope.patientData = $scope.data.user;


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
                followPatientObj = selfObj;
                history.go(-1);
                // var selAll = true;
                // var unselAll=true;

                // for (var i = 0; i < patientData.length; i++) {
                //     for(var j = 0 ; j < patientData[i].member.length ; j++){
                //         if (patientData[i].member[j].sel === false) {
                //             selAll = false;
                //
                //         }else{
                //
                //             unselAll=false;
                //         }
                //     }
                // }
                //
                // if(selAll===true){
                //     patientData.sel=2;
                // }else if(unselAll===true){
                //     patientData.sel=0;
                // }else{
                //     patientData.sel=1;
                // }

            };
            //patientObj
            $scope.patientObj = function () {
                if (followPatientObj.length >= 1) {
                    followPatientObj = [];
                }
                for (var i = 0; i < $scope.patientData.length; i++) {
                    for (var j = 0; j < $scope.patientData[i].member.length; j++) {
                        if ($scope.patientData[i].member[j].sel === true) {
                            followPatientObj.push($scope.patientData[i].member[j]);
                        }
                    }
                }

                if (followPatientObj.length === 0) {
                    $$toast.show('请选择随访对象');
                } else {
                    history.go(-1);
                }
            };

            //清空当前输入
            $scope.onClearInput = function () {
                $scope.searchKey = '';
            };

            //判断是否是查找状态
            $scope.onIsSearchStatus = function (juge) {
                $scope.isSearch = juge;
                if ($scope.isSearch == false) {
                    $scope.searchKey = '';
                } else {
                    $('.searchInput').focus();
                }
            };


        }
    };
});