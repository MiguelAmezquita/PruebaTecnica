

"use strict";
var PruebaTecnicaTable = function () {
    // Private functions\r\n\r\n\t
    // basic demo\r\n\t
    var datatable = $('.kt-datatable')
    var EntityID = 0;
    var form = $('#modalForm');
    var modal = $('#kt_modal_5');
    var modalTitle = $('#exampleModalLabel');
    var btnEliminar = $('.btnEliminar');
    var IDProducto = $('#IDProducto');

    var tituloModal = "";

    var IniciarTabla = function () {
        datatable.KTDatatable({
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: 'Producto/GetProductos',
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
                field: 'IDProducto',
                title: '#',
                sortable: true,
                width: 20,
                textAlign: 'center',
            },
            //{ field: 'Nombre', title: 'Nombre', template: function (row) { return row.Nombre; }, },
            { field: 'Nombre', title: 'Nombre', },
            { field: 'Codigo', title: 'Codigo', textAlign: 'center' },
            { field: 'PrecioCompra', title: 'Precio Compra', textAlign: 'center' },
            { field: 'PrecioVenta', title: 'Precio Venta', textAlign: 'center' },
            //{ field: 'PrecioVenta', title: 'PrecioVenta', type: 'date', format: 'MM/DD/YYYY', },
            //{
            //    field: 'Status', title: 'Status',
            //    // callback function support for column rendering 
            //    template: function (row) {
            //        var status = {
            //            t1: { 'title': 'Pending', 'class': 'kt-badge--brand' },
            //            t2: { 'title': 'Delivered', 'class': ' kt-badge--danger' },
            //            t3: { 'title': 'Canceled', 'class': ' kt-badge--primary' },
            //            t4: { 'title': 'Success', 'class': ' kt-badge--success' },
            //            t5: { 'title': 'Info', 'class': ' kt-badge--info' },
            //            t6: { 'title': 'Danger', 'class': ' kt-badge--danger' },
            //            t7: { 'title': 'Warning', 'class': ' kt-badge--warning' },
            //        };
            //        return '<span class=\"kt-badge ' + status[row.Status].class + ' kt-badge--inline kt-badge--pill\">' + status[row.Status].title + '</span>';
            //    },
            //},
            //{
            //    field: 'Type', title: 'Type', autoHide: false,
            //    template: function (row) {
            //        var status = {
            //            t1: { 'title': 'Online', 'state': 'danger' },
            //            t2: { 'title': 'Retail', 'state': 'primary' },
            //            t3: { 'title': 'Direct', 'state': 'success' },
            //        }; return '<span class=\"kt-badge kt-badge--' + status[row.Type].state + ' kt-badge--dot\"></span>&nbsp;<span class=\"kt-font-bold kt-font-' + status[row.Type].state + '\">' + status[row.Type].title + '</span>';
            //    },
            //},
            {
                field: 'Actions', title: 'Actions', sortable: false, width: 110, autoHide: false, overflow: 'visible',
                template: function (row) {
                    //return '<div class=\"dropdown\"><a href=\"javascript:;\" class=\"btn btn-sm btn-clean btn-icon btn-icon-md\" data-toggle=\"dropdown\"><i class=\"la la-ellipsis-h\"></i></a><div class=\"dropdown-menu dropdown-menu-right\"><a class=\"dropdown-item\" href=\"#\"><i class=\"la la-edit\"></i> Edit Details</a><a class=\"dropdown-item\" href=\"#\"><i class=\"la la-leaf\"></i> Update Status</a><a class=\"dropdown-item\" href=\"#\"><i class=\"la la-print\"></i> Generate Report</a></div></div> <a href=\"javascript:;\" class=\"btn btn-sm btn-clean btn-icon btn-icon-md\" title=\"Editar\"><i class=\"la la-edit\"></i></a><a href=\"javascript:;\" class=\"btn btn-sm btn-clean btn-icon btn-icon-md\" title=\"Borrar\"><i class=\"la la-trash\"></i></a>';
                    return '\
						<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Editar" onclick="PruebaTecnicaTable.Modificar('+ row.IDProducto + ')">\
							<i class="la la-edit"></i>\
						</a>\
						<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md btnEliminar" title="Eliminar" onclick="PruebaTecnicaTable.Eliminar('+ row.IDProducto + ')">\
							<i class="la la-trash"></i>\
						</a>\
					';

                    //               return '\
                    //	<div class="dropdown">\
                    //		<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md" data-toggle="dropdown">\
                    //                           <i class="la la-cog"></i>\
                    //                       </a>\
                    //	  	<div class="dropdown-menu dropdown-menu-right">\
                    //	    	<a class="dropdown-item" href="#"><i class="la la-edit"></i> Edit Details</a>\
                    //	    	<a class="dropdown-item" href="#"><i class="la la-leaf"></i> Update Status</a>\
                    //	    	<a class="dropdown-item" href="#"><i class="la la-print"></i> Generate Report</a>\
                    //	  	</div>\
                    //	</div>\
                    //	<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Edit details">\
                    //		<i class="la la-edit"></i>\
                    //	</a>\
                    //	<a href="javascript:;" class="btn btn-sm btn-clean btn-icon btn-icon-md" title="Delete">\
                    //		<i class="la la-trash"></i>\
                    //	</a>\
                    //';
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
            IDProducto.val();
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


            $.post('Producto/' + tipoTransaccion, form.serialize(), function (response) {
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

            //form.ajaxSubmit({
            //    url: 'Producto/' + tipoTransaccion,
            //    type: 'POST',
            //    success: function (response, status, xhr, $form) {
            //        if (response.IsSuccess) {
            //            btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
            //            KTToastr.ToastSuccess(response.Message, null, "toast-top-center");
            //            datatable.load();
            //            form.clearForm();
            //            modal.modal('hide');
            //        }
            //        else {
            //            KTToastr.ToastError(response.Message, null, "toast-top-center");
            //            btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
            //        }
            //    }, error: function (ex) {
            //        KTToastr.ToastError(ex);
            //        btn.removeClass('kt-spinner kt-spinner--right kt-spinner--sm kt-spinner--light').attr('disabled', false);
            //    }
            //});
        });
    }

    function Modificar(x) {
        EntityID = x;
        $.get('Producto/GetProducto', { ID: x }, function (response) {
            if (response.IsSuccess) {
                form.clearForm();
                for (var i in response.Object) {
                    $('input[name="' + i + '"]').val(response.Object[i]);
                };
                tituloModal = "Editando " + response.Object.Nombre
                modal.modal('show');
            }
            else {
                KTToastr.ToastError(response.Message, null, "toast-top-center");
            }
        }).fail(function (jqxhr, settings, ex) {
            KTToastr.ToastError(ex);
        });

    }

    function Eliminar(x) {
        EntityID = x;
        $.post('Producto/Borrar', { ID: x }, function (response) {
            if (response.IsSuccess) {
                datatable.load();
                KTToastr.ToastSuccess(response.Message, null, "toast-top-center");
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
        }, Eliminar: function (ID) {
            Eliminar(ID)
        }, Modificar: function (ID) {
            Modificar(ID)
        }

    };
}(); jQuery(document).ready(function () {
    PruebaTecnicaTable.init();
});

