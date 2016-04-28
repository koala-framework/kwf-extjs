Ext.define('KwfExt.overrides.DatePicker', {
    override: 'Ext.picker.Date',
    config: {
        value: null
    },
    onSelect: function() {
        if (this.updateValue) this.updateValue(this.value);
        return this.callParent(arguments);
    }
});
