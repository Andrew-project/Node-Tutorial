/**
 * Created by dongsj on 16/7/60 * 24 .
 * app.config
 */
app.config(['$stateProvider', '$urlMatcherFactoryProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', '$sceProvider', function ($stateProvider, $urlMatcherFactoryProvider, $urlRouterProvider, $httpProvider, $locationProvider, $sceProvider) {
    //禁用html5 mode
    $locationProvider.html5Mode(true);
    //启用http拦截器
    $httpProvider.interceptors.push('$$timestampMarker');
    //启用$sec
    $sceProvider.enabled(true);
    //禁用url大小写
    $urlMatcherFactoryProvider.caseInsensitive(true);
    if (localStorage.guided == undefined || localStorage.guided != 'true') {
        $urlRouterProvider.otherwise("/guidePage");
    } else if (localStorage.token == undefined || localStorage.token == '') {
        $urlRouterProvider.otherwise("/fakeMainPage");
    } else {
        $urlRouterProvider.otherwise("/messageTag");
    }
    $stateProvider.state("inputConfirmDemo", {
        // 病人填写个人信息页面
        url: "/inputConfirmDemo",
        controller: "inputConfirmDemo",
        // controllerAs:"",
        template: "", resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl, $q) {
                $q.all({
                    first: $http({
                        method: 'GET',
                        url: $$requestUrl.getUrl("registerStateController"),
                        params: {}
                    }),
                    second: $http({
                        method: 'GET',
                        url: $$requestUrl.getUrl("demo", {id1: 1, id2: 2}),
                        params: {}
                    })
                }).then(function (arr) {
                    $$log.debug('debug');
                    $$log.info(arr);
                });
            }
        }
        //--------lix
    }).state('setOrder', {
        //创建班次 , new -- 新建 , orderId -- 修改
        url: "/:operateType/setOrder",
        controller: "setOrderStateController",
        templateUrl: "templates/state/setOrderState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl) {
                if ($stateParams.operateType == 'new') {
                    $$log.debug('new setOrder');
                    return {};
                } else {
                    return $http({
                        method: 'GET',
                        url: $$requestUrl.getUrl("createNurseScheduleStateController"),
                        params: {}
                    }).success(function (response) {
                        $$log.debug("setOrderStateController");
                        $$log.info(response);
                        return response;
                    });
                }
            }
        }
    }).state('sort', {
        //创建排班,给多个人排班
        url: "/:operateType/sort",
        controller: "sortStateController",
        templateUrl: "templates/state/sortState.html"
        // resolve: {
        //     getData: function ($http, $stateParams, $$log, $$requestUrl) {
        //         if ($stateParams.operateType == 'new') {
        //             return {}
        //         } else {
        //             return $http({
        //                 method: 'GET',
        //                 url: $$requestUrl.getUrl("createSortScheduleStateController"),
        //                 params: {}
        //             }).success(function (response) {
        //                 $$log.debug("sortStateController");
        //                 $$log.info(response);
        //                 return response;
        //             });
        //         }
        //     }
        // }
    }).state('setTemplate', {
        //创建随访模板
        url: "/:operateType/setTemplate",
        // url: "setTemplate",
        controller: "setTemplateStateController",
        templateUrl: "templates/state/setTemplateState.html"
        // resolve: {
        //     getData: function ($http, $stateParams, $$log, $$requestUrl) {
        //         if ($stateParams.operateType == 'new') {
        //             $$log.debug('loook me');
        //             return {};
        //         } else {
        //             $$log.debug('$stateParams.operateTypeoperateTypeoperateTypeoperateType');
        //             $$log.debug($stateParams.operateType);
        //             return $http({
        //                 method: 'GET',
        //                 url: $$requestUrl.getUrl("createFollowUpTemplatesStateController"),
        //                 params: {}
        //             }).success(function (response) {
        //                 $$log.debug("setTemplateStateController");
        //                 $$log.info(response);
        //                 return response;
        //             });
        //         }
        //
        //
        //     }
        // }
    }).state("startVisit", {
        //发起随访 new-->新建
        url: "/:operateType/startVisit",
        controller: "startVisitStateController",
        templateUrl: "templates/state/startVisitState.html"
        // resolve: {
        //     getData: function ($http, $stateParams, $$log, $$requestUrl) {
        //         return $http({
        //             method: 'POST',
        //             url: $$requestUrl.getUrl("startFollowUpStateController"),
        //             params: {}
        //         }).success(function (response) {
        //             $$log.debug("startVisitStateController");
        //             $$log.info(response);
        //             return response;
        //         });
        //     }
        // }
    }).state("editVisit", {
        //编辑随访 show -- 模板列表 , add -- 新建模版
        url: "/:operateType/editVisit",
        controller: "editVisitStateController",
        templateUrl: "templates/state/editVisitState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl) {
                return $http({
                    method: 'GET',
                    url: $$requestUrl.getUrl("createFollowUpTemplatesStateController"),
                    params: {}
                }).success(function (response) {
                    $$log.debug("editVisitStateController");
                    $$log.info(response);
                    return response;
                });
            }
        }
    }).state('choiceClass', {
        //选择班次
        url: "/:operateType/choiceClass",
        controller: "choiceClassStateController",
        templateUrl: "templates/state/choiceClassState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl) {
                return $http({
                    method: 'GET',
                    url: $$requestUrl.getUrl("chooseNurseScheduleStateController"),
                    params: {}
                }).success(function (response) {
                    $$log.debug("choiceClassStateController");
                    $$log.info(response);
                    return response;
                });
            }
        }
    }).state('classList', {
        //班次列表
        url: "/classList",
        controller: "classListStateController",
        templateUrl: "templates/state/classListState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl) {
                return $http({
                    method: 'GET',
                    url: $$requestUrl.getUrl("NurseScheduleListStateController"),
                    params: {}
                }).success(function (response) {
                    $$log.debug("classListStateController");
                    $$log.info(response);
                    return response;
                });
            }
        }
    }).state('choiceVisit', {
        //选择随访模板
        url: "/:operateType/choiceVisit",
        controller: "choiceVisitStateController",
        templateUrl: "templates/state/choiceVisitState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl) {
                return $http({
                    method: 'GET',
                    url: $$requestUrl.getUrl("chooseFollowUpTemplatesStateController"),
                    params: {}
                }).success(function (response) {
                    $$log.debug("choiceVisitStateController");
                    $$log.info(response);
                    return response;
                });
            }
        }
    }).state('writeRecord', {
        //填写随访记录,
        url: "/:eventId/writeRecord",
        controller: "writeRecordStateController",
        templateUrl: "templates/state/writeRecordState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl) {
                return $http({
                    method: 'GET',
                    url: $$requestUrl.getUrl("getFollowUpRecord", {id: $stateParams.eventId}),
                    params: {}
                }).success(function (response) {
                    $$log.debug("writeRecordStateController");
                    $$log.info(response);
                    return response;
                });
            }
        }
    }).state('dutyCalendar', {
        //排班表通过某人切换视图
        url: "/dutyCalendar/:weekOffset",
        controller: "dutyCalendarStateController",
        templateUrl: "templates/state/dutyCalendarState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl) {
                if (($stateParams.weekOffset == undefined || $stateParams.weekOffset == 0) && localStorage['changeSchedulePersonStateController'] && (+(new Date()) - (+(JSON.parse(localStorage['changeSchedulePersonStateController']).time))) < 5 * 60 * 1000) {
                    return {data: JSON.parse(localStorage['changeSchedulePersonStateController']).date};
                } else {
                    return $http({
                        method: 'GET',
                        url: $$requestUrl.getUrl("changeSchedulePersonStateController", {"departmentId": localStorage.globalDepartmentId}),
                        params: {
                            'dateFrom': $stateParams.weekOffset || 0
                        }
                    }).success(function (response) {
                        $$log.debug('dutyCalendarStateController');
                        $$log.info(response);
                        if ((response.result.success == true) && ($stateParams.weekOffset == undefined || $stateParams.weekOffset == 0)) {
                            var ls = {
                                time: +(new Date()),
                                date: response
                            };
                            localStorage['changeSchedulePersonStateController'] = JSON.stringify(ls);
                        }
                        return response;
                    });
                }
            }
        }
    }).state('dutyChange', {
        //排班表通过班次切换视图
        url: "/dutyChange/:weekOffset",
        controller: "dutyChangeStateController",
        templateUrl: "templates/state/dutyChangeState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl) {
                if (($stateParams.weekOffset == undefined || $stateParams.weekOffset == 0) && localStorage['changeScheduleClassStateController'] && (+(new Date()) - (+(JSON.parse(localStorage['changeScheduleClassStateController']).time))) < 5 * 60 * 1000) {
                    return {data: JSON.parse(localStorage['changeScheduleClassStateController']).date};
                } else {
                    return $http({
                        method: 'GET',
                        url: $$requestUrl.getUrl("changeScheduleClassStateController", {"departmentId": localStorage.globalDepartmentId}),
                        params: {
                            'dateFrom': $stateParams.weekOffset || 0
                        }
                    }).success(function (response) {
                        $$log.debug('dutyChangeStateController');
                        $$log.info(response);
                        if (response.result.success == true && ($stateParams.weekOffset == undefined || $stateParams.weekOffset == 0)) {
                            var ls = {
                                time: +(new Date()),
                                date: response
                            };
                            localStorage['changeScheduleClassStateController'] = JSON.stringify(ls);
                        }
                        return response;
                    });
                }
            }
        }
    }).state('dutyList', {
        //批量排班列表
        url: "/dutyList/:weekOffset",
        controller: "dutyListStateController",
        templateUrl: "templates/state/dutyListState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl) {
                if (($stateParams.weekOffset == undefined || $stateParams.weekOffset == 0) && localStorage['batchSchedulesStateController'] && (+(new Date()) - (+(JSON.parse(localStorage['batchSchedulesStateController']).time))) < 5 * 60 * 1000) {
                    return {data: JSON.parse(localStorage['batchSchedulesStateController']).date};
                } else {
                    return $http({
                        method: 'GET',
                        url: $$requestUrl.getUrl("batchSchedulesStateController", {"departmentId": localStorage.globalDepartmentId}),
                        params: {
                            'dateFrom': $stateParams.weekOffset || 0
                        }
                    }).success(function (response) {
                        $$log.debug('dutyListStateController');
                        $$log.info(response);
                        if (response.result.success == true && ($stateParams.weekOffset == undefined || $stateParams.weekOffset == 0)) {
                            var ls = {
                                time: +(new Date()),
                                date: response
                            };
                            localStorage['batchSchedulesStateController'] = JSON.stringify(ls);
                        }
                        return response;
                    });
                }
            }
        }
    }).state('choiceColor', {
        //选择颜色
        url: "/choiceColor",
        controller: "choiceColorStateController",
        templateUrl: "templates/state/choiceColorState.html"
    }).state('choiceDay', {
        //选择天
        url: "/choiceDay",
        controller: "choiceDayStateController",
        templateUrl: "templates/state/choiceDayState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl) {
                return $http({
                    method: 'GET',
                    url: $$requestUrl.getUrl("chooseRemindTimeStateController"),
                    params: {}
                }).success(function (response) {
                    $$log.debug('choiceDayStateController');
                    $$log.info(response);
                    return response;
                });
            }
        }
    }).state('choiceHospital', {
        //选择医院
        url: "/choiceHospital",
        controller: "choiceHospitalStateController",
        templateUrl: "templates/state/choiceHospitalState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl) {
                return $http({
                    method: 'GET',
                    url: $$requestUrl.getUrl("choiceHospitalStateController"),
                    params: {}
                }).success(function (response) {
                    $$log.debug('choiceHospitalStateController');
                    $$log.info(response);
                    return response;
                });
            }
        }
    }).state('choiceDepartment', {
        //选择科室
        url: "/:hospitalId/choiceDepartment",
        controller: "choiceDepartmentStateController",
        templateUrl: "templates/state/choiceDepartmentState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl) {
                return $http({
                    method: 'GET',
                    url: $$requestUrl.getUrl("choiceDepartmentStateController"),
                    params: {}
                }).success(function (response) {
                    $$log.debug('choiceDepartmentStateController');
                    $$log.info(response);
                    return response;
                });
            }
        }
    }).state("nurseToolCounter", {
        url: "/nurseToolCounter",
        controller: "nurseToolCounterStateController",
        // controllerAs:"",
        templateUrl: "templates/nurseMaster/state/nurseToolCounterState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl, $state) {
                return $http({
                    method: 'GET',
                    url: $$requestUrl.getUrl("nurseToolCounterStateController"),
                    params: {}
                }).success(function (response) {
                    $$log.debug('nurseToolCounterStateController');
                    $$log.info(response);
                    return response;
                }).error(function () {
                    $state.go('nurseLogin');
                });
            }
        }
    }).state('manage', {
        //管理
        url: "/manage",
        controller: "manageStateController",
        templateUrl: "templates/state/manageState.html"
        // resolve: {
        //     getData: function ($http, $stateParams, $$log, $$requestUrl) {
        //         return $http({
        //             method: 'GET',
        //             url: $$requestUrl.getUrl("choiceDepartmentStateController"),
        //             params: {}
        //         }).success(function (response) {
        //             $$log.debug('choiceDepartmentStateController');
        //             $$log.info(response);
        //             return response;
        //         });
        //     }
        // }
    }).state('nursePlanCounter', {
        //选择科室
        url: "/nursePlanCounterStateController",
        controller: "nursePlanCounterStateController",
        templateUrl: "templates/state/nursePlanCounterState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl, $state) {
                return $http({
                    method: 'GET',
                    url: $$requestUrl.getUrl("nursePlanCounterStateController"),
                    params: {}
                }).success(function (response) {
                    $$log.debug('nursePlanCounterStateController');
                    $$log.info(response);
                    return response;
                }).error(function () {
                    $state.go('nurseLogin');
                });
            }
        }

        //--------lix


        //---------yih
    }).state('login', {
        //注册页面
        url: "/login",
        controller: "loginStateController",
        templateUrl: "templates/state/loginState.html"
    }).state("basicInfo", {
        //注册个人基本信息
        url: "/basicInfo",
        controller: "basicInfoStateController",
        templateUrl: "templates/state/basicInfoState.html"
    }).state('professionInfo', {
        //注册个人职业信息
        url: "/professionInfo",
        controller: "professionInfoStateController",
        templateUrl: "templates/state/professionInfoState.html"
    }).state('allPatientList', {
        //全部患者列表页, show-展示,selectFollowObj--选择随访对象
        url: "/:operateType/allPatientList",
        controller: "allPatientListStateController",
        templateUrl: "templates/state/allPatientListState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl) {
                if (localStorage['allPatientList'] && (+(new Date()) - (+(JSON.parse(localStorage['allPatientList']).time))) < 5 * 60 * 1000) {
                    return {data: JSON.parse(localStorage['allPatientList']).date};
                } else {
                    return $http({
                        method: 'GET',
                        url: $$requestUrl.getUrl("allPatientListStateController", {"nurseId": localStorage.globalNurseId}),
                        params: {}
                    }).success(function (response) {
                        $$log.debug('allPatientListStateController');
                        $$log.info(response);
                        if (response.result.success == true) {
                            var ls = {
                                time: +(new Date()),
                                date: response
                            };
                            localStorage['allPatientList'] = JSON.stringify(ls);
                        }
                        return response;
                    });
                }
            }

        }
    }).state('otherPatientList', {
        //其他患者列表页
        url: "/:isIn/otherPatientList",
        controller: "otherPatientListStateController",
        templateUrl: "templates/state/otherPatientListState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl) {
                return $http({
                    method: 'GET',
                    url: $$requestUrl.getUrl("otherPatientListStateController", {"nurseId": localStorage.globalNurseId}),
                    params: {}
                }).success(function (response) {
                    $$log.debug('otherPatientListStateController');
                    $$log.info(response);
                    return response;
                });
            }

        }
    }).state('patientDetail', {
        //患者详情页
        url: "/:patientId/patientDetail",
        controller: "patientDetailStateController",
        templateUrl: "templates/state/patientDetailState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl) {
                return $http({
                    method: 'GET',
                    url: $$requestUrl.getUrl("patientDetailStateController", {"userId": $stateParams.patientId}),
                    params: {}
                }).success(function (response) {
                    $$log.debug('patientDetailStateController');
                    $$log.info(response);
                    return response;
                });
            }
        }
    }).state('inviteNurse', {
        //邀请同事页
        url: "/inviteNurse",
        controller: "inviteNurseStateController",
        templateUrl: "templates/state/inviteNurseState.html"
    }).state('userCenter', {
        //个人中心页
        url: "/userCenter",
        controller: "userCenterStateController",
        templateUrl: "templates/state/userCenterState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl, $$toast) {
                return $http({
                    method: 'GET',
                    url: $$requestUrl.getUrl("userCenterInfoStateController", {"nurseId": localStorage.globalNurseId}),
                    params: {}
                }).success(function (response) {
                    if (response.result.success == false) {
                        $$toast.show(response.result.displayMsg);
                    }
                    $$log.debug('userCenterInfoStateController');
                    $$log.info(response);
                    return response;
                });
            }
        }
    }).state('aletrNurseInfo', {
        //修改个人信息页,身份认证页
        url: "/aletrNurseInfo",
        controller: "aletrNurseInfoStateController",
        templateUrl: "templates/state/aletrNurseInfoState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl, $$toast) {
                return $http({
                    method: 'GET',
                    url: $$requestUrl.getUrl("alterNurseInfoStateController", {"nurseId": localStorage.globalNurseId}),
                    params: {}
                }).success(function (response) {
                    if (response.result.success == false) {
                        $$toast.show(response.result.displayMsg);
                    }
                    $$log.debug('alterNurseInfoStateController');
                    $$log.info(response);
                    return response;
                });
            }
        }
    }).state('nurseList', {
        //同事列表页,选择我的同事页面
        //'show'--同事列表页,'selectOrder'--选择我的同事页面(排班对象),'selectAttention'--选择我的同事页面(关注对象)
        url: "/:operateType/nurseList",
        controller: "nurseListStateController",
        templateUrl: "templates/state/nurseListState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl, $$toast) {
                if (localStorage['nurseList'] && (+(new Date()) - (+(JSON.parse(localStorage['nurseList']).time))) < 5 * 60 * 1000) {
                    return {data: JSON.parse(localStorage['nurseList']).date};
                } else {
                    return $http({
                        method: 'GET',
                        url: $$requestUrl.getUrl("nurseListStateController", {"nurseId": localStorage.globalNurseId}),
                        params: {}
                    }).success(function (response) {
                        if (response.result.success == false) {
                            $$toast.show(response.result.displayMsg);
                        }
                        $$log.debug('nurseListStateController');
                        $$log.info(response);
                        if (response.result.success == true) {
                            var ls = {
                                time: +(new Date()),
                                date: response
                            };
                            localStorage['nurseList'] = JSON.stringify(ls);
                        }
                        return response;
                    })
                }
            }
        }
    }).state('nurseDetail', {
        //同事详情页
        url: "/:nurseId/nurseDetail",
        controller: "nurseDetailStateController",
        templateUrl: "templates/state/nurseDetailState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl, $$toast) {
                return $http({
                    method: 'GET',
                    url: $$requestUrl.getUrl("nurseDetailStateController", {"nurseId": $stateParams.nurseId}),
                    params: {}
                }).success(function (response) {
                    if (response.result.success == false) {
                        $$toast.show(response.result.displayMsg);
                    }
                    $$log.debug('nurseDetailStateController');
                    $$log.info(response);
                    return response;
                });
            }
        }
    }).state('alterNurseTag', {
        //修改同事标签页
        url: "/:nurseId/alterNurseTag",
        controller: "alterNurseTagStateController",
        templateUrl: "templates/state/alterNurseTagState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl, $$toast) {
                return $http({
                    method: 'GET',
                    url: $$requestUrl.getUrl('alterNurseTagStateController', {"departmentId": localStorage.globalDepartmentId}),
                    params: {}
                }).success(function (response) {
                    if (response.result.success == false) {
                        $$toast.show(response.result.displayMsg);
                    }
                    $$log.debug('alterNurseTagStateController');
                    $$log.info(response);
                    return response;
                });
            }
        }

    }).state('toolList', {
        //工具列表页
        url: "/toolList",
        controller: "toolListStateController",
        templateUrl: "templates/state/toolListState.html"
    }).state('contentList', {
        //推送内容页,pushTemplate-->模版推送
        url: "/:operateType/contentList",
        controller: "contentListStateController",
        templateUrl: "templates/state/contentListState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl, $$toast) {
                if (localStorage['contentListStateController'] && (+(new Date()) - (+(JSON.parse(localStorage['contentListStateController']).time))) < 60 * 60 * 1000) {
                    return {data: JSON.parse(localStorage['contentListStateController']).date};
                } else {
                    return $http({
                        method: 'GET',
                        url: $$requestUrl.getUrl("contentListStateController"),
                        params: {}
                    }).success(function (response) {
                        if (response.result.success == false) {
                            $$toast.show(response.result.displayMsg);
                        }
                        $$log.debug('contentListStateController');
                        $$log.info(response);
                        if (response.result.success == true) {
                            var ls = {
                                time: +(new Date()),
                                date: response
                            };
                            localStorage['contentListStateController'] = JSON.stringify(ls);
                        }
                        return response;
                    });
                }
            }
        }
    }).state('patientTag', {
        //标签筛选页,communicate -- 筛选需要沟通的对象, push -- 选择推送对象
        url: "/:operateType/patientTag",
        controller: "patientTagStateController",
        templateUrl: "templates/state/patientTagState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl, $$toast) {
                return $http({
                    method: 'GET',
                    url: $$requestUrl.getUrl("patientTagStateController", {"departmentId": localStorage.globalDepartmentId}),
                    params: {}
                }).success(function (response) {
                    if (response.result.success == false) {
                        $$toast.show(response.result.displayMsg);
                    }
                    $$log.debug('patientTagStateController');
                    $$log.info(response);
                    return response;
                });
            }
        }
    }).state('selectList', {
        //选择沟通对象页 , 筛选结果
        url: "/selectList",
        controller: "selectListStateController",
        templateUrl: "templates/state/selectListState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl, $q) {
                if (localStorage['selectList'] && (+(new Date()) - (+(JSON.parse(localStorage['selectList']).time))) < 5 * 60 * 1000) {
                    return JSON.parse(localStorage['selectList']);
                } else {
                    return ( $q.all({
                        nurse: $http({
                            method: 'GET',
                            url: $$requestUrl.getUrl("getSelectNurseStateController", {"nurseId": localStorage.globalNurseId}),
                            params: {}
                        }),
                        patient: $http({
                            method: 'GET',
                            url: $$requestUrl.getUrl("getSelectPatientStateController", {"nurseId": localStorage.globalNurseId}),
                            params: {}
                        })
                    }).then(function (arr) {
                        $$log.debug('debug');
                        $$log.info(arr);
                        if (arr.nurse.data.result.success == true && arr.patient.data.result.success == true) {
                            var ls = arr;
                            ls.time = +(new Date());
                            localStorage['selectList'] = JSON.stringify(ls);
                        }
                        return arr;
                    }));
                }
            }
        }
    }).state('tagManage', {
        //标签管理
        url: "/tagManage",
        controller: "tagManageStateController",
        templateUrl: "templates/state/tagManageState.html"
    }).state('patientTagManage', {
        //患者标签管理
        url: "/patientTagManage",
        controller: "patientTagManageStateController",
        templateUrl: "templates/state/patientTagManageState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl) {
                return $http({
                    method: 'GET',
                    url: $$requestUrl.getUrl('patientTagManageStateController', {"departmentId": localStorage.globalDepartmentId}),
                    params: {}
                }).success(function (response) {
                    $$log.debug('patientTagManageStateController');
                    $$log.info(response);
                    return response;
                });
                // }
            }
        }
    }).state('nurseTagManage', {
        //护士标签管理
        url: "/nurseTagManage",
        controller: "nurseTagManageStateController",
        templateUrl: "templates/state/nurseTagManageState.html",
        resolve: {
            getData: function ($http, $stateParams, $$log, $$requestUrl) {
                return $http({
                    method: 'GET',
                    url: $$requestUrl.getUrl('nurseTagManageStateController', {"departmentId": localStorage.globalDepartmentId}),
                    params: {}
                }).success(function (response) {
                    $$log.debug('nurseTagManageStateController');
                    $$log.info(response);
                    return response;
                });
                // }
            }
        }
    })
    //---------yih
        .state('messageTag', {
            url: "/messageTag",
            controller: "messageTagStateController",
            templateUrl: "templates/state/messageTagState.html",
            resolve: {
                getData: function ($http, $stateParams, $$log, $$requestUrl) {
                    // if (!localStorage['messageTag']) {
                    //     localStorage['messageTag'] = 1;
                    // }
                    // localStorage['messageTag'] = parseInt(localStorage['messageTag']) + 1;
                    // if (parseInt(localStorage['messageTag']) % 2 == 1) {
                    //     location.reload();
                    // } else {
                    return $http({
                        method: 'GET',
                        url: $$requestUrl.getUrl('messageTagStateController'),
                        params: {scenario: 'messageCenter'}
                    }).success(function (response) {
                        $$log.debug('messageTagStateController');
                        $$log.info(response);
                        return response;
                    });
                    // }
                }
            }
        })
        .state('recentCalender', {
            url: "/recentCalender",
            controller: "recentCalenderStateController",
            templateUrl: "templates/state/recentCalenderState.html",
            resolve: {
                getData: function ($http, $stateParams, $$log, $$requestUrl) {
                    return $http({
                        method: 'GET',
                        url: $$requestUrl.getUrl("recentCalenderStateController"),
                        params: {scenario: 'messageCenter'}
                    }).success(function (response) {
                        $$log.debug('recentCalenderStateController');
                        $$log.info(response);
                        return response;
                    });
                }
            }
        })
        .state('chat', {
            url: "/chat",
            controller: "chatStateController",
            templateUrl: "templates/state/chatState.html"
        })
        .state('createCalender', {
            url: "/createCalender",
            controller: "createCalenderStateController",
            templateUrl: "templates/state/createCalenderStateController.html"
        })
        .state('guidePage', {
            url: "/guidePage",
            controller: "guidePageStateController",
            templateUrl: "templates/state/guidePageState.html"
        })
        .state('fakeMainPage', {
            url: "/fakeMainPage",
            controller: "fakeMainPageStateController",
            templateUrl: "templates/state/fakeMainPageState.html"
        })
        .state('patientRelation', {
            url: "/patientRelation",
            controller: "patientRelationStateController",
            templateUrl: "templates/state/patientRelationState.html",
            // resolve: {
            //     getData: function ($http, $stateParams, $$log, $$requestUrl) {
            //         return $http({
            //             method: 'GET',
            //             url: $$requestUrl.getUrl("allDepartmentTags", {"departmentId": localStorage.globalDepartmentId}),
            //             params: {}
            //         }).success(function (response) {
            //             $$log.debug('allDepartmentTags');
            //             $$log.info(response);
            //             if (response.result.success == true) {
            //                 var ls = {
            //                     time: +(new Date()),
            //                     date: response
            //                 };
            //                 localStorage['allDepartmentTags'] = JSON.stringify(ls);
            //             }
            //             return response;
            //         });
            //     }
            // }
        })
        .state('setting', {
            url: "/setting",
            controller: "settingStateController",
            templateUrl: "templates/state/settingState.html"
        })
        .state('blackList', {
            url: "/blackList",
            controller: "blackListStateController",
            templateUrl: "templates/state/blackListState.html",
            resolve: {
                getData: function ($http, $stateParams, $$log, $$requestUrl) {
                    return $http({
                        method: 'GET',
                        url: $$requestUrl.getUrl("blackList", {"nurseId": localStorage.globalNurseId}),
                        params: {}
                    }).success(function (response) {
                        $$log.debug('allPatientListStateController');
                        $$log.info(response);
                        return response;
                    });
                }
            }
        })
        .state('statistic', {
            url: "/statistic",
            controller: "statisticStateController",
            templateUrl: "templates/state/statisticState.html",
            resolve: {
                getData: function ($http, $stateParams, $$log, $$requestUrl) {
                    return $http({
                        method: 'GET',
                        url: $$requestUrl.getUrl("statisticStateController"),
                        params: {
                            "nurseId": localStorage.globalNurseId
                        }
                    }).success(function (response) {
                        $$log.debug('statisticStateController');
                        $$log.info(response);
                        return response;
                    });
                }
            }
        })
        .state('planCount', {
            url: "/:statisticType/planCount",
            controller: "statisticsCountStateController",
            templateUrl: "templates/state/statisticsCountState.html",
            resolve: {
                getData: function ($http, $stateParams, $$log, $$requestUrl) {
                    return $http({
                        method: 'GET',
                        url: $$requestUrl.getUrl("planCountStateController"),
                        params: {
                            "nurseId": localStorage.globalNurseId
                        }
                    }).success(function (response) {
                        $$log.debug('planCountStateController');
                        $$log.info(response);
                        return response;
                    });
                }
            }
        })
        .state('toolCount', {
            url: "/:statisticType/toolCount",
            controller: "statisticsCountStateController",
            templateUrl: "templates/state/statisticsCountState.html",
            resolve: {
                getData: function ($http, $stateParams, $$log, $$requestUrl) {
                    return $http({
                        method: 'GET',
                        url: $$requestUrl.getUrl("toolCountStateController"),
                        params: {
                            "nurseId": localStorage.globalNurseId
                        }
                    }).success(function (response) {
                        $$log.debug('toolCountStateController');
                        $$log.info(response);
                        return response;
                    });
                }
            }
        })
}]);