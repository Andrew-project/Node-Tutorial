/**
 * Created by yihuan on 16/9/18.
 */
var headImgUrl = "";
app.controller('userCenterStateController',function($rootScope, $state, $scope,$location, $$log,$http,$$requestUrl,$$title, getData,$$tabbar,$$confirm,$$toast, $$navbar,$$getClientInfo){
    // var currentTime = (new Date()).valueOf();
    //
    // var sevenTime = (new Date('2016-10-31 00:00:00')).valueOf();
    // $$log.debug('当前时间'+currentTime);
    //
    // $$log.debug('7tian:'+sevenTime);

    // if(currentTime >= sevenTime ){
    //
    //     $scope.overTime = true;
    //
    // }else{
    //
    //     $scope.overTime = false;
    // }


    $scope.data = getData.data;

    if(typeof $scope.data.basic.departmentId != "undefined" && $scope.data.basic.departmentId != ""){
        localStorage.globalDepartmentId = $scope.data.basic.departmentId;
    }else{
        $$log.debug('localStorage.globalDepartmentId is null');
    }
    if(typeof $scope.data.basic.departmentName != "undefined" && $scope.data.basic.departmentName != ""){
        localStorage.department = $scope.data.basic.departmentName;
    }else{
        $$log.debug('localStorage.department is null');
    }
    if(typeof $scope.data.basic.organizationName != "undefined" && $scope.data.basic.organizationName != ""){
        localStorage.hospital = $scope.data.basic.organizationName;
    }else{
        $$log.debug('localStorage.hospital is null');
    }
    if(typeof $scope.data.basic.organizationId != "undefined" && $scope.data.basic.organizationId != ""){
        localStorage.hospitalId =$scope.data.basic.organizationId;
    }else{
        $$log.debug('localStorage.hospitalId is null');
    }

    if(typeof $scope.data.basic.avatarUrl != "undefined" ){
        headImgUrl = $scope.data.basic.avatarUrl;
    }
    if(!localStorage.getItem('gloalIsGetDeviceID')){
        $http({
            method: 'POST',
            url: $$requestUrl.getUrl("createDeviceClient"),
            data: {
                "personId": localStorage.globalNurseId,
                "cid": $$getClientInfo.clientid
            }
        }).success(function (response) {

            if(response.result.success == false ){
                // $$toast.show(response.result.displayMsg ? response.result.displayMsg.toString() : '服务器扔过来一个错误');
                localStorage.gloalIsGetDeviceID = false;
            }else{
                localStorage.gloalIsGetDeviceID = true;
            }

        });

    }


    $$log.debug('headImgUrl:'+headImgUrl);
    $$log.debug('userCenterStateController');
    $$log.info($scope.data);
    $$log.info($scope);
    $$title.setTitle('我的');
    $$tabbar.setIndex(3);
    $$navbar.hideReturnBtn();

});
