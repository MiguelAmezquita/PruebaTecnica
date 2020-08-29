"use strict";

// Class definition
var KTToastr = function () {
    var $toastlast;
    // Private functions
    // basic demo

    function toastSuccess(msg, title, positionClass) {
        myToast("success", msg, title, positionClass)
    }

    function toasInfo(msg, title, positionClass) {
        myToast("info", msg, title, positionClass)
    }

    function toastWarning(msg, title, positionClass) {
        myToast("warning", msg, title, positionClass)
    }

    function toastError(msg, title, positionClass) {
        myToast("error", msg, title, positionClass);
    }

    function myToast(shortCutFunction, msg, title, positionClass) {
        var i = -1;
        var toastCount = 0;
        var getMessageWithClearButton = function (msg) {
            msg = msg ? msg : 'Clear itself?';
            msg += '<br /><br /><button type="button" class="btn btn-outline-light btn-sm--air--wide clear">Yes</button>';
            return msg;
        };
        var shortCutFunction = shortCutFunction;
        var msg = msg; //'<span style="font-size: 13px;">' + msg + '</span>';
        var title = title; // '<span style="font-size: 16px;">' + title + '</span>';
        var $showDuration = "300";
        var $hideDuration = "1000";
        var $timeOut = "5000";
        var $extendedTimeOut = "1000";
        var $showEasing = "swing";
        var $hideEasing = "linear";
        var $showMethod = "slideDown";
        var $hideMethod = "slideUp";
        var toastIndex = toastCount++;
        var addClear = $('#addClear').prop('checked');
        var $positionClass = positionClass || 'toast-top-right'
        toastr.options = {
            closeButton: $('#closeButton').prop('checked'),
            debug: $('#debugInfo').prop('checked'),
            newestOnTop: true,
            progressBar: false,
            positionClass: $positionClass,
            preventDuplicates: false,
            onclick: null
        };

        if ($showDuration) {
            toastr.options.showDuration = $showDuration;
        }

        if ($hideDuration) {
            toastr.options.hideDuration = $hideDuration;
        }

        if ($timeOut) {
            toastr.options.timeOut = addClear ? 0 : $timeOut;
        }

        if ($extendedTimeOut) {
            toastr.options.extendedTimeOut = addClear ? 0 : $extendedTimeOut;
        }

        if ($showEasing) {
            toastr.options.showEasing = $showEasing;
        }

        if ($hideEasing) {
            toastr.options.hideEasing = $hideEasing;
        }

        if ($showMethod) {
            toastr.options.showMethod = $showMethod;
        }

        if ($hideMethod) {
            toastr.options.hideMethod = $hideMethod;
        }

        if (addClear) {
            msg = getMessageWithClearButton(msg);
            toastr.options.tapToDismiss = false;
        }
        if (!msg) {
            msg = "";
        }

        var $toast = toastr[shortCutFunction](msg, title); // Wire up an event handler to a button in the toast, if it exists
        $toastlast = $toast;

        if (typeof $toast === 'undefined') {
            return;
        }

        if ($toast.find('#okBtn').length) {
            $toast.delegate('#okBtn', 'click', function () {
                alert('you clicked me. i was toast #' + toastIndex + '. goodbye!');
                $toast.remove();
            });
        }
        if ($toast.find('#surpriseBtn').length) {
            $toast.delegate('#surpriseBtn', 'click', function () {
                alert('Surprise! you clicked me. i was toast #' + toastIndex + '. You could perform an action here.');
            });
        }
        if ($toast.find('.clear').length) {
            $toast.delegate('.clear', 'click', function () {
                toastr.clear($toast, { force: true });
            });
        }
    }
    function getLastToast() {
        return $toastlast;
    }

    return {
        // public functions
        init: function () {
        },
        ToastSuccess: function (msg, title, positionClass) {
            toastSuccess(msg, title, positionClass);
        },
        ToasInfo: function (msg, title, positionClass) {
            toasInfo(msg, title, positionClass);
        },
        ToastWarning: function (msg, title, positionClass) {
            toastWarning(msg, title, positionClass);
        },
        ToastError: function (msg, title, positionClass) {
            toastError(msg, title, positionClass);
        },
    };
}();

jQuery(document).ready(function () {
    KTToastr.init();
});