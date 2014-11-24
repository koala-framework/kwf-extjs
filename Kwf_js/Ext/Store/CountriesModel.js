Ext.define('Kwf.Ext.Store.CountriesModel', {
    extend: 'Ext.data.Model',
    requires: ['Ext.data.UuidGenerator'],
    idProperty: 'id',
    fields: [
        {name: 'id', type: 'string'},
        {name: 'name', type: 'string'}
    ]
});
