

"use strict";
var PruebaTecnicaTable = function () {
    // Private functions\r\n\r\n\t
    // basic demo\r\n\t
    var IniciarTabla = function () {
        var datatable = $('.kt-datatable').KTDatatable({
            // datasource definition
            //data: {
            //    type: 'remote',
            //    source: 'Producto/GetProductos',
            //    pageSize: 10,
            //}, //layout definition 

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
                ////type: 'number',
                //selector:
                //{
                //    class: 'kt-checkbox--solid'
                //},
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
                field: 'Actions', title: 'Actions', sortable: false, width: 110, autoHide: false, overflow: 'visible', template: function () {
                    //return '<div class=\"dropdown\"><a href=\"javascript:;\" class=\"btn btn-sm btn-clean btn-icon btn-icon-md\" data-toggle=\"dropdown\"><i class=\"la la-ellipsis-h\"></i></a><div class=\"dropdown-menu dropdown-menu-right\"><a class=\"dropdown-item\" href=\"#\"><i class=\"la la-edit\"></i> Edit Details</a><a class=\"dropdown-item\" href=\"#\"><i class=\"la la-leaf\"></i> Update Status</a><a class=\"dropdown-item\" href=\"#\"><i class=\"la la-print\"></i> Generate Report</a></div></div> <a href=\"javascript:;\" class=\"btn btn-sm btn-clean btn-icon btn-icon-md\" title=\"Editar\"><i class=\"la la-edit\"></i></a><a href=\"javascript:;\" class=\"btn btn-sm btn-clean btn-icon btn-icon-md\" title=\"Borrar\"><i class=\"la la-trash\"></i></a>';
                    return '<a href=\"javascript:;\" class=\"btn btn-sm btn-clean btn-icon btn-icon-md\" title=\"Editar\"><i class=\"la la-edit\"></i></a> '
                        + '<a href=\"javascript:;\" class=\"btn btn-sm btn-clean btn-icon btn-icon-md\" title=\"Borrar\"><i class=\"la la-trash\"></i></a>';

                },
            }],
        });
        $('#kt_form_status').on('change', function () {
            datatable.search($(this).val().toLowerCase(), 'Status');
        }); $('#kt_form_type').on('change', function () {
            datatable.search($(this).val().toLowerCase(), 'Type');
        }); $('#kt_form_status,#kt_form_type').selectpicker();
    };
    return {
        init: function () {
            IniciarTabla();
        }
    };
}(); jQuery(document).ready(function () {
    PruebaTecnicaTable.init();
});
