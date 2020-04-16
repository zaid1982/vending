function SectionItemCounter() {

    const className = 'SectionItemCounter';
    let self = this;
    let refBrand;

    this.init = function () {
        self.generateItemCards();
    };

    this.getClassName = function () {
        return className;
    };

    this.generateItemCards = function () {
        $('#divItcItems').html('');
        for (let i=0; i<36; i++) {
            const slotNo = i+1;
            let htmlStr = '<div class="col-md-4 col-lg-3">\n' +
                '            <div class="card mb-4">\n' +
                '                <div class="p-3">\n' +
                '                    <!-- Title -->\n' +
                '                    <h4 class="card-title font-weight-bold mb-2">Slot '+slotNo+'\n' +
                '                        <a href="#!" class="text-black-50">\n' +
                '                            <i class="fas fa-edit pr-2 float-right"></i>\n' +
                '                        </a>\n' +
                '                    </h4>\n' +
                '                    <!-- Subtitle -->\n' +
                '                    <p class="card-text"><i class="fas fa-info-circle pr-2"></i>Bottle Slot, Column 1:1</p>\n' +
                '                </div>\n' +
                '                <div class="view overlay">\n' +
                '                    <img class="card-img-top rounded-0" src="img/brand/brand_10.jpg" style="max-height: 80px; object-fit: contain">\n' +
                '                    <a href="#!">\n' +
                '                        <div class="mask rgba-white-slight"></div>\n' +
                '                    </a>\n' +
                '                </div>\n' +
                '                <div class="card-body pb-3">\n' +
                '                    <form id="formItc'+i+'">\n' +
                '                        <div class="row">\n' +
                '                            <div class="col-md-12">\n' +
                '                                <select id="optItcBrand'+i+'" class="mdb-select md-form colorful-select dropdown-info mt-0" searchable="Search here">\n' +
                '                                </select>\n' +
                '                                <label for="optItcBrand'+i+'">Brand</label>\n' +
                '                            </div>\n' +
                '                            <div class="col-6">\n' +
                '                                <div class="md-form mt-0">\n' +
                '                                    <input type="number" id="txtItcCost'+i+'" class="form-control" value="1.30" disabled>\n' +
                '                                    <label for="txtItcCost'+i+'" id="lblItcCost'+i+'" class="active">Cost</label>\n' +
                '                                    <p class="font-small text-danger" id="txtItcCost'+i+'Err"></p>\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '                            <div class="col-6">\n' +
                '                                <div class="md-form mt-0">\n' +
                '                                    <input type="number" id="txtItcPrice'+i+'" class="form-control" value="2.30" disabled>\n' +
                '                                    <label for="txtItcPrice'+i+'" id="lblItcPrice'+i+'" class="active">Price</label>\n' +
                '                                    <p class="font-small text-danger" id="txtItcPrice'+i+'Err"></p>\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '                            <div class="col-12">\n' +
                '                                <div class="md-form mt-0">\n' +
                '                                    <input type="number" id="txtItcInitialReading'+i+'" class="form-control" value="1320" disabled>\n' +
                '                                    <label for="txtItcInitialReading'+i+'" id="lblItcInitialReading'+i+'" class="active">Initial Reading</label>\n' +
                '                                    <p class="font-small text-danger" id="txtItcInitialReading'+i+'Err"></p>\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '                            <div class="col-12">\n' +
                '                                <div class="md-form mt-0">\n' +
                '                                    <input type="number" id="txtItcCurrentReading'+i+'" class="form-control" value="1320">\n' +
                '                                    <label for="txtItcCurrentReading'+i+'" id="lblItcCurrentReading'+i+'" class="active">Current Reading</label>\n' +
                '                                    <p class="font-small text-danger" id="txtItcCurrentReading'+i+'Err"></p>\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '                            <div class="col-12">\n' +
                '                                <div class="md-form mt-0 mb-0">\n' +
                '                                    <input type="text" id="txtItcTotalSold'+i+'" class="form-control" value="12" disabled>\n' +
                '                                    <label for="txtItcTotalSold'+i+'" id="lblItcTotalSold'+i+'" class="active">Total Sold</label>\n' +
                '                                    <p class="font-small text-danger" id="txtItcTotalSold'+i+'Err"></p>\n' +
                '                                </div>\n' +
                '                            </div>\n' +
                '                        </div>\n' +
                '<!--                        <button id="btnItcSave1" class="btn btn-info waves-effect float-right"><i class="far fa-save ml-1"></i>&nbsp;&nbsp;Save</button>-->\n' +
                '                    </form>\n' +
                '                </div>\n' +
                '            </div>\n' +
                '        </div>';
            $('#divItcItems').append(htmlStr);

            mzOption('optItcBrand'+i, refBrand, 'Select Brand', 'brandId', 'brandName', {}, 'required');
        }
    };

    this.getClassName = function () {
        return className;
    };

    this.setRefBrand = function (_refBrand) {
        refBrand = _refBrand;
    };
}