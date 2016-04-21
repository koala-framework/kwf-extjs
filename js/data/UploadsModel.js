Ext.define('KwfExt.data.UploadsModel', {
    extend: 'KwfExt.data.Model',
    fields: [
        {name: 'id', type: 'string'},
        {name: 'filename', type: 'string'},
        {name: 'extension', type: 'string'},
        {name: 'mime_type', type: 'string'},
        {name: 'file_size', type: 'int'},
        {name: 'hash_key', type: 'string'},
        {name: 'image', type: 'bool'},
        {name: 'image_width', type: 'int'},
        {name: 'image_height', type: 'int'}
    ],
    proxy: {
        type: 'rest',
        url: '/api/uploads',

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
