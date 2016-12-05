/**
 * Created by yihuan on 16/9/19.
 */

var newSelPushTemplate = [];

app.controller('contentListStateController', function ($rootScope, $state, $scope, $location, $$log, $$title, $$navbar, $$tabbar, getData, $stateParams, $$txIM, $$toast, $http, $$requestUrl, $$iconfont, $$color, $$loading) {
    $scope.colorTransform = $$color.transform;
    $scope.data = getData.data;
    $scope.iconfont = $$iconfont.init;
    $$log.debug('contentListStateController');
    $$log.info($scope.data);
    $$navbar.setTitle('选择推送内容');
    $$navbar.showReturnBtn();
    $$tabbar.setIndex(-1);

    $scope.dataArr = $scope.data;
    $$log.debug('$scope.dataArr');

    $$log.debug($scope.dataArr);
    $scope.selectData = {};

    function getOldPushObj(pushObj) {
        switch (pushObj) {

            case 'oldSelPushTemplate':
                if (oldSelPushTemplate.article.length !== 0 || oldSelPushTemplate.tool.length !== 0) {
                    //art
                    changeDataSel('art', $scope.dataArr["cms-a"], oldSelPushTemplate.article);
                    //tool
                    changeDataSel('tool', $scope.dataArr["cms-t"], oldSelPushTemplate.tool);
                }

            function changeDataSel(str, group, oldgroup) {
                switch (str) {
                    case 'art':
                        for (var i = 0; i < group.articleGroup.length; i++) {
                            //设置第一个选项默认展开
                            if (i === 0) {
                                group.articleGroup[i].open = true;
                            } else {
                                group.articleGroup[i].open = false;
                            }
                            // i == 0 ? group.articleGroup[i].open = true : group.articleGroup[i].open = false;
                            if (group.articleGroup[i].article !== undefined) {
                                for (var j = 0; j < group.articleGroup[i].article.length; j++) {
                                    for (var k = 0; k < oldgroup.length; k++) {
                                        if (oldgroup[k].id == group.articleGroup[i].article[j].id) {
                                            group.articleGroup[i].article[j].sel = true;
                                        } else {
                                            group.articleGroup[i].article[j].sel = group.articleGroup[i].article[j].sel || false;
                                        }
                                    }
                                }
                                var artLen = group.articleGroup[i].article.length;
                                for (var m = 0; m < group.articleGroup[i].article.length; m++) {
                                    if (group.articleGroup[i].article[m].sel === true) {
                                        artLen = artLen - 1;
                                    }
                                }
                                //对全选操作处理
                                if (artLen == group.articleGroup[i].article.length) {
                                    group.articleGroup[i].sel = 0;
                                } else if (artLen === 0) {
                                    group.articleGroup[i].sel = 2;
                                } else {
                                    group.articleGroup[i].sel = 1;
                                }
                            } else {
                                i = i + 1;
                            }
                        }
                        break;
                    case 'tool':
                        for (var i = 0; i < group.toolGroup.length; i++) {
                            //设置第一个选项默认展开
                            if (i === 0) {
                                group.toolGroup[i].open = true;
                            } else {
                                group.toolGroup[i].open = false;
                            }
                            // i== 0 ? group.toolGroup[i].open = true : group.toolGroup[i].open =false;
                            if (group.toolGroup[i].tool !== undefined) {
                                for (var j = 0; j < group.toolGroup[i].tool.length; j++) {
                                    for (var k = 0; k < oldgroup.length; k++) {
                                        if (oldgroup[k].id == group.toolGroup[i].tool[j].id) {
                                            group.toolGroup[i].tool[j].sel = true;
                                        } else {
                                            group.toolGroup[i].tool[j].sel = group.toolGroup[i].tool[j].sel || false;
                                        }
                                    }
                                }
                                var toolLen = group.toolGroup[i].tool.length;
                                for (var m = 0; m < group.toolGroup[i].tool.length; m++) {
                                    if (group.toolGroup[i].tool[m].sel === true) {
                                        toolLen = toolLen - 1;
                                    }
                                }
                                //对全选操作处理
                                if (toolLen == group.toolGroup[i].tool.length) {
                                    group.toolGroup[i].sel = 0;
                                } else if (toolLen === 0) {
                                    group.toolGroup[i].sel = 2;
                                } else {
                                    group.toolGroup[i].sel = 1;
                                }
                            } else {
                                i = i + 1;
                            }
                        }
                        break;
                }
                if (str == 'art') {
                    var isAllArt = true;
                    for (var j = 0; j < group.articleGroup.length; j++) {
                        if (group.articleGroup[j].sel != 2) {
                            isAllArt = false;
                            break;
                        }
                    }
                    $scope.dataArr["cms-a"].sel = isAllArt;
                } else {
                    var isAllTool = true;
                    for (var j = 0; j < group.toolGroup.length; j++) {
                        if (group.toolGroup[j].sel != 2) {
                            isAllTool = false;
                            break;
                        }
                    }
                    $scope.dataArr["cms-t"].sel = isAllTool;
                }
            }

                break;
        }
    }

    if (oldSelPushTemplate !== undefined) {
        getOldPushObj('oldSelPushTemplate');
    } else {
        $$log.debug('进入');
        //设置第一个选项默认展开
        if (typeof $scope.dataArr['cms-t'].toolGroup != "undefined") {

            for (var i = 0; i < $scope.dataArr['cms-t'].toolGroup.length; i++) {
                //设置第一个选项默认展开
                if (i === 0) {
                    $scope.dataArr['cms-t'].toolGroup[i].open = true;
                } else {
                    $scope.dataArr['cms-t'].toolGroup[i].open = false;
                }
                // i== 0 ? $scope.dataArr['cms-t'].toolGroup[i].open = true : $scope.dataArr['cms-t'].toolGroup[i].open =false;
            }
        }
        if (typeof $scope.dataArr['cms-a'].articleGroup != "undefined") {
            for (var j = 0; j < $scope.dataArr['cms-a'].articleGroup.length; j++) {
                //设置第一个选项默认展开
                if (j === 0) {
                    $scope.dataArr['cms-a'].articleGroup[j].open = true;
                } else {
                    $scope.dataArr['cms-a'].articleGroup[j].open = false;
                }
                // j== 0 ? $scope.dataArr['cms-a'].articleGroup[j].open = true : $scope.dataArr['cms-a'].articleGroup[j].open =false;
            }
        }


    }


    //判断是否全选
    function isAllCheck(type) {
        var allChoose = true;
        if (type == 'art') {
            for (var i = 0; i < $scope.dataArr["cms-a"].articleGroup.length; i++) {
                if ($scope.dataArr["cms-a"].articleGroup[i].article !== undefined) {
                    for (var j = 0; j < $scope.dataArr["cms-a"].articleGroup[i].article.length; j++) {
                        if ($scope.dataArr["cms-a"].articleGroup[i].article[j].sel !== true) {
                            allChoose = false;
                            break;
                        }
                    }
                    $scope.dataArr["cms-a"].sel = allChoose;
                } else {
                    i = i + 1;
                }
            }
        } else {
            for (var i = 0; i < $scope.dataArr["cms-t"].toolGroup.length; i++) {
                if ($scope.dataArr["cms-t"].toolGroup[i].tool !== undefined) {
                    for (var j = 0; j < $scope.dataArr["cms-t"].toolGroup[i].tool.length; j++) {
                        if ($scope.dataArr["cms-t"].toolGroup[i].tool[j].sel !== true) {
                            allChoose = false;
                            break;
                        } else {

                        }
                    }
                    $scope.dataArr["cms-t"].sel = allChoose;
                }
            }
        }
    }

    //选择当前全部
    $scope.allCheck = function (content) {

        $$log.debug(content);
        content.sel = (content.sel == 2) ? 0 : 2;
        if (content.mark == 'art') {
            if (content.article !== undefined) {
                for (var i = 0; i < content.article.length; i++) {
                    content.article[i].sel = (content.sel == 2);
                }
                isAllCheck('art');
            }
        } else {
            if (content.tool !== undefined) {
                for (var j = 0; j < content.tool.length; j++) {
                    content.tool[j].sel = (content.sel == 2);
                }
                isAllCheck('tool');
            }
        }
        $$log.debug(content.sel);
    };

    $scope.allCheckArticle = function () {
        $scope.dataArr["cms-a"].sel = $scope.dataArr["cms-a"].sel !== true;
        for (var i = 0; i < $scope.dataArr["cms-a"].articleGroup.length; i++) {
            if ($scope.dataArr["cms-a"].sel) {
                $scope.dataArr["cms-a"].articleGroup[i].sel = 2;
                if ($scope.dataArr["cms-a"].articleGroup[i].article !== undefined) {
                    for (var j = 0; j < $scope.dataArr["cms-a"].articleGroup[i].article.length; j++) {
                        $scope.dataArr["cms-a"].articleGroup[i].article[j].sel = true;
                    }
                } else {
                    i = i + 1;
                }
            } else {
                $scope.dataArr["cms-a"].articleGroup[i].sel = 0;
                if ($scope.dataArr["cms-a"].articleGroup[i].article !== undefined) {
                    for (var j = 0; j < $scope.dataArr["cms-a"].articleGroup[i].article.length; j++) {
                        $scope.dataArr["cms-a"].articleGroup[i].article[j].sel = false;
                    }
                } else {
                    i = i + 1;
                }
            }
        }
    };

    $scope.allCheckTools = function () {
        $scope.dataArr["cms-t"].sel = $scope.dataArr["cms-t"].sel !== true;
        $$log.info($scope.dataArr);
        for (var i = 0; i < $scope.dataArr["cms-t"].toolGroup.length; i++) {
            if ($scope.dataArr["cms-t"].sel) {
                $scope.dataArr["cms-t"].toolGroup[i].sel = 2;
                if ($scope.dataArr["cms-t"].toolGroup[i].tool !== undefined) {
                    for (var j = 0; j < $scope.dataArr["cms-t"].toolGroup[i].tool.length; j++) {
                        $scope.dataArr["cms-t"].toolGroup[i].tool[j].sel = true;
                    }
                } else {
                    i = i + 1;
                }
            } else {
                $scope.dataArr["cms-t"].toolGroup[i].sel = 0;
                if ($scope.dataArr["cms-t"].toolGroup[i].tool !== undefined) {
                    for (var j = 0; j < $scope.dataArr["cms-t"].toolGroup[i].tool.length; j++) {
                        $scope.dataArr["cms-t"].toolGroup[i].tool[j].sel = false;
                    }
                } else {
                    i = i + 1;
                }
            }
        }
    };


    //选择当前
    $scope.checkPush = function (content, article) {
        $$log.debug(article);
        $$log.info(content);
        article.sel = !article.sel;
        var selAll = true;
        var unselAll = true;

        if (content.mark == 'art') {
            for (var i = 0; i < content.article.length; i++) {
                if (content.article[i].sel !== true) {
                    selAll = false;
                } else {
                    unselAll = false;
                }
            }
        } else {
            for (var j = 0; j < content.tool.length; j++) {
                if (content.tool[j].sel !== true) {
                    selAll = false;
                } else {
                    unselAll = false;
                }
            }
        }

        if (selAll === true) {
            content.sel = 2;
        } else if (unselAll === true) {
            content.sel = 0;
        } else {
            content.sel = 1;
        }
        isAllCheck(content.mark);
    };


    //卷展
    $scope.openClose = function (content) {
        content.open = !content.open;
    };

    //完成选择
    $scope.submitPush = function () {

        pushPatient = pushPatient || [localStorage.targetChatId];
        $$log.debug('$scope.dataArr$scope.dataArr$scope.dataArr$scope.dataArr');
        $$log.debug($scope.dataArr);

        switch ($stateParams.operateType) {
            case 'pushTemplate':
                var article = [];
                var tool = [];
                for (var i = 0; i < $scope.dataArr["cms-a"].articleGroup.length; i++) {
                    if ($scope.dataArr["cms-a"].articleGroup[i].article !== undefined) {
                        for (var j = 0; j < $scope.dataArr["cms-a"].articleGroup[i].article.length; j++) {
                            if ($scope.dataArr["cms-a"].articleGroup[i].article[j].sel === true) {
                                article.push({
                                    'id': $scope.dataArr["cms-a"].articleGroup[i].article[j].id,
                                    'title': $scope.dataArr["cms-a"].articleGroup[i].article[j].name
                                });
                            }
                        }
                    } else {
                        i = i + 1;
                    }
                }

                for (var k = 0; k < $scope.dataArr["cms-t"].toolGroup.length; k++) {
                    if ($scope.dataArr["cms-t"].toolGroup[k].tool !== undefined) {
                        for (var m = 0; m < $scope.dataArr["cms-t"].toolGroup[k].tool.length; m++) {
                            if ($scope.dataArr["cms-t"].toolGroup[k].tool[m].sel === true) {
                                tool.push({
                                    'id': $scope.dataArr["cms-t"].toolGroup[k].tool[m].id,
                                    'title': $scope.dataArr["cms-t"].toolGroup[k].tool[m].name
                                });
                            }
                        }
                    } else {
                        k = k + 1;
                    }
                }

                $$log.info('article');
                $$log.debug(article);
                //去重
                var articleArr = [], isArtUnique;
                for (var i = 0; i < article.length; i++) {
                    isArtUnique = true;
                    for (var j = 0; j < articleArr.length; j++) {
                        if (articleArr[j].id == article[i].id) {
                            isArtUnique = false;
                            break;
                        }
                    }
                    if (isArtUnique) {
                        articleArr.push(article[i]);
                    }
                }

                var toolArr = [], isToolUnique;
                for (var i = 0; i < tool.length; i++) {
                    isToolUnique = true;
                    for (var j = 0; j < toolArr.length; j++) {
                        if (toolArr[j].id == tool[i].id) {
                            isToolUnique = false;
                            break;
                        }
                    }
                    if (isToolUnique) {
                        toolArr.push(tool[i]);
                    }
                }


                //模版推送
                if (newSelPushTemplate.length === 0) {
                    newSelPushTemplate.push({
                        'article': articleArr,
                        'tool': toolArr,
                        'eventMark': oldSelPushTemplate.eventMark
                    });
                } else {
                    for (var q = 0; q < newSelPushTemplate.length; q++) {
                        if (newSelPushTemplate[q].eventMark == oldSelPushTemplate.eventMark) {
                            newSelPushTemplate[q] = {
                                'article': articleArr,
                                'tool': toolArr,
                                'eventMark': oldSelPushTemplate.eventMark
                            };
                        } else {
                            newSelPushTemplate.push({
                                'article': articleArr,
                                'tool': toolArr,
                                'eventMark': oldSelPushTemplate.eventMark
                            });
                        }

                    }

                }
                $$log.debug('新选择的模版推送内容为:newSelPushTemplate');
                $$log.debug(newSelPushTemplate);

                history.go(-1);
                break;
            case 'patientPushObj':
                //通过患者标签筛选页面为患者选择
                $$log.debug('pushPatientpushPatientpushPatient');
                //读取患者对象数组
                $$log.debug(pushPatient);
                $$log.debug('pushPatientId');
                $$log.debug(pushPatientId);

                if(pushPatient.length == 0){
                    if (localStorage.targetChatId !== '') {
                        pushPatient = [localStorage.targetChatId];
                    }
                }


                var articleIds = [];
                var toolIds = [];
                var eleArr = [];
                for (var i = 0; i < $scope.dataArr["cms-a"].articleGroup.length; i++) {
                    if ($scope.dataArr["cms-a"].articleGroup[i].article !== undefined) {
                        for (var j = 0; j < $scope.dataArr["cms-a"].articleGroup[i].article.length; j++) {
                            if ($scope.dataArr["cms-a"].articleGroup[i].article[j].sel === true) {
                                eleArr.push({
                                    'id': $scope.dataArr["cms-a"].articleGroup[i].article[j].id,
                                    'name': $scope.dataArr["cms-a"].articleGroup[i].article[j].name,
                                    'desc': $scope.dataArr["cms-a"].articleGroup[i].article[j].brief,
                                    'img': $scope.dataArr["cms-a"].articleGroup[i].article[j].iconUrl,
                                    'type': '[康复文章]'
                                });
                                articleIds.push($scope.dataArr["cms-a"].articleGroup[i].article[j].id);
                            }
                        }
                    } else {
                        i = i + 1;
                    }
                }

                for (var k = 0; k < $scope.dataArr["cms-t"].toolGroup.length; k++) {
                    if ($scope.dataArr["cms-t"].toolGroup[k].tool !== undefined) {
                        for (var m = 0; m < $scope.dataArr["cms-t"].toolGroup[k].tool.length; m++) {
                            if ($scope.dataArr["cms-t"].toolGroup[k].tool[m].sel === true) {
                                eleArr.push({
                                    'id': $scope.dataArr["cms-t"].toolGroup[k].tool[m].id,
                                    'name': $scope.dataArr["cms-t"].toolGroup[k].tool[m].name,
                                    'desc': $scope.dataArr["cms-t"].toolGroup[k].tool[m].brief,
                                    'img': $scope.dataArr["cms-t"].toolGroup[k].tool[m].iconUrl,
                                    'type': '[康复工具]'
                                });
                                toolIds.push($scope.dataArr["cms-t"].toolGroup[k].tool[m].id);
                            }
                        }
                    } else {
                        k = k + 1;
                    }
                }

                //去重
                var eleArrData = [], isTrue;
                for (var i = 0; i < eleArr.length; i++) {
                    isTrue = true;
                    for (var j = 0; j < eleArrData.length; j++) {
                        if (eleArrData[j].id === eleArr[i].id) {
                            isTrue = false;
                            break;
                        }
                    }
                    if (isTrue === true) {
                        eleArrData.push(eleArr[i]);
                    }
                }

                var articleArrIds = [], isArtUnique;
                for (var i = 0; i < articleIds.length; i++) {
                    isArtUnique = true;
                    for (var j = 0; j < articleArrIds.length; j++) {
                        if (articleArrIds[j] == articleIds[i]) {
                            isArtUnique = false;
                            break;
                        }
                    }
                    if (isArtUnique === true) {
                        articleArrIds.push(articleIds[i]);
                    }
                }

                var toolArrIds = [], isToolUnique;
                for (var i = 0; i < toolIds.length; i++) {
                    isToolUnique = true;
                    for (var j = 0; j < toolArrIds.length; j++) {
                        if (toolArrIds[j] == toolIds[i]) {
                            isToolUnique = false;
                            break;
                        }
                    }
                    if (isToolUnique === true) {
                        toolArrIds.push(toolIds[i]);
                    }
                }

                $$log.info('-------------');
                $$log.debug(eleArrData);
                $$log.debug(articleArrIds);
                $$log.debug(toolArrIds);

                if (eleArrData.length === 0) {
                    $$toast.show('请选择想要推送的内容');
                } else {
                    $$loading.show();
                    $$txIM.initImArrayAndSend(pushPatient, eleArrData, true);
                    for(var i = 0 ; i < pushPatientId.length ; i++){
                        createFriend(pushPatientId[i]);
                    }
                    function createFriend(toId){
                        $http({
                            method: 'GET',
                            url: $$requestUrl.getUrl("createPatientChat", {
                                fromId: localStorage.globalNurseId,
                                toId: toId
                            })
                        }).success(function (response) {

                            if (response.result.success == true) {

                                $$log.debug('和患者建立聊天成功！');
                                $$log.debug('createPatientNurseChatStateController.response');
                                $$log.info(response);

                            } else {
                                var display = response.result.displayMsg;
                                $$toast.show(display.toString());
                            }

                        });
                    };
                    $http({
                        method: 'POST',
                        url: $$requestUrl.getUrl("createPatientsWeiXinPush"),
                        data: {
                            "fromId": localStorage.globalNurseId,
                            "toChatIdentifiers": pushPatient,
                            "articleIds": articleArrIds,
                            "toolIds": toolArrIds,
                            "departmentId": localStorage.globalDepartmentId
                        }
                    }).success(function (response) {
                        if (typeof response.result.success != "undefined") {
                            $$loading.hide();
                        }
                        if (response.result.success === true) {
                            if (pushPatient.length == 1) {
                                localStorage.targetChatId = pushPatient[0];
                                pushPatient=[];
                                $state.go('chat');
                            } else {
                                //打开首页
                                pushPatient=[];
                                var t = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/messageTag';
                                $$log.debug(t);
                                jumpPage(t);
                            }
                            function jumpPage(p) {
                                location.href = p;
                            }
                        }
                    });
                }
                break;
        }
    };
});