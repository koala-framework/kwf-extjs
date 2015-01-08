Ext4.define('Kwf.Ext4.model.Uploads', {
    extend: 'Ext.data.Model',
    requires: ['Ext.data.UuidGenerator'],
    idProperty: 'id',
    idgen: 'uuid',
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
            root: 'data'
        },

        writer: {
            type: 'json',
            nameProperty: 'mapping',
            writeAllFields: false
        }
    }
});
