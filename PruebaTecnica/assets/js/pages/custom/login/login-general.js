"use strict";
// Class Definition
var KTLoginGeneral = function () {

    var login = $('#kt_login');

    var showErrorMsg = function (form, type, msg) {
        var alert = $('<div class="alert alert-' + type + ' alert-dismissible" role="alert">\
			<div class="alert-text">'+ msg + '</div>\
			<div class="alert-close">\
                <i class="flaticon2-cross kt-icon-sm" data-dismiss="alert"></i>\
            </div>\
		</div>');

        form.find('.alert').remove();
        alert.prependTo(form);
        //alert.animateClass('fadeIn animated');
        KTUtil.animateClass(alert[0], 'fadeIn animated');
        alert.find('span').html(msg);
    }

    // Private Functions
    var displaySignUpForm = function () {
        login.removeClass('kt-login--forgot');
        login.removeClass('kt-login--signin');

        login.addClass('kt-login--signup');
        KTUtil.animateClass(login.find('.kt-login__signup')[0], 'flipInX animated');
    }

    var displaySignInForm = function () {
        login.removeClass('kt-login--forgot');
        login.removeClass('kt-login--signup');

        login.addClass('kt-login--signin');
        KTUtil.animateClass(login.find('.kt-login__signin')[0], 'flipInX animated');
        //login.find('.kt-login__signin').animateClass('flipInX animated');
    }

    var displayForgotForm = function () {
        login.removeClass('kt-login--signin');
        login.removeClass('kt-login--signup');

        login.addClass('kt-login--forgot');
        //login.find('.kt-login--forgot').animateClass('flipInX animated');
        KTUtil.animateClass(login.find('.kt-login__forgot')[0], 'flipInX animated');

    }

    var handleFormSwitch = function () {
        $('#kt_login_forgot').click(function (e) {
            e.preventDefault();
            displayForgotForm();
        });

        $('#kt_login_forgot_cancel').click(function (e) {
            e.preventDefault();
            displaySignInForm();
        });

        $('#kt_login_signup').click(function (e) {
            e.preventDefault();
            displaySignUpForm();
        });

        $('#kt_login_signup_cancel').click(function (e) {
            e.preventDefault();
            displaySignInForm();
        });
    }

    var handleSignInFormSubmit = function () {
        $('#kt_login_signin_submit').click(function (e) {
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');
            form.validate({
                rules: {
                    usuario: {
                        required: true,
                    },
                    contrasenia: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);

            form.ajaxSubmit({
                url: 'AuthService/SignIn',
                type: 'post',
                success: function (response, status, xhr, $form) {
                    if (response.IsSuccess) {
                        btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                        window.location.href = response.RedirectTo;
                    }
                    else {
                        btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                        setTimeout(function () {
                            if (response.Message)
                                showErrorMsg(form, 'danger', response.Message);
                            else
                                showErrorMsg(form, 'danger', 'Nombre de usuario o contrase&ntilde;a incorrecta. Int&eacute;ntalo de nuevo.');
                        }, 2000);
                    }
                }, error: function () {
                    btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                    setTimeout(function () {
                        if (response.Message)
                            showErrorMsg(form, 'danger', response.Message);
                        else
                            showErrorMsg(form, 'danger', 'Nombre de usuario o contrase&ntilde;a incorrecta. Int&eacute;ntalo de nuevo.');
                    }, 2000);
                }
            });
        });
    }

    var handleSignUpFormSubmit = function () {
        $('#kt_login_signup_submit').click(function (e) {
            e.preventDefault();

            var btn = $(this);
            var form = $(this).closest('form');

            form.validate({
                rules: {
                    fullname: {
                        required: true
                    },
                    email: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true
                    },
                    rpassword: {
                        required: true
                    },
                    agree: {
                        required: true
                    }
                }
            });

            if (!form.valid()) {
                return;
            }

            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);

            form.ajaxSubmit({
                url: '',
                success: function (response, status, xhr, $form) {
                    // similate 2s delay
                    setTimeout(function () {
                        btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                        form.clearForm();
                        form.validate().resetForm();

                        // display signup form
                        displaySignInForm();
                        var signInForm = login.find('.kt-login__signin form');
                        signInForm.clearForm();
                        signInForm.validate().resetForm();

                        showErrorMsg(signInForm, 'success', 'Gracias. Para completar su registro por favor revise su correo electr&oacute;nico.');
                    }, 2000);
                }
            });
        });
    }

    var handleForgotFormSubmit = function () {
        $('#kt_login_forgot_submit').click(function (e) {
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');
            form.validate({
                rules: {
                    email: {
                        required: true,
                    }
                },
            });

            if (!form.valid()) {
                return;
            }
            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
            form.ajaxSubmit({
                url: 'AuthService/ForgotPassword',
                type: 'post',
                success: function (response, status, xhr, $form) {
                    btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false); // remove
                    form.clearForm(); // clear form
                    form.validate().resetForm(); // reset validation states
                    // display signup form
                    displaySignInForm();
                    var signInForm = login.find('.kt-login__signin form');
                    signInForm.clearForm();
                    signInForm.validate().resetForm();

                    setTimeout(function () {
                        if (response.IsSuccess) {
                            if (response.Message)
                                showErrorMsg(signInForm, 'success', response.Message);
                            else
                                showErrorMsg(signInForm, 'success', 'Nombre de usuario incorrecto. Int&eacute;ntalo de nuevo.');
                        }
                        else {
                            if (response.Message)
                                showErrorMsg(signInForm, 'danger', response.Message);
                            else
                                showErrorMsg(signInForm, 'danger', 'Nombre de usuario o contrase&ntilde;a incorrecta. Int&eacute;ntalo de nuevo.');
                        }
                    }, 2000);
                }, error: function () {
                    setTimeout(function () {
                        btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false); // remove
                        form.clearForm(); // clear form
                        form.validate().resetForm(); // reset validation states
                        // display signup form
                        displaySignInForm();
                        var signInForm = login.find('.kt-login__signin form');
                        signInForm.clearForm();
                        signInForm.validate().resetForm();
                        showErrorMsg(signInForm, 'danger', 'ha ocurrido un error. por favor intente mas tarde');
                    }, 2000);
                }
            });
        });
    }
    var handleResetPasswordFormSubmit = function () {
        $('#kt_login_resetPassword_submit').click(function (e) {
            e.preventDefault();
            var btn = $(this);
            var form = $(this).closest('form');
            form.validate({
                ignore: ":hidden",
                rules: {
                    ConfirmarContrasenia: {
                        equalTo: "#Contrasenia",
                    }
                },
                messages: {
                    ConfirmarContrasenia: {
                        equalTo: "Este valor debe ser id&eacute;ntico al valor ingresado en Nueva Contrase&ntilde;a"
                    }
                },
                invalidHandler: function (event, validator) {
                    KTUtil.scrollTop();
                    //KTToastr.ToastError("Verifique los errores en este formulario", "Error");
                    showErrorMsg(form, 'danger', "Verifique los errores en este formulario", "error")
                },
                submitHandler: function (form) {
                }
            });

            if (!form.valid()) {
                return;
            }
            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
            //form.concat([{ "token": getParameterByName("token") }]);
            form.ajaxSubmit({
                url: 'AuthService/ResetPassword',
                type: 'post',
                data: { "token": getParameterByName("token") },
                success: function (response, status, xhr, $form) {
                    if (response.IsSuccess) {
                        btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                        window.location.href = response.RedirectTo;
                    }
                    else {
                        setTimeout(function () {
                            btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                            if (response.Message)
                                showErrorMsg(form, 'danger', response.Message);
                            else
                                showErrorMsg(form, 'danger', 'Nombre de usuario o contrase&ntilde;a incorrecta. Int&eacute;ntalo de nuevo.');
                        }, 2000);
                    }
                }, error: function () {
                    setTimeout(function () {
                        btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                        if (response.Message)
                            showErrorMsg(form, 'danger', response.Message);
                        else
                            showErrorMsg(form, 'danger', 'Ha ocurrido un error inesperado, por favor intente mas tarde.');
                    }, 2000);
                }
            });
        });
    }

    function getParameterByName(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    }

    // Public Functions
    return {
        // public functions
        init: function () {
            handleFormSwitch();
            handleSignInFormSubmit();
            handleSignUpFormSubmit();
            handleForgotFormSubmit();
            handleResetPasswordFormSubmit();
        }
    };
}();


jQuery(document).ready(function () {
    KTLoginGeneral.init()
    jQuery.extend(jQuery.validator.messages, {
        required: "Este campo es obligatorio.",
        remote: "Por favor, rellena este campo.",
        email: "Por favor, escribe una direcci&oacute;n de correo v&aacute;lida",
        url: "Por favor, escribe una URL v&aacute;lida.",
        date: "Por favor, escribe una fecha v&aacute;lida.",
        dateISO: "Por favor, escribe una fecha (ISO) v&aacute;lida.",
        number: "Por favor, escribe un n&uacute;mero entero v&aacute;lido.",
        digits: "Por favor, escribe s&oacute;lo dígitos.",
        creditcard: "Por favor, escribe un n&uacute;mero de tarjeta v&aacute;lido.",
        equalTo: "Por favor, escribe el mismo valor de nuevo.",
        accept: "Por favor, escribe un valor con una extensi&oacute;n aceptada.",
        maxlength: jQuery.validator.format("Por favor, no escribas m&aacute;s de {0} caracteres."),
        minlength: jQuery.validator.format("Por favor, no escribas menos de {0} caracteres."),
        rangelength: jQuery.validator.format("Por favor, escribe un valor entre {0} y {1} caracteres."),
        range: jQuery.validator.format("Por favor, escribe un valor entre {0} y {1}."),
        max: jQuery.validator.format("Por favor, escribe un valor menor o igual a {0}."),
        min: jQuery.validator.format("Por favor, escribe un valor mayor o igual a {0}.")
    });
});
// Class Initialization
