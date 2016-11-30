/**
 * Created by lixu on 16/9/19.
 */
var oldSelPushTemplate;
app.directive(
    'setTemplateController', function () {
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/setTemplateController.html',
        // require:'',
        // priority:'',
        replace: true,
        scope: {
            data: '=data'
        },
        controller: function ($$toast, $stateParams, $scope, $attrs, $$log, $element, $state, $interval, $http, $$requestUrl, $rootScope, $$iconfont,$$loading) {

            //判断对象是否为空
            function isEmptyObject(obj) {
                for (var key in obj) {
                    return false;
                }
                return true;
            }
            $scope.dataArrFilter = [];
            if ($stateParams.operateType == 'new') {
                var newDataArr = [{
                    "title": '',
                    "event": [{
                        "days": '',
                        "purpose": "",
                        "article": [],
                        "tool": [],
                        "eventMark": 0
                    }]
                }];
                $scope.dataArrFilter = isEmptyObject(globalTemplateData) ? newDataArr : [globalTemplateData];
            } else {
                if (isEmptyObject(globalTemplateData) == true) {
                    var globalTemplate = $scope.data;
                    for (var i = 0; i < globalTemplate.followUp.length; i++) {
                        if (globalTemplate.followUp[i].templateId == $stateParams.operateType) {
                            $scope.dataArrFilter.push(globalTemplate.followUp[i]);
                            globalTemplateData = globalTemplate.followUp[i];
                        }
                    }
                } else {

                    $scope.dataArrFilter.push(globalTemplateData);
                }

                //对模版中的每个的event添加标示
                for (var j = 0; j < $scope.dataArrFilter.length; j++) {
                    for (var k = 0; k < $scope.dataArrFilter[j].event.length; k++) {
                        $scope.dataArrFilter[j].event[k].eventMark = k;
                    }
                }
            }

            //点击添加随访记录
            $scope.addFollowUpRecord = function () {
                $scope.arr = {
                    "days": '',
                    "purpose": "",
                    "article": [],
                    "tool": [],
                    "eventMark": $scope.dataArrFilter[0].event.length
                };

                $scope.dataArrFilter[0].event.push($scope.arr);
                globalTemplateData = $scope.dataArrFilter[0];
            };

            //推送随访
            $scope.selPush = function (event) {
                if ($stateParams.operateType == 'new' && isEmptyObject(globalTemplateData) == true) {
                    globalTemplateData = $scope.dataArrFilter[0];
                }
                if (event.tool == undefined) {
                    event.tool = [];
                }
                if (event.article == undefined) {
                    event.article = [];
                }

                oldSelPushTemplate = {
                    'eventMark': event.eventMark,
                    'article': event.article,
                    'tool': event.tool
                };
                $state.go('contentList', {operateType: 'pushTemplate'});
            };

            for (var m in newSelPushTemplate) {
                if (newSelPushTemplate[m].article == undefined) {
                    newSelPushTemplate[m].article = [];
                }
                if (newSelPushTemplate[m].tool == undefined) {
                    newSelPushTemplate[m].tool = [];
                }
            }

            //读取newSelPushTemplate
            if (newSelPushTemplate.length > 0) {
                for (var item = 0; item < $scope.dataArrFilter.length; item++) {
                    for (var items = 0; items < $scope.dataArrFilter[item].event.length; items++) {
                        for (var q = 0; q < newSelPushTemplate.length; q++) {
                            if ($scope.dataArrFilter[item].event[items].eventMark == newSelPushTemplate[q].eventMark) {
                                $scope.dataArrFilter[item].event[items].article = newSelPushTemplate[q].article;
                                $scope.dataArrFilter[item].event[items].tool = newSelPushTemplate[q].tool;
                            }
                        }
                    }
                }
            }

            //点击完成
            $scope.saveFollowUpRecord = function () {
                if ($scope.dataArrFilter[0].title == '' ) {
                    $$toast.show('请检查信息后提交');
                    return false;
                }
                var event = [], events = $scope.dataArrFilter[0].event;
                for (var i = 0; i < events.length; i++) {
                    if(typeof(events[i].days) != "number" || events[i].days < 0 || events[i].days != parseInt(events[i].days)){
                        $$toast.show('随访请输入正确时间');
                        return false;
                    }
                    // if ((events[i].article == undefined && events[i].tool== undefined) ||  events[i].days == "" || events[i].purpose == "") {
                    //     $$toast.show('请检查信息后提交');
                    //     return false;
                    // }
                }
                for (var n = 0; n < events.length; n++) {
                    var article = [],tool = [];
                    if (events[n].article) {
                        if(events[n].article.length >= 1 ) {
                            for (var k = 0; k < events[n].article.length; k++) {
                                article.push(events[n].article[k].id);
                            }
                        }
                    } else {
                        events[n].article = [];
                    }
                    if (events[n].tool) {
                        if(events[n].tool.length >= 1) {
                            for (var m = 0; m < events[n].tool.length; m++) {
                                tool.push(events[n].tool[m].id);
                            }
                        }
                    } else {
                        events[n].tool = [];
                    }
                    if(events[n].purpose== "" || (article.length < 1 && tool.length < 1)){
                        $$toast.show('请检查信息后提交');
                        return false;
                    }
                    event.push({
                        "days": events[n].days,
                        "purpose": events[n].purpose,
                        "article": article,
                        "tool": tool
                    });
                }

                if ($stateParams.operateType == 'new') {
                    // if (localStorage.globalDepartmentId === 0 || localStorage.globalDepartmentId == '0') {
                    //     $$toast.show('请选择科室再进行此操作');
                    //     return false;
                    // }
                    $$loading.show();
                    $http({
                        method: 'POST',
                        url: $$requestUrl.getUrl("createFollowUpTemplatesStateController"),
                        data: {
                            "title": $scope.dataArrFilter[0].title,
                            "event": event
                        }
                    }).success(function (response) {
                        $$loading.hide();
                        if (response.result.success === true) {
                            globalTemplateData = {};
                            $$toast.show('信息提交成功!');
                            history.go(-1);
                        }else{
                            $$toast.show(response.result.displaymsg);
                        }
                    }).catch(function (err) {
                        $$log.err(err);
                        $$loading.hide();
                    });
                } else {
                    // if (localStorage.globalDepartmentId === 0 || localStorage.globalDepartmentId == '0') {
                    //     $$toast.show('请选择科室再进行此操作');
                    //     return false;
                    // }
                    $$loading.show();
                    $http({
                        method: 'PATCH',
                        url: $$requestUrl.getUrl("updateTemplate", {id: $stateParams.operateType}),
                        data: {
                            "templateId": parseInt($stateParams.operateType),
                            "title": $scope.dataArrFilter[0].title,
                            "event": event
                        }
                    }).success(function (response) {
                        $$loading.hide();
                        if (response.result.success === true) {
                            globalTemplateData = {};
                        }else{
                            $$toast.show(response.displaymsg);
                        }
                        $$toast.show('信息提交成功!');
                        history.go(-1);
                    });
                }
            };

            $$log.debug('setTemplateController');
            $$log.info($scope);
        }
    };
});






