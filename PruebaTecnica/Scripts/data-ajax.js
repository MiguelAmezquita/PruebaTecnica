
"use strict";
//eval("\r\n// Class definition\r\n\r\nvar KTDatatableRemoteAjaxDemo = function() {\r\n\t// Private functions\r\n\r\n\t// basic demo\r\n\tvar demo = function() {\r\n\r\n\t\tvar datatable = $('.kt-datatable').KTDatatable({\r\n\t\t\t// datasource definition\r\n\t\t\tdata: {\r\n\t\t\t\ttype: 'remote',\r\n\t\t\t\tsource: {\r\n\t\t\t\t\tread: {\r\n\t\t\t\t\t\turl: 'https://keenthemes.com/metronic/tools/preview/api/datatables/demos/default.php',\r\n\t\t\t\t\t\t// sample custom headers\r\n\t\t\t\t\t\t// headers: {'x-my-custom-header': 'some value', 'x-test-header': 'the value'},\r\n\t\t\t\t\t\tmap: function(raw) {\r\n\t\t\t\t\t\t\t// sample data mapping\r\n\t\t\t\t\t\t\tvar dataSet = raw;\r\n\t\t\t\t\t\t\tif (typeof raw.data !== 'undefined') {\r\n\t\t\t\t\t\t\t\tdataSet = raw.data;\r\n\t\t\t\t\t\t\t}\r\n\t\t\t\t\t\t\treturn dataSet;\r\n\t\t\t\t\t\t},\r\n\t\t\t\t\t},\r\n\t\t\t\t},\r\n\t\t\t\tpageSize: 10,\r\n\t\t\t\tserverPaging: true,\r\n\t\t\t\tserverFiltering: true,\r\n\t\t\t\tserverSorting: true,\r\n\t\t\t},\r\n\r\n\t\t\t// layout definition\r\n\t\t\tlayout: {\r\n\t\t\t\tscroll: false,\r\n\t\t\t\tfooter: false,\r\n\t\t\t},\r\n\r\n\t\t\t// column sorting\r\n\t\t\tsortable: true,\r\n\r\n\t\t\tpagination: true,\r\n\r\n\t\t\tsearch: {\r\n\t\t\t\tinput: $('#generalSearch'),\r\n\t\t\t},\r\n\r\n\t\t\t// columns definition\r\n\t\t\tcolumns: [\r\n\t\t\t\t{\r\n\t\t\t\t\tfield: 'RecordID',\r\n\t\t\t\t\ttitle: '#',\r\n\t\t\t\t\tsortable: 'asc',\r\n\t\t\t\t\twidth: 30,\r\n\t\t\t\t\ttype: 'number',\r\n\t\t\t\t\tselector: false,\r\n\t\t\t\t\ttextAlign: 'center',\r\n\t\t\t\t}, {\r\n\t\t\t\t\tfield: 'OrderID',\r\n\t\t\t\t\ttitle: 'Order ID',\r\n\t\t\t\t}, {\r\n\t\t\t\t\tfield: 'Country',\r\n\t\t\t\t\ttitle: 'Country',\r\n\t\t\t\t\ttemplate: function(row) {\r\n\t\t\t\t\t\treturn row.Country + ' ' + row.ShipCountry;\r\n\t\t\t\t\t},\r\n\t\t\t\t}, {\r\n\t\t\t\t\tfield: 'ShipDate',\r\n\t\t\t\t\ttitle: 'Ship Date',\r\n\t\t\t\t\ttype: 'date',\r\n\t\t\t\t\tformat: 'MM/DD/YYYY',\r\n\t\t\t\t}, {\r\n\t\t\t\t\tfield: 'CompanyName',\r\n\t\t\t\t\ttitle: 'Company Name',\r\n\t\t\t\t}, {\r\n\t\t\t\t\tfield: 'Status',\r\n\t\t\t\t\ttitle: 'Status',\r\n\t\t\t\t\t// callback function support for column rendering\r\n\t\t\t\t\ttemplate: function(row) {\r\n\t\t\t\t\t\tvar status = {\r\n\t\t\t\t\t\t\t1: {'title': 'Pending', 'class': 'kt-badge--brand'},\r\n\t\t\t\t\t\t\t2: {'title': 'Delivered', 'class': ' kt-badge--danger'},\r\n\t\t\t\t\t\t\t3: {'title': 'Canceled', 'class': ' kt-badge--primary'},\r\n\t\t\t\t\t\t\t4: {'title': 'Success', 'class': ' kt-badge--success'},\r\n\t\t\t\t\t\t\t5: {'title': 'Info', 'class': ' kt-badge--info'},\r\n\t\t\t\t\t\t\t6: {'title': 'Danger', 'class': ' kt-badge--danger'},\r\n\t\t\t\t\t\t\t7: {'title': 'Warning', 'class': ' kt-badge--warning'},\r\n\t\t\t\t\t\t};\r\n\t\t\t\t\t\treturn '<span class=\"kt-badge ' + status[row.Status].class + ' kt-badge--inline kt-badge--pill\">' + status[row.Status].title + '</span>';\r\n\t\t\t\t\t},\r\n\t\t\t\t}, {\r\n\t\t\t\t\tfield: 'Type',\r\n\t\t\t\t\ttitle: 'Type',\r\n\t\t\t\t\tautoHide: false,\r\n\t\t\t\t\t// callback function support for column rendering\r\n\t\t\t\t\ttemplate: function(row) {\r\n\t\t\t\t\t\tvar status = {\r\n\t\t\t\t\t\t\t1: {'title': 'Online', 'state': 'danger'},\r\n\t\t\t\t\t\t\t2: {'title': 'Retail', 'state': 'primary'},\r\n\t\t\t\t\t\t\t3: {'title': 'Direct', 'state': 'success'},\r\n\t\t\t\t\t\t};\r\n\t\t\t\t\t\treturn '<span class=\"kt-badge kt-badge--' + status[row.Type].state + ' kt-badge--dot\"></span>&nbsp;<span class=\"kt-font-bold kt-font-' + status[row.Type].state + '\">' +\r\n\t\t\t\t\t\t\t\tstatus[row.Type].title + '</span>';\r\n\t\t\t\t\t},\r\n\t\t\t\t}, {\r\n\t\t\t\t\tfield: 'Actions',\r\n\t\t\t\t\ttitle: 'Actions',\r\n\t\t\t\t\tsortable: false,\r\n\t\t\t\t\twidth: 110,\r\n\t\t\t\t\toverflow: 'visible',\r\n\t\t\t\t\tautoHide: false,\r\n\t\t\t\t\ttemplate: function() {\r\n\t\t\t\t\t\treturn '\\\r\n\t\t\t\t\t\t<div class=\"dropdown\">\\\r\n\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"btn btn-sm btn-clean btn-icon btn-icon-sm\" data-toggle=\"dropdown\">\\\r\n                                <i class=\"flaticon2-gear\"></i>\\\r\n                            </a>\\\r\n\t\t\t\t\t\t  \t<div class=\"dropdown-menu dropdown-menu-right\">\\\r\n\t\t\t\t\t\t    \t<a class=\"dropdown-item\" href=\"#\"><i class=\"la la-edit\"></i> Edit Details</a>\\\r\n\t\t\t\t\t\t    \t<a class=\"dropdown-item\" href=\"#\"><i class=\"la la-leaf\"></i> Update Status</a>\\\r\n\t\t\t\t\t\t    \t<a class=\"dropdown-item\" href=\"#\"><i class=\"la la-print\"></i> Generate Report</a>\\\r\n\t\t\t\t\t\t  \t</div>\\\r\n\t\t\t\t\t\t</div>\\\r\n\t\t\t\t\t\t<a href=\"javascript:;\" class=\"btn btn-sm btn-clean btn-icon btn-icon-sm\" title=\"Edit details\">\\\r\n\t\t\t\t\t\t\t<i class=\"flaticon2-paper\"></i>\\\r\n\t\t\t\t\t\t</a>\\\r\n\t\t\t\t\t\t<a href=\"javascript:;\" class=\"btn btn-sm btn-clean btn-icon btn-icon-sm\" title=\"Delete\">\\\r\n\t\t\t\t\t\t\t<i class=\"flaticon2-trash\"></i>\\\r\n\t\t\t\t\t\t</a>\\\r\n\t\t\t\t\t';\r\n\t\t\t\t\t},\r\n\t\t\t\t}],\r\n\r\n\t\t});\r\n\r\n    $('#kt_form_status').on('change', function() {\r\n      datatable.search($(this).val().toLowerCase(), 'Status');\r\n    });\r\n\r\n    $('#kt_form_type').on('change', function() {\r\n      datatable.search($(this).val().toLowerCase(), 'Type');\r\n    });\r\n\r\n    $('#kt_form_status,#kt_form_type').selectpicker();\r\n\r\n\t};\r\n\r\n\treturn {\r\n\t\t// public functions\r\n\t\tinit: function() {\r\n\t\t\tdemo();\r\n\t\t},\r\n\t};\r\n}();\r\n\r\njQuery(document).ready(function() {\r\n\tKTDatatableRemoteAjaxDemo.init();\r\n});\n\n//# sourceURL=webpack:///../src/assets/js/pages/crud/metronic-datatable/base/data-ajax.js?");
//var KTDatatableRemoteAjaxDemo = function () {
//    var demo = function () {
//        var datatable = $('.kt-datatable').KTDatatable(
//            {
//                // datasource definition
//                data: {
//                    type: 'remote',
//                    source: {
//                        read: {
//                            url: 'Producto/GetProductos',
//                            // sample custom headers
//                            headers: {
//                                'x-my-custom-header': 'some value', 'x-test-header': 'the value'
//                            },
//                            map: function (raw) {
//                                // sample data mapping
//                                console.log(raw);
//                                var dataSet = raw;
//                                if (typeof raw.data !== 'undefined') {
//                                    dataSet = raw.data;
//                                } return dataSet;
//                            },
//                        },
//                    },
//                    pageSize: 10,
//                    serverPaging: true,
//                    serverFiltering: true,
//                    serverSorting: true,
//                }, // layout definition\r\n\t\t\t
//                layout: { scroll: false, footer: false },
//                // column sorting
//                sortable: true,
//                pagination: true,
//                search: {
//                    input: $('#generalSearch'),
//                },
//                // columns definition
//                columns: [
//                    { field: 'RecordID', title: '#', sortable: 'asc', width: 30, type: 'number', selector: false, textAlign: 'center', },
//                    { field: 'OrderID', title: 'Order ID', },
//                    { field: 'Country', title: 'Country', template: function (row) { return row.Country + ' ' + row.ShipCountry; }, },
//                    { field: 'ShipDate', title: 'Ship Date', type: 'date', format: 'MM/DD/YYYY', },
//                    { field: 'CompanyName', title: 'Company Name', },
//                    {
//                        field: 'Status', title: 'Status',
//                        // callback function support for column rendering
//                        template: function (row) {
//                            var status = {
//                                t1: { 'title': 'Pending', 'class': 'kt-badge--brand' },
//                                t2: { 'title': 'Delivered', 'class': ' kt-badge--danger' },
//                                t3: { 'title': 'Canceled', 'class': ' kt-badge--primary' },
//                                t4: { 'title': 'Success', 'class': ' kt-badge--success' },
//                                t5: { 'title': 'Info', 'class': ' kt-badge--info' },
//                                t6: { 'title': 'Danger', 'class': ' kt-badge--danger' },
//                                t7: { 'title': 'Warning', 'class': ' kt-badge--warning' },
//                            };
//                            return '<span class=\"kt-badge ' + status[row.Status].class + ' kt-badge--inline kt-badge--pill\">' + status[row.Status].title + '</span>';
//                        },
//                    }, {
//                        field: 'Type', title: 'Type', autoHide: false,
//                        // callback function support for column rendering
//                        template: function (row) {
//                            var status = {
//                                t1: { 'title': 'Online', 'state': 'danger' },
//                                t2: { 'title': 'Retail', 'state': 'primary' },
//                                t3: { 'title': 'Direct', 'state': 'success' },
//                            };
//                            return '<span class=\"kt-badge kt-badge--' + status[row.Type].state + ' kt-badge--dot\"></span>&nbsp;<span class=\"kt-font-bold kt-font-' + status[row.Type].state + '\">' + status[row.Type].title + '</span>';
//                        },
//                    }, {
//                        field: 'Actions', title: 'Actions', sortable: false, width: 110, overflow: 'visible', autoHide: false,
//                        template: function () {
//                            return '\\\r\n\t\t\t\t\t\t<div class=\"dropdown\">\\\r\n\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"btn btn-sm btn-clean btn-icon btn-icon-sm\" data-toggle=\"dropdown\">\\\r\n  <i class=\"flaticon2-gear\"></i>\\\r\n </a>\\\r\n\t\t\t\t\t\t  \t<div class=\"dropdown-menu dropdown-menu-right\">\\\r\n\t\t\t\t\t\t    \t<a class=\"dropdown-item\" href=\"#\"><i class=\"la la-edit\"></i> Edit Details</a>\\\r\n\t\t\t\t\t\t    \t<a class=\"dropdown-item\" href=\"#\"><i class=\"la la-leaf\"></i> Update Status</a>\\\r\n\t\t\t\t\t\t    \t<a class=\"dropdown-item\" href=\"#\"><i class=\"la la-print\"></i> Generate Report</a>\\\r\n\t\t\t\t\t\t  \t</div>\\\r\n\t\t\t\t\t\t</div>\\\r\n\t\t\t\t\t\t<a href=\"javascript:;\" class=\"btn btn-sm btn-clean btn-icon btn-icon-sm\" title=\"Edit details\">\\\r\n\t\t\t\t\t\t\t<i class=\"flaticon2-paper\"></i>\\\r\n\t\t\t\t\t\t</a>\\\r\n\t\t\t\t\t\t<a href=\"javascript:;\" class=\"btn btn-sm btn-clean btn-icon btn-icon-sm\" title=\"Delete\">\\\r\n\t\t\t\t\t\t\t<i class=\"flaticon2-trash\"></i>\\\r\n\t\t\t\t\t\t</a>\\\r\n\t\t\t\t\t';
//                        },
//                    }],
//            });
//        $('#kt_form_status').on('change', function () {
//            datatable.search($(this).val().toLowerCase(), 'Status');
//        }); $('#kt_form_type').on('change', function () {
//            datatable.search($(this).val().toLowerCase(), 'Type');
//        }); $('#kt_form_status,#kt_form_type').selectpicker();
//    };
//    return {
//        init: function () {
//            demo();
//        },
//    };
//}(); jQuery(document).ready(function () {
//    KTDatatableRemoteAjaxDemo.init();
//});





"use strict";
// Class definition\r\n\r\n
var KTDatatableJsonRemoteDemo = function () {
    // Private functions\r\n\r\n\t
    // basic demo\r\n\t
    var demo = function () {
        var datatable = $('.kt-datatable').KTDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: 'Producto/GetProductos',
                pageSize: 10,
            }, //layout definition 
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
                field: 'RecordID',
                title: '#', sortable: false,
                width: 20, type: 'number', selector: { class: 'kt-checkbox--solid' },
                textAlign: 'center',
            },
            { field: 'OrderID', title: 'Order ID', },
            { field: 'Country', title: 'Country', template: function (row) { return row.Country + ' ' + row.ShipCountry; }, },
            { field: 'ShipAddress', title: 'Ship Address', },
            { field: 'ShipDate', title: 'Ship Date', type: 'date', format: 'MM/DD/YYYY', },
            {
                field: 'Status', title: 'Status',
                // callback function support for column rendering 
                template: function (row) {
                    var status = {
                        t1: { 'title': 'Pending', 'class': 'kt-badge--brand' },
                        t2: { 'title': 'Delivered', 'class': ' kt-badge--danger' },
                        t3: { 'title': 'Canceled', 'class': ' kt-badge--primary' },
                        t4: { 'title': 'Success', 'class': ' kt-badge--success' },
                        t5: { 'title': 'Info', 'class': ' kt-badge--info' },
                        t6: { 'title': 'Danger', 'class': ' kt-badge--danger' },
                        t7: { 'title': 'Warning', 'class': ' kt-badge--warning' },
                    };
                    return '<span class=\"kt-badge ' + status[row.Status].class + ' kt-badge--inline kt-badge--pill\">' + status[row.Status].title + '</span>';
                },
            },
            {
                field: 'Type', title: 'Type', autoHide: false,
                template: function (row) {
                    var status = {
                        t1: { 'title': 'Online', 'state': 'danger' },
                        t2: { 'title': 'Retail', 'state': 'primary' },
                        t3: { 'title': 'Direct', 'state': 'success' },
                    }; return '<span class=\"kt-badge kt-badge--' + status[row.Type].state + ' kt-badge--dot\"></span>&nbsp;<span class=\"kt-font-bold kt-font-' + status[row.Type].state + '\">' + status[row.Type].title + '</span>';
                },
            }, {
                field: 'Actions', title: 'Actions', sortable: false, width: 110, autoHide: false, overflow: 'visible', template: function () {
                    return '\\\r\n\t\t\t\t\t\t<div class=\"dropdown\">\\\r\n\t\t\t\t\t\t\t<a href=\"javascript:;\" class=\"btn btn-sm btn-clean btn-icon btn-icon-md\" data-toggle=\"dropdown\">\\\r\n                                <i class=\"la la-ellipsis-h\"></i>\\\r\n                            </a>\\\r\n\t\t\t\t\t\t  \t<div class=\"dropdown-menu dropdown-menu-right\">\\\r\n\t\t\t\t\t\t    \t<a class=\"dropdown-item\" href=\"#\"><i class=\"la la-edit\"></i> Edit Details</a>\\\r\n\t\t\t\t\t\t    \t<a class=\"dropdown-item\" href=\"#\"><i class=\"la la-leaf\"></i> Update Status</a>\\\r\n\t\t\t\t\t\t    \t<a class=\"dropdown-item\" href=\"#\"><i class=\"la la-print\"></i> Generate Report</a>\\\r\n\t\t\t\t\t\t  \t</div>\\\r\n\t\t\t\t\t\t</div>\\\r\n\t\t\t\t\t\t<a href=\"javascript:;\" class=\"btn btn-sm btn-clean btn-icon btn-icon-md\" title=\"Edit details\">\\\r\n\t\t\t\t\t\t\t<i class=\"la la-edit\"></i>\\\r\n\t\t\t\t\t\t</a>\\\r\n\t\t\t\t\t\t<a href=\"javascript:;\" class=\"btn btn-sm btn-clean btn-icon btn-icon-md\" title=\"Delete\">\\\r\n\t\t\t\t\t\t\t<i class=\"la la-trash\"></i>\\\r\n\t\t\t\t\t\t</a>\\\r\n\t\t\t\t\t';
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
            demo();
        }
    };
}(); jQuery(document).ready(function () {
    KTDatatableJsonRemoteDemo.init();
});
//# sourceURL=webpack:///../src/assets/js/pages/crud/metronic-datatable/base/data-json.js?");
