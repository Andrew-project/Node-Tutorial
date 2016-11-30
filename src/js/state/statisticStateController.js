/**
 * Created by lsh on 16/11/16.
 */
app.controller('statisticStateController',function($rootScope, $state, $scope,$location, $$log, $$title,$$tabbar,$$navbar,$$shence){
    // $$log.info(getData.data);
    //统计管理
    $$navbar.setTitle('统计管理');
    $$tabbar.setIndex(-1);
    $$navbar.showReturnBtn();
    var myChart = echarts.init(document.getElementById('userEChart'));
    var xAxisData = [];
    var seriesData = [];
    var temp = $scope.data.seven;
    //时间
    for (var i = 0; i < temp.date.length; i++) {
        xAxisData.push(temp.date[i].substr(5,5));
    }
    for (i = 0; i < temp.times.length - 1; i++) {
        seriesData.push(temp.times[i]);
    }
    seriesData.push({
        value: temp.times[temp.times.length-1],
        symbolSize: 8,
        label: {
            normal: {
                textStyle: {
                    fontSize: 15,
                    color: '#FF585C'
                }
            }
        },
        itemStyle: {
            normal: {
                color: '#FF585C',
                borderWidth: 50
            }
        }
    });
    option = {
        tooltip: {
            trigger: 'axis',
            show: false
        },
        grid: {
            left: '7%',
            right: '10%',
            bottom: '15%',
            top: '15%',
            show: false,
            containLabel: false
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                axisTick: {
                    show: true
                },
                // data: ['7-1', '7-2', '7-3', '12-12', '12-13', '12-14', '12-15'],
                data: xAxisData,
                // nameTextStyle: {
                //     fontSize: 15
                // },
                axisLine: {
                    show: true,
                    lineStyle: {
                        width: 1,
                        color: '#ddd'
                    }
                },
                axisLabel: {
                    margin: 10,
                    textStyle: {
                        fontSize: 13
                    }
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitNumber: 3,
                splitLine: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: false
                }
            }
        ],
        textStyle: {fontSize: 12, color: '#888'},
        series: [
            {
                type: 'line',
                smooth: true,
                symbol: 'circle',
                symbolSize: 6,
                data:seriesData,
                // areaStyle: {normal: {color: '#8FE0CC'}},
                // data: [52, 21, 32, 44, 15, 53, {
                //     value: 56,
                //     symbolSize: 8,
                //     label: {
                //         normal: {
                //             // position: [-25, -20],
                //             textStyle: {
                //                 color: '#FF585C'
                //                 // fontSize: 15
                //             }
                //         }
                //     },
                //     itemStyle: {
                //         normal: {
                //             color: '#FF585C',
                //             borderWidth: 50
                //         }
                //     }
                // }],
                itemStyle: {
                    normal: {
                        color: '#00BD8F'
                    }
                },
                label: {
                    normal: {
                        show: true,
                        // formatter: function (value) {
                        //     return '+' + value + '人';
                        // },
                        formatter: '+{c}人',
                        position: [-12, -18]
                        // color: '#ff0000',
                        // fontSize: 25
                    }
                }
            }
        ]
    };
    myChart.setOption(option);
    // $$wx.configByHttp(function (department) {
    //     $$wx.setShare({
    //         title: department.name,
    //         desc: department.name + ' @' + department.hospitalName,
    //         link: $location.absUrl(),
    //         imgUrl: encodeURI(department.iconImgUrl)
    //     });
    // });
    // hospitalName = $scope.data.department.hospitalName;
    // hospitalId = $scope.data.department.hospitalId;
    // departmentName = $scope.data.department.name;
    // departmentId = $scope.data.department.id;
    // $$shence.track('_nurseHomeState', {
    //     hospital: hospitalName,
    //     hospitalId: hospitalId,
    //     department: departmentName,
    //     departmentId: departmentId
    // });
    // scrollTo(0, 0);
    // $$log.debug('nurseHomeStateController');
    // $$log.info($scope);
    // $$title.setTitle('首页');
    // $$zhugeIO.track('首页', {
    //     "医院": $scope.data.department.hospital,
    //     "科室": $scope.data.department.name,
    //     "医院_科室": $scope.data.department.hospital + '_' + $scope.data.department.name
    // });
    // $$shence.track('_nurseHomeState', {
    //     hospital: $scope.data.department.hospital,
    //     department: $scope.data.department.name,
    //     hospital_department: $scope.data.department.hospital + '_' + $scope.data.department.name
    // });
});