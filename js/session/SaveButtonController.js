Ext.define('KwfExt.session.SaveButtonController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.KwfExt.session.saveButton',
    require: [
        'KwfExt.session.Save'
    ],
    control: {
        '#': {
            click: 'onClick'
        }
    },

    onClick: function()
    {
        var parentSessionView = this.getView().findParentBy(function(i) { return i.getSession(); });
        KwfExt.session.Save.saveSession(parentSessionView);
    }
});
