function MainSales() {

    const className = 'MainClient';
    let self = this;
    let oTableSales;
    let refSite;
    let refMachine;

    this.init = function () {
        oTableSales =  $('#dtAslList').DataTable({
            bLengthChange: false,
            bFilter: true,
            "aaSorting": [2, 'desc'],
            fnRowCallback : function(nRow, aData, iDisplayIndex){
                const info = oTableSales.page.info();
                $('td', nRow).eq(0).html(info.page * info.length + (iDisplayIndex + 1));
            },
            drawCallback: function () {
                $('[data-toggle="tooltip"]').tooltip();
                $('.lnkAslListEdit').off('click').on('click', function () {
                    const linkId = $(this).attr('id');
                    const linkIndex = linkId.indexOf('_');
                    if (linkIndex > 0) {
                        const rowId = linkId.substr(linkIndex+1);
                        const currentRow = oTableSales.row(parseInt(rowId)).data();
                        //modalClientClass.edit(currentRow['clientId'], rowId);
                    }
                });
            },
            language: _DATATABLE_LANGUAGE,
            aoColumns:
                [
                    {mData: null, bSortable: false},
                    {mData: null, bSortable: false, sClass: 'text-center',
                        mRender: function (data, type, row, meta) {
                            return '<a><i class="fas fa-edit lnkAslListEdit" id="lnkAslListEdit_' + meta.row + '" data-toggle="tooltip" data-placement="top" title="Edit"></i></a>&nbsp;&nbsp;';
                        }
                    },
                    {mData: 'bslsDate'},
                    {mData: null, mRender: function (data, type, row){
                            return row['siteId'] !== '' ? refSite[row['siteId']]['siteName'] : '';
                        }},
                    {mData: null, mRender: function (data, type, row){
                            return row['machineId'] !== '' ? refMachine[row['machineId']]['machineName'] : '';
                        }},
                    {mData: 'bslsCanSold', bSortable: false, sClass: 'text-right'},
                    {mData: 'bslsStockCost', bSortable: false, sClass: 'text-right'},
                    {mData: 'bslsProfitTarget', bSortable: false, sClass: 'text-right'},
                    {mData: 'bslsCollection', bSortable: false, sClass: 'text-right'},
                    {mData: 'bslsProfitActual', bSortable: false, sClass: 'text-right',
                        mRender: function (data) {
                            return '<h6><span class="badge badge-pill default-color z-depth-2">'+data+'</span></h6>';
                        }
                    },
                    {mData: 'bslsProfitDiff', bSortable: false, sClass: 'text-right',
                        mRender: function (data) {
                            const badgeColor = parseInt(data) < 0 ? 'red' : 'green';
                            return '<h6><span class="badge badge-pill '+badgeColor+' z-depth-2">'+data+'</span></h6>';
                        }
                    },
                    {mData: 'bslsId', visible: false}
                ]
            });
        $("#dtAslList_filter").hide();
        $('#txtAslListSearch').on('keyup change', function () {
            oTableSales.search($(this).val()).draw();
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
        self.genTableAsl();
    };

    this.genTableAsl = function () {
        const dataSales = mzAjaxRequest('sales.php', 'GET');
        oTableSales.clear().rows.add(dataSales).draw();
    };

    this.getClassName = function () {
        return className;
    };

    this.setRefSite = function (_refSite) {
        refSite = _refSite;
    };

    this.setRefMachine = function (_refMachine) {
        refMachine = _refMachine;
    };
}