// @require ModernizrADownload
// @require excel-builder

Ext.define('KwfExt.grid.PanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.KwfExt.grid.Panel',
    requires: [
        'Ext.Deferred',
        'KwfExt.session.Save'
    ],
    deleteConfirmTitle: trlKwf('Delete'),
    deleteConfirmText: trlKwf('Do you really wish to remove this entry?'),
    exportProgressTitle: trlKwf('Export'),
    exportProgressMsg: trlKwf('Exporting rows...'),
    excelExportWorksheetName: trlKwf('Worksheet'),
    postBackUrl: '/kwf/media/post-back/json-upload',

    saveChangesTitle: trlKwf('Save'),
    saveChangesMsg: trlKwf('Do you want to save the changes?'),

    saveDelete: true, //if onDelete should save batch the session or just drop the record

    control: {
        '#': {
            beforeselect: 'onBeforeSelect'
        }
    },

    init: function(view) {

        if (view.getStore()) this.onBindStore();
        Ext.Function.interceptAfter(view, "bindStore", this.onBindStore, this);

        Ext.each(view.query('> toolbar[dock=top] combobox[showClearTrigger=true]'), function(combobox) {
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

        var win = this.getView().getEditWindow();
        if (win && !win.isComponent) {
            win.parent = this.view; //set parent to inherit Session and ViewModel
            win = Ext.ComponentManager.create(win);

            this.getView().setEditWindow(win);
            win.on('hide', function() {
                var rec = win.getRecord();
                if (!rec.dropped) {
                    var store = this.getView().getStore();
                    if (store.indexOf(rec) == -1) {
                        store.add(rec);
                        this.getView().setSelection(rec);
                    }
                }
            }, this);
        }

        //reload when panel gets shown (again) in a tab panel (directly or indirectly)
        this.getView().on('render', function() {
            var parent = this.getView();
            while (parent.getRefOwner()) {
                if (parent.getRefOwner().getLayout() instanceof Ext.layout.container.Card) {
                    parent.on('show', function(panel) {
                        if (!this.getView().isHierarchicallyHidden()) {
                            var store = this.getView().getStore();
                            if (store && store.isLoaded()) store.reload();
                        }
                    }, this);
                }
                parent = parent.getRefOwner();
            }

            //when a child session is saved reload the currently selected record's data
            if (this.getView().findParentBy(function(i){return i.getSession()})) {
                Ext.each(this.getView().findParentBy(function (i) {
                    return i.getSession()
                }).query("[session]"), function (sessionView) {
                    sessionView.on('sessionsave', function () {
                        Ext.each(this.getView().getSelectionModel().getSelection(), function (record) {
                            record.reloadData();
                        }, this);
                    }, this);
                }, this);
            }
        }, this);

        this.callParent(arguments);
    },

    onBindStore: function()
    {
        var s = this.view.getStore();
        Ext.each(this.view.query('pagingtoolbar'), function(i) {
            i.bindStore(s);
        }, this);
    },

    onAdd: function() {
        if (this.getView().getEditWindow()) {
            var win = this.getView().getEditWindow();
            win.setTitle(trlKwf('Add'));
            var newRecord = win.getSession().createRecord(this.getView().getStore().getModel().$className, {});
            win.setRecord(newRecord);
            win.show();
        } else {
            var newRecord = this.getSession().createRecord(this.getView().getStore().getModel().$className, {});
            this.getView().getStore().add(newRecord);
            this.getView().ensureVisible(newRecord, { select: true});
        }
    },

    onDelete: function() {
        if (!this.saveDelete) {
            Ext.each(this.getView().getSelectionModel().getSelection(), function(record) {
                record.drop();
            }, this);
        } else {
            Ext.Msg.show({
                title: this.deleteConfirmTitle,
                msg: this.deleteConfirmText,
                icon: Ext.MessageBox.QUESTION,
                buttons: Ext.Msg.YESNO,
                scope: this,
                fn: function(button) {
                    if (button == 'yes') {
                        Ext.each(this.getView().getSelectionModel().getSelection(), function(record) {
                            record.drop();
                        }, this);

                        var sessionView = null;
                        if (this.getView().getSession()) {
                            sessionView = this.getView();
                        } else {
                            sessionView = this.getView().findParentBy(function(i){return i.getSession()});
                        }
                        var session = sessionView.getSession();
                        var batch;
                        if (session.getParent()) {
                            session.save();
                            batch = session.getParent().getSaveBatch();
                        } else {
                            batch = session.getSaveBatch();
                        }
                        batch.on('complete', function() {
                            sessionView.unmask();
                            if (!batch.hasException()) {
                                sessionView.fireEvent('sessionsave');
                            }
                        }, this);
                        sessionView.mask(trlKwf('Deleting...'));
                        batch.start();

                        session.commit(); //mark session clean
                    }
                }
            });
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
                    Ext.each(records, function (row) {
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
    },

    onBeforeSelect: function(sm, record)
    {
        var parentSessionView = null;
        if (this.getView().getSession()) {
            parentSessionView = this.getView();
        } else {
            parentSessionView = this.getView().findParentBy(function(i){return i.getSession()});
        }
        if (parentSessionView) {
            var selection = this.getView().getSelection();
            var childSessionViews = parentSessionView.query("[session]");
            var isDirty = false;
            isDirty = childSessionViews.length && selection.length && selection[0].phantom;
            Ext.each(childSessionViews, function(i) {
                if (i.getSession().getChangesForParent()) {
                    isDirty = true;
                }
            }, this);
            /*
            Ext.each(parentSessionView.query("[controller]"), function(i) {
                //additionally a controller can be dirty
                if (i.getController().isSaveable && i.getController().isDirty()) {
                    isDirty = true;
                }
            }, this);
            */
            if (isDirty) {
                this.askSaveChanges().then({
                    success: function() {
                        this.getView().setSelection(record);
                    },
                    failure: function() {
                    },
                    scope: this
                });
                return false;
            }
        }
    },

    askSaveChanges: function()
    {
        var deferred = new Ext.Deferred;
        Ext.Msg.show({
            title: this.saveChangesTitle,
            msg: this.saveChangesMsg,
            buttons: Ext.Msg.YESNOCANCEL,
            scope: this,
            fn: function(button) {
                if (button == 'yes') {
                    this.doSave().then(function() {
                            deferred.resolve();
                        }, function() {
                            //validation failed re-select
                            deferred.reject();
                        });
                } else if (button == 'no') {
                    //discard changes
                    var sessionView = this.getView().findParentBy(function(i){return i.getSession()});
                    Ext.each(sessionView.query("[session]"), function(childView) {
                        if (childView.getSession().getChanges()) {
                            var session = childView.getSession();
                            var newSession;
                            if (session.getParent()) {
                                newSession = session.getParent().spawn();
                            } else {
                                newSession = new Ext.data.Session({
                                    schema: session.getSchema()
                                });
                            }
                            childView.setSession(newSession);
                            childView.getViewModel().setSession(newSession); //TODO might not have viewmodel? children might have viewmodel?
                            Ext.each(childView.query("[viewModel]"), function(i) {
                                if (i.getViewModel().getSession() == session) {
                                    i.getViewModel().setSession(newSession);
                                }
                            }, this);

                            session.destroy();
                        }
                    }, this);
                    var selection = this.getView().getSelection();
                    if (selection.length && selection[0].phantom) {
                        this.getView().suspendEvents();
                        this.getView().setSelection([]);
                        this.getView().resumeEvents();
                        selection[0].drop();
                    }
                    deferred.resolve();
                } else if (button == 'cancel') {
                    deferred.reject();
                }
            }
        });
        return deferred.promise;
    },

    doSave: function()
    {
        var sessionView = null;
        //TODO there can be multiple sessions
        Ext.each(this.getView().findParentBy(function(i){return i.getSession()}).query("[session]"), function(i) {
            sessionView = i;
        });

        return KwfExt.session.Save.saveSession(sessionView);
    },

    onEditClick: function(button)
    {
        if (!this.getView().getEditWindow()) {
            throw new Error('No EditWindow set');
        }
        var record = button.getWidgetRecord();
        var win = this.getView().getEditWindow();
        win.setTitle(trlKwf('Edit'));
        win.setRecord(record);
        win.show();
    }
});

