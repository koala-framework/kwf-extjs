Ext.define('Kwf.Ext.Viewport', {
    extend: 'Ext.container.Viewport',
    requires: ['Kwf.Ext.Menu', 'Ext.layout.container.Border'],
    layout: 'border',
    menu: null,
    initComponent : function() {
        this.items[0].region = 'center';
        if (!this.menu) {
            this.menu = Ext.create('Kwf.Ext.Menu', {
                region: 'north',
                height: 35,
                border: false
            });
        }
        this.items.push(this.menu);
        this.callParent(arguments);
    }
});
