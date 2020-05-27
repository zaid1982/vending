function MainHome() {

    const className = 'MainHome';
    let self = this;
    let modalAddActivityClass;

    this.init = function () {
        self.generateChartAll('chartHmeAll');
        self.generateChartMonthlyProfit('chartHmeMonthlyProfit');
        self.generateChartMonthlyProfit('chartHmeSiteProfit');
        self.generateChartMonthlyProfit('chartHmeMachineProfit');
    };

    this.generateChartAll = function (chartId) {
        $.ajax({
            url: 'account/allList',
            type: 'GET', headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')},
            dataType: 'json', async: true,
            success: function (resp) {
                if (resp.success) {
                    let data = [];
                    let result = resp.result;
                    $.each(result, function (no, row) {
                        const unixTime = new Date(row['ballDate'].replace(' ', 'T')).getTime();
                        data.push({x:unixTime, y:parseFloat(row['ballBalance'])});
                        if (no === result.length - 1) {
                            data[no]['dataLabels'] = {enabled: true, format: 'RM {point.y:,.2f}'};
                        }
                    });
                    Highcharts.chart(chartId, {
                        chart: {
                            zoomType: 'x'
                        },
                        title: {
                            text: 'Overall Balance'
                        },
                        subtitle: {
                            text: document.ontouchstart === undefined ? 'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
                        },
                        xAxis: {
                            type: 'datetime'
                        },
                        yAxis: {
                            title: {
                                text: 'Overall Balance (RM)'
                            }
                        },
                        legend: {
                            enabled: false
                        },
                        plotOptions: {
                            area: {
                                fillColor: {
                                    linearGradient: {
                                        x1: 0,
                                        y1: 0,
                                        x2: 0,
                                        y2: 1
                                    },
                                    stops: [
                                        [0, Highcharts.getOptions().colors[1]],
                                        [1, Highcharts.color(Highcharts.getOptions().colors[1]).setOpacity(0).get('rgba')]
                                    ]
                                },
                                marker: {
                                    radius: 2
                                },
                                lineWidth: 1,
                                states: {
                                    hover: {
                                        lineWidth: 1
                                    }
                                },
                                threshold: null,
                                tooltip: {
                                    valueDecimals: 2,
                                    valuePrefix: 'RM '
                                }
                            }
                        },
                        series: [{
                            type: 'area',
                            name: 'Balance',
                            data: data
                        }],
                        credits: {
                            enabled: false
                        }
                    });
                } else {
                    throw new Error(_ALERT_MSG_ERROR_DEFAULT);
                }
            },
            error: function () {
                throw new Error(_ALERT_MSG_ERROR_DEFAULT);
            }
        });
    };

    this.generateChartMonthlyProfit = function (chartId) {
        /*$.ajax({
            url: 'account/allList',
            type: 'GET', headers: {'Authorization': 'Bearer ' + sessionStorage.getItem('token')},
            dataType: 'json', async: true,
            success: function (resp) {
                if (resp.success) {
                    let data = [];
                    $.each(resp.result, function (no, row) {
                        console.log(row);
                        const unixTime = new Date(row['ballDate'].replace(' ', 'T')).getTime();
                        console.log(unixTime);
                        data.push([unixTime, parseFloat(row['ballBalance'])]);
                    });*/
                    Highcharts.chart(chartId, {
                        chart: {
                            type: 'line'
                        },
                        title: {
                            text: 'Monthly Sales'
                        },
                        subtitle: {
                            text: 'Overall Monthly Sales and Profit'
                        },
                        xAxis: {
                            categories: ['Nov 2019', 'Dec 2019', 'Jan 2020', 'Feb 2020', 'Mar 2020', 'Apr 2020', 'May 2020', 'Jun 2020', 'Jul 2020', 'Aug 2020', 'Sept 2020']
                        },
                        yAxis: {
                            title: {
                                text: 'Profit and Sales (RM)'
                            }
                        },
                        plotOptions: {
                            line: {
                                dataLabels: {
                                    enabled: false
                                }
                            }
                        },
                        series: [
                            {
                                name: 'Sales (RM)',
                                data: [1240.12, 231.54, 322.22, 320.11, 435.23, 544.65, 675.45, 655.55, 765.43, 877.54, {y: 1865.33, dataLabels: {enabled: true}}]
                            },
                            {
                                name: 'Profit (RM)',
                                data: [3140.12, 142.22, 164.44, 120.11, 235.23, 344.65, 375.45, 455.55, 465.43, 577.54, {y: 1565.33, dataLabels: {enabled: true}}]
                            }
                        ],
                        credits: {
                            enabled: false
                        }
                    });
                /*} else {
                    throw new Error(_ALERT_MSG_ERROR_DEFAULT);
                }
            },
            error: function () {
                throw new Error(_ALERT_MSG_ERROR_DEFAULT);
            }
        });*/
    };

    this.getClassName = function () {
        return className;
    };

    this.setModalAddActivityClass = function (_modalAddActivityClass) {
        modalAddActivityClass = _modalAddActivityClass;
    };
}