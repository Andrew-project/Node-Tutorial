/**
 * Created by yihuan on 16/9/18.
 */
app.controller('patientListStateController',function($rootScope, $state, $scope,$location, $$log, $$title, getData,$$tabbar,$$navbar){

    $$log.debug('patientListStateController');
    $$log.info($scope);
    $$navbar.show();
    $$navbar.setTitle('我的患者');
    $$tabbar.setIndex(1);
    $$navbar.hideReturnBtn();
    $scope.data = getData.data;

    $scope.dataArr = {};

    // function sortOrder(userArr){
    //
    //     for(var i = 0 ; i<userArr.length ; i++){
    //         for(var j=0,len=userArr[i].length;i<len;j++){
    //             //获得unicode码
    //             var ch = userArr.charAt(userArr[i].name);
    //             //检查该unicode码是否在处理范围之内,在则返回该码对映汉字的拼音首字母,不在则调用其它函数处理
    //             arrResult.push(checkCh(ch));
    //         }
    //         //处理arrResult,返回所有可能的拼音首字母串数组
    //         return arrResult;
    //
    //     }
    //
    //     // if(typeof(str) != "string")
    //     //     throw new Error(-1,"函数makePy需要字符串类型参数!");
    //
    // }
    // sortOrder($scope.data);





});
