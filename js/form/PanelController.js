Ext.define('KwfExt.form.PanelController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.KwfExt.form.Panel',
    saveValidateErrorTitle: trlKwf('Save'),
    saveValidateErrorMsg: trlKwf("Can't save, please fill all red underlined fields correctly."),
    savingMaskText: trlKwf('Saving...'),
    validatingMaskText: trlKwf('Validating...'),

    requires: [
        'KwfExt.controller.Saveable',
        'Ext.Promise'
    ],
/*
    init: function(view) {
        var saveButton = view.lookupReference('saveButton');
        if (saveButton) saveButton.on('click', this.onSave, this);
        this.callParent(arguments);
    },

    load: function(row, store) {
        Ext.each(this.getView().query('multiselectfield'), function(i) {
            if (i.store && !i.store.lastOptions) {
                i.store.load();
            }
        }, this);
        Ext.each(this.getView().query('combobox'), function(i) {
            if (i.forceSelection && i.editable && row.get(i.name)) {
                if (!i.store.lastOptions) {
                    i.store.load({
                        callback: function() {
                            i.fireEvent('select', i, i.store.getById(row.get(i.name)), row.get(i.name));
                        },
                        scope: this
                    });
                } else {
                    i.fireEvent('select', i, i.store.getById(row.get(i.name)), row.get(i.name));
                }
            }
        }, this);

        this.view.loadRecord(row);
    },

    onSave: function() {
        this.getView().el.mask(this.savingMaskText);
        this.allowSave().then({
            success: function() {
                var session = this.getSession();
                var batch = session.getSaveBatch();
                while (session && !batch) {
                    session = session.getParent();
                    if (session) batch = session.getSaveBatch();
                }
                if (batch) {
                    batch.on('complete', function(batch, operation) {
                        this.getView().el.unmask();
                        this.fireViewEvent('savesuccess');
                        this.fireEvent('savesuccess');
                    }, this);
                    batch.start();
                } else {
                    var record = this.getView().getRecord();
                    if (record) {
                        record.save({
                            success: function() {
                                this.getView().el.unmask();
                                this.fireViewEvent('savesuccess');
                                this.fireEvent('savesuccess');
                            },
                            scope: this
                        })
                    }
                }
            },
            failure: function () {
                this.getView().el.unmask();
            },
            scope: this
        });
    },

    isValid: function() {
        return this.getView().isValid();
    },

    allowSave: function()
    {
        var isValid = this.isValid();

        if (isValid instanceof Ext.promise.Promise) {
            var deferred = new Ext.promise.Deferred();
            this.getView().el.mask(this.validatingMaskText);
            isValid.then({
                success: function() {
                    this.getView().el.unmask();
                    deferred.resolve();
                },
                failure: function(reason) {
                    this.getView().el.unmask();
                    var msg = this.saveValidateErrorMsg;
                    if (reason && reason.msg) {
                        msg = reason.msg;
                    }
                    Ext.Msg.alert(this.saveValidateErrorTitle, msg);
                    deferred.reject();
                },
                scope: this
            });
            return deferred.promise;
        } else {
            if (!isValid) {
                Ext.Msg.alert(this.saveValidateErrorTitle, this.saveValidateErrorMsg);
                return Ext.Deferred.rejected();
            }
            return Ext.Deferred.resolved();
        }
    },
*/


    saveValidateErrorTitle: 'Save',
    saveValidateErrorMsg: "Can't save, please fill all marked fields correctly.",

    mixins: {
        saveable: 'KwfExt.controller.Saveable'
    },

    isValid: function()
    {
        return this.getView().isValid();
    },

    isDirty: function()
    {
        //form syncs to session, so it can be considerd as not dirty
        return false;
    },

    allowSave: function()
    {
        if (!this.isValid()) {
            Ext.Msg.alert(this.saveValidateErrorTitle, this.saveValidateErrorMsg);
            return Ext.Promise.reject();
        }
        return this.mixins.saveable.allowSave.call(this);
    }
});

