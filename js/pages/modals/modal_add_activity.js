function ModalAddActivity() {

    const className = 'ModalAddActivity';
    let self = this;
    let classFrom;
    let activityType;
    let refSite;
    let refMachine;
    let formValidate;

    this.init = function () {
        mzOption('optMaaSiteId', refSite, 'Select Site', 'siteId', 'siteName');

        $('#optMaaSiteId').on('change', function () {
            if (activityType !== 1) {
                if ($(this).val() === '') {
                    mzOptionStopClear('optMaaMachineId', 'Select Machine');
                } else {
                    mzOptionStop('optMaaMachineId', refMachine, 'Select Machine', 'machineId', 'machineName', {siteId:$(this).val()});
                }
            }
        });

        const vDataMaa = [
            {
                field_id: 'optMaaActivityType',
                type: 'select',
                name: 'Activity Type',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'optMaaSiteId',
                type: 'select',
                name: 'Site',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'optMaaMachineId',
                type: 'select',
                name: 'Machine',
                validator: {
                    notEmpty: true
                }
            },
            {
                field_id: 'txtMaaAmount',
                type: 'text',
                name: 'Amount (RM)',
                validator: {
                    notEmpty: true,
                    numeric: true,
                    min: 0,
                    max: 5000
                }
            },
            {
                field_id: 'txtMaaQuantity',
                type: 'text',
                name: 'Quantity',
                validator: {
                    notEmpty: true,
                    digit: true,
                    min: 1,
                    max: 200
                }
            }
        ];

        formValidate = new MzValidate('formMaa');
        formValidate.registerFields(vDataMaa);

        $('#modal_add_activity').on('hidden.bs.modal', function(){
            mzOptionStopClear('optMaaMachineId', 'Select Machine');
            formValidate.clearValidation();
        });

        $('#btnMaaSubmit').on('click', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    if (!formValidate.validateNow()) {
                        toastr['error'](_ALERT_MSG_VALIDATION, _ALERT_TITLE_ERROR);
                    }
                    else {
                        const data = {
                            siteId: $('#optMaaSiteId').val(),
                            machineId: $('#optMaaMachineId').val(),
                            amount: $('#txtMaaAmount').val(),
                            quantity: $('#txtMaaQuantity').val()
                        };
                        mzAjaxRequest('account/addNewActivity/'+$('#optMaaActivityType').val(), 'POST', data);
                        if (classFrom.getClassName() === 'MainHome') {
                            //classFrom.genTableAsl();
                        }
                        $('#modal_add_activity').modal('hide');
                    }
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 200);
        });

        $('#optMaaActivityType').on('change', function () {
            ShowLoader();
            setTimeout(function () {
                try {
                    activityType = parseInt($('#optMaaActivityType').val());
                    self.setActivityTypeChange();
                } catch (e) {
                    toastr['error'](e.message, _ALERT_TITLE_ERROR);
                }
                HideLoader();
            }, 200);
        });
    };

    this.add = function (_activityType) {
        ShowLoader();
        setTimeout(function () {
            try {
                mzCheckFuncParam([_activityType]);
                activityType = _activityType;
                $('#modal_add_activity').modal({backdrop: 'static', keyboard: false});
                mzSetFieldValue('MaaActivityType', activityType, 'select', 'Activity Type *');
                self.setActivityTypeChange();
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 200);
    };

    this.setActivityTypeChange = function () {
        if (activityType === 1) {
            $('#divMaaMachineId, #divMaaSiteId').hide();
            formValidate.disableField('optMaaSiteId');
            formValidate.disableField('optMaaMachineId');
        } else {
            $('#divMaaMachineId, #divMaaSiteId').show();
            formValidate.enableField('optMaaSiteId');
            formValidate.enableField('optMaaMachineId');
        }
    };

    this.getClassName = function () {
        return className;
    };

    this.setClassFrom = function (_classFrom) {
        classFrom = _classFrom;
    };

    this.setActivityType = function (_activityType) {
        activityType = _activityType;
    };

    this.setRefSite = function (_refSite) {
        refSite = _refSite;
    };

    this.setRefMachine = function (_refMachine) {
        refMachine = _refMachine;
    };
}