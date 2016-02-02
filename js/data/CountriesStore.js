Ext.define('KwfExt.data.CountriesStore', {
    extend: 'Ext.data.Store',
    requires: [
        'KwfExt.data.CountriesModel',
        'Kwf.CountriesData'
    ],
    model: 'KwfExt.data.CountriesModel',
    proxy: null,
    sorters: [{
        property: 'name',
        direction: 'ASC'
    }]
}).create({
    storeId: 'countries',
    data: Kwf.CountriesData //set in Kwf_Assets_Dependency_Dynamic_CountriesData
});
