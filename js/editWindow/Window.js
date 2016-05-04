Ext.define('KwfExt.editWindow.Window', {
    extend: 'Ext.window.Window',
    alias: 'widget.KwfExt.editWindow.window',
    requires: [
        'KwfExt.editWindow.WindowController',
        'KwfExt.editWindow.WindowModel',
        'Ext.button.Button'
    ],
    controller: 'KwfExt.editWindow.window',
    viewModel: {
        type: 'KwfExt.editWindow.window'
    },
    config: {
        deleteButton: false,
        saveButton: true,
        cancelButton: true
    },

    session: true,
    layout: 'fit',
    border: false,
    modal: true,
    closeAction: 'hide',
    constrainHeader: true,
    padding: 10,

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
        var bbar = this._getProperty("bbar");
        var dockedItems = this._getProperty("dockedItems");
        if (this.getDeleteButton()) {
            bbar.push(this.getDeleteButton());
            bbar.push({
                xtype: 'tbfill'
            });
        }
        if (this.getSaveButton()) {
            bbar.push(this.getSaveButton());
        }
        if (this.getCancelButton()) {
            bbar.push(this.getCancelButton());
        }
        if (bbar.length) {
            dockedItems.push({
                xtype: "toolbar",
                dock: "bottom",
                items: bbar
            })
        }

        if (dockedItems.length) {
            this.dockedItems = dockedItems;
        }

        this.callParent(arguments);
    },

    defaultBindProperty: 'record',
    setRecord: function(record)
    {
        this.items.first().setRecord(record);
    },
    getRecord: function()
    {
        return this.items.first().getRecord();
    },

    applyDeleteButton: function(b) {
        if (b && !b.isComponent) {
            b = Ext.create(Ext.apply({
                text: trlKwf('Delete'),
                handler: 'onDelete',
                xtype: 'button'
            }, b))
        }
        return b
    },

    applySaveButton: function(b) {
        if (b && !b.isComponent) {
            b = Ext.create(Ext.apply({
                text: trlKwf('Save'),
                handler: 'onSave',
                xtype: 'button'
            }, b))
        }
        return b
    },

    applyCancelButton: function(b) {
        if (b && !b.isComponent) {
            b = Ext.create(Ext.apply({
                text: trlKwf('Cancel'),
                handler: 'onCancel',
                xtype: 'button'
            }, b))
        }
        return b
    }
});
