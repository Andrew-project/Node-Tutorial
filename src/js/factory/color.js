/**
 * Created by dongsj on 16/7/15.
 * 颜色转换
 */
app.factory('$$color', function ($$log) {
    return {
        transform: function (colorStr) {
            var color = colorStr;
            switch (colorStr) {
                case 'bkColor1':
                case 'color1':
                case undefined:
                case '':
                    color = 'orange';
                    break;
                case 'bkColor2':
                case 'color2':
                    color = 'blue';
                    break;
                case 'bkColor3':
                case 'color3':
                    color = 'purple';
                    break;
                case 'bkColor4':
                case 'color4':
                    color = 'pink';
                    break;
                case 'bkColor5':
                case 'color5':
                    color = 'orange';
                    break;
                case 'bkColor6':
                case 'color6':
                    color = 'red';
                    break;
                case 'bkColor7':
                case 'color7':
                case 'bkColor8':
                case 'color8':
                    color = 'yellow';
                    break;
                default:
                // color = 'orange';
            }
            return color;
        },
        getColor:function(){
            var colorList=[
                {
                    className:'pink',
                    nickName:'粉色'
                },
                {
                    className:'green',
                    nickName:'绿色'
                },
                {
                    className:'lightGreen',
                    nickName:'浅绿色'
                },
                {
                    className:'darkGreen',
                    nickName:'深绿色'
                },
                {
                    className:'orange',
                    nickName:'橙色'
                },
                {
                    className:'water',
                    nickName:'水色'
                },
                {
                    className:'yellow',
                    nickName:'黄色'
                },
                {
                    className:'lightGray',
                    nickName:'浅灰色'
                },
                {
                    className:'lightBlue',
                    nickName:'浅蓝色'
                },
                {
                    className:'blue',
                    nickName:'蓝色'
                },
                {
                    className:'red',
                    nickName:'红色'
                },
                {
                    classNam:'purple',
                    nickName:'紫色'
                }
            ];
            return colorList;
        }
    };
});