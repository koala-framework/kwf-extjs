Ext.define('KwfExt.grid.Panel', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.KwfExt.grid.Panel',
    requires: [
        'KwfExt.grid.PanelController',
        'KwfExt.grid.PanelModel',
        'Ext.toolbar.Paging',
        'Ext.button.Button',
        'Ext.form.field.Text',
        'Ext.toolbar.TextItem',
        'KwfExt.session.SaveButton',
        'Ext.grid.column.Widget',
        'KwfExt.mixin.Bindable' //fixes issues for storing selection in viewmodel
    ],
    controller: 'KwfExt.grid.Panel',
    viewModel: {
        type: 'KwfExt.grid.Panel'
    },
    stateful: true,
    config: {
        editWindow: null,
        pagingToolbar: false,
        saveButton: false,
        addButton: false,
        deleteButton: false,
        exportXlsButton: false,
        filters: false,
        queryFilter: false,
        editWidgetColumn: false
    },
    viewConfig: {
        preserveScrollOnRefresh: true
    },
    publishes: ['selection'],

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

        var tbar = this._getProperty("tbar");
        if (this.getSaveButton()) {
            tbar.push(this.getSaveButton());
        }
        if (this.getAddButton()) {
            tbar.push(this.getAddButton());
        }
        if (this.getDeleteButton()) {
            tbar.push(this.getDeleteButton());
        }
        if (this.getExportXlsButton()) {
            tbar.push(this.getExportXlsButton());
        }
        if (this.getFilters()) {
            this.getFilters().forEach(function(i) {
                tbar.push(i);
            }, this);
        }
        if (this.getQueryFilter()) {
            tbar.push(this.getQueryFilter());
        }
        if (tbar.length) {
            dockedItems.push({
                xtype: "toolbar",
                dock: "top",
                items: tbar
            })
        }

        if (dockedItems.length) {
            this.dockedItems = dockedItems;
        }

        var columns = this._getProperty("columns");
        if (this.getEditWidgetColumn()) {
            columns.push(this.getEditWidgetColumn());
        }
        this.columns = columns;

        this.callParent(arguments);
    },

    applyPagingToolbar: function(b) {
        if (b && !b.isComponent) {
            b = Ext.create(Ext.apply({
                xtype: "pagingtoolbar",
                dock: "bottom",
                displayInfo: true
            }, b));
        }
        return b
    },

    applySaveButton: function(b) {
        if (b && !b.isComponent) {
            b = Ext.create(Ext.apply({
                xtype: 'KwfExt.session.saveButton'
            }, b));
        }
        return b
    },
    applyAddButton: function(b) {
        if (b && !b.isComponent) {
            b = Ext.create(Ext.apply({
                xtype: 'button',
                text: trlKwf('Add'),
                glyph: 'xf067@FontAwesome',
                handler: 'onAdd'
            }, b));
        }
        return b
    },
    applyDeleteButton: function(b) {
        if (b && !b.isComponent) {
            b = Ext.create(Ext.apply({
                xtype: 'button',
                text: trlKwf('Delete'),
                glyph: 'xf1f8@FontAwesome',
                handler: 'onDelete',
                disabled: true,
                bind: {
                    disabled: '{!selection}'
                }
            }, b));
        }
        return b
    },
    applyExportXlsButton: function(b) {
        if (b && !b.isComponent) {
            b = Ext.create(Ext.apply({
                xtype: 'button',
                text: trlKwf('Export XLS'),
                handler: 'onXlsExport',
                glyph: 'xf1c3@FontAwesome'
            }, b));
        }
        return b
    },
    applyQueryFilter: function(b) {
        if (b && !b.isComponent) {
            b = Ext.create(Ext.apply({
                xtype: 'textfield',
                flex: true,
                emptyText: trlKwf('Filter'),
                name: 'query'
            }, b));
        }
        return b
    },
    applyEditWidgetColumn: function(b) {
        if (b && !b.isComponent) {
            b = Ext.create(Ext.apply({
                xtype: 'widgetcolumn',
                width: 50,
                widget: {
                    xtype: 'button',
                    tooltip: trlKwf('Edit'),
                    glyph: 'xf040@FontAwesome',
                    handler: 'onEditClick'
                }
            }, b));
        }
        return b
    }
});
