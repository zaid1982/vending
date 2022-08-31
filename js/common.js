const _ALERT_TITLE_VALIDATION_ERROR = "VALIDATION ERROR";
const _ALERT_MSG_VALIDATION = "Please make sure all fields filled correctly";
const _ALERT_TITLE_ERROR = "ERROR";
const _ALERT_MSG_ERROR_DEFAULT = "Error on system. Please contact Administrator!";
const _ALERT_TITLE_SUCCESS = "SUCCESS";

const _ALERT_TITLE_SUCCESS_LOGOUT = "SUCCESS SIGN OUT";
const _ALERT_MSG_SUCCESS_LOGOUT = "You have successfully signed out";
const _ALERT_MSG_ERROR_LOGOUT = "Error on system. Please try sign in again.";
const _ALERT_TITLE_ERROR_TIMEOUT = "SESSION TIMEOUT";
const _ALERT_MSG_ERROR_TIMEOUT = "Session expired. Please try sign in again.";

const _ALERT_TITLE_ERROR_LOGIN = "SIGN IN ERROR";
const _ALERT_TITLE_SUCCESS_REGISTER = "REGISTRATION SUCCESS";
const _ALERT_MSG_SUCCESS_REGISTER = "You have successfully registered. Please activate via link sent to your email.";
const _ALERT_TITLE_ERROR_ACTIVATE = "ACTIVATION ERROR";
const _ALERT_TITLE_SUCCESS_ACTIVATE = "ACTIVATION SUCCESS";
const _ALERT_MSG_SUCCESS_ACTIVATE = "Your account has successfully activated. Please login with email as user ID and your registered password.";
const _ALERT_MSG_SUCCESS_UPDATE_USER = "Your information successfully updated";
const _ALERT_MSG_ERROR_SITE_NOCITY = "Please select city first";

const _DATATABLE_LANGUAGE =  {
    /*info: "Papar muka _START_ hingga _END_ dari _TOTAL_ rekod",
    emptyTable: "Tiada data diperolehi",
    infoEmpty: "Tiada data diperolehi",
    zeroRecords: "Tiada data dijumpai - maaf",
    lengthMenu: "Papar _MENU_ rekod per mukasurat",
    infoFiltered: "(ditapis dari _MAX_ jumlah rekod)",
    paginate: {
        previous: "Sebelumnya",
        next: "Seterusnya"
    }*/
};

function ShowLoader() {
    let overlay = jQuery('<div id="loading-overlay" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(255, 255, 255, 0.6); z-index: 10000;"><div style="text-align: center; width: 100%; position: absolute; top: 40%; margin-top: -50px;"> <div class="preloader-wrapper big active"> <div class="spinner-layer spinner-blue"> <div class="circle-clipper left"> <div class="circle"></div> </div><div class="gap-patch"> <div class="circle"></div> </div><div class="circle-clipper right"> <div class="circle"></div> </div> </div> <div class="spinner-layer spinner-red"> <div class="circle-clipper left"> <div class="circle"></div> </div><div class="gap-patch"> <div class="circle"></div> </div><div class="circle-clipper right"> <div class="circle"></div> </div> </div> <div class="spinner-layer spinner-yellow"> <div class="circle-clipper left"> <div class="circle"></div> </div><div class="gap-patch"> <div class="circle"></div> </div><div class="circle-clipper right"> <div class="circle"></div> </div> </div> <div class="spinner-layer spinner-green"> <div class="circle-clipper left"> <div class="circle"></div> </div><div class="gap-patch"> <div class="circle"></div> </div><div class="circle-clipper right"> <div class="circle"></div> </div> </div> </div> </div> </div>');
    overlay.appendTo(document.body);
}

function HideLoader() {
    $('#loading-overlay').remove();
}

function mzFormatNumber(num, fix) {
    if (num == null) 	num = 0;
    num = parseFloat(num);
    let p = num.toFixed(fix).split(".");
    let result = p[0].split("").reduceRight(function(acc, num, i, orig) {
        const pos = orig.length - i - 1;
        return  num + (pos && !(pos % 3) ? "," : "") + acc;
    }, "") + (p[1] ? "." + p[1] : "");
    if (result.substr(0, 2) === '-,') {
        result = '-' + result.substr(2);
    }
    return result;
}

function mzValidMail(mail) {
    return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(mail);
}

function mzValidDigit(digit) {
    return /^\d+$/.test(digit);
}

function mzValidNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function MzValidate(name) {
    let obj = {};
    obj.form_id = name;
    obj.fields = [];

    const checkField = function (field_id, type, val) {
        const fieldSelector = type === 'notEmptyCheck' ? $("[name='"+field_id+"']:checked") : $('#' + field_id);
        const fieldVal = type !== 'notEmptyCheck' ? fieldSelector.val() : '';
        switch (type) {
            case 'notEmpty':
                if (val === true && (fieldVal === '' || fieldVal === null))
                    return false;
                break;
            case 'eqLength':
                if (fieldVal.length !== val && fieldVal !== '')
                    return false;
                break;
            case 'maxLength':
                if (fieldVal.length > val && fieldVal !== '')
                    return false;
                break;
            case 'minLength':
                if (fieldVal.length < val && fieldVal !== '')
                    return false;
                break;
            case 'numeric':
                if (val === true && !mzValidNumeric(fieldVal) && fieldVal !== '')
                    return false;
                break;
            case 'email':
                if (val === true && !mzValidMail(fieldVal) && fieldVal !== '')
                    return false;
                break;
            case 'digit':
                if (val === true && !mzValidDigit(fieldVal) && fieldVal !== '')
                    return false;
                break;
            case 'similar':
                if (val !== '' && fieldVal !== $('#' + val.id).val() && fieldVal !== '')
                    return false;
                break;
            case 'max':
                if (fieldVal > val && fieldVal !== '')
                    return false;
                break;
            case 'min':
                if (fieldVal < val && fieldVal !== '')
                    return false;
                break;
            case 'notEmptyArr':
                if (val === true && fieldVal.length === 0)
                    return false;
                break;
            case 'notEmptyFile':
                if (val === true && fieldSelector.prop('files').length === 0)
                    return false;
                break;
            case 'notEmptyCheck':
                if (val === true && fieldSelector.length === 0)
                    return false;
                break;
            case 'notEmptySummernote':
                if (val === true && fieldSelector.summernote('isEmpty'))
                    return false;
                break;
        }
        return true;
    };

    const validateFields = function (field_id, validator, name, type) {
        let msg = '';
        let fieldSelector;
        let fieldErrSelector;
        if (type === 'check') {
            fieldSelector = $("input[name='"+field_id+"']:checkbox");
            fieldErrSelector = $('#' + field_id.substr(0, field_id.length-2) + 'Err');
        }
        else if (type === 'radio') {
            fieldSelector = $("input[name='"+field_id+"']:radio");
            fieldErrSelector = $('#' + field_id.substr(0, field_id.length-2) + 'Err');
        }
        else {
            fieldSelector = $('#' + field_id);
            fieldErrSelector = $('#' +field_id + 'Err');
        }
        fieldSelector.removeClass('invalid');
        fieldErrSelector.html('');

        /*const keys = Object.keys(validator);
        for(let i = 0; i < keys.length; i++){
            const value = validator[keys[i]];
            console.log(keys[i],value);
        }*/

        $.each(validator, function (n2, u2) {
            if (!checkField(field_id, n2, u2)) {
                switch (n2) {
                    case 'notEmpty':
                        if (type === 'select') {
                            msg += '<br>Please select ' + name;
                        } else {
                            msg += '<br>Please fill in ' + name;
                        }
                        return false;
                    case 'eqLength':
                        msg += '<br>Length must equal to ' + u2 + ' letters';
                        break;
                    case 'maxLength':
                        msg += '<br>Maximum length is '+u2+' letters';
                        break;
                    case 'minLength':
                        msg += '<br>Minimum length is '+u2+' letters';
                        break;
                    case 'numeric':
                        msg += '<br>' + name + ' must be numeric';
                        break;
                    case 'email':
                        msg += '<br>' + name + ' wrong email format';
                        break;
                    case 'digit':
                        msg += '<br>' + name + ' must contain digit only';
                        break;
                    case 'similar':
                        msg += '<br>' + name + ' must equal to ' + u2.label;
                        break;
                    case 'max':
                        msg += '<br>' + name + ' must not higher than ' + u2;
                        break;
                    case 'min':
                        msg += '<br>' + name + ' must not lower than ' + u2;
                        break;
                    case 'notEmptyArr':
                        msg += '<br>Please choose ' + name;
                        return false;
                    case 'notEmptyFile':
                        msg += '<br>Please upload ' + name + ' file';
                        return false;
                    case 'notEmptyCheck':
                        msg += '<br>Please check at least 1 ' + name;
                        return false;
                    case 'notEmptySummernote':
                        msg += '<br>Please fill in '+name;
                        return false;
                }
            }
        });
        if (msg !== '') {
            fieldSelector.addClass('invalid');
            fieldErrSelector.html(msg.substring(4));
            return false;
        }
        return true;
    };

    const validateFieldsNoError = function (field_id, validator) {
        let noError = true;
        $.each(validator, function (n2, u2) {
            if (!checkField(field_id, n2, u2)) {
                noError = false;
                return false;
            }
        });
        return noError;
    };

    this.registerFields = function (data) {
        let arrFields = [];
        $.each(data, function (n, u) {
            let fieldSelector;
            let fieldErrSelector;
            if (u.type === 'check') {
                fieldSelector = $("input[name='" + u.field_id + "']:checkbox");
                fieldErrSelector = $('#' + (u.field_id).substr(0, (u.field_id).length - 2) + 'Err');
            }
            else if (u.type === 'radio') {
                fieldSelector = $("input[name='"+u.field_id+"']:radio");
                fieldErrSelector = $('#' + (u.field_id).substr(0, (u.field_id).length-2) + 'Err');
            }
            else {
                fieldSelector = $('#' + u.field_id);
                fieldErrSelector = $('#' + u.field_id + 'Err');
            }
            fieldSelector.removeClass('invalid');
            fieldErrSelector.html('');
            fieldSelector.on('keyup change', function () {
                if (u.enabled) {
                    validateFields(u.field_id, u.validator, u.name, u.type);
                }
            });
            u.enabled = true;
            arrFields.push(u);
        });
        this.fields = arrFields;
    };

    this.validateForm = function () {
        let result = true;
        $.each(this.fields, function (n, u) {
            if (u.enabled && !validateFieldsNoError(u.field_id, u.validator)) {
                result = false;
            }
        });
        return result;
    };

    this.validateNow = function () {
        let result = true;
        $.each(this.fields, function (n, u) {
            if (u.enabled && !validateFields(u.field_id, u.validator, u.name, u.type)) {
                result = false;
            }
        });
        return result;
    };

    this.validateSummernote = function () {
        let result = true;
        $.each(this.fields, function (n, u) {
            if (u.enabled && u.type === 'summernote' && !validateFields(u.field_id, u.validator, u.name, u.type)) {
                result = false;
            }
        });
        return result;
    };

    this.clearValidation = function () {
        $.each(this.fields, function (n, u) {
            let fieldSelector;
            let fieldErrSelector;
            let fieldLblSelector = '';
            const fieldId = u.field_id;
            if (u.type === 'check') {
                fieldSelector = $("input[name='"+fieldId+"']:checkbox");
                fieldErrSelector = $('#' + fieldId.substr(0, fieldId.length-2) + 'Err');
            }
            else if (u.type === 'radio') {
                fieldSelector = $("input[name='"+fieldId+"']:radio");
                fieldErrSelector = $('#' + fieldId.substr(0, fieldId.length-2) + 'Err');
            }
            else {
                fieldSelector = $('#' + fieldId);
                fieldErrSelector = $('#' + fieldId + 'Err');
                fieldLblSelector = $('#lbl' + fieldId.substring(3));
            }

            if (u.type === 'text' || u.type === 'textarea') {
                fieldSelector.val('');
                fieldLblSelector.removeClass('active');
            }
            else if (u.type === 'select') {
                //fieldSelector.materialSelect('destroy');
                fieldSelector.val(null);
                //fieldLblSelector.removeClass('active');
                //fieldSelector.materialSelect();
                //$('.mdb-select').materialSelect('destroy');
                //$('#' + fieldId).val(null).trigger( 'click');
                //$('.mdb-select').materialSelect();
                //$('#' + fieldId).prevAll('.select-dropdown').children('li:contains(\'\')').trigger('click');
            }
            else if (u.type === 'selectMultiple') {
                //$('#' + fieldId).prevAll('.select-dropdown').children('li:contains(\'\')').trigger('click');
                fieldSelector.val(null).change();
                //fieldLblSelector.html('').removeClass('active');
            }
            else if (u.type === 'checkSingle') {
                fieldSelector.prop('checked',false);
            }
            else if (u.type === 'check' || u.type === 'radio') {
                fieldSelector.prop('checked',false);
            }
            else if (u.type === 'file') {
                fieldSelector.val('');
                fieldLblSelector.html('').removeClass('active');
            }
            else if (u.type === 'summernote') {
                fieldSelector.summernote('code', '');
            }
            fieldSelector.removeClass('invalid');
            fieldErrSelector.html('');
        });
    };

    this.enableField = function (fieldId) {
        let arrFields = this.fields;
        $.each(arrFields, function (n, u) {
            if (u.field_id === fieldId) {
                u.enabled = true;
                return false;
            }
        });
        this.fields = arrFields;
    };

    this.disableField = function (fieldId) {
        let arrFields = this.fields;
        $.each(arrFields, function (n, u) {
            if (u.field_id === fieldId) {
                u.enabled = false;
                return false;
            }
        });
        this.fields = arrFields;
    };

    this.validateField = function (fieldId) {
        let result = true;
        let arrFields = this.fields;
        $.each(arrFields, function (n, u) {
            if (u.field_id === fieldId) {
                if (u.enabled && !validateFieldsNoError(u.field_id, u.validator)) {
                    result = false;
                }
            }
        });
        return result;
    }
}

function mzAjaxRequest(url, type, data, functionStr) {
    let returnVal = '';
    if (typeof url === 'undefined' || typeof type === 'undefined' || url === '' || type === '') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    if (type !== 'GET' && type !== 'POST' && type !== 'PUT' && type !== 'DELETE') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    data = typeof data === 'undefined' ? '' : data; // JSON.stringify(data)
    const async = typeof functionStr !== 'undefined';

    let header = {};
    if (sessionStorage.getItem('token') !== null) {
        header = {'Authorization': 'Bearer ' + sessionStorage.getItem('token')};
    }
    if (type === 'GET' && data !== '') {
        jQuery.extend(header, data);
        data = '';
    }

    let errMsg = '';
    $.ajax({
        url: url,
        type: type,
        //contentType: 'application/json',
        headers: header,
        data: data,
        dataType: 'json',
        async: async,
        success: function (resp) {
            if (resp.success) {
                returnVal = resp.result;
                if (typeof functionStr !== 'undefined') {
                    if (functionStr.slice(-2) === '()') {
                        eval(functionStr.slice(0, -1) + '\'' + JSON.stringify(returnVal) + '\');');
                    } else {
                        eval(functionStr.slice(0, -1) + ',\'' + JSON.stringify(returnVal) + '\');');
                    }
                }
                if (resp['errmsg'] !== '') {
                    toastr['success'](resp['errmsg'], _ALERT_TITLE_SUCCESS);
                }
            } else if (resp.error === 'Expired token') {
                window.location.href = 'login.html?f=2';
            } else {
                errMsg = resp['errmsg'] !== '' ? resp['errmsg'] : _ALERT_MSG_ERROR_DEFAULT;
            }
        },
        error: function () {
            errMsg = _ALERT_MSG_ERROR_DEFAULT;
        }
    });

    if (errMsg !== '') {
        throw new Error(errMsg);
    }
    return returnVal;
}

function mzGetUrlVars() {
    let vars = {};
    window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[key] = value;
        }
    );
    return vars;
}

function mzSleep(delay) {
    let start = new Date().getTime();
    while (new Date().getTime() < start + delay) {
    }
}

function mzLogout() {
    sessionStorage.clear();
    window.location.href = 'login.html?f=0';
}

function mzGoToMenu(url, navId, navSecondId) {
    sessionStorage.setItem('navId', navId);
    sessionStorage.setItem('navSecondId', navSecondId);
    window.location.href = url;
}

function initiatePages() {
    $(".button-collapse").sideNav();

    let container = document.querySelector('.custom-scrollbar');
    /*Ps.initialize(container, {
        wheelSpeed: 2,
        wheelPropagation: true,
        minScrollbarLength: 20
    });*/

    // Material Select Initialization
    $(document).ready(function () {
        $('.mdb-select').materialSelect();
        $('.select-wrapper.md-form.md-outline input.select-dropdown').bind('focus blur', function () {
            $(this).closest('.select-outline').find('label').toggleClass('active');
            $(this).closest('.select-outline').find('.caret').toggleClass('active');
        });
        $(".mdb-lightbox-ui").load("mdb-addons/mdb-lightbox-ui.html");
    });

    // Tooltips Initialization
    $('.material-tooltip-main').tooltip({
        template: '<div class="tooltip md-tooltip-main">' +
            '<div class="tooltip-arrow md-arrow"></div>' +
            '<div class="tooltip-inner md-inner"></div>' +
            '</div>'});

    // Dismissible Popover
    $('[data-toggle="popover"]').popover();
    $('.popover-dismiss').popover({
        trigger: 'focus'
    });

    // Data Picker Initialization
    $('.datepicker').pickadate({
        /*monthsFull: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
            'November', 'December'],
        monthsShort: ['Jan', 'Feb', 'Mac', 'Apr', 'May', 'Jun', 'Jul', 'Ogo', 'Sep', 'Oct',
            'Nov', 'Dec'],
        weekdaysShort: ['Ahd', 'Isn', 'Sel', 'Rab', 'Kha', 'Jum', 'Sab'],
        weekdaysFull: ['Ahad', 'Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat', 'Sabtu'],
        today: 'Hari ini',
        clear: 'Padam',
        close: 'Batal'*/
    });
    $('.timepicker').pickatime({});

    const token = sessionStorage.getItem('token');
    const navId = sessionStorage.getItem('navId');
    const navSecondId = sessionStorage.getItem('navSecondId');
    let userInfo = sessionStorage.getItem('userInfo');
    if (token === null) {
        window.location.href = 'login.html?f=2';
    } else if (userInfo === null || navId === null || navSecondId === null) {
        sessionStorage.removeItem('token');
        window.location.href = 'login.html?f=1';
    }
    userInfo = JSON.parse(userInfo);
    if (typeof userInfo.menu === 'undefined') {
        sessionStorage.removeItem('token');
        window.location.href = 'login.html?f=1';
    }

    const menuSet = userInfo.menu;
    let titleHtml = '';
    $.each(menuSet, function (n, nav) {
        let menuHtml = '<li>';
        const strActive = navId === nav['navId'] ? 'active' : '';
        const strBold = navId === nav['navId'] ? 'font-weight-bold' : '';
        const navSeconds = nav['navSecond'];
        if (navSeconds.length > 0) {
            menuHtml += '<a class="collapsible-header waves-effect arrow-r ' + strActive + '"><i class="fas fa-' + nav['navIcon'] + '"></i> ' + nav['navDesc'] + '<i class="fa fa-angle-down rotate-icon"></i></a>';
            menuHtml += '<div class="collapsible-body">';
            menuHtml += '<ul>';
            if (navId === nav['navId']) {
                titleHtml += '<span class="text-primary">' + nav['navDesc'] + '</span>';
            }
            $.each(navSeconds, function (n2, nav2nd) {
                const strHighlight = navSecondId === nav2nd['navSecondId'] ? 'font-weight-bold' : '';
                menuHtml += '<li><a href="' + nav2nd['navSecondPage'] + '" class="waves-effect ' + strHighlight + '" onclick="mzGoToMenu(\'' + nav['navPage'] + '\', \'' + nav['navId'] + '\', \'' + nav2nd['navSecondId'] + '\');">' + nav2nd['navSecondDesc'] + '</a></li>';
                if (navSecondId === nav2nd['navSecondId']) {
                    titleHtml += '<span class="font-small"> / ' + nav2nd['navSecondDesc'] + '</span>';
                }
            });
            menuHtml += '</ul>';
            menuHtml += '</div>';
        } else {
            menuHtml += '<a class="collapsible-header waves-effect ' + strBold + '" href="#" onclick="mzGoToMenu(\'' + nav['navPage'] + '\', \'' + nav['navId'] + '\', \'0\');"><i class="fas fa-' + nav['navIcon'] + '"></i> ' + nav['navDesc'] + '</a>';
            if (navId === nav['navId']) {
                titleHtml += nav['navDesc'];
            }
        }
        menuHtml += '</li>';
        $('#ulNavLeft').append(menuHtml);
    });

    $('#pBasePageTitle').append(titleHtml);
    $('.collapsible').collapsible();

    $('#btnChangePassword').on('click', function () {
        changePasswordClass_.edit('Top', userInfo['userId']);
    });
}

function mzProfile() {
    let userInfo = sessionStorage.getItem('userInfo');
    userInfo = JSON.parse(userInfo);
    loadModalProfile('Top', userInfo['userId']);
}

function mzGetUserId() {
    let userInfo = sessionStorage.getItem('userInfo');
    userInfo = JSON.parse(userInfo);
    return userInfo['userId'];
}

function mzDateFromTo(startId, endId) {
    // Get the elements
    let from_input = $('#'+startId).pickadate(),
        from_picker = from_input.pickadate('picker');
    let to_input = $('#'+endId).pickadate(),
        to_picker = to_input.pickadate('picker');

    // Check if there’s a “from” or “to” date to start with and if so, set their appropriate properties.
    if (from_picker.get('value')) {
        to_picker.set('min', from_picker.get('select'));
    }
    if (to_picker.get('value')) {
        from_picker.set('max', to_picker.get('select'));
    }

    // Apply event listeners in case of setting new “from” / “to” limits to have them update on the other end. If ‘clear’ button is pressed, reset the value.
    from_picker.on('set', function (event) {
        if (event.select) {
            to_picker.set('min', from_picker.get('select'));
        } else if ('clear' in event) {
            to_picker.set('min', false);
        }
    });
    to_picker.on('set', function (event) {
        if (event.select) {
            from_picker.set('max', to_picker.get('select'));
        } else if ('clear' in event) {
            from_picker.set('max', false);
        }
    });
}

function mzDateFromToReset(startId, endId) {
    // Get the elements
    const from_input = $('#'+startId).pickadate();
    let from_picker = from_input.pickadate('picker');
    const to_input = $('#'+endId).pickadate();
    let to_picker = to_input.pickadate('picker');

    to_picker.set('min', false);
    from_picker.set('max', false);
}

function mzDateDisable(dateId, dateStr) {
    const dateArr = dateStr.split('/');
    const date_input = $('#'+dateId).pickadate();
    let date_picker = date_input.pickadate('picker');
    date_picker.set('disable', [[parseInt(dateArr[0]), parseInt(dateArr[1])-1, parseInt(dateArr[2])]]);
}

function mzDateEnable(dateId, dateStr) {
    const dateArr = dateStr.split('/');
    const date_input = $('#'+dateId).pickadate();
    let date_picker = date_input.pickadate('picker');
    date_picker.set('enable', [[parseInt(dateArr[0]), parseInt(dateArr[1])-1, parseInt(dateArr[2])]]);
}

function mzConvertDate(dateInput) {
    if (typeof dateInput === 'undefined' || dateInput === '') {
        return '';
    }
    let dateNew = '';
    const dateSplit = dateInput.split(" ");
    if (dateSplit.length === 3) {
        let day = dateSplit[0];
        let month = dateSplit[1];
        let year = dateSplit[2];
        if (day.length === 1) {
            day = '0' + day;
        }
        dateNew = year + '-' + mzConvertMonth(month.slice(0, -1)) + '-' + day;
    }
    return dateNew;
}

function mzConvertDateDisplay(dateInput) {
    if (typeof dateInput === 'undefined' || (dateInput.length !== 10 && dateInput.length !== 19)) {
        return '';
    }
    let fullDateStr = '';
    let timeNew = '';
    const monthsFull = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
        'November', 'December'];

    const datePart = dateInput.substr(0, 10);
    const dateSplit = datePart.split("/");
    if (dateSplit.length !== 3) {
        return '';
    }
    const day = dateSplit[2];
    const month = dateSplit[1];
    const year = dateSplit[0];
    let dateNew = parseInt(day) + ' ' + monthsFull[parseInt(month)] + ', ' + year;
    if (dateInput.length === 19) {
        timeNew = dateInput.substr(11);
        fullDateStr = dateNew + ', ' + timeNew;
    } else {
        fullDateStr = dateNew;
    }
    return fullDateStr;
}

function mzConvertTimeDisplay(timeInput) {
    if (typeof timeInput === 'undefined' || (timeInput.length !== 8)) {
        return '';
    }
    const timeSplit = timeInput.split(':');
    if (timeSplit.length !== 3) {
        return '';
    }
    const secs = timeSplit[2];
    const minutes = timeSplit[1];
    const hours = parseInt(timeSplit[0]);
    const ampm = hours < 12 ? 'am' : 'pm';
    const newHour = hours < 12 ? hours : hours-12;
    return newHour.toString() + ':' + minutes + ':' + secs + ampm;
}

function mzConvertMonth(monthInput) {
    switch (monthInput) {
        case 'January':
            return '01';
        case 'February':
            return '02';
        case 'March':
            return '03';
        case 'April':
            return '04';
        case 'May':
            return '05';
        case 'June':
            return '06';
        case 'July':
            return '07';
        case 'August':
            return '08';
        case 'September':
            return '09';
        case 'October':
            return '10';
        case 'November':
            return '11';
        case 'December':
            return '12';
        default:
            return '';
    }
}

function mzSetDate(id, dateInput) {
    const dateSplit = dateInput.split('/');
    if (dateSplit.length === 3) {
        let day = parseInt(dateSplit[2]);
        let month = parseInt(dateSplit[1]);
        let year = parseInt(dateSplit[0]);
        const picker_input = $('#'+id).pickadate();
        let picker_value = picker_input.pickadate('picker');
        picker_value.set('select', [year, month-1, day]);
    }
}

function mzEmailShort(emailInput, shortLength) {
    let emailNew = '';
    shortLength = typeof shortLength === 'undefined' ? 20 : shortLength;
    if (emailInput.length > shortLength) {
        for (let u = shortLength; u < emailInput.length; u++) {
            if (emailInput.substr(u, 1) === '@' || emailInput.substr(u, 1) === '.') {
                emailNew = emailInput.substr(0, u) + '<br>' + emailInput.substr(u);
                break;
            }
        }
    }
    if (emailNew === '') {
        emailNew = emailInput;
    }
    return emailNew;
}

function mzGetDataVersion() {
    return mzAjaxRequest('version', 'GET');
}

function mzGetLocalSimple(name, version, id, value, filters, sort) {
    if (typeof name === 'undefined' || typeof version === 'undefined' || typeof id === 'undefined' || typeof value === 'undefined') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    if (id === '' && value === '') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    const dataSort = typeof sort === 'undefined' ? 'ASC' : sort;
    if (typeof version[name] === 'undefined' || version[name] === '') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    const dataFilterArr = typeof filters === 'undefined' ? [] : filters;

    let returnVal = [];
    let getNew = false;
    let objData;
    let rawData;
    const localData = localStorage.getItem(name);
    if (localData === null) {
        getNew = true;
    } else {
        objData = JSON.parse(localData);
        if (typeof objData.version === 'undefined' || typeof objData.data === 'undefined' || objData.version !== version[name]) {
            getNew = true;
        } else {
            rawData = objData.data;
        }
    }

    if (getNew) {
        rawData = mzAjaxRequest('local_data', 'GET', {Name:name});
        localStorage.setItem(name, JSON.stringify({version:version[name], data:rawData}));
    }

    $.each(rawData, function (n, u) {
        if (typeof u[value] === 'undefined' || typeof u[id] === 'undefined') {
            throw new Error(_ALERT_MSG_ERROR_DEFAULT);
        }
        const rawIndex = parseInt(u[id]);
        if (isNaN(rawIndex)) {
            throw new Error(_ALERT_MSG_ERROR_DEFAULT);
        }
        if (dataFilterArr !== '') {
            const keysFilter = Object.keys(dataFilterArr);
            let filterCnt = 0;
            for (let i=0; i<keysFilter.length; i++) {
                const filterKey = keysFilter[i];
                const filterVal = dataFilterArr[filterKey];
                if (typeof u[filterKey] !== 'undefined' && u[filterKey] === filterVal) {
                    filterCnt++;
                }
            }
            if (filterCnt === keysFilter.length) {
                returnVal[rawIndex] = u[value];
            }
        } else {
            returnVal[rawIndex] = u[value];
        }
    });

    if (dataSort === 'DESC') {
        returnVal.reverse();
    } else if (dataSort === 'ASC') {
        returnVal.sort();
    }
    return returnVal;
}

function mzGetLocalArray(name, version, id, filters, api) {
    if (typeof name === 'undefined' || typeof version === 'undefined' || typeof id === 'undefined') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    if (id === '') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    if (typeof version[name] === 'undefined' || version[name] === '') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    const dataFilterArr = typeof filters === 'undefined' ? [] : filters;

    let returnVal = [];
    let getNew = false;
    let objData;
    let rawData;
    const localData = localStorage.getItem(name);
    if (localData === null) {
        getNew = true;
    } else {
        objData = JSON.parse(localData);
        if (typeof objData.version === 'undefined' || typeof objData.data === 'undefined' || objData.version !== version[name]) {
            getNew = true;
        } else {
            rawData = objData.data;
        }
    }

    if (getNew) {
        if (typeof api === 'undefined') {
            rawData = mzAjaxRequest('local_data', 'GET', {Name:name});
        } else {
            rawData = mzAjaxRequest(api, 'GET');
        }
        localStorage.setItem(name, JSON.stringify({version:version[name], data:rawData}));
    }

    $.each(rawData, function (n, u) {
        if (typeof u[id] === 'undefined') {
            throw new Error(_ALERT_MSG_ERROR_DEFAULT);
        }
        const rawIndex = parseInt(u[id]);
        if (isNaN(rawIndex)) {
            throw new Error(_ALERT_MSG_ERROR_DEFAULT);
        }
        if (dataFilterArr !== '') {
            const keysFilter = Object.keys(dataFilterArr);
            let filterCnt = 0;
            for (let i=0; i<keysFilter.length; i++) {
                const filterKey = keysFilter[i];
                const filterVal = dataFilterArr[filterKey];
                if (typeof u[filterKey] !== 'undefined' && u[filterKey] === filterVal) {
                    filterCnt++;
                }
            }
            if (filterCnt === keysFilter.length) {
                returnVal[rawIndex] = u;
            }
        } else {
            returnVal[rawIndex] = u;
        }
    });
    return returnVal;
}

function mzGetLocalRaw(name, version, filters, api) {
    if (typeof name === 'undefined' || typeof version === 'undefined') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    if (typeof version[name] === 'undefined' || version[name] === '') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    const dataFilterArr = typeof filters === 'undefined' ? [] : filters;

    let returnVal = [];
    let getNew = false;
    let objData;
    let rawData;
    const localData = localStorage.getItem(name);
    if (localData === null) {
        getNew = true;
    } else {
        objData = JSON.parse(localData);
        if (typeof objData.version === 'undefined' || typeof objData.data === 'undefined' || objData.version !== version[name]) {
            getNew = true;
        } else {
            rawData = objData.data;
        }
    }

    if (getNew) {
        if (typeof api === 'undefined') {
            rawData = mzAjaxRequest('local_data', 'GET', {Name:name});
        } else {
            rawData = mzAjaxRequest(api, 'GET');
        }
        localStorage.setItem(name, JSON.stringify({version:version[name], data:rawData}));
    }

    $.each(rawData, function (n, u) {
        if (dataFilterArr !== '') {
            const keysFilter = Object.keys(dataFilterArr);
            let filterCnt = 0;
            for (let i=0; i<keysFilter.length; i++) {
                const filterKey = keysFilter[i];
                const filterVal = dataFilterArr[filterKey];
                if (typeof u[filterKey] !== 'undefined' && u[filterKey] === filterVal) {
                    filterCnt++;
                }
            }
            if (filterCnt === keysFilter.length) {
                returnVal.push(u);
            }
        } else {
            returnVal.push(u);
        }
    });
    return returnVal;
}

function mzCmp(a, b) {
    return a[1].localeCompare(b[1]);
}

function mzOptionStopClear(name, defaultText, type) {
    $('#'+name).materialSelect('destroy');
    if (name === '' || typeof name === 'undefined') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    removeOptions(document.getElementById(name));
    document.getElementById(name).options[0] = new Option(defaultText, "", true, true);
    if (typeof type !== 'undefined' && type === 'required') {
        document.getElementById(name).options[0].disabled = true;
    }
    $('#'+name).val(null);
    $('#'+name).materialSelect();
    $('#'+name).removeClass('invalid');
    $('#'+name+'Err').html('');
    $('#lbl' + name.substr(3)).removeClass('active');
    $('#lbl' + name.substr(3)).addClass('active');
}

function mzOptionStop(name, data, defaultText, keyIndex, valIndex, filters, type, isSort) {
    $('#'+name).materialSelect('destroy');
    mzOption(name, data, defaultText, keyIndex, valIndex, filters, type, isSort);
    $('#'+name).materialSelect();
}

function mzOption(name, data, defaultText, keyIndex, valIndex, filters, type, isSort) {
    if (typeof name === 'undefined' || typeof data === 'undefined' || typeof defaultText === 'undefined') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    if (name === '') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    if (typeof isSort === 'undefined') {
        isSort = true;
    }

    const dataFilterArr = typeof filters === 'undefined' ? [] : filters;
    //let htmlStr = [];
    let optionIndex = 0;
    //document.getElementById(name).setAttribute('data-stop-refresh', 'false');
    removeOptions(document.getElementById(name));
    document.getElementById(name).options[optionIndex++] = new Option(defaultText, "", true, true);

    if (typeof type !== 'undefined' && type === 'required') {
        //htmlStr.push('<option value="" disabled selected>'+defaultText+'</option>');
        document.getElementById(name).options[0].disabled = true;
    }

    let dataSort = [];
    $.each(data, function (n, u) {
        if (typeof u !== 'undefined' && typeof u[keyIndex] !== 'undefined' && typeof u[valIndex] !== 'undefined') {
            dataSort.push(u);
        }
    });

    if (isSort) {
        dataSort.sort(function(a, b){
            return a[valIndex].localeCompare(b[valIndex]);
        });
    }

    $.each(dataSort, function (n, u) {
        if (typeof u !== 'undefined' && typeof u[keyIndex] !== 'undefined' && typeof u[valIndex] !== 'undefined') {
            if (dataFilterArr !== '') {
                const keysFilter = Object.keys(dataFilterArr);
                let filterCnt = 0;
                for (let i=0; i<keysFilter.length; i++) {
                    const filterKey = keysFilter[i];
                    const filterVal = dataFilterArr[filterKey];
                    if (typeof u[filterKey] !== 'undefined') {
                        const dataValue = u[filterKey];
                        if (dataValue === filterVal) {
                            filterCnt++;
                        } else if (filterVal !== null && filterVal.substr(0,1) === '#') {
                            const filterSplit = dataValue.split(',');
                            for (let j=0; j<filterSplit.length; j++) {
                                if (filterSplit[j] === filterVal.substr(1)) {
                                    filterCnt++;
                                    break;
                                }
                            }
                        } else if (filterVal !== null && filterVal.substr(0,1) === '(') {
                            let filterVal2 = filterVal.substr(1,filterVal.length-2);
                            const filterSplit2 = filterVal2.split(',');
                            for (let j=0; j<filterSplit2.length; j++) {
                                if (filterSplit2[j] === dataValue) {
                                    filterCnt++;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (filterCnt === keysFilter.length) {
                    document.getElementById(name).options[optionIndex++] = new Option(u[valIndex], u[keyIndex]);
                    //htmlStr.push('<option value="'+u[keyIndex]+'">'+u[valIndex]+'</option>');
                }
            } else {
                document.getElementById(name).options[optionIndex++] = new Option(u[valIndex], u[keyIndex]);
                //htmlStr.push('<option value="'+u[keyIndex]+'">'+u[valIndex]+'</option>');
            }
        }
    });

    //$('#' + name).prop('disabled', true);
    //document.getElementById(name).innerHTML = htmlStr.join('');
    //$('#' + name).html(htmlStr.join(''));
    $('#' + name).val(null);
    $('#lbl' + name.substr(3)).removeClass('active');
    $('#lbl' + name.substr(3)).addClass('active');
    //document.getElementById(name).setAttribute('data-stop-refresh', 'true');
    //$('#'+name).prevAll('.select-dropdown').children('li:eq()').trigger('click');
}

function removeOptions(selectbox) {
    let i;
    for(i = selectbox.options.length - 1 ; i >= 0 ; i--)
    {
        selectbox.remove(i);
    }
}

function mzOptionArr(name, data, defaultText, keyIndex, valIndex, type) {
    if (typeof name === 'undefined' || typeof data === 'undefined' || typeof defaultText === 'undefined') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    if (name === '' || typeof data === 'undefined') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }

    const fieldSelector = $('#' + name);
    let optionIndex = 0;

    removeOptions(document.getElementById(name));
    document.getElementById(name).options[optionIndex++] = new Option(defaultText, "", true, true);

    if (typeof type !== 'undefined' && type === 'required') {
        document.getElementById(name).options[0].disabled = true;
    }

    $.each(data, function (n, u) {
        if (typeof u !== 'undefined' && typeof u[valIndex] !== 'undefined') {
            document.getElementById(name).options[optionIndex++] = new Option(u[valIndex], u[keyIndex]);
            fieldSelector.append('<option value="'+n+'">'+u[valIndex]+'</option>');
        }
    });
    fieldSelector.val(null);
}

function mzChartOption() {
    Highcharts.setOptions({
        colors: Highcharts.map(['#ff4444', '#00C851', '#ffbb33', '#33b5e5', '#dce775', '#00897b', '#a1887f', '#ffff8d', '#ff8a65', '#7e57c2', '#9c27b0', '#ec407a', '#7283a7', '#bdbdbd'], function (color) {
            return {
                radialGradient: {
                    cx: 0.5,
                    cy: 0.3,
                    r: 0.7
                },
                stops: [
                    [0, color],
                    [1, Highcharts.Color(color).brighten(-0.3).get('rgb')] // darken
                ]
            };
        })
    });
}

function mzSetFieldValue(name, value, type, label) {
    if (value !== '' && value.length !== 0) {
        if (type === 'text') {
            $('#txt'+name).val(value);
            $('#lbl'+name).addClass('active');
        }
        else if (type === 'select') {
            //$('#opt'+name).materialSelect('destroy');
            //$('#opt'+name).val(value);
            //$('#opt' + name).prevAll('.select-dropdown').children('li:contains('+value+')').trigger('click');
            $('#opt'+name).val(value).trigger('change');
            //$('#lbl'+name).html(label).addClass('active');
            //$('#opt'+name).materialSelect();
            //console.log($('#opt'+name).val());
        }
        else if (type === 'textarea') {
            $('#txa'+name).val(value);
            $('#lbl'+name).addClass('active');
        }
        else if (type === 'checkSingle') {
            $('#chk' + name).prop('checked', value === label);
        }
        else if (type === 'check') {
            for (let i = 0; i < value.length; i++) {
                $('#chk'+name+value[i]).prop('checked', true);
            }
        }
        else if (type === 'date') {
            const dateSplit = value.split("/");
            if (dateSplit.length !== 3) {
                return '';
            }
            const day = parseInt(dateSplit[2]);
            const month = parseInt(dateSplit[1])-1;
            const year = parseInt(dateSplit[0]);
            $('#txt'+name).pickadate('set').set('select', new Date(year, month, day));
        }
        else if (type === 'summernote') {
            $('#txa'+name).summernote('code', value);
        }
    } else {
        if (type === 'text') {
            $('#txt'+name).val('');
            $('#lbl'+name).removeClass('active');
        }
        else if (type === 'textarea') {
            $('#txa'+name).val('');
            $('#lbl'+name).removeClass('active');
        }
        else if (type === 'summernote') {
            $('#txa'+name).summernote('code', '');
        }
    }
}

function mzHandleFileSelect(evt) {
    let id = evt.target.id;
    let f = evt.target.files[0];
    if (typeof f !== 'undefined') {
        let reader = new FileReader();
        reader.onload = (function() {
            return function(e) {
                const binaryData = e.target.result;
                const base64String = window.btoa(binaryData);
                $('#'+id+'Blob').val(base64String);
            };
        })(f);
        reader.readAsBinaryString(f);
    } else {
        $('#'+id+'Blob').val('');
    }
}

function mzSetObjectToArray(objects, id) {
    if (typeof id === 'undefined' || id === '') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }

    let returnVal = [];
    $.each(objects, function (n, u) {
        if (typeof u[id] === 'undefined') {
            throw new Error(_ALERT_MSG_ERROR_DEFAULT);
        }
        const rawIndex = parseInt(u[id]);
        if (isNaN(rawIndex)) {
            throw new Error(_ALERT_MSG_ERROR_DEFAULT);
        }
        returnVal[rawIndex] = u;
    });
    return returnVal;
}

function mzIsRoleExist(roleIds) {
    if (typeof roleIds === 'undefined' || roleIds === '') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    const roleSplit = roleIds.split(',');
    if (roleSplit.length === 0) {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }

    let result = false;
    let userInfo = sessionStorage.getItem('userInfo');
    userInfo = JSON.parse(userInfo);
    const roles = userInfo['roles'];
    for (let i=0; i<roles.length; i++) {
        for (let j=0; j<roleSplit.length; j++) {
            if (roles[i]['roleId'] === roleSplit[j]) {
                result = true;
                break;
            }
        }
        if (result) {
            break;
        }
    }
    return result;
}

function mzGetUserInfoByParam(parameter) {
    if (typeof parameter === 'undefined' || parameter === '') {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    let userInfo = sessionStorage.getItem('userInfo');
    userInfo = JSON.parse(userInfo);
    return userInfo[parameter];
}

function mzDisableSelect(fieldId, disable) {
    //$('#'+fieldId).materialSelect('destroy');
    $('#'+fieldId).prop('disabled', disable);
    //console.log($('#opt'+name).val());
    const value = $('#'+fieldId).val();
    if (value === '') {
        $('#'+fieldId).val(null);
    } else {
        $('#'+fieldId).val(value).trigger('change');
    }
    //$('#'+fieldId).materialSelect();
}

function mzCheckFuncParam (arrParam) {
    for (let i=0; i<arrParam.length; i++) {
        if (typeof arrParam[i] === 'undefined' || arrParam[i] === '') {
            throw new Error(_ALERT_MSG_ERROR_DEFAULT);
        }
    }
}

function mzDateSetMin(fieldId, dateStr) {
    const dateInput = $('#'+fieldId).pickadate();
    const datePicker = dateInput.pickadate('picker');

    const dateSplit = dateStr.split("/");
    if (dateSplit.length !== 3) {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    const day = parseInt(dateSplit[2]);
    const month = parseInt(dateSplit[1]);
    const year = parseInt(dateSplit[0]);
    datePicker.set('min', new Date(year,month-1, day));
}

function mzDateSetMax(fieldId, dateStr) {
    const dateInput = $('#'+fieldId).pickadate();
    const datePicker = dateInput.pickadate('picker');

    const dateSplit = dateStr.split("/");
    if (dateSplit.length !== 3) {
        throw new Error(_ALERT_MSG_ERROR_DEFAULT);
    }
    const day = parseInt(dateSplit[2]);
    const month = parseInt(dateSplit[1]);
    const year = parseInt(dateSplit[0]);
    datePicker.set('max', new Date(year,month-1, day));
}

function mzGetMonthArray() {
    return [
        {monthId:1, monthName:'January'},
        {monthId:2, monthName:'February'},
        {monthId:3, monthName:'March'},
        {monthId:4, monthName:'April'},
        {monthId:5, monthName:'May'},
        {monthId:6, monthName:'June'},
        {monthId:7, monthName:'July'},
        {monthId:8, monthName:'August'},
        {monthId:9, monthName:'September'},
        {monthId:10, monthName:'October'},
        {monthId:11, monthName:'November'},
        {monthId:12, monthName:'December'}
    ];
}

function mzGetYearArray() {
    const yearArr = [];

    let dateEarliest = new Date();
    dateEarliest.setFullYear(2012, 8, 1);
    const earliestYear = dateEarliest.getFullYear();
    let dateCurrent = new Date();
    const currentMonth = dateCurrent.getMonth();
    const currentYear = dateCurrent.getFullYear();
    for (let i = earliestYear; i <= currentYear; i++) {
        yearArr.push({yearId:i, yearName:i})
    }
    return yearArr;
}

function mzIsValidDate(s) {  // 31/9/2011
    const bits = s.split('/');
    const d = new Date(bits[2] + '/' + bits[1] + '/' + bits[0]);
    return !!(d && (d.getMonth() + 1) == bits[1] && d.getDate() == Number(bits[0]));
}