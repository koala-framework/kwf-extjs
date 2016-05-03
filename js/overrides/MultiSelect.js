Ext.define('KwfExt.overrides.MultiSelect', {
    override: 'Ext.ux.form.MultiSelect',

    initComponent: function()
    {
        this.store = this.store || 'ext-empty-store';
        this.callParent(arguments);
    }
});
