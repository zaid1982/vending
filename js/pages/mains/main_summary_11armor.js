function MainSummary11armorClass() {

    const className = 'MainSummary11armorClass';
    let self = this;
    let oTableSales;

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
                    {mData: 'Penginapan Workshop', width: '8%', sClass: 'text-right', mRender: function (data){ return mzFormatNumber(data, 2);}},
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
    };

    this.genTableSga = function () {
        const dataAPI = mzAjaxRequest('sales/summary_11armor', 'GET');
        oTableSales.clear().rows.add(dataAPI).draw();
    };

    this.getClassName = function () {
        return className;
    };
}