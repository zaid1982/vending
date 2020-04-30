function ModalAddCounter() {

    this.init = function () {

    };

    this.add = function () {
        ShowLoader();
        setTimeout(function () {
            try {
                $('#modal_add_counter').modal({backdrop: 'static', keyboard: false});
            } catch (e) {
                toastr['error'](e.message, _ALERT_TITLE_ERROR);
            }
            HideLoader();
        }, 200);
    };
}