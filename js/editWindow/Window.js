Ext.define('KwfExt.editWindow.Window', {
    extend: 'Ext.window.Window',
    alias: 'widget.KwfExt.editWindow.window',
    requires: [
        'KwfExt.editWindow.WindowController',
        'KwfExt.editWindow.WindowModel'
    ],
    controller: 'KwfExt.editWindow.window',
    viewModel: {
        type: 'KwfExt.editWindow.window'
    },
    session: true,
    layout: 'fit',
    border: false,
    modal: true,
    closeAction: 'hide',
    constrainHeader: true,
    padding: 10,
    bbar: [
    {
//         text: 'Delete',
//         reference: 'deleteButton',
//         handler: 'onDelete'
//     },{
        text: 'Save',
        reference: 'saveButton',
        handler: 'onSave'
    },{
        text: 'Cancel',
        reference: 'cancelButton',
        handler: 'onCancel'
    }],
    /*
    openEditWindow: function(row, store)
    {
        this._loadedStore = store;
        if (row.phantom) {
            this.view.setTitle(this.addTitle);
        } else {
            this.view.setTitle(this.editTitle);
        }
        this.view.show();
        this.bindable.load(row, store);
        if (this.focusOnEditSelector) {
            this.view.down(this.focusOnEditSelector).focus();
        }
    }
    */

    defaultBindProperty: 'record',
    setRecord: function(record)
    {
        this.items.first().setRecord(record);
    },
    getRecord: function()
    {
        return this.items.first().getRecord();
    }
});
