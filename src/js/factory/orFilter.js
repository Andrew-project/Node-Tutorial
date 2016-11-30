/**
 * Created by yihuan on 2016/11/15.
 */
app.filter('orFilter', function ($$log) {
    return function (array, input) {
        if (!input) {
            return array;
        }
        $$log.log(array);
        $$log.log(input);
        var inputArray = input.split(' ');
        var resultArray = [];
        for (var j = 0; j < array.length; j++) {
            var flag = 0;
            for (var i = 0; i < inputArray.length; i++) {
                if (JSON.stringify(array[j]).split(inputArray[i]).length > 1) {
                    flag++;
                }
            }
            if (flag > 0) {
                resultArray.push(array[j]);
            }
        }
        $$log.log(resultArray);
        return resultArray;
    }
});