function MainSales() {

    const className = 'MainSales';
    let self = this;
    let oTableSales;
    let refStatus;
    let refSite;
    let refMachine;
    let sectionItemCounterClass;
    let modalAddCounterClass;

    this.init = function () {
        mzOption('optMaaAslFilterMachine', refMachine, 'All Machine', 'machineId', 'machineName');

        oTableSales =  $('#dtAslList').DataTable({
            bLengthChange: false,
            bFilter: true,
            "aaSorting": [1, 'desc'],
            fnRowCallback : function(nRow, aData, iDisplayIndex){
                const info = oTableSales.page.info();
                $('td', nRow).eq(0).html(info.page * info.length + (iDisplayIndex + 1));
            },
            drawCallback: function () {
                $('[data-toggle="tooltip"]').tooltip();
            },
            language: _DATATABLE_LANGUAGE,
            aoColumns:
                [
                    {mData: null, bSortable: false},
                    {mData: 'bslsDate', bSortable: false},
                    {mData: null, bSortable: false, mRender: function (data, type, row){
                            return row['siteId'] !== '' ? refSite[row['siteId']]['siteName'] : '';
                        }},
                    {mData: null, bSortable: false, mRender: function (data, type, row){
                            return row['machineId'] !== '' ? refMachine[row['machineId']]['machineName'] : '';
                        }},
                    {mData: 'bslsCanSold', bSortable: false, sClass: 'text-right'},
                    {mData: 'bslsStockCost', bSortable: false, sClass: 'text-right'},
                    {mData: 'bslsCollection', bSortable: false, sClass: 'text-right'},
                    {mData: 'bslsProfitActual', bSortable: false, sClass: 'text-right',
                        mRender: function (data) {
                            let badgeColor = 'lighten-1';
                            let profit = parseFloat(data);
                            if (profit >= 600) {
                                badgeColor = 'darken-5';
                            } else if (profit >= 500) {
                                badgeColor = 'darken-4';
                            } else if (profit >= 400) {
                                badgeColor = 'darken-3';
                            } else if (profit >= 300) {
                                badgeColor = 'darken-2';
                            } else if (profit >= 200) {
                                badgeColor = 'darken-1';
                            } else if (profit >= 100) {
                                badgeColor = '';
                            }
                            return '<h6><span class="badge badge-pill green '+badgeColor+' z-depth-2">'+data+'</span></h6>';
                        }
                    },
                    {mData: 'bslsId', visible: false},
                    {mData: 'machineId', visible: false}
                ]
            });
        $("#dtAslList_filter").hide();
        $('#txtAslListSearch').on('keyup change', function () {
            oTableSales.search($(this).val()).draw();
        });
        $('#dtAslList tbody').delegate('tr', 'click', function (evt) {
            const data = oTableSales.row( this ).data();
            const $cell = $(evt.target).closest('td');
            if ($cell.index() < 8) {
                sectionItemCounterClass.refreshItemCards(data['bslsId'], data['bslsDate'], data['machineId'], data['siteId'], data['bslsStatus']);
            }
        });
        $('#dtAslList tbody').delegate('tr', 'mouseenter', function (evt) {
            const $cell = $(evt.target).closest('td');
            if ($cell.index() < 8) {
                $cell.css( 'cursor', 'pointer' );
            }
        });
        $('#optMaaAslFilterMachine').on('change', function () {
            oTableSales.column(9).search($(this).val(), false, true, false).draw();
        });

        $('#btnDtAslListRefresh').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    self.genTableAsl();
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 300);
        });

        $('#btnDtAslListAdd').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    modalAddCounterClass.add();
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 200);
        });

        self.genTableAsl();
    };

    this.genTableAsl = function () {
        const dataAPI = mzAjaxRequest('sales', 'GET');
        oTableSales.clear().rows.add(dataAPI).draw();
    };

    this.getClassName = function () {
        return className;
    };

    this.setRefStatus = function (_refStatus) {
        refStatus = _refStatus;
    };

    this.setRefSite = function (_refSite) {
        refSite = _refSite;
    };

    this.setRefMachine = function (_refMachine) {
        refMachine = _refMachine;
    };

    this.setSectionItemCounterClass = function (_sectionItemCounterClass) {
        sectionItemCounterClass = _sectionItemCounterClass;
    };

    this.setModalAddCounterClass = function (_modalAddCounterClass) {
        modalAddCounterClass = _modalAddCounterClass;
    };
}