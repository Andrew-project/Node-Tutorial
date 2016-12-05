/**
 * Created by yihuan on 16/9/19.
 */

var nurseDetail = '';
var checkedNurseTag = [];
app.controller('nurseDetailStateController',function($rootScope, $state, $scope,$location, $$log, $$title, $$navbar,$$tabbar,getData,$stateParams,$http,$$requestUrl,$$loading){
    checkedNurseTag = [];
    $$navbar.showReturnBtn();
    $$tabbar.setIndex(-1);
    $scope.data = getData.data;

    $scope.filterJuge = $stateParams.nurseId;
    for (var i=0; i<$scope.data.all.length; i++) {
           if ($scope.data.all[i].nurseId == $scope.filterJuge) {
               nurseDetail = $scope.data.all[i];
               break;
           }
    }

    $$navbar.setTitle(nurseDetail.name ? nurseDetail.name : '同事详情页');

    //设置默认选中的tag数组
    if(typeof nurseDetail.tag != "undefined"){
        for(var j = 0 ; j < nurseDetail.tag.length ; j++ ){
            checkedNurseTag.push(nurseDetail.tag[j].tagId);
        }
    }

    $scope.ownNurseId = localStorage.globalNurseId;
    $scope.nurseInfo = nurseDetail;
    $scope.tagStr = '';
    if ($scope.nurseInfo.tag != undefined) {
        for (var i = 0; i < $scope.nurseInfo.tag.length; i++) {
            if (i < $scope.nurseInfo.tag.length - 1) {
                $scope.tagStr = $scope.tagStr + $scope.nurseInfo.tag[i].tagName + '，';
            } else {
                $scope.tagStr = $scope.tagStr + $scope.nurseInfo.tag[i].tagName;
            }
        }
    }
    classArr = [];
    orderObjArr = [];
    remindArr = [];
    admissionTime = null;
    $scope.goToSort = function (nurse) {
        var nurserData = {'member':{'id':nurse.nurseId,'name':nurse.name},'delObj':[]};
        orderObjArr = [nurserData];
        $state.go("sort",{operateType:'alert'});
    };

    $scope.gotoChat = function(nurse){
        $$loading.show();
        $http({
            method: 'GET',
            url: $$requestUrl.getUrl("createNurseChat",{fromId:localStorage.globalNurseId ,toId:$stateParams.nurseId})
        }).success(function (response) {

            $$loading.hide();

            if(response.result.success == true){
                $$log.debug('和护士建立聊天成功！');
                localStorage.targetChatId=response.toAccount.identifier;
                location.href = location.origin + location.pathname + '?' + parseInt(Math.random() * 1000) + '#/chat';
                $$log.debug('createNurseNurseChatStateController');
                $$log.info(response);
            }else{
                $$toast.show(response.result.displayMsg ? response.result.displayMsg :'服务器向你扔来了一个错误');
            }

        });
    };

});

