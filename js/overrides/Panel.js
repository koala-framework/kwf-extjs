Ext.define('KwfExt.overrides.Panel', {
    override: 'Ext.panel.Panel',
    constructor: function() {
        this.callParent(arguments);
        if (this.getLayout() && this.getLayout().type == 'border') {
            this.stateful = true;
        }
    }
});
