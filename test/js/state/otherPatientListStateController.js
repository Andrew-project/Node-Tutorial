/**
 * Created by yihuan on 16/9/26.
 */
app.controller('otherPatientListStateController',function($$shence,$rootScope, $state, $scope,$location, $$log, $$title, getData,$$navbar,$$tabbar,$stateParams){

    $scope.data = getData.data;
    $$log.debug('otherPatientListStateController');
    $$log.debug($scope.data);

    $scope.dataArr = $scope.data.user;

    if($stateParams.isIn == 'true'){
        $$shence.track('_getInHospitalPatientList');
        $$log.debug($stateParams.isIn);
        $$navbar.setTitle('住院患者');
        $scope.isIn = 1;
        $scope.inLength = 0;
        for(var i = 0 ; i <  $scope.dataArr.length ;i++){
           for(var j = 0 ; j < $scope.dataArr[i].member.length ; j++){
               if($scope.dataArr[i].member[j].status == 1){
                   $scope.inLength++;
               }
           }
        }
       $$log.debug('inLength'+$scope.inLength);
    }else{
        $$shence.track('_getOutHospitalPatientList');
        $$log.debug($stateParams.isIn);
        $$navbar.setTitle('已出院患者');
        $scope.isIn = 0;
        $$log.debug('otherPatientListStateController');
        $scope.outLength = 0;
        for(var i = 0 ; i <  $scope.dataArr.length ;i++){
            for(var j = 0 ; j < $scope.dataArr[i].member.length ; j++){
                if($scope.dataArr[i].member[j].status == 0){
                    $scope.outLength++;
                }
            }
        }
        $$log.debug('outLength'+$scope.outLength);
    }

    $$log.info($scope);
    $$navbar.showReturnBtn();
    $$tabbar.setIndex(-1);

});


