
"use strict";
var VentasPage = function () {
    // Private functions\r\n\r\n\t
    // basic demo\r\n\t
    var datatable = $('.kt-datatable')
    var EntityID = 0;
    var form = $('#modalForm');
    var modal = $('#kt_modal_5');
    var modalTitle = $('#exampleModalLabel');
    var btnEliminar = $('.btnEliminar');
    var numeroFactura = $('#NumeroFactura');
    var EstadoFactura = $('#EstadoFactura');
    var TotalGeneral = $('#TotalGeneral').text("0.00");
    var tituloModal = "";
    var CodigoCliente = $('#CodigoCliente');
    var NombreCliente = $('#NombreCliente');

    var IniciarTabla = function () {
        datatable.KTDatatable({
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: 'Ventas/GetDetalleFactura',
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
                field: 'IDDetalleFactura',
                title: '#',
                sortable: true,
                width: 20,
                textAlign: 'center',
            },
            { field: 'Producto.Codigo', title: 'Codigo', textAlign: 'center' },
            { field: 'Producto.Nombre', title: 'Articulo', textAlign: 'left' },
            { field: 'Cantidad', title: 'Cantidad', textAlign: 'center' },
            { field: 'Producto.PrecioVenta', title: 'Precio Unitario', textAlign: 'center' },
            {
                field: 'Total', title: 'Total', textAlign: 'center',
            },
            {
                field: 'Actions', title: 'Acciones', sortable: false, width: 110, autoHide: false, overflow: 'visible',
                template: function (row) {
                    return '\
						<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Editar" onclick="VentasPage.Modificar('+ row.IDDetalleFactura + ',\'' + row.Producto.Codigo + '\')">\
							<i class="la la-edit"></i>\
						</a>\
						<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btnEliminar" title="Eliminar" onclick="VentasPage.Eliminar('+ row.IDDetalleFactura + ',\'' + row.Producto.Codigo + '\')">\
							<i class="la la-trash"></i>\
						</a>\
					';
                },
            }],
        });
        VentaEnProceso();
    };

    function Modificar(ID, Codigo) {
        EntityID = ID;
        $.get('Ventas/GetArticuloFactura', { IDDetalleVenta: ID, Codigo: Codigo }, function (response) {
            if (response.IsSuccess) {
                form.clearForm();
                $('input[name="IDDetalleFactura"]').val(response.Object.IDDetalleFactura);
                $('input[name="Codigo"]').val(response.Object.Producto.Codigo);
                $('input[name="Cantidad"]').val(response.Object.Cantidad);
                tituloModal = "Editando " + response.Object.Producto.Nombre;
                modal.modal('show');
            }
            else {
                KTToastr.ToastError(response.Message, null, "toast-top-center");
            }
        }).fail(function (jqxhr, settings, ex) {
            KTToastr.ToastError(ex);
        });

    }

    function Eliminar(ID, Codigo) {
        EntityID = ID;
        $.post('Ventas/Borrar', { IDDetalleVenta: ID, Codigo: Codigo }, function (response) {
            if (response.IsSuccess) {
                datatable.load();
                VentaEnProceso();
                KTToastr.ToastSuccess(response.Message, null, "toast-top-center");
            }
            else {
                KTToastr.ToastError(response.Message, null, "toast-top-center");
            }
        }).fail(function (jqxhr, settings, ex) {
            KTToastr.ToastError(ex);
        });
    }

    function VentaEnProceso() {
        $.post('Ventas/VetaEnProceso', { Codigo: CodigoCliente.val() }, function (response) {
            if (response.IsSuccess) {
                console.log(response.Object);
                if (response.Object.Cliente) {
                    CodigoCliente.val(response.Object.Cliente.Codigo)
                    var nombres = response.Object.Cliente.Nombres || "";
                    var apellidos = response.Object.Cliente.Apellidos || "";
                    NombreCliente.text(nombres + " " + apellidos);
                } else {
                    CodigoCliente.val("");
                }


                TotalGeneral.text(response.Object.TotalFactura);
            }
            else {
                KTToastr.ToastError(response.Message, null, "toast-top-center");
            }
        }).fail(function (jqxhr, settings, ex) {
            KTToastr.ToastError(ex);
        });
    }

    var AccionesPagina = function () {
        $('#AgregarProducto').click(function (e) {
            var codigo = $('#CodigoProducto').val();
            if (codigo) {
                form.clearForm();
                tituloModal = "Nuevo";
                $('input[name="Codigo"]').val(codigo);
                $('input[name="Cantidad"]').val(1);
                //modal.modal("show");
                $('#modalGuardar').trigger("click");
            } else {
                KTToastr.ToastError("Debe Ingresar el código de algún producto");
            }
        });
        modal.on('show.bs.modal', function () {
            modalTitle.text(tituloModal);
        })
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
            var tipoTransaccion = EntityID == 0 && tituloModal == "Nuevo" ? "AgregarProducto" : "EditarProducto"

            $.post('Ventas/' + tipoTransaccion, form.serializeArray(), function (response) {
                if (response.IsSuccess) {
                    btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
                    modal.modal('hide');
                    form.clearForm();
                    datatable.load();
                    VentaEnProceso();
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
        $('#BuscarCliente').click(function (e) {
            var codigo = CodigoCliente.val();
            $.post('Ventas/AgregarCliente', { Codigo: codigo }, function (response) {
                if (response.IsSuccess) {
                    VentaEnProceso();
                }
                else {
                    KTToastr.ToastError(response.Message, null, "toast-top-center");
                }
            }).fail(function (jqxhr, settings, ex) {
                KTToastr.ToastError(ex || "Ocurrio un error, consulte a su acesor de sistema.");
            });
        });
    }




    return {
        init: function () {
            IniciarTabla();
            AccionesPagina();
        }, Eliminar: function (ID, Codigo) {
            Eliminar(ID, Codigo)
        }, Modificar: function (ID, Codigo) {
            Modificar(ID, Codigo)
        }

    };
}(); jQuery(document).ready(function () {
    VentasPage.init();
});
