

"use strict";
var ClientesTable = function () {
    // Private functions\r\n\r\n\t
    // basic demo\r\n\t
    var datatable = $('.kt-datatable')
    var EntityID = 0;
    var form = $('#modalForm');
    var modal = $('#kt_modal_5');
    var modalTitle = $('#exampleModalLabel');
    var btnEliminar = $('.btnEliminar');
    var IDCliente = $('#IDCliente');

    var tituloModal = "";

    var IniciarTabla = function () {
        datatable.KTDatatable({
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: 'Clientes/GetClientes',
                        method: 'GET',
                        headers: {
                            'x-my-custom-header': 'some value', 'x-test-header': 'the value'
                        },
                        map: function (raw) {
                            var dataSet = raw;
                            if (typeof raw.data !== 'undefined') {
                                dataSet = raw.data;
                            } return dataSet;
                        },
                    },
                },
                pageSize: 20,
                serverPaging: false,
                serverFiltering: false,
                serverSorting: false,
            },
            layout: {
                scroll: false,
                footer: false
            }, // column sorting
            sortable: true,
            pagination: true,
            search: {
                input: $('#generalSearch')
            },
            columns: [{
                field: 'IDCliente',
                title: '#',
                sortable: true,
                width: 20,
                textAlign: 'center',
            },
            { field: 'Codigo', title: 'Codigo', textAlign: 'center' },
            { field: 'Nombres', title: 'Nombres', },
            { field: 'Apellidos', title: 'Apellidos', },
            { field: 'Direccion', title: 'Dirección', },
            { field: 'Telefono', title: 'Teléfono', },
            {
                field: 'Actions', title: 'Acciones', sortable: false, width: 110, autoHide: false, overflow: 'visible',
                template: function (row) {
                    //return '<div class=\"dropdown\"><a href=\"javascript:;\" class=\"btn btn-sm btn-clean btn-icon btn-icon-md\" data-toggle=\"dropdown\"><i class=\"la la-ellipsis-h\"></i></a><div class=\"dropdown-menu dropdown-menu-right\"><a class=\"dropdown-item\" href=\"#\"><i class=\"la la-edit\"></i> Edit Details</a><a class=\"dropdown-item\" href=\"#\"><i class=\"la la-leaf\"></i> Update Status</a><a class=\"dropdown-item\" href=\"#\"><i class=\"la la-print\"></i> Generate Report</a></div></div> <a href=\"javascript:;\" class=\"btn btn-sm btn-clean btn-icon btn-icon-md\" title=\"Editar\"><i class=\"la la-edit\"></i></a><a href=\"javascript:;\" class=\"btn btn-sm btn-clean btn-icon btn-icon-md\" title=\"Borrar\"><i class=\"la la-trash\"></i></a>';
                    return '\
						<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Editar" onclick="ClientesTable.Modificar('+ row.IDCliente + ')">\
							<i class="la la-edit"></i>\
						</a>\
					';
                },
            }],
        });
    };
    var modalReload = function () {
        $('#entitysReload').click(function (e) {
            datatable.load();
        });
    }
    var ModalOpen = function () {
        var btn = $('#newEntity');
        btn.click(function (e) {
            EntityID = 0;
            IDCliente.val();
            btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
            form.clearForm();
            tituloModal = "Nuevo";
            modal.modal("show");
        });

        modal.on('show.bs.modal', function () {
            modalTitle.text(tituloModal);
        })
    };
    var ModalSubmit = function () {
        $('#modalCerrar').click(function (e) {
            var btn = $('#modalGuardar');
            btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
            modal.modal('hide');
            form.clearForm();
        });
        $('#modalGuardar').click(function (e) {
            e.preventDefault();
            var btn = $(this);
            btn.addClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', true);
            var tipoTransaccion = EntityID == 0 ? "Create" : "Update"


            $.post('Clientes/' + tipoTransaccion, form.serialize(), function (response) {
                if (response.IsSuccess) {
                    btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                    KTToastr.ToastSuccess(response.Message, null, "toast-top-center");
                    datatable.load();
                    form.clearForm();
                    modal.modal('hide');
                }
                else {
                    KTToastr.ToastError(response.Message, null, "toast-top-center");
                    btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                }
            }).fail(function (jqxhr, settings, ex) {
                KTToastr.ToastError(ex);
                btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
            });
        });
    }

    function Modificar(x) {
        EntityID = x;
        $.get('Clientes/GetCliente', { ID: x }, function (response) {
            if (response.IsSuccess) {
                form.clearForm();
                for (var i in response.Object) {
                    $('input[name="' + i + '"]').val(response.Object[i]);
                };
                tituloModal = "Editando a " + response.Object.Nombres
                modal.modal('show');
            }
            else {
                KTToastr.ToastError(response.Message, null, "toast-top-center");
            }
        }).fail(function (jqxhr, settings, ex) {
            KTToastr.ToastError(ex);
        });

    }

    return {
        init: function () {
            IniciarTabla();
            ModalOpen();
            ModalSubmit();
            modalReload();
        }, Modificar: function (ID) {
            Modificar(ID)
        }

    };
}(); jQuery(document).ready(function () {
    ClientesTable.init();
});

