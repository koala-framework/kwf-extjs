Ext4.define('Kwf.Ext4.Viewport', {
    extend: 'Ext.container.Viewport',
    requires: ['Kwf.Ext4.Menu', 'Ext.layout.container.Border'],
    layout: 'border',
    menu: null,
    initComponent : function() {
        this.items[0].region = 'center';
        if (!this.menu) {
            this.menu = Ext4.create('Kwf.Ext4.Menu', {
                region: 'north',
                height: 35,
                border: false
            });
        }
        this.items.push(this.menu);
        this.callParent(arguments);
    }
});
