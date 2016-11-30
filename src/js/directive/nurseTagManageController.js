/**
 * Created by yihuan on 2016/11/9.
 */
app.directive('nurseTagManageController',function(){
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/nurseTagManageController.html',
        replace: true,
        scope: {
            data: '=data'
        },
        controller: function ($scope, $element, $attrs, $$log, $state, $interval, $http, $$requestUrl, $$toast, $rootScope, $$loading,$$confirm) {

            $scope.searchKey = '';
            $scope.isSearch = false;

            // var flag = 0;
            if(typeof $scope.data.tag != 'undefined'){
                for(var j = 0 ; j < $scope.data.tag.length ; j++){

                    $scope.data.tag[j].isShow = true;

                    // if($scope.data.tag[j].tagType > 1){
                    //     flag++;
                    // }
                    // $$log.debug('flag'+flag);
                    // $$log.debug('$scope.data.tag.length'+$scope.data.tag.length);
                    // if(flag == $scope.data.tag.length){
                    //     $scope.data.tag.length = 0;
                    // }

                }
            }


            //为护士添加标签
            $scope.onAddTag = function(){
                $$confirm.show({
                    title: '添加护士标签',
                    msg: '<input class="h3 border-line border-color-global-base padding-left-md"  style="width:80%;" type="text">',
                    callback: function () {
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
                            url: $$requestUrl.getUrl('createNurseTagInManage'),//tags 冲突
                            data: {
                                "tag":tags
                            }
                        }).success(function (response) {
                            if(response.result.success == true){
                                if($scope.data.tag == undefined ){
                                    for(var i = 0 ; i < response.tag.length ; i++) {

                                        $scope.data.tag = [
                                            {
                                                "tagId": response.tag[i].tagId,
                                                "tagName": response.tag[i].tagName,
                                                "tagType": response.tag[i].tagType,
                                                "isShow": true
                                            }
                                        ];
                                    }

                                }else{
                                    for(var i = 0 ; i < response.tag.length ; i++){
                                        $scope.data.tag.push({
                                            "tagId":response.tag[i].tagId,
                                            "tagName":response.tag[i].tagName,
                                            "tagType":response.tag[i].tagType,
                                            "isShow":true
                                        });
                                    }
                                }
                                $('.confirm').find('input').val('');

                                $$log.debug('111111');
                                $$log.debug($scope.data.tag);

                            } else {
                                $$toast.show(response.result.displayMsg);
                            }
                        });
                    },
                    confirmText: '添加',
                    cancelText: '取消'
                });
            };

            //删除护士标签
            $scope.onDelTag = function(tag){

                $$log.debug('tagId'+tag.tagId);
                $$confirm.show({
                    title: '删除提示',
                    msg: '确认删除该护士标签吗',
                    callback: function () {
                        $$loading.show();
                        var tags = [{
                            "tagId":tag.tagId
                        }];
                        $http({
                            method: 'POST',
                            url: $$requestUrl.getUrl('deleteNurseTag'),//tags 冲突
                            data: {
                                "tag":tags
                            }
                        }).success(function (response) {
                            if(typeof response.result.success != 'undefined'){
                                $$loading.hide();
                            }
                            if(response.result.success == true){
                                tag.isShow = false;
                                $('.confirm').find('input').val('');
                                var ls = { time: 0 };
                                localStorage['nurseList'] = JSON.stringify(ls);
                            } else {
                                $$toast.show(response.result.displayMsg);
                            }
                        });
                    },
                    confirmText: '确定',
                    cancelText: '取消'
                });
            };

            //修改护士标签
            $scope.onAlterTag = function(tag){
                $$log.debug('tagId'+tag.tagId);
                $$log.debug('tagId'+tag.tagName);

                //alertTag
                $$confirm.show({
                    title: '修改护士标签',
                    msg: '<input id="alertTag" class="h3 border-line border-color-global-base padding-left-md" value="'+tag.tagName+'" style="width:80%;" type="text">',
                    callback: function () {

                        var tags = [];
                        var tagName = $('#alertTag').val();
                        if (tagName == '') {
                            $$toast.show("标签名不能为空！");
                            return false;
                        }
                        tags.push({
                            "tagId":tag.tagId,
                            "tagName": tagName
                        });
                        $http({
                            method: 'PATCH',
                            url: $$requestUrl.getUrl('updateNurseTag'),//tags 冲突
                            data: {
                                "tag":tags
                            }
                        }).success(function (response) {

                            if(response.result.success == true){

                                for(var i = 0 ; i < response.tag.length ; i++){
                                    for(var j = 0 ; j < $scope.data.tag.length ; j++){
                                        if(response.tag[i].tagId == $scope.data.tag[j].tagId){
                                            $scope.data.tag[j] = {
                                                isShow: true,
                                                tagCategoryId:response.tag[i].tagCategoryId,
                                                tagCategoryName: response.tag[i].tagCategoryName,
                                                tagId: response.tag[i].tagId,
                                                tagName: response.tag[i].tagName,
                                                tagType: response.tag[i].tagType
                                            };
                                        }
                                    }
                                }
                                $('.confirm').find('input').val('');
                                var ls = { time: 0 };
                                localStorage['nurseList'] = JSON.stringify(ls);
                            } else {
                                $$toast.show(response.result.displayMsg);
                            }
                        });
                    },
                    confirmText: '确认',
                    cancelText: '取消'
                });
            };

            //清空当前输入
            $scope.onClearInput = function (){
                $scope.searchKey = '';
            };

            //判断是否是查找状态
            $scope.onIsSearchStatus = function (juge) {
                $scope.isSearch = juge;
                if ($scope.isSearch == false) {
                    $scope.searchKey = '';
                }else{
                    $('.searchInput').focus();
                }
            };
        }
    };
});

