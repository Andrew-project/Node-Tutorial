/**
 * Created by lixu on 16/9/24.
 */
var departmentObj = {};
var aletrNurseInfoOffice = {};

app.directive('choiceDepartment',function(){
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/choiceDepartmentController.html',
        // require:'',
        // priority:'',
        replace: true,
        scope: {
            data: '=data'
        },
        controller:function($scope, $element, $attrs, $$log, $state,$interval, $http, $$requestUrl, $$toast, $rootScope, $$iconfont,$stateParams,$$confirm){
            $scope.dataArr= $scope.data.organization;
            for(var i = 0 ; i < $scope.dataArr.length ;i++ ){
                if( $scope.dataArr[i].organizationId == $stateParams.hospitalId){
                    $scope.dataFilter = $scope.dataArr[i].department;
                }
            }

            //newDepartment
            $scope.newDepartment = function(){
                $$confirm.show({
                    title: '添加科室',
                    msg: '<input class="h3 border-line border-color-global-base padding-left-md" style="width:80%;" type="text">',
                    callback: function () {
                        var name = $('.confirm').find('input').val();
                        if ($scope.dataFilter === undefined || $scope.dataFilter.length === 0) {
                            $scope.dataFilter = [];
                        }
                        if (name === '') {
                            $$toast.show("请输入科室名称！");
                            return false;
                        }
                        $http({
                            method: 'POST',
                            url: $$requestUrl.getUrl("createDepartment"),
                            data: {
                                "organizationId": parseInt($stateParams.hospitalId),
                                "departmentName": name
                            }
                        }).success(function (response) {
                            if(response.result.success === true){
                                $scope.dataFilter.push(response.department);
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

            //selDepartment
            $scope.selDepartment = function(department){

                var ls={
                    time:0
                };
                if(localStorage['allPatientList'] == undefined){
                    localStorage['allPatientList'] = JSON.stringify(ls);
                }
                if(localStorage['nurseList'] == undefined){
                    localStorage['nurseList'] = JSON.stringify(ls);
                }

                aletrNurseInfoOffice = {};
                departmentObj = {};
                if (basicInfo.office) {
                    departmentObj = department;
                } else {
                    aletrNurseInfoOffice = department;
                }
                history.go(-1);
            };
        }
    };
});