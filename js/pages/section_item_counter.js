function SectionItemCounter() {

    const className = 'SectionItemCounter';
    let self = this;
    let refBrand;
    let refSite;
    let refMachine;
    let machineId;
    let counterDate;
    let formValidate = [];

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
            $('#txtItcTotalSold'+slotId).val(sold);
            $('#txtItcTotalProfit'+slotId).val(profit.toFixed(2));
        });
    };

    this.getClassName = function () {
        return className;
    };

    this.generateItemCards = function () {
        for (let i=0; i<70; i++) {
            const slotNo = i+1;
            let htmlStr = '<div class="col-md-4 col-lg-3 divItcSlot" id="divItcSlot'+i+'">\n' +
                '            <div class="card mb-4">\n' +
                '                <div class="p-3">\n' +
                '                    <!-- Title -->\n' +
                '                    <h4 class="card-title font-weight-bold mb-2">Slot '+slotNo+'\n' +
                '                        <a href="#!" class="text-black-50">\n' +
                '                            <i class="fas fa-edit pr-2 float-right"></i>\n' +
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
                '                                <select id="optItcBrand'+i+'" class="mdb-select md-form colorful-select dropdown-info mt-0 mb-0" searchable="Search here">\n' +
                '                                </select>\n' +
                '                                <label for="optItcBrand'+i+'" id="optItcBrand'+i+'">Brand</label>\n' +
                '                                <p class="font-small text-danger" id="optItcBrand'+i+'Err"></p>\n' +
                '                            </div>\n' +
                '                            <div class="col-6">\n' +
                '                                <div class="md-form mt-0 mb-0">\n' +
                '                                    <input type="number" id="txtItcCost'+i+'" class="form-control" value="1.30" disabled>\n' +
                '                                    <label for="txtItcCost'+i+'" id="lblItcCost'+i+'" class="active">Cost</label>\n' +
                '                                    <p class="font-small text-danger" id="txtItcCost'+i+'Err"></p>\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '                            <div class="col-6">\n' +
                '                                <div class="md-form mt-0 mb-0">\n' +
                '                                    <input type="number" id="txtItcPrice'+i+'" class="form-control" value="2.30" disabled>\n' +
                '                                    <label for="txtItcPrice'+i+'" id="lblItcPrice'+i+'" class="active">Price</label>\n' +
                '                                    <p class="font-small text-danger" id="txtItcPrice'+i+'Err"></p>\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '                            <div class="col-6">\n' +
                '                                <div class="md-form mt-0 mb-0">\n' +
                '                                    <input type="number" id="txtItcInitialReading'+i+'" class="form-control" value="1320" disabled>\n' +
                '                                    <label for="txtItcInitialReading'+i+'" id="lblItcInitialReading'+i+'" class="active">Initial</label>\n' +
                '                                    <p class="font-small text-danger" id="txtItcInitialReading'+i+'Err"></p>\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '                            <div class="col-6">\n' +
                '                                <div class="md-form mt-0 mb-0">\n' +
                '                                    <input type="number" id="txtItcCurrentReading'+i+'" class="form-control txtItcCurrentReading" value="1320">\n' +
                '                                    <label for="txtItcCurrentReading'+i+'" id="lblItcCurrentReading'+i+'" class="active">Current</label>\n' +
                '                                    <p class="font-small text-danger" id="txtItcCurrentReading'+i+'Err"></p>\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '                            <div class="col-6">\n' +
                '                                <div class="md-form mt-0 mb-0">\n' +
                '                                    <input type="text" id="txtItcTotalSold'+i+'" class="form-control" value="12" disabled>\n' +
                '                                    <label for="txtItcTotalSold'+i+'" id="lblItcTotalSold'+i+'" class="active">Total Sold</label>\n' +
                '                                    <p class="font-small text-danger" id="txtItcTotalSold'+i+'Err"></p>\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '                            <div class="col-6">\n' +
                '                                <div class="md-form mt-0 mb-0">\n' +
                '                                    <input type="text" id="txtItcTotalProfit'+i+'" class="form-control" value="12" disabled>\n' +
                '                                    <label for="txtItcTotalProfit'+i+'" id="lblItcTotalProfit'+i+'" class="active">Total Profit</label>\n' +
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
    };

    this.refreshItemCards = function (_counterDate, _machineId, _siteId) {
        ShowLoader();
        setTimeout(function () {
            try {
                mzCheckFuncParam([_counterDate, _machineId, _siteId]);
                machineId = _machineId;
                counterDate = _counterDate;

                for (let i=0; i<70; i++) {
                    formValidate[i].clearValidation();
                }

                $('#lblItcDate').html(counterDate);
                $('#lblItcSiteName').html(refSite[_siteId]['siteName']);
                $('#lblItcMachineName').html(refMachine[machineId]['machineName']);

                const dataAPI = mzAjaxRequest('counter.php?machineId=' + machineId + '&counterDate=' + counterDate, 'GET');
                $('#sectionItcCounter').show();
                $('.divItcSlot').hide();
                for (let i = 0; i < dataAPI.length; i++) {
                    $('#lblItcSlotInfo'+i).html(dataAPI[i]['slotType']+' Slot, Column '+dataAPI[i]['slotColumn']+':'+dataAPI[i]['slotRow']);
                    $('#imgItcSlot'+i).attr('src', 'img/brand/brand_'+dataAPI[i]['brandId']+'.jpg');
                    const cost = parseFloat(dataAPI[i]['counterCost']);
                    const price = parseFloat(dataAPI[i]['counterPrice']);
                    const sold = parseInt(dataAPI[i]['counterCanSold']);
                    const profit = sold*(price-cost);
                    mzSetFieldValue('ItcBrand'+i, dataAPI[i]['brandId'], 'select', 'Brand');
                    mzSetFieldValue('ItcCost'+i, cost, 'text');
                    mzSetFieldValue('ItcPrice'+i, price, 'text');
                    mzSetFieldValue('ItcInitialReading'+i, dataAPI[i]['counterBalanceInitial'], 'text');
                    mzSetFieldValue('ItcCurrentReading'+i, dataAPI[i]['counterBalanceFinal'], 'text');
                    mzSetFieldValue('ItcTotalSold'+i, sold, 'text');
                    mzSetFieldValue('ItcTotalProfit'+i, profit.toFixed(2), 'text');
                    $('#divItcSlot'+i).show();
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