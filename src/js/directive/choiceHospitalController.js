/**
 * Created by lixu on 16/9/24.
 */
var hospitalObj={};
var aletrNurseInfoHospital = {};

app.directive('choiceHospitalController',function(){
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/choiceHospitalController.html',
        // require:'',
        // priority:'',
        replace: true,
        scope: {
            data: '=data'
        },
        controller:function($$confirm,$scope, $element, $attrs, $$log, $state,$interval, $http, $$requestUrl, $$toast, $rootScope){
            hospitalObj = {};
            aletrNurseInfoHospital = {};

            $scope.dataArr = $scope.data.organization;

            $scope.selHospital  = function(hospital){
                var ls={
                    time:0
                };
                if(localStorage['allPatientList'] == undefined){
                    localStorage['allPatientList'] = JSON.stringify(ls);
                }
                if(localStorage['nurseList'] == undefined){
                    localStorage['nurseList'] = JSON.stringify(ls);
                }

                $$log.debug('选中的hospital');
                $$log.debug(hospital);
                if (basicInfo.hospital) {
                    hospitalObj = hospital;
                    departmentObj = {};
                } else {
                    aletrNurseInfoHospital = hospital;
                    aletrNurseInfoOffice = {};
                }
                history.go(-1);
            };

            $scope.addHospital = function(){
                $$confirm.show({
                    title: '添加医院',
                    msg: '<input class="h3 border-line border-color-global-base padding-left-md" type="text" style="width:80%;">',
                    callback: function () {
                        var name = $('.confirm').find('input').val();
                        if (name === '') {
                            $$toast.show("请输入医院名！");
                            return false;
                        }
                        $http({
                            method: 'POST',
                            url: $$requestUrl.getUrl("createHospital"),
                            data: {
                                "organizationName": name
                            }
                        }).success(function (response) {
                            if(response.result.success === true){
                                $scope.dataArr.push(response.organization);
                                $('.confirm').find('input').val('');
                            } else {
                                $$toast.show(response.result.displayMsg);
                            }
                            return response;
                        });
                    },
                    confirmText: '确定',
                    cancelText: '取消'
                });
            };
        }
    };
});