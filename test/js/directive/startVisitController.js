/**
 * Created by lixu on 16/9/19.
 */
var templateTime = '';
var followUpData = {
    'followObj': '',
    'admissionTime': ''
};
app.directive('startVisitController', function () {
    return {
        restrict: 'AE',
        templateUrl: 'templates/controller/startVisitController.html',
        // require:'',
        // priority:'',
        replace: true,
        scope: {
            data: '=data'
        },
        controller: function ($scope, $element, $attrs, $$log, $state, $interval, $$txIM, $http, $$requestUrl, $$toast, $rootScope, $$iconfont, $$loading, $timeout) {
            $scope.targetId = [],$scope.executorId = [],$scope.runNurseObj=[];
            $scope.onPickDateClick = function () {
                try {
                    var dDate = new Date();
                    dDate.setFullYear($scope.admissionTime.format('yyyy'), $scope.admissionTime.format('MM') - 1, $scope.admissionTime.format('dd'));
                    var minDate = new Date();
                    minDate.setFullYear(2016, 0, 1);
                    var maxDate = new Date();
                    maxDate.setFullYear(2018, 11, 31);
                    plus.nativeUI.pickDate(function (e) {
                        $scope.admissionTime = e.date;
                        $scope.onAdmissionTimeChange();
                        $timeout(function () {
                            $scope.$apply();
                        }, 500);
                    }, function (e) {
                    }, {title: "请选择日期", date: dDate, minDate: minDate, maxDate: maxDate});
                } catch (e) {

                }
            };
            //表单触发
            $('.triggerInputWarp').on('click', '.triggerInput', function () {
                $(this).find('input').focus();
            });

            if (typeof(templateTime) != 'string') {
                $scope.admissionTime = templateTime;
            } else {
                $scope.admissionTime = $scope.admissionTime || (new Date());
            }
            //跳页面选择值
            $scope.targetId.push(followPatientObj.userId);
            $scope.followObj = followPatientObj.name;

            $scope.followtemplateId = templateObj.templateId;
            $scope.followTemplateObj = templateObj.title;


            for(var i=0;i<runNurseObjArr.length;i++){
                $scope.runNurseObj.push(runNurseObjArr[i].member.name);
                $scope.executorId.push(runNurseObjArr[i].member.id);
            }
            // $scope.runNurseObj = $scope.runNurseObj.join('，');

            //提醒
            if(remindArr.length>0){
                $scope.alertTemplateId = remindArr[0].id;
                $scope.remind  = remindArr[0].title;
            }else{
                $scope.alertTemplateId = '';
                $scope.remind = '';
            }
            $scope.onAdmissionTimeChange = function () {
                    templateTime = $scope.admissionTime;
            };
            $scope.onSaveFollowUpClick = function () {
                if ($scope.targetId[0] == undefined || $scope.executorId.length < 1  || $scope.alertTemplateId === '' || $scope.followtemplateId == '' ||  $scope.followtemplateId == undefined) {
                    $$toast.show('请检查信息后提交');
                    return false;
                } else {
                    $$loading.show();
                    var date = $scope.admissionTime.format('yyyy/MM/dd');
                    $http({
                        method: 'POST',
                        url: $$requestUrl.getUrl("startFollowUpStateController"),
                        data: {
                            "dischargeAt": Date.parse(new Date(date)),
                            "targetId": $scope.targetId,//随访对象的id
                            "executorId": $scope.executorId,//护士的id
                            "alertTemplateId": $scope.alertTemplateId,
                            "followUptemplateId": $scope.followtemplateId
                        }
                    }).success(function (response) {
                        $$loading.hide();
                        if (response.result.success === true) {
                            //全局变量置空
                            followPatientObj = [];
                            templateObj = [];
                            remindArr = [];
                            templateTime = null;
                            runNurseObjArr = [];
                            $$toast.show('发起成功');
                            $state.go('messageTag');
                        }
                        $$log.debug("startVisitStateController");
                        $$log.info(response);
                    });
                }
            };
            $$log.debug('startVisitController');
            $$log.info($scope);
        }
    };
});