/**
 * Created by yihuan on 2016/11/9.
 */
app.directive('patientTagManageController', function () {
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/patientTagManageController.html',
        replace: true,
        scope: {
            data: '=data'
            // searchKey:'=searchKey',
            // isSearch:'isSearch'
        },
        controller: function ($$confirm, $scope, $element, $attrs, $$log, $state, $interval, $http, $$requestUrl, $$toast, $$loading) {
            $$log.debug('data');
            $$log.debug($scope.data);

            $scope.isDelState = false;
            $scope.isSearch = false;
            $scope.searchKey = '';
            $scope.searchTag = null;
            $scope.searchJuge = null;
            if ($scope.data.tag != undefined) {
                for (var j = 0; j < $scope.data.tag.length; j++) {
                    for (var k = 0; k < $scope.data.tag[j].tag.length; k++) {
                        $scope.data.tag[j].tag[k].isShow = true;
                        var flag = 0;
                        if ($scope.data.tag[j].tag[k].tagType < 2) {
                            flag++;
                        }
                        $$log.debug('flag' + flag);
                        $$log.debug('$scope.data.tag[j].tag[k].length' + $scope.data.tag[j].tag.length);

                        if (flag > 0) {
                            $scope.data.tag[j].isShow = true;
                        } else {
                            $scope.data.tag[j].isShow = false;
                        }
                    }
                    var juge = 0;
                    if ($scope.data.tag[j].isShow == false) {
                        juge++;
                    }
                    if (juge == $scope.data.tag.length) {
                        $scope.data.tag.length = 0;
                    }
                }
            }


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

            //修改标签
            $scope.onAlertTag = function (tag, tagObj) {

                $$log.debug('tag.tagId' + tag.tagId);
                //删除标签
                if ($scope.isDelState) {
                    $$confirm.show({
                        title: '删除提示',
                        msg: '确认删除该标签吗？',
                        callback: function () {
                            $http({
                                method: 'POST',
                                url: $$requestUrl.getUrl('deletePatientTag'),//tags 冲突
                                data: {
                                    "tag": {
                                        "tagId": tag.tagId
                                    }
                                }
                            }).success(function (response) {
                                // $$toast.show('删除');
                                // $$toast.show(JSON.stringify(response));
                                if (response.result.success == true) {
                                    $('.confirm').find('input').val('');
                                    //删除

                                    tag.isShow = false;
                                    var flag = 0;
                                    for (var j = 0; j < tagObj.tag.length; j++) {

                                        if (tagObj.tag[j].isShow == true) {
                                            flag++;
                                        }
                                        if (flag > 0) {
                                            tagObj.isShow = true;
                                        } else {
                                            tagObj.isShow = false;
                                        }
                                    }
                                    var ls = {time: 0};
                                    localStorage['allPatientList'] = JSON.stringify(ls);
                                } else {
                                    $$toast.show(response.result.displayMsg);
                                }
                            });
                        },
                        confirmText: '确认',
                        cancelText: '取消'
                    });
                } else {
                    //获取当前标签的名称
                    $$log.debug('tag.tagName' + tag.tagName);
                    $$log.debug('tag.tagId' + tag.tagId);
                    //获取当前标签
                    $$confirm.show({
                        title: '修改患者标签',
                        msg: '<input class="h3 border-line border-color-global-base padding-left-md" value="' + tag.tagName + '" style="width:80%;" type="text">',
                        callback: function () {

                            var tags = [];
                            var tagName = $('.confirm').find('input').val();
                            $$log.debug('tagName' + tagName);
                            if (tagName == '') {
                                $$toast.show("标签名不能为空！");
                                return false;
                            }
                            tags.push({
                                "tagId": tag.tagId,
                                "tagName": tagName
                            });

                            $http({
                                method: 'PATCH',
                                url: $$requestUrl.getUrl('updateDepartmentPatientTag'),//tags 冲突
                                data: {
                                    "tag": tags
                                }
                            }).success(function (response) {
                                // $$toast.show('修改');
                                // $$toast.show(JSON.stringify(response));
                                if (response.result.success == true) {
                                    for (var i = 0; i < response.tag.length; i++) {
                                        for (var j = 0; j < $scope.data.tag.length; j++) {
                                            for (var k = 0; k < $scope.data.tag[j].tag.length; k++) {
                                                $$log.debug('$scope.data.tag[j].tag[k].tagId' + $scope.data.tag[j].tag[k].tagId);
                                                $$log.debug('response.tag[i].tagId' + response.tag[i].tagId);
                                                $$log.debug($scope.data.tag[j].tag[k].tagId == response.tag[i].tagId);
                                                if ($scope.data.tag[j].tag[k].tagId == response.tag[i].tagId) {
                                                    $scope.data.tag[j].tag[k].tagName = response.tag[i].tagName || tagName;
                                                    $$log.debug('$scope.data.tag[j].tag[k].tagName ' + $scope.data.tag[j].tag[k].tagName);
                                                }
                                            }

                                        }

                                    }
                                    var ls = {time: 0};
                                    localStorage['allPatientList'] = JSON.stringify(ls);
                                } else {
                                    $$toast.show(response.result.displayMsg);
                                }

                                $('.confirm').find('input').val('');
                            });
                        },
                        confirmText: '确认',
                        cancelText: '取消'
                    });
                }

            };

            //添加标签
            $scope.onAddTag = function (tagObj) {
                $$confirm.show({
                    title: '添加标签',
                    msg: '<input class="h3 border-line border-color-global-base padding-left-md" style="width:80%;" type="text">',
                    callback: function () {

                        $$log.debug(tagObj);

                        var tagCategoryId = tagObj.tagCategoryId;
                        // $$log.debug('categoryIdcategoryId');
                        //
                        // $$log.debug(categoryId);

                        var name = $('.confirm').find('input').val();

                        var tagsObj = [{
                            "tagName": name,
                            "tagCategoryId": tagCategoryId
                        }];
                        $$log.debug('tagsObj');
                        $$log.debug(tagsObj);
                        if (name != "") {
                            $$loading.show();

                            $http({
                                method: 'POST',
                                url: $$requestUrl.getUrl("createPatientCategoryTag"),
                                data: {
                                    "tag": tagsObj
                                }
                            }).success(function (response) {
                                if (response.result.success != 'undefined') {
                                    $$loading.hide();
                                }

                                if (response.result.success === true) {
                                    for (var i = 0; i < response.tag.length; i++) {
                                        for (var j = 0; j < $scope.data.tag.length; j++) {
                                            if ($scope.data.tag[j].tagCategoryId == response.tag[i].tagCategoryId) {
                                                $scope.data.tag[j].isShow = true;
                                                $scope.data.tag[j].tag.push(
                                                    {
                                                        'tagId': response.tag[i].tagId,
                                                        'tagName': response.tag[i].tagName,
                                                        'tagCategoryId': response.tag[i].tagCategoryId,
                                                        'tagCategoryName': response.tag[i].tagCategoryName,
                                                        'tagType': response.tag[i].tagType,
                                                        'isShow': true
                                                    }
                                                );
                                            }
                                        }
                                    }
                                    $$log.debug('$scope.dataArr.departmentTag');
                                    $$log.debug($scope.data.tag);

                                    $('.confirm').find('input').val("");
                                } else {
                                    var display = response.result.displayMsg;
                                    $$toast.show(display.toString());
                                }

                                $$log.debug('createPatientCategoryTag');
                                $$log.info(response);
                                return response;
                            });

                        } else {
                            $$toast.show('数据项不能为空');
                        }


                    },
                    confirmText: '确定',
                    cancelText: '取消'
                });
            };

            //添加分类
            $scope.onAddCategory = function () {
                $$confirm.show({
                    title: '添加分类',
                    msg: '<label for="tagCategoryName">分类：</label><input style="margin-bottom:0.64rem;" id="tagCategoryName" class="h3 border-line border-color-global-base padding-left-md" type="text"><br/><label for="tagCategoryName">标签：</label><input id="tagName" class="h3 border-line border-color-global-base padding-left-md" type="text">' +
                    '',
                    callback: function () {

                        var tagCategoryName = $('.confirm').find('#tagCategoryName').val();
                        var tagName = $('.confirm').find('#tagName').val();
                        $$log.debug(tagCategoryName);
                        $$log.debug(tagName);

                        var categoriesArr = [
                            {
                                "tagId": null,
                                "tagName": tagName,
                                "tagCategoryId": null,
                                "tagCategoryName": tagCategoryName
                            }
                        ];
                        $$log.debug('categoriesArr');
                        $$log.debug(categoriesArr);
                        if (tagCategoryName != "" && tagName != "") {
                            $$loading.show();

                            $http({
                                method: 'POST',
                                url: $$requestUrl.getUrl("createPatientTagCategory"),
                                data: {
                                    "tag": categoriesArr
                                }
                            }).success(function (response) {
                                if (response.result.success == true) {
                                    $$loading.hide();
                                    $$log.debug(response.tag + 'response.tag');
                                    if (response.tag.length > 0) {

                                        for (var i = 0; i < response.tag.length; i++) {
                                            if (typeof $scope.data.tag == "undefined") {

                                                $scope.data.tag = [{
                                                    tag: [{
                                                        "tagId": response.tag[i].tagId,
                                                        "tagName": response.tag[i].tagName,
                                                        "tagCategoryId": response.tag[i].tagCategoryId,
                                                        "tagCategoryName": response.tag[i].tagCategoryName,
                                                        "tagType": response.tag[i].tagType,
                                                        'isShow': true
                                                    }],
                                                    tagCategoryId: response.tag[i].tagCategoryId,
                                                    tagCategoryName: response.tag[i].tagCategoryName,
                                                    isShow: true
                                                }];
                                                $$log.debug("当前用户的$scope.dataArr.departmentTags为空，添加后的$scope.dataArr.departmentTags：");
                                                $$log.debug($scope.data.tag);

                                            } else {
                                                for (var j = 0; j < response.tag.length; j++) {
                                                    $scope.data.tag.push(
                                                        {
                                                            tag: [{
                                                                "tagId": response.tag[i].tagId,
                                                                "tagName": response.tag[i].tagName,
                                                                "tagCategoryId": response.tag[i].tagCategoryId,
                                                                "tagCategoryName": response.tag[i].tagCategoryName,
                                                                "tagType": response.tag[i].tagType,
                                                                'isShow': true
                                                            }],
                                                            tagCategoryId: response.tag[j].tagCategoryId,
                                                            tagCategoryName: response.tag[j].tagCategoryName,
                                                            isShow: true
                                                        }
                                                    );

                                                }

                                            }

                                        }
                                    }

                                } else {

                                    var display = response.result.displayMsg;

                                    $$toast.show(display.toString());
                                }

                                //clear
                                $('.confirm').find('#tagCategoryName').val("");
                                $('.confirm').find('#tagName').val("");

                                $$log.debug('createPatientTagCategory.response');
                                $$log.info(response);
                            });

                        } else {
                            $$toast.show('数据项不能为空');
                        }


                    },
                    confirmText: '确定',
                    cancelText: '取消'
                });
            };

            //展示删除的状态
            $scope.onShowDelStatus = function () {
                $scope.isDelState = true;
            };

            //隐藏删除的状态
            $scope.onHideDelStatus = function () {
                $scope.isDelState = false;
            };

            //判断是否是子标签
            $scope.isTag = function (tagObj) {

                return tagObj.tagCategoryName.indexOf($scope.searchKey) >= -1 ? true : false;

            };

        }
    };
});




