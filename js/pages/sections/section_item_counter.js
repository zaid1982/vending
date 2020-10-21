function SectionItemCounter() {

    const className = 'SectionItemCounter';
    let self = this;
    let classFrom;
    let bslsId;
    let refBrand;
    let refSite;
    let refMachine;
    let machineId;
    let counterDate;
    let bslsStatus;
    let formValidate = [];
    let dataCounter = [];

    this.init = function () {
        $('#sectionItcCounter').hide();
        self.generateItemCards();

        for (let i=0; i<70; i++) {
            const vDataItc = [
                {
                    field_id: 'optItcBrand'+i,
                    type: 'select',
                    name: 'Brand',
                    validator: {
                        notEmpty: true
                    }
                },
                {
                    field_id: 'txtItcPrice'+i,
                    type: 'text',
                    name: 'Price',
                    validator: {
                        notEmpty: true,
                        numeric: true,
                        min: 0,
                        max: 8
                    }
                },
                {
                    field_id: 'txtItcCurrentReading'+i,
                    type: 'text',
                    name: 'Current',
                    validator: {
                        notEmpty: true,
                        numeric: true,
                        min: -100000,
                        max: 100000
                    }
                }
            ];

            formValidate[i] = new MzValidate('formItc'+i);
            formValidate[i].registerFields(vDataItc);
        }

        $('.txtItcCurrentReading').on('keyup change', function () {
            const fieldId = $(this).attr('id');
            const slotId = fieldId.substr(20);
            const initialReading = parseInt($('#txtItcInitialReading'+slotId).val());
            const cost = parseFloat($('#txtItcCost'+slotId).val());
            const price = parseFloat($('#txtItcPrice'+slotId).val());
            const sold = parseInt($(this).val())-initialReading;
            const profit = sold*(price-cost);
            mzSetFieldValue('ItcTotalSold'+slotId, sold, 'text');
            mzSetFieldValue('ItcTotalProfit'+slotId, profit.toFixed(2), 'text');
        });

        $('.aItcEdit').off('click').on('click', function () {
            const linkId = $(this).attr('id');
            const id = linkId.substr(8);
            if ($(this).hasClass('fa-edit')) {
                mzDisableSelect('optItcBrand'+id, false);
                formValidate[id].enableField('txtItcPrice'+id);
                $('#txtItcPrice'+id).prop('disabled', false);
                $(this).removeClass('fa-edit').addClass('fa-check-square');
            } else {
                mzDisableSelect('optItcBrand'+id, true);
                formValidate[id].disableField('txtItcPrice'+id);
                $('#txtItcPrice'+id).prop('disabled', true);
                $(this).removeClass('fa-check-square').addClass('fa-edit');
            }
        });

        $('.optItcBrand').on('change', function () {
            const fieldId = $(this).attr('id');
            const slotId = fieldId.substr(11);
            const sold = parseInt($('#txtItcTotalSold'+slotId).val());
            const price = parseFloat($('#txtItcPrice'+slotId).val());
            const cost = refBrand[parseInt($(this).val())]['brandCostUnit'];
            const profit = sold*(price-cost);
            $('#imgItcSlot'+slotId).attr('src', 'img/brand/brand_'+$(this).val()+'.jpg');
            mzSetFieldValue('ItcCost'+slotId, cost, 'text');
            mzSetFieldValue('ItcTotalProfit'+slotId, profit.toFixed(2), 'text');
        });

        $('.txtItcPrice').on('keyup change', function () {
            const fieldId = $(this).attr('id');
            const slotId = fieldId.substr(11);
            const sold = parseInt($('#txtItcTotalSold'+slotId).val());
            const price = parseFloat($(this).val());
            const cost = parseFloat($('#txtItcCost'+slotId).val());
            const profit = sold*(price-cost);
            mzSetFieldValue('ItcTotalProfit'+slotId, profit.toFixed(2), 'text');
        });

        $('#btnItcSubmit').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    let isValid = true;
                    for (let i = 0; i < dataCounter.length; i++) {
                        if (!formValidate[i].validateNow()) {
                            toastr['error'](_ALERT_MSG_VALIDATION, _ALERT_TITLE_ERROR);
                            isValid = false;
                            break;
                        }
                    }
                    if (isValid) {
                        for (let i = 0; i < dataCounter.length; i++) {
                            dataCounter[i]['brandId'] = $('#optItcBrand'+i).val();
                            dataCounter[i]['counterCost'] = $('#txtItcCost'+i).val();
                            dataCounter[i]['counterPrice'] = $('#txtItcPrice'+i).val();
                            dataCounter[i]['counterCanSold'] = $('#txtItcTotalSold'+i).val();
                            dataCounter[i]['counterBalanceFinal'] = $('#txtItcCurrentReading'+i).val();
                        }
                        let data = {
                            bslsId: bslsId,
                            machineId: machineId,
                            salesTime: $('#txtItcTime').val(),
                            dataCounter: dataCounter
                        };
                        mzAjaxRequest('counter/saveDataSlots', 'PUT', data);
                        if (classFrom.getClassName() === 'MainSales') {
                            classFrom.genTableAsl();
                            $('#sectionItcCounter').hide();
                        }
                    }
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 200);
        });
    };

    this.getClassName = function () {
        return className;
    };

    this.generateItemCards = function () {
        for (let i=0; i<70; i++) {
            let htmlStr = '<div class="col-md-4 col-lg-3 divItcSlot" id="divItcSlot'+i+'">\n' +
                '            <div class="card mb-4">\n' +
                '                <div class="p-3">\n' +
                '                    <!-- Title -->\n' +
                '                    <h4 class="card-title font-weight-bold mb-2">Slot <span id="lblItcSlotNo'+i+'"></span>\n' +
                '                        <a href="#!" class="text-black-50">\n' +
                '                            <i class="fas fa-edit pr-2 float-right aItcEdit" id="aItcEdit'+i+'"></i>\n' +
                '                        </a>\n' +
                '                    </h4>\n' +
                '                    <!-- Subtitle -->\n' +
                '                    <p class="card-text"><i class="fas fa-info-circle pr-2"></i><span id="lblItcSlotInfo'+i+'"></span></p>\n' +
                '                </div>\n' +
                '                <div class="view overlay">\n' +
                '                    <img class="card-img-top rounded-0" id="imgItcSlot'+i+'" src="img/brand/brand_1.jpg" style="max-height: 100px; object-fit: contain">\n' +
                '                    <a href="#!">\n' +
                '                        <div class="mask rgba-white-slight"></div>\n' +
                '                    </a>\n' +
                '                </div>\n' +
                '                <div class="card-body pb-3">\n' +
                '                    <form id="formItc'+i+'">\n' +
                '                        <div class="row">\n' +
                '                            <div class="col-md-12">\n' +
                '                                <select id="optItcBrand'+i+'" class="mdb-select md-form colorful-select dropdown-info mt-0 mb-0 optItcBrand" searchable="Search here">\n' +
                '                                </select>\n' +
                '                                <label for="optItcBrand'+i+'" id="optItcBrand'+i+'">Brand</label>\n' +
                '                                <p class="font-small text-danger" id="optItcBrand'+i+'Err"></p>\n' +
                '                            </div>\n' +
                '                            <div class="col-6">\n' +
                '                                <div class="md-form mt-0 mb-0">\n' +
                '                                    <input type="number" id="txtItcCost'+i+'" class="form-control" disabled>\n' +
                '                                    <label for="txtItcCost'+i+'" id="lblItcCost'+i+'" class="active">Cost (RM)</label>\n' +
                '                                    <p class="font-small text-danger" id="txtItcCost'+i+'Err"></p>\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '                            <div class="col-6">\n' +
                '                                <div class="md-form mt-0 mb-0">\n' +
                '                                    <input type="number" id="txtItcPrice'+i+'" class="form-control txtItcPrice" step="0.1" disabled>\n' +
                '                                    <label for="txtItcPrice'+i+'" id="lblItcPrice'+i+'" class="active">Price (RM)</label>\n' +
                '                                    <p class="font-small text-danger" id="txtItcPrice'+i+'Err"></p>\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '                            <div class="col-6">\n' +
                '                                <div class="md-form mt-0 mb-0">\n' +
                '                                    <input type="number" id="txtItcInitialReading'+i+'" class="form-control" disabled>\n' +
                '                                    <label for="txtItcInitialReading'+i+'" id="lblItcInitialReading'+i+'" class="active">Initial</label>\n' +
                '                                    <p class="font-small text-danger" id="txtItcInitialReading'+i+'Err"></p>\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '                            <div class="col-6">\n' +
                '                                <div class="md-form mt-0 mb-0">\n' +
                '                                    <input type="number" id="txtItcCurrentReading'+i+'" class="form-control txtItcCurrentReading">\n' +
                '                                    <label for="txtItcCurrentReading'+i+'" id="lblItcCurrentReading'+i+'" class="active">Current</label>\n' +
                '                                    <p class="font-small text-danger" id="txtItcCurrentReading'+i+'Err"></p>\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '                            <div class="col-6">\n' +
                '                                <div class="md-form mt-0 mb-0">\n' +
                '                                    <input type="text" id="txtItcTotalSold'+i+'" class="form-control" disabled>\n' +
                '                                    <label for="txtItcTotalSold'+i+'" id="lblItcTotalSold'+i+'" class="active">Total Sold</label>\n' +
                '                                    <p class="font-small text-danger" id="txtItcTotalSold'+i+'Err"></p>\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '                            <div class="col-6">\n' +
                '                                <div class="md-form mt-0 mb-0">\n' +
                '                                    <input type="text" id="txtItcTotalProfit'+i+'" class="form-control" disabled>\n' +
                '                                    <label for="txtItcTotalProfit'+i+'" id="lblItcTotalProfit'+i+'" class="active">Total Profit (RM)</label>\n' +
                '                                    <p class="font-small text-danger" id="txtItcTotalProfit'+i+'Err"></p>\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '                        </div>\n' +
                '<!--                        <button id="btnItcSave1" class="btn btn-info waves-effect float-right"><i class="far fa-save ml-1"></i>&nbsp;&nbsp;Save</button>-->\n' +
                '                    </form>\n' +
                '                </div>\n' +
                '            </div>\n' +
                '        </div>';
            $('#divItcItems').append(htmlStr);
            mzOption('optItcBrand'+i, refBrand, 'Select Brand', 'brandId', 'brandName');
        }
        $('#divItcItems').append('<div class="col-md-4 col-lg-3 pl-2 pr-3">\n' +
            '<button id="btnItcSubmit" class="btn btn-default waves-effect btn-lg btn-block"><i class="far fa-save ml-1"></i>&nbsp;&nbsp;Submit</button>\n' +
            '</div>');
    };

    this.refreshItemCards = function (_bslsId, _counterDate, _machineId, _siteId, _bslsStatus) {
        ShowLoader();
        setTimeout(function () {
            try {
                mzCheckFuncParam([_bslsId, _counterDate, _machineId, _siteId, _bslsStatus]);
                bslsId = _bslsId;
                machineId = _machineId;
                counterDate = _counterDate;
                bslsStatus = _bslsStatus;

                for (let i=0; i<70; i++) {
                    formValidate[i].clearValidation();
                }

                $('#lblItcDate').html(counterDate);
                $('#lblItcSiteName').html(refSite[_siteId]['siteName']);
                $('#lblItcMachineName').html(refMachine[machineId]['machineName']);

                dataCounter = mzAjaxRequest('counter/' + bslsId, 'GET');
                $('#sectionItcCounter').show();
                $('.divItcSlot').hide();
                for (let i = 0; i < dataCounter.length; i++) {
                    $('#lblItcSlotNo'+i).html(dataCounter[i]['counterSlotNo']);
                    $('#lblItcSlotInfo'+i).html(dataCounter[i]['slotType']+' Slot, Column '+dataCounter[i]['slotColumn']+':'+dataCounter[i]['slotRow']);
                    $('#imgItcSlot'+i).attr('src', 'img/brand/brand_'+dataCounter[i]['brandId']+'.jpg');
                    //$('#imgItcSlot'+i).attr('src', 'data:image/jpeg;charset=utf-8;base64, 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');
                    const cost = parseFloat(dataCounter[i]['counterCost']);
                    const price = parseFloat(dataCounter[i]['counterPrice']);
                    const sold = parseInt(dataCounter[i]['counterCanSold']);
                    const profit = sold*(price-cost);
                    mzSetFieldValue('ItcBrand'+i, dataCounter[i]['brandId'], 'select', 'Brand');
                    mzSetFieldValue('ItcCost'+i, cost.toFixed(2), 'text');
                    mzSetFieldValue('ItcPrice'+i, price.toFixed(2), 'text');
                    mzSetFieldValue('ItcInitialReading'+i, dataCounter[i]['counterBalanceInitial'], 'text');
                    mzSetFieldValue('ItcCurrentReading'+i, dataCounter[i]['counterBalanceFinal'], 'text');
                    mzSetFieldValue('ItcTotalSold'+i, sold, 'text');
                    mzSetFieldValue('ItcTotalProfit'+i, profit.toFixed(2), 'text');
                    mzDisableSelect('optItcBrand'+i, true);
                    formValidate[i].disableField('txtItcPrice'+i);
                    $('#txtItcPrice'+i).prop('disabled', true);
                    $('#divItcSlot'+i).show();
                    if (bslsStatus === '5') {
                        formValidate[i].enableField('txtItcCurrentReading'+i);
                        $('#txtItcCurrentReading'+i).prop('disabled', false);
                        $('.aItcEdit').show();
                    } else {
                        formValidate[i].disableField('txtItcCurrentReading'+i);
                        $('#txtItcCurrentReading'+i).prop('disabled', true);
                        $('.aItcEdit').hide();
                    }
                }

                if (bslsStatus === '5') {
                    $('#btnItcSubmit').show();
                } else {
                    $('#btnItcSubmit').hide();
                }
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 200);
    };

    this.getClassName = function () {
        return className;
    };

    this.setClassFrom = function (_classFrom) {
        classFrom = _classFrom;
    };

    this.setRefBrand = function (_refBrand) {
        refBrand = _refBrand;
    };

    this.setRefSite = function (_refSite) {
        refSite = _refSite;
    };

    this.setRefMachine = function (_refMachine) {
        refMachine = _refMachine;
    };
}