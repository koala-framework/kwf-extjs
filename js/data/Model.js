Ext.define('KwfExt.data.Model', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.identifier.Uuid'
    ],
    idProperty: 'id',
    identifier: 'uuid',
    schema: {
        namespace: 'App.model',
        urlPrefix: '/api',
        proxy: {
            type: 'rest',
            url: '{prefix}/{entityName:uncapitalize}',

            reader: {
                type: 'json',
                rootProperty: 'data'
            },

            writer: {
                type: 'json',
                nameProperty: 'mapping',
                writeAllFields: false
            }
        }
    }
});
