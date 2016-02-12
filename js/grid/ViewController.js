// @require ModernizrADownload
// @require excel-builder

Ext.define('KwfExt.grid.ViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.KwfExt.grid',
    deleteConfirmTitle: trlKwf('Delete'),
    deleteConfirmText: trlKwf('Do you really wish to remove this entry?'),
    dropCascade: true,
    exportProgressTitle: trlKwf('Export'),
    exportProgressMsg: trlKwf('Exporting rows...'),
    excelExportWorksheetName: trlKwf('Worksheet'),
    postBackUrl: '/kwf/media/post-back/json-upload',
    init: function(view) {
        var addButton = view.lookupReference('addButton');
        if (addButton) addButton.on('click', this.onAdd, this);

        var saveButton = view.lookupReference('saveButton');
        if (saveButton) saveButton.on('click', this.onSave, this);

        var deleteButton = view.lookupReference('deleteButton');
        if (deleteButton) {
            view.on('selectionchange', function(model, rows) {
                if (rows[0]) {
                    if (deleteButton) deleteButton.enable();
                } else {
                    if (deleteButton) deleteButton.disable();
                }
            }, this);
            deleteButton.on('click', this.onDelete, this);
        }

        var exportXlsButton = view.lookupReference('exportXlsButton');
        if (exportXlsButton) exportXlsButton.on('click', this.onXlsExport, this);

        var exportCsvButton = view.lookupReference('exportCsvButton');
        if (exportCsvButton) exportCsvButton.on('click', this.onCsvExport, this);

        view.query('> toolbar[dock=top] combobox[showClearTrigger=true]').each(function(combobox) {
            combobox.setTriggers(Ext.apply(combobox.getTriggers(), {
                clearTrigger: {
                    cls: 'x-form-clear-trigger',
                    handler: 'onClearClick',
                    scope: this
                }
            }));
        }, this);

        Ext.each(view.query('> toolbar[dock=top] field'), function(field) {
            var eventName = 'change';
            if (Ext.form.field.ComboBox && field instanceof Ext.form.field.ComboBox && field.editable === true && field.forceSelection === true) {
                eventName = 'select';
            }

            field.on(eventName, function() {
                var filterId = 'filter-'+field.getName();
                var v = field.getValue();
                var filter = this.getView().getStore().filters ? this.getView().getStore().filters.get(filterId) : false;
                if (!filter || filter.getValue() != v) {
                    this.getView().getStore().addFilter({
                        id: filterId,
                        property: field.getName(),
                        value: v
                    });
                }
            }, this, { buffer: 300 });
        }, this);

        this.callParent(arguments);
    },

    onAdd: function() {
        var newRecord = this.getSession().createRecord(this.getView().getStore().getModel().$className, {});
        this.getView().setSelection(this.getView().getStore().add(newRecord));
    },

    onDelete: function() {
        Ext.Msg.show({
            title: this.deleteConfirmTitle,
            msg: this.deleteConfirmText,
            icon: Ext.MessageBox.QUESTION,
            buttons: Ext.Msg.YESNO,
            scope: this,
            fn: function(button) {
                if (button == 'yes') {
                    Ext.each(this.getView().getSelectionModel().getSelection(), function(record) {
                        record.drop(this.dropCascade);
                    }, this);

                    var session = this.getSession();
                    var batch = session.getSaveBatch();
                    while (session && !batch) {
                        session = session.getParent();
                        batch = session.getSaveBatch();
                    }
                    if (batch) {
                        batch.start();
                    }
                }
            }
        });
    },

    onSave: function() {
        var batch = this.getViewModel().getSession().getSaveBatch();
        if (batch) {
            batch.start();
        }
    },

    onXlsExport: function()
    {
        this._exportData({
            map: function(row) {
                var excelRow = [];
                Ext.each(this.view.columns, function(col) {
                    if (!col.dataIndex) return;
                    var val = row.get(col.dataIndex);
                    if (col.exportRenderer) {
                        val = Ext.util.Format.stripTags(col.exportRenderer(val, col, row));
                    } else if (col.renderer) {
                        val = Ext.util.Format.stripTags(col.renderer(val, col, row));
                    }
                    if (!val) val = '';
                    excelRow.push(val);
                }, this);
                return excelRow;
            },
            reduce: function(data, outputType){
                var workbook = ExcelBuilder.createWorkbook();
                var worksheet = workbook.createWorksheet({name: this.excelExportWorksheetName});
                workbook.addWorksheet(worksheet);

                var columnNames = [];
                Ext.each(this.view.columns, function(col) {
                    if (!col.dataIndex) return;
                    var columnName = col.text;
                    if (col.exportText) {
                        columnName = col.exportText;
                    }
                    columnNames.push(columnName);
                }, this);
                data.unshift(columnNames);

                worksheet.setData(data);

                return ExcelBuilder.createFile(workbook, {type: outputType});
            },
            filename: 'export.xlsx',
            mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            uploadType: 'base64'
        });
    },

    onCsvExport: function()
    {
        this._exportData({
            map: function(row) {
                var sep = '';
                var csvRow = '';
                Ext.each(this.view.columns, function(col) {
                    if (!col.dataIndex) return;
                    var val = row.get(col.dataIndex);
                    if (col.renderer) {
                        val = Ext.util.Format.stripTags(col.renderer(val, col, row));
                    }
                    if (!val) val = '';
                    csvRow += sep;
                    csvRow += String(val).replace('\\', '\\\\').replace(';', '\;').replace('\n', '\\n');
                    sep = ';';
                }, this);
                return csvRow;
            },
            reduce: function(data, outputType) {
                var csv = '';
                //header
                var sep = '';
                Ext.each(this.view.columns, function(col) {
                    if (!col.dataIndex) return;
                    var columnName = col.text;
                    if (col.exportText) {
                        columnName = col.exportText;
                    }
                    csv += sep+columnName;
                    sep = ';';
                }, this);
                csv += '\n';
                csv += data.join('\n');
                if (outputType == 'blob') {
                    return new Blob([csv]);
                } else if (outputType == 'string') {
                    return csv;
                }
            },
            filename: 'export.csv',
            mimeType: 'text/csv',
            uploadType: 'string'
        });
    },

    onClearClick: function(combo, trigger, ev) {
        combo.clearValue();
        combo.fireEvent('select', combo, null);
    },

    _exportData: function(config) {
        //create own store, so grid doesn't display loaded rows
        var store = this.getView().getStore().self.create({
            model: this.getView().getStore().model,
            filters: this.getView().getStore().filters.items,
            sorters: this.getView().getStore().sorters.items,
            pageSize: 250
        });

        var totalCount = this.getView().getStore().getTotalCount();
        var pageCount = Math.ceil(totalCount / store.pageSize);
        var page = 1;

        Ext.Msg.show({
            title: this.exportProgressTitle,
            msg: this.exportProgressMsg,
            progress: true,
            buttons: Ext.Msg.CANCEL
        });

        loadPage.call(this);
        var data = [];

        function loadPage() {
            if (!Ext.Msg.isVisible()) return; //export cancelled
            Ext.Msg.updateProgress((page - 1) / pageCount);
            store.loadPage(page, {
                filters: store.filters.items,
                sorters: store.sorters.items,
                callback: function (records) {
                    records.each(function (row) {
                        data.push(config.map.call(this, row));
                    }, this);
                    if (page < pageCount) {
                        page++;
                        loadPage.call(this);
                    } else {
                        Ext.Msg.updateProgress(1);
                        createDownload.call(this);
                    }
                },
                scope: this
            });
        }

        function createDownload() {
            var URL = window.URL || window.webkiURL;
            if (window.Modernizr && Modernizr.adownload && URL && window.Blob) {
                //modern browser
                var blob = config.reduce.call(this, data, 'blob');
                var blobURL = URL.createObjectURL(blob);
                var a = this.view.el.createChild({
                    tag: 'a',
                    href: blobURL,
                    style: 'display:none;',
                    download: config.filename
                });
                a.dom.click();
                a.remove();
                Ext.Msg.hide();
            } else {
                //IE, Safari
                Ext.Ajax.request({
                    // Needs to be added to url because else it gets lost because of using rawData for data
                    // It's also not possible to use param instead of rawData because extraParams gets attached to data
                    url: this.postBackUrl + '?' + Ext.urlEncode(Ext.Ajax.extraParams) + '&upload-type=' + config.uploadType,
                    rawData: config.reduce.call(this, data, config.uploadType),
                    headers: {
                        'Content-Type': config.mimeType,
                        'X-Download-Filename': config.filename
                    },
                    success: function (response, options) {
                        if (!Ext.Msg.isVisible()) return; //export cancelled
                        var r = Ext.decode(response.responseText);
                        var a = this.view.el.createChild({
                            tag: 'a',
                            href: r.downloadUrl,
                            style: 'display:none;'
                        });
                        a.dom.click();
                        a.remove();
                        Ext.Msg.hide();
                    },
                    failure: function () {
                        Ext.Msg.hide();
                    },
                    scope: this
                });
            }
        }
    }
});

