Ext.define('KwfExt.grid.Panel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.KwfExt.grid.Panel',
    requires: [
        'KwfExt.grid.PanelController',
        'KwfExt.grid.PanelModel',
        'KwfExt.mixin.Bindable' //fixes issues for storing selection in viewmodel
    ],
    controller: 'KwfExt.grid.Panel',
    viewModel: {
        type: 'KwfExt.grid.Panel'
    },
    stateful: true,
    config: {
        editWindow: null
    },
    viewConfig: {
        preserveScrollOnRefresh: true
    },
    publishes: ['selection', 'store']
});
