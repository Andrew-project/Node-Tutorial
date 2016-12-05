/**
 * Created by gaoqz on 16/11/10.
 */

app.directive('blackListController', function () {
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/blackListController.html',
        replace: true,
        scope: {
            data: '=data'
        },
        controller: function ($scope, $element, $attrs, $$log, $timeout, $$loading, $$txIM, $$toast, $http, $$requestUrl, $state, $$title, $$confirm) {
            $scope.blackListTagId = [];
            $scope.patientBlackList = [];
            for (var i = 0; i < $scope.data.user.length; i++) {
                var member = [];
                for (var j = 0; j < $scope.data.user[i].member.length; j++) {
                    if ($scope.data.user[i].member[j].tag !== undefined) {
                        for (var k = 0; k < $scope.data.user[i].member[j].tag.length; k++) {
                            if ($scope.data.user[i].member[j].tag[k].tagType == 3) {
                                member.push($scope.data.user[i].member[j]);
                                break;
                            }
                        }
                    }
                }
                $scope.patientBlackList.push({
                    'member': member,
                    'title': $scope.data.user[i].title
                });
            }
            $scope.patientBlackList = $scope.patientBlackList.filter(function (item) {
                return item.member.length > 0 && item.title != '特别关注';
            });


            $scope.onEditClick = function () {
                if ($scope.patientBlackList.length > 0) {
                    $scope.isEdit = true;
                }
            };

            $scope.onCheckSelfClick = function (user, member) {
                if ($scope.isEdit === true) {
                    member.sel = !member.sel;
                }
            };

            $scope.onRemovePatientClick = function (patient) {
                $scope.isEdit = false;
                var data = [];
                for (var i = 0; i < patient.length; i++) {
                    for (var j = 0; j < patient[i].member.length; j++) {
                        var userTag = [];
                        if (patient[i].member[j].sel === true) {
                            var tags = [];
                            for (var k = 0; k < patient[i].member[j].tag.length; k++) {
                                if (patient[i].member[j].tag[k].tagType !== 3) {
                                    tags.push({'tagId': patient[i].member[j].tag[k].tagId});
                                }
                            }
                            userTag = {
                                'userId': patient[i].member[j].userId,
                                'tag': tags
                            };
                        }
                    }
                    data.push(userTag);
                }

                if (data.length < 1) {
                    $$toast.show('请选择要移出科室黑名单的患者');
                    return false;
                }

                for (var i=0;i<data.length;i++) {
                    if (data[i].userId == undefined) {
                        data.splice(i,1);
                        i--;
                    }
                }

                $$loading.show();
                $http({
                    method: 'PATCH',
                    url: $$requestUrl.getUrl("removeBlackList"),
                    data: {
                        'userTag': data
                    }
                }).success(function (response) {
                    $$loading.hide();
                    if (response.result.success === true) {
                        $$toast.show('移出黑名单成功');
                        // history.go(-1);
                        for (var i = 0; i < patient.length; i++) {
                            for (var j = 0; j < patient[i].member.length; j++) {
                                for (var k = 0; k < data.length; k++) {
                                    if (patient[i].member[j].userId == data[k].userId) {
                                        patient[i].member.splice(j, 1);
                                        j--;
                                        break;
                                    }
                                }
                            }
                        }
                        for (var m = 0; m < patient.length; m++) {
                            if (patient[m].member.length < 1) {
                                patient.splice(m,1);
                                m--;
                            }
                        }
                        var ls = { time: 0 };
                        localStorage['allPatientList'] = JSON.stringify(ls);
                    }
                });
            };


            $scope.onCancelRemoveClick = function (patient) {
                $scope.isEdit = false;
                for (var i = 0; i < patient.length; i++) {
                    for (var j = 0; j < patient[i].member.length; j++) {
                        if (patient[i].member[j].sel === true) {
                            patient[i].member[j].sel = false;
                        }
                    }
                }
            }
        }
    };
});
