Ext.define('KwfExt.controller.Saveable', {
    mixinId: 'kwfext.saveable',
    requires: [
        'Ext.Promise'
    ],
    isSaveable: true,
    allowSave: function() {
        return Ext.Promise.resolve();
    },
    allowDelete: function() {
        return Ext.Promise.resolve();
    },
    isDirty: function() {
        return false;
    }
});
