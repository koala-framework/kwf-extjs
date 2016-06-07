Ext.define('KwfExt.data.Model', {
    extend: 'Ext.data.Model',
    requires: [
        'Ext.data.identifier.Uuid',
        'KwfExt.data.AppSchema'
    ],
    idProperty: 'id',
    identifier: 'uuid',
    schema: 'app'
});
