Ext.define('KwfExt.Viewport', {
    extend: 'Ext.container.Viewport',
    requires: ['KwfExt.Menu', 'Ext.layout.container.Border'],
    layout: 'border',
    menu: null,
    initComponent : function() {
        this.items[0].region = 'center';
        if (!this.menu) {
            this.menu = Ext.create('KwfExt.Menu', {
                region: 'north',
                height: 44,
                border: false
            });
        }
        this.items.push(this.menu);
        this.callParent(arguments);
    }
});
