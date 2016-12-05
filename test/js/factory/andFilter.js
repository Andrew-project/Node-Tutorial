/**
 * Created by yihuan on 2016/11/15.
 */
app.filter('andFilter', function ($$log) {
    return function (array, input) {
        if (!input) {
            return array;
        }
        // paramsName = paramsName ? ('\"' + paramsName + '\"' + ':\"') : '';
        // console.log(paramsName);
        $$log.log(array);
        $$log.log(input);
        var inputArray = input.split(' ');
        var resultArray = [];

        for (var i = 0; i < array.length; i++) {
            isMatching(array[i]);
        }

        function isMatching(data) {
            for (var j = 0; j < inputArray.length; j++) {

                if (JSON.stringify(data).indexOf(inputArray[j])<0) {
                    return 0;
                }
                // if (paramsName != '' && JSON.stringify(data).split(paramsName)[1].split('"')[0].indexOf(inputArray[j]) < 0) {
                //
                //     console.log('return');
                //     console.log(JSON.stringify(data));
                //     console.log(inputArray[j]);
                //     console.log('--');
                //     return 0;
                // } else if (paramsName == '' && JSON.stringify(data).indexOf(inputArray[j]) < 0) {
                //     return 0;
                //     // if (JSON.stringify(data).indexOf(paramsName+inputArray[j])<0) {
                //     //     console.log('return');
                //     //     console.log(JSON.stringify(data));
                //     //     console.log(inputArray[j]);
                //     //     console.log('--');
                //     //     return 0;
                // }
            }
            resultArray.push(data);
        }

        $$log.log(resultArray);
        return resultArray;
    }
});