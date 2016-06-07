Ext.define('KwfExt.data.AppSchema', {
    extend: 'Ext.data.schema.Schema',
    alias: 'schema.app',

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
});
