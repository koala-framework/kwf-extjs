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
            return Ext.Promise.reject({
                validationMessage: this.saveValidateErrorMsg
            });
        }
        return this.mixins.saveable.allowSave.call(this);
    },

    initViewModel: function()
    {
        this.callParent(arguments);

        //when record changes clear invalid, required to remove initial validation when new record is laoded
        //this can't be done in KwfExt.form.Panel::setRecord as the bind values are applied async
        this.getViewModel().bind('{record}', function(r) {
            this.view.getForm().clearInvalid();
        }, this);
    }
});

