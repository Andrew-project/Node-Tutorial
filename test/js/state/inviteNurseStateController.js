/**
 * Created by yihuan on 16/9/18.
 */
app.controller('inviteNurseStateController',function($rootScope, $state, $scope,$location, $$log, $$title, $http, $$requestUrl, $$toast,$$navbar,$$tabbar){
    $scope.headImgUrl = headImgUrl;
    $$navbar.setTitle('邀请同事');
    $$navbar.showReturnBtn();
    $$tabbar.setIndex(-1);

    $scope.inviteNurse = function(){
        $scope.nurseId =1;//模拟数据
        if($scope.nursePhone == undefined || $scope.nursePhone == null){
            $$toast.show('不能为空');
            return false;
        }

        if ($scope.nursePhone.toString().length < 11) {
            $$toast.show('请检查信息后提交');
            return false;
        } else {
            $scope.phone = $scope.nursePhone.toString();
            $http({
                method: 'post',
                url: $$requestUrl.getUrl("createInviteNurse", {"nurseId": localStorage.globalNurseId}),
                data: {
                    phone:$scope.phone.toString()
                    // "message": "巫姐，这玩意儿挺好用，尤其是排班，你试试"
                }
            }).success(function (response) {
                if (response.result.success == true) {
                    $$toast.show("发送短信邀请成功！");
                } else {
                    $$toast.show(response.result.displayMsg);
                }
            });
        }
    };
});
