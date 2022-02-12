function MainSummary11armorClass() {

    const className = 'MainSummary11armorClass';
    let self = this;
    let oTableSales;
    let dataSummary;

    this.init = function () {
        oTableSales =  $('#dtSgaList').DataTable({
            bLengthChange: false,
            bFilter: false,
            language: _DATATABLE_LANGUAGE,
            bInfo: false,
            bPaginate: false,
            ordering: false,
            autoWidth: false,
            aoColumns:
                [ //mzFormatNumber(num, fix)
                    {mData: 'Year', width: '6%', sClass: 'text-center'},
                    {mData: 'Month'},
                    {mData: 'Akademik', width: '8%', sClass: 'text-right', mRender: function (data){ return mzFormatNumber(data, 2);}},
                    {mData: 'HQ', width: '8%', sClass: 'text-right', mRender: function (data){ return mzFormatNumber(data, 2);}},
                    {mData: 'Penginapan A', width: '8%', sClass: 'text-right', mRender: function (data){ return mzFormatNumber(data, 2);}},
                    {mData: 'Penginapan C', width: '8%', sClass: 'text-right', mRender: function (data){ return mzFormatNumber(data, 2);}},
                    {mData: 'Penginapan HQ', width: '8%', sClass: 'text-right', mRender: function (data){ return mzFormatNumber(data, 2);}},
                    {mData: 'Penuntut', width: '8%', sClass: 'text-right', mRender: function (data){ return mzFormatNumber(data, 2);}},
                    {mData: 'Pejabat', width: '8%', sClass: 'text-right', mRender: function (data){ return mzFormatNumber(data, 2);}},
                    {mData: 'Workshop', width: '8%', sClass: 'text-right', mRender: function (data){ return mzFormatNumber(data, 2);}},
                    {mData: 'MT', width: '8%', sClass: 'text-right', mRender: function (data){ return mzFormatNumber(data, 2);}},
                    {mData: 'Total Profit', width: '8%', sClass: 'text-right', mRender: function (data){ return '<strong>'+mzFormatNumber(data, 2)+'</strong>';}},
                    {mData: 'Average', width: '8%', sClass: 'text-right', mRender: function (data){ return '<strong>'+mzFormatNumber(data, 2)+'</strong>';}}
                ]
            });
        $("#dtSgaList_filter").hide();
        $('#dtSgaList tbody').delegate('tr', 'mouseenter', function (evt) {
            const $cell = $(evt.target).closest('td');
            if ($cell.index() < 8) {
                $cell.css( 'cursor', 'pointer' );
            }
        });

        self.genTableSga();
        self.generateChartGrouped('chartSgaGrouped');
    };

    this.genTableSga = function () {
        dataSummary = mzAjaxRequest('sales/summary_11armor', 'GET');
        oTableSales.clear().rows.add(dataSummary).draw();
    };

    this.getClassName = function () {
        return className;
    };

    this.generateChartGrouped = function (chartId) {
        let categories = [];
        let seriesData = [
            { name: 'Akademik', data: [] },
            { name: 'HQ', data: [] },
            { name: 'Penginapan A', data: [] },
            { name: 'Penginapan C', data: [] },
            { name: 'Penginapan HQ', data: [] },
            { name: 'Penuntut', data: [] },
            { name: 'Pejabat', data: [] },
            { name: 'Workshop', data: [] },
            { name: 'MT', data: [] }
        ];
        for (let i = dataSummary.length - 1; i >= 0; i--) {
            const data = dataSummary[i];
            categories.push(data['Year'] + ' ' + data['Month']);
            seriesData[0]['data'].push(parseInt(data['Akademik']));
            seriesData[1]['data'].push(parseInt(data['HQ']));
            seriesData[2]['data'].push(parseInt(data['Penginapan A']));
            seriesData[3]['data'].push(parseInt(data['Penginapan C']));
            seriesData[4]['data'].push(parseInt(data['Penginapan HQ']));
            seriesData[5]['data'].push(parseInt(data['Penuntut']));
            seriesData[6]['data'].push(parseInt(data['Pejabat']));
            seriesData[7]['data'].push(parseInt(data['Workshop']));
            seriesData[8]['data'].push(parseInt(data['MT']));
        }
        Highcharts.chart(chartId, {
            chart: {
                type: 'column',
                zoomType: 'x'
            },
            title: {
                text: 'Monthly Profit'
            },
            subtitle: {
                text: 'KOR ARMOR ke 11'
            },
            xAxis: {
                categories: categories,
                crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Total Profit (RM)'
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y}</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    stacking: 'normal',
                    groupPadding: 0.05,
                    borderWidth: 0
                }
            },
            series: seriesData,
            credits: {
                enabled: false
            }
        });
    };
}