Ext.define('KwfExt.grid.Panel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.KwfExt.grid.Panel',
    requires: [
        'KwfExt.grid.PanelController',
        'KwfExt.grid.PanelModel',
        'Ext.toolbar.Paging',
        'KwfExt.mixin.Bindable' //fixes issues for storing selection in viewmodel
    ],
    controller: 'KwfExt.grid.Panel',
    viewModel: {
        type: 'KwfExt.grid.Panel'
    },
    stateful: true,
    config: {
        editWindow: null,
        pagingToolbar: false
    },
    viewConfig: {
        preserveScrollOnRefresh: true
    },
    publishes: ['selection', 'store'],

    _getProperty: function(c)
    {
        var d = this[c];
        if (d) {
            d = Ext.clone(d)
        } else {
            d = []
        }
        return d
    },

    initComponent: function()
    {
        var dockedItems = this._getProperty("dockedItems");
        if (this.getPagingToolbar()) {
            dockedItems.push(this.getPagingToolbar());
        }
        if (dockedItems.length) {
            this.dockedItems = dockedItems;
        }

        this.callParent(arguments);
    },

    applyPagingToolbar: function(b) {
        if (b && !b.isComponent) {
            b = Ext.create(Ext.apply({
                xtype: "pagingtoolbar",
                dock: "bottom",
                displayInfo: true
            }, b))
        }
        return b
    }
});
