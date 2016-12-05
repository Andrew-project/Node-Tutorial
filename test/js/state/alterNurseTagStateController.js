/**
 * Created by yihuan on 16/9/28.
 */
app.controller('alterNurseTagStateController',function($rootScope, $state, $scope,$location, $$log, $$title, getData,$$tabbar,$$navbar,$stateParams,$http,$$requestUrl,$$confirm,$$toast,$$loading){
    $$navbar.show();
    $$navbar.setTitle('修改同事标签');
    $$tabbar.setIndex(-1);
    $$navbar.showReturnBtn();

    $scope.data = getData.data;
    $scope.dataArr = $scope.data;
    $scope.tagsArr = [];
    console.log($scope.dataArr);
    if ($scope.dataArr.tag == undefined) {
        $scope.dataArr.tag = [];
    }

    //设置默认选中的tag
    for (var i=0; i<$scope.dataArr.tag.length; i++) {
        $scope.dataArr.tag[i].checked=false;
        for(var j = 0 ; j < checkedNurseTag.length ; j++){
            if ($scope.dataArr.tag[i].tagId == checkedNurseTag[j]) {
                $scope.dataArr.tag[i].checked = true;
            }
        }
    }
    $$log.debug('$scope.dataArr.tag');

    $$log.debug($scope.dataArr.tag);


    $scope.checkTag = function(tag){
        tag.checked = !tag.checked;
    };

    $scope.newNurseTag = function(){
        $$confirm.show({
            title: '添加标签',
            msg: '<input class="h3 border-line border-color-global-base padding-left-md" style="width:80%;" type="text">',
            callback: function () {
                // $$toast.show('confirm clicked', function () {
                //     $$loading.show();
                // });

                var tags = [];
                var tagName = $('.confirm').find('input').val();
                if (tagName == '') {
                    $$toast.show("标签名不能为空！");
                    return false;
                }
                tags.push({
                    "tagName": tagName
                });
                $http({
                    method: 'POST',
                    url: $$requestUrl.getUrl('createNurseTag'),//tags 冲突
                    data: {
                        "tag":tags
                    }
                }).success(function (response) {
                    if(response.result.success == true){
                        for(var i = 0 ; i < response.tag.length ; i++){
                            $scope.dataArr.tag.push(response.tag[i]);
                            $('.confirm').find('input').val('');
                        }
                    } else {
                        $$toast.show(response.result.displayMsg);
                    }
                });
            },
            confirmText: '添加',
            cancelText: '取消'
        });
    };


    $scope.submitNurseTags = function(){
        $$loading.show();
        var tags = [];
        for(var i = 0 ; i < $scope.dataArr.tag.length ; i++){
            if($scope.dataArr.tag[i].checked === true){
                tags.push({
                    "tagId":$scope.dataArr.tag[i].tagId
                });
            }
        }

        $http({
            method: 'PATCH',
            url: $$requestUrl.getUrl('updateNurseTags',{"nurseId": $stateParams.nurseId}),
            data: {
                "tag": tags
            }
        }).success(function (response) {
            if(typeof response.result.success != 'undefined' || response.result.success != ""){
                $$loading.hide();
            }
            if(response.result.success == true){
                var ls={
                    time:0
                };
                localStorage['nurseList'] = JSON.stringify(ls);
                $$toast.show("标签修改完成！");
                history.go(-1);
            } else {
                $$toast.show(response.result.displayMsg);
            }
        });
    };
    $$navbar.showReturnBtn();

});
