/**
 * Created by lixu on 16/9/14.
 */
var patientInfo = {};
app.controller('patientDetailStateController', function ($rootScope, $state, $scope, $location, $$log, $$title, getData, $$navbar, $$tabbar, $stateParams, $$confirm, $$toast, $http, $$requestUrl, $$loading) {
    $scope.data = getData.data;
    $scope.dataArr = $scope.data;
    $scope.patientId = $stateParams.patientId;
    $$log.debug('personalInformationStateController');
    $$log.debug($scope.patientId);
    $$log.info($scope);
    $$navbar.setTitle('患者姓名');
    $$navbar.showReturnBtn();
    $$tabbar.setIndex(-1);
    $scope.searchKey = '';

    $$log.debug('$scope.dataArr.tag');
    $$log.debug($scope.dataArr);
    $$log.debug($scope.dataArr.tag);

    //判断是否是子标签
    $scope.isTag = function (tag) {
        $$log.debug(tag);

        $$log.debug((typeof tag.tagCategoryName !== 'undefined'));

        if(typeof tag.tagCategoryName !== 'undefined'){

            return  tag.tagCategoryName.indexOf($scope.searchKey)>-1;
        }


    };
    if($scope.data.departmentTag != undefined || $scope.data.departmentTag.tag != undefined){
        for(var j = 0 ; j < $scope.data.departmentTag.tag.length ; j++){
            for(var k = 0 ; k < $scope.data.departmentTag.tag[j].tag.length ; k++ ){
                $scope.data.departmentTag.tag[j].tag[k].isShow = true;
                var flag = 0;
                if($scope.data.departmentTag.tag[j].tag[k].tagType < 2){
                    flag++;
                }
                $$log.debug('flag'+flag);
                $$log.debug('$scope.data.tag[j].tag[k].length'+$scope.data.departmentTag.tag[j].tag.length);

                if(flag > 0){
                    $scope.data.departmentTag.tag[j].isShow = true;
                }else{
                    $scope.data.departmentTag.tag[j].isShow = false;
                }
            }
            var juge = 0;
            if($scope.data.departmentTag.tag[j].isShow == false){
                juge++;
            }
            if(juge == $scope.data.departmentTag.tag.length){
                $scope.data.departmentTag.tag.length = 0 ;
            }
        }
    }


    //清空当前输入
    $scope.onClearInput = function (){
        $scope.searchKey = '';
    };
    // /判断是否是查找状态
    $scope.onIsSearchStatus = function (juge) {
        $scope.isSearch = juge;
        if ($scope.isSearch == false) {
            $scope.searchKey = '';
        }else{
            $('.searchInput').focus();
        }
    };


    if (typeof $scope.dataArr.tag != "undefined" && typeof  $scope.dataArr.departmentTag.tag != "undefined") {
        for (var i = 0; i < $scope.dataArr.tag.length; i++) {
            if ($scope.dataArr.tag[i].tagType == 2 && $scope.dataArr.tag[i].tagName == localStorage.globalNurseId) {
                $scope.isAttention = true;
            }
            for (var j = 0; j < $scope.dataArr.departmentTag.tag.length; j++) {
                if ($scope.dataArr.tag[i].tagCategoryId ==  $scope.dataArr.departmentTag.tag[j].tagCategoryId) {
                    $$log.debug('同一个类');
                    for (var k = 0; k < $scope.dataArr.departmentTag.tag[j].tag.length; k++) {
                        if ($scope.dataArr.tag[i].tagId == $scope.dataArr.departmentTag.tag[j].tag[k].tagId) {
                            // $$log.debug('同一个id');
                            // $$log.debug('i:' + i);
                            // $$log.debug('j:' + j);
                            // $$log.debug('k:' + k);
                            $scope.dataArr.departmentTag.tag[j].tag[k].sel = true;
                        } else {
                            // $$log.debug('!同一个id');
                            // $$log.debug('i:' + i);
                            // $$log.debug('j:' + j);
                            // $$log.debug('k:' + k);
                            $scope.dataArr.departmentTag.tag[j].tag[k].sel = ($scope.dataArr.departmentTag.tag[j].tag[k].sel===true ||false);
                        }
                    }
                }
            }
        }
        $$log.debug('$scope.dataArr');
        $$log.debug($scope.dataArr);
    }

    $scope.onMoreOperationClick = function () {
        patientInfo = $scope.data;
        $state.go('patientRelation');
    };

    //增加标签
    $scope.addTag = function (deTag) {

        $$confirm.show({
            title: '添加标签',
            msg: '<input class="h3 border-line border-color-global-base padding-left-md" style="width:80%;" type="text">',
            callback: function () {

                $$log.debug(deTag);

                var tagCategoryId = deTag.tagCategoryId;
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
                if(name != ""){
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
                                for (var j = 0; j < $scope.dataArr.departmentTag.tag.length; j++) {
                                    if ($scope.dataArr.departmentTag.tag[j].tagCategoryId == response.tag[i].tagCategoryId) {
                                        $scope.dataArr.departmentTag.tag[j].tag.push(
                                            {
                                                'tagId': response.tag[i].tagId,
                                                'tagName': response.tag[i].tagName,
                                                'tagCategoryId':response.tag[i].tagCategoryId,
                                                'tagCategoryName':response.tag[i].tagCategoryId,
                                                'tagType':response.tag[i].tagType
                                            }
                                        );
                                    }

                                }
                            }
                            $$log.debug('$scope.dataArr.departmentTag');
                            $$log.debug($scope.dataArr.departmentTag.tag);

                            $('.confirm').find('input').val("");
                        } else {
                            var display = response.result.displayMsg;
                            $$toast.show(display.toString());
                        }

                        $$log.debug('createPatientCategoryTag');
                        $$log.info(response);
                        return response;
                    });

                }else{
                    $$toast.show('数据项不能为空');
                }


            },
            confirmText: '确定',
            cancelText: '取消'
        });

    };

    //增加分类
    $scope.addCategory = function () {
        // $$log.debug('dianjile');

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
                if(tagCategoryName != "" && tagName != ""){
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
                            if (response.tag.length > 0) {
                                for (var i = 0; i < response.tag.length; i++) {
                                    if (typeof $scope.dataArr.departmentTag.tag == "undefined") {

                                        $scope.dataArr.departmentTag.tag = [{
                                            tag: [{
                                                "tagId": response.tag[i].tagId,
                                                "tagName": response.tag[i].tagName,
                                                'tagCategoryId':response.tag[i].tagCategoryId,
                                                'tagCategoryName':response.tag[i].tagCategoryId,
                                                'tagType':response.tag[i].tagType
                                            }],
                                            tagCategoryId: response.tag[i].tagCategoryId,
                                            tagCategoryName: response.tag[i].tagCategoryName,
                                            isShow:true
                                        }];
                                        $$log.debug("当前用户的$scope.dataArr.departmentTags为空，添加后的$scope.dataArr.departmentTags：");
                                        $$log.debug($scope.dataArr.departmentTag);

                                    } else {
                                        for(var j = 0 ; j < response.tag.length ; j++){
                                            $scope.dataArr.departmentTag.tag.push(
                                                {
                                                    tag:[{
                                                        'tagId': response.tag[j].tagId,
                                                        'tagName': response.tag[j].tagName,
                                                        'tagCategoryId':response.tag[i].tagCategoryId,
                                                        'tagCategoryName':response.tag[i].tagCategoryId,
                                                        'tagType':response.tag[i].tagType
                                                    }],
                                                    tagCategoryId:response.tag[j].tagCategoryId,
                                                    tagCategoryName: response.tag[j].tagCategoryName,
                                                    isShow:true
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

                }else{
                    $$toast.show('数据项不能为空');
                }


            },
            confirmText: '确定',
            cancelText: '取消'
        });

    };

    $scope.setSelfChat = function () {
        $$log.debug('建立聊天');

        $http({
            method: 'GET',
            url: $$requestUrl.getUrl("createPatientChat", {
                fromId: localStorage.globalNurseId,
                toId: $scope.patientId
            })
        }).success(function (response) {

            if (response.result.success == true) {

                $$log.debug('和患者建立聊天成功！');
                localStorage.targetChatId = response.toAccount.identifier;
                location.href = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/chat';
                $$log.debug('createPatientNurseChatStateController.response');
                $$log.info(response);


            } else {
                var display = response.result.displayMsg;

                $$toast.show(display.toString());
            }

        });


    };

    $scope.gotoPush = function () {
        localStorage.targetChatId = $scope.data.identifier;
        pushPatient = [localStorage.targetChatId];
        $$log.debug('gotoPush');
        $state.go('contentList', {operateType: 'patientPushObj'});
    };

    //给患者修改标签
    $scope.alertTag = function (tag) {
        $$loading.show();

        var tags = typeof $scope.dataArr.tag != "undefined" ? $scope.dataArr.tag : [];

        if (tag.sel == true) {
            $$log.debug('del : 对该名患者已有的标签删除');
            for (var i = 0; i < $scope.dataArr.tag.length; i++) {

                if (tag.tagId == $scope.dataArr.tag[i].tagId) {
                    tags.splice(i, 1);
                }
            }

            $$log.debug(tags);

        } else {

            $$log.debug('add : 给该名患者添加标签');

            tags.push({
                'tagId': tag.tagId,
                'tagName': tag.tagName
            });

            $$log.debug(tags);

        }


        $http({
            method: 'PATCH',
            url: $$requestUrl.getUrl("updatePatientTag", {"userId": $stateParams.patientId}),
            data: {
                "tag": tags
            }
        }).success(function (response) {
            if (typeof  response.result.success != 'undefined') {
                $$loading.hide();
            }
            if (response.result.success == true) {
                var ls={
                    time:0
                };
                localStorage['allPatientList'] = JSON.stringify(ls);

                $$log.debug("localStorage['allPatientList']:"+localStorage['allPatientList']);

                tag.sel = !tag.sel;
                $$log.debug('response');

                $$log.debug(response);

                $scope.dataArr.tag = response.tag;
                $$log.debug('updatePatientTag.response');
                $$log.info(response);
            } else {
                var display = response.result.displayMsg;

                $$toast.show(display.toString());
            }

        });


    }


});


