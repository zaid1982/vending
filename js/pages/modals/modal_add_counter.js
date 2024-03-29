function ModalAddCounter() {

    const className = 'ModalAddCounter';
    let self = this;
    let classFrom;
    let sectionFrom;
    let refSite;
    let refMachine;

    this.init = function () {
        mzOption('optMcaSiteId', refSite, 'Select Site', 'siteId', 'siteName');

        $('#optMcaSiteId').on('change', function () {
            if ($(this).val() === '') {
                mzOptionStopClear('optMcaMachineId', 'Select Machine');
            } else {
                mzOptionStop('optMcaMachineId', refMachine, 'Select Machine', 'machineId', 'machineName', {siteId:parseInt($(this).val())});
            }
        });

        const vDataMca = [
            {
                field_id: 'optMcaSiteId',
                type: 'select',
                name: 'Site',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'optMcaMachineId',
                type: 'select',
                name: 'Machine',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'txtMcaDate',
                type: 'text',
                name: 'Date',
                validator: {
                    notEmpty: true
                }
            }
        ];

        let formValidate = new MzValidate('formMca');
        formValidate.registerFields(vDataMca);

        $('#modal_add_counter').on('hidden.bs.modal', function(){
            mzOptionStopClear('optMcaMachineId', 'Select Machine');
            formValidate.clearValidation();
        });

        $('#btnMcaSubmit').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    if (!formValidate.validateNow()) {
                        toastr['error'](_ALERT_MSG_VALIDATION, _ALERT_TITLE_ERROR);
                    }
                    else {
                        const data = {
                            siteId: $('#optMcaSiteId').val(),
                            machineId: $('#optMcaMachineId').val(),
                            bslsDate: mzConvertDate($('#txtMcaDate').val())
                        };
                        const bslsId = mzAjaxRequest('sales', 'POST', data);
                        if (classFrom.getClassName() === 'MainSales') {
                            classFrom.genTableAsl();
                            sectionFrom.refreshItemCards(bslsId, '2020-05-06', $('#optMcaMachineId').val(), $('#optMcaSiteId').val(), 5);
                        }
                        $('#modal_add_counter').modal('hide');
                    }
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 200);
        });
    };

    this.add = function () {
        ShowLoader();
        setTimeout(function () {
            try {
                const date = new Date();
                mzSetFieldValue('McaDate', date.getFullYear()+'/'+(date.getMonth() + 1)+'/'+date.getDate(), 'date');
                $('#modal_add_counter').modal({backdrop: 'static', keyboard: false});
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

    this.setSectionFrom = function (_sectionFrom) {
        sectionFrom = _sectionFrom;
    };

    this.setRefSite = function (_refSite) {
        refSite = _refSite;
    };

    this.setRefMachine = function (_refMachine) {
        refMachine = _refMachine;
    };
}