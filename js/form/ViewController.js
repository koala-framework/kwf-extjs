Ext.define('KwfExt.form.ViewController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.KwfExt.form',
    saveValidateErrorTitle: trlKwf('Save'),
    saveValidateErrorMsg: trlKwf("Can't save, please fill all red underlined fields correctly."),
    savingMaskText: trlKwf('Saving...'),
    validatingMaskText: trlKwf('Validating...'),

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
                i.fireEvent('select', i, i.store.getById(row.get(i.name)));
            }
        }, this);

        this.view.loadRecord(row);
    },

    onSave: function() {
        this.getView().el.mask(this.savingMaskText);
        this.allowSave().then({
            success: function() {
                var batch = this.getSession().getParent().getSaveBatch();
                if (batch) {
                    batch.on('complete', function(batch, operation) {
                        this.fireViewEvent('savesuccess');
                        this.fireEvent('savesuccess');
                        this.getView().el.unmask();
                    }, this);
                    batch.start();
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
    }
});

