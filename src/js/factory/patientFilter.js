/**
 * Created by gaoqz on 16/11/21.
 */

app.factory('$$patientFilter', function () {
    return {
        getpatient: function (patientData) {
            var nurseType = parseInt(localStorage.authorizedStatus);
            if (nurseType == 4 || nurseType == 5) {
                $$log.debug('nurseType == 4');
                for (var i = 0; i < patientData.length; i++) {
                    for (var j = 0; j < patientData[i].member.length; j++) {
                        if(typeof patientData[i].member[j].tag != 'undefined'){
                            for(var k = 0 ; k < patientData[i].member[j].tag.length ; k++){
                                if(patientData[i].member[j].tag[k].tagType == 3 ){
                                    patientData[i].member[j].isBlack = true;
                                    break;
                                }else{
                                    patientData[i].member[j].isBlack = false;
                                }
                            }
                        }else{
                            patientData[i].member[j].isBlack = false;
                        }
                    }
                }
                for(var i = 0 ; i < patientData.length ; i++){
                    patientData[i].isNull = false;
                }
                for (var i = 0; i < patientData.length; i++) {
                    for (var j = 0; j < patientData[i].member.length; j++) {
                        var flag = 1;
                        if(patientData[i].member[j].isBlack == true){
                            flag = flag + 1;
                            if(flag == patientData[i].member.length == flag){
                                patientData[i].isNull = true;
                            }
                        }
                    }
                }

                return patientData;

            } else {
                return patientData;
            }
        }
    };
});