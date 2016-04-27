Ext.define('KwfExt.overrides.DatePicker', {
    override: 'Ext.picker.Date',
    config: {
        value: null
    },
    onSelect: function() {
        this.callParent(arguments);
        this.updateValue(this.value);
    }
});
