Ext.define('Kwf.Ext.Store.Countries', {
    extend: 'Ext.data.Store',
    requires: [ 'Kwf.Ext.Store.CountriesModel', 'Kwf.CountriesData' ],
    model: 'Kwf.Ext.Store.CountriesModel',
    proxy: null,
    sorters: [{
         property: 'name',
         direction: 'ASC'
    }]
}).create({
    storeId: 'countries',
    data: Kwf.CountriesData //set in Kwf_Assets_Dependency_Dynamic_CountriesData
});
