function MainHome() {

    const className = 'MainHome';
    let self = this;
    let modalAddActivityClass;

    this.init = function () {
        self.generateChartAll();
    };

    this.generateChartAll = function () {
        $.ajax({
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
                    });
                    Highcharts.chart('chartHmeAll', {
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
                                threshold: null
                            }
                        },
                        series: [{
                            type: 'area',
                            name: 'Balance (RM)',
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

    this.getClassName = function () {
        return className;
    };

    this.setModalAddActivityClass = function (_modalAddActivityClass) {
        modalAddActivityClass = _modalAddActivityClass;
    };
}